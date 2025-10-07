const form = document.getElementById('analyzeForm');
const statusDiv = document.getElementById('status');
const table = document.getElementById('resultsTable');
const tbody = table.querySelector('tbody');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusDiv.textContent = 'Uploading and analyzing...';
  table.classList.add('hidden');
  tbody.innerHTML = '';

  const jobDesc = document.getElementById('jobDesc').value.trim();
  const files = document.getElementById('resumes').files;
  if (!jobDesc || !files.length) {
    statusDiv.textContent = 'Please provide job description and at least one PDF.';
    return;
  }

  const formData = new FormData();
  formData.append('jobDesc', jobDesc);
  for (const f of files) {
    formData.append('resumes', f);
  }

  try {
    const res = await fetch('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Server error');
    const data = await res.json();

    statusDiv.textContent = 'Done.';
    const ranked = data.ranked_resumes || [];
    if (ranked.length) {
      table.classList.remove('hidden');
      ranked.forEach((r, idx) => {
        const tr = document.createElement('tr');
        const score = typeof r.score === 'number' ? r.score.toFixed(4) : r.score;
        tr.innerHTML = `<td>${idx + 1}</td><td>${r.file}</td><td>${score}</td>`;
        tbody.appendChild(tr);
      });
    } else {
      statusDiv.textContent = 'No results.';
    }
  } catch (err) {
    console.error(err);
    statusDiv.textContent = 'Failed to analyze. Make sure backend (3000) and AI service (5000) are running.';
  }
});