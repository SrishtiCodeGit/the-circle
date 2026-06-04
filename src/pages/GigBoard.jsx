import { useState } from 'react';
import { MapPin, Calendar, Users, Briefcase, Plus } from 'lucide-react';
import { MOCK_GIGS, CITIES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './GigBoard.css';

const GIG_TYPES = ['Live Performance', 'Studio Session', 'Brand Activation', 'Remote Collab'];

function PostGigModal({ onClose }) {
  const [form, setForm] = useState({ title: '', location: '', budget: '', type: '', date: '', desc: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">Post a Gig</div>
        <div className="form-group"><label>Gig Title</label><input placeholder="e.g. Acoustic Set — Café Night" value={form.title} onChange={e => set('title', e.target.value)} /></div>
        <div className="form-group"><label>Location</label><input placeholder="New York / Remote" value={form.location} onChange={e => set('location', e.target.value)} /></div>
        <div className="form-group"><label>Budget</label><input placeholder="$400 – $600" value={form.budget} onChange={e => set('budget', e.target.value)} /></div>
        <div className="form-group">
          <label>Type</label>
          <select value={form.type} onChange={e => set('type', e.target.value)}>
            <option value="">Select type</option>
            {GIG_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={e => set('date', e.target.value)} /></div>
        <div className="form-group"><label>Description</label><textarea placeholder="Describe the gig, requirements, vibe..." value={form.desc} onChange={e => set('desc', e.target.value)} /></div>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onClose}>Post Gig</button>
        </div>
      </div>
    </div>
  );
}

export default function GigBoard() {
  const { currentUser } = useAuth();
  const [typeFilter, setTypeFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = MOCK_GIGS.filter(g => {
    const matchType = !typeFilter || g.type === typeFilter;
    const matchCity = !cityFilter || g.location === cityFilter;
    return matchType && matchCity;
  });

  return (
    <div className="page">
      <div className="flex-between mb-3 page-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Gig Board</h1>
          <p className="text-muted text-sm mt-1">Paid opportunities for independent artists</p>
        </div>
        {currentUser
          ? <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={15} /> Post a Gig</button>
          : <Link to="/signup" className="btn btn-primary"><Plus size={15} /> Post a Gig</Link>
        }
      </div>

      <div className="filter-bar">
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          {GIG_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={cityFilter} onChange={e => setCityFilter(e.target.value)}>
          <option value="">All Cities</option>
          <option value="Remote">Remote</option>
          {CITIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {filtered.map(gig => (
          <div key={gig.id} className="card gig-card">
            <div className="flex-between" style={{ flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: '0.975rem', fontWeight: 700, letterSpacing: '-0.01em', marginBottom: '0.4rem' }}>{gig.title}</h3>
                <div className="gig-meta">
                  <span>{gig.postedBy}</span>
                  <span className="gig-meta-dot">·</span>
                  <MapPin size={12} /><span>{gig.location}</span>
                  <span className="gig-meta-dot">·</span>
                  <Calendar size={12} />
                  <span>{new Date(gig.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div className="gig-budget">{gig.budget}</div>
                <span className="tag tag-orange" style={{ marginTop: '0.3rem' }}>{gig.type}</span>
              </div>
            </div>

            <p className="text-sm text-muted mt-2" style={{ lineHeight: 1.65, fontSize: '0.83rem' }}>{gig.desc}</p>

            <div className="flex-between mt-2" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {gig.genres.map(g => <span key={g} className="tag tag-purple">{g}</span>)}
              </div>
              <div className="flex-center gap-2">
                <span className="flex-center gap-05 text-xs text-muted"><Users size={11} /> {gig.applicants} applied</span>
                {currentUser
                  ? <button className="btn btn-green" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>Apply Now</button>
                  : <Link to="/signup" className="btn btn-green" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>Apply Now</Link>
                }
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <Briefcase size={36} style={{ color: 'var(--text3)' }} />
          <p>No gigs match your filters.</p>
        </div>
      )}

      {showModal && <PostGigModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
