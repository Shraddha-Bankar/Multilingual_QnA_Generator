import pytest
from app.services.chunker import DocumentChunker

def test_chunker_basic():
    chunker = DocumentChunker(chunk_size_words=10, chunk_overlap_words=2)
    sample_text = "This is a simple sentence for testing. This is another sentence that continues the thoughts. Here is a third sentence."
    chunks = chunker.chunk_text(sample_text)
    assert len(chunks) >= 1

def test_chunker_empty():
    chunker = DocumentChunker()
    assert chunker.chunk_text("") == []

def test_chunker_large_document():
    chunker = DocumentChunker(chunk_size_words=50, chunk_overlap_words=10)
    # Generate 200 words
    words = [f"word{i}" for i in range(200)]
    text = " ".join(words)
    chunks = chunker.chunk_text(text)
    assert len(chunks) > 1
