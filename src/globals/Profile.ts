import type { GlobalConfig } from 'payload'

export const Profile: GlobalConfig = {
  slug: 'profile',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'nameVi',
      type: 'text',
      required: true,
    },
    {
      name: 'nameEn',
      type: 'text',
      required: true,
    },
    {
      name: 'titleVi',
      type: 'text',
    },
    {
      name: 'titleEn',
      type: 'text',
    },
    {
      name: 'taglineVi',
      type: 'textarea',
    },
    {
      name: 'taglineEn',
      type: 'textarea',
    },
    {
      name: 'yearsExperience',
      type: 'number',
    },
    {
      name: 'casesHandled',
      type: 'number',
    },
    {
      name: 'jurisdictions',
      type: 'number',
    },
    {
      name: 'portrait',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'whatsapp',
      type: 'text',
    },
  ],
}
