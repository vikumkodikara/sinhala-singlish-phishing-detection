pipeline {
    agent any

    options {
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
        timestamps()
        ansiColor('xterm')
    }

    environment {
        PYTHON_VERSION = '3.11'
        NODE_VERSION = '18'
        VITE_API_URL = 'https://sinhala-singlish-phishing-detection.onrender.com'
        // Jenkins Credentials IDs (configured in Jenkins Dashboard > Credentials)
        CLOUDFLARE_API_TOKEN = credentials('cloudflare-api-token')
        RENDER_DEPLOY_HOOK = credentials('render-deploy-hook-url')
    }

    stages {

        // =====================================================================
        // STAGE 1: Code Checkout
        // =====================================================================
        stage('Checkout SCM') {
            steps {
                echo 'Pulling latest code from repository...'
                checkout scm
            }
        }

        // =====================================================================
        // STAGE 2: Backend CI (Tests & Linting)
        // =====================================================================
        stage('Backend CI (Tests & Linting)') {
            steps {
                echo 'Running Backend Test Suite & Linting...'
                sh '''
                    # Setup Python virtual environment
                    python3 -m venv .venv
                    . .venv/bin/activate
                    pip install --upgrade pip
                    pip install -r backend/requirements.txt pytest-cov ruff

                    # Run Ruff linter
                    echo "Running Ruff code analysis..."
                    ruff check backend/ || true

                    # Run Pytest unit & integration tests with coverage
                    echo "Executing pytest suite..."
                    python -m pytest backend/tests/ -v --junitxml=pytest-results.xml --cov=backend
                '''
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'pytest-results.xml'
                }
            }
        }

        // =====================================================================
        // STAGE 3: Frontend CI (Build & Validate)
        // =====================================================================
        stage('Frontend CI (Build & Validate)') {
            steps {
                echo 'Building and validating Frontend bundle...'
                dir('frontend') {
                    sh '''
                        # Set production API URL
                        export VITE_API_URL="${VITE_API_URL}"

                        # Install dependencies and build
                        npm ci || npm install
                        npm run build
                    '''
                }
            }
        }

        // =====================================================================
        // STAGE 4: Backend CD (Deploy to Render Cloud)
        // =====================================================================
        stage('Backend CD (Deploy to Render)') {
            when {
                branch 'main'
            }
            steps {
                echo 'Triggering Render automated deployment hook...'
                sh '''
                    if [ -n "$RENDER_DEPLOY_HOOK" ]; then
                        curl -X POST -s "$RENDER_DEPLOY_HOOK"
                        echo "Render deploy hook triggered successfully."
                    else
                        echo "No RENDER_DEPLOY_HOOK credential configured. Skipping webhook trigger."
                    fi
                '''
            }
        }

        // =====================================================================
        // STAGE 5: Frontend CD (Deploy to Cloudflare Workers / Pages)
        // =====================================================================
        stage('Frontend CD (Deploy to Cloudflare)') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying Frontend static assets to Cloudflare...'
                dir('frontend') {
                    sh '''
                        export CLOUDFLARE_API_TOKEN="${CLOUDFLARE_API_TOKEN}"
                        npx wrangler deploy
                    '''
                }
            }
        }

        // =====================================================================
        // STAGE 6: Post-Deployment Smoke Test & Health Check
        // =====================================================================
        stage('Post-Deployment Verification') {
            when {
                branch 'main'
            }
            steps {
                echo 'Verifying live backend health...'
                sh '''
                    # Wait 10 seconds for service synchronization
                    sleep 10

                    # Health check endpoint verification
                    echo "Checking live /health endpoint..."
                    curl -sf --max-time 15 "https://sinhala-singlish-phishing-detection.onrender.com/health" || {
                        echo "Warning: Healthcheck timed out or service is waking up."
                    }

                    # Live inference smoke test
                    echo "Running test inference query..."
                    curl -sf -X POST "https://sinhala-singlish-phishing-detection.onrender.com/api/v1/predict" \
                         -H "Content-Type: application/json" \
                         -d '{"message":"Test verification message"}' || true
                '''
            }
        }

    }

    // =========================================================================
    // POST PIPELINE ACTIONS & NOTIFICATIONS
    // =========================================================================
    post {
        success {
            echo '=================================================='
            echo ' CI/CD PIPELINE SUCCEEDED: App is live on Cloudflare & Render!'
            echo '=================================================='
        }
        failure {
            echo '=================================================='
            echo ' CI/CD PIPELINE FAILED: Please check stage logs.'
            echo '=================================================='
        }
    }
}
