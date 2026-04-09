import type { CollectionConfig } from 'payload'

export const TimelineEvents: CollectionConfig = {
  slug: 'timeline-events',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'year',
      type: 'number',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Career', value: 'career' },
        { label: 'Achievement', value: 'achievement' },
        { label: 'Speaking', value: 'speaking' },
        { label: 'Publication', value: 'publication' },
      ],
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
