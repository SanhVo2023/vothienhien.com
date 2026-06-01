import dns from 'dns'
import path from 'path'
import { fileURLToPath } from 'url'

// Force Node.js to prefer IPv4 — fixes Supabase IPv6-only DNS on some networks
dns.setDefaultResultOrder('ipv4first')
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import {
  lexicalEditor,
  HeadingFeature,
  BlockquoteFeature,
  LinkFeature,
  UnorderedListFeature,
  OrderedListFeature,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  StrikethroughFeature,
  InlineCodeFeature,
  HorizontalRuleFeature,
  UploadFeature,
  FixedToolbarFeature,
} from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { s3Storage } from '@payloadcms/storage-s3'
import sharp from 'sharp'

// Collections
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { Authors } from './collections/Authors'
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

// Origins the admin may send authenticated (cookie) requests from. Payload only
// auto-trusts `serverURL` for CSRF, so the custom domain MUST be listed here or
// every admin mutation (save/update) 403s when accessed via that domain.
const ADMIN_ORIGINS = [
  'https://vothienhien.com',
  'https://www.vothienhien.com',
  process.env.NEXT_PUBLIC_SITE_URL,
  'http://localhost:3000',
].filter(Boolean) as string[]

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  secret: process.env.PAYLOAD_SECRET || 'default-secret-change-me',
  cors: ADMIN_ORIGINS,
  csrf: ADMIN_ORIGINS,

  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  collections: [
    Media,
    Users,
    Authors,
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

  editor: lexicalEditor({
    features: () => [
      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
      BlockquoteFeature(),
      LinkFeature({ enabledCollections: ['pages'] }),
      UnorderedListFeature(),
      OrderedListFeature(),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      StrikethroughFeature(),
      InlineCodeFeature(),
      HorizontalRuleFeature(),
      UploadFeature({ collections: { media: { fields: [] } } }),
      FixedToolbarFeature(),
    ],
  }),

  db: postgresAdapter({
    // `push: true` made Payload run a Drizzle schema introspection ("Pulling
    // schema from database…") on first init, which hangs indefinitely against
    // the pooled Supabase connection — the admin panel never loads. The schema
    // is already in place and the project rule is "no DDL outside payload
    // migrate", so auto-push is disabled. Run `npx payload migrate` for changes.
    push: false,
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

    // Store Media uploads in Cloudflare R2 (S3-compatible) instead of the local
    // filesystem — REQUIRED on Vercel, whose serverless FS is read-only (this is
    // why uploads/saving articles-with-images failed). No `prefix` is set, so no
    // new DB column is added (avoids a migration); files land at the bucket root
    // and are served directly from the public R2 URL.
    s3Storage({
      collections: {
        media: {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename }) => `${process.env.R2_PUBLIC_URL}/${filename}`,
        },
      },
      bucket: process.env.R2_BUCKET_NAME || 'apolowebsite',
      config: {
        region: 'auto',
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
      },
    }),
  ],

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  sharp,
})
