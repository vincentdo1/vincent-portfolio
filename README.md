# vincent-portfolio

Personal site for Vincent Do — [vmd306.com](https://vmd306.com).

Built with Next.js 16 (App Router), Tailwind CSS, shadcn/ui, and Framer Motion.
Contact form is wired to Resend.

## Local dev

```bash
npm install
cp .env.example .env.local   # then fill in RESEND_API_KEY
npm run dev                  # http://localhost:3002
```

## Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Motion**: Framer Motion
- **Email**: Resend (via `/api/contact`)
- **Spam defense**: honeypot field, min-time check, disposable-email
  blacklist, MX-record DNS lookup

## Project structure

```
app/
  page.tsx                       single immersive page (all sections)
  layout.tsx                     metadata, fonts, dark theme
  globals.css                    Tailwind + custom utility classes
  icon.svg                       favicon
  opengraph-image.tsx            dynamic OG image for social previews
  api/contact/route.ts           Resend-backed contact form endpoint
components/
  nav.tsx                        top HUD-style nav
  sections/
    experience-section.tsx       role-select panel
    projects-section.tsx         project-select panel
    contact-dialog.tsx           popup contact form
  valorant/                      shared HUD primitives (brackets,
                                 side rail, section header, etc.)
```

## Customizing content

Most copy lives directly in the files that render it:

- **Hero / About / Interests / Stats** → `app/page.tsx`
- **Work history** → `components/sections/experience-section.tsx`
- **Projects** → `components/sections/projects-section.tsx`
- **Site metadata** → `app/layout.tsx`
- **Resume PDF** → `public/resume.pdf`

## Deploy

Cloudflare Pages or Vercel. Either way, add the same env vars from
`.env.local` to the hosting dashboard.
