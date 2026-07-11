# Development Guide

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Android Studio | Ladybug+ | Android development |
| JDK | 21 | Kotlin compilation |
| Python | 3.10+ | ML engine |
| Git | Latest | Version control |

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/vikumkodikara/sinhala-singlish-phishing-detection.git
cd sinhala-singlish-phishing-detection
```

### 2. Android Setup

1. Open the project root in Android Studio
2. Wait for Gradle sync to complete
3. Connect a device or start an emulator (API 24+)
4. Run `app` configuration

### 3. Python Setup

```bash
python -m venv venv
source venv/bin/activate       # Linux/macOS
venv\Scripts\activate          # Windows

pip install -r requirements.txt
```

### 4. Verify Installation

```bash
# Python
python -c "from ml_engine.preprocessing import clean_text; print('ML Engine OK')"

# Android (from project root)
./gradlew assembleDebug
```

## Project Conventions

### Git Workflow

1. Create a branch: `git checkout -b feature/description`
2. Make changes and commit with [Conventional Commits](https://www.conventionalcommits.org/)
3. Push and create a Pull Request against `develop`

### Python Code Style

- **Formatter**: Black (line length 88)
- **Linter**: Ruff
- **Type checker**: MyPy
- Run before committing: `black ml-engine/ && ruff check ml-engine/`

### Kotlin Code Style

- Follow [Kotlin Coding Conventions](https://kotlinlang.org/docs/coding-conventions.html)
- KDoc on all public APIs
- Use `viewModelScope` for coroutines in ViewModels

### Adding a New Preprocessing Module

1. Create the Python file in `ml-engine/preprocessing/`
2. Add Google-style docstrings with type hints
3. Add `import` to `ml-engine/preprocessing/__init__.py`
4. Write tests in `tests/ml/test_<module_name>.py`
5. Update documentation if needed

### Adding a New Android Screen

1. Create the `@Composable` in `presentation/screens/`
2. Add a route constant in `utils/Constants.kt`
3. Register in `presentation/navigation/AppNavigation.kt`
4. Create a ViewModel in `presentation/viewmodel/` if needed
5. Document with KDoc

## Running Tests

```bash
# Python tests
pytest tests/ml/ -v

# Android unit tests
./gradlew test

# Android instrumented tests
./gradlew connectedAndroidTest
```

## CI/CD

All pipelines run automatically on push and PR:

| Pipeline | Trigger | What it does |
|----------|---------|-------------|
| `python-ci.yml` | Changes in `ml-engine/` | Black, Ruff, MyPy, pytest, Bandit, pip-audit |
| `android-ci.yml` | Changes in `app/` | Gradle build, lint, test, APK artifact |
| `security.yml` | All pushes + weekly | Bandit, pip-audit, CodeQL |
| `release.yml` | GitHub Release | Build APK + package ML engine |
