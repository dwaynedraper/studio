import type { Metadata } from 'next';
import { Playfair_Display, Montserrat } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import { Providers } from './providers';

const PLAUSIBLE_SCRIPT = process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT;

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
  style: ['normal', 'italic'],
});

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
});

const SITE_URL = 'https://sharpsighted.studio';

/**
 * Root layout. Stays minimal so /studio (Sanity Studio mount) can render
 * full-bleed without inheriting Nav/Footer/HubReturnToast. The public
 * site chrome lives in src/app/(site)/layout.tsx, which wraps everything
 * inside the (site) route group.
 */

export const metadata: Metadata = {
  title: {
    template: '%s — Sharp Sighted Studio',
    default: 'Sharp Sighted Studio — The Channel · Community · The 10%',
  },
  description:
    'A small collective of photographers, videographers, and the people who care about the craft. Read the journal, see the work, join the conversation.',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    siteName: 'Sharp Sighted Studio',
    locale: 'en_US',
    images: ['/opengraph-image.png'],
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://sharpsightedstudio.com/#organization',
      name: 'Sharp Sighted Studio',
      legalName: 'Sharp Sighted Studio',
      url: 'https://sharpsightedstudio.com',
      telephone: '+12142335338',
      email: 'dean@sharpsightedstudio.com',
      founder: { '@type': 'Person', name: 'Dean Draper' },
      foundingDate: '2022-07',
    },
    {
      '@type': 'Organization',
      '@id': 'https://sharpsighted.studio/#organization',
      name: 'Sharp Sighted Studio',
      legalName: 'Sharp Sighted Studio',
      alternateName: ['Sharp Sighted Studio Channel', 'Sharp Sighted'],
      description: 'The community channel for Sharp Sighted Studio. Behind-the-scenes, photographer collective, education, and the 10% rule in practice.',
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      telephone: '+12142335338',
      email: 'dean@sharpsightedstudio.com',
      founder: { '@type': 'Person', name: 'Dean Draper' },
      foundingDate: '2022-07',
      parentOrganization: { '@id': 'https://sharpsightedstudio.com/#organization' },
      areaServed: [
        'Allen, TX', 'Plano, TX', 'Frisco, TX', 'McKinney, TX',
        'Lewisville, TX', 'The Colony, TX', 'Coppell, TX', 'Roanoke, TX',
        'Denton, TX', 'Grapevine, TX', 'Southlake, TX', 'Colleyville, TX',
        'Westlake, TX',
      ],
      sameAs: [
        'https://sharpsightedstudio.com',
        'https://sharpsighted.photos',
        'https://sharpsighted.media',
        'https://www.instagram.com/sharp_sighted_studio',
        'https://www.facebook.com/sharpsightedstudio',
        'https://www.linkedin.com/in/dean-draper',
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${montserrat.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        {/* No-FOUC theme script — runs before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=localStorage.getItem('ss_theme');var sys=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';var r=(p==='light'||p==='dark')?p:sys;var root=document.documentElement;root.classList.remove('dark','light');root.classList.add(r);}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {PLAUSIBLE_SCRIPT && (
          <>
            <script async src={PLAUSIBLE_SCRIPT} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-screen flex flex-col font-sans">
        <Providers>{children}</Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
