import { useState, useEffect } from "react"
import { Bed, Users, Search, Activity, UserPlus } from "lucide-react"
import AssignPatientModal from "./AssignPatientModal"

const API = `${import.meta.env.VITE_API_URL}/api/hospital`
const DOCTOR_API = `${import.meta.env.VITE_API_URL}/api/doctors`

function getInitials(name) {
    if (!name) return "?"
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
}

function SkeletonCard() {
    return (
        <div className="card">
            <div className="skeleton-title skeleton"></div>
            <div className="skeleton-text skeleton" style={{ height: '3.5rem', width: '30%' }}></div>
            <div className="skeleton-text skeleton" style={{ width: '60%' }}></div>
        </div>
    )
}

function SkeletonPatientList() {
    return (
        <div className="patient-list">
            {[1, 2, 3].map(i => (
                <div key={i} className="patient-item">
                    <div className="skeleton-avatar skeleton"></div>
                    <div style={{ flex: 1 }}>
                        <div className="skeleton-text skeleton" style={{ width: '30%', marginBottom: '0.5rem' }}></div>
                        <div className="skeleton-text skeleton" style={{ width: '50%' }}></div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default function RoomPanel({ roomType }) {
    const [bedCount, setBedCount] = useState(null)
    const [newBedCount, setNewBedCount] = useState("")
    const [patients, setPatients] = useState(null) // null = loading
    const [doctors, setDoctors] = useState([])
    const [emptyBed, setEmptyBed] = useState(null)
    const [msg, setMsg] = useState("")
    const [msgType, setMsgType] = useState("ok")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [form, setForm] = useState({ patientId: "", patientName: "", age: "", disease: "", doctorId: "" })

    useEffect(() => {
        setBedCount(null)
        setPatients(null)
        fetchBeds()
        fetchPatients()
        fetchDoctors()
        setMsg("")
        setEmptyBed(null)
    }, [roomType])

    const fetchBeds = async () => {
        try {
            const res = await fetch(`${API}/${roomType}/beds`)
            const data = await res.json()
            setBedCount(data.beds)
        } catch (e) {
            console.error(e)
            setBedCount(0)
        }
    }

    const fetchPatients = async () => {
        try {
            const res = await fetch(`${API}/${roomType}/patients`)
            const data = await res.json()
            setPatients(data)
        } catch (e) {
            console.error(e)
            setPatients([])
        }
    }

    const fetchDoctors = async () => {
        try {
            const res = await fetch(DOCTOR_API)
            const data = await res.json()
            setDoctors(data)
        } catch (e) {
            console.error(e)
        }
    }

    const showMsg = (text, type = "ok") => {
        setMsg(text)
        setMsgType(type)
        setTimeout(() => setMsg(""), 4000)
    }

    const handleEditBeds = async () => {
        if (!newBedCount) return
        try {
            const res = await fetch(`${API}/${roomType}/beds`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ beds: parseInt(newBedCount) })
            })
            const data = await res.json()
            showMsg(data.message)
            setNewBedCount("")
            fetchBeds()
        } catch (e) {
            showMsg("Failed to update beds", "warn")
        }
    }

    const handleFindEmptyBed = async () => {
        try {
            const res = await fetch(`${API}/${roomType}/empty-bed`)
            const data = await res.json()
            if (data.emptyBedIndex !== undefined) {
                setEmptyBed(`Bed ${data.emptyBedIndex} is available`)
            } else {
                setEmptyBed(data.message)
            }
        } catch (e) {
            setEmptyBed("Failed to check availability")
        }
    }

    const handleAssign = async () => {
        if (!form.patientId || !form.patientName || !form.age || !form.disease) {
            showMsg("Please fill in all fields", "warn")
            setIsModalOpen(false) // Let the message show on main screen
            return
        }
        const body = { ...form, age: parseInt(form.age) }
        if (form.doctorId) body.doctorId = parseInt(form.doctorId)
        else delete body.doctorId

        try {
            const res = await fetch(`${API}/${roomType}/assign`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })
            const data = await res.json()
            if (!res.ok) {
                showMsg(data.message || "Failed to assign", "warn")
            } else {
                showMsg(data.message)
                setForm({ patientId: "", patientName: "", age: "", disease: "", doctorId: "" })
                fetchPatients()
                fetchBeds()
            }
        } catch (e) {
            showMsg("Error assigning patient", "warn")
        }
        setIsModalOpen(false)
    }

    const handleDischarge = async (id) => {
        try {
            const res = await fetch(`${API}/${roomType}/discharge/${id}`, {
                method: "DELETE"
            })
            const data = await res.json()
            showMsg(data.message)
            fetchPatients()
            fetchBeds()
        } catch (e) {
            showMsg("Failed to discharge", "warn")
        }
    }

    const getDoctorName = (doctorId) => {
        if (!doctorId) return null
        const doc = doctors.find(d => d.id === doctorId)
        return doc ? doc.name : null
    }

    const occupied = patients ? patients.length : 0
    const available = bedCount !== null ? bedCount - occupied : null

    return (
        <div>
            {msg && <p className={`msg ${msgType === "warn" ? "warn" : ""}`}>{msg}</p>}

            <div className="grid2">
                {bedCount === null ? <SkeletonCard /> : (
                    <div className="card delay-100">
                        <p className="card-title">
                            <Bed size={16} />
                            Total Beds Capacity
                        </p>
                        <div className="stat-number">{bedCount}</div>
                        <div className="input-row">
                            <input
                                type="number"
                                placeholder="New count"
                                value={newBedCount}
                                onChange={e => setNewBedCount(e.target.value)}
                                style={{ width: '120px' }}
                            />
                            <button className="btn btn-primary" onClick={handleEditBeds}>Update</button>
                        </div>
                    </div>
                )}

                {bedCount === null || patients === null ? <SkeletonCard /> : (
                    <div className="card delay-200">
                        <p className="card-title">
                            <Activity size={16} />
                            Current Occupancy
                        </p>
                        <div className="stat-number">{occupied}<span style={{ fontSize: '1.5rem', color: "var(--text-muted)", fontWeight: 400 }}>/{bedCount}</span></div>
                        <p className="stat-label" style={{ marginBottom: '1.25rem' }}>
                            {available !== null ? `${available} bed${available !== 1 ? "s" : ""} available` : "Loading..."}
                        </p>
                        <button className="btn btn-ghost" onClick={handleFindEmptyBed}>
                            <Search size={16} style={{ marginRight: '6px' }} />
                            Check availability
                        </button>
                        {emptyBed && <p className="msg" style={{ marginTop: '10px' }}>{emptyBed}</p>}
                    </div>
                )}
            </div>

            <div className="card delay-300">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <p className="card-title" style={{ marginBottom: 0 }}>
                        <Users size={16} />
                        Patients ({patients ? patients.length : 0} Admitted)
                    </p>
                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                        <UserPlus size={16} />
                        Assign Patient
                    </button>
                </div>
                
                {patients === null ? (
                    <SkeletonPatientList />
                ) : patients.length === 0 ? (
                    <div className="empty-state">
                        <Users size={48} />
                        <p>No patients currently admitted in this ward.</p>
                    </div>
                ) : (
                    <div className="patient-list">
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
                                    style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem", marginLeft: "10px" }}
                                    onClick={() => handleDischarge(p.patientId)}
                                >
                                    Discharge
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <AssignPatientModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                form={form}
                setForm={setForm}
                doctors={doctors}
                handleAssign={handleAssign}
            />
        </div>
    )
}
