import re
from typing import List
from app.models.schemas import QnAPair

class QnAValidator:
    @staticmethod
    def _normalize_string(s: str) -> str:
        s = s.lower().strip()
        s = re.sub(r'[^\w\s]', '', s)
        s = re.sub(r'\s+', ' ', s)
        return s

    @classmethod
    def validate_and_deduplicate(cls, qa_pairs: List[QnAPair], target_count: int = 10) -> List[QnAPair]:
        """
        Validates QnA pairs and removes duplicates.
        Ensures valid content and limits the list to target_count.
        """
        valid_pairs: List[QnAPair] = []
        seen_questions = set()
        seen_answers = set()

        for idx, item in enumerate(qa_pairs):
            q = (item.question or "").strip()
            a = (item.answer or "").strip()

            # Basic length sanity checks
            if len(q) < 8 or len(a) < 10:
                continue

            # Check for generic meaningless hallucinated questions
            if q.lower() in ["what is this?", "who are you?", "what is the document about?"]:
                continue

            # Check if answer contains placeholder text
            if any(phrase in a.lower() for phrase in ["[insert", "placeholder", "not mentioned", "unknown context", "as an ai"]):
                continue

            norm_q = cls._normalize_string(q)
            norm_a = cls._normalize_string(a)

            # Duplicate question or answer check
            if norm_q in seen_questions or norm_a in seen_answers:
                continue

            seen_questions.add(norm_q)
            seen_answers.add(norm_a)

            valid_pairs.append(QnAPair(id=len(valid_pairs) + 1, question=q, answer=a))

            if len(valid_pairs) >= target_count:
                break

        return valid_pairs
