import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Briefcase, Users, Star, TrendingUp, Shield, ArrowRight, Zap, MapPin, CheckCircle } from 'lucide-react';
import AnimatedWave from '../components/AnimatedWave';
import ActivityTicker from '../components/ActivityTicker';
import Logo from '../components/Logo';
import { useReveal } from '../hooks/useReveal';
import { useCounter } from '../hooks/useCounter';
import { MOCK_ARTISTS } from '../data/mockData';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './Home.css';

const FEATURES = [
  { icon: <Compass size={20}/>, title:'Artist Discovery',      desc:'Find independent musicians worldwide by genre, city, and instrument.',           color:'#7c3aed' },
  { icon: <Users   size={20}/>, title:'Collaboration Matching',desc:'Post or respond to collab requests — build something new together.',               color:'#ec4899' },
  { icon: <Briefcase size={20}/>,title:'Gig Board',            desc:'Browse paid gig opportunities or post your own — venues to brand activations.',    color:'#f97316' },
  { icon: <Shield  size={20}/>, title:'IP Ownership',          desc:'Split-sheet agreements and licensing terms. Creator-first, always.',               color:'#10b981' },
  { icon: <TrendingUp size={20}/>,title:'Creator Economy',     desc:'Fan tipping, exclusive drops, and sustainable income built in.',                   color:'#a855f7' },
  { icon: <Star    size={20}/>, title:'Portfolio Showcase',     desc:'Your music, your story. A profile that works while you sleep.',                   color:'#06b6d4' },
];

const STEPS = [
  { n:'01', title:'Create your profile',   desc:'Set up your artist page with genres, instruments, and portfolio in minutes.' },
  { n:'02', title:'Connect with artists',  desc:'Discover collaborators, apply to gigs, or post your own requests.' },
  { n:'03', title:'Earn on your terms',    desc:'Get paid for gigs, fan tips, and licensed music — no label required.' },
];

const TESTIMONIALS = [
  { name:'Aryan Mehta', role:'Indie Folk Artist, London',       quote:'The Circle connected me with a producer I never would have found otherwise. We made an EP in 3 weeks.', initials:'AM', color:'#6d28d9', avatar:'https://i.pravatar.cc/150?img=11' },
  { name:'Priya Singh',  role:'Electronic Producer, Berlin',    quote:'Got 3 paid gigs in my first month. The platform actually understands what independent artists need.',  initials:'PS', color:'#db2777', avatar:'https://i.pravatar.cc/150?img=47' },
  { name:'Kabir Nair',   role:'Jazz Drummer, New York',         quote:'Finally a platform built for serious musicians, not just influencers. This is the real deal.',        initials:'KN', color:'#059669', avatar:'https://i.pravatar.cc/150?img=12' },
];

// spotlight artists: a2 (Priya), a1 (Aryan), a4 (Sneha)
const SPOTLIGHT_IDS = ['a2', 'a1', 'a4'];
const SPOTLIGHT_STYLES = [
  { top: 10,   left: 30,  rotate: -3, zIndex: 1, animDelay: '0s' },
  { top: 150,  left: 70,  rotate:  1, zIndex: 2, animDelay: '1.3s' },
  { top: 295,  left: 20,  rotate: -1, zIndex: 1, animDelay: '2.6s' },
];

function WaitlistBar() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.includes('@')) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'leads'), {
        email,
        role: role || 'Not specified',
        source: 'homepage-waitlist',
        createdAt: serverTimestamp(),
      });
      setDone(true);
    } catch {
      setDone(true);
    }
    setLoading(false);
  }

  return (
    <section className="waitlist-section">
      <div className="waitlist-inner">
        {done ? (
          <div className="waitlist-done">
            <CheckCircle size={22} style={{ color: '#10b981' }} />
            <span>You're on the list! We'll be in touch soon.</span>
          </div>
        ) : (
          <>
            <div className="waitlist-copy">
              <span className="waitlist-label">Early Access</span>
              <p>Be among the first artists on The Circle.</p>
            </div>
            <form className="waitlist-form" onSubmit={handleSubmit}>
              <select value={role} onChange={e => setRole(e.target.value)}>
                <option value="">I'm a…</option>
                <option>Artist</option>
                <option>Band</option>
                <option>Venue / Organiser</option>
                <option>Label / Manager</option>
              </select>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? '…' : 'Notify Me'}
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}

function StatCounter({ target, prefix='', suffix='' }) {
  const [count, ref] = useCounter(target);
  return <span ref={ref}>{prefix}{count.toLocaleString('en-IN')}{suffix}</span>;
}

function SpotlightCard({ artist, style, animDelay }) {
  const genreColorMap = {
    'Folk': '#7c3aed', 'Indie': '#7c3aed',
    'Electronic': '#06b6d4', 'Ambient': '#06b6d4',
    'Jazz': '#f59e0b', 'Fusion': '#f59e0b',
    'Hip-Hop': '#ec4899', 'R&B': '#ec4899',
    'Classical': '#10b981',
    'Metal': '#ef4444', 'Rock': '#ef4444',
  };
  return (
    <div
      className="spotlight-card"
      style={{
        top: style.top,
        left: style.left,
        '--rotate': `${style.rotate}deg`,
        zIndex: style.zIndex,
        animationDelay: animDelay,
      }}
    >
      <div className="spotlight-card-inner">
        {artist.avatar ? (
          <img
            src={artist.avatar}
            alt={artist.displayName}
            style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border2)', flexShrink: 0 }}
          />
        ) : (
          <div className="avatar" style={{ width: 60, height: 60, fontSize: 20 }}>{artist.initials}</div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.01em' }}>{artist.displayName}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text2)', marginTop: 2 }}>
            <MapPin size={10} /> {artist.location}
          </div>
          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
            {artist.genres.map(g => (
              <span key={g} style={{ fontSize: '0.65rem', padding: '0.1rem 0.45rem', borderRadius: 999, background: `${genreColorMap[g] || '#7c3aed'}22`, color: genreColorMap[g] || '#7c3aed', fontWeight: 600 }}>{g}</span>
            ))}
            {artist.open && <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.45rem', borderRadius: 999, background: 'rgba(16,185,129,0.15)', color: '#10b981', fontWeight: 600 }}>Open</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const featuresRef = useReveal();
  const stepsRef    = useReveal();
  const testimonialsRef = useReveal();

  const spotlightArtists = SPOTLIGHT_IDS.map(id => MOCK_ARTISTS.find(a => a.id === id));

  return (
    <div className="home">
      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="hero-bg">
          <div className="hero-glow-1" />
          <div className="hero-glow-2" />
          <div className="hero-glow-3" />
        </div>

        <div className="hero-inner">
          {/* Left column */}
          <div className="hero-left">
            <div style={{ opacity: 0.6, marginBottom: '1.5rem' }}>
              <Logo size={28} />
            </div>

            <div className="hero-badge">
              <Zap size={11} /> The Global Independent Music Community
            </div>

            <h1 className="hero-title">
              Where Artists<br />
              <span className="gradient-text">Find Their People</span>
            </h1>

            <p className="hero-sub">
              The Circle connects independent musicians worldwide — for discovery, collaboration, gigs, and sustainable income. No gatekeepers. Just artists.
            </p>

            <div className="hero-cta">
              <Link to="/signup" className="btn btn-primary hero-btn-main">
                Start for Free <ArrowRight size={15} />
              </Link>
              <Link to="/discover" className="btn btn-outline hero-btn-sec">
                Explore Artists
              </Link>
            </div>

            {/* Live animated waveform */}
            <div className="hero-wave-wrap">
              <AnimatedWave height={52} color="var(--accent2)" />
            </div>

            {/* Live Ticker */}
            <div style={{ maxWidth: 520, width: '100%' }}>
              <ActivityTicker />
            </div>
          </div>

          {/* Right column — spotlight */}
          <div className="hero-right">
            <div className="hero-spotlight">
              {/* Large faded circle watermark */}
              <div className="spotlight-watermark" />
              {spotlightArtists.map((artist, i) => (
                <SpotlightCard
                  key={artist.id}
                  artist={artist}
                  style={SPOTLIGHT_STYLES[i]}
                  animDelay={SPOTLIGHT_STYLES[i].animDelay}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="stats-strip">
        <div className="stats-row">
          <div className="stat-item">
            <div className="stat-value"><StatCounter target={2400} suffix="+" /></div>
            <div className="stat-label">Artists</div>
          </div>
          <div className="stat-item">
            <div className="stat-value"><StatCounter target={50} suffix="+" /></div>
            <div className="stat-label">Countries</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">$<StatCounter target={2} suffix="M+" /></div>
            <div className="stat-label">Paid Out</div>
          </div>
          <div className="stat-item">
            <div className="stat-value"><StatCounter target={600} suffix="+" /></div>
            <div className="stat-label">Collabs Made</div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features-section page" ref={featuresRef}>
        <div className="features-heading reveal">
          <h2 className="section-title">Everything an independent artist needs</h2>
          <p className="text-muted">One platform to discover, collaborate, perform, and get paid.</p>
        </div>
        <div className="grid-3">
          {FEATURES.map((f, i) => (
            <div key={f.title} className={`card feature-card reveal reveal-delay-${i % 4 + 1}`}>
              <div className="feature-icon" style={{ '--icon-color': f.color }}>
                {f.icon}
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="text-muted text-sm">{f.desc}</p>
              <div className="feature-bar" style={{ '--bar-color': f.color }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="how-section" ref={stepsRef}>
        <div className="reveal" style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <h2 className="section-title" style={{ marginBottom:'0.4rem' }}>How it works</h2>
          <p className="text-muted text-sm">Get going in three simple steps</p>
        </div>
        <div className="steps-grid">
          {STEPS.map((s, i) => (
            <div key={s.n} className={`step-card reveal reveal-delay-${i+1}`}>
              <div className="step-num">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="testimonials-section page" ref={testimonialsRef}>
        <div className="reveal" style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <h2 className="section-title" style={{ marginBottom:'0.4rem' }}>What artists are saying</h2>
          <p className="text-muted text-sm">Real stories from the community</p>
        </div>
        <div className="grid-3">
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} className={`card testimonial-card reveal reveal-delay-${i+1}`}>
              <div className="testimonial-quote">"</div>
              <p className="testimonial-text">"{t.quote}"</p>
              <div className="testimonial-author">
                <img
                  src={t.avatar}
                  alt={t.name}
                  style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border2)', flexShrink: 0 }}
                />
                <div>
                  <div className="fw-700 text-sm">{t.name}</div>
                  <div className="text-xs text-muted">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Waitlist ── */}
      <WaitlistBar />

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-glow" />
        <AnimatedWave height={36} color="rgba(168,85,247,0.35)" />
        <h2 className="cta-title mt-3">
          The music world is fragmented.<br />
          <span className="gradient-text">You don't have to be.</span>
        </h2>
        <p className="text-muted mt-2 mb-3" style={{ fontSize:'0.95rem' }}>
          Join artists from 50+ countries already building on The Circle.
        </p>
        <Link to="/signup" className="btn btn-primary" style={{ fontSize:'0.95rem', padding:'0.8rem 2rem' }}>
          Join The Circle — It's Free <ArrowRight size={15} />
        </Link>
        <AnimatedWave height={36} color="rgba(236,72,153,0.3)" />
      </section>
    </div>
  );
}
