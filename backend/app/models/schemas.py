from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class DifficultyLevel(str, Enum):
    EASY = "Easy"
    MEDIUM = "Medium"
    HARD = "Hard"
    MIXED = "Mixed"

class QnAPair(BaseModel):
    id: Optional[int] = None
    question: str = Field(..., description="The generated question")
    answer: str = Field(..., description="The answer grounded in the document context")

class DocumentMetadata(BaseModel):
    filename: str
    file_type: str
    file_size_bytes: int
    file_size_formatted: str
    page_count: int = 1
    word_count: int = 0
    character_count: int = 0
    detected_language: str = "English"
    detected_language_code: str = "en"
    chunks_count: int = 1

class GenerationSettings(BaseModel):
    num_questions: int = Field(default=10, ge=1, le=50)
    difficulty: DifficultyLevel = Field(default=DifficultyLevel.MIXED)
    languages: List[str] = Field(default_factory=lambda: ["English", "Hindi", "Marathi"])

class StageStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"

class ProcessingStage(BaseModel):
    id: str
    label: str
    status: StageStatus = StageStatus.PENDING
    detail: Optional[str] = None

class JobStatus(str, Enum):
    IDLE = "idle"
    QUEUED = "queued"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class MultilingualQnAResult(BaseModel):
    english: List[QnAPair] = Field(default_factory=list)
    hindi: List[QnAPair] = Field(default_factory=list)
    marathi: List[QnAPair] = Field(default_factory=list)

class JobResponse(BaseModel):
    job_id: str
    status: JobStatus
    progress_percentage: int = 0
    current_stage: str = "Initializing"
    stages: List[ProcessingStage] = Field(default_factory=list)
    document_info: Optional[DocumentMetadata] = None
    error_message: Optional[str] = None
    results: Optional[MultilingualQnAResult] = None
    excel_download_url: Optional[str] = None
    created_at: float
    completed_at: Optional[float] = None

class UploadResponse(BaseModel):
    job_id: str
    document_info: DocumentMetadata
    preview_text: str
    message: str

class GenerateRequest(BaseModel):
    job_id: str
    num_questions: int = 10
    difficulty: DifficultyLevel = DifficultyLevel.MIXED

class HealthResponse(BaseModel):
    status: str
    version: str
    openrouter_configured: bool
    model: str
