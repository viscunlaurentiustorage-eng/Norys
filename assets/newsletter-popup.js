(() => {
  const modal = document.getElementById("newsletterModal");
  if (!modal) {
    return;
  }

  const STORAGE_DISMISSED_KEY = "norysNewsletterDismissedAt";
  const STORAGE_SUBSCRIBED_KEY = "norysNewsletterSubscribed";
  const DISMISS_TTL_MS = 3 * 24 * 60 * 60 * 1000;
  const OPEN_DELAY_MS = 60 * 1000;
  const LANGUAGE_STORAGE_KEY = "norysLanguage";

  const ui = {
    de: {
      eyebrow: "Nichts verpassen",
      title: "Hol dir neue psychologische Einblicke direkt per E-Mail",
      copy:
        "Trag dich ein und wir schicken dir neue Impulse zu Beziehungsmustern, Triggern und emotionaler Klarheit.",
      placeholder: "Deine E-Mail-Adresse",
      submit: "Kostenlos eintragen",
      disclaimer: "Du kannst dich jederzeit wieder abmelden.",
      closeAria: "Schließen",
      loading: "Wird gespeichert...",
      success: "Danke. Du bist jetzt eingetragen.",
      invalid: "Bitte gib eine gültige E-Mail-Adresse ein.",
      error: "Die Anmeldung konnte gerade nicht gespeichert werden. Bitte versuche es erneut.",
    },
    en: {
      eyebrow: "Stay close",
      title: "Get new psychological insights by email",
      copy:
        "Leave your email and we will send you new insights about relationship patterns, triggers, and emotional clarity.",
      placeholder: "Your email address",
      submit: "Join for free",
      disclaimer: "You can unsubscribe at any time.",
      closeAria: "Close",
      loading: "Saving...",
      success: "Thanks. You are now subscribed.",
      invalid: "Please enter a valid email address.",
      error: "Your signup could not be saved right now. Please try again.",
    },
  };

  const closeButton = document.getElementById("newsletterClose");
  const form = document.getElementById("newsletterForm");
  const emailInput = document.getElementById("newsletterEmail");
  const status = document.getElementById("newsletterStatus");
  const submitLabel = document.getElementById("newsletterSubmitLabel");
  let openTimer = null;

  function getLanguage() {
    try {
      return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) === "en" ? "en" : "de";
    } catch (_error) {
      return "de";
    }
  }

  function getCopy() {
    return ui[getLanguage()] || ui.de;
  }

  function setStatus(message) {
    if (status) {
      status.textContent = message || "";
    }
  }

  function applyLanguage() {
    const copy = getCopy();
    const eyebrow = document.getElementById("newsletterEyebrow");
    const title = document.getElementById("newsletterTitle");
    const body = document.getElementById("newsletterCopy");
    const disclaimer = document.getElementById("newsletterDisclaimer");

    if (eyebrow) eyebrow.textContent = copy.eyebrow;
    if (title) title.textContent = copy.title;
    if (body) body.textContent = copy.copy;
    if (emailInput) emailInput.placeholder = copy.placeholder;
    if (submitLabel) submitLabel.textContent = copy.submit;
    if (disclaimer) disclaimer.textContent = copy.disclaimer;
    if (closeButton) closeButton.setAttribute("aria-label", copy.closeAria);
  }

  function markDismissed() {
    try {
      window.localStorage.setItem(STORAGE_DISMISSED_KEY, String(Date.now()));
    } catch (_error) {}
  }

  function markSubscribed() {
    try {
      window.localStorage.setItem(STORAGE_SUBSCRIBED_KEY, "true");
    } catch (_error) {}
  }

  function shouldOpen() {
    try {
      if (window.localStorage.getItem(STORAGE_SUBSCRIBED_KEY) === "true") {
        return false;
      }

      const dismissedAt = Number(window.localStorage.getItem(STORAGE_DISMISSED_KEY));
      if (Number.isFinite(dismissedAt) && dismissedAt > 0 && Date.now() - dismissedAt < DISMISS_TTL_MS) {
        return false;
      }
    } catch (_error) {}

    return true;
  }

  function openModal() {
    modal.hidden = false;
    applyLanguage();
    setStatus("");
  }

  function closeModal(markAsDismissed = true) {
    modal.hidden = true;
    if (markAsDismissed) {
      markDismissed();
    }
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
  }

  async function submitNewsletter(email) {
    const response = await fetch("/api/newsletter-signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const raw = await response.text();
    let data = {};
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch (_error) {
      data = { error: raw };
    }

    if (!response.ok) {
      throw new Error(data.error || getCopy().error);
    }
  }

  closeButton?.addEventListener("click", () => closeModal(true));
  modal.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.dataset.newsletterClose === "true") {
      closeModal(true);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal(true);
    }
  });

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const copy = getCopy();
    const email = String(emailInput?.value || "").trim().toLowerCase();

    if (!validEmail(email)) {
      setStatus(copy.invalid);
      return;
    }

    if (submitLabel) {
      submitLabel.textContent = copy.loading;
    }

    try {
      await submitNewsletter(email);
      markSubscribed();
      setStatus(copy.success);
      window.setTimeout(() => closeModal(false), 900);
    } catch (_error) {
      setStatus(copy.error);
    } finally {
      if (submitLabel) {
        submitLabel.textContent = copy.submit;
      }
    }
  });

  window.addEventListener("norys:language-change", applyLanguage);
  applyLanguage();

  if (shouldOpen()) {
    openTimer = window.setTimeout(openModal, OPEN_DELAY_MS);
  }

  window.addEventListener("beforeunload", () => {
    if (openTimer) {
      window.clearTimeout(openTimer);
    }
  });
})();
