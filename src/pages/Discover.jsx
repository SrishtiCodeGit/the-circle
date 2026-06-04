import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Music, Users } from 'lucide-react';
import { MOCK_ARTISTS, GENRES, CITIES } from '../data/mockData';
import './Discover.css';

function AvatarCircle({ artist, size = 52 }) {
  const colors = [
    ['#3b0764', '#6d28d9'], ['#1e1b4b', '#4338ca'],
    ['#701a75', '#a21caf'], ['#064e3b', '#059669'],
    ['#7f1d1d', '#dc2626'], ['#312e81', '#7c3aed'],
  ];
  const idx = artist.id.charCodeAt(1) % colors.length;
  const [from, to] = colors[idx];
  return (
    <div
      className="avatar"
      style={{
        width: size, height: size,
        fontSize: size * 0.32,
        background: `linear-gradient(135deg, ${from}, ${to})`,
        border: '1.5px solid rgba(255,255,255,0.08)',
        letterSpacing: '-0.02em',
      }}
    >
      {artist.initials}
    </div>
  );
}

export default function Discover() {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [city, setCity] = useState('');

  const filtered = MOCK_ARTISTS.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.displayName.toLowerCase().includes(q) || a.bio.toLowerCase().includes(q);
    const matchGenre = !genre || a.genres.includes(genre);
    const matchCity = !city || a.location === city;
    return matchSearch && matchGenre && matchCity;
  });

  return (
    <div className="page">
      <div className="discover-header">
        <h1 className="page-title">Discover Artists</h1>
        <p className="text-muted text-sm mt-1">Find independent musicians across India</p>
      </div>

      <div className="discover-filters">
        <div className="search-box">
          <Search size={15} className="search-icon" />
          <input
            placeholder="Search by name, genre, bio..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select value={city} onChange={e => setCity(e.target.value)}>
          <option value="">All Cities</option>
          {CITIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Genre pill row */}
      <div className="genre-pills-row">
        <button
          className={`genre-pill ${genre === '' ? 'active' : ''}`}
          onClick={() => setGenre('')}
        >All</button>
        {GENRES.map(g => (
          <button
            key={g}
            className={`genre-pill ${genre === g ? 'active' : ''}`}
            onClick={() => setGenre(genre === g ? '' : g)}
          >{g}</button>
        ))}
      </div>

      <p className="result-count">{filtered.length} artist{filtered.length !== 1 ? 's' : ''} found</p>

      <div className="grid-3" key={genre + city}>
        {filtered.map(artist => (
          <Link to={`/artist/${artist.id}`} key={artist.id} className="card artist-card">
            <div className="artist-card-top">
              <AvatarCircle artist={artist} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="fw-700" style={{ fontSize: '0.95rem', letterSpacing: '-0.01em' }}>{artist.displayName}</div>
                <div className="flex-center gap-05 text-xs text-muted mt-1">
                  <MapPin size={10} /> {artist.location}
                </div>
              </div>
              {artist.open && <span className="tag tag-green">Open</span>}
            </div>

            <p className="text-sm text-muted mt-2" style={{ lineHeight: 1.65, fontSize: '0.82rem' }}>{artist.bio}</p>

            <div className="artist-genres mt-2">
              {artist.genres.map(g => <span key={g} className="tag tag-purple">{g}</span>)}
              {artist.instruments.slice(0, 2).map(i => <span key={i} className="tag">{i}</span>)}
            </div>

            <div className="divider" style={{ margin: '1rem 0 0.75rem' }} />

            <div className="artist-stats">
              <span className="flex-center gap-05 text-xs text-muted">
                <Users size={11} /> {artist.followers.toLocaleString()}
              </span>
              <span className="flex-center gap-05 text-xs text-muted">
                <Music size={11} /> {artist.portfolio.length} release{artist.portfolio.length !== 1 ? 's' : ''}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <Music size={36} style={{ color: 'var(--text3)' }} />
          <p>No artists match your filters.</p>
        </div>
      )}
    </div>
  );
}
