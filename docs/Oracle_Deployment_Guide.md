# Oracle Cloud VM Deployment Guide for Sinhala/Singlish Phishing Detection Backend

This guide walks through deploying the FastAPI ML Inference backend to an **Oracle Cloud Infrastructure (OCI) Compute Instance** (Free Tier or Paid VM) using **Docker** and **Docker Compose**.

---

## 📋 Architecture & Prerequisites

- **Backend Framework**: FastAPI + Uvicorn
- **ML Runtime**: TensorFlow / Keras (BiGRU + Custom Attention Layer + 9 Handcrafted Features)
- **Target OS**: Ubuntu 22.04 / 24.04 LTS or Oracle Linux 8 / 9
- **Required Ports**:
  - `8000`: FastAPI Backend API & Swagger Docs (`/docs`, `/health`, `/api/v1/predict`)
  - `3000`: (Optional) React/Vite Frontend
  - `22`: SSH Access

---

## ⚡ Quick Deployment (Automated Script)

Once logged into your Oracle VM terminal, simply execute:

```bash
# 1. Clone your repository (or pull latest changes)
git clone https://github.com/<YOUR_GITHUB_USERNAME>/sinhala-singlish-phishing-detection.git
cd sinhala-singlish-phishing-detection

# 2. Make the deploy script executable and run it
chmod +x scripts/deploy_oracle.sh
./scripts/deploy_oracle.sh
```

The script automatically:
1. Configures host OS firewall (`iptables`, `ufw`, or `firewalld`) to open port `8000`.
2. Installs Docker Engine & Docker Compose if missing.
3. Builds the Docker container with ML models and starts the service in detached mode (`-d`).
4. Performs health validation and prints active endpoint URLs.

---

## 🛠️ Step-by-Step Manual Deployment Guide

If you prefer to run each step manually:

### Step 1: Configure OCI Cloud Network Ingress Rules (CRITICAL)

> [!IMPORTANT]
> Oracle Cloud Virtual Cloud Networks (VCN) block all inbound traffic except port 22 by default. You **MUST** open port 8000 in the OCI Console:

1. Log in to [Oracle Cloud Console](https://cloud.oracle.com/).
2. Navigate to **Networking** &rarr; **Virtual Cloud Networks**.
3. Select your VCN and click on your **Subnet** (e.g., *Public Subnet*).
4. Click on **Default Security List for `<your-vcn>`**.
5. Click **Add Ingress Rules**:
   - **Source Type**: `CIDR`
   - **Source CIDR**: `0.0.0.0/0`
   - **IP Protocol**: `TCP`
   - **Destination Port Range**: `8000` (or `8000, 3000, 80, 443`)
   - **Description**: `Sinhala Phishing FastAPI Backend`
6. Click **Add Ingress Rules**.

---

### Step 2: Configure VM Host OS Firewall

Oracle Cloud Linux images have OS-level firewall rules active by default. Open port `8000`:

#### On Ubuntu / Debian:
```bash
# Open port in iptables (Oracle Cloud default reject rule workaround)
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 8000 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 3000 -j ACCEPT

# Allow via UFW (if ufw is active)
sudo ufw allow 8000/tcp
sudo ufw allow 3000/tcp

# Save iptables rules across reboots
sudo apt-get install -y iptables-persistent
sudo netfilter-persistent save
```

#### On Oracle Linux:
```bash
sudo firewall-cmd --permanent --add-port=8000/tcp
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

---

### Step 3: Install Docker & Docker Compose (If not installed)

```bash
# Fast install script for Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Apply group membership without logging out
newgrp docker
```

---

### Step 4: Clone & Launch Backend

```bash
# Clone the repository
git clone https://github.com/<YOUR_GITHUB_USERNAME>/sinhala-singlish-phishing-detection.git
cd sinhala-singlish-phishing-detection

# Launch the backend container with Docker Compose
docker compose up -d --build backend
```

Check the status and logs:
```bash
# Check running containers
docker compose ps

# View real-time application logs
docker compose logs -f backend
```

---

### Step 5: Test & Validate Endpoints

#### 1. Test Health Check Locally on the VM:
```bash
curl http://localhost:8000/health
```

Expected output:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_name": "Sinhala_Singlish_Phishing_BiGRU_Model",
  "version": "1.0.0",
  "vocab_size": 14949,
  "max_sequence_length": 120,
  "num_features": 9
}
```

#### 2. Test Real Prediction from your Local Machine:
Replace `<ORACLE_VM_PUBLIC_IP>` with your instance's public IP:

```bash
curl -X POST "http://<ORACLE_VM_PUBLIC_IP>:8000/api/v1/predict" \
     -H "Content-Type: application/json" \
     -d '{"message": "Oyage Commercial Bank account eka suspend wenawa danma verify karanna http://combank-secure-update.lk/login OTP eka danna."}'
```

Response:
```json
{
  "prediction": "PHISHING",
  "probability": 0.9982,
  "confidence": 99.82,
  "risk_level": "HIGH",
  "detected_script": "SINGLISH",
  "preprocessed_text": "oyage commercial bank account eka suspend wenawa danma verify karanna http combank secure update lk login otp eka danna",
  "detected_features": {
    "url_count": 1,
    "url_length": 34,
    "subdomain_count": 0,
    "digit_count": 0,
    "exclamation_count": 0,
    "question_count": 0,
    "text_length": 122,
    "word_count": 15,
    "suspicious_word_count": 4
  },
  "warning": null
}
```

#### 3. Interactive Swagger API Docs:
Visit in your web browser:
`http://<ORACLE_VM_PUBLIC_IP>:8000/docs`

---

## 🔧 Useful Operational Commands

| Action | Command |
|---|---|
| **View logs** | `docker compose logs -f backend` |
| **Restart backend** | `docker compose restart backend` |
| **Rebuild & update backend** | `docker compose up -d --build backend` |
| **Stop backend** | `docker compose down` |
| **Check memory & CPU usage** | `docker stats` |

---

## 🌐 Connecting Cloudflare Frontend with Oracle Cloud Backend

When your frontend is hosted on **Cloudflare Pages / Workers**, browsers enforce **Mixed Content Security**:
> **An `https://` website (Cloudflare Pages) is NOT allowed to call an insecure `http://` backend.**

You need an **HTTPS endpoint** for your Oracle backend. Here are the two best ways:

---

### 🚀 Option 1: Instant Free HTTPS via Cloudflare Quick Tunnel (Easiest & Fastest)

On your Oracle VM, run Cloudflare Tunnel directly in Docker to generate an instant, secure public HTTPS URL with **no domain setup and no port opening needed**:

```bash
# Start a free Cloudflare Quick Tunnel forwarding to your local FastAPI container
docker run -d --name phishing_cf_tunnel --network host cloudflare/cloudflared:latest tunnel --url http://localhost:8000
```

To see your generated HTTPS URL:
```bash
docker logs phishing_cf_tunnel 2>&1 | grep -o 'https://.*\.trycloudflare\.com' | head -n 1
```
*Example output:* `https://sinhala-phishing-api-abcd1234.trycloudflare.com`

---

### 🛡️ Option 2: Production Cloudflare Tunnel (With Custom Subdomain)

If you have a domain managed on Cloudflare (e.g. `yourdomain.com`):

1. Go to **Cloudflare Zero Trust Dashboard** ➔ **Networks** ➔ **Tunnels**.
2. Click **Create Tunnel** ➔ Name it `sinhala-phishing-backend`.
3. Choose **Docker** as the environment and copy the provided tunnel token.
4. Set the Public Hostname:
   - **Subdomain:** `api`
   - **Domain:** `yourdomain.com`
   - **Service Type:** `HTTP`
   - **URL:** `localhost:8000` (or `backend:8000`)
5. On your Oracle VM, run:
```bash
CLOUDFLARE_TUNNEL_TOKEN="<PASTE_YOUR_TUNNEL_TOKEN_HERE>" docker compose --profile tunnel up -d
```
Your backend is now securely accessible worldwide at `https://api.yourdomain.com`!

---

### ⚙️ Step: Set Backend URL in Cloudflare Pages Frontend

1. Go to **[Cloudflare Dashboard](https://dash.cloudflare.com/)** ➔ **Workers & Pages**.
2. Select your frontend project (e.g. `sinhala-singlish-phishing-detection`).
3. Navigate to **Settings** ➔ **Environment Variables**.
4. Add variable:
   - **Variable name:** `VITE_API_URL`
   - **Value:** `https://<YOUR_BACKEND_HTTPS_URL>` *(e.g. `https://api.yourdomain.com` or `https://xxxx.trycloudflare.com` — do NOT include trailing slash)*
5. Save and trigger a new deployment under **Deployments** ➔ **Retry deployment** (or redeploy via Git push / `wrangler`).

---

## ❓ Troubleshooting Common Oracle Issues

### 1. Mixed Content Error in Browser Console (`Blocked loading mixed active content`)
- The frontend is on `https://` but tried to request `http://<IP>:8000`.
- **Solution:** Use Cloudflare Tunnel (Option 1 or Option 2 above) to get an `https://` backend URL.

### 2. Connection times out when accessing from outside
- Ensure **both** the OCI Security List Ingress Rule (Step 1) and the VM OS firewall (Step 2) have allowed port `8000`.
- Alternatively, Cloudflare Tunnel (Option 1) bypasses all firewalls and port opening completely!

### 3. Out of Memory (OOM) during `pip install` or Model Loading
If using an instance with limited RAM (e.g., 1 GB RAM):
```bash
# Add a 2GB swap file
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```
