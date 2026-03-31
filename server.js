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

const RESULT_STORAGE_KEY = "norysResult";
const DOWNLOAD_GRANT_COOKIE = "norys_download_grant";
const DOWNLOAD_GRANT_TTL_MS = 15 * 60 * 1000;
const downloadGrants = new Map();

const PRODUCTS = {
  overthinker: {
    name: "Die Ueberdenkerin: Raus aus dem Gruebeln, rein in echte Naehe",
    amount: 99,
    currency: "eur",
    fileName: "overthinker-ebook.pdf",
  },
  emotionalInitiator: {
    name: "Die emotionale Antreiberin: Naehe schaffen ohne Druck",
    amount: 99,
    currency: "eur",
    fileName: "emotional-initiator-ebook.pdf",
  },
  conflictAvoider: {
    name: "Die Konfliktvermeiderin: Klar sprechen ohne Eskalation",
    amount: 99,
    currency: "eur",
    fileName: "conflict-avoider-ebook.pdf",
  },
  adapter: {
    name: "Die Anpasserin: Grenzen setzen ohne Schuldgefuehl",
    amount: 99,
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

app.post("/api/create-checkout-session", async (request, response) => {
  if (!stripe) {
    response.status(500).json({
      error: "Stripe is not configured. Add STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY to your environment.",
    });
    return;
  }

  try {
    const resultType = request.body?.resultType;
    const product = PRODUCTS[resultType];

    if (!product) {
      response.status(400).json({ error: "Unknown result type." });
      return;
    }

    const publicBaseUrl = getPublicBaseUrl(request);
    const successUrl = buildAbsoluteUrl(
      publicBaseUrl,
      "/success.html?session_id={CHECKOUT_SESSION_ID}",
    );
    const cancelUrl = buildAbsoluteUrl(publicBaseUrl, "/result.html");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: product.currency,
            unit_amount: product.amount,
            product_data: {
              name: product.name,
            },
          },
        },
      ],
      metadata: {
        resultType,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
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
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const resultType = session.metadata?.resultType || "";
    const product = PRODUCTS[resultType];

    response.json({
      customerEmail: session.customer_details?.email || "",
      paymentStatus: session.payment_status,
      resultType,
      productName: product?.name || "",
      downloadUrl:
        session.payment_status === "paid"
          ? `/api/download-ebook?download_token=${encodeURIComponent(
              issueDownloadGrant(request, response, {
                provider: "stripe",
                sourceId: sessionId,
                resultType,
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

app.post("/api/paypal/create-order", async (request, response) => {
  try {
    const resultType = request.body?.resultType;
    const product = PRODUCTS[resultType];

    if (!product) {
      response.status(400).json({ error: "Unknown result type." });
      return;
    }

    const publicBaseUrl = getPublicBaseUrl(request);
    const returnUrl = buildAbsoluteUrl(publicBaseUrl, "/paypal-success.html");
    const cancelUrl = buildAbsoluteUrl(publicBaseUrl, "/ebook.html");

    const order = await paypalRequest("/v2/checkout/orders", {
      method: "POST",
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            custom_id: resultType,
            description: product.name,
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

    const capture = await paypalRequest(`/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
      method: "POST",
      body: JSON.stringify({}),
    });

    response.json({
      orderId: capture.id,
      status: capture.status,
      resultType: capture.purchase_units?.[0]?.custom_id || "",
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
    const orderId = request.query.order_id;
    if (typeof orderId !== "string" || !orderId) {
      response.status(400).json({ error: "Missing order_id." });
      return;
    }

    const order = await paypalRequest(`/v2/checkout/orders/${encodeURIComponent(orderId)}`, {
      method: "GET",
    });

    const resultType = order.purchase_units?.[0]?.custom_id || "";
    const product = PRODUCTS[resultType];
    const captureStatus =
      order.purchase_units?.[0]?.payments?.captures?.[0]?.status || "";
    const isPaid = order.status === "COMPLETED" || captureStatus === "COMPLETED";

    response.json({
      orderId: order.id,
      status: order.status,
      captureStatus,
      resultType,
      productName: product?.name || "",
      downloadUrl:
        isPaid
          ? `/api/download-ebook-paypal?download_token=${encodeURIComponent(
              issueDownloadGrant(request, response, {
                provider: "paypal",
                sourceId: order.id,
                resultType,
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
