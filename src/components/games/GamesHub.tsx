import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { sound } from '../../services/sound';
import { GameRunner } from './GameRunner';
import {
  Gamepad2,
  Plus,
  Minus,
  X,
  Divide,
  ArrowRightLeft,
  Search,
  Grid,
  Zap,
  Brain,
  Shapes,
  PieChart,
  Scale,
  Sparkles,
  Compass,
  Star,
  Play,
  ArrowRight,
} from 'lucide-react';

export interface GameDefinition {
  id: string;
  titleKey: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  category: 'arithmetic' | 'logic' | 'speed' | 'geometry';
  difficultyOptions: ('easy' | 'medium' | 'hard' | 'expert')[];
  badge: string;
}

export const gamesRegistry: GameDefinition[] = [
  {
    id: 'addition',
    titleKey: 'addition',
    icon: Plus,
    gradient: 'from-pink-500 to-rose-500',
    category: 'arithmetic',
    difficultyOptions: ['easy', 'medium', 'hard', 'expert'],
    badge: 'Popular',
  },
  {
    id: 'subtraction',
    titleKey: 'subtraction',
    icon: Minus,
    gradient: 'from-orange-500 to-amber-500',
    category: 'arithmetic',
    difficultyOptions: ['easy', 'medium', 'hard', 'expert'],
    badge: 'Classic',
  },
  {
    id: 'multiplication',
    titleKey: 'multiplication',
    icon: X,
    gradient: 'from-emerald-500 to-teal-500',
    category: 'arithmetic',
    difficultyOptions: ['easy', 'medium', 'hard', 'expert'],
    badge: 'Essential',
  },
  {
    id: 'division',
    titleKey: 'division',
    icon: Divide,
    gradient: 'from-cyan-500 to-blue-500',
    category: 'arithmetic',
    difficultyOptions: ['easy', 'medium', 'hard', 'expert'],
    badge: 'Mastery',
  },
  {
    id: 'sequence',
    titleKey: 'sequence',
    icon: ArrowRightLeft,
    gradient: 'from-indigo-500 to-purple-500',
    category: 'logic',
    difficultyOptions: ['easy', 'medium', 'hard', 'expert'],
    badge: 'Patterns',
  },
  {
    id: 'missingNumber',
    titleKey: 'missingNumber',
    icon: Search,
    gradient: 'from-violet-500 to-purple-600',
    category: 'logic',
    difficultyOptions: ['easy', 'medium', 'hard', 'expert'],
    badge: 'Equations',
  },
  {
    id: 'memory',
    titleKey: 'memory',
    icon: Grid,
    gradient: 'from-purple-500 to-pink-600',
    category: 'logic',
    difficultyOptions: ['easy', 'medium', 'hard'],
    badge: 'Memory',
  },
  {
    id: 'speedMath',
    titleKey: 'speedMath',
    icon: Zap,
    gradient: 'from-amber-400 to-orange-500',
    category: 'speed',
    difficultyOptions: ['easy', 'medium', 'hard'],
    badge: '60s Sprint',
  },
  {
    id: 'mentalMath',
    titleKey: 'mentalMath',
    icon: Brain,
    gradient: 'from-fuchsia-500 to-rose-600',
    category: 'speed',
    difficultyOptions: ['easy', 'medium', 'hard', 'expert'],
    badge: 'No Pen/Paper',
  },
  {
    id: 'shapes',
    titleKey: 'shapes',
    icon: Shapes,
    gradient: 'from-blue-500 to-indigo-600',
    category: 'geometry',
    difficultyOptions: ['easy', 'medium', 'hard'],
    badge: 'Visual',
  },
  {
    id: 'fractionPuzzle',
    titleKey: 'fractionPuzzle',
    icon: PieChart,
    gradient: 'from-teal-500 to-emerald-600',
    category: 'logic',
    difficultyOptions: ['easy', 'medium', 'hard'],
    badge: 'Fractions',
  },
  {
    id: 'equationSolver',
    titleKey: 'equationSolver',
    icon: Scale,
    gradient: 'from-indigo-600 to-blue-700',
    category: 'arithmetic',
    difficultyOptions: ['easy', 'medium', 'hard', 'expert'],
    badge: 'Solve for x',
  },
  {
    id: 'riddles',
    titleKey: 'riddles',
    icon: Sparkles,
    gradient: 'from-rose-500 to-red-600',
    category: 'logic',
    difficultyOptions: ['easy', 'medium', 'hard'],
    badge: 'Brain Teasers',
  },
  {
    id: 'geometry',
    titleKey: 'geometry',
    icon: Compass,
    gradient: 'from-sky-500 to-cyan-600',
    category: 'geometry',
    difficultyOptions: ['easy', 'medium', 'hard'],
    badge: 'Area/Perimeter',
  },
  {
    id: 'timesTables',
    titleKey: 'timesTables',
    icon: Star,
    gradient: 'from-emerald-500 to-green-600',
    category: 'arithmetic',
    difficultyOptions: ['easy', 'medium', 'hard'],
    badge: 'Tables 1-20',
  },
];

export const GamesHub: React.FC = () => {
  const { t, selectedGameId, setSelectedGameId } = useApp();
  const [activeFilter, setActiveFilter] = useState<'all' | 'arithmetic' | 'logic' | 'speed' | 'geometry'>('all');
  const [runningGameId, setRunningGameId] = useState<string | null>(selectedGameId);

  const filteredGames = gamesRegistry.filter((g) => {
    if (activeFilter === 'all') return true;
    return g.category === activeFilter;
  });

  const handleStartGame = (gameId: string) => {
    sound.playClick();
    setSelectedGameId(gameId);
    setRunningGameId(gameId);
  };

  const handleExitGame = () => {
    sound.playClick();
    setRunningGameId(null);
    setSelectedGameId(null);
  };

  if (runningGameId) {
    const activeDef = gamesRegistry.find((g) => g.id === runningGameId) || gamesRegistry[0];
    return <GameRunner game={activeDef} onExit={handleExitGame} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-12 select-none">
      {/* 3D Wooden Header */}
      <div className="wood-board-3d p-5 sm:p-6 shadow-xl relative">
        <div className="absolute top-2 left-2 brass-rivet" />
        <div className="absolute top-2 right-2 brass-rivet" />
        <div className="absolute bottom-2 left-2 brass-rivet" />
        <div className="absolute bottom-2 right-2 brass-rivet" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/30 text-amber-300 text-xs font-bold mb-1.5">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>15 Interactive Mathematics Games</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-amber-100 drop-shadow-md">
              {t.nav.games}
            </h1>
            <p className="text-xs sm:text-sm text-amber-200/90 mt-0.5">
              Strengthen arithmetic, logic, spatial intuition, and mental math reflexes through 3D gamified practice.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: t.common.all },
          { id: 'arithmetic', label: 'Arithmetic Challenges' },
          { id: 'speed', label: 'Speed & Mental Math' },
          { id: 'logic', label: 'Logic & Puzzles' },
          { id: 'geometry', label: 'Shapes & Geometry' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              sound.playClick();
              setActiveFilter(tab.id as typeof activeFilter);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === tab.id
                ? 'gold-btn-3d text-amber-950 scale-102 shadow-md'
                : 'wood-btn-3d text-amber-100/90'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Games Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredGames.map((game) => {
          const Icon = game.icon;
          const info = t.games[game.id] || {
            title: game.id,
            desc: 'Mathematics mini-game',
            instructions: 'Play and learn!',
          };

          return (
            <div
              key={game.id}
              onClick={() => handleStartGame(game.id)}
              className="wood-board-3d p-5 cursor-pointer hover:brightness-105 transition-all group flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-13 h-13 rounded-2xl wood-tile-3d flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="gold-badge text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                    {game.badge}
                  </span>
                </div>

                <h3 className="font-black text-base sm:text-lg text-amber-100 drop-shadow-sm group-hover:text-yellow-300 transition-colors">
                  {info.title}
                </h3>
                <p className="text-xs text-amber-200/80 mt-1 line-clamp-2">
                  {info.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-800/80 flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-300/80">
                  {game.difficultyOptions.length} Levels
                </span>
                <span className="flex items-center gap-1 text-xs font-black text-yellow-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                  <Play className="w-3.5 h-3.5 fill-yellow-300" />
                  <span>{t.common.start}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
