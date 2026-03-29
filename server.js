const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = Number(process.env.PORT || 8080);
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "change-this-admin-token";
const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, "data");
const EVENTS_FILE = path.join(DATA_DIR, "events.ndjson");

ensureDataStore();

function ensureDataStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(EVENTS_FILE)) fs.writeFileSync(EVENTS_FILE, "", "utf8");
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function sendText(res, status, text) {
  res.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    "Content-Length": Buffer.byteLength(text),
  });
  res.end(text);
}

function getMime(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".html":
      return "text/html; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".js":
      return "application/javascript; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".svg":
      return "image/svg+xml";
    case ".ico":
      return "image/x-icon";
    default:
      return "application/octet-stream";
  }
}

function safeResolve(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const basePath = decoded === "/" ? "/index.html" : decoded;
  const normalized = path.normalize(basePath).replace(/^([.][.][/\\])+/, "");

  if (normalized === "/admin") return path.join(ROOT_DIR, "admin.html");
  if (normalized === "/admin/") return path.join(ROOT_DIR, "admin.html");

  return path.join(ROOT_DIR, normalized);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    req.on("data", (chunk) => {
      total += chunk.length;
      if (total > 1024 * 64) {
        reject(new Error("Body too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function sanitizeString(value, maxLen = 200) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

function nowIso() {
  return new Date().toISOString();
}

function isAdminAuthorized(req) {
  const tokenFromHeader = req.headers["x-admin-token"];
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const tokenFromQuery = url.searchParams.get("token");
  const token = tokenFromHeader || tokenFromQuery;
  if (typeof token !== "string" || token.length === 0) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(ADMIN_TOKEN);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function appendEvent(event) {
  fs.appendFileSync(EVENTS_FILE, `${JSON.stringify(event)}\n`, "utf8");
}

function readEvents() {
  const raw = fs.readFileSync(EVENTS_FILE, "utf8");
  if (!raw.trim()) return [];

  const lines = raw.split("\n");
  const events = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      events.push(JSON.parse(line));
    } catch {
      // Ignore malformed line and continue.
    }
  }
  return events;
}

function parseDateParam(value, fallback) {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date;
}

function buildBucketKey(date, interval) {
  if (interval === "hour") {
    return date.toISOString().slice(0, 13) + ":00";
  }
  return date.toISOString().slice(0, 10);
}

function summarize(events, from, to, interval) {
  const filtered = events.filter((event) => {
    const timestamp = new Date(event.timestamp || 0).getTime();
    return timestamp >= from.getTime() && timestamp <= to.getTime();
  });

  const pageViews = filtered.filter((e) => e.eventType === "page_view");
  const totalVisits = pageViews.length;
  const uniqueVisitors = new Set(pageViews.map((e) => e.visitorId).filter(Boolean)).size;

  const sessionEnds = filtered.filter((e) => e.eventType === "session_end");
  const sessionDurations = sessionEnds.map((e) => Number(e.durationSec || 0)).filter((n) => Number.isFinite(n) && n >= 0);
  const avgTimeSec = sessionDurations.length
    ? sessionDurations.reduce((sum, value) => sum + value, 0) / sessionDurations.length
    : 0;

  const bouncedSessions = sessionEnds.filter((event) => {
    const duration = Number(event.durationSec || 0);
    const interactions = Number(event.metadata?.interactionCount || 0);
    return duration < 10 || interactions <= 1;
  }).length;

  const bounceRate = sessionEnds.length ? (bouncedSessions / sessionEnds.length) * 100 : 0;

  const clicks = filtered.filter((e) => e.eventType === "click");
  const clicksByElement = new Map();
  for (const click of clicks) {
    const key = click.elementLabel || click.elementId || "Unlabeled element";
    clicksByElement.set(key, (clicksByElement.get(key) || 0) + 1);
  }

  const topElements = Array.from(clicksByElement.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  const trendsMap = new Map();
  for (const event of filtered) {
    const bucket = buildBucketKey(new Date(event.timestamp), interval);
    if (!trendsMap.has(bucket)) {
      trendsMap.set(bucket, { bucket, visits: 0, clicks: 0, sessionsEnded: 0 });
    }

    const item = trendsMap.get(bucket);
    if (event.eventType === "page_view") item.visits += 1;
    if (event.eventType === "click") item.clicks += 1;
    if (event.eventType === "session_end") item.sessionsEnded += 1;
  }

  const trendBuckets = Array.from(trendsMap.values()).sort((a, b) => a.bucket.localeCompare(b.bucket));

  const latestEvents = filtered
    .slice()
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 250)
    .map((event) => ({
      timestamp: event.timestamp,
      eventType: event.eventType,
      visitorId: event.visitorId,
      sessionId: event.sessionId,
      path: event.path,
      elementLabel: event.elementLabel || "",
      metadata: event.metadata || {},
    }));

  return {
    summary: {
      totalVisits,
      uniqueVisitors,
      totalClicks: clicks.length,
      avgTimeSec: Number(avgTimeSec.toFixed(2)),
      bounceRate: Number(bounceRate.toFixed(2)),
      quickExits: bouncedSessions,
      sessionsMeasured: sessionEnds.length,
    },
    trends: trendBuckets,
    topElements,
    events: latestEvents,
    range: {
      from: from.toISOString(),
      to: to.toISOString(),
      interval,
    },
  };
}

function handleTrack(req, res) {
  parseBody(req)
    .then((payload) => {
      const eventType = sanitizeString(payload.eventType, 64);
      if (!eventType) {
        sendJson(res, 400, { error: "eventType is required" });
        return;
      }

      const event = {
        eventId: crypto.randomUUID(),
        eventType,
        timestamp: sanitizeString(payload.timestamp, 64) || nowIso(),
        visitorId: sanitizeString(payload.visitorId, 128),
        sessionId: sanitizeString(payload.sessionId, 128),
        path: sanitizeString(payload.path, 256),
        elementId: sanitizeString(payload.elementId, 128),
        elementLabel: sanitizeString(payload.elementLabel, 160),
        durationSec: Number(payload.durationSec || 0),
        metadata: typeof payload.metadata === "object" && payload.metadata !== null ? payload.metadata : {},
      };

      appendEvent(event);
      sendJson(res, 201, { ok: true, eventId: event.eventId });
    })
    .catch((error) => {
      sendJson(res, 400, { error: error.message || "Invalid request" });
    });
}

function handleAdminDashboard(req, res) {
  if (!isAdminAuthorized(req)) {
    sendJson(res, 401, { error: "Unauthorized" });
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const interval = url.searchParams.get("interval") === "hour" ? "hour" : "day";

  const to = parseDateParam(url.searchParams.get("to"), new Date());
  const fromFallback = new Date(to.getTime() - 1000 * 60 * 60 * 24 * 30);
  const from = parseDateParam(url.searchParams.get("from"), fromFallback);

  const events = readEvents();
  const result = summarize(events, from, to, interval);
  sendJson(res, 200, result);
}

function serveStatic(req, res) {
  const filePath = safeResolve(req.url || "/");
  if (!filePath.startsWith(ROOT_DIR)) {
    sendText(res, 403, "Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      sendText(res, 404, "Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": getMime(filePath),
      "Cache-Control": filePath.includes("assets") ? "public, max-age=60" : "no-cache",
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (!req.url || !req.method) {
    sendText(res, 400, "Bad request");
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (req.method === "POST" && url.pathname === "/api/track") {
    handleTrack(req, res);
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/admin/dashboard") {
    handleAdminDashboard(req, res);
    return;
  }

  if (req.method === "GET") {
    serveStatic(req, res);
    return;
  }

  sendText(res, 405, "Method not allowed");
});

server.listen(PORT, () => {
  console.log(`Norys analytics server running on http://localhost:${PORT}`);
  console.log("Admin dashboard: /admin");
});
