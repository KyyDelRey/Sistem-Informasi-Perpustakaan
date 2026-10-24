// DATA STORAGE KEYS
const BOOKS_STORAGE_KEY = "pustaka_books_data_v1";
const LOANS_STORAGE_KEY = "pustaka_loans_data_v1";

// INITIAL MOCK DATA
const INITIAL_BOOKS = [
  {
    id: "1",
    code: "BK-001",
    title: "Laskar Pelangi",
    author: "Andrea Hirata",
    category: "Fiksi",
    stock: 4,
  },
  {
    id: "2",
    code: "BK-002",
    title: "Filosofi Teras",
    author: "Henry Manampiring",
    category: "Pengembangan Diri",
    stock: 2,
  },
  {
    id: "3",
    code: "BK-003",
    title: "Atomic Habits",
    author: "James Clear",
    category: "Pengembangan Diri",
    stock: 5,
  },
  {
    id: "4",
    code: "BK-004",
    title: "Bumi",
    author: "Tere Liye",
    category: "Fiksi",
    stock: 1,
  },
  {
    id: "5",
    code: "BK-005",
    title: "Sejarah Dunia Disembunyikan",
    author: "Jonathan Black",
    category: "Sejarah",
    stock: 3,
  },
  {
    id: "6",
    code: "BK-006",
    title: "Pemrograman Web Modern",
    author: "Rian Utama",
    category: "Teknologi",
    stock: 6,
  },
];

// Format dates helper YYYY-MM-DD
const todayStr = new Date().toISOString().split("T")[0];
const nextWeekDate = new Date();
nextWeekDate.setDate(nextWeekDate.getDate() + 7);
const nextWeekStr = nextWeekDate.toISOString().split("T")[0];

const pastDate = new Date();
pastDate.setDate(pastDate.getDate() - 10);
const pastDateStr = pastDate.toISOString().split("T")[0];

const pastDue = new Date();
pastDue.setDate(pastDue.getDate() - 3);
const pastDueStr = pastDue.toISOString().split("T")[0];

const INITIAL_LOANS = [
  {
    id: "101",
    bookId: "2",
    bookTitle: "Filosofi Teras",
    borrower: "Siti Rahma",
    loanDate: pastDateStr,
    dueDate: pastDueStr,
    returnDate: null,
    status: "Terlambat",
  },
  {
    id: "102",
    bookId: "1",
    bookTitle: "Laskar Pelangi",
    borrower: "Budi Santoso",
    loanDate: todayStr,
    dueDate: nextWeekStr,
    returnDate: null,
    status: "Sedang Dipinjam",
  },
  {
    id: "103",
    bookId: "4",
    bookTitle: "Bumi",
    borrower: "Anisa Putri",
    loanDate: "2026-10-01",
    dueDate: "2026-10-08",
    returnDate: "2026-10-07",
    status: "Dikembalikan",
  },
];

// APP STATE
let books = [];
let loans = [];

// INIT APP
window.addEventListener("DOMContentLoaded", () => {
  loadData();
  updateOverdueStatuses();
  renderDashboard();
  renderBooks();
  renderLoans();
  setDefaultLoanDates();
});

// LOAD DATA FROM LOCALSTORAGE
function loadData() {
  const storedBooks = localStorage.getItem(BOOKS_STORAGE_KEY);
  const storedLoans = localStorage.getItem(LOANS_STORAGE_KEY);

  if (storedBooks) {
    books = JSON.parse(storedBooks);
  } else {
    books = [...INITIAL_BOOKS];
    saveBooks();
  }

  if (storedLoans) {
    loans = JSON.parse(storedLoans);
  } else {
    loans = [...INITIAL_LOANS];
    saveLoans();
  }
}

function saveBooks() {
  localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(books));
}

function saveLoans() {
  localStorage.setItem(LOANS_STORAGE_KEY, JSON.stringify(loans));
}

// UPDATE OVERDUE LOANS AUTOMATICALLY
function updateOverdueStatuses() {
  const today = new Date().toISOString().split("T")[0];
  let changed = false;

  loans.forEach((loan) => {
    if (loan.status === "Sedang Dipinjam" && loan.dueDate < today) {
      loan.status = "Terlambat";
      changed = true;
    }
  });

  if (changed) saveLoans();
}

// TOAST NOTIFICATION HELPER
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");

  const bgClass =
    type === "success"
      ? "bg-emerald-500"
      : type === "error"
        ? "bg-rose-500"
        : "bg-indigo-500";
  const icon =
    type === "success"
      ? "fa-circle-check"
      : type === "error"
        ? "fa-circle-xmark"
        : "fa-circle-info";

  toast.className = `${bgClass} text-white px-4 py-3 rounded-2xl shadow-lg text-sm font-medium flex items-center justify-between gap-3 pointer-events-auto transform transition-all duration-300 translate-x-10 opacity-0`;
  toast.innerHTML = `
                <div class="flex items-center gap-2">
                    <i class="fa-solid ${icon}"></i>
                    <span>${message}</span>
                </div>
                <button onclick="this.parentElement.remove()" class="text-white/80 hover:text-white"><i class="fa-solid fa-xmark text-xs"></i></button>
            `;

  container.appendChild(toast);

  // Animate In
  setTimeout(() => {
    toast.classList.remove("translate-x-10", "opacity-0");
  }, 50);

  // Auto Remove
  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-x-10");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// TAB NAVIGATION SYSTEM
function switchTab(tabName) {
  // Hide all tab contents
  document
    .querySelectorAll(".tab-content")
    .forEach((el) => el.classList.add("hidden"));

  // Show selected
  document.getElementById(`tab-content-${tabName}`).classList.remove("hidden");

  // Desktop Buttons Styling
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.remove("bg-white", "text-indigo-600", "shadow-sm");
    btn.classList.add("text-slate-600");
  });
  const activeNav = document.getElementById(`nav-${tabName}`);
  if (activeNav) {
    activeNav.classList.add("bg-white", "text-indigo-600", "shadow-sm");
    activeNav.classList.remove("text-slate-600");
  }

  // Mobile Navigation Styling
  document.querySelectorAll(".mobile-nav-btn").forEach((btn) => {
    btn.classList.remove("text-indigo-600");
    btn.classList.add("text-slate-400");
  });
  const activeMobileNav = document.getElementById(`mobile-nav-${tabName}`);
  if (activeMobileNav) {
    activeMobileNav.classList.add("text-indigo-600");
    activeMobileNav.classList.remove("text-slate-400");
  }

  // Refresh view data if switching
  if (tabName === "dashboard") renderDashboard();
  if (tabName === "books") renderBooks();
  if (tabName === "loans") renderLoans();
}

// ================= RENDER FUNCTIONS =================

// 1. DASHBOARD RENDER
function renderDashboard() {
  // Stats
  const totalTitles = books.length;
  const totalStock = books.reduce((acc, b) => acc + parseInt(b.stock || 0), 0);
  const activeLoans = loans.filter(
    (l) => l.status === "Sedang Dipinjam" || l.status === "Terlambat",
  ).length;
  const overdueLoans = loans.filter((l) => l.status === "Terlambat").length;

  document.getElementById("stat-total-titles").innerText = totalTitles;
  document.getElementById("stat-total-stock").innerText = totalStock;
  document.getElementById("stat-active-loans").innerText = activeLoans;
  document.getElementById("stat-overdue-loans").innerText = overdueLoans;

  // Recent Loans (top 5)
  const recentBody = document.getElementById("dashboard-recent-loans-body");
  recentBody.innerHTML = "";

  const sortedLoans = [...loans].reverse().slice(0, 5);

  if (sortedLoans.length === 0) {
    recentBody.innerHTML = `<tr><td colspan="4" class="py-4 text-center text-slate-400 text-xs">Belum ada aktivitas peminjaman.</td></tr>`;
  } else {
    sortedLoans.forEach((loan) => {
      let badgeColor = "bg-blue-100 text-blue-700";
      if (loan.status === "Terlambat") badgeColor = "bg-rose-100 text-rose-700";
      if (loan.status === "Dikembalikan")
        badgeColor = "bg-emerald-100 text-emerald-700";

      recentBody.innerHTML += `
                  <tr class="hover:bg-slate-50/50 transition">
                      <td class="py-3 px-2 font-semibold text-slate-800">${escapeHtml(loan.borrower)}</td>
                      <td class="py-3 px-2 text-slate-600">${escapeHtml(loan.bookTitle)}</td>
                      <td class="py-3 px-2 text-slate-500 text-xs">${loan.dueDate}</td>
                      <td class="py-3 px-2">
                          <span class="px-2.5 py-1 rounded-full text-[11px] font-bold ${badgeColor}">${loan.status}</span>
                      </td>
                  </tr>
              `;
    });
  }

  // Category Distribution
  const catCounts = {};
  books.forEach((b) => {
    catCounts[b.category] = (catCounts[b.category] || 0) + 1;
  });

  const catContainer = document.getElementById("category-distribution-list");
  catContainer.innerHTML = "";

  const categories = Object.keys(catCounts);
  if (categories.length === 0) {
    catContainer.innerHTML = `<p class="text-xs text-slate-400">Belum ada data kategori.</p>`;
  } else {
    categories.forEach((cat) => {
      const count = catCounts[cat];
      const percent = Math.round((count / (totalTitles || 1)) * 100);
      catContainer.innerHTML += `
                  <div>
                      <div class="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                          <span>${cat}</span>
                          <span>${count} Judul (${percent}%)</span>
                      </div>
                      <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div class="h-full bg-gradient-to-r from-indigo-400 to-rose-400 rounded-full" style="width: ${percent}%"></div>
                      </div>
                  </div>
              `;
    });
  }
}

// 2. BOOKS RENDER
function renderBooks() {
  const grid = document.getElementById("books-grid");
  const emptyState = document.getElementById("books-empty-state");
  const searchVal = document
    .getElementById("book-search-input")
    .value.toLowerCase();
  const catVal = document.getElementById("book-category-filter").value;

  grid.innerHTML = "";

  const filtered = books.filter((b) => {
    const matchSearch =
      b.title.toLowerCase().includes(searchVal) ||
      b.author.toLowerCase().includes(searchVal) ||
      (b.code && b.code.toLowerCase().includes(searchVal));
    const matchCat = catVal === "" || b.category === catVal;
    return matchSearch && matchCat;
  });

  if (filtered.length === 0) {
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
    filtered.forEach((b) => {
      const stockBadge =
        b.stock > 0
          ? `<span class="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full"><i class="fa-solid fa-check text-[10px] mr-1"></i> Stok: ${b.stock}</span>`
          : `<span class="px-2.5 py-1 bg-rose-100 text-rose-600 text-xs font-bold rounded-full"><i class="fa-solid fa-xmark text-[10px] mr-1"></i> Habis</span>`;

      // Generate soft pastel header gradient based on book ID
      const gradients = [
        "from-indigo-200 to-pink-200 text-indigo-700",
        "from-purple-200 to-indigo-200 text-purple-700",
        "from-rose-200 to-amber-200 text-rose-700",
        "from-teal-200 to-indigo-200 text-teal-700",
      ];
      const gradClass =
        gradients[parseInt(b.id) % gradients.length] || gradients[0];

      grid.innerHTML += `
                  <div class="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
                      <div>
                          <!-- Book Cover Decorative Header -->
                          <div class="h-32 bg-gradient-to-tr ${gradClass} p-4 flex flex-col justify-between relative">
                              <span class="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-white/70 backdrop-blur-md rounded-lg self-start shadow-sm">
                                  ${escapeHtml(b.category)}
                              </span>
                              <div class="flex justify-between items-end">
                                  <span class="text-xs font-mono font-semibold opacity-80">${b.code || "NO-ISBN"}</span>
                                  <i class="fa-solid fa-book-bookmark text-3xl opacity-30 transform group-hover:scale-110 transition duration-300"></i>
                              </div>
                          </div>

                          <!-- Book Info -->
                          <div class="p-5">
                              <h3 class="font-bold text-slate-800 text-base line-clamp-1" title="${escapeHtml(b.title)}">${escapeHtml(b.title)}</h3>
                              <p class="text-xs text-slate-400 mt-0.5 mb-4 flex items-center gap-1">
                                  <i class="fa-solid fa-pen-nib text-[10px]"></i> ${escapeHtml(b.author)}
                              </p>
                              <div class="flex items-center justify-between">
                                  ${stockBadge}
                              </div>
                          </div>
                      </div>

                      <!-- Actions -->
                      <div class="px-5 pb-5 pt-2 border-t border-slate-50 flex items-center justify-between gap-2">
                          <button onclick="quickBorrow('${b.id}')" ${b.stock <= 0 ? "disabled" : ""} class="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-40 disabled:cursor-not-allowed text-indigo-600 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1">
                              <i class="fa-solid fa-hand-holding"></i> Pinjam
                          </button>
                          <button onclick="openBookModal('${b.id}')" class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs transition">
                              <i class="fa-solid fa-pen"></i>
                          </button>
                          <button onclick="deleteBook('${b.id}')" class="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-500 flex items-center justify-center text-xs transition">
                              <i class="fa-solid fa-trash"></i>
                          </button>
                      </div>
                  </div>
              `;
    });
  }
}

function filterBooks() {
  renderBooks();
}

// 3. LOANS RENDER
function renderLoans() {
  const tableBody = document.getElementById("loans-table-body");
  const emptyState = document.getElementById("loans-empty-state");
  const searchVal = document
    .getElementById("loan-search-input")
    .value.toLowerCase();
  const statusVal = document.getElementById("loan-status-filter").value;

  tableBody.innerHTML = "";

  const filtered = loans.filter((l) => {
    const matchSearch =
      l.borrower.toLowerCase().includes(searchVal) ||
      l.bookTitle.toLowerCase().includes(searchVal);
    const matchStatus = statusVal === "" || l.status === statusVal;
    return matchSearch && matchStatus;
  });

  if (filtered.length === 0) {
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
    filtered.forEach((loan) => {
      let badgeClass = "bg-blue-100 text-blue-700";
      if (loan.status === "Terlambat")
        badgeClass = "bg-rose-100 text-rose-700 animate-pulse";
      if (loan.status === "Dikembalikan")
        badgeClass = "bg-emerald-100 text-emerald-700";

      const actionBtn =
        loan.status !== "Dikembalikan"
          ? `<button onclick="returnBook('${loan.id}')" class="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl text-xs font-bold transition flex items-center gap-1">
                       <i class="fa-solid fa-rotate-left"></i> Kembalikan
                     </button>`
          : `<span class="text-xs text-slate-400 font-medium">Selesai (${loan.returnDate || "-"})</span>`;

      tableBody.innerHTML += `
                  <tr class="hover:bg-slate-50/60 transition">
                      <td class="py-4 px-6 font-bold text-slate-800">${escapeHtml(loan.borrower)}</td>
                      <td class="py-4 px-6 text-slate-700 font-medium">${escapeHtml(loan.bookTitle)}</td>
                      <td class="py-4 px-6 text-slate-500 text-xs">${loan.loanDate}</td>
                      <td class="py-4 px-6 text-slate-500 text-xs font-semibold">${loan.dueDate}</td>
                      <td class="py-4 px-6">
                          <span class="px-3 py-1 rounded-full text-xs font-bold inline-block ${badgeClass}">
                              ${loan.status}
                          </span>
                      </td>
                      <td class="py-4 px-6 text-center">
                          <div class="flex items-center justify-center gap-2">
                              ${actionBtn}
                              <button onclick="deleteLoan('${loan.id}')" class="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg text-xs transition" title="Hapus Riwayat">
                                  <i class="fa-solid fa-trash"></i>
                              </button>
                          </div>
                      </td>
                  </tr>
              `;
    });
  }
}

function filterLoans() {
  renderLoans();
}

// ================= BOOK MODAL & CRUD ACTIONS =================

function openBookModal(bookId = null) {
  const modal = document.getElementById("modal-book");
  const form = document.getElementById("form-book");
  const titleEl = document.getElementById("modal-book-title");

  form.reset();
  document.getElementById("book-id").value = "";

  if (bookId) {
    const book = books.find((b) => b.id === bookId);
    if (book) {
      titleEl.innerText = "Edit Data Buku";
      document.getElementById("book-id").value = book.id;
      document.getElementById("input-book-title").value = book.title;
      document.getElementById("input-book-code").value = book.code || "";
      document.getElementById("input-book-author").value = book.author;
      document.getElementById("input-book-category").value = book.category;
      document.getElementById("input-book-stock").value = book.stock;
    }
  } else {
    titleEl.innerText = "Tambah Buku Baru";
  }

  modal.classList.remove("hidden");
}

function closeBookModal() {
  document.getElementById("modal-book").classList.add("hidden");
}

function handleBookFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById("book-id").value;
  const title = document.getElementById("input-book-title").value.trim();
  const code =
    document.getElementById("input-book-code").value.trim() ||
    `BK-${Math.floor(100 + Math.random() * 900)}`;
  const author = document.getElementById("input-book-author").value.trim();
  const category = document.getElementById("input-book-category").value;
  const stock =
    parseInt(document.getElementById("input-book-stock").value) || 0;

  if (id) {
    // Edit existing
    const index = books.findIndex((b) => b.id === id);
    if (index !== -1) {
      books[index] = {
        ...books[index],
        title,
        code,
        author,
        category,
        stock,
      };
      showToast("Data buku berhasil diperbarui!", "success");
    }
  } else {
    // Add new
    const newBook = {
      id: Date.now().toString(),
      code,
      title,
      author,
      category,
      stock,
    };
    books.push(newBook);
    showToast("Buku baru berhasil ditambahkan!", "success");
  }

  saveBooks();
  closeBookModal();
  renderBooks();
  renderDashboard();
}

function deleteBook(bookId) {
  // Soft inline confirmation
  const book = books.find((b) => b.id === bookId);
  if (!book) return;

  // Check if active loan exists for this book
  const activeLoanExists = loans.some(
    (l) => l.bookId === bookId && l.status !== "Dikembalikan",
  );
  if (activeLoanExists) {
    showToast("Buku sedang dipinjam! Tidak dapat menghapus.", "error");
    return;
  }

  if (confirm(`Apakah Anda yakin ingin menghapus buku "${book.title}"?`)) {
    books = books.filter((b) => b.id !== bookId);
    saveBooks();
    renderBooks();
    renderDashboard();
    showToast("Buku telah dihapus dari sistem.", "info");
  }
}

// ================= LOAN MODAL & TRANSACTIONS =================

function openLoanModal(preselectedBookId = null) {
  const modal = document.getElementById("modal-loan");
  const selectEl = document.getElementById("input-loan-book");
  document.getElementById("form-loan").reset();
  setDefaultLoanDates();

  // Populate available books (stock > 0)
  selectEl.innerHTML = "";
  const availableBooks = books.filter((b) => b.stock > 0);

  if (availableBooks.length === 0) {
    selectEl.innerHTML = `<option value="">-- Semua Stok Buku Habis --</option>`;
  } else {
    availableBooks.forEach((b) => {
      selectEl.innerHTML += `<option value="${b.id}">${escapeHtml(b.title)} (Sisa: ${b.stock})</option>`;
    });
  }

  if (preselectedBookId) {
    selectEl.value = preselectedBookId;
  }

  modal.classList.remove("hidden");
}

function closeLoanModal() {
  document.getElementById("modal-loan").classList.add("hidden");
}

function setDefaultLoanDates() {
  const today = new Date().toISOString().split("T")[0];
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekStr = nextWeek.toISOString().split("T")[0];

  document.getElementById("input-loan-date").value = today;
  document.getElementById("input-loan-due").value = nextWeekStr;
}

function quickBorrow(bookId) {
  openLoanModal(bookId);
}

function handleLoanFormSubmit(e) {
  e.preventDefault();
  const borrower = document.getElementById("input-loan-borrower").value.trim();
  const bookId = document.getElementById("input-loan-book").value;
  const loanDate = document.getElementById("input-loan-date").value;
  const dueDate = document.getElementById("input-loan-due").value;

  if (!bookId) {
    showToast("Silakan pilih buku yang tersedia!", "error");
    return;
  }

  const bookIndex = books.findIndex((b) => b.id === bookId);
  if (bookIndex === -1 || books[bookIndex].stock <= 0) {
    showToast("Stok buku tidak mencukupi!", "error");
    return;
  }

  // Deduct book stock
  books[bookIndex].stock -= 1;
  saveBooks();

  // Create new loan
  const newLoan = {
    id: Date.now().toString(),
    bookId: books[bookIndex].id,
    bookTitle: books[bookIndex].title,
    borrower,
    loanDate,
    dueDate,
    returnDate: null,
    status: "Sedang Dipinjam",
  };

  loans.unshift(newLoan);
  saveLoans();

  closeLoanModal();
  showToast(`Peminjaman atas nama ${borrower} berhasil dicatat!`, "success");

  renderDashboard();
  renderBooks();
  renderLoans();
}

// RETURN BOOK ACTION
function returnBook(loanId) {
  const loanIndex = loans.findIndex((l) => l.id === loanId);
  if (loanIndex === -1) return;

  const loan = loans[loanIndex];

  // Mark loan returned
  loan.status = "Dikembalikan";
  loan.returnDate = new Date().toISOString().split("T")[0];

  // Restore book stock
  const bookIndex = books.findIndex((b) => b.id === loan.bookId);
  if (bookIndex !== -1) {
    books[bookIndex].stock += 1;
    saveBooks();
  }

  saveLoans();
  showToast(
    `Buku "${loan.bookTitle}" telah dikembalikan! Stok bertambah.`,
    "success",
  );

  renderDashboard();
  renderBooks();
  renderLoans();
}

function deleteLoan(loanId) {
  if (confirm("Hapus riwayat peminjaman ini?")) {
    loans = loans.filter((l) => l.id !== loanId);
    saveLoans();
    renderLoans();
    renderDashboard();
    showToast("Riwayat transaksi dihapus.", "info");
  }
}

// UTILITY: Escape HTML strings
function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>"']/g, function (m) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    }[m];
  });
}
