# System Architecture

## Overview

The system follows a **two-module architecture**: a Python-based ML Engine for model development and a Kotlin-based Android Application for on-device deployment.

## Architecture Principles

- **Clean Architecture**: Separation of concerns across layers (domain, data, presentation)
- **MVVM Pattern**: Unidirectional data flow in the Android UI
- **Repository Pattern**: Abstracts data sources behind interfaces
- **Offline-First**: All inference happens on-device via TensorFlow Lite

## Module 1: ML Engine (Python)

```
ml-engine/
├── preprocessing/      ← Text cleaning, normalisation, tokenisation
├── dataset/            ← Data loading, splitting, annotation management
├── features/           ← URL and linguistic feature extraction
├── models/             ← Model architectures (abstract base + implementations)
├── training/           ← Training pipeline orchestrator
├── evaluation/         ← Metrics computation and reporting
├── export/             ← TFLite conversion and validation
├── utils/              ← Logging, configuration management
└── predict.py          ← High-level inference API
```

### Data Flow (ML Engine)

```
Raw SMS Data → Preprocessing → Feature Extraction → Model Training → Evaluation → TFLite Export
```

1. **Preprocessing**: `clean_text` → `normalize_sinhala` / `normalize_singlish` → `remove_noise` → `tokenize`
2. **Feature Engineering**: URL features (12 dimensions) + linguistic features (11 dimensions)
3. **Training**: Configurable pipeline with early stopping and checkpoint saving
4. **Export**: TFLite with float16 quantisation for mobile deployment

## Module 2: Android Application (Kotlin)

```
app/src/main/java/.../
├── presentation/       ← UI (Compose), ViewModels, Navigation
├── domain/             ← Models, Repository interfaces, Use Cases
├── data/               ← Room Database, Repository implementations
├── di/                 ← Hilt dependency injection
├── ml/                 ← TFLite ModelLoader, Predictor, Tokenizer
└── utils/              ← Constants, extensions
```

### Data Flow (Android)

```
User Input → ViewModel → UseCase → Repository → Predictor → TFLite → Result → UI
                                         ↓
                                    Room Database (history)
```

## Communication Between Modules

The ML Engine and Android Application are connected through **shared artefacts**:

| Artefact | Source | Destination |
|----------|--------|-------------|
| `model.tflite` | `ml-engine/export/` | `app/src/main/assets/` |
| `tokenizer.json` | `ml-engine/preprocessing/` | `app/src/main/assets/` |
| `labels.json` | `ml-engine/evaluation/` | `app/src/main/assets/` |

## Technology Stack

| Layer | Android | ML Engine |
|-------|---------|-----------|
| Language | Kotlin 2.0 | Python 3.10 |
| UI | Jetpack Compose | N/A |
| DI | Hilt | N/A |
| Async | Coroutines + Flow | N/A |
| Database | Room | N/A |
| ML | TensorFlow Lite | TensorFlow / Keras |
| Testing | JUnit, Espresso | pytest |
| CI/CD | GitHub Actions | GitHub Actions |
