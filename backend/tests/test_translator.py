import pytest
from app.models.schemas import QnAPair
from app.services.translator import MultilingualTranslator

@pytest.mark.asyncio
async def test_semantic_translation_linear_regression():
    en_pairs = [
        QnAPair(
            id=1,
            question="What is Linear Regression?",
            answer="Linear Regression is a supervised machine learning algorithm used to establish a relationship between input variables and a continuous output variable."
        )
    ]

    hi_pairs = await MultilingualTranslator.translate_qna_pairs(en_pairs, "Hindi")
    mr_pairs = await MultilingualTranslator.translate_qna_pairs(en_pairs, "Marathi")

    assert len(hi_pairs) == 1
    assert len(mr_pairs) == 1

    # Hindi verification
    hi_q = hi_pairs[0].question
    hi_a = hi_pairs[0].answer
    assert "क्या है" in hi_q or "रैखिक प्रतिगमन" in hi_q
    assert "उपयोग" in hi_a or "पर्यवेक्षित" in hi_a or "संबंध" in hi_a
    # Ensure no untranslated English fragments remain
    assert "is a supervised" not in hi_a
    assert "used to establish" not in hi_a
    assert "between input variables" not in hi_a

    # Marathi verification
    mr_q = mr_pairs[0].question
    mr_a = mr_pairs[0].answer
    assert "काय आहे" in mr_q or "म्हणजे काय" in mr_q or "रेखीय प्रतिगमन" in mr_q
    assert "वापर" in mr_a or "पर्यवेक्षित" in mr_a or "संबंध" in mr_a
    assert "is a supervised" not in mr_a
    assert "used to establish" not in mr_a
    assert "between input variables" not in mr_a

@pytest.mark.asyncio
async def test_screenshot_examples_translation():
    en_pairs = [
        QnAPair(id=1, question="Theory Linear Regression", answer="Theory Linear Regression is a supervised machine learning algorithm used to establish a relationship between input variables and a continuous output variable."),
        QnAPair(id=2, question="Theory Logistic Regression", answer="Theory Logistic Regression is a supervised machine learning algorithm used for classification problems."),
        QnAPair(id=3, question="Theory A Decision Tree", answer="Theory A Decision Tree is a supervised machine learning algorithm used for classification and regression."),
        QnAPair(id=4, question="Theory Random Forest", answer="Theory Random Forest is an ensemble learning algorithm that creates multiple Decision Trees and combines their predictions to improve accuracy."),
        QnAPair(id=5, question="For classification, the final output", answer="For classification, the final output is generally selected using majority voting.")
    ]

    hi_pairs = await MultilingualTranslator.translate_qna_pairs(en_pairs, "Hindi")
    mr_pairs = await MultilingualTranslator.translate_qna_pairs(en_pairs, "Marathi")

    # Check Hindi
    for p in hi_pairs:
        assert "is a supervised" not in p.answer
        assert "used for classification" not in p.answer
        assert MultilingualTranslator._is_valid_translation(p.question, p.answer, "Hindi")

    # Check Marathi
    for p in mr_pairs:
        assert "is a supervised" not in p.answer
        assert "used for classification" not in p.answer
        assert MultilingualTranslator._is_valid_translation(p.question, p.answer, "Marathi")
