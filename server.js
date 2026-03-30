require("dotenv").config();

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

const RESULT_STORAGE_KEY = "norysResult";

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

app.get("/api/stripe-config", (_request, response) => {
  response.json({
    publishableKey: stripePublishableKey,
    resultStorageKey: RESULT_STORAGE_KEY,
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

    const origin = request.body?.origin || baseUrl;

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
      success_url: `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/result.html`,
    });

    response.json({ url: session.url });
  } catch (error) {
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
      downloadUrl: session.payment_status === "paid" ? `/api/download-ebook?session_id=${encodeURIComponent(sessionId)}` : "",
    });
  } catch (error) {
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

  const sessionId = request.query.session_id;
  if (typeof sessionId !== "string" || !sessionId) {
    response.status(400).send("Missing session_id.");
    return;
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
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
    response.status(500).send(error instanceof Error ? error.message : "Download could not be prepared.");
  }
});

app.listen(port, () => {
  console.log(`Norys server running on ${baseUrl}`);
});
