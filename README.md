# Bloombiatch

Savage motivation for people doing hard things. This repo contains the public landing page and an internal admin tool for generating and approving daily Blooms.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- ConvertKit (Kit)
- OpenAI API
- SQLite (local persistence)

## Local Setup

```bash
npm install
npm run dev
```

Create a `.env.local` file with:

```
OPENAI_API_KEY=your_openai_key
CONVERTKIT_API_KEY=your_convertkit_key
CONVERTKIT_FORM_ID=your_form_id
CONVERTKIT_SEQUENCE_ID=your_sequence_id
ADMIN_PASSWORD=choose_a_password
```

Visit:
- `http://localhost:3000` for the landing page
- `http://localhost:3000/admin` for the admin generator

## How AI Generation Works

The admin dashboard calls `/api/generate`, which uses a strict system prompt to generate a 3–6 line Bloom. The server validates the output against forbidden content rules (no therapy language, no self-harm, no identity insults). If validation fails, it regenerates automatically up to 4 attempts. Generated Blooms are logged as `draft` in SQLite.

Relevant files:
- `app/api/generate/route.ts`
- `lib/openai.ts`
- `lib/db.ts`

## Approval → Email Send Flow

1. Admin clicks **Generate today's Bloom**.
2. Admin edits (optional) and clicks **Approve & Schedule**.
3. `/api/approve` stores the content as `approved` and sends it to ConvertKit.
4. On success, the log updates to `sent`.

Delivery can be either:
- **Broadcast** (default) via `/v3/broadcasts`
- **Sequence** via `/v3/sequence_mails`

Relevant files:
- `app/admin/AdminDashboard.tsx`
- `app/api/approve/route.ts`
- `lib/convertkit.ts`

## Email Signup

The landing page form posts to `/api/subscribe` and subscribes users to your ConvertKit form.

Relevant files:
- `components/EmailSignup.tsx`
- `app/api/subscribe/route.ts`

## Deploy to Vercel

1. Push this repo to GitHub.
2. Create a new Vercel project and import the repo.
3. Set the environment variables in Vercel (same as `.env.local`).
4. Deploy.

## Connect bloombiatch.com

1. Add the domain in Vercel under Project Settings → Domains.
2. Update your DNS provider with the Vercel DNS records.
3. Wait for SSL provisioning to finish.

## Notes

- SQLite is used for the MVP log. For production persistence on serverless, swap `lib/db.ts` to Vercel KV or Supabase.
- Approval is required before any email is sent.
