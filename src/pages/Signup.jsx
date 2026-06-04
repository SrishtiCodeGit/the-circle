import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import './Auth.css';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'artist' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(form.email, form.password, form.name, form.role);
      navigate('/onboard');
    } catch (err) {
      setError(err.message?.replace('Firebase: ', '') || 'Signup failed. Please try again.');
    }
    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-box card">
        <div style={{ marginBottom: '1.75rem' }}><Logo size={28} textSize="1.05rem" /></div>
        <h1 className="auth-title">Join The Circle</h1>
        <p className="auth-subtitle">The global community for independent music.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Full Name</label><input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your name" required /></div>
          <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" required /></div>
          <div className="form-group"><label>Password</label><input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min. 6 characters" required minLength={6} /></div>
          <div className="form-group">
            <label>I am a</label>
            <div className="role-toggle">
              <button type="button" className={`role-btn ${form.role === 'artist' ? 'active' : ''}`} onClick={() => set('role', 'artist')}>
                Artist / Musician
              </button>
              <button type="button" className={`role-btn ${form.role === 'gig_poster' ? 'active' : ''}`} onClick={() => set('role', 'gig_poster')}>
                Venue / Brand
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Free Account'}
          </button>
        </form>

        <p className="auth-footer text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-accent fw-600">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
