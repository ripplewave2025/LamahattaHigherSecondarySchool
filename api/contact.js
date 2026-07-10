// POST /api/contact  -> submit a public inquiry (stored for school admin review)
// Inquiries are kept in the same Vercel Blob store under "inquiries/index.json"
// (school admin can browse the JSON in the Vercel dashboard Blob UI for now;
//  Supabase integration planned for richer admin workflows)
import crypto from "node:crypto";
import { readInquiries, writeInquiries } from "../server/blob-store.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, phone, message } = req.body || {};

    const cleanName = String(name || "").trim().slice(0, 120);
    const cleanEmail = String(email || "").trim().slice(0, 160);
    const cleanPhone = String(phone || "").trim().slice(0, 40);
    const cleanMessage = String(message || "").trim().slice(0, 2000);

    if (!cleanName || !cleanMessage) {
      return res.status(400).json({ error: "Name and message are required." });
    }

    const inquiry = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      message: cleanMessage,
    };

    const existing = await readInquiries();
    // Keep newest first, cap at 200 entries to avoid unbounded growth
    const updated = [inquiry, ...existing].slice(0, 200);
    await writeInquiries(updated);

    // In production the school office will see these in the Blob store browser
    // or via future Supabase-backed admin UI.
    return res.status(200).json({ ok: true, id: inquiry.id });
  } catch (err) {
    console.error("Contact submission error", err);
    return res.status(500).json({ error: "Could not save inquiry. Please try the email link." });
  }
}
