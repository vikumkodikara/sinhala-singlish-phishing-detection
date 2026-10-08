"""
Sinhala/Singlish Phishing Detection System — FastAPI Application
===============================================================

Main application entry point providing REST endpoints for real-time NLP-based
phishing detection using the pre-trained BiGRU + Attention Keras model.
"""
from __future__ import annotations

from contextlib import asynccontextmanager
import logging
from typing import AsyncGenerator

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.app.api.routes import router
from backend.app.services.model_service import ModelService
from backend.app.utils.logger import setup_logger

logger = setup_logger(log_level="INFO")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Load model and ML assets on server startup once, and cleanup on shutdown."""
    logger.info("Starting Sinhala/Singlish Phishing Detection Service...")
    try:
        service = ModelService.get_instance()
        service.load()
        logger.info("Trained .keras model and vocabulary successfully loaded.")
    except Exception as e:
        logger.critical("Failed to load model during startup: %s", str(e), exc_info=True)
        # We allow startup to complete so health endpoint can report the loading failure
    yield
    logger.info("Shutting down Sinhala/Singlish Phishing Detection Service...")


app = FastAPI(
    title="Sinhala/Singlish Phishing Detector API",
    description=(
        "Research Prototype REST API for AI-assisted phishing detection in "
        "Sinhala, Singlish, and English mobile SMS messages using a trained "
        "Bidirectional GRU neural network with custom Attention and 9 handcrafted features."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Supports local dev and docker environments
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.error("Unhandled server error: %s", str(exc), exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error occurred", "detail": str(exc)},
    )


# Include API routes
app.include_router(router)


@app.get("/", summary="API Root", tags=["Root"])
async def root() -> dict[str, str]:
    """Root endpoint welcoming users and directing to documentation."""
    return {
        "title": "Sinhala/Singlish Phishing Detector API",
        "description": "AI-Assisted Phishing Detection for Sinhala, Singlish and English Mobile Messages",
        "version": "1.0.0",
        "docs_url": "/docs",
        "health_url": "/health",
        "predict_url": "/api/v1/predict",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
