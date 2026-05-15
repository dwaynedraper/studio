import { ImageResponse } from 'next/og';

export const alt = 'Sharp Sighted Studio — The Channel · Community · The 10%';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#111110',
          fontFamily: 'sans-serif',
          padding: '80px',
          gap: '28px',
        }}
      >
        {/* Terracotta aperture */}
        <svg width="72" height="72" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#a0462a" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="3.5" fill="#a0462a" />
          <line x1="12" y1="2" x2="12" y2="8.5" stroke="#a0462a" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="12" y1="15.5" x2="12" y2="22" stroke="#a0462a" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="2" y1="12" x2="8.5" y2="12" stroke="#a0462a" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="15.5" y1="12" x2="22" y2="12" stroke="#a0462a" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="4.93" y1="4.93" x2="9.52" y2="9.52" stroke="#a0462a" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="14.48" y1="14.48" x2="19.07" y2="19.07" stroke="#a0462a" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="19.07" y1="4.93" x2="14.48" y2="9.52" stroke="#a0462a" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="9.52" y1="14.48" x2="4.93" y2="19.07" stroke="#a0462a" strokeWidth="1.5" strokeLinecap="round" />
        </svg>

        {/* Wordmark — cyan, because this is "Sharp Sighted" (the umbrella name) */}
        <div
          style={{
            fontSize: '44px',
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#38bdf8',
            display: 'flex',
          }}
        >
          Sharp Sighted
          <span style={{ color: '#a0462a', marginLeft: '0.5em' }}>· Studio</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '20px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#7a746c',
          }}
        >
          Stay Sharp. Stay Seen. Stay Human.
        </div>

        {/* Separator */}
        <div
          style={{
            width: '320px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #a0462a, transparent)',
            opacity: 0.55,
            marginTop: '8px',
          }}
        />

        {/* Subline */}
        <div
          style={{
            fontSize: '16px',
            color: '#7a746c',
            letterSpacing: '0.06em',
          }}
        >
          sharpsighted.studio
        </div>
      </div>
    ),
    { ...size }
  );
}
