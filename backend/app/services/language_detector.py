import logging
from typing import Tuple

logger = logging.getLogger(__name__)

LANGUAGE_MAP = {
    "en": "English",
    "hi": "Hindi",
    "mr": "Marathi",
    "bn": "Bengali",
    "ta": "Tamil",
    "te": "Telugu",
    "gu": "Gujarati",
    "kn": "Kannada",
    "ml": "Malayalam",
    "pa": "Punjabi",
    "es": "Spanish",
    "fr": "French",
    "de": "German",
    "zh": "Chinese",
    "ja": "Japanese",
    "ar": "Arabic",
    "ru": "Russian",
}

class LanguageDetector:
    @staticmethod
    def detect_language(text: str) -> Tuple[str, str]:
        """
        Detects language from text snippet.
        Returns (language_name, language_code).
        Defaults to ("English", "en") on ambiguity or error.
        """
        if not text or not text.strip():
            return "English", "en"
        
        sample = text[:2000].strip()
        try:
            from langdetect import detect
            code = detect(sample)
            name = LANGUAGE_MAP.get(code, code.capitalize())
            return name, code
        except Exception as e:
            logger.warning(f"Language detection fallback triggered: {e}")
            return "English", "en"
