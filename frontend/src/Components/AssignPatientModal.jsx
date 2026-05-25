import { X, UserPlus } from 'lucide-react';

export default function AssignPatientModal({ isOpen, onClose, form, setForm, doctors, handleAssign }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Assign Patient</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                
                <div className="form-grid">
                    <input
                        type="text"
                        placeholder="Patient ID (e.g. P-123)"
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
                        style={{ gridColumn: '1 / -1' }}
                    >
                        <option value="">Select Doctor (optional)</option>
                        {doctors.map(d => (
                            <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>
                        ))}
                    </select>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                    <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={() => {
                        handleAssign();
                    }}>
                        <UserPlus size={18} />
                        Assign to Bed
                    </button>
                </div>
            </div>
        </div>
    );
}
