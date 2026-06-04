import { Link } from 'react-router-dom';
import { Compass, Briefcase, Users, Star, TrendingUp, Shield, ArrowRight, Zap } from 'lucide-react';
import AnimatedWave from '../components/AnimatedWave';
import ActivityTicker from '../components/ActivityTicker';
import { useReveal } from '../hooks/useReveal';
import { useCounter } from '../hooks/useCounter';
import './Home.css';

const FEATURES = [
  { icon: <Compass size={20}/>, title:'Artist Discovery',      desc:'Find independent musicians across India by genre, city, and instrument.',         color:'#7c3aed' },
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
  { name:'Aryan Mehta', role:'Indie Folk Artist, Mumbai',    quote:'The Circle connected me with a producer I never would have found otherwise. We made an EP in 3 weeks.', initials:'AM', color:'#6d28d9' },
  { name:'Priya Singh',  role:'Electronic Producer, Bangalore', quote:'Got 3 paid gigs in my first month. The platform actually understands what independent artists need.', initials:'PS', color:'#db2777' },
  { name:'Kabir Nair',   role:'Jazz Drummer, Hyderabad',     quote:'Finally a platform built for serious musicians, not just influencers. Riyaaz is the word.', initials:'KN', color:'#059669' },
];

function StatCounter({ target, prefix='', suffix='' }) {
  const [count, ref] = useCounter(target);
  return <span ref={ref}>{prefix}{count.toLocaleString('en-IN')}{suffix}</span>;
}

export default function Home() {
  const featuresRef = useReveal();
  const stepsRef    = useReveal();
  const testimonialsRef = useReveal();

  return (
    <div className="home">
      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="hero-bg">
          <div className="hero-glow-1" />
          <div className="hero-glow-2" />
          <div className="hero-glow-3" />
        </div>

        <div className="hero-badge">
          <Zap size={11} /> India's Independent Music Community
        </div>

        <h1 className="hero-title">
          Where Indian Artists<br />
          <span className="gradient-text">Find Their People</span>
        </h1>

        <p className="hero-sub">
          The Circle connects independent musicians across India — for discovery, collaboration, gigs, and sustainable income. No gatekeepers. Just artists.
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
        <div style={{ maxWidth: 560, margin: '0 auto 1rem', width: '100%' }}>
          <ActivityTicker />
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-item">
            <div className="stat-value"><StatCounter target={2400} suffix="+" /></div>
            <div className="stat-label">Artists</div>
          </div>
          <div className="stat-item">
            <div className="stat-value"><StatCounter target={180} suffix="+" /></div>
            <div className="stat-label">Cities</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">₹<StatCounter target={12} suffix="L+" /></div>
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
                <div className="avatar" style={{ width:38,height:38,fontSize:13,background:`linear-gradient(135deg,${t.color}99,${t.color})`,border:'2px solid var(--border2)' }}>
                  {t.initials}
                </div>
                <div>
                  <div className="fw-700 text-sm">{t.name}</div>
                  <div className="text-xs text-muted">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-glow" />
        <AnimatedWave height={36} color="rgba(168,85,247,0.35)" />
        <h2 className="cta-title mt-3">
          The Indian music scene is fragmented.<br />
          <span className="gradient-text">You don't have to be.</span>
        </h2>
        <p className="text-muted mt-2 mb-3" style={{ fontSize:'0.95rem' }}>
          Join thousands of artists already building on The Circle.
        </p>
        <Link to="/signup" className="btn btn-primary" style={{ fontSize:'0.95rem', padding:'0.8rem 2rem' }}>
          Join The Circle — It's Free <ArrowRight size={15} />
        </Link>
        <AnimatedWave height={36} color="rgba(236,72,153,0.3)" />
      </section>
    </div>
  );
}
