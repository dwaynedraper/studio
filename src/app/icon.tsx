import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

/**
 * Studio favicon — terracotta aperture (Human pillar).
 * Hub and Photos use cyan apertures; Media uses gold. The aperture mark
 * itself is identical across all four properties — only the color changes.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
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
      </div>
    ),
    { ...size }
  );
}
