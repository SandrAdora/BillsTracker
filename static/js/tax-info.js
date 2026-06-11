// ── Theme ──────────────────────────────────────────────────────────────────────
(function initTheme() {
  document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') ?? 'dark');
})();

const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ── Category tabs ──────────────────────────────────────────────────────────────
const tabBtns      = document.querySelectorAll('[data-tax-tab]');
const panels       = document.querySelectorAll('[data-tax-panel]');
const searchInput  = document.getElementById('searchInput');
const items        = document.querySelectorAll('.tax-item');

let currentTab = tabBtns[0]?.dataset.taxTab;

tabBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    tabBtns.forEach((b) => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
    });
    currentTab = btn.dataset.taxTab;
    searchInput.value = '';
    filterItems('');
  });
});

// ── Search across all categories ─────────────────────────────────────────────
searchInput.addEventListener('input', () => {
  filterItems(searchInput.value.trim().toLowerCase());
});

function filterItems(query) {
  if (query) {
    panels.forEach((p) => p.classList.add('active'));
  } else {
    panels.forEach((p) => p.classList.toggle('active', p.dataset.taxPanel === currentTab));
  }

  items.forEach((item) => {
    const match = !query || item.textContent.toLowerCase().includes(query);
    item.classList.toggle('hidden', !match);
  });
}
