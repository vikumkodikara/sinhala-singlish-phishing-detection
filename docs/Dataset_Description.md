# Dataset Description

## Overview

The dataset consists of Sinhala and Singlish (romanized Sinhala) SMS messages labelled as either **SAFE** or **PHISHING**.

> **Note**: The dataset will be collected and annotated during Milestone 3 (Weeks 2–3). This document describes the planned dataset specification.

## Dataset Specifications

| Property | Value |
|----------|-------|
| **Target Size** | 3,000–5,000 messages |
| **Languages** | Sinhala (Unicode), Singlish (Latin), Mixed |
| **Labels** | Binary: SAFE, PHISHING |
| **Format** | CSV / JSON |
| **Encoding** | UTF-8 |

## Data Sources (Planned)

1. **Public phishing datasets** — Adapted from English phishing corpora with Sinhala/Singlish translations
2. **Simulated messages** — Phishing messages crafted based on real-world Sri Lankan scam patterns
3. **Legitimate messages** — Anonymised samples of non-phishing SMS patterns

## Annotation Schema

```json
{
  "text_id": "MSG_001",
  "text": "ඔබගේ බැංකු ගිණුම අත්හිටුවා ඇත. verify කරන්න: https://example.com",
  "label": "PHISHING",
  "language": "MIXED",
  "annotator": "A1",
  "confidence": 0.95,
  "phishing_indicators": ["urgency", "url", "impersonation"],
  "notes": "Impersonates bank, contains suspicious URL"
}
```

## Label Definitions

### SAFE
A legitimate, non-malicious message. Examples:
- Bank OTP notifications (from verified sender)
- Promotional messages from known brands
- Personal messages

### PHISHING
A message that attempts to deceive the recipient into revealing sensitive information. Indicators:
- Urgency language ("වහාම", "hadisi")
- Suspicious URLs or IP addresses
- Impersonation of banks or government agencies
- Requests for personal or financial information
- Monetary incentives ("ඔබ ලක්ෂ 5ක් දිනුවා!")

## Data Split Strategy

| Split | Ratio | Purpose |
|-------|-------|---------|
| Train | 70% | Model training |
| Validation | 10% | Hyperparameter tuning |
| Test | 20% | Final evaluation |

- **Stratified**: Preserves label distribution across all splits
- **Seed**: Fixed random seed (42) for reproducibility

## Quality Assurance

- **Dual annotation**: Each message annotated by at least 2 annotators
- **Agreement threshold**: Cohen's kappa ≥ 0.8
- **Conflict resolution**: Majority vote with expert adjudication
- **Validation checks**: Schema validation, label balance monitoring
