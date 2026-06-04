import { useState } from 'react';
import { Users, MapPin, Music, Plus } from 'lucide-react';
import { MOCK_COLLABS, GENRES, INSTRUMENTS, CITIES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Collaborations.css';

const PROJECT_TYPES = ['Single', 'EP', 'Album', 'Live Band', 'Session Work', 'Podcast/Score', 'Other'];

function WizardDots({ step, total }) {
  return (
    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          style={{
            width: 8, height: 8, borderRadius: '50%',
            background: i < step ? 'var(--accent2)' : 'var(--bg3)',
            border: i === step - 1 ? '2px solid var(--accent2)' : '2px solid var(--border2)',
            transition: 'all 0.2s',
          }}
        />
      ))}
    </div>
  );
}

function PostCollabModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState('forward');
  const [animating, setAnimating] = useState(false);

  const [title, setTitle] = useState('');
  const [projectType, setProjectType] = useState('');
  const [genres, setGenres] = useState('');
  const [seeking, setSeeking] = useState([]);
  const [location, setLocation] = useState('');
  const [compensation, setCompensation] = useState('');
  const [desc, setDesc] = useState('');

  function toggleInstrument(val) {
    setSeeking(a => a.includes(val) ? a.filter(x => x !== val) : [...a, val]);
  }

  function goNext() {
    if (animating) return;
    setDirection('forward');
    setAnimating(true);
    setTimeout(() => { setStep(s => s + 1); setAnimating(false); }, 280);
  }

  function goBack() {
    if (animating) return;
    setDirection('backward');
    setAnimating(true);
    setTimeout(() => { setStep(s => s - 1); setAnimating(false); }, 280);
  }

  const animClass = animating
    ? direction === 'forward' ? 'step-exit-left' : 'step-exit-right'
    : '';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-title">Post a Collab Request</div>
        <WizardDots step={step} total={3} />

        <div className={`onboard-step ${animClass}`} style={{ minHeight: 240 }}>
          {step === 1 && (
            <>
              <div className="text-sm fw-600 mb-2" style={{ color: 'var(--accent2)' }}>Step 1: The Project</div>
              <div className="form-group">
                <label>Title</label>
                <input placeholder="e.g. Looking for Bassist for Folk EP" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Project Type</label>
                <select value={projectType} onChange={e => setProjectType(e.target.value)}>
                  <option value="">Select type</option>
                  {PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Genres (comma-separated)</label>
                <input placeholder="Folk, Jazz, Electronic..." value={genres} onChange={e => setGenres(e.target.value)} />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="text-sm fw-600 mb-2" style={{ color: 'var(--accent2)' }}>Step 2: Who You Need</div>
              <div className="form-group">
                <label>Instrument / Role</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {INSTRUMENTS.map(i => (
                    <button
                      key={i}
                      type="button"
                      className={`onboard-pill ${seeking.includes(i) ? 'active' : ''}`}
                      onClick={() => toggleInstrument(i)}
                    >{i}</button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Location / Remote</label>
                <input placeholder="Mumbai / Remote" value={location} onChange={e => setLocation(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Compensation</label>
                <input placeholder="50/50 split, Session fee, Revenue share..." value={compensation} onChange={e => setCompensation(e.target.value)} />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="text-sm fw-600 mb-2" style={{ color: 'var(--accent2)' }}>Step 3: Tell Your Story</div>
              <div className="form-group">
                <label>Description</label>
                <textarea placeholder="Tell artists about your project..." value={desc} onChange={e => setDesc(e.target.value)} rows={4} />
              </div>
              {title && (
                <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '0.85rem', marginTop: '0.75rem' }}>
                  <div className="text-xs text-muted mb-1">Preview</div>
                  <div className="fw-700 text-sm">{title}</div>
                  {projectType && <div className="text-xs text-muted mt-1">{projectType} · {genres}</div>}
                  <div className="text-xs text-muted mt-1">{location || 'Location TBD'} · {compensation || 'Compensation TBD'}</div>
                  {seeking.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                      {seeking.map(s => <span key={s} className="tag tag-purple" style={{ fontSize: '0.72rem' }}>{s}</span>)}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          {step > 1 && <button className="btn btn-outline" onClick={goBack}>Back</button>}
          {step < 3
            ? <button className="btn btn-primary" onClick={goNext}>Next →</button>
            : <button className="btn btn-primary" onClick={onClose}>Post to The Circle</button>
          }
        </div>
      </div>
    </div>
  );
}

export default function Collaborations() {
  const { currentUser } = useAuth();
  const [genreFilter, setGenreFilter] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = MOCK_COLLABS.filter(c =>
    !genreFilter || c.genres.includes(genreFilter)
  );

  return (
    <div className="page">
      <div className="flex-between mb-2" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="section-title" style={{ marginBottom: 0 }}>Collaborations</h1>
          <p className="text-muted text-sm">Find your next creative partner</p>
        </div>
        {currentUser
          ? <button className="btn btn-pink" onClick={() => setShowModal(true)}><Plus size={15} /> Post Request</button>
          : <Link to="/signup" className="btn btn-pink"><Plus size={15} /> Post Request</Link>
        }
      </div>

      <div className="discover-filters">
        <select value={genreFilter} onChange={e => setGenreFilter(e.target.value)}>
          <option value="">All Genres</option>
          {GENRES.map(g => <option key={g}>{g}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map(collab => (
          <div key={collab.id} className="card collab-card">
            <div className="flex-between" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 className="fw-700" style={{ fontSize: '1rem' }}>{collab.title}</h3>
                <div className="flex-center gap-1 text-sm text-muted mt-1">
                  <span>{collab.postedBy}</span>
                  <span>·</span>
                  <MapPin size={13} /><span>{collab.location}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="tag tag-pink">{collab.type}</span>
              </div>
            </div>

            <p className="text-sm text-muted mt-2" style={{ lineHeight: 1.6 }}>{collab.desc}</p>

            <div className="flex-between mt-2" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span className="text-xs text-muted">Seeking:</span>
                {collab.seeking.map(s => <span key={s} className="tag tag-purple">{s}</span>)}
                {collab.genres.map(g => <span key={g} className="tag">{g}</span>)}
              </div>
              <div className="flex-center gap-2">
                <span className="text-xs text-muted">{collab.compensation}</span>
                {currentUser
                  ? <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>Express Interest</button>
                  : <Link to="/signup" className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>Express Interest</Link>
                }
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <Users size={40} />
          <p>No collab requests match your filters.</p>
        </div>
      )}

      {showModal && <PostCollabModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
