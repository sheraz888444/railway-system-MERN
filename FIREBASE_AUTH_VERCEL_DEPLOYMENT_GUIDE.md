# Complete Guide: Adding Firebase Authentication & Deploying to Vercel

This guide covers how to integrate **Firebase Authentication** into your MERN Railway Reservation System, ensuring users receive an **email verification** upon sign up. Finally, it provides complete steps to **deploy the project (Frontend and Backend) on Vercel**.

---

## Part 1: Firebase Setup & Configuration

### 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and follow the setup wizard.
3. Once created, click on the **Web** icon (`</>`) to register your web app.
4. Copy the `firebaseConfig` object provided.

### 2. Enable Email/Password Authentication
1. In the Firebase Console, navigate to **Authentication** (under Build).
2. Click **Get Started**.
3. Go to the **Sign-in method** tab.
4. Enable **Email/Password** and click **Save**.

### 3. Generate a Service Account Key for Backend
1. Go to **Project settings** (gear icon) -> **Service accounts**.
2. Click **Generate new private key**.
3. Save the downloaded JSON file (e.g., `firebaseServiceAccount.json`). **Do not commit this to GitHub**.

---

## Part 2: Frontend Integration (React/Vite)

### 1. Install Firebase SDK
In your `frontend` directory, install Firebase:
```bash
cd frontend
npm install firebase
```

### 2. Configure Firebase
Create a file at `frontend/src/firebase/firebaseConfig.ts` (or `.js`):
```typescript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

Add these variables to your `frontend/.env`:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Implement Sign-Up with Email Verification
In your Sign-Up component, use Firebase's `createUserWithEmailAndPassword` and `sendEmailVerification`:

```javascript
import { auth } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

const handleSignup = async (data) => {
  try {
    // 1. Create User in Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const user = userCredential.user;

    // 2. Send Email Verification
    await sendEmailVerification(user);
    alert("Signup successful! Please check your email to verify your account.");

    // 3. (Optional) Call your backend to save the user in MongoDB
    // You can send user.uid to your backend here
  } catch (error) {
    console.error("Signup error:", error.message);
  }
};
```

### 4. Implement Login (Only if Verified)
```javascript
import { auth } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const handleLogin = async (data) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
    
    // Check if the user has verified their email
    if (!userCredential.user.emailVerified) {
      alert("Please verify your email before logging in.");
      // Optional: Sign them out if unverified
      return;
    }

    // Get Firebase ID Token
    const idToken = await userCredential.user.getIdToken();
    
    // Send idToken to your Node.js Backend to authenticate requests
    // axios.post('/api/login', {}, { headers: { Authorization: `Bearer ${idToken}` } })
    
  } catch (error) {
    console.error("Login error:", error.message);
  }
};
```

---

## Part 3: Backend Integration (Node.js/Express)

### 1. Install Firebase Admin SDK
In your `backend` directory, install `firebase-admin`:
```bash
cd backend
npm install firebase-admin
```

### 2. Initialize Firebase Admin
Create a file at `backend/config/firebaseAdmin.js`:
```javascript
const admin = require('firebase-admin');

// You can pass the credentials via environment variables for security (especially on Vercel)
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
```

Update your `backend/.env` with the values from your `firebaseServiceAccount.json`:
```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="your_private_key"
```

### 3. Create Firebase Auth Middleware
Create a file at `backend/middleware/firebaseAuth.js`:
```javascript
const admin = require('../config/firebaseAdmin');

const verifyFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, no token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Ensure email is verified before allowing API access
    if (!decodedToken.email_verified) {
      return res.status(403).json({ message: 'Email not verified.' });
    }

    req.user = decodedToken; // contains uid, email, etc.
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = verifyFirebaseToken;
```
Use this middleware to protect your Express routes.

---

## Part 4: Deployment to Vercel

Vercel is an excellent platform for deploying full-stack MERN apps.

### 1. Preparing the Backend for Vercel
Vercel handles backend deployments using serverless functions.

1. **Create `vercel.json`** in the `backend/` directory:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

2. Ensure your Express app (`server.js`) exports the app properly instead of just listening (though typical `app.listen` usually works on Vercel, exporting the app is safer for Serverless functions):
```javascript
// At the bottom of server.js
module.exports = app;
```

### 2. Deploying the Backend
1. Create a GitHub repository and push your code.
2. Go to the [Vercel Dashboard](https://vercel.com/) and click **Add New** -> **Project**.
3. Import your GitHub repository.
4. **Important**: Set the **Root Directory** to `backend`.
5. Under **Environment Variables**, add all your backend variables (MongoDB URI, Firebase Admin keys, etc.).
6. Click **Deploy**. Vercel will give you a backend URL (e.g., `https://railway-backend.vercel.app`).

### 3. Deploying the Frontend
1. Go back to the Vercel Dashboard and click **Add New** -> **Project** again.
2. Import the *same* GitHub repository.
3. This time, set the **Root Directory** to `frontend`.
4. Vercel should automatically detect Vite.
5. Under **Environment Variables**, add your `VITE_FIREBASE_*` variables, and set your backend URL (e.g., `VITE_API_URL=https://railway-backend.vercel.app/api`).
6. Click **Deploy**.

## Conclusion
You have now successfully:
1. Integrated Firebase Authentication.
2. Enforced Email Verification on Signup.
3. Secured your Express Backend with Firebase Admin SDK.
4. Deployed both Frontend and Backend on Vercel!
