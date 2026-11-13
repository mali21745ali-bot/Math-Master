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
  Sparkles,
} from 'lucide-react';

interface GameRunnerProps {
  game: GameDefinition;
  onExit: () => void;
}

interface MiniQuestion {
  promptEn: string;
  promptUr: string;
  options: string[];
  correct: string;
  explanationEn: string;
  explanationUr: string;
  isMathOnly?: boolean;
}

const buildUnique = (correct: string, candidates: string[]): string[] => {
  const seen = new Set<string>([correct]);
  const out = [correct];
  for (const c of candidates) {
    if (!seen.has(c)) {
      seen.add(c);
      out.push(c);
    }
    if (out.length === 4) break;
  }
  let bump = 1;
  while (out.length < 4) {
    const val = (Number(correct) || 10) + bump;
    const s = val.toString();
    if (!seen.has(s)) {
      seen.add(s);
      out.push(s);
    }
    bump++;
  }
  return [...out].sort(() => Math.random() - 0.5);
};

export const GameRunner: React.FC<GameRunnerProps> = ({ game, onExit }) => {
  const { t, isUrdu, recordGamePlayed, addPoints, triggerConfetti } = useApp();

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

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scoreRef = useRef(0);
  const hasEndedRef = useRef(false);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  const gameInfo = t.games[game.id] || {
    title: game.id,
    desc: isUrdu ? 'ریاضی کا منی گیم' : 'Mathematics mini-game',
    instructions: isUrdu ? 'پوائنٹس حاصل کرنے کے لیے درست جواب دیں۔' : 'Solve the problems accurately to score points.',
  };

  const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

  const generateGameQuestion = (): MiniQuestion => {
    const diffMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : difficulty === 'hard' ? 4 : 8;

    switch (game.id) {
      case 'shapes': {
        const shapeBank = [
          {
            nameEn: 'Hexagon',
            nameUr: 'مسدس (Hexagon)',
            descEn: 'Polygon with exactly 6 sides and 6 angles',
            descUr: '6 اضلاع اور 6 زاویوں والی بند شکل',
          },
          {
            nameEn: 'Pentagon',
            nameUr: 'مخمس (Pentagon)',
            descEn: 'Polygon with exactly 5 straight sides',
            descUr: 'بالکل 5 سیدھے اضلاع والی شکل',
          },
          {
            nameEn: 'Right Triangle',
            nameUr: 'قائمہ مثلث',
            descEn: 'Triangle containing one 90-degree angle',
            descUr: 'ایسی مثلث جس میں ایک 90 ڈگری کا زاویہ ہو',
          },
          {
            nameEn: 'Equilateral Triangle',
            nameUr: 'متساوی الاضلاع مثلث',
            descEn: 'Triangle where all 3 sides are equal',
            descUr: 'ایسی مثلث جس کے تینوں اضلاع برابر ہوں',
          },
          {
            nameEn: 'Trapezoid',
            nameUr: 'ذوزنقہ (Trapezoid)',
            descEn: 'Quadrilateral with one pair of parallel sides',
            descUr: 'چوکون جس کے صرف دو مخالف اضلاع متوازی ہوں',
          },
          {
            nameEn: 'Octagon',
            nameUr: 'مثمن (Octagon)',
            descEn: 'Polygon with 8 straight sides',
            descUr: '8 سیدھے اضلاع والی بند شکل',
          },
        ];
        const pickShape = shapeBank[Math.floor(Math.random() * shapeBank.length)];
        const pool = shapeBank.filter((s) => s.nameEn !== pickShape.nameEn);
        const pickedWrong = shuffle(pool).slice(0, 3);
        const ans = isUrdu ? pickShape.nameUr : pickShape.nameEn;
        const opts = shuffle([ans, ...pickedWrong.map((w) => (isUrdu ? w.nameUr : w.nameEn))]);
        return {
          promptEn: `Identify the shape: "${pickShape.descEn}"`,
          promptUr: `شکل پہچانیں: "${pickShape.descUr}"`,
          options: opts,
          correct: ans,
          explanationEn: `${pickShape.nameEn}: ${pickShape.descEn}`,
          explanationUr: `${pickShape.nameUr}: ${pickShape.descUr}`,
        };
      }

      case 'riddles': {
        const riddles = [
          {
            qEn: 'I am an odd number. Take away the first letter and I become even. What number am I?',
            qUr: 'میں ایک طاق عدد ہوں، اگر میرا پہلا انگریزی حرف (S) ہٹا دیں تو میں "even" بن جاتا ہوں۔ میں کون ہوں؟',
            aEn: 'Seven',
            aUr: 'Seven (7)',
            wEn: ['Nine', 'Eleven', 'Five'],
            wUr: ['Nine (9)', 'Eleven (11)', 'Five (5)'],
            eEn: 'SEVEN minus "S" becomes EVEN!',
            eUr: 'SEVEN سے "S" ہٹانے پر EVEN بنتا ہے!',
          },
          {
            qEn: 'How many times can you subtract 5 from 25?',
            qUr: 'آپ 25 میں سے 5 کتنی بار تفریق کر سکتے ہیں (پھر وہ 25 نہیں رہے گا)؟',
            aEn: '1 time',
            aUr: 'صرف 1 بار',
            wEn: ['5 times', '4 times', 'Unlimited'],
            wUr: ['5 بار', '4 بار', 'لامحدود'],
            eEn: 'Only once! After that, you are subtracting 5 from 20.',
            eUr: 'صرف ایک بار! اس کے بعد آپ 20 میں سے 5 تفریق کر رہے ہوں گے۔',
          },
          {
            qEn: 'Which number does NOT have a Roman numeral symbol?',
            qUr: 'کون سے عدد کی رومن گنتی میں کوئی علامت نہیں ہے؟',
            aEn: 'Zero (0)',
            aUr: 'صفر (0)',
            wEn: ['One (1)', 'Ten (10)', 'Fifty (50)'],
            wUr: ['ایک (1)', 'دس (10)', 'پچاس (50)'],
            eEn: 'Roman numerals have no symbol for zero.',
            eUr: 'رومن اعداد میں صفر کے لیے کوئی علامت موجود نہیں ہے۔',
          },
          {
            qEn: 'What is half of 2 plus 2?',
            qUr: '2 کا آدھا جمع 2 کتنا ہوتا ہے؟',
            aEn: '3',
            aUr: '3',
            wEn: ['2', '4', '1'],
            wUr: ['2', '4', '1'],
            eEn: 'Half of 2 is 1, and 1 + 2 = 3.',
            eUr: '2 کا آدھا 1 ہے، اور 1 + 2 = 3۔',
          },
        ];
        const item = riddles[Math.floor(Math.random() * riddles.length)];
        const correct = isUrdu ? item.aUr : item.aEn;
        const wrong = isUrdu ? item.wUr : item.wEn;
        return {
          promptEn: item.qEn,
          promptUr: item.qUr,
          options: shuffle([correct, ...wrong]),
          correct,
          explanationEn: item.eEn,
          explanationUr: item.eUr,
        };
      }

      case 'geometry': {
        const scale = Math.min(3, diffMultiplier);
        const s = Math.floor(Math.random() * (6 * scale)) + 3;
        const isArea = Math.random() > 0.5;
        const val = isArea ? s * s : 4 * s;
        const opts = buildUnique(val.toString(), [(val + 4).toString(), Math.max(2, val - 3).toString(), (s * 2 + 1).toString()]);
        return {
          promptEn: isArea ? `Area of a square with side ${s} cm:` : `Perimeter of a square with side ${s} cm:`,
          promptUr: isArea ? `${s} سینٹی میٹر ضلع والے مربع کا رقبہ (Area):` : `${s} سینٹی میٹر ضلع والے مربع کا احاطہ (Perimeter):`,
          options: opts,
          correct: val.toString(),
          explanationEn: isArea ? `Area = side² = ${s} × ${s} = ${val} cm²` : `Perimeter = 4 × side = 4 × ${s} = ${val} cm`,
          explanationUr: isArea ? `رقبہ = ضلع × ضلع = ${s} × ${s} = ${val} مربع سم` : `احاطہ = 4 × ضلع = 4 × ${s} = ${val} سم`,
        };
      }

      default: {
        const a = Math.floor(Math.random() * 12) + 1;
        const b = selectedTimesTable;
        const ans = a * b;
        const opts = buildUnique(ans.toString(), [(ans + b).toString(), Math.max(1, ans - b).toString(), (ans + 3).toString()]);
        return {
          promptEn: `${a} × ${b} = ?`,
          promptUr: `${a} × ${b} = ؟`,
          options: opts,
          correct: ans.toString(),
          explanationEn: `${a} × ${b} = ${ans}`,
          explanationUr: `${a} × ${b} = ${ans}`,
          isMathOnly: true,
        };
      }
    }
  };

  // Initialize Memory Game Cards
  const initMemoryGame = () => {
    const pairsEasy = [
      { expr: '3 × 4', val: '12' },
      { expr: '7 + 8', val: '15' },
      { expr: '20 - 6', val: '14' },
      { expr: '4 × 5', val: '20' },
      { expr: '30 ÷ 5', val: '6' },
      { expr: '9 × 2', val: '18' },
    ];
    const pairsHard = [
      { expr: '12 × 6', val: '72' },
      { expr: '48 ÷ 4', val: '12' },
      { expr: '29 + 17', val: '46' },
      { expr: '64 - 19', val: '45' },
      { expr: '7 × 8', val: '56' },
      { expr: '81 ÷ 9', val: '9' },
    ];
    const pairs = difficulty === 'hard' || difficulty === 'expert' ? pairsHard : pairsEasy;
    const cards: typeof memoryCards = [];
    pairs.forEach((p, idx) => {
      cards.push({ id: idx * 2, text: p.expr, matchId: idx, flipped: false, matched: false });
      cards.push({ id: idx * 2 + 1, text: p.val, matchId: idx, flipped: false, matched: false });
    });
    setMemoryCards(shuffle(cards));
    setFlippedCards([]);
  };

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
      const card1 = updated.find((c) => c.id === newFlipped[0])!;
      const card2 = updated.find((c) => c.id === newFlipped[1])!;

      if (card1.matchId === card2.matchId) {
        sound.playCorrect();
        setTimeout(() => {
          setMemoryCards((prev) =>
            prev.map((c) => (c.matchId === card1.matchId ? { ...c, matched: true } : c))
          );
          setFlippedCards([]);
          const nextScore = scoreRef.current + 20;
          setScore(nextScore);

          const remaining = updated.filter((c) => !c.matched && c.matchId !== card1.matchId);
          if (remaining.length === 0) {
            endGame(nextScore + 30);
          }
        }, 450);
      } else {
        sound.playWrong();
        setTimeout(() => {
          setMemoryCards((prev) =>
            prev.map((c) => (c.id === newFlipped[0] || c.id === newFlipped[1] ? { ...c, flipped: false } : c))
          );
          setFlippedCards([]);
        }, 850);
      }
    }
  };

  const startGame = () => {
    sound.playClick();
    hasEndedRef.current = false;
    scoreRef.current = 0;
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
    if (hasEndedRef.current) return;
    hasEndedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState('ended');
    sound.playVictory();
    triggerConfetti();
    recordGamePlayed();
    addPoints(finalScore);
  };

  useEffect(() => {
    if (gameState === 'playing' && game.id === 'speedMath') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, game.id]);

  useEffect(() => {
    if (gameState === 'playing' && game.id === 'speedMath' && timeLeft === 0) {
      endGame(scoreRef.current);
    }
  }, [timeLeft, gameState, game.id]);

  const handleAnswer = (option: string) => {
    if (feedback !== null || !currentQ) return;
    setSelectedOption(option);

    const isCorrect = option === currentQ.correct;
    const nextScore = isCorrect ? score + 10 : score;
    if (isCorrect) {
      sound.playCorrect();
      setFeedback('correct');
      setScore(nextScore);
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
        endGame(nextScore);
      } else {
        setCurrentQ(generateGameQuestion());
      }
    }, 900);
  };

  const difficultyLabel = (d: Difficulty) => {
    if (!isUrdu) return d;
    if (d === 'easy') return 'آسان';
    if (d === 'medium') return 'درمیانہ';
    if (d === 'hard') return 'مشکل';
    return 'ماہر';
  };

  // INTRO SCREEN (Matching 3D Wooden Puzzle Aesthetics)
  if (gameState === 'intro') {
    const Icon = game.icon;
    return (
      <div className="max-w-2xl mx-auto space-y-5 pb-12 select-none">
        <button
          onClick={onExit}
          className="wood-btn-3d px-3.5 py-2 flex items-center gap-2 text-xs font-black cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{isUrdu ? 'تمام گیمز پر واپس جائیں' : 'Back to All Games'}</span>
        </button>

        <div className="wood-board-3d p-6 sm:p-9 shadow-2xl space-y-6 text-center relative">
          <div className="brass-rivet top-2.5 left-2.5" />
          <div className="brass-rivet top-2.5 right-2.5" />
          <div className="brass-rivet bottom-2.5 left-2.5" />
          <div className="brass-rivet bottom-2.5 right-2.5" />

          <div
            className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr ${game.gradient} text-white flex items-center justify-center shadow-lg border-2 border-amber-300`}
          >
            <Icon className="w-10 h-10" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-amber-100 drop-shadow-md">
              {gameInfo.title}
            </h1>
            <p className="text-xs sm:text-sm text-amber-200/90 mt-2 max-w-md mx-auto">
              {gameInfo.desc}
            </p>
          </div>

          {game.id === 'timesTables' && (
            <div className="wood-board-inner p-4 border border-amber-800">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block mb-2">
                {isUrdu ? 'پہاڑا منتخب کریں (1 - 20):' : 'Choose Times Table to Master (1 - 20):'}
              </span>
              <div className="flex flex-wrap justify-center gap-1.5" dir="ltr">
                {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      sound.playClick();
                      setSelectedTimesTable(n);
                    }}
                    className={`w-9 h-9 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                      selectedTimesTable === n
                        ? 'gold-btn-3d text-amber-950 shadow-xs scale-105'
                        : 'wood-tile-3d hover:brightness-105'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
              {isUrdu ? 'مشکل کا درجہ منتخب کریں' : 'Select Difficulty Level'}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
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
                  {difficultyLabel(diff)}
                </button>
              ))}
            </div>
          </div>

          <div className="wood-board-inner p-3.5 text-xs sm:text-sm text-amber-200 leading-relaxed text-start border border-amber-800">
            <strong className="text-amber-100 block mb-1">
              {isUrdu ? 'کھیلنے کا طریقہ:' : 'How to Play:'}
            </strong>
            {gameInfo.instructions}
          </div>

          <button
            onClick={startGame}
            className="w-full py-3.5 px-6 green-btn-3d rounded-2xl text-white font-black text-base shadow-lg transition-all cursor-pointer"
          >
            {isUrdu ? `${t.common.start}` : `${t.common.start} Game`}
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
              {isUrdu ? 'کھیل مکمل' : 'Game Over'}
            </span>
            <h2 className="text-2xl font-black text-amber-100 drop-shadow-md mt-1">
              {isUrdu ? 'شاندار کارکردگی!' : 'Awesome Job!'}
            </h2>
            <p className="text-xs text-amber-300 mt-0.5">{gameInfo.title}</p>
          </div>

          <div className="wood-board-inner p-4 space-y-1 border border-amber-800">
            <div className="text-[10px] uppercase font-bold text-amber-300">
              {isUrdu ? 'حتمی اسکور' : 'Final Score'}
            </div>
            <div className="text-3xl font-black text-yellow-300">{score}</div>
            <div className="text-xs font-bold text-emerald-400">
              {isUrdu ? `+${score} پوائنٹس پروفائل میں شامل ہو گئے` : `+${score} Points Added to Profile`}
            </div>
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
          <button onClick={onExit} className="wood-btn-3d px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
            <span>{t.common.exit}</span>
          </button>
          <div className="font-black text-sm text-amber-100">{gameInfo.title}</div>
          <div className="gold-btn-3d px-3 py-1 rounded-xl text-xs font-black">
            {t.common.score}: {score}
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 p-3 wood-board-3d shadow-xl" dir="ltr">
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
                {isRevealed ? (
                  <span className="math-symbol drop-shadow-sm" dir="ltr">{card.text}</span>
                ) : (
                  <Sparkles className="w-6 h-6 text-amber-200" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // STANDARD PLAYING SCREEN
  return (
    <div className="max-w-md mx-auto min-h-[calc(100vh-6rem)] flex flex-col justify-between py-2 sm:py-4 px-2 select-none">
      <div className="wood-board-3d p-3 shadow-md flex items-center justify-between gap-2 mb-3">
        <button onClick={onExit} className="wood-btn-3d px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
          <span>{t.common.exit}</span>
        </button>

        <div className="flex items-center gap-2">
          {game.id === 'speedMath' && (
            <div className="wood-panel-3d px-2.5 py-1 text-white text-xs font-mono font-bold flex items-center gap-1 border border-amber-800" dir="ltr">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{timeLeft}s</span>
            </div>
          )}
          <div className="gold-btn-3d px-3 py-1.5 rounded-xl text-xs font-black">
            {t.common.score}: {score}
          </div>
        </div>
      </div>

      {currentQ && (
        <div className="my-auto space-y-4">
          <div className="wood-board-3d p-4 sm:p-6 text-center relative shadow-2xl">
            <div className="absolute top-2.5 left-2.5 brass-rivet" />
            <div className="absolute top-2.5 right-2.5 brass-rivet" />
            <div className="absolute bottom-2.5 left-2.5 brass-rivet" />
            <div className="absolute bottom-2.5 right-2.5 brass-rivet" />

            <div className="question-display-box p-5 sm:p-8 min-h-[155px] flex flex-col items-center justify-center">
              <span className="text-xs font-black uppercase text-amber-200 tracking-wider mb-2">
                {isUrdu ? `سوال #${questionCount + 1} از 10` : `Problem #${questionCount + 1} of 10`}
              </span>

              <div
                className="question-display-text text-2xl sm:text-3xl md:text-4xl math-symbol"
                dir={currentQ.isMathOnly ? 'ltr' : undefined}
              >
                {isUrdu ? currentQ.promptUr : currentQ.promptEn}
              </div>
            </div>
          </div>

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
                  className={`min-h-[72px] sm:min-h-[82px] rounded-2xl text-base sm:text-xl font-black flex items-center justify-center p-3 cursor-pointer shadow-lg active:scale-95 transition-all ${tileClass}`}
                >
                  <span className="math-symbol drop-shadow-sm">{opt}</span>
                </button>
              );
            })}
          </div>

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
                    <span>{isUrdu ? 'درست! (+10)' : 'Correct! (+10)'}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>{isUrdu ? currentQ.explanationUr : currentQ.explanationEn}</span>
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
