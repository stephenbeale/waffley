const STORAGE_KEY = 'chores_data';

const DEFAULT_CHORES = [
  { name: 'Vacuum the house', intervalDays: 7 },
  { name: 'Clean toilet', intervalDays: 7 },
  { name: 'Clean shower', intervalDays: 7 },
  { name: 'Wipe kitchen', intervalDays: 3 },
  { name: 'Dusting', intervalDays: 14 },
];

// --- Data layer ---

function loadChores() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw);
  // First run: seed defaults with dueDate = today
  const today = todayStr();
  const seeded = DEFAULT_CHORES.map(c => ({
    id: crypto.randomUUID(),
    name: c.name,
    intervalDays: c.intervalDays,
    dueDate: today,
    completedDates: [],
  }));
  saveChores(seeded);
  return seeded;
}

function saveChores(chores) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chores));
}

// --- Helpers ---

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function daysUntil(dateStr) {
  const today = new Date(todayStr());
  const target = new Date(dateStr);
  return Math.round((target - today) / 86400000);
}

function addDays(dateStr, n) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function formatRelative(dateStr) {
  const diff = daysUntil(dateStr);
  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  if (diff === 0) return 'Due today';
  if (diff === 1) return 'Due tomorrow';
  return `Due in ${diff}d`;
}

function statusClass(dateStr) {
  const diff = daysUntil(dateStr);
  if (diff < 0) return 'overdue';
  if (diff === 0) return 'today';
  return 'upcoming';
}

// --- Rendering ---

const listEl = document.getElementById('chore-list');
const dialog = document.getElementById('chore-dialog');
const form = document.getElementById('chore-form');
const dialogTitle = document.getElementById('dialog-title');
const nameInput = document.getElementById('chore-name');
const intervalInput = document.getElementById('chore-interval');
const addBtn = document.getElementById('add-btn');
const cancelBtn = document.getElementById('dialog-cancel');

let chores = loadChores();
let editingId = null;

function render() {
  // Sort: overdue first, then today, then by due date ascending
  const sorted = [...chores].sort((a, b) => {
    const da = daysUntil(a.dueDate);
    const db = daysUntil(b.dueDate);
    return da - db;
  });

  if (sorted.length === 0) {
    listEl.innerHTML = '';
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'No chores yet. Tap + to add one.';
    listEl.appendChild(empty);
    return;
  }

  listEl.innerHTML = '';
  sorted.forEach(chore => {
    const card = document.createElement('div');
    card.className = 'chore-card';
    card.dataset.id = chore.id;

    const status = statusClass(chore.dueDate);

    const checkBtn = document.createElement('button');
    checkBtn.className = 'chore-check';
    checkBtn.textContent = '✓';
    checkBtn.title = 'Mark done';
    checkBtn.addEventListener('click', () => completeChore(chore.id));

    const info = document.createElement('div');
    info.className = 'chore-info';

    const nameRow = document.createElement('div');
    nameRow.className = 'chore-name';
    nameRow.textContent = chore.name;

    const badge = document.createElement('span');
    badge.className = `status-badge status-${status}`;
    badge.textContent = status === 'overdue' ? 'Overdue' : status === 'today' ? 'Today' : '';

    if (badge.textContent) nameRow.appendChild(badge);

    const meta = document.createElement('div');
    meta.className = 'chore-meta';
    meta.textContent = `${formatRelative(chore.dueDate)} · Every ${chore.intervalDays}d`;

    info.appendChild(nameRow);
    info.appendChild(meta);

    const actions = document.createElement('div');
    actions.className = 'chore-actions';

    const editBtn = document.createElement('button');
    editBtn.textContent = '✎';
    editBtn.title = 'Edit';
    editBtn.addEventListener('click', () => openEdit(chore.id));

    const delBtn = document.createElement('button');
    delBtn.textContent = '✕';
    delBtn.title = 'Delete';
    delBtn.addEventListener('click', () => deleteChore(chore.id));

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    card.appendChild(checkBtn);
    card.appendChild(info);
    card.appendChild(actions);
    listEl.appendChild(card);
  });
}

// --- Actions ---

function completeChore(id) {
  const chore = chores.find(c => c.id === id);
  if (!chore) return;

  // Animate
  const card = listEl.querySelector(`[data-id="${id}"]`);
  if (card) card.classList.add('completing');

  setTimeout(() => {
    const today = todayStr();
    chore.completedDates.push(today);
    chore.dueDate = addDays(today, chore.intervalDays);
    saveChores(chores);
    render();
  }, 300);
}

function deleteChore(id) {
  chores = chores.filter(c => c.id !== id);
  saveChores(chores);
  render();
}

function openEdit(id) {
  const chore = chores.find(c => c.id === id);
  if (!chore) return;
  editingId = id;
  dialogTitle.textContent = 'Edit Chore';
  nameInput.value = chore.name;
  intervalInput.value = chore.intervalDays;
  dialog.showModal();
  nameInput.focus();
}

function openAdd() {
  editingId = null;
  dialogTitle.textContent = 'Add Chore';
  nameInput.value = '';
  intervalInput.value = 7;
  dialog.showModal();
  nameInput.focus();
}

// --- Events ---

addBtn.addEventListener('click', openAdd);
cancelBtn.addEventListener('click', () => dialog.close());

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const interval = parseInt(intervalInput.value, 10);
  if (!name || interval < 1) return;

  if (editingId) {
    const chore = chores.find(c => c.id === editingId);
    if (chore) {
      chore.name = name;
      chore.intervalDays = interval;
    }
  } else {
    chores.push({
      id: crypto.randomUUID(),
      name,
      intervalDays: interval,
      dueDate: todayStr(),
      completedDates: [],
    });
  }

  saveChores(chores);
  dialog.close();
  render();
});

// Close dialog on backdrop click
dialog.addEventListener('click', (e) => {
  if (e.target === dialog) dialog.close();
});

// --- Init ---
render();
