# 📋 NoticeBoard

A full-stack institutional notice board built with **Next.js (Pages Router)**, **Prisma**, **TiDB Cloud**, and deployed on **Vercel**.

🔗 **Live Demo:** [your-app.vercel.app](https://noticeboard-six-opal.vercel.app/)  
📦 **Repo:** [github.com/yourusername/noticeboard](https://github.com/VinayPandey557/noticeboard)

---

## Features

- **Full CRUD** — create, read, update, and delete notices via clean REST API routes
- **Urgent-first ordering** — done in the database query (`ORDER BY CASE priority WHEN 'Urgent' THEN 0 ELSE 1 END`), not in the browser
- **Server-side validation** — required fields and date validation run inside the API routes; the client never trusts itself
- **Responsive design** — works beautifully on mobile and desktop
- **Confirmation modal** — deletes require an explicit confirmation step
- **Bonus: image support** — notices can include an image URL with a live preview in the form
- **Search & filter** — client-side filtering by category and keyword for fast UX
- **Hosted database** — data persists across refreshes and redeploys via TiDB Cloud (MySQL-compatible)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14, Pages Router |
| Language | TypeScript |
| Database ORM | Prisma 5 |
| Database | TiDB Cloud (MySQL-compatible, free tier) |
| Styling | Tailwind CSS |
| Hosting | Vercel (Hobby tier) |
| Fonts | Sora + DM Mono (Google Fonts) |

---

## Running Locally

### Prerequisites

- Node.js 18+
- A free [Neon Cloud](neon.com) account (or Neon / Supabase for Postgres)

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/noticeboard.git
cd noticeboard

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and paste your DATABASE_URL

# 4. Push schema to the database
npx prisma db push

# 5. (Optional) Seed some sample notices
npx prisma studio   # or write a seed script

# 6. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Getting a DATABASE_URL (TiDB Cloud)

1. Sign up at [neon.com](https://neon.com) → create a **Serverless** cluster (free tier).
2. In the cluster dashboard, click **Connect** → choose **Prisma**.
3. Copy the connection string. It looks like:  
   `mysql://user:password@host:4000/test?ssl-mode=require`
4. Paste it as `DATABASE_URL` in your `.env.local`.
5. Run `npx prisma db push` to create the tables.

### Deploying to Vercel

1. Push this repo to GitHub (make it **public**).
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. Add `DATABASE_URL` as an **Environment Variable** in Vercel project settings.
4. Deploy — Vercel automatically runs `prisma generate` via the `postinstall` script and `prisma generate && next build` on each deploy.

---

## Project Structure

```
noticeboard/
├── components/
│   ├── Layout.tsx        # Shared header, footer, nav
│   ├── NoticeCard.tsx    # Card with edit/delete actions + confirm modal
│   └── NoticeForm.tsx    # Shared create/edit form with validation
├── lib/
│   ├── prisma.ts         # Prisma client singleton (avoids hot-reload leaks)
│   └── types.ts          # Shared TypeScript types
├── pages/
│   ├── api/
│   │   └── notices/
│   │       ├── index.ts  # GET /api/notices, POST /api/notices
│   │       └── [id].ts   # GET, PUT, DELETE /api/notices/:id
│   ├── notices/
│   │   ├── new.tsx       # Create notice page
│   │   └── [id]/
│   │       └── edit.tsx  # Edit notice page (SSR pre-fills form)
│   ├── _app.tsx
│   └── index.tsx         # Home page (SSR listing)
├── prisma/
│   └── schema.prisma     # Notice model with Category and Priority enums
├── styles/
│   └── globals.css
└── .env.example
```

---

## API Reference

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/notices` | Fetch all notices (Urgent first, then newest) |
| `POST` | `/api/notices` | Create a new notice |
| `GET` | `/api/notices/:id` | Fetch a single notice |
| `PUT` | `/api/notices/:id` | Update a notice |
| `DELETE` | `/api/notices/:id` | Delete a notice |

All mutating endpoints validate on the server and return `422` with an `errors` array on failure.

---

## One Thing I'd Improve With More Time

**Image uploads instead of image URLs.** Currently the image field accepts an external URL. With more time, I'd integrate [Cloudinary](https://cloudinary.com) or Vercel Blob storage so users can upload images directly from the form. This would require a separate `/api/upload` endpoint that streams the file to cloud storage and returns a URL, which is then saved to the database — a more complete and user-friendly experience.

---

## AI Usage

I used **Claude (Anthropic)** as a coding assistant throughout this project:

- **Boilerplate acceleration** — scaffolding the Prisma schema, API route structure, and TypeScript interfaces. I reviewed every piece and adjusted it to match the assignment spec exactly.
- **Tailwind styling** — generating initial class combinations for the card layout and form, which I then refined for the visual design I wanted.
- **Bug catching** — asking Claude to review my `orderBy` logic (where I discovered that lexicographic enum sorting wouldn't produce Urgent-first order, leading me to use a raw SQL `CASE` expression instead).

All code was read, understood, and modified by me. I would be comfortable explaining any part of this codebase in a screen-share.
