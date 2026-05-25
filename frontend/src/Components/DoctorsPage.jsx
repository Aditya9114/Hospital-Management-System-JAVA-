import { useState, useEffect } from "react"
import { Search, UserPlus, Stethoscope, Mail, Phone, Trash2, X } from "lucide-react"

const API = `${import.meta.env.VITE_API_URL}/api/doctors`

function SkeletonTableRows() {
    return (
        <>
            {[1, 2, 3, 4].map(i => (
                <tr key={i}>
                    <td><div className="skeleton skeleton-text" style={{ width: '80%' }}></div></td>
                    <td><div className="skeleton skeleton-text" style={{ width: '60%' }}></div></td>
                    <td><div className="skeleton skeleton-text" style={{ width: '90%' }}></div></td>
                    <td><div className="skeleton skeleton-text" style={{ width: '70%' }}></div></td>
                    <td><div className="skeleton skeleton-text" style={{ width: '40px', borderRadius: '50%' }}></div></td>
                </tr>
            ))}
        </>
    )
}

function AddDoctorModal({ isOpen, onClose, fetchDoctors }) {
    const [form, setForm] = useState({ name: "", specialization: "", contactInfo: "", email: "" })
    const [msg, setMsg] = useState("")

    if (!isOpen) return null

    const handleAdd = async () => {
        if (!form.name || !form.specialization) {
            setMsg("Name and specialization are required")
            return
        }
        try {
            const res = await fetch(API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            })
            if (res.ok) {
                setForm({ name: "", specialization: "", contactInfo: "", email: "" })
                setMsg("")
                fetchDoctors()
                onClose()
            } else {
                const data = await res.json()
                setMsg(data.message || "Error adding doctor")
            }
        } catch (e) {
            setMsg("Failed to add doctor")
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Add New Doctor</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                {msg && <p className="msg warn" style={{ marginBottom: '1rem' }}>{msg}</p>}
                
                <div className="form-grid">
                    <input
                        type="text"
                        placeholder="Dr. Full Name"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Specialization (e.g. Cardiology)"
                        value={form.specialization}
                        onChange={e => setForm({ ...form, specialization: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Phone / Contact Info"
                        value={form.contactInfo}
                        onChange={e => setForm({ ...form, contactInfo: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                    <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleAdd}>
                        <UserPlus size={18} />
                        Add Doctor
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState(null)
    const [search, setSearch] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        fetchDoctors()
    }, [])

    const fetchDoctors = async () => {
        try {
            const res = await fetch(API)
            const data = await res.json()
            setDoctors(data)
        } catch (e) {
            setDoctors([])
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Remove this doctor?")) return
        try {
            await fetch(`${API}/${id}`, { method: "DELETE" })
            fetchDoctors()
        } catch (e) {
            console.error("Failed to delete")
        }
    }

    const filtered = (doctors || []).filter(d => 
        d.name.toLowerCase().includes(search.toLowerCase()) || 
        d.specialization.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="card delay-100">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <p className="card-title" style={{ marginBottom: 0 }}>
                    <Stethoscope size={16} />
                    Medical Staff Directory
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search doctors..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ paddingLeft: '2.25rem', width: '250px' }}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                        <UserPlus size={16} />
                        Add Doctor
                    </button>
                </div>
            </div>

            <div className="data-table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Doctor Name</th>
                            <th>Specialization</th>
                            <th>Email</th>
                            <th>Contact</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctors === null ? (
                            <SkeletonTableRows />
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                                    No doctors found matching your search.
                                </td>
                            </tr>
                        ) : (
                            filtered.map(d => (
                                <tr key={d.id}>
                                    <td style={{ fontWeight: 500 }}>{d.name}</td>
                                    <td>
                                        <span className="badge blue">{d.specialization}</span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Mail size={14} style={{ color: 'var(--text-muted)' }} />
                                            {d.email || "—"}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Phone size={14} style={{ color: 'var(--text-muted)' }} />
                                            {d.contactInfo || "—"}
                                        </div>
                                    </td>
                                    <td>
                                        <button 
                                            className="btn btn-ghost" 
                                            style={{ padding: '0.4rem', color: 'var(--danger)', borderColor: 'var(--danger-bg)' }}
                                            onClick={() => handleDelete(d.id)}
                                            title="Remove Doctor"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <AddDoctorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} fetchDoctors={fetchDoctors} />
        </div>
    )
}
