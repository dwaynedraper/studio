'use client';

/**
 * HubReturnToast — hub integration component.
 *
 * Always styled in cyan (#38bdf8). This component represents the Sharp Sighted
 * umbrella (sharpsightedstudio.com), not the host branch site. Do NOT swap the
 * color to Studio's terracotta accent — the toast is the umbrella, not the host.
 *
 * Lifecycle:
 *   ?from=hub in URL → visible for 15s → auto-minimizes → persists as pill for session
 *   X button → dismissed for session
 *   sessionStorage key: ss_hub_toast_state  (values: 'minimized' | 'dismissed')
 *
 * Copied as-is from /projects/sharp/photos/src/components/HubReturnToast.tsx
 * per hub-integration.md §4.2. Brand-agnostic by design.
 */

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { plausible } from '@/lib/plausible';

type ToastState = 'idle' | 'visible' | 'minimizing' | 'minimized' | 'dismissed';

const HUB_URL = 'https://sharpsightedstudio.com/?hub=true';
const CYAN = '#38bdf8';
const TOAST_TEXT = '#0c4a6e';
const VISIBLE_DURATION_MS = 15_000;
const MINIMIZE_DURATION_MS = 300;

export default function HubReturnToast() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [state, setState] = useState<ToastState>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* eslint-disable react-hooks/set-state-in-effect -- syncing with sessionStorage + URL params, both external state */
  useEffect(() => {
    const stored = sessionStorage.getItem('ss_hub_toast_state') as
      | 'minimized'
      | 'dismissed'
      | null;

    if (stored === 'dismissed') {
      setState('dismissed');
      return;
    }

    if (stored === 'minimized') {
      setState('minimized');
      return;
    }

    if (searchParams.get('from') === 'hub') {
      plausible('hub_referral_landed');

      // Strip ?from=hub (and UTM params) from the URL immediately
      const params = new URLSearchParams(searchParams.toString());
      params.delete('from');
      params.delete('utm_source');
      params.delete('utm_medium');
      const newUrl = params.size > 0 ? `${pathname}?${params.toString()}` : pathname;
      router.replace(newUrl);

      setState('visible');

      timerRef.current = setTimeout(() => {
        if (prefersReduced) {
          setState('minimized');
          sessionStorage.setItem('ss_hub_toast_state', 'minimized');
        } else {
          setState('minimizing');
          setTimeout(() => {
            setState('minimized');
            sessionStorage.setItem('ss_hub_toast_state', 'minimized');
          }, MINIMIZE_DURATION_MS);
        }
      }, VISIBLE_DURATION_MS);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  /* eslint-enable react-hooks/set-state-in-effect */

  function dismiss() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setState('dismissed');
    sessionStorage.setItem('ss_hub_toast_state', 'dismissed');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape' && state === 'visible') dismiss();
  }

  if (state === 'idle' || state === 'dismissed') return null;

  /* ─── Minimized pill ──────────────────────────────────────────────── */
  if (state === 'minimized') {
    return (
      <button
        onClick={() => {
          window.location.href = HUB_URL;
        }}
        aria-label="Return to Sharp Sighted hub"
        title="Return to Sharp Sighted hub"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          width: '40px',
          height: '40px',
          background: CYAN,
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 9999,
          outline: 'none',
          boxShadow: '0 4px 16px rgba(0,0,0,0.22)',
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = `2px solid ${CYAN}`;
          e.currentTarget.style.outlineOffset = '2px';
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = 'none';
        }}
      >
        <ReturnArrowIcon />
      </button>
    );
  }

  /* ─── Visible / minimizing toast ─────────────────────────────────── */
  const isMinimizing = state === 'minimizing';
  const textOpacity = isMinimizing ? 0 : 1;

  return (
    <div
      role="status"
      aria-live="polite"
      onKeyDown={handleKeyDown}
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        background: CYAN,
        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
        overflow: 'hidden',
        maxWidth: isMinimizing ? '40px' : '320px',
        width: isMinimizing ? '40px' : 'auto',
        transition: prefersReduced
          ? 'none'
          : `max-width ${MINIMIZE_DURATION_MS}ms cubic-bezier(0.4,0,0.2,1)`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: isMinimizing ? '0.75rem' : '1rem 1.25rem',
          gap: '0.75rem',
          transition: prefersReduced
            ? 'none'
            : `padding ${MINIMIZE_DURATION_MS}ms cubic-bezier(0.4,0,0.2,1)`,
          minWidth: isMinimizing ? 0 : undefined,
        }}
      >
        {/* Return icon — always visible, scales up on minimize */}
        <a
          href={HUB_URL}
          style={{
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            transform: isMinimizing ? 'scale(1.15)' : 'scale(1)',
            transition: prefersReduced
              ? 'none'
              : `transform ${MINIMIZE_DURATION_MS}ms cubic-bezier(0.4,0,0.2,1)`,
          }}
          aria-hidden={isMinimizing ? true : undefined}
          tabIndex={isMinimizing ? -1 : undefined}
        >
          <ReturnArrowIcon color={TOAST_TEXT} />
        </a>

        {/* Text */}
        <a
          href={HUB_URL}
          style={{
            flex: 1,
            textDecoration: 'none',
            opacity: textOpacity,
            transition: prefersReduced ? 'none' : `opacity ${MINIMIZE_DURATION_MS / 2}ms ease`,
            whiteSpace: 'nowrap',
          }}
        >
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: TOAST_TEXT,
              lineHeight: 1.25,
              fontFamily: 'inherit',
            }}
          >
            You were redirected from Sharp Sighted Studio.
          </div>
          <div
            style={{
              fontSize: '0.78rem',
              color: TOAST_TEXT,
              marginTop: '0.15rem',
              fontFamily: 'inherit',
              textDecoration: 'underline',
              textDecorationColor: `${TOAST_TEXT}66`,
            }}
          >
            Return to hub →
          </div>
        </a>

        {/* Dismiss button */}
        <button
          onClick={dismiss}
          aria-label="Dismiss return-to-hub notification"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.25rem',
            color: TOAST_TEXT,
            fontSize: '1.1rem',
            lineHeight: 1,
            flexShrink: 0,
            opacity: textOpacity,
            transition: prefersReduced ? 'none' : `opacity ${MINIMIZE_DURATION_MS / 2}ms ease`,
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

function ReturnArrowIcon({ color = '#fff' }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M10 3L5 8l5 5"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5 8h8" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
