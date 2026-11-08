import { initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai';

const env = import.meta.env;
const required = ['VITE_FIREBASE_API_KEY','VITE_FIREBASE_PROJECT_ID','VITE_FIREBASE_APP_ID'];
const missing = required.filter((key) => !env[key]);

let model = null;
let setupError = '';

if (missing.length) {
  setupError = `Firebase setup incomplete. Add these values to .env: ${missing.join(', ')}`;
} else {
  try {
    const firebaseConfig = {
      apiKey: env.VITE_FIREBASE_API_KEY,
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || `${env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: env.VITE_FIREBASE_PROJECT_ID,
      appId: env.VITE_FIREBASE_APP_ID,
      messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || undefined,
      storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || undefined
    };
    const app = initializeApp(firebaseConfig);

    if (!env.VITE_RECAPTCHA_SITE_KEY) throw new Error('Add VITE_RECAPTCHA_SITE_KEY from Firebase App Check (reCAPTCHA v3).');
    // Local development uses a debug token; production uses real reCAPTCHA attestation.
    if (env.VITE_APPCHECK_DEBUG === 'true') self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    initializeAppCheck(app, { provider: new ReCaptchaV3Provider(env.VITE_RECAPTCHA_SITE_KEY), isTokenAutoRefreshEnabled: true });

    const ai = getAI(app, { backend: new GoogleAIBackend() });
    model = getGenerativeModel(ai, {
      model: env.VITE_GEMINI_MODEL || 'gemini-3.8-flash',
      generationConfig: { temperature: 0.25, maxOutputTokens: 1400 }
    });
  } catch (error) {
    setupError = error?.message || 'Could not initialize Firebase AI Logic.';
  }
}

export { model, setupError };
