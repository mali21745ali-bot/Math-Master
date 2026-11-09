import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { QuestionGenerator } from '../../services/questionGenerator';
import { QuizQuestion } from '../../types';
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
  Flame,
  Award,
} from 'lucide-react';

interface MathGameScreenProps {
  operation: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed';
  onBack: () => void;
}

export const MathGameScreen: React.FC<MathGameScreenProps> = ({ operation, onBack }) => {
  const {
    profile,
    selectedClass,
    selectedLevel,
    setSelectedLevel,
    unlockNextLevel,
    addPoints,
    isUrdu,
    t,
    triggerConfetti,
  } = useApp();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answersHistory, setAnswersHistory] = useState<boolean[]>([]);
  const [gameOver, setGameOver] = useState(false);

  // Level configuration
  const currentLevelConfig = levelsData.find((l) => l.level === selectedLevel) || levelsData[0];
  const [timeLeft, setTimeLeft] = useState(currentLevelConfig.timeLimitSec);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize or restart level
  const initLevel = useCallback(() => {
    const list = QuestionGenerator.generateArithmeticQuestions(
      operation,
      selectedClass,
      selectedLevel,
      5
    );
    setQuestions(list);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setShowHint(false);
    setScore(0);
    setCorrectCount(0);
    setAnswersHistory([]);
    setGameOver(false);
    setTimeLeft(currentLevelConfig.timeLimitSec);
  }, [operation, selectedClass, selectedLevel, currentLevelConfig.timeLimitSec]);

  useEffect(() => {
    initLevel();
  }, [initLevel]);

  // Timer countdown
  useEffect(() => {
    if (gameOver || isAnswered) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameOver, isAnswered, currentIndex]);

  const handleTimeExpired = () => {
    sound.playIncorrect();
    setIsAnswered(true);
    setIsCorrect(false);
    setSelectedOption('__TIMEOUT__');
    setAnswersHistory((prev) => [...prev, false]);
  };

  const currentQ = questions[currentIndex];

  const handleSelectAnswer = (option: string) => {
    if (isAnswered || gameOver || !currentQ) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const correct =
      option === currentQ.correctAnswerEn ||
      option === currentQ.correctAnswerUr ||
      option.trim() === currentQ.correctAnswerEn.trim();

    setIsCorrect(correct);

    if (correct) {
      sound.playCorrect();
      setScore((s) => s + 20);
      setCorrectCount((c) => c + 1);
      setAnswersHistory((prev) => [...prev, true]);
    } else {
      sound.playIncorrect();
      setAnswersHistory((prev) => [...prev, false]);
    }
  };

  const handleNextQuestion = () => {
    sound.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setShowHint(false);
      setTimeLeft(currentLevelConfig.timeLimitSec);
    } else {
      // Completed all 5 questions
      finishGame();
    }
  };

  const finishGame = () => {
    setGameOver(true);
    const finalCorrect = correctCount + (isCorrect ? 1 : 0);
    let starsEarned = 1;
    if (finalCorrect >= 5) starsEarned = 3;
    else if (finalCorrect >= 3) starsEarned = 2;

    const roundPoints = finalCorrect * 20 + starsEarned * 15;
    addPoints(roundPoints);
    unlockNextLevel(selectedClass, selectedLevel, starsEarned, score);

    sound.playVictory();
    triggerConfetti();
  };

  // Operation symbols and headings
  const opMeta = {
    addition: { symbol: '+', titleEn: 'Addition Board', titleUr: 'جمع کا بورڈ' },
    subtraction: { symbol: '−', titleEn: 'Subtraction Board', titleUr: 'تفریق کا بورڈ' },
    multiplication: { symbol: '×', titleEn: 'Multiplication Board', titleUr: 'ضرب کا بورڈ' },
    division: { symbol: '÷', titleEn: 'Division Board', titleUr: 'تقسیم کا بورڈ' },
    mixed: { symbol: '⚡', titleEn: 'Math Mix Challenge', titleUr: 'ریاضی مکس چیلنج' },
  }[operation];

  const classTitle = t.classes[selectedClass]?.title || selectedClass;

  return (
    <div className="max-w-md sm:max-w-lg mx-auto flex flex-col min-h-[85vh] justify-between pb-6 select-none">
      {/* ========================================================
          TOP BAR: EXIT, LEVEL, TIMER, POINTS
         ======================================================== */}
      <div className="wood-header-bar px-3 py-2.5 rounded-2xl flex items-center justify-between shadow-xl mb-4">
        {/* Back Button */}
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="wood-btn-3d px-3 py-1.5 flex items-center gap-1 text-xs font-black cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span className="hidden sm:inline">Exit</span>
        </button>

        {/* Level Indicator Plaque */}
        <div className="flex flex-col items-center">
          <div className="text-[10px] text-amber-200/80 font-bold uppercase tracking-wider">
            {classTitle}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm sm:text-base font-black text-amber-100 tracking-wide drop-shadow-sm">
              LEVEL {selectedLevel}
            </span>
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
          </div>
        </div>

        {/* Timer Plaque */}
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border border-amber-600/60 shadow-inner font-mono font-black text-xs ${
            timeLeft <= 10
              ? 'bg-red-900/80 text-red-200 animate-pulse border-red-500'
              : 'bg-amber-950/80 text-amber-200'
          }`}
        >
          <Timer className="w-3.5 h-3.5" />
          <span>{timeLeft}s</span>
        </div>

        {/* Points Badge */}
        <div className="gold-badge px-3 py-1 flex items-center gap-1 text-xs">
          <Coins className="w-3.5 h-3.5 text-amber-950" />
          <span>{profile.points + score}</span>
        </div>
      </div>

      {/* ========================================================
          MIDDLE: 3D WOODEN QUESTION BOARD & 4 ANSWER TILES
         ======================================================== */}
      {currentQ && !gameOver && (
        <div className="flex-1 flex flex-col justify-center space-y-4">
          {/* Main Question Board */}
          <div className="wood-board-3d p-5 sm:p-7 relative overflow-hidden shadow-2xl">
            {/* 4 Corner Brass Rivets */}
            <div className="brass-rivet top-2 left-2" />
            <div className="brass-rivet top-2 right-2" />
            <div className="brass-rivet bottom-2 left-2" />
            <div className="brass-rivet bottom-2 right-2" />

            {/* Board Inner Carved Tray */}
            <div className="wood-board-inner p-4 sm:p-6 text-center space-y-3 relative">
              {/* Category & Topic Chip */}
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-700/50 text-[11px] font-bold text-amber-300 shadow-inner">
                <span>{opMeta.symbol}</span>
                <span>{isUrdu ? opMeta.titleUr : opMeta.titleEn}</span>
              </div>

              {/* Visual picture for Nursery/KG if present */}
              {currentQ.visualEmoji && (
                <div className="text-2xl sm:text-3xl tracking-widest py-1 drop-shadow-md select-none animate-subtle">
                  {currentQ.questionEn.split('\n')[0]}
                </div>
              )}

              {/* Main Mathematical Expression */}
              <div className="text-2xl sm:text-4xl font-black text-amber-100 tracking-wider font-mono drop-shadow-md py-2">
                {currentQ.visualEmoji
                  ? currentQ.questionEn.split('\n')[1] || currentQ.questionEn
                  : isUrdu
                  ? currentQ.questionUr
                  : currentQ.questionEn}
              </div>

              {/* Hint Drawer */}
              {showHint && (currentQ.hintEn || currentQ.hintUr) && (
                <div className="bg-amber-950/90 border border-amber-600/70 p-2.5 rounded-xl text-xs text-amber-200 animate-fadeIn">
                  💡 <span className="font-bold">Hint: </span>
                  {isUrdu ? currentQ.hintUr : currentQ.hintEn}
                </div>
              )}

              {/* Explanation Reveal upon Answer */}
              {isAnswered && (
                <div
                  className={`p-3 rounded-xl border text-xs sm:text-sm font-bold flex items-start gap-2 shadow-inner transition-all ${
                    isCorrect
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-red-950/80 border-red-500 text-red-200'
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-black">
                      {isCorrect
                        ? isUrdu
                          ? 'شاباش! بالکل درست جواب'
                          : 'Excellent! Correct Answer (+20 Pts)'
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

          {/* 4 Large 3D Wooden Answer Tiles */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-1">
            {(isUrdu && currentQ.optionsUr ? currentQ.optionsUr : currentQ.optionsEn || []).map(
              (opt, idx) => {
                const isSelected = selectedOption === opt;
                const isAnswerCorrect =
                  opt === currentQ.correctAnswerEn ||
                  opt === currentQ.correctAnswerUr ||
                  opt.trim() === currentQ.correctAnswerEn.trim();

                let tileClass = 'wood-tile-3d';
                if (isAnswered) {
                  if (isAnswerCorrect) {
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
                    disabled={isAnswered}
                    onClick={() => handleSelectAnswer(opt)}
                    className={`${tileClass} h-18 sm:h-22 text-xl sm:text-3xl font-black flex items-center justify-center font-mono`}
                  >
                    <span>{opt}</span>
                  </button>
                );
              }
            )}
          </div>

          {/* Next Button when Answered */}
          {isAnswered && (
            <button
              onClick={handleNextQuestion}
              className="gold-btn-3d w-full py-3.5 flex items-center justify-center gap-2 text-sm sm:text-base font-black shadow-2xl cursor-pointer mt-2"
            >
              <span>{currentIndex + 1 < questions.length ? 'Next Question' : 'Claim Rewards'}</span>
              <ChevronRight className="w-5 h-5 rtl:rotate-180" />
            </button>
          )}
        </div>
      )}

      {/* ========================================================
          VICTORY / LEVEL COMPLETE DIALOG
         ======================================================== */}
      {gameOver && (
        <div className="flex-1 flex flex-col justify-center items-center py-6">
          <div className="wood-board-3d p-6 sm:p-8 w-full text-center space-y-5 shadow-2xl relative">
            <div className="brass-rivet top-3 left-3" />
            <div className="brass-rivet top-3 right-3" />
            <div className="brass-rivet bottom-3 left-3" />
            <div className="brass-rivet bottom-3 right-3" />

            <div className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-600/60 text-amber-300 font-black text-xs shadow-inner">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>LEVEL {selectedLevel} COMPLETED!</span>
            </div>

            {/* Stars Celebration */}
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3].map((starIdx) => {
                const hasStar =
                  starIdx <= (correctCount >= 5 ? 3 : correctCount >= 3 ? 2 : 1);
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

            {/* Score & Accuracy plaque */}
            <div className="wood-board-inner p-4 space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm text-amber-200">
                <span>Correct Answers:</span>
                <span className="font-black text-amber-100">{correctCount} / 5</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm text-amber-200">
                <span>Score Earned:</span>
                <span className="font-black text-amber-300">+{score} Pts</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm text-amber-200">
                <span>Status:</span>
                <span className="font-black text-emerald-400">
                  {selectedLevel < 10 ? `Level ${selectedLevel + 1} Unlocked!` : 'All 10 Levels Mastered!'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => initLevel()}
                className="wood-btn-3d py-3 flex items-center justify-center gap-1.5 text-xs font-black"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>

              {selectedLevel < 10 ? (
                <button
                  onClick={() => {
                    setSelectedLevel(selectedLevel + 1);
                    initLevel();
                  }}
                  className="gold-btn-3d py-3 flex items-center justify-center gap-1.5 text-xs font-black"
                >
                  <span>Next Level</span>
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              ) : (
                <button
                  onClick={onBack}
                  className="gold-btn-3d py-3 flex items-center justify-center gap-1.5 text-xs font-black"
                >
                  <Award className="w-4 h-4" />
                  <span>Level Select</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          BOTTOM BAR: HINT, 5 PROGRESS DOTS, RESTART, SCORE
         ======================================================== */}
      {!gameOver && (
        <div className="wood-panel-3d px-4 py-3 flex items-center justify-between shadow-xl mt-3">
          {/* Hint Button */}
          <button
            onClick={() => {
              sound.playClick();
              setShowHint((h) => !h);
            }}
            className="wood-btn-3d px-3 py-1.5 flex items-center gap-1 text-xs font-bold"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
            <span>Hint</span>
          </button>

          {/* 5 Progress Beads / Dots */}
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3, 4].map((idx) => {
              const isCurrent = idx === currentIndex;
              const hasAnswered = idx < answersHistory.length;
              const answeredCorrect = answersHistory[idx];

              return (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border shadow-inner transition-all ${
                    isCurrent
                      ? 'bg-amber-300 border-amber-100 scale-125 animate-subtle'
                      : hasAnswered
                      ? answeredCorrect
                        ? 'bg-emerald-500 border-emerald-300'
                        : 'bg-red-500 border-red-300'
                      : 'bg-amber-950/80 border-amber-800'
                  }`}
                />
              );
            })}
          </div>

          {/* Restart Button */}
          <button
            onClick={() => {
              sound.playClick();
              initLevel();
            }}
            className="wood-btn-3d px-3 py-1.5 flex items-center gap-1 text-xs font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>
        </div>
      )}
    </div>
  );
};
