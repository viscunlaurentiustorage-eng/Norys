const RESULT_STORAGE_KEY = "norysResult";

const RESULT_CONTENT = {
  overthinker: {
    typeName: "Ueberdenkerin",
    heroSubtitle: "Du willst Sicherheit und Klarheit, geraetst dabei aber oft in inneren Druck.",
    identity: [
      "Du liest zwischen den Zeilen und suchst schnell nach Bedeutung.",
      "Nach Distanz oder Streit denkst du lange weiter.",
      "Du willst Klarheit, bevor Unsicherheit zu gross wird.",
    ],
    problems: [
      "Du reagierst auf Unsicherheit, bevor echte Klarheit da ist.",
      "Dadurch entstehen Druck, Missverstaendnisse und innere Anspannung.",
      "Was Naehe schuetzen soll, belastet sie manchmal unbemerkt.",
    ],
    futureRisk: [
      "Du gruebelst weiter ueber kleine Signale.",
      "Gespraeche drehen sich im Kreis.",
      "Naehe fuehlt sich anstrengend an.",
    ],
    futureGain: [
      "Du reagierst ruhiger und klarer.",
      "Du sprichst Unsicherheit frueher und besser an.",
      "Naehe fuehlt sich wieder sicherer an.",
    ],
    ebookTitle: "Die Ueberdenkerin: Raus aus dem Gruebeln, rein in echte Naehe",
    offerDescription:
      "Dieses eBook zeigt dir, warum dein Muster entsteht und wie du es im Alltag konkret veraenderst. Klar, praktisch und genau auf deinen Typ abgestimmt.",
    outcomes: [
      "Du erkennst deine Trigger frueher.",
      "Du lernst, klarer statt angespannter zu reagieren.",
      "Du baust mehr Ruhe und Verbindung in deiner Beziehung auf.",
    ],
    testimonials: [
      {
        quote:
          "Ich habe mich sofort erkannt und endlich verstanden, warum ich nach Streit so festhaenge.",
        name: "Julia Weber, 34",
      },
      {
        quote:
          "Nicht oberflaechlich, sondern extrem praezise. Ich wusste direkt: Das ist mein Thema.",
        name: "Anne Lorenz, 32",
      },
      {
        quote:
          "Das eBook hat mir geholfen, ruhiger zu kommunizieren statt alles zu zerdenken.",
        name: "Sophie Kern, 35",
      },
    ],
  },
  emotionalInitiator: {
    typeName: "emotionale Antreiberin",
    heroSubtitle: "Du willst schnell wieder Naehe, erzeugst dabei aber manchmal ungewollt Druck.",
    identity: [
      "Du sprichst Probleme lieber sofort an, als sie offen zu lassen.",
      "Distanz haeltst du schwer aus und suchst schnell wieder Verbindung.",
      "Wenn etwas kippt, gehst du emotional eher nach vorn als zurueck.",
    ],
    problems: [
      "Du ziehst auf Klaerung, waehrend dein Gegenueber noch im Rueckzug ist.",
      "Dadurch fuehlen sich Gespraeche schnell intensiver an als noetig.",
      "Dein Wunsch nach Naehe loest dann eher Gegendruck als Offenheit aus.",
    ],
    futureRisk: [
      "Du fuehlst dich weiter allein mit deinem Klaerungswunsch.",
      "Gespraeche kippen schneller in Spannung.",
      "Dein Gegenueber zieht sich eher zurueck.",
    ],
    futureGain: [
      "Du schaffst Naehe ohne Druck aufzubauen.",
      "Du fuehrst Gesprraeche ruhiger und klarer.",
      "Verbindung entsteht mit mehr Gegenseitigkeit.",
    ],
    ebookTitle: "Die emotionale Antreiberin: Naehe schaffen ohne Druck",
    offerDescription:
      "Dieses eBook zeigt dir, wie du Verbindung aufbaust, ohne dein Gegenueber zu ueberfordern. Direkt auf dein Muster heruntergebrochen.",
    outcomes: [
      "Du erkennst, wann Naehewunsch in Druck kippt.",
      "Du lernst, emotional klarer zu fuehren.",
      "Du erzeugst wieder mehr Offenheit statt Rueckzug.",
    ],
    testimonials: [
      {
        quote:
          "Ich habe sofort verstanden, warum ich es oft gut meine und trotzdem Druck ausloese.",
        name: "Nina Mueller, 41",
      },
      {
        quote:
          "Sehr klar. Es hat mein Problem nicht verurteilt, sondern endlich greifbar gemacht.",
        name: "Miriam Bauer, 40",
      },
      {
        quote:
          "Seitdem gehe ich ruhiger in schwierige Gespraeche und bekomme viel weniger Rueckzug.",
        name: "Tanja Richter, 45",
      },
    ],
  },
  conflictAvoider: {
    typeName: "Konfliktvermeiderin",
    heroSubtitle: "Du willst Ruhe bewahren, doch genau dadurch entsteht oft stille Distanz.",
    identity: [
      "Du schluckst Themen eher runter, bevor Streit entsteht.",
      "Du willst nicht anstrengend wirken und sagst manches lieber nicht.",
      "Oft merkst du erst spaeter, wie viel sich innerlich angestaut hat.",
    ],
    problems: [
      "Wichtige Themen kommen zu spaet oder gar nicht auf den Tisch.",
      "Nach aussen bleibt es ruhig, innen waechst aber Frust.",
      "So entsteht Distanz ohne klare Aussprache.",
    ],
    futureRisk: [
      "Du haeltst weiter zu viel zurueck.",
      "Naehe fuehlt sich leer statt ehrlich an.",
      "Du fuehlst dich uebersehen, ohne dich klar zu zeigen.",
    ],
    futureGain: [
      "Du sprichst frueher aus, was dir wirklich wichtig ist.",
      "Konflikte verlieren ihren Schrecken.",
      "Eure Beziehung wird ehrlicher und naeher.",
    ],
    ebookTitle: "Die Konfliktvermeiderin: Klar sprechen ohne Eskalation",
    offerDescription:
      "Dieses eBook zeigt dir, wie du Themen frueher und ruhiger ansprichst, ohne aus Harmonieverlust gleich Gefahr zu machen.",
    outcomes: [
      "Du erkennst deinen Rueckzug frueher.",
      "Du lernst, schwierige Themen sicherer anzusprechen.",
      "Du baust mehr Ehrlichkeit und Verbindung auf.",
    ],
    testimonials: [
      {
        quote:
          "Ich dachte immer, Ruhe waere automatisch gut. Jetzt verstehe ich, wie viel ich eigentlich vermeide.",
        name: "Franziska Roth, 37",
      },
      {
        quote:
          "Extrem treffend. Vor allem dieses stille Zurueckhalten, bis man sich innerlich schon entfernt fuehlt.",
        name: "Lea Schmidt, 33",
      },
      {
        quote:
          "Ich spreche Probleme jetzt frueher an und fuehle mich dabei deutlich sicherer.",
        name: "Melanie Brandt, 43",
      },
    ],
  },
  adapter: {
    typeName: "Anpasserin",
    heroSubtitle: "Du gibst viel fuer Harmonie, verlierst dabei aber oft dich selbst aus dem Blick.",
    identity: [
      "Du sagst schneller ja als nein, damit es leicht bleibt.",
      "Du stellst eigene Beduerfnisse oft hinter die Beziehung.",
      "Du merkst meist erst spaet, dass du ueber deine Grenze gegangen bist.",
    ],
    problems: [
      "Du passt dich an, statt dich klar zu zeigen.",
      "Kurzfristig entsteht Frieden, langfristig aber stiller Frust.",
      "So fuehlst du dich in der Beziehung immer weniger gesehen.",
    ],
    futureRisk: [
      "Du wirst innerlich erschoepfter und undeutlicher.",
      "Deine Grenzen verschwimmen immer mehr.",
      "Naehe fuehlt sich wie Verantwortung statt Gegenseitigkeit an.",
    ],
    futureGain: [
      "Du erkennst Grenzen frueher.",
      "Du sprichst Beduerfnisse klarer aus.",
      "Beziehung fuehlt sich wieder gegenseitiger an.",
    ],
    ebookTitle: "Die Anpasserin: Grenzen setzen ohne Schuldgefuehl",
    offerDescription:
      "Dieses eBook hilft dir, aus stiller Ueberanpassung in mehr Klarheit, Selbstachtung und echte Gegenseitigkeit zu kommen.",
    outcomes: [
      "Du erkennst, warum du dich so schnell zuruecknimmst.",
      "Du lernst, Grenzen zu setzen ohne Schuldgefuehl.",
      "Du baust mehr Gegenseitigkeit in deiner Beziehung auf.",
    ],
    testimonials: [
      {
        quote:
          "Ich habe mich selten so klar beschrieben gefuehlt. Vor allem dieses Ja-Sagen trotz innerem Widerstand.",
        name: "Sarah Keller, 36",
      },
      {
        quote:
          "Kein Verkaufsgeschwaetz, sondern genau mein Thema in klaren Worten.",
        name: "Carla Neumann, 39",
      },
      {
        quote:
          "Ich habe danach zum ersten Mal ruhig Grenzen gesetzt, ohne mich tagelang schlecht zu fuehlen.",
        name: "Vanessa Schulz, 42",
      },
    ],
  },
};

const result = getStoredResult();
const content = RESULT_CONTENT[result.type] || RESULT_CONTENT.overthinker;
const checkoutButton = document.getElementById("offerCheckoutBtn");

hydratePage();
initScrollAnimations();
initCheckout();

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
  setText("resultTypeName", content.typeName);
  setText("resultHeroSubtitle", content.heroSubtitle);
  setText("ebookTitle", content.ebookTitle);
  setText("offerDescription", content.offerDescription);

  renderSimpleList("identityList", content.identity);
  renderSimpleList("problemList", content.problems);
  renderSimpleList("futureRiskList", content.futureRisk);
  renderSimpleList("futureGainList", content.futureGain);
  renderOutcomes();
  renderTestimonials();
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

function initCheckout() {
  if (!checkoutButton) {
    return;
  }

  checkoutButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const originalLabel = checkoutButton.innerHTML;

    checkoutButton.setAttribute("aria-disabled", "true");
    checkoutButton.style.pointerEvents = "none";
    checkoutButton.textContent = "Weiterleitung...";

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resultType: result.type,
          origin: window.location.origin,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Checkout konnte nicht gestartet werden.");
      }

      window.location.assign(data.url);
    } catch (error) {
      checkoutButton.innerHTML = originalLabel;
      checkoutButton.style.pointerEvents = "";
      checkoutButton.removeAttribute("aria-disabled");
      window.alert(error instanceof Error ? error.message : "Checkout konnte nicht gestartet werden.");
    }
  });
}
