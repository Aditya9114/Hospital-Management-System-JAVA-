import { useState, useEffect } from "react"

const API = `${import.meta.env.VITE_API_URL}/api/doctors`

function getInitials(name) {
    if (!name) return "?"
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
}

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState([])
    const [form, setForm] = useState({ name: "", specialization: "", phone: "" })
    const [msg, setMsg] = useState("")
    const [msgType, setMsgType] = useState("ok")

    useEffect(() => {
        fetchDoctors()
    }, [])

    const fetchDoctors = async () => {
        const res = await fetch(API)
        const data = await res.json()
        setDoctors(data)
    }

    const showMsg = (text, type = "ok") => {
        setMsg(text)
        setMsgType(type)
        setTimeout(() => setMsg(""), 4000)
    }

    const handleAdd = async () => {
        if (!form.name || !form.specialization || !form.phone) {
            showMsg("Please fill in all fields", "warn")
            return
        }
        const res = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        })
        await res.json()
        showMsg("Doctor added successfully")
        setForm({ name: "", specialization: "", phone: "" })
        fetchDoctors()
    }

    return (
        <div>
            {/* Add doctor form */}
            <div className="card">
                <p className="card-title">Add Doctor</p>
                <div className="form-grid">
                    <input
                        type="text"
                        placeholder="Doctor Name"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Specialization"
                        value={form.specialization}
                        onChange={e => setForm({ ...form, specialization: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                    />
                </div>
                <button className="btn btn-primary" onClick={handleAdd}>Add Doctor</button>
                {msg && <p className={`msg ${msgType === "warn" ? "warn" : ""}`}>{msg}</p>}
            </div>

            {/* Doctor list */}
            <div className="card">
                <p className="card-title">All Doctors — {doctors.length} registered</p>
                {doctors.length === 0
                    ? <div className="empty-state">No doctors registered yet</div>
                    : <div className="patient-list">
                        {doctors.map((d) => (
                            <div className="patient-item" key={d.id}>
                                <div className="patient-avatar" style={{ background: "var(--green-dim)", color: "var(--green)", borderColor: "rgba(62,207,142,0.2)" }}>
                                    {getInitials(d.name)}
                                </div>
                                <div className="patient-info">
                                    <p className="patient-name">{d.name}</p>
                                    <p className="patient-meta">{d.specialization}</p>
                                </div>
                                <span className="disease-tag" style={{ background: "var(--blue-dim)", color: "var(--blue)", borderColor: "rgba(77,158,255,0.15)" }}>
                                    {d.specialization}
                                </span>
                                <span className="patient-id">{d.phone}</span>
                            </div>
                        ))}
                    </div>
                }
            </div>
        </div>
    )
}
