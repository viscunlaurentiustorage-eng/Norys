const LANGUAGE_STORAGE_KEY = "norysLanguage";

const UI_TEXT = {
  de: {
    pageTitle: "Analyse läuft | Norys",
    metaDescription: "Norys wertet deine Antworten aus und berechnet dein persönliches Beziehungsergebnis.",
    ogLocale: "de_DE",
    ogTitle: "Analyse läuft | Norys",
    ogDescription: "Dein persönliches Norys Ergebnis wird vorbereitet.",
    brandAriaLabel: "Norys Startseite",
    languageButtonAriaLabel: "Sprache wechseln",
    languageLabel: "Deutsch",
    pageAriaLabel: "Analyse läuft",
    eyebrow: "Analyse",
    title: "Wir analysieren deine Antworten",
    subtitle: "Bitte einen kurzen Moment, wir berechnen dein individuelles Ergebnis.",
    steps: [
      { until: 24, label: "Antwortmuster werden ausgewertet..." },
      { until: 52, label: "Seite wird vorbereitet..." },
      { until: 80, label: "Inhalte werden geladen..." },
      { until: 100, label: "Weiterleitung erfolgt..." },
    ],
  },
  en: {
    pageTitle: "Analysis in Progress | Norys",
    metaDescription: "Norys is evaluating your answers and calculating your personal relationship result.",
    ogLocale: "en_US",
    ogTitle: "Analysis in Progress | Norys",
    ogDescription: "Your personal Norys result is being prepared.",
    brandAriaLabel: "Norys homepage",
    languageButtonAriaLabel: "Change language",
    languageLabel: "English",
    pageAriaLabel: "Analysis in progress",
    eyebrow: "Analysis",
    title: "We are analyzing your answers",
    subtitle: "Please give us a brief moment while we calculate your individual result.",
    steps: [
      { until: 24, label: "Processing your answers..." },
      { until: 52, label: "Preparing your page..." },
      { until: 80, label: "Loading your content..." },
      { until: 100, label: "Redirecting you now..." },
    ],
  },
};

const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");
const progressStep = document.getElementById("progressStep");
const progressRoot = document.querySelector(".simulate-progress");
const brandLink = document.getElementById("brandLink");
const languageToggle = document.getElementById("languageToggle");
const languageLabel = document.getElementById("languageLabel");
const simulatePage = document.getElementById("simulatePage");
const simulateEyebrow = document.getElementById("simulateEyebrow");
const simulateTitle = document.getElementById("simulateTitle");
const simulateSubtitle = document.getElementById("simulateSubtitle");
const metaDescription = document.getElementById("metaDescription");
const ogLocale = document.getElementById("ogLocale");
const ogTitle = document.getElementById("ogTitle");
const ogDescription = document.getElementById("ogDescription");

let value = 0;
let intervalId = null;
let isHoldingAtNinetyNine = false;
let currentLanguage = getStoredLanguage();

applyLanguage();
paint();
intervalId = setInterval(tick, 90);

if (languageToggle) {
  languageToggle.addEventListener("click", () => {
    currentLanguage = currentLanguage === "en" ? "de" : "en";

    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
    } catch (_error) {
      // Ignore storage write failures and still update the current page.
    }

    applyLanguage();
    paint();
  });
}

function getStoredLanguage() {
  try {
    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) === "en" ? "en" : "de";
  } catch (_error) {
    return "de";
  }
}

function getUi() {
  return UI_TEXT[currentLanguage] || UI_TEXT.de;
}

function applyLanguage() {
  const ui = getUi();

  document.documentElement.lang = currentLanguage;
  document.title = ui.pageTitle;

  if (metaDescription) metaDescription.setAttribute("content", ui.metaDescription);
  if (ogLocale) ogLocale.setAttribute("content", ui.ogLocale);
  if (ogTitle) ogTitle.setAttribute("content", ui.ogTitle);
  if (ogDescription) ogDescription.setAttribute("content", ui.ogDescription);
  if (brandLink) brandLink.setAttribute("aria-label", ui.brandAriaLabel);
  if (languageToggle) {
    languageToggle.setAttribute("aria-label", ui.languageButtonAriaLabel);
    languageToggle.setAttribute("aria-pressed", String(currentLanguage === "en"));
  }
  if (languageLabel) languageLabel.textContent = ui.languageLabel;
  if (simulatePage) simulatePage.setAttribute("aria-label", ui.pageAriaLabel);
  if (simulateEyebrow) simulateEyebrow.textContent = ui.eyebrow;
  if (simulateTitle) simulateTitle.textContent = ui.title;
  if (simulateSubtitle) simulateSubtitle.textContent = ui.subtitle;
}

function getStepLabel(percent) {
  const steps = getUi().steps;
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
