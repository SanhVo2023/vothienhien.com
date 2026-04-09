import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'ecosystemLinks',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
        },
      ],
    },
    {
      name: 'address1',
      type: 'text',
    },
    {
      name: 'address2',
      type: 'text',
    },
    {
      name: 'copyright',
      type: 'text',
      localized: true,
    },
  ],
}
