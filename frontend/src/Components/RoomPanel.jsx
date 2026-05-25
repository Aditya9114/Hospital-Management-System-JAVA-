import { useState, useEffect } from "react"

const API = `${import.meta.env.VITE_API_URL}/api/hospital`
const DOCTOR_API = `${import.meta.env.VITE_API_URL}/api/doctors`

function getInitials(name) {
    if (!name) return "?"
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
}

export default function RoomPanel({ roomType }) {
    const [bedCount, setBedCount] = useState(null)
    const [newBedCount, setNewBedCount] = useState("")
    const [patients, setPatients] = useState([])
    const [doctors, setDoctors] = useState([])
    const [emptyBed, setEmptyBed] = useState(null)
    const [msg, setMsg] = useState("")
    const [msgType, setMsgType] = useState("ok")
    const [form, setForm] = useState({ patientId: "", patientName: "", age: "", disease: "", doctorId: "" })

    useEffect(() => {
        fetchBeds()
        fetchPatients()
        fetchDoctors()
        setMsg("")
        setEmptyBed(null)
    }, [roomType])

    const fetchBeds = async () => {
        const res = await fetch(`${API}/${roomType}/beds`)
        const data = await res.json()
        setBedCount(data.beds)
    }

    const fetchPatients = async () => {
        const res = await fetch(`${API}/${roomType}/patients`)
        const data = await res.json()
        setPatients(data)
    }

    const fetchDoctors = async () => {
        const res = await fetch(DOCTOR_API)
        const data = await res.json()
        setDoctors(data)
    }

    const showMsg = (text, type = "ok") => {
        setMsg(text)
        setMsgType(type)
        setTimeout(() => setMsg(""), 4000)
    }

    const handleEditBeds = async () => {
        if (!newBedCount) return
        const res = await fetch(`${API}/${roomType}/beds`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ beds: parseInt(newBedCount) })
        })
        const data = await res.json()
        showMsg(data.message)
        setNewBedCount("")
        fetchBeds()
    }

    const handleFindEmptyBed = async () => {
        const res = await fetch(`${API}/${roomType}/empty-bed`)
        const data = await res.json()
        if (data.emptyBedIndex !== undefined) {
            setEmptyBed(`Bed ${data.emptyBedIndex} is available`)
        } else {
            setEmptyBed(data.message)
        }
    }

    const handleAssign = async () => {
        if (!form.patientId || !form.patientName || !form.age || !form.disease) {
            showMsg("Please fill in all fields", "warn")
            return
        }
        const body = { ...form, age: parseInt(form.age) }
        if (form.doctorId) body.doctorId = parseInt(form.doctorId)
        else delete body.doctorId
        const res = await fetch(`${API}/${roomType}/assign`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        })
        const data = await res.json()
        showMsg(data.message)
        setForm({ patientId: "", patientName: "", age: "", disease: "", doctorId: "" })
        fetchPatients()
        fetchBeds()
    }

    const handleDischarge = async (id) => {
        const res = await fetch(`${API}/${roomType}/discharge/${id}`, {
            method: "DELETE"
        })
        const data = await res.json()
        showMsg(data.message)
        fetchPatients()
        fetchBeds()
    }

    const getDoctorName = (doctorId) => {
        if (!doctorId) return null
        const doc = doctors.find(d => d.id === doctorId)
        return doc ? doc.name : null
    }

    const occupied = patients.length
    const available = bedCount !== null ? bedCount - occupied : null

    return (
        <div>
            {/* Stats row */}
            <div className="grid2">
                <div className="card">
                    <p className="card-title">Total Beds</p>
                    <div className="stat-number">{bedCount ?? "—"}</div>
                    <div className="input-row">
                        <input
                            type="number"
                            placeholder="New count"
                            value={newBedCount}
                            onChange={e => setNewBedCount(e.target.value)}
                            style={{ width: 120 }}
                        />
                        <button className="btn btn-primary" onClick={handleEditBeds}>Update</button>
                    </div>
                    {msg && <p className={`msg ${msgType === "warn" ? "warn" : ""}`}>{msg}</p>}
                </div>

                <div className="card">
                    <p className="card-title">Occupancy</p>
                    <div className="stat-number">{occupied}<span style={{ fontSize: 20, color: "var(--text3)", fontWeight: 400 }}>/{bedCount ?? "?"}</span></div>
                    <p className="stat-label" style={{ marginBottom: 16 }}>
                        {available !== null ? `${available} bed${available !== 1 ? "s" : ""} available` : "Loading..."}
                    </p>
                    <button className="btn btn-ghost" onClick={handleFindEmptyBed}>Check availability</button>
                    {emptyBed && <p className="msg" style={{ marginTop: 10 }}>{emptyBed}</p>}
                </div>
            </div>

            {/* Assign patient */}
            <div className="card">
                <p className="card-title">Assign Patient</p>
                <div className="form-grid">
                    <input
                        type="text"
                        placeholder="Patient ID"
                        value={form.patientId}
                        onChange={e => setForm({ ...form, patientId: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={form.patientName}
                        onChange={e => setForm({ ...form, patientName: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Age"
                        value={form.age}
                        onChange={e => setForm({ ...form, age: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Diagnosis / Disease"
                        value={form.disease}
                        onChange={e => setForm({ ...form, disease: e.target.value })}
                    />
                    <select
                        value={form.doctorId}
                        onChange={e => setForm({ ...form, doctorId: e.target.value })}
                    >
                        <option value="">Select Doctor (optional)</option>
                        {doctors.map(d => (
                            <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>
                        ))}
                    </select>
                </div>
                <button className="btn btn-primary" onClick={handleAssign}>Assign to bed</button>
            </div>

            {/* Patient list */}
            <div className="card">
                <p className="card-title">Patients — {patients.length} admitted</p>
                {patients.length === 0
                    ? <div className="empty-state">No patients admitted yet</div>
                    : <div className="patient-list">
                        {patients.map((p, i) => (
                            <div className="patient-item" key={i}>
                                <div className="patient-avatar">{getInitials(p.patientName)}</div>
                                <div className="patient-info">
                                    <p className="patient-name">{p.patientName}</p>
                                    <p className="patient-meta">
                                        Age {p.age}
                                        {getDoctorName(p.doctorId) && ` · Dr. ${getDoctorName(p.doctorId)}`}
                                    </p>
                                </div>
                                <span className="disease-tag">{p.disease}</span>
                                <span className="patient-id">{p.patientId}</span>
                                <button
                                    className="btn btn-ghost"
                                    style={{ padding: "4px 8px", fontSize: "12px", marginLeft: "10px" }}
                                    onClick={() => handleDischarge(p.patientId)}
                                >
                                    Discharge
                                </button>
                            </div>
                        ))}
                    </div>
                }
            </div>
        </div>
    )
}
