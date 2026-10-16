// Library app logic (ready for submission)
// Features: Book constructor with crypto.randomUUID, add/edit/remove, toggleRead,
// localStorage persistence, export/import JSON, accessible dialog, sample books.

const STORAGE_KEY = 'myLibrary.v1';
const myLibrary = [];

// Fallback UUID generator
function generateUUID() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // RFC4122 v4-ish fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Book constructor
function Book({ id = null, title, author, pages = 0, read = false, notes = '' }) {
  this.id = id || generateUUID();
  this.title = title;
  this.author = author;
  this.pages = Number(pages) || 0;
  this.read = !!read;
  this.notes = notes || '';
}

Book.prototype.toggleRead = function () {
  this.read = !this.read;
};

// ----- Storage -----
function saveLibrary() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(myLibrary));
  } catch (err) {
    console.error('Failed to save library', err);
  }
}

function loadLibrary() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return false;
    myLibrary.length = 0;
    arr.forEach(obj => myLibrary.push(new Book(obj)));
    return true;
  } catch (err) {
    console.error('Failed to load library', err);
    return false;
  }
}

// ----- CRUD helpers -----
function addBookToLibrary(title, author, pages, read, notes) {
  const book = new Book({ title, author, pages, read, notes });
  myLibrary.push(book);
  saveLibrary();
  return book;
}

function updateBook(id, fields = {}) {
  const book = myLibrary.find(b => b.id === id);
  if (!book) return null;
  Object.assign(book, {
    title: fields.title ?? book.title,
    author: fields.author ?? book.author,
    pages: fields.pages !== undefined ? Number(fields.pages) || 0 : book.pages,
    read: fields.read !== undefined ? !!fields.read : book.read,
    notes: fields.notes ?? book.notes,
  });
  saveLibrary();
  return book;
}

function removeBook(id) {
  const idx = myLibrary.findIndex(b => b.id === id);
  if (idx === -1) return false;
  myLibrary.splice(idx, 1);
  saveLibrary();
  return true;
}

function findBook(id) {
  return myLibrary.find(b => b.id === id) || null;
}

// ----- DOM & rendering -----
const booksContainer = document.getElementById('booksContainer');
const newBookBtn = document.getElementById('newBookBtn');
const exportBtn = document.getElementById('exportBtn');
const importInput = document.getElementById('importInput');
const clearBtn = document.getElementById('clearBtn');

const bookDialog = document.getElementById('bookDialog');
const bookForm = document.getElementById('bookForm');
const dialogTitle = document.getElementById('dialogTitle');
const bookIdInput = document.getElementById('bookId');
const titleInput = document.getElementById('titleInput');
const authorInput = document.getElementById('authorInput');
const pagesInput = document.getElementById('pagesInput');
const readInput = document.getElementById('readInput');
const notesInput = document.getElementById('notesInput');
const cancelBtn = document.getElementById('cancelBtn');

function escapeHtml(str) {
  if (str == null) return '';
  return String(str).replace(/[&<>"']/g, s => {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return map[s];
  });
}

function renderBookCard(book) {
  return `
    <article class="card" data-id="${book.id}" aria-labelledby="title-${book.id}">
      <h3 id="title-${book.id}">${escapeHtml(book.title)}</h3>
      <p class="meta"><strong>Author:</strong> ${escapeHtml(book.author)}</p>
      <p class="meta"><strong>Pages:</strong> ${String(book.pages)}</p>
      <p class="meta"><strong>Status:</strong> ${book.read ? 'Read' : 'Not read yet'}</p>
      ${book.notes ? `<p class="notes">${escapeHtml(book.notes)}</p>` : ''}
      <div class="actions" role="group" aria-label="Book actions">
        <button class="toggle" data-action="toggle-read" data-id="${book.id}">${book.read ? 'Mark Unread' : 'Mark Read'}</button>
        <button class="edit" data-action="edit" data-id="${book.id}">Edit</button>
        <button class="remove" data-action="remove" data-id="${book.id}">Remove</button>
      </div>
    </article>
  `;
}

function displayBooks() {
  if (myLibrary.length === 0) {
    booksContainer.innerHTML = '<p class="muted">No books yet. Click "New Book" to add one.</p>';
    return;
  }
  booksContainer.innerHTML = myLibrary.map(renderBookCard).join('');
}

// ----- Dialog management -----
function openDialog(mode = 'add', book = null) {
  if (mode === 'add') {
    dialogTitle.textContent = 'Add Book';
    bookIdInput.value = '';
    titleInput.value = '';
    authorInput.value = '';
    pagesInput.value = '';
    readInput.checked = false;
    notesInput.value = '';
    document.getElementById('saveBtn').textContent = 'Add';
  } else if (mode === 'edit' && book) {
    dialogTitle.textContent = 'Edit Book';
    bookIdInput.value = book.id;
    titleInput.value = book.title;
    authorInput.value = book.author;
    pagesInput.value = book.pages;
    readInput.checked = book.read;
    notesInput.value = book.notes || '';
    document.getElementById('saveBtn').textContent = 'Save';
  }
  // show dialog with fallback
  if (typeof bookDialog.showModal === 'function') {
    bookDialog.showModal();
  } else {
    bookDialog.setAttribute('open', '');
  }
  // focus first field
  setTimeout(() => titleInput.focus(), 50);
}

function closeDialog() {
  if (typeof bookDialog.close === 'function') {
    bookDialog.close();
  } else {
    bookDialog.removeAttribute('open');
  }
  bookForm.reset();
}

// ----- Event handlers -----
booksContainer.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const action = btn.dataset.action;
  const id = btn.dataset.id;
  if (!action || !id) return;

  if (action === 'remove') {
    if (confirm('Remove this book from the library?')) {
      removeBook(id);
      displayBooks();
    }
  } else if (action === 'toggle-read') {
    const book = findBook(id);
    if (book) {
      book.toggleRead();
      saveLibrary();
      displayBooks();
    }
  } else if (action === 'edit') {
    const book = findBook(id);
    if (book) openDialog('edit', book);
  }
});

// New Book button opens dialog
newBookBtn.addEventListener('click', () => openDialog('add'));

// Cancel button
cancelBtn.addEventListener('click', () => closeDialog());

// form submit: add or update
bookForm.addEventListener('submit', (e) => {
  // method=dialog would close automatically in some UAs - still prevent default behavior
  e.preventDefault();

  const id = bookIdInput.value;
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const pages = parseInt(pagesInput.value, 10) || 0;
  const read = readInput.checked;
  const notes = notesInput.value.trim();

  if (!title || !author || pages <= 0) {
    // simple inline validation
    alert('Please provide a valid Title, Author and Pages (>=1).');
    return;
  }

  if (id) {
    updateBook(id, { title, author, pages, read, notes });
  } else {
    addBookToLibrary(title, author, pages, read, notes);
  }

  closeDialog();
  displayBooks();
});

// Export
exportBtn.addEventListener('click', () => {
  const data = JSON.stringify(myLibrary, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'library.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

// Import
importInput.addEventListener('change', (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (!Array.isArray(parsed)) throw new Error('Invalid file format');
      // ask user to confirm replacing the library
      if (!confirm('Importing will replace your current library. Continue?')) return;
      myLibrary.length = 0;
      parsed.forEach(obj => myLibrary.push(new Book(obj)));
      saveLibrary();
      displayBooks();
      alert('Import complete.');
    } catch (err) {
      alert('Failed to import file: ' + err.message);
    } finally {
      importInput.value = '';
    }
  };
  reader.readAsText(file);
});

// Clear library
clearBtn.addEventListener('click', () => {
  if (!confirm('Clear the entire library? This cannot be undone.')) return;
  myLibrary.length = 0;
  saveLibrary();
  displayBooks();
});

// Keyboard: close dialog on Esc for older browsers
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && bookDialog.hasAttribute('open')) {
    closeDialog();
  }
});

// ----- Init: load or seed sample books -----
(function init() {
  const ok = loadLibrary();
  if (!ok) {
    // seed sample books for initial view
    addBookToLibrary('The Hobbit', 'J.R.R. Tolkien', 310, true, 'Fantasy classic');
    addBookToLibrary('Eloquent JavaScript', 'Marijn Haverbeke', 472, false, 'JS book');
    addBookToLibrary('Clean Code', 'Robert C. Martin', 464, true, 'Software craftsmanship');
  }
  displayBooks();
})();
