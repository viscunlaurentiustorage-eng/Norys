(function () {
  const VISITOR_ID_KEY = "norysVisitorId";
  const QUIZ_SESSION_ID_KEY = "norysQuizSessionId";
  const CURRENT_ORDER_KEY = "norysCurrentOrder";
  const FIRED_EVENTS_KEY = "norysTrackingFiredEvents";

  const RESULT_TYPE_MAP = {
    overthinker: "result_1",
    emotionalInitiator: "result_2",
    conflictAvoider: "result_3",
    adapter: "result_4",
  };

  function safeStorage(storage) {
    try {
      const testKey = "__norys_tracker_test__";
      storage.setItem(testKey, "1");
      storage.removeItem(testKey);
      return storage;
    } catch (_error) {
      return null;
    }
  }

  const localStore = safeStorage(window.localStorage);
  const sessionStore = safeStorage(window.sessionStorage);

  function generateId(prefix) {
    const randomPart =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID().replace(/-/g, "")
        : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;

    return `${prefix}_${randomPart}`;
  }

  function readJson(storage, key, fallback) {
    if (!storage) return fallback;

    try {
      const rawValue = storage.getItem(key);
      return rawValue ? JSON.parse(rawValue) : fallback;
    } catch (_error) {
      return fallback;
    }
  }

  function writeJson(storage, key, value) {
    if (!storage) return;

    try {
      storage.setItem(key, JSON.stringify(value));
    } catch (_error) {
      // Ignore storage failures.
    }
  }

  function getVisitorId() {
    if (!localStore) {
      return generateId("visitor");
    }

    let visitorId = localStore.getItem(VISITOR_ID_KEY);
    if (!visitorId) {
      visitorId = generateId("visitor");
      localStore.setItem(VISITOR_ID_KEY, visitorId);
    }

    return visitorId;
  }

  function getQuizSessionId() {
    return localStore ? localStore.getItem(QUIZ_SESSION_ID_KEY) || "" : "";
  }

  function setQuizSessionId(quizSessionId) {
    if (!localStore) return;
    localStore.setItem(QUIZ_SESSION_ID_KEY, quizSessionId);
  }

  function startQuizSession() {
    const quizSessionId = generateId("quiz");
    setQuizSessionId(quizSessionId);
    return quizSessionId;
  }

  function getCurrentOrder() {
    return readJson(localStore, CURRENT_ORDER_KEY, null);
  }

  function getOrderId() {
    return getCurrentOrder()?.order_id || "";
  }

  function createOrder(provider) {
    const normalizedProvider = provider === "paypal" ? "paypal" : "stripe";
    const order = {
      order_id: generateId("order"),
      payment_provider: normalizedProvider,
      created_at: Date.now(),
    };

    writeJson(localStore, CURRENT_ORDER_KEY, order);
    return order;
  }

  function setCurrentOrder(order) {
    if (!order || !order.order_id) return;
    writeJson(localStore, CURRENT_ORDER_KEY, order);
  }

  function getFiredEvents() {
    return readJson(sessionStore, FIRED_EVENTS_KEY, {});
  }

  function markFired(key) {
    if (!sessionStore || !key) return;
    const firedEvents = getFiredEvents();
    firedEvents[key] = true;
    writeJson(sessionStore, FIRED_EVENTS_KEY, firedEvents);
  }

  function hasFired(key) {
    if (!sessionStore || !key) return false;
    const firedEvents = getFiredEvents();
    return Boolean(firedEvents[key]);
  }

  function getResultEventType(resultType) {
    return RESULT_TYPE_MAP[resultType] || "result_1";
  }

  function pushEvent(eventName, payload = {}, options = {}) {
    const dedupeKey = options.dedupeKey || "";
    if (dedupeKey && hasFired(dedupeKey)) {
      return false;
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      visitor_id: getVisitorId(),
      ...payload,
    });

    if (dedupeKey) {
      markFired(dedupeKey);
    }

    return true;
  }

  function pushQuizStarted(quizSessionId) {
    return pushEvent(
      "quiz_started",
      { quiz_session_id: quizSessionId },
      { dedupeKey: `quiz_started:${quizSessionId}` },
    );
  }

  function pushQuestionShown(quizSessionId, questionId) {
    return pushEvent(
      "question_shown",
      {
        quiz_session_id: quizSessionId,
        question_id: questionId,
      },
      { dedupeKey: `question_shown:${quizSessionId}:${questionId}` },
    );
  }

  function pushAnswerSelected(quizSessionId, questionId, answerId) {
    return pushEvent(
      "answer_selected",
      {
        quiz_session_id: quizSessionId,
        question_id: questionId,
        answer_id: answerId,
      },
      { dedupeKey: `answer_selected:${quizSessionId}:${questionId}:${answerId}` },
    );
  }

  function pushQuizCompleted(quizSessionId, resultType) {
    return pushEvent(
      "quiz_completed",
      {
        quiz_session_id: quizSessionId,
        result_type: getResultEventType(resultType),
      },
      { dedupeKey: `quiz_completed:${quizSessionId}` },
    );
  }

  function pushResultShown(quizSessionId, resultType) {
    return pushEvent(
      "result_shown",
      {
        quiz_session_id: quizSessionId,
        result_type: getResultEventType(resultType),
      },
      { dedupeKey: `result_shown:${quizSessionId}:${resultType}` },
    );
  }

  function pushOfferButtonClicked(quizSessionId, resultType) {
    return pushEvent(
      "offer_button_clicked",
      {
        quiz_session_id: quizSessionId,
        result_type: getResultEventType(resultType),
      },
      { dedupeKey: `offer_button_clicked:${quizSessionId}:${resultType}` },
    );
  }

  function pushCheckoutStarted(order, quizSessionId) {
    return pushEvent(
      "checkout_started",
      {
        quiz_session_id: quizSessionId || getQuizSessionId(),
        order_id: order.order_id,
        payment_provider: order.payment_provider,
      },
      { dedupeKey: `checkout_started:${order.order_id}` },
    );
  }

  function pushDownloadPageOpened(order, quizSessionId) {
    return pushEvent(
      "download_page_opened",
      {
        quiz_session_id: quizSessionId || getQuizSessionId(),
        order_id: order.order_id,
        payment_provider: order.payment_provider,
      },
      { dedupeKey: `download_page_opened:${order.order_id}` },
    );
  }

  function pushDownloadButtonClicked(order, quizSessionId) {
    return pushEvent(
      "download_button_clicked",
      {
        quiz_session_id: quizSessionId || getQuizSessionId(),
        order_id: order.order_id,
        payment_provider: order.payment_provider,
      },
      { dedupeKey: `download_button_clicked:${order.order_id}` },
    );
  }

  window.NorysTracker = {
    getVisitorId,
    getQuizSessionId,
    setQuizSessionId,
    startQuizSession,
    getCurrentOrder,
    getOrderId,
    createOrder,
    setCurrentOrder,
    getResultEventType,
    pushEvent,
    pushQuizStarted,
    pushQuestionShown,
    pushAnswerSelected,
    pushQuizCompleted,
    pushResultShown,
    pushOfferButtonClicked,
    pushCheckoutStarted,
    pushDownloadPageOpened,
    pushDownloadButtonClicked,
  };
})();
