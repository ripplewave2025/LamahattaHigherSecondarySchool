// POST   /api/login   -> sign in with username + password (hidden admin access)
// GET    /api/login   -> { authed: boolean } (for the admin UI)
// DELETE /api/login   -> sign out
import crypto from "node:crypto";
import { isAuthed, makeSessionCookie, clearSessionCookie } from "../server/auth.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ authed: isAuthed(req) });
  }

  if (req.method === "DELETE") {
    res.setHeader("Set-Cookie", clearSessionCookie());
    return res.status(200).json({ ok: true });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    return res
      .status(500)
      .json({ error: "Server not configured. Set SESSION_SECRET." });
  }

  const username = String((req.body && req.body.username) || "").trim().toLowerCase();
  const password = String((req.body && req.body.password) || "").trim();

  const expectedUsername = "admin@lamahattahighschool.in";
  const expectedPassword = process.env.ADMIN_PASSWORD || "nopassword";

  if (username !== expectedUsername) {
    await new Promise((r) => setTimeout(r, 600));
    return res.status(401).json({ error: "Incorrect username." });
  }

  const a = Buffer.from(String(password));
  const b = Buffer.from(expectedPassword);
  const ok = a.length === b.length && crypto.timingSafeEqual(a, b);

  if (!ok) {
    // Slow down brute-force attempts.
    await new Promise((r) => setTimeout(r, 600));
    return res.status(401).json({ error: "Incorrect password." });
  }

  res.setHeader("Set-Cookie", makeSessionCookie(secret));
  return res.status(200).json({ ok: true });
}
