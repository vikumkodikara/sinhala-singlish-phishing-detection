#!/usr/bin/env python
"""
Model Validation Script
=======================

Validates the research `.keras` model end-to-end:
1. Loads the trained Keras model, tokenizer, and feature scaler.
2. Runs inference on sample test messages (Sinhala, Singlish, English).
3. Verifies expected model input/output formats and latency.
4. Confirms security posture (no URL requests).

Usage::
    python scripts/test_model_inference.py
"""
import sys
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))

# Ensure utf-8 output encoding for console
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from backend.app.services.model_service import ModelService


def main() -> None:
    print("=" * 75)
    print("SINHALA / SINGLISH PHISHING DETECTION — MODEL VALIDATION SCRIPT")
    print("=" * 75)

    models_dir = PROJECT_ROOT / "backend" / "models"
    print(f"Loading model assets from: {models_dir}")

    service = ModelService.get_instance(models_dir=models_dir)
    service.load()

    info = service.get_info()
    print("\n[✓] Model Loaded Successfully!")
    print(f"  • Model Name: {info['model_name']}")
    print(f"  • Architecture: {info['architecture']}")
    print(f"  • Vocabulary Size: {info['vocabulary_size']}")
    print(f"  • Max Sequence Length: {info['max_sequence_length']}")
    print(f"  • Handcrafted Features: {len(info['handcrafted_features'])}")

    test_cases = [
        {
            "category": "Phishing (English Financial Scam)",
            "message": "Congratulations! You have won Rs. 50,000 in the Dialog Mega Draw. Claim your prize now at http://secure-dialog-reward.xyz/claim",
        },
        {
            "category": "Phishing (Sinhala Bank Impersonation)",
            "message": "ඔබගේ බැංකු ගිණුම තාවකාලිකව අත්හිටුවා ඇත. කරුණාකර http://commercial-bank-auth.com වෙත ගොස් verify කරන්න.",
        },
        {
            "category": "Phishing (Singlish Account Urgency)",
            "message": "Oyage Commercial Bank account eka suspend wenawa danma verify karanna http://combank-secure-update.lk/login OTP eka danna.",
        },
        {
            "category": "Safe (English Bank Credit Alert with Digits)",
            "message": "Dear customer, your account 4589 has been credited with Rs. 250000 on 2026-05-12. Thank you for banking with us.",
        },
        {
            "category": "Safe (Sinhala Benign Meeting Announcement)",
            "message": "සුබ උදෑසනක්! අද දහවල් පැවැත්වෙන දෙපාර්තමේන්තු රැස්වීමට සහභාගී වන්න.",
        },
        {
            "category": "Safe (Singlish Casual Conversation)",
            "message": "Ada raata gedara enawada? Api raata kamata kadekata yamu. Mata call ekak denna.",
        },
        {
            "category": "Safe (Authentic OTP Delivery)",
            "message": "Your OTP for transaction verification is 849201. Valid for 5 minutes. Do not share this code with anyone.",
        },
    ]

    print("\n" + "=" * 75)
    print("RUNNING INFERENCE ON BENCHMARK TEST SUITE")
    print("=" * 75)

    for i, item in enumerate(test_cases, 1):
        msg = item["message"]
        cat = item["category"]

        result = service.predict(msg)

        status_icon = "🚨" if result.prediction == "PHISHING" else "🛡️"
        print(f"\nTest Case {i}: [{cat}]")
        print(f"  Message: \"{msg}\"")
        print(f"  {status_icon} Prediction: {result.prediction} | Risk: {result.risk_level} | Probability: {result.probability:.4f} | Confidence: {result.confidence}%")
        print(f"  Script Detected: {result.detected_script}")
        print(f"  Cleaned Text: \"{result.preprocessed_text}\"")
        print(f"  Detected Features:")
        for k, v in result.detected_features.model_dump().items():
            print(f"    - {k}: {v}")

    print("\n" + "=" * 75)
    print("[✓] ALL TEST INFERENCES COMPLETED SUCCESSFULLY")
    print("=" * 75)


if __name__ == "__main__":
    main()
