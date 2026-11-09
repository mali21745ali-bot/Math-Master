import React from 'react';
import { useApp } from '../../context/AppContext';
import { classesList } from '../../data/classesData';
import { classLevelsConfig } from '../../data/levelsData';
import { sound } from '../../services/sound';
import {
  Plus,
  Minus,
  X,
  Divide,
  Sparkles,
  Grid,
  Trophy,
  Flame,
  Star,
  Play,
  ArrowRight,
  GraduationCap,
  CalendarDays,
  Award,
  Zap,
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const {
    profile,
    t,
    setActiveView,
    setSelectedClass,
    setSelectedGameMode,
    selectedClass,
  } = useApp();

  const currentClassDef = classesList.find((c) => c.id === selectedClass) || classesList[3];
  const classProg = profile.classProgress[selectedClass] || { unlockedLevel: 1, stars: {}, highScores: {} };

  const handleLaunchGame = (mode: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed') => {
    sound.playClick();
    setSelectedGameMode(mode);
    switch (mode) {
      case 'addition':
        setActiveView('addition_game');
        break;
      case 'subtraction':
        setActiveView('subtraction_game');
        break;
      case 'multiplication':
        setActiveView('multiplication_game');
        break;
      case 'division':
        setActiveView('division_game');
        break;
      case 'mixed':
        setActiveView('math_mix_game');
        break;
    }
  };

  const primaryGames = [
    {
      id: 'addition' as const,
      symbol: '+',
      titleEn: 'Addition Game',
      titleUr: 'جمع کا کھیل',
      descEn: 'Single to multi-digit addition & carries',
      descUr: 'ایک اور دو ہندسی جمع اور حاصل والے سوالات',
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: 'subtraction' as const,
      symbol: '−',
      titleEn: 'Subtraction Game',
      titleUr: 'تفریق کا کھیل',
      descEn: 'Borrowing, large numbers & negative math',
      descUr: 'ادھار لینے اور منفی اعداد کی تفریق',
      color: 'from-orange-500 to-amber-700',
    },
    {
      id: 'multiplication' as const,
      symbol: '×',
      titleEn: 'Multiplication Game',
      titleUr: 'ضرب کا کھیل',
      descEn: 'Times tables sprint & algebraic factors',
      descUr: 'پہاڑوں کی مشق اور الجبرائی ضرب',
      color: 'from-emerald-600 to-teal-700',
    },
    {
      id: 'division' as const,
      symbol: '÷',
      titleEn: 'Division Game',
      titleUr: 'تقسیم کا کھیل',
      descEn: 'Quotients, remainders & clean fractions',
      descUr: 'خارج قسمت اور کسر کی تقسیم',
      color: 'from-blue-600 to-indigo-700',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 select-none">
      {/* 3D Wooden Hero Banner */}
      <div className="wood-board-3d p-5 sm:p-7 relative shadow-2xl overflow-hidden">
        <div className="absolute top-2.5 left-2.5 brass-rivet" />
        <div className="absolute top-2.5 right-2.5 brass-rivet" />
        <div className="absolute bottom-2.5 left-2.5 brass-rivet" />
        <div className="absolute bottom-2.5 right-2.5 brass-rivet" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-start">
          <div className="flex items-center gap-4">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-600 flex items-center justify-center text-4xl shadow-md border-2 border-amber-300">
              {profile.avatar}
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/30 border border-amber-500/50 text-[11px] font-bold text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.tagline}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-amber-100 drop-shadow-md">
                {profile.name}
              </h1>
              <p className="text-xs sm:text-sm text-amber-200/90 font-bold">
                {t.classes[selectedClass]?.title} • Level {classProg.unlockedLevel}/10 Unlocked
              </p>
            </div>
          </div>

          {/* Quick Stats Plaque */}
          <div className="flex items-center gap-2">
            <div className="wood-panel-3d p-3 min-w-[90px] text-center border border-amber-800">
              <div className="text-[10px] uppercase font-bold text-amber-300">Total Points</div>
              <div className="text-xl font-black text-yellow-300 mt-0.5">{profile.points}</div>
            </div>

            <div className="wood-panel-3d p-3 min-w-[90px] text-center border border-amber-800">
              <div className="text-[10px] uppercase font-bold text-amber-300">Streak</div>
              <div className="text-xl font-black text-orange-400 mt-0.5 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-orange-400" />
                <span>{profile.streakDays}d</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Special Game: MATH MIX CHALLENGE Hero Card */}
      <div
        onClick={() => handleLaunchGame('mixed')}
        className="wood-board-3d p-5 sm:p-6 cursor-pointer hover:brightness-105 transition-all group relative overflow-hidden shadow-xl"
      >
        <div className="absolute top-2.5 left-2.5 brass-rivet" />
        <div className="absolute top-2.5 right-2.5 brass-rivet" />
        <div className="absolute bottom-2.5 left-2.5 brass-rivet" />
        <div className="absolute bottom-2.5 right-2.5 brass-rivet" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-start">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Zap className="w-8 h-8 text-yellow-200 fill-yellow-300" />
            </div>

            <div>
              <span className="gold-badge text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                Featured Game Mode
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-amber-100 drop-shadow-md mt-1">
                MATH MIX CHALLENGE
              </h2>
              <p className="text-xs sm:text-sm text-amber-200/90 max-w-md">
                Fast-paced mixture of Addition, Subtraction, Multiplication, and Division before the timer expires!
              </p>
            </div>
          </div>

          <button className="green-btn-3d px-5 py-3 rounded-2xl text-sm font-black flex items-center gap-2 cursor-pointer shadow-lg whitespace-nowrap">
            <Play className="w-4 h-4 fill-white" />
            <span>Play Challenge</span>
          </button>
        </div>
      </div>

      {/* 4 Core Mathematical Operation Games Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-lg sm:text-xl font-black text-amber-100 drop-shadow-md">
            Mathematical Operation Games
          </h2>
          <button
            onClick={() => {
              sound.playClick();
              setActiveView('level_select');
            }}
            className="text-xs font-black text-yellow-300 hover:text-white drop-shadow-xs flex items-center gap-1 cursor-pointer"
          >
            <span>View All 10 Levels</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {primaryGames.map((game) => (
            <div
              key={game.id}
              onClick={() => handleLaunchGame(game.id)}
              className="wood-board-3d p-5 cursor-pointer hover:brightness-105 transition-all group flex items-center justify-between shadow-lg"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl wood-tile-3d flex items-center justify-center text-3xl font-black group-hover:scale-105 transition-transform">
                  <span className="math-symbol">{game.symbol}</span>
                </div>

                <div>
                  <h3 className="font-black text-base sm:text-lg text-amber-100 drop-shadow-sm">
                    {profile.language === 'ur' ? game.titleUr : game.titleEn}
                  </h3>
                  <p className="text-xs text-amber-200/80 line-clamp-1">
                    {profile.language === 'ur' ? game.descUr : game.descEn}
                  </p>
                  <span className="text-[10px] font-bold text-amber-300/80">
                    Levels 1 to 10
                  </span>
                </div>
              </div>

              <div className="gold-btn-3d w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 fill-amber-950 text-amber-950" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Number Sliding Puzzle Card */}
      <div
        onClick={() => {
          sound.playClick();
          setActiveView('puzzle');
        }}
        className="wood-board-3d p-5 sm:p-6 cursor-pointer hover:brightness-105 transition-all group shadow-xl"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl wood-tile-3d flex items-center justify-center text-2xl font-black group-hover:scale-105 transition-transform">
              <Grid className="w-7 h-7 text-white" />
            </div>

            <div>
              <span className="gold-badge text-[10px] px-2 py-0.5 rounded-full">
                Classic 3D Logic Game
              </span>
              <h3 className="text-lg sm:text-xl font-black text-amber-100 drop-shadow-md mt-0.5">
                3D Wooden Sliding Puzzle
              </h3>
              <p className="text-xs text-amber-200/80">
                Slide wooden tiles into ascending order on 3×3, 4×4, and 5×5 boards.
              </p>
            </div>
          </div>

          <button className="wood-btn-3d px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 cursor-pointer shadow-md">
            <span>Play Puzzle</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </div>

      {/* Class Level Map & Quick Progression Strip */}
      <div className="wood-board-3d p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-base text-amber-100 drop-shadow-sm flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-amber-400" />
              Class Progression: {t.classes[selectedClass]?.title}
            </h3>
            <p className="text-xs text-amber-300/80">
              Unlock Levels 1 through 10 to conquer this class.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setActiveView('select_class');
            }}
            className="wood-btn-3d px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
          >
            Change Class
          </button>
        </div>

        {/* 10 Level Nodes */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 pt-1">
          {classLevelsConfig.map((lvl) => {
            const isUnlocked = lvl.level <= classProg.unlockedLevel;
            const stars = classProg.stars[lvl.level] || 0;
            return (
              <button
                key={lvl.level}
                onClick={() => {
                  if (isUnlocked) {
                    sound.playClick();
                    setActiveView('level_select');
                  }
                }}
                disabled={!isUnlocked}
                className={`p-2 rounded-xl text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isUnlocked
                    ? 'wood-tile-3d hover:scale-105'
                    : 'bg-black/40 border border-amber-950 opacity-50 cursor-not-allowed'
                }`}
              >
                <span className="text-xs font-black">{lvl.level}</span>
                <div className="flex items-center gap-0.5 mt-0.5">
                  <Star
                    className={`w-2.5 h-2.5 ${stars > 0 ? 'fill-yellow-400 text-yellow-300' : 'text-amber-950'}`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
