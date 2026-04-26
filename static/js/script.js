const STORAGE_KEY = 'expencetracker_bills';

// ── Icon helpers ───────────────────────────────────────────────────────────────
const SVG = (d) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">${d}</svg>`;

const categoryIcons = {
  wohnen:       SVG('<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'),
  lebensmittel: SVG('<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>'),
  transport:    SVG('<rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>'),
  gesundheit:   SVG('<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>'),
  freizeit:     SVG('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>'),
  technik:      SVG('<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>'),
  sonstiges:    SVG('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>'),
};

const categoryColors = {
  wohnen: '#00c896', lebensmittel: '#34d399', transport: '#2dd4bf',
  gesundheit: '#6ee7b7', freizeit: '#10b981', technik: '#5eead4', sonstiges: '#059669',
};

// ── State ──────────────────────────────────────────────────────────────────────
let bills        = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let sortBy       = 'date';
let currentFile  = null;
let currentTotal = 0;

// ── IndexedDB (receipt storage) ────────────────────────────────────────────────
const DB_NAME  = 'expencetracker_db';
const DB_STORE = 'receipts';

let _db = null;
function getDB() {
  if (_db) return Promise.resolve(_db);
  return new Promise((res, rej) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (e) => e.target.result.createObjectStore(DB_STORE, { keyPath: 'id' });
    req.onsuccess = (e) => { _db = e.target.result; res(_db); };
    req.onerror   = (e) => rej(e.target.error);
  });
}
async function dbSave(id, file) {
  const db = await getDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(DB_STORE, 'readwrite');
    tx.objectStore(DB_STORE).put({ id, file });
    tx.oncomplete = res; tx.onerror = rej;
  });
}
async function dbGet(id) {
  const db = await getDB();
  return new Promise((res, rej) => {
    const tx  = db.transaction(DB_STORE, 'readonly');
    const req = tx.objectStore(DB_STORE).get(id);
    req.onsuccess = () => res(req.result?.file ?? null);
    req.onerror   = rej;
  });
}
async function dbDelete(id) {
  const db = await getDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(DB_STORE, 'readwrite');
    tx.objectStore(DB_STORE).delete(id);
    tx.oncomplete = res; tx.onerror = rej;
  });
}

// DB beim Start vorab öffnen damit der erste Speichervorgang sofort geht
getDB().catch(() => {});

// ── DOM refs ───────────────────────────────────────────────────────────────────
const form               = document.getElementById('billForm');
const nameInput          = document.getElementById('billName');
const amountInput        = document.getElementById('billAmount');
const catInput           = document.getElementById('billCategory');
const dateInput          = document.getElementById('billDate');
const list               = document.getElementById('billList');
const emptyState         = document.getElementById('emptyState');
const countBadge         = document.getElementById('billCount');
const totalEl            = document.getElementById('totalAmount');
const searchInput        = document.getElementById('searchInput');
const toast              = document.getElementById('toast');
const submitBtn          = form.querySelector('.btn-primary');
const headerCount        = document.getElementById('headerCount');
const headerTotal        = document.getElementById('headerTotal');
const btnExport          = document.getElementById('btnExport');
const btnClearAll        = document.getElementById('btnClearAll');
const sortBtns           = document.querySelectorAll('.btn-sort');
const themeToggle        = document.getElementById('themeToggle');
const uploadZone         = document.getElementById('uploadZone');
const receiptInput       = document.getElementById('receiptInput');
const uploadPreview      = document.getElementById('uploadPreview');
const uploadFileName     = document.getElementById('uploadFileName');
const uploadRemove       = document.getElementById('uploadRemove');
const uploadPreviewVisual = document.getElementById('uploadPreviewVisual');
const paymentModal       = document.getElementById('paymentModal');
const paymentBackdrop    = document.getElementById('paymentBackdrop');
const paymentModalClose  = document.getElementById('paymentModalClose');
const paymentModalTitle  = document.getElementById('paymentModalTitle');
const paymentBillInfo    = document.getElementById('paymentBillInfo');
const payOptFull         = document.getElementById('payOptFull');
const payOptPartial      = document.getElementById('payOptPartial');
const paymentPartialWrap = document.getElementById('paymentPartialWrap');
const paymentPaidInput   = document.getElementById('paymentPaidInput');
const paymentRemaining   = document.getElementById('paymentRemaining');
const paymentSaveBtn     = document.getElementById('paymentSaveBtn');
const receiptModal       = document.getElementById('receiptModal');
const receiptBackdrop    = document.getElementById('receiptBackdrop');
const receiptModalClose  = document.getElementById('receiptModalClose');
const receiptModalTitle  = document.getElementById('receiptModalTitle');
const receiptModalBody   = document.getElementById('receiptModalBody');

// ── Theme ──────────────────────────────────────────────────────────────────────
(function initTheme() {
  document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') ?? 'dark');
})();

themeToggle.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ── Init ───────────────────────────────────────────────────────────────────────
dateInput.value = new Date().toISOString().split('T')[0];
syncCategoryColor();
addRipple(submitBtn);
render();
registerSW();

// ── Sort ───────────────────────────────────────────────────────────────────────
sortBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    sortBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    sortBy = btn.dataset.sort;
    render();
  });
});

// ── Category color ─────────────────────────────────────────────────────────────
catInput.addEventListener('change', syncCategoryColor);
function syncCategoryColor() {
  catInput.style.setProperty('--cat-color', categoryColors[catInput.value] ?? '#00c896');
}

// ── Upload zone ────────────────────────────────────────────────────────────────
uploadZone.addEventListener('click', (e) => {
  if (e.target === receiptInput) return;
  receiptInput.click();
});
uploadZone.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); receiptInput.click(); }
});
uploadZone.addEventListener('dragover',  (e) => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
uploadZone.addEventListener('dragleave', ()  => uploadZone.classList.remove('drag-over'));
uploadZone.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadZone.classList.remove('drag-over');
  if (e.dataTransfer.files[0]) applyFile(e.dataTransfer.files[0]);
});
receiptInput.addEventListener('change', () => {
  if (receiptInput.files[0]) applyFile(receiptInput.files[0]);
});
uploadRemove.addEventListener('click', clearFile);

function applyFile(file) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
  if (!allowed.includes(file.type)) { showToast('Nur JPG, PNG oder PDF erlaubt.', 'warn'); return; }

  currentFile = file;
  uploadFileName.textContent = file.name;

  if (file.type.startsWith('image/')) {
    const url = URL.createObjectURL(file);
    uploadPreviewVisual.innerHTML = `<img src="${url}" class="upload-preview-thumb" alt="Vorschau">`;
  } else {
    uploadPreviewVisual.innerHTML = `<div class="upload-preview-icon">${SVG('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>')}</div>`;
  }

  uploadZone.style.display = 'none';
  uploadPreview.classList.add('visible');
}

function clearFile() {
  currentFile = null;
  receiptInput.value = '';
  uploadPreviewVisual.innerHTML = '';
  uploadPreview.classList.remove('visible');
  uploadZone.style.display = '';
}

// ── Form submit ────────────────────────────────────────────────────────────────
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name   = nameInput.value.trim();
  const amount = parseFloat(amountInput.value);
  if (!name || isNaN(amount) || amount < 0) {
    shake(form);
    showToast('Bitte Name und gueltigen Betrag eingeben.', 'warn');
    return;
  }

  let receiptId = null;
  if (currentFile) {
    receiptId = crypto.randomUUID();
    await dbSave(receiptId, currentFile);
  }

  bills.unshift({
    id: crypto.randomUUID(), name, amount,
    category: catInput.value,
    date: dateInput.value || new Date().toISOString().split('T')[0],
    receiptId,
  });

  save();
  render();
  form.reset();
  dateInput.value = new Date().toISOString().split('T')[0];
  syncCategoryColor();
  clearFile();
  showToast('Ausgabe gespeichert');
});

// ── Search ─────────────────────────────────────────────────────────────────────
searchInput.addEventListener('input', () => {
  const q = searchInput.value.toLowerCase();
  list.querySelectorAll('.bill-item').forEach((item) => {
    item.classList.toggle('hidden', !item.dataset.name.toLowerCase().includes(q));
  });
});

// ── List click delegation (delete + receipt) ───────────────────────────────────
list.addEventListener('click', (e) => {
  const delBtn = e.target.closest('.bill-delete');
  if (delBtn) {
    const li = delBtn.closest('.bill-item');
    li.classList.add('removing');
    li.addEventListener('animationend', async () => {
      const bill = bills.find((b) => b.id === delBtn.dataset.id);
      if (bill?.receiptId) await dbDelete(bill.receiptId);
      bills = bills.filter((b) => b.id !== delBtn.dataset.id);
      save(); render();
      showToast('Ausgabe geloescht.', 'danger');
    }, { once: true });
    return;
  }

  const payBtn = e.target.closest('.bill-pay');
  if (payBtn) { openPaymentModal(payBtn.dataset.id); return; }

  const recBtn = e.target.closest('.bill-receipt');
  if (recBtn) openReceipt(recBtn.dataset.receipt, recBtn.dataset.name);
});

// ── Render ─────────────────────────────────────────────────────────────────────
function render() {
  const sum = bills.reduce((s, b) => s + b.amount, 0);
  emptyState.style.display = bills.length ? 'none' : 'flex';
  countBadge.textContent   = bills.length;
  headerCount.textContent  = bills.length;
  headerTotal.textContent  = fmt(sum);
  animateTotal(sum);

  list.querySelectorAll('.bill-item').forEach((el) => el.remove());

  [...bills]
    .sort((a, b) => {
      if (sortBy === 'amount') return b.amount - a.amount;
      if (sortBy === 'name')   return a.name.localeCompare(b.name, 'de');
      return b.date.localeCompare(a.date);
    })
    .forEach((b) => {
      const color     = categoryColors[b.category] ?? '#059669';
      const payStatus = b.paymentStatus ?? 'unpaid';
      const payBadge  = payStatus === 'full'
        ? `<span class="pay-badge pay-badge--full">Bezahlt</span>`
        : payStatus === 'partial'
          ? `<span class="pay-badge pay-badge--partial">Noch ${fmt(b.amount - (b.paidAmount ?? 0))}</span>`
          : '';

      const li    = document.createElement('li');
      li.className    = 'bill-item';
      li.dataset.name = b.name;
      li.style.setProperty('--item-accent', color);
      li.innerHTML = `
        <div class="bill-icon">${categoryIcons[b.category] ?? categoryIcons.sonstiges}</div>
        <div class="bill-info">
          <div class="bill-name">${escHtml(b.name)}</div>
          <div class="bill-meta">
            <span>${escHtml(b.category)}</span>
            <span class="bill-meta-dot"></span>
            <span>${formatDate(b.date)}</span>
            ${payBadge ? `<span class="bill-meta-dot"></span>${payBadge}` : ''}
          </div>
        </div>
        <span class="bill-amount">${fmt(b.amount)}</span>
        <button class="bill-pay" data-id="${b.id}" aria-label="Zahlung bearbeiten">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        ${b.receiptId ? `
          <button class="bill-receipt" data-receipt="${b.receiptId}" data-name="${escHtml(b.name)}" aria-label="Beleg anzeigen">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
          </button>` : ''}
        <button class="bill-delete" data-id="${b.id}" aria-label="Loeschen">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" width="13" height="13">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      `;
      list.appendChild(li);
    });

  renderSpendingBars();
}

// ── Payment modal ──────────────────────────────────────────────────────────────
let paymentTargetId = null;

function openPaymentModal(id) {
  const bill = bills.find((b) => b.id === id);
  if (!bill) return;
  paymentTargetId = id;
  paymentModalTitle.textContent = bill.name;
  paymentBillInfo.textContent   = `Gesamtbetrag: ${fmt(bill.amount)}`;

  const status = bill.paymentStatus ?? 'unpaid';
  payOptFull.checked    = status === 'full';
  payOptPartial.checked = status !== 'full';

  paymentPaidInput.value = (status === 'partial' && bill.paidAmount != null)
    ? bill.paidAmount.toFixed(2) : '';

  paymentPartialWrap.style.display = status !== 'full' ? 'block' : 'none';
  updatePaymentRemaining(bill.amount);

  paymentModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePaymentModal() {
  paymentModal.classList.remove('open');
  document.body.style.overflow = '';
  paymentTargetId = null;
}

function updatePaymentRemaining(total) {
  const paid = parseFloat(paymentPaidInput.value) || 0;
  paymentRemaining.textContent = fmt(Math.max(0, total - paid));
}

paymentModalClose.addEventListener('click', closePaymentModal);
paymentBackdrop.addEventListener('click', closePaymentModal);

[payOptFull, payOptPartial].forEach((radio) => {
  radio.addEventListener('change', () => {
    paymentPartialWrap.style.display = payOptPartial.checked ? 'block' : 'none';
  });
});

paymentPaidInput.addEventListener('input', () => {
  const bill = bills.find((b) => b.id === paymentTargetId);
  if (bill) updatePaymentRemaining(bill.amount);
});

paymentSaveBtn.addEventListener('click', () => {
  const bill = bills.find((b) => b.id === paymentTargetId);
  if (!bill) return;

  if (payOptFull.checked) {
    bill.paymentStatus = 'full';
    bill.paidAmount    = bill.amount;
  } else {
    const paid = parseFloat(paymentPaidInput.value);
    if (isNaN(paid) || paid < 0) {
      shake(paymentPaidInput);
      showToast('Bitte einen gültigen Betrag eingeben.', 'warn');
      return;
    }
    bill.paymentStatus = paid >= bill.amount ? 'full' : 'partial';
    bill.paidAmount    = paid;
  }

  save(); render();
  closePaymentModal();
  showToast('Zahlungsstatus aktualisiert.');
});

// ── Receipt modal ──────────────────────────────────────────────────────────────
async function openReceipt(receiptId, name) {
  const file = await dbGet(receiptId);
  if (!file) { showToast('Beleg nicht gefunden.', 'warn'); return; }

  receiptModalTitle.textContent = name;
  receiptModalBody.innerHTML    = '';
  const url = URL.createObjectURL(file);

  receiptModalBody.innerHTML = file.type === 'application/pdf'
    ? `<iframe src="${url}" title="Beleg PDF"></iframe>`
    : `<img src="${url}" alt="Beleg">`;

  receiptModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  receiptModal._cleanup = () => URL.revokeObjectURL(url);
}

function closeReceiptModal() {
  receiptModal.classList.remove('open');
  document.body.style.overflow = '';
  receiptModalBody.innerHTML   = '';
  receiptModal._cleanup?.(); receiptModal._cleanup = null;
}

receiptModalClose.addEventListener('click', closeReceiptModal);
receiptBackdrop.addEventListener('click', closeReceiptModal);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeReceiptModal(); });

// ── Export CSV ─────────────────────────────────────────────────────────────────
btnExport.addEventListener('click', () => {
  if (!bills.length) { showToast('Keine Daten zum Exportieren.', 'warn'); return; }
  const rows = [['Name', 'Betrag (EUR)', 'Kategorie', 'Datum', 'Beleg']];
  bills.forEach((b) => rows.push([
    `"${b.name.replace(/"/g, '""')}"`,
    b.amount.toFixed(2).replace('.', ','),
    b.category, formatDate(b.date),
    b.receiptId ? 'Ja' : 'Nein',
  ]));
  const link = Object.assign(document.createElement('a'), {
    href:     'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(rows.map((r) => r.join(';')).join('\n')),
    download: `ausgaben_${new Date().toISOString().split('T')[0]}.csv`,
  });
  link.click();
  showToast('CSV exportiert');
});

// ── Clear all ──────────────────────────────────────────────────────────────────
btnClearAll.addEventListener('click', async () => {
  if (!bills.length) { showToast('Keine Ausgaben vorhanden.', 'warn'); return; }
  if (!confirm(`Alle ${bills.length} Ausgaben wirklich loeschen?`)) return;
  await Promise.all(bills.filter((b) => b.receiptId).map((b) => dbDelete(b.receiptId)));
  bills = []; save(); render();
  showToast('Alle Ausgaben geloescht.', 'danger');
});

// ── Spending bars ──────────────────────────────────────────────────────────────
function renderSpendingBars() {
  document.getElementById('spendingBars')?.remove();
  document.getElementById('barsDivider')?.remove();
  if (!bills.length) return;

  const totals = {};
  bills.forEach((b) => { totals[b.category] = (totals[b.category] ?? 0) + b.amount; });
  const max = Math.max(...Object.values(totals));

  const sec = document.querySelector('.section-total');
  sec.appendChild(Object.assign(document.createElement('div'), { id: 'barsDivider', className: 'bars-divider' }));
  const wrap = Object.assign(document.createElement('div'), { id: 'spendingBars', className: 'spending-bar-wrap' });

  Object.entries(totals).sort((a, b) => b[1] - a[1]).forEach(([cat, val]) => {
    const color = categoryColors[cat] ?? '#059669';
    const row   = document.createElement('div');
    row.className = 'spending-bar-row';
    row.innerHTML = `
      <span class="spending-bar-label">${escHtml(cat)}</span>
      <div class="spending-bar-track">
        <div class="spending-bar-fill" style="--item-accent:${color}" data-pct="${(val/max)*100}"></div>
      </div>
      <span class="spending-bar-value">${fmt(val)}</span>
    `;
    wrap.appendChild(row);
  });

  sec.appendChild(wrap);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    wrap.querySelectorAll('.spending-bar-fill').forEach((el) => { el.style.width = el.dataset.pct + '%'; });
  }));
}

// ── Count-up ───────────────────────────────────────────────────────────────────
function animateTotal(target) {
  const start = currentTotal, diff = target - start, dur = 480, t0 = performance.now();
  totalEl.classList.remove('total-pop');
  requestAnimationFrame(function step(now) {
    const p = Math.min((now - t0) / dur, 1);
    totalEl.textContent = fmt(start + diff * easeOut(p));
    if (p < 1) { requestAnimationFrame(step); } else {
      currentTotal = target;
      void totalEl.offsetWidth;
      totalEl.classList.add('total-pop');
    }
  });
}
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

// ── Ripple ─────────────────────────────────────────────────────────────────────
function addRipple(btn) {
  btn.addEventListener('click', (e) => {
    const r  = btn.getBoundingClientRect();
    const sz = Math.max(r.width, r.height);
    const el = Object.assign(document.createElement('span'), { className: 'ripple' });
    el.style.cssText = `width:${sz}px;height:${sz}px;left:${e.clientX-r.left-sz/2}px;top:${e.clientY-r.top-sz/2}px`;
    btn.appendChild(el);
    el.addEventListener('animationend', () => el.remove(), { once: true });
  });
}

// ── Shake ──────────────────────────────────────────────────────────────────────
function shake(el) {
  el.classList.remove('shake');
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('shake')));
  el.addEventListener('animationend', () => el.classList.remove('shake'), { once: true });
}

// ── Toast ──────────────────────────────────────────────────────────────────────
const ICON_CHECK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>`;
const ICON_TRASH = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>`;
const ICON_WARN  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;

let toastTimer;
function showToast(msg, type = 'success') {
  const icon = type === 'danger' ? ICON_TRASH : type === 'warn' ? ICON_WARN : ICON_CHECK;
  toast.innerHTML = `${icon}<span>${msg}</span>`;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmt(val) {
  return '\u20AC\u202F' + val.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(bills)); }
function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}

// ── Service Worker ─────────────────────────────────────────────────────────────
function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/static/js/sw.js').catch(() => {});
  }
}
