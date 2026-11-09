import React from 'react';
import { useApp } from '../../context/AppContext';
import { ViewType } from '../../types';
import {
  Home,
  GraduationCap,
  BookOpen,
  Gamepad2,
  Grid,
  HelpCircle,
  CalendarDays,
  LineChart,
  Trophy,
  Crown,
  Settings,
  Info,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import { sound } from '../../services/sound';

interface SidebarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (val: boolean) => void;
}

interface NavItemDef {
  id: ViewType;
  labelKey: keyof ReturnType<typeof useApp>['t']['nav'];
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItemDef[] = [
  { id: 'home', labelKey: 'home', icon: Home },
  { id: 'select_class', labelKey: 'selectClass', icon: GraduationCap },
  { id: 'games', labelKey: 'games', icon: Gamepad2, badge: '15 Games' },
  { id: 'puzzle', labelKey: 'puzzle', icon: Grid, badge: '3D Wooden' },
  { id: 'quiz', labelKey: 'quiz', icon: HelpCircle, badge: '9 Types' },
  { id: 'daily_challenge', labelKey: 'dailyChallenge', icon: CalendarDays, badge: 'Daily' },
  { id: 'topics', labelKey: 'topics', icon: BookOpen },
  { id: 'progress', labelKey: 'progress', icon: LineChart },
  { id: 'achievements', labelKey: 'achievements', icon: Trophy },
  { id: 'leaderboard', labelKey: 'leaderboard', icon: Crown },
  { id: 'settings', labelKey: 'settings', icon: Settings },
  { id: 'about', labelKey: 'about', icon: Info },
];

export const Sidebar: React.FC<SidebarProps> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { activeView, setActiveView, t, profile, selectedClass } = useApp();

  const handleNavClick = (viewId: ViewType) => {
    sound.playClick();
    setActiveView(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* 3D Wooden Sidebar container */}
      <aside
        className={`fixed top-18 bottom-0 z-40 w-72 wood-panel-3d rounded-none lg:rounded-2xl lg:my-4 border-r-4 lg:border-4 border-amber-950 p-4 overflow-y-auto transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 select-none shadow-2xl ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Student Mini Wooden Plaque */}
        <div className="wood-board-inner mb-4 p-3.5 border border-amber-800 relative shadow-inner">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl wood-tile-3d flex items-center justify-center text-2xl shadow-md border border-amber-300">
              {profile.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-black text-amber-100 truncate drop-shadow-sm">{profile.name}</h4>
              <p className="text-xs font-bold text-amber-300 truncate">
                {t.classes[selectedClass]?.title || selectedClass}
              </p>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-amber-200/90 font-bold">
                <span>{profile.points} pts</span>
                <span>•</span>
                <span>Lvl {profile.level}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation list with 3D tactile buttons */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            const label = t.nav[item.labelKey];

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer group ${
                  isActive
                    ? 'gold-btn-3d text-amber-950 scale-102 shadow-md'
                    : 'wood-btn-3d text-amber-100/95 hover:brightness-110'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${
                      isActive ? 'text-amber-950' : 'text-amber-200 group-hover:scale-110 transition-transform'
                    }`}
                  />
                  <span className="truncate">{label}</span>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {item.badge && (
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-md font-black uppercase ${
                        isActive ? 'bg-amber-950 text-amber-300' : 'bg-black/30 text-amber-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Motivational Wooden Plaque */}
        <div className="wood-board-inner mt-6 p-3 rounded-xl text-center border border-amber-800/80">
          <Sparkles className="w-4 h-4 text-amber-400 mx-auto mb-1 animate-pulse" />
          <p className="text-[11px] font-bold text-amber-200 leading-snug">
            {t.tagline}
          </p>
        </div>
      </aside>
    </>
  );
};
