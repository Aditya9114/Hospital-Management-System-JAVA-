import { useState, useEffect } from "react"

const API = `${import.meta.env.VITE_API_URL}/api/hospital`

export default function DischargeHistory() {
    const [records, setRecords] = useState([])
    const [search, setSearch] = useState("")

    useEffect(() => {
        fetchRecords()
    }, [])

    const fetchRecords = async () => {
        const res = await fetch(`${API}/discharge-history`)
        const data = await res.json()
        setRecords(data)
    }

    const filtered = records.filter(r =>
        r.patientName?.toLowerCase().includes(search.toLowerCase()) ||
        r.patientId?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div>
            {/* Stats */}
            <div className="grid2">
                <div className="card">
                    <p className="card-title">Total Discharges</p>
                    <div className="stat-number">{records.length}</div>
                    <p className="stat-label">patients discharged</p>
                </div>
                <div className="card">
                    <p className="card-title">Total Revenue</p>
                    <div className="stat-number">
                        ₹{records.reduce((sum, r) => sum + r.billAmount, 0).toLocaleString("en-IN")}
                    </div>
                    <p className="stat-label">from all discharges</p>
                </div>
            </div>

            {/* Search + Table */}
            <div className="card">
                <p className="card-title">Discharge Records</p>
                <div className="input-row" style={{ marginTop: 0, marginBottom: 16 }}>
                    <input
                        type="text"
                        placeholder="Search by name or ID..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: 280 }}
                    />
                </div>
                {filtered.length === 0
                    ? <div className="empty-state">No discharge records found</div>
                    : <div style={{ overflowX: "auto" }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Patient ID</th>
                                    <th>Patient Name</th>
                                    <th>Room Type</th>
                                    <th>Admitted</th>
                                    <th>Discharged</th>
                                    <th>Days</th>
                                    <th>Bill (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((r) => (
                                    <tr key={r.id}>
                                        <td><span className="patient-id">{r.patientId}</span></td>
                                        <td>{r.patientName}</td>
                                        <td>
                                            <span className={`badge ${r.roomType === "emergency" ? "red" : "blue"}`}>
                                                {r.roomType}
                                            </span>
                                        </td>
                                        <td>{r.admittedDate}</td>
                                        <td>{r.dischargedDate}</td>
                                        <td>{r.totalDays}</td>
                                        <td style={{ fontWeight: 500 }}>₹{r.billAmount.toLocaleString("en-IN")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                }
            </div>
        </div>
    )
}
