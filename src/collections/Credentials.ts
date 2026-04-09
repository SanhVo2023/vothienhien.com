import type { CollectionConfig } from 'payload'

export const Credentials: CollectionConfig = {
  slug: 'credentials',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Education', value: 'education' },
        { label: 'Certification', value: 'certification' },
        { label: 'Membership', value: 'membership' },
        { label: 'Award', value: 'award' },
      ],
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'institution',
      type: 'text',
      localized: true,
    },
    {
      name: 'year',
      type: 'number',
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
