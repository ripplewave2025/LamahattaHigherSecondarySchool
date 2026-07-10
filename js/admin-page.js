import { upload } from "@vercel/blob/client";

const $ = (id) => document.getElementById(id);

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);
}

function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function openPdfViewer(notice) {
  const isDev = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  let modal = document.getElementById('pdf-viewer-modal');

  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'pdf-viewer-modal';
    modal.className = 'pdf-modal';
    modal.innerHTML = `
      <div class="pdf-backdrop"></div>
      <div class="pdf-content glass-panel">
        <div class="pdf-header">
          <h3 id="pdf-viewer-title"></h3>
          <button class="pdf-close" aria-label="Close">×</button>
        </div>
        <div class="pdf-body" id="pdf-viewer-body">
          <!-- iframe or placeholder injected here -->
        </div>
        <div class="pdf-actions">
          <a id="pdf-viewer-download" class="btn btn-primary" target="_blank" rel="noopener">Download PDF</a>
          <button class="btn btn-secondary pdf-close">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelectorAll('.pdf-close, .pdf-backdrop').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target === modal.querySelector('.pdf-backdrop') || el.classList.contains('pdf-close')) {
          closePdfViewer();
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (modal.classList.contains('is-open') && e.key === 'Escape') {
        closePdfViewer();
      }
    });
  }

  const titleEl = modal.querySelector('#pdf-viewer-title');
  const bodyEl = modal.querySelector('#pdf-viewer-body');
  const downloadEl = modal.querySelector('#pdf-viewer-download');

  titleEl.textContent = notice.title || 'Notice PDF';
  downloadEl.href = notice.url;
  downloadEl.setAttribute('download', (notice.title || 'notice') + '.pdf');

  bodyEl.innerHTML = '';

  const url = notice.url || '';

  if (url.includes('example.com/dev-notice')) {
    // Legacy dev mock from before data: URLs - show explanation
    bodyEl.innerHTML = `
      <div style="padding: 2rem; text-align: center; background: #f8f6f1; color: #555; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <p style="font-size: 1.1rem; margin-bottom: 0.5rem;"><strong>Dev Mode — PDF Preview</strong></p>
        <p style="max-width: 420px; margin-bottom: 1rem;">This was an old dev mock. Re-upload a PDF in the admin now to get a real preview with all pages visible.</p>
        <p style="font-size: 0.9rem; opacity: 0.7;">New uploads use data URLs so the actual PDF pages render in the viewer below (scroll to see all pages).</p>
      </div>
    `;
  } else {
    // Real URL or dev data: URL - embed so user sees all pages visually
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.setAttribute('title', 'PDF Viewer for ' + (notice.title || 'notice'));
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.minHeight = '420px';
    iframe.style.border = 'none';
    iframe.style.background = 'white';
    bodyEl.appendChild(iframe);
  }

  modal.classList.add('is-open');
}

function closePdfViewer() {
  const modal = document.getElementById('pdf-viewer-modal');
  if (modal) {
    modal.classList.remove('is-open');
  }
}

function showView(view) {
  $("loginView").hidden = view !== "login";
  $("dashView").hidden = view !== "dash";
}

async function checkAuth() {
  // Dev convenience: allow full admin UI testing locally without vercel dev
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    return true;
  }
  try {
    const res = await fetch("/api/login", { method: "GET" });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data.authed);
  } catch {
    return false;
  }
}

async function refreshList() {
  const list = $("adminNoticeList");
  list.innerHTML = '<p class="form-status">Loading…</p>';
  let notices = [];

  // Dev mock: use localStorage so you can test the full admin UI without vercel dev
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    try {
      const stored = localStorage.getItem('dev_notices');
      notices = stored ? JSON.parse(stored) : [];
    } catch {}
  } else {
    try {
      const res = await fetch("/api/notices");
      const data = await res.json();
      notices = data.notices || [];
    } catch {
      list.innerHTML = '<p class="form-status">Could not load notices.</p>';
      return;
    }
  }

  if (!notices.length) {
    list.innerHTML = '<p class="form-status">No notices published yet.</p>';
    return;
  }

  list.innerHTML = notices
    .map(
      (n) => `
      <div class="admin-row">
        <div>
          <p class="notice-date">${formatDate(n.createdAt)}</p>
          <h3>${escapeHtml(n.title)}</h3>
          <p>${escapeHtml(n.description || "")}</p>
          <button class="btn btn-secondary pdf-view-btn" style="padding:0.2rem 0.6rem; font-size:0.85rem;" data-title="${escapeHtml(n.title)}" data-dev-id="${escapeHtml(n.id || '')}">View</button>
          <a href="${escapeHtml(n.fileUrl)}" target="_blank" rel="noopener noreferrer" style="font-size:0.85rem; margin-left:0.4rem;">Download ${escapeHtml(n.fileName || "PDF")}</a>
        </div>
        <button class="btn btn-secondary" type="button" data-del="${escapeHtml(n.id)}">Delete</button>
      </div>`
    )
    .join("");

  // Wire PDF viewer buttons in admin list (same modal as public notices)
  list.querySelectorAll('.pdf-view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      let url = btn.dataset.url;
      if (!url && btn.dataset.devId) {
        // lookup from current notices (dev mocks have the data: URL for visuals)
        const devNotice = notices.find(n => String(n.id) === btn.dataset.devId);
        if (devNotice && devNotice.fileUrl) url = devNotice.fileUrl;
      }
      openPdfViewer({
        url: url,
        title: btn.dataset.title
      });
    });
  });

  list.querySelectorAll("[data-del]").forEach((btn) => {
    btn.addEventListener("click", () => removeNotice(btn.dataset.del));
  });
}

async function handleLogin(event) {
  event.preventDefault();
  const status = $("loginStatus");

  // Dev bypass: no real login needed locally
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    status.textContent = "";
    $("adminPassword").value = "";
    showView("dash");
    refreshList();
    return;
  }

  status.textContent = "Signing in…";
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: $("adminUsername").value.trim(),
        password: $("adminPassword").value.trim()
      }),
    });
    if (res.ok) {
      status.textContent = "";
      $("adminPassword").value = "";
      showView("dash");
      refreshList();
    } else {
      const data = await res.json().catch(() => ({}));
      status.textContent = data.error || "Login failed. (Check credentials or backend.)";
    }
  } catch {
    status.textContent = "Network error. Is the backend deployed? (Try `vercel dev` for local API testing)";
  }
}

async function handleLogout() {
  await fetch("/api/login", { method: "DELETE" }).catch(() => {});
  showView("login");
}

async function handlePublish(event) {
  event.preventDefault();
  const status = $("uploadStatus");
  const file = $("pdfFile").files[0];
  const title = $("noticeTitle").value.trim();
  const description = $("noticeDesc").value.trim();

  if (!title) return void (status.textContent = "A title is required.");
  if (!file) return void (status.textContent = "Please choose a PDF file.");
  if (file.type !== "application/pdf") {
    return void (status.textContent = "Only PDF files are allowed.");
  }

  const submit = $("publishBtn");
  submit.disabled = true;
  try {
    let fileUrl, fileName = file.name;

    const isDev = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

    if (isDev) {
      // Dev mock: read the actual file as data URL so the PDF renders visually with all pages in the iframe viewer (even in plain dev)
      status.textContent = "Preparing PDF preview for dev...";
      fileUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Failed to read file for dev preview"));
        reader.readAsDataURL(file);
      });
      status.textContent = "Saving notice… (dev mock with real PDF preview)";
    } else {
      status.textContent = "Uploading PDF…";
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/blob-upload",
      });
      fileUrl = blob.url;
      status.textContent = "Saving notice…";
    }

    if (isDev) {
      // Simulate save directly in dev (no real /api/notices call, which wouldn't work in plain `npm run dev`)
      const current = JSON.parse(localStorage.getItem('dev_notices') || '[]');
      const newNotice = {
        id: 'dev-' + Date.now(),
        title,
        description,
        fileUrl,
        fileName,
        createdAt: new Date().toISOString()
      };
      current.unshift(newNotice);
      localStorage.setItem('dev_notices', JSON.stringify(current));

      status.textContent = "Published ✓ (dev mock)";
      $("uploadForm").reset();
      refreshList();
    } else {
      const res = await fetch("/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, url: fileUrl, fileName }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not save the notice.");
      }

      status.textContent = "Published ✓";
      $("uploadForm").reset();
      refreshList();
    }
  } catch (error) {
    status.textContent = error?.message || "Upload failed.";
  } finally {
    submit.disabled = false;
  }
}

async function removeNotice(id) {
  if (!window.confirm("Delete this notice and its PDF?")) return;

  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    // Dev mock remove
    let current = [];
    try { current = JSON.parse(localStorage.getItem('dev_notices') || '[]'); } catch {}
    current = current.filter(n => n.id !== id);
    localStorage.setItem('dev_notices', JSON.stringify(current));
  } else {
    await fetch("/api/notices?id=" + encodeURIComponent(id), { method: "DELETE" }).catch(() => {});
  }
  refreshList();
}

document.addEventListener("DOMContentLoaded", async () => {
  $("loginForm").addEventListener("submit", handleLogin);
  $("uploadForm").addEventListener("submit", handlePublish);
  $("logoutBtn").addEventListener("click", handleLogout);

  const authed = await checkAuth();
  showView(authed ? "dash" : "login");
  if (authed) refreshList();
});
