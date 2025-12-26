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

## New Site Setup Guide

When user clones this starter for a new website, follow this process:

### 1. Content Gathering (Before Implementation)

Ask user for:
- **Company info**: Name, tagline, domain, email, social links
- **Pages needed**: Home, About, Blog, Contact, Products, etc.
- **Team bios**: Names, titles, descriptions, photos, LinkedIn URLs
- **Products/Services**: Names, descriptions, links to external sites if any
- **Target audience**: Who they serve (helps with copy tone)

Guide user on copy if they're not a content writer:
- Ask: "Who is your ideal customer?"
- Ask: "What's their biggest pain point?"
- Ask: "What transformation do you offer?"
- Draft copy from their answers

### 2. Image Organization

Create folder structure early:
```
public/images/
├── logos/       # Company + product logos
├── heroes/      # Hero background images (1920x1080, dark-friendly)
├── team/        # Headshots (400x400 square)
└── blog/        # Blog post images (1200x630 OG ratio)
```

Offer to create the folder structure, then help user source images:

1. **AI Image Generators** (free: Nano Banana, DALL-E free tier)
   - Generate prompts tailored to user's brand, industry, and page purpose
   - Include "dark", "moody", or "muted tones" for text overlay compatibility
   - Specify "16:9 aspect ratio" or "wide format" for hero dimensions

2. **Stock Photo Sites** (free: Pixabay, Unsplash, Pexels)
   - Suggest search keywords specific to user's industry and content
   - Recommend filtering by horizontal orientation
   - Look for images with dark areas or space for text overlay

Remind user: hero images need dark/desaturated tones so white text remains readable

### 3. Color Theme Decision

Ask user for color preference early. Options:
- Professional/corporate (blues, grays)
- Modern/tech (dark mode, neons)
- Warm/approachable (earth tones)
- Custom brand colors (get hex codes)

### 4. Theme Mode Decision

Ask: Light only, Dark only, or Both (with toggle)?
- **Light only**: Simpler, remove ThemeSelector from Header, set `data-theme="light"` in Layout
- **Dark only**: Same approach with dark
- **Both**: Keep ThemeSelector, test logos/images in both modes

### 5. Files to Update

When starting new site, update these:
- `package.json`: name
- `astro.config.mjs`: site URL
- `src/components/SEO.astro`: siteName, social links
- `src/pages/rss.xml.ts`: title, description
- `src/components/Header.astro`: logo, company name, nav links
- `src/components/Footer.astro`: company info, links, social
- `src/layouts/Layout.astro`: default description, data-theme
- `src/styles/global.css`: custom theme colors

## DaisyUI v5 Custom Themes

### Creating Custom Theme

Custom themes use a **separate plugin** `@plugin "daisyui/theme"` (not nested inside `@plugin "daisyui"`):

```css
@import 'tailwindcss';
@plugin "daisyui";

@plugin "daisyui/theme" {
  name: "mytheme";
  default: true;
  color-scheme: light;
  --color-base-100: #ffffff;
  --color-base-200: #f8fafc;
  --color-base-300: #e2e8f0;
  --color-base-content: #334155;
  --color-primary: #4a8fa8;
  --color-primary-content: #ffffff;
  --color-secondary: #6b7b8a;
  --color-secondary-content: #ffffff;
  --color-accent: #5ba3a8;
  --color-accent-content: #ffffff;
  --color-neutral: #1e293b;
  --color-neutral-content: #f1f5f9;
  --color-info: #3b82f6;
  --color-info-content: #ffffff;
  --color-success: #22c55e;
  --color-success-content: #ffffff;
  --color-warning: #f59e0b;
  --color-warning-content: #ffffff;
  --color-error: #ef4444;
  --color-error-content: #ffffff;
}
```

Key points:
- Use `@plugin "daisyui/theme"` for custom themes (separate from `@plugin "daisyui"`)
- Use `--color-*` prefix for all color variables
- Set `default: true` to make it the default theme (no `data-theme` needed on `<html>`)
- Use lowercase hex values (e.g., `#4a8fa8` not `#4A8FA8`)

### Required Theme Colors

Minimum colors to define:
- `--color-primary`, `--color-primary-content`
- `--color-secondary`, `--color-secondary-content`
- `--color-accent`, `--color-accent-content`
- `--color-neutral`, `--color-neutral-content`
- `--color-base-100`, `--color-base-200`, `--color-base-300`, `--color-base-content`
- `--color-info`, `--color-success`, `--color-warning`, `--color-error` (+ content variants)

### Light-Only Site

If no dark mode needed:
1. Remove ThemeSelector from Header
2. Remove theme initialization script from Layout
3. Set `default: true` in your theme (no `data-theme` attribute needed)
4. Define only one theme with `@plugin "daisyui/theme"`

### Troubleshooting Theme Not Applying

If custom colors don't appear:
- Use `@plugin "daisyui/theme"` not nested inside `@plugin "daisyui"`
- Use `--color-*` prefix for all color variables
- Verify lowercase hex values
- Restart dev server after changing theme config

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
