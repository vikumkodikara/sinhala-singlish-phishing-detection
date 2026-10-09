# Jenkins CI/CD Automation Guide

This guide explains how to set up an automated **Jenkins CI/CD Pipeline** for the **Sinhala/Singlish Phishing Detection System**, covering automated unit testing, frontend building, Render backend deployment, Cloudflare edge delivery, and live smoke tests.

---

## 🗺️ CI/CD Pipeline Architecture

```
GitHub Push / PR
      │
      ▼
[ Jenkins Webhook Trigger ]
      │
      ├─► Stage 1: Checkout SCM (Pull latest source)
      │
      ├─► Stage 2: Backend CI (Pytest 24 unit tests + Ruff linting + Code coverage)
      │
      ├─► Stage 3: Frontend CI (TypeScript check + Vite production bundle build)
      │
      ├─► Stage 4: Backend CD (Trigger Render deployment webhook)
      │
      ├─► Stage 5: Frontend CD (Deploy static assets to Cloudflare Workers via Wrangler)
      │
      └─► Stage 6: Post-Deployment Smoke Test (Verify live /health & /predict endpoints)
```

---

## 📋 Prerequisites & Jenkins Plugins

Ensure your Jenkins instance has the following installed:

1. **Required Tools on Jenkins Agent**:
   - `python3` (3.10 or 3.11) & `python3-venv`
   - `node` (18+ or 20+) & `npm`
   - `git`
   - `curl`

2. **Recommended Jenkins Plugins** (Manage Jenkins ➔ Plugins):
   - **Pipeline** (`workflow-aggregator`)
   - **Git Plugin**
   - **NodeJS Plugin** (Allows automatic Node.js tool provisioning)
   - **JUnit Plugin** (For test result visualization)
   - **AnsiColor Plugin** (For colorful console logs)
   - **Credentials Binding Plugin**

---

## 🔑 Step 1: Configure Jenkins Credentials

Go to **Jenkins Dashboard** ➔ **Manage Jenkins** ➔ **Credentials** ➔ **System** ➔ **Global credentials** ➔ **Add Credentials**:

### 1. Cloudflare API Token:
- **Kind**: `Secret text`
- **Secret**: *(Paste your Cloudflare API Token with Workers/Pages edit permissions)*
- **ID**: `cloudflare-api-token`
- **Description**: `Cloudflare API Token for Wrangler Deployment`

### 2. Render Deploy Hook URL:
- **Where to get it**: In your Render Dashboard ➔ Select `sinhala-singlish-phishing-detection` ➔ **Settings** ➔ Scroll to **Deploy Hook** ➔ Copy the Webhook URL.
- **Kind**: `Secret text`
- **Secret**: `https://api.render.com/deploy/srv-xxxx?key=yyyy`
- **ID**: `render-deploy-hook-url`
- **Description**: `Render Cloud Automated Deploy Webhook`

---

## 🛠️ Step 2: Create the Pipeline Job in Jenkins

1. On the Jenkins home screen, click **New Item**.
2. Enter name: **`sinhala-phishing-pipeline`**.
3. Select **Pipeline** (or **Multibranch Pipeline**) and click **OK**.
4. Configure Job Settings:
   - Under **Build Triggers**: Check **GitHub hook trigger for GITScm polling**.
   - Under **Pipeline**:
     - **Definition**: `Pipeline script from SCM`
     - **SCM**: `Git`
     - **Repository URL**: `https://github.com/vikumkodikara/sinhala-singlish-phishing-detection.git`
     - **Branch Specifier**: `*/main`
     - **Script Path**: `Jenkinsfile`
5. Click **Save**.

---

## ⚡ Step 3: Configure GitHub Webhook for Instant Builds

To trigger the Jenkins pipeline automatically every time you `git push`:

1. Go to your **GitHub Repository** ➔ **Settings** ➔ **Webhooks**.
2. Click **Add webhook**.
3. Set:
   - **Payload URL**: `https://<YOUR_JENKINS_SERVER_URL>/github-webhook/`
   - **Content type**: `application/json`
   - **Which events would you like to trigger this webhook?**: `Just the push event` (and Pull Requests if desired).
4. Click **Add webhook**.

---

## 🧪 Step 4: Run the Pipeline

1. In Jenkins, click **Build Now** to test the pipeline immediately.
2. Jenkins will:
   - Run the 24 backend Pytest tests (producing a test report graph in Jenkins).
   - Compile the React/TypeScript/Tailwind bundle into `dist/`.
   - Trigger the Render backend deployment.
   - Deploy the compiled frontend to Cloudflare.
   - Run an automated smoke test against the live `/health` endpoint.

---

## 📊 Pipeline Stages Breakdown in `Jenkinsfile`

| Stage | What it Does | Failure Action |
|---|---|---|
| **Checkout SCM** | Clones the latest commit from GitHub | Aborts pipeline |
| **Backend CI** | Runs pytest suite & ruff linter | Fails build if any test fails |
| **Frontend CI** | Runs `npm run build` | Fails build on TypeScript/Tailwind compilation errors |
| **Backend CD** | Calls Render deploy webhook via curl | Deploys on `main` branch only |
| **Frontend CD** | Runs `npx wrangler deploy` to Cloudflare | Deploys on `main` branch only |
| **Verification** | Smoke tests live `/health` and `/predict` | Warns if endpoint is slow or waking up |
