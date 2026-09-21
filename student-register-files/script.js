const STORAGE_KEY = 'mark-register-students-v1';

// Fallback data used if students.json can't be fetched
// (this happens when the page is opened directly as a file:// URL
// instead of being served by a local server).
const fallbackStudents = [
  { id: "s1", name: "Priya Sharma", percentage: 92.5 },
  { id: "s2", name: "Arjun Mehta", percentage: 78.2 },
  { id: "s3", name: "Fatima Sheikh", percentage: 88.0 },
  { id: "s4", name: "Rohan Desai", percentage: 61.4 },
  { id: "s5", name: "Ananya Iyer", percentage: 95.8 },
  { id: "s6", name: "Karan Patel", percentage: 45.9 },
  { id: "s7", name: "Sneha Reddy", percentage: 71.3 },
  { id: "s8", name: "Vikram Nair", percentage: 33.6 }
];

let students = [];
let sortKey = 'percentage';
let sortDir = 'desc';
let query = '';

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { console.error('Could not read saved data', e); }
  return null;
}

function saveStudents() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (e) { console.error('Could not save data', e); }
}

async function init() {
  const saved = loadFromLocalStorage();
  if (saved) {
    students = saved;
  } else {
    try {
      const res = await fetch('students.json');
      students = await res.json();
    } catch (e) {
      console.warn('students.json could not be loaded (likely opened via file://). Using built-in sample data instead.');
      students = fallbackStudents;
    }
  }
  render();
}

function gradeFor(pct) {
  if (pct >= 90) return { label: 'A+', color: 'var(--good)' };
  if (pct >= 75) return { label: 'A', color: 'var(--good)' };
  if (pct >= 60) return { label: 'B', color: 'var(--gold)' };
  if (pct >= 40) return { label: 'C', color: 'var(--gold)' };
  return { label: 'D', color: 'var(--bad)' };
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function render() {
  let list = students.filter(s => s.name.toLowerCase().includes(query.trim().toLowerCase()));

  list.sort((a, b) => {
    let cmp;
    if (sortKey === 'name') cmp = a.name.localeCompare(b.name);
    else cmp = a.percentage - b.percentage;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const tbody = document.getElementById('tableBody');
  const emptyState = document.getElementById('emptyState');
  tbody.innerHTML = '';

  if (list.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
    list.forEach((s, idx) => {
      const grade = gradeFor(s.percentage);
      const pctClass = s.percentage >= 60 ? 'good' : (s.percentage < 40 ? 'bad' : '');
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="rank">${idx + 1}</td>
        <td class="name-cell">${escapeHtml(s.name)}</td>
        <td class="pct-cell ${pctClass}">${s.percentage.toFixed(1)}%
          <span class="grade-pill" style="color:${grade.color}">${grade.label}</span>
        </td>
        <td class="del-cell"><button class="del-btn" data-id="${s.id}" title="Remove">✕</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  document.getElementById('countTally').textContent = students.length;

  document.querySelectorAll('.sort-btn').forEach(btn => {
    const key = btn.dataset.sort;
    const arrow = btn.querySelector('.arrow');
    if (key === sortKey) {
      btn.classList.add('active');
      arrow.textContent = sortDir === 'asc' ? '↑' : '↓';
    } else {
      btn.classList.remove('active');
      arrow.textContent = '';
    }
  });
}

document.getElementById('searchInput').addEventListener('input', (e) => {
  query = e.target.value;
  render();
});

document.querySelectorAll('.sort-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.sort;
    if (sortKey === key) {
      sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey = key;
      sortDir = key === 'name' ? 'asc' : 'desc';
    }
    render();
  });
});

const addPanel = document.getElementById('addPanel');
document.getElementById('toggleAdd').addEventListener('click', () => {
  addPanel.classList.toggle('open');
  if (addPanel.classList.contains('open')) document.getElementById('newName').focus();
});

document.getElementById('saveBtn').addEventListener('click', () => {
  const nameInput = document.getElementById('newName');
  const pctInput = document.getElementById('newPct');
  const name = nameInput.value.trim();
  const pct = parseFloat(pctInput.value);

  if (!name) { nameInput.focus(); return; }
  if (isNaN(pct) || pct < 0 || pct > 100) { pctInput.focus(); return; }

  students.push({ id: 's' + Date.now(), name, percentage: pct });
  saveStudents();
  nameInput.value = '';
  pctInput.value = '';
  nameInput.focus();
  render();
});

document.getElementById('newPct').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('saveBtn').click();
});
document.getElementById('newName').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('newPct').focus();
});

document.getElementById('tableBody').addEventListener('click', (e) => {
  const btn = e.target.closest('.del-btn');
  if (!btn) return;
  const id = btn.dataset.id;
  students = students.filter(s => s.id !== id);
  saveStudents();
  render();
});

init();
