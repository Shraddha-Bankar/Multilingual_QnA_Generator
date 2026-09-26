import pytest
from app.models.schemas import QnAPair
from app.services.validator import QnAValidator

def test_validator_filters_invalid_and_duplicates():
    raw_pairs = [
        QnAPair(question="What is Machine Learning?", answer="Machine Learning is a subset of AI."),
        QnAPair(question="What is Machine Learning?", answer="Machine Learning is a subset of AI."), # duplicate
        QnAPair(question="Short?", answer="Short"), # too short
        QnAPair(question="What is Deep Learning?", answer="Deep Learning utilizes multi-layered neural networks."),
        QnAPair(question="What is this?", answer="Document description here."), # generic
    ]

    validated = QnAValidator.validate_and_deduplicate(raw_pairs, target_count=5)
    assert len(validated) == 2
    assert validated[0].question == "What is Machine Learning?"
    assert validated[1].question == "What is Deep Learning?"
    assert validated[0].id == 1
    assert validated[1].id == 2
