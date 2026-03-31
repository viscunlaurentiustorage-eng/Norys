const RESULT_STORAGE_KEY = window.NORYS_RESULT_STORAGE_KEY || "norysResult";
const RESULT_CONTENT = window.NORYS_RESULT_CONTENT || {};

const result = getStoredResult();
const content = RESULT_CONTENT[result.type] || RESULT_CONTENT.overthinker;
const checkoutButton = document.getElementById("ebookCheckoutBtn");
const payPalContainer = document.getElementById("paypal-button-container");
const payPalSection = document.querySelector(".ebook-paypal");

hydratePage();
initScrollAnimations();
initCheckout();
initPayPalCheckout();

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
  };
}

function hydratePage() {
  setText("ebookHeroTitle", content.ebookTitle);
  setText("ebookHeroSubtitle", content.heroSubtitle);
  setText("ebookIntroText", content.offerDescription);
  setText("ebookOfferDescription", content.offerDescription);

  renderList("ebookOutcomeList", content.outcomes);
  renderList("ebookIncludesList", content.ebookIncludes || content.outcomes);
  renderTestimonials();
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
    } else {
      bottomRow.appendChild(card);
    }
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
      if (!/^https?:$/.test(window.location.protocol)) {
        throw new Error("Oeffne die Seite ueber deine Live-URL oder localhost, nicht direkt als lokale Datei.");
      }

      const endpoint = new URL("/api/create-checkout-session", window.location.origin).toString();
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resultType: result.type,
        }),
      });

      const rawText = await response.text();
      let data = {};

      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch (_error) {
        data = { error: rawText || "Checkout konnte nicht gestartet werden." };
      }

      if (!response.ok || !data.url) {
        const fallbackMessage = `Checkout konnte nicht gestartet werden (HTTP ${response.status}).`;
        throw new Error(data.error || fallbackMessage);
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

function initPayPalCheckout() {
  if (!payPalContainer || !payPalSection) {
    return;
  }

  setupPayPalButtons().catch((error) => {
    payPalSection.hidden = true;
    console.error("PayPal button setup failed:", error);
  });
}

async function setupPayPalButtons() {
  if (!/^https?:$/.test(window.location.protocol)) {
    throw new Error("Oeffne die Seite ueber deine Live-URL oder localhost, nicht direkt als lokale Datei.");
  }

  const configResponse = await fetch(new URL("/api/paypal-config", window.location.origin).toString());
  const configData = await configResponse.json();

  if (!configResponse.ok || !configData.clientId) {
    throw new Error(configData.error || "PayPal ist aktuell nicht verfuegbar.");
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

      reject(new Error("PayPal konnte nicht geladen werden."));
    };
    script.onerror = () => reject(new Error("PayPal konnte nicht geladen werden."));
    document.head.appendChild(script);
  });
}

function renderPayPalButtons() {
  if (!window.paypal?.Buttons || !payPalContainer) {
    throw new Error("PayPal konnte nicht geladen werden.");
  }

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
        const response = await fetch(new URL("/api/paypal/create-order", window.location.origin).toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resultType: result.type,
          }),
        });

        const data = await response.json();
        if (!response.ok || !data.orderId) {
          throw new Error(data.error || "PayPal Bestellung konnte nicht erstellt werden.");
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

        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error || "PayPal Zahlung konnte nicht bestaetigt werden.");
        }

        window.location.assign(`/paypal-success.html?token=${encodeURIComponent(data.orderID)}`);
      },
      onError: (error) => {
        console.error("PayPal checkout failed:", error);
        window.alert(error instanceof Error ? error.message : "PayPal Checkout konnte nicht gestartet werden.");
      },
      onCancel: () => {
        window.location.assign("ebook.html");
      },
    })
    .render("#paypal-button-container");
}
