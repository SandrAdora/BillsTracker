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
  reisen:       SVG('<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>'),
  shoppen:      SVG('<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>'),
  schenkung:    SVG('<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>'),
  investitionen: SVG('<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><polyline points="2 20 22 20"/>'),
  fahrzeug:      SVG('<path d="M5 16L3 12V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5l-2 4z"/><circle cx="7.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/>'),
  uni:          SVG('<path d="M12 3L2 8h2v9H2v2h20v-2h-2V8h2L12 3zm-4 9H6V9h2v3zm4 0h-2V9h2v3zm4 0h-2V9h2v3z"/>'),
  weiter_bildung: SVG('<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>'),
  versicherung: SVG('<path d="M12 2L3 6v5c0 5.25 3.75 10.15 9 11.35C17.25 21.15 21 16.25 21 11V6L12 2zm0 4l6 2.73V11c0 3.5-2.33 6.79-6 8.2C8.33 17.79 6 14.5 6 11V8.73L12 6z"/>'),
  urlaub: SVG('<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>'),
  spenden: SVG('<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>'),

};

const categoryColors = {
  wohnen: '#00b4c8aa', lebensmittel: '#34d399', transport: '#d42d49',
  gesundheit: '#6e9ee7', freizeit: '#9ab910', technik: '#5eead4', sonstiges: '#059669',
  reisen: '#06b6d4', shoppen: '#a78bfa', schenkung: '#f472b6', investitionen: '#fbbf24',
  fahrzeug: '#f5590b', weiter_bildung: '#87189a53', versicherung: '#c1a43dd5', urlaub: '#86b9e7',
  uni: '#45124e53', spenden: '#3a750f'
  
};

// ── State ──────────────────────────────────────────────────────────────────────
let bills             = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let sortBy            = 'date';
let currentFile       = null;
let currentTotal      = 0;
let activeTab         = 'active';
let editReceiptAction = 'keep';
let editNewFile       = null;

// ── IndexedDB (receipt storage) ────────────────────────────────────────────────
const DB_NAME  = 'expencetracker_db';
const DB_STORE = 'receipts';


// manages connection to an indexdb -> browser database for storing data locally 
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

async function dbGetAll() {
  const db = await getDB();
  return new Promise((res, rej) => {
    const tx  = db.transaction(DB_STORE, 'readonly');
    const req = tx.objectStore(DB_STORE).getAll();
    req.onsuccess = () => res(req.result);
    req.onerror   = rej;
  });
}
async function dbClear() {
  const db = await getDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(DB_STORE, 'readwrite');
    tx.objectStore(DB_STORE).clear();
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
const btnBackupExport    = document.getElementById('btnBackupExport');
const btnBackupImport    = document.getElementById('btnBackupImport');
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
const paidList           = document.getElementById('paidList');
const paidEmptyState     = document.getElementById('paidEmptyState');
const paidCount          = document.getElementById('paidCount');
const tabBtns            = document.querySelectorAll('.tab-btn');
const editBillName       = document.getElementById('editBillName');
const editBillDate       = document.getElementById('editBillDate');
const editBillCategory   = document.getElementById('editBillCategory');
const editReceiptLabel   = document.getElementById('editReceiptLabel');
const editReceiptFile    = document.getElementById('editReceiptFile');
const editReceiptRemove  = document.getElementById('editReceiptRemove');
const taxCount           = document.getElementById('taxCount');
const taxRelevantList    = document.getElementById('taxRelevant');
const taxEmptyState      = document.getElementById('taxEmptyState');

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


// ___ Tax Relevance ____________
// bill hast to be type of category
// bill -> document.getElementByID('billcategory')
function taxRelevant(bill)
{

  let tax_relevant = false;

 
  if(bill === "fahrtkosten" || bill === "gesundheit"  || bill === "technik" ||
    bill === "gebühren" || bill === "weiter_bildung" ||  bill === "uni" ||
    bill === "versicherung" || bill === "zweit Miete" || bill === "spenden" ){
      tax_relevant = true;
    }
    // return if bill is tax relevant 
    return tax_relevant; 

}

// ── Tabs ───────────────────────────────────────────────────────────────────────
tabBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    activeTab = btn.dataset.tab;
    tabBtns.forEach((b) => b.classList.toggle('active', b === btn));
    list.style.display            = activeTab === 'active' ? '' : 'none';
    paidList.style.display        = activeTab === 'paid'   ? '' : 'none';
    taxRelevantList.style.display = activeTab === 'tax'    ? '' : 'none';
  });
});

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
  [list, paidList].forEach((ul) => {
    ul.querySelectorAll('.bill-item').forEach((item) => {
      item.classList.toggle('hidden', !item.dataset.name.toLowerCase().includes(q));
    });
    ul.querySelectorAll('.bill-category-header').forEach((hdr) => {
      let el = hdr.nextElementSibling;
      let anyVisible = false;
      while (el && el.classList.contains('bill-item')) {
        if (!el.classList.contains('hidden')) { anyVisible = true; break; }
        el = el.nextElementSibling;
      }
      hdr.classList.toggle('hidden', !anyVisible);
    });
  });
});

// ── List click delegation ──────────────────────────────────────────────────────
function handleListClick(e) {
  const delBtn = e.target.closest('.bill-delete');
  if (delBtn) {
    const bill = bills.find((b) => b.id === delBtn.dataset.id);
    if (!confirm(`Ausgabe "${bill?.name ?? ''}" wirklich loeschen?`)) return;
    const li = delBtn.closest('.bill-item');
    li.classList.add('removing');
    li.addEventListener('animationend', async () => {
      if (bill?.receiptId) await dbDelete(bill.receiptId);
      bills = bills.filter((b) => b.id !== delBtn.dataset.id);
      save(); render();
      showToast('Ausgabe geloescht.', 'danger');
    }, { once: true });
    return;
  }

  const reactBtn = e.target.closest('.bill-reactivate');
  if (reactBtn) {
    const bill = bills.find((b) => b.id === reactBtn.dataset.id);
    if (!bill) return;
    bill.paymentStatus = 'unpaid';
    bill.paidAmount    = 0;
    save(); render();
    activeTab = 'active';
    tabBtns.forEach((b) => b.classList.toggle('active', b.dataset.tab === 'active'));
    list.style.display     = '';
    paidList.style.display = 'none';
    showToast('Ausgabe reaktiviert.');
    return;
  }

  const payBtn = e.target.closest('.bill-pay');
  if (payBtn) { openPaymentModal(payBtn.dataset.id); return; }

  const recBtn = e.target.closest('.bill-receipt');
  if (recBtn) openReceipt(recBtn.dataset.receipt, recBtn.dataset.name);
}

list.addEventListener('click', handleListClick);
paidList.addEventListener('click', handleListClick);
taxRelevantList.addEventListener('click', handleListClick);

// ── Render ─────────────────────────────────────────────────────────────────────
function render() {
  const activeBills = bills.filter((b) => b.paymentStatus !== 'full');
  const paidBills   = bills.filter((b) => b.paymentStatus === 'full');
  const taxBills    = bills.filter((b) => taxRelevant(b.category));
  const allSum      = bills.reduce((s, b) => s + b.amount, 0);

  emptyState.style.display     = activeBills.length ? 'none' : 'flex';
  paidEmptyState.style.display = paidBills.length   ? 'none' : 'flex';
  taxEmptyState.style.display  = taxBills.length    ? 'none' : 'flex';

  countBadge.textContent       = activeBills.length;
  paidCount.textContent    = paidBills.length;
  taxCount.textContent     = taxBills.length;
  headerCount.textContent  = bills.length;
  headerTotal.textContent  = fmt(allSum);
  animateTotal(allSum);

  list.querySelectorAll('.bill-item, .bill-category-header').forEach((el) => el.remove());
  paidList.querySelectorAll('.bill-item, .bill-category-header').forEach((el) => el.remove());
  taxRelevantList.querySelectorAll('.bill-item, .bill-category-header').forEach((el) => el.remove());

  const sortFn = (a, b) => {
    if (sortBy === 'amount') return b.amount - a.amount;
    if (sortBy === 'name')   return a.name.localeCompare(b.name, 'de');
    return b.date.localeCompare(a.date);
  };

  const editIcon  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
  const recIcon   = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`;
  const delIcon   = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" width="13" height="13"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
  const reactIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>`;

  const renderGrouped = (billsArr, container, isPaid, editable = true) => {
    const groups = {}, order = [];
    [...billsArr].sort(sortFn).forEach((b) => {
      if (!groups[b.category]) { groups[b.category] = []; order.push(b.category); }
      groups[b.category].push(b);
    });
    order.sort((a, b) => groups[b].reduce((s,x) => s + x.amount, 0) - groups[a].reduce((s,x) => s + x.amount, 0));

    order.forEach((cat) => {
      const color = categoryColors[cat] ?? '#059669';
      const hdr   = document.createElement('li');
      hdr.className = 'bill-category-header';
      hdr.innerHTML = `
        <span class="bill-category-header-icon" style="color:${color}">${categoryIcons[cat] ?? categoryIcons.sonstiges}</span>
        <span class="bill-category-header-name">${escHtml(cat)}</span>
        <span class="bill-category-header-count">${groups[cat].length}</span>
      `;
      container.appendChild(hdr);

      groups[cat].forEach((b) => {
        const payBadge = !isPaid && b.paymentStatus === 'partial'
          ? `<span class="bill-meta-dot"></span><span class="pay-badge pay-badge--partial">Noch ${fmt(b.amount - (b.paidAmount ?? 0))}</span>`
          : '';
        const paidBadge = isPaid
          ? `<span class="bill-meta-dot"></span><span class="pay-badge pay-badge--full">Bezahlt</span>`
          : '';

        const li = document.createElement('li');
        li.className    = isPaid ? 'bill-item bill-item--paid' : 'bill-item';
        li.dataset.name = b.name;
        if (!isPaid) li.style.setProperty('--item-accent', color);

        li.innerHTML = `
          <div class="bill-icon">${categoryIcons[b.category] ?? categoryIcons.sonstiges}</div>
          <div class="bill-info">
            <div class="bill-name">${escHtml(b.name)}</div>
            <div class="bill-meta">
              <span>${formatDate(b.date)}</span>
              ${payBadge}${paidBadge}
            </div>
          </div>
          <span class="bill-amount">${fmt(b.amount)}</span>
          ${editable ? `<button class="bill-pay" data-id="${b.id}" aria-label="Bearbeiten">${editIcon}</button>` : ''}
          ${b.receiptId ? `<button class="bill-receipt" data-receipt="${b.receiptId}" data-name="${escHtml(b.name)}" aria-label="Beleg anzeigen">${recIcon}</button>` : ''}
          ${isPaid ? `<button class="bill-reactivate" data-id="${b.id}" aria-label="Reaktivieren">${reactIcon}</button>` : ''}
          ${editable ? `<button class="bill-delete" data-id="${b.id}" aria-label="Loeschen">${delIcon}</button>` : ''}
        `;
        container.appendChild(li);
      });
    });
  };

  renderGrouped(activeBills, list, false);
  renderGrouped(paidBills, paidList, true);
  renderGrouped(taxBills, taxRelevantList, false, false);

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

  editBillName.value     = bill.name;
  editBillDate.value     = bill.date || '';
  editBillCategory.value = bill.category || 'sonstiges';

  editReceiptAction     = 'keep';
  editNewFile           = null;
  editReceiptFile.value = '';
  if (bill.receiptId) {
    editReceiptLabel.textContent    = 'Beleg vorhanden';
    editReceiptRemove.style.display = '';
  } else {
    editReceiptLabel.textContent    = 'Kein Beleg';
    editReceiptRemove.style.display = 'none';
  }

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

// ── Edit modal receipt ─────────────────────────────────────────────────────────
editReceiptFile.addEventListener('change', () => {
  const file = editReceiptFile.files[0];
  if (!file) return;
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
  if (!allowed.includes(file.type)) { showToast('Nur JPG, PNG oder PDF erlaubt.', 'warn'); return; }
  editNewFile               = file;
  editReceiptAction         = 'replace';
  editReceiptLabel.textContent    = file.name;
  editReceiptRemove.style.display = '';
});

editReceiptRemove.addEventListener('click', () => {
  editReceiptAction         = 'remove';
  editNewFile               = null;
  editReceiptFile.value     = '';
  editReceiptLabel.textContent    = 'Kein Beleg';
  editReceiptRemove.style.display = 'none';
});

paymentSaveBtn.addEventListener('click', async () => {
  const bill = bills.find((b) => b.id === paymentTargetId);
  if (!bill) return;

  const newName = editBillName.value.trim();
  if (!newName) { shake(editBillName); showToast('Bitte einen Namen eingeben.', 'warn'); return; }
  bill.name     = newName;
  bill.date     = editBillDate.value || bill.date;
  bill.category = editBillCategory.value;

  if (editReceiptAction === 'remove') {
    if (bill.receiptId) await dbDelete(bill.receiptId);
    bill.receiptId = null;
  } else if (editReceiptAction === 'replace' && editNewFile) {
    if (bill.receiptId) await dbDelete(bill.receiptId);
    const newId = crypto.randomUUID();
    await dbSave(newId, editNewFile);
    bill.receiptId = newId;
  }

  if (payOptFull.checked) {
    bill.paymentStatus = 'full';
    bill.paidAmount    = bill.amount;
  } else {
    const raw = paymentPaidInput.value.trim();
    if (raw !== '') {
      const paid = parseFloat(raw);
      if (isNaN(paid) || paid < 0) {
        shake(paymentPaidInput);
        showToast('Bitte einen gültigen Betrag eingeben.', 'warn');
        return;
      }
      bill.paymentStatus = paid >= bill.amount ? 'full' : 'partial';
      bill.paidAmount    = paid;
    } else {
      bill.paymentStatus = 'partial';
    }
  }

  save(); render();
  closePaymentModal();

  if (bill.paymentStatus === 'full') {
    activeTab = 'paid';
    tabBtns.forEach((b) => b.classList.toggle('active', b.dataset.tab === 'paid'));
    list.style.display     = 'none';
    paidList.style.display = '';
    showToast('Rechnung als beglichen markiert.');
  } else {
    showToast('Ausgabe aktualisiert.');
  }
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
  const rows = [['Name', 'Betrag (EUR)', 'Kategorie', 'Datum', 'Beleg', "Steuerlich Absetzbar"]];
  bills.forEach((b) => rows.push([
    `"${b.name.replace(/"/g, '""')}"`,
    b.amount.toFixed(2).replace('.', ','),
    b.category, formatDate(b.date),
    b.receiptId ? 'Ja' : 'Nein',
    taxRelevant(b.category) ? 'Ja' : 'Nein',
  ]));
  const csvContent = '\uFEFF' + rows.map((r) => r.join(';')).join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement('a'), {
    href:     url,
    download: `ausgaben_${new Date().toISOString().split('T')[0]}.csv`,
  });
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast('CSV exportiert');
});

// ── Backup Export (JSON + Belege) ──────────────────────────────────────────────
btnBackupExport.addEventListener('click', async () => {
  if (!bills.length) { showToast('Keine Daten zum Sichern.', 'warn'); return; }
  showToast('Backup wird erstellt…', 'info');
  const receipts = await dbGetAll();
  const receiptMap = {};
  await Promise.all(receipts.map(async (r) => {
    if (r.file instanceof Blob || r.file instanceof File) {
      receiptMap[r.id] = await new Promise((res) => {
        const reader = new FileReader();
        reader.onload = () => res({ dataUrl: reader.result, name: r.file.name, type: r.file.type });
        reader.readAsDataURL(r.file);
      });
    }
  }));
  const backup = { version: 1, date: new Date().toISOString(), bills, receipts: receiptMap };
  const link = Object.assign(document.createElement('a'), {
    href:     'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup)),
    download: `ausgaben_backup_${new Date().toISOString().split('T')[0]}.json`,
  });
  link.click();
  showToast('Backup exportiert');
});

// ── Backup Import (JSON wiederherstellen) ──────────────────────────────────────
btnBackupImport.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  e.target.value = '';
  const text = await file.text();
  let backup;
  try { backup = JSON.parse(text); } catch { showToast('Ungültige Backup-Datei.', 'danger'); return; }
  if (!backup.bills || !Array.isArray(backup.bills)) { showToast('Ungültiges Backup-Format.', 'danger'); return; }
  if (!confirm(`Backup vom ${formatDate(backup.date?.split('T')[0] ?? '')} mit ${backup.bills.length} Ausgaben wiederherstellen?\n\nDie vorhandenen Daten werden dabei überschrieben.`)) return;
  await dbClear();
  if (backup.receipts) {
    await Promise.all(Object.entries(backup.receipts).map(([id, r]) =>
      fetch(r.dataUrl).then((res) => res.blob()).then((blob) => {
        const f = new File([blob], r.name, { type: r.type });
        return dbSave(id, f);
      })
    ));
  }
  bills = backup.bills;
  save();
  render();
  showToast(`${bills.length} Ausgaben wiederhergestellt`);
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
