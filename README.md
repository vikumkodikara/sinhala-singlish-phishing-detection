# Sinhala/Singlish Phishing Detection System

> **AI-Assisted Phishing Detection for Sinhala, Singlish, and English Mobile Messages**  
> *University Research Prototype &bull; Natural Language Processing &bull; Deep Learning*

---

## Overview

Mobile SMS phishing (*smishing*) has become a prevalent threat targeting mobile subscribers in Sri Lanka. Attackers frequently exploit multilingual communication patterns—combining **Sinhala Unicode script**, **Singlish** (Sinhala language written phonetically in Latin script), and **English**—to evade standard keyword and heuristic filters.

This repository provides a web-based phishing message detection system powered by a pre-trained **Bidirectional GRU (BiGRU) neural network with a custom Attention Mechanism** and **9 domain-engineered handcrafted features**. The system performs real inference using the original trained Keras (`.keras`) model without retraining, quantization loss, or mock outputs.

```
+-----------------------------------------------------------------------------------+
|                                WEB BROWSER UI                                     |
|  [ Paste SMS Message in Sinhala, Singlish, or English ] -> [ Analyze Message ]   |
+-----------------------------------------+-----------------------------------------+
                                          | HTTP POST /api/v1/predict
                                          v
+-----------------------------------------------------------------------------------+
|                              FASTAPI REST BACKEND                                 |
|                                                                                   |
|   1. Text Preprocessing (Unicode NFC, Number-Preserving Token Normalization)     |
|   2. Sequence Tokenization (Max Length = 120, Vocab Size = 8,908)                |
|   3. Handcrafted Feature Extraction (9 URL & Linguistic Domain Signals)           |
|                                                                                   |
|                                         v                                         |
|                   +---------------------------------------------+                 |
|                   |  Trained Keras Model (Multi-Input BiGRU)    |                 |
|                   |  - Text Branch: Embedding -> BiGRU -> Attn  |                 |
|                   |  - Feature Branch: StandardScaler -> Dense  |                 |
|                   |  - Feature Fusion -> Dense MLP -> Sigmoid   |                 |
|                   +---------------------------------------------+                 |
|                                         |                                         |
|   4. Prediction Verdict (PHISHING / SAFE), Confidence %, Risk Level, Indicators  |
+-----------------------------------------+-----------------------------------------+
                                          | JSON Response
                                          v
+-----------------------------------------------------------------------------------+
|                           CYBERSECURITY DASHBOARD UI                              |
|   [ Status Badge | Confidence Meter | 9 Features Matrix | Normalized Sequence ]   |
+-----------------------------------------------------------------------------------+
```

---

## Research Motivation

1. **Multilingual Complexity in Sri Lanka**: Mobile communication in Sri Lanka dynamically shifts between native Sinhala script (`ඔබගේ ගිණුම`), Singlish phonetic transliteration (`oyage account eka`), and English (`verify your password`). Attackers leverage code-mixing to bypass monolingual rule-based security systems.
2. **Context-Aware Sequence Understanding**: Conventional keyword blocklists fail against subtle variations. Recurrent deep learning with attention captures bidirectional contextual dependencies across characters and words.
3. **Hybrid Feature Fusion**: Incorporating structural URL indicators (subdomain counts, URL lengths) with linguistic signals (financial keywords, punctuation intensity) provides critical domain context alongside deep sequence embeddings.

---

## Features

- **Real Deep Learning Inference**: Loads the pre-trained `phishing_model.keras` into memory on backend startup.
- **Multilingual Support**: Analyzes messages written in **Sinhala (Unicode)**, **Singlish (Latin)**, **English**, and mixed scripts.
- **9 Handcrafted Domain Features**: Extracted strictly via safe static text analysis.
- **Zero URL Fetching Guarantee**: Embedded URLs are analyzed purely as text strings; no external HTTP requests, DNS resolutions, or socket calls are ever made.
- **Privacy by Design**: Submissions are evaluated in-memory and are not permanently logged or stored on disk.
- **Professional Cybersecurity Interface**: Dark-mode dashboard with instant feedback, risk level categorization, confidence metering, and feature breakdowns.
- **Full Research Transparency**: Interactive benchmarks and model architecture views explaining dataset distributions and evaluation limits.

---

## System Architecture

The solution uses a decoupled, containerized client-server architecture:

- **Frontend**: React 18, TypeScript, Vite, Vanilla CSS design system tailored for cybersecurity operations.
- **Backend**: Python 3.11/3.13, FastAPI, Uvicorn, TensorFlow / Keras 3.
- **Model Storage**: Loaded once at startup using a singleton service pattern (`ModelService`).

---

## Machine Learning Model

The trained deep learning model (`Sinhala_Singlish_Phishing_BiGRU_Model`) is a **multi-input hybrid architecture**:

| Component | Layer / Specification | Output Shape | Parameters |
|---|---|---|---|
| **Text Input** | `text_input` (Sequence IDs) | `(None, 120)` | 0 |
| **Embedding** | `Embedding(input_dim=8909, output_dim=128)` | `(None, 120, 128)` | 1,140,352 |
| **Recurrent Encoder** | `Bidirectional(GRU(64, return_sequences=True))` | `(None, 120, 128)` | 74,496 |
| **Attention Mechanism**| `AttentionLayer()` (Context Softmax Weighting) | `(None, 128)` | 248 |
| **Feature Input** | `feature_input` (9 Handcrafted Features) | `(None, 9)` | 0 |
| **Feature Dense** | `Dense(32, activation='relu')` | `(None, 32)` | 320 |
| **Fusion Layer** | `Concatenate([Attention, Feature_Dense])` | `(None, 160)` | 0 |
| **Dense Head 1** | `Dense(64, activation='relu')` + `Dropout(0.3)` | `(None, 64)` | 10,304 |
| **Dense Head 2** | `Dense(32, activation='relu')` + `Dropout(0.2)` | `(None, 32)` | 2,080 |
| **Output Layer** | `Dense(1, activation='sigmoid')` | `(None, 1)` | 33 |

**Total Parameters**: 3,683,501 (14.05 MB) &bull; **Trainable Parameters**: 1,227,833 (4.68 MB).

---

## Dataset

The model was trained on the **Sinhala/Singlish Mobile Phishing Master Dataset**:

- **Total Records**: 10,040 messages
- **Synthetic Records**: 10,000 augmented examples (controlled phishing templates and legitimate notifications)
- **Authentic Local Observations**: 40 real-world user-submitted messages
- **Split Ratio**: 70% Training (7,028 samples), 15% Validation (1,506 samples), 15% Testing (1,506 samples)

---

## Preprocessing

The preprocessing pipeline reproduces the exact normalization used during training:

1. **Unicode NFC Normalization**: Standardizes Sinhala vowel diacritics and composite glyphs (`unicodedata.normalize("NFC", text)`).
2. **Whitespace Normalization**: Collapses irregular tabs, newlines, and multi-spaces (`re.sub(r"\s+", " ", text)`).
3. **Number-Preserving Character Normalization**: Repeated characters in words are collapsed to at most 3 instances (e.g. `pleeeeease` &rarr; `pleeease`), while numeric strings (`Rs.250000`, `OTP 849201`, phone numbers) are **strictly preserved** using `re.sub(r"([^\d\s])\1{3,}", r"\1\1\1", text)`.
4. **Tokenization & Sequence Padding**: Maps word tokens to integer vocabulary indices (`MAX_WORDS=20000`, `MAX_LENGTH=120`, post-padding with 0).

---

## Handcrafted Features

The model ingests 9 domain-specific numerical features, standardized via `StandardScaler`:

1. `url_count`: Total URLs matching `https?://\S+|www\.\S+`.
2. `url_length`: Character length of the longest embedded URL.
3. `subdomain_count`: Number of nested subdomains in the domain host.
4. `digit_count`: Total numeric digits in the message.
5. `exclamation_count`: Frequency of exclamation marks (`!`).
6. `question_count`: Frequency of question marks (`?`).
7. `text_length`: Total character count of normalized message.
8. `word_count`: Total word count.
9. `suspicious_word_count`: Hits against financial/urgency keyword vocabulary (`otp`, `verify`, `account`, `bank`, `password`, `urgent`, `click`, `win`, `winner`, `free`, `prize`, `refund`, `loan`, `payment`, `deposit`, `register`).

---

## API Documentation

### 1. Health Check
`GET /health`

**Response (`200 OK`)**:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_name": "Sinhala_Singlish_Phishing_BiGRU_Model",
  "version": "1.0.0",
  "vocab_size": 8908,
  "max_sequence_length": 120,
  "num_features": 9
}
```

### 2. Predict Message
`POST /api/v1/predict`

**Request Body**:
```json
{
  "message": "Congratulations! You have won Rs. 50,000 in the Dialog Mega Draw. Claim now at http://secure-dialog-reward.xyz/claim"
}
```

**Response (`200 OK`)**:
```json
{
  "prediction": "PHISHING",
  "probability": 0.9986,
  "confidence": 99.86,
  "risk_level": "HIGH",
  "detected_script": "English / Singlish",
  "preprocessed_text": "Congratulations! You have won Rs. 50,000 in the Dialog Mega Draw. Claim now at http://secure-dialog-reward.xyz/claim",
  "detected_features": {
    "url_count": 1,
    "url_length": 37,
    "subdomain_count": 0,
    "digit_count": 5,
    "exclamation_count": 1,
    "question_count": 0,
    "text_length": 127,
    "word_count": 17,
    "suspicious_word_count": 1
  },
  "warning": null
}
```

### 3. Model Metadata & Benchmarks
`GET /api/v1/model-info`

### 4. Benchmark Samples
`GET /api/v1/samples`

Interactive Swagger documentation is available at `http://localhost:8000/docs`.

---

## Running Locally

### Prerequisites
- Python 3.10+ (tested on Python 3.11 and 3.13)
- Node.js 18+ and npm

### 1. Backend Setup
```bash
# Install Python dependencies
pip install -r backend/requirements.txt

# Run model validation script
python scripts/test_model_inference.py

# Start FastAPI server
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
The backend will be available at `http://localhost:8000`.

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
The web application will open at `http://localhost:3000`.

---

## Docker Deployment

Deploy the entire stack with Docker Compose:

```bash
# Build and run backend + frontend containers
docker-compose up --build -d

# Check service status
docker-compose ps

# View backend logs
docker-compose logs -f backend
```

- **Web Frontend**: `http://localhost:3000`
- **FastAPI Backend**: `http://localhost:8000`
- **Swagger Docs**: `http://localhost:8000/docs`

---

## Cloudflare Deployment

The application is structured for easy deployment on **Cloudflare**:

1. **Frontend on Cloudflare Pages**: Connect your Git repository, set root directory to `frontend`, build command to `npm run build`, output directory to `dist`, and set environment variable `VITE_API_URL` to your backend API URL.
2. **Backend via Cloudflare Tunnel / DNS**: Deploy the backend container via Docker and connect it to Cloudflare edge using **Cloudflare Tunnel (`cloudflared`)** or **Cloudflare Proxied DNS** for global SSL and DDoS protection.

> For complete step-by-step instructions, see the [Cloudflare Deployment Guide](docs/CLOUDFLARE_DEPLOYMENT.md).

---

## Testing

Run the full automated test suite:

```bash
# Run backend unit and integration tests with pytest
python -m pytest backend/tests/ -v

# Run model inference validation
python scripts/test_model_inference.py

# Run CLI prediction test
python ml-engine/predict.py --text "ඔබගේ බැංකු ගිණුම verify කරන්න http://bank.com"
```

---

## Research Results

### 1. Synthetic-Heavy Random-Split Benchmark (Held-out Test Set, N=1,344)
- **Accuracy**: 100.0%
- **Precision**: 100.0%
- **Recall**: 100.0%
- **F1-Score**: 100.0%
- **ROC-AUC**: 1.0000
- **Confusion Matrix**: True Negative = 327, False Positive = 0, False Negative = 0, True Positive = 1,017

### 2. Real-World Authentic Message Holdout Audit (N=28 Authentic Messages)
- **Accuracy**: 92.86%
- **Precision**: 100.0%
- **Recall**: 92.31%
- **F1-Score**: 96.00%
- **ROC-AUC**: 0.9808
- **Confusion Matrix**:
  - `SAFE`: 2 correctly classified, 0 false alarms
  - `PHISHING`: 24 correctly classified, 2 missed

*Note: The real-message audit is exploratory due to the small real-world holdout sample size. Results are presented for academic transparency and should not be construed as a commercial production guarantee.*

---

## Limitations

1. **Android/TFLite Deployment Constraint**:
   > The original research direction considered on-device Android deployment. The recurrent Keras model was not successfully converted to TensorFlow Lite due to recurrent-operation compatibility constraints (bidirectional GRU states and custom attention layer mapping). The current implementation therefore provides server-side inference through a web application.
2. **Small Real-World Sample Size**: The primary dataset relies heavily on synthetic templates (10,000 synthetic vs. 40 real). Ongoing research is expanding real-world Sri Lankan smishing collections.
3. **Evolving Attack Vectors**: Novel zero-day homoglyphs, obfuscated URL shorteners, or unseen Singlish slang may require periodic vocabulary updates.

---

## Future Work

- Expanding authentic Sri Lankan SMS datasets through crowd-sourced threat intelligence.
- Fine-tuning lightweight multilingual Transformer models (e.g., Sinhala-BERT / XLM-RoBERTa).
- Implementing ONNX runtime export for cross-platform low-latency edge deployment.
- Integrating real-time threat intelligence feed lookups for newly registered phishing domains.

---

## Project Structure

```
sinhala-singlish-phishing-detection/
│
├── backend/
│   ├── app/
│   │   ├── main.py                      # FastAPI application entry point & lifespan
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── routes.py                # REST API endpoints (/predict, /health, /model-info)
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── model_service.py         # Singleton Keras model loader & AttentionLayer
│   │   │   ├── preprocessing.py         # Unicode NFC & number-preserving normalization
│   │   │   └── feature_extraction.py    # 9 handcrafted URL and linguistic features
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── prediction.py            # Pydantic request & response schemas
│   │   └── utils/
│   │       ├── __init__.py
│   │       └── logger.py                # Security-conscious structured logging
│   ├── models/
│   │   ├── phishing_model.keras         # Trained BiGRU + Attention research model
│   │   ├── tokenizer.json               # Trained tokenizer vocabulary & index
│   │   ├── feature_scaler.json          # StandardScaler mean & scale parameters
│   │   └── labels.json                  # Class label mappings & threshold
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_api.py                  # Endpoint integration tests
│   │   ├── test_preprocessing.py        # Normalization & number-preservation tests
│   │   └── test_feature_extraction.py   # Feature extraction & security tests
│   ├── requirements.txt                 # Backend Python dependencies
│   └── Dockerfile                       # Backend container definition
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx               # Top navigation & live model status badge
│   │   │   ├── MessageAnalyzer.tsx      # Text input, character counter, sample chips
│   │   │   ├── PredictionResultCard.tsx # Threat verdict card, probability, indicators
│   │   │   ├── FeatureBreakdown.tsx     # 9 Handcrafted features matrix & sequence
│   │   │   ├── SampleMessages.tsx       # Benchmark test cases selector
│   │   │   ├── ResearchResultsView.tsx  # Synthetic benchmark vs real holdout comparison
│   │   │   ├── ArchitectureView.tsx     # Neural graph & Android transition docs
│   │   │   └── SecurityAdvisory.tsx     # Threat isolation & privacy policy
│   │   ├── styles/
│   │   │   └── index.css                # Cybersecurity design system tokens
│   │   ├── types.ts                     # TypeScript data interfaces
│   │   ├── App.tsx                      # Root application layout & state manager
│   │   └── main.tsx                     # React entry point
│   ├── public/
│   ├── index.html                       # HTML5 template with Google Fonts
│   ├── package.json                     # Frontend dependencies
│   ├── tsconfig.json                    # TypeScript compiler configuration
│   ├── vite.config.ts                   # Vite bundler & API proxy configuration
│   ├── nginx.conf                       # Production Nginx reverse proxy configuration
│   └── Dockerfile                       # Frontend container definition
│
├── scripts/
│   └── test_model_inference.py          # Standalone model validation script
│
├── ml-engine/
│   └── predict.py                       # High-level CLI prediction script
│
├── dataset/
│   ├── processed/
│   └── raw/
│
├── docker-compose.yml                   # Multi-container orchestration
├── .env.example                         # Environment configuration template
├── pyproject.toml                       # Python project metadata & tool configs
└── README.md                            # Comprehensive system documentation
```

---

## Authors

- **Vikum Kodikara** &bull; Researcher & Developer &bull; Sri Lanka
- Research Project: *“NLP-Based Detection of Phishing in Sinhala/Singlish Mobile Messages”*
