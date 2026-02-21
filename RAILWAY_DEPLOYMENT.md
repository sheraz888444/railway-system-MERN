# Railway Deployment Guide

This guide explains how to deploy the Railway Reservation System (MERN stack) on Railway via GitHub.

## Architecture

Deploy **two separate services** from this monorepo:

1. **Backend** (Express API) – Root directory: `backend`
2. **Frontend** (Vite React) – Root directory: `frontend`

---

## Step 1: Push to GitHub

Ensure your code is pushed to a GitHub repository.

---

## Step 2: Create Railway Project

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your repository
4. Railway will create one service. You’ll add a second one next.

---

## Step 3: Deploy Backend

1. In the project, open the service created from your repo
2. Go to **Settings** → **General**
3. Set **Root Directory** to `backend`
4. Go to **Settings** → **Variables** and add:

   | Variable       | Value                                                                 |
   |----------------|-----------------------------------------------------------------------|
   | `PORT`         | (Railway sets this automatically)                                    |
   | `MONGODB_URI`  | Your MongoDB Atlas connection string                                 |
   | `JWT_SECRET`   | A strong random secret (e.g. from `openssl rand -hex 32`)            |
   | `CORS_ORIGIN`  | Your frontend URL (e.g. `https://your-frontend.up.railway.app`)      |

5. Deploy. Railway will use `backend/railway.json` for build and start commands.
6. After deploy, copy the backend URL (e.g. `https://xxx.up.railway.app`).

---

## Step 4: Deploy Frontend

1. In the same project, click **+ New** → **GitHub Repo** → select the same repo
2. Open the new service → **Settings** → **General**
3. Set **Root Directory** to `frontend`
4. Go to **Settings** → **Variables** and add:

   | Variable        | Value                                                                 |
   |-----------------|-----------------------------------------------------------------------|
   | `VITE_API_URL`  | Your backend URL (e.g. `https://xxx.up.railway.app`)                   |

   **Important:** `VITE_API_URL` must be set before the build. It is baked into the frontend at build time.

5. Deploy. Railway will build the Vite app and serve the `dist` folder.

---

## Step 5: Update CORS

After the frontend is deployed:

1. Copy the frontend URL
2. In the **Backend** service, update `CORS_ORIGIN` to the frontend URL
3. Redeploy the backend

---

## Environment Variables Summary

### Backend (`backend`)

| Variable      | Required | Description                          |
|---------------|----------|--------------------------------------|
| `MONGODB_URI` | Yes      | MongoDB Atlas connection string     |
| `JWT_SECRET`  | Yes      | Secret for JWT signing              |
| `CORS_ORIGIN` | Yes      | Frontend URL for CORS                |
| `PORT`        | No       | Set by Railway                      |

### Frontend (`frontend`)

| Variable       | Required | Description                          |
|----------------|----------|--------------------------------------|
| `VITE_API_URL` | Yes      | Backend API URL (used at build time) |
| `PORT`         | No       | Set by Railway                      |

---

## Troubleshooting Build Errors

### Backend

- **Node version:** Ensure Node 18+ (set via `engines` in `package.json`)
- **MongoDB:** Verify `MONGODB_URI` is correct and the IP is allowed in Atlas
- **Missing env vars:** All required variables must be set before deploy

### Frontend

- **Build fails:** Ensure `VITE_API_URL` is set before the first build
- **API calls fail:** Confirm `VITE_API_URL` matches the deployed backend URL
- **404 on refresh:** The `serve` package with `-s` handles SPA routing

### Common Issues

1. **CORS errors:** Set `CORS_ORIGIN` to the exact frontend URL (including `https://`)
2. **WebSocket fails:** Ensure the backend URL uses `wss://` in production (Railway handles this)
3. **Build timeout:** Large `node_modules` can slow builds; consider `.railwayignore` if needed

---

## Custom Domains

In each service’s **Settings** → **Domains**, add your custom domain. Update `CORS_ORIGIN` and `VITE_API_URL` accordingly.
