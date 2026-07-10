// Minimal, dependency-free session auth for the single-admin notice panel.
// A session is an HMAC-signed token stored in an httpOnly cookie.
import crypto from "node:crypto";

const COOKIE = "lhss_session";
const DEFAULT_MAX_AGE = 60 * 60 * 8; // 8 hours

// Cookies must be Secure in production; locally (vercel dev over http) they must
// not be, or the browser will silently drop them.
function isProd() {
  return process.env.VERCEL_ENV === "production" || process.env.VERCEL_ENV === "preview";
}

export function sign(value, secret) {
  const mac = crypto.createHmac("sha256", secret).update(value).digest("base64url");
  return `${value}.${mac}`;
}

export function verify(token, secret) {
  if (!token || !secret) return null;
  const idx = token.lastIndexOf(".");
  if (idx < 0) return null;
  const value = token.slice(0, idx);
  const mac = token.slice(idx + 1);
  const expected = crypto.createHmac("sha256", secret).update(value).digest("base64url");
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  const [role, expStr] = value.split(":");
  const exp = Number(expStr);
  if (!exp || Date.now() > exp) return null;
  return { role };
}

export function parseCookies(req) {
  const header = req.headers?.cookie || "";
  const out = {};
  header.split(";").forEach((part) => {
    const i = part.indexOf("=");
    if (i < 0) return;
    const key = part.slice(0, i).trim();
    if (key) out[key] = decodeURIComponent(part.slice(i + 1).trim());
  });
  return out;
}

export function isAuthed(req) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;
  return Boolean(verify(parseCookies(req)[COOKIE], secret));
}

function serializeCookie(name, value, maxAge) {
  let str = `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Strict`;
  if (isProd()) str += "; Secure";
  if (typeof maxAge === "number") str += `; Max-Age=${maxAge}`;
  return str;
}

export function makeSessionCookie(secret, maxAge = DEFAULT_MAX_AGE) {
  const exp = Date.now() + maxAge * 1000;
  return serializeCookie(COOKIE, sign(`admin:${exp}`, secret), maxAge);
}

export function clearSessionCookie() {
  return serializeCookie(COOKIE, "", 0);
}
