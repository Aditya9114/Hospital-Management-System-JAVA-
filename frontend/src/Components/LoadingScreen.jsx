import { useState, useEffect } from 'react';
import { Activity, RefreshCcw } from 'lucide-react';

export default function LoadingScreen({ onReady }) {
    const [elapsed, setElapsed] = useState(0);
    const [isTimedOut, setIsTimedOut] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    // Endpoint used as a health check to see if backend is awake
    const HEALTH_URL = `${import.meta.env.VITE_API_URL}/api/hospital/emergency/beds`;

    useEffect(() => {
        let timer;
        if (isChecking) {
            timer = setInterval(() => {
                setElapsed(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isChecking]);

    useEffect(() => {
        let pollTimer;
        
        const checkBackend = async () => {
            try {
                const res = await fetch(HEALTH_URL);
                if (res.ok) {
                    setIsChecking(false);
                    setTimeout(() => onReady(), 800); // Small delay for smooth transition
                    return true;
                }
            } catch (err) {
                // Ignore and keep polling
            }
            return false;
        };

        const startPolling = async () => {
            if (await checkBackend()) return;
            
            pollTimer = setInterval(async () => {
                const ready = await checkBackend();
                if (ready) {
                    clearInterval(pollTimer);
                }
            }, 3000);
        };

        if (isChecking) {
            startPolling();
        }

        return () => {
            if (pollTimer) clearInterval(pollTimer);
        };
    }, [isChecking, onReady, HEALTH_URL]);

    useEffect(() => {
        if (elapsed >= 60) {
            setIsTimedOut(true);
        }
    }, [elapsed]);

    const handleRetry = () => {
        setElapsed(0);
        setIsTimedOut(false);
        setIsChecking(true);
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', 
            alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-page)', 
            color: 'var(--text-main)', zIndex: 9999, padding: '2rem', textAlign: 'center'
        }}>
            <div style={{
                width: '80px', height: '80px', borderRadius: '50%', 
                backgroundColor: 'var(--primary-bg)', display: 'flex', 
                alignItems: 'center', justifyContent: 'center', marginBottom: '2rem',
                animation: 'pulse 2s infinite cubic-bezier(0.4, 0, 0.6, 1)'
            }}>
                <Activity size={40} color="var(--primary)" />
            </div>

            <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>
                Waking up the server
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '400px', lineHeight: '1.5' }}>
                Since this app uses a free-tier hosting service, the backend might take up to 60 seconds to wake up from a cold start.
            </p>

            <div style={{ 
                width: '100%', maxWidth: '300px', height: '6px', 
                backgroundColor: 'var(--bg-card)', borderRadius: '4px', overflow: 'hidden',
                marginBottom: '1rem', border: '1px solid var(--border-color)'
            }}>
                <div style={{
                    width: '30%', height: '100%', backgroundColor: 'var(--primary)',
                    borderRadius: '4px', animation: 'shimmer 1.5s infinite linear',
                    background: 'linear-gradient(90deg, var(--primary) 0%, var(--accent) 50%, var(--primary) 100%)',
                    backgroundSize: '200% 100%'
                }} />
            </div>

            <div style={{ fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Elapsed: {elapsed}s
            </div>

            {isTimedOut && (
                <div style={{ marginTop: '2rem', animation: 'fadeIn 0.3s ease-out' }}>
                    <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>
                        It's taking longer than expected. The server might be down.
                    </p>
                    <button onClick={handleRetry} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <RefreshCcw size={16} />
                        Retry Connection
                    </button>
                </div>
            )}
        </div>
    );
}
