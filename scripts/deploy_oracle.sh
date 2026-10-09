#!/usr/bin/env bash
# ==============================================================================
# Oracle Cloud VM - Sinhala/Singlish Phishing Detection Backend Deployment
# ==============================================================================
# Usage:
#   chmod +x scripts/deploy_oracle.sh
#   ./scripts/deploy_oracle.sh
# ==============================================================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}  Sinhala Phishing Detection - Oracle Cloud Deployer  ${NC}"
echo -e "${BLUE}======================================================${NC}"

# 1. Detect OS
OS_FAMILY="unknown"
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS_FAMILY=$ID
fi
echo -e "${GREEN}[*] Detected OS:${NC} $OS_FAMILY ($PRETTY_NAME)"

# 2. Configure Host OS Firewall for Port 8000 (and 80/443/3000)
echo -e "\n${YELLOW}[1/4] Configuring OS-level Firewall rules...${NC}"
if command -v ufw >/dev/null 2>&1; then
    echo -e "  Configuring UFW..."
    sudo ufw allow 8000/tcp comment 'FastAPI Backend' || true
    sudo ufw allow 80/tcp comment 'HTTP' || true
    sudo ufw allow 443/tcp comment 'HTTPS' || true
    sudo ufw allow 3000/tcp comment 'Frontend' || true
fi

# Oracle Cloud Ubuntu / Debian default iptables rule bypass
if command -v iptables >/dev/null 2>&1; then
    echo -e "  Updating iptables for Oracle Cloud..."
    sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 8000 -j ACCEPT 2>/dev/null || \
    sudo iptables -I INPUT 1 -p tcp --dport 8000 -j ACCEPT 2>/dev/null || true
    
    sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 3000 -j ACCEPT 2>/dev/null || \
    sudo iptables -I INPUT 1 -p tcp --dport 3000 -j ACCEPT 2>/dev/null || true

    if command -v netfilter-persistent >/dev/null 2>&1; then
        sudo netfilter-persistent save || true
    fi
fi

# Oracle Linux / RHEL firewalld
if command -v firewall-cmd >/dev/null 2>&1; then
    echo -e "  Configuring firewalld for Oracle Linux..."
    sudo firewall-cmd --permanent --add-port=8000/tcp || true
    sudo firewall-cmd --permanent --add-port=3000/tcp || true
    sudo firewall-cmd --permanent --add-port=80/tcp || true
    sudo firewall-cmd --permanent --add-port=443/tcp || true
    sudo firewall-cmd --reload || true
fi

# 3. Check / Install Docker and Docker Compose
echo -e "\n${YELLOW}[2/4] Verifying Docker installation...${NC}"
if ! command -v docker >/dev/null 2>&1; then
    echo -e "  Docker not found. Installing Docker Engine..."
    if [ "$OS_FAMILY" = "ubuntu" ] || [ "$OS_FAMILY" = "debian" ]; then
        sudo apt-get update
        sudo apt-get install -y curl ca-certificates gnupg lsb-release
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        rm -f get-docker.sh
    elif [ "$OS_FAMILY" = "ol" ] || [ "$OS_FAMILY" = "rhel" ] || [ "$OS_FAMILY" = "centos" ]; then
        sudo dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo
        sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
        sudo systemctl enable --now docker
    else
        echo -e "${RED}[!] Unsupported OS for auto-docker install. Please install Docker manually.${NC}"
    fi
    sudo usermod -aG docker "$USER" || true
    echo -e "${GREEN}[✓] Docker installed successfully.${NC}"
else
    echo -e "${GREEN}[✓] Docker is already installed: $(docker --version)${NC}"
fi

# 4. Build and Launch Containers
echo -e "\n${YELLOW}[3/4] Building and launching Backend container...${NC}"
if docker compose version >/dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker-compose"
else
    DOCKER_COMPOSE_CMD="docker compose"
fi

# Build & Run backend
$DOCKER_COMPOSE_CMD up -d --build backend

echo -e "\n${YELLOW}[4/4] Verifying backend health...${NC}"
sleep 5

MAX_RETRIES=10
RETRY_COUNT=0
HEALTH_OK=false

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -sf http://localhost:8000/health >/dev/null 2>&1; then
        HEALTH_OK=true
        break
    fi
    echo -e "  Waiting for model initialization in container (attempt $((RETRY_COUNT+1))/$MAX_RETRIES)..."
    sleep 4
    RETRY_COUNT=$((RETRY_COUNT+1))
done

if [ "$HEALTH_OK" = true ]; then
    echo -e "\n${GREEN}======================================================${NC}"
    echo -e "${GREEN}  ✓ Backend Successfully Deployed and Healthy!        ${NC}"
    echo -e "${GREEN}======================================================${NC}"
    echo -e "Health Check Response:"
    curl -s http://localhost:8000/health | python3 -m json.tool || curl -s http://localhost:8000/health
    echo -e "\n"
    
    # Get Public IP if available
    PUBLIC_IP=$(curl -s -m 3 ifconfig.me || curl -s -m 3 icanhazip.com || echo "<YOUR_ORACLE_PUBLIC_IP>")
    echo -e "Test your live endpoints from anywhere:"
    echo -e "  - ${BLUE}API Documentation:${NC} http://${PUBLIC_IP}:8000/docs"
    echo -e "  - ${BLUE}Health Check:${NC}      http://${PUBLIC_IP}:8000/health"
    echo -e "  - ${BLUE}Inference Route:${NC}   http://${PUBLIC_IP}:8000/api/v1/predict"
    echo -e "\n${YELLOW}IMPORTANT OCI NOTE:${NC}"
    echo -e "If external requests timeout, ensure you added an ${GREEN}Ingress Rule${NC} in the OCI Console:"
    echo -e "  1. Networking -> Virtual Cloud Networks -> Your VCN -> Security Lists"
    echo -e "  2. Add Ingress Rule: Source=0.0.0.0/0, Protocol=TCP, Destination Port=8000"
else
    echo -e "\n${RED}======================================================${NC}"
    echo -e "${RED}  [!] Backend container started but health check failed. ${NC}"
    echo -e "${RED}======================================================${NC}"
    echo -e "Viewing recent container logs:"
    $DOCKER_COMPOSE_CMD logs --tail=50 backend
fi
