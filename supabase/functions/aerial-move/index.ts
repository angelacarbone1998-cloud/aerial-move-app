import webpush from "npm:web-push@3.6.7";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const APP_URL = "https://angelacarbone1998-cloud.github.io/aerial-move-app/";
const PUBLISHABLE_KEY = JSON.parse(Deno.env.get("SUPABASE_PUBLISHABLE_KEYS") || "{}").default;
const SECRET_KEY = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}").default;
const ROLE_EMAILS = {
  atlete: "angelacarbobe1998@gmail.com",
  istruttrici: "aerialmove26@gmail.com",
};
const INSTRUCTOR_NAMES = ["MARTINA", "ITALIA", "ANGELA", "ROSALINDA", "DEBORA", "PHILOMENA", "ROBERTO", "ANDREA"];
const COURSE_ACTIVITIES = ["Ginnastica acrobatica", "Tessuto aereo", "Cerchio aereo agonista", "Lollipop", "Cerchio aereo non agonista", "Cerchio aereo agonista + Move Lab", "Cerchio aereo non agonista + Move Lab", "Mini Move", "Amaca aerea baby", "Amaca aerea relax", "Pole Dance", "Bungee Fly", "Pilates Base", "Pilates Plus", "Surf Pilates", "Hip Hop"];
const SESSION_COOKIE = "am_session";
const SESSION_SECONDS = 60 * 60 * 12;
const REMEMBERED_SESSION_SECONDS = 60 * 60 * 24 * 90;
// Dal 9 novembre 2026, la prima lezione Pilates di ogni nuova atleta è una prova e non consuma il pacchetto.
const PILATES_TRIAL_START_DATE = "2026-11-09";
const ALLOWED_ORIGINS = new Set(["https://angelacarbone1998-cloud.github.io"]);
const APP_ICON_BASE64 = "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";

function appIconResponse() {
  const binary = atob(APP_ICON_BASE64);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new Response(bytes, {
    headers: {
      "content-type": "image/png",
      "cache-control": "public, max-age=31536000, immutable",
      "access-control-allow-origin": "*",
      "x-content-type-options": "nosniff",
    },
  });
}

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      ...extraHeaders,
    },
  });
}

function cookieValue(request, name) {
  const cookies = request.headers.get("cookie") || "";
  for (const item of cookies.split(";")) {
    const [key, ...value] = item.trim().split("=");
    if (key === name) return decodeURIComponent(value.join("="));
  }
  return "";
}

function randomToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
}

async function hashToken(token) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), (value) => value.toString(16).padStart(2, "0")).join("");
}

class ServerRequestError extends Error {
  status: number;
  code: string;
  databaseMessage: string;

  constructor(status, body) {
    super(`Server request failed: ${status}`);
    this.name = "ServerRequestError";
    this.status = status;
    this.code = typeof body?.code === "string" ? body.code : "";
    this.databaseMessage = typeof body?.message === "string" ? body.message : "";
  }
}

function pilatesBookingError(error) {
  const reason = error instanceof ServerRequestError ? error.databaseMessage.toLocaleLowerCase("it") : "";
  if (reason.includes("prenotazione già presente") || reason.includes("prenotazione è già presente")) {
    return json({ error: "La prenotazione per questo turno è già confermata. Controlla Le mie prenotazioni.", code: "ALREADY_BOOKED" }, 409);
  }
  if (reason.includes("turno precedente non può più essere modificato")) return json({ error: "Non puoi cambiare il turno precedente a meno di tre ore dall’inizio.", code: "CHANGE_CLOSED" }, 409);
  if (reason.includes("turno completo")) return json({ error: "Questo turno ha esaurito i posti. Scegli un altro orario.", code: "SLOT_FULL" }, 409);
  if (reason.includes("due ore")) return json({ error: "Le prenotazioni per questo turno sono chiuse: mancano meno di due ore all’inizio.", code: "BOOKING_CLOSED" }, 409);
  if (reason.includes("data passata")) return json({ error: "Non è possibile prenotare una data passata.", code: "PAST_DATE" }, 409);
  if (reason.includes("non disponibile")) return json({ error: "Questo turno non è più disponibile. Aggiorna l’elenco dei turni.", code: "SLOT_UNAVAILABLE" }, 404);
  console.error("Pilates booking request failed", { status: error?.status, code: error?.code });
  return json({ error: "Non è stato possibile verificare la prenotazione. Controlla Le mie prenotazioni prima di riprovare.", code: "BOOKING_FAILED" }, 503);
}

async function serverFetch(path, options = {}) {
  const headers = new Headers(options.headers);
  headers.set("apikey", SECRET_KEY);
  headers.set("content-type", "application/json");
  const response = await fetch(SUPABASE_URL + path, { ...options, headers });
  const text = await response.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!response.ok) throw new ServerRequestError(response.status, body);
  return body;
}

let vapidCache = null;

async function vapidDetails() {
  if (vapidCache) return vapidCache;
  const rows = await serverFetch("/rest/v1/app_private_secrets?secret_key=in.(vapid_public_key,vapid_private_key)&select=secret_key,secret_value");
  const values = Object.fromEntries((rows || []).map((row) => [row.secret_key, row.secret_value]));
  if (!values.vapid_public_key || !values.vapid_private_key) throw new Error("Push configuration missing");
  vapidCache = {
    subject: "mailto:aerialmove26@gmail.com",
    publicKey: values.vapid_public_key,
    privateKey: values.vapid_private_key,
  };
  return vapidCache;
}

function normalizedList(values, allowedValues) {
  if (!Array.isArray(values)) return [];
  const allowed = new Map(allowedValues.map((value) => [value.toLocaleLowerCase("it"), value]));
  return [...new Set(values.map((value) => allowed.get(String(value || "").trim().toLocaleLowerCase("it"))).filter(Boolean))];
}

function csvList(value) {
  return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
}

async function sendPushNotification(notification, target = { role: "atlete" }) {
  const role = target.role === "istruttrici" ? "istruttrici" : "atlete";
  let subscriptions = await serverFetch(`/rest/v1/push_subscriptions?role=eq.${role}&select=id,endpoint,p256dh,auth,instructor_names,activities&limit=5000`);
  if (role === "istruttrici") {
    const targetNames = normalizedList(target.instructorNames, INSTRUCTOR_NAMES).map((value) => value.toLocaleLowerCase("it"));
    const targetActivities = normalizedList(target.activities, COURSE_ACTIVITIES).map((value) => value.toLocaleLowerCase("it"));
    subscriptions = subscriptions.filter((subscription) => {
      const names = (subscription.instructor_names || []).map((value) => String(value).toLocaleLowerCase("it"));
      const activities = (subscription.activities || []).map((value) => String(value).toLocaleLowerCase("it"));
      if (!targetNames.length && !targetActivities.length) return true;
      return targetNames.some((value) => names.includes(value)) || targetActivities.some((value) => activities.includes(value));
    });
  }
  if (!subscriptions.length) return { sent: 0, failed: 0 };
  const vapid = await vapidDetails();
  const payload = JSON.stringify(notification);
  const results = await Promise.all(subscriptions.map(async (subscription) => {
    try {
      await webpush.sendNotification({ endpoint: subscription.endpoint, keys: { p256dh: subscription.p256dh, auth: subscription.auth } }, payload, {
        TTL: 86400,
        urgency: "high",
        topic: notification.tag || "aerial-move-avvisi",
        vapidDetails: vapid,
      });
      if (subscription.id) await serverFetch(`/rest/v1/push_subscriptions?id=eq.${cleanUuid(subscription.id)}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ last_error: null, updated_at: new Date().toISOString() }) });
      return true;
    } catch (error) {
      const pushError = error as { statusCode?: number; message?: string };
      const status = Number(pushError.statusCode || 0);
      if (status === 404 || status === 410) {
        await serverFetch(`/rest/v1/push_subscriptions?id=eq.${cleanUuid(subscription.id)}`, { method: "DELETE" });
      } else if (subscription.id) {
        await serverFetch(`/rest/v1/push_subscriptions?id=eq.${cleanUuid(subscription.id)}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ last_error: String(pushError.message || "Invio non riuscito").slice(0, 500), updated_at: new Date().toISOString() }) });
      }
      return false;
    }
  }));
  const sent = results.filter(Boolean).length;
  return { sent, failed: results.length - sent };
}

async function notifyInstructors({ title, body, url, tag, instructorNames = [], activities = [] }) {
  try {
    await serverFetch("/rest/v1/app_notifications", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ audience: "istruttrici", title, body, target_url: url, instructor_names: instructorNames, activities }),
    });
    return await sendPushNotification({ title, body, url: APP_URL + String(url || ""), tag }, { role: "istruttrici", instructorNames, activities });
  } catch {
    return { sent: 0, failed: 0 };
  }
}

async function authFetch(path, body) {
  const response = await fetch(SUPABASE_URL + path, {
    method: "POST",
    headers: { apikey: PUBLISHABLE_KEY, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!response.ok) throw new Error(`Authentication failed: ${response.status}`);
  return data;
}

async function userAuthFetch(path, method, accessToken, body = null) {
  const headers = new Headers({
    apikey: PUBLISHABLE_KEY,
    authorization: `Bearer ${accessToken}`,
    "content-type": "application/json",
  });
  const response = await fetch(SUPABASE_URL + path, {
    method,
    headers,
    body: body === null ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!response.ok) throw new Error(`User authentication failed: ${response.status}`);
  return data;
}

async function sessionFor(request) {
  const authorization = request.headers.get("authorization") || "";
  const bearer = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
  const token = bearer || cookieValue(request, SESSION_COOKIE);
  if (!token) return null;
  const tokenHash = await hashToken(token);
  const rows = await serverFetch(`/rest/v1/web_sessions?token_hash=eq.${tokenHash}&expires_at=gt.${encodeURIComponent(new Date().toISOString())}&select=user_id,role&limit=1`);
  if (!rows?.[0]) return null;
  const profiles = await serverFetch(`/rest/v1/profiles?id=eq.${rows[0].user_id}&select=role,display_name&limit=1`);
  if (!profiles?.[0] || profiles[0].role !== rows[0].role) return null;
  return { tokenHash, userId: rows[0].user_id, role: rows[0].role, profile: profiles[0] };
}

function requireRole(session, role) {
  if (!session || session.role !== role) throw new Error("Unauthorized");
}

const html = `<!doctype html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#301522">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="apple-mobile-web-app-title" content="Aerial Move">
  <link rel="apple-touch-icon" href="https://ztskaqyudcamdailxdef.supabase.co/functions/v1/aerial-move?asset=app-icon-v2">
  <link rel="icon" type="image/png" href="https://ztskaqyudcamdailxdef.supabase.co/functions/v1/aerial-move?asset=app-icon-v2">
  <title>Aerial Move</title>
  <style>
    :root{--ink:#281721;--wine:#311725;--pink:#e64286;--paper:#fffafd;--line:#eadfe6;--muted:#766b72;--good:#198258}
    *{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.45 Arial,sans-serif}button,input,textarea,select{font:inherit}button{cursor:pointer}
    .hidden{display:none!important}.brand{display:flex;align-items:center;gap:11px;font:18px Georgia,serif;letter-spacing:.13em}.brand>span{display:grid;place-items:center;width:39px;height:39px;border:1px solid #f5a8c7;border-radius:50%;color:#ff91bd}.brand i{display:block;margin-left:17px;color:#ff7eb0;font-style:normal}.brand b{line-height:.82}
    .eyebrow{margin:0;color:#a06f86;font-size:.72rem;font-weight:800;letter-spacing:.13em}.muted{color:var(--muted)}
    .auth{min-height:100vh;display:grid;grid-template-columns:1.05fr .95fr;background:#fdf8fb}.auth-copy{padding:clamp(42px,8vw,110px);color:#fff;background:radial-gradient(circle at 12% 12%,#9f4b75 0,transparent 31%),linear-gradient(145deg,#25131d,#3d1a2e 52%,#7f2b58);display:flex;flex-direction:column;justify-content:center}.auth-copy .brand{margin-bottom:auto}.auth-copy h1{max-width:590px;margin:18px 0;font:clamp(2.7rem,4.5vw,4.4rem)/1 Georgia,serif}.auth-copy p{max-width:535px;color:#f0d8e4;line-height:1.7}.auth-panel{width:min(100%,590px);padding:clamp(35px,7vw,90px);margin:auto}.auth-panel h2{margin:8px 0;font:2.15rem Georgia,serif}.roles{display:grid;gap:12px;margin:28px 0 18px}.role{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:14px;width:100%;padding:17px;border:1px solid var(--line);border-radius:16px;background:#fff;color:var(--ink);text-align:left}.role.selected{border-color:var(--pink);box-shadow:0 10px 25px #421a2b14}.role-icon{display:grid;place-items:center;width:46px;height:46px;border-radius:13px;color:#b62c67;background:#ffe9f2;font-size:22px}.role b{display:block;font:1.2rem Georgia,serif}.role small{display:block;margin-top:3px;color:var(--muted)}.tick{opacity:0;color:var(--pink);font-weight:bold}.role.selected .tick{opacity:1}
    .auth-form{display:grid;gap:9px}.auth-form label{font-size:.8rem;font-weight:700;color:#66535d}.auth-form input{width:100%;padding:13px;border:1px solid #ddcfd6;border-radius:10px;background:#fff}.primary{display:flex;justify-content:center;align-items:center;gap:8px;width:100%;padding:14px 17px;border:0;border-radius:11px;background:var(--pink);color:#fff;font-weight:800}.link{padding:8px;border:0;background:transparent;color:#9b3d67;font-weight:700}.notice{margin:13px 0 0;padding:11px 12px;border-radius:9px;background:#fff0f6;color:#7b2b50;font-size:.86rem}.error{background:#fff0f2;color:#9d3f52}.fine{margin:13px 0 0;color:#84757d;font-size:.78rem;text-align:center}.result-details{display:grid;gap:10px;margin-top:13px;padding-top:12px;border-top:1px solid #f0d5e1}.result-details p{margin:0}.result-details strong{font-family:Georgia,serif}
    .shell{min-height:100vh}.sidebar{position:fixed;inset:0 auto 0 0;width:255px;padding:28px 16px 20px;background:#241720;color:#d8cbd5;display:flex;flex-direction:column}.sidebar .brand{color:#fff;margin:0 9px 30px}.active-role{padding:12px;margin-bottom:18px;border-radius:12px;background:#47273a}.active-role small{display:block;color:#bba8b3;font-size:.65rem;letter-spacing:.1em}.active-role b{color:#fff}.nav{display:grid;gap:4px}.nav button{display:flex;align-items:center;gap:10px;width:100%;padding:12px 13px;border:0;border-radius:9px;background:transparent;color:#c5b4be;text-align:left}.nav button.active,.nav button:hover{color:#fff;background:#4d2a3f}.logout{margin-top:auto;padding:11px;border:0;border-radius:9px;background:transparent;color:#d8cbd5;text-align:left}.main{margin-left:255px;padding:36px clamp(18px,5vw,76px)}.top{display:flex;justify-content:space-between;align-items:center;margin-bottom:28px}.top h1{margin:7px 0 0;font:clamp(2rem,3vw,2.55rem) Georgia,serif}.chip{padding:8px 10px;border:1px solid #f2d2df;border-radius:99px;color:#9b3d67;background:#fff5f9;font-size:.76rem;font-weight:700}
    .hero{display:flex;justify-content:space-between;align-items:center;min-height:180px;padding:29px 33px;border-radius:19px;color:#fff;background:linear-gradient(115deg,#872d5a,#e15b91)}.hero.dark{background:linear-gradient(115deg,#331725,#762d58)}.hero h2{margin:11px 0 6px;font:2rem Georgia,serif}.hero p{margin:0;color:#ffe3ee}.orb{display:grid;place-content:center;width:102px;height:102px;border:1px solid #ffffff2b;border-radius:50%;background:#ffffff22;text-align:center;font:2.1rem Georgia,serif}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:17px;margin-top:18px}.metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:15px;margin:18px 0}.metric,.card{padding:22px;border:1px solid var(--line);border-radius:15px;background:#fff}.metric b{display:block;font:2rem Georgia,serif}.metric p{margin:3px 0 0;color:var(--muted);font-size:.82rem}.card h2,.card h3{margin:6px 0;font-family:Georgia,serif}.card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding-bottom:14px;border-bottom:1px solid #eee4e9}.card-head button,.small-btn{padding:9px 11px;border:0;border-radius:8px;background:var(--wine);color:#fff;font-size:.8rem;font-weight:700}.lookup{display:grid;grid-template-columns:1fr auto;gap:8px;margin-top:16px}.lookup input,.field input,.field textarea,.field select{width:100%;padding:10px;border:1px solid #ddcfd6;border-radius:8px;background:#fff}.lookup button{padding:10px 13px;border:0;border-radius:8px;background:var(--pink);color:#fff;font-weight:700}.result{margin-top:13px;padding:13px;border-radius:9px;background:#fff0f6}.result b{display:block;margin-top:4px;font:1.1rem Georgia,serif}
    .table-wrap{overflow:auto;margin-top:15px}.table{width:100%;min-width:720px;border-collapse:collapse}.table th,.table td{padding:11px 9px;border-bottom:1px solid #eee4e9;text-align:left;font-size:.82rem}.table th{color:#66535d}.table button{border:0;background:transparent;color:#bb316b;font-weight:700}.schedule{width:100%;min-width:760px;border-collapse:collapse;margin-top:15px}.schedule th,.schedule td{padding:9px;border-bottom:1px solid #eee5ea;text-align:left;font-size:.75rem;vertical-align:top}.slot{display:block;padding:7px;border-radius:7px;background:#ed639f;color:#fff}.workouts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.workout{padding:19px;border:1px solid var(--line);border-radius:14px;background:#fff}.workout em{color:#b03b6b;font-size:.72rem;font-style:normal;font-weight:800}.workout h3{margin:7px 0;font:1.25rem Georgia,serif}.workout p{color:var(--muted);font-size:.85rem}.workout a{color:#b52d67;font-weight:800;text-decoration:none}
    .empty{padding:30px;text-align:center;color:var(--muted)}.instructor-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:18px}.instructor-card{display:flex;align-items:center;gap:13px;padding:15px;border:1px solid var(--line);border-radius:12px;background:#fff8fb}.instructor-avatar{display:grid;place-items:center;width:42px;height:42px;border-radius:50%;background:#ffe2ee;color:#a72d62;font:700 1rem Georgia,serif}.instructor-card b{font:1.05rem Georgia,serif}.modal{position:fixed;inset:0;z-index:30;display:grid;place-items:center;padding:18px;background:#1c1017aa}.modal-box{width:min(100%,760px);max-height:92vh;overflow:auto;padding:23px;border-radius:16px;background:#fff}.form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.field{display:grid;gap:5px;border:0;margin:0;padding:0}.field span{color:var(--muted);font-size:.75rem;font-weight:700}.field.full{grid-column:1/-1}.choice-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;padding:11px;border:1px solid #ddcfd6;border-radius:10px;background:#fff}.choice{display:flex;align-items:center;gap:8px;padding:7px;border-radius:7px;background:#fff8fb;font-size:.82rem}.choice input{width:auto}.medical-alert{margin-top:6px}.actions{display:flex;gap:9px;margin-top:18px}.actions button{padding:11px 14px;border:0;border-radius:9px;font-weight:700}.actions .save{background:var(--pink);color:#fff}.attendance-row{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #eee5ea}.attendance-row span{flex:1}.status{display:inline-flex;padding:5px 8px;border-radius:99px;color:var(--good);background:#e8f7ef;font-size:.75rem;font-weight:700}.status.warn{color:#8a5a00;background:#fff3ce}.status.danger{color:#a52d42;background:#ffe5ea}.status.neutral{color:#685862;background:#f2edf0}
    @media(max-width:820px){.auth{grid-template-columns:1fr}.auth-copy{min-height:auto;padding:30px 24px}.auth-copy .brand{margin-bottom:55px}.auth-panel{padding:34px 22px}.sidebar{position:relative;width:100%;padding:15px}.sidebar .brand{margin:0}.active-role{display:none}.nav{display:flex;overflow:auto;margin-top:14px}.nav button{width:auto;white-space:nowrap}.logout{position:absolute;right:12px;top:17px;width:auto;margin:0}.main{margin:0;padding:24px 16px}.chip,.orb{display:none}.grid,.workouts{grid-template-columns:1fr}.metrics{grid-template-columns:repeat(2,1fr)}.hero{min-height:150px;padding:24px}.form-grid,.choice-grid{grid-template-columns:1fr}.field.full{grid-column:auto}}
    .training-intro{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;padding:26px 29px;border-radius:17px;color:#fff;background:linear-gradient(115deg,#331725,#8a315f)}.training-intro h2{margin:9px 0;font:1.8rem Georgia,serif}.training-intro p{max-width:650px;margin:0;color:#f6dbe7}.training-time{display:grid;place-content:center;min-width:88px;height:88px;border-radius:50%;background:#e64286;text-align:center;font:2rem Georgia,serif}.training-time small{font:10px Arial,sans-serif;letter-spacing:.12em}.training-card{display:flex;min-height:176px;padding:0;overflow:hidden;border:1px solid var(--line);border-radius:14px;background:#fff;color:var(--ink);text-align:left}.training-card img{width:135px;object-fit:cover}.training-card>span{display:block;padding:18px}.training-card em{color:#a06f86;font-size:.7rem;font-style:normal;font-weight:800}.training-card h3{margin:7px 0;font:1.25rem Georgia,serif}.training-card p{margin:0 0 10px;color:var(--muted);font-size:.83rem}.training-card b{color:#bd2f6b;font-size:.82rem}.training-safety{margin-top:17px;padding:13px 15px;border-left:4px solid var(--pink);border-radius:8px;background:#fff0f6;color:#704458;font-size:.84rem}.workout-sheet{width:min(100%,790px)}.workout-sheet>img{width:100%;max-height:280px;object-fit:cover;border-radius:11px;margin:15px 0}.workout-meta{margin:4px 0;color:var(--muted)}.phase{display:grid;grid-template-columns:34px 1fr;gap:12px;padding:18px 0;border-top:1px solid var(--line)}.phase-number{display:grid;place-items:center;width:31px;height:31px;border-radius:50%;background:#ffe4ef;color:#c02f6c;font-weight:800}.phase h3{margin:3px 0 11px}.exercise-list{display:grid;gap:11px;margin:0;padding:0;list-style:none}.exercise-list li{padding:12px;border-radius:9px;background:#fff8fb}.exercise-list b{display:block;margin-bottom:4px}.exercise-list span{color:#675b62;font-size:.88rem;line-height:1.5}.workout-warning{margin:0;padding:12px;border-radius:8px;background:#fff0f6;color:#704458;font-size:.84rem}@media(max-width:820px){.training-intro{padding:22px}.training-time{display:none}.training-card img{width:110px}.training-card>span{padding:15px}.workout-sheet>img{max-height:190px}.phase{grid-template-columns:30px 1fr}}
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    const STORAGE_KEY='aerial_move_session_v2';
    const state={role:'atlete',mode:'login',token:localStorage.getItem(STORAGE_KEY)||'',profile:null,tab:'home',athletes:[],editing:null};
    const activityOptions=['Ginnastica acrobatica','Tessuto aereo','Cerchio aereo agonista','Lollipop','Cerchio aereo non agonista','Cerchio aereo agonista + Move Lab','Cerchio aereo non agonista + Move Lab','Mini Move','Amaca aerea baby','Amaca aerea relax','Pole Dance','Bungee Fly','Pilates Base','Pilates Plus','Surf Pilates','Hip Hop'];
    const instructorOptions=['MARTINA','ITALIA','ANGELA','ROSALINDA','DEBORA','PHILOMENA','ROBERTO','ANDREA'];
    const trainingImages={strength:'https://angelacarbone1998-cloud.github.io/aerial-move-app/training/strength-bridge.jpg',stretch:'https://angelacarbone1998-cloud.github.io/aerial-move-app/training/stretching-flexibility.jpg',cool:'https://angelacarbone1998-cloud.github.io/aerial-move-app/training/cooldown-mobility.jpg'};
    const trainingWarm=[
      ['Collo','Esegui tiraggi laterali aiutandoti delicatamente con la mano. Porta poi il mento verso il petto e fai 10 inclinazioni lente a destra e sinistra; mantieni ogni allungo 20 secondi.'],
      ['Spalle','Fai 10 rotazioni avanti e 10 indietro, poi 10 circonduzioni a braccia tese in entrambe le direzioni. Tieni sempre le spalle lontane dalle orecchie.'],
      ['Busto','Con gambe aperte inclina il busto lateralmente e lascia il braccio opposto lungo l’orecchio. Mantieni 20 secondi per lato, poi fai 20 rotazioni controllate.'],
      ['Gambe e plié','Con talloni interni e punte aperte piega e stendi le ginocchia 10 volte. Mantieni il grand plié in seconda per 10 secondi con addome e glutei attivi.'],
      ['Mobilità con yoga block','Con piedi paralleli e mani sul blocchetto, scendi con il busto mantenendo le gambe tese per 20 secondi. Poi piega e stendi le gambe 10 volte.']
    ];
    const trainingCool=[
      ['Compensazione in avanti','Porta il busto in chiusura senza spingere. Rimani 20–30 secondi respirando lentamente.'],
      ['Torsione del busto','Con le braccia aperte esegui una torsione morbida a destra e sinistra. Mantieni 20 secondi per lato.'],
      ['Abbraccio delle ginocchia','Sdraiata, raccogli le ginocchia al petto e abbracciale per 20 secondi. Srotola poi la schiena lentamente.'],
      ['Gambe al muro','Sdraiati vicino a una parete e appoggia le gambe in alto per 5 minuti. Lascia rilassare la zona lombare e respira.']
    ];
    const trainingDays=[
      {day:'Lunedì',title:'Spalle e apertura dorsale',image:'strength',kit:'Tappetino, elastic band, 2 yoga block e sedia',focus:[['Piegamenti braccia con elastico','Tieni l’elastico dietro la schiena. Piega i gomiti mantenendoli paralleli al pavimento, esegui 10 movimenti e mantieni la piega 10 secondi.'],['Tiraggio sopra la testa','Un’estremità dell’elastico resta sopra la testa e l’altra dietro la schiena. Stendi il braccio dietro per 10 ripetizioni, tieni l’allungo 10 secondi e cambia lato.'],['Yoga block tra i gomiti','Metti il blocchetto tra i gomiti, stringilo per 10 secondi e, senza perderlo, alza e abbassa i gomiti 10 volte.'],['Stretching spalle su sedia','A quattro zampe appoggia le mani sulla sedia, braccia tese e ginocchia a 90°. Lascia scendere la testa per 20 secondi, poi esegui 10 gobba-arco.'],['Rinforzo prono','A pancia sotto, fronte a terra: solleva le braccia tese 10 volte e mantieni 10 secondi. Poi piega i gomiti verso le scapole per 10 movimenti.']]},
      {day:'Martedì',title:'Schiena e preparazione rovesciata',image:'stretch',kit:'Tappetino, yoga block e parete; rovesciata solo se già sicura',focus:[['Gobba-arco a quattro zampe','Con le mani sotto le spalle passa lentamente da gobba ad arco per 10 volte. Mantieni poi 10 secondi in ogni posizione senza comprimere il collo.'],['Spalle sullo yoga block','A quattro zampe metti le mani sul block, braccia tese e ginocchia a 90°. Porta prima la fronte e poi il mento verso il pavimento, 20 secondi per posizione.'],['Arco base','Sdraiata prona, braccia tese e bacino a terra. Muovi lentamente la testa avanti e indietro 10 volte, mantieni l’arco 10 secondi e fai 8 piegamenti delle gambe.'],['Slanci in arco','A quattro zampe inarca la schiena e tieni una gamba tesa dietro. Fai 10 slanci piegati, poi scendi sui gomiti e fanne 8; ripeti dall’altro lato.'],['Rovesciata opzionale','Solo se la tecnica è già stabile usa la parete per la discesa in ponte o per la verticale sui gomiti. Interrompi subito se perdi il controllo.']]},
      {day:'Mercoledì',title:'Spaccate frontale e sagittale',image:'stretch',kit:'Tappetino, 2 yoga block e sedia',focus:[['Apertura gambe sul block','Con gambe aperte e piedi paralleli appoggia le mani al blocchetto. Mantieni 20 secondi, poi piega e stendi le gambe 10 volte senza chiudere il petto.'],['Pike con piedi sul block','Sali con i piedi paralleli sul blocchetto e porta il busto avanti. Tieni le gambe tese per 20 secondi, poi fai 10 discese dei talloni verso il pavimento.'],['Affondo con block','Metti un block basso sotto il ginocchio posteriore. Nell’affondo piega e stendi il ginocchio 10 volte; mantieni poi l’allungo 10 secondi e cambia lato.'],['Spaccata frontale assistita','Entra gradualmente usando i block o un cuscino come sostegno. Mantieni 30 secondi per lato senza molleggiare e con le anche allineate.'],['Spaccata sagittale assistita','Apri le gambe quanto permette la mobilità del giorno. Usa mani o block davanti per scaricare il peso e mantieni 30 secondi senza forzare.']]},
      {day:'Giovedì',title:'Schiena, lombari e glutei',image:'strength',kit:'Tappetino e yoga block',focus:[['Braccia e gambe prone','A pancia sotto con fronte a terra, solleva le braccia tese 10 volte e tienile 10 secondi. Fai lo stesso con le gambe senza irrigidire il collo.'],['Dorsali e lombari','Con mani incrociate dietro la testa esegui 10 sollevamenti del busto senza staccare le gambe. Poi solleva insieme braccia, busto e gambe per 10 volte.'],['Glute bridge','Supina, piedi a terra e addome attivo: solleva e abbassa il bacino 20 volte senza appoggiare del tutto il sedere. Mantieni l’ultima ripetizione 20 secondi.'],['Glute bridge a una gamba','Piega una gamba con il ginocchio verso il soffitto. Solleva il bacino 10 volte e mantieni 10 secondi; ripeti con l’altra gamba.'],['Cestino','A pancia sotto afferra le caviglie dall’esterno. Solleva busto e cosce 10 volte e mantieni 10 secondi; dondola solo se la posizione è confortevole.']]},
      {day:'Venerdì',title:'Ponte e flessibilità schiena',image:'strength',kit:'Tappetino, 2 yoga block e sedia',focus:[['Arco con block sotto le mani','In arco, mani su block bassi e bacino ben appoggiato. Spingi sulle mani, solleva il busto e piega le gambe 8 volte; mantieni 10 secondi.'],['Arco con block sotto le ginocchia','Metti due block bassi e vicini sotto le ginocchia. Con braccia tese solleva il busto 8 volte e mantieni 10 secondi senza staccare il bacino.'],['Allunghi da seduta','Da seduta con gambe piegate e una mano dietro, alza il bacino e porta l’altro braccio indietro. Ripeti 8 volte per lato e resta 10 secondi.'],['Ponte base','Sali in ponte prima con i piedi in mezza punta, braccia tese e peso sulle spalle. Mantieni 10 secondi; ripeti poi con i piedi a terra.'],['Ponte con yoga block','Con due block bassi e paralleli entra in ponte e fai piccoli dondolii per spostare gradualmente il peso dalle gambe alle braccia.']]},
      {day:'Sabato',title:'Potenziamento lower e core',image:'strength',kit:'Tappetino, elastic band o piccoli pesi',focus:[['Hip thrust o glute bridge','Esegui 10 ripetizioni, 10 pulse e una tenuta di 10 secondi. Ripeti per 4 serie mantenendo l’addome attivo.'],['Step up stabile','Sali con tutto il piede su una sedia molto stabile o un gradino. Spingi dal tallone, controlla la discesa e fai 12 ripetizioni per gamba per 3 serie.'],['Abductor con banda','Metti la banda sopra le ginocchia, siediti stabile e apri le gambe. Fai 10 ripetizioni col busto indietro, 10 neutro e 10 in avanti, per 3 serie.'],['Plank alternato','Appoggia gomiti o mani sotto le spalle e mantieni il corpo in linea per 45–60 secondi senza lasciare scendere il bacino.'],['Clam shell con elastico','Sdraiata su un lato con ginocchia piegate, apri il ginocchio superiore senza ruotare il bacino. Fai 15 ripetizioni per lato per 3 serie.']]},
      {day:'Domenica',title:'Posturale, mobilità e recupero',image:'cool',kit:'Tappetino, yoga block e parete',focus:[['Rotazioni per le spalle','Esegui 10 rotazioni avanti e indietro, poi 10 circonduzioni con gomiti piegati e 10 con braccia tese. Mantieni il collo rilassato.'],['Braccia dietro da seduta','Siediti con gambe piegate e mani dietro. Fai scivolare lentamente il sedere avanti finché senti l’apertura, poi mantieni 20 secondi.'],['Apertura su yoga block','Metti due block sovrapposti nella zona delle scapole, sdraiati con ginocchia piegate e porta le braccia indietro. Mantieni 20–30 secondi.'],['Cervo con elastico','Nella posizione di cervo usa l’elastico tra il piede della gamba dietro e la mano opposta. Piega e stendi 10 volte, poi mantieni 10 secondi per lato.'],['Microcircolo','Concludi con le gambe al muro per 5 minuti e respirazione lenta. Lascia rilassare spalle, mascella e zona lombare.']]}
    ];
    const root=document.getElementById('root');
    const esc=(value)=>String(value??'').replace(/[&<>"']/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const fmt=(value)=>value?new Intl.DateTimeFormat('it-IT',{day:'numeric',month:'long',year:'numeric'}).format(new Date(value+'T12:00:00')):'Non indicata';
    const euro=(value)=>value!==null&&value!==undefined&&value!==''?new Intl.NumberFormat('it-IT',{style:'currency',currency:'EUR'}).format(Number(value)):'Non indicato';
    async function server(action,payload){const headers={'Content-Type':'application/json'};if(state.token)headers.Authorization='Bearer '+state.token;const response=await fetch('https://ztskaqyudcamdailxdef.supabase.co/functions/v1/aerial-move',{method:'POST',headers,body:JSON.stringify(Object.assign({action},payload||{}))});const body=await response.json().catch(()=>null);if(!response.ok)throw new Error(body&&body.error||'Operazione non riuscita');return body}
    function setRole(role){state.role=role;document.querySelectorAll('.role').forEach((el)=>el.classList.toggle('selected',el.dataset.role===role))}
    function authView(message,isError){const reset=state.mode==='reset';const title=reset?'Scegli una nuova password':(state.mode==='login'?'Accedi alla tua area':'Prima attivazione');const intro=reset?'Inserisci due volte la nuova password dell’account Atlete.':'Scegli l’area e inserisci la password condivisa.';const roles=reset?'':'<div class="roles"><button class="role '+(state.role==='atlete'?'selected':'')+'" data-role="atlete" onclick="setRole(\'atlete\')"><span class="role-icon">◎</span><span><b>Atlete</b><small>Calendario, scadenza e allenamenti</small></span><span class="tick">✓</span></button><button class="role '+(state.role==='istruttrici'?'selected':'')+'" data-role="istruttrici" onclick="setRole(\'istruttrici\')"><span class="role-icon">◆</span><span><b>Istruttrici</b><small>Atlete, presenze e scadenze</small></span><span class="tick">✓</span></button></div>';const form=reset?'<form class="auth-form" onsubmit="submitReset(event)"><label for="password">Nuova password</label><input id="password" type="password" minlength="8" required autocomplete="new-password" placeholder="Almeno 8 caratteri"><label for="confirm">Ripeti nuova password</label><input id="confirm" type="password" minlength="8" required autocomplete="new-password" placeholder="Ripeti la password"><button class="primary" type="submit">Salva nuova password</button></form>':'<form class="auth-form" onsubmit="submitAuth(event)"><label for="password">Password</label><input id="password" type="password" minlength="8" required autocomplete="current-password" placeholder="Almeno 8 caratteri">'+(state.mode==='activate'?'<label for="confirm">Ripeti password</label><input id="confirm" type="password" minlength="8" required autocomplete="new-password" placeholder="Ripeti la password">':'')+'<button class="primary" type="submit">'+(state.mode==='login'?'Accedi':'Attiva account')+'</button></form>';const links=reset?'':('<button class="link" onclick="toggleMode()">'+(state.mode==='login'?'Prima attivazione':'Torna al login')+'</button>'+(state.mode==='login'?'<button class="link" onclick="requestReset()">Password dimenticata</button>':''));root.innerHTML='<main class="auth"><section class="auth-copy"><div class="brand"><span>Ａ</span><b>AERIAL<i>MOVE</i></b></div><p class="eyebrow" style="color:#f6b9d2">ACCESSO PROTETTO</p><h1>La tua palestra, sempre con te.</h1><p>Calendario, allenamenti e scadenze per le atlete. Gestione completa per le istruttrici.</p></section><section class="auth-panel"><p class="eyebrow">BENVENUTA IN AERIAL MOVE</p><h2>'+title+'</h2><p class="muted">'+intro+'</p>'+roles+form+(message?'<p class="notice '+(isError?'error':'')+'">'+esc(message)+'</p>':'')+links+'<p class="fine">L’email dell’account non viene mostrata alle utenti.</p></section></main>'}
    function toggleMode(){state.mode=state.mode==='login'?'activate':'login';authView()}
    async function submitAuth(event){event.preventDefault();const password=document.getElementById('password').value;if(state.mode==='activate'){const confirm=document.getElementById('confirm').value;if(password!==confirm){authView('Le due password non coincidono.',true);return}try{await server('activate',{role:state.role,password});authView('Controlla la relativa casella email, conferma l’account e poi torna qui per accedere.')}catch(error){authView('Non è stato possibile attivare l’account. Se è già attivo, usa il login.',true)}return}try{const data=await server('login',{role:state.role,password});state.token=data.token;localStorage.setItem(STORAGE_KEY,state.token);state.profile=data.profile;state.role=data.profile.role;state.tab='home';dashboard()}catch(error){authView('Password non corretta oppure account non ancora confermato.',true)}}
    function requestReset(){authView(state.role==='atlete'?'Per reimpostare la password Atlete, contatta un’istruttrice.':'Per reimpostare la password Atlete, accedi all’area istruttrici e apri “Accesso atlete”.')}
    async function restore(){if(!state.token){authView();return}try{const data=await server('session');state.profile=data.profile;state.role=data.profile.role;dashboard()}catch{state.token='';localStorage.removeItem(STORAGE_KEY);authView()}}
    async function logout(){try{await server('logout')}catch{}state.token='';localStorage.removeItem(STORAGE_KEY);state.profile=null;state.tab='home';authView()}
    const athleteNav=[['home','La mia area'],['calendar','Calendario'],['subscription','La mia scadenza'],['training','Allenamenti']];
    const instructorNav=[['home','Panoramica'],['instructors','Istruttrici'],['calendar','Calendario'],['athletes','Schede atlete'],['attendance','Presenze'],['attendance-log','Registro presenze'],['subscriptions','Abbonamenti'],['medical','Certificati'],['access','Accesso atlete']];
    function dashboard(){const nav=state.role==='atlete'?athleteNav:instructorNav;root.innerHTML='<main class="shell"><aside class="sidebar"><div class="brand"><span>Ａ</span><b>AERIAL<i>MOVE</i></b></div><div class="active-role"><small>AREA ATTIVA</small><b>'+esc(state.profile.display_name)+'</b></div><nav class="nav">'+nav.map((item)=>'<button class="'+(state.tab===item[0]?'active':'')+'" onclick="openTab(\''+item[0]+'\')">'+item[1]+'</button>').join('')+'</nav><button class="logout" onclick="logout()">Esci</button></aside><section class="main"><header class="top"><div><p class="eyebrow">AERIAL MOVE · VILLA D’AGRI</p><h1>'+tabTitle()+'</h1></div><span class="chip">Accesso protetto</span></header><div id="content"></div></section></main>';renderTab()}
    function tabTitle(){const labels={home:state.role==='atlete'?'La mia area':'Panoramica',instructors:'Istruttrici',calendar:'Calendario',subscription:'La mia scadenza',training:'Allenamenti',athletes:'Schede atlete',attendance:'Presenze','attendance-log':'Registro presenze',subscriptions:'Scadenze abbonamenti',medical:'Certificati medici',access:'Accesso atlete'};return labels[state.tab]||'Aerial Move'}
    function openTab(tab){state.tab=tab;dashboard()}
    function renderTab(){if(state.tab==='calendar')return renderCalendar();if(state.role==='atlete'){if(state.tab==='subscription')return renderSubscription();if(state.tab==='training')return renderTraining();return renderAthleteHome()}if(state.tab==='instructors')return renderInstructors();if(state.tab==='athletes')return loadAthletes('athletes');if(state.tab==='attendance')return loadAthletes('attendance');if(state.tab==='attendance-log')return renderAttendanceLog();if(state.tab==='subscriptions')return loadAthletes('subscriptions');if(state.tab==='medical')return loadAthletes('medical');if(state.tab==='access')return renderAthleteAccess();return renderInstructorHome()}
    function renderAthleteHome(){document.getElementById('content').innerHTML='<section class="hero"><div><p class="eyebrow" style="color:#f6b9d2">AREA ATLETE</p><h2>Pronta per il prossimo allenamento</h2><p>Consulta gli orari, allenati da casa e controlla la tua scadenza.</p></div><div class="orb">MOVE</div></section><div class="grid"><section class="card"><p class="eyebrow">LA TUA SCADENZA</p><h3>Usa il codice tessera</h3><p class="muted">Il codice mostra soltanto i dati del tuo abbonamento.</p><button class="small-btn" onclick="openTab(\'subscription\')">Controlla ora</button></section><section class="card"><p class="eyebrow">ALLENAMENTO A CASA</p><h3>7 schede da 50 minuti</h3><p class="muted">Stretching, potenziamento, ponte, spaccate e defaticamento.</p><button class="small-btn" onclick="openTab(\'training\')">Apri le schede</button></section></div>'}
    function renderInstructorHome(){document.getElementById('content').innerHTML='<section class="hero dark"><div><p class="eyebrow" style="color:#f6b9d2">AREA ISTRUTTRICI</p><h2>Gestione Aerial Move</h2><p>Aggiorna atlete, presenze, abbonamenti e certificati.</p></div><div class="orb">AM</div></section><div class="metrics"><section class="metric"><b id="metric-athletes">—</b><p>Atlete attive</p></section><section class="metric"><b id="metric-subs">—</b><p>Abbonamenti in scadenza</p></section><section class="metric"><b id="metric-medical">—</b><p>Certificati da controllare</p></section></div><div class="grid"><section class="card"><h3>Istruttrici</h3><p class="muted">Consulta l’elenco completo delle istruttrici Aerial Move.</p><button class="small-btn" onclick="openTab(\'instructors\')">Mostra istruttrici</button></section><section class="card"><h3>Schede atlete</h3><p class="muted">Inserisci e aggiorna i dati delle atlete.</p><button class="small-btn" onclick="openTab(\'athletes\')">Gestisci atlete</button></section><section class="card"><h3>Presenze</h3><p class="muted">Seleziona la lezione e aggiorna manualmente le presenze.</p><button class="small-btn" onclick="openTab(\'attendance\')">Apri presenze</button></section></div>';loadMetrics()}
    function renderAthleteAccess(){document.getElementById('content').innerHTML='<section class="card" style="max-width:620px"><p class="eyebrow">ACCESSO PROTETTO</p><h2>Reimposta password Atlete</h2><p class="muted">Questa operazione è disponibile solo alle istruttrici. Le atlete già connesse verranno disconnesse.</p><form class="auth-form" onsubmit="saveAthletePassword(event)" style="margin-top:18px"><label for="new-athlete-password">Nuova password Atlete</label><input id="new-athlete-password" type="password" minlength="8" required autocomplete="new-password" placeholder="Almeno 8 caratteri"><label for="confirm-athlete-password">Ripeti nuova password</label><input id="confirm-athlete-password" type="password" minlength="8" required autocomplete="new-password" placeholder="Ripeti la password"><button class="primary" type="submit">Salva nuova password</button></form><div id="access-message" aria-live="polite"></div></section>'}
    async function saveAthletePassword(event){event.preventDefault();const password=document.getElementById('new-athlete-password').value;const confirm=document.getElementById('confirm-athlete-password').value;const message=document.getElementById('access-message');if(password!==confirm){message.innerHTML='<p class="notice error">Le due password non coincidono.</p>';return}try{await server('athlete.password.update',{password});document.getElementById('new-athlete-password').value='';document.getElementById('confirm-athlete-password').value='';message.innerHTML='<p class="notice">Password Atlete aggiornata. Le atlete dovranno accedere di nuovo.</p>'}catch{message.innerHTML='<p class="notice error">Non è stato possibile aggiornare la password.</p>'}}
    function renderInstructors(){document.getElementById('content').innerHTML='<section class="card"><div class="card-head"><div><p class="eyebrow">TEAM AERIAL MOVE</p><h2>Le istruttrici</h2></div><span class="status">'+instructorOptions.length+' istruttrici</span></div><div class="instructor-list">'+instructorOptions.map((name)=>'<div class="instructor-card"><span class="instructor-avatar">'+esc(name.charAt(0))+'</span><b>'+esc(name)+'</b></div>').join('')+'</div></section>'}
    async function loadMetrics(){try{const data=await server('metrics');document.getElementById('metric-athletes').textContent=data.athletes;document.getElementById('metric-subs').textContent=data.subscriptions;document.getElementById('metric-medical').textContent=data.medical}catch{}}
    function renderCalendar(){const days=['Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'];const room1=[['17:15–20:15','Pilates','Pilates','Pilates','Pilates','Pilates','Pilates'],['20:30–21:30','Amaca','','Amaca','','','']];const room2=[['17:15','Mini Move','Tessuto / Amaca','Mini Move','Tessuto / Amaca','Attrezzi vari','Cerchio A'],['18:15','Cerchio N.A.','Move Lab','Hip Hop','Cerchio N.A.','Move Lab','Hip Hop'],['19:30','Cerchio A','Bungee','Cerchio A','Bungee','','']];const table=(title,rows)=>'<section class="card" style="margin-bottom:16px"><p class="eyebrow">'+title+'</p><div class="table-wrap"><table class="schedule"><thead><tr><th>Ora</th>'+days.map((d)=>'<th>'+d+'</th>').join('')+'</tr></thead><tbody>'+rows.map((r)=>'<tr><th>'+r[0]+'</th>'+r.slice(1).map((v)=>'<td>'+(v?'<span class="slot">'+v+'</span>':'')+'</td>').join('')+'</tr>').join('')+'</tbody></table></div></section>';document.getElementById('content').innerHTML=table('STANZA 1 · PILATES E AMACA',room1)+table('STANZA 2 · CALENDARIO CORSI',room2)}
    function renderSubscription(){document.getElementById('content').innerHTML='<section class="card" style="max-width:700px"><p class="eyebrow">CODICE TESSERA</p><h2>Controlla la tua scadenza</h2><p class="muted">Inserisci il codice personale consegnato dalla palestra.</p><form class="lookup" onsubmit="lookupSubscription(event)"><input id="member-code" required minlength="8" autocomplete="off" placeholder="Codice tessera"><button>Mostra scadenza</button></form><div id="subscription-result"></div></section>'}
    function normalizeMembershipCode(value){return String(value||'').trim().toUpperCase().replace(/\s+/g,'')}
    async function lookupSubscription(event){event.preventDefault();const box=document.getElementById('subscription-result');const code=normalizeMembershipCode(document.getElementById('member-code').value);if(!code){box.innerHTML='<p class="notice error">Inserisci il codice tessera.</p>';return}box.innerHTML='<p class="notice">Ricerca dei dati…</p>';try{const row=await server('subscription.lookup',{membershipCode:code});box.innerHTML=row?'<div class="result"><span><strong>Attività:</strong> '+esc(row.activity)+'<br><strong>Istruttrice:</strong> '+esc(row.instructor)+'</span><div class="result-details"><p><strong>Scadenza abbonamento:</strong><br>'+fmt(row.subscription_expires_on)+'</p><p><strong>Prezzo mensile:</strong> '+euro(row.monthly_price)+'</p><p><strong>Scadenza certificato medico:</strong><br>'+medicalStatus(row.medical_certificate_expires_on)+'</p></div></div>':'<p class="notice error">Codice non trovato. Controlla che sia stato salvato nella scheda atleta.</p>'}catch{box.innerHTML='<p class="notice error">Non è stato possibile controllare il codice. Esci e rientra nell’app, poi riprova.</p>'}}
    function renderTraining(){document.getElementById('content').innerHTML='<section class="training-intro"><div><p class="eyebrow" style="color:#f6b9d2">SETTIMANA COMPLETA · 7 SCHEDE</p><h2>Allenamenti a casa da 50 minuti</h2><p>Tocca il titolo del giorno: la scheda completa si apre qui nell’app.</p></div><span class="training-time">50<small>MINUTI</small></span></section><div class="workouts">'+trainingDays.map((d,i)=>'<button class="training-card" type="button" onclick="openWorkout('+i+')"><img src="'+trainingImages[d.image]+'" alt=""><span><em>GIORNO '+(i+1)+' · '+d.day.toUpperCase()+'</em><h3>'+d.title+'</h3><p>Stretching iniziale, lavoro mirato e defaticamento finale.</p><b>Apri la scheda →</b></span></button>').join('')+'</div><p class="training-safety">Lavora con i tuoi tempi, senza molleggiare e senza forzare ponte o spaccate. Interrompi se avverti dolore.</p>'}
    function workoutPhase(number,title,items){return '<section class="phase"><span class="phase-number">'+number+'</span><div><h3>'+title+'</h3><ol class="exercise-list">'+items.map((item)=>'<li><b>'+esc(item[0])+'</b><span>'+esc(item[1])+'</span></li>').join('')+'</ol></div></section>'}
    function openWorkout(index){const d=trainingDays[index];document.body.insertAdjacentHTML('beforeend','<div class="modal" id="workout-modal"><article class="modal-box workout-sheet"><div class="card-head"><div><p class="eyebrow">'+d.day.toUpperCase()+' · 50 MINUTI</p><h2>'+d.title+'</h2><p class="workout-meta">Materiale: '+d.kit+'</p></div><button type="button" onclick="closeWorkout()">Chiudi</button></div><img src="'+trainingImages[d.image]+'" alt="Esempi degli esercizi"><div>'+workoutPhase('1','Stretching e riscaldamento · 12 min',trainingWarm)+workoutPhase('2','Allenamento mirato · 30 min',d.focus)+workoutPhase('3','Defaticamento finale · 8 min',trainingCool)+'</div><p class="workout-warning">Gli esercizi avanzati vanno eseguiti soltanto se la tecnica è già stabile. Non forzare e interrompi in caso di dolore.</p><div class="actions"><button class="save" type="button" onclick="closeWorkout()">Torna agli allenamenti</button></div></article></div>');document.body.style.overflow='hidden'}
    function closeWorkout(){document.getElementById('workout-modal')?.remove();document.body.style.overflow=''}
    async function loadAthletes(view){const content=document.getElementById('content');content.innerHTML='<section class="card"><p class="muted">Caricamento…</p></section>';try{state.athletes=(await server('athletes.list')).athletes;if(view==='athletes')renderAthletes();if(view==='attendance')renderAttendance();if(view==='subscriptions')renderExpiry('subscription_expires_on','Scadenza abbonamento');if(view==='medical')renderExpiry('medical_certificate_expires_on','Scadenza certificato')}catch(error){content.innerHTML='<p class="notice error">Non è stato possibile caricare le atlete.</p>'}}
    function renderAthletes(){document.getElementById('content').innerHTML='<section class="card"><div class="card-head"><div><p class="eyebrow">ANAGRAFICA</p><h2>Schede atlete</h2></div><button onclick="openAthlete()">Aggiungi atleta</button></div>'+(state.athletes.length?'<div class="table-wrap"><table class="table"><thead><tr><th>Atleta</th><th>Attività</th><th>Istruttrice</th><th>Prezzo mensile</th><th>Certificato</th><th></th></tr></thead><tbody>'+state.athletes.map((a)=>'<tr><td><b>'+esc(a.full_name)+'</b><br><small>'+esc(a.membership_code)+'</small></td><td>'+esc(a.activity)+'</td><td>'+esc(a.instructor)+'</td><td>'+euro(a.monthly_price)+'</td><td>'+medicalStatus(a.medical_certificate_expires_on)+'</td><td><button onclick="openAthlete(\''+a.id+'\')">Modifica</button></td></tr>').join('')+'</tbody></table></div>':'<div class="empty">Nessuna atleta inserita. Premi “Aggiungi atleta” per iniziare.</div>')+'</section>'}
    function generateCode(){const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';const data=new Uint32Array(10);crypto.getRandomValues(data);return 'AM-'+Array.from(data,(v)=>chars[v%chars.length]).join('')}
    function openAthlete(id){const a=id?state.athletes.find((x)=>x.id===id):{membership_code:generateCode(),full_name:'',activity:'',instructor:'',monthly_price:'',subscription_expires_on:'',medical_certificate_expires_on:'',phone:'',contact:'',notes:'',active:true};state.editing=a;document.body.insertAdjacentHTML('beforeend','<div class="modal" id="athlete-modal"><div class="modal-box"><div class="card-head"><div><p class="eyebrow">SCHEDA ANAGRAFICA</p><h2>'+(id?'Modifica atleta':'Nuova atleta')+'</h2></div><button type="button" onclick="closeAthlete()">Chiudi</button></div><div class="form-grid" style="margin-top:16px">'+field('full_name','Nome e cognome',a.full_name,true)+field('membership_code','Codice tessera',a.membership_code,true)+activityField(a.activity)+selectField('instructor','Istruttrice',a.instructor,true,instructorOptions,'Seleziona istruttrice')+priceField(a.monthly_price)+field('phone','Telefono',a.phone,false)+field('contact','Contatto',a.contact,false)+field('subscription_expires_on','Scadenza abbonamento',a.subscription_expires_on,false,'date')+medicalField(a.medical_certificate_expires_on)+'<label class="field full"><span>Note</span><textarea id="f-notes">'+esc(a.notes||'')+'</textarea></label></div><div id="form-message" aria-live="polite"></div><div class="actions"><button class="save" id="save-athlete-button" type="button" onclick="saveAthlete({preventDefault:function(){}})">Salva scheda</button><button type="button" onclick="closeAthlete()">Annulla</button></div></div></div>')}
    function field(id,label,value,required,type){return '<label class="field"><span>'+label+'</span><input id="f-'+id+'" type="'+(type||'text')+'" value="'+esc(value||'')+'" '+(required?'required':'')+'></label>'}
    function activityField(value){const selected=String(value||'').split(',').map((item)=>item.trim()).filter(Boolean);return '<fieldset class="field full"><span>Attività · puoi sceglierne più di una</span><div class="choice-grid">'+activityOptions.map((option)=>'<label class="choice"><input type="checkbox" name="f-activity" value="'+esc(option)+'" '+(selected.includes(option)?'checked':'')+'><span>'+esc(option)+'</span></label>').join('')+'</div></fieldset>'}
    function priceField(value){return '<label class="field"><span>Prezzo mensile (€)</span><input id="f-monthly_price" type="text" inputmode="decimal" autocomplete="off" value="'+esc(value??'')+'" placeholder="0,00"><small class="muted">Puoi scrivere, per esempio, 45 oppure 45,50.</small></label>'}
    function normalizePrice(value){const cleaned=String(value??'').trim().replace(/\s+/g,'').replace(',','.');if(!cleaned)return '';if(!/^\d+(?:\.\d{1,2})?$/.test(cleaned))return null;const amount=Number(cleaned);return Number.isFinite(amount)&&amount>=0&&amount<=99999999.99?String(amount):null}
    function medicalStatus(value){if(!value)return '<span class="status neutral">Data non inserita</span>';const today=new Date();today.setHours(0,0,0,0);const expires=new Date(value+'T12:00:00');const days=Math.ceil((expires-today)/86400000);if(days<0)return '<span class="status danger">Scaduto da '+Math.abs(days)+' giorni</span>';if(days===0)return '<span class="status danger">Scade oggi</span>';if(days<=30)return '<span class="status warn">Scade tra '+days+' giorni</span>';return '<span class="status">Valido fino al '+fmt(value)+'</span>'}
    function medicalField(value){return '<label class="field"><span>Scadenza certificato medico</span><input id="f-medical_certificate_expires_on" type="date" value="'+esc(value||'')+'" onchange="updateMedicalAlert(this.value)"><div class="medical-alert" id="medical-alert">'+medicalStatus(value)+'</div></label>'}
    function updateMedicalAlert(value){document.getElementById('medical-alert').innerHTML=medicalStatus(value)}
    function selectField(id,label,value,required,sourceOptions,placeholder){const options=sourceOptions.slice();if(value&&!options.includes(value))options.unshift(value);return '<label class="field"><span>'+label+'</span><select id="f-'+id+'" '+(required?'required':'')+'><option value="">'+placeholder+'</option>'+options.map((option)=>'<option value="'+esc(option)+'" '+(option===value?'selected':'')+'>'+esc(option)+'</option>').join('')+'</select></label>'}
    function closeAthlete(){document.getElementById('athlete-modal')?.remove();state.editing=null}
    async function saveAthlete(event){event.preventDefault();const message=document.getElementById('form-message');const names=['full_name','membership_code','instructor','phone','contact','subscription_expires_on','medical_certificate_expires_on'];const payload={};names.forEach((name)=>{const value=document.getElementById('f-'+name).value.trim();payload[name]=value||null});const required=[['full_name','Inserisci il nome e cognome dell’atleta.'],['membership_code','Inserisci il codice tessera.'],['instructor','Seleziona un’istruttrice.']];for(const [name,text] of required){if(!payload[name]){message.innerHTML='<p class="notice error">'+text+'</p>';document.getElementById('f-'+name).focus();return}}payload.activity=Array.from(document.querySelectorAll('input[name="f-activity"]:checked')).map((item)=>item.value).join(', ');if(!payload.activity){message.innerHTML='<p class="notice error">Scegli almeno un’attività.</p>';return}const monthlyPrice=normalizePrice(document.getElementById('f-monthly_price').value);if(monthlyPrice===null){message.innerHTML='<p class="notice error">Inserisci il prezzo come 45 oppure 45,50.</p>';document.getElementById('f-monthly_price').focus();return}payload.monthly_price=monthlyPrice||null;payload.notes=document.getElementById('f-notes').value.trim()||null;payload.active=true;const button=document.getElementById('save-athlete-button');button.disabled=true;button.textContent='Salvataggio…';message.innerHTML='<p class="notice">Salvataggio in corso…</p>';try{await server('athletes.save',{id:state.editing.id||null,athlete:payload});closeAthlete();await loadAthletes('athletes')}catch(error){button.disabled=false;button.textContent='Salva scheda';message.innerHTML='<p class="notice error">Non è stato possibile salvare. Controlla i campi: il codice tessera deve essere unico.</p>'}}
    function renderExpiry(fieldName,title){document.getElementById('content').innerHTML='<section class="card"><div class="card-head"><div><p class="eyebrow">AGGIORNAMENTO MANUALE</p><h2>'+title+'</h2></div></div>'+(state.athletes.length?state.athletes.map((a)=>'<div class="attendance-row"><span><b>'+esc(a.full_name)+'</b><br><small class="muted">'+esc(a.activity)+'</small>'+(fieldName==='medical_certificate_expires_on'?'<br>'+medicalStatus(a[fieldName]):'')+'</span><input type="date" value="'+esc(a[fieldName]||'')+'" onchange="updateExpiry(\''+a.id+'\',\''+fieldName+'\',this.value)"></div>').join(''):'<div class="empty">Nessuna atleta inserita.</div>')+'<div id="expiry-message"></div></section>'}
    async function updateExpiry(id,fieldName,value){try{await server('athletes.expiry',{id,fieldName,value:value||null});document.getElementById('expiry-message').innerHTML='<p class="notice">Scadenza aggiornata.</p>'}catch{document.getElementById('expiry-message').innerHTML='<p class="notice error">Aggiornamento non riuscito.</p>'}}
    function renderAttendance(){const today=new Date().toISOString().slice(0,10);document.getElementById('content').innerHTML='<section class="card"><div class="card-head"><div><p class="eyebrow">AGGIORNAMENTO MANUALE</p><h2>Presenze</h2></div></div><div class="form-grid" style="margin-top:15px"><label class="field"><span>Data</span><input id="att-date" type="date" value="'+today+'"></label><label class="field"><span>Attività</span><select id="att-activity" required><option value="">Seleziona attività</option>'+activityOptions.map((option)=>'<option value="'+esc(option)+'">'+esc(option)+'</option>').join('')+'</select></label></div><div style="margin-top:16px">'+(state.athletes.length?state.athletes.map((a)=>'<label class="attendance-row"><span><b>'+esc(a.full_name)+'</b><br><small class="muted">'+esc(a.activity)+'</small></span><input class="att-check" type="checkbox" data-id="'+a.id+'"></label>').join(''):'<div class="empty">Nessuna atleta inserita.</div>')+'</div>'+(state.athletes.length?'<button class="small-btn" onclick="saveAttendance()">Salva presenze</button>':'')+'<div id="attendance-message"></div></section>'}
    async function saveAttendance(){const classDate=document.getElementById('att-date').value;const activity=document.getElementById('att-activity').value;if(!classDate||!activity){document.getElementById('attendance-message').innerHTML='<p class="notice error">Seleziona data e attività.</p>';return}const rows=Array.from(document.querySelectorAll('.att-check:checked')).map((el)=>({athlete_id:el.dataset.id,class_date:classDate,activity,present:true}));if(!rows.length){document.getElementById('attendance-message').innerHTML='<p class="notice error">Seleziona almeno un’atleta presente.</p>';return}try{await server('attendance.save',{rows});document.getElementById('attendance-message').innerHTML='<p class="notice">Presenze aggiunte. Le atlete già registrate per questa attività restano nel registro.</p>'}catch{document.getElementById('attendance-message').innerHTML='<p class="notice error">Salvataggio non riuscito.</p>'}}
    async function renderAttendanceLog(){const content=document.getElementById('content');content.innerHTML='<section class="card"><p class="muted">Caricamento registro…</p></section>';try{const data=await server('attendance.list');const rows=data.attendance||[];const groups=rows.reduce((all,row)=>{(all[row.activity]||(all[row.activity]=[])).push(row);return all},{});const sections=Object.entries(groups).sort((a,b)=>a[0].localeCompare(b[0],'it')).map(([activity,items])=>'<section class="card" style="margin-top:16px"><div class="card-head"><div><p class="eyebrow">ATTIVITÀ</p><h3>'+esc(activity)+'</h3></div><span class="status">'+items.length+' presenze</span></div><div class="table-wrap"><table class="table"><thead><tr><th>Data</th><th>Atleta</th><th></th></tr></thead><tbody>'+items.map((row)=>'<tr><td>'+fmt(row.class_date)+'</td><td><b>'+esc(row.athlete_name)+'</b></td><td><button id="delete-attendance-'+row.id+'" onclick="requestDeleteAttendance('+row.id+')">Elimina</button></td></tr>').join('')+'</tbody></table></div></section>').join('');content.innerHTML='<section class="card"><div class="card-head"><div><p class="eyebrow">STORICO PRESENZE</p><h2>Registro presenze</h2></div><span class="status">'+rows.length+' presenze</span></div><p class="muted">Le presenze sono divise per attività. Premi Elimina e poi Conferma elimina.</p></section>'+(rows.length?sections:'<section class="card" style="margin-top:16px"><div class="empty">Non ci sono ancora presenze salvate.</div></section>');if(rows.length)content.querySelector('.card-head').insertAdjacentHTML('beforeend','<button class="small-btn" onclick="exportAttendanceExcel()">Scarica Excel</button>')}catch{content.innerHTML='<p class="notice error">Non è stato possibile caricare il registro delle presenze.</p>'}}
    function requestDeleteAttendance(id){const button=document.getElementById('delete-attendance-'+id);if(!button)return;button.textContent='Conferma elimina';button.style.color='#a52d42';button.onclick=()=>deleteAttendance(id)}
    async function deleteAttendance(id){try{await server('attendance.delete',{id});renderAttendanceLog()}catch{const button=document.getElementById('delete-attendance-'+id);if(button){button.textContent='Elimina';button.style.color='';button.onclick=()=>requestDeleteAttendance(id)}alert('Non è stato possibile eliminare la presenza.')}}
    function xlsxText(value){return String(value??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;')}
    function xlsxBytes(parts){const size=parts.reduce((total,part)=>total+part.length,0),output=new Uint8Array(size);let offset=0;parts.forEach((part)=>{output.set(part,offset);offset+=part.length});return output}
    function xlsxCrc(bytes){let crc=0xffffffff;for(const byte of bytes){crc^=byte;for(let bit=0;bit<8;bit++)crc=(crc>>>1)^((crc&1)?0xedb88320:0)}return(crc^0xffffffff)>>>0}
    function xlsxNumber(target,offset,value,size){for(let i=0;i<size;i++)target[offset+i]=(value>>>(8*i))&255}
    function createXlsx(files){const encoder=new TextEncoder(),entries=files.map((file)=>{const name=encoder.encode(file.name),data=encoder.encode(file.text);return{name,data,crc:xlsxCrc(data)}}),locals=[],central=[];let offset=0;for(const entry of entries){const header=new Uint8Array(30+entry.name.length);xlsxNumber(header,0,0x04034b50,4);xlsxNumber(header,4,20,2);xlsxNumber(header,14,entry.crc,4);xlsxNumber(header,18,entry.data.length,4);xlsxNumber(header,22,entry.data.length,4);xlsxNumber(header,26,entry.name.length,2);header.set(entry.name,30);locals.push(header,entry.data);const directory=new Uint8Array(46+entry.name.length);xlsxNumber(directory,0,0x02014b50,4);xlsxNumber(directory,4,20,2);xlsxNumber(directory,6,20,2);xlsxNumber(directory,16,entry.crc,4);xlsxNumber(directory,20,entry.data.length,4);xlsxNumber(directory,24,entry.data.length,4);xlsxNumber(directory,28,entry.name.length,2);xlsxNumber(directory,42,offset,4);directory.set(entry.name,46);central.push(directory);offset+=header.length+entry.data.length}const centralBytes=xlsxBytes(central),end=new Uint8Array(22);xlsxNumber(end,0,0x06054b50,4);xlsxNumber(end,8,entries.length,2);xlsxNumber(end,10,entries.length,2);xlsxNumber(end,12,centralBytes.length,4);xlsxNumber(end,16,offset,4);return xlsxBytes([...locals,centralBytes,end])}
    async function exportAttendanceExcel(){try{const data=await server('attendance.list');const rows=data.attendance||[];if(!rows.length){alert('Non ci sono presenze da esportare.');return}const column=(index)=>String.fromCharCode(64+index),row=(index,values)=>'<row r="'+index+'">'+values.map((value,col)=>'<c r="'+column(col+1)+index+'" t="inlineStr"><is><t>'+xlsxText(value)+'</t></is></c>').join('')+'</row>',sheet='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>'+row(1,['Data','Attività','Atleta'])+rows.map((item,index)=>row(index+2,[fmt(item.class_date),item.activity,item.athlete_name])).join('')+'</sheetData></worksheet>',files=[{name:'[Content_Types].xml',text:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>'},{name:'_rels/.rels',text:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'},{name:'xl/workbook.xml',text:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Presenze" sheetId="1" r:id="rId1"/></sheets></workbook>'},{name:'xl/_rels/workbook.xml.rels',text:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>'},{name:'xl/worksheets/sheet1.xml',text:sheet}],blob=new Blob([createXlsx(files)],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='Aerial_Move_Presenze.xlsx';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}catch{alert('Non è stato possibile creare il file Excel.')}}
    restore();
  </script>
</body>
</html>`;

function cleanText(value, max = 200) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string") throw new Error("Invalid field");
  return value.trim().slice(0, max) || null;
}

function cleanMembershipCode(value) {
  const code = cleanText(value, 64);
  return code ? code.toUpperCase().replace(/\s+/g, "") : null;
}

function cleanDate(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error("Invalid date");
  return value;
}

function cleanTime(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string" || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value)) throw new Error("Invalid time");
  return value;
}

function italyClock() {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Rome",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date()).filter((part) => part.type !== "literal").map((part) => [part.type, part.value]),
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

function pilatesBookingWindow(bookingDate, timeSlot) {
  const match = /^(\d{2}):(\d{2})–/.exec(String(timeSlot || ""));
  if (!match) return { open: false, deadline: "" };
  const startsAt = Number(match[1]) * 60 + Number(match[2]);
  const deadlineMinutes = (startsAt - 120 + 1440) % 1440;
  return {
    open: bookingChangeWindow(bookingDate, `${String(Math.floor(startsAt / 60)).padStart(2, "0")}:${String(startsAt % 60).padStart(2, "0")}`, 120),
    deadline: `${String(Math.floor(deadlineMinutes / 60)).padStart(2, "0")}:${String(deadlineMinutes % 60).padStart(2, "0")}`,
  };
}

function bookingChangeWindow(bookingDate, bookingTime, cutoffMinutes = 180) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(bookingDate || "")) || !/^\d{2}:\d{2}/.test(String(bookingTime || ""))) return false;
  const now = italyClock();
  const dayNumber = (value) => {
    const [year, month, day] = value.split("-").map(Number);
    return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
  };
  const targetMinutes = Number(bookingTime.slice(0, 2)) * 60 + Number(bookingTime.slice(3, 5));
  const minutesUntilStart = (dayNumber(bookingDate) - dayNumber(now.date)) * 1440 + targetMinutes - now.minutes;
  return minutesUntilStart > cutoffMinutes;
}

function addMonths(dateString, months) {
  if (!dateString) return null;
  const date = new Date(`${dateString}T12:00:00Z`);
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0, 12)).getUTCDate();
  date.setUTCDate(Math.min(day, lastDay));
  return date.toISOString().slice(0, 10);
}

function mappedPilatesPayment(activity, payment) {
  const normalizedActivity = String(activity || "").trim().toLowerCase();
  if (String(payment?.activity || "").trim().toLowerCase() !== normalizedActivity || !payment?.paid_on) return null;
  const amount = Number(payment.amount);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  // Le quote promozionali restano pacchetti validi: cambia il prezzo, non il numero di lezioni.
  if (normalizedActivity === "pilates base") {
    return { ...payment, months: 1, credits: 6 };
  }
  if (normalizedActivity === "bungee fly") {
    return { ...payment, months: 2, credits: 8 };
  }
  if (normalizedActivity !== "pilates plus") return null;
  const months = Math.abs(amount - 142.5) < 0.001 ? 3
    : Math.abs(amount - 270) < 0.001 ? 6
    : (Math.abs(amount - 400) < 0.001 || Math.abs(amount - 425) < 0.001) ? 10
    : 1;
  const coverage = String(payment.period_note || "").match(/^Copertura (\d{4}-\d{2}-\d{2})\/(\d{4}-\d{2}-\d{2})$/);
  return { ...payment, months, credits: months * 8, startsOn: coverage?.[1] || payment.paid_on, endsOn: coverage?.[2] || null };
}

function pilatesPaymentPlan(activity, payments = []) {
  const normalizedActivity = String(activity || "").trim().toLowerCase();
  const deduplicated = new Map();
  for (const row of payments) {
    const mapped = mappedPilatesPayment(normalizedActivity, row);
    if (!mapped) continue;
    const reference = String(row.period_note || "").trim().toLowerCase();
    const key = reference || `${row.paid_on}|${Number(row.amount)}`;
    const previous = deduplicated.get(key);
    if (!previous || Number(mapped.id || 0) > Number(previous.id || 0)) deduplicated.set(key, mapped);
  }
  const packages = [...deduplicated.values()]
    .sort((a, b) => String(a.startsOn || a.paid_on).localeCompare(String(b.startsOn || b.paid_on)) || Number(a.id || 0) - Number(b.id || 0));
  if (!packages.length) return null;

  const chain = [packages[packages.length - 1]];
  for (let index = packages.length - 2; index >= 0; index -= 1) {
    const candidate = packages[index];
    if (addMonths(candidate.startsOn || candidate.paid_on, Math.max(candidate.months, 2)) >= (chain[0].startsOn || chain[0].paid_on)) chain.unshift(candidate);
    else break;
  }

  const latest = chain[chain.length - 1];
  return {
    startsOn: chain[0].startsOn || chain[0].paid_on,
    expiresOn: latest.endsOn || addMonths(latest.startsOn || latest.paid_on, Math.max(latest.months, 2)),
    months: chain.reduce((sum, item) => sum + item.months, 0),
    limit: chain.reduce((sum, item) => sum + item.credits, 0),
    payment: latest,
    periods: chain.length,
  };
}

function bookingMatchesPackage(row, planName) {
  const bookedActivity = String(row?.activity || "").trim().toLowerCase();
  if (planName.startsWith("Pilates")) return !bookedActivity || bookedActivity.startsWith("pilates");
  return planName === "Bungee Fly" && (bookedActivity === "bungee fitness" || bookedActivity === "bungee fly");
}

function enrichBookingsWithActivities(bookings = [], sessions = []) {
  const activities = new Map(sessions.map((row) => [`${row.session_date}|${row.time_slot}`, row.activity]));
  return bookings.map((row) => ({ ...row, activity: row.activity || activities.get(`${row.booking_date}|${row.time_slot}`) || null }));
}

function subscriptionPackages(athlete, bookings = [], attendance = [], payments = []) {
  const activities = String(athlete.activity || "").split(",").map((value) => value.trim().toLowerCase());
  const definitions = [
    { name: "Pilates Base", key: "pilates_base_started_on", limit: 6, validityMonths: 2, source: "presenze e prenotazioni" },
    { name: "Pilates Plus", key: "pilates_plus_started_on", limit: 8, validityMonths: 2, source: "presenze e prenotazioni" },
    { name: "Bungee Fly", key: "bungee_fly_started_on", limit: 8, validityMonths: 2, source: "presenze e prenotazioni" },
  ];
  const today = italyClock().date;
  return definitions.filter((plan) => activities.includes(plan.name.toLowerCase())).map((plan) => {
    const prepaidPlan = pilatesPaymentPlan(plan.name, payments);
    const packageLimit = prepaidPlan?.limit || plan.limit;
    const bookedDates = bookings.filter((row) => bookingMatchesPackage(row, plan.name)).map((row) => row.booking_date);
    const attendedDates = attendance
      .filter((row) => String(row.activity || "").trim().toLowerCase() === plan.name.toLowerCase())
      .map((row) => row.class_date);
    const lessonDates = [...new Set([...bookedDates, ...attendedDates].filter(Boolean))].sort();
    const trialDate = plan.name.startsWith("Pilates") && lessonDates[0] >= PILATES_TRIAL_START_DATE ? lessonDates[0] : null;
    const countedLessonDates = lessonDates.filter((date) => date !== trialDate);
    // Una data di inizio impostata dall'istruttrice può includere lezioni precedenti al pagamento.
    // Una data iniziale esplicita può precedere un pagamento tardivo fino a due mesi.
    const recordedStart = athlete[plan.key];
    const useRecordedStart = !!(prepaidPlan && recordedStart &&
      recordedStart < prepaidPlan.startsOn &&
      Date.parse(prepaidPlan.startsOn) - Date.parse(recordedStart) <= 62 * 86400000);
    // Una lezione precedente al versamento, nello stesso mese e non di prova, appartiene al pacchetto.
    const firstCountedDate = countedLessonDates[0];
    const inferredStart = prepaidPlan?.startsOn && firstCountedDate &&
      firstCountedDate < prepaidPlan.startsOn &&
      firstCountedDate.slice(0, 7) === prepaidPlan.startsOn.slice(0, 7) &&
      Date.parse(prepaidPlan.startsOn) - Date.parse(firstCountedDate) <= 31 * 86400000
        ? firstCountedDate : null;
    const startsOn = (useRecordedStart ? recordedStart : null) || inferredStart || prepaidPlan?.startsOn || recordedStart || firstCountedDate || null;
    if (!startsOn) return { activity: plan.name, limit: packageLimit, used: 0, remaining: packageLimit, starts_on: null, expires_on: null, source: plan.source, expired: false, needs_start: true, trial_date: trialDate, prepaid_months: prepaidPlan?.months || null, prepaid_periods: prepaidPlan?.periods || null };
    const deadline = (useRecordedStart || inferredStart) && prepaidPlan.periods === 1
      ? addMonths(startsOn, Math.max(prepaidPlan.months, plan.validityMonths))
      : (prepaidPlan?.expiresOn || addMonths(startsOn, plan.validityMonths));
    const dates = countedLessonDates.filter((date) => date >= startsOn && date <= deadline);
    const used = dates.length;
    const completedOn = used >= packageLimit ? dates[packageLimit - 1] : null;
    const expiresOn = completedOn && completedOn < deadline ? completedOn : deadline;
    return {
      activity: plan.name,
      limit: packageLimit,
      used,
      remaining: Math.max(0, packageLimit - used),
      starts_on: startsOn,
      expires_on: expiresOn,
      source: plan.source,
      expired: today > expiresOn || used >= packageLimit,
      needs_start: false,
      trial_date: trialDate,
      prepaid_months: prepaidPlan?.months || null,
      prepaid_periods: prepaidPlan?.periods || null,
    };
  });
}
function cleanMoney(value) {
  if (value === null || value === undefined || value === "") return null;
  const normalized = typeof value === "string" ? value.trim().replace(/\s+/g, "").replace(",", ".") : value;
  const amount = Number(normalized);
  if (!Number.isFinite(amount) || amount < 0 || amount > 99999999.99) throw new Error("Invalid price");
  return Math.round(amount * 100) / 100;
}

function cleanUuid(value) {
  if (typeof value !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) throw new Error("Invalid id");
  return value;
}

async function handlePost(request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin && !ALLOWED_ORIGINS.has(origin)) return json({ error: "Richiesta non consentita." }, 403);
  const input = await request.json().catch(() => null);
  if (!input || typeof input.action !== "string") return json({ error: "Richiesta non valida." }, 400);

  if (input.action === "activate") {
    const role = input.role;
    if (!Object.hasOwn(ROLE_EMAILS, role) || typeof input.password !== "string" || input.password.length < 8 || input.password.length > 128) {
      return json({ error: "Dati non validi." }, 400);
    }
    try {
      await authFetch(`/auth/v1/signup?redirect_to=${encodeURIComponent(APP_URL)}`, {
        email: ROLE_EMAILS[role],
        password: input.password,
      });
      return json({ ok: true });
    } catch {
      return json({ error: "Attivazione non riuscita." }, 400);
    }
  }

  if (input.action === "login") {
    const role = input.role;
    if (!Object.hasOwn(ROLE_EMAILS, role) || typeof input.password !== "string" || input.password.length > 128) {
      return json({ error: "Dati non validi." }, 400);
    }
    try {
      const sessionSeconds = input.remember === true ? REMEMBERED_SESSION_SECONDS : SESSION_SECONDS;
      const login = await authFetch("/auth/v1/token?grant_type=password", { email: ROLE_EMAILS[role], password: input.password });
      const profiles = await serverFetch(`/rest/v1/profiles?id=eq.${login.user.id}&select=role,display_name&limit=1`);
      if (!profiles?.[0] || profiles[0].role !== role) throw new Error("Unauthorized role");
      await serverFetch(`/rest/v1/web_sessions?expires_at=lt.${encodeURIComponent(new Date().toISOString())}`, { method: "DELETE" });
      const token = randomToken();
      await serverFetch("/rest/v1/web_sessions", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          token_hash: await hashToken(token),
          user_id: login.user.id,
          role,
          expires_at: new Date(Date.now() + sessionSeconds * 1000).toISOString(),
        }),
      });
      return json(
        { profile: profiles[0], token },
        200,
        { "set-cookie": `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${sessionSeconds}; HttpOnly; Secure; SameSite=Lax` },
      );
    } catch {
      return json({ error: "Accesso non riuscito." }, 401);
    }
  }

  if (input.action === "guest.request.create") {
    const firstName = cleanText(input.firstName, 100);
    const lastName = cleanText(input.lastName, 100);
    const activity = cleanText(input.activity, 120);
    if (!firstName || !lastName || !activity || !COURSE_ACTIVITIES.includes(activity)) {
      return json({ error: "Inserisci nome, cognome e un’attività valida." }, 400);
    }
    await serverFetch("/rest/v1/guest_requests", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ first_name: firstName, last_name: lastName, activity, status: "nuova" }),
    });
    await notifyInstructors({
      title: "Nuova richiesta ospite",
      body: `${firstName} ${lastName} è interessata a ${activity}.`,
      url: "?open=guest-requests",
      tag: `ospite-${firstName.toLocaleLowerCase("it")}-${lastName.toLocaleLowerCase("it")}-${Date.now()}`,
      activities: [activity],
    });
    return json({ ok: true });
  }

  if (input.action === "guest.reformer.sessions") {
    const today = italyClock().date;
    const [sessions, athleteBookings, guestBookings] = await Promise.all([
      serverFetch(`/rest/v1/pilates_sessions?session_date=gte.${today}&activity=eq.${encodeURIComponent("Pilates Reformer")}&published_at=not.is.null&select=id,session_date,start_time,end_time,time_slot,location,capacity&order=session_date.asc,start_time.asc`),
      serverFetch(`/rest/v1/pilates_bookings?booking_date=gte.${today}&select=booking_date,time_slot`),
      serverFetch("/rest/v1/guest_pilates_bookings?select=session_id"),
    ]);
    return json({ sessions: sessions.map((row) => {
      const count = athleteBookings.filter((booking) => booking.booking_date === row.session_date && booking.time_slot === row.time_slot).length + guestBookings.filter((booking) => Number(booking.session_id) === Number(row.id)).length;
      const window = pilatesBookingWindow(row.session_date, row.time_slot);
      return { ...row, start_time: String(row.start_time || "").slice(0, 5), end_time: String(row.end_time || "").slice(0, 5), count, remaining: Math.max(0, Number(row.capacity) - count), booking_open: window.open, booking_deadline: window.deadline };
    }) });
  }

  if (input.action === "guest.reformer.book") {
    const sessionId = Number(input.sessionId);
    const firstName = cleanText(input.firstName, 100);
    const lastName = cleanText(input.lastName, 100);
    if (!Number.isSafeInteger(sessionId) || sessionId < 1 || !firstName || !lastName) return json({ error: "Inserisci nome, cognome e turno." }, 400);
    const sessions = await serverFetch(`/rest/v1/pilates_sessions?id=eq.${sessionId}&activity=eq.${encodeURIComponent("Pilates Reformer")}&published_at=not.is.null&select=session_date,time_slot,location&limit=1`);
    const sessionRow = sessions?.[0];
    if (!sessionRow) return json({ error: "Questo turno Pilates Reformer non è disponibile." }, 404);
    const existingPath = `/rest/v1/guest_pilates_bookings?session_id=eq.${sessionId}&first_name=eq.${encodeURIComponent(firstName)}&last_name=eq.${encodeURIComponent(lastName)}&select=id&limit=1`;
    const confirmation = { session_id: sessionId, booking_date: sessionRow.session_date, time_slot: sessionRow.time_slot };
    if ((await serverFetch(existingPath)).length) return json({ ok: true, alreadyBooked: true, booking: confirmation });
    const sameDaySessions = await serverFetch(`/rest/v1/pilates_sessions?session_date=eq.${sessionRow.session_date}&activity=eq.${encodeURIComponent("Pilates Reformer")}&select=id,time_slot`);
    const sameDayIds = sameDaySessions.map((row) => Number(row.id)).filter((id) => Number.isSafeInteger(id));
    const sameDayGuestBookings = sameDayIds.length
      ? await serverFetch(`/rest/v1/guest_pilates_bookings?session_id=in.(${sameDayIds.join(",")})&select=id,session_id,first_name,last_name&limit=500`)
      : [];
    const previousRow = sameDayGuestBookings.find((row) => Number(row.session_id) !== sessionId
      && String(row.first_name || "").trim().toLocaleLowerCase("it") === firstName.toLocaleLowerCase("it")
      && String(row.last_name || "").trim().toLocaleLowerCase("it") === lastName.toLocaleLowerCase("it"));
    const previousSlot = sameDaySessions.find((row) => Number(row.id) === Number(previousRow?.session_id))?.time_slot || null;
    try {
      await serverFetch("/rest/v1/rpc/book_guest_pilates_reformer_slot", { method: "POST", body: JSON.stringify({ p_session_id: sessionId, p_first_name: firstName, p_last_name: lastName }) });
    } catch (error) {
      // Un doppio tocco o una risposta persa non devono creare un’altra prenotazione.
      const existing = await serverFetch(existingPath);
      if (existing.length) return json({ ok: true, alreadyBooked: true, booking: confirmation });
      return pilatesBookingError(error);
    }
    try {
      await notifyInstructors({ title: previousRow ? "Cambio prenotazione ospite" : "Nuova prenotazione ospite", body: previousRow ? `${firstName} ${lastName} ha spostato Pilates Reformer il ${sessionRow.session_date} da ${previousSlot || "un altro turno"} a ${sessionRow.time_slot}.` : `${firstName} ${lastName} ha prenotato Pilates Reformer il ${sessionRow.session_date} · ${sessionRow.time_slot}.`, url: "?open=pilates", tag: `ospite-reformer-${sessionId}`, activities: ["Pilates Reformer"] });
    } catch {
      // Un errore della notifica non deve far risultare fallita una prenotazione già salvata.
      console.error("Guest booking saved; instructor notification failed");
    }
    return json({ ok: true, alreadyBooked: false, replaced: Boolean(previousRow), previous_time_slot: previousSlot, booking: confirmation });
  }

  const session = await sessionFor(request);
  if (input.action === "logout") {
    if (session) await serverFetch(`/rest/v1/web_sessions?token_hash=eq.${session.tokenHash}`, { method: "DELETE" });
    return json({ ok: true }, 200, { "set-cookie": `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax` });
  }
  if (!session) return json({ error: "Sessione scaduta." }, 401);
  if (input.action === "session") return json({ profile: session.profile });

  if (input.action === "athlete.password.update") {
    requireRole(session, "istruttrici");
    if (typeof input.password !== "string" || input.password.length < 8 || input.password.length > 128) {
      return json({ error: "Password non valida." }, 400);
    }
    try {
      const profiles = await serverFetch("/rest/v1/profiles?role=eq.atlete&select=id&limit=1");
      const athleteUserId = profiles?.[0]?.id;
      if (!athleteUserId) throw new Error("Athlete profile missing");
      await serverFetch(`/auth/v1/admin/users/${athleteUserId}`, {
        method: "PUT",
        body: JSON.stringify({ password: input.password }),
      });
      await serverFetch(`/rest/v1/web_sessions?user_id=eq.${athleteUserId}`, { method: "DELETE" });
      return json({ ok: true });
    } catch {
      return json({ error: "Aggiornamento non riuscito." }, 400);
    }
  }

  if (input.action === "metrics") {
    requireRole(session, "istruttrici");
    const rows = await serverFetch("/rest/v1/athletes?active=eq.true&select=id,activity,subscription_expires_on,medical_certificate_expires_on,pilates_base_started_on,pilates_plus_started_on,bungee_fly_started_on");
    const bookings = await serverFetch("/rest/v1/pilates_bookings?select=athlete_id,booking_date,time_slot");
    const sessions = await serverFetch("/rest/v1/pilates_sessions?select=session_date,time_slot,activity&limit=10000");
    const enrichedBookings = enrichBookingsWithActivities(bookings, sessions);
    const attendance = await serverFetch("/rest/v1/attendance?present=eq.true&select=athlete_id,class_date,activity");
    const payments = await serverFetch("/rest/v1/payment_history?select=id,athlete_id,paid_on,activity,amount,period_note&order=paid_on.desc,created_at.desc&limit=10000");
    const limit = new Date(Date.now() + 14 * 86400000);
    return json({
      athletes: rows.length,
      subscriptions: rows.filter((row) => {
        const packages = subscriptionPackages(row, enrichedBookings.filter((item) => item.athlete_id === row.id), attendance.filter((item) => item.athlete_id === row.id), payments.filter((item) => item.athlete_id === row.id));
        return packages.some((item) => item.needs_start || item.expired || item.remaining <= 1 || (item.expires_on && new Date(item.expires_on) <= limit)) || (!packages.length && row.subscription_expires_on && new Date(row.subscription_expires_on) <= limit);
      }).length,
      medical: rows.filter((row) => row.medical_certificate_expires_on && new Date(row.medical_certificate_expires_on) <= limit).length,
    });
  }

  if (input.action === "athletes.list") {
    requireRole(session, "istruttrici");
    const athletes = await serverFetch("/rest/v1/athletes?active=eq.true&select=*&order=full_name.asc");
    const bookings = await serverFetch("/rest/v1/pilates_bookings?select=athlete_id,booking_date,time_slot");
    const sessions = await serverFetch("/rest/v1/pilates_sessions?select=session_date,time_slot,activity&limit=10000");
    const enrichedBookings = enrichBookingsWithActivities(bookings, sessions);
    const attendance = await serverFetch("/rest/v1/attendance?present=eq.true&select=athlete_id,class_date,activity");
    const payments = await serverFetch("/rest/v1/payment_history?select=id,athlete_id,paid_on,activity,amount,period_note&order=paid_on.desc,created_at.desc&limit=10000");
    return json({ athletes: athletes.map((athlete) => ({
      ...athlete,
      packages: subscriptionPackages(athlete, enrichedBookings.filter((row) => row.athlete_id === athlete.id), attendance.filter((row) => row.athlete_id === athlete.id), payments.filter((row) => row.athlete_id === athlete.id)),
      payments: payments.filter((row) => row.athlete_id === athlete.id),
    })) });
  }

  if (input.action === "athletes.save") {
    requireRole(session, "istruttrici");
    const source = input.athlete || {};
    const athlete = {
      full_name: cleanText(source.full_name),
      membership_code: cleanText(source.membership_code, 64),
      activity: cleanText(source.activity),
      instructor: cleanText(source.instructor),
      phone: cleanText(source.phone, 40),
      contact: cleanText(source.contact),
      subscription_expires_on: cleanDate(source.subscription_expires_on),
      pilates_base_started_on: cleanDate(source.pilates_base_started_on),
      pilates_plus_started_on: cleanDate(source.pilates_plus_started_on),
      bungee_fly_started_on: cleanDate(source.bungee_fly_started_on),
      medical_certificate_expires_on: cleanDate(source.medical_certificate_expires_on),
      monthly_price: cleanMoney(source.monthly_price),
      notes: cleanText(source.notes, 2000),
      active: source.active !== false,
    };
    if (!athlete.full_name || !athlete.membership_code || !athlete.activity || !athlete.instructor) throw new Error("Missing fields");
    if (input.id) {
      await serverFetch(`/rest/v1/athletes?id=eq.${cleanUuid(input.id)}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(athlete) });
    } else {
      await serverFetch("/rest/v1/athletes", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(athlete) });
    }
    return json({ ok: true });
  }

  if (input.action === "athletes.delete") {
    requireRole(session, "istruttrici");
    const id = cleanUuid(input.id);
    const rows = await serverFetch(`/rest/v1/athletes?id=eq.${id}&active=eq.true&select=id,full_name&limit=1`);
    if (!rows?.[0]) return json({ error: "Scheda atleta non trovata." }, 404);
    const today = italyClock().date;
    await serverFetch(`/rest/v1/athletes?id=eq.${id}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ active: false }),
    });
    await Promise.all([
      serverFetch(`/rest/v1/pilates_bookings?athlete_id=eq.${id}&booking_date=gte.${today}`, { method: "DELETE" }),
      serverFetch(`/rest/v1/private_lesson_bookings?athlete_id=eq.${id}&booking_date=gte.${today}`, { method: "DELETE" }),
    ]);
    return json({ ok: true });
  }

  if (input.action === "athletes.expiry") {
    requireRole(session, "istruttrici");
    if (!new Set(["subscription_expires_on", "medical_certificate_expires_on", "pilates_base_started_on", "pilates_plus_started_on", "bungee_fly_started_on"]).has(input.fieldName)) throw new Error("Invalid field");
    await serverFetch(`/rest/v1/athletes?id=eq.${cleanUuid(input.id)}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ [input.fieldName]: cleanDate(input.value) }),
    });
    return json({ ok: true });
  }

  if (input.action === "request.create") {
    requireRole(session, "atlete");
    const membershipCode = cleanMembershipCode(input.membershipCode);
    const message = cleanText(input.message, 1200);
    if (!membershipCode || !message) return json({ error: "Inserisci il codice tessera e la richiesta." }, 400);
    const athletes = await serverFetch(`/rest/v1/athletes?membership_code=eq.${encodeURIComponent(membershipCode)}&active=eq.true&select=id,full_name,instructor&limit=1`);
    if (!athletes?.[0]) return json({ error: "Codice tessera non trovato." }, 404);
    await serverFetch("/rest/v1/information_requests", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ athlete_id: athletes[0].id, message, status: "nuova" }),
    });
    await notifyInstructors({
      title: "Nuova richiesta di informazioni",
      body: `${athletes[0].full_name || "Un’atleta"} ha inviato una richiesta. Tessera ${membershipCode}.`,
      url: "?open=requests",
      tag: `richiesta-${athletes[0].id}`,
      instructorNames: csvList(athletes[0].instructor),
    });
    return json({ ok: true });
  }

  if (input.action === "request.list") {
    requireRole(session, "istruttrici");
    const rows = await serverFetch("/rest/v1/information_requests?select=id,message,status,created_at,handled_at,athletes(full_name,membership_code)&order=created_at.desc&limit=5000");
    return json({ requests: rows.map((row) => ({
      id: row.id,
      message: row.message,
      status: row.status,
      created_at: row.created_at,
      handled_at: row.handled_at,
      full_name: row.athletes?.full_name || "Atleta non disponibile",
      membership_code: row.athletes?.membership_code || "Non disponibile",
    })) });
  }

  if (input.action === "request.status") {
    requireRole(session, "istruttrici");
    const id = Number(input.id);
    const status = input.status === "gestita" ? "gestita" : input.status === "nuova" ? "nuova" : null;
    if (!Number.isSafeInteger(id) || id < 1 || !status) return json({ error: "Richiesta non valida." }, 400);
    const updated = await serverFetch(`/rest/v1/information_requests?id=eq.${id}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ status, handled_at: status === "gestita" ? new Date().toISOString() : null }),
    });
    if (!Array.isArray(updated) || updated.length !== 1) return json({ error: "Richiesta non trovata." }, 404);
    return json({ ok: true });
  }

  if (input.action === "guest.request.list") {
    requireRole(session, "istruttrici");
    const rows = await serverFetch("/rest/v1/guest_requests?select=id,first_name,last_name,activity,status,created_at,handled_at&order=created_at.desc&limit=5000");
    return json({ requests: rows.map((row) => ({
      id: row.id,
      first_name: row.first_name,
      last_name: row.last_name,
      activity: row.activity,
      status: row.status,
      created_at: row.created_at,
      handled_at: row.handled_at,
    })) });
  }

  if (input.action === "guest.request.status") {
    requireRole(session, "istruttrici");
    const id = Number(input.id);
    const status = input.status === "gestita" ? "gestita" : input.status === "nuova" ? "nuova" : null;
    if (!Number.isSafeInteger(id) || id < 1 || !status) return json({ error: "Richiesta non valida." }, 400);
    const updated = await serverFetch(`/rest/v1/guest_requests?id=eq.${id}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ status, handled_at: status === "gestita" ? new Date().toISOString() : null }),
    });
    if (!Array.isArray(updated) || updated.length !== 1) return json({ error: "Richiesta non trovata." }, 404);
    return json({ ok: true });
  }

  if (input.action === "attendance.save") {
    requireRole(session, "istruttrici");
    if (!Array.isArray(input.rows) || input.rows.length > 500) throw new Error("Invalid rows");
    const rows = input.rows.map((row) => ({
      athlete_id: cleanUuid(row.athlete_id),
      class_date: cleanDate(row.class_date),
      activity: cleanText(row.activity),
      present: Boolean(row.present),
    }));
    await serverFetch("/rest/v1/attendance?on_conflict=athlete_id,class_date,activity", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(rows),
    });
    return json({ ok: true });
  }

  if (input.action === "attendance.list") {
    requireRole(session, "istruttrici");
    const rows = await serverFetch("/rest/v1/attendance?present=eq.true&select=id,class_date,activity,recorded_at,athletes(full_name)&order=class_date.desc,recorded_at.desc&limit=5000");
    return json({
      attendance: rows.map((row) => ({
        id: row.id,
        class_date: row.class_date,
        activity: row.activity,
        athlete_name: row.athletes?.full_name || "Atleta non disponibile",
      })),
    });
  }

  if (input.action === "attendance.delete") {
    requireRole(session, "istruttrici");
    const id = Number(input.id);
    if (!Number.isSafeInteger(id) || id < 1) return json({ error: "Presenza non valida." }, 400);
    await serverFetch(`/rest/v1/attendance?id=eq.${id}`, { method: "DELETE" });
    return json({ ok: true });
  }

  if (input.action === "summary.list") {
    requireRole(session, "istruttrici");
    const athletes = await serverFetch("/rest/v1/athletes?select=id,membership_code,full_name,activity,monthly_price,active&order=full_name.asc");
    const attendance = await serverFetch("/rest/v1/attendance?present=eq.true&select=id,athlete_id,class_date,activity&order=class_date.desc,recorded_at.desc&limit=10000");
    const payments = await serverFetch("/rest/v1/payment_history?select=id,athlete_id,paid_on,activity,amount,period_note&order=paid_on.desc,created_at.desc&limit=10000");
    return json({ athletes, attendance, payments });
  }

  if (input.action === "payment.save") {
    requireRole(session, "istruttrici");
    const amount = cleanMoney(input.amount);
    const payment = {
      athlete_id: cleanUuid(input.athleteId),
      paid_on: cleanDate(input.paidOn),
      activity: cleanText(input.activity),
      amount,
      period_note: cleanText(input.periodNote, 200),
    };
    if (!payment.paid_on || !payment.activity || amount === null || amount <= 0) return json({ error: "Dati del pagamento non validi." }, 400);
    await serverFetch("/rest/v1/payment_history", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(payment),
    });
    return json({ ok: true });
  }

  if (input.action === "payment.update") {
    requireRole(session, "istruttrici");
    const id = Number(input.id);
    const amount = cleanMoney(input.amount);
    const payment = {
      paid_on: cleanDate(input.paidOn),
      activity: cleanText(input.activity),
      amount,
      period_note: cleanText(input.periodNote, 200),
    };
    if (!Number.isSafeInteger(id) || id < 1) return json({ error: "Pagamento non valido." }, 400);
    if (!payment.paid_on || !payment.activity || amount === null || amount <= 0) return json({ error: "Dati del pagamento non validi." }, 400);
    const updated = await serverFetch(`/rest/v1/payment_history?id=eq.${id}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(payment),
    });
    if (!Array.isArray(updated) || updated.length !== 1) return json({ error: "Pagamento non trovato." }, 404);
    return json({ ok: true, payment: updated[0] });
  }

  if (input.action === "payment.delete") {
    requireRole(session, "istruttrici");
    const id = Number(input.id);
    if (!Number.isSafeInteger(id) || id < 1) return json({ error: "Pagamento non valido." }, 400);
    await serverFetch(`/rest/v1/payment_history?id=eq.${id}`, { method: "DELETE" });
    return json({ ok: true });
  }

  if (input.action === "notifications.public-key") {
    if (!["atlete", "istruttrici"].includes(session.role)) throw new Error("Unauthorized");
    const vapid = await vapidDetails();
    return json({ publicKey: vapid.publicKey });
  }

  if (input.action === "notifications.subscribe") {
    if (!["atlete", "istruttrici"].includes(session.role)) throw new Error("Unauthorized");
    const subscription = input.subscription || {};
    const endpoint = cleanText(subscription.endpoint, 2048);
    const p256dh = cleanText(subscription.keys?.p256dh, 200);
    const auth = cleanText(subscription.keys?.auth, 100);
    let endpointUrl = null;
    try { endpointUrl = new URL(endpoint); } catch { endpointUrl = null; }
    if (!endpointUrl || endpointUrl.protocol !== "https:" || !p256dh || !auth) return json({ error: "Iscrizione alle notifiche non valida." }, 400);
    const instructorNames = session.role === "istruttrici" ? normalizedList(input.instructorNames, INSTRUCTOR_NAMES) : [];
    const activities = session.role === "istruttrici" ? normalizedList(input.activities, COURSE_ACTIVITIES) : [];
    if (session.role === "istruttrici" && !instructorNames.length && !activities.length) return json({ error: "Scegli almeno un nome o un’attività." }, 400);
    await serverFetch("/rest/v1/push_subscriptions?on_conflict=endpoint", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ endpoint, p256dh, auth, role: session.role, instructor_names: instructorNames, activities, updated_at: new Date().toISOString(), last_error: null }),
    });
    return json({ ok: true });
  }

  if (input.action === "notifications.list") {
    if (!["atlete", "istruttrici"].includes(session.role)) throw new Error("Unauthorized");
    const audience = session.role === "istruttrici" ? "istruttrici,tutti" : "atlete,tutti";
    const rows = await serverFetch(`/rest/v1/app_notifications?audience=in.(${audience})&select=id,title,body,target_url,created_at,instructor_names,activities&order=created_at.desc&limit=20`);
    return json({ notifications: rows });
  }

  if (input.action === "pilates.sessions.list") {
    if (!["atlete", "istruttrici"].includes(session.role)) throw new Error("Unauthorized");
    const today = italyClock().date;
    const rows = await serverFetch(`/rest/v1/pilates_sessions?session_date=gte.${today}&published_at=not.is.null&select=id,session_date,start_time,end_time,time_slot,location,activity,capacity,published_at&order=session_date.asc,start_time.asc`);
    return json({ sessions: rows.map((row) => ({ ...row, start_time: String(row.start_time || "").slice(0, 5), end_time: String(row.end_time || "").slice(0, 5) })) });
  }

  if (input.action === "pilates.sessions.publish") {
    requireRole(session, "istruttrici");
    const legacyDate = cleanDate(input.sessionDate);
    const requested = Array.isArray(input.sessions)
      ? input.sessions
      : (Array.isArray(input.slots) ? input.slots.map((slot) => ({ ...slot, sessionDate: legacyDate })) : []);
    if (!requested.length || requested.length > 15) return json({ error: "Inserisci da 1 a 15 lezioni alla volta." }, 400);
    const slots = requested.map((slot) => {
      const sessionDate = cleanDate(slot.sessionDate);
      const startTime = cleanTime(slot.startTime);
      const endTime = cleanTime(slot.endTime);
      const location = cleanText(slot.location, 160) || "Aerial Move · Villa d’Agri";
      const activity = ["Pilates", "Pilates Reformer", "Bungee Fitness"].includes(slot.activity) ? slot.activity : "Pilates";
      if (!sessionDate || sessionDate < italyClock().date) throw new Error("La data di ogni lezione deve essere oggi o futura.");
      if (!startTime || !endTime || endTime <= startTime) throw new Error("L’orario di fine deve essere successivo all’orario di inizio.");
      return { session_date: sessionDate, start_time: startTime, end_time: endTime, time_slot: `${startTime}–${endTime}`, location, activity, capacity: 5, published_at: new Date().toISOString() };
    });
    if (new Set(slots.map((slot) => `${slot.session_date}|${slot.time_slot}`)).size !== slots.length) return json({ error: "Hai inserito due volte la stessa lezione." }, 400);
    const saved = await serverFetch("/rest/v1/pilates_sessions?on_conflict=session_date%2Ctime_slot", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(slots),
    });
    const formatter = new Intl.DateTimeFormat("it-IT", { timeZone: "Europe/Rome", weekday: "long", day: "numeric", month: "long" });
    const grouped = slots.reduce((all, slot) => {
      const key = `${slot.session_date}|${slot.location}`;
      if (!all[key]) all[key] = { date: slot.session_date, location: slot.location, times: [] };
      all[key].times.push(slot.time_slot);
      return all;
    }, {} as Record<string, { date: string; location: string; times: string[] }>);
    const summaries = Object.values(grouped).map((group) => `${formatter.format(new Date(`${group.date}T12:00:00Z`))}, ${group.location}: ${group.times.join(", ")}`);
    const remaining = Math.max(0, summaries.length - 4);
    const body = `Nuova programmazione Pilates: ${summaries.slice(0, 4).join("; ")}${remaining ? `; e altre ${remaining} date` : ""}. Massimo 5 posti per turno.`;
    const created = await serverFetch("/rest/v1/app_notifications", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ audience: "atlete", title: "Nuovi turni Pilates", body, target_url: "?open=pilates" }),
    });
    const notification = created?.[0] || { title: "Nuovi turni Pilates", body, target_url: "?open=pilates" };
    let delivery = { sent: 0, failed: 0 };
    try {
      delivery = await sendPushNotification({ title: notification.title, body: notification.body, url: APP_URL + "?open=pilates", tag: `pilates-${slots[0].session_date}` });
    } catch {
      // I turni e l'avviso nell'app restano pubblicati anche se un servizio push non risponde.
    }
    return json({ ok: true, sessions: saved, delivery });
  }

  if (input.action === "pilates.sessions.delete") {
    requireRole(session, "istruttrici");
    const id = Number(input.id);
    if (!Number.isSafeInteger(id) || id < 1) return json({ error: "Turno non valido." }, 400);
    const rows = await serverFetch(`/rest/v1/pilates_sessions?id=eq.${id}&select=id,session_date,time_slot&limit=1`);
    const slot = rows?.[0];
    if (!slot) return json({ error: "Turno non trovato." }, 404);
    const [bookings, guestBookings] = await Promise.all([
      serverFetch(`/rest/v1/pilates_bookings?booking_date=eq.${slot.session_date}&time_slot=eq.${encodeURIComponent(slot.time_slot)}&select=id&limit=1`),
      serverFetch(`/rest/v1/guest_pilates_bookings?session_id=eq.${id}&select=id&limit=1`),
    ]);
    if (bookings.length || guestBookings.length) return json({ error: "Prima elimina le prenotazioni presenti in questo turno." }, 409);
    await serverFetch(`/rest/v1/pilates_sessions?id=eq.${id}`, { method: "DELETE" });
    return json({ ok: true });
  }

  if (input.action === "pilates.availability") {
    if (!["atlete", "istruttrici"].includes(session.role)) throw new Error("Unauthorized");
    const bookingDate = cleanDate(input.bookingDate);
    if (!bookingDate) return json({ error: "Data non valida." }, 400);
    const [sessions, rows, guestBookings] = await Promise.all([
      serverFetch("/rest/v1/pilates_sessions?session_date=eq." + bookingDate + "&published_at=not.is.null&select=id,time_slot,start_time,end_time,location,activity,capacity&order=start_time.asc"),
      serverFetch("/rest/v1/pilates_bookings?booking_date=eq." + bookingDate + "&select=athlete_id,time_slot"),
      serverFetch("/rest/v1/guest_pilates_bookings?select=session_id"),
    ]);
    if (!sessions.length) return json({ error: "Non ci sono turni Pilates pubblicati per questa data." }, 404);
    let athleteId = null;
    if (session.role === "atlete" && input.membershipCode) {
      const code = cleanMembershipCode(input.membershipCode);
      if (code) {
        const athletes = await serverFetch(`/rest/v1/athletes?membership_code=eq.${encodeURIComponent(code)}&active=eq.true&select=id&limit=1`);
        athleteId = athletes?.[0]?.id || null;
      }
    }
    const slots = sessions.map((sessionRow) => {
      const time_slot = sessionRow.time_slot;
      const count = rows.filter((row) => row.time_slot === time_slot).length + guestBookings.filter((row) => Number(row.session_id) === Number(sessionRow.id)).length;
      const bookingWindow = pilatesBookingWindow(bookingDate, time_slot);
      const alreadyBooked = Boolean(athleteId && rows.some((row) => row.athlete_id === athleteId && row.time_slot === time_slot));
      return { id: sessionRow.id, time_slot, location: sessionRow.location, activity: sessionRow.activity, capacity: sessionRow.capacity, count, remaining: Math.max(0, Number(sessionRow.capacity) - count), booking_open: bookingWindow.open, booking_deadline: bookingWindow.deadline, already_booked: alreadyBooked };
    });
    return json({ bookingDate, slots });
  }

  if (input.action === "pilates.book") {
    requireRole(session, "atlete");
    const code = cleanMembershipCode(input.membershipCode);
    const bookingDate = cleanDate(input.bookingDate);
    const timeSlot = cleanText(input.timeSlot, 20);
    if (!code || !bookingDate || !timeSlot) return json({ error: "Dati prenotazione non validi." }, 400);
    const availableSessions = await serverFetch(`/rest/v1/pilates_sessions?session_date=eq.${bookingDate}&time_slot=eq.${encodeURIComponent(timeSlot)}&published_at=not.is.null&select=id,activity&limit=1`);
    if (!availableSessions.length) return json({ error: "Questo turno non è disponibile." }, 404);
    const sessionActivity = availableSessions[0].activity || "Pilates";
    const isBungee = sessionActivity === "Bungee Fitness";
    const athletes = await serverFetch("/rest/v1/athletes?membership_code=eq." + encodeURIComponent(code) + "&active=eq.true&select=id,full_name,activity,pilates_base_started_on,pilates_plus_started_on,bungee_fly_started_on&limit=1");
    const athlete = athletes?.[0];
    if (!athlete) return json({ error: "Codice tessera non trovato." }, 404);
    const athleteActivities = csvList(athlete.activity);
    const eligible = isBungee
      ? athleteActivities.some((value) => ["bungee fly", "bungee fitness"].includes(value.toLocaleLowerCase("it")))
      : athleteActivities.some((value) => value.toLocaleLowerCase("it").startsWith("pilates"));
    if (!eligible) return json({ error: `Questo codice tessera non risulta iscritto a ${sessionActivity}.` }, 400);
    const [existingBookings, attendance, payments, allSessions] = await Promise.all([
      serverFetch("/rest/v1/pilates_bookings?athlete_id=eq." + cleanUuid(athlete.id) + "&select=id,athlete_id,booking_date,time_slot"),
      serverFetch("/rest/v1/attendance?athlete_id=eq." + cleanUuid(athlete.id) + "&present=eq.true&select=class_date,activity"),
      serverFetch("/rest/v1/payment_history?athlete_id=eq." + cleanUuid(athlete.id) + "&select=id,paid_on,activity,amount,period_note&order=paid_on.desc,created_at.desc&limit=5000"),
      serverFetch("/rest/v1/pilates_sessions?select=session_date,time_slot,activity&limit=10000"),
    ]);
    const enrichedBookings = enrichBookingsWithActivities(existingBookings, allSessions);
    const existing = existingBookings.find((row) => row.booking_date === bookingDate && row.time_slot === timeSlot);
    const previousSameDay = enrichedBookings.find((row) => row.booking_date === bookingDate && row.time_slot !== timeSlot && bookingMatchesPackage(row, isBungee ? "Bungee Fly" : "Pilates Plus"));
    const confirmation = { booking_date: bookingDate, time_slot: timeSlot, activity: sessionActivity };
    if (existing) return json({ ok: true, alreadyBooked: true, booking: { ...confirmation, id: existing.id } });
    if (!pilatesBookingWindow(bookingDate, timeSlot).open) {
      return json({ error: "Le prenotazioni chiudono due ore prima dell’allenamento.", code: "BOOKING_CLOSED" }, 409);
    }
    const packages = subscriptionPackages(athlete, enrichedBookings, attendance, payments);
    const selectedPackage = packages.find((item) => isBungee ? item.activity === "Bungee Fly" : item.activity.startsWith("Pilates"));
    if (selectedPackage && !selectedPackage.needs_start && !previousSameDay && (selectedPackage.expired || bookingDate > selectedPackage.expires_on || bookingDate < selectedPackage.starts_on)) {
      return json({ error: `Il pacchetto ${selectedPackage.activity} è terminato oppure è scaduto il periodo acquistato.` }, 409);
    }
    try {
      await serverFetch("/rest/v1/rpc/book_pilates_slot", {
        method: "POST",
        body: JSON.stringify({ p_athlete_id: athlete.id, p_booking_date: bookingDate, p_time_slot: timeSlot }),
      });
    } catch (error) {
      const saved = await serverFetch(`/rest/v1/pilates_bookings?athlete_id=eq.${cleanUuid(athlete.id)}&booking_date=eq.${bookingDate}&time_slot=eq.${encodeURIComponent(timeSlot)}&select=id&limit=1`);
      if (saved.length) return json({ ok: true, alreadyBooked: true, booking: { ...confirmation, id: saved[0].id } });
      return pilatesBookingError(error);
    }
    const startField = isBungee
      ? "bungee_fly_started_on"
      : athleteActivities.some((value) => value.toLocaleLowerCase("it") === "pilates plus") ? "pilates_plus_started_on" : "pilates_base_started_on";
    const shouldSetPackageStart = selectedPackage && !athlete[startField] && selectedPackage.starts_on === bookingDate;
    if (shouldSetPackageStart) {
      try {
        await serverFetch("/rest/v1/athletes?id=eq." + cleanUuid(athlete.id), {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({ [startField]: bookingDate }),
        });
      } catch {
        // La prima lezione conteggiata resta comunque la data di inizio di riserva.
      }
    }
    const registeredActivity = isBungee
      ? (athleteActivities.find((value) => ["bungee fly", "bungee fitness"].includes(value.toLocaleLowerCase("it"))) || "Bungee Fly")
      : (athleteActivities.find((value) => value.toLocaleLowerCase("it").startsWith("pilates")) || "Pilates Base");
    try {
      await notifyInstructors({
        title: `${previousSameDay ? "Cambio" : "Nuova"} prenotazione ${sessionActivity}`,
        body: previousSameDay ? `${athlete.full_name || "Un’atleta"} ha spostato il turno del ${bookingDate} da ${previousSameDay.time_slot} a ${timeSlot}.` : `${athlete.full_name || "Un’atleta"} ha prenotato il ${bookingDate} · ${timeSlot}.`,
        url: "?open=pilates",
        tag: `prenotazione-${sessionActivity}-${bookingDate}-${timeSlot}`,
        activities: [registeredActivity],
      });
    } catch {
      console.error("Booking saved; instructor notification failed");
    }
    return json({ ok: true, alreadyBooked: false, replaced: Boolean(previousSameDay), previous_time_slot: previousSameDay?.time_slot || null, booking: confirmation });
  }
  if (input.action === "pilates.roster") {
    requireRole(session, "istruttrici");
    const bookingDate = cleanDate(input.bookingDate);
    if (!bookingDate) return json({ error: "Data non valida." }, 400);
    const [sessions, rows, guestRows] = await Promise.all([
      serverFetch("/rest/v1/pilates_sessions?session_date=eq." + bookingDate + "&published_at=not.is.null&select=id,time_slot,start_time,end_time,location,activity,capacity&order=start_time.asc"),
      serverFetch("/rest/v1/pilates_bookings?booking_date=eq." + bookingDate + "&select=id,time_slot,athletes(full_name)&order=time_slot.asc,created_at.asc"),
      serverFetch("/rest/v1/guest_pilates_bookings?select=id,session_id,first_name,last_name,created_at&order=created_at.asc"),
    ]);
    return json({
      sessions: sessions.map((row) => ({ ...row, start_time: String(row.start_time || "").slice(0, 5), end_time: String(row.end_time || "").slice(0, 5) })),
      bookings: [
        ...rows.map((row) => ({ id: row.id, kind: "athlete", time_slot: row.time_slot, athlete_name: row.athletes?.full_name || "Atleta non disponibile" })),
        ...guestRows.map((row) => { const sessionRow = sessions.find((session) => Number(session.id) === Number(row.session_id)); return { id: row.id, kind: "guest", time_slot: sessionRow?.time_slot || "", athlete_name: `${row.first_name} ${row.last_name} · Ospite` }; }),
      ],
    });
  }

  if (input.action === "pilates.delete") {
    requireRole(session, "istruttrici");
    const id = Number(input.id);
    if (!Number.isSafeInteger(id) || id < 1) return json({ error: "Prenotazione non valida." }, 400);
    await serverFetch("/rest/v1/pilates_bookings?id=eq." + id, { method: "DELETE" });
    return json({ ok: true });
  }

  if (input.action === "guest.reformer.delete") {
    requireRole(session, "istruttrici");
    const id = Number(input.id);
    if (!Number.isSafeInteger(id) || id < 1) return json({ error: "Prenotazione non valida." }, 400);
    await serverFetch("/rest/v1/guest_pilates_bookings?id=eq." + id, { method: "DELETE" });
    return json({ ok: true });
  }

  if (input.action === "bookings.mine") {
    requireRole(session, "atlete");
    const code = cleanMembershipCode(input.membershipCode);
    if (!code) return json({ error: "Inserisci il codice tessera." }, 400);
    const athletes = await serverFetch("/rest/v1/athletes?membership_code=eq." + encodeURIComponent(code) + "&active=eq.true&select=id,full_name,activity&limit=1");
    const athlete = athletes?.[0];
    if (!athlete) return json({ error: "Codice tessera non trovato." }, 404);
    const today = italyClock().date;
    const [pilates, privateLessons, sessions] = await Promise.all([
      serverFetch(`/rest/v1/pilates_bookings?athlete_id=eq.${cleanUuid(athlete.id)}&booking_date=gte.${today}&select=id,booking_date,time_slot&order=booking_date.asc,time_slot.asc`),
      serverFetch(`/rest/v1/private_lesson_bookings?athlete_id=eq.${cleanUuid(athlete.id)}&booking_date=gte.${today}&select=id,booking_date,booking_time,activity&order=booking_date.asc,booking_time.asc`),
      serverFetch(`/rest/v1/pilates_sessions?session_date=gte.${today}&select=session_date,time_slot,activity&limit=10000`),
    ]);
    const enrichedPilates = enrichBookingsWithActivities(pilates, sessions);
    const bookings = [
      ...enrichedPilates.map((row) => ({ id: row.id, kind: "pilates", booking_date: row.booking_date, booking_time: row.time_slot, activity: row.activity || "Pilates", can_cancel: bookingChangeWindow(row.booking_date, row.time_slot) })),
      ...privateLessons.map((row) => ({ id: row.id, kind: "private", booking_date: row.booking_date, booking_time: String(row.booking_time || "").slice(0, 5), activity: row.activity, can_cancel: bookingChangeWindow(row.booking_date, row.booking_time) })),
    ].sort((a, b) => `${a.booking_date} ${a.booking_time}`.localeCompare(`${b.booking_date} ${b.booking_time}`));
    return json({ bookings });
  }

  if (input.action === "pilates.cancel") {
    requireRole(session, "atlete");
    const id = Number(input.id);
    const code = cleanMembershipCode(input.membershipCode);
    if (!Number.isSafeInteger(id) || id < 1 || !code) return json({ error: "Prenotazione non valida." }, 400);
    const athletes = await serverFetch("/rest/v1/athletes?membership_code=eq." + encodeURIComponent(code) + "&active=eq.true&select=id,full_name,activity&limit=1");
    const athlete = athletes?.[0];
    if (!athlete) return json({ error: "Codice tessera non trovato." }, 404);
    const rows = await serverFetch(`/rest/v1/pilates_bookings?id=eq.${id}&athlete_id=eq.${cleanUuid(athlete.id)}&select=id,booking_date,time_slot&limit=1`);
    const booking = rows?.[0];
    if (!booking) return json({ error: "Prenotazione non trovata." }, 404);
    if (!bookingChangeWindow(booking.booking_date, booking.time_slot)) return json({ error: "La prenotazione non può più essere annullata: mancano meno di tre ore all’inizio." }, 409);
    await serverFetch(`/rest/v1/pilates_bookings?id=eq.${id}&athlete_id=eq.${cleanUuid(athlete.id)}`, { method: "DELETE" });
    const cancelledPilatesActivity = csvList(athlete.activity).find((value) => value.toLocaleLowerCase("it").startsWith("pilates")) || "Pilates Base";
    await notifyInstructors({
      title: "Prenotazione Pilates annullata",
      body: `${athlete.full_name || "Un’atleta"} ha annullato il ${booking.booking_date} · ${booking.time_slot}.`,
      url: "?open=pilates",
      tag: `annullo-pilates-${booking.booking_date}-${booking.time_slot}`,
      activities: [cancelledPilatesActivity],
    });
    return json({ ok: true });
  }

  if (input.action === "private.book") {
    requireRole(session, "atlete");
    const code = cleanMembershipCode(input.membershipCode);
    const bookingDate = cleanDate(input.bookingDate);
    const bookingTime = cleanTime(input.bookingTime);
    const requestedActivity = cleanText(input.activity, 120);
    const note = cleanText(input.note, 300);
    if (!code || !bookingDate || !bookingTime || !requestedActivity) return json({ error: "Completa codice tessera, attività, data e orario." }, 400);
    const now = italyClock();
    const bookingMinutes = Number(bookingTime.slice(0, 2)) * 60 + Number(bookingTime.slice(3, 5));
    if (bookingDate < now.date || (bookingDate === now.date && bookingMinutes <= now.minutes)) {
      return json({ error: "Scegli una data e un orario futuri." }, 409);
    }
    const athletes = await serverFetch("/rest/v1/athletes?membership_code=eq." + encodeURIComponent(code) + "&active=eq.true&select=id,full_name,activity&limit=1");
    const athlete = athletes?.[0];
    if (!athlete) return json({ error: "Codice tessera non trovato." }, 404);
    const enrolledActivities = String(athlete.activity || "").split(",").map((item) => item.trim()).filter(Boolean);
    const activity = enrolledActivities.find((item) => item.toLocaleLowerCase("it") === requestedActivity.toLocaleLowerCase("it"));
    if (!activity) return json({ error: "L’attività scelta non risulta nella tua scheda atleta." }, 400);
    try {
      await serverFetch("/rest/v1/private_lesson_bookings", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ athlete_id: athlete.id, booking_date: bookingDate, booking_time: bookingTime, activity, note }),
      });
      await notifyInstructors({
        title: "Nuova lezione privata",
        body: `${athlete.full_name || "Un’atleta"} ha prenotato ${activity} il ${bookingDate} alle ${bookingTime}.`,
        url: "?open=pilates",
        tag: `lezione-privata-${activity}-${bookingDate}`,
        activities: [activity],
      });
      return json({ ok: true });
    } catch {
      return json({ error: "Questa lezione privata risulta già prenotata." }, 409);
    }
  }

  if (input.action === "private.list") {
    requireRole(session, "istruttrici");
    const bookingDate = input.bookingDate ? cleanDate(input.bookingDate) : null;
    const dateFilter = bookingDate ? "booking_date=eq." + bookingDate : "booking_date=gte." + italyClock().date;
    const rows = await serverFetch("/rest/v1/private_lesson_bookings?" + dateFilter + "&select=id,booking_date,booking_time,activity,note,athletes(full_name,membership_code)&order=booking_date.asc,booking_time.asc,created_at.asc");
    return json({ bookings: rows.map((row) => ({
      id: row.id,
      booking_date: row.booking_date,
      booking_time: String(row.booking_time || "").slice(0, 5),
      activity: row.activity,
      note: row.note,
      athlete_name: row.athletes?.full_name || "Atleta non disponibile",
      membership_code: row.athletes?.membership_code || "",
    })) });
  }

  if (input.action === "private.delete") {
    requireRole(session, "istruttrici");
    const id = Number(input.id);
    if (!Number.isSafeInteger(id) || id < 1) return json({ error: "Prenotazione non valida." }, 400);
    await serverFetch("/rest/v1/private_lesson_bookings?id=eq." + id, { method: "DELETE" });
    return json({ ok: true });
  }

  if (input.action === "private.cancel") {
    requireRole(session, "atlete");
    const id = Number(input.id);
    const code = cleanMembershipCode(input.membershipCode);
    if (!Number.isSafeInteger(id) || id < 1 || !code) return json({ error: "Prenotazione non valida." }, 400);
    const athletes = await serverFetch("/rest/v1/athletes?membership_code=eq." + encodeURIComponent(code) + "&active=eq.true&select=id,full_name&limit=1");
    const athlete = athletes?.[0];
    if (!athlete) return json({ error: "Codice tessera non trovato." }, 404);
    const rows = await serverFetch(`/rest/v1/private_lesson_bookings?id=eq.${id}&athlete_id=eq.${cleanUuid(athlete.id)}&select=id,booking_date,booking_time,activity&limit=1`);
    const booking = rows?.[0];
    if (!booking) return json({ error: "Prenotazione non trovata." }, 404);
    if (!bookingChangeWindow(booking.booking_date, booking.booking_time)) return json({ error: "La prenotazione non può più essere annullata: mancano meno di tre ore all’inizio." }, 409);
    await serverFetch(`/rest/v1/private_lesson_bookings?id=eq.${id}&athlete_id=eq.${cleanUuid(athlete.id)}`, { method: "DELETE" });
    await notifyInstructors({
      title: "Lezione privata annullata",
      body: `${athlete.full_name || "Un’atleta"} ha annullato ${booking.activity} del ${booking.booking_date} alle ${String(booking.booking_time || "").slice(0, 5)}.`,
      url: "?open=pilates",
      tag: `annullo-privata-${booking.activity}-${booking.booking_date}`,
      activities: [booking.activity],
    });
    return json({ ok: true });
  }

  if (input.action === "subscription.lookup") {
    requireRole(session, "atlete");
    const code = cleanMembershipCode(input.membershipCode);
    if (!code) return json(null);
    const rows = await serverFetch(`/rest/v1/athletes?membership_code=eq.${encodeURIComponent(code)}&active=eq.true&select=id,activity,instructor,subscription_expires_on,monthly_price,medical_certificate_expires_on,pilates_base_started_on,pilates_plus_started_on,bungee_fly_started_on&limit=1`);
    const athlete = rows?.[0];
    if (!athlete) return json(null);
    const [attendance, bookings, payments, sessions, privateLessons] = await Promise.all([
      serverFetch(`/rest/v1/attendance?athlete_id=eq.${cleanUuid(athlete.id)}&present=eq.true&select=class_date,activity&order=class_date.desc,recorded_at.desc&limit=5000`),
      serverFetch(`/rest/v1/pilates_bookings?athlete_id=eq.${cleanUuid(athlete.id)}&select=booking_date,time_slot&order=booking_date.asc`),
      serverFetch(`/rest/v1/payment_history?athlete_id=eq.${cleanUuid(athlete.id)}&select=id,paid_on,activity,amount,period_note&order=paid_on.desc,created_at.desc&limit=5000`),
      serverFetch("/rest/v1/pilates_sessions?select=session_date,time_slot,activity&limit=10000"),
      serverFetch(`/rest/v1/private_lesson_bookings?athlete_id=eq.${cleanUuid(athlete.id)}&select=booking_date,booking_time,activity&order=booking_date.desc,booking_time.desc`),
    ]);
    const enrichedBookings = enrichBookingsWithActivities(bookings, sessions);
    return json({
      activity: athlete.activity,
      instructor: athlete.instructor,
      subscription_expires_on: athlete.subscription_expires_on,
      monthly_price: athlete.monthly_price,
      medical_certificate_expires_on: athlete.medical_certificate_expires_on,
      packages: subscriptionPackages(athlete, enrichedBookings, attendance, payments),
      payments,
      attendance,
      bookings: [...enrichedBookings.map(row => ({ booking_date: row.booking_date, time_slot: row.time_slot, activity: row.activity || "Pilates Reformer", kind: "course" })), ...privateLessons.map(row => ({ booking_date: row.booking_date, time_slot: String(row.booking_time || "").slice(0,5), activity: row.activity, kind: "private" }))].sort((a,b) => `${b.booking_date} ${b.time_slot}`.localeCompare(`${a.booking_date} ${a.time_slot}`)),
    });
  }

  return json({ error: "Operazione non disponibile." }, 404);
}

function withCors(request, response) {
  const origin = request.headers.get("origin");
  if (!origin || !ALLOWED_ORIGINS.has(origin)) return response;
  const headers = new Headers(response.headers);
  headers.set("access-control-allow-origin", origin);
  headers.set("access-control-allow-headers", "authorization, content-type");
  headers.set("access-control-allow-methods", "POST, OPTIONS");
  headers.set("vary", "Origin");
  return new Response(response.body, { status: response.status, headers });
}

Deno.serve(async (request) => {
  try {
    const url = new URL(request.url);
    if (request.method === "GET" && url.searchParams.get("asset") === "app-icon-v2") return appIconResponse();
    if (request.method === "OPTIONS") {
      const origin = request.headers.get("origin");
      if (!origin || !ALLOWED_ORIGINS.has(origin)) return new Response(null, { status: 403 });
      return withCors(request, new Response(null, { status: 204 }));
    }
    if (request.method === "POST") return withCors(request, await handlePost(request));
    if (request.method !== "GET") return new Response("Method not allowed", { status: 405 });
    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
        "x-content-type-options": "nosniff",
        "referrer-policy": "no-referrer",
        "content-security-policy": "default-src 'self'; connect-src 'self'; img-src 'self' data: https:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
      },
    });
  } catch {
    return withCors(request, json({ error: "Operazione non riuscita." }, 400));
  }
});
