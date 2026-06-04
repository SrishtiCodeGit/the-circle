import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Music, Users, Heart, Share2, ExternalLink, Disc, Link2 } from 'lucide-react';
import { MOCK_ARTISTS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { usePlayer } from '../context/PlayerContext';
import LeadCaptureModal from '../components/LeadCaptureModal';
import './ArtistProfile.css';

const COVER_COLORS = [
  ['#3b0764', '#6d28d9'],
  ['#1e1b4b', '#4338ca'],
  ['#701a75', '#a21caf'],
  ['#064e3b', '#059669'],
  ['#7f1d1d', '#dc2626'],
  ['#312e81', '#7c3aed'],
];

function AvatarCircle({ artist, size = 80 }) {
  if (artist.avatar) {
    return (
      <img
        src={artist.avatar}
        alt={artist.displayName}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid var(--border2)',
          flexShrink: 0,
        }}
      />
    );
  }
  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.35,
        background: 'linear-gradient(135deg, #3b0764, #1a1a26)',
        border: '3px solid var(--border)',
      }}
    >
      {artist.initials}
    </div>
  );
}

const HEART_OFFSETS = [
  { x: -20, delay: 0 },
  { x: 0,   delay: 0.05 },
  { x: 20,  delay: 0.1 },
  { x: -12, delay: 0.15 },
  { x: 12,  delay: 0.2 },
  { x: 5,   delay: 0.08 },
];

function MusicEmbed({ url }) {
  let embedUrl = url;
  // Convert Spotify share URL to embed URL
  if (url.includes('open.spotify.com') && !url.includes('/embed/')) {
    embedUrl = url.replace('open.spotify.com/', 'open.spotify.com/embed/');
  }
  // Convert YouTube watch URL to embed URL
  if (url.includes('youtube.com/watch')) {
    const id = new URL(url).searchParams.get('v');
    embedUrl = `https://www.youtube.com/embed/${id}`;
  }
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1].split('?')[0];
    embedUrl = `https://www.youtube.com/embed/${id}`;
  }

  const isSpotify = embedUrl.includes('spotify.com');
  const height = isSpotify ? 152 : 200;

  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <Link2 size={15} style={{ color: 'var(--accent2)' }} />
        <span className="fw-600 text-sm">Listen</span>
      </div>
      <iframe
        src={embedUrl}
        width="100%"
        height={height}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        style={{ borderRadius: 12 }}
        title="Music player"
      />
    </div>
  );
}

export default function ArtistProfile() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const toast = useToast();
  const { play } = usePlayer();
  const artist = MOCK_ARTISTS.find(a => a.id === id);

  const [followed, setFollowed] = useState(false);
  const [burst, setBurst] = useState(false);
  const [showLead, setShowLead] = useState(false);

  if (!artist) {
    return (
      <div className="page" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <p className="text-muted">Artist not found.</p>
        <Link to="/discover" className="btn btn-outline mt-2">← Back to Discover</Link>
      </div>
    );
  }

  function handleFollow() {
    const next = !followed;
    setFollowed(next);
    if (next) {
      setBurst(true);
      setTimeout(() => setBurst(false), 600);
      toast.success(`Following ${artist.displayName}!`);
    } else {
      toast.info(`Unfollowed ${artist.displayName}`);
    }
  }

  const artistColor = '#7c3aed';
  const colorIdx = artist.id.charCodeAt(1) % COVER_COLORS.length;
  const [color1, color2] = COVER_COLORS[colorIdx];

  return (
    <>
      {/* Full-width cover */}
      <div
        className="profile-cover"
        style={{ background: `linear-gradient(135deg, ${color1}, ${color2})` }}
      >
        {artist.avatar && (
          <div
            className="profile-cover-blur"
            style={{ backgroundImage: `url(${artist.avatar})` }}
          />
        )}
        <div className="profile-avatar-wrap">
          {artist.avatar ? (
            <img
              src={artist.avatar}
              className="profile-avatar-img"
              alt={artist.displayName}
            />
          ) : (
            <div
              className="avatar profile-avatar-img"
              style={{
                width: 100, height: 100, fontSize: 36,
                background: `linear-gradient(135deg, ${color1}, ${color2})`,
                border: '4px solid var(--bg)',
              }}
            >
              {artist.initials}
            </div>
          )}
        </div>
      </div>

      <div className="page profile-page" style={{ maxWidth: 800, paddingTop: '4rem' }}>
        <Link to="/discover" className="text-muted text-sm flex-center gap-1 mb-2">← Back to Discover</Link>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* AvatarCircle hidden here since we have cover; small inline version */}
            <AvatarCircle artist={artist} />
            <div style={{ flex: 1 }}>
              <div className="flex-between" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{artist.displayName}</h1>
                  <div className="flex-center gap-1 text-sm text-muted mt-1">
                    <MapPin size={13} /> {artist.location}
                    {artist.open && <span className="tag tag-green" style={{ marginLeft: '0.5rem' }}>Open to Collabs</span>}
                  </div>
                </div>
                <div className="flex gap-1">
                  {currentUser && (
                    <div className="follow-btn-wrap">
                      <button
                        className={`btn ${followed ? 'follow-btn followed' : 'btn-primary follow-btn'}`}
                        onClick={handleFollow}
                      >
                        <Heart size={15} fill={followed ? '#ec4899' : 'none'} />
                        {followed ? 'Following' : 'Follow'}
                      </button>
                      {burst && (
                        <div className="heart-burst">
                          {HEART_OFFSETS.map((o, i) => (
                            <span
                              key={i}
                              className="heart-particle"
                              style={{
                                left: o.x,
                                animationDelay: `${o.delay}s`,
                              }}
                            >♥</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <button className="btn btn-outline"><Share2 size={15} /></button>
                </div>
              </div>

              <div className="flex gap-2 mt-2" style={{ flexWrap: 'wrap' }}>
                <div className="text-center">
                  <div className="fw-700 text-accent">{artist.followers.toLocaleString()}</div>
                  <div className="text-xs text-muted">Followers</div>
                </div>
                <div className="text-center">
                  <div className="fw-700 text-green">${artist.earnings.toLocaleString()}</div>
                  <div className="text-xs text-muted">Earned</div>
                </div>
                <div className="text-center">
                  <div className="fw-700">{artist.portfolio.length}</div>
                  <div className="text-xs text-muted">Releases</div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-muted mt-3" style={{ lineHeight: 1.7 }}>{artist.bio}</p>

          <div className="mt-2">
            <div className="text-xs text-muted mb-1">Genres</div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {artist.genres.map(g => <span key={g} className="tag tag-purple">{g}</span>)}
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xs text-muted mb-1">Instruments</div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {artist.instruments.map(i => <span key={i} className="tag">{i}</span>)}
            </div>
          </div>
        </div>

        {artist.portfolio.length > 0 && (
          <div className="card">
            <h2 className="section-title" style={{ fontSize: '1.1rem' }}>Portfolio</h2>
            {artist.portfolio.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: i < artist.portfolio.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: 40, height: 40, background: 'var(--bg3)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Disc size={18} style={{ color: 'var(--accent2)' }} />
                </div>
                <div>
                  <div className="fw-600 text-sm">{item.title}</div>
                  <div className="text-xs text-muted">{item.type} · {item.year}</div>
                </div>
                <button
                  className="btn btn-outline"
                  style={{ marginLeft: 'auto', fontSize: '0.8rem', padding: '0.3rem 0.7rem' }}
                  onClick={() => play({ title: item.title, artist: artist.displayName, color: artistColor })}
                >
                  <ExternalLink size={13} /> Listen
                </button>
              </div>
            ))}
          </div>
        )}

        {artist.musicUrl && (
          <MusicEmbed url={artist.musicUrl} />
        )}

        {!currentUser && (
          <div className="card mt-2" style={{ textAlign: 'center', background: 'rgba(124,58,237,0.08)' }}>
            <p className="text-muted mb-2">Join The Circle to follow artists, send collab requests, and more.</p>
            <button className="btn btn-primary" onClick={() => setShowLead(true)}>Follow {artist.displayName}</button>
          </div>
        )}

        {showLead && (
          <LeadCaptureModal
            source={`follow-${artist.id}`}
            heading={`Follow ${artist.displayName}`}
            subheading="Get notified when they post new music, gigs, and collab requests."
            onClose={() => setShowLead(false)}
          />
        )}
      </div>
    </>
  );
}
