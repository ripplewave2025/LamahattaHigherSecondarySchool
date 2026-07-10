// Generic JSON list storage in Vercel Blob (used for notices and inquiries).
// For notices, PDFs are stored as separate public blobs; we only keep their URLs in the index.
import { list, put, del } from "@vercel/blob";

function getIndexPath(type) {
  return `${type}/index.json`;
}

async function readList(type) {
  const INDEX_PATH = getIndexPath(type);
  try {
    const { blobs } = await list({ prefix: INDEX_PATH, limit: 1 });
    const found = blobs.find((b) => b.pathname === INDEX_PATH);
    if (!found) return [];
    const res = await fetch(found.url, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeList(type, items) {
  const INDEX_PATH = getIndexPath(type);
  await put(INDEX_PATH, JSON.stringify(items), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
}

// Backwards-compatible notice helpers (used by existing notices API)
export async function readNotices() {
  return readList("notices");
}

export async function writeNotices(notices) {
  return writeList("notices", notices);
}

export async function deleteBlob(url) {
  try {
    await del(url);
  } catch {
    /* ignore — the metadata removal is what matters */
  }
}

// New: inquiries (public submissions from contact form)
export async function readInquiries() {
  return readList("inquiries");
}

export async function writeInquiries(inquiries) {
  return writeList("inquiries", inquiries);
}
