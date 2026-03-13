let todos = JSON.parse(localStorage.getItem('focus-todos')) || [];
let filter = 'all';

const quotes = [
  "Small steps every day lead to massive results over time.",
  "You don't have to be great to start, but you have to start to be great.",
  "Focus on progress, not perfection.",
  "Every task you complete is a vote for the person you want to become.",
  "The secret of getting ahead is getting started.",
  "Do something today that your future self will thank you for.",
  "Your only limit is your mind. Break through it.",
  "Discipline is choosing between what you want now and what you want most.",
  "One task at a time. One moment at a time. That's how mountains move.",
  "Done is better than perfect. Ship it.",
  "Momentum is built one checked box at a time.",
  "Be proud of every small win. They add up.",
  "Clarity comes from action, not thought.",
  "You are capable of more than you know.",
  "Today's effort is tomorrow's advantage.",
];

// ── Clock & Greeting ──────────────────────────────────────
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('clock').textContent = `${h}:${m}:${s}`;

  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  document.getElementById('date-display').textContent =
    `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;

  const hr = now.getHours();
  const g = hr < 12 ? 'Good morning ☀️' : hr < 17 ? 'Good afternoon 🌤️' : 'Good evening 🌙';
  document.getElementById('greeting').textContent = g;
}
setInterval(updateClock, 1000);
updateClock();

// ── Quotes ────────────────────────────────────────────────
let lastQuote = -1;
function newQuote() {
  let idx;
  do { idx = Math.floor(Math.random() * quotes.length); } while (idx === lastQuote);
  lastQuote = idx;
  const el = document.getElementById('motivation-text');
  el.style.opacity = 0;
  setTimeout(() => {
    el.textContent = quotes[idx];
    el.style.transition = 'opacity 0.4s';
    el.style.opacity = 1;
  }, 200);
  const icon = document.getElementById('refresh-icon');
  icon.classList.remove('spin');
  void icon.offsetWidth;
  icon.classList.add('spin');
}
newQuote();

// ── Helpers ───────────────────────────────────────────────
function save() { localStorage.setItem('focus-todos', JSON.stringify(todos)); }

function isOverdue(duedate) {
  if (!duedate) return false;
  return new Date(duedate) < new Date(new Date().toDateString());
}

function priorityColor(p) {
  return p === 'high' ? '#e07a5f' : p === 'low' ? '#64b482' : '#f0c060';
}

// ── Render ────────────────────────────────────────────────
function render() {
  const list = document.getElementById('todo-list');
  const empty = document.getElementById('empty-state');

  const visible = todos.filter(t =>
    filter === 'all' ? true :
    filter === 'done' ? t.done : !t.done
  );

  list.innerHTML = '';

  if (visible.length === 0) {
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
    visible.forEach((t) => {
      const realIdx = todos.indexOf(t);
      const overdue = isOverdue(t.duedate) && !t.done;
      const item = document.createElement('div');
      item.className = 'todo-item' + (t.done ? ' done' : '');
      item.style.setProperty('--priority-color', priorityColor(t.priority));
      item.innerHTML = `
        <label class="check-wrap">
          <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleDone(${realIdx}, this)"/>
          <div class="check-box">${t.done ? '✓' : ''}</div>
        </label>
        <div class="todo-info">
          <div class="todo-name">${t.name}</div>
          <div class="todo-meta">
            ${t.duedate ? `<span class="todo-date">📅 ${t.duedate}</span>` : ''}
            <span class="priority-badge priority-${t.priority}">${t.priority}</span>
            ${overdue ? '<span class="todo-due-badge">Overdue</span>' : ''}
          </div>
        </div>
        <button class="del-btn" onclick="removeTodo(${realIdx})" title="Delete">✕</button>
      `;
      list.appendChild(item);
    });
  }

  const total = todos.length;
  const done  = todos.filter(t => t.done).length;
  const left  = total - done;
  const pct   = total ? Math.round((done / total) * 100) : 0;

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-done').textContent  = done;
  document.getElementById('stat-left').textContent  = left;
  document.getElementById('progress-pct').textContent = pct + '%';
  document.getElementById('progress-fill').style.width = pct + '%';
}

// ── Actions ───────────────────────────────────────────────
function addTodo() {
  const name = document.getElementById('todo-input').value.trim();
  const duedate = document.getElementById('date-input').value;
  const priority = document.getElementById('priority-input').value;
  if (!name) {
    const input = document.getElementById('todo-input');
    input.focus();
    input.style.borderColor = 'var(--accent2)';
    setTimeout(() => input.style.borderColor = '', 1000);
    return;
  }
  todos.push({ name, duedate, priority, done: false });
  save();
  document.getElementById('todo-input').value = '';
  render();
}

function removeTodo(i) {
  const el = document.querySelector(`.del-btn[onclick="removeTodo(${i})"]`)?.closest('.todo-item');
  if (el) {
    el.classList.add('removing');
    setTimeout(() => { todos.splice(i, 1); save(); render(); }, 280);
  } else {
    todos.splice(i, 1); save(); render();
  }
}

function toggleDone(i, cb) {
  todos[i].done = cb.checked;
  save();
  if (cb.checked) celebrate(cb);
  render();
}

function setFilter(f, btn) {
  filter = f;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  render();
}

// ── Confetti ──────────────────────────────────────────────
function celebrate(el) {
  const rect = el.getBoundingClientRect();
  const colors = ['#f0c060','#e07a5f','#64b482','#8fc4f5','#c88fff'];
  for (let i = 0; i < 12; i++) {
    setTimeout(() => {
      const dot = document.createElement('div');
      dot.className = 'pop-dot';
      dot.style.left = (rect.left + Math.random() * 40 - 20) + 'px';
      dot.style.top  = (rect.top  + Math.random() * 40 - 20) + 'px';
      dot.style.background = colors[Math.floor(Math.random() * colors.length)];
      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 700);
    }, i * 40);
  }
}

// ── Enter key ─────────────────────────────────────────────
document.getElementById('todo-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') addTodo();
});

// ── Init ──────────────────────────────────────────────────
render();
