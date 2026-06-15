import { MetadataRoute } from 'next';

/**
 * Allow everyone, and explicitly welcome the major AI / answer-engine crawlers
 * so Sharp Sighted Studio can be read and cited by ChatGPT, Claude, Perplexity,
 * Google AI, Bing/Copilot, and Apple. Being explicit signals intent and
 * future-proofs against default-deny changes.
 */
const AI_BOTS = [
  'GPTBot',            // OpenAI (training)
  'OAI-SearchBot',     // OpenAI (search/citations)
  'ChatGPT-User',      // ChatGPT live browsing
  'ClaudeBot',         // Anthropic (training)
  'anthropic-ai',      // Anthropic (legacy)
  'Claude-Web',        // Claude browsing
  'PerplexityBot',     // Perplexity index
  'Perplexity-User',   // Perplexity live fetch
  'Google-Extended',   // Google Gemini / AI Overviews (opt-in)
  'Applebot-Extended', // Apple Intelligence (opt-in)
  'CCBot',             // Common Crawl (feeds many models)
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: '/' })),
    ],
    sitemap: 'https://sharpsighted.studio/sitemap.xml',
    host: 'https://sharpsighted.studio',
  };
}
