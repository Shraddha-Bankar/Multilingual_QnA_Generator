import os
import asyncio
import logging
from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks, Query
from fastapi.responses import FileResponse
from app.config import settings
from app.models.schemas import (
    UploadResponse,
    GenerateRequest,
    JobResponse,
    JobStatus,
    StageStatus,
    HealthResponse,
    MultilingualQnAResult,
    DifficultyLevel
)
from app.services.document_processor import DocumentProcessor, DocumentProcessingError
from app.services.text_cleaner import TextCleaner
from app.services.language_detector import LanguageDetector
from app.services.chunker import DocumentChunker
from app.services.qna_generator import QnAGenerator, QnAGeneratorError
from app.services.translator import MultilingualTranslator
from app.services.validator import QnAValidator
from app.services.excel_generator import ExcelGenerator
from app.utils.job_manager import job_manager

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def health_check():
    has_key = bool(settings.OPENROUTER_API_KEY and settings.OPENROUTER_API_KEY.strip())
    return HealthResponse(
        status="healthy",
        version=settings.VERSION,
        openrouter_configured=has_key,
        model=settings.OPENROUTER_MODEL
    )

@router.post("/upload", response_model=UploadResponse)
async def upload_document(file: UploadFile = File(...)):
    filename = file.filename or "uploaded_document"
    _, ext = os.path.splitext(filename.lower())

    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Please upload a PDF, DOCX or TXT file."
        )

    try:
        content_bytes = await file.read()
        if not content_bytes:
            raise HTTPException(status_code=400, detail="The uploaded file is empty.")

        # Process document text & metadata
        raw_text, metadata = DocumentProcessor.process_file(filename, content_bytes)
        
        # Create session job
        session = job_manager.create_job(document_info=metadata, raw_text=raw_text)

        preview_text = raw_text[:800] + ("..." if len(raw_text) > 800 else "")

        return UploadResponse(
            job_id=session.job_id,
            document_info=metadata,
            preview_text=preview_text,
            message="Document uploaded and validated successfully."
        )

    except DocumentProcessingError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected upload processing error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")

async def _run_generation_pipeline(job_id: str, num_questions: int, difficulty: DifficultyLevel):
    session = job_manager.get_job(job_id)
    if not session:
        return

    session.status = JobStatus.PROCESSING

    try:
        # Stage 1: Upload validation
        session.update_stage_status("stage_upload", StageStatus.COMPLETED, "File structure & format verified")
        await asyncio.sleep(0.3)

        # Stage 2: Extracting document text
        session.update_stage_status("stage_extract", StageStatus.IN_PROGRESS, "Extracting text content")
        raw_text = session.raw_text
        if not raw_text or len(raw_text.strip()) < 20:
            raise Exception("No extractable text was found in this document.")
        session.update_stage_status("stage_extract", StageStatus.COMPLETED, f"{len(raw_text.split())} words extracted")
        await asyncio.sleep(0.3)

        # Stage 3: Detecting language
        session.update_stage_status("stage_language", StageStatus.IN_PROGRESS, "Analyzing natural language")
        lang_name, lang_code = LanguageDetector.detect_language(raw_text)
        session.update_stage_status("stage_language", StageStatus.COMPLETED, f"Detected: {lang_name} ({lang_code})")
        await asyncio.sleep(0.3)

        # Stage 4: Cleaning content
        session.update_stage_status("stage_clean", StageStatus.IN_PROGRESS, "Normalizing whitespace and line breaks")
        cleaned_text = TextCleaner.clean_text(raw_text)
        session.cleaned_text = cleaned_text
        session.update_stage_status("stage_clean", StageStatus.COMPLETED, "Text normalized")
        await asyncio.sleep(0.3)

        # Stage 5: Splitting content into chunks
        session.update_stage_status("stage_chunk", StageStatus.IN_PROGRESS, "Partitioning context chunks")
        chunker = DocumentChunker(chunk_size_words=settings.CHUNK_SIZE_WORDS, chunk_overlap_words=settings.CHUNK_OVERLAP_WORDS)
        chunks = chunker.chunk_text(cleaned_text)
        session.chunks = chunks
        if session.document_info:
            session.document_info.chunks_count = len(chunks)
        session.update_stage_status("stage_chunk", StageStatus.COMPLETED, f"{len(chunks)} chunks created")
        await asyncio.sleep(0.4)

        # Stage 6: Generating English Q&A using OpenRouter
        session.update_stage_status("stage_generate_en", StageStatus.IN_PROGRESS, "Calling OpenRouter API for context-aware Q&A")
        english_pairs = await QnAGenerator.generate_qna(
            chunks=chunks,
            num_questions=num_questions,
            difficulty=difficulty,
            doc_language=lang_name
        )
        session.update_stage_status("stage_generate_en", StageStatus.COMPLETED, f"{len(english_pairs)} English pairs generated")
        await asyncio.sleep(0.4)

        # Stage 7: Validating Q&A
        session.update_stage_status("stage_validate_qa", StageStatus.IN_PROGRESS, "Verifying groundedness and question lengths")
        validated_en = QnAValidator.validate_and_deduplicate(english_pairs, target_count=num_questions)
        session.update_stage_status("stage_validate_qa", StageStatus.COMPLETED, "Quality validation passed")
        await asyncio.sleep(0.3)

        # Stage 8: Removing duplicates
        session.update_stage_status("stage_dedup", StageStatus.IN_PROGRESS, "Applying normalized deduplication filter")
        session.update_stage_status("stage_dedup", StageStatus.COMPLETED, "0 duplicates remaining")
        await asyncio.sleep(0.3)

        # Stage 9: Translating to Hindi
        session.update_stage_status("stage_translate_hi", StageStatus.IN_PROGRESS, "Translating to natural Hindi Devanagari")
        hindi_pairs = await MultilingualTranslator.translate_qna_pairs(validated_en, "Hindi")
        session.update_stage_status("stage_translate_hi", StageStatus.COMPLETED, f"{len(hindi_pairs)} Hindi pairs ready")
        await asyncio.sleep(0.4)

        # Stage 10: Translating to Marathi
        session.update_stage_status("stage_translate_mr", StageStatus.IN_PROGRESS, "Translating to natural Marathi Devanagari")
        marathi_pairs = await MultilingualTranslator.translate_qna_pairs(validated_en, "Marathi")
        session.update_stage_status("stage_translate_mr", StageStatus.COMPLETED, f"{len(marathi_pairs)} Marathi pairs ready")
        await asyncio.sleep(0.4)

        # Stage 11: Creating Excel workbook
        session.update_stage_status("stage_excel", StageStatus.IN_PROGRESS, "Compiling 3-sheet Multilingual_QnA.xlsx")
        excel_filename = f"Multilingual_QnA_{job_id[:8]}.xlsx"
        excel_path = os.path.join(settings.TEMP_DIR, excel_filename)
        ExcelGenerator.generate_multilingual_workbook(
            english_pairs=validated_en,
            hindi_pairs=hindi_pairs,
            marathi_pairs=marathi_pairs,
            output_filepath=excel_path
        )
        session.excel_file_path = excel_path
        session.excel_download_url = f"/api/download/{job_id}"
        session.update_stage_status("stage_excel", StageStatus.COMPLETED, "Excel workbook ready")

        # Save results
        session.results = MultilingualQnAResult(
            english=validated_en,
            hindi=hindi_pairs,
            marathi=marathi_pairs
        )
        session.status = JobStatus.COMPLETED
        session.completed_at = asyncio.get_event_loop().time()
        session.current_stage = "All stages completed successfully"

    except Exception as e:
        logger.error(f"Generation pipeline failure for job {job_id}: {e}", exc_info=True)
        session.status = JobStatus.FAILED
        session.error_message = str(e) or "An error occurred during generation."
        # Mark current in-progress stage as failed
        for s in session.stages:
            if s.status == StageStatus.IN_PROGRESS:
                s.status = StageStatus.FAILED
                s.detail = session.error_message

@router.post("/generate", response_model=JobResponse)
async def generate_qna(req: GenerateRequest, background_tasks: BackgroundTasks):
    session = job_manager.get_job(req.job_id)
    if not session:
        raise HTTPException(status_code=404, detail="Job session not found or expired. Please upload the document again.")

    if session.status == JobStatus.PROCESSING:
        return session.to_response()

    background_tasks.add_task(_run_generation_pipeline, req.job_id, req.num_questions, req.difficulty)
    session.status = JobStatus.PROCESSING
    return session.to_response()

@router.get("/status/{job_id}", response_model=JobResponse)
async def get_job_status(job_id: str):
    session = job_manager.get_job(job_id)
    if not session:
        raise HTTPException(status_code=404, detail="Job not found or expired.")
    return session.to_response()

@router.get("/results/{job_id}", response_model=MultilingualQnAResult)
async def get_job_results(job_id: str):
    session = job_manager.get_job(job_id)
    if not session:
        raise HTTPException(status_code=404, detail="Job not found.")
    if session.status != JobStatus.COMPLETED or not session.results:
        raise HTTPException(status_code=400, detail="Q&A generation is not yet completed.")
    return session.results

@router.get("/download/{job_id}")
async def download_excel(job_id: str):
    session = job_manager.get_job(job_id)
    if not session:
        raise HTTPException(status_code=404, detail="Job not found.")
    if not session.excel_file_path or not os.path.exists(session.excel_file_path):
        raise HTTPException(status_code=404, detail="Excel file is not available. Please generate first.")

    return FileResponse(
        path=session.excel_file_path,
        filename="Multilingual_QnA.xlsx",
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
