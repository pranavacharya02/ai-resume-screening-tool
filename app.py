from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os
from PyPDF2 import PdfReader

app = Flask(__name__)

def extract_text_from_pdf(file_path: str) -> str:
    text = ""
    try:
        with open(file_path, 'rb') as f:
            reader = PdfReader(f)
            for page in reader.pages:
                txt = page.extract_text() or ""
                text += txt + "\n"
    except Exception as e:
        text += f" [ERROR_READING_{os.path.basename(file_path)}: {e}] "
    return text

@app.route('/analyze', methods=['POST'])
def analyze_resumes():
    data = request.get_json(force=True)
    job_desc = (data or {}).get('jobDesc', '').strip()
    file_paths = (data or {}).get('files', [])

    if not job_desc or not file_paths:
        return jsonify({'error': 'jobDesc and files are required.'}), 400

    # Extract texts
    resume_texts = []
    for p in file_paths:
        resume_texts.append(extract_text_from_pdf(p))

    # TF-IDF on [job] + resumes
    docs = [job_desc] + resume_texts
    vectorizer = TfidfVectorizer(stop_words='english', max_features=20000)
    tfidf = vectorizer.fit_transform(docs)
    sims = cosine_similarity(tfidf[0:1], tfidf[1:]).flatten()

    results = [
        {'file': os.path.basename(file_paths[i]), 'score': float(sims[i])}
        for i in range(len(file_paths))
    ]
    results.sort(key=lambda x: x['score'], reverse=True)

    return jsonify({'ranked_resumes': results})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)