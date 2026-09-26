import logging

logger = logging.getLogger("openrouter_requests")

class RequestTracker:
    _request_counter = 0

    @classmethod
    def log_request(cls, purpose: str, model: str, max_tokens: int, status_code: int, error_detail: str = ""):
        cls._request_counter += 1
        msg_lines = [
            f"Request #{cls._request_counter}",
            f"Purpose: {purpose}",
            f"Model: {model}",
            f"max_tokens: {max_tokens}",
            f"Status: {status_code}"
        ]
        if error_detail:
            msg_lines.append(f"Detail: {error_detail}")
        
        formatted = "\n".join(msg_lines)
        print(f"\n{formatted}\n", flush=True)
        logger.info(formatted)
        return cls._request_counter

    @classmethod
    def reset(cls):
        cls._request_counter = 0
