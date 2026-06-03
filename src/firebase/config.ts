import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (
  !firebaseConfig.apiKey ||
  !firebaseConfig.authDomain ||
  !firebaseConfig.projectId ||
  !firebaseConfig.storageBucket ||
  !firebaseConfig.messagingSenderId ||
  !firebaseConfig.appId
) {
  throw new Error("Firebase environment variables are missing");
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

if (
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST
) {
  try {
    connectAuthEmulator(
      auth,
      `http://${process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST}`,
    );
  } catch {
    // Emulator already connected
  }
}

export default app;
