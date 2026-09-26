import httpx
import time
import sys

sys.stdout.reconfigure(encoding='utf-8')

def test_full_flow():
    with open('sample_inputs/Machine_Learning_Fundamentals.txt', 'rb') as f:
        r = httpx.post('http://127.0.0.1:8000/api/upload', files={'file': ('Machine_Learning_Fundamentals.txt', f, 'text/plain')})
        job_id = r.json()['job_id']
    
    httpx.post('http://127.0.0.1:8000/api/generate', json={'job_id': job_id, 'num_questions': 3, 'difficulty': 'Mixed'})
    time.sleep(5)
    
    res = httpx.get(f'http://127.0.0.1:8000/api/results/{job_id}').json()
    
    print("\n--- 🇬🇧 ENGLISH Q&A ---")
    for i, p in enumerate(res['english']):
        print(f"{i+1}. Q: {p['question']}\n   A: {p['answer']}")
        
    print("\n--- 🇮🇳 HINDI Q&A (Full Sentence Semantic Translation) ---")
    for i, p in enumerate(res['hindi']):
        print(f"{i+1}. Q: {p['question']}\n   A: {p['answer']}")
        
    print("\n--- 🇮🇳 MARATHI Q&A (Full Sentence Semantic Translation) ---")
    for i, p in enumerate(res['marathi']):
        print(f"{i+1}. Q: {p['question']}\n   A: {p['answer']}")

if __name__ == "__main__":
    test_full_flow()
