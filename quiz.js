const RESULT_STORAGE_KEY = "norysResult";
const LANGUAGE_STORAGE_KEY = "norysLanguage";

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

const QUIZ_UI_TEXT = {
  de: {
    pageTitle: "Beziehungs-Quiz | Norys",
    metaDescription:
      "Beantworte die Fragen im Norys Beziehungs-Quiz und entdecke dein unbewusstes Beziehungsmuster. Schnell, anonym und klar aufgebaut.",
    ogLocale: "de_DE",
    ogTitle: "Beziehungs-Quiz | Norys",
    ogDescription:
      "Starte das Norys Beziehungs-Quiz und finde heraus, welches Beziehungsmuster eure Nähe beeinflusst.",
    twitterTitle: "Beziehungs-Quiz | Norys",
    twitterDescription: "Beantworte die Fragen und erhalte dein persönliches Beziehungsergebnis.",
    brandAriaLabel: "Norys Startseite",
    languageButtonAriaLabel: "Sprache wechseln",
    languageLabel: "Deutsch",
    quizNavAriaLabel: "Quiz-Navigation",
    backButtonAriaLabel: "Zurück zur vorherigen Frage",
    quizPanelAriaLabel: "Quiz",
    answersGroupAriaLabel: "Antwortoptionen",
    resetButton: "Neu starten",
    liveQuestionPrefix: "Neue Frage",
  },
  en: {
    pageTitle: "Relationship Quiz | Norys",
    metaDescription:
      "Answer the questions in the Norys relationship quiz and discover your unconscious relationship pattern. Fast, anonymous, and clearly structured.",
    ogLocale: "en_US",
    ogTitle: "Relationship Quiz | Norys",
    ogDescription:
      "Start the Norys relationship quiz and find out which relationship pattern is influencing your closeness.",
    twitterTitle: "Relationship Quiz | Norys",
    twitterDescription: "Answer the questions and get your personal relationship result.",
    brandAriaLabel: "Norys homepage",
    languageButtonAriaLabel: "Change language",
    languageLabel: "English",
    quizNavAriaLabel: "Quiz navigation",
    backButtonAriaLabel: "Back to the previous question",
    quizPanelAriaLabel: "Quiz",
    answersGroupAriaLabel: "Answer options",
    resetButton: "Start over",
    liveQuestionPrefix: "New question",
  },
};

const QUESTION_TRANSLATIONS = {
  de: {
    q1: {
      text: "Wenn dein Partner ein oder zwei Tage etwas distanziert wirkt – was passiert meistens in deinem Kopf?",
      answers: {
        q1_a1: "Ich frage mich schnell, ob ich etwas falsch gemacht habe.",
        q1_a2: "Ich gebe ihm etwas Raum und hoffe, dass es von selbst besser wird.",
        q1_a3: "Ich möchte möglichst schnell darüber sprechen.",
        q1_a4: "Ich sage mir, dass es wahrscheinlich nichts bedeutet.",
      },
    },
    q2: {
      text: "Dein Partner sagt etwas, das dich ein bisschen verletzt. Was passiert meistens als Erstes?",
      answers: {
        q2_a1: "Ich denke noch lange darüber nach.",
        q2_a2: "Ich versuche zu erklären, wie es sich für mich angefühlt hat.",
        q2_a3: "Ich spiele es herunter, damit kein Streit entsteht.",
        q2_a4: "Ich achte künftig mehr darauf, damit es nicht wieder passiert.",
      },
    },
    q3: {
      text: "Während eines Streits erkennst du dich am ehesten in welcher Reaktion wieder?",
      answers: {
        q3_a1: "Ich versuche, das Problem sofort zu klären.",
        q3_a2: "Ich werde eher still und brauche Zeit, um nachzudenken.",
        q3_a3: "Ich analysiere im Kopf, wie es überhaupt zu diesem Streit kam.",
        q3_a4: "Ich versuche, die Situation zu beruhigen.",
      },
    },
    q4: {
      text: "Wenn dein Partner gestresst oder überfordert wirkt, dann...",
      answers: {
        q4_a1: "versuche ich, ihn so gut wie möglich zu unterstützen.",
        q4_a2: "frage ich mich, ob ich vielleicht etwas damit zu tun habe.",
        q4_a3: "frage ich ihn direkt, was los ist.",
        q4_a4: "lasse ich ihm lieber Raum und halte mich etwas zurück.",
      },
    },
    q5: {
      text: "Wenn dich etwas in der Beziehung stört – wie lange dauert es meistens, bis du es ansprichst?",
      answers: {
        q5_a1: "Ich denke meistens erst eine ganze Weile darüber nach.",
        q5_a2: "Ich spreche es relativ schnell an.",
        q5_a3: "Manchmal entscheide ich, dass es nicht so wichtig ist.",
        q5_a4: "Ich passe eher meine Erwartungen an.",
      },
    },
    q6: {
      text: "Wenn dein Partner schlechte Laune hat – wie wirkt sich das auf dich aus?",
      answers: {
        q6_a1: "Ich spüre das sofort und versuche zu helfen.",
        q6_a2: "Ich frage mich, was dahinter steckt.",
        q6_a3: "Ich versuche einfach, nichts falsch zu machen.",
        q6_a4: "Ich frage ihn direkt, was los ist.",
      },
    },
    q7: {
      text: "Wenn dein Partner etwas vergisst, das dir wichtig war – was ist deine typische Reaktion?",
      answers: {
        q7_a1: "Ich sage ihm, dass mich das verletzt hat.",
        q7_a2: "Ich versuche zu verstehen, warum es passiert ist.",
        q7_a3: "Ich sage mir, dass es kein großes Thema ist.",
        q7_a4: "Ich frage mich, ob ich vielleicht zu viel erwartet habe.",
      },
    },
    q8: {
      text: "Wenn dein Partner nach einem Streit still ist – was fühlt sich am vertrautesten an?",
      answers: {
        q8_a1: "Ich möchte möglichst schnell darüber sprechen.",
        q8_a2: "Ich gehe das Gespräch im Kopf immer wieder durch.",
        q8_a3: "Ich lasse Zeit vergehen und spreche es nicht mehr an.",
        q8_a4: "Ich versuche, einfach wieder normal zu sein.",
      },
    },
    q9: {
      text: "Wenn du dich ein paar Tage emotional distanziert fühlst, was passiert meistens?",
      answers: {
        q9_a1: "Ich frage mich, was sich verändert hat.",
        q9_a2: "Ich spreche es an, damit wir wieder näher zusammenfinden.",
        q9_a3: "Ich denke, wir sind wahrscheinlich einfach beide beschäftigt.",
        q9_a4: "Ich versuche besonders unterstützend zu sein.",
      },
    },
    q10: {
      text: "Wenn du dir nicht sicher bist, wie dein Partner über etwas denkt, dann...",
      answers: {
        q10_a1: "frage ich ihn direkt.",
        q10_a2: "versuche ich, sein Verhalten zu interpretieren.",
        q10_a3: "warte ich ab, ob es sich von selbst klärt.",
        q10_a4: "passe ich mich an das an, was am besten zu funktionieren scheint.",
      },
    },
    q11: {
      text: "Wenn ein Gespräch mit deinem Partner angespannt wird, was tust du meistens?",
      answers: {
        q11_a1: "Ich versuche, das Problem sofort zu lösen.",
        q11_a2: "Ich denke sehr genau über jedes Wort nach.",
        q11_a3: "Ich versuche, das Gespräch zu entschärfen oder das Thema zu wechseln.",
        q11_a4: "Ich konzentriere mich darauf, seine Perspektive zu verstehen.",
      },
    },
    q12: {
      text: "Wenn sich eure Beziehung gerade besonders gut anfühlt – welcher Gedanke taucht manchmal auf?",
      answers: {
        q12_a1: "Ich hoffe, dass dieses Gefühl lange anhält.",
        q12_a2: "Ich frage mich, was es wieder verändern könnte.",
        q12_a3: "Ich habe das Bedürfnis, die Verbindung noch weiter zu vertiefen.",
        q12_a4: "Ich versuche, alles harmonisch und ruhig zu halten.",
      },
    },
  },
  en: {
    q1: {
      text: "If your partner seems a bit distant for a day or two, what usually happens in your head?",
      answers: {
        q1_a1: "I quickly wonder if I did something wrong.",
        q1_a2: "I give him some space and hope it gets better on its own.",
        q1_a3: "I want to talk about it as soon as possible.",
        q1_a4: "I tell myself it probably doesn't mean anything.",
      },
    },
    q2: {
      text: "Your partner says something that hurts you a little. What usually happens first?",
      answers: {
        q2_a1: "I keep thinking about it for a long time.",
        q2_a2: "I try to explain how it felt to me.",
        q2_a3: "I play it down so it doesn't turn into a fight.",
        q2_a4: "I pay more attention next time so it doesn't happen again.",
      },
    },
    q3: {
      text: "During an argument, which reaction feels most like you?",
      answers: {
        q3_a1: "I try to solve the problem immediately.",
        q3_a2: "I get quiet and need time to think.",
        q3_a3: "I analyze in my head how the argument even started.",
        q3_a4: "I try to calm the situation down.",
      },
    },
    q4: {
      text: "When your partner seems stressed or overwhelmed, you usually...",
      answers: {
        q4_a1: "try to support him as much as possible.",
        q4_a2: "wonder whether I might have something to do with it.",
        q4_a3: "ask him directly what's wrong.",
        q4_a4: "give him space and pull back a little.",
      },
    },
    q5: {
      text: "If something in the relationship bothers you, how long does it usually take before you bring it up?",
      answers: {
        q5_a1: "I usually think about it for quite a while first.",
        q5_a2: "I bring it up relatively quickly.",
        q5_a3: "Sometimes I decide it's not that important.",
        q5_a4: "I tend to adjust my expectations instead.",
      },
    },
    q6: {
      text: "If your partner is in a bad mood, how does that affect you?",
      answers: {
        q6_a1: "I feel it immediately and try to help.",
        q6_a2: "I wonder what's behind it.",
        q6_a3: "I just try not to do anything wrong.",
        q6_a4: "I ask him directly what's going on.",
      },
    },
    q7: {
      text: "If your partner forgets something that was important to you, what is your typical reaction?",
      answers: {
        q7_a1: "I tell him that it hurt me.",
        q7_a2: "I try to understand why it happened.",
        q7_a3: "I tell myself it's not a big deal.",
        q7_a4: "I wonder if maybe I expected too much.",
      },
    },
    q8: {
      text: "If your partner goes quiet after an argument, what feels most familiar to you?",
      answers: {
        q8_a1: "I want to talk about it as soon as possible.",
        q8_a2: "I replay the conversation in my head over and over.",
        q8_a3: "I let time pass and don't bring it up again.",
        q8_a4: "I try to just act normal again.",
      },
    },
    q9: {
      text: "If you feel emotionally distant for a few days, what usually happens?",
      answers: {
        q9_a1: "I wonder what has changed.",
        q9_a2: "I bring it up so we can feel closer again.",
        q9_a3: "I think we're probably both just busy.",
        q9_a4: "I try to be especially supportive.",
      },
    },
    q10: {
      text: "If you're not sure what your partner thinks about something, you usually...",
      answers: {
        q10_a1: "ask him directly.",
        q10_a2: "try to interpret his behavior.",
        q10_a3: "wait and see if it becomes clear on its own.",
        q10_a4: "adapt to whatever seems to work best.",
      },
    },
    q11: {
      text: "When a conversation with your partner becomes tense, what do you usually do?",
      answers: {
        q11_a1: "I try to solve the problem immediately.",
        q11_a2: "I think very carefully about every word.",
        q11_a3: "I try to soften the conversation or change the subject.",
        q11_a4: "I focus on understanding his perspective.",
      },
    },
    q12: {
      text: "When your relationship feels especially good, which thought sometimes comes up?",
      answers: {
        q12_a1: "I hope this feeling lasts a long time.",
        q12_a2: "I wonder what could change it again.",
        q12_a3: "I feel the need to deepen the connection even more.",
        q12_a4: "I try to keep everything harmonious and calm.",
      },
    },
  },
};

const PROGRESS_TOTAL = QUESTIONS.length;

const backBtn = document.getElementById("backBtn");
const languageToggle = document.getElementById("languageToggle");
const languageLabel = document.getElementById("languageLabel");
const pageTitle = document.getElementById("pageTitle");
const metaDescription = document.getElementById("metaDescription");
const ogLocale = document.getElementById("ogLocale");
const ogTitle = document.getElementById("ogTitle");
const ogDescription = document.getElementById("ogDescription");
const twitterTitle = document.getElementById("twitterTitle");
const twitterDescription = document.getElementById("twitterDescription");
const brandLink = document.getElementById("brandLink");
const quizSubnav = document.getElementById("quizSubnav");
const quizPanel = document.getElementById("quizPanel");
const resetBtn = document.getElementById("resetBtn");
const resetBtnText = document.getElementById("resetBtnText");
const progressText = document.getElementById("progressText");
const questionText = document.getElementById("questionText");
const answersContainer = document.getElementById("answersContainer");
const liveRegion = document.getElementById("liveRegion");

const state = {
  currentIndex: 0,
  answers: {},
  language: getStoredLanguage(),
};

if (backBtn) {
  backBtn.addEventListener("click", handleBack);
}

if (languageToggle) {
  languageToggle.addEventListener("click", handleLanguageToggle);
}

if (resetBtn) {
  resetBtn.addEventListener("click", handleResetClick);
}

applyLanguage();
render();

function getStoredLanguage() {
  try {
    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) === "en" ? "en" : "de";
  } catch (_error) {
    return "de";
  }
}

function handleLanguageToggle() {
  state.language = state.language === "en" ? "de" : "en";

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, state.language);
  } catch (_error) {
    // Ignore storage write failures and still update the current page.
  }

  applyLanguage();
  render();
}

function applyLanguage() {
  const ui = QUIZ_UI_TEXT[state.language] || QUIZ_UI_TEXT.de;

  document.documentElement.lang = state.language;
  document.title = ui.pageTitle;

  if (pageTitle) pageTitle.textContent = ui.pageTitle;
  if (metaDescription) metaDescription.setAttribute("content", ui.metaDescription);
  if (ogLocale) ogLocale.setAttribute("content", ui.ogLocale);
  if (ogTitle) ogTitle.setAttribute("content", ui.ogTitle);
  if (ogDescription) ogDescription.setAttribute("content", ui.ogDescription);
  if (twitterTitle) twitterTitle.setAttribute("content", ui.twitterTitle);
  if (twitterDescription) twitterDescription.setAttribute("content", ui.twitterDescription);
  if (brandLink) brandLink.setAttribute("aria-label", ui.brandAriaLabel);
  if (languageToggle) {
    languageToggle.setAttribute("aria-label", ui.languageButtonAriaLabel);
    languageToggle.setAttribute("aria-pressed", String(state.language === "en"));
  }
  if (languageLabel) languageLabel.textContent = ui.languageLabel;
  if (quizSubnav) quizSubnav.setAttribute("aria-label", ui.quizNavAriaLabel);
  if (backBtn) backBtn.setAttribute("aria-label", ui.backButtonAriaLabel);
  if (quizPanel) quizPanel.setAttribute("aria-label", ui.quizPanelAriaLabel);
  if (answersContainer) answersContainer.setAttribute("aria-label", ui.answersGroupAriaLabel);
  if (resetBtnText) resetBtnText.textContent = ui.resetButton;
}

function getLocalizedQuestion(question) {
  const dictionary = QUESTION_TRANSLATIONS[state.language] || QUESTION_TRANSLATIONS.de;
  const localizedQuestion = dictionary[question.id];

  if (!localizedQuestion) {
    return {
      text: question.text,
      answers: Object.fromEntries(question.answers.map((answer) => [answer.id, answer.label])),
    };
  }

  return localizedQuestion;
}

function render() {
  const question = QUESTIONS[state.currentIndex];
  const localizedQuestion = getLocalizedQuestion(question);
  const ui = QUIZ_UI_TEXT[state.language] || QUIZ_UI_TEXT.de;
  const selectedAnswerId = state.answers[question.id] || null;
  const currentStep = state.currentIndex + 1;
  const progressRatio = Math.min(currentStep / PROGRESS_TOTAL, 1);

  questionText.textContent = localizedQuestion.text;
  questionText.setAttribute("data-question-id", question.id);

  progressText.textContent = `${currentStep}/${PROGRESS_TOTAL}`;
  progressText.style.setProperty("--progress", String(progressRatio));

  if (backBtn) {
    backBtn.disabled = state.currentIndex === 0;
  }

  answersContainer.innerHTML = "";

  question.answers.forEach((answer, answerIdx) => {
    const letter = String.fromCharCode(65 + answerIdx);
    const localizedAnswerLabel = localizedQuestion.answers?.[answer.id] || answer.label;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "answer-btn";
    btn.innerHTML = `
      <span class="answer-btn__letter" aria-hidden="true">${letter}</span>
      <span class="answer-btn__text">${localizedAnswerLabel}</span>
      <span class="answer-btn__dot" aria-hidden="true"></span>
    `;
    btn.setAttribute("aria-pressed", String(selectedAnswerId === answer.id));
    btn.setAttribute("aria-label", `${letter}: ${localizedAnswerLabel}`);

    if (selectedAnswerId === answer.id) {
      btn.classList.add("is-selected");
    }

    btn.addEventListener("click", () => handleAnswerClick(question.id, answer.id));
    answersContainer.appendChild(btn);
  });

  liveRegion.textContent = `${ui.liveQuestionPrefix}: ${localizedQuestion.text}`;
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
