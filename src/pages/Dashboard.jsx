import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { LayoutDashboard, User, Briefcase, Users, TrendingUp, Edit3, Save, IndianRupee } from 'lucide-react';
import { GENRES, INSTRUMENTS, CITIES } from '../data/mockData';
import './Dashboard.css';

const MOCK_EARNINGS = [
  { label: 'Jun', amount: 8000 },
  { label: 'May', amount: 12000 },
  { label: 'Apr', amount: 5500 },
  { label: 'Mar', amount: 9000 },
  { label: 'Feb', amount: 3000 },
  { label: 'Jan', amount: 6500 },
];
const TOTAL = MOCK_EARNINGS.reduce((s, e) => s + e.amount, 0);
const MAX = Math.max(...MOCK_EARNINGS.map(e => e.amount));

const MOCK_APPLICATIONS = [
  { id: 1, gig: 'Acoustic Set — Rooftop Cafe Mumbai', venue: 'The Perch Café', budget: '₹8,000–₹12,000', stage: 'Applied', date: 'Jun 10' },
  { id: 2, gig: 'Session Drummer — Studio Recording', venue: 'Wavelength Studios', budget: '₹15,000', stage: 'Shortlisted', date: 'Jun 8' },
  { id: 3, gig: 'Brand Activation — Tech Summit Delhi', venue: 'Pixel Events', budget: '₹25,000–₹35,000', stage: 'Confirmed', date: 'Jun 5' },
];

const PIPELINE_COLS = [
  { id: 'Applied',     label: 'Applied',     color: 'orange' },
  { id: 'Shortlisted', label: 'Shortlisted', color: 'purple' },
  { id: 'Confirmed',   label: 'Confirmed',   color: 'green'  },
];

function ApplicationsPipeline() {
  return (
    <div>
      <h2 className="section-title">My Applications</h2>
      <div className="pipeline-grid">
        {PIPELINE_COLS.map(col => (
          <div key={col.id} className="pipeline-col">
            <div className={`pipeline-col-header pipeline-col-${col.color}`}>{col.label}</div>
            {MOCK_APPLICATIONS.filter(a => a.stage === col.id).map(app => (
              <div key={app.id} className="pipeline-card card">
                <div className="fw-600 text-sm" style={{ lineHeight: 1.4, marginBottom: '0.4rem' }}>{app.gig}</div>
                <div className="text-xs text-muted">{app.venue}</div>
                <div className="text-xs text-muted mt-1">{app.budget}</div>
                <div className="flex-between mt-2" style={{ alignItems: 'center' }}>
                  <span className="text-xs text-muted">{app.date}</span>
                  <span className={`tag tag-${col.color === 'orange' ? 'orange' : col.color === 'purple' ? 'purple' : 'green'}`} style={{ fontSize: '0.7rem' }}>{col.label}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function EarningsChart() {
  return (
    <div className="earnings-chart">
      {MOCK_EARNINGS.slice().reverse().map(e => (
        <div key={e.label} className="bar-col">
          <div className="bar-label-top text-xs text-muted">₹{(e.amount / 1000).toFixed(0)}K</div>
          <div className="bar-wrap">
            <div className="bar" style={{ height: `${(e.amount / MAX) * 100}%` }} />
          </div>
          <div className="bar-label text-xs text-muted">{e.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { currentUser, userProfile, setUserProfile } = useAuth();
  const [tab, setTab] = useState('overview');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    bio: userProfile?.bio || '',
    location: userProfile?.location || '',
    genres: userProfile?.genres || [],
    instruments: userProfile?.instruments || [],
  });
  const [saving, setSaving] = useState(false);

  const toggleArr = (arr, val) =>
    arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

  async function saveProfile() {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), form);
      setUserProfile(p => ({ ...p, ...form }));
      setEditing(false);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  }

  const name = userProfile?.displayName || currentUser?.displayName || 'Artist';
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const TABS = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={15} /> },
    { id: 'profile', label: 'My Profile', icon: <User size={15} /> },
    { id: 'earnings', label: 'Earnings', icon: <TrendingUp size={15} /> },
    { id: 'applications', label: 'My Applications', icon: <Briefcase size={15} /> },
  ];

  return (
    <div className="page dashboard">
      <div className="dashboard-sidebar">
        <div className="sidebar-profile">
          <div className="avatar" style={{ width: 56, height: 56, fontSize: 20, background: 'linear-gradient(135deg, #3b0764, #1a1a26)', border: '2px solid var(--border)' }}>
            {initials}
          </div>
          <div>
            <div className="fw-700">{name}</div>
            <div className="text-xs text-muted">{userProfile?.role === 'gig_poster' ? 'Venue / Brand' : 'Artist'}</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`sidebar-tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="dashboard-content">
        {tab === 'overview' && (
          <div>
            <h2 className="section-title">Welcome back, {name.split(' ')[0]}</h2>
            <div className="grid-4">
              <div className="card stat-card">
                <div className="stat-card-icon purple"><Users size={18} /></div>
                <div className="stat-card-val">0</div>
                <div className="stat-card-label">Followers</div>
              </div>
              <div className="card stat-card">
                <div className="stat-card-icon green"><IndianRupee size={18} /></div>
                <div className="stat-card-val">₹0</div>
                <div className="stat-card-label">Total Earned</div>
              </div>
              <div className="card stat-card">
                <div className="stat-card-icon orange"><Briefcase size={18} /></div>
                <div className="stat-card-val">0</div>
                <div className="stat-card-label">Gig Applications</div>
              </div>
              <div className="card stat-card">
                <div className="stat-card-icon pink"><Users size={18} /></div>
                <div className="stat-card-val">0</div>
                <div className="stat-card-label">Collab Requests</div>
              </div>
            </div>
            <div className="card mt-3">
              <div className="flex-between mb-2">
                <h3 className="fw-700">Quick Actions</h3>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={() => setTab('profile')}><Edit3 size={15} /> Complete Profile</button>
                <button className="btn btn-outline"><Briefcase size={15} /> Browse Gigs</button>
                <button className="btn btn-outline"><Users size={15} /> Find Collabs</button>
              </div>
            </div>
          </div>
        )}

        {tab === 'profile' && (
          <div>
            <div className="flex-between mb-2">
              <h2 className="section-title" style={{ marginBottom: 0 }}>My Profile</h2>
              {editing
                ? <button className="btn btn-primary" onClick={saveProfile} disabled={saving}><Save size={15} /> {saving ? 'Saving...' : 'Save'}</button>
                : <button className="btn btn-outline" onClick={() => setEditing(true)}><Edit3 size={15} /> Edit</button>
              }
            </div>

            <div className="card">
              {editing ? (
                <>
                  <div className="form-group">
                    <label>Bio</label>
                    <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Tell the community about yourself..." />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <select value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}>
                      <option value="">Select city</option>
                      {CITIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Genres</label>
                    <div className="multi-select">
                      {GENRES.map(g => (
                        <button
                          key={g}
                          type="button"
                          className={`tag ${form.genres.includes(g) ? 'tag-purple' : ''}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setForm(f => ({ ...f, genres: toggleArr(f.genres, g) }))}
                        >{g}</button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Instruments / Roles</label>
                    <div className="multi-select">
                      {INSTRUMENTS.map(i => (
                        <button
                          key={i}
                          type="button"
                          className={`tag ${form.instruments.includes(i) ? 'tag-purple' : ''}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setForm(f => ({ ...f, instruments: toggleArr(f.instruments, i) }))}
                        >{i}</button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="profile-field">
                    <div className="text-xs text-muted">Bio</div>
                    <p className="mt-1 text-sm" style={{ lineHeight: 1.7 }}>{userProfile?.bio || <span className="text-muted">Not set yet. Click Edit to add your bio.</span>}</p>
                  </div>
                  <div className="profile-field">
                    <div className="text-xs text-muted">City</div>
                    <p className="mt-1 text-sm">{userProfile?.location || <span className="text-muted">Not set</span>}</p>
                  </div>
                  <div className="profile-field">
                    <div className="text-xs text-muted">Genres</div>
                    <div className="mt-1" style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {(userProfile?.genres || []).length === 0
                        ? <span className="text-muted text-sm">Not set</span>
                        : (userProfile?.genres || []).map(g => <span key={g} className="tag tag-purple">{g}</span>)
                      }
                    </div>
                  </div>
                  <div className="profile-field">
                    <div className="text-xs text-muted">Instruments / Roles</div>
                    <div className="mt-1" style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {(userProfile?.instruments || []).length === 0
                        ? <span className="text-muted text-sm">Not set</span>
                        : (userProfile?.instruments || []).map(i => <span key={i} className="tag">{i}</span>)
                      }
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {tab === 'applications' && (
          <ApplicationsPipeline />
        )}

        {tab === 'earnings' && (
          <div>
            <h2 className="section-title">Earnings</h2>
            <div className="grid-2 mb-2">
              <div className="card">
                <div className="text-muted text-sm mb-1">Total Earned (Demo)</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--green)' }}>₹{TOTAL.toLocaleString('en-IN')}</div>
                <div className="text-xs text-muted mt-1">Last 6 months</div>
              </div>
              <div className="card">
                <div className="text-muted text-sm mb-1">This Month</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent2)' }}>₹{MOCK_EARNINGS[0].amount.toLocaleString('en-IN')}</div>
                <div className="text-xs text-muted mt-1">Jun 2026</div>
              </div>
            </div>
            <div className="card">
              <div className="fw-700 mb-2">Monthly Breakdown</div>
              <EarningsChart />
            </div>
            <div className="card mt-2">
              <div className="fw-700 mb-2">Monetization Tools</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { label: 'Fan Tipping', desc: 'Let fans send you tips directly', status: 'Available' },
                  { label: 'Paid Collabs', desc: 'Set rates for collaboration sessions', status: 'Available' },
                  { label: 'Split-Sheet Builder', desc: 'Create IP ownership agreements', status: 'Coming Soon' },
                  { label: 'Licensing Marketplace', desc: 'License your music to brands and media', status: 'Coming Soon' },
                ].map(tool => (
                  <div key={tool.label} className="flex-between" style={{ padding: '0.75rem', background: 'var(--bg3)', borderRadius: 8, border: '1px solid var(--border)' }}>
                    <div>
                      <div className="fw-600 text-sm">{tool.label}</div>
                      <div className="text-xs text-muted mt-1">{tool.desc}</div>
                    </div>
                    <span className={`tag ${tool.status === 'Available' ? 'tag-green' : 'tag-orange'}`}>{tool.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
