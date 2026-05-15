type PlausibleProps = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: PlausibleProps }) => void;
  }
}

export function plausible(event: string, options?: { props?: PlausibleProps }) {
  if (typeof window !== 'undefined' && typeof window.plausible === 'function') {
    window.plausible(event, options);
  }
}
