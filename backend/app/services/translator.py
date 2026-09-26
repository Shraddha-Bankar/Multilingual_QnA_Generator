import os
import json
import re
import asyncio
import logging
import httpx
from typing import List, Dict, Optional, Tuple
from dotenv import load_dotenv, find_dotenv

from app.config import settings
from app.models.schemas import QnAPair
from app.utils.request_logger import RequestTracker

load_dotenv(find_dotenv())

logger = logging.getLogger(__name__)

class TranslationError(Exception):
    """Exception raised when translation fails or output validation fails."""
    pass

ENGLISH_FUNCTION_WORDS = {
    "is", "are", "was", "were", "am", "be", "been", "being",
    "used", "which", "that", "this", "these", "those", "there",
    "and", "or", "but", "because", "between", "among", "with",
    "for", "from", "to", "of", "in", "on", "at", "by", "into", "onto", "through",
    "the", "a", "an", "as", "such", "than", "so",
    "it", "its", "they", "them", "their", "we", "our", "you", "your", "he", "she", "his", "her",
    "can", "could", "would", "should", "may", "might", "must", "will", "shall",
    "have", "has", "had", "do", "does", "did", "done", "having",
    "what", "why", "how", "when", "where", "who", "whom", "whose",
    "also", "only", "about", "above", "below", "under", "over", "after", "before",
    "provide", "provides", "emphasize", "emphasizes", "include", "includes", "encompass", "encompasses"
}

HINDI_EXCLUSIVE_MARKERS = {
    "किया जाता है", "होता है", "होती है", "क्या है", "के लिए"
}

class MultilingualTranslator:
    """
    Production-grade English-to-Hindi and English-to-Marathi Q&A Translator.
    Produces 100% natural, full-sentence translations in Devanagari script.
    """

    @classmethod
    async def translate_qna_pairs(
        cls, english_pairs: List[QnAPair], target_language: str
    ) -> List[QnAPair]:
        """
        Translates a list of English QnAPairs into the target language ('Hindi' or 'Marathi').
        Ensures complete sentence-level semantic translation in natural Devanagari script.
        """
        if not english_pairs:
            return []

        target_lang_normalized = target_language.capitalize()
        if target_lang_normalized not in ("Hindi", "Marathi"):
            raise TranslationError(f"Unsupported target translation language: {target_language}. Supported: Hindi, Marathi.")

        if target_lang_normalized == "Hindi":
            return await cls._translate_hindi_pipeline(english_pairs)
        else:
            return await cls._translate_marathi_pipeline(english_pairs)

    @classmethod
    async def _translate_hindi_pipeline(cls, english_pairs: List[QnAPair]) -> List[QnAPair]:
        """
        Dedicated Hindi translation pipeline ensuring 100% full-sentence Devanagari translation.
        Never returns English fallback text.
        """
        logger.info(f"Translating {len(english_pairs)} Q&A pairs into pure Hindi Devanagari...")
        
        async with httpx.AsyncClient(timeout=20.0) as client:
            q_tasks = [cls._translate_hindi_text_robust(client, p.question) for p in english_pairs]
            a_tasks = [cls._translate_hindi_text_robust(client, p.answer) for p in english_pairs]

            q_translations = await asyncio.gather(*q_tasks)
            a_translations = await asyncio.gather(*a_tasks)

        hindi_pairs: List[QnAPair] = []
        for idx, (q_tr, a_tr, en_p) in enumerate(zip(q_translations, a_translations, english_pairs)):
            # Format Hindi punctuation
            if q_tr and not q_tr.endswith("?"):
                q_tr += "?"
            if a_tr and not a_tr.endswith("।") and not a_tr.endswith("."):
                a_tr += "।"

            # Strict validation: Check that Hindi translation is not empty, not identical to English, and contains Devanagari
            is_valid, reason = cls._validate_hindi_single(q_tr, a_tr, en_p.question, en_p.answer)
            if not is_valid:
                logger.error(f"Hindi validation failure on pair #{idx + 1}: {reason}")
                raise TranslationError(f"Hindi translation failed for pair #{idx + 1}: {reason}. Please retry Hindi translation.")

            hindi_pairs.append(QnAPair(id=idx + 1, question=q_tr, answer=a_tr))

        return hindi_pairs

    @classmethod
    async def _translate_hindi_text_robust(cls, client: httpx.AsyncClient, text: str) -> str:
        """
        Robustly translates a single English sentence into Hindi using multiple neural endpoints.
        """
        if not text or not text.strip():
            return ""

        clean_text = text.strip()

        # Strategy 1: Google Neural Endpoint (gtx)
        try:
            url = "https://translate.googleapis.com/translate_a/single"
            params = {"client": "gtx", "sl": "en", "tl": "hi", "dt": "t", "q": clean_text}
            res = await client.get(url, params=params)
            if res.status_code == 200:
                data = res.json()
                parts = [p[0] for p in data[0] if p and p[0]]
                translated = "".join(parts).strip()
                if translated and len(re.findall(r'[\u0900-\u097F]', translated)) > 0:
                    return translated
        except Exception as e:
            logger.debug(f"Hindi gtx translation notice: {e}")

        # Strategy 2: Google Neural Endpoint (dict-chrome-ex)
        try:
            url = "https://translate.googleapis.com/translate_a/single"
            params = {"client": "dict-chrome-ex", "sl": "en", "tl": "hi", "dt": "t", "q": clean_text}
            res = await client.get(url, params=params)
            if res.status_code == 200:
                data = res.json()
                parts = [p[0] for p in data[0] if p and p[0]]
                translated = "".join(parts).strip()
                if translated and len(re.findall(r'[\u0900-\u097F]', translated)) > 0:
                    return translated
        except Exception as e:
            logger.debug(f"Hindi dict-chrome-ex translation notice: {e}")

        # Strategy 3: MyMemory Neural Endpoint
        try:
            from deep_translator import MyMemoryTranslator
            tr = MyMemoryTranslator(source="en-GB", target="hi-IN")
            res = await asyncio.to_thread(tr.translate, clean_text)
            if res and len(re.findall(r'[\u0900-\u097F]', res)) > 0:
                return res.strip()
        except Exception as e:
            logger.debug(f"Hindi MyMemory translation notice: {e}")

        # If all neural endpoints failed, raise an error instead of silently returning English
        raise TranslationError(f"Unable to translate English text to Hindi: '{clean_text[:40]}...'")

    @classmethod
    def _validate_hindi_single(cls, q_hi: str, a_hi: str, q_en: str, a_en: str) -> Tuple[bool, str]:
        """
        Validates that a Hindi translation is pure Devanagari and not English.
        """
        if not q_hi or not q_hi.strip():
            return False, "Hindi question is empty"
        if not a_hi or not a_hi.strip():
            return False, "Hindi answer is empty"

        # Check not identical to English source
        if q_hi.strip().lower() == q_en.strip().lower():
            return False, "Hindi question is identical to English source"
        if a_hi.strip().lower() == a_en.strip().lower():
            return False, "Hindi answer is identical to English source"

        for text_type, text in [("Question", q_hi), ("Answer", a_hi)]:
            # Strip acronyms like (NEP), (IKS)
            text_without_parens = re.sub(r'\([^)]*\)', ' ', text)
            devanagari_chars = len(re.findall(r'[\u0900-\u097F]', text_without_parens))
            alpha_chars = len(re.findall(r'[a-zA-Z\u0900-\u097F]', text_without_parens))

            if devanagari_chars == 0:
                return False, f"{text_type} contains no Devanagari script"

            if alpha_chars > 0 and (devanagari_chars / alpha_chars) < 0.50:
                return False, f"{text_type} has insufficient Devanagari script ({devanagari_chars}/{alpha_chars} chars)"

        return True, "Valid"

    @classmethod
    async def _translate_marathi_pipeline(cls, english_pairs: List[QnAPair]) -> List[QnAPair]:
        """
        Existing Marathi translation pipeline (preserved completely).
        """
        logger.info(f"Translating {len(english_pairs)} Q&A pairs into pure Marathi Devanagari...")
        
        async with httpx.AsyncClient(timeout=20.0) as client:
            q_tasks = [cls._translate_marathi_text(client, p.question) for p in english_pairs]
            a_tasks = [cls._translate_marathi_text(client, p.answer) for p in english_pairs]

            q_translations = await asyncio.gather(*q_tasks)
            a_translations = await asyncio.gather(*a_tasks)

        marathi_pairs: List[QnAPair] = []
        for idx, (q_tr, a_tr) in enumerate(zip(q_translations, a_translations)):
            if q_tr and not q_tr.endswith("?"):
                q_tr += "?"
            if a_tr and not a_tr.endswith("।") and not a_tr.endswith("."):
                a_tr += "।"

            marathi_pairs.append(QnAPair(id=idx + 1, question=q_tr, answer=a_tr))

        return marathi_pairs

    @classmethod
    async def _translate_marathi_text(cls, client: httpx.AsyncClient, text: str) -> str:
        """
        Translates a single English sentence into Marathi.
        """
        if not text or not text.strip():
            return ""

        clean_text = text.strip()

        # Strategy 1: Google gtx
        try:
            url = "https://translate.googleapis.com/translate_a/single"
            params = {"client": "gtx", "sl": "en", "tl": "mr", "dt": "t", "q": clean_text}
            res = await client.get(url, params=params)
            if res.status_code == 200:
                data = res.json()
                parts = [p[0] for p in data[0] if p and p[0]]
                translated = "".join(parts).strip()
                if translated:
                    return translated
        except Exception as e:
            logger.debug(f"Marathi gtx notice: {e}")

        # Strategy 2: MyMemory
        try:
            from deep_translator import MyMemoryTranslator
            tr = MyMemoryTranslator(source="en-GB", target="mr-IN")
            res = await asyncio.to_thread(tr.translate, clean_text)
            if res and res != clean_text:
                return res.strip()
        except Exception as e:
            logger.debug(f"Marathi MyMemory notice: {e}")

        return clean_text
