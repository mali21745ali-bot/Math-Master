import React from 'react';
import { useApp } from '../../context/AppContext';
import { levelsData } from '../../data/levelsData';
import { GameMode, ClassLevel } from '../../types';
import { sound } from '../../services/sound';
import {
  ArrowLeft,
  Lock,
  Star,
  Play,
  GraduationCap,
  Sparkles,
  Zap,
  Plus,
  Minus,
  X,
  Divide,
  Trophy,
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
    { id: 'subtraction', labelEn: 'Subtraction (-)', labelUr: 'تفریق (-)', icon: <Minus className="w-4 h-4" /> },
    { id: 'multiplication', labelEn: 'Multiply (×)', labelUr: 'ضرب (×)', icon: <X className="w-4 h-4" /> },
    { id: 'division', labelEn: 'Divide (÷)', labelUr: 'تقسیم (÷)', icon: <Divide className="w-4 h-4" /> },
    { id: 'mixed', labelEn: 'Math Mix', labelUr: 'مکس چیلنج', icon: <Zap className="w-4 h-4" /> },
  ];

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
    <div className="max-w-3xl mx-auto space-y-6 pb-12 select-none">
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
              className="wood-btn-3d p-2 sm:px-3 sm:py-2 flex items-center gap-1 text-xs font-black"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <div>
              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
                <GraduationCap className="w-4 h-4" />
                <span>{classTitle}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-amber-100 tracking-wide drop-shadow-md">
                Class Level Campaign
              </h1>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setActiveView('select_class');
            }}
            className="gold-btn-3d px-4 py-2 text-xs font-black flex items-center justify-center gap-1.5 shadow-md self-start sm:self-auto"
          >
            <GraduationCap className="w-4 h-4 text-amber-950" />
            <span>Switch Class</span>
          </button>
        </div>
      </div>

      {/* Game Mode Selector Tabs */}
      <div className="wood-panel-3d p-2 sm:p-3 shadow-xl">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {gameModes.map((mode) => {
            const isSelected = selectedGameMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedGameMode(mode.id);
                }}
                className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs font-black transition-transform cursor-pointer ${
                  isSelected
                    ? 'gold-btn-3d text-amber-950 scale-102'
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
                    className={`w-10 h-10 rounded-xl font-black text-sm flex items-center justify-center border shadow-inner ${
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
                    <span className="inline-block px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-700/50 text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                      {lvl.difficulty}
                    </span>
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
                  {highScore > 0 && (
                    <>
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      <span>Best: {highScore} pts</span>
                    </>
                  )}
                </div>

                {isUnlocked ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLevelClick(lvl.level, true);
                    }}
                    className="gold-btn-3d px-3 py-1 text-xs font-black flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-amber-950" />
                    <span>Play</span>
                  </button>
                ) : (
                  <div className="text-[11px] text-amber-400/60 font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Locked</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress info banner */}
      <div className="wood-board-inner p-4 text-center text-xs text-amber-200/90 font-medium">
        🎯 Complete each level with at least 1 star to unlock the next progressive challenge. 10 levels available for all 15 class grades!
      </div>
    </div>
  );
};
