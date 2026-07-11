# Research Methodology

## Research Design

This study follows a **Design Science Research (DSR)** methodology, combining empirical NLP research with practical software engineering to produce both a validated detection model and a deployable Android application.

## Research Questions

1. **RQ1**: How effectively can NLP techniques detect phishing in Sinhala and Singlish SMS messages?
2. **RQ2**: What linguistic features are most predictive of phishing in Sinhala/Singlish text?
3. **RQ3**: Can a hybrid model (deep learning + hand-crafted features) outperform pure deep-learning approaches for this task?
4. **RQ4**: What is the feasibility of deploying such a model for on-device inference on Android?

## Methodology Phases

### Phase 1: Dataset Construction (Week 2)
- Collect Sinhala and Singlish SMS samples
- Define annotation guidelines with clear phishing indicators
- Conduct dual annotation with inter-annotator agreement measurement
- Perform exploratory data analysis

### Phase 2: Preprocessing Pipeline (Week 3)
- Sinhala Unicode normalisation (NFC, virama, dependent vowels)
- Singlish phonetic normalisation (consonant mapping, repeat collapsing)
- Noise removal with special token replacement (URL, phone, numbers)
- Custom tokeniser with vocabulary building

### Phase 3: Feature Engineering (Weeks 3–4)
- URL-based features (12 dimensions): entropy, suspicious keywords, domain similarity
- Linguistic features (11 dimensions): urgency indicators, script ratio, capitalisation
- Combined feature vector for hybrid model input

### Phase 4: Model Development (Weeks 4–5)
- **Baseline models**: TF-IDF + {Naive Bayes, SVM, Random Forest}
- **Deep learning**: BiLSTM with self-attention
- **Hybrid**: BiLSTM embeddings + URL features + linguistic features

### Phase 5: Evaluation (Week 6)
- Metrics: Accuracy, Precision, Recall, F1, ROC-AUC, PR-AUC
- Per-language evaluation (Sinhala vs Singlish vs mixed)
- Ablation study (embedding only vs features only vs hybrid)
- Error analysis and failure case study
- Statistical significance testing

### Phase 6: Deployment (Week 7)
- TFLite model export with float16 quantisation
- Android integration with offline inference
- Performance benchmarking (inference time, memory usage)
- User experience testing

## Evaluation Strategy

### Quantitative Metrics
| Metric | Target | Justification |
|--------|--------|---------------|
| Accuracy | > 90% | Overall correctness |
| F1 (Phishing) | > 0.85 | Balance of precision and recall for the minority class |
| ROC-AUC | > 0.90 | Discrimination ability across thresholds |
| Inference Time | < 50ms | Real-time user experience |

### Ablation Study Design
| Experiment | Text Embeddings | URL Features | Linguistic Features |
|-----------|:-:|:-:|:-:|
| Embedding Only | ✅ | ❌ | ❌ |
| Features Only | ❌ | ✅ | ✅ |
| Hybrid (Full) | ✅ | ✅ | ✅ |

## Ethical Considerations

- No real user SMS data is collected without consent
- All dataset samples are anonymised or synthetically generated
- On-device processing ensures user privacy
- The tool is designed to assist users, not make autonomous decisions
