const RESULT_STORAGE_KEY = window.NORYS_RESULT_STORAGE_KEY || "norysResult";
const LANGUAGE_STORAGE_KEY = "norysLanguage";
const OFFER_DEADLINE_STORAGE_KEY = "norysOfferDeadlineAt";
const RESULT_CONTENT_DE = window.NORYS_RESULT_CONTENT || {};
const OFFER_DURATION_MS = ((4 * 24) + 16) * 60 * 60 * 1000 + 34 * 60 * 1000;
const tracker = window.NorysTracker || null;

const RESULT_CONTENT_EN = {
  overthinker: {
    typeName: "Overthinker",
    ebookTitle: "The Overthinker: Out of Rumination, Back Into Real Closeness",
    heroSubtitle:
      "You want safety, but this constant search for clarity often leaves you more restless inside.",
    ebookHeroSubtitle:
      "This eBook shows you clearly why small moments of uncertainty hit you so hard, how that creates distance, and what you can do to become calmer and closer again.",
    ebookIntroDescription:
      "This is not generic relationship advice. It is a clear guide for the exact pattern that keeps pulling you into overthinking, pressure, and uncertainty.",
    offerDescription:
      "This eBook shows you why you slip into overthinking so fast, how that creates pressure and distance between you, and how to respond with more calm, clarity, and closeness instead of getting trapped in your head again.",
    outcomes: [
      "You notice earlier when your mind is turning one small uncertainty into a whole inner movie.",
      "You respond more clearly instead of getting stuck in tension, spiraling thoughts, and inner alarm.",
      "You bring more calm, safety, and real closeness back into your relationship.",
    ],
    ebookIncludes: [
      "A clear explanation of why your overthinking in relationships activates so fast and why it is so hard to let go of.",
      "Concrete steps for moments of distance, uncertainty, silence, and conflict so you do not fall into the same inner pressure again.",
      "Exercises that help you seek closeness without getting lost in your head or burdening the other person with your inner unrest.",
    ],
    testimonials: [
      {
        quote:
          "I felt seen immediately. It explained exactly why I cannot let things go internally after conflict.",
        name: "Julia Weber, 34",
      },
      {
        quote:
          "It was not just accurate, it was painfully honest. This is exactly my pattern.",
        name: "Anne Lorenz, 32",
      },
      {
        quote:
          "For the first time, I felt like I could not only understand my reactions but actually change them.",
        name: "Sophie Kern, 35",
      },
      {
        quote:
          "That part about replaying everything after distance hit me immediately. That is exactly what I do every time.",
        name: "Maren Vogt, 31",
      },
      {
        quote:
          "I used to think I was just sensitive. In reality, I recognized myself in almost every line.",
        name: "Isabel Franke, 38",
      },
      {
        quote:
          "Especially the part about needing clarity so fast hit me hard. I only now see how much pressure that creates inside me.",
        name: "Katharina Busch, 36",
      },
    ],
  },
  emotionalInitiator: {
    typeName: "Emotional Initiator",
    ebookTitle: "The Emotional Initiator: Creating Closeness Without Pressure",
    heroSubtitle:
      "You want to save the connection, but your pace often feels like pressure to the other person.",
    ebookHeroSubtitle:
      "This eBook helps you understand why you move forward so quickly in moments of distance and how to create connection without triggering withdrawal, pressure, or new tension.",
    ebookIntroDescription:
      "This is not generic communication advice. It is a clear guide for the exact moment when your wish for closeness unintentionally starts creating pressure.",
    offerDescription:
      "This eBook shows you how to create closeness without overwhelming the other person and without keeping yourself trapped in pressure through your urge to resolve everything immediately.",
    outcomes: [
      "You notice earlier when your wish for closeness is starting to turn into pressure.",
      "You learn to move through difficult moments more calmly instead of making them heavier with your pace.",
      "You create openness and real connection again instead of accidentally triggering withdrawal.",
    ],
    ebookIncludes: [
      "A clear explanation of why you become active so quickly in moments of distance and why that often triggers the opposite of what you want.",
      "Concrete strategies to lead difficult conversations more calmly, clearly, and effectively.",
      "Steps that help you build closeness without pressure, urgency, or emotional overload.",
    ],
    testimonials: [
      {
        quote:
          "I understood immediately why I mean well and still often trigger the exact opposite reaction.",
        name: "Nina Müller, 41",
      },
      {
        quote:
          "For the first time, my behavior was not framed as too much. It was explained with real clarity.",
        name: "Miriam Bauer, 40",
      },
      {
        quote:
          "Since then, I move very differently in difficult conversations and get far less withdrawal back.",
        name: "Tanja Richter, 45",
      },
      {
        quote:
          "I saw myself instantly in this pattern, especially that urge to move forward the second something shifts.",
        name: "Stefanie Lorenz, 35",
      },
      {
        quote:
          "It showed me very clearly why I want closeness and still create pressure without noticing it.",
        name: "Claudia Werner, 39",
      },
      {
        quote:
          "The result was uncomfortably honest, but that is exactly why it helped. I suddenly saw my own pace very differently.",
        name: "Bianca Reuter, 33",
      },
    ],
  },
  conflictAvoider: {
    typeName: "Conflict Avoider",
    ebookTitle: "The Conflict Avoider: Speaking Clearly Without Escalation",
    heroSubtitle:
      "You want to keep the peace, but this silence often creates the very distance you are trying to prevent.",
    ebookHeroSubtitle:
      "This eBook shows you why you pull yourself back so quickly in difficult moments and how to finally speak clearly without fear of conflict, guilt, or escalation.",
    ebookIntroDescription:
      "This is not generic communication advice. It is a concrete guide for your exact pattern: staying quiet, holding back, enduring, and drifting further away inside.",
    offerDescription:
      "This eBook shows you how to finally say what has been building up inside you without fear of escalation and without pushing yourself aside again until it feels too late inside.",
    outcomes: [
      "You recognize earlier when you are already pulling away inside even though it is not good for you anymore.",
      "You learn to address difficult topics calmly and safely before silence turns into distance.",
      "You create more honesty, closeness, and real connection in your relationship again.",
    ],
    ebookIncludes: [
      "A clear analysis of why withdrawal helps you in the short term but keeps separating you over time.",
      "Phrases and steps for earlier, calmer conversations without immediately feeling threatened.",
      "Exercises that help you handle conflict more safely instead of avoiding it again and again.",
    ],
    testimonials: [
      {
        quote:
          "I always thought my silence was consideration. Now I see how much distance I was creating with it myself.",
        name: "Franziska Roth, 37",
      },
      {
        quote:
          "It described that quiet withdrawal so precisely, the one nobody else really sees.",
        name: "Lea Schmidt, 33",
      },
      {
        quote:
          "I bring things up earlier now and no longer feel helpless when I do it.",
        name: "Melanie Brandt, 43",
      },
      {
        quote:
          "For me it was exactly that pattern of avoiding things until internally it was already too much. The result was almost uncomfortably accurate.",
        name: "Daniela Seifert, 34",
      },
      {
        quote:
          "I recognized myself most in that quiet retreat you can barely see from the outside.",
        name: "Verena Scholz, 40",
      },
      {
        quote:
          "It was the first time I saw my silence not as strength, but as part of the problem.",
        name: "Heike Braun, 46",
      },
    ],
  },
  adapter: {
    typeName: "Adapter",
    ebookTitle: "The Adapter: Setting Boundaries Without Guilt",
    heroSubtitle:
      "You give a lot for harmony, but you often pay for it with your own boundaries, needs, and voice.",
    ebookHeroSubtitle:
      "This eBook shows you why you pull yourself back so quickly in relationships and how to stand up for yourself without guilt, fear, or losing the connection.",
    ebookIntroDescription:
      "This is not generic self-love advice. It is a clear guide for your exact pattern: adapting, swallowing, functioning, and slowly losing yourself in the process.",
    offerDescription:
      "This eBook helps you step out of quiet over-adaptation and stand up for yourself more clearly, more safely, and without guilt before love turns into self-loss again.",
    outcomes: [
      "You understand why you keep pulling yourself back so quickly even though it has been costing you internally for a long time.",
      "You learn to set boundaries without feeling selfish, harsh, or wrong.",
      "You build more mutuality, respect, and inner calm in your relationship again.",
    ],
    ebookIncludes: [
      "A clear explanation of why you pull yourself back so quickly in relationships and why this leaves you emptier inside over time.",
      "Steps for expressing your needs without feeling selfish, difficult, or too much.",
      "Exercises that help you build mutuality instead of self-loss again.",
    ],
    testimonials: [
      {
        quote:
          "I have rarely seen myself this clearly. Especially that constant yes even when there was already a no inside me.",
        name: "Sarah Keller, 36",
      },
      {
        quote:
          "It was direct, honest, and unfortunately brutally accurate. Exactly my issue.",
        name: "Carla Neumann, 39",
      },
      {
        quote:
          "Afterward, I set boundaries for the first time without carrying guilt around for days.",
        name: "Vanessa Schulz, 42",
      },
      {
        quote:
          "This pattern of adapting hit me hard. I often only notice later how much I have swallowed again.",
        name: "Nadine Albrecht, 32",
      },
      {
        quote:
          "I especially recognized myself in the part about losing your own boundaries. That is exactly where I lose myself.",
        name: "Corinna Beck, 37",
      },
      {
        quote:
          "It was written calmly and still felt very direct. Especially that feeling of coming up short in the relationship yourself.",
        name: "Sandra Fuchs, 41",
      },
    ],
  },
};

const UI_TEXT = {
  de: {
    pageTitle: "Dein eBook | Norys",
    metaDescription:
      "Erfahre, was in deinem passenden Norys eBook enthalten ist und wie es dir hilft, dein Beziehungsmuster gezielt zu verändern.",
    ogLocale: "de_DE",
    ogTitle: "Dein eBook | Norys",
    ogDescription: "Die passende Vertiefung zu deinem Beziehungsmuster von Norys.",
    brandAriaLabel: "Norys Startseite",
    languageButtonAriaLabel: "Sprache wechseln",
    languageLabel: "Deutsch",
    heroKicker: "Dein passendes eBook",
    introHeading: "Was du hier wirklich bekommst",
    benefitsHeading: "Was sich für dich konkret verändert",
    outcomeHeading: "Was sich in deinem Alltag verändert",
    includesHeading: "Was du im eBook konkret lernst",
    offerHeading:
      "Wenn du nicht willst, dass dieses Muster weiter zwischen euch steht, ist das dein nächster Schritt",
    oldPriceLabel: "Statt",
    pricingHint: "Nur noch kurz zu diesem Ergebnis-Preis verfügbar.",
    offerDeadlineLabel: "Läuft ab in",
    checkoutButton: "Jetzt sicher zum Checkout",
    checkoutLoading: "Weiterleitung...",
    checkoutStartError: "Checkout konnte nicht gestartet werden.",
    checkoutHttpError: "Checkout konnte nicht gestartet werden",
    localFileError: "Öffne die Seite über deine Live-URL oder localhost, nicht direkt als lokale Datei.",
    paypalLabel: "oder direkt mit PayPal bezahlen",
    paypalUnavailable: "PayPal ist gerade nicht verfügbar.",
    paypalConfigError: "PayPal Konfiguration konnte nicht geladen werden.",
    paypalConfigMissing: "PayPal ist aktuell nicht verfügbar.",
    paypalLoadError: "PayPal konnte nicht geladen werden.",
    paypalCreateError: "PayPal Bestellung konnte nicht erstellt werden.",
    paypalCaptureError: "PayPal Zahlung konnte nicht bestätigt werden.",
    paypalCheckoutError: "PayPal Checkout konnte nicht gestartet werden.",
    purchaseConfirmedStripe:
      "Deine Zahlung war erfolgreich. Die Bestätigung und dein Download-Link wurden an deine E-Mail-Adresse gesendet.",
    purchaseConfirmedPaypal:
      "Deine PayPal Zahlung war erfolgreich. Die Bestätigung und dein Download-Link wurden an deine E-Mail-Adresse gesendet.",
    purchasePending:
      "Deine Zahlung wird noch verarbeitet. Bitte prüfe gleich dein E-Mail-Postfach.",
    purchaseError:
      "Deine Zahlung konnte nicht vollständig bestätigt werden. Bitte versuche es erneut oder melde dich beim Support.",
    testimonialsHeading: "So fühlt es sich an, wenn man sich endlich wirklich versteht",
    expiredLabel: "Abgelaufen",
    dayLabel: "Tage",
    testimonialDates: [
      "30. März 2026",
      "28. März 2026",
      "27. März 2026",
      "25. März 2026",
      "23. März 2026",
      "21. März 2026",
    ],
  },
  en: {
    pageTitle: "Your eBook | Norys",
    metaDescription:
      "See what is inside your matching Norys eBook and how it helps you change your relationship pattern more deliberately.",
    ogLocale: "en_US",
    ogTitle: "Your eBook | Norys",
    ogDescription: "The right next step for your relationship pattern from Norys.",
    brandAriaLabel: "Norys homepage",
    languageButtonAriaLabel: "Change language",
    languageLabel: "English",
    heroKicker: "Your matching eBook",
    introHeading: "What you are really getting here",
    benefitsHeading: "What will actually change for you",
    outcomeHeading: "What changes in your everyday life",
    includesHeading: "What you will concretely learn in the eBook",
    offerHeading:
      "If you do not want this pattern to keep standing between you, this is your next step",
    oldPriceLabel: "Instead of",
    pricingHint: "Only available for a short time at this result price.",
    offerDeadlineLabel: "Ends in",
    checkoutButton: "Continue securely to checkout",
    checkoutLoading: "Redirecting...",
    checkoutStartError: "Checkout could not be started.",
    checkoutHttpError: "Checkout could not be started",
    localFileError: "Open the page via your live URL or localhost, not directly as a local file.",
    paypalLabel: "or pay directly with PayPal",
    paypalUnavailable: "PayPal is currently unavailable.",
    paypalConfigError: "PayPal configuration could not be loaded.",
    paypalConfigMissing: "PayPal is currently unavailable.",
    paypalLoadError: "PayPal could not be loaded.",
    paypalCreateError: "PayPal order could not be created.",
    paypalCaptureError: "PayPal payment could not be confirmed.",
    paypalCheckoutError: "PayPal checkout could not be started.",
    purchaseConfirmedStripe:
      "Your payment was successful. Your confirmation and download link were sent to your email address.",
    purchaseConfirmedPaypal:
      "Your PayPal payment was successful. Your confirmation and download link were sent to your email address.",
    purchasePending:
      "Your payment is still being processed. Please check your email inbox in a moment.",
    purchaseError:
      "Your payment could not be fully confirmed. Please try again or contact support.",
    testimonialsHeading: "What it feels like when you finally truly understand yourself",
    expiredLabel: "Expired",
    dayLabel: "days",
    testimonialDates: [
      "Mar 30, 2026",
      "Mar 28, 2026",
      "Mar 27, 2026",
      "Mar 25, 2026",
      "Mar 23, 2026",
      "Mar 21, 2026",
    ],
  },
};

const result = getStoredResult();
const pageParams = new URLSearchParams(window.location.search);
let currentLanguage = getStoredLanguage();
let currentContent = getCurrentContent();
let offerTimerId = null;

const checkoutButton = document.getElementById("ebookCheckoutBtn");
const checkoutButtonText = document.getElementById("ebookCheckoutBtnText");
const payPalContainer = document.getElementById("paypal-button-container");
const payPalSection = document.querySelector(".ebook-paypal");
const heroCover = document.getElementById("ebookHeroCover");
const purchaseNotice = document.getElementById("ebookPurchaseNotice");
const purchaseNoticeText = document.getElementById("ebookPurchaseNoticeText");

const EBOOK_COVERS = {
  overthinker: "https://i.postimg.cc/d3ZgRs6t/Grublerin.png",
  emotionalInitiator: "https://i.postimg.cc/T15Bjd02/emotionale_Initiatorin.png",
  conflictAvoider: "https://i.postimg.cc/SRYHLSdx/konfliktvermeiderin.png",
  adapter: "https://i.postimg.cc/DZMtbJqN/Anpassende.png",
};

function getStoredResult() {
  try {
    const rawValue = window.localStorage.getItem(RESULT_STORAGE_KEY);
    const parsedValue = rawValue ? JSON.parse(rawValue) : null;

    if (parsedValue && RESULT_CONTENT_DE[parsedValue.type]) {
      return parsedValue;
    }
  } catch (error) {
    console.error("Result state could not be read.", error);
  }

  return {
    type: "overthinker",
  };
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

function getCurrentContent() {
  const localizedContent = currentLanguage === "en" ? RESULT_CONTENT_EN : RESULT_CONTENT_DE;
  return localizedContent[result.type] || localizedContent.overthinker;
}

function setText(id, value) {
  const node = document.getElementById(id);
  if (node) {
    node.textContent = value;
  }
}

function applyLanguage() {
  const ui = getUi();
  const pageTitle = document.getElementById("pageTitle");
  const metaDescription = document.getElementById("metaDescription");
  const ogLocale = document.getElementById("ogLocale");
  const ogTitle = document.getElementById("ogTitle");
  const ogDescription = document.getElementById("ogDescription");
  const brandLink = document.getElementById("brandLink");
  const languageToggle = document.getElementById("languageToggle");
  const languageLabel = document.getElementById("languageLabel");

  document.documentElement.lang = currentLanguage;
  document.title = ui.pageTitle;

  if (pageTitle) pageTitle.textContent = ui.pageTitle;
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

  setText("ebookHeroKicker", ui.heroKicker);
  setText("ebookIntroHeading", ui.introHeading);
  setText("ebookBenefitsHeading", ui.benefitsHeading);
  setText("ebookOutcomeHeading", ui.outcomeHeading);
  setText("ebookIncludesHeading", ui.includesHeading);
  setText("ebookOfferHeading", ui.offerHeading);
  setText("oldPriceLabel", ui.oldPriceLabel);
  setText("pricingHint", ui.pricingHint);
  setText("offerDeadlineLabel", ui.offerDeadlineLabel);
  setText("ebookCheckoutBtnText", ui.checkoutButton);
  setText("ebookPayPalLabel", ui.paypalLabel);
  setText("ebookTestimonialsHeading", ui.testimonialsHeading);
  applyPurchaseNotice();
}

function handleLanguageToggle() {
  currentLanguage = currentLanguage === "en" ? "de" : "en";

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
  } catch (_error) {
    // Ignore storage write failures.
  }

  currentContent = getCurrentContent();
  applyLanguage();
  hydratePage();
}

function hydratePage() {
  setText("ebookHeroTitle", currentContent.ebookTitle);
  setText("ebookHeroSubtitle", currentContent.ebookHeroSubtitle || currentContent.heroSubtitle);
  setText("ebookIntroText", currentContent.ebookIntroDescription || currentContent.offerDescription);
  setText("ebookOfferDescription", currentContent.offerDescription);
  updateHeroCover();
  renderList("ebookOutcomeList", currentContent.outcomes);
  renderList("ebookIncludesList", currentContent.ebookIncludes || currentContent.outcomes);
  renderTestimonials();
  initOfferCountdown();
}

function applyPurchaseNotice() {
  if (!purchaseNotice || !purchaseNoticeText) {
    return;
  }

  const ui = getUi();
  const purchaseState = pageParams.get("purchase");
  const provider = pageParams.get("provider");

  if (!purchaseState) {
    purchaseNotice.hidden = true;
    purchaseNoticeText.textContent = "";
    return;
  }

  let message = "";
  if (purchaseState === "confirmed") {
    message = provider === "paypal" ? ui.purchaseConfirmedPaypal : ui.purchaseConfirmedStripe;
  } else if (purchaseState === "pending") {
    message = ui.purchasePending;
  } else {
    message = ui.purchaseError;
  }

  purchaseNotice.hidden = false;
  purchaseNoticeText.textContent = message;
}

function updateHeroCover() {
  if (!heroCover) {
    return;
  }

  heroCover.src = EBOOK_COVERS[result.type] || EBOOK_COVERS.overthinker;
  heroCover.alt =
    currentLanguage === "en"
      ? `Cover of ${currentContent.ebookTitle}`
      : `Cover von ${currentContent.ebookTitle}`;
}

function renderList(id, items) {
  const root = document.getElementById(id);
  if (!root) return;

  root.innerHTML = "";
  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    root.appendChild(listItem);
  });
}

function renderTestimonials() {
  const topRow = document.getElementById("testimonialsRowTop");
  const bottomRow = document.getElementById("testimonialsRowBottom");

  if (!topRow || !bottomRow) return;

  const testimonialDates = getUi().testimonialDates;
  const cards = currentContent.testimonials.map((item, index) => ({
    ...item,
    date: testimonialDates[index] || testimonialDates[testimonialDates.length - 1],
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
    } else {
      bottomRow.appendChild(card);
    }
  });
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
    const originalLabel = checkoutButtonText ? checkoutButtonText.textContent : checkoutButton.textContent;
    const ui = getUi();

    checkoutButton.setAttribute("aria-disabled", "true");
    checkoutButton.style.pointerEvents = "none";
    if (checkoutButtonText) {
      checkoutButtonText.textContent = ui.checkoutLoading;
    } else {
      checkoutButton.textContent = ui.checkoutLoading;
    }

    try {
      if (!/^https?:$/.test(window.location.protocol)) {
        throw new Error(ui.localFileError);
      }

      const order = tracker ? tracker.createOrder("stripe") : { order_id: "", payment_provider: "stripe" };
      if (tracker && order.order_id) {
        tracker.pushCheckoutStarted(order, result.quizSessionId || tracker.getQuizSessionId());
      }

      const endpoint = new URL("/api/create-checkout-session", window.location.origin).toString();
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resultType: result.type,
          language: currentLanguage,
          orderId: order.order_id,
        }),
      });

      const rawText = await response.text();
      let data = {};

      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch (_error) {
        data = { error: rawText || ui.checkoutStartError };
      }

      if (!response.ok || !data.url) {
        const fallbackMessage = `${ui.checkoutHttpError} (HTTP ${response.status}).`;
        throw new Error(data.error || fallbackMessage);
      }

      window.location.assign(data.url);
    } catch (error) {
      if (checkoutButtonText) {
        checkoutButtonText.textContent = originalLabel;
      } else {
        checkoutButton.textContent = originalLabel;
      }
      checkoutButton.style.pointerEvents = "";
      checkoutButton.removeAttribute("aria-disabled");
      window.alert(error instanceof Error ? error.message : ui.checkoutStartError);
    }
  });
}

function initPayPalCheckout() {
  if (!payPalContainer || !payPalSection) {
    return;
  }

  setupPayPalButtons().catch((error) => {
    console.error("PayPal button setup failed:", error);
    showPayPalUnavailable(error instanceof Error ? error.message : getUi().paypalUnavailable);
  });
}

async function setupPayPalButtons() {
  const ui = getUi();

  if (!/^https?:$/.test(window.location.protocol)) {
    throw new Error(ui.localFileError);
  }

  const configResponse = await fetch(new URL("/api/paypal-config", window.location.origin).toString());
  const configData = await readJsonResponse(configResponse, ui.paypalConfigError);

  if (!configResponse.ok || !configData.clientId) {
    throw new Error(configData.error || ui.paypalConfigMissing);
  }

  await loadPayPalSdk(configData.clientId);
  renderPayPalButtons();
}

function loadPayPalSdk(clientId) {
  if (window.paypal?.Buttons) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=EUR&intent=capture&components=buttons&disable-funding=card`;
    script.async = true;
    script.onload = () => {
      if (window.paypal?.Buttons) {
        resolve();
        return;
      }

      reject(new Error(getUi().paypalLoadError));
    };
    script.onerror = () => reject(new Error(getUi().paypalLoadError));
    document.head.appendChild(script);
  });
}

function renderPayPalButtons() {
  if (!window.paypal?.Buttons || !payPalContainer) {
    throw new Error(getUi().paypalLoadError);
  }

  payPalContainer.innerHTML = "";

  window.paypal
    .Buttons({
      fundingSource: window.paypal.FUNDING.PAYPAL,
      style: {
        layout: "vertical",
        shape: "pill",
        label: "paypal",
        color: "gold",
        height: 48,
      },
      createOrder: async () => {
        const order = tracker ? tracker.createOrder("paypal") : { order_id: "", payment_provider: "paypal" };
        if (tracker && order.order_id) {
          tracker.pushCheckoutStarted(order, result.quizSessionId || tracker.getQuizSessionId());
        }

        const response = await fetch(new URL("/api/paypal/create-order", window.location.origin).toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resultType: result.type,
            language: currentLanguage,
            orderId: order.order_id,
          }),
        });

        const data = await readJsonResponse(response, getUi().paypalCreateError);
        if (!response.ok || !data.orderId) {
          throw new Error(data.error || getUi().paypalCreateError);
        }

        return data.orderId;
      },
      onApprove: async (data) => {
        const response = await fetch(new URL("/api/paypal/capture-order", window.location.origin).toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: data.orderID,
          }),
        });

        const payload = await readJsonResponse(response, getUi().paypalCaptureError);
        if (!response.ok) {
          throw new Error(payload.error || getUi().paypalCaptureError);
        }

        window.location.assign(payload.redirectUrl || `/ebook.html?purchase=confirmed&provider=paypal`);
      },
      onError: (error) => {
        console.error("PayPal checkout failed:", error);
        window.alert(error instanceof Error ? error.message : getUi().paypalCheckoutError);
      },
      onCancel: () => {
        window.location.assign("ebook.html");
      },
    })
    .render("#paypal-button-container");
}

function showPayPalUnavailable(message) {
  if (!payPalContainer || !payPalSection) {
    return;
  }

  payPalSection.hidden = false;
  payPalContainer.innerHTML = `<p class="ebook-paypal__error">${message}</p>`;
}

function initOfferCountdown() {
  const deadlineRoot = document.getElementById("ebookOfferDeadline");
  const deadlineTime = document.getElementById("ebookOfferDeadlineTime");

  if (!deadlineRoot || !deadlineTime) {
    return;
  }

  if (offerTimerId) {
    window.clearInterval(offerTimerId);
    offerTimerId = null;
  }

  const deadlineAt = getOfferDeadlineAt();
  const ui = getUi();

  const renderCountdown = () => {
    const remainingMs = deadlineAt - Date.now();

    if (remainingMs <= 0) {
      deadlineRoot.classList.add("is-expired");
      deadlineTime.textContent = ui.expiredLabel;
      return false;
    }

    const totalSeconds = Math.floor(remainingMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    deadlineTime.textContent = `${days} ${ui.dayLabel} ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    return true;
  };

  if (!renderCountdown()) {
    return;
  }

  offerTimerId = window.setInterval(() => {
    if (!renderCountdown()) {
      window.clearInterval(offerTimerId);
      offerTimerId = null;
    }
  }, 1000);
}

function getOfferDeadlineAt() {
  try {
    const storedValue = Number(window.localStorage.getItem(OFFER_DEADLINE_STORAGE_KEY));

    if (Number.isFinite(storedValue) && storedValue > 0) {
      return storedValue;
    }

    const deadlineAt = Date.now() + OFFER_DURATION_MS;
    window.localStorage.setItem(OFFER_DEADLINE_STORAGE_KEY, String(deadlineAt));
    return deadlineAt;
  } catch (error) {
    console.error("Offer deadline could not be read.", error);
    return Date.now() + OFFER_DURATION_MS;
  }
}

async function readJsonResponse(response, fallbackMessage) {
  const rawText = await response.text();

  try {
    return rawText ? JSON.parse(rawText) : {};
  } catch (_error) {
    const compactText = rawText.replace(/\s+/g, " ").trim();
    return {
      error: compactText || fallbackMessage,
    };
  }
}

applyLanguage();
hydratePage();
initScrollAnimations();
initCheckout();
initPayPalCheckout();

if (tracker && result.quizSessionId) {
  tracker.setQuizSessionId(result.quizSessionId);
}

const languageToggle = document.getElementById("languageToggle");
if (languageToggle) {
  languageToggle.addEventListener("click", handleLanguageToggle);
}
