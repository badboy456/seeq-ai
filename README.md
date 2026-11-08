# SEEQ AI V1 — Visual Intelligence

A mobile-first installable PWA prototype. It accepts a photo, optional typed/voice question, sends the image to Gemini through Firebase AI Logic, displays a cautious structured analysis, supports browser text-to-speech, and stores saved scan history locally on the device.

## Important status

- This is a working starter project, not a fully launched/production-hardened company product.
- AI analysis requires your own Firebase project and Firebase AI Logic setup.
- Firebase web config is not a secret; do not put a Gemini API key in frontend code.
- Firebase AI Logic App Check enforcement is required. Local debug setup is documented below. Production requires a real reCAPTCHA v3 site key and App Check registration.
- Free-tier quotas/rates can change. ₹0 is a development target, not a guarantee of unlimited free AI requests or hosting.
- Scan history is local to the current browser/device; it is not synced across devices.

## Requirements

- Android phone with Chrome
- A browser IDE such as Replit, StackBlitz or GitHub Codespaces, or a computer with Node.js 20.19+ / 22.12+
- Google account for Firebase Console

## Run on a phone (browser IDE)

1. Create a new Vite JavaScript project in a browser IDE, or upload/extract this project ZIP.
2. Open the project terminal and run `npm install`.
3. Copy `.env.example` to `.env` and fill in the Firebase values after completing Firebase setup below.
4. Run `npm run dev -- --host 0.0.0.0`.
5. Open the preview URL in Chrome. Camera capture requires HTTPS or localhost; browser IDE preview links normally use HTTPS.

## Firebase + Gemini setup

1. Open https://console.firebase.google.com/ and create a project named `seeq-ai` (or another available project ID).
2. Add a Web app in Project settings. Copy the Firebase web config values into `.env`:
   - `apiKey` -> `VITE_FIREBASE_API_KEY`
   - `projectId` -> `VITE_FIREBASE_PROJECT_ID`
   - `appId` -> `VITE_FIREBASE_APP_ID`
   - `authDomain` -> `VITE_FIREBASE_AUTH_DOMAIN`
   - `messagingSenderId` -> `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `storageBucket` -> `VITE_FIREBASE_STORAGE_BUCKET`
3. In Firebase Console, open **AI Services > AI Logic > Get started**. Choose **Gemini Developer API** as provider. Follow the setup wizard.
4. Confirm Firebase AI Logic is enabled and App Check is enforced for Firebase AI Logic.
5. In **Firebase Console > App Check**, register your Web app with the **reCAPTCHA v3** provider and obtain its site key. Add it as `VITE_RECAPTCHA_SITE_KEY` in `.env`.
6. For local development, keep `VITE_APPCHECK_DEBUG=true`. Start/restart the dev server, open the app preview, and inspect the browser developer console for `AppCheck debug token`. Register that token in **Firebase Console > App Check > Apps > your web app > Manage debug tokens**.
7. Restart the dev server after changing `.env`. Vite reads environment variables at startup.
8. Try an image and a question. Check Firebase AI Logic quota if the request is blocked.

Official setup guide: https://firebase.google.com/docs/ai-logic/get-started?platform=web

## Production App Check

Before public release:
1. Register a production reCAPTCHA v3 provider in Firebase App Check and obtain the site key.
2. Set `VITE_APPCHECK_DEBUG=false` and `VITE_RECAPTCHA_SITE_KEY=...` in the deployment environment.
3. Never ship a debug token or debug build.
4. Restrict your Firebase API key to the appropriate APIs/domains in Google Cloud Console.
5. Add usage controls, abuse monitoring, privacy notice, deletion flow and a server-side policy before public launch.

## Build

```bash
npm install
npm run build
npm run preview -- --host 0.0.0.0
```

The production static site is generated in `dist/`.

## Install on Android

1. Deploy the `dist/` folder to Firebase Hosting or another HTTPS static host.
2. Open the HTTPS site in Chrome on Android.
3. Tap Chrome menu (⋮) > **Add to Home screen** or **Install app**.
4. Launch SEEQ AI from the home screen.

This PWA is not an APK and is not yet a Play Store app. Capacitor packaging and Play Store release are later steps; Google Play developer registration may have a fee.

## V1 features

- Camera capture and gallery upload
- Image compression before sending
- AI visual identification and cautious troubleshooting prompt
- Hindi, English, Bhojpuri, Maithili, Bengali, Tamil, Telugu and Marathi UI labels; AI answer language follows the selected language
- Browser speech input where supported; speech output where supported
- Local scan history, copy result and save
- Installable PWA shell

## Known limitations

- No account system, cloud sync, technician marketplace, payments or admin dashboard yet.
- Voice recognition depends on browser/device support and may not work for every regional language.
- The AI can be wrong. Do not use it as the sole basis for safety-critical decisions.
- The app sends the selected image and question to Google's AI service for analysis. Do not upload sensitive personal, financial, medical or confidential images.
