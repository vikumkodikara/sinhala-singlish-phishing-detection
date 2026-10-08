"""
Pydantic Schemas for Phishing Detection API
"""
from typing import Dict, Any, Optional, List
from pydantic import BaseModel, Field, field_validator


class PredictRequest(BaseModel):
    message: str = Field(
        ...,
        description="The SMS or mobile message text to analyze for phishing.",
        min_length=1,
        max_length=5000,
        examples=["Congratulations! You have won Rs. 50,000. Claim now at http://secure-bank-login.xyz/claim"]
    )

    @field_validator("message")
    @classmethod
    def validate_message(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Message cannot be empty or solely whitespace.")
        return v


class DetectedFeatures(BaseModel):
    url_count: int = Field(..., description="Number of URLs detected in the message.")
    url_length: int = Field(..., description="Maximum length of detected URLs.")
    subdomain_count: int = Field(..., description="Total subdomain count across detected URLs.")
    digit_count: int = Field(..., description="Count of numeric digits.")
    exclamation_count: int = Field(..., description="Count of exclamation marks.")
    question_count: int = Field(..., description="Count of question marks.")
    text_length: int = Field(..., description="Total character count of the cleaned message.")
    word_count: int = Field(..., description="Total word count.")
    suspicious_word_count: int = Field(..., description="Count of keyword hits matching financial/urgency patterns.")


class PredictResponse(BaseModel):
    prediction: str = Field(..., description="Prediction outcome: 'PHISHING' or 'SAFE'.")
    probability: float = Field(..., description="Raw model predicted phishing probability (0.0 to 1.0).")
    confidence: float = Field(..., description="Confidence score percentage (0.0% to 100.0%).")
    risk_level: str = Field(..., description="Risk categorization: 'HIGH', 'MEDIUM', or 'LOW'.")
    detected_script: str = Field(..., description="Heuristic script/language category (Sinhala, Singlish, English, or Mixed).")
    preprocessed_text: str = Field(..., description="Normalized text analyzed by the NLP model.")
    detected_features: DetectedFeatures = Field(..., description="The 9 handcrafted features extracted and analyzed.")
    warning: Optional[str] = Field(None, description="Security and research advisory.")


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_name: str
    version: str
    vocab_size: int
    max_sequence_length: int
    num_features: int


class SampleMessage(BaseModel):
    id: str
    label: str
    language: str
    text: str
    description: str


class ModelInfoResponse(BaseModel):
    model_name: str
    architecture: str
    framework: str
    max_sequence_length: int
    vocabulary_size: int
    handcrafted_features: List[str]
    dataset: Dict[str, Any]
    benchmarks: Dict[str, Any]
    disclaimer: str
