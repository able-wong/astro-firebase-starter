/**
 * Firebase client initialization service
 *
 * This module handles the initialization of Firebase client SDK and provides
 * a singleton instance of the Firebase app.
 *
 * Required Environment Variable:
 * - PUBLIC_FIREBASE_CONFIG: A JSON string containing the Firebase configuration object
 *   Example: {"apiKey":"...","authDomain":"...","projectId":"...","storageBucket":"...","messagingSenderId":"...","appId":"..."}
 *
 * How to get FIREBASE_CONFIG:
 * 1. Go to Firebase Console (https://console.firebase.google.com)
 * 2. Select your project
 * 3. Go to Project Settings (gear icon) > General
 * 4. Scroll down to "Your apps" section
 * 5. Click on the web app (</>) icon
 *    - If no web app exists, create one by clicking "Add app" and selecting web
 * 6. Copy the firebaseConfig object values
 * 7. Set this as your PUBLIC_FIREBASE_CONFIG environment variable
 *
 * Usage in Astro:
 * ```typescript
 * import { getFirebaseApp } from '../lib/firebase';
 *
 * // Get the Firebase app instance
 * const app = getFirebaseApp();
 *
 * // Use Firebase services
 * import { getAuth } from 'firebase/auth';
 * const auth = getAuth(app);
 * ```
 *
 * Security Considerations:
 * - The firebaseConfig contains public API keys and project identifiers
 * - These keys are safe to be exposed in client-side code
 * - Security is enforced through Firebase Security Rules
 */

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

let firebaseApp: FirebaseApp | null = null;

/**
 * Gets the Firebase configuration from environment variables
 */
function getFirebaseConfig(): FirebaseConfig | null {
  const configString = import.meta.env.PUBLIC_FIREBASE_CONFIG;

  if (!configString) {
    console.warn('PUBLIC_FIREBASE_CONFIG environment variable is not set');
    return null;
  }

  try {
    return JSON.parse(configString) as FirebaseConfig;
  } catch {
    console.error('Failed to parse PUBLIC_FIREBASE_CONFIG as JSON');
    return null;
  }
}

/**
 * Validates that the Firebase config has all required properties
 */
function validateConfig(config: FirebaseConfig): string[] {
  const requiredProps: (keyof FirebaseConfig)[] = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ];

  return requiredProps.filter((prop) => !config[prop]);
}

/**
 * Initializes and returns the Firebase app instance
 * Uses singleton pattern to ensure only one instance exists
 */
export function getFirebaseApp(): FirebaseApp | null {
  // Return existing instance if available
  if (firebaseApp) {
    return firebaseApp;
  }

  // Check if Firebase is already initialized
  if (getApps().length > 0) {
    firebaseApp = getApp();
    return firebaseApp;
  }

  // Get and validate config
  const config = getFirebaseConfig();
  if (!config) {
    return null;
  }

  const missingProps = validateConfig(config);
  if (missingProps.length > 0) {
    console.error(
      `Firebase configuration is missing required properties: ${missingProps.join(', ')}`
    );
    return null;
  }

  // Initialize Firebase
  firebaseApp = initializeApp(config);
  return firebaseApp;
}

/**
 * Checks if Firebase is configured and available
 */
export function isFirebaseConfigured(): boolean {
  const config = getFirebaseConfig();
  if (!config) return false;

  const missingProps = validateConfig(config);
  return missingProps.length === 0;
}
