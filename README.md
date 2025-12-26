# Astro Static Site Starter

A modern static site starter built with Astro, React, TailwindCSS, and DaisyUI. Optimized for Firebase Hosting deployment.

## Tech Stack

- **Framework**: [Astro](https://astro.build/) - Static Site Generator with great SEO
- **UI Framework**: [React](https://react.dev/) - For interactive components
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/) + [DaisyUI v5](https://daisyui.com/)
- **Additional Components**: [Flowbite React](https://flowbite-react.com/)
- **Backend (optional)**: [Firebase](https://firebase.google.com/) - Auth, Firestore, Storage
- **Hosting**: [Firebase Hosting](https://firebase.google.com/docs/hosting)

## Project Structure

```
/
├── public/              # Static assets (images, favicon, etc.)
├── src/
│   ├── components/      # Astro and React components
│   │   ├── icons.tsx    # Centralized icon components
│   │   └── *.astro      # Astro components
│   ├── layouts/         # Page layouts
│   ├── lib/             # Utility libraries (Firebase, etc.)
│   ├── pages/           # File-based routing
│   └── styles/          # Global CSS
├── scripts/             # Utility scripts for Firebase
├── firebase.json        # Firebase Hosting configuration
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Firebase CLI (`npm install -g firebase-tools`)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) to view the site.

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

**For client-side Firebase:**
- `PUBLIC_FIREBASE_CONFIG` - Firebase web app configuration (JSON string)

**For utility scripts (optional):**
- `FIREBASE_PROJECT_ID` - Your Firebase project ID
- `FIREBASE_SERVICE_ACCOUNT_KEY` - Service account key (JSON string)

## Commands

| Command | Action |
| :------ | :----- |
| `npm run dev` | Start development server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview build locally |
| `npm run deploy` | Build and deploy to Firebase Hosting |
| `npm run test-firebase` | Test Firebase configuration |
| `npm run fetch-firebase <collection>` | Fetch Firestore data |
| `npm run import-firestore <file> <collection>` | Import data to Firestore |

## Deployment

### Firebase Hosting Setup

1. **Login to Firebase:**
   ```bash
   firebase login
   ```

2. **Initialize Firebase project:**
   ```bash
   firebase use <your-project-id>
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

### Manual Deployment

```bash
# Build the site
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

## Adding Pages

Create new `.astro` files in `src/pages/`:

```astro
---
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
---

<Layout title="New Page">
  <Header currentPath="/new-page" />
  <main>
    <!-- Your content here -->
  </main>
  <Footer />
</Layout>
```

## Using Firebase (Optional)

### Client-Side Firebase

```typescript
import { getFirebaseApp } from '../lib/firebase';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const app = getFirebaseApp();
if (app) {
  const auth = getAuth(app);
  const db = getFirestore(app);
  // Use Firebase services
}
```

### Security

- Client-side Firebase configuration is safe to expose
- Security is enforced through Firebase Security Rules
- Update `firestore.rules` for your data access patterns

## Theme Customization

The site includes a theme selector with three options:
- **Light** - Light theme
- **Dark** - Dark theme
- **System** - Follows OS preference (default)

Themes are configured in `src/styles/global.css`:

```css
@plugin "daisyui" {
  themes: light --default, dark;
}
```

See [DaisyUI Themes](https://daisyui.com/docs/themes/) for customization options.

## Icons

All icons are centralized in `src/components/icons.tsx` for reusability:

```typescript
import { SunIcon, CheckIcon, MapPinIcon } from './components/icons';

// Use with className for sizing
<SunIcon className="h-5 w-5" />
<CheckIcon className="h-4 w-4 text-success" />
```

Available icons: `MenuIcon`, `SunIcon`, `MoonIcon`, `MonitorIcon`, `CheckIcon`, `MapPinIcon`, `MailIcon`, `PhoneIcon`

## Learn More

- [Astro Documentation](https://docs.astro.build)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [DaisyUI Components](https://daisyui.com/components/)
- [Firebase Documentation](https://firebase.google.com/docs)
