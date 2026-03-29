(function () {
  if (window.__NORYS_TRACKER_LOADED__) return;
  window.__NORYS_TRACKER_LOADED__ = true;

  const TRACK_ENDPOINT = "/api/track";
  const VISITOR_KEY = "norys_visitor_id";
  const SESSION_KEY = "norys_session_id";

  const now = () => new Date().toISOString();
  const randomId = () => {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    return `id_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  };

  function getOrCreateLocal(key) {
    let value = localStorage.getItem(key);
    if (!value) {
      value = randomId();
      localStorage.setItem(key, value);
    }
    return value;
  }

  function setSession(id) {
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  }

  function getSession() {
    return sessionStorage.getItem(SESSION_KEY);
  }

  const visitorId = getOrCreateLocal(VISITOR_KEY);
  const sessionId = setSession(getSession() || randomId());
  const startedAt = Date.now();

  let interactions = 0;
  let maxScrollDepth = 0;
  let sentSessionEnd = false;
  const sentScrollMilestones = new Set();

  function postEvent(event) {
    const payload = {
      timestamp: now(),
      visitorId,
      sessionId,
      path: window.location.pathname,
      ...event,
    };

    const body = JSON.stringify(payload);

    if (event.eventType === "session_end" && navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(TRACK_ENDPOINT, blob);
      return;
    }

    fetch(TRACK_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: event.eventType === "session_end",
    }).catch(() => {
      // Silently ignore analytics failures.
    });
  }

  function elementLabelFrom(target) {
    if (!target) return "unknown";
    const tracked = target.closest("[data-track], [data-track-id], button, a, input, select, textarea");
    if (!tracked) return "unknown";

    const attrLabel = tracked.getAttribute("data-track") || tracked.getAttribute("data-track-id");
    if (attrLabel) return attrLabel.trim().slice(0, 120);

    const aria = tracked.getAttribute("aria-label");
    if (aria) return aria.trim().slice(0, 120);

    const text = (tracked.textContent || "").replace(/\s+/g, " ").trim();
    if (text) return text.slice(0, 120);

    if (tracked.id) return `#${tracked.id}`;
    return tracked.tagName.toLowerCase();
  }

  function maybeSendScrollMilestone(depth) {
    const marks = [25, 50, 75, 100];
    for (const mark of marks) {
      if (depth >= mark && !sentScrollMilestones.has(mark)) {
        sentScrollMilestones.add(mark);
        postEvent({ eventType: "scroll_depth", metadata: { depthPercent: mark } });
      }
    }
  }

  function handleSessionEnd(reason) {
    if (sentSessionEnd) return;
    sentSessionEnd = true;

    const durationSec = Math.max(0, Math.round((Date.now() - startedAt) / 1000));
    postEvent({
      eventType: "session_end",
      durationSec,
      metadata: {
        reason,
        interactionCount: interactions,
        maxScrollDepth,
      },
    });
  }

  postEvent({ eventType: "page_view", metadata: { referrer: document.referrer || "" } });

  document.addEventListener(
    "click",
    (event) => {
      const label = elementLabelFrom(event.target);
      const target = event.target && event.target.closest
        ? event.target.closest("[data-track], [data-track-id], button, a, input, select, textarea")
        : null;

      interactions += 1;
      postEvent({
        eventType: "click",
        elementId: target && target.id ? target.id : "",
        elementLabel: label,
        metadata: {
          tagName: target ? target.tagName : "",
        },
      });
    },
    { passive: true }
  );

  document.addEventListener(
    "scroll",
    () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const scrollHeight = Math.max(
        0,
        (document.documentElement.scrollHeight || 0) - window.innerHeight
      );

      const depth = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 100;
      if (depth > maxScrollDepth) {
        maxScrollDepth = depth;
      }
      maybeSendScrollMilestone(maxScrollDepth);
    },
    { passive: true }
  );

  document.addEventListener("visibilitychange", () => {
    postEvent({
      eventType: "visibility_change",
      metadata: { state: document.visibilityState },
    });
  });

  setInterval(() => {
    const durationSec = Math.max(0, Math.round((Date.now() - startedAt) / 1000));
    postEvent({
      eventType: "heartbeat",
      durationSec,
      metadata: { visibilityState: document.visibilityState },
    });
  }, 15000);

  window.addEventListener("pagehide", () => handleSessionEnd("pagehide"));
  window.addEventListener("beforeunload", () => handleSessionEnd("beforeunload"));
})();
