// GET    /api/notices        -> { notices: [...] }  (public)
// POST   /api/notices        -> add a notice           (admin only)
// DELETE /api/notices?id=...  -> remove a notice + PDF  (admin only)
import crypto from "node:crypto";
import { isAuthed } from "../server/auth.js";
import { readNotices, writeNotices, deleteBlob } from "../server/blob-store.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const notices = await readNotices();
    notices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ notices });
  }

  if (!isAuthed(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "POST") {
    const { title, description, url, fileName } = req.body || {};
    if (!title || !url) {
      return res.status(400).json({ error: "A title and an uploaded file are required." });
    }
    try {
      const notices = await readNotices();
      const notice = {
        id: crypto.randomUUID(),
        title: String(title).slice(0, 200),
        description: String(description || "").slice(0, 1000),
        fileUrl: String(url),
        fileName: String(fileName || "notice.pdf").slice(0, 200),
        createdAt: new Date().toISOString(),
      };
      notices.push(notice);
      await writeNotices(notices);
      return res.status(200).json({ notice });
    } catch (err) {
      console.error("Failed to write notice:", err);
      return res.status(500).json({ error: "Could not save the notice. Check that the Blob store is connected and BLOB_READ_WRITE_TOKEN is available." });
    }
  }

  if (req.method === "DELETE") {
    const id = req.query?.id;
    if (!id) return res.status(400).json({ error: "Missing notice id" });
    const notices = await readNotices();
    const target = notices.find((n) => n.id === id);
    await writeNotices(notices.filter((n) => n.id !== id));
    if (target?.fileUrl) await deleteBlob(target.fileUrl);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
