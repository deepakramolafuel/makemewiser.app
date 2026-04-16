# Make Me Wiser

A life-lesson sharing web app by [Project FUEL](https://projectfuel.in). Receive a random life lesson from a real person somewhere in the world — or share one of your own.

Built with Next.js 16, Tailwind CSS, and Supabase.

---

## Prerequisites

Before you begin, you need:

1. **Node.js v22+** — installed (already done if you used the setup guide)
2. **A Supabase project** — free at [supabase.com](https://supabase.com)
3. **An Anthropic API key** — get one at [console.anthropic.com](https://console.anthropic.com)

---

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

**Where to find these values:**
- Supabase URL and anon key: Supabase dashboard → Settings → API
- Service role key: Supabase dashboard → Settings → API → `service_role` (keep this secret!)
- Anthropic key: [console.anthropic.com](https://console.anthropic.com) → API Keys

### 3. Set up the database

Go to your Supabase project → **SQL Editor** → paste the contents of `supabase/schema.sql` → click **Run**.

This creates the `lessons` and `reports` tables, indexes, RLS policies, and the `increment_favourite` function.

### 4. Seed the database

```bash
npm run seed
```

This loads the 248 curated life lessons from Project FUEL's World Wisdom Map CSV into your database. You'll see a count of lessons inserted and a list of any skipped rows.

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the home screen.

---

## Deployment to Vercel

### Step 1: Push to GitHub

Create a new GitHub repo and push this project to it.

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Vercel will auto-detect Next.js — no config needed

### Step 3: Add environment variables in Vercel

In Vercel → your project → Settings → Environment Variables, add all four:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `ANTHROPIC_API_KEY` | Your Anthropic API key |

### Step 4: Deploy

Click **Deploy**. Vercel builds and deploys. Done.

---

## Required Supabase Settings

- **Row Level Security (RLS) must be enabled** on the `lessons` and `reports` tables — the schema.sql does this automatically
- No auth callback URLs needed (no user auth in v1)

---

## Folder Structure

```
app/
  components/     — All UI components
  api/            — API route handlers (serverless functions)
  about/          — About page
  layout.tsx      — Root layout (fonts, global styles)
  page.tsx        — Home page
hooks/            — Custom React hooks (rate limit, favourites, session)
lib/              — Supabase clients, types, API helpers, countries list
supabase/
  schema.sql      — Database schema (run this in Supabase SQL Editor)
  seed.ts         — Seed script (run with npm run seed)
  lessons.csv     — Source data (248 curated FUEL lessons)
public/
  illustrations/  — Placeholder illustrations (replace with custom artwork)
```

---

## Making Changes

- **Edit UI components** in `app/components/` — each file is one component
- **Edit API logic** in `app/api/*/route.ts`
- **Add a new page** — create `app/your-page/page.tsx`
- **Change colors** — edit the `@theme` block in `app/globals.css`
- **Change fonts** — edit `app/layout.tsx`

After any change: `npm run dev` to test locally, then push to GitHub — Vercel redeploys automatically.

---

## Manual Steps After Deployment

- [ ] **Source custom illustrations** — replace the emoji placeholders in `HomeScreen.tsx`, `RateLimitMessage.tsx`, and `ConfirmationScreen.tsx` with hand-drawn artwork
- [ ] **Set up custom domain** in Vercel → your project → Domains
- [ ] **Monitor reported lessons** via Supabase dashboard → Table Editor → lessons → filter `is_reported = true`

---

## Verification Checklist

- [ ] Home page loads with greeting, two buttons, counter
- [ ] "Make me wiser" returns a random lesson
- [ ] Story expands with travel line
- [ ] No repeated lessons within a session
- [ ] Rate limit message after 10 lessons
- [ ] Favourite increments (once per lesson)
- [ ] Report works
- [ ] "Share my lesson" form submits and shows confirmation
- [ ] About page loads
- [ ] Share image generates and downloads
- [ ] Responsive on mobile (375px)

---

*A Project FUEL initiative — projectfuel.in*
