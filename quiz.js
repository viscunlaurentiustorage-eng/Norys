const {
  STORAGE_KEY,
  QUESTIONS,
  buildEmptyProfile,
  buildResultProfile,
} = window.NorysProfileEngine;

const PROGRESS_TOTAL = QUESTIONS.length;

const backBtn = document.getElementById("backBtn");
const resetBtn = document.getElementById("resetBtn");
const progressText = document.getElementById("progressText");
const questionText = document.getElementById("questionText");
const answersContainer = document.getElementById("answersContainer");
const liveRegion = document.getElementById("liveRegion");

const state = loadState();

if (backBtn) {
  backBtn.addEventListener("click", handleBack);
}

if (resetBtn) {
  resetBtn.addEventListener("click", handleResetClick);
}

render();

function render() {
  const index = clamp(state.currentIndex, 0, QUESTIONS.length - 1);
  const question = QUESTIONS[index];
  const selectedAnswerId = state.answers[question.id];
  const currentStep = index + 1;
  const progressRatio = Math.min(currentStep / PROGRESS_TOTAL, 1);

  state.currentIndex = index;
  saveState();

  questionText.textContent = question.text;
  questionText.setAttribute("data-question-id", question.id);

  progressText.textContent = `${currentStep}/${PROGRESS_TOTAL}`;
  progressText.style.setProperty("--progress", String(progressRatio));

  if (backBtn) {
    backBtn.disabled = index === 0;
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

    btn.addEventListener("click", () => handleAnswerClick(answer.id));
    answersContainer.appendChild(btn);
  });

  liveRegion.textContent = `Neue Frage: ${question.text}`;
}

function handleAnswerClick(answerId) {
  const question = QUESTIONS[state.currentIndex];
  state.answers[question.id] = answerId;
  recalculateResultState(state);

  if (state.currentIndex < QUESTIONS.length - 1) {
    state.currentIndex += 1;
    saveState();
    render();
    return;
  }

  saveState();
  finishQuiz();
}

function handleBack() {
  if (state.currentIndex === 0) return;
  state.currentIndex -= 1;
  saveState();
  render();
}

function handleResetClick(event) {
  event.preventDefault();
  resetQuiz();
  window.location.href = "quiz.html";
}

function finishQuiz() {
  const profile = state.resultProfile || buildResultProfile(state.answers);
  if (!profile || !profile.primaryTrait) {
    window.location.href = "quiz.html";
    return;
  }

  const params = new URLSearchParams({ primary: profile.primaryTrait });
  window.location.href = `simulate.html?${params.toString()}`;
}

function resetQuiz() {
  localStorage.removeItem(STORAGE_KEY);
  overwriteState(defaultState());
  render();
}

function overwriteState(nextState) {
  state.currentIndex = nextState.currentIndex;
  state.answers = nextState.answers;
  state.resultProfile = nextState.resultProfile;
}

function defaultState() {
  return {
    currentIndex: 0,
    answers: {},
    resultProfile: buildEmptyProfile(),
  };
}

function recalculateResultState(targetState) {
  targetState.resultProfile = buildResultProfile(targetState.answers);
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();

    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return defaultState();

    const safe = defaultState();
    safe.currentIndex = clamp(
      Number.isInteger(parsed.currentIndex) ? parsed.currentIndex : 0,
      0,
      QUESTIONS.length - 1
    );
    safe.answers = migrateAnswers(parsed.answers);
    recalculateResultState(safe);
    return safe;
  } catch {
    return defaultState();
  }
}

function migrateAnswers(rawAnswers) {
  const migrated = {};
  if (typeof rawAnswers !== "object" || rawAnswers === null) return migrated;

  QUESTIONS.forEach((question) => {
    const value = rawAnswers[question.id];

    if (typeof value === "string") {
      const exists = question.answers.some((answer) => answer.id === value);
      if (exists) {
        migrated[question.id] = value;
      }
      return;
    }

    if (Number.isInteger(value) && question.answers[value]) {
      migrated[question.id] = question.answers[value].id;
    }
  });

  return migrated;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

window.quizDebug = {
  state,
  QUESTIONS,
  buildResultProfile,
  resetQuiz,
};
