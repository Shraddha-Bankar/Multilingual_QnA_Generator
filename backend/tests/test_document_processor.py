import pytest
import io
import docx
from reportlab.pdfgen import canvas
from app.services.document_processor import DocumentProcessor, DocumentProcessingError
from app.services.text_cleaner import TextCleaner
from app.services.language_detector import LanguageDetector

def create_sample_pdf_bytes(text: str) -> bytes:
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer)
    c.drawString(100, 750, text)
    c.showPage()
    c.save()
    return buffer.getvalue()

def create_sample_docx_bytes(paragraphs: list) -> bytes:
    buffer = io.BytesIO()
    doc = docx.Document()
    for p in paragraphs:
        doc.add_paragraph(p)
    doc.save(buffer)
    return buffer.getvalue()

def test_txt_extraction():
    sample_text = "Indian Knowledge Systems (IKS) represent the cumulative wisdom of traditional Indian sciences, arts, philosophy, astronomy, and mathematics developed over thousands of years."
    content_bytes = sample_text.encode("utf-8")
    
    text, meta = DocumentProcessor.process_file("sample.txt", content_bytes)
    assert "Indian Knowledge Systems" in text
    assert meta.file_type == "TXT"
    assert meta.word_count > 10
    assert meta.detected_language == "English"

def test_docx_extraction():
    paragraphs = [
        "Machine Learning is a subfield of Artificial Intelligence focusing on building data-driven algorithms.",
        "Supervised learning trains models on labeled training datasets."
    ]
    docx_bytes = create_sample_docx_bytes(paragraphs)
    
    text, meta = DocumentProcessor.process_file("ml_guide.docx", docx_bytes)
    assert "Machine Learning" in text
    assert "Supervised learning" in text
    assert meta.file_type == "DOCX"
    assert meta.word_count > 10

def test_pdf_extraction():
    sample_text = "Artificial Intelligence represents the simulation of human intelligence by computer systems."
    pdf_bytes = create_sample_pdf_bytes(sample_text)
    
    text, meta = DocumentProcessor.process_file("ai_intro.pdf", pdf_bytes)
    assert "Artificial Intelligence" in text
    assert meta.file_type == "PDF"
    assert meta.page_count >= 1

def test_empty_file_error():
    with pytest.raises(DocumentProcessingError, match="The uploaded file is empty"):
        DocumentProcessor.process_file("empty.txt", b"")

def test_unsupported_format_error():
    with pytest.raises(DocumentProcessingError, match="Unsupported file format"):
        DocumentProcessor.process_file("test.exe", b"some binary data content")

def test_text_cleaner_normalizes_whitespace():
    dirty = "This is a  test   with   \n\n\n excessive   spaces and \n Page 1 of 5 \n line breaks."
    cleaned = TextCleaner.clean_text(dirty)
    assert "Page 1 of 5" not in cleaned
    assert "   " not in cleaned
