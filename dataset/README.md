# Dataset

Raw and processed SMS data for Sinhala/Singlish phishing detection.

## Directory layout

| Path | Purpose |
|------|---------|
| `raw/` | Original source files (not yet unified) |
| `processed/` | Merged, cleaned, model-ready CSV output |
| `annotations/` | Annotator batches and agreement records |

## Raw files

### `raw/google_form_sms_dataset.csv`

Sri Lankan SMS phishing research survey (Google Form export).

- **Rows:** ~43 consented responses (after filtering)
- **Source:** Field collection with participant consent
- **Key columns:** SMS text, language, category label, suspicious indicators
- **Ethics:** Only rows with consent *"Yes, I agree."* are used; personal metadata is dropped during merge

### `raw/sms_phishing_dataset_v1.csv`

Public SMS corpus adapted for phishing/spam classification.

- **Rows:** 5,174 messages
- **Columns:** `label` (ham/spam), `message`, `final_label` (Legitimate/Spam/Phishing)
- **Distribution:** ~4,518 legitimate, ~653 spam/phishing combined
- **Note:** English-heavy benchmark data; used as supplementary training material until the Sinhala/Singlish corpus grows

## Unified schema (processed)

After running `scripts/merge_datasets.py`, records use:

| Column | Description |
|--------|-------------|
| `text_id` | Unique identifier |
| `text` | Message body |
| `label` | `SAFE` or `PHISHING` |
| `source` | `google_form` or `sms_phishing_v1` |
| `language` | Language tag when available |
| `original_label` | Label from the source file |

Output: `processed/final_sms_phishing_dataset.csv`

## Ethics and privacy

- Survey participants gave explicit consent for academic use
- Phone numbers, names, and other PII are not stored in the processed file
- On-device inference in the Android app keeps user messages local
- Review raw exports before sharing publicly if new submissions contain sensitive content

## Usage

```bash
pip install -e .
python scripts/merge_datasets.py
python scripts/preprocess_sample.py --limit 5
```
