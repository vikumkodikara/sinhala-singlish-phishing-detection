# Deployment Plan

## Overview

This document outlines the plan for deploying the phishing detection model from the Python ML Engine to the Android application.

## Deployment Pipeline

```
Training (Python) → Export (TFLite) → Assets (Android) → Inference (On-Device)
```

### Step 1: Model Training (ML Engine)

```bash
python -m ml_engine.training.train --config configs/config.yaml
```

**Output**: Saved model in `results/models/`

### Step 2: TFLite Export

```bash
# Automated via export module
python -c "
from ml_engine.export.export_tflite import TFLiteExporter
exporter = TFLiteExporter(model_path='results/models')
exporter.export(
    output_path='app/src/main/assets/model.tflite',
    quantization='float16'
)
exporter.export_metadata(output_path='app/src/main/assets')
"
```

**Output**:
- `app/src/main/assets/model.tflite` — Quantised model
- `app/src/main/assets/tokenizer.json` — Vocabulary
- `app/src/main/assets/labels.json` — Label mapping

### Step 3: Android Integration

The Android app loads these assets at runtime:

1. **ModelLoader.kt** loads `model.tflite` into a TFLite interpreter
2. **Tokenizer.kt** loads `tokenizer.json` vocabulary
3. **Predictor.kt** orchestrates tokenisation → inference → post-processing

### Step 4: Testing

| Test Type | Tool | Target |
|-----------|------|--------|
| Unit tests | JUnit | ModelLoader, Tokenizer, Predictor |
| Integration tests | Espresso | Full inference pipeline |
| Performance tests | Android Benchmark | Inference latency, memory |
| Device testing | Physical devices | Samsung, Pixel, budget phones |

### Step 5: Release

1. Tag version in Git: `git tag v1.0.0`
2. GitHub Release triggers `release.yml` workflow
3. APK artefact is uploaded automatically

## Performance Requirements

| Metric | Requirement |
|--------|------------|
| Model file size | < 5 MB |
| Inference latency | < 50 ms |
| Memory usage | < 50 MB |
| APK size increase | < 10 MB |
| Min Android version | API 24 (Android 7.0) |

## Rollback Plan

If the deployed model underperforms:

1. Revert to the previous `model.tflite` asset
2. Investigate model performance using evaluation reports
3. Retrain with updated data or hyperparameters
4. Re-export and re-deploy

## Security Considerations

- Model file is bundled in the APK (no network download required)
- No user data leaves the device
- Model updates require a new APK release (or future OTA mechanism)
- Input validation prevents adversarial text inputs
