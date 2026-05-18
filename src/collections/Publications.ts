import type { CollectionConfig } from 'payload'

export const Publications: CollectionConfig = {
  slug: 'publications',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedDate', 'category'],
  },
  // Articles are public content rendered on the site; read access is open so
  // the sitemap and any downstream tooling can enumerate slugs without auth.
  // Write access stays admin-only (Payload default).
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Analysis', value: 'analysis' },
        { label: 'Guide', value: 'guide' },
        { label: 'Commentary', value: 'commentary' },
        { label: 'Case Study', value: 'case-study' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'practiceArea',
      type: 'relationship',
      relationTo: 'practice-areas',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      admin: {
        position: 'sidebar',
        description:
          'Byline. Default to "Apolo Editorial Team" — only set Vo Thien Hien for articles he personally authored.',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
