// Waveform logo: two peaked T-bursts flanking a U-shaped valley
// Bars are symmetric (audio waveform — up AND down from center line)

// Each entry = { x offset, half-height }
// T sections: sharp central peak  |  U section: smooth low valley curve
const BARS = [
  // — T (first) —  sharp burst with flanking bars
  { x: 5,  h: 6  },
  { x: 8,  h: 10 },
  { x: 11, h: 14 },
  { x: 14, h: 10 },
  { x: 17, h: 6  },
  // — U (middle) — low sustained valley
  { x: 21, h: 4  },
  { x: 24, h: 3  },
  { x: 27, h: 3  },
  { x: 30, h: 4  },
  // — T (second) — mirror of first
  { x: 34, h: 6  },
  { x: 37, h: 10 },
  { x: 40, h: 14 },
  { x: 43, h: 10 },
  { x: 46, h: 6  },
];

const VW = 52;
const VH = 40;
const CY = VH / 2;
const BW = 2.6;

export default function Logo({ size = 36, textSize = '1.1rem', iconOnly = false }) {
  const iconW = size * 1.4;
  const iconH = size * 0.82;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
      <svg
        width={iconW}
        height={iconH}
        viewBox={`0 0 ${VW} ${VH}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          {/* Main waveform gradient: purple → pink → orange */}
          <linearGradient id="waveGrad" x1="0" y1="0" x2={VW} y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#7c3aed" />
            <stop offset="40%"  stopColor="#a855f7" />
            <stop offset="70%"  stopColor="#ec4899" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
          {/* Subtle glow on bars */}
          <filter id="barGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Center baseline (subtle) */}
        <line
          x1="2" y1={CY} x2={VW - 2} y2={CY}
          stroke="rgba(168,85,247,0.15)"
          strokeWidth="0.8"
          strokeDasharray="2 3"
        />

        {/* Waveform bars — symmetric up & down */}
        {BARS.map((bar, i) => (
          <rect
            key={i}
            x={bar.x - BW / 2}
            y={CY - bar.h}
            width={BW}
            height={bar.h * 2}
            rx={BW / 2}
            fill="url(#waveGrad)"
            filter="url(#barGlow)"
          />
        ))}
      </svg>

      {!iconOnly && (
        <span style={{
          fontSize: textSize,
          fontWeight: 800,
          letterSpacing: '-0.03em',
          fontFamily: "'Syne', 'Inter', sans-serif",
          color: 'var(--logo-text)',
          whiteSpace: 'nowrap',
        }}>
          Circle
        </span>
      )}
    </div>
  );
}
