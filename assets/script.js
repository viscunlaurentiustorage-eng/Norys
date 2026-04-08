// app.js
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("startQuizBtn");
  const languageToggle = document.getElementById("languageToggle");
  const target = document.getElementById("quiz");
  const insightSection = document.getElementById("insightText");
  const insightFill = document.getElementById("insightFill");
  const testimonialsSection = document.getElementById("testimonials");
  const testimonialsRowTop = document.getElementById("testimonialsRowTop");
  const testimonialsRowBottom = document.getElementById("testimonialsRowBottom");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  let testimonialsRaf = null;
  let topCurrent = 0;
  let bottomCurrent = 0;
  let topTarget = 0;
  let bottomTarget = 0;
  let topLoopWidth = 0;
  let bottomLoopWidth = 0;
  let topDragOffset = 0;
  let bottomDragOffset = 0;
  let dragStartOffset = 0;
  let activeDragRow = null;
  let isHorizontalDrag = false;
  let dragStartX = 0;
  let dragStartY = 0;

  const LANGUAGE_STORAGE_KEY = "norysLanguage";
  const HOME_TRANSLATIONS = {
    de: {
      pageTitle: "Norys | Beziehungs-Test für Frauen: Erkenne dein Beziehungsmuster",
      metaDescription:
        "Mache den Beziehungs-Test von Norys und finde heraus, welches unbewusste Beziehungsmuster gerade eure Nähe sabotiert. Kostenlos, anonym und in etwa 60 Sekunden.",
      ogLocale: "de_DE",
      ogTitle: "Norys | Beziehungs-Test für Frauen: Erkenne dein Beziehungsmuster",
      ogDescription:
        "Finde in etwa 60 Sekunden heraus, welches Beziehungsmuster eure Nähe sabotiert und was dein Ergebnis über eure Dynamik verrät.",
      twitterTitle: "Norys | Beziehungs-Test für Frauen",
      twitterDescription:
        "Kostenloser Beziehungs-Test für Frauen: Erkenne dein Muster und verstehe eure Dynamik besser.",
      brandAriaLabel: "Norys Startseite",
      languageButtonAriaLabel: "Sprache wechseln",
      languageLabel: "Deutsch",
      heroBadgeText: "3.000+ Ergebnisse entdeckt.",
      heroTitle: "Welches Beziehungs-Muster sabotiert gerade unbemerkt eure Nähe?",
      heroSubtitle:
        'Viele Frauen geraten trotz aller Mühe immer wieder in dieselben Konflikte – dieser <strong>60-Sekunden-Test</strong> zeigt warum.',
      heroCta: "Mein Ergebnis sehen",
      heroTrust: "Anonym • Keine Anmeldung • Kostenlos",
      processTitle: "Welche Muster der Test bei dir erkennt",
      processCard1Title: "Die Überdenkerin",
      processCard1Desc: "Du analysierst jedes Detail und suchst ständig nach Sicherheit.",
      processCard2Title: "Die Anpasserin",
      processCard2Desc: "Du stellst deine Bedürfnisse zurück, um Konflikte zu vermeiden.",
      processCard3Title: "Die Konfliktvermeiderin",
      processCard3Desc: "Du schluckst Probleme herunter, bis sie irgendwann eskalieren.",
      processCard4Title: "Die emotionale Antreiberin",
      processCard4Desc: "Du versuchst Nähe herzustellen – erzeugst aber manchmal Druck.",
      processCta: "Test starten",
      insightSolid: "Viele Frauen merken ihr Muster erst zu spät. Sie geben zu viel.",
      insightFill:
        "Sie tolerieren Dinge, die ihnen schaden. Oder sie verlieren langsam die emotionale Verbindung.",
      testimonial1Quote:
        "Bei mir kam Überdenkerin raus und es passt leider wirklich sehr. Vor allem dieses ständige Nachdenken nach kleinen Spannungen kenne ich viel zu gut.",
      testimonial2Quote:
        "Ich habe den Test eher nebenbei gemacht und war dann echt still, weil Anpasserin komplett passt. Ich merke oft erst viel zu spät, wie sehr ich mich zurücknehme.",
      testimonial3Quote:
        "Bei mir kam Konfliktvermeiderin raus und das war ziemlich ehrlich. Gerade dieses Runterschlucken, bis man innerlich längst weg ist, hat mich total getroffen.",
      testimonial4Quote:
        "Emotionale Antreiberin hat bei mir wirklich gesessen. Ich merke schon länger, dass ich in Gesprächen oft zu schnell Druck aufbaue.",
      testimonial5Quote:
        "Ich fand gut, dass es nicht wie ein typisches Online-Quiz wirkte. Es war kurz, aber ich habe direkt verstanden, welches Muster bei mir immer wieder anspringt.",
      testimonial6Quote:
        "Ich war erst skeptisch, aber gerade dieses Thema mit meinen Triggern und meiner Unsicherheit war wirklich erstaunlich genau beschrieben.",
      testimonial7Quote:
        "Ich habe den Test abends gemacht und hatte danach zum ersten Mal das Gefühl, dass jemand meine Reaktionen wirklich versteht. Vor allem dieses Muster dahinter.",
      testimonial8Quote:
        "Ich habe mich direkt erkannt. Vor allem dieses Ja-Sagen, obwohl ich innerlich eigentlich nein meine, war komplett auf den Punkt.",
      testimonial9Quote:
        "Der Test war kurz und klar, aber ich hatte sofort einen Aha-Moment. Man merkt schnell, wo man sich in Beziehungen selbst im Weg steht.",
      testimonial10Quote:
        "Überdenkerin passt bei mir wirklich sehr. Nach Streit oder Distanz gehe ich innerlich oft tagelang alles noch einmal durch.",
      testimonial11Quote:
        "Ich fand gut, dass man sich nicht bewertet fühlt. Man sieht einfach sehr klar, welches Muster gerade unbemerkt mitsteuert.",
      testimonial12Quote:
        "Konfliktvermeiderin war genau mein Thema. Ich dachte lange, ich sei einfach nur ruhig, dabei weiche ich wichtigen Gesprächen oft aus.",
      testimonial13Quote:
        "Ich habe den Link von einer Freundin bekommen und nicht viel erwartet. Umso überraschter war ich, wie nah die Beschreibung an meinem Verhalten war.",
      testimonial14Quote:
        "Mir war wichtig, dass es schnell geht. Dafür war es erstaunlich treffend und ehrlicher, als ich erwartet hätte.",
      footerNavAriaLabel: "Footer-Navigation",
      footerNavQuiz: "Quiz starten",
      footerNavPatterns: "Muster-Typen",
      footerNavInsights: "Einblicke",
      footerNavStories: "Erfahrungsberichte",
      footerNavExample: "Ergebnis-Beispiel",
      footerSocialAriaLabel: "Soziale Medien",
      instagramAriaLabel: "Norys auf Instagram",
      footerCopyright: "© 2026 Norys. Alle Rechte vorbehalten.",
      footerPrivacy: "Datenschutz",
      footerImprint: "Impressum",
      footerTerms: "AGB",
      footerCookies: "Cookie-Einstellungen",
    },
    en: {
      pageTitle: "Norys | Relationship Quiz for Women: Discover Your Relationship Pattern",
      metaDescription:
        "Take Norys' relationship quiz and find out which unconscious relationship pattern is quietly sabotaging your closeness. Free, anonymous, and done in about 60 seconds.",
      ogLocale: "en_US",
      ogTitle: "Norys | Relationship Quiz for Women: Discover Your Relationship Pattern",
      ogDescription:
        "Find out in about 60 seconds which relationship pattern is sabotaging your closeness and what your result reveals about your dynamic.",
      twitterTitle: "Norys | Relationship Quiz for Women",
      twitterDescription:
        "Free relationship quiz for women: discover your pattern and understand your dynamic more clearly.",
      brandAriaLabel: "Norys homepage",
      languageButtonAriaLabel: "Change language",
      languageLabel: "English",
      heroBadgeText: "3,000+ results discovered.",
      heroTitle: "Which relationship pattern is quietly sabotaging your closeness right now?",
      heroSubtitle:
        'Many women keep ending up in the same conflicts despite all their effort – this <strong>60-second quiz</strong> shows why.',
      heroCta: "See my result",
      heroTrust: "Anonymous • No signup • Free",
      processTitle: "Which patterns the quiz can identify in you",
      processCard1Title: "The Overthinker",
      processCard1Desc: "You analyze every detail and keep searching for reassurance.",
      processCard2Title: "The Adapter",
      processCard2Desc: "You put your own needs aside to avoid conflict.",
      processCard3Title: "The Conflict Avoider",
      processCard3Desc: "You swallow problems until they eventually explode.",
      processCard4Title: "The Emotional Initiator",
      processCard4Desc: "You try to create closeness, but sometimes create pressure instead.",
      processCta: "Start the quiz",
      insightSolid: "Many women notice their pattern too late. They give too much.",
      insightFill:
        "They tolerate things that hurt them. Or they slowly lose the emotional connection.",
      testimonial1Quote:
        "I got Overthinker and it honestly fits a little too well. Especially that constant overthinking after small moments of tension.",
      testimonial2Quote:
        "I took the quiz casually and then just went quiet, because Adapter fits completely. I often realize far too late how much I keep shrinking myself.",
      testimonial3Quote:
        "I got Conflict Avoider and it was uncomfortably honest. That swallowing-things-down pattern until you're already emotionally gone really hit me.",
      testimonial4Quote:
        "Emotional Initiator really landed for me. I've noticed for a while that I often create too much pressure in difficult conversations.",
      testimonial5Quote:
        "I liked that it didn't feel like a typical online quiz. It was short, but I immediately understood which pattern keeps getting triggered in me.",
      testimonial6Quote:
        "I was skeptical at first, but the part about my triggers and insecurity was described with surprising accuracy.",
      testimonial7Quote:
        "I took the quiz in the evening and for the first time felt like someone really understood my reactions. Especially the pattern behind them.",
      testimonial8Quote:
        "I recognized myself immediately. Especially the part about saying yes even though I actually mean no inside.",
      testimonial9Quote:
        "The quiz was short and clear, but I still had an immediate aha moment. You see very quickly where you keep getting in your own way in relationships.",
      testimonial10Quote:
        "Overthinker fits me very well. After conflict or distance, I often replay everything in my head for days.",
      testimonial11Quote:
        "I liked that it didn't make me feel judged. It simply made very clear which pattern has quietly been steering things.",
      testimonial12Quote:
        "Conflict Avoider was exactly my issue. For a long time I thought I was just calm, but actually I avoid important conversations all the time.",
      testimonial13Quote:
        "A friend sent me the link and I didn't expect much. That made it even more surprising how closely the description matched my behavior.",
      testimonial14Quote:
        "What mattered to me was that it would be quick. For that, it was surprisingly accurate and more honest than I expected.",
      footerNavAriaLabel: "Footer navigation",
      footerNavQuiz: "Start quiz",
      footerNavPatterns: "Pattern types",
      footerNavInsights: "Insights",
      footerNavStories: "Testimonials",
      footerNavExample: "Sample result",
      footerSocialAriaLabel: "Social media",
      instagramAriaLabel: "Norys on Instagram",
      footerCopyright: "© 2026 Norys. All rights reserved.",
      footerPrivacy: "Privacy Policy",
      footerImprint: "Imprint",
      footerTerms: "Terms",
      footerCookies: "Cookie Settings",
    },
  };

  const isHomeI18nPage = Boolean(languageToggle && document.querySelector(".hero"));

  const buildStructuredData = (language) =>
    JSON.stringify(
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            name: "Norys",
            url: "https://noryspsychologie.de/",
            logo: "https://noryspsychologie.de/LogoTransparent.png",
          },
          {
            "@type": "WebSite",
            name: "Norys",
            url: "https://noryspsychologie.de/",
            inLanguage: language === "en" ? "en-US" : "de-DE",
          },
        ],
      },
      null,
      2,
    );

  const getInitialLanguage = () => {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return storedLanguage === "en" ? "en" : "de";
  };

  const applyHomeLanguage = (language) => {
    const dictionary = HOME_TRANSLATIONS[language] || HOME_TRANSLATIONS.de;

    document.documentElement.lang = language;
    document.title = dictionary.pageTitle;

    const headMappings = [
      ["metaDescription", "content", dictionary.metaDescription],
      ["ogLocale", "content", dictionary.ogLocale],
      ["ogTitle", "content", dictionary.ogTitle],
      ["ogDescription", "content", dictionary.ogDescription],
      ["twitterTitle", "content", dictionary.twitterTitle],
      ["twitterDescription", "content", dictionary.twitterDescription],
    ];

    headMappings.forEach(([id, attribute, value]) => {
      const node = document.getElementById(id);
      if (node) {
        node.setAttribute(attribute, value);
      }
    });

    const structuredData = document.getElementById("structuredData");
    if (structuredData) {
      structuredData.textContent = buildStructuredData(language);
    }

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      const value = dictionary[key];

      if (!value) {
        return;
      }

      const attribute = node.getAttribute("data-i18n-attr");
      if (attribute) {
        node.setAttribute(attribute, value);
        return;
      }

      if (node.getAttribute("data-i18n-html") === "true") {
        node.innerHTML = value;
        return;
      }

      node.textContent = value;
    });

    if (languageToggle) {
      languageToggle.dataset.language = language;
      languageToggle.setAttribute("aria-pressed", language === "en" ? "true" : "false");
    }
  };

  const initHomeLanguageSwitch = () => {
    if (!isHomeI18nPage) {
      return;
    }

    const initialLanguage = getInitialLanguage();
    applyHomeLanguage(initialLanguage);
    window.dispatchEvent(new CustomEvent("norys:language-change", { detail: { language: initialLanguage } }));

    languageToggle.addEventListener("click", () => {
      const nextLanguage = languageToggle.dataset.language === "en" ? "de" : "en";
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
      applyHomeLanguage(nextLanguage);
      window.dispatchEvent(new CustomEvent("norys:language-change", { detail: { language: nextLanguage } }));
    });
  };

  const updateInsightFill = () => {
    if (!insightSection || !insightFill) return;

    const rect = insightSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const start = viewportHeight * 0.85;
    const end = viewportHeight * 0.25;
    const progress = (start - rect.top) / (start - end);
    const clamped = Math.max(0, Math.min(1, progress));
    insightFill.style.setProperty("--fill", `${clamped * 100}%`);
  };

  const wrapOffset = (value, loopWidth) => {
    if (!loopWidth) return value;
    let wrapped = value % loopWidth;
    if (wrapped > loopWidth / 2) wrapped -= loopWidth;
    if (wrapped < -loopWidth / 2) wrapped += loopWidth;
    return wrapped;
  };

  const normalizeTargetNearCurrent = (target, current, loopWidth) => {
    if (!loopWidth) return target;
    let normalized = target;
    while (normalized - current > loopWidth / 2) normalized -= loopWidth;
    while (normalized - current < -loopWidth / 2) normalized += loopWidth;
    return normalized;
  };

  const setupInfiniteRow = (row) => {
    if (!row) return 0;
    if (row.dataset.loopReady === "true") {
      return Number(row.dataset.loopWidth || 0);
    }

    const cards = Array.from(row.children);
    cards.forEach((card) => row.appendChild(card.cloneNode(true)));

    const loopWidth = row.scrollWidth / 2;
    row.dataset.loopReady = "true";
    row.dataset.loopWidth = String(loopWidth);
    return loopWidth;
  };

  const refreshLoopWidths = () => {
    if (!testimonialsRowTop || !testimonialsRowBottom) return;
    topLoopWidth = setupInfiniteRow(testimonialsRowTop);
    bottomLoopWidth = setupInfiniteRow(testimonialsRowBottom);
    topLoopWidth = testimonialsRowTop.scrollWidth / 2;
    bottomLoopWidth = testimonialsRowBottom.scrollWidth / 2;

    topCurrent = wrapOffset(topCurrent, topLoopWidth);
    bottomCurrent = wrapOffset(bottomCurrent, bottomLoopWidth);
    topTarget = wrapOffset(topTarget, topLoopWidth);
    bottomTarget = wrapOffset(bottomTarget, bottomLoopWidth);
    topDragOffset = wrapOffset(topDragOffset, topLoopWidth);
    bottomDragOffset = wrapOffset(bottomDragOffset, bottomLoopWidth);
  };

  const smoothScrollTo = (destinationY, duration = 850) => {
    const startY = window.scrollY;
    const distance = destinationY - startY;
    const startTime = performance.now();

    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);

      window.scrollTo(0, startY + distance * eased);
      updateInsightFill();

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  };

  const updateTestimonialsTarget = () => {
    if (!testimonialsSection || !testimonialsRowTop || !testimonialsRowBottom) return;

    const sectionRect = testimonialsSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const sectionProgress = (viewportHeight - sectionRect.top) / (viewportHeight + sectionRect.height);
    const clampedProgress = Math.max(0, Math.min(1, sectionProgress));
    const isPhone = viewportWidth <= 640;
    const isTablet = viewportWidth <= 1024;
    const movementRange = isPhone ? 90 : isTablet ? 150 : 220;
    const scrollSpeed = isPhone ? 0.012 : isTablet ? 0.02 : 0.03;
    const bottomMultiplier = isPhone ? 0.5 : 0.7;
    const scrollFactor = window.scrollY * scrollSpeed;

    const baseTopTarget = -(clampedProgress * movementRange + scrollFactor);
    const baseBottomTarget = clampedProgress * movementRange + scrollFactor * bottomMultiplier;

    const desiredTop = baseTopTarget + topDragOffset;
    const desiredBottom = baseBottomTarget + bottomDragOffset;

    topTarget = normalizeTargetNearCurrent(desiredTop, topCurrent, topLoopWidth);
    bottomTarget = normalizeTargetNearCurrent(desiredBottom, bottomCurrent, bottomLoopWidth);
  };

  const animateTestimonials = () => {
    if (!testimonialsRowTop || !testimonialsRowBottom) {
      testimonialsRaf = null;
      return;
    }

    const lerpFactor = activeDragRow ? 0.22 : 0.08;
    topCurrent += (topTarget - topCurrent) * lerpFactor;
    bottomCurrent += (bottomTarget - bottomCurrent) * lerpFactor;

    topCurrent = wrapOffset(topCurrent, topLoopWidth);
    bottomCurrent = wrapOffset(bottomCurrent, bottomLoopWidth);

    testimonialsRowTop.style.setProperty("--offset", `${topCurrent}px`);
    testimonialsRowBottom.style.setProperty("--offset", `${bottomCurrent}px`);

    const shouldContinue =
      Math.abs(topTarget - topCurrent) > 0.2 || Math.abs(bottomTarget - bottomCurrent) > 0.2;

    if (shouldContinue) {
      testimonialsRaf = requestAnimationFrame(animateTestimonials);
    } else {
      testimonialsRaf = null;
    }
  };

  const startTestimonialsAnimation = () => {
    updateTestimonialsTarget();
    if (!testimonialsRaf) {
      testimonialsRaf = requestAnimationFrame(animateTestimonials);
    }
  };

  const onTestimonialsPointerDown = (e, rowKey) => {
    const row = rowKey === "top" ? testimonialsRowTop : testimonialsRowBottom;
    if (!row) return;
    activeDragRow = rowKey;
    isHorizontalDrag = false;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragStartOffset = rowKey === "top" ? topDragOffset : bottomDragOffset;
    row.classList.add("is-dragging");
  };

  const onTestimonialsPointerMove = (e) => {
    if (!activeDragRow) return;

    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;

    if (!isHorizontalDrag) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      if (Math.abs(dx) <= Math.abs(dy)) {
        return;
      }
      isHorizontalDrag = true;
    }

    if (e.cancelable) {
      e.preventDefault();
    }

    if (activeDragRow === "top") {
      topDragOffset = wrapOffset(dragStartOffset + dx, topLoopWidth);
    } else if (activeDragRow === "bottom") {
      bottomDragOffset = wrapOffset(dragStartOffset + dx, bottomLoopWidth);
    }
    startTestimonialsAnimation();
  };

  const onTestimonialsPointerEnd = () => {
    if (!activeDragRow) return;
    if (testimonialsRowTop) testimonialsRowTop.classList.remove("is-dragging");
    if (testimonialsRowBottom) testimonialsRowBottom.classList.remove("is-dragging");
    activeDragRow = null;
    isHorizontalDrag = false;
    startTestimonialsAnimation();
  };

  if (btn && target) {
    btn.addEventListener("click", (e) => {
      if (btn.getAttribute("href") === "#quiz") {
        e.preventDefault();
        smoothScrollTo(target.getBoundingClientRect().top + window.scrollY - 16, 900);
      }
    });
  }

  // Desktop-only inertial wheel smoothing for a softer scroll feel.
  if (!prefersReducedMotion && !isTouchDevice) {
    let currentY = window.scrollY;
    let targetY = currentY;
    let rafId = null;

    const clampTarget = (value) => {
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      return Math.max(0, Math.min(value, maxScroll));
    };

    const animateWheelScroll = () => {
      const delta = targetY - currentY;
      currentY += delta * 0.12;

      if (Math.abs(delta) < 0.35) {
        currentY = targetY;
      }

      window.scrollTo(0, currentY);
      updateInsightFill();
      startTestimonialsAnimation();

      if (Math.abs(targetY - currentY) > 0.35) {
        rafId = requestAnimationFrame(animateWheelScroll);
      } else {
        rafId = null;
      }
    };

    window.addEventListener(
      "wheel",
      (e) => {
        if (e.ctrlKey) return;
        e.preventDefault();

        targetY = clampTarget(targetY + e.deltaY);

        if (!rafId) {
          currentY = window.scrollY;
          rafId = requestAnimationFrame(animateWheelScroll);
        }
      },
      { passive: false }
    );

    window.addEventListener("resize", () => {
      targetY = clampTarget(targetY);
      currentY = clampTarget(currentY);
      startTestimonialsAnimation();
    });
  }

  initHomeLanguageSwitch();
  refreshLoopWidths();
  updateInsightFill();
  startTestimonialsAnimation();

  if (testimonialsRowTop || testimonialsRowBottom) {
    testimonialsRowTop?.addEventListener("pointerdown", (e) => onTestimonialsPointerDown(e, "top"), {
      passive: true,
    });
    testimonialsRowBottom?.addEventListener("pointerdown", (e) => onTestimonialsPointerDown(e, "bottom"), {
      passive: true,
    });
    window.addEventListener("pointermove", onTestimonialsPointerMove, { passive: false });
    window.addEventListener("pointerup", onTestimonialsPointerEnd, { passive: true });
    window.addEventListener("pointercancel", onTestimonialsPointerEnd, { passive: true });
  }

  window.addEventListener(
    "scroll",
    () => {
      updateInsightFill();
      startTestimonialsAnimation();
    },
    { passive: true }
  );
  window.addEventListener("resize", () => {
    refreshLoopWidths();
    updateInsightFill();
    startTestimonialsAnimation();
  });
});
