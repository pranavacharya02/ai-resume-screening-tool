# 🧠 AI Powered Resume Screening Tool (Basic)

A minimal full-stack project that ranks resumes against a job description using TF-IDF and cosine similarity.

## 🧰 Stack
- Frontend: HTML/CSS/JS (vanilla)
- Backend: Node.js + Express (file upload + proxy to AI)
- AI service: Python + Flask + scikit-learn + PyPDF2
- No database, no Docker (simple to run)

## 📁 Project Structure
```
ai-resume-screening-tool/
├── client/                   # Frontend
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server/                   # Node/Express backend
│   ├── package.json
│   └── server.js
├── ai-service/               # Python/Flask AI microservice
│   ├── app.py
│   └── requirements.txt
├── uploads/                  # temp uploaded PDFs (gitignored)
├── .gitignore
└── README.md
```

## ▶️ How to Run Locally

### 1) Start AI Service (Python)
```bash
cd ai-service
python -m venv venv
# Windows: venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
pip install -r requirements.txt
python app.py
```
This starts Flask on **http://localhost:5000**.

### 2) Start Backend (Node)
Open a **new terminal**:
```bash
cd server
npm install
node server.js
```
This starts Express on **http://localhost:3000**.

### 3) Open Frontend
Just open `client/index.html` in your browser (double-click) **or** serve with a simple static server.

> Make sure both **AI service (port 5000)** and **backend (port 3000)** are running.

## 💡 Notes
- Both the Node and Python services use the shared `../uploads` folder (relative to their directories). Keep the repo structure as-is.
- Supported resume format: **PDF** (via PyPDF2). You can extend to DOCX easily.
- The ranking score is between 0 and 1 (higher = better match).

## 🚀 Next Steps (Optional)
- Swap TF-IDF with sentence embeddings (e.g., `sentence-transformers`).
- Add authentication and a persisted database.
- Add CSV/PDF export of ranked results.
```