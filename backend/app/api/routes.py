"""
FastAPI Routes for Phishing Detection System
============================================

Exposes endpoints for prediction, health check, model transparency metadata,
and curated research benchmark samples.
"""
from __future__ import annotations

import logging
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, status

from backend.app.schemas.prediction import (
    PredictRequest,
    PredictResponse,
    HealthResponse,
    SampleMessage,
    ModelInfoResponse,
)
from backend.app.services.model_service import ModelService

logger = logging.getLogger(__name__)
router = APIRouter()


# ---------------------------------------------------------------------------
# Health Check Endpoint
# ---------------------------------------------------------------------------


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Service Health Check",
    tags=["Health"],
)
async def health_check() -> HealthResponse:
    """Verify service status and confirm the trained `.keras` model is loaded."""
    service = ModelService.get_instance()
    is_loaded = service.is_initialized and service.model is not None
    return HealthResponse(
        status="healthy" if is_loaded else "unhealthy",
        model_loaded=is_loaded,
        model_name=getattr(service.model, "name", "Sinhala_Singlish_Phishing_BiGRU_Model"),
        version="1.0.0",
        vocab_size=len(service.word_index),
        max_sequence_length=service.max_length,
        num_features=9,
    )


# ---------------------------------------------------------------------------
# Prediction Endpoint
# ---------------------------------------------------------------------------


@router.post(
    "/api/v1/predict",
    response_model=PredictResponse,
    summary="Detect Phishing in Mobile Message",
    tags=["Inference"],
)
async def predict_phishing(request: PredictRequest) -> PredictResponse:
    """Run real inference using the trained BiGRU + Attention neural network.

    Extracts text tokens and 9 handcrafted features, executes the multi-input
    neural network, and returns probability, risk level, and explainable indicators.
    """
    service = ModelService.get_instance()
    if not service.is_initialized or service.model is None:
        logger.error("Inference attempted but model is not loaded.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model is not loaded. Please verify backend startup logs.",
        )

    try:
        response = service.predict(request.message)
        logger.info(
            "Processed prediction request (pred=%s, prob=%.4f, script=%s)",
            response.prediction,
            response.probability,
            response.detected_script,
        )
        return response
    except Exception as exc:
        logger.exception("Inference error occurred while processing message.")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Model inference failed: {str(exc)}",
        )


# ---------------------------------------------------------------------------
# Model Metadata & Research Transparency Endpoint
# ---------------------------------------------------------------------------


@router.get(
    "/api/v1/model-info",
    response_model=ModelInfoResponse,
    summary="Research Model Specifications & Benchmarks",
    tags=["Research Transparency"],
)
async def get_model_info() -> ModelInfoResponse:
    """Retrieve full model architecture specs, dataset distributions, and benchmark results."""
    service = ModelService.get_instance()
    info_dict = service.get_info()
    return ModelInfoResponse(**info_dict)


# ---------------------------------------------------------------------------
# Benchmark Samples Endpoint
# ---------------------------------------------------------------------------


@router.get(
    "/api/v1/samples",
    response_model=List[SampleMessage],
    summary="Curated Research Evaluation Samples",
    tags=["Samples"],
)
async def get_sample_messages() -> List[SampleMessage]:
    """Provide verified test messages across Sinhala, Singlish, and English for quick evaluation."""
    return [
        SampleMessage(
            id="phish-en-1",
            label="PHISHING",
            language="English",
            text="Congratulations! You have won Rs. 50,000 in the Dialog Mega Draw. Claim your prize now at http://secure-dialog-reward.xyz/claim",
            description="Reward scam with fake urgency, financial lure, and suspicious URL.",
        ),
        SampleMessage(
            id="phish-si-1",
            label="PHISHING",
            language="Sinhala",
            text="ඔබගේ බැංකු ගිණුම තාවකාලිකව අත්හිටුවා ඇත. කරුණාකර http://commercial-bank-auth.com වෙත ගොස් verify කරන්න.",
            description="Sinhala banking impersonation requesting credential verification.",
        ),
        SampleMessage(
            id="phish-sg-1",
            label="PHISHING",
            language="Singlish",
            text="Oyage Commercial Bank account eka suspend wenawa danma verify karanna http://combank-secure-update.lk/login OTP eka danna.",
            description="Singlish urgency attack asking for OTP and credentials via malicious link.",
        ),
        SampleMessage(
            id="safe-en-1",
            label="SAFE",
            language="English",
            text="Dear customer, your account 4589 has been credited with Rs. 1500.00 on 2026-05-12. Thank you for banking with us.",
            description="Legitimate bank transaction notification without links or urgent calls to action.",
        ),
        SampleMessage(
            id="safe-si-1",
            label="SAFE",
            language="Sinhala",
            text="සුබ උදෑසනක්! අද දහවල් පැවැත්වෙන දෙපාර්තමේන්තු රැස්වීමට සහභාගී වන්න.",
            description="Benign Sinhala conversational announcement.",
        ),
        SampleMessage(
            id="safe-sg-1",
            label="SAFE",
            language="Singlish",
            text="Ada raata gedara enawada? Api raata kamata kadekata yamu. Mata call ekak denna.",
            description="Authentic personal Singlish social message.",
        ),
        SampleMessage(
            id="safe-otp-1",
            label="SAFE",
            language="English / Mixed",
            text="Your OTP for transaction verification is 849201. Valid for 5 minutes. Do not share this code with anyone.",
            description="Authentic OTP delivery message with numeric code.",
        ),
    ]
