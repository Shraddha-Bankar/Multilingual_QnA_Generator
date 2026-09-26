import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Multilingual QnA Generator"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # OpenRouter LLM Configuration
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    OPENROUTER_MODEL: str = "openrouter/free"
    OPENROUTER_FALLBACK_MODEL: str = "openrouter/free"
    OPENROUTER_TEMPERATURE: float = 0.3
    OPENROUTER_MAX_RETRIES: int = 3
    OPENROUTER_TIMEOUT_SECONDS: float = 60.0
    
    # Document Processing & Chunking
    MAX_UPLOAD_SIZE_MB: int = 25
    CHUNK_SIZE_WORDS: int = 1500
    CHUNK_OVERLAP_WORDS: int = 150
    
    # Allowed Extensions
    ALLOWED_EXTENSIONS: List[str] = [".pdf", ".docx", ".txt"]
    
    # Temporary Storage Directory
    TEMP_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "temp_storage")
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()

# Ensure temp directory exists
os.makedirs(settings.TEMP_DIR, exist_ok=True)
