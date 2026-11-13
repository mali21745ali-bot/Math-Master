/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { HomeDashboard } from './components/home/HomeDashboard';
import { ClassSelection } from './components/classes/ClassSelection';
import { TopicExplorer } from './components/topics/TopicExplorer';
import { GamesHub } from './components/games/GamesHub';
import { NumberSlidingPuzzle } from './components/puzzle/NumberSlidingPuzzle';
import { QuizSystem } from './components/quiz/QuizSystem';
import { DailyChallenge } from './components/daily/DailyChallenge';
import { ProgressReport } from './components/progress/ProgressReport';
import { AchievementsView } from './components/achievements/AchievementsView';
import { LeaderboardView } from './components/leaderboard/LeaderboardView';
import { SettingsView } from './components/settings/SettingsView';
import { AboutUsView } from './components/about/AboutUsView';
import { MathGameScreen } from './components/games/MathGameScreen';
import { LevelSelectScreen } from './components/levels/LevelSelectScreen';
import {
  Home,
  GraduationCap,
  Gamepad2,
  HelpCircle,
  Grid,
  Zap,
} from 'lucide-react';
import { sound } from './services/sound';

const MainLayout: React.FC = () => {
  const { activeView, setActiveView, selectedGameMode, isUrdu } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return <HomeDashboard />;
      case 'select_class':
        return <ClassSelection />;
      case 'level_select':
        return (
          <LevelSelectScreen
            onBack={() => setActiveView('home')}
            onStartLevel={() => {
              if (selectedGameMode === 'sliding_puzzle') {
                setActiveView('puzzle');
              } else {
                setActiveView('play_game');
              }
            }}
          />
        );
      case 'play_game':
        return <MathGameScreen operation={selectedGameMode} onBack={() => setActiveView('level_select')} />;
      case 'addition_game':
        return <MathGameScreen operation="addition" onBack={() => setActiveView('home')} />;
      case 'subtraction_game':
        return <MathGameScreen operation="subtraction" onBack={() => setActiveView('home')} />;
      case 'multiplication_game':
        return <MathGameScreen operation="multiplication" onBack={() => setActiveView('home')} />;
      case 'division_game':
        return <MathGameScreen operation="division" onBack={() => setActiveView('home')} />;
      case 'math_mix_game':
        return <MathGameScreen operation="mixed" onBack={() => setActiveView('home')} />;
      case 'topics':
        return <TopicExplorer />;
      case 'games':
        return <GamesHub />;
      case 'puzzle':
        return <NumberSlidingPuzzle />;
      case 'quiz':
        return <QuizSystem />;
      case 'daily_challenge':
        return <DailyChallenge />;
      case 'progress':
        return <ProgressReport />;
      case 'achievements':
        return <AchievementsView />;
      case 'leaderboard':
        return <LeaderboardView />;
      case 'settings':
        return <SettingsView />;
      case 'about':
        return <AboutUsView />;
      default:
        return <HomeDashboard />;
    }
  };

  return (
    <div className="desert-sky-bg min-h-screen flex flex-col font-sans transition-colors relative">
      {/* Decorative fixed dunes backdrop */}
      <div className="desert-dunes-overlay" aria-hidden="true" />

      {/* Top 3D Wooden Header */}
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* Main Container: 3D Wooden Sidebar + Content Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-2 sm:px-4 relative z-10">
        <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

        <main className="flex-1 py-4 sm:py-6 px-1 sm:px-4 overflow-x-hidden min-w-0">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Quick Bar in 3D Wood */}
      <nav className="lg:hidden sticky bottom-0 z-30 wood-header-bar border-t-4 border-amber-950 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {[
          { id: 'home', label: isUrdu ? 'ہوم' : 'Home', icon: Home },
          { id: 'level_select', label: isUrdu ? 'لیولز' : 'Levels', icon: Zap },
          { id: 'puzzle', label: isUrdu ? 'پزل' : 'Puzzle', icon: Grid },
          { id: 'select_class', label: isUrdu ? 'کلاس' : 'Class', icon: GraduationCap },
          { id: 'games', label: isUrdu ? 'کھیل' : 'Games', icon: Gamepad2 },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                sound.playClick();
                setActiveView(item.id as typeof activeView);
              }}
              className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'gold-btn-3d text-amber-950 scale-105 px-3'
                  : 'text-amber-200 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] font-black">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
