import { DISCORD_INVITE_URL } from '@/lib/branding';

/**
 * Discuss-in-Discord CTA — bottom of every journal post per
 * studio-architecture.md §7.2. Prefers a post-specific channel URL
 * when one's set on the journalPost (Sanity field
 * `discordChannelUrl`); falls back to the brand-wide invite link
 * supplied via env / Sanity siteSettings (resolved upstream).
 */
export function DiscordCTA({
  channelUrl,
  label = 'Discuss in Discord',
  helper = 'Pick up the conversation in the channel.',
}: {
  channelUrl?: string | null;
  label?: string;
  helper?: string;
}) {
  const href = channelUrl || DISCORD_INVITE_URL;
  return (
    <div
      className="surface-card flex flex-col sm:flex-row gap-5 sm:items-center sm:justify-between"
      style={{ background: 'var(--surface-warm-2)' }}
    >
      <div>
        <p
          className="text-xs tracking-[0.22em] uppercase mb-2"
          style={{ color: 'var(--accent)' }}
        >
          Keep going
        </p>
        <p
          className="font-serif italic leading-snug"
          style={{ fontSize: '1.3rem', color: 'var(--text)' }}
        >
          {helper}
        </p>
      </div>
      <a
        href={href}
        rel="noopener noreferrer"
        className="btn-primary shrink-0"
      >
        {label} →
      </a>
    </div>
  );
}
