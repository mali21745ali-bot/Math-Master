import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Volume2,
  VolumeX,
  Languages,
  Flame,
  Menu,
  X,
  Coins,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { sound } from '../../services/sound';

interface HeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { profile, setLanguage, toggleSound, isUrdu, t, setActiveView } = useApp();

  const handleLanguageToggle = () => {
    sound.playClick();
    setLanguage(profile.language === 'en' ? 'ur' : 'en');
  };

  return (
    <header className="sticky top-0 z-40 wood-header-bar border-b-4 border-amber-950 shadow-xl select-none">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Left: Hamburger & 3D Logo */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => {
              sound.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            aria-label="Toggle Navigation Menu"
            className="lg:hidden wood-btn-3d p-2 rounded-xl text-amber-100 cursor-pointer shadow-md flex-shrink-0"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveView('home');
            }}
            className="flex items-center gap-2 text-start group cursor-pointer focus:outline-none min-w-0"
          >
            {/* 3D Wooden Logo Tile */}
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl wood-tile-3d flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform border border-amber-300 flex-shrink-0">
              <span className="font-black text-base sm:text-xl math-symbol drop-shadow-md">∑²</span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm sm:text-xl tracking-wide text-amber-100 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] truncate">
                  {t.appName}
                </span>
                <span className="gold-badge text-[10px] px-2 py-0.2 rounded-full hidden sm:inline-block">
                  3D
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-bold text-amber-300/90 tracking-wider line-clamp-1 drop-shadow-xs">
                {t.appSubtitle}
              </p>
            </div>
          </button>
        </div>

        {/* Center / Right: Streak, Points, Sound, Language */}
        <div className="flex items-center gap-1 sm:gap-2.5 flex-shrink-0">
          {/* Streak Flame Pill */}
          <div
            title={`${profile.streakDays} Day Streak`}
            className="hidden sm:flex wood-panel-3d px-2.5 py-1.5 items-center gap-1.5 text-amber-300 font-black text-xs sm:text-sm border border-amber-800 shadow-md"
          >
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
            <span>{profile.streakDays}</span>
            <span className="hidden md:inline text-[11px] font-bold text-amber-200">{t.common.streak}</span>
          </div>

          {/* 3D Gold Points Coin Badge */}
          <div
            title={`${profile.points} Total Points`}
            className="gold-btn-3d px-2.5 sm:px-3 py-1.5 rounded-xl flex items-center gap-1 text-xs sm:text-sm font-black shadow-md"
          >
            <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-900" />
            <span>{profile.points}</span>
          </div>

          {/* Audio Mute/Unmute */}
          <button
            onClick={toggleSound}
            aria-label={profile.soundEnabled ? t.common.soundOn : t.common.soundOff}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              profile.soundEnabled ? 'wood-btn-3d text-amber-100' : 'bg-black/50 text-amber-500/50 border border-amber-950'
            }`}
          >
            {profile.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Language Switcher */}
          <button
            onClick={handleLanguageToggle}
            className="blue-btn-3d px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1 cursor-pointer shadow-md"
            aria-label="Switch Language"
          >
            <Languages className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{isUrdu ? 'EN' : 'اردو'}</span>
          </button>

          {/* Profile Quick Pill */}
          <button
            onClick={() => {
              sound.playClick();
              setActiveView('progress');
            }}
            className="wood-panel-3d px-1.5 sm:pl-1.5 sm:pr-2.5 py-1 flex items-center gap-1.5 border border-amber-800 hover:brightness-110 cursor-pointer"
            title="View Student Profile"
          >
            <span className="text-lg sm:text-xl leading-none">{profile.avatar}</span>
            <span className="hidden xl:inline text-xs font-black text-amber-100 max-w-[80px] truncate">
              {profile.name}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
