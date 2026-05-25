import { useState, useEffect } from "react"
import RoomPanel from "./Components/RoomPanel"
import DoctorsPage from "./Components/DoctorsPage"
import DischargeHistory from "./Components/DischargeHistory"
import "./App.css"

function App() {
    const [activeRoom, setActiveRoom] = useState("emergency")
    const [activePage, setActivePage] = useState("wards")
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        if (isDark) {
            document.body.classList.add("dark")
        } else {
            document.body.classList.remove("dark")
        }
    }, [isDark])

    const getTitle = () => {
        if (activePage === "doctors") return "Doctors"
        if (activePage === "discharge") return "Discharge History"
        if (activeRoom === "emergency") return "Emergency Room"
        if (activeRoom === "general2") return "General Room 2"
        return "General Ward"
    }

    const getSubtitle = () => {
        if (activePage === "doctors") return "Manage doctors and assignments"
        if (activePage === "discharge") return "View all discharged patients and billing"
        if (activeRoom === "emergency") return "Room E-101 · Critical care unit"
        if (activeRoom === "general2") return "Room G-102 · General admission"
        return "Room G-201 · General admission"
    }

    return (
        <div className="app">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <div className="logo-icon">+</div>
                    <span className="logo-text">MediCore</span>
                </div>

                <nav className="sidebar-nav">
                    <p className="nav-label">Wards</p>
                    <button
                        className={`nav-item ${activePage === "wards" && activeRoom === "emergency" ? "active" : ""}`}
                        onClick={() => { setActivePage("wards"); setActiveRoom("emergency") }}
                    >
                        <span className="nav-dot red" />
                        Emergency Room
                        <span className="nav-tag">E-101</span>
                    </button>
                    <button
                        className={`nav-item ${activePage === "wards" && activeRoom === "general" ? "active" : ""}`}
                        onClick={() => { setActivePage("wards"); setActiveRoom("general") }}
                    >
                        <span className="nav-dot blue" />
                        General Ward
                        <span className="nav-tag">G-201</span>
                    </button>
                    <button
                        className={`nav-item ${activePage === "wards" && activeRoom === "general2" ? "active" : ""}`}
                        onClick={() => { setActivePage("wards"); setActiveRoom("general2") }}
                    >
                        <span className="nav-dot blue" />
                        General Room 2
                        <span className="nav-tag">G-102</span>
                    </button>

                    <p className="nav-label" style={{ marginTop: 24 }}>Pages</p>
                    <button
                        className={`nav-item ${activePage === "doctors" ? "active" : ""}`}
                        onClick={() => setActivePage("doctors")}
                    >
                        <span className="nav-dot" style={{ background: "var(--green)", boxShadow: "0 0 6px var(--green)" }} />
                        Doctors
                    </button>
                    <button
                        className={`nav-item ${activePage === "discharge" ? "active" : ""}`}
                        onClick={() => setActivePage("discharge")}
                    >
                        <span className="nav-dot" style={{ background: "var(--amber)", boxShadow: "0 0 6px var(--amber)" }} />
                        Discharge History
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <div className="status-dot" />
                    <span>System online</span>
                </div>
            </aside>

            <div className="content">
                <header className="topbar">
                    <div>
                        <h1 className="topbar-title">{getTitle()}</h1>
                        <p className="topbar-sub">{getSubtitle()}</p>
                    </div>
                    <div className="topbar-badge" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <button 
                            className="btn btn-ghost" 
                            style={{ padding: "6px 12px", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }} 
                            onClick={() => setIsDark(!isDark)}
                        >
                            {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
                        </button>
                        {activePage === "wards" && activeRoom === "emergency"
                            ? <span className="badge red">High Priority</span>
                            : activePage === "wards"
                            ? <span className="badge blue">Standard</span>
                            : null}
                    </div>
                </header>

                <main className="main">
                    {activePage === "wards" && <RoomPanel roomType={activeRoom} />}
                    {activePage === "doctors" && <DoctorsPage />}
                    {activePage === "discharge" && <DischargeHistory />}
                </main>
            </div>
        </div>
    )
}

export default App