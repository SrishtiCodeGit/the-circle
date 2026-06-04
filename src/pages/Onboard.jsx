import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { GENRES, INSTRUMENTS, CITIES } from '../data/mockData';
import Logo from '../components/Logo';
import './Onboard.css';

const TOTAL_STEPS = 3;

export default function Onboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState('forward');
  const [animating, setAnimating] = useState(false);

  const [genres, setGenres] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [openCollabs, setOpenCollabs] = useState(false);
  const [saving, setSaving] = useState(false);

  function toggle(arr, setArr, val) {
    setArr(a => a.includes(val) ? a.filter(x => x !== val) : [...a, val]);
  }

  function goNext() {
    if (animating) return;
    setDirection('forward');
    setAnimating(true);
    setTimeout(() => {
      setStep(s => s + 1);
      setAnimating(false);
    }, 300);
  }

  function goBack() {
    if (animating) return;
    setDirection('backward');
    setAnimating(true);
    setTimeout(() => {
      setStep(s => s - 1);
      setAnimating(false);
    }, 300);
  }

  async function finish() {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        genres,
        instruments,
        location: city,
        bio,
        open: openCollabs,
      });
    } catch (e) {
      console.error(e);
    }
    navigate('/dashboard');
  }

  const progress = ((step - 1) / (TOTAL_STEPS - 1)) * 100;

  const animClass = animating
    ? direction === 'forward' ? 'step-exit-left' : 'step-exit-right'
    : '';

  return (
    <div className="onboard-page">
      <div className="onboard-box">
        <div className="onboard-logo">
          <Logo size={28} textSize="1.1rem" />
        </div>

        <div className="onboard-progress-bar">
          <div className="onboard-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="onboard-step-label">Step {step} of {TOTAL_STEPS}</div>

        <div className={`onboard-step ${animClass}`}>
          {step === 1 && (
            <>
              <h2 className="onboard-title">Your Sound</h2>
              <p className="onboard-sub">Pick the genres that define you</p>
              <div className="pill-grid">
                {GENRES.map(g => (
                  <button
                    key={g}
                    type="button"
                    className={`onboard-pill ${genres.includes(g) ? 'active' : ''}`}
                    onClick={() => toggle(genres, setGenres, g)}
                  >{g}</button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="onboard-title">Your Role</h2>
              <p className="onboard-sub">What do you play or create?</p>
              <div className="pill-grid">
                {INSTRUMENTS.map(i => (
                  <button
                    key={i}
                    type="button"
                    className={`onboard-pill ${instruments.includes(i) ? 'active' : ''}`}
                    onClick={() => toggle(instruments, setInstruments, i)}
                  >{i}</button>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="onboard-title">Your Stage</h2>
              <p className="onboard-sub">Tell the community where you are and who you are</p>
              <div className="form-group">
                <label>City</label>
                <select value={city} onChange={e => setCity(e.target.value)}>
                  <option value="">Select your city</option>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea
                  placeholder="Tell the community about yourself and your music..."
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="onboard-toggle-row">
                <div>
                  <div className="fw-600 text-sm">Open to Collabs</div>
                  <div className="text-xs text-muted">Let artists know you're looking to collaborate</div>
                </div>
                <button
                  type="button"
                  className={`toggle-btn ${openCollabs ? 'on' : ''}`}
                  onClick={() => setOpenCollabs(x => !x)}
                >
                  <span className="toggle-knob" />
                </button>
              </div>
            </>
          )}
        </div>

        <div className="onboard-actions">
          {step > 1 && (
            <button className="btn btn-outline" onClick={goBack}>Back</button>
          )}
          {step < TOTAL_STEPS ? (
            <button className="btn btn-primary" onClick={goNext} style={{ marginLeft: 'auto' }}>
              Continue →
            </button>
          ) : (
            <button className="btn btn-primary" onClick={finish} disabled={saving} style={{ marginLeft: 'auto' }}>
              {saving ? 'Saving...' : 'Finish & Enter The Circle'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
