import { useState } from 'react';
import { X, Zap } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '../context/ToastContext';

const ROLES = ['Artist', 'Band', 'Venue / Event Organiser', 'Label / Manager', 'Fan'];

export default function LeadCaptureModal({ onClose, source = 'general', heading, subheading }) {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !email.includes('@')) { toast.error('Enter a valid email.'); return; }
    setLoading(true);
    try {
      await addDoc(collection(db, 'leads'), {
        email,
        role: role || 'Not specified',
        source,
        createdAt: serverTimestamp(),
      });
      setDone(true);
    } catch {
      toast.error('Something went wrong. Try again.');
    }
    setLoading(false);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 420, textAlign: 'center', padding: '2rem' }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)' }}
        >
          <X size={18} />
        </button>

        {done ? (
          <>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎵</div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>You're on the list!</h2>
            <p className="text-muted text-sm">We'll reach out soon. Welcome to The Circle.</p>
            <button className="btn btn-primary mt-3" onClick={onClose} style={{ width: '100%' }}>Done</button>
          </>
        ) : (
          <>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Zap size={20} style={{ color: 'var(--accent2)' }} />
            </div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              {heading || 'Join The Circle'}
            </h2>
            <p className="text-muted text-sm" style={{ marginBottom: '1.5rem' }}>
              {subheading || 'Drop your email and we\'ll set you up with early access.'}
            </p>

            <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>I am a… <span className="text-muted text-xs">(optional)</span></label>
                <select value={role} onChange={e => setRole(e.target.value)}>
                  <option value="">Select role</option>
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.5rem' }}
                disabled={loading}
              >
                {loading ? 'Saving…' : 'Get Early Access →'}
              </button>
            </form>
            <p className="text-muted" style={{ fontSize: '0.72rem', marginTop: '0.75rem' }}>
              No spam. Unsubscribe any time.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
