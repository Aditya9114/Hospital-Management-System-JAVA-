import { useState, useEffect } from "react"
import { 
    Activity, LayoutGrid, Users, FileText, Sun, Moon,
    Stethoscope, ShieldPlus
} from "lucide-react"
import RoomPanel from "./Components/RoomPanel"
import DoctorsPage from "./Components/DoctorsPage"
import DischargeHistory from "./Components/DischargeHistory"
import LoadingScreen from "./Components/LoadingScreen"
import "./App.css"

function App() {
    const [isReady, setIsReady] = useState(false)
    const [activeRoom, setActiveRoom] = useState("emergency")
    const [activePage, setActivePage] = useState("wards")
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('medicore-theme')
        return saved === 'dark'
    })

    useEffect(() => {
        if (isDark) {
            document.body.classList.add("dark")
            localStorage.setItem('medicore-theme', 'dark')
        } else {
            document.body.classList.remove("dark")
            localStorage.setItem('medicore-theme', 'light')
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

    if (!isReady) {
        return <LoadingScreen onReady={() => setIsReady(true)} />
    }

    return (
        <div className="app">
            <aside className="sidebar delay-100">
                <div className="sidebar-logo">
                    <div className="logo-icon"><ShieldPlus size={24} /></div>
                    <span className="logo-text">MediCore</span>
                </div>

                <nav className="sidebar-nav">
                    <p className="nav-label">Wards</p>
                    <button
                        className={`nav-item ${activePage === "wards" && activeRoom === "emergency" ? "active" : ""}`}
                        onClick={() => { setActivePage("wards"); setActiveRoom("emergency") }}
                    >
                        <Activity size={18} />
                        Emergency Room
                        <span className="nav-tag">E-101</span>
                    </button>
                    <button
                        className={`nav-item ${activePage === "wards" && activeRoom === "general" ? "active" : ""}`}
                        onClick={() => { setActivePage("wards"); setActiveRoom("general") }}
                    >
                        <LayoutGrid size={18} />
                        General Ward
                        <span className="nav-tag">G-201</span>
                    </button>
                    <button
                        className={`nav-item ${activePage === "wards" && activeRoom === "general2" ? "active" : ""}`}
                        onClick={() => { setActivePage("wards"); setActiveRoom("general2") }}
                    >
                        <LayoutGrid size={18} />
                        General Room 2
                        <span className="nav-tag">G-102</span>
                    </button>

                    <p className="nav-label" style={{ marginTop: '1.5rem' }}>Administration</p>
                    <button
                        className={`nav-item ${activePage === "doctors" ? "active" : ""}`}
                        onClick={() => setActivePage("doctors")}
                    >
                        <Stethoscope size={18} />
                        Doctors
                    </button>
                    <button
                        className={`nav-item ${activePage === "discharge" ? "active" : ""}`}
                        onClick={() => setActivePage("discharge")}
                    >
                        <FileText size={18} />
                        Discharge History
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <div className="status-dot" />
                    <span>System Online</span>
                </div>
            </aside>

            <div className="content">
                <header className="topbar">
                    <div>
                        <h1 className="topbar-title">{getTitle()}</h1>
                        <p className="topbar-sub">{getSubtitle()}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button 
                            className="btn btn-ghost" 
                            style={{ padding: "0.5rem", borderRadius: "50%" }} 
                            onClick={() => setIsDark(!isDark)}
                            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
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