"""
Integration Tests for FastAPI Endpoints
"""
import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.services.model_service import ModelService


@pytest.fixture(scope="module")
def client():
    # Ensure model service is initialized
    service = ModelService.get_instance()
    service.load()
    with TestClient(app) as test_client:
        yield test_client


def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "title" in data
    assert data["docs_url"] == "/docs"


def test_health_endpoint(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True
    assert data["vocab_size"] > 0
    assert data["num_features"] == 9


def test_predict_english_phishing(client):
    payload = {
        "message": "Congratulations! You have won Rs. 50,000 in the Dialog Mega Draw. Claim your prize now at http://secure-dialog-reward.xyz/claim"
    }
    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["prediction"] in ["PHISHING", "SAFE"]
    assert 0.0 <= data["probability"] <= 1.0
    assert 0.0 <= data["confidence"] <= 100.0
    assert data["risk_level"] in ["HIGH", "MEDIUM", "LOW"]
    assert data["detected_features"]["url_count"] == 1


def test_predict_sinhala_message(client):
    payload = {
        "message": "ඔබගේ බැංකු ගිණුම තාවකාලිකව අත්හිටුවා ඇත. කරුණාකර http://commercial-bank-auth.com වෙත ගොස් verify කරන්න."
    }
    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "Sinhala" in data["detected_script"] or "Mixed" in data["detected_script"]
    assert data["detected_features"]["url_count"] == 1


def test_predict_singlish_message(client):
    payload = {
        "message": "Oyage account eka suspend wenawa danma verify karanna http://verify.lk"
    }
    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "prediction" in data


def test_predict_safe_numeric_message(client):
    payload = {
        "message": "Dear customer, your account 4589 has been credited with Rs. 250000 on 2026-05-12. Thank you for banking with us."
    }
    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["prediction"] == "SAFE"
    assert data["detected_features"]["digit_count"] >= 10


def test_validation_empty_message(client):
    response = client.post("/api/v1/predict", json={"message": "   "})
    assert response.status_code == 422


def test_validation_oversized_message(client):
    response = client.post("/api/v1/predict", json={"message": "A" * 5001})
    assert response.status_code == 422


def test_validation_malformed_json(client):
    response = client.post(
        "/api/v1/predict",
        content="not-json",
        headers={"Content-Type": "application/json"},
    )
    assert response.status_code == 422


def test_model_info_endpoint(client):
    response = client.get("/api/v1/model-info")
    assert response.status_code == 200
    data = response.json()
    assert data["architecture"] != ""
    assert data["dataset"]["total_records"] == 10040
    assert "benchmarks" in data
    assert "disclaimer" in data


def test_samples_endpoint(client):
    response = client.get("/api/v1/samples")
    assert response.status_code == 200
    samples = response.json()
    assert len(samples) >= 5
    assert all("id" in s and "text" in s for s in samples)
