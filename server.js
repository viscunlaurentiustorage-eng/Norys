require("dotenv").config();

const crypto = require("crypto");
const express = require("express");
const fs = require("fs");
const path = require("path");
const Stripe = require("stripe");

const app = express();
const port = Number(process.env.PORT || 3000);
const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY || "";
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;
const paypalClientId = process.env.PAYPAL_CLIENT_ID || "";
const paypalClientSecret = process.env.PAYPAL_CLIENT_SECRET || "";
const paypalEnv = (process.env.PAYPAL_ENV || "sandbox").toLowerCase() === "live" ? "live" : "sandbox";
const paypalApiBase =
  paypalEnv === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
const brevoApiKey = process.env.BREVO_API_KEY || "";
const brevoListId = Number(process.env.BREVO_LIST_ID || 0);
const brevoNewsletterListId = Number(process.env.BREVO_NEWSLETTER_LIST_ID || 0);
const emailDownloadSecret =
  process.env.EMAIL_DOWNLOAD_SECRET || stripeSecretKey || paypalClientSecret || "norys-change-this-download-secret";

const RESULT_STORAGE_KEY = "norysResult";
const DOWNLOAD_GRANT_COOKIE = "norys_download_grant";
const DOWNLOAD_GRANT_TTL_MS = 15 * 60 * 1000;
const EMAIL_DOWNLOAD_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const PURCHASE_FLOW_COOKIE = "norys_purchase_flow";
const PURCHASE_FLOW_TTL_MS = 60 * 60 * 1000;
const downloadGrants = new Map();
const purchaseFlows = new Map();
const fulfilledOrders = new Map();

const PRODUCTS = {
  overthinker: {
    name: {
      de: "Die Überdenkerin: Raus aus dem Grübeln, rein in echte Nähe",
      en: "The Overthinker: Out of Rumination, Back Into Real Closeness",
    },
    amount: 999,
    currency: "eur",
    fileName: "overthinker-ebook.pdf",
  },
  emotionalInitiator: {
    name: {
      de: "Die emotionale Antreiberin: Nähe schaffen ohne Druck",
      en: "The Emotional Initiator: Creating Closeness Without Pressure",
    },
    amount: 999,
    currency: "eur",
    fileName: "emotional-initiator-ebook.pdf",
  },
  conflictAvoider: {
    name: {
      de: "Die Konfliktvermeiderin: Klar sprechen ohne Eskalation",
      en: "The Conflict Avoider: Speaking Clearly Without Escalation",
    },
    amount: 999,
    currency: "eur",
    fileName: "conflict-avoider-ebook.pdf",
  },
  adapter: {
    name: {
      de: "Die Anpasserin: Grenzen setzen ohne Schuldgefühl",
      en: "The Adapter: Setting Boundaries Without Guilt",
    },
    amount: 999,
    currency: "eur",
    fileName: "adapter-ebook.pdf",
  },
};

app.use(express.json());
app.use(express.static(__dirname));

function normalizeBaseUrl(value) {
  if (!value || typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim().replace(/\/+$/, "");
  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function getPublicBaseUrl(request) {
  const envBaseUrl = normalizeBaseUrl(baseUrl);
  if (envBaseUrl) {
    return envBaseUrl;
  }

  const forwardedProto = request.headers["x-forwarded-proto"];
  const forwardedHost = request.headers["x-forwarded-host"] || request.headers.host;
  const protocol = typeof forwardedProto === "string" && forwardedProto ? forwardedProto.split(",")[0] : request.protocol;
  const host = typeof forwardedHost === "string" ? forwardedHost.split(",")[0].trim() : "";

  if (!host) {
    return `http://localhost:${port}`;
  }

  return `${protocol || "https"}://${host}`.replace(/\/+$/, "");
}

function buildAbsoluteUrl(base, pathnameWithSearch) {
  return new URL(pathnameWithSearch, `${base}/`).toString();
}

function normalizeLanguage(value) {
  return String(value || "").toLowerCase() === "en" ? "en" : "de";
}

function getStripeLocale(language) {
  return normalizeLanguage(language) === "en" ? "en" : "de";
}

function getProductName(product, language = "de") {
  const normalizedLanguage = normalizeLanguage(language);

  if (product?.name && typeof product.name === "object") {
    return product.name[normalizedLanguage] || product.name.de || product.name.en || "";
  }

  return String(product?.name || "");
}

function buildEbookReturnUrl(request, provider) {
  const publicBaseUrl = getPublicBaseUrl(request);
  return buildAbsoluteUrl(publicBaseUrl, `/ebook.html?purchase=confirmed&provider=${encodeURIComponent(provider)}`);
}

function parseCookies(request) {
  const rawCookie = request.headers.cookie || "";
  return rawCookie.split(";").reduce((cookies, part) => {
    const [rawName, ...rawValue] = part.trim().split("=");
    if (!rawName) {
      return cookies;
    }

    cookies[rawName] = decodeURIComponent(rawValue.join("=") || "");
    return cookies;
  }, {});
}

function isSecureRequest(request) {
  const forwardedProto = request.headers["x-forwarded-proto"];
  const protocol = typeof forwardedProto === "string" && forwardedProto
    ? forwardedProto.split(",")[0].trim()
    : request.protocol;

  return protocol === "https";
}

function buildCookieOptions(request) {
  return {
    httpOnly: true,
    secure: isSecureRequest(request),
    sameSite: "lax",
    path: "/",
    maxAge: DOWNLOAD_GRANT_TTL_MS,
  };
}

function cleanupExpiredDownloadGrants() {
  const now = Date.now();
  for (const [token, grant] of downloadGrants.entries()) {
    if (!grant || grant.expiresAt <= now || grant.usedAt) {
      downloadGrants.delete(token);
    }
  }
}

function cleanupExpiredPurchaseFlows() {
  const now = Date.now();
  for (const [token, flow] of purchaseFlows.entries()) {
    if (!flow || flow.expiresAt <= now || flow.usedAt) {
      purchaseFlows.delete(token);
    }
  }
}

function issuePurchaseFlow(request, response, payload) {
  cleanupExpiredPurchaseFlows();

  const token = crypto.randomBytes(32).toString("hex");
  purchaseFlows.set(token, {
    ...payload,
    expiresAt: Date.now() + PURCHASE_FLOW_TTL_MS,
    usedAt: null,
  });

  response.cookie(PURCHASE_FLOW_COOKIE, token, {
    ...buildCookieOptions(request),
    maxAge: PURCHASE_FLOW_TTL_MS,
  });

  return token;
}

function validatePurchaseFlow(request, response, expected) {
  cleanupExpiredPurchaseFlows();

  const cookies = parseCookies(request);
  const cookieToken = cookies[PURCHASE_FLOW_COOKIE] || "";
  const flow = cookieToken ? purchaseFlows.get(cookieToken) : null;

  if (!cookieToken || !flow) {
    response.status(403).json({ error: "This payment confirmation is not valid for this browser." });
    return null;
  }

  if (flow.usedAt || flow.expiresAt <= Date.now()) {
    purchaseFlows.delete(cookieToken);
    response.clearCookie(PURCHASE_FLOW_COOKIE, buildCookieOptions(request));
    response.status(403).json({ error: "This payment confirmation has expired." });
    return null;
  }

  if (flow.provider !== expected.provider || flow.sourceId !== expected.sourceId) {
    response.status(403).json({ error: "This payment confirmation does not match this order." });
    return null;
  }

  return { token: cookieToken, flow };
}

function revokePurchaseFlow(token, request, response) {
  if (!token) {
    return;
  }

  purchaseFlows.delete(token);
  response.clearCookie(PURCHASE_FLOW_COOKIE, buildCookieOptions(request));
}

function issueDownloadGrant(request, response, payload) {
  cleanupExpiredDownloadGrants();

  const token = crypto.randomBytes(32).toString("hex");
  downloadGrants.set(token, {
    ...payload,
    expiresAt: Date.now() + DOWNLOAD_GRANT_TTL_MS,
    usedAt: null,
  });

  response.cookie(DOWNLOAD_GRANT_COOKIE, token, buildCookieOptions(request));
  return token;
}

function consumeDownloadGrant(request, response, expectedProvider) {
  cleanupExpiredDownloadGrants();

  const token = typeof request.query.download_token === "string" ? request.query.download_token : "";
  const cookies = parseCookies(request);
  const cookieToken = cookies[DOWNLOAD_GRANT_COOKIE] || "";
  const grant = token ? downloadGrants.get(token) : null;

  if (!token || !cookieToken || token !== cookieToken || !grant) {
    response.status(403).send("This download link is not valid for this browser.");
    return null;
  }

  if (grant.usedAt || grant.expiresAt <= Date.now()) {
    downloadGrants.delete(token);
    response.clearCookie(DOWNLOAD_GRANT_COOKIE, buildCookieOptions(request));
    response.status(403).send("This download link has expired.");
    return null;
  }

  if (grant.provider !== expectedProvider) {
    response.status(403).send("This download link does not match this payment.");
    return null;
  }

  grant.usedAt = Date.now();
  downloadGrants.set(token, grant);
  response.clearCookie(DOWNLOAD_GRANT_COOKIE, buildCookieOptions(request));
  return grant;
}

function getFulfillmentKey(provider, sourceId) {
  return `${provider}:${sourceId}`;
}

function buildEmailDownloadUrl(request, token) {
  return buildAbsoluteUrl(
    getPublicBaseUrl(request),
    `/download-email-ebook?delivery_token=${encodeURIComponent(token)}`,
  );
}

function issueEmailDownloadGrant(payload) {
  const serializedPayload = Buffer.from(
    JSON.stringify({
      ...payload,
      expiresAt: Date.now() + EMAIL_DOWNLOAD_TTL_MS,
    }),
  ).toString("base64url");
  const signature = crypto
    .createHmac("sha256", emailDownloadSecret)
    .update(serializedPayload)
    .digest("hex");

  return `${serializedPayload}.${signature}`;
}

function readEmailDownloadGrant(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return null;
  }

  const [serializedPayload, signature] = token.split(".");
  const expectedSignature = crypto
    .createHmac("sha256", emailDownloadSecret)
    .update(serializedPayload)
    .digest("hex");

  if (
    !signature
    || signature.length !== expectedSignature.length
    || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(serializedPayload, "base64url").toString("utf8"));
    if (!payload?.expiresAt || payload.expiresAt <= Date.now()) {
      return null;
    }

    return payload;
  } catch (_error) {
    return null;
  }
}

async function brevoRequest(pathname, payload) {
  if (!brevoApiKey) {
    throw new Error("Brevo is not configured. Add BREVO_API_KEY to your environment.");
  }

  const response = await fetch(`https://api.brevo.com/v3${pathname}`, {
    method: "POST",
    headers: {
      "api-key": brevoApiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const rawText = await response.text();
  let data = {};

  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch (_error) {
    data = {};
  }

  if (!response.ok) {
    const message = data.message || rawText || `Brevo request failed with HTTP ${response.status}.`;
    throw new Error(message);
  }

  return data;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

async function syncPaidOrderToBrevo({
  email,
  productName,
  resultType,
  amount,
  downloadUrl,
  status,
}) {
  const contactAttributes = {
    PRODUCT: productName,
    PRICE: Number((amount / 100).toFixed(2)),
    STATUS: status,
    LINK: downloadUrl,
  };

  const contactPayload = {
    email,
    emailBlacklisted: false,
    smsBlacklisted: false,
    updateEnabled: true,
    attributes: contactAttributes,
  };

  if (brevoListId > 0) {
    contactPayload.listIds = [brevoListId];
  }

  await brevoRequest("/contacts", contactPayload);
}

async function syncNewsletterContactToBrevo(email) {
  if (!brevoNewsletterListId) {
    throw new Error("Brevo newsletter list is not configured. Add BREVO_NEWSLETTER_LIST_ID to your environment.");
  }

  await brevoRequest("/contacts", {
    email,
    emailBlacklisted: false,
    smsBlacklisted: false,
    updateEnabled: true,
    listIds: [brevoNewsletterListId],
  });
}

async function fulfillPaidOrder(_request, payload) {
  const {
    provider,
    sourceId,
    resultType,
    language,
    email,
    orderId,
    request,
  } = payload;

  if (!email) {
    throw new Error("The paid order does not contain an email address.");
  }

  const product = PRODUCTS[resultType];
  if (!product) {
    throw new Error("No ebook is configured for this result type.");
  }

  const fulfillmentKey = getFulfillmentKey(provider, sourceId);
  const existing = fulfilledOrders.get(fulfillmentKey);
  if (existing) {
    return existing;
  }

  const productName = getProductName(product, language);
  const deliveryToken = issueEmailDownloadGrant({
    provider,
    sourceId,
    resultType,
    email,
  });
  const downloadUrl = buildEmailDownloadUrl(request, deliveryToken);

  await syncPaidOrderToBrevo({
    email,
    productName,
    resultType,
    amount: product.amount,
    downloadUrl,
    status: "paid",
  });

  const fulfillment = {
    email,
    productName,
    downloadUrl,
    sentAt: Date.now(),
    orderId,
  };

  fulfilledOrders.set(fulfillmentKey, fulfillment);
  return fulfillment;
}

async function getPayPalAccessToken() {
  if (!paypalClientId || !paypalClientSecret) {
    throw new Error("PayPal is not configured. Add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to your environment.");
  }

  const auth = Buffer.from(`${paypalClientId}:${paypalClientSecret}`).toString("base64");
  const response = await fetch(`${paypalApiBase}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || "PayPal access token could not be created.");
  }

  return data.access_token;
}

async function paypalRequest(pathname, options = {}) {
  const accessToken = await getPayPalAccessToken();
  const response = await fetch(`${paypalApiBase}${pathname}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response.json();
  if (!response.ok) {
    const issue = data?.details?.[0]?.issue;
    const description = data?.details?.[0]?.description;
    throw new Error(description || issue || data.message || "PayPal request failed.");
  }

  return data;
}

app.get("/api/stripe-config", (_request, response) => {
  response.json({
    publishableKey: stripePublishableKey,
    resultStorageKey: RESULT_STORAGE_KEY,
  });
});

app.get("/api/paypal-config", (_request, response) => {
  response.json({
    clientId: paypalClientId,
    env: paypalEnv,
  });
});

app.post("/api/newsletter-signup", async (request, response) => {
  try {
    const email = String(request.body?.email || "").trim().toLowerCase();

    if (!isValidEmail(email)) {
      response.status(400).json({ error: "Please enter a valid email address." });
      return;
    }

    await syncNewsletterContactToBrevo(email);
    response.json({ ok: true });
  } catch (error) {
    console.error("Brevo newsletter signup failed:", error);
    response.status(500).json({
      error: error instanceof Error ? error.message : "Newsletter signup could not be completed.",
    });
  }
});

app.post("/api/create-checkout-session", async (request, response) => {
  if (!stripe) {
    response.status(500).json({
      error: "Stripe is not configured. Add STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY to your environment.",
    });
    return;
  }

  try {
    const resultType = request.body?.resultType;
    const language = normalizeLanguage(request.body?.language);
    const orderId = String(request.body?.orderId || "").trim();
    const product = PRODUCTS[resultType];

    if (!product) {
      response.status(400).json({ error: "Unknown result type." });
      return;
    }

    const publicBaseUrl = getPublicBaseUrl(request);
    const successUrl = buildAbsoluteUrl(
      publicBaseUrl,
      "/stripe-complete?session_id={CHECKOUT_SESSION_ID}",
    );
    const cancelUrl = buildAbsoluteUrl(publicBaseUrl, "/ebook.html");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: getStripeLocale(language),
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: product.currency,
            unit_amount: product.amount,
            product_data: {
              name: getProductName(product, language),
            },
          },
        },
      ],
      metadata: {
        resultType,
        language,
        orderId,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    issuePurchaseFlow(request, response, {
      provider: "stripe",
      sourceId: session.id,
      resultType,
      language,
      orderId,
    });

    response.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout session failed:", error);
    response.status(500).json({
      error: error instanceof Error ? error.message : "Stripe session could not be created.",
    });
  }
});

app.get("/api/checkout-session", async (request, response) => {
  if (!stripe) {
    response.status(500).json({
      error: "Stripe is not configured. Add STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY to your environment.",
    });
    return;
  }

  const sessionId = request.query.session_id;
  if (typeof sessionId !== "string" || !sessionId) {
    response.status(400).json({ error: "Missing session_id." });
    return;
  }

  try {
    const purchaseFlow = validatePurchaseFlow(request, response, {
      provider: "stripe",
      sourceId: sessionId,
    });

    if (!purchaseFlow) {
      return;
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const resultType = session.metadata?.resultType || "";
    const product = PRODUCTS[resultType];
    revokePurchaseFlow(purchaseFlow.token, request, response);

    response.json({
      customerEmail: session.customer_details?.email || "",
      paymentStatus: session.payment_status,
      resultType,
      orderId: session.metadata?.orderId || "",
      productName: getProductName(product, session.metadata?.language || "de"),
      downloadUrl:
        session.payment_status === "paid"
          ? `/api/download-ebook?download_token=${encodeURIComponent(
              issueDownloadGrant(request, response, {
                provider: "stripe",
                sourceId: sessionId,
                resultType: purchaseFlow.resultType || resultType,
              }),
            )}`
          : "",
    });
  } catch (error) {
    console.error("Stripe checkout session fetch failed:", error);
    response.status(500).json({
      error: error instanceof Error ? error.message : "Session could not be retrieved.",
    });
  }
});

app.get("/stripe-complete", async (request, response) => {
  if (!stripe) {
    response.status(500).send("Stripe is not configured.");
    return;
  }

  const sessionId = request.query.session_id;
  if (typeof sessionId !== "string" || !sessionId) {
    response.redirect("/ebook.html?purchase=error");
    return;
  }

  try {
    const purchaseFlow = validatePurchaseFlow(request, response, {
      provider: "stripe",
      sourceId: sessionId,
    });

    if (!purchaseFlow) {
      return;
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      response.redirect("/ebook.html?purchase=pending");
      return;
    }

    await fulfillPaidOrder(request, {
      request,
      provider: "stripe",
      sourceId: sessionId,
      resultType: session.metadata?.resultType || purchaseFlow.flow.resultType || "",
      language: session.metadata?.language || purchaseFlow.flow.language || "de",
      email: session.customer_details?.email || session.customer_email || "",
      orderId: session.metadata?.orderId || "",
    });

    revokePurchaseFlow(purchaseFlow.token, request, response);
    response.redirect(buildEbookReturnUrl(request, "stripe"));
  } catch (error) {
    console.error("Stripe Brevo fulfillment failed:", error);
    response.redirect("/ebook.html?purchase=error");
  }
});

app.get("/api/download-ebook", async (request, response) => {
  if (!stripe) {
    response.status(500).send("Stripe is not configured.");
    return;
  }

  if (typeof request.query.download_token !== "string" || !request.query.download_token) {
    response.status(400).send("Missing download token.");
    return;
  }

  try {
    const grant = consumeDownloadGrant(request, response, "stripe");

    if (!grant) {
      return;
    }

    const session = await stripe.checkout.sessions.retrieve(grant.sourceId);
    if (session.payment_status !== "paid") {
      response.status(403).send("This payment is not completed.");
      return;
    }

    const resultType = session.metadata?.resultType || "";
    const product = PRODUCTS[resultType];
    if (!product) {
      response.status(404).send("No ebook is configured for this result type.");
      return;
    }

    const ebookPath = path.join(__dirname, "ebooks", product.fileName);
    if (!fs.existsSync(ebookPath)) {
      response.status(404).send(
        `The ebook file is missing. Add ${product.fileName} to the ebooks directory.`,
      );
      return;
    }

    response.download(ebookPath, product.fileName);
  } catch (error) {
    console.error("Stripe ebook download failed:", error);
    response.status(500).send(error instanceof Error ? error.message : "Download could not be prepared.");
  }
});

app.get("/download-email-ebook", async (request, response) => {
  try {
    const deliveryToken =
      typeof request.query.delivery_token === "string" ? request.query.delivery_token : "";

    if (!deliveryToken) {
      response.status(400).send("Missing delivery token.");
      return;
    }

    const grant = readEmailDownloadGrant(deliveryToken);
    if (!grant) {
      response.status(403).send("This email download link is invalid or expired.");
      return;
    }

    let resultType = grant.resultType;
    if (grant.provider === "stripe") {
      if (!stripe) {
        response.status(500).send("Stripe is not configured.");
        return;
      }

      const session = await stripe.checkout.sessions.retrieve(grant.sourceId);
      if (session.payment_status !== "paid") {
        response.status(403).send("This payment is not completed.");
        return;
      }

      resultType = session.metadata?.resultType || resultType;
    } else {
      const order = await paypalRequest(`/v2/checkout/orders/${encodeURIComponent(grant.sourceId)}`, {
        method: "GET",
      });
      const captureStatus =
        order.purchase_units?.[0]?.payments?.captures?.[0]?.status || "";
      const isPaid = order.status === "COMPLETED" || captureStatus === "COMPLETED";

      if (!isPaid) {
        response.status(403).send("This PayPal payment is not completed.");
        return;
      }

      resultType = order.purchase_units?.[0]?.custom_id || resultType;
    }

    const product = PRODUCTS[resultType];
    if (!product) {
      response.status(404).send("No ebook is configured for this result type.");
      return;
    }

    const ebookPath = path.join(__dirname, "ebooks", product.fileName);
    if (!fs.existsSync(ebookPath)) {
      response.status(404).send(
        `The ebook file is missing. Add ${product.fileName} to the ebooks directory.`,
      );
      return;
    }

    response.download(ebookPath, product.fileName);
  } catch (error) {
    console.error("Email ebook download failed:", error);
    response.status(500).send(error instanceof Error ? error.message : "Download could not be prepared.");
  }
});

app.post("/api/paypal/create-order", async (request, response) => {
  try {
    const resultType = request.body?.resultType;
    const language = normalizeLanguage(request.body?.language);
    const orderId = String(request.body?.orderId || "").trim();
    const product = PRODUCTS[resultType];

    if (!product) {
      response.status(400).json({ error: "Unknown result type." });
      return;
    }

    const publicBaseUrl = getPublicBaseUrl(request);
    const returnUrl = buildAbsoluteUrl(publicBaseUrl, "/paypal-complete");
    const cancelUrl = buildAbsoluteUrl(publicBaseUrl, "/ebook.html");

    const order = await paypalRequest("/v2/checkout/orders", {
      method: "POST",
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            custom_id: resultType,
            reference_id: orderId,
            description: getProductName(product, language),
            amount: {
              currency_code: product.currency.toUpperCase(),
              value: (product.amount / 100).toFixed(2),
            },
          },
        ],
        application_context: {
          brand_name: "Norys",
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
          return_url: returnUrl,
          cancel_url: cancelUrl,
        },
      }),
    });

    const approveLink = order.links?.find((link) => link.rel === "approve")?.href || "";

    issuePurchaseFlow(request, response, {
      provider: "paypal",
      sourceId: order.id,
      resultType,
      language,
      orderId,
    });

    response.json({
      orderId: order.id,
      approveUrl: approveLink,
    });
  } catch (error) {
    console.error("PayPal create order failed:", error);
    response.status(500).json({
      error: error instanceof Error ? error.message : "PayPal order could not be created.",
    });
  }
});

app.post("/api/paypal/capture-order", async (request, response) => {
  try {
    const orderId = request.body?.orderId;
    if (typeof orderId !== "string" || !orderId) {
      response.status(400).json({ error: "Missing orderId." });
      return;
    }

    const purchaseFlow = validatePurchaseFlow(request, response, {
      provider: "paypal",
      sourceId: orderId,
    });

    if (!purchaseFlow) {
      return;
    }

    const capture = await paypalRequest(`/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
      method: "POST",
      body: JSON.stringify({}),
    });

    const isPaid =
      capture.status === "COMPLETED"
      || capture.purchase_units?.[0]?.payments?.captures?.[0]?.status === "COMPLETED";

    if (!isPaid) {
      response.status(409).json({
        error: "PayPal payment is not completed yet.",
        orderId: capture.id,
        status: capture.status,
      });
      return;
    }

    await fulfillPaidOrder(request, {
      request,
      provider: "paypal",
      sourceId: orderId,
      resultType: capture.purchase_units?.[0]?.custom_id || purchaseFlow.flow.resultType || "",
      language: purchaseFlow.flow.language || "de",
      email: capture.payer?.email_address || "",
      orderId: capture.purchase_units?.[0]?.reference_id || "",
    });

    revokePurchaseFlow(purchaseFlow.token, request, response);

    response.json({
      orderId: capture.id,
      status: capture.status,
      resultType: capture.purchase_units?.[0]?.custom_id || "",
      referenceId: capture.purchase_units?.[0]?.reference_id || "",
      redirectUrl: buildEbookReturnUrl(request, "paypal"),
    });
  } catch (error) {
    console.error("PayPal capture order failed:", error);
    response.status(500).json({
      error: error instanceof Error ? error.message : "PayPal order could not be captured.",
    });
  }
});

app.get("/api/paypal/order-status", async (request, response) => {
  try {
    const paypalOrderId = request.query.order_id;
    if (typeof paypalOrderId !== "string" || !paypalOrderId) {
      response.status(400).json({ error: "Missing order_id." });
      return;
    }

    const purchaseFlow = validatePurchaseFlow(request, response, {
      provider: "paypal",
      sourceId: paypalOrderId,
    });

    if (!purchaseFlow) {
      return;
    }

    const order = await paypalRequest(`/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}`, {
      method: "GET",
    });

    const resultType = order.purchase_units?.[0]?.custom_id || "";
    const referenceOrderId = order.purchase_units?.[0]?.reference_id || "";
    const product = PRODUCTS[resultType];
    const captureStatus =
      order.purchase_units?.[0]?.payments?.captures?.[0]?.status || "";
    const isPaid = order.status === "COMPLETED" || captureStatus === "COMPLETED";

    if (isPaid) {
      revokePurchaseFlow(purchaseFlow.token, request, response);
    }

    response.json({
      orderId: order.id,
      referenceId: referenceOrderId,
      status: order.status,
      captureStatus,
      resultType,
      productName: getProductName(product, purchaseFlow.flow.language || "de"),
      downloadUrl:
        isPaid
          ? `/api/download-ebook-paypal?download_token=${encodeURIComponent(
              issueDownloadGrant(request, response, {
                provider: "paypal",
                sourceId: order.id,
                resultType: purchaseFlow.resultType || resultType,
              }),
            )}`
          : "",
    });
  } catch (error) {
    console.error("PayPal order status failed:", error);
    response.status(500).json({
      error: error instanceof Error ? error.message : "PayPal order could not be verified.",
    });
  }
});

app.get("/paypal-complete", async (request, response) => {
  try {
    const paypalOrderId = request.query.token;
    if (typeof paypalOrderId !== "string" || !paypalOrderId) {
      response.redirect("/ebook.html?purchase=error");
      return;
    }

    const purchaseFlow = validatePurchaseFlow(request, response, {
      provider: "paypal",
      sourceId: paypalOrderId,
    });

    if (!purchaseFlow) {
      return;
    }

    let order = await paypalRequest(`/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}`, {
      method: "GET",
    });

    const captureStatusBefore =
      order.purchase_units?.[0]?.payments?.captures?.[0]?.status || "";
    const isPaidBefore = order.status === "COMPLETED" || captureStatusBefore === "COMPLETED";

    if (!isPaidBefore) {
      const capture = await paypalRequest(`/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`, {
        method: "POST",
        body: JSON.stringify({}),
      });

      order = capture;
    }

    const captureStatus = order.purchase_units?.[0]?.payments?.captures?.[0]?.status || "";
    const isPaid = order.status === "COMPLETED" || captureStatus === "COMPLETED";
    if (!isPaid) {
      response.redirect("/ebook.html?purchase=pending");
      return;
    }

    await fulfillPaidOrder(request, {
      request,
      provider: "paypal",
      sourceId: paypalOrderId,
      resultType: order.purchase_units?.[0]?.custom_id || purchaseFlow.flow.resultType || "",
      language: purchaseFlow.flow.language || "de",
      email: order.payer?.email_address || "",
      orderId: order.purchase_units?.[0]?.reference_id || "",
    });

    revokePurchaseFlow(purchaseFlow.token, request, response);
    response.redirect(buildEbookReturnUrl(request, "paypal"));
  } catch (error) {
    console.error("PayPal Brevo fulfillment failed:", error);
    response.redirect("/ebook.html?purchase=error");
  }
});

app.get("/api/download-ebook-paypal", async (request, response) => {
  try {
    if (typeof request.query.download_token !== "string" || !request.query.download_token) {
      response.status(400).send("Missing download token.");
      return;
    }

    const grant = consumeDownloadGrant(request, response, "paypal");

    if (!grant) {
      return;
    }

    const order = await paypalRequest(`/v2/checkout/orders/${encodeURIComponent(grant.sourceId)}`, {
      method: "GET",
    });

    const resultType = order.purchase_units?.[0]?.custom_id || "";
    const product = PRODUCTS[resultType];
    const captureStatus =
      order.purchase_units?.[0]?.payments?.captures?.[0]?.status || "";
    const isPaid = order.status === "COMPLETED" || captureStatus === "COMPLETED";

    if (!isPaid) {
      response.status(403).send("This PayPal payment is not completed.");
      return;
    }

    if (!product) {
      response.status(404).send("No ebook is configured for this result type.");
      return;
    }

    const ebookPath = path.join(__dirname, "ebooks", product.fileName);
    if (!fs.existsSync(ebookPath)) {
      response.status(404).send(
        `The ebook file is missing. Add ${product.fileName} to the ebooks directory.`,
      );
      return;
    }

    response.download(ebookPath, product.fileName);
  } catch (error) {
    console.error("PayPal ebook download failed:", error);
    response.status(500).send(error instanceof Error ? error.message : "PayPal download could not be prepared.");
  }
});

app.listen(port, () => {
  console.log(`Norys server running on ${normalizeBaseUrl(baseUrl) || `http://localhost:${port}`}`);
});
