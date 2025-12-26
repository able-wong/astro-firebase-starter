# AI Behavior Guide

## Tech Stack

- **Framework**: Astro (Static Site Generator)
- **Content**: Content Collections + MDX
- **UI**: React 19, TailwindCSS v4, DaisyUI v5, Flowbite React
- **Backend (optional)**: Firebase (client-side Auth, Firestore)
- **Hosting**: Firebase Hosting (static files)

## Project Type

This is a **static site** (SSG) - all pages are pre-rendered at build time.

Key implications:
- No server-side code execution
- No API routes or server actions
- Client-side JavaScript for interactivity
- Firebase operations are client-side only

## Quick Reference

### Component Priority

1. **DaisyUI first** - Use DaisyUI components for common UI elements
2. **Flowbite React** - If DaisyUI lacks specific component
3. **Custom components** - Store in `src/components/`

### File Structure

- `src/content/blog/*.md|*.mdx` - Blog posts (Content Collections)
- `src/content/config.ts` - Collection schemas
- `src/pages/*.astro` - Routes (file-based routing)
- `src/pages/rss.xml.ts` - RSS feed endpoint
- `src/layouts/*.astro` - Page layouts
- `src/components/*.astro` - Astro components
- `src/components/*.tsx` - React components (for interactivity)
- `src/components/icons.tsx` - Centralized icon components
- `src/components/SEO.astro` - Meta tags, Open Graph, Twitter cards
- `src/lib/*.ts` - Utility libraries
- `src/styles/global.css` - Global styles and DaisyUI config
- `scripts/*.js` - Node.js utility scripts

### Icons

All icons are centralized in `src/components/icons.tsx`. Never use inline SVGs.

```typescript
// Import icons
import { SunIcon, MoonIcon, CheckIcon } from '../components/icons';

// Use with className for sizing
<SunIcon className="h-5 w-5" />
<CheckIcon className="h-4 w-4 text-primary" />
```

Available icons: `MenuIcon`, `SunIcon`, `MoonIcon`, `MonitorIcon`, `CheckIcon`, `MapPinIcon`, `MailIcon`, `PhoneIcon`

To add new icons:
1. Add the icon function to `src/components/icons.tsx`
2. Export it from the file
3. Use consistent pattern: `({ className = 'h-5 w-5' }: IconProps)`

### Commands

- `npm run dev` - Development server
- `npm run build` - Build static site
- `npm run validate` - Run all checks (typecheck + lint + format + test)
- `npm run deploy` - Build and deploy to Firebase Hosting

### Code Quality

- **Typecheck**: `npm run typecheck` (Astro check)
- **Lint**: `npm run lint` / `npm run lint:fix` (ESLint)
- **Format**: `npm run format` (Prettier)
- **Test**: `npm run test` / `npm run test:watch` (Vitest)

Run `npm run validate` before committing. Tests go in `*.test.tsx` files alongside components.

## Development Guidelines

### Adding New Pages

1. Create `.astro` file in `src/pages/`
2. Import Layout, Header, Footer components
3. Update Header navigation if needed

### React Components

Use React components (`.tsx`) when you need:
- Client-side interactivity
- State management
- Event handlers
- Firebase Auth/Firestore operations

Add `client:load` or `client:visible` directive:

```astro
---
import MyComponent from '../components/MyComponent';
---

<MyComponent client:load />
```

### Firebase Integration

Firebase is **optional** and client-side only:

```typescript
import { getFirebaseApp } from '../lib/firebase';
import { getAuth } from 'firebase/auth';

const app = getFirebaseApp();
if (app) {
  const auth = getAuth(app);
  // Use auth
}
```

Environment variable: `PUBLIC_FIREBASE_CONFIG` (prefix with `PUBLIC_` for client access)

### Styling

- Use DaisyUI semantic classes: `btn`, `card`, `navbar`, `hero`, etc.
- Use DaisyUI color classes: `bg-base-100`, `text-primary`, etc.
- Theme selector has Light/Dark/System options (System is default)
- Theme preference stored in `localStorage` as `theme-preference`

### Pre-Deployment Checklist

1. Update project name in `package.json`
2. Run `npm run build` to verify build succeeds
3. Configure `.firebaserc` with your project ID
4. Set environment variables in `.env`
5. Run `npm run deploy`

## Common Patterns

### Form Handling (Static Site)

For a static site, form handling options:
- Client-side validation + external service (Formspree, Netlify Forms)
- Firebase Firestore to store submissions
- Third-party form backend

### SEO

Layout includes full SEO support via `SEO.astro`:

```astro
<Layout
  title="Page Title"
  description="Page description"
  image="/og-image.png"
  type="article"
  publishedTime={date}
  author="Author Name"
  tags={['tag1', 'tag2']}
>
```

Configure site name and Twitter handle in `src/components/SEO.astro`.

### Images

Place in `public/` directory and reference with absolute paths:

```html
<img src="/images/logo.png" alt="Logo" />
```

Or use Astro's Image component for optimization:

```astro
---
import { Image } from 'astro:assets';
import logo from '../assets/logo.png';
---
<Image src={logo} alt="Logo" />
```

### Content Collections (Blog)

Add blog posts in `src/content/blog/` as `.md` or `.mdx` files:

```markdown
---
title: 'Post Title'
description: 'Brief description'
pubDate: 2024-01-15
author: 'Author Name'
tags: ['tag1', 'tag2']
draft: false
---

Content here...
```

Schema defined in `src/content/config.ts`. MDX files can import React components.

Query posts:

```typescript
import { getCollection } from 'astro:content';
const posts = await getCollection('blog', ({ data }) => !data.draft);
```

### RSS & Sitemap

- RSS feed: `/rss.xml` - configure in `src/pages/rss.xml.ts`
- Sitemap: `/sitemap-index.xml` - auto-generated, set `site` in `astro.config.mjs`
