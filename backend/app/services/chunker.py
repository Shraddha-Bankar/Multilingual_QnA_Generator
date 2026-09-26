import re
from typing import List

class DocumentChunker:
    def __init__(self, chunk_size_words: int = 1500, chunk_overlap_words: int = 150):
        self.chunk_size = max(5, chunk_size_words)
        self.chunk_overlap = max(0, min(chunk_overlap_words, self.chunk_size // 2))

    def chunk_text(self, text: str) -> List[str]:
        """
        Splits text into chunks of roughly `chunk_size` words with `chunk_overlap` words overlap,
        respecting paragraph, sentence, and word boundaries.
        """
        if not text or not text.strip():
            return []

        # Split text into paragraphs first
        paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
        if not paragraphs:
            paragraphs = [text.strip()]
        
        chunks: List[str] = []
        current_chunk_words: List[str] = []

        for para in paragraphs:
            para_words = para.split()
            if not para_words:
                continue

            # If paragraph contains punctuation sentences, split by sentences, else word chunks
            sentences = re.split(r'(?<=[.!?])\s+', para)
            if len(sentences) <= 1 and len(para_words) > self.chunk_size:
                # Break large paragraph without punctuation directly into word batches
                sub_units = []
                step = self.chunk_size - self.chunk_overlap
                for i in range(0, len(para_words), step):
                    sub_units.append(" ".join(para_words[i:i + self.chunk_size]))
            else:
                sub_units = [s.strip() for s in sentences if s.strip()]

            for unit in sub_units:
                unit_words = unit.split()
                if not unit_words:
                    continue

                if len(current_chunk_words) + len(unit_words) > self.chunk_size and current_chunk_words:
                    chunk_str = " ".join(current_chunk_words).strip()
                    if chunk_str:
                        chunks.append(chunk_str)
                    
                    # Apply overlap
                    overlap_count = min(self.chunk_overlap, len(current_chunk_words))
                    if overlap_count > 0:
                        current_chunk_words = current_chunk_words[-overlap_count:] + unit_words
                    else:
                        current_chunk_words = unit_words
                else:
                    current_chunk_words.extend(unit_words)

        if current_chunk_words:
            chunk_str = " ".join(current_chunk_words).strip()
            if chunk_str and (not chunks or chunk_str != chunks[-1]):
                chunks.append(chunk_str)

        return chunks if chunks else [text.strip()]
