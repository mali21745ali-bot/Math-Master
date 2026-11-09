import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { QuestionGenerator } from '../../services/questionGenerator';
import { QuizQuestion } from '../../types';
import { sound } from '../../services/sound';
import {
  CalendarDays,
  Flame,
  CheckCircle2,
  Trophy,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Gift,
  Coins,
} from 'lucide-react';

export const DailyChallenge: React.FC = () => {
  const {
    profile,
    t,
    recordDailyChallengeCompleted,
    triggerConfetti,
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const isCompletedToday = profile.dailyChallengeCompletedDates.includes(todayStr);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [checkedStatus, setCheckedStatus] = useState<Record<number, boolean>>({});
  const [allFinished, setAllFinished] = useState(false);

  useEffect(() => {
    const list = QuestionGenerator.generateQuestions(profile.classLevel, 'medium', 5);
    setQuestions(list);
    setCurrentIndex(0);
    setUserAnswers({});
    setCheckedStatus({});
    setAllFinished(false);
  }, [profile.classLevel]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (opt: string) => {
    if (checkedStatus[currentIndex] || isCompletedToday) return;
    sound.playClick();
    setUserAnswers((prev) => ({ ...prev, [currentIndex]: opt }));
  };

  const checkAnswer = (userAns: string, q: QuizQuestion): boolean => {
    if (!userAns || !q) return false;
    const cleanUser = userAns.trim().toLowerCase();
    const cleanEn = q.correctAnswerEn.trim().toLowerCase();
    const cleanUr = q.correctAnswerUr.trim().toLowerCase();
    return cleanUser === cleanEn || cleanUser === cleanUr;
  };

  const handleCheck = () => {
    if (!userAnswers[currentIndex]) return;
    const isCorrect = checkAnswer(userAnswers[currentIndex], currentQ);
    if (isCorrect) sound.playCorrect();
    else sound.playWrong();
    setCheckedStatus((prev) => ({ ...prev, [currentIndex]: true }));
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishDaily();
    }
  };

  const finishDaily = () => {
    setAllFinished(true);
    if (!isCompletedToday) {
      recordDailyChallengeCompleted();
    } else {
      sound.playVictory();
      triggerConfetti();
    }
  };

  const options = profile.language === 'ur'
    ? currentQ?.optionsUr || currentQ?.optionsEn || []
    : currentQ?.optionsEn || [];

  return (
    <div className="max-w-md mx-auto space-y-4 pb-12 select-none">
      {/* 3D Wooden Daily Banner */}
      <div className="wood-board-3d p-5 sm:p-6 shadow-2xl relative">
        <div className="absolute top-2 left-2 brass-rivet" />
        <div className="absolute top-2 right-2 brass-rivet" />
        <div className="absolute bottom-2 left-2 brass-rivet" />
        <div className="absolute bottom-2 right-2 brass-rivet" />

        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/30 text-amber-300 text-xs font-bold mb-1">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Today's Challenge</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-amber-100 drop-shadow-md">
              {t.sections.dailyChallengeTitle}
            </h1>
            <p className="text-xs text-amber-200/90 mt-0.5">
              5 Daily math questions to earn +100 points!
            </p>
          </div>

          <div className="wood-panel-3d p-2.5 text-center min-w-[76px] border border-amber-800">
            <Flame className="w-5 h-5 text-orange-400 mx-auto fill-orange-400 animate-pulse" />
            <div className="text-sm font-black text-amber-200 mt-0.5">{profile.streakDays}d</div>
            <div className="text-[9px] uppercase font-bold text-amber-300">Streak</div>
          </div>
        </div>
      </div>

      {/* Completed State */}
      {isCompletedToday || allFinished ? (
        <div className="wood-board-3d p-6 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-lg border-2 border-yellow-200">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-amber-100 drop-shadow-md">
              Daily Challenge Complete!
            </h2>
            <p className="text-xs text-amber-300 mt-0.5">
              +100 Bonus points awarded! Streak maintained at {profile.streakDays} days.
            </p>
          </div>

          <div className="wood-board-inner p-3.5 border border-amber-800 flex items-center justify-center gap-2 text-yellow-300 font-bold text-xs">
            <Gift className="w-4 h-4 text-amber-400" />
            <span>Come back tomorrow for new math problems!</span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              const list = QuestionGenerator.generateQuestions(profile.classLevel, 'medium', 5);
              setQuestions(list);
              setCurrentIndex(0);
              setUserAnswers({});
              setCheckedStatus({});
              setAllFinished(false);
            }}
            className="green-btn-3d w-full py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Another Set</span>
          </button>
        </div>
      ) : (
        /* Daily Challenge Question Screen */
        currentQ && (
          <div className="space-y-4">
            <div className="wood-board-3d p-4 sm:p-6 text-center relative shadow-2xl">
              <div className="wood-board-inner p-5 sm:p-7 min-h-[140px] flex flex-col items-center justify-center">
                <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider mb-1">
                  Daily Problem #{currentIndex + 1} of {questions.length}
                </span>

                {currentQ.visualEmoji && currentQ.visualCount && (
                  <div className="text-2xl sm:text-3xl mb-2 tracking-widest animate-pulse">
                    {Array(currentQ.visualCount).fill(currentQ.visualEmoji).join(' ')}
                  </div>
                )}

                <div className="text-xl sm:text-2xl font-black text-amber-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] math-symbol leading-snug">
                  {profile.language === 'ur' ? currentQ.questionUr : currentQ.questionEn}
                </div>
              </div>
            </div>

            {/* Answer Tiles */}
            <div className="grid grid-cols-2 gap-3">
              {options.map((opt, idx) => {
                const isSelected = userAnswers[currentIndex] === opt;
                const isChecked = checkedStatus[currentIndex];
                const isCorrect = checkAnswer(opt, currentQ);

                let tileClass = 'wood-tile-3d';
                if (isChecked) {
                  if (isCorrect) tileClass = 'wood-tile-3d wood-tile-correct';
                  else if (isSelected) tileClass = 'wood-tile-3d wood-tile-wrong';
                } else if (isSelected) {
                  tileClass = 'wood-tile-3d wood-tile-pressed';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt)}
                    disabled={checkedStatus[currentIndex]}
                    className={`min-h-[70px] rounded-2xl text-lg sm:text-xl font-black flex items-center justify-center p-3 cursor-pointer shadow-lg active:scale-95 transition-all ${tileClass}`}
                  >
                    <span className="math-symbol drop-shadow-sm">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation on check */}
            {checkedStatus[currentIndex] && (
              <div className="wood-panel-3d p-3 text-amber-200 text-xs border border-amber-800 text-center">
                <strong>Solution: </strong>
                {profile.language === 'ur' ? currentQ.explanationUr : currentQ.explanationEn}
              </div>
            )}

            {/* Bottom Navigation */}
            <div className="wood-board-3d p-3 flex items-center justify-between gap-2 shadow-xl">
              <div>
                {!checkedStatus[currentIndex] && userAnswers[currentIndex] && (
                  <button
                    onClick={handleCheck}
                    className="green-btn-3d px-4 py-2 rounded-xl text-xs font-black cursor-pointer"
                  >
                    Check
                  </button>
                )}
              </div>

              <button
                onClick={handleNext}
                className="green-btn-3d px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>{currentIndex === questions.length - 1 ? 'Claim Reward' : t.common.next}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};
