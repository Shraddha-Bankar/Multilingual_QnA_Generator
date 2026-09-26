import json
import re
import asyncio
import logging
import httpx
from typing import List, Optional
from app.config import settings
from app.models.schemas import QnAPair, DifficultyLevel
from app.services.validator import QnAValidator
from app.utils.request_logger import RequestTracker

logger = logging.getLogger(__name__)

class QnAGeneratorError(Exception):
    pass

class QnAGenerator:
    @classmethod
    async def generate_qna(
        cls,
        chunks: List[str],
        num_questions: int = 10,
        difficulty: DifficultyLevel = DifficultyLevel.MIXED,
        doc_language: str = "English"
    ) -> List[QnAPair]:
        """
        Generates grounded context-aware QnA pairs from document chunks.
        Tries OpenRouter API first, and falls back to context-grounded NLP engine on 429/rate-limit.
        """
        if not chunks:
            raise QnAGeneratorError("No document chunks available for Q&A generation.")

        api_key = settings.OPENROUTER_API_KEY.strip()
        all_candidate_pairs: List[QnAPair] = []
        num_chunks = len(chunks)
        rate_limited = False

        if api_key:
            # Distribute questions across chunks with minimal API requests
            if num_questions <= 3 or num_chunks == 1:
                chunk_pairs, is_429 = await cls._generate_for_chunk(
                    chunk=chunks[0],
                    chunk_index=1,
                    total_chunks=num_chunks,
                    target_count=num_questions,
                    difficulty=difficulty,
                    api_key=api_key
                )
                if is_429:
                    rate_limited = True
                else:
                    all_candidate_pairs.extend(chunk_pairs)
            else:
                base_count = num_questions // num_chunks
                remainder = num_questions % num_chunks
                
                for idx in range(num_chunks):
                    count_for_chunk = base_count + (1 if idx < remainder else 0)
                    if count_for_chunk <= 0:
                        continue
                    
                    chunk_pairs, is_429 = await cls._generate_for_chunk(
                        chunk=chunks[idx],
                        chunk_index=idx + 1,
                        total_chunks=num_chunks,
                        target_count=count_for_chunk,
                        difficulty=difficulty,
                        api_key=api_key
                    )
                    if is_429:
                        rate_limited = True
                        break
                    all_candidate_pairs.extend(chunk_pairs)
        else:
            rate_limited = True

        # If rate limited or insufficient candidates, generate grounded QnA directly from document text
        if rate_limited or len(all_candidate_pairs) < num_questions:
            logger.info("OpenRouter free-tier rate limit active. Using grounded contextual extraction from document chunks.")
            grounded_pairs = cls._generate_heuristic_grounded_qna(chunks, num_questions, difficulty)
            all_candidate_pairs.extend(grounded_pairs)

        # Local validation and deduplication (NO API CALLS)
        validated_pairs = QnAValidator.validate_and_deduplicate(all_candidate_pairs, target_count=num_questions)

        if not validated_pairs:
            raise QnAGeneratorError("Failed to extract valid Q&A pairs from the document.")

        return validated_pairs

    @classmethod
    async def _generate_for_chunk(
        cls,
        chunk: str,
        chunk_index: int,
        total_chunks: int,
        target_count: int,
        difficulty: DifficultyLevel,
        api_key: str
    ) -> tuple[List[QnAPair], bool]:
        system_prompt = (
            "You are an academic and technical Question-Answer Generation Assistant. "
            "Your task is to generate high-quality, context-aware Question and Answer pairs based SOLELY on the provided text snippet.\n\n"
            "RULES:\n"
            "1. Rely ONLY on the context provided. Do NOT extrapolate or assume facts.\n"
            "2. Questions must be meaningful and diverse (e.g. 'What is...', 'How does...', 'Why is...', 'What are the main characteristics of...').\n"
            "3. Answers must be factual, accurate, complete, and directly supported by the context.\n"
            f"4. Difficulty level target: {difficulty.value}.\n"
            "5. Respond strictly in valid JSON format."
        )

        user_prompt = f"""Generate {target_count} high-quality question-answer pairs from Chunk {chunk_index} of {total_chunks}:

--- CONTEXT START ---
{chunk}
--- CONTEXT END ---

Output ONLY a JSON object matching this exact schema:
{{
  "qa_pairs": [
    {{
      "question": "Comprehensive question based directly on the text",
      "answer": "Accurate, complete, and context-grounded answer"
    }}
  ]
}}
"""

        headers = {
            "Authorization": f"Bearer {api_key}",
            "HTTP-Referer": "https://multilingual-qna-generator.local",
            "X-Title": "Multilingual QnA Generator",
            "Content-Type": "application/json"
        }

        max_tokens_val = 1024
        payload = {
            "model": settings.OPENROUTER_MODEL,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "max_tokens": max_tokens_val,
            "temperature": settings.OPENROUTER_TEMPERATURE,
            "response_format": {"type": "json_object"}
        }

        url = f"{settings.OPENROUTER_BASE_URL.rstrip('/')}/chat/completions"
        purpose = f"English generation (Chunk {chunk_index}/{total_chunks})"

        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                response = await client.post(url, headers=headers, json=payload)
                status_code = response.status_code
                
                RequestTracker.log_request(
                    purpose=purpose,
                    model=settings.OPENROUTER_MODEL,
                    max_tokens=max_tokens_val,
                    status_code=status_code
                )

                if status_code == 429 or status_code == 402:
                    return [], True

                if status_code != 200:
                    return [], True

                data = response.json()
                choices = data.get("choices", [])
                if choices:
                    msg_obj = choices[0].get("message", {})
                    content = msg_obj.get("content") or msg_obj.get("reasoning") or ""
                    parsed = cls._parse_json_qa_pairs(content)
                    if parsed:
                        return parsed, False

            except Exception as e:
                logger.warning(f"OpenRouter generation exception: {e}")
                return [], True

        return [], True

    @classmethod
    def _generate_heuristic_grounded_qna(
        cls, chunks: List[str], num_questions: int, difficulty: DifficultyLevel
    ) -> List[QnAPair]:
        """
        Extracts factually grounded, high-quality Q&A pairs directly from document text.
        Identifies key concepts, definitions, and statements across all chunks.
        """
        combined_text = "\n\n".join(chunks)
        paragraphs = [p.strip() for p in combined_text.split("\n\n") if p.strip()]
        
        # Collect all individual sentences
        all_sentences = []
        for p in paragraphs:
            s_list = re.split(r'(?<=[.!?])\s+', p)
            for s in s_list:
                s_clean = s.strip()
                if len(s_clean) > 35 and not s_clean.startswith("#"):
                    all_sentences.append(s_clean)

        pairs: List[QnAPair] = []

        # Strategy 1: Paragraph-level concepts and section summaries
        for p in paragraphs:
            # Check for heading or section pattern (e.g. "1. Overview", "3. Mathematics", "Ayurveda...")
            lines = [l.strip() for l in p.split("\n") if l.strip()]
            first_line = lines[0] if lines else ""
            body_text = " ".join(lines[1:]) if len(lines) > 1 else p

            # Match section titles like "1. Overview and Core Philosophy"
            section_match = re.match(r'^(?:\d+[\.\)]\s*)?([A-Za-z0-9\s,:\-\(\)]+)', first_line)
            if section_match and len(first_line) < 80 and body_text:
                topic = section_match.group(1).strip().rstrip(":")
                if len(topic) > 4:
                    q = f"What are the key concepts and significance of {topic} as described in the document?"
                    a = body_text[:450].strip()
                    if not a.endswith("."):
                        a += "."
                    pairs.append(QnAPair(id=len(pairs) + 1, question=q, answer=a))

        # Strategy 2: Definition and role patterns ("X encompass/detail/provide/introduce/stands as...")
        definition_patterns = [
            (r'^(.*?)\s+(?:encompasses?|encompass)\s+(.*)', "What does {concept} encompass?", "{concept} encompasses {rest}."),
            (r'^(.*?)\s+(?:is defined as|refers to|stands as)\s+(.*)', "What is {concept}?", "{concept} {rest}."),
            (r'^(.*?)\s+(?:introduced|established|elaborated on|pioneered)\s+(.*)', "What contributions were made by {concept}?", "{concept} {rest}."),
            (r'^(.*?)\s+(?:emphasizes?|provides?)\s+(.*)', "What does {concept} emphasize or provide?", "{concept} {rest}."),
            (r'^(.*?)\s+(?:achieved|demonstrated|reflected)\s+(.*)', "How did {concept} demonstrate significant advancements?", "{concept} {rest}.")
        ]

        for s in all_sentences:
            for pat, q_template, a_template in definition_patterns:
                m = re.search(pat, s, re.IGNORECASE)
                if m:
                    subj = m.group(1).strip().strip(",")
                    rest = m.group(2).strip()
                    if 3 < len(subj) < 60 and len(rest) > 20:
                        q = q_template.format(concept=subj, rest=rest)
                        a = s
                        pairs.append(QnAPair(id=len(pairs) + 1, question=q, answer=a))
                        break

        # Strategy 3: Multi-sentence deep-dive questions
        for idx, s in enumerate(all_sentences):
            if len(pairs) >= num_questions * 2:
                break
            words = s.split()
            if len(words) >= 10:
                lead = " ".join(words[:4])
                q = f"How does the text explain the role and principles of {lead}?"
                a = s
                # Append next sentence if available for richer answers
                if idx + 1 < len(all_sentences) and len(a) < 150:
                    a += " " + all_sentences[idx + 1]
                pairs.append(QnAPair(id=len(pairs) + 1, question=q, answer=a))

        return pairs

    @classmethod
    def _parse_json_qa_pairs(cls, content: str) -> List[QnAPair]:
        if not content:
            return []

        try:
            parsed = json.loads(content)
            pairs_raw = parsed.get("qa_pairs", parsed.get("pairs", []))
            if isinstance(parsed, list):
                pairs_raw = parsed

            results = []
            for item in pairs_raw:
                if isinstance(item, dict) and "question" in item and "answer" in item:
                    results.append(QnAPair(question=str(item["question"]).strip(), answer=str(item["answer"]).strip()))
            if results:
                return results
        except Exception:
            pass

        match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', content)
        if match:
            try:
                parsed = json.loads(match.group(1))
                pairs_raw = parsed.get("qa_pairs", parsed.get("pairs", []))
                results = []
                for item in pairs_raw:
                    if isinstance(item, dict) and "question" in item and "answer" in item:
                        results.append(QnAPair(question=str(item["question"]).strip(), answer=str(item["answer"]).strip()))
                if results:
                    return results
            except Exception:
                pass

        item_matches = re.finditer(r'\{\s*"question"\s*:\s*"((?:[^"\\]|\\.)*)"\s*,\s*"answer"\s*:\s*"((?:[^"\\]|\\.)*)"\s*\}', content)
        results = []
        for m in item_matches:
            q = m.group(1).replace('\\"', '"').replace('\\n', ' ').strip()
            a = m.group(2).replace('\\"', '"').replace('\\n', ' ').strip()
            if q and a:
                results.append(QnAPair(question=q, answer=a))
        return results
