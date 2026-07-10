// Renders live notices from the backend onto the public Notices page.
// If the backend isn't configured/reachable, the static sample notices in the
// HTML are left untouched, so the page always shows something.
import { refreshIcons } from "./main.js";

const ICONS = ["megaphone", "calendar-days", "file-text", "trophy", "bell"];

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
  return d.toLocaleString(undefined, { dateStyle: "long", timeStyle: "short" });
}

function downloadLabel() {
  return document.documentElement.lang === "ne" ? "PDF डाउनलोड" : "Download PDF";
}

function updateDynamicLabels() {
  const list = document.getElementById("noticeList");
  if (!list) return;
  list.querySelectorAll("a.btn.btn-secondary").forEach((a) => {
    if (a.getAttribute("href") && a.getAttribute("href") !== "#") {
      a.textContent = downloadLabel();
    }
  });
}

function renderNotice(notice, index) {
  const icon = ICONS[index % ICONS.length];
  const safeTitle = escapeHtml(notice.title);
  const safeDesc = escapeHtml(notice.description || '');
  let buttonAttrs = `data-title="${safeTitle}" data-desc="${safeDesc}"`;
  const fileUrl = notice.fileUrl || '';
  if (fileUrl && !fileUrl.startsWith('data:')) {
    buttonAttrs += ` data-url="${escapeHtml(fileUrl)}"`;
  } else if (notice.id) {
    buttonAttrs += ` data-dev-id="${escapeHtml(notice.id)}"`;
  }
  return `
    <article class="notice-card glass-panel">
      <span class="notice-icon"><i data-lucide="${icon}" width="22"></i></span>
      <div class="notice-body">
        <p class="notice-date">${escapeHtml(formatDate(notice.createdAt))}</p>
        <h3>${safeTitle}</h3>
        ${notice.description ? `<p>${safeDesc}</p>` : ""}
      </div>
      <button class="btn btn-secondary pdf-view-btn" ${buttonAttrs}>View PDF</button>
    </article>`;
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

    // wire close
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

  // clear previous
  bodyEl.innerHTML = '';

  const url = notice.url || '';

  if (url.includes('example.com/dev-notice')) {
    // Legacy dev mock - show explanation (new uploads use data: URLs for real visuals)
    bodyEl.innerHTML = `
      <div style="padding: 2rem; text-align: center; background: #f8f6f1; color: #555; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <p style="font-size: 1.1rem; margin-bottom: 0.5rem;"><strong>Dev Mode — PDF Preview</strong></p>
        <p style="max-width: 420px; margin-bottom: 1rem;">This was an old dev mock URL. Re-upload the PDF via the admin panel now — new dev uploads embed the actual PDF so you can scroll and see all pages visually right here.</p>
        <p style="font-size: 0.9rem; opacity: 0.7;">The iframe below will show the real multi-page PDF content (browser viewer) for fresh uploads.</p>
      </div>
    `;
  } else {
    // Real prod URL or current dev data: URL — embed for visual page viewing + download option
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
  document.body.classList.add('nav-open'); // reuse existing style if any
}

function closePdfViewer() {
  const modal = document.getElementById('pdf-viewer-modal');
  if (modal) {
    modal.classList.remove('is-open');
    document.body.classList.remove('nav-open');
  }
}

async function loadNotices() {
  const list = document.getElementById("noticeList");
  const note = document.getElementById("noticesNote");
  if (!list) return;

  const isDev = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

  let notices = [];
  if (isDev) {
    // In plain `npm run dev`, use the same localStorage mock that the admin panel writes to.
    // This lets you test end-to-end notice publishing without `vercel dev`.
    try {
      const stored = localStorage.getItem('dev_notices');
      notices = stored ? JSON.parse(stored) : [];
    } catch {}
  } else {
    try {
      const res = await fetch("/api/notices");
      if (!res.ok) return; // keep static fallback
      const data = await res.json();
      notices = data.notices || [];
    } catch {
      return; // backend not configured yet — keep static fallback
    }
  }

  if (!notices.length) return; // nothing published yet — keep static fallback

  list.innerHTML = notices.map(renderNotice).join("");

  // Wire the new "View PDF" buttons to open the inline multi-page viewer modal
  list.querySelectorAll('.pdf-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      let url = btn.dataset.url;
      if (!url && btn.dataset.devId) {
        // lookup full dev mock (including data: URL for actual PDF visuals) from the current notices array
        const devNotice = notices.find(n => String(n.id) === btn.dataset.devId);
        if (devNotice && devNotice.fileUrl) url = devNotice.fileUrl;
      }
      openPdfViewer({
        url: url,
        title: btn.dataset.title,
        description: btn.dataset.desc
      });
    });
  });

  if (note) note.hidden = true; // real PDFs exist now; hide the "being uploaded" note
  refreshIcons();
  // ensure labels match current lang (in case toggle happens later)
  updateDynamicLabels();
}

document.addEventListener("DOMContentLoaded", loadNotices);

// Keep dynamic download labels in sync if user toggles language after initial load.
document.addEventListener("click", (e) => {
  if (e.target.closest && e.target.closest(".switch-lang")) {
    // Defer to after main.js has updated the document lang + static i18n
    setTimeout(updateDynamicLabels, 10);
  }
});
