#!/usr/bin/env node

/**
 * Firebase Configuration Test Script
 *
 * Tests Firebase environment variables and configuration setup.
 * For static site deployment, only tests Admin SDK (for utility scripts).
 *
 * Usage:
 *   node scripts/test-firebase-config.js
 */

import process from 'process';
import { config } from 'dotenv';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { existsSync, readFileSync } from 'fs';

// Load environment variables from .env
config({ path: '.env' });

class FirebaseConfigTester {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.successes = [];
  }

  addSuccess(message) {
    this.successes.push(message);
    console.log(`✅ ${message}`);
  }

  addWarning(message) {
    this.warnings.push(message);
    console.log(`⚠️  ${message}`);
  }

  addError(message) {
    this.errors.push(message);
    console.log(`❌ ${message}`);
  }

  testEnvironmentVariables() {
    console.log('\n🔍 Testing Environment Variables...');

    // Required for utility scripts
    const requiredVars = ['FIREBASE_PROJECT_ID', 'FIREBASE_SERVICE_ACCOUNT_KEY'];

    // Optional - for client-side Firebase
    const optionalVars = ['PUBLIC_FIREBASE_CONFIG'];

    requiredVars.forEach((varName) => {
      const value = process.env[varName];
      if (!value) {
        this.addError(`Missing required environment variable: ${varName}`);
      } else {
        this.addSuccess(`Found required variable: ${varName}`);
      }
    });

    optionalVars.forEach((varName) => {
      const value = process.env[varName];
      if (!value) {
        this.addWarning(`Optional environment variable not set: ${varName}`);
      } else {
        this.addSuccess(`Found optional variable: ${varName}`);
      }
    });
  }

  testClientFirebaseConfig() {
    console.log('\n🔍 Testing Client Firebase Configuration...');

    const firebaseConfig = process.env.PUBLIC_FIREBASE_CONFIG;

    if (!firebaseConfig) {
      this.addWarning('PUBLIC_FIREBASE_CONFIG not set - client-side Firebase will not work');
      return;
    }

    try {
      const config = JSON.parse(firebaseConfig);
      const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];

      const missingFields = requiredFields.filter((field) => !config[field]);

      if (missingFields.length > 0) {
        this.addError(`PUBLIC_FIREBASE_CONFIG missing required fields: ${missingFields.join(', ')}`);
      } else {
        this.addSuccess('PUBLIC_FIREBASE_CONFIG contains all required fields');
      }
    } catch {
      this.addError('PUBLIC_FIREBASE_CONFIG is not valid JSON');
    }
  }

  testFirebaseAdminConfig() {
    console.log('\n🔍 Testing Firebase Admin SDK Configuration...');

    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (!serviceAccountKey) {
      this.addError('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is missing');
      return;
    }

    try {
      const serviceAccount = JSON.parse(serviceAccountKey);

      const requiredFields = [
        'type',
        'project_id',
        'private_key_id',
        'private_key',
        'client_email',
        'client_id',
        'auth_uri',
        'token_uri',
      ];

      const missingFields = requiredFields.filter((field) => !serviceAccount[field]);

      if (missingFields.length > 0) {
        this.addError(`FIREBASE_SERVICE_ACCOUNT_KEY missing required fields: ${missingFields.join(', ')}`);
      } else {
        this.addSuccess('FIREBASE_SERVICE_ACCOUNT_KEY contains all required fields');
      }

      if (serviceAccount.type !== 'service_account') {
        this.addError(`Invalid service account type: ${serviceAccount.type} (expected: service_account)`);
      } else {
        this.addSuccess('Service account type is valid');
      }

      // Validate project ID consistency
      const projectIdFromServiceAccount = serviceAccount.project_id;
      const projectIdFromEnv = process.env.FIREBASE_PROJECT_ID;

      if (projectIdFromServiceAccount !== projectIdFromEnv) {
        this.addError(
          `Project ID mismatch: Service account project_id (${projectIdFromServiceAccount}) != FIREBASE_PROJECT_ID (${projectIdFromEnv})`
        );
      } else {
        this.addSuccess('Project IDs are consistent');
      }
    } catch {
      this.addError('FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON');
    }
  }

  async testFirebaseAdminInitialization() {
    console.log('\n🔍 Testing Firebase Admin SDK Initialization...');

    if (this.errors.length > 0) {
      this.addWarning('Skipping Firebase Admin SDK initialization due to configuration errors');
      return;
    }

    try {
      if (getApps().length === 0) {
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        const serviceAccount = JSON.parse(serviceAccountKey);

        initializeApp({
          credential: cert(serviceAccount),
          projectId: projectId,
        });
      }

      this.addSuccess('Firebase Admin SDK initialized successfully');
      return true;
    } catch (error) {
      this.addError(`Failed to initialize Firebase Admin SDK: ${error.message}`);
      return false;
    }
  }

  async testFirestoreConnection() {
    console.log('\n🔍 Testing Firestore Connection...');

    try {
      const db = getFirestore();
      const testRef = db.collection('config-test').limit(1);
      await testRef.get();

      this.addSuccess('Firestore connection successful');
    } catch (error) {
      this.addError(`Firestore connection failed: ${error.message}`);
    }
  }

  testFirebaseProjectFiles() {
    console.log('\n🔍 Testing Firebase Project Files...');

    // Check firebase.json
    if (!existsSync('firebase.json')) {
      this.addWarning('firebase.json file not found');
    } else {
      try {
        const firebaseJson = JSON.parse(readFileSync('firebase.json', 'utf-8'));

        if (firebaseJson.hosting) {
          this.addSuccess('firebase.json includes Hosting configuration');

          if (firebaseJson.hosting.public === 'dist') {
            this.addSuccess('Hosting public directory set to "dist" (correct for Astro)');
          } else {
            this.addWarning(`Hosting public directory is "${firebaseJson.hosting.public}" - Astro builds to "dist"`);
          }
        } else {
          this.addError('firebase.json missing Hosting configuration');
        }
      } catch {
        this.addError('firebase.json is not valid JSON');
      }
    }

    // Check .firebaserc
    if (!existsSync('.firebaserc')) {
      this.addWarning('.firebaserc not found - run "firebase init" or "firebase use <project-id>"');
    } else {
      this.addSuccess('.firebaserc found');
    }
  }

  generateSummary() {
    console.log('\n📊 Configuration Test Summary');
    console.log('='.repeat(50));

    console.log(`✅ Successes: ${this.successes.length}`);
    console.log(`⚠️  Warnings: ${this.warnings.length}`);
    console.log(`❌ Errors: ${this.errors.length}`);

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('\n🎉 All tests passed! Your Firebase configuration is ready.');
    } else if (this.errors.length === 0) {
      console.log('\n✅ Configuration is functional with minor warnings.');
    } else {
      console.log('\n💥 Configuration has errors that need to be fixed.');
      console.log('\n🔧 Next Steps:');
      console.log('1. Copy .env.example to .env');
      console.log('2. Fill in your Firebase configuration values');
      console.log('3. Run "firebase login" if not authenticated');
      console.log('4. Run "firebase use <project-id>" to set the project');
      console.log('5. Run this test again');
    }

    return this.errors.length === 0;
  }

  async runAllTests() {
    console.log('🔥 Firebase Configuration Test');
    console.log('========================================');
    console.log('Testing Firebase configuration for static site deployment...\n');

    this.testEnvironmentVariables();
    this.testClientFirebaseConfig();
    this.testFirebaseAdminConfig();
    this.testFirebaseProjectFiles();

    const adminInitialized = await this.testFirebaseAdminInitialization();
    if (adminInitialized) {
      await this.testFirestoreConnection();
    }

    const success = this.generateSummary();

    console.log('\n📚 Resources:');
    console.log('- Firebase Console: https://console.firebase.google.com');
    console.log('- Firebase Hosting Docs: https://firebase.google.com/docs/hosting');

    process.exit(success ? 0 : 1);
  }
}

// Main execution
const tester = new FirebaseConfigTester();
tester.runAllTests().catch((error) => {
  console.error('\n💥 Unexpected error during testing:', error.message);
  process.exit(1);
});
