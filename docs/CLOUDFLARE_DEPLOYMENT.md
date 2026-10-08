# Cloudflare Deployment Guide

This guide explains how to deploy the **Sinhala/Singlish Phishing Detection System** using **Cloudflare Pages** for the frontend and **Cloudflare Tunnel / Cloudflare DNS** for the FastAPI deep learning backend.

---

## Architecture Overview

```
                          +-------------------------------+
                          |        User Web Browser       |
                          +---------------+---------------+
                                          |
                +-------------------------+-------------------------+
                |                                                   |
                | (Static Assets / HTML / React)                    | (API Requests: /api/v1/predict)
                v                                                   v
+-------------------------------+                   +-------------------------------+
|       Cloudflare Pages        |                   |    Cloudflare Edge / Tunnel   |
|   (Global Edge CDN + SSL)     |                   |  (DDoS Protection + WAF + SSL)|
+-------------------------------+                   +---------------+---------------+
                                                                    |
                                                                    v
                                                    +-------------------------------+
                                                    |     FastAPI Backend (Docker)  |
                                                    |   Python 3.11 + TensorFlow   |
                                                    |   phishing_model.keras        |
                                                    +-------------------------------+
```

---

## Part 1: Deploy Frontend to Cloudflare Pages (Free & Instant)

Cloudflare Pages natively hosts Vite/React single-page applications with automated global CDN caching and SSL.

### Step 1: Connect Git Repository in Cloudflare Dashboard
1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Go to **Compute (Workers & Pages)** &rarr; **Create application** &rarr; **Pages** &rarr; **Connect to Git**.
3. Select your repository: `sinhala-singlish-phishing-detection`.

### Step 2: Configure Build Settings
Fill in the build configuration:

| Field | Value |
|---|---|
| **Project Name** | `sinhala-phishing-detector` |
| **Production Branch** | `main` |
| **Framework Preset** | `Vite` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Build Output Directory** | `dist` |

### Step 3: Set Environment Variables
In the **Environment Variables (Production)** section, add:

| Variable | Value | Description |
|---|---|---|
| `VITE_API_URL` | `https://api.yourdomain.com` | The public URL of your backend API |

Click **Save and Deploy**. Cloudflare Pages will build and deploy your frontend globally at `https://sinhala-phishing-detector.pages.dev`.

---

## Part 2: Deploy Backend with Cloudflare

Because the Keras deep learning model requires TensorFlow runtime (~350MB dependencies), the backend runs in a containerized Python environment. Cloudflare integrates seamlessly with your backend in two popular ways:

### Option A: Cloudflare Tunnel (Zero Open Ports — Recommended)
Cloudflare Tunnel (`cloudflared`) connects your backend container directly to Cloudflare without opening router ports or exposing public IPs.

1. **Create a Tunnel in Cloudflare Zero Trust**:
   - Go to **Zero Trust** &rarr; **Networks** &rarr; **Tunnels** &rarr; **Add a Tunnel**.
   - Name your tunnel (e.g. `phishing-backend-tunnel`).
   - Copy the `TUNNEL_TOKEN`.

2. **Add to `docker-compose.yml`**:
   ```yaml
   services:
     backend:
       build:
         context: .
         dockerfile: backend/Dockerfile
       restart: always

     tunnel:
       image: cloudflare/cloudflared:latest
       restart: always
       command: tunnel run
       environment:
         - TUNNEL_TOKEN=YOUR_CLOUDFLARE_TUNNEL_TOKEN_HERE
   ```

3. **Configure Public Hostname in Cloudflare**:
   - **Public Hostname**: `api.yourdomain.com`
   - **Service Type**: `HTTP`
   - **URL**: `backend:8000`

---

### Option B: Cloudflare Proxied DNS (Orange Cloud) on Cloud Host (Render / Fly.io / VPS / AWS)

If hosting on a container platform (e.g., Render, Railway, Fly.io, AWS Lightsail, or a Linux VPS):

1. Deploy the backend Docker container using [backend/Dockerfile](file:///e:/Projects/sinhala-singlish-phishing-detection/backend/Dockerfile).
2. In Cloudflare DNS, add a `CNAME` or `A` record:
   - **Name**: `api`
   - **Target**: Your server IP or host domain
   - **Proxy status**: **Proxied (Orange Cloud)** &rarr; Enables Cloudflare DDoS protection, TLS 1.3, and HTTP/3.

---

## Part 3: Verification & Health Check

1. Test backend health through Cloudflare:
   ```bash
   curl -s https://api.yourdomain.com/health | jq
   ```
   Expected response:
   ```json
   {
     "status": "healthy",
     "model_loaded": true,
     "model_name": "Sinhala_Singlish_Phishing_BiGRU_Model",
     "version": "1.0.0"
   }
   ```

2. Test live inference:
   ```bash
   curl -X POST https://api.yourdomain.com/api/v1/predict \
     -H "Content-Type: application/json" \
     -d '{"message": "Congratulations! You have won Rs. 50,000. Claim at http://scam.xyz"}'
   ```

3. Open your Cloudflare Pages frontend URL (`https://sinhala-phishing-detector.pages.dev`) and test Sinhala, Singlish, and English messages in the browser interface.
