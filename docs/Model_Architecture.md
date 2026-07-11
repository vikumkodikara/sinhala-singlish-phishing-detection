# Model Architecture

## Overview

The phishing detection model uses a **hybrid architecture** combining deep-learning text embeddings with hand-crafted linguistic and URL features.

## Planned Model Variants

### Baseline Models (Week 4)

1. **TF-IDF + Naive Bayes** — Simple probabilistic baseline
2. **TF-IDF + SVM** — Linear SVM with character and word n-grams
3. **TF-IDF + Random Forest** — Ensemble baseline

### Deep Learning Models (Week 5)

4. **BiLSTM + Attention** — Bidirectional LSTM with self-attention
5. **Hybrid Model** — BiLSTM embeddings concatenated with feature vectors

## Hybrid Model Architecture (Primary)

```
Input Text
    │
    ├── Tokeniser ──→ Token IDs ──→ Embedding Layer ──→ BiLSTM ──→ Attention ──→ Text Vector (256-d)
    │
    ├── URL Features ──→ URL Feature Vector (12-d)
    │
    └── Linguistic Features ──→ Linguistic Feature Vector (11-d)
                                            │
                                    Concatenation Layer (279-d)
                                            │
                                    Dense (128) + Dropout(0.3)
                                            │
                                    Dense (64) + Dropout(0.3)
                                            │
                                    Sigmoid Output (1-d)
                                            │
                                    Binary Classification
                                    (SAFE / PHISHING)
```

## Feature Dimensions

### Text Embedding Branch (256-d)

| Component | Dimensions | Notes |
|-----------|-----------|-------|
| Vocabulary | 30,000 tokens | Built from training corpus |
| Embedding | 128-d | Trainable embeddings |
| BiLSTM | 2 × 128 = 256 hidden | 2-layer bidirectional |
| Attention | 256-d | Self-attention over sequence |

### URL Feature Branch (12-d)

| Feature | Type |
|---------|------|
| url_length | int |
| path_depth | int |
| num_subdomains | int |
| has_ip_address | bool |
| has_port | bool |
| uses_https | bool |
| is_shortened | bool |
| num_suspicious_keywords | int |
| url_entropy | float |
| domain_similarity_score | float |
| num_query_params | int |
| has_at_symbol | bool |

### Linguistic Feature Branch (11-d)

| Feature | Type |
|---------|------|
| message_length | int |
| word_count | int |
| sentence_count | int |
| urgency_word_count | int |
| exclamation_count | int |
| capitalisation_ratio | float |
| sinhala_ratio | float |
| latin_ratio | float |
| has_monetary_reference | bool |
| has_url | bool |
| has_phone | bool |

## Model Export

- **Format**: TensorFlow Lite (`.tflite`)
- **Quantisation**: float16 (reduces size ~2× with <1% accuracy loss)
- **Target Size**: < 5 MB for mobile deployment
- **Input**: `int32[1, 128]` (token IDs)
- **Output**: `float32[1, 2]` (softmax probabilities for [SAFE, PHISHING])

## Evaluation Metrics

| Metric | Target |
|--------|--------|
| Accuracy | > 90% |
| F1-Score (Phishing) | > 0.85 |
| Precision (Phishing) | > 0.85 |
| Recall (Phishing) | > 0.80 |
| ROC-AUC | > 0.90 |
| Inference Time | < 50ms |
| Model Size | < 5 MB |
