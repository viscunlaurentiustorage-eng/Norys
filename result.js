const RESULT_STORAGE_KEY = window.NORYS_RESULT_STORAGE_KEY || "norysResult";
const RESULT_CONTENT = window.NORYS_RESULT_CONTENT || {};
const result = getStoredResult();
const content = RESULT_CONTENT[result.type] || RESULT_CONTENT.overthinker;

function getStoredResult() {
  try {
    const rawValue = window.localStorage.getItem(RESULT_STORAGE_KEY);
    const parsedValue = rawValue ? JSON.parse(rawValue) : null;

    if (parsedValue && RESULT_CONTENT[parsedValue.type]) {
      return parsedValue;
    }
  } catch (error) {
    console.error("Result state could not be read.", error);
  }

  return {
    type: "overthinker",
    confidence: 87,
  };
}

function hydratePage() {
  const personalizedContent = buildPersonalizedContent(result, content);

  setText("resultTypeName", content.typeName);
  setText("resultHeroSubtitle", personalizedContent.heroSubtitle);
  setText("ebookTitle", content.ebookTitle);
  setText("offerDescription", content.offerDescription);

  renderSimpleList("identityList", personalizedContent.identity);
  renderSimpleList("problemList", personalizedContent.problems);
  renderSimpleList("futureRiskList", personalizedContent.futureRisk);
  renderSimpleList("futureGainList", personalizedContent.futureGain);
  renderOutcomes();
  renderTestimonials();
}

function buildPersonalizedContent(currentResult, fallbackContent) {
  const selectedAnswers = Array.isArray(currentResult.selectedAnswers) ? currentResult.selectedAnswers : [];
  const rankedDimensions = getRankedDimensions(currentResult.dimensions);

  return {
    heroSubtitle: buildHeroSubtitle(fallbackContent.heroSubtitle, rankedDimensions),
    identity: buildIdentityLines(selectedAnswers, currentResult.type, fallbackContent.identity),
    problems: buildDimensionLines(rankedDimensions, PROBLEM_COPY, fallbackContent.problems),
    futureRisk: buildDimensionLines(rankedDimensions, FUTURE_RISK_COPY, fallbackContent.futureRisk),
    futureGain: buildDimensionLines(rankedDimensions, FUTURE_GAIN_COPY, fallbackContent.futureGain),
  };
}

function getRankedDimensions(dimensions) {
  return Object.entries(dimensions || {})
    .filter(([, score]) => Number(score) > 0)
    .sort((left, right) => right[1] - left[1])
    .map(([dimension]) => dimension);
}

function buildIdentityLines(selectedAnswers, topType, fallbackLines) {
  const rankedAnswers = [...selectedAnswers].sort((left, right) => {
    const typeWeight = Number(right.type === topType) - Number(left.type === topType);
    if (typeWeight !== 0) {
      return typeWeight;
    }

    return (ANSWER_PRIORITY[right.questionId] || 0) - (ANSWER_PRIORITY[left.questionId] || 0);
  });

  const lines = rankedAnswers
    .slice(0, 6)
    .map((item) => toSecondPerson(item.answerLabel))
    .filter(Boolean)
    .filter((item, index, items) => items.indexOf(item) === index)
    .slice(0, 3);

  return lines.length === 3 ? lines : fallbackLines;
}

function buildDimensionLines(rankedDimensions, copyMap, fallbackLines) {
  const lines = rankedDimensions
    .map((dimension) => copyMap[dimension])
    .filter(Boolean)
    .filter((item, index, items) => items.indexOf(item) === index)
    .slice(0, 3);

  return lines.length === 3 ? lines : fallbackLines;
}

function buildHeroSubtitle(fallbackText, rankedDimensions) {
  const topPair = rankedDimensions.slice(0, 2);
  const hero = topPair
    .map((dimension) => HERO_COPY[dimension])
    .filter(Boolean);

  if (hero.length === 2) {
    return `${hero[0]} ${hero[1]}`;
  }

  if (hero.length === 1) {
    return hero[0];
  }

  return fallbackText;
}

function toSecondPerson(label) {
  if (!label || typeof label !== "string") {
    return "";
  }

  const replacements = [
    [/^Ich frage mich\b/i, "Du fragst dich"],
    [/^Ich denke\b/i, "Du denkst"],
    [/^Ich moechte\b/i, "Du moechtest"],
    [/^Ich sage mir\b/i, "Du sagst dir"],
    [/^Ich versuche\b/i, "Du versuchst"],
    [/^Ich gehe\b/i, "Du gehst"],
    [/^Ich lasse\b/i, "Du laesst"],
    [/^Ich spreche\b/i, "Du sprichst"],
    [/^Ich achte\b/i, "Du achtest"],
    [/^Ich spiele\b/i, "Du spielst"],
    [/^Ich konzentriere mich\b/i, "Du konzentrierst dich"],
    [/^Ich hoffe\b/i, "Du hoffst"],
    [/^Ich habe\b/i, "Du hast"],
    [/^Ich werde\b/i, "Du wirst"],
    [/^Ich spuere\b/i, "Du spuerst"],
    [/^frage ich\b/i, "Du fragst"],
    [/^versuche ich\b/i, "Du versuchst"],
    [/^lasse ich\b/i, "Du laesst"],
    [/^spreche ich\b/i, "Du sprichst"],
    [/^passe ich\b/i, "Du passt"],
    [/^warte ich\b/i, "Du wartest"],
    [/^denke ich\b/i, "Du denkst"],
  ];

  let transformed = label.trim();
  replacements.some(([pattern, replacement]) => {
    if (pattern.test(transformed)) {
      transformed = transformed.replace(pattern, replacement);
      return true;
    }

    return false;
  });

  return transformed.endsWith(".") ? transformed : `${transformed}.`;
}

function renderSimpleList(id, items) {
  const root = document.getElementById(id);
  if (!root) return;

  root.innerHTML = "";
  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    root.appendChild(listItem);
  });
}

function renderOutcomes() {
  const root = document.getElementById("offerOutcomeList");
  if (!root) return;

  root.innerHTML = "";
  content.outcomes.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    root.appendChild(listItem);
  });
}

function renderTestimonials() {
  const topRow = document.getElementById("testimonialsRowTop");
  const bottomRow = document.getElementById("testimonialsRowBottom");

  if (!topRow || !bottomRow) return;

  const testimonialDates = [
    "08 Mar 2026",
    "07 Mar 2026",
    "06 Mar 2026",
    "08 Mar 2026",
    "07 Mar 2026",
    "06 Mar 2026",
  ];

  const cards = [...content.testimonials, ...content.testimonials].map((item, index) => ({
    ...item,
    date: testimonialDates[index] || "08 Mar 2026",
  }));

  topRow.innerHTML = "";
  bottomRow.innerHTML = "";

  cards.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "testimonial-card";
    card.innerHTML = `
      <p class="testimonial-card__quote">${item.quote}</p>
      <div class="testimonial-card__footer">
        <span class="testimonial-card__avatar" aria-hidden="true"><i class="fa-solid fa-user"></i></span>
        <div class="testimonial-card__meta">
          <h3 class="testimonial-card__name">${item.name}</h3>
          <p class="testimonial-card__role"><i class="fa-regular fa-clock" aria-hidden="true"></i><span>${item.date}</span></p>
        </div>
      </div>
    `;

    if (index % 2 === 0) {
      topRow.appendChild(card);
      return;
    }

    bottomRow.appendChild(card);
  });
}

function setText(id, value) {
  const node = document.getElementById(id);
  if (node) {
    node.textContent = value;
  }
}

function initScrollAnimations() {
  const nodes = document.querySelectorAll(".animate-on-scroll");

  if (!("IntersectionObserver" in window)) {
    nodes.forEach((node) => node.classList.add("animate"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  nodes.forEach((node) => observer.observe(node));
}

const ANSWER_PRIORITY = {
  q1: 12,
  q2: 11,
  q3: 10,
  q8: 9,
  q11: 8,
  q5: 7,
  q10: 6,
  q7: 5,
  q6: 4,
  q9: 3,
  q4: 2,
  q12: 1,
};

const HERO_COPY = {
  rumination:
    "Du merkst Unsicherheit frueh und gehst dann innerlich sofort in Analyse, bis aus einem kleinen Signal schnell ein grosses Gefuehl wird.",
  hyperResponsibility:
    "Sobald Distanz entsteht, landest du schnell bei dir und traegst Verantwortung fuer Dinge, die nicht allein bei dir liegen.",
  uncertaintySensitivity:
    "Schon kleine Veraenderungen in Ton, Naehe oder Reaktion fuehlen sich fuer dich schnell bedrohlicher an, als sie nach aussen wirken.",
  clarityUrgency:
    "Offene Spannung haeltst du kaum aus, deshalb willst du so schnell wie moeglich wieder Klarheit, Sicherheit und Verbindung herstellen.",
  repairPressure:
    "Wenn etwas kippt, gehst du emotional nach vorn, noch bevor der andere innerlich wieder offen ist.",
  emotionalActivation:
    "Du spuerst Distanz sofort und willst direkt etwas tun, damit euch diese Luecke nicht noch weiter auseinanderzieht.",
  selfSilencing:
    "Du nimmst dich in angespannten Momenten eher zurueck, obwohl in dir laengst etwas wehtut oder arbeitet.",
  withdrawal:
    "Sobald ein Gespraech schwierig wird, gehst du eher auf Abstand, statt mit deinem eigentlichen Thema sichtbar zu bleiben.",
  tensionAvoidance:
    "Du versuchst Spannung klein zu halten, auch wenn dadurch wichtige Dinge viel zu lange unausgesprochen bleiben.",
  harmonyKeeping:
    "Du stabilisierst lieber die Stimmung als deine eigene Grenze, damit es zwischen euch ruhig bleibt.",
  selfAbandonment:
    "Du passt dich oft schneller an, als dass du deutlich machst, was du selbst gerade brauchst.",
  emotionalCaretaking:
    "Du spuerst schnell, was der andere braucht, und verlierst dabei leicht aus dem Blick, was das alles mit dir macht.",
};

const PROBLEM_COPY = {
  rumination:
    "Je laenger du innerlich analysierst, desto groesser wirkt das Problem und desto angespannter gehst du ins naechste Gespraech.",
  hyperResponsibility:
    "Wenn du Spannung sofort auf dich beziehst, traegst du Schuldgefuehle und innere Last fuer Dinge, die oft gar nicht nur bei dir liegen.",
  uncertaintySensitivity:
    "Kleine Veraenderungen loesen schnell Alarm in dir aus und machen Naehe fragiler, als sie eigentlich sein muesste.",
  clarityUrgency:
    "Dein Wunsch nach schneller Klaerung fuehlt sich fuer dein Gegenueber oft wie Druck an, genau dann, wenn eigentlich noch Ruhe noetig waere.",
  repairPressure:
    "Je staerker du Verbindung wiederherstellen willst, desto eher erlebt der andere dich als zu nah, zu schnell oder zu viel.",
  emotionalActivation:
    "Du gehst mit hoher emotionaler Energie in schwierige Momente und machst Gespraeche dadurch oft intensiver, als sie sein muessten.",
  selfSilencing:
    "Was du herunterschluckst, verschwindet nicht. Es sammelt sich innerlich an und taucht spaeter als Distanz, Kaelte oder Frust wieder auf.",
  withdrawal:
    "Wenn du dich zurueckziehst, bleibt das eigentliche Thema offen und die Beziehung verliert leise an Ehrlichkeit und Naehe.",
  tensionAvoidance:
    "Harmonie nach aussen kostet dich oft Klarheit nach innen und genau das macht Naehe auf Dauer unsicher.",
  harmonyKeeping:
    "Indem du die Stimmung schuetzt, schuetzt du nicht automatisch auch dich und genau dort beginnt stiller Groll.",
  selfAbandonment:
    "Wenn du dich zu oft anpasst, wirst du in der Beziehung immer schwerer wirklich greifbar und immer leiser mit dir selbst.",
  emotionalCaretaking:
    "Je staerker du beim anderen bist, desto leichter uebersiehst du, wo du selbst laengst ueber deine Grenze gehst.",
};

const FUTURE_RISK_COPY = {
  rumination:
    "Du zerdenkst weiter Signale, die eigentlich nur in einem ruhigen Gespraech geklaert werden muessten.",
  hyperResponsibility:
    "Du fuehlst dich weiter fuer jede Distanz mitverantwortlich und geraetst immer schneller in inneren Druck.",
  uncertaintySensitivity:
    "Eure Verbindung fuehlt sich weiter unsicher an, selbst wenn objektiv noch gar nichts wirklich gekippt ist.",
  clarityUrgency:
    "Du fuehrst weiter Gespraeche zu frueh und bekommst dadurch genau den Rueckzug, den du eigentlich vermeiden willst.",
  repairPressure:
    "Je mehr du Naehe sichern willst, desto oefter fuehlt sich dein Gegenueber gedrueckt statt eingeladen.",
  emotionalActivation:
    "Kleine Spannungen werden weiter zu grossen Momenten, weil du innerlich sofort auf Alarm gehst.",
  selfSilencing:
    "Du haeltst weiter zu viel aus, bis dein innerer Rueckzug laenger bleibt als das eigentliche Problem.",
  withdrawal:
    "Wichtige Themen bleiben weiter offen und die Distanz zwischen euch wird still, aber real.",
  tensionAvoidance:
    "Ihr wirkt nach aussen ruhig, aber nach innen wird die Beziehung weiter vorsichtiger, kuehler und unehrlicher.",
  harmonyKeeping:
    "Du haeltst die Beziehung weiter stabil, bezahlst dafuer aber mit immer weniger innerer Klarheit und immer mehr Erschoepfung.",
  selfAbandonment:
    "Du verlierst weiter Teile von dir in der Anpassung und fuehlst dich trotz Naehe immer weniger gesehen.",
  emotionalCaretaking:
    "Du kuemmerst dich weiter zuerst um die Stimmung des anderen und kommst selbst erst ganz am Ende vor.",
};

const FUTURE_GAIN_COPY = {
  rumination:
    "Du beruhigst deinen Kopf frueher und gehst wieder mit mehr Realitaet statt mit inneren Horrorszenarien in Gespraeche.",
  hyperResponsibility:
    "Du unterscheidest klarer, was wirklich bei dir liegt und was nicht mehr deine Last sein muss.",
  uncertaintySensitivity:
    "Du bleibst auch bei kleinen Veraenderungen innerlich ruhiger und machst Beziehung nicht sofort zu Alarm.",
  clarityUrgency:
    "Du findest den richtigen Moment fuer Klaerung und erzeugst dadurch mehr Offenheit statt Gegendruck.",
  repairPressure:
    "Du schaffst wieder Verbindung, ohne sie durch Tempo oder Intensitaet ungewollt schwer zu machen.",
  emotionalActivation:
    "Du gehst ruhiger in heikle Momente und gibst Gespraechen dadurch deutlich mehr echte Chance.",
  selfSilencing:
    "Du sprichst frueher aus, was wirklich in dir arbeitet, bevor daraus Distanz wird.",
  withdrawal:
    "Du bleibst in schwierigen Momenten mehr bei dir und gleichzeitig mehr in echter Verbindung.",
  tensionAvoidance:
    "Du haeltst Spannung besser aus und gewinnst dafuer viel mehr Ehrlichkeit und Naehe zurueck.",
  harmonyKeeping:
    "Du sorgst nicht nur fuer Ruhe, sondern auch dafuer, dass du in der Beziehung wieder klarer vorkommst.",
  selfAbandonment:
    "Du setzt frueher Grenzen und fuehlst dich in der Beziehung wieder deutlicher, sicherer und mehr bei dir.",
  emotionalCaretaking:
    "Du bleibst empathisch, ohne dich selbst dabei immer wieder aus der Beziehung herauszunehmen.",
};

hydratePage();
initScrollAnimations();
