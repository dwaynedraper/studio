/**
 * Small shared registry of brand constants. Lives here so /about, /404,
 * and footer (and later /join, the homepage Network block) can share a
 * single source. Visual treatment differs per surface, but the data and
 * URLs do not.
 */

export type Pillar = 'sharp' | 'seen' | 'human';

export interface PillarDef {
  id: Pillar;
  name: string;
  tagline: string;
  accentVar: string; /* CSS variable for the pillar accent in dark mode */
  hex: string;        /* hardcoded hex for places where we can't use --vars (icons, OG cards) */
  description: string;
}

export const PILLARS: PillarDef[] = [
  {
    id: 'sharp',
    name: 'Sharp',
    tagline: 'Tuned. Fit. Your best self.',
    accentVar: 'var(--color-gold-dark)',
    hex: '#c9922a',
    description:
      'Presenting at your highest level — your body, your image, your space, your craft. The discipline of refining the surface so what’s underneath comes through clearly.',
  },
  {
    id: 'seen',
    name: 'Seen',
    tagline: 'Authentic visibility. Standing in your truth.',
    accentVar: 'var(--color-brand-cyan)',
    hex: '#38bdf8',
    description:
      'Being truly seen — which requires authenticity — and being seen in a sea of millions — which requires cutting through the noise.',
  },
  {
    id: 'human',
    name: 'Human',
    tagline: 'Community. Warmth. The 10%.',
    accentVar: 'var(--color-rust)',
    hex: '#a0462a',
    description:
      'Collaboration with other creatives, genuine connection with clients, the feel-good fabric of the work. Home of the 10% Rule.',
  },
];

export interface PropertyDef {
  id: 'photos' | 'media' | 'studio' | 'hub';
  label: string;
  fullName: string;
  domain: string;
  href: string;
  pillar: Pillar | null; /* hub has no primary pillar */
  pillarHex: string;
  identity: string;
  blurb: string;
}

export const PROPERTIES: PropertyDef[] = [
  {
    id: 'photos',
    label: 'Photos',
    fullName: 'Sharp Sighted Photos',
    domain: 'sharpsighted.photos',
    href: 'https://sharpsighted.photos',
    pillar: 'seen',
    pillarHex: '#38bdf8',
    identity: 'Telling your story.',
    blurb:
      'Lifestyle and corporate portrait work for founders, executives, and remarkable humans whose story doesn’t fit a generic studio backdrop.',
  },
  {
    id: 'media',
    label: 'Media',
    fullName: 'Sharp Sighted Media',
    domain: 'sharpsighted.media',
    href: 'https://sharpsighted.media',
    pillar: 'sharp',
    pillarHex: '#c9922a',
    identity: 'Tuning your space.',
    blurb:
      'Premium real estate media for top-producing agents in the 121 corridor. Five-deliverable Essentials Package; quarterly Visibility Retainer.',
  },
  {
    id: 'studio',
    label: 'Studio',
    fullName: 'Sharp Sighted Studio',
    domain: 'sharpsighted.studio',
    href: 'https://sharpsighted.studio',
    pillar: 'human',
    pillarHex: '#a0462a',
    identity: 'Building the community.',
    blurb:
      'The connective tissue. Community, behind-the-scenes, the 10% Rule, the journal, the series. You’re here.',
  },
  {
    id: 'hub',
    label: 'Hub',
    fullName: 'Sharp Sighted (umbrella)',
    domain: 'sharpsightedstudio.com',
    href: 'https://sharpsightedstudio.com',
    pillar: null,
    pillarHex: '#38bdf8',
    identity: 'Three doors. One studio.',
    blurb:
      'The umbrella hub. Routes visitors to the right specialist site. Preserves the legal entity name.',
  },
];

/**
 * Discord invite — env-var driven for v1. Sanity siteSettings.
 * discordInviteUrl will override once Sanity is populated (step 10).
 * Falls back to a placeholder so links never crash; the placeholder
 * surfaces a clear "set DISCORD_INVITE_URL" message in dev.
 */
export const DISCORD_INVITE_URL =
  process.env.DISCORD_INVITE_URL ?? 'https://discord.gg/sharpsightedstudio';

/* Contact constants — single source of truth across the brand. */
export const CONTACT = {
  email: 'dean@sharpsightedstudio.com',
  emailHref: 'mailto:dean@sharpsightedstudio.com',
  phoneDisplay: '(214) 233-5338',
  phoneHref: 'tel:+12142335338',
  serviceArea: '121 corridor + DFW',
};

export const TAGLINE = 'Stay Sharp. Stay Seen. Stay Human.';
