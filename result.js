const {
  STORAGE_KEY,
  TRAITS,
  buildFallbackProfile,
  normalizeTraitId,
} = window.NorysProfileEngine;

const EBOOK_URLS = {
  overthinking: "https://checkout.example.com/ebook-overthinking",
  conflict_avoidance: "https://checkout.example.com/ebook-conflict-avoidance",
  emotional_initiating: "https://checkout.example.com/ebook-emotional-initiating",
  over_adapting: "https://checkout.example.com/ebook-over-adapting",
};

const LEGACY_TYPE_MAP = {
  A: "emotional_initiating",
  B: "overthinking",
  C: "conflict_avoidance",
  D: "over_adapting",
};

const RESULT_COPY = {
  overthinking: {
    ebookName: "Das E-Book fuer Die Grueblerin",
    summaryLead:
      "Deine Antworten zeigen vor allem ein Muster von innerem Pruefen, Deuten und gedanklichem Weiterarbeiten, sobald in der Beziehung etwas unklar wirkt.",
    path: [
      {
        title: "Gedankenschleifen frueher stoppen",
        description: "Du lernst, schneller zu merken, wann Nachdenken keine Klarheit mehr bringt, sondern nur Unruhe verlaengert.",
      },
      {
        title: "Klarheit direkter holen",
        description: "Unsicherheit wird frueher ueber kurze Rueckfragen statt ueber innere Interpretation verarbeitet.",
      },
      {
        title: "Innere Ruhe vor Reaktion aufbauen",
        description: "So fuehlt sich Distanz nicht sofort wie ein Warnsignal an, auf das du innerlich springen musst.",
      },
    ],
    learn: [
      "wie du zwischen echtem Signal und eigener Interpretation klarer unterscheidest",
      "wie du Unsicherheit schneller regulierst, statt sie stundenlang mitzunehmen",
      "wie du ruhiger kommunizierst, ohne auf staendige Rueckversicherung angewiesen zu sein",
    ],
    proof:
      "Dieses E-Book ist auf Frauen ausgerichtet, die viel wahrnehmen, viel mitdenken und gerade deshalb einen klaren Weg brauchen, wieder mehr innere Ruhe und Beziehungssicherheit aufzubauen.",
    cta: "Zum E-Book fuer Die Grueblerin",
    subtext: "Sofortiger Zugriff, klare Uebungen, direkt auf dieses Beziehungsmuster zugeschnitten.",
  },
  conflict_avoidance: {
    ebookName: "Das E-Book fuer Die Konfliktvermeiderin",
    summaryLead:
      "Deine Antworten zeigen vor allem ein Muster, in dem du Spannung eher klein haeltst oder glatttest, bevor du sie offen in die Beziehung bringst.",
    path: [
      {
        title: "Spannung frueher ernst nehmen",
        description: "Du erkennst kleine Irritationen frueher als Signal, statt sie sofort innerlich herunterzuregeln.",
      },
      {
        title: "Ruhig und klar ansprechen",
        description: "Du lernst, Dinge zu benennen, ohne dich haerter oder konfliktsuchender fuehlen zu muessen.",
      },
      {
        title: "Naehe ueber Offenheit sichern",
        description: "Beziehung wird stabiler, wenn nicht nur Harmonie, sondern auch Klarheit Platz bekommt.",
      },
    ],
    learn: [
      "wie du Spannung ansprichst, bevor daraus Distanz wird",
      "wie du Konflikt nicht automatisch mit Beziehungsgefahr verwechselst",
      "wie du ruhig bleiben kannst, ohne dich selbst wieder aus dem Gespraech zu nehmen",
    ],
    proof:
      "Dieses E-Book ist fuer Frauen geschrieben, die Frieden in der Beziehung wollen, aber merken, dass zu viel Rueckzug oder Beschwichtigung langfristig keine echte Sicherheit schafft.",
    cta: "Zum E-Book fuer Die Konfliktvermeiderin",
    subtext: "Klar strukturiert, alltagsnah und auf mehr Stimme ohne unnoetige Haerte ausgelegt.",
  },
  emotional_initiating: {
    ebookName: "Das E-Book fuer Die emotionale Initiatorin",
    summaryLead:
      "Deine Antworten zeigen vor allem ein Muster, in dem du bei Distanz, Spannung oder Unsicherheit eher auf Klaerung, Gespraech und Wiederverbindung zugehst.",
    path: [
      {
        title: "Initiative besser dosieren",
        description: "Du bleibst direkt, ohne dass jeder Klaerungsimpuls sofort Dringlichkeit erzeugen muss.",
      },
      {
        title: "Timing gezielter waehlen",
        description: "Du lernst, Naehe zu suchen, ohne Gesprache genau dann zu erzwingen, wenn sie am wenigsten aufnehmen koennen.",
      },
      {
        title: "Mehr Wirkung mit weniger Druck",
        description: "So bleibt deine Direktheit verbindend, statt unbeabsichtigt Spannung zu verstaerken.",
      },
    ],
    learn: [
      "wie du Klarheit suchst, ohne dabei Druck aufzubauen",
      "wie du zwischen echtem Naehewunsch und innerem Alarm besser unterscheidest",
      "wie du Gespraeche so fuehrst, dass Verbindung und Anziehung eher wachsen als kippen",
    ],
    proof:
      "Dieses E-Book passt zu Frauen, die viel fuer die Beziehung tun, Gesprache nicht scheuen und jetzt lernen wollen, wie Klarheit ruhiger, wirksamer und attraktiver wird.",
    cta: "Zum E-Book fuer Die emotionale Initiatorin",
    subtext: "Direkte Strategien fuer Kommunikation, Timing und weniger emotionalen Ueberdruck.",
  },
  over_adapting: {
    ebookName: "Das E-Book fuer Die Anpassende",
    summaryLead:
      "Deine Antworten zeigen vor allem ein Muster, in dem du Beziehung stabilisierst, indem du dich frueh auf den anderen ausrichtest und Harmonie aktiv sicherst.",
    path: [
      {
        title: "Eigene Position frueher halten",
        description: "Du bemerkst schneller, wann du mitgehst, bevor du ueberhaupt geprueft hast, was du selbst brauchst.",
      },
      {
        title: "Beduerfnisse ruhiger sichtbar machen",
        description: "Du lernst, dich klarer einzubringen, ohne aus Verbindung direkt in Haerte kippen zu muessen.",
      },
      {
        title: "Balance statt Einseitigkeit aufbauen",
        description: "Unterstuetzung bleibt, aber sie passiert nicht mehr auf Kosten deiner eigenen Linie.",
      },
    ],
    learn: [
      "wie du Anpassung frueher erkennst, bevor sie automatisch wird",
      "wie du eigene Beduerfnisse sichtbar machst, ohne Schuldgefuehl oder Rueckzug",
      "wie du wieder mehr Gegenseitigkeit und Respekt in die Dynamik bringst",
    ],
    proof:
      "Dieses E-Book ist fuer Frauen geschrieben, die viel tragen, viel mitdenken und jetzt wieder lernen wollen, wie Beziehung auf Augenhoehe statt ueber stilles Mitgehen entsteht.",
    cta: "Zum E-Book fuer Die Anpassende",
    subtext: "Praktische Schritte fuer mehr Selbstsichtbarkeit, ruhigere Grenzen und mehr Gegenseitigkeit.",
  },
};

const RESPONSE_STYLE_COPY = {
  moves_toward_clarity: "Wenn Spannung steigt, suchst du eher ueber Gespraech, Reaktion und Wiederverbindung nach Sicherheit.",
  reduces_friction: "Wenn Spannung steigt, versuchst du Reibung zuerst zu senken, bevor du eigene Themen nach vorn bringst.",
  processes_internally: "Wenn etwas kippt, verarbeitest du es zunaechst innerlich ueber Beobachten, Deuten und Sortieren.",
  stabilizes_by_adjusting: "Wenn etwas kippt, versuchst du die Beziehung eher dadurch zu beruhigen, dass du dich auf dein Gegenueber einstellst.",
  mixed_regulation: "Je nach Situation wechselst du zwischen mehreren Strategien, statt immer gleich zu reagieren.",
};

const TRIGGER_COPY = {
  ambiguity_distance: "Besonders aktiv wird dein Muster meist dann, wenn Distanz, Unklarheit oder fehlende Sicherheit im Raum stehen.",
  hurt_criticism: "Besonders aktiv wird dein Muster dann, wenn du dich verletzt, kritisiert oder emotional uebergangen fuehlst.",
  conflict_tension: "Besonders sichtbar wird dein Muster in Momenten, in denen Spannung steigt und ein Gespraech kippen koennte.",
  partner_distress: "Besonders aktiv wird dein Muster dann, wenn dein Partner gestresst, ueberfordert oder schwer lesbar wirkt.",
};

const RISK_MARKER_COPY = {
  rumination_loop: "Dadurch kann sich leicht eine Schleife bilden, in der Nachdenken wie Klaerung wirkt, dich aber innerlich nur laenger bindet.",
  self_silencing: "Das Risiko dabei ist, dass Harmonie gesichert wird, waehrend deine eigene Position immer leiser wird.",
  pursuit_under_threat: "Das Risiko dabei ist, dass Unsicherheit schnell Dringlichkeit erzeugt und Gespraeche schwerer statt leichter macht.",
  over_responsible_repair: "Das Risiko dabei ist, dass du emotionale Reparatur zu stark selbst traegst, statt sie wieder gemeinsam zu verteilen.",
  context_dependent_pattern: "Dein Ergebnis zeigt ausserdem, dass du unter Stress je nach Situation spuerbar zwischen mehreren Strategien wechseln kannst.",
};

const fallbackCard = document.getElementById("fallbackCard");
const resultShell = document.getElementById("resultShell");
const resultTitle = document.getElementById("resultTitle");
const resultSummary = document.getElementById("resultSummary");
const improvementPath = document.getElementById("improvementPath");
const microInsights = document.getElementById("microInsights");
const pathNote = document.getElementById("pathNote");
const programTitle = document.getElementById("programTitle");
const programCopy = document.getElementById("programCopy");
const programList = document.getElementById("programList");
const resultCta = document.getElementById("resultCta");
const programSubtext = document.getElementById("programSubtext");
const proofTitle = document.getElementById("proofTitle");
const proofCopy = document.getElementById("proofCopy");
const proofStatNumber = document.getElementById("proofStatNumber");
const proofStatCopy = document.getElementById("proofStatCopy");

init();

function init() {
  const storedState = loadQuizState();
  const profile = getProfileFromState(storedState) || buildFallbackProfileFromUrl();

  if (!profile || !TRAITS[profile.primaryTrait || profile.dominantTrait]) {
    showFallback();
    return;
  }

  const personalized = generateResultPageModel(profile);

  fallbackCard.classList.add("is-hidden");
  resultShell.classList.remove("is-hidden");

  resultTitle.innerHTML = personalized.headlineHtml;
  resultSummary.textContent = personalized.summary;
  pathNote.textContent = personalized.pathNote;
  programTitle.textContent = personalized.programTitle;
  programCopy.textContent = personalized.programCopy;
  resultCta.textContent = personalized.ctaLabel;
  resultCta.href = personalized.ctaUrl;
  programSubtext.textContent = personalized.programSubtext;
  proofTitle.textContent = personalized.proofTitle;
  proofCopy.textContent = personalized.proofCopy;
  proofStatNumber.textContent = personalized.proofBadge;
  proofStatCopy.textContent = personalized.proofBadgeCopy;

  renderPathCards(improvementPath, personalized.improvementPath);
  renderInsightTiles(microInsights, personalized.microInsights);
  renderProgramPoints(programList, personalized.ebookHighlights);

  window.resultDebug = personalized;
}

function loadQuizState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : null;
  } catch {
    return null;
  }
}

function getProfileFromState(state) {
  if (!state || typeof state !== "object") return null;
  const profile = state.resultProfile;
  if (!profile || typeof profile !== "object") return null;
  const primaryTrait = profile.primaryTrait || profile.dominantTrait;
  if (!TRAITS[primaryTrait]) return null;
  return {
    ...profile,
    primaryTrait,
    dominantTrait: profile.dominantTrait || primaryTrait,
  };
}

function buildFallbackProfileFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const legacyType = (params.get("type") || "").trim().toUpperCase();
  const primaryFromLegacy = LEGACY_TYPE_MAP[legacyType] || null;
  const primary = normalizeTraitId(params.get("primary")) || primaryFromLegacy;
  const secondary = normalizeTraitId(params.get("secondary"));

  if (!primary) return null;
  return buildFallbackProfile(primary, secondary);
}

function generateResultPageModel(profile) {
  const primaryTraitId = profile.primaryTrait || profile.dominantTrait;
  const primaryTrait = TRAITS[primaryTraitId];
  const primaryCopy = RESULT_COPY[primaryTraitId];
  const secondaryTrait = profile.secondaryTrait ? TRAITS[profile.secondaryTrait] : null;
  const responseSentence = RESPONSE_STYLE_COPY[profile.responseStyle] || RESPONSE_STYLE_COPY.mixed_regulation;
  const triggerSentence = profile.triggerTendency
    ? TRIGGER_COPY[profile.triggerTendency]
    : "Dein Muster wird besonders deutlich, sobald Verbindung, Spannung oder Lesbarkeit in der Beziehung unsicher wirken.";
  const riskSentence = profile.riskMarkers && profile.riskMarkers.length
    ? RISK_MARKER_COPY[profile.riskMarkers[0]] || ""
    : "";

  const summaryParts = [primaryCopy.summaryLead, responseSentence, triggerSentence];
  if (secondaryTrait && secondaryTrait.id !== primaryTraitId) {
    summaryParts.push(
      `Im zweiten Schritt zeigt sich bei dir oft ${secondaryTrait.strategyLabel}. Genau diese Kombination erklaert, warum sich dein Muster fuer dich so vertraut anfuehlt.`
    );
  }
  if (riskSentence) {
    summaryParts.push(riskSentence);
  }

  const insightItems = buildInsightItems(primaryTraitId, responseSentence, triggerSentence, riskSentence, secondaryTrait);

  return {
    primaryTrait: primaryTraitId,
    headlineHtml: `<span class="result-hero__title-prefix">Dein Ergebnis:</span> ${escapeHtml(primaryTrait.label)}`,
    summary: summaryParts.join(" "),
    improvementPath: primaryCopy.path,
    pathNote: `Genau diese drei Veraenderungen fuehrt ${primaryCopy.ebookName} fuer dich Schritt fuer Schritt zusammen.`,
    microInsights: insightItems,
    programTitle: "Das passende E-Book fuer dich",
    programCopy: `${primaryCopy.ebookName} wurde fuer Frauen geschrieben, die dieses Muster nicht nur erkennen, sondern im Alltag konkret veraendern wollen.`,
    ebookHighlights: primaryCopy.learn,
    ctaLabel: primaryCopy.cta,
    ctaUrl: EBOOK_URLS[primaryTraitId] || "#",
    programSubtext: primaryCopy.subtext,
    proofTitle: "Warum genau dieses E-Book fuer dich passt.",
    proofCopy: primaryCopy.proof,
    proofBadge: "4 E-Books",
    proofBadgeCopy: `aber fuer dein Ergebnis ist vor allem ${primaryCopy.ebookName.toLowerCase()} relevant.`,
  };
}

function buildInsightItems(primaryTraitId, responseSentence, triggerSentence, riskSentence, secondaryTrait) {
  const items = [];

  items.push(triggerSentence);

  if (secondaryTrait) {
    items.push(
      `${responseSentence} Zusaetzlich zeigt sich bei dir haeufig ${secondaryTrait.strategyLabel}, sobald dein Hauptmuster schon aktiviert ist.`
    );
  } else {
    items.push(responseSentence);
  }

  if (riskSentence) {
    items.push(riskSentence);
  } else {
    items.push(getDefaultCostSentence(primaryTraitId));
  }

  return items;
}

function getDefaultCostSentence(primaryTraitId) {
  switch (primaryTraitId) {
    case "overthinking":
      return "Ohne neuen Umgang damit bleibt oft viel innere Unruhe bestehen, obwohl im Aussen noch gar nichts wirklich geklaert wurde.";
    case "conflict_avoidance":
      return "Ohne neuen Umgang damit bleibt nach aussen oft Ruhe, waehrend sich innen unerledigte Themen und Distanz aufbauen koennen.";
    case "emotional_initiating":
      return "Ohne neuen Umgang damit wird dein Wunsch nach Klaerung schnell zu viel Tempo fuer den Moment und verliert dadurch Wirkung.";
    case "over_adapting":
      return "Ohne neuen Umgang damit bleibt die Beziehung oft ruhig, waehrend deine eigene Position immer weniger sichtbar wird.";
    default:
      return "Ohne neuen Umgang damit wiederholt sich das Muster leichter genau in den Momenten, in denen du eigentlich mehr Sicherheit brauchst.";
  }
}

function renderInsightTiles(target, items) {
  const titles = [
    "Was dich aktiviert",
    "Wie du dann reagierst",
    "Woran es dich kostet",
  ];
  target.innerHTML = "";
  items.forEach((item, index) => {
    const point = document.createElement("article");
    point.className = "insight-point";
    if (index === 0) {
      point.classList.add("is-open");
    }
    point.innerHTML = `
      <button
        class="insight-point__trigger"
        type="button"
        aria-expanded="${index === 0 ? "true" : "false"}"
      >
        <span class="insight-point__trigger-main">
          <span class="insight-point__index">0${index + 1}</span>
          <span class="insight-point__title">${titles[index] || `Punkt ${index + 1}`}</span>
        </span>
        <span class="insight-point__icon" aria-hidden="true">
          <i class="fa-solid fa-plus"></i>
        </span>
      </button>
      <div class="insight-point__panel">
        <div class="insight-point__panel-inner">
          <p class="insight-point__copy">${escapeHtml(capitalizeFirst(item))}</p>
        </div>
      </div>
    `;
    target.appendChild(point);
  });

  const points = [...target.querySelectorAll(".insight-point")];
  points.forEach((point) => {
    const trigger = point.querySelector(".insight-point__trigger");
    if (!trigger) return;
    trigger.addEventListener("click", () => {
      points.forEach((otherPoint) => {
        const otherTrigger = otherPoint.querySelector(".insight-point__trigger");
        const isCurrent = otherPoint === point;
        const shouldOpen = isCurrent ? !otherPoint.classList.contains("is-open") : false;
        otherPoint.classList.toggle("is-open", shouldOpen);
        if (otherTrigger) {
          otherTrigger.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
        }
      });
    });
  });
}

function renderProgramPoints(target, items) {
  const titles = [
    "Warum es sich wiederholt",
    "Was du konkret veraenderst",
    "Wie Beziehung dadurch kippt oder sich stabilisiert",
  ];
  target.innerHTML = "";
  items.forEach((item, index) => {
    const point = document.createElement("article");
    point.className = "program-point";
    point.innerHTML = `
      <h3 class="program-point__title">${titles[index] || `Punkt ${index + 1}`}</h3>
      <p class="program-point__copy">${escapeHtml(capitalizeFirst(item))}</p>
    `;
    target.appendChild(point);
  });
}

function renderPathCards(target, items) {
  target.innerHTML = "";
  items.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = `path-step path-step--${(index % 3) + 1}`;
    card.style.setProperty("--path-index", String(index + 1));
    card.innerHTML = `
      <span class="path-step__number">${index + 1}</span>
      <h3 class="path-step__title">${escapeHtml(item.title)}</h3>
      <p class="path-step__desc">${escapeHtml(item.description)}</p>
    `;
    target.appendChild(card);
  });
}

function capitalizeFirst(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function showFallback() {
  fallbackCard.classList.remove("is-hidden");
  resultShell.classList.add("is-hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  document.querySelectorAll(".animate-on-scroll").forEach((element) => observer.observe(element));
});
