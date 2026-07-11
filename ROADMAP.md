# Project Roadmap

## 🗺️ Sinhala/Singlish Phishing Detection — Development Roadmap

### Research Duration: 2.5 Months (10 Weeks)

---

## Week 1 — Repository Setup ✅

- [x] Create GitHub repository
- [x] Set up Android Studio project with Jetpack Compose
- [x] Establish ML Engine Python package structure
- [x] Configure CI/CD pipelines (Python CI, Android CI, Security, Release)
- [x] Write initial documentation
- [x] Set up project management (issue templates, PR template)

## Week 2 — Dataset Collection 🔄

- [ ] Define annotation guidelines for phishing vs safe SMS
- [ ] Collect Sinhala SMS samples from public sources
- [ ] Collect Singlish SMS samples
- [ ] Set up annotation pipeline with quality checks
- [ ] Achieve inter-annotator agreement > 0.8 (Cohen's kappa)
- [ ] Exploratory data analysis and statistics

## Week 3 — Preprocessing Pipeline

- [ ] Implement Sinhala Unicode normalisation (`normalize_sinhala.py`)
- [ ] Implement Singlish normalisation (`normalize_singlish.py`)
- [ ] Implement noise removal with URL/phone tokenisation (`remove_noise.py`)
- [ ] Build and train tokeniser vocabulary (`tokenizer.py`)
- [ ] Implement URL feature extraction (`url_feature_extraction.py`)
- [ ] Implement linguistic feature extraction (`linguistic_features.py`)
- [ ] Write unit tests for all preprocessing modules

## Week 4 — Baseline Models

- [ ] Implement TF-IDF + Naive Bayes baseline
- [ ] Implement TF-IDF + SVM baseline
- [ ] Implement TF-IDF + Random Forest baseline
- [ ] Evaluate baselines with cross-validation
- [ ] Document baseline results

## Week 5 — Hybrid Deep Learning Model

- [ ] Implement BiLSTM model with attention
- [ ] Implement feature concatenation layer (linguistic + URL features)
- [ ] Hyperparameter tuning (learning rate, hidden dim, dropout)
- [ ] Compare against baselines
- [ ] Ablation study: features vs embeddings vs hybrid

## Week 6 — Evaluation & Analysis

- [ ] Final model evaluation on held-out test set
- [ ] Per-class performance analysis (Sinhala vs Singlish vs mixed)
- [ ] Error analysis and failure case study
- [ ] Generate publication-ready figures (confusion matrix, ROC, PR curves)
- [ ] Explainability analysis (feature importance)

## Week 7 — Android Integration

- [ ] Export trained model to TFLite with float16 quantisation
- [ ] Implement Android-side tokeniser (`Tokenizer.kt`)
- [ ] Implement TFLite model loader (`ModelLoader.kt`)
- [ ] Implement prediction engine (`Predictor.kt`)
- [ ] Build UI screens (Home, History, Settings)
- [ ] Integration testing on physical devices

## Week 8 — Research Paper & Submission

- [ ] Write research paper (IEEE / ACM format)
- [ ] Prepare final presentation
- [ ] Clean up repository for public release
- [ ] Tag final release (v1.0.0)
- [ ] Submit research paper

---

## 📊 Milestone Mapping

| Milestone | Weeks | Deliverables |
|-----------|-------|-------------|
| **M2** — Project Structure | 1–2 | Repository, architecture, preprocessing placeholders, CI/CD |
| **M3** — Model Training | 3–6 | Dataset, preprocessing, baselines, hybrid model, evaluation |
| **M4** — Integration | 7–8 | Android app, TFLite deployment, research paper |
