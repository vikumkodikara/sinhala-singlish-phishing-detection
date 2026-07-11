# Contributing to Sinhala/Singlish Phishing Detection

Thank you for your interest in contributing to this research project! This document provides guidelines for contributing.

## 🤝 How to Contribute

### Reporting Bugs

1. Check if the issue already exists in [Issues](https://github.com/vikumkodikara/sinhala-singlish-phishing-detection/issues)
2. Use the **Bug Report** template to create a new issue
3. Include steps to reproduce, expected vs actual behaviour, and environment details

### Suggesting Features

1. Use the **Feature Request** template
2. Describe the problem your feature would solve
3. Include acceptance criteria

### Proposing Research Tasks

1. Use the **Research Task** template
2. Include your hypothesis, methodology, and expected outcomes

### Code Contributions

1. **Fork** the repository
2. Create a **feature branch** from `develop`: `git checkout -b feature/your-feature`
3. **Commit** with conventional messages: `feat:`, `fix:`, `docs:`, `chore:`, `ci:`, `test:`
4. **Push** to your fork and open a **Pull Request** against `develop`

## 📝 Code Standards

### Python (ML Engine)

- **Style**: PEP 8, enforced by Black (line length 88)
- **Linting**: Ruff
- **Type hints**: Required on all function signatures
- **Docstrings**: Google-style docstrings on all public functions
- **Logging**: Use `logging.getLogger(__name__)` — no `print()` statements
- **Testing**: pytest with descriptive test names

### Kotlin (Android)

- **Style**: Kotlin coding conventions
- **Architecture**: MVVM + Clean Architecture
- **KDoc**: Required on all public classes and functions
- **Coroutines**: Use `viewModelScope` for ViewModel operations

## 🔀 Branching Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Stable releases and milestones |
| `develop` | Integration branch for active development |
| `feature/*` | New features |
| `fix/*` | Bug fixes |
| `research/*` | Experimental research branches |

## 📋 Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add Sinhala Unicode normalisation pipeline
fix: correct virama sequence handling in tokeniser
docs: update research methodology documentation
chore: update Python dependencies
ci: add MyPy type checking to Python CI
test: add unit tests for URL feature extraction
```

## ⚖️ License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
