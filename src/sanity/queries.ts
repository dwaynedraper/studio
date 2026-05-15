import { defineQuery } from 'next-sanity';

/**
 * Centralized GROQ queries. Defined here so step 5 (series), step 6
 * (journal), step 8 (10% archive), step 9 (feed), and step 10 (homepage
 * assembly) can all consume the same canonical shapes.
 *
 * Conventions:
 *   - All "list" queries are ordered (newest/most-relevant first).
 *   - Published-only filters: status == "published" for journalPost.
 *   - Projections keep the surface tight — avoid `*[]` without a filter.
 */

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0]{
    title,
    description,
    discordInviteUrl,
    defaultDiscussChannelUrl,
    officialAccounts,
    tagline,
  }
`);

/* ─── Contributors ───────────────────────────────────────────────────── */

export const contributorsListQuery = defineQuery(`
  *[_type == "contributor"] | order(name asc) {
    _id,
    name,
    "handle": handle.current,
    role,
    bio,
    avatar,
    externalWork,
    permissionRole,
    socials,
    feedIncluded,
  }
`);

export const contributorByHandleQuery = defineQuery(`
  *[_type == "contributor" && handle.current == $handle][0]{
    _id,
    name,
    "handle": handle.current,
    role,
    bio,
    longBio,
    avatar,
    externalWork,
    permissionRole,
    socials,
  }
`);

export const feedIncludedContributorsQuery = defineQuery(`
  *[_type == "contributor" && feedIncluded == true]{
    _id,
    name,
    "handle": handle.current,
    socials,
  }
`);

/* ─── Series ─────────────────────────────────────────────────────────── */

export const seriesListQuery = defineQuery(`
  *[_type == "series"] | order(order asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    tagline,
    badge,
    pillar,
    coverImage,
    externalHomeUrl,
  }
`);

export const seriesSlugsQuery = defineQuery(`
  *[_type == "series" && defined(slug.current)][].slug.current
`);

export const seriesBySlugQuery = defineQuery(`
  *[_type == "series" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    tagline,
    badge,
    pillar,
    description,
    coverImage,
    externalHomeUrl,
    "primaryAuthor": primaryAuthor->{
      _id, name, "handle": handle.current, role, avatar, externalWork
    },
    "posts": *[_type == "journalPost" && status == "published" && references(^._id)]
      | order(publishedAt desc){
        _id,
        title,
        "slug": slug.current,
        excerpt,
        coverImage,
        publishedAt,
        "author": author->{ _id, name, "handle": handle.current, role, avatar }
      }
  }
`);

/* ─── Journal ────────────────────────────────────────────────────────── */

const POST_CARD = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  coverImage,
  publishedAt,
  tags,
  "author": author->{ _id, name, "handle": handle.current, role, avatar },
  "series": series->{ _id, title, "slug": slug.current, pillar }
`;

export const journalIndexQuery = defineQuery(`
  *[_type == "journalPost" && status == "published"]
    | order(publishedAt desc)
    [$start...$end]{
      ${POST_CARD}
    }
`);

export const journalIndexCountQuery = defineQuery(`
  count(*[_type == "journalPost" && status == "published"])
`);

export const journalByAuthorQuery = defineQuery(`
  *[_type == "journalPost" && status == "published" && author->handle.current == $handle]
    | order(publishedAt desc)
    [$start...$end]{
      ${POST_CARD}
    }
`);

export const journalBySeriesQuery = defineQuery(`
  *[_type == "journalPost" && status == "published" && series->slug.current == $series]
    | order(publishedAt desc)
    [$start...$end]{
      ${POST_CARD}
    }
`);

export const journalByTagQuery = defineQuery(`
  *[_type == "journalPost" && status == "published" && $tag in tags]
    | order(publishedAt desc)
    [$start...$end]{
      ${POST_CARD}
    }
`);

export const journalPostBySlugQuery = defineQuery(`
  *[_type == "journalPost" && slug.current == $slug && status == "published"][0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage,
    publishedAt,
    tags,
    body,
    discordChannelUrl,
    "author": author->{
      _id, name, "handle": handle.current, role, bio, avatar, externalWork, socials
    },
    "series": series->{
      _id, title, "slug": slug.current, tagline, pillar, badge
    },
    "related": *[_type == "journalPost" && status == "published" && _id != ^._id
      && (author._ref == ^.author._ref || series._ref == ^.series._ref)]
      | order(publishedAt desc) [0...3]{
        ${POST_CARD}
      }
  }
`);

export const journalLatestQuery = defineQuery(`
  *[_type == "journalPost" && status == "published"]
    | order(publishedAt desc)[0...4]{
      ${POST_CARD}
    }
`);

export const journalSlugsQuery = defineQuery(`
  *[_type == "journalPost" && status == "published" && defined(slug.current)][].slug.current
`);

/* ─── 10% Archive ────────────────────────────────────────────────────── */

export const tenPercentListQuery = defineQuery(`
  *[_type == "tenPercentEntry"] | order(dateCompleted desc){
    _id,
    title,
    "slug": slug.current,
    coverImage,
    partnerOrganization,
    dateCompleted,
    category,
  }
`);

export const tenPercentBySlugQuery = defineQuery(`
  *[_type == "tenPercentEntry" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    coverImage,
    partnerOrganization,
    dateCompleted,
    category,
    body,
    gallery,
  }
`);

export const tenPercentFeaturedQuery = defineQuery(`
  *[_type == "tenPercentEntry"] | order(dateCompleted desc)[0]{
    _id,
    title,
    "slug": slug.current,
    coverImage,
    partnerOrganization,
    dateCompleted,
    category,
  }
`);

export const tenPercentSlugsQuery = defineQuery(`
  *[_type == "tenPercentEntry" && defined(slug.current)][].slug.current
`);
