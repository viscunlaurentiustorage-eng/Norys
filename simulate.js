const steps = [
  { until: 24, label: "Antwortmuster werden ausgewertet..." },
  { until: 52, label: "Beziehungsdynamiken werden abgeglichen..." },
  { until: 80, label: "Persoenliche Schwerpunkte werden priorisiert..." },
  { until: 100, label: "Dein Ergebnis wird vorbereitet..." },
];

const LEGACY_TYPE_MAP = {
  A: "emotional_initiating",
  B: "overthinking",
  C: "conflict_avoidance",
  D: "over_adapting",
};

const VALID_TRAITS = new Set([
  "overthinking",
  "conflict_avoidance",
  "emotional_initiating",
  "over_adapting",
]);

const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");
const progressStep = document.getElementById("progressStep");
const progressRoot = document.querySelector(".simulate-progress");

const params = new URLSearchParams(window.location.search);
const legacyType = (params.get("type") || "").trim().toUpperCase();
const primary = normalizeTrait(params.get("primary")) || LEGACY_TYPE_MAP[legacyType] || null;
const secondary = normalizeTrait(params.get("secondary"));

if (!primary) {
  window.location.replace("quiz.html");
}

let value = 0;
let intervalId = null;
let isHoldingAtNinetyNine = false;

paint();
intervalId = setInterval(tick, 90);

function normalizeTrait(value) {
  const normalized = (value || "").trim().toLowerCase();
  return VALID_TRAITS.has(normalized) ? normalized : null;
}

function getStepLabel(percent) {
  const step = steps.find((item) => percent <= item.until);
  return step ? step.label : steps[steps.length - 1].label;
}

function paint() {
  progressFill.style.width = `${value}%`;
  progressPercent.textContent = `${value}%`;
  progressStep.textContent = getStepLabel(value);

  if (progressRoot) {
    progressRoot.setAttribute("aria-valuenow", String(value));
  }
}

function finish() {
  clearInterval(intervalId);
  const nextParams = new URLSearchParams({ primary });
  if (secondary) {
    nextParams.set("secondary", secondary);
  }

  setTimeout(() => {
    window.location.replace(`result.html?${nextParams.toString()}`);
  }, 420);
}

function tick() {
  if (value >= 100 || isHoldingAtNinetyNine) {
    finish();
    return;
  }

  const delta = value < 35 ? 3 : value < 75 ? 2 : 1;
  value = Math.min(99, value + delta);
  paint();

  if (value >= 99) {
    isHoldingAtNinetyNine = true;
    clearInterval(intervalId);
    setTimeout(() => {
      value = 100;
      paint();
      finish();
    }, 3000);
  }
}
