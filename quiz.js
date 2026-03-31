const RESULT_STORAGE_KEY = "norysResult";

const TYPE_LABELS = {
  overthinker: "Die Ueberdenkerin",
  emotionalInitiator: "Die emotionale Antreiberin",
  conflictAvoider: "Die Konfliktvermeiderin",
  adapter: "Die Anpasserin",
};

const DIMENSION_WEIGHTS_BY_TYPE = {
  overthinker: {
    rumination: 2,
    hyperResponsibility: 2,
    uncertaintySensitivity: 1,
  },
  emotionalInitiator: {
    clarityUrgency: 2,
    repairPressure: 2,
    emotionalActivation: 1,
  },
  conflictAvoider: {
    selfSilencing: 2,
    withdrawal: 2,
    tensionAvoidance: 1,
  },
  adapter: {
    harmonyKeeping: 2,
    selfAbandonment: 2,
    emotionalCaretaking: 1,
  },
};

const QUESTIONS = [
  {
    id: "q1",
    text: "Wenn dein Partner ein oder zwei Tage etwas distanziert wirkt - was passiert meistens in deinem Kopf?",
    answers: [
      { id: "q1_a1", label: "Ich frage mich schnell, ob ich etwas falsch gemacht habe.", type: "overthinker" },
      { id: "q1_a2", label: "Ich gebe ihm etwas Raum und hoffe, dass es von selbst besser wird.", type: "conflictAvoider" },
      { id: "q1_a3", label: "Ich moechte moeglichst schnell darueber sprechen.", type: "emotionalInitiator" },
      { id: "q1_a4", label: "Ich sage mir, dass es wahrscheinlich nichts bedeutet.", type: "adapter" },
    ],
  },
  {
    id: "q2",
    text: "Dein Partner sagt etwas, das dich ein bisschen verletzt. Was passiert meistens als Erstes?",
    answers: [
      { id: "q2_a1", label: "Ich denke noch lange darueber nach.", type: "overthinker" },
      { id: "q2_a2", label: "Ich versuche zu erklaeren, wie es sich fuer mich angefuehlt hat.", type: "emotionalInitiator" },
      { id: "q2_a3", label: "Ich spiele es herunter, damit kein Streit entsteht.", type: "conflictAvoider" },
      { id: "q2_a4", label: "Ich achte kuenftig mehr darauf, damit es nicht wieder passiert.", type: "adapter" },
    ],
  },
  {
    id: "q3",
    text: "Waehrend eines Streits erkennst du dich am ehesten in welcher Reaktion wieder?",
    answers: [
      { id: "q3_a1", label: "Ich versuche, das Problem sofort zu klaeren.", type: "emotionalInitiator" },
      { id: "q3_a2", label: "Ich werde eher still und brauche Zeit, um nachzudenken.", type: "conflictAvoider" },
      { id: "q3_a3", label: "Ich analysiere im Kopf, wie es ueberhaupt zu diesem Streit kam.", type: "overthinker" },
      { id: "q3_a4", label: "Ich versuche, die Situation zu beruhigen.", type: "adapter" },
    ],
  },
  {
    id: "q4",
    text: "Wenn dein Partner gestresst oder ueberfordert wirkt, dann...",
    answers: [
      { id: "q4_a1", label: "versuche ich, ihn so gut wie moeglich zu unterstuetzen.", type: "adapter" },
      { id: "q4_a2", label: "frage ich mich, ob ich vielleicht etwas damit zu tun habe.", type: "overthinker" },
      { id: "q4_a3", label: "frage ich ihn direkt, was los ist.", type: "emotionalInitiator" },
      { id: "q4_a4", label: "lasse ich ihm lieber Raum und halte mich etwas zurueck.", type: "conflictAvoider" },
    ],
  },
  {
    id: "q5",
    text: "Wenn dich etwas in der Beziehung stoert - wie lange dauert es meistens, bis du es ansprichst?",
    answers: [
      { id: "q5_a1", label: "Ich denke meistens erst eine ganze Weile darueber nach.", type: "overthinker" },
      { id: "q5_a2", label: "Ich spreche es relativ schnell an.", type: "emotionalInitiator" },
      { id: "q5_a3", label: "Manchmal entscheide ich, dass es nicht so wichtig ist.", type: "conflictAvoider" },
      { id: "q5_a4", label: "Ich passe eher meine Erwartungen an.", type: "adapter" },
    ],
  },
  {
    id: "q6",
    text: "Wenn dein Partner schlechte Laune hat - wie wirkt sich das auf dich aus?",
    answers: [
      { id: "q6_a1", label: "Ich spuere das sofort und versuche zu helfen.", type: "adapter" },
      { id: "q6_a2", label: "Ich frage mich, was dahinter steckt.", type: "overthinker" },
      { id: "q6_a3", label: "Ich versuche einfach, nichts falsch zu machen.", type: "conflictAvoider" },
      { id: "q6_a4", label: "Ich frage ihn direkt, was los ist.", type: "emotionalInitiator" },
    ],
  },
  {
    id: "q7",
    text: "Wenn dein Partner etwas vergisst, das dir wichtig war - was ist deine typische Reaktion?",
    answers: [
      { id: "q7_a1", label: "Ich sage ihm, dass mich das verletzt hat.", type: "emotionalInitiator" },
      { id: "q7_a2", label: "Ich versuche zu verstehen, warum es passiert ist.", type: "overthinker" },
      { id: "q7_a3", label: "Ich sage mir, dass es kein grosses Thema ist.", type: "conflictAvoider" },
      { id: "q7_a4", label: "Ich frage mich, ob ich vielleicht zu viel erwartet habe.", type: "adapter" },
    ],
  },
  {
    id: "q8",
    text: "Wenn dein Partner nach einem Streit still ist - was fuehlt sich am vertrautesten an?",
    answers: [
      { id: "q8_a1", label: "Ich moechte moeglichst schnell darueber sprechen.", type: "emotionalInitiator" },
      { id: "q8_a2", label: "Ich gehe das Gespraech im Kopf immer wieder durch.", type: "overthinker" },
      { id: "q8_a3", label: "Ich lasse Zeit vergehen und spreche es nicht mehr an.", type: "conflictAvoider" },
      { id: "q8_a4", label: "Ich versuche, einfach wieder normal zu sein.", type: "adapter" },
    ],
  },
  {
    id: "q9",
    text: "Wenn du dich ein paar Tage emotional distanziert fuehlst, was passiert meistens?",
    answers: [
      { id: "q9_a1", label: "Ich frage mich, was sich veraendert hat.", type: "overthinker" },
      { id: "q9_a2", label: "Ich spreche es an, damit wir wieder naeher zusammenfinden.", type: "emotionalInitiator" },
      { id: "q9_a3", label: "Ich denke, wir sind wahrscheinlich einfach beide beschaeftigt.", type: "conflictAvoider" },
      { id: "q9_a4", label: "Ich versuche besonders unterstuetzend zu sein.", type: "adapter" },
    ],
  },
  {
    id: "q10",
    text: "Wenn du dir nicht sicher bist, wie dein Partner ueber etwas denkt, dann...",
    answers: [
      { id: "q10_a1", label: "frage ich ihn direkt.", type: "emotionalInitiator" },
      { id: "q10_a2", label: "versuche ich, sein Verhalten zu interpretieren.", type: "overthinker" },
      { id: "q10_a3", label: "warte ich ab, ob es sich von selbst klaert.", type: "conflictAvoider" },
      { id: "q10_a4", label: "passe ich mich an das an, was am besten zu funktionieren scheint.", type: "adapter" },
    ],
  },
  {
    id: "q11",
    text: "Wenn ein Gespraech mit deinem Partner angespannt wird, was tust du meistens?",
    answers: [
      { id: "q11_a1", label: "Ich versuche, das Problem sofort zu loesen.", type: "emotionalInitiator" },
      { id: "q11_a2", label: "Ich denke sehr genau ueber jedes Wort nach.", type: "overthinker" },
      { id: "q11_a3", label: "Ich versuche, das Gespraech zu entschaerfen oder das Thema zu wechseln.", type: "conflictAvoider" },
      { id: "q11_a4", label: "Ich konzentriere mich darauf, seine Perspektive zu verstehen.", type: "adapter" },
    ],
  },
  {
    id: "q12",
    text: "Wenn sich eure Beziehung gerade besonders gut anfuehlt - welcher Gedanke taucht manchmal auf?",
    answers: [
      { id: "q12_a1", label: "Ich hoffe, dass dieses Gefuehl lange anhaelt.", type: "adapter" },
      { id: "q12_a2", label: "Ich frage mich, was es wieder veraendern koennte.", type: "overthinker" },
      { id: "q12_a3", label: "Ich habe das Beduerfnis, die Verbindung noch weiter zu vertiefen.", type: "emotionalInitiator" },
      { id: "q12_a4", label: "Ich versuche, alles harmonisch und ruhig zu halten.", type: "conflictAvoider" },
    ],
  },
];

const PROGRESS_TOTAL = QUESTIONS.length;

const backBtn = document.getElementById("backBtn");
const resetBtn = document.getElementById("resetBtn");
const progressText = document.getElementById("progressText");
const questionText = document.getElementById("questionText");
const answersContainer = document.getElementById("answersContainer");
const liveRegion = document.getElementById("liveRegion");

const state = {
  currentIndex: 0,
  answers: {},
};

if (backBtn) {
  backBtn.addEventListener("click", handleBack);
}

if (resetBtn) {
  resetBtn.addEventListener("click", handleResetClick);
}

render();

function render() {
  const question = QUESTIONS[state.currentIndex];
  const selectedAnswerId = state.answers[question.id] || null;
  const currentStep = state.currentIndex + 1;
  const progressRatio = Math.min(currentStep / PROGRESS_TOTAL, 1);

  questionText.textContent = question.text;
  questionText.setAttribute("data-question-id", question.id);

  progressText.textContent = `${currentStep}/${PROGRESS_TOTAL}`;
  progressText.style.setProperty("--progress", String(progressRatio));

  if (backBtn) {
    backBtn.disabled = state.currentIndex === 0;
  }

  answersContainer.innerHTML = "";

  question.answers.forEach((answer, answerIdx) => {
    const letter = String.fromCharCode(65 + answerIdx);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "answer-btn";
    btn.innerHTML = `
      <span class="answer-btn__letter" aria-hidden="true">${letter}</span>
      <span class="answer-btn__text">${answer.label}</span>
      <span class="answer-btn__dot" aria-hidden="true"></span>
    `;
    btn.setAttribute("aria-pressed", String(selectedAnswerId === answer.id));
    btn.setAttribute("aria-label", `${letter}: ${answer.label}`);

    if (selectedAnswerId === answer.id) {
      btn.classList.add("is-selected");
    }

    btn.addEventListener("click", () => handleAnswerClick(question.id, answer.id));
    answersContainer.appendChild(btn);
  });

  liveRegion.textContent = `Neue Frage: ${question.text}`;
}

function handleAnswerClick(questionId, answerId) {
  state.answers[questionId] = answerId;

  if (state.currentIndex < QUESTIONS.length - 1) {
    state.currentIndex += 1;
    render();
    return;
  }

  persistResult();
  window.location.href = "simulate.html";
}

function handleBack() {
  if (state.currentIndex === 0) return;
  state.currentIndex -= 1;
  render();
}

function handleResetClick(event) {
  event.preventDefault();
  state.currentIndex = 0;
  state.answers = {};
  render();
}

window.quizDebug = {
  state,
  QUESTIONS,
};

function persistResult() {
  const scores = {
    overthinker: 0,
    emotionalInitiator: 0,
    conflictAvoider: 0,
    adapter: 0,
  };
  const dimensions = {
    rumination: 0,
    hyperResponsibility: 0,
    uncertaintySensitivity: 0,
    clarityUrgency: 0,
    repairPressure: 0,
    emotionalActivation: 0,
    selfSilencing: 0,
    withdrawal: 0,
    tensionAvoidance: 0,
    harmonyKeeping: 0,
    selfAbandonment: 0,
    emotionalCaretaking: 0,
  };
  const selectedAnswers = [];

  QUESTIONS.forEach((question) => {
    const selectedAnswerId = state.answers[question.id];
    const selectedAnswer = question.answers.find((answer) => answer.id === selectedAnswerId);

    if (selectedAnswer) {
      scores[selectedAnswer.type] += 1;
      selectedAnswers.push({
        questionId: question.id,
        questionText: question.text,
        answerId: selectedAnswer.id,
        answerLabel: selectedAnswer.label,
        type: selectedAnswer.type,
      });

      const dimensionWeights = DIMENSION_WEIGHTS_BY_TYPE[selectedAnswer.type] || {};
      Object.entries(dimensionWeights).forEach(([dimension, weight]) => {
        dimensions[dimension] = (dimensions[dimension] || 0) + weight;
      });
    }
  });

  const rankedTypes = Object.entries(scores).sort((left, right) => right[1] - left[1]);
  const [topType, topScore] = rankedTypes[0];
  const [, secondScore = 0] = rankedTypes[1] || [];
  const confidenceBase = QUESTIONS.length ? Math.round((topScore / QUESTIONS.length) * 100) : 0;
  const confidenceBonus = Math.min(14, Math.max(0, (topScore - secondScore) * 4));
  const confidence = Math.max(74, Math.min(97, confidenceBase + confidenceBonus));

  const payload = {
    type: topType,
    typeLabel: TYPE_LABELS[topType],
    scores,
    dimensions,
    selectedAnswers,
    confidence,
    createdAt: Date.now(),
  };

  window.localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(payload));
}
