# Milestone 2 Checklist

## Assignment Requirements

| # | Requirement | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Public GitHub Repository | ✅ | [Repository](https://github.com/vikumkodikara/sinhala-singlish-phishing-detection) |
| 2 | Initial Project Structure | ✅ | Android app + ML Engine + scaffolding directories |
| 3 | README.md | ✅ | Publication-quality README with badges, architecture, timeline |
| 4 | Data Preprocessing Scripts | ✅ | `ml-engine/preprocessing/` — 5 modules with docstrings and type hints |
| 5 | requirements.txt | ✅ | Pinned Python dependencies with version bounds |
| 6 | Initial Documentation | ✅ | 7 documentation files in `docs/` |
| 7 | CI/CD Pipeline | ✅ | 4 GitHub Actions workflows (Python CI, Android CI, Security, Release) |
| 8 | Meaningful Commits | ✅ | Conventional commit messages, logically grouped changes |

## Repository Structure Verification

### Top-Level Directories

- [x] `app/` — Android application (Kotlin, Compose)
- [x] `ml-engine/` — ML pipeline (Python)
- [x] `dataset/` — Data directories (raw, processed, annotations)
- [x] `docs/` — Research documentation
- [x] `configs/` — Pipeline configuration
- [x] `tests/` — Test directories (ml, android)
- [x] `.github/` — CI/CD workflows and templates
- [x] `scripts/` — Utility scripts
- [x] `experiments/` — Experiment tracking
- [x] `results/` — Model outputs
- [x] `assets/` — Project assets

### ML Engine Modules

- [x] `preprocessing/` — clean_text, normalize_sinhala, normalize_singlish, remove_noise, tokenizer
- [x] `dataset/` — dataset_loader, dataset_split, annotation_helper
- [x] `features/` — url_feature_extraction, linguistic_features
- [x] `models/` — base_model
- [x] `training/` — train
- [x] `evaluation/` — evaluate
- [x] `export/` — export_tflite
- [x] `utils/` — logger, config
- [x] `predict.py` — Inference entry point

### Android Architecture

- [x] `presentation/screens/` — HomeScreen, HistoryScreen, SettingsScreen
- [x] `presentation/components/` — MessageInputCard, RiskScoreIndicator
- [x] `presentation/navigation/` — AppNavigation
- [x] `presentation/viewmodel/` — DetectionViewModel, HistoryViewModel
- [x] `domain/model/` — DetectionResult, MessageAnalysis
- [x] `domain/repository/` — DetectionRepository, HistoryRepository
- [x] `domain/usecase/` — AnalyzeMessageUseCase, GetHistoryUseCase
- [x] `data/local/` — PhishingDatabase, DetectionDao, DetectionEntity
- [x] `data/repository/` — DetectionRepositoryImpl, HistoryRepositoryImpl
- [x] `di/` — AppModule
- [x] `ml/` — ModelLoader, Predictor, Tokenizer, PredictionResult
- [x] `utils/` — Constants
- [x] `assets/` — model.tflite, tokenizer.json, labels.json

### GitHub Configuration

- [x] Issue templates (Bug, Feature, Research)
- [x] Pull request template
- [x] CI/CD workflows (4 pipelines)
- [x] Community files (CONTRIBUTING, SECURITY, CODE_OF_CONDUCT)

### Root Files

- [x] README.md
- [x] LICENSE (MIT)
- [x] .gitignore (comprehensive)
- [x] requirements.txt
- [x] pyproject.toml
- [x] .env.example
- [x] config.yaml
- [x] CHANGELOG.md
- [x] ROADMAP.md
