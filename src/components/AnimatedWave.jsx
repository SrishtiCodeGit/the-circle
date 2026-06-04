import './AnimatedWave.css';

// Heights for a natural-looking live equalizer
const BARS = [3,6,9,14,10,6,12,16,11,7,4,8,13,17,12,8,5,10,15,9,6,3,7,11,16,13,8,5,9,14,10,6];

export default function AnimatedWave({ height = 56, color = 'var(--accent2)' }) {
  return (
    <div className="anim-wave" style={{ height }}>
      {BARS.map((maxH, i) => (
        <div
          key={i}
          className="anim-bar"
          style={{
            '--max-h': `${maxH}px`,
            '--delay': `${(i * 0.09) % 1.6}s`,
            '--dur': `${0.7 + (i % 5) * 0.13}s`,
            background: color,
            height: maxH,
          }}
        />
      ))}
    </div>
  );
}
