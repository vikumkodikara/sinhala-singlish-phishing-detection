# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.1.x (Milestone 2) | ✅ |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly.

### How to Report

1. **Do NOT** open a public issue for security vulnerabilities
2. **Email**: Send details to the project maintainer directly
3. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if applicable)

### Response Timeline

- **Acknowledgement**: Within 48 hours
- **Initial Assessment**: Within 7 days
- **Fix Release**: As soon as possible, depending on severity

### Scope

This policy applies to:

- The Android application code (`app/`)
- The ML engine code (`ml-engine/`)
- CI/CD pipeline configurations (`.github/`)
- Dependencies listed in `requirements.txt` and `build.gradle.kts`

### Out of Scope

- Third-party dependencies (report directly to their maintainers)
- Phishing detection accuracy (this is a research limitation, not a security vulnerability)

## Automated Security Scanning

This project employs automated security scanning:

- **Bandit**: Python static analysis for security issues
- **pip-audit**: Python dependency vulnerability scanning
- **CodeQL**: GitHub code scanning for both Python and Kotlin
- **Dependabot**: Automated dependency update alerts

## Security Best Practices

When contributing code, please follow these practices:

- Never commit secrets, API keys, or credentials
- Use `.env` files for sensitive configuration (git-ignored)
- Validate and sanitise all user inputs
- Keep dependencies up to date
- Follow the principle of least privilege
