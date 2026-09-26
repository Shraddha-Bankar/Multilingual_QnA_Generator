import os
import time
import uuid
import logging
from typing import Dict, Optional, List
from app.models.schemas import (
    JobStatus,
    JobResponse,
    ProcessingStage,
    StageStatus,
    DocumentMetadata,
    MultilingualQnAResult,
    QnAPair
)
from app.config import settings

logger = logging.getLogger(__name__)

INITIAL_STAGES = [
    ("stage_upload", "Upload validation"),
    ("stage_extract", "Extracting document text"),
    ("stage_language", "Detecting language"),
    ("stage_clean", "Cleaning content"),
    ("stage_chunk", "Splitting content into chunks"),
    ("stage_generate_en", "Generating English Q&A"),
    ("stage_validate_qa", "Validating Q&A"),
    ("stage_dedup", "Removing duplicates"),
    ("stage_translate_hi", "Translating to Hindi"),
    ("stage_translate_mr", "Translating to Marathi"),
    ("stage_excel", "Creating Excel workbook"),
]

class JobSession:
    def __init__(self, job_id: str, document_info: Optional[DocumentMetadata] = None, raw_text: str = ""):
        self.job_id = job_id
        self.status = JobStatus.IDLE
        self.progress_percentage = 0
        self.current_stage = "Upload validation"
        self.stages: List[ProcessingStage] = [
            ProcessingStage(id=stage_id, label=label, status=StageStatus.PENDING)
            for stage_id, label in INITIAL_STAGES
        ]
        self.document_info = document_info
        self.raw_text = raw_text
        self.cleaned_text = ""
        self.chunks: List[str] = []
        self.results: Optional[MultilingualQnAResult] = None
        self.error_message: Optional[str] = None
        self.excel_download_url: Optional[str] = None
        self.excel_file_path: Optional[str] = None
        self.created_at = time.time()
        self.completed_at: Optional[float] = None

    def update_stage_status(self, stage_id: str, status: StageStatus, detail: Optional[str] = None):
        stage_found = False
        completed_count = 0
        for stage in self.stages:
            if stage.id == stage_id:
                stage.status = status
                if detail:
                    stage.detail = detail
                stage_found = True
                if status == StageStatus.IN_PROGRESS:
                    self.current_stage = stage.label
            if stage.status == StageStatus.COMPLETED:
                completed_count += 1

        self.progress_percentage = int((completed_count / len(self.stages)) * 100)

    def to_response(self) -> JobResponse:
        return JobResponse(
            job_id=self.job_id,
            status=self.status,
            progress_percentage=self.progress_percentage,
            current_stage=self.current_stage,
            stages=self.stages,
            document_info=self.document_info,
            error_message=self.error_message,
            results=self.results,
            excel_download_url=self.excel_download_url,
            created_at=self.created_at,
            completed_at=self.completed_at
        )

class JobManager:
    _jobs: Dict[str, JobSession] = {}

    @classmethod
    def create_job(cls, document_info: DocumentMetadata, raw_text: str) -> JobSession:
        job_id = str(uuid.uuid4())
        session = JobSession(job_id=job_id, document_info=document_info, raw_text=raw_text)
        cls._jobs[job_id] = session
        cls._cleanup_old_jobs()
        return session

    @classmethod
    def get_job(cls, job_id: str) -> Optional[JobSession]:
        return cls._jobs.get(job_id)

    @classmethod
    def delete_job(cls, job_id: str):
        if job_id in cls._jobs:
            session = cls._jobs[job_id]
            if session.excel_file_path and os.path.exists(session.excel_file_path):
                try:
                    os.remove(session.excel_file_path)
                except Exception as e:
                    logger.warning(f"Failed to remove temp excel file: {e}")
            del cls._jobs[job_id]

    @classmethod
    def _cleanup_old_jobs(cls, max_age_seconds: int = 7200):
        now = time.time()
        expired = [
            jid for jid, sess in cls._jobs.items()
            if now - sess.created_at > max_age_seconds
        ]
        for jid in expired:
            cls.delete_job(jid)

job_manager = JobManager
