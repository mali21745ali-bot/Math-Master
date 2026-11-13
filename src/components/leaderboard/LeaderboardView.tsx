import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LeaderboardEntry } from '../../types';
import { sound } from '../../services/sound';
import {
  Crown,
  Medal,
  UserPlus,
} from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const { profile, t, isUrdu, triggerConfetti } = useApp();

  const [classmates, setClassmates] = useState<LeaderboardEntry[]>([
    { id: '1', name: 'Ayesha Khan', avatar: '🌟', classLevel: 'class4', points: 420, quizzesCompleted: 6 },
    { id: '2', name: 'Bilal Ahmed', avatar: '🚀', classLevel: 'class3', points: 310, quizzesCompleted: 4 },
    { id: '3', name: 'Zainab Noor', avatar: '🦉', classLevel: 'class5', points: 260, quizzesCompleted: 3 },
    { id: '4', name: 'Hamza Farooq', avatar: '⚡', classLevel: 'class2', points: 190, quizzesCompleted: 2 },
  ]);

  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerPoints, setNewPlayerPoints] = useState(100);
  const [showAddModal, setShowAddModal] = useState(false);

  const allEntries: LeaderboardEntry[] = [
    {
      id: 'current-user',
      name: profile.name,
      avatar: profile.avatar,
      classLevel: profile.classLevel,
      points: profile.points,
      quizzesCompleted: profile.quizzesCompleted,
      isCurrentUser: true,
    },
    ...classmates,
  ].sort((a, b) => b.points - a.points);

  const handleAddClassmate = () => {
    if (!newPlayerName.trim()) return;
    sound.playClick();
    const newEntry: LeaderboardEntry = {
      id: `local-${Date.now()}`,
      name: newPlayerName.trim(),
      avatar: '🦊',
      classLevel: profile.classLevel,
      points: Number(newPlayerPoints) || 100,
      quizzesCompleted: 1,
    };
    setClassmates((prev) => [...prev, newEntry]);
    setNewPlayerName('');
    setShowAddModal(false);
    triggerConfetti();
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400 drop-shadow-md" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-300 fill-slate-300 drop-shadow-md" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600 fill-amber-600 drop-shadow-md" />;
    return <span className="font-black text-sm text-amber-300">#{rank}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-12 select-none">
      {/* 3D Wooden Header */}
      <div className="wood-board-3d p-5 sm:p-6 shadow-xl relative">
        <div className="absolute top-2 left-2 brass-rivet" />
        <div className="absolute top-2 right-2 brass-rivet" />
        <div className="absolute bottom-2 left-2 brass-rivet" />
        <div className="absolute bottom-2 right-2 brass-rivet" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/30 text-amber-300 text-xs font-bold mb-1.5">
              <Crown className="w-3.5 h-3.5 text-yellow-400" />
              <span>{isUrdu ? 'برتری کی فہرست اور درجہ بندی' : 'Hall of Fame & Rankings'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-amber-100 drop-shadow-md">
              {t.nav.leaderboard}
            </h1>
            <p className="text-xs sm:text-sm text-amber-200/90 mt-0.5">
              {t.sections.localLeaderboardNote}
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setShowAddModal(true);
            }}
            className="green-btn-3d px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 cursor-pointer shadow-md flex-shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isUrdu ? 'کھلاڑی شامل کریں' : 'Add Player'}</span>
          </button>
        </div>
      </div>

      {/* Add Competitor Modal */}
      {showAddModal && (
        <div className="wood-board-3d p-5 shadow-2xl space-y-3 border-2 border-yellow-500">
          <h3 className="font-black text-base text-amber-100">
            {isUrdu ? 'دوست یا ہم جماعت پروفائل شامل کریں' : 'Add Classmate / Sibling Profile'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-amber-300 mb-1">
                {isUrdu ? 'کھلاڑی کا نام:' : 'Player Name:'}
              </label>
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder={isUrdu ? 'مثال: فاطمہ علی' : 'e.g. Fatima Ali'}
                className="w-full p-2.5 border border-amber-800 bg-amber-950 text-white rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-amber-300 mb-1">
                {isUrdu ? 'ابتدائی پوائنٹس:' : 'Starting Points:'}
              </label>
              <input
                type="number"
                value={newPlayerPoints}
                onChange={(e) => setNewPlayerPoints(Number(e.target.value))}
                className="w-full p-2.5 border border-amber-800 bg-amber-950 text-white rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <button
              onClick={() => setShowAddModal(false)}
              className="wood-btn-3d px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
            >
              {t.common.cancel}
            </button>
            <button
              onClick={handleAddClassmate}
              className="green-btn-3d px-5 py-2 rounded-xl text-xs font-black cursor-pointer"
            >
              {isUrdu ? 'بورڈ میں شامل کریں' : 'Add to Board'}
            </button>
          </div>
        </div>
      )}

      {/* 3D Leaderboard Wooden Table */}
      <div className="wood-board-3d p-2 sm:p-3 shadow-xl">
        <div className="p-3 wood-board-inner mb-2 grid grid-cols-12 text-xs font-black text-amber-300 uppercase tracking-wider border border-amber-800">
          <div className="col-span-2 text-center">{isUrdu ? 'درجہ' : 'Rank'}</div>
          <div className="col-span-5">{isUrdu ? 'کھلاڑی' : 'Player'}</div>
          <div className="col-span-3 text-center">{isUrdu ? 'کلاس' : 'Class'}</div>
          <div className="col-span-2 text-end ltr:pr-2 rtl:pl-2">{t.common.points}</div>
        </div>

        <div className="space-y-1.5">
          {allEntries.map((entry, index) => {
            const rank = index + 1;
            const isUser = entry.isCurrentUser;

            return (
              <div
                key={entry.id}
                className={`grid grid-cols-12 items-center p-3 rounded-xl transition-all ${
                  isUser
                    ? 'wood-tile-3d scale-101 border-amber-400'
                    : 'wood-panel-3d border border-amber-900/60 hover:brightness-105'
                }`}
              >
                <div className="col-span-2 flex items-center justify-center">
                  {getRankBadge(rank)}
                </div>

                <div className="col-span-5 flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl wood-tile-3d flex items-center justify-center text-lg flex-shrink-0">
                    {entry.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-black text-white truncate flex items-center gap-1.5 drop-shadow-sm">
                      <span>{entry.name}</span>
                      {isUser && (
                        <span className="gold-badge text-[9px] px-1.5 py-0.2 rounded-full">
                          {isUrdu ? 'آپ' : 'YOU'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-span-3 text-center text-xs font-bold text-amber-200 truncate">
                  {t.classes[entry.classLevel]?.title || entry.classLevel}
                </div>

                <div className="col-span-2 text-end ltr:pr-2 rtl:pl-2 font-black text-yellow-300 text-sm sm:text-base drop-shadow-sm">
                  {entry.points}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
