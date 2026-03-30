const steps = [
  { until: 24, label: "Antworten werden verarbeitet..." },
  { until: 52, label: "Seite wird vorbereitet..." },
  { until: 80, label: "Inhalte werden geladen..." },
  { until: 100, label: "Weiterleitung erfolgt..." },
];

const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");
const progressStep = document.getElementById("progressStep");
const progressRoot = document.querySelector(".simulate-progress");

let value = 0;
let intervalId = null;
let isHoldingAtNinetyNine = false;

paint();
intervalId = setInterval(tick, 90);

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
  setTimeout(() => {
    window.location.replace("result.html");
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
