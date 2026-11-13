import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { QuestionGenerator } from '../../services/questionGenerator';
import { QuizQuestion, GameMode } from '../../types';
import { sound } from '../../services/sound';
import { levelsData } from '../../data/levelsData';
import {
  ArrowLeft,
  Timer,
  Coins,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Star,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Pause,
  Play,
  BookOpen,
  X,
  Target,
  Trophy,
} from 'lucide-react';

interface MathGameScreenProps {
  operation: GameMode | string;
  onBack: () => void;
}

const OPERATION_METADATA: Record<string, { symbol: string; titleEn: string; titleUr: string }> = {
  addition: { symbol: '+', titleEn: 'Addition Game', titleUr: 'جمع کا کھیل' },
  subtraction: { symbol: '−', titleEn: 'Subtraction Game', titleUr: 'تفریق کا کھیل' },
  multiplication: { symbol: '×', titleEn: 'Multiplication Game', titleUr: 'ضرب کا کھیل' },
  division: { symbol: '÷', titleEn: 'Division Game', titleUr: 'تقسیم کا کھیل' },
  mixed: { symbol: '⚡', titleEn: 'Mixed Mathematics', titleUr: 'ریاضی مکس چیلنج' },
  algebra: { symbol: '𝑥', titleEn: 'Algebra & Equations', titleUr: 'الجبرا اور مساوات' },
  missing_number: { symbol: '❓', titleEn: 'Missing Number Puzzle', titleUr: 'گمشدہ عدد کا کھیل' },
  sequence: { symbol: '🔢', titleEn: 'Number Sequence', titleUr: 'اعداد کی ترتیب' },
  times_tables: { symbol: '✖️', titleEn: 'Times Tables', titleUr: 'پہاڑوں کی مشق' },
  fractions: { symbol: '½', titleEn: 'Fractions Master', titleUr: 'کسروں کا امتحان' },
  quiz: { symbol: '🎯', titleEn: 'Mathematics Quiz', titleUr: 'ریاضی کوئز' },
  mental_math: { symbol: '🧠', titleEn: 'Mental Math Challenge', titleUr: 'ذہنی ریاضی چیلنج' },
};

export const MathGameScreen: React.FC<MathGameScreenProps> = ({ operation, onBack }) => {
  const {
    profile,
    selectedClass,
    selectedLevel,
    setSelectedLevel,
    recordLevelResult,
    isUrdu,
    t,
    triggerConfetti,
  } = useApp();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showHint, setShowHint] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const currentLevelConfig = levelsData.find((l) => l.level === selectedLevel) || levelsData[0];
  const [timeLeft, setTimeLeft] = useState(currentLevelConfig.timeLimitSec);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const selectedAnswersRef = useRef<Record<number, string>>({});
  const questionsRef = useRef<QuizQuestion[]>([]);
  const hasRecordedRef = useRef(false);

  useEffect(() => {
    selectedAnswersRef.current = selectedAnswers;
  }, [selectedAnswers]);

  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  const checkAnswer = useCallback((q: QuizQuestion, chosen: string): boolean => {
    return (
      chosen === q.correctAnswerEn ||
      chosen === q.correctAnswerUr ||
      chosen.trim().toLowerCase() === q.correctAnswerEn.trim().toLowerCase()
    );
  }, []);

  const finishGame = useCallback(
    (finalAnswers?: Record<number, string>) => {
      if (hasRecordedRef.current) return;
      hasRecordedRef.current = true;
      setGameOver(true);

      const qList = questionsRef.current;
      const ansMap = finalAnswers ?? selectedAnswersRef.current;
      const total = qList.length || 20;

      let correct = 0;
      qList.forEach((q, idx) => {
        const ans = ansMap[idx];
        if (ans && checkAnswer(q, ans)) {
          correct++;
        }
      });

      const accuracy = Math.round((correct / total) * 100);
      const passed = accuracy >= 70;

      let starsEarned = 0;
      if (accuracy >= 95) starsEarned = 3;
      else if (accuracy >= 85) starsEarned = 2;
      else if (accuracy >= 70) starsEarned = 1;

      const earnedPoints = correct * 10 + (passed ? starsEarned * 25 : 0);
      recordLevelResult(selectedClass, selectedLevel, correct, total, starsEarned, earnedPoints);

      if (passed) {
        sound.playVictory();
        triggerConfetti();
      } else {
        sound.playIncorrect();
      }
    },
    [checkAnswer, recordLevelResult, selectedClass, selectedLevel, triggerConfetti]
  );

  // Initialize or restart level with 20 questions
  const initLevel = useCallback(() => {
    const list = QuestionGenerator.generateArithmeticQuestions(
      operation,
      selectedClass,
      selectedLevel,
      20
    );
    hasRecordedRef.current = false;
    selectedAnswersRef.current = {};
    questionsRef.current = list;
    setQuestions(list);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowHint(false);
    setIsPaused(false);
    setGameOver(false);
    setShowReview(false);
    setElapsedSeconds(0);
    setTimeLeft(currentLevelConfig.timeLimitSec);
  }, [operation, selectedClass, selectedLevel, currentLevelConfig.timeLimitSec]);

  useEffect(() => {
    initLevel();
  }, [initLevel]);

  // Countdown timer tick
  useEffect(() => {
    if (gameOver || isPaused || questions.length === 0) return;

    timerRef.current = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameOver, isPaused, questions.length]);

  // Trigger clean game over when timer hits zero
  useEffect(() => {
    if (timeLeft === 0 && !gameOver && questions.length > 0) {
      finishGame(selectedAnswersRef.current);
    }
  }, [timeLeft, gameOver, questions.length, finishGame]);

  const currentQ = questions[currentIndex];
  const currentAnswer = selectedAnswers[currentIndex];
  const isCurrentAnswered = currentAnswer !== undefined;
  const totalQuestionsCount = questions.length || 20;

  const handleSelectAnswer = (option: string) => {
    if (isCurrentAnswered || gameOver || isPaused || !currentQ) return;

    const correct = checkAnswer(currentQ, option);
    if (correct) {
      sound.playCorrect();
    } else {
      sound.playIncorrect();
    }

    const updated = { ...selectedAnswers, [currentIndex]: option };
    selectedAnswersRef.current = updated;
    setSelectedAnswers(updated);

    // Automatically advance or finish once all questions are answered
    if (Object.keys(updated).length === totalQuestionsCount) {
      setTimeout(() => {
        finishGame(updated);
      }, 750);
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setShowHint(false);
    } else {
      finishGame(selectedAnswersRef.current);
    }
  };

  const handlePrev = () => {
    sound.playClick();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setShowHint(false);
    }
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const liveCorrectCount = Object.entries(selectedAnswers).filter(([idx, ans]) => {
    const q = questions[parseInt(idx, 10)];
    return q && checkAnswer(q, ans);
  }).length;
  const liveAccuracy = answeredCount > 0 ? Math.round((liveCorrectCount / answeredCount) * 100) : 0;

  const opMeta = OPERATION_METADATA[operation] || {
    symbol: '⚡',
    titleEn: 'Math Game',
    titleUr: 'ریاضی کا کھیل',
  };

  const classTitle = t.classes[selectedClass]?.title || selectedClass;
  const isCurrentCorrect = currentQ && isCurrentAnswered ? checkAnswer(currentQ, currentAnswer) : false;

  const finalCorrect = Object.entries(selectedAnswers).filter(([idx, ans]) => {
    const q = questions[parseInt(idx, 10)];
    return q && checkAnswer(q, ans);
  }).length;
  const finalAccuracy = Math.round((finalCorrect / totalQuestionsCount) * 100);
  const isPassed = finalAccuracy >= 70;
  const starsEarned = finalAccuracy >= 95 ? 3 : finalAccuracy >= 85 ? 2 : finalAccuracy >= 70 ? 1 : 0;
  const finalPointsEarned = finalCorrect * 10 + (isPassed ? starsEarned * 25 : 0);

  const wrongQuestions = questions
    .map((q, idx) => ({
      question: q,
      studentAnswer: selectedAnswers[idx] || (isUrdu ? '(جواب نہیں دیا گیا)' : '(Not answered)'),
      isCorrect: selectedAnswers[idx] ? checkAnswer(q, selectedAnswers[idx]) : false,
      questionNumber: idx + 1,
    }))
    .filter((item) => !item.isCorrect);

  const activeQuestionText = currentQ
    ? isUrdu
      ? currentQ.questionUr
      : currentQ.questionEn
    : '';
  const questionLines = activeQuestionText.split('\n');
  const hasVisualHeaderLine = Boolean(currentQ?.visualEmoji && questionLines.length > 1);

  return (
    <div className="max-w-md sm:max-w-xl mx-auto flex flex-col min-h-[82vh] justify-between pb-6 select-none relative">
      {/* TOP BAR */}
      <div className="wood-header-bar px-3 sm:px-4 py-2.5 rounded-2xl flex items-center justify-between gap-1.5 shadow-2xl mb-3">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="wood-btn-3d px-2.5 sm:px-3 py-1.5 flex items-center gap-1 text-xs font-black cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span className="hidden sm:inline">{t.common.exit}</span>
        </button>

        <div className="flex flex-col items-center text-center min-w-0">
          <div className="text-[10px] text-amber-200/90 font-bold uppercase tracking-wider truncate max-w-[120px] sm:max-w-none">
            {classTitle}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-base font-black text-amber-100 tracking-wide drop-shadow-sm">
              {t.common.level} {selectedLevel}
            </span>
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setIsPaused((p) => !p);
          }}
          disabled={gameOver}
          className="wood-btn-3d p-2 rounded-xl text-amber-200 hover:text-white disabled:opacity-40"
          title={isPaused ? (isUrdu ? 'جاری رکھیں' : 'Resume') : (isUrdu ? 'وقفہ' : 'Pause')}
        >
          {isPaused ? <Play className="w-3.5 h-3.5 fill-amber-300" /> : <Pause className="w-3.5 h-3.5" />}
        </button>

        <div
          dir="ltr"
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border border-amber-600/60 shadow-inner font-mono font-black text-xs ${
            timeLeft <= 30
              ? 'bg-red-900/80 text-red-200 animate-pulse border-red-500'
              : 'bg-amber-950/80 text-amber-200'
          }`}
        >
          <Timer className="w-3.5 h-3.5" />
          <span>{formatTime(timeLeft)}</span>
        </div>

        <div className="gold-badge px-2.5 sm:px-3 py-1 flex items-center gap-1 text-xs shadow-md">
          <Coins className="w-3.5 h-3.5 text-amber-950" />
          <span>{gameOver ? profile.points : profile.points + liveCorrectCount * 10}</span>
        </div>
      </div>

      {/* PROGRESS BAR */}
      {!gameOver && (
        <div className="wood-panel-3d px-4 py-2.5 shadow-md mb-2 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-amber-200">
            <Target className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {t.common.question} {currentIndex + 1} {t.common.of} {totalQuestionsCount}
            </span>
          </div>

          <div className="flex-1 max-w-[140px] sm:max-w-[180px] bg-amber-950/80 h-3 rounded-full border border-amber-700/60 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalQuestionsCount) * 100}%` }}
            />
          </div>

          <div className="font-mono font-black text-amber-300" dir="ltr">
            {answeredCount > 0 ? `${liveAccuracy}%` : '0%'}
          </div>
        </div>
      )}

      {/* PAUSE OVERLAY MODAL */}
      {isPaused && !gameOver && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="wood-board-3d p-6 sm:p-8 w-full max-w-sm text-center space-y-4 shadow-2xl relative">
            <div className="brass-rivet top-2 left-2" />
            <div className="brass-rivet top-2 right-2" />
            <div className="brass-rivet bottom-2 left-2" />
            <div className="brass-rivet bottom-2 right-2" />

            <div className="w-14 h-14 rounded-2xl bg-amber-950/80 border-2 border-amber-600/70 text-amber-300 flex items-center justify-center mx-auto shadow-inner">
              <Pause className="w-7 h-7" />
            </div>

            <h2 className="text-2xl font-black text-amber-100 drop-shadow-md">
              {isUrdu ? 'گیم رکی ہوئی ہے' : 'Game Paused'}
            </h2>
            <p className="text-xs text-amber-200/80">
              {isUrdu
                ? 'آپ کی اب تک کی پیشرفت محفوظ ہے۔ جب چاہیں دوبارہ شروع کریں!'
                : 'Take a breath! Your 20-question progress is securely held.'}
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setIsPaused(false);
                }}
                className="gold-btn-3d w-full py-3 text-sm font-black flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-amber-950" />
                <span>{isUrdu ? 'گیم جاری رکھیں' : 'Resume Game'}</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  initLevel();
                }}
                className="wood-btn-3d w-full py-2.5 text-xs font-black flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isUrdu ? 'لیول دوبارہ شروع کریں' : 'Restart Level'}</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onBack();
                }}
                className="wood-btn-3d w-full py-2.5 text-xs font-black flex items-center justify-center gap-2 text-amber-300"
              >
                <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                <span>{isUrdu ? 'مینو پر واپس جائیں' : 'Exit to Menu'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUESTION BOARD & 4 ANSWER TILES */}
      {currentQ && !gameOver && (
        <div className="flex-1 flex flex-col justify-center space-y-3">
          <div className="wood-board-3d p-4 sm:p-6 relative overflow-hidden shadow-2xl">
            <div className="brass-rivet top-2 left-2" />
            <div className="brass-rivet top-2 right-2" />
            <div className="brass-rivet bottom-2 left-2" />
            <div className="brass-rivet bottom-2 right-2" />

            <div className="question-display-box p-5 sm:p-8 text-center space-y-3.5 relative min-h-[160px] flex flex-col items-center justify-center">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-900/90 border border-amber-400/50 text-xs font-black text-amber-100 shadow-md">
                <span className="text-yellow-300">{opMeta.symbol}</span>
                <span>{isUrdu ? opMeta.titleUr : opMeta.titleEn}</span>
                <span className="text-amber-300">•</span>
                <span className="text-yellow-200">{currentQ.topic}</span>
              </div>

              {hasVisualHeaderLine && (
                <div className="text-3xl sm:text-4xl tracking-widest py-1 drop-shadow-md select-none animate-subtle">
                  {questionLines[0]}
                </div>
              )}

              <div
                dir="ltr"
                className="question-display-text question-highlight-eq text-3xl sm:text-5xl tracking-wider font-mono py-2 break-words"
              >
                {hasVisualHeaderLine ? questionLines[1] : activeQuestionText}
              </div>

              {showHint && (currentQ.hintEn || currentQ.hintUr) && (
                <div className="bg-amber-950/95 border border-amber-600/70 p-2.5 rounded-xl text-xs text-amber-200">
                  💡 <span className="font-bold">{t.common.hint}: </span>
                  {isUrdu ? currentQ.hintUr : currentQ.hintEn}
                </div>
              )}

              {isCurrentAnswered && (
                <div
                  className={`p-3 rounded-xl border text-xs sm:text-sm font-bold flex items-start gap-2 shadow-inner transition-all text-start ${
                    isCurrentCorrect
                      ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
                      : 'bg-red-950/90 border-red-500 text-red-200'
                  }`}
                >
                  {isCurrentCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-black">
                      {isCurrentCorrect
                        ? isUrdu
                          ? 'شاباش! بالکل درست جواب (+10 پوائنٹس)'
                          : 'Excellent! Correct Answer (+10 Points)'
                        : isUrdu
                        ? 'غلط جواب! درست حل ملاحظہ فرمائیں:'
                        : 'Incorrect! Correct Solution:'}
                    </div>
                    <div className="text-[11px] font-medium mt-0.5 text-amber-100/90">
                      {isUrdu ? currentQ.explanationUr : currentQ.explanationEn}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-1" dir="ltr">
            {(isUrdu && currentQ.optionsUr ? currentQ.optionsUr : currentQ.optionsEn || []).map(
              (opt, idx) => {
                const isSelected = currentAnswer === opt;
                const isOptionCorrect = checkAnswer(currentQ, opt);

                let tileClass = 'wood-tile-3d';
                if (isCurrentAnswered) {
                  if (isOptionCorrect) {
                    tileClass += ' wood-tile-correct';
                  } else if (isSelected) {
                    tileClass += ' wood-tile-wrong';
                  } else {
                    tileClass += ' opacity-50 cursor-not-allowed';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isCurrentAnswered}
                    onClick={() => handleSelectAnswer(opt)}
                    className={`${tileClass} min-h-[68px] sm:min-h-[82px] px-2 text-lg sm:text-2xl font-black flex items-center justify-center font-mono`}
                  >
                    <span>{opt}</span>
                  </button>
                );
              }
            )}
          </div>
        </div>
      )}

      {/* VICTORY & 20-QUESTION RESULTS SCREEN */}
      {gameOver && !showReview && (
        <div className="flex-1 flex flex-col justify-center items-center py-4">
          <div className="wood-board-3d p-6 sm:p-8 w-full text-center space-y-4 shadow-2xl relative">
            <div className="brass-rivet top-3 left-3" />
            <div className="brass-rivet top-3 right-3" />
            <div className="brass-rivet bottom-3 left-3" />
            <div className="brass-rivet bottom-3 right-3" />

            <div
              className={`inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-black shadow-inner ${
                isPassed
                  ? 'bg-emerald-950/90 border border-emerald-500 text-emerald-300'
                  : 'bg-red-950/90 border border-red-500 text-red-300'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isPassed
                  ? isUrdu
                    ? `لیول ${selectedLevel} مکمل ہو گیا! (کامیاب)`
                    : `LEVEL ${selectedLevel} COMPLETED! (PASSED)`
                  : isUrdu
                  ? `لیول ${selectedLevel} نتیجہ (کامیابی کے لیے 70% درکار ہیں)`
                  : `LEVEL ${selectedLevel} RESULT (NEED 70% TO PASS)`}
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 py-1">
              {[1, 2, 3].map((starIdx) => {
                const hasStar = starIdx <= starsEarned;
                return (
                  <div
                    key={starIdx}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center border-2 shadow-lg transition-transform ${
                      hasStar
                        ? 'bg-gradient-to-b from-amber-300 to-amber-600 border-yellow-200 text-amber-950 scale-105'
                        : 'bg-amber-950/60 border-amber-800 text-amber-800'
                    }`}
                  >
                    <Star
                      className={`w-8 h-8 sm:w-10 sm:h-10 ${
                        hasStar ? 'fill-amber-400 text-amber-800' : 'text-amber-800/40'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            <div className="wood-board-inner p-4 space-y-2 text-xs sm:text-sm text-amber-200">
              <div className="flex items-center justify-between border-b border-amber-800/60 pb-1.5">
                <span>{isUrdu ? 'کل سوالات:' : 'Total Questions:'}</span>
                <span className="font-black text-amber-100">{totalQuestionsCount}</span>
              </div>
              <div className="flex items-center justify-between border-b border-amber-800/60 pb-1.5">
                <span>{isUrdu ? 'درست جوابات:' : 'Correct Answers:'}</span>
                <span className="font-black text-emerald-400" dir="ltr">
                  {finalCorrect} / {totalQuestionsCount}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-amber-800/60 pb-1.5">
                <span>{isUrdu ? 'غلط جوابات:' : 'Wrong Answers:'}</span>
                <span className="font-black text-red-400" dir="ltr">
                  {totalQuestionsCount - finalCorrect} / {totalQuestionsCount}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-amber-800/60 pb-1.5">
                <span>{t.common.accuracy}:</span>
                <span className={`font-black ${isPassed ? 'text-emerald-300' : 'text-red-300'}`}>
                  {finalAccuracy}% ({isPassed ? (isUrdu ? 'کامیاب' : 'Passed') : (isUrdu ? 'دوبارہ کوشش کریں' : 'Try Again')})
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-amber-800/60 pb-1.5">
                <span>{isUrdu ? 'حاصل کردہ پوائنٹس:' : 'Total Points Earned:'}</span>
                <span className="font-black text-amber-300">+{finalPointsEarned} {t.common.points}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{isUrdu ? 'صرف شدہ وقت:' : 'Time Taken:'}</span>
                <span className="font-mono font-bold text-amber-100" dir="ltr">
                  {formatTime(elapsedSeconds)}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    initLevel();
                  }}
                  className="wood-btn-3d py-2.5 flex items-center justify-center gap-1 text-xs font-black"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.common.playAgain}</span>
                </button>

                {isPassed && selectedLevel < 10 ? (
                  <button
                    onClick={() => {
                      sound.playClick();
                      setSelectedLevel(selectedLevel + 1);
                    }}
                    className="gold-btn-3d py-2.5 flex items-center justify-center gap-1 text-xs font-black"
                  >
                    <span>{isUrdu ? 'اگلا لیول' : 'Next Level'}</span>
                    <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      sound.playClick();
                      onBack();
                    }}
                    className="gold-btn-3d py-2.5 flex items-center justify-center gap-1 text-xs font-black"
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'لیولز مینو' : 'Level Select'}</span>
                  </button>
                )}
              </div>

              {wrongQuestions.length > 0 && (
                <button
                  onClick={() => {
                    sound.playClick();
                    setShowReview(true);
                  }}
                  className="wood-btn-3d w-full py-2.5 flex items-center justify-center gap-2 text-xs font-black text-amber-300 border-amber-500/50"
                >
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>
                    {t.common.reviewWrong} ({wrongQuestions.length})
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REVIEW WRONG ANSWERS SCREEN */}
      {gameOver && showReview && (
        <div className="flex-1 flex flex-col py-2">
          <div className="wood-board-3d p-4 sm:p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-amber-800 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-base text-amber-100">
                  {isUrdu ? 'غلط سوالات کا تفصیلی جائزہ' : 'Review Incorrect Questions'}
                </h3>
              </div>
              <button
                onClick={() => setShowReview(false)}
                className="wood-btn-3d p-1.5 rounded-lg text-amber-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {wrongQuestions.map((item, i) => (
                <div key={i} className="wood-board-inner p-3.5 space-y-2 text-xs">
                  <div className="font-bold text-amber-300">
                    {t.common.question} {item.questionNumber}:
                  </div>
                  <div className="text-sm font-black text-amber-100 font-mono" dir="ltr">
                    {isUrdu ? item.question.questionUr : item.question.questionEn}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-bold">
                    <div className="p-2 rounded-lg bg-red-950/80 border border-red-700/60 text-red-200 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <span>
                        {isUrdu ? 'آپ کا جواب:' : 'You Picked:'}{' '}
                        <span dir="ltr">{item.studentAnswer}</span>
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-700/60 text-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>
                        {isUrdu ? 'درست جواب:' : 'Correct:'}{' '}
                        <span dir="ltr">
                          {isUrdu ? item.question.correctAnswerUr : item.question.correctAnswerEn}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-950/60 border border-amber-800 text-[11px] text-amber-200 leading-relaxed">
                    <span className="font-bold text-amber-300">{t.common.explanation}: </span>
                    {isUrdu ? item.question.explanationUr : item.question.explanationEn}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowReview(false)}
              className="gold-btn-3d w-full py-2.5 text-xs font-black"
            >
              {isUrdu ? 'نتائج پر واپس جائیں' : 'Back to Results Summary'}
            </button>
          </div>
        </div>
      )}

      {/* BOTTOM BAR */}
      {!gameOver && (
        <div className="wood-panel-3d px-3 py-2.5 flex items-center justify-between shadow-2xl mt-2 gap-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`wood-btn-3d px-2.5 py-1.5 flex items-center gap-1 text-xs font-bold ${
              currentIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-180" />
            <span className="hidden sm:inline">{t.common.previous}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setShowHint((h) => !h);
            }}
            className="wood-btn-3d px-2.5 py-1.5 flex items-center gap-1 text-xs font-bold"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
            <span>{isUrdu ? 'اشارہ' : 'Hint'}</span>
          </button>

          <div className="flex items-center gap-1 max-w-[160px] sm:max-w-[220px] overflow-x-auto py-1 px-1" dir="ltr">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const ans = selectedAnswers[idx];
              const isAnswered = ans !== undefined;
              const isCorrect = isAnswered ? checkAnswer(q, ans) : false;

              let dotClass = 'bg-amber-950/80 border-amber-800';
              if (isCurrent) {
                dotClass = 'bg-amber-300 border-amber-100 scale-125';
              } else if (isAnswered) {
                dotClass = isCorrect ? 'bg-emerald-500 border-emerald-300' : 'bg-red-500 border-red-300';
              }

              return (
                <button
                  key={idx}
                  onClick={() => {
                    sound.playClick();
                    setCurrentIndex(idx);
                    setShowHint(false);
                  }}
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border shadow-inner transition-all flex-shrink-0 cursor-pointer ${dotClass}`}
                  title={`${t.common.question} ${idx + 1}`}
                />
              );
            })}
          </div>

          <button
            onClick={handleNext}
            className="gold-btn-3d px-3 py-1.5 flex items-center gap-1 text-xs font-black cursor-pointer"
          >
            <span className="hidden sm:inline">
              {currentIndex + 1 < questions.length
                ? t.common.next
                : isUrdu
                ? 'مکمل کریں'
                : 'Finish'}
            </span>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>

          <button
            onClick={() => {
              sound.playClick();
              initLevel();
            }}
            className="wood-btn-3d p-1.5 rounded-xl text-amber-200"
            title={isUrdu ? 'دوبارہ شروع کریں' : 'Restart Level'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
