// GET /api/inquiries  -> list of contact form submissions (admin only, same auth as notices)
// Useful for school office or future admin UI. Data is also browseable in the Vercel Blob dashboard.
import { isAuthed } from "../server/auth.js";
import { readInquiries } from "../server/blob-store.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!isAuthed(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const inquiries = await readInquiries();
  // newest first
  inquiries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({ inquiries });
}
