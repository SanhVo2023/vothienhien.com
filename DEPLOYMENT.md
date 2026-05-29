# Deployment Guide — vothienhien.com (Vercel)

The site is a Next.js 16 app with an embedded PayloadCMS admin, deployed to
**Vercel**, backed by **Supabase Postgres** (Apolo Authority project, Seoul).

---

## 1. Environment variables (required)

Set these in **Vercel → Project → Settings → Environment Variables**, scope
**Production** (and **Preview**). The exact values live in your local `.env`
(and `PM_CREDENTIALS.md`). A ready-to-import file is provided: **`.env.vercel`**
(use Vercel’s *Import .env* and paste it). **Delete `.env.vercel` after importing
— it contains secrets.**

| Variable | Notes |
|---|---|
| `DATABASE_URI` | Supabase **Session Pooler** URI (`...pooler.supabase.com:5432`). IPv4 — required for Vercel serverless. |
| `PAYLOAD_SECRET` | Payload auth/encryption secret. Must match build & runtime. |
| `NEXT_PUBLIC_SITE_URL` | **The live URL** (e.g. `https://vothienhien.com`). **Never** `localhost` in prod — it feeds sitemap, canonical, OG and `metadataBase`. |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | `vi` |
| `NEXT_PUBLIC_SUPABASE_URL` | From `.env`. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From `.env`. |
| `CONTACT_HUB_URL` | Google Apps Script endpoint that mirrors contact submissions. |

> **Env changes do NOT apply to an existing deployment.** After editing them you
> must **Redeploy** (Deployments → ⋯ → Redeploy, or push a commit).

---

## 2. Deploy

- **Auto:** pushing to the `main` branch triggers a Vercel production build.
- **Manual:** Vercel dashboard → **Deployments → Redeploy**.

Build command is the default `next build`; output is automatically detected.

---

## 3. Post-deploy verification

1. **Public site:** open `https://<domain>/vi` and `/en` → should load (200).
2. **Database connected:** `https://<domain>/api/publications?limit=5&depth=0`
   → returns JSON with articles. If this errors, `DATABASE_URI` is wrong/missing.
3. **Admin:** `https://<domain>/admin` → Payload login screen.
4. **SEO files:** `/robots.txt`, `/sitemap.xml`, `/site.webmanifest`, `/favicon.ico`.

---

## 4. Troubleshooting

**`/admin` shows “This page couldn’t load / A server error occurred.”**
The public site is static (no runtime DB), but `/admin` connects to Postgres at
request time. A 500 here = `DATABASE_URI` (or `PAYLOAD_SECRET`) not reaching the
runtime. Fix the env vars (§1) and **redeploy**. Check the exact error in
**Vercel → Deployment → Logs** (look for `cannot connect to Postgres` /
`ENOTFOUND` / a secret error).

**Sitemap missing article URLs right after deploy.**
`sitemap.xml` is ISR (`revalidate = 3600`). At build time no server is listening,
so it ships with static routes only and fills in article URLs on the first
request once the live server is reachable. This is expected.

**Login credentials.** See `PM_CREDENTIALS.md`. After go-live, change the admin
password in `/admin → Account` and rotate the value hardcoded in `scripts/`.

---

## 5. Local development notes

```bash
npm install
npm run dev        # webpack — /admin works (use this for CMS work)
npm run dev:turbo  # Turbopack — faster, but /admin 404s in dev (public pages only)
npm run build && npm run start   # production-equivalent locally
```

> `npm run dev` uses `--webpack` on purpose: Turbopack’s dev route resolver lets
> the `[locale]` segment shadow the Payload `/admin` route, so `/admin` 404s
> under `dev:turbo` (it works in production either way).

See **`PUBLISHING_GUIDE.md`** for how to publish articles via the CMS.
