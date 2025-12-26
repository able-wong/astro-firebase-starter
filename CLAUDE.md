# AI Behavior Guide

## Tech Stack

- **Framework**: Astro (Static Site Generator)
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

- `src/pages/*.astro` - Routes (file-based routing)
- `src/layouts/*.astro` - Page layouts
- `src/components/*.astro` - Astro components
- `src/components/*.tsx` - React components (for interactivity)
- `src/lib/*.ts` - Utility libraries
- `src/styles/global.css` - Global styles and DaisyUI config
- `scripts/*.js` - Node.js utility scripts

### Commands

- `npm run dev` - Development server
- `npm run build` - Build static site
- `npm run deploy` - Build and deploy to Firebase Hosting
- `npm run test-firebase` - Test Firebase configuration

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
- Theme toggle is built-in (light/dark)

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

Astro generates static HTML with full content - excellent for SEO. Customize meta tags in Layout component:

```astro
<Layout title="Page Title" description="Page description">
```

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
