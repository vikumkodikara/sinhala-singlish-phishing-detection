# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial Android Studio project with Jetpack Compose and Material Design 3
- ML Engine Python package with preprocessing, dataset, features, models, training, evaluation, and export modules
- Clean Architecture layers for Android (domain, data, presentation, di, ml)
- CI/CD pipelines: Python CI, Android CI, Security Scan, Release
- GitHub Issue Templates: Bug Report, Feature Request, Research Task
- Pull Request Template
- Research documentation: System Architecture, Model Architecture, Dataset Description, Research Methodology, Development Guide, Milestone 2 Checklist, Deployment Plan
- Project management files: README, LICENSE, CONTRIBUTING, SECURITY, CODE_OF_CONDUCT, ROADMAP
- Configuration files: config.yaml, pyproject.toml, requirements.txt, .env.example

### Architecture
- MVVM + Clean Architecture for Android module
- Repository Pattern with domain-layer use cases
- TFLite placeholder integration (ModelLoader, Predictor, Tokenizer)
- Room Database schema for detection history
- Hilt dependency injection module (placeholder)

## [0.1.0] - 2026-07-11

### Added
- Initial project scaffold for Milestone 2 submission
- Professional project architecture established
