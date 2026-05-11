import type { CollectionConfig } from 'payload'

/**
 * Authors — public byline records, separate from Users (which are admin
 * login accounts). Reuses the editorial-team pattern from law.pro.vn.
 *
 * Two canonical slugs in the ecosystem:
 *   - `editorial-team`   → Apolo Editorial Team (default for non-Hien posts)
 *   - `vo-thien-hien`    → Mr Hien himself, only on articles he personally authored
 */
export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'role'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Display name shown as the article byline. Localized.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'URL-friendly identifier. Canonical values: editorial-team, vo-thien-hien.',
      },
    },
    {
      name: 'role',
      type: 'text',
      localized: true,
      admin: {
        description: 'e.g. "Managing Partner", "Apolo Editorial Team", "Senior Associate".',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Short bio shown on the author detail page or article footer.',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional headshot or team-mark.',
      },
    },
  ],
}
