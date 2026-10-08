"""
Unit Tests for Handcrafted Feature Extraction & Security
"""
import pytest
import socket
from backend.app.services.feature_extraction import extract_features, scale_features


def test_url_extraction():
    text = "Claim now at http://secure-dialog-reward.xyz/claim and www.bonus-claim.com"
    feats = extract_features(text)
    assert feats["url_count"] == 2
    assert feats["url_length"] > 0
    assert feats["subdomain_count"] == 1


def test_subdomain_counting():
    text = "Login at https://sub1.sub2.example.com/login"
    feats = extract_features(text)
    assert feats["url_count"] == 1
    assert feats["subdomain_count"] == 2


def test_digit_and_punctuation_counts():
    text = "Account: 123456! Urgent?"
    feats = extract_features(text)
    assert feats["digit_count"] == 6
    assert feats["exclamation_count"] == 1
    assert feats["question_count"] == 1


def test_suspicious_word_count():
    text = "Your OTP for account verify and password reset"
    feats = extract_features(text)
    # words: otp, account, verify, password -> 4
    assert feats["suspicious_word_count"] >= 3


def test_no_urls_no_digits():
    text = "Hello friend how are you today"
    feats = extract_features(text)
    assert feats["url_count"] == 0
    assert feats["url_length"] == 0
    assert feats["subdomain_count"] == 0
    assert feats["digit_count"] == 0
    assert feats["word_count"] == 6


def test_security_urls_never_requested(monkeypatch):
    """Ensure that feature extraction never initiates socket/HTTP connections."""
    def no_socket_connection(*args, **kwargs):
        raise AssertionError("Security violation: Socket connection attempted on user URL!")

    monkeypatch.setattr(socket, "create_connection", no_socket_connection)
    monkeypatch.setattr(socket, "getaddrinfo", no_socket_connection)

    # Should execute safely without network attempts
    text = "Visit http://non-existent-phishing-domain-123456.xyz/login immediately"
    feats = extract_features(text)
    assert feats["url_count"] == 1


def test_scale_features():
    raw_feats = {
        "url_count": 1,
        "url_length": 30,
        "subdomain_count": 0,
        "digit_count": 5,
        "exclamation_count": 1,
        "question_count": 0,
        "text_length": 100,
        "word_count": 15,
        "suspicious_word_count": 2,
    }
    mean = [0.5, 20.0, 0.0, 10.0, 0.5, 0.0, 90.0, 12.0, 0.2]
    scale = [0.4, 10.0, 1.0, 5.0, 0.5, 1.0, 20.0, 4.0, 0.5]
    scaled = scale_features(raw_feats, mean, scale)
    assert scaled.shape == (1, 9)
    assert isinstance(scaled, type(scaled))
