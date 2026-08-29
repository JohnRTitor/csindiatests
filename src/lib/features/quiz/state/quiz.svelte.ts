import type { Question, ExamConfig } from "$lib/features/exams/types";
import type { QuizState, QuizMode } from "$lib/features/quiz/types";

export function createQuizStore(initialQuestions: Question[] = [], mode: QuizMode = "practice", durationMinutes: number = 45) {
  let state = $state<QuizState>({
    questions: initialQuestions,
    currentIndex: 0,
    answers: {},
    status: "idle",
    mode: mode,
    timeRemaining: mode === "timed" ? durationMinutes * 60 : null,
    isTimerPaused: false,
    score: 0,
    startTime: 0,
    endTime: null,
  });

  let timerInterval: ReturnType<typeof setInterval> | null = null;

  function start() {
    if (state.status !== "idle") return;
    state.status = "in-progress";
    state.startTime = Date.now();
    state.isTimerPaused = false;
    
    if (state.mode === "timed" && state.timeRemaining !== null) {
      startTimer();
    }
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (state.isTimerPaused || state.status !== "in-progress") return;
      
      if (state.timeRemaining !== null) {
        state.timeRemaining -= 1;
        if (state.timeRemaining <= 0) {
          state.timeRemaining = 0;
          complete();
        }
      }
    }, 1000);
  }

  function pauseTimer() {
    state.isTimerPaused = true;
  }

  function resumeTimer() {
    state.isTimerPaused = false;
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function answerQuestion(questionId: string, optionId: string) {
    if (state.status !== "in-progress") return;
    
    state.answers[questionId] = optionId;
    
    // Check if all questions are answered (optional: auto complete)
    // if (Object.keys(state.answers).length === state.questions.length) {
    //   complete();
    // }
  }

  function nextQuestion() {
    if (state.currentIndex < state.questions.length - 1) {
      state.currentIndex += 1;
    }
  }

  function prevQuestion() {
    if (state.currentIndex > 0) {
      state.currentIndex -= 1;
    }
  }

  function goToQuestion(index: number) {
    if (index >= 0 && index < state.questions.length) {
      state.currentIndex = index;
    }
  }

  function complete() {
    if (state.status === "completed") return;
    
    stopTimer();
    state.status = "completed";
    state.endTime = Date.now();
    
    // Calculate score
    let correct = 0;
    state.questions.forEach(q => {
      if (state.answers[q.id] === q.correctOptionId) {
        correct++;
      }
    });
    state.score = correct;
  }

  function reset() {
    stopTimer();
    state.currentIndex = 0;
    state.answers = {};
    state.status = "idle";
    state.mode = mode;
    state.timeRemaining = mode === "timed" ? durationMinutes * 60 : null;
    state.isTimerPaused = false;
    state.score = 0;
    state.startTime = 0;
    state.endTime = null;
  }

  return {
    get state() { return state; },
    get currentQuestion() { return state.questions[state.currentIndex]; },
    get isCompleted() { return state.status === "completed"; },
    get isStarted() { return state.status !== "idle"; },
    start,
    answerQuestion,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    complete,
    reset,
    pauseTimer,
    resumeTimer
  };
}

// Global instance for testing if needed, though usually better to instantiate per component tree
// export const quizStore = createQuizStore();
