const state = {
  token: localStorage.getItem("norys_admin_token") || "",
  autoRefreshMs: 10000,
  timerId: null,
};

const els = {
  tokenInput: document.getElementById("tokenInput"),
  saveTokenBtn: document.getElementById("saveTokenBtn"),
  fromInput: document.getElementById("fromInput"),
  toInput: document.getElementById("toInput"),
  intervalSelect: document.getElementById("intervalSelect"),
  applyFiltersBtn: document.getElementById("applyFiltersBtn"),
  refreshNowBtn: document.getElementById("refreshNowBtn"),
  metricVisits: document.getElementById("metricVisits"),
  metricVisitors: document.getElementById("metricVisitors"),
  metricClicks: document.getElementById("metricClicks"),
  metricAvgTime: document.getElementById("metricAvgTime"),
  metricBounce: document.getElementById("metricBounce"),
  metricQuickExits: document.getElementById("metricQuickExits"),
  visitsTrendChart: document.getElementById("visitsTrendChart"),
  clicksTrendChart: document.getElementById("clicksTrendChart"),
  elementsChart: document.getElementById("elementsChart"),
  eventsTbody: document.getElementById("eventsTbody"),
  visitsRangeLabel: document.getElementById("visitsRangeLabel"),
  clicksRangeLabel: document.getElementById("clicksRangeLabel"),
};

function defaultRange() {
  const to = new Date();
  const from = new Date(to.getTime() - 1000 * 60 * 60 * 24 * 7);
  return { from, to };
}

function fmtLocalInput(date) {
  const tzOffsetMs = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffsetMs).toISOString().slice(0, 16);
}

function parseLocalInput(value, fallback) {
  if (!value) return fallback;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

function formatNumber(value) {
  return new Intl.NumberFormat().format(value);
}

function formatDuration(seconds) {
  const sec = Math.round(seconds || 0);
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  const rem = sec % 60;
  return `${min}m ${rem}s`;
}

function setStatusInMetrics(text) {
  els.metricVisits.textContent = text;
  els.metricVisitors.textContent = text;
  els.metricClicks.textContent = text;
  els.metricAvgTime.textContent = text;
  els.metricBounce.textContent = text;
  els.metricQuickExits.textContent = text;
}

function currentFilters() {
  const range = defaultRange();
  return {
    from: parseLocalInput(els.fromInput.value, range.from).toISOString(),
    to: parseLocalInput(els.toInput.value, range.to).toISOString(),
    interval: els.intervalSelect.value || "day",
  };
}

async function fetchDashboard() {
  const { from, to, interval } = currentFilters();
  const params = new URLSearchParams({ from, to, interval });

  const response = await fetch(`/api/admin/dashboard?${params.toString()}`, {
    headers: {
      "x-admin-token": state.token,
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    throw new Error("Unauthorized. Enter valid ADMIN_TOKEN.");
  }

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

function renderSummary(summary) {
  els.metricVisits.textContent = formatNumber(summary.totalVisits || 0);
  els.metricVisitors.textContent = formatNumber(summary.uniqueVisitors || 0);
  els.metricClicks.textContent = formatNumber(summary.totalClicks || 0);
  els.metricAvgTime.textContent = formatDuration(summary.avgTimeSec || 0);
  els.metricBounce.textContent = `${summary.bounceRate || 0}%`;
  els.metricQuickExits.textContent = formatNumber(summary.quickExits || 0);
}

function renderBarChart(container, items, key, className) {
  container.innerHTML = "";
  if (!items.length) {
    container.innerHTML = '<p class="empty">No data in selected range.</p>';
    return;
  }

  const maxValue = Math.max(...items.map((item) => Number(item[key] || 0)), 1);
  const fragment = document.createDocumentFragment();

  for (const item of items) {
    const value = Number(item[key] || 0);
    const bar = document.createElement("div");
    bar.className = `bar ${className || ""}`.trim();
    bar.style.height = `${Math.max((value / maxValue) * 100, 2)}%`;
    bar.title = `${item.bucket}: ${value}`;
    fragment.appendChild(bar);
  }

  container.appendChild(fragment);
}

function renderTopElements(elements) {
  els.elementsChart.innerHTML = "";
  if (!elements.length) {
    els.elementsChart.innerHTML = '<p class="empty">No click interactions yet.</p>';
    return;
  }

  const max = Math.max(...elements.map((item) => item.count), 1);

  for (const item of elements) {
    const row = document.createElement("div");
    row.className = "h-bar";
    row.innerHTML = `
      <div class="h-bar__label" title="${item.label}">${item.label}</div>
      <div class="h-bar__meter"><div class="h-bar__fill" style="width:${(item.count / max) * 100}%"></div></div>
      <div class="h-bar__count">${formatNumber(item.count)}</div>
    `;
    els.elementsChart.appendChild(row);
  }
}

function formatEventType(type) {
  return `<span class="badge ${type}">${type}</span>`;
}

function safeJson(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return "{}";
  }
}

function renderEvents(events) {
  els.eventsTbody.innerHTML = "";
  if (!events.length) {
    els.eventsTbody.innerHTML = '<tr><td colspan="6" class="empty">No events in selected range.</td></tr>';
    return;
  }

  const fragment = document.createDocumentFragment();
  for (const event of events) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${new Date(event.timestamp).toLocaleString()}</td>
      <td>${formatEventType(event.eventType)}</td>
      <td>${event.path || "-"}</td>
      <td>${event.elementLabel || "-"}</td>
      <td>${(event.sessionId || "-").slice(0, 8)}</td>
      <td>${safeJson(event.metadata || {})}</td>
    `;
    fragment.appendChild(tr);
  }

  els.eventsTbody.appendChild(fragment);
}

function renderRangeLabels(range) {
  const fromLabel = new Date(range.from).toLocaleString();
  const toLabel = new Date(range.to).toLocaleString();
  const text = `${fromLabel} - ${toLabel} (${range.interval})`;
  els.visitsRangeLabel.textContent = text;
  els.clicksRangeLabel.textContent = text;
}

async function refreshDashboard() {
  if (!state.token) {
    setStatusInMetrics("No token");
    return;
  }

  try {
    const dashboard = await fetchDashboard();
    renderSummary(dashboard.summary || {});
    renderBarChart(els.visitsTrendChart, dashboard.trends || [], "visits", "");
    renderBarChart(els.clicksTrendChart, dashboard.trends || [], "clicks", "clicks");
    renderTopElements(dashboard.topElements || []);
    renderEvents(dashboard.events || []);
    renderRangeLabels(dashboard.range || {});
  } catch (error) {
    setStatusInMetrics("Error");
    els.visitsTrendChart.innerHTML = `<p class="empty">${error.message}</p>`;
    els.clicksTrendChart.innerHTML = "";
    els.elementsChart.innerHTML = "";
    els.eventsTbody.innerHTML = "";
  }
}

function setupEvents() {
  els.saveTokenBtn.addEventListener("click", () => {
    state.token = (els.tokenInput.value || "").trim();
    if (state.token) {
      localStorage.setItem("norys_admin_token", state.token);
    }
    refreshDashboard();
  });

  els.applyFiltersBtn.addEventListener("click", refreshDashboard);
  els.refreshNowBtn.addEventListener("click", refreshDashboard);
}

function setupDefaults() {
  const range = defaultRange();
  els.fromInput.value = fmtLocalInput(range.from);
  els.toInput.value = fmtLocalInput(range.to);
  els.intervalSelect.value = "day";
  els.tokenInput.value = state.token;
}

function startAutoRefresh() {
  clearInterval(state.timerId);
  state.timerId = setInterval(refreshDashboard, state.autoRefreshMs);
}

setupDefaults();
setupEvents();
refreshDashboard();
startAutoRefresh();
