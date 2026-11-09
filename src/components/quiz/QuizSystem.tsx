import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { QuestionGenerator } from '../../services/questionGenerator';
import { QuizQuestion, ClassLevel, Difficulty } from '../../types';
import { classesList } from '../../data/classesData';
import { sound } from '../../services/sound';
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Trophy,
  Filter,
  Lightbulb,
  Coins,
} from 'lucide-react';

export const QuizSystem: React.FC = () => {
  const {
    selectedClass,
    selectedDifficulty,
    selectedTopicId,
    t,
    profile,
    recordQuizResult,
    triggerConfetti,
  } = useApp();

  const [currentClass, setCurrentClass] = useState<ClassLevel>(selectedClass);
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>(selectedDifficulty);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isAnswerChecked, setIsAnswerChecked] = useState<Record<number, boolean>>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [reviewMode, setReviewMode] = useState(false);
  const [typedInput, setTypedInput] = useState('');
  const [showHint, setShowHint] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const loadQuiz = (cls: ClassLevel, diff: Difficulty) => {
    const list = QuestionGenerator.generateQuestions(cls, diff, 10, selectedTopicId || undefined);
    setQuestions(list);
    setCurrentIndex(0);
    setUserAnswers({});
    setIsAnswerChecked({});
    setQuizFinished(false);
    setReviewMode(false);
    setTimerSeconds(0);
    setTypedInput('');
    setShowHint(false);
  };

  useEffect(() => {
    loadQuiz(currentClass, currentDifficulty);
  }, [currentClass, currentDifficulty]);

  useEffect(() => {
    if (timerActive && !quizFinished && questions.length > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, quizFinished, questions.length]);

  const currentQ = questions[currentIndex];

  const handleSelectAnswer = (ans: string) => {
    if (isAnswerChecked[currentIndex] && !reviewMode) return;
    setUserAnswers((prev) => ({ ...prev, [currentIndex]: ans }));
  };

  const checkAnswer = (userAns: string, q: QuizQuestion): boolean => {
    if (!userAns || !q) return false;
    const cleanUser = userAns.trim().toLowerCase();
    const cleanEn = q.correctAnswerEn.trim().toLowerCase();
    const cleanUr = q.correctAnswerUr.trim().toLowerCase();
    return cleanUser === cleanEn || cleanUser === cleanUr;
  };

  const handleCheckCurrentAnswer = () => {
    if (!userAnswers[currentIndex]) return;
    const isCorrect = checkAnswer(userAnswers[currentIndex], currentQ);
    if (isCorrect) sound.playCorrect();
    else sound.playWrong();
    setIsAnswerChecked((prev) => ({ ...prev, [currentIndex]: true }));
  };

  const handleNext = () => {
    sound.playClick();
    setShowHint(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setTypedInput(userAnswers[currentIndex + 1] || '');
    } else {
      finishQuiz();
    }
  };

  const handlePrevious = () => {
    sound.playClick();
    setShowHint(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setTypedInput(userAnswers[currentIndex - 1] || '');
    }
  };

  const finishQuiz = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (checkAnswer(userAnswers[idx] || '', q)) {
        correctCount++;
      }
    });

    setQuizFinished(true);
    recordQuizResult(correctCount, questions.length);

    if (correctCount === questions.length) {
      sound.playVictory();
      triggerConfetti();
    } else {
      sound.playVictory();
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (checkAnswer(userAnswers[idx] || '', q)) correct++;
    });
    return {
      correct,
      total: questions.length,
      percentage: questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0,
      pointsEarned: correct * 10 + (correct === questions.length ? 50 : 0),
    };
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Result Screen
  if (quizFinished && !reviewMode) {
    const scoreData = calculateScore();
    const wrongQuestions = questions.filter((q, idx) => !checkAnswer(userAnswers[idx] || '', q));

    return (
      <div className="max-w-md mx-auto space-y-4 pb-12 select-none">
        <div className="wood-board-3d p-6 sm:p-8 text-center space-y-5 shadow-2xl relative">
          <div className="w-18 h-18 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-amber-950 flex items-center justify-center shadow-lg border-2 border-yellow-200">
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <span className="gold-badge text-[10px] px-2.5 py-0.5 rounded-full uppercase">
              Quiz Completed
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-100 drop-shadow-md mt-1">
              {scoreData.percentage >= 80 ? t.common.congratulations : t.common.wellDone}
            </h2>
            <p className="text-xs text-amber-300 font-bold mt-0.5">
              {t.classes[currentClass]?.title} • {currentDifficulty.toUpperCase()}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 wood-board-inner p-3.5 border border-amber-800">
            <div>
              <div className="text-[10px] text-amber-300 font-bold uppercase">{t.common.score}</div>
              <div className="text-xl font-black text-yellow-300 mt-0.5">
                {scoreData.correct}/{scoreData.total}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-amber-300 font-bold uppercase">{t.common.accuracy}</div>
              <div className="text-xl font-black text-emerald-400 mt-0.5">
                {scoreData.percentage}%
              </div>
            </div>
            <div>
              <div className="text-[10px] text-amber-300 font-bold uppercase">{t.common.time}</div>
              <div className="text-xl font-black text-white mt-0.5">
                {formatTimer(timerSeconds)}
              </div>
            </div>
          </div>

          <div className="gold-btn-3d p-3 rounded-xl flex items-center justify-between text-xs font-black">
            <span>Points Awarded:</span>
            <span>+{scoreData.pointsEarned} Points</span>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                sound.playClick();
                loadQuiz(currentClass, currentDifficulty);
              }}
              className="w-full green-btn-3d py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.common.playAgain}</span>
            </button>

            {wrongQuestions.length > 0 && (
              <button
                onClick={() => {
                  sound.playClick();
                  setReviewMode(true);
                  setCurrentIndex(0);
                }}
                className="w-full wood-btn-3d py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-amber-300" />
                <span>{t.common.reviewWrong} ({wrongQuestions.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!currentQ) {
    return (
      <div className="wood-board-3d max-w-md mx-auto p-8 text-center text-amber-200">
        Loading questions...
      </div>
    );
  }

  const currentAnswer = userAnswers[currentIndex];
  const isChecked = isAnswerChecked[currentIndex] || reviewMode;
  const isCorrect = checkAnswer(currentAnswer, currentQ);
  const options = profile.language === 'ur' ? currentQ.optionsUr || currentQ.optionsEn || [] : currentQ.optionsEn || [];

  return (
    <div className="max-w-md mx-auto min-h-[calc(100vh-6rem)] flex flex-col justify-between py-2 sm:py-4 px-2 select-none">
      {/* Top Filter & Settings */}
      <div className="wood-board-3d p-3 shadow-md flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          <select
            value={currentClass}
            onChange={(e) => {
              sound.playClick();
              setCurrentClass(e.target.value as ClassLevel);
            }}
            className="text-xs font-black bg-amber-950/80 text-amber-200 border border-amber-800 rounded-lg px-2 py-1 focus:outline-none"
          >
            {classesList.map((c) => (
              <option key={c.id} value={c.id}>
                {t.classes[c.id]?.title || c.titleEn}
              </option>
            ))}
          </select>

          <select
            value={currentDifficulty}
            onChange={(e) => {
              sound.playClick();
              setCurrentDifficulty(e.target.value as Difficulty);
            }}
            className="text-xs font-black bg-amber-950/80 text-amber-200 border border-amber-800 rounded-lg px-2 py-1 focus:outline-none"
          >
            <option value="easy">{t.common.easy}</option>
            <option value="medium">{t.common.medium}</option>
            <option value="hard">{t.common.hard}</option>
            <option value="expert">{t.common.expert}</option>
          </select>
        </div>

        <div className="wood-panel-3d px-2.5 py-1 text-white text-xs font-mono font-bold flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>{formatTimer(timerSeconds)}</span>
        </div>
      </div>

      {/* Main Wooden Question Board */}
      <div className="my-auto space-y-4">
        <div className="wood-board-3d p-4 sm:p-6 text-center relative shadow-2xl">
          <div className="absolute top-2.5 left-2.5 brass-rivet" />
          <div className="absolute top-2.5 right-2.5 brass-rivet" />
          <div className="absolute bottom-2.5 left-2.5 brass-rivet" />
          <div className="absolute bottom-2.5 right-2.5 brass-rivet" />

          <div className="wood-board-inner p-5 sm:p-7 min-h-[140px] flex flex-col items-center justify-center">
            {currentQ.visualEmoji && currentQ.visualCount && (
              <div className="text-2xl sm:text-3xl mb-2 tracking-widest animate-pulse">
                {Array(currentQ.visualCount).fill(currentQ.visualEmoji).join(' ')}
              </div>
            )}

            <div className="text-xl sm:text-2xl md:text-3xl font-black text-amber-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] leading-snug">
              {profile.language === 'ur' ? currentQ.questionUr : currentQ.questionEn}
            </div>
          </div>
        </div>

        {/* 4 Wooden Answer Tiles */}
        {options.length > 0 && currentQ.type !== 'type_answer' ? (
          <div className="grid grid-cols-2 gap-3">
            {options.map((opt, idx) => {
              const isSelected = currentAnswer === opt;
              const isThisCorrect = checkAnswer(opt, currentQ);

              let tileClass = 'wood-tile-3d';
              if (isChecked) {
                if (isThisCorrect) {
                  tileClass = 'wood-tile-3d wood-tile-correct';
                } else if (isSelected && !isThisCorrect) {
                  tileClass = 'wood-tile-3d wood-tile-wrong';
                }
              } else if (isSelected) {
                tileClass = 'wood-tile-3d wood-tile-pressed';
              }

              return (
                <button
                  key={idx}
                  onClick={() => {
                    sound.playClick();
                    handleSelectAnswer(opt);
                  }}
                  disabled={isChecked && !reviewMode}
                  className={`min-h-[70px] sm:min-h-[80px] rounded-2xl text-base sm:text-xl font-black flex items-center justify-center p-3 cursor-pointer shadow-lg active:scale-95 transition-all ${tileClass}`}
                >
                  <span className="math-symbol drop-shadow-sm">{opt}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder="Type your answer..."
              className="w-full p-3.5 rounded-xl border-2 border-amber-800 bg-amber-950/90 text-white font-bold text-lg text-center focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        )}

        {/* Feedback Alert */}
        {isChecked && (
          <div
            className={`p-3 rounded-xl border text-xs sm:text-sm font-bold text-center ${
              isCorrect
                ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500'
                : 'bg-rose-950/90 text-rose-200 border-rose-500'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 mb-1 font-black">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{t.common.correct} (+10 Points)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>{t.common.wrong}</span>
                </>
              )}
            </div>
            <p className="text-white/90 text-xs">
              {profile.language === 'ur' ? currentQ.explanationUr : currentQ.explanationEn}
            </p>
          </div>
        )}

        {showHint && (
          <div className="wood-panel-3d p-3 text-amber-200 text-xs text-center border border-amber-600">
            <strong>Hint: </strong>
            {profile.language === 'ur' ? currentQ.hintUr || 'غور سے حل کریں۔' : currentQ.hintEn || 'Break down step-by-step.'}
          </div>
        )}
      </div>

      {/* Bottom Bar: Prev, Check, Hint, Next */}
      <div className="wood-board-3d p-3 mt-3 flex items-center justify-between gap-2 shadow-xl">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="wood-btn-3d px-3 py-2 rounded-xl text-xs font-bold disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          </button>

          {!isChecked && (
            <button
              onClick={() => {
                sound.playClick();
                setShowHint(!showHint);
              }}
              className="wood-btn-3d px-2.5 py-2 rounded-xl text-xs font-bold"
            >
              <Lightbulb className="w-4 h-4 text-amber-200" />
            </button>
          )}
        </div>

        {/* Question Counter Pill */}
        <div className="wood-panel-3d px-3 py-1.5 text-center text-xs font-black text-amber-200">
          Q {currentIndex + 1} / {questions.length}
        </div>

        <div className="flex items-center gap-1.5">
          {!isChecked && (currentAnswer || typedInput) && (
            <button
              onClick={() => {
                if (currentQ.type === 'type_answer') handleSelectAnswer(typedInput);
                handleCheckCurrentAnswer();
              }}
              className="green-btn-3d px-3 py-2 rounded-xl text-xs font-black"
            >
              Check
            </button>
          )}

          <button
            onClick={handleNext}
            className="green-btn-3d px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1"
          >
            <span>{currentIndex === questions.length - 1 ? 'Submit' : 'Next'}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};
