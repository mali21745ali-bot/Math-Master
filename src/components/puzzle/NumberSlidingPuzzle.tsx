import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { sound } from '../../services/sound';
import {
  RotateCcw,
  Shuffle,
  Lightbulb,
  Trophy,
  Clock,
  ArrowLeft,
  Coins,
  Pause,
  Play,
} from 'lucide-react';

type GridSize = 3 | 4 | 5;

export const NumberSlidingPuzzle: React.FC = () => {
  const { t, profile, isUrdu, recordPuzzleSolved, triggerConfetti, setActiveView } = useApp();

  const [gridSize, setGridSize] = useState<GridSize>(3);
  const [initialBoard, setInitialBoard] = useState<number[]>([]);
  const [board, setBoard] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [hintIndex, setHintIndex] = useState<number | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Generate solved board for given size: [1, 2, 3, ..., N*N - 1, 0]
  const getSolvedBoard = useCallback((size: GridSize): number[] => {
    const total = size * size;
    const arr: number[] = [];
    for (let i = 1; i < total; i++) {
      arr.push(i);
    }
    arr.push(0); // 0 represents the empty cell
    return arr;
  }, []);

  // Check if current board is solved
  const checkIsSolved = useCallback((current: number[], size: GridSize): boolean => {
    if (current.length === 0) return false;
    const total = size * size;
    for (let i = 0; i < total - 1; i++) {
      if (current[i] !== i + 1) return false;
    }
    return current[total - 1] === 0;
  }, []);

  // Verify mathematical solvability invariant
  const isSolvable = useCallback((tiles: number[], size: GridSize): boolean => {
    let inversions = 0;
    const nums = tiles.filter((n) => n !== 0);
    for (let i = 0; i < nums.length; i++) {
      for (let j = i + 1; j < nums.length; j++) {
        if (nums[i] > nums[j]) inversions++;
      }
    }
    if (size % 2 === 1) {
      return inversions % 2 === 0;
    }
    const emptyIdx = tiles.indexOf(0);
    const emptyRowFromBottom = size - Math.floor(emptyIdx / size);
    return (inversions + emptyRowFromBottom) % 2 === 1;
  }, []);

  // Guaranteed solvable shuffle via random valid moves from solved state
  const generateSolvableShuffle = useCallback(
    (size: GridSize): number[] => {
      const current = [...getSolvedBoard(size)];
      const totalMoves = size * size * 28;
      let emptyIdx = current.indexOf(0);
      let lastMovedIdx = -1;

      for (let step = 0; step < totalMoves; step++) {
        const neighbors: number[] = [];
        const row = Math.floor(emptyIdx / size);
        const col = emptyIdx % size;

        if (row > 0) neighbors.push(emptyIdx - size);
        if (row < size - 1) neighbors.push(emptyIdx + size);
        if (col > 0) neighbors.push(emptyIdx - 1);
        if (col < size - 1) neighbors.push(emptyIdx + 1);

        const validCandidates = neighbors.filter((idx) => idx !== lastMovedIdx);
        const chosen =
          validCandidates.length > 0
            ? validCandidates[Math.floor(Math.random() * validCandidates.length)]
            : neighbors[Math.floor(Math.random() * neighbors.length)];

        current[emptyIdx] = current[chosen];
        current[chosen] = 0;
        lastMovedIdx = emptyIdx;
        emptyIdx = chosen;
      }

      if (checkIsSolved(current, size)) {
        const row = Math.floor(emptyIdx / size);
        const target = row > 0 ? emptyIdx - size : emptyIdx + size;
        current[emptyIdx] = current[target];
        current[target] = 0;
      }

      return isSolvable(current, size) ? current : generateSolvableShuffle(size);
    },
    [getSolvedBoard, checkIsSolved, isSolvable]
  );

  const initializeGame = useCallback(
    (size: GridSize, presetBoard?: number[]) => {
      const tiles = presetBoard ? [...presetBoard] : generateSolvableShuffle(size);
      setInitialBoard([...tiles]);
      setBoard(tiles);
      setMoves(0);
      setSeconds(0);
      setIsRunning(false);
      setIsPaused(false);
      setIsSolved(false);
      setHintIndex(null);
    },
    [generateSolvableShuffle]
  );

  useEffect(() => {
    initializeGame(gridSize);
  }, [gridSize, initializeGame]);

  // Timer effect
  useEffect(() => {
    if (isRunning && !isPaused && !isSolved) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isPaused, isSolved]);

  const canMove = (index: number): boolean => {
    const emptyIndex = board.indexOf(0);
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    const emptyRow = Math.floor(emptyIndex / gridSize);
    const emptyCol = emptyIndex % gridSize;

    return (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    );
  };

  const handleTileClick = (index: number) => {
    if (isSolved || isPaused) return;
    if (!canMove(index)) return;

    if (!isRunning) setIsRunning(true);
    sound.playSlide();

    const emptyIndex = board.indexOf(0);
    const newBoard = [...board];
    newBoard[emptyIndex] = newBoard[index];
    newBoard[index] = 0;

    setBoard(newBoard);
    const nextMoves = moves + 1;
    setMoves(nextMoves);
    setHintIndex(null);

    if (checkIsSolved(newBoard, gridSize)) {
      setIsSolved(true);
      setIsRunning(false);
      sound.playVictory();
      triggerConfetti();
      recordPuzzleSolved(nextMoves, seconds);
    }
  };

  const handleHint = () => {
    if (isSolved || isPaused) return;
    sound.playClick();
    const emptyIndex = board.indexOf(0);
    const neighbors: number[] = [];
    const row = Math.floor(emptyIndex / gridSize);
    const col = emptyIndex % gridSize;

    if (row > 0) neighbors.push(emptyIndex - gridSize);
    if (row < gridSize - 1) neighbors.push(emptyIndex + gridSize);
    if (col > 0) neighbors.push(emptyIndex - 1);
    if (col < gridSize - 1) neighbors.push(emptyIndex + 1);

    if (neighbors.length > 0) {
      // Prefer moving a tile whose home is nearer to the empty cell
      let bestIdx = neighbors[0];
      let bestScore = -Infinity;
      neighbors.forEach((nIdx) => {
        const val = board[nIdx];
        const targetIdx = val - 1;
        const targetRow = Math.floor(targetIdx / gridSize);
        const targetCol = targetIdx % gridSize;
        const curDist =
          Math.abs(Math.floor(nIdx / gridSize) - targetRow) +
          Math.abs((nIdx % gridSize) - targetCol);
        const newDist =
          Math.abs(row - targetRow) + Math.abs(col - targetCol);
        const gain = curDist - newDist;
        if (gain > bestScore) {
          bestScore = gain;
          bestIdx = nIdx;
        }
      });
      setHintIndex(bestIdx);
    }
  };

  const handleShuffle = () => {
    sound.playClick();
    initializeGame(gridSize);
  };

  const handleRestart = () => {
    sound.playClick();
    if (initialBoard.length === gridSize * gridSize) {
      initializeGame(gridSize, initialBoard);
    } else {
      initializeGame(gridSize);
    }
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-md mx-auto space-y-4 pb-12 select-none">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => {
            sound.playClick();
            setActiveView('home');
          }}
          className="wood-btn-3d px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{t.common.exit}</span>
        </button>

        {/* 3x3, 4x4, 5x5 Grid Size Selector */}
        <div className="flex items-center gap-1 bg-amber-950/80 p-1 rounded-xl border border-amber-800" dir="ltr">
          {([3, 4, 5] as GridSize[]).map((sz) => (
            <button
              key={sz}
              onClick={() => {
                sound.playClick();
                setGridSize(sz);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                gridSize === sz ? 'gold-btn-3d scale-105' : 'text-amber-200 hover:text-white'
              }`}
            >
              {sz}×{sz}
            </button>
          ))}
        </div>

        <div className="gold-btn-3d px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1">
          <Coins className="w-3.5 h-3.5 text-amber-900" />
          <span>{profile.points}</span>
        </div>
      </div>

      {/* 3D Wooden Stats Bar */}
      <div className="grid grid-cols-3 gap-2">
        <div className="wood-panel-3d p-2.5 text-center">
          <div className="text-[10px] uppercase font-bold text-amber-300">{t.common.moves}</div>
          <div className="text-xl font-black text-white mt-0.5">{moves}</div>
        </div>

        <div className="wood-panel-3d p-2.5 text-center">
          <div className="text-[10px] uppercase font-bold text-amber-300 flex items-center justify-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" /> {t.common.time}
          </div>
          <div className="text-xl font-black text-white mt-0.5" dir="ltr">
            {formatTime(seconds)}
          </div>
        </div>

        <div className="wood-panel-3d p-2.5 text-center">
          <div className="text-[10px] uppercase font-bold text-amber-300">
            {isUrdu ? 'ہدف' : 'Target'}
          </div>
          <div className="text-sm font-black text-amber-200 mt-1" dir="ltr">
            1 → {gridSize * gridSize - 1}
          </div>
        </div>
      </div>

      {/* Main 3D Wooden Game Board */}
      <div className="wood-board-3d p-4 sm:p-5 relative flex flex-col items-center shadow-2xl">
        <div className="absolute top-2.5 left-2.5 brass-rivet" />
        <div className="absolute top-2.5 right-2.5 brass-rivet" />
        <div className="absolute bottom-2.5 left-2.5 brass-rivet" />
        <div className="absolute bottom-2.5 right-2.5 brass-rivet" />

        {/* Solved Victory Celebration */}
        {isSolved && (
          <div className="mb-4 w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-center shadow-lg border-2 border-emerald-300 space-y-2">
            <div className="flex items-center justify-center gap-2 text-lg font-black">
              <Trophy className="w-6 h-6 text-yellow-300" />
              <span>{t.common.congratulations}</span>
            </div>
            <p className="text-xs text-emerald-100">
              {isUrdu
                ? `آپ نے ${moves} چالوں اور ${formatTime(seconds)} وقت میں پزل مکمل کر لیا! (+50 پوائنٹس)`
                : `Solved in ${moves} moves (${formatTime(seconds)})! (+50 Points)`}
            </p>
            <button
              onClick={handleShuffle}
              className="gold-btn-3d px-4 py-1.5 text-xs font-black inline-flex items-center gap-1.5"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'نیا پزل کھیلیں' : 'Play New Puzzle'}</span>
            </button>
          </div>
        )}

        {/* 3D Wooden Sliding Puzzle Grid (Always LTR so 1..N^2-1 reads left-to-right) */}
        <div className="relative w-full max-w-[340px] sm:max-w-[370px] aspect-square">
          <div
            dir="ltr"
            className={`grid gap-2 sm:gap-2.5 p-3 wood-board-inner shadow-2xl select-none w-full h-full ${
              gridSize === 3 ? 'grid-cols-3' : gridSize === 4 ? 'grid-cols-4' : 'grid-cols-5'
            }`}
          >
            {board.map((tile, idx) => {
              const isEmpty = tile === 0;
              const isClickable = !isSolved && !isPaused && canMove(idx);
              const isTargetInPlace = tile === idx + 1;
              const isHinted = hintIndex === idx;

              if (isEmpty) {
                return (
                  <div
                    key="empty-slot"
                    className="wood-cell-empty flex items-center justify-center"
                  >
                    <span className="text-[9px] font-black text-amber-900 tracking-wider">
                      {isUrdu ? 'خالی' : 'EMPTY'}
                    </span>
                  </div>
                );
              }

              return (
                <button
                  key={`${tile}-${idx}`}
                  onClick={() => handleTileClick(idx)}
                  disabled={!isClickable}
                  className={`relative rounded-xl font-black flex items-center justify-center cursor-pointer active:scale-95 transition-all ${
                    gridSize === 3
                      ? 'text-2xl sm:text-3xl'
                      : gridSize === 4
                      ? 'text-xl sm:text-2xl'
                      : 'text-base sm:text-lg'
                  } ${
                    isHinted
                      ? 'wood-tile-3d ring-4 ring-yellow-400 animate-pulse'
                      : isTargetInPlace
                      ? 'wood-tile-3d wood-tile-correct'
                      : 'wood-tile-3d'
                  } ${isClickable ? 'hover:brightness-105' : 'opacity-90 cursor-default'}`}
                >
                  <span className="math-symbol drop-shadow-md">{tile}</span>
                  {isTargetInPlace && (
                    <span className="absolute top-1 right-1.5 text-[9px] text-emerald-200">★</span>
                  )}
                </button>
              );
            })}
          </div>

          {isPaused && !isSolved && (
            <div className="absolute inset-0 bg-black/75 rounded-2xl flex flex-col items-center justify-center gap-3 p-4 text-center backdrop-blur-xs">
              <Pause className="w-10 h-10 text-amber-300" />
              <h3 className="text-xl font-black text-amber-100">
                {isUrdu ? 'پزل رکا ہوا ہے' : 'Puzzle Paused'}
              </h3>
              <button
                onClick={() => {
                  sound.playClick();
                  setIsPaused(false);
                }}
                className="gold-btn-3d px-5 py-2.5 text-xs font-black flex items-center gap-1.5"
              >
                <Play className="w-4 h-4 fill-amber-950" />
                <span>{isUrdu ? 'جاری رکھیں' : 'Resume'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom Controls Bar */}
        <div className="mt-5 w-full grid grid-cols-4 gap-2">
          <button
            onClick={handleShuffle}
            className="wood-btn-3d py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'نیا' : 'Shuffle'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              if (!isRunning && !isPaused) {
                setIsRunning(true);
              } else {
                setIsPaused((p) => !p);
              }
            }}
            disabled={isSolved}
            className="wood-btn-3d py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
          >
            {isPaused || !isRunning ? (
              <Play className="w-3.5 h-3.5" />
            ) : (
              <Pause className="w-3.5 h-3.5" />
            )}
            <span>
              {isPaused
                ? isUrdu
                  ? 'جاری'
                  : 'Resume'
                : isRunning
                ? isUrdu
                  ? 'وقفہ'
                  : 'Pause'
                : isUrdu
                ? 'شروع'
                : 'Start'}
            </span>
          </button>

          <button
            onClick={handleHint}
            disabled={isSolved || isPaused}
            className="gold-btn-3d py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 text-amber-950"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-950" />
            <span>{isUrdu ? 'اشارہ' : 'Hint'}</span>
          </button>

          <button
            onClick={handleRestart}
            className="wood-btn-3d py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'دوبارہ' : 'Restart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
