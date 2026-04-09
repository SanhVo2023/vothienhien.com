import dns from 'dns'
import path from 'path'
import { fileURLToPath } from 'url'

// Force Node.js to prefer IPv4 — fixes Supabase IPv6-only DNS on some networks
dns.setDefaultResultOrder('ipv4first')
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import sharp from 'sharp'

// Collections
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { Pages } from './collections/Pages'
import { PracticeAreas } from './collections/PracticeAreas'
import { RepresentativeMatters } from './collections/RepresentativeMatters'
import { Publications } from './collections/Publications'
import { Perspectives } from './collections/Perspectives'
import { Credentials } from './collections/Credentials'
import { TimelineEvents } from './collections/TimelineEvents'
import { ContactSubmissions } from './collections/ContactSubmissions'

// Globals
import { SiteSettings } from './globals/SiteSettings'
import { Profile } from './globals/Profile'
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  secret: process.env.PAYLOAD_SECRET || 'default-secret-change-me',

  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  collections: [
    Media,
    Users,
    Pages,
    PracticeAreas,
    RepresentativeMatters,
    Publications,
    Perspectives,
    Credentials,
    TimelineEvents,
    ContactSubmissions,
  ],

  globals: [
    SiteSettings,
    Profile,
    Header,
    Footer,
  ],

  localization: {
    locales: [
      {
        label: 'Vietnamese',
        code: 'vi',
      },
      {
        label: 'English',
        code: 'en',
      },
    ],
    defaultLocale: 'vi',
    fallback: true,
  },

  editor: lexicalEditor(),

  db: postgresAdapter({
    push: process.env.NODE_ENV !== 'production',
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),

  plugins: [
    seoPlugin({
      collections: [
        'publications',
        'perspectives',
        'practice-areas',
        'representative-matters',
        'pages',
      ],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) =>
        `${typeof doc?.title === 'string' ? doc.title : 'Vo Thien Hien'} | Vo Thien Hien`,
      generateDescription: ({ doc }) =>
        typeof doc?.excerpt === 'string' ? doc.excerpt : '',
    }),
  ],

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  sharp,
})
