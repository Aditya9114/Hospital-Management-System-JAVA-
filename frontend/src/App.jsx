import { useState, useEffect } from "react"
import RoomPanel from "./components/RoomPanel"
import "./App.css"

function App() {
    const [activeRoom, setActiveRoom] = useState("emergency")
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        if (isDark) {
            document.body.classList.add("dark")
        } else {
            document.body.classList.remove("dark")
        }
    }, [isDark])

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
                        className={`nav-item ${activeRoom === "emergency" ? "active" : ""}`}
                        onClick={() => setActiveRoom("emergency")}
                    >
                        <span className="nav-dot red" />
                        Emergency Room
                        <span className="nav-tag">E-101</span>
                    </button>
                    <button
                        className={`nav-item ${activeRoom === "general" ? "active" : ""}`}
                        onClick={() => setActiveRoom("general")}
                    >
                        <span className="nav-dot blue" />
                        General Ward
                        <span className="nav-tag">G-201</span>
                    </button>
                    <button
                        className={`nav-item ${activeRoom === "general2" ? "active" : ""}`}
                        onClick={() => setActiveRoom("general2")}
                    >
                        <span className="nav-dot blue" />
                        General Room 2
                        <span className="nav-tag">G-102</span>
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
                        <h1 className="topbar-title">
                            {activeRoom === "emergency" ? "Emergency Room" :
                                activeRoom === "general2"  ? "General Room 2" :
                                    "General Ward"}
                        </h1>
                        <p className="topbar-sub">
                            {activeRoom === "emergency" ? "Room E-101 · Critical care unit" :
                                activeRoom === "general2"  ? "Room G-102 · General admission" :
                                    "Room G-201 · General admission"}
                        </p>
                    </div>
                    <div className="topbar-badge" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <button 
                            className="btn btn-ghost" 
                            style={{ padding: "6px 12px", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }} 
                            onClick={() => setIsDark(!isDark)}
                        >
                            {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
                        </button>
                        {activeRoom === "emergency"
                            ? <span className="badge red">High Priority</span>
                            : <span className="badge blue">Standard</span>}
                    </div>
                </header>

                <main className="main">
                    <RoomPanel roomType={activeRoom} />
                </main>
            </div>
        </div>
    )
}

export default App