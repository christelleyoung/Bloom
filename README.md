# Bloombiatch

A savage, text-first landing page plus an internal AI content generator for the Bloombiatch brand.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

- `OPENAI_API_KEY`: OpenAI API key for message generation.
- `CONVERTKIT_API_KEY`: Kit API key.
- `CONVERTKIT_FORM_ID`: Kit form ID for the public signup.
- `CONVERTKIT_SEQUENCE_ID`: Kit sequence ID used to send approved Blooms.
- `ADMIN_PASSWORD`: Password for the `/admin` route.
- `DB_PATH`: Optional JSON storage path (defaults to `data/bloombiatch.json`).

## How AI generation works

The admin panel calls `generateBloomMessage` in `lib/openai.ts` with a strict system prompt. The result is validated for line count and banned phrases. Invalid generations are retried up to three times.

## Approval → email send flow

1. Generate a draft in `/admin`.
2. Edit the draft in the text area.
3. Click **Approve & Schedule** to mark the log as `approved` and send it to Kit.
4. If Kit succeeds, the status updates to `sent`.

Drafts are stored in a local JSON file (`lib/db.ts`). Unapproved drafts are never sent.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import the project in Vercel.
3. Add the environment variables from `.env.example`.
4. Deploy.

## Connect bloombiatch.com

1. In Vercel, go to **Project Settings → Domains**.
2. Add `bloombiatch.com` and follow the DNS instructions.
3. Set the root domain and `www` as desired.
