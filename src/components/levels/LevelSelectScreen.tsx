import React from 'react';
import { useApp } from '../../context/AppContext';
import { levelsData } from '../../data/levelsData';
import { GameMode } from '../../types';
import { sound } from '../../services/sound';
import {
  ArrowLeft,
  Lock,
  Star,
  Play,
  GraduationCap,
  Zap,
  Plus,
  Minus,
  X,
  Divide,
  Trophy,
  Search,
  ArrowRightLeft,
  PieChart,
  Brain,
  Target,
  Scale,
} from 'lucide-react';

interface LevelSelectScreenProps {
  onBack: () => void;
  onStartLevel: () => void;
}

export const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({
  onBack,
  onStartLevel,
}) => {
  const {
    profile,
    selectedClass,
    selectedGameMode,
    setSelectedGameMode,
    setSelectedLevel,
    setActiveView,
    t,
    isUrdu,
  } = useApp();

  const classProgress = profile.classProgress[selectedClass] || {
    unlockedLevel: 1,
    levelStars: {},
    levelHighScores: {},
  };

  const unlockedLevel = classProgress.unlockedLevel || 1;
  const classTitle = t.classes[selectedClass]?.title || selectedClass;

  const gameModes: { id: GameMode; labelEn: string; labelUr: string; icon: React.ReactNode }[] = [
    { id: 'addition', labelEn: 'Addition (+)', labelUr: 'جمع (+)', icon: <Plus className="w-4 h-4" /> },
    { id: 'subtraction', labelEn: 'Subtraction (−)', labelUr: 'تفریق (−)', icon: <Minus className="w-4 h-4" /> },
    { id: 'multiplication', labelEn: 'Multiply (×)', labelUr: 'ضرب (×)', icon: <X className="w-4 h-4" /> },
    { id: 'division', labelEn: 'Divide (÷)', labelUr: 'تقسیم (÷)', icon: <Divide className="w-4 h-4" /> },
    { id: 'mixed', labelEn: 'Mixed Math', labelUr: 'مکس چیلنج', icon: <Zap className="w-4 h-4" /> },
    { id: 'missing_number', labelEn: 'Missing Num', labelUr: 'گمشدہ عدد', icon: <Search className="w-4 h-4" /> },
    { id: 'sequence', labelEn: 'Sequence', labelUr: 'اعداد کی ترتیب', icon: <ArrowRightLeft className="w-4 h-4" /> },
    { id: 'times_tables', labelEn: 'Tables', labelUr: 'پہاڑے', icon: <Star className="w-4 h-4" /> },
    { id: 'fractions', labelEn: 'Fractions', labelUr: 'کسور', icon: <PieChart className="w-4 h-4" /> },
    { id: 'algebra', labelEn: 'Algebra (x)', labelUr: 'الجبرا (x)', icon: <Scale className="w-4 h-4" /> },
    { id: 'mental_math', labelEn: 'Mental Math', labelUr: 'ذہنی حساب', icon: <Brain className="w-4 h-4" /> },
    { id: 'quiz', labelEn: 'Math Quiz', labelUr: 'ریاضی کوئیز', icon: <Target className="w-4 h-4" /> },
  ];

  const diffLabels: Record<string, { en: string; ur: string }> = {
    easy: { en: 'Easy', ur: 'آسان' },
    normal: { en: 'Normal', ur: 'نارمل' },
    medium: { en: 'Medium', ur: 'درمیانہ' },
    hard: { en: 'Hard', ur: 'مشکل' },
    expert: { en: 'Expert', ur: 'ماہر' },
    challenge: { en: 'Challenge', ur: 'چیلنج' },
  };

  const handleLevelClick = (lvl: number, isUnlocked: boolean) => {
    if (!isUnlocked) {
      sound.playIncorrect();
      return;
    }
    sound.playClick();
    setSelectedLevel(lvl);
    onStartLevel();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-12 select-none">
      {/* Top Header Plaque */}
      <div className="wood-board-3d p-5 sm:p-6 shadow-2xl relative">
        <div className="brass-rivet top-2 left-2" />
        <div className="brass-rivet top-2 right-2" />
        <div className="brass-rivet bottom-2 left-2" />
        <div className="brass-rivet bottom-2 right-2" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                onBack();
              }}
              className="wood-btn-3d p-2 sm:px-3 sm:py-2 flex items-center gap-1 text-xs font-black cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span className="hidden sm:inline">{isUrdu ? 'واپس' : 'Back'}</span>
            </button>

            <div>
              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
                <GraduationCap className="w-4 h-4" />
                <span>{classTitle}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-amber-100 tracking-wide drop-shadow-md">
                {isUrdu ? '10 لیولز کا نصابی سفر' : '10-Level Curriculum Campaign'}
              </h1>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setActiveView('select_class');
            }}
            className="gold-btn-3d px-4 py-2 text-xs font-black flex items-center justify-center gap-1.5 shadow-md self-start sm:self-auto cursor-pointer"
          >
            <GraduationCap className="w-4 h-4 text-amber-950" />
            <span>{isUrdu ? 'کلاس تبدیل کریں' : 'Switch Class'}</span>
          </button>
        </div>
      </div>

      {/* Game Mode Selector Tabs (Scrollable across all 12 modes) */}
      <div className="wood-panel-3d p-2.5 shadow-xl">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {gameModes.map((mode) => {
            const isSelected = selectedGameMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedGameMode(mode.id);
                }}
                className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs font-black whitespace-nowrap transition-transform cursor-pointer ${
                  isSelected
                    ? 'gold-btn-3d text-amber-950 scale-102 shadow-md'
                    : 'wood-btn-3d text-amber-100 hover:brightness-105'
                }`}
              >
                {mode.icon}
                <span>{isUrdu ? mode.labelUr : mode.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 10 Progressive Levels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {levelsData.map((lvl) => {
          const isUnlocked = lvl.level <= unlockedLevel;
          const stars = classProgress.levelStars[lvl.level] || 0;
          const highScore = classProgress.levelHighScores[lvl.level] || 0;
          const diffInfo = diffLabels[lvl.difficulty] || { en: lvl.difficulty, ur: lvl.difficulty };

          return (
            <div
              key={lvl.level}
              onClick={() => handleLevelClick(lvl.level, isUnlocked)}
              className={`wood-panel-3d p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 relative overflow-hidden ${
                isUnlocked
                  ? 'cursor-pointer hover:brightness-108 hover:-translate-y-1 shadow-xl'
                  : 'opacity-65 grayscale-30 cursor-not-allowed'
              }`}
            >
              {/* Level header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-11 h-11 rounded-xl font-black text-sm flex items-center justify-center border shadow-inner ${
                      isUnlocked
                        ? 'bg-amber-400 border-yellow-200 text-amber-950 shadow-md'
                        : 'bg-amber-950/80 border-amber-800 text-amber-600'
                    }`}
                  >
                    {isUnlocked ? lvl.level : <Lock className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="font-black text-sm sm:text-base text-amber-100">
                      {isUrdu ? lvl.titleUr : lvl.titleEn}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-700/50 text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                        {isUrdu ? diffInfo.ur : diffInfo.en}
                      </span>
                      <span className="text-[11px] text-amber-200/90 font-medium">
                        {isUrdu ? '20 سوالات' : '20 Questions'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stars earned display */}
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= stars
                          ? 'fill-amber-400 text-amber-500 drop-shadow-sm'
                          : 'text-amber-950 fill-amber-950/40'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-amber-200/80 my-3 font-medium">
                {isUrdu ? lvl.descriptionUr : lvl.descriptionEn}
              </p>

              {/* Bottom footer: high score & action */}
              <div className="flex items-center justify-between pt-2 border-t border-amber-800/50 text-xs">
                <div className="text-[11px] text-amber-300 font-bold flex items-center gap-1">
                  {highScore > 0 ? (
                    <>
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      <span>
                        {isUrdu ? `بہترین اسکور: ${highScore}` : `Best Score: ${highScore} pts`}
                      </span>
                    </>
                  ) : (
                    <span className="text-amber-400/70">
                      {isUrdu ? 'پاس کرنے کے لیے 70% ضروری' : 'Score at least 70% to pass'}
                    </span>
                  )}
                </div>

                {isUnlocked ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLevelClick(lvl.level, true);
                    }}
                    className="gold-btn-3d px-3.5 py-1 text-xs font-black flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-amber-950" />
                    <span>{isUrdu ? 'کھیلیں' : 'Play Level'}</span>
                  </button>
                ) : (
                  <div className="text-[11px] text-amber-400/60 font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>{isUrdu ? 'مقفل' : 'Locked'}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress info banner */}
      <div className="wood-board-inner p-4 text-center text-xs text-amber-200/90 font-medium">
        {isUrdu
          ? '🎯 اگلا لیول کھولنے اور سنہری ستارے جیتنے کے لیے کم از کم 70% (20 میں سے 14) درست جوابات دیں!'
          : '🎯 Complete at least 70% (14 out of 20 questions) correctly to unlock the next progressive level and earn golden stars!'}
      </div>
    </div>
  );
};
