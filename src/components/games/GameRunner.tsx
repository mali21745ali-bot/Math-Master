import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { GameDefinition } from './GamesHub';
import { Difficulty } from '../../types';
import { sound } from '../../services/sound';
import {
  ArrowLeft,
  RotateCcw,
  Trophy,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Zap,
} from 'lucide-react';

interface GameRunnerProps {
  game: GameDefinition;
  onExit: () => void;
}

interface MiniQuestion {
  prompt: string;
  options: string[];
  correct: string;
  explanation: string;
}

export const GameRunner: React.FC<GameRunnerProps> = ({ game, onExit }) => {
  const { t, recordGamePlayed, addPoints, triggerConfetti } = useApp();

  const [gameState, setGameState] = useState<'intro' | 'playing' | 'ended'>('intro');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [currentQ, setCurrentQ] = useState<MiniQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [timeLeft, setTimeLeft] = useState(game.id === 'speedMath' ? 60 : 30);

  // For memory game
  const [memoryCards, setMemoryCards] = useState<{ id: number; text: string; matchId: number; flipped: boolean; matched: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  // For times table grid
  const [selectedTimesTable, setSelectedTimesTable] = useState(7);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const gameInfo = t.games[game.id] || {
    title: game.id,
    desc: 'Mathematics mini-game',
    instructions: 'Solve the problems accurately to score points.',
  };

  // Helper to shuffle
  const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

  // Generate question tailored to game id and difficulty
  const generateGameQuestion = (): MiniQuestion => {
    const diffMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : difficulty === 'hard' ? 4 : 8;

    switch (game.id) {
      case 'addition': {
        const a = Math.floor(Math.random() * (15 * diffMultiplier)) + 3;
        const b = Math.floor(Math.random() * (15 * diffMultiplier)) + 3;
        const ans = a + b;
        const opts = shuffle([ans.toString(), (ans + 2).toString(), (ans - 3).toString(), (ans + 10).toString()]);
        return {
          prompt: `${a} + ${b} = ?`,
          options: opts,
          correct: ans.toString(),
          explanation: `${a} + ${b} = ${ans}`,
        };
      }

      case 'subtraction': {
        const a = Math.floor(Math.random() * (20 * diffMultiplier)) + 10;
        const b = Math.floor(Math.random() * a) + 1;
        const ans = a - b;
        const opts = shuffle([ans.toString(), (ans + 1).toString(), (ans - 2).toString(), (ans + 5).toString()]);
        return {
          prompt: `${a} - ${b} = ?`,
          options: opts,
          correct: ans.toString(),
          explanation: `${a} - ${b} = ${ans}`,
        };
      }

      case 'multiplication': {
        const a = Math.floor(Math.random() * (6 * diffMultiplier)) + 2;
        const b = Math.floor(Math.random() * 9) + 2;
        const ans = a * b;
        const opts = shuffle([ans.toString(), (ans + a).toString(), (ans - b).toString(), (ans + 4).toString()]);
        return {
          prompt: `${a} × ${b} = ?`,
          options: opts,
          correct: ans.toString(),
          explanation: `${a} × ${b} = ${ans}`,
        };
      }

      case 'division': {
        const b = Math.floor(Math.random() * (4 * diffMultiplier)) + 2;
        const ans = Math.floor(Math.random() * 9) + 2;
        const a = b * ans;
        const opts = shuffle([ans.toString(), (ans + 1).toString(), (ans - 1).toString(), (ans + 3).toString()]);
        return {
          prompt: `${a} ÷ ${b} = ?`,
          options: opts,
          correct: ans.toString(),
          explanation: `${a} ÷ ${b} = ${ans}`,
        };
      }

      case 'sequence': {
        const step = Math.floor(Math.random() * (3 * diffMultiplier)) + 2;
        const start = Math.floor(Math.random() * 20) + 1;
        const seq = [start, start + step, start + step * 2, start + step * 3];
        const nextNum = start + step * 4;
        const opts = shuffle([nextNum.toString(), (nextNum + step).toString(), (nextNum - 1).toString(), (nextNum + 2).toString()]);
        return {
          prompt: `Find next number: ${seq.join(', ')}, ?`,
          options: opts,
          correct: nextNum.toString(),
          explanation: `The sequence increases by +${step} each time. Next is ${nextNum}.`,
        };
      }

      case 'missingNumber': {
        const a = Math.floor(Math.random() * (15 * diffMultiplier)) + 5;
        const hidden = Math.floor(Math.random() * 15) + 3;
        const total = a + hidden;
        const opts = shuffle([hidden.toString(), (hidden + 1).toString(), (hidden - 2).toString(), (hidden + 4).toString()]);
        return {
          prompt: `${a} + ❓ = ${total}`,
          options: opts,
          correct: hidden.toString(),
          explanation: `${total} - ${a} = ${hidden}`,
        };
      }

      case 'speedMath': {
        const ops = ['+', '-', '×'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        let a = Math.floor(Math.random() * 15) + 2;
        let b = Math.floor(Math.random() * 10) + 2;
        let ans = 0;
        if (op === '+') ans = a + b;
        else if (op === '-') {
          if (b > a) [a, b] = [b, a];
          ans = a - b;
        } else {
          a = Math.min(a, 9);
          b = Math.min(b, 9);
          ans = a * b;
        }
        const opts = shuffle([ans.toString(), (ans + 1).toString(), (ans - 2).toString(), (ans + 3).toString()]);
        return {
          prompt: `${a} ${op} ${b} = ?`,
          options: opts,
          correct: ans.toString(),
          explanation: `${a} ${op} ${b} = ${ans}`,
        };
      }

      case 'mentalMath': {
        const n1 = Math.floor(Math.random() * 10) + 5;
        const n2 = Math.floor(Math.random() * 8) + 2;
        const n3 = Math.floor(Math.random() * 5) + 1;
        const ans = n1 + n2 - n3;
        const opts = shuffle([ans.toString(), (ans + 2).toString(), (ans - 2).toString(), (ans + 5).toString()]);
        return {
          prompt: `Think: Start with ${n1}, add ${n2}, then subtract ${n3}`,
          options: opts,
          correct: ans.toString(),
          explanation: `${n1} + ${n2} = ${n1 + n2}, minus ${n3} = ${ans}`,
        };
      }

      case 'shapes': {
        const shapeBank = [
          { name: 'Hexagon', desc: 'Polygon with exactly 6 sides and 6 angles' },
          { name: 'Pentagon', desc: 'Polygon with exactly 5 straight sides' },
          { name: 'Right Triangle', desc: 'Triangle containing one 90-degree angle' },
          { name: 'Equilateral Triangle', desc: 'Triangle where all 3 sides are equal' },
          { name: 'Trapezoid', desc: 'Quadrilateral with only one pair of parallel sides' },
        ];
        const pickShape = shapeBank[Math.floor(Math.random() * shapeBank.length)];
        const opts = shuffle([pickShape.name, 'Decagon', 'Rhombus', 'Octagon']);
        return {
          prompt: `Identify the shape: "${pickShape.desc}"`,
          options: opts,
          correct: pickShape.name,
          explanation: `${pickShape.name}: ${pickShape.desc}`,
        };
      }

      case 'fractionPuzzle': {
        const fracList = [
          { q: 'Which fraction is equivalent to 1/2?', a: '2/4', wrong: ['2/5', '1/3', '3/8'] },
          { q: 'Which fraction is equivalent to 3/4?', a: '6/8', wrong: ['4/6', '3/5', '5/8'] },
          { q: 'Simplify the fraction 4/12:', a: '1/3', wrong: ['1/4', '2/5', '1/6'] },
          { q: 'Which is larger: 3/5 or 2/5?', a: '3/5', wrong: ['2/5', 'They are equal', 'Neither'] },
        ];
        const item = fracList[Math.floor(Math.random() * fracList.length)];
        return {
          prompt: item.q,
          options: shuffle([item.a, ...item.wrong]),
          correct: item.a,
          explanation: `Correct equivalence is ${item.a}.`,
        };
      }

      case 'equationSolver': {
        const a = Math.floor(Math.random() * 4) + 2;
        const x = Math.floor(Math.random() * 8) + 2;
        const b = Math.floor(Math.random() * 10) + 1;
        const c = a * x + b;
        const opts = shuffle([x.toString(), (x + 1).toString(), (x - 1).toString(), (x * 2).toString()]);
        return {
          prompt: `Solve for x: ${a}x + ${b} = ${c}`,
          options: opts,
          correct: x.toString(),
          explanation: `${a}x = ${c - b} ⇒ x = ${x}`,
        };
      }

      case 'riddles': {
        const riddles = [
          { q: 'I am an odd number. Take away one letter and I become even. What number am I?', a: 'Seven', wrong: ['Nine', 'Eleven', 'Five'], exp: 'SEVEN minus "S" is EVEN!' },
          { q: 'How many times can you subtract 5 from 25?', a: '1 time', wrong: ['5 times', '4 times', 'Unlimited'], exp: 'Only once! After that, you are subtracting 5 from 20.' },
          { q: 'Which number does NOT have its own Roman numeral?', a: 'Zero (0)', wrong: ['One', 'Ten', 'Fifty'], exp: 'Romans had no symbol for zero.' },
        ];
        const item = riddles[Math.floor(Math.random() * riddles.length)];
        return {
          prompt: item.q,
          options: shuffle([item.a, ...item.wrong]),
          correct: item.a,
          explanation: item.exp,
        };
      }

      case 'geometry': {
        const s = Math.floor(Math.random() * 8) + 4;
        const isArea = Math.random() > 0.5;
        const val = isArea ? s * s : 4 * s;
        const opts = shuffle([val.toString(), (val + 4).toString(), (val - 3).toString(), (s * 2).toString()]);
        return {
          prompt: isArea ? `Area of a square with side ${s} cm:` : `Perimeter of a square with side ${s} cm:`,
          options: opts,
          correct: val.toString(),
          explanation: isArea ? `Area = side² = ${s} × ${s} = ${val} cm²` : `Perimeter = 4 × side = 4 × ${s} = ${val} cm`,
        };
      }

      default: {
        const a = Math.floor(Math.random() * 12) + 1;
        const b = selectedTimesTable;
        const ans = a * b;
        const opts = shuffle([ans.toString(), (ans + b).toString(), (ans - b).toString(), (ans + 3).toString()]);
        return {
          prompt: `${a} × ${b} = ?`,
          options: opts,
          correct: ans.toString(),
          explanation: `${a} × ${b} = ${ans}`,
        };
      }
    }
  };

  // Initialize Memory Game Cards
  const initMemoryGame = () => {
    const pairs = [
      { expr: '3 × 4', val: '12' },
      { expr: '7 + 8', val: '15' },
      { expr: '20 - 6', val: '14' },
      { expr: '4 × 5', val: '20' },
      { expr: '30 ÷ 5', val: '6' },
      { expr: '9 × 2', val: '18' },
    ];
    const cards: typeof memoryCards = [];
    pairs.forEach((p, idx) => {
      cards.push({ id: idx * 2, text: p.expr, matchId: idx, flipped: false, matched: false });
      cards.push({ id: idx * 2 + 1, text: p.val, matchId: idx, flipped: false, matched: false });
    });
    setMemoryCards(shuffle(cards));
    setFlippedCards([]);
  };

  // Handle memory card flip
  const handleCardClick = (id: number) => {
    if (flippedCards.length >= 2) return;
    const clicked = memoryCards.find((c) => c.id === id);
    if (!clicked || clicked.flipped || clicked.matched) return;

    sound.playClick();
    const updated = memoryCards.map((c) => (c.id === id ? { ...c, flipped: true } : c));
    setMemoryCards(updated);
    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const card1 = memoryCards.find((c) => c.id === newFlipped[0])!;
      const card2 = memoryCards.find((c) => c.id === newFlipped[1])!;

      if (card1.matchId === card2.matchId) {
        sound.playCorrect();
        setTimeout(() => {
          setMemoryCards((prev) =>
            prev.map((c) => (c.matchId === card1.matchId ? { ...c, matched: true } : c))
          );
          setFlippedCards([]);
          setScore((prev) => prev + 20);

          // Check if all matched
          const remaining = updated.filter((c) => !c.matched && c.matchId !== card1.matchId);
          if (remaining.length === 0) {
            endGame(score + 50);
          }
        }, 500);
      } else {
        sound.playWrong();
        setTimeout(() => {
          setMemoryCards((prev) =>
            prev.map((c) => (c.id === newFlipped[0] || c.id === newFlipped[1] ? { ...c, flipped: false } : c))
          );
          setFlippedCards([]);
        }, 900);
      }
    }
  };

  const startGame = () => {
    sound.playClick();
    setScore(0);
    setQuestionCount(0);
    setGameState('playing');
    setTimeLeft(game.id === 'speedMath' ? 60 : 30);
    setSelectedOption(null);
    setFeedback(null);

    if (game.id === 'memory') {
      initMemoryGame();
    } else {
      setCurrentQ(generateGameQuestion());
    }
  };

  const endGame = (finalScore: number) => {
    setGameState('ended');
    sound.playVictory();
    triggerConfetti();
    recordGamePlayed();
    addPoints(finalScore);
  };

  // Timer loop for Speed Math or timed mode
  useEffect(() => {
    if (gameState === 'playing' && game.id === 'speedMath') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            endGame(score);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, game.id, score]);

  const handleAnswer = (option: string) => {
    if (feedback !== null || !currentQ) return;
    setSelectedOption(option);

    const isCorrect = option === currentQ.correct;
    if (isCorrect) {
      sound.playCorrect();
      setFeedback('correct');
      setScore((prev) => prev + 10);
    } else {
      sound.playWrong();
      setFeedback('wrong');
    }

    setTimeout(() => {
      const nextCount = questionCount + 1;
      setQuestionCount(nextCount);
      setSelectedOption(null);
      setFeedback(null);

      if (game.id !== 'speedMath' && nextCount >= 10) {
        endGame(score + (isCorrect ? 10 : 0));
      } else {
        setCurrentQ(generateGameQuestion());
      }
    }, 900);
  };

  // INTRO SCREEN
  if (gameState === 'intro') {
    const Icon = game.icon;
    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-12">
        <button
          onClick={onExit}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 hover:text-indigo-600 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>Back to All Games</span>
        </button>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6 text-center">
          <div
            className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr ${game.gradient} text-white flex items-center justify-center shadow-lg`}
          >
            <Icon className="w-10 h-10" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{gameInfo.title}</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto">
              {gameInfo.desc}
            </p>
          </div>

          {/* Times Table Selector if timesTables game */}
          {game.id === 'timesTables' && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-2">
                Choose Times Table to Master (1 - 20):
              </span>
              <div className="flex flex-wrap justify-center gap-1.5">
                {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      sound.playClick();
                      setSelectedTimesTable(n);
                    }}
                    className={`w-9 h-9 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                      selectedTimesTable === n
                        ? 'bg-emerald-600 text-white shadow-xs scale-105'
                        : 'wood-tile-3d hover:brightness-105'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Difficulty selector */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Select Difficulty Level
            </span>
            <div className="flex items-center justify-center gap-2">
              {game.difficultyOptions.map((diff) => (
                <button
                  key={diff}
                  onClick={() => {
                    sound.playClick();
                    setDifficulty(diff);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black capitalize transition-all cursor-pointer ${
                    difficulty === diff
                      ? 'gold-btn-3d text-amber-950 scale-105'
                      : 'wood-btn-3d text-amber-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Instructions Box */}
          <div className="wood-board-inner p-3.5 text-xs sm:text-sm text-amber-200 leading-relaxed text-start border border-amber-800">
            <strong className="text-amber-100 block mb-1">How to Play:</strong>
            {gameInfo.instructions}
          </div>

          <button
            onClick={startGame}
            className="w-full py-3.5 px-6 green-btn-3d rounded-2xl text-white font-black text-base shadow-lg transition-all cursor-pointer"
          >
            {t.common.start} Game
          </button>
        </div>
      </div>
    );
  }

  // ENDED SCREEN
  if (gameState === 'ended') {
    return (
      <div className="max-w-md mx-auto space-y-4 pb-12 text-center select-none">
        <div className="wood-board-3d p-6 sm:p-8 space-y-5 shadow-2xl relative">
          <div className="w-18 h-18 mx-auto rounded-3xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-lg border-2 border-yellow-200 animate-bounce">
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <span className="gold-badge text-[10px] px-2.5 py-0.5 rounded-full uppercase">
              Game Over
            </span>
            <h2 className="text-2xl font-black text-amber-100 drop-shadow-md mt-1">Awesome Job!</h2>
            <p className="text-xs text-amber-300 mt-0.5">{gameInfo.title}</p>
          </div>

          <div className="wood-board-inner p-4 space-y-1 border border-amber-800">
            <div className="text-[10px] uppercase font-bold text-amber-300">Final Score</div>
            <div className="text-3xl font-black text-yellow-300">{score}</div>
            <div className="text-xs font-bold text-emerald-400">+{score} Points Added to Profile</div>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              onClick={startGame}
              className="flex-1 green-btn-3d py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.common.playAgain}</span>
            </button>
            <button
              onClick={onExit}
              className="flex-1 wood-btn-3d py-3 rounded-xl font-bold text-xs sm:text-sm cursor-pointer"
            >
              {t.common.exit}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // MEMORY GAME PLAYING
  if (game.id === 'memory') {
    return (
      <div className="max-w-md mx-auto space-y-4 pb-12 select-none">
        <div className="wood-board-3d p-3 flex items-center justify-between shadow-md">
          <button onClick={onExit} className="wood-btn-3d px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer">
            ← Exit
          </button>
          <div className="font-black text-sm text-amber-100">{gameInfo.title}</div>
          <div className="gold-btn-3d px-3 py-1 rounded-xl text-xs font-black">Score: {score}</div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 p-3 wood-board-3d shadow-xl">
          {memoryCards.map((card) => {
            const isRevealed = card.flipped || card.matched;
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={isRevealed}
                className={`h-22 sm:h-24 rounded-2xl font-black text-base flex items-center justify-center p-2 cursor-pointer shadow-md transition-all ${
                  card.matched
                    ? 'wood-tile-3d wood-tile-correct'
                    : isRevealed
                    ? 'wood-tile-3d wood-tile-pressed'
                    : 'wood-tile-3d hover:scale-102'
                }`}
              >
                {isRevealed ? <span className="math-symbol drop-shadow-sm">{card.text}</span> : <Sparkles className="w-6 h-6 text-amber-200" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // STANDARD PLAYING SCREEN (Speed Math, Arithmetic, Sequence, Shapes, etc.)
  return (
    <div className="max-w-md mx-auto min-h-[calc(100vh-6rem)] flex flex-col justify-between py-2 sm:py-4 px-2 select-none">
      {/* Header bar */}
      <div className="wood-board-3d p-3 shadow-md flex items-center justify-between gap-2 mb-3">
        <button onClick={onExit} className="wood-btn-3d px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer">
          ← Exit
        </button>

        <div className="flex items-center gap-2">
          {game.id === 'speedMath' && (
            <div className="wood-panel-3d px-2.5 py-1 text-white text-xs font-mono font-bold flex items-center gap-1 border border-amber-800">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{timeLeft}s</span>
            </div>
          )}
          <div className="gold-btn-3d px-3 py-1.5 rounded-xl text-xs font-black">Score: {score}</div>
        </div>
      </div>

      {/* Middle Question Board */}
      {currentQ && (
        <div className="my-auto space-y-4">
          <div className="wood-board-3d p-4 sm:p-6 text-center relative shadow-2xl">
            <div className="absolute top-2.5 left-2.5 brass-rivet" />
            <div className="absolute top-2.5 right-2.5 brass-rivet" />
            <div className="absolute bottom-2.5 left-2.5 brass-rivet" />
            <div className="absolute bottom-2.5 right-2.5 brass-rivet" />

            <div className="wood-board-inner p-5 sm:p-7 min-h-[140px] flex flex-col items-center justify-center">
              <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider mb-1">
                Problem #{questionCount + 1}
              </span>

              <div className="text-xl sm:text-2xl md:text-3xl font-black text-amber-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] math-symbol leading-snug">
                {currentQ.prompt}
              </div>
            </div>
          </div>

          {/* 4 Wooden Answer Tiles */}
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === currentQ.correct;

              let tileClass = 'wood-tile-3d';
              if (feedback !== null) {
                if (isCorrect) {
                  tileClass = 'wood-tile-3d wood-tile-correct';
                } else if (isSelected && !isCorrect) {
                  tileClass = 'wood-tile-3d wood-tile-wrong';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt)}
                  disabled={feedback !== null}
                  className={`min-h-[72px] sm:min-h-[82px] rounded-2xl text-lg sm:text-xl font-black flex items-center justify-center p-3 cursor-pointer shadow-lg active:scale-95 transition-all ${tileClass}`}
                >
                  <span className="math-symbol drop-shadow-sm">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Instant feedback badge */}
          {feedback && (
            <div
              className={`p-3 rounded-xl border text-xs sm:text-sm font-bold text-center ${
                feedback === 'correct'
                  ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500'
                  : 'bg-rose-950/90 text-rose-200 border-rose-500'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1 font-black">
                {feedback === 'correct' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Correct! (+10)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>{currentQ.explanation}</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
