import { useState, useEffect } from "react"
import { Search, FileText, Calendar, Clock, DollarSign } from "lucide-react"

const API = `${import.meta.env.VITE_API_URL}/api/discharge`

function SkeletonTableRows() {
    return (
        <>
            {[1, 2, 3, 4, 5].map(i => (
                <tr key={i}>
                    <td><div className="skeleton skeleton-text" style={{ width: '80px' }}></div></td>
                    <td><div className="skeleton skeleton-text" style={{ width: '120px' }}></div></td>
                    <td><div className="skeleton skeleton-text" style={{ width: '100px' }}></div></td>
                    <td><div className="skeleton skeleton-text" style={{ width: '150px' }}></div></td>
                    <td><div className="skeleton skeleton-text" style={{ width: '80px' }}></div></td>
                </tr>
            ))}
        </>
    )
}

export default function DischargeHistory() {
    const [records, setRecords] = useState(null)
    const [search, setSearch] = useState("")

    useEffect(() => {
        fetchRecords()
    }, [])

    const fetchRecords = async () => {
        try {
            const res = await fetch(API)
            const data = await res.json()
            setRecords(data)
        } catch (e) {
            setRecords([])
        }
    }

    const filtered = (records || []).filter(r => 
        r.patientName.toLowerCase().includes(search.toLowerCase()) || 
        r.patientId.toLowerCase().includes(search.toLowerCase())
    )

    const formatDate = (dateStr) => {
        if (!dateStr) return "—"
        return new Date(dateStr).toLocaleDateString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric'
        })
    }

    return (
        <div className="card delay-100">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <p className="card-title" style={{ marginBottom: 0 }}>
                    <FileText size={16} />
                    Discharge & Billing Records
                </p>
                <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search patient name or ID..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ paddingLeft: '2.25rem', width: '300px' }}
                    />
                </div>
            </div>

            <div className="data-table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Patient ID</th>
                            <th>Patient Name</th>
                            <th>Date of Discharge</th>
                            <th>Diagnosis / Notes</th>
                            <th>Total Billed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records === null ? (
                            <SkeletonTableRows />
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                                    No discharge records found.
                                </td>
                            </tr>
                        ) : (
                            filtered.map(r => (
                                <tr key={r.id}>
                                    <td>
                                        <span className="patient-id">{r.patientId}</span>
                                    </td>
                                    <td style={{ fontWeight: 500 }}>{r.patientName}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                                            {formatDate(r.dischargeDate)}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge red" style={{ textTransform: 'none' }}>
                                            {r.diagnosis || "—"}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600, color: 'var(--success)' }}>
                                            <DollarSign size={14} />
                                            {r.totalBill ? r.totalBill.toFixed(2) : "0.00"}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
