import type { CollectionConfig } from 'payload'

export const RepresentativeMatters: CollectionConfig = {
  slug: 'representative-matters',
  admin: {
    useAsTitle: 'title',
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
      name: 'practiceArea',
      type: 'relationship',
      relationTo: 'practice-areas',
    },
    {
      name: 'challenge',
      type: 'richText',
      localized: true,
    },
    {
      name: 'approach',
      type: 'richText',
      localized: true,
    },
    {
      name: 'outcome',
      type: 'richText',
      localized: true,
    },
    {
      name: 'year',
      type: 'number',
    },
    {
      name: 'anonymized',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
