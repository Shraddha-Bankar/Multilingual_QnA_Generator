import re
import unicodedata

class TextCleaner:
    @staticmethod
    def clean_text(raw_text: str) -> str:
        """
        Cleans and normalizes extracted text:
        - Normalizes Unicode characters
        - Fixes broken hyphenated words at line breaks (e.g., 'knowl-\nedge' -> 'knowledge')
        - Normalizes excessive whitespace and blank lines
        - Removes standalone page numbers and repetitive header/footer artifacts
        - Preserves paragraph structure and punctuation
        """
        if not raw_text or not raw_text.strip():
            return ""
        
        # 1. Normalize Unicode (NFKC)
        text = unicodedata.normalize("NFKC", raw_text)
        
        # 2. Fix hyphenation across line breaks
        text = re.sub(r'(\w+)-\s*\n\s*(\w+)', r'\1\2', text)
        
        # 3. Replace non-breaking spaces and other odd spaces with normal space
        text = re.sub(r'[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]', ' ', text)
        
        # 4. Normalize newlines
        text = text.replace('\r\n', '\n').replace('\r', '\n')
        
        # 5. Remove repetitive page header / footer patterns like 'Page 1 of 10' or lone page numbers
        text = re.sub(r'(?i)\bPage\s+\d+\s+(?:of|\/)\s+\d+\b', '', text)
        text = re.sub(r'(?m)^\s*\d+\s*$', '', text)
        
        # 6. Normalize multiple horizontal whitespace into a single space
        text = re.sub(r'[ \t]+', ' ', text)
        
        # 7. Collapse 3 or more consecutive newlines into 2
        text = re.sub(r'\n{3,}', '\n\n', text)
        
        # 8. Strip leading and trailing whitespace from each line
        lines = [line.strip() for line in text.split('\n')]
        cleaned_text = '\n'.join(lines).strip()
        
        return cleaned_text
