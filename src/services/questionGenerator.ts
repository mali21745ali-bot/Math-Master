import { ClassLevel, Difficulty, QuestionType, QuizQuestion, GameMode } from '../types';

// Helper to pick random item
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
// Helper to generate integer range [min, max] inclusive
const randInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to shuffle array
const shuffle = <T>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

// Helper to guarantee 4 unique options
const buildUniqueOptions = (
  correct: string,
  candidates: string[],
  fallback?: (step: number) => string
): string[] => {
  const seen = new Set<string>([correct]);
  const result: string[] = [correct];
  for (const c of candidates) {
    if (!seen.has(c)) {
      seen.add(c);
      result.push(c);
    }
    if (result.length === 4) break;
  }
  let step = 1;
  while (result.length < 4 && step < 40) {
    const numVal = Number(correct);
    const nextOpt = fallback
      ? fallback(step)
      : !Number.isNaN(numVal) && correct.trim() !== '' && !correct.includes('/')
      ? (numVal + (step % 2 === 0 ? step : -step)).toString()
      : `${correct} (${step})`;
    if (!seen.has(nextOpt)) {
      seen.add(nextOpt);
      result.push(nextOpt);
    }
    step++;
  }
  return shuffle(result);
};

export class QuestionGenerator {
  /**
   * Generate a set of questions tailored to classLevel, difficulty, and optional topic.
   */
  public static generateQuestions(
    classLevel: ClassLevel,
    difficulty: Difficulty,
    count: number = 10,
    topicFilter?: string
  ): QuizQuestion[] {
    if (topicFilter) {
      const topicMap: Record<string, GameMode> = {
        counting_numbers: 'addition',
        addition_subtraction: 'mixed',
        multiplication_division: 'multiplication',
        even_odd_ordering: 'sequence',
        fractions_decimals: 'fractions',
        percentages_ratios: 'mental_math',
        lcm_hcf: 'division',
        algebra_expressions: 'algebra',
        linear_equations: 'algebra',
        quadratic_equations: 'algebra',
        polynomials: 'algebra',
        matrices_determinants: 'algebra',
        abstract_algebra: 'algebra',
      };
      const mappedMode = topicMap[topicFilter];
      if (mappedMode) {
        const levelTier = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 5 : difficulty === 'hard' ? 8 : 10;
        return this.generateArithmeticQuestions(mappedMode, classLevel, levelTier, count);
      }
    }

    const list: QuizQuestion[] = [];
    const usedKeys = new Set<string>();

    let attempts = 0;
    while (list.length < count && attempts < count * 8) {
      attempts++;
      const q = this.generateSingleQuestion(classLevel, difficulty, topicFilter);
      const key = `${q.type}-${q.questionEn}`;
      if (!usedKeys.has(key)) {
        usedKeys.add(key);
        list.push(q);
      }
    }

    // If still short, backfill from curated fallback
    if (list.length < count) {
      const fallbacks = this.getCuratedBank(classLevel);
      for (const fb of fallbacks) {
        if (list.length >= count) break;
        if (!usedKeys.has(fb.questionEn)) {
          usedKeys.add(fb.questionEn);
          list.push(fb);
        }
      }
    }

    return list.slice(0, count);
  }

  private static generateSingleQuestion(
    classLevel: ClassLevel,
    difficulty: Difficulty,
    _topicFilter?: string
  ): QuizQuestion {
    // Branch generation based on student level
    switch (classLevel) {
      case 'nursery':
      case 'kg':
        return this.generateEarlyYearsQuestion(classLevel, difficulty);

      case 'class1':
      case 'class2':
      case 'class3':
        return this.generatePrimaryQuestion(classLevel, difficulty);

      case 'class4':
      case 'class5':
      case 'class6':
        return this.generateMiddleSchoolQuestion(classLevel, difficulty);

      case 'class7':
      case 'class8':
      case 'class9':
        return this.generateJuniorHighQuestion(classLevel, difficulty);

      case 'class10':
      case 'class11':
      case 'class12':
        return this.generateHighSchoolQuestion(classLevel, difficulty);

      case 'university':
        return this.generateUniversityQuestion(difficulty);

      default:
        return this.generatePrimaryQuestion('class2', difficulty);
    }
  }

  // --- NURSERY & KG GENERATOR (Ages 3-5) ---
  private static generateEarlyYearsQuestion(classLevel: ClassLevel, difficulty: Difficulty): QuizQuestion {
    const types: QuestionType[] = ['picture_based', 'mcq', 'missing_number', 'true_false'];
    const chosenType = pick(types);
    const id = `early-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const emojis = ['🍎', '⭐', '🎈', '🐱', '🚗', '🍓', '🧸', '🌸'];
    const emoji = pick(emojis);

    if (chosenType === 'picture_based') {
      const maxCount = classLevel === 'nursery' ? (difficulty === 'easy' ? 4 : 7) : 10;
      const count = randInt(1, maxCount);
      const display = Array(count).fill(emoji).join(' ');
      const options = shuffle([
        count.toString(),
        Math.max(1, count - 1).toString(),
        (count + 1).toString(),
        (count + 2).toString(),
      ]);

      return {
        id,
        type: 'picture_based',
        classLevel,
        topic: 'Counting',
        difficulty,
        visualEmoji: emoji,
        visualCount: count,
        questionEn: `Count the items: How many ${emoji} are there?`,
        questionUr: `اشیاء کو گنیں: یہاں کتنے ${emoji} ہیں؟`,
        optionsEn: options,
        optionsUr: options,
        correctAnswerEn: count.toString(),
        correctAnswerUr: count.toString(),
        explanationEn: `Counting each one by one: ${display} gives exactly ${count}.`,
        explanationUr: `ایک ایک کر کے گننے سے کل تعداد ${count} بنتی ہے۔`,
      };
    }

    if (chosenType === 'missing_number') {
      const start = randInt(1, classLevel === 'nursery' ? 5 : 12);
      const seq = [start, start + 1, start + 2, start + 3];
      const missingIdx = randInt(1, 2);
      const answer = seq[missingIdx].toString();
      const seqDisplay = seq.map((n, i) => (i === missingIdx ? '❓' : n)).join(', ');

      const options = shuffle([
        answer,
        (parseInt(answer) - 1).toString(),
        (parseInt(answer) + 1).toString(),
        (parseInt(answer) + 2).toString(),
      ]);

      return {
        id,
        type: 'missing_number',
        classLevel,
        topic: 'Number Sequence',
        difficulty,
        questionEn: `Which number comes next in the sequence? ${seqDisplay}`,
        questionUr: `ترتیب میں خالی جگہ (❓) پر کون سا عدد آئے گا؟ ${seqDisplay}`,
        optionsEn: options,
        optionsUr: options,
        correctAnswerEn: answer,
        correctAnswerUr: answer,
        explanationEn: `The numbers count upwards by 1: ${start}, ${start + 1}, ${start + 2}, ${start + 3}. The missing number is ${answer}.`,
        explanationUr: `اعداد 1 کے اضافے سے آگے بڑھ رہے ہیں: ${start}، ${start + 1}، ${start + 2}، ${start + 3}۔ گمشدہ عدد ${answer} ہے۔`,
      };
    }

    if (chosenType === 'true_false') {
      const a = randInt(1, 5);
      const b = randInt(1, 4);
      const isCorrect = Math.random() > 0.5;
      const claimedSum = isCorrect ? a + b : a + b + (Math.random() > 0.5 ? 1 : -1);

      return {
        id,
        type: 'true_false',
        classLevel,
        topic: 'Basic Addition',
        difficulty,
        questionEn: `Is this statement True or False? ${a} + ${b} = ${claimedSum}`,
        questionUr: `کیا یہ بیان درست (True) ہے یا غلط (False)؟ ${a} + ${b} = ${claimedSum}`,
        optionsEn: ['True', 'False'],
        optionsUr: ['درست (True)', 'غلط (False)'],
        correctAnswerEn: isCorrect ? 'True' : 'False',
        correctAnswerUr: isCorrect ? 'درست (True)' : 'غلط (False)',
        explanationEn: `${a} + ${b} actually equals ${a + b}. So the statement is ${isCorrect ? 'True' : 'False'}.`,
        explanationUr: `${a} + ${b} کا اصل جواب ${a + b} بنتا ہے۔ لہٰذا یہ بیان ${isCorrect ? 'درست' : 'غلط'} ہے۔`,
      };
    }

    // Default MCQ: Bigger vs Smaller
    const n1 = randInt(2, 9);
    const n2 = randInt(2, 9);
    const bigger = Math.max(n1, n2 === n1 ? n1 + 1 : n2);
    const smaller = Math.min(n1, n2 === n1 ? n1 - 1 : n2);

    return {
      id,
      type: 'mcq',
      classLevel,
      topic: 'Comparing Numbers',
      difficulty,
      questionEn: `Which number is BIGGER?`,
      questionUr: `ان دونوں میں سے کون سا عدد بڑا ہے؟`,
      optionsEn: [bigger.toString(), smaller.toString()],
      optionsUr: [bigger.toString(), smaller.toString()],
      correctAnswerEn: bigger.toString(),
      correctAnswerUr: bigger.toString(),
      explanationEn: `${bigger} is greater than ${smaller} (${bigger} > ${smaller}).`,
      explanationUr: `${bigger} عدد ${smaller} سے بڑا ہے (${bigger} > ${smaller})۔`,
    };
  }

  // --- PRIMARY GENERATOR (Classes 1 - 3) ---
  private static generatePrimaryQuestion(classLevel: ClassLevel, difficulty: Difficulty): QuizQuestion {
    const types: QuestionType[] = ['mcq', 'fill_blank', 'type_answer', 'complete_equation', 'word_problem'];
    const chosenType = pick(types);
    const id = `pri-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // Difficulty scaling
    const maxVal = classLevel === 'class1' ? 20 : classLevel === 'class2' ? 50 : 100;
    const op = classLevel === 'class1' ? pick(['+', '-']) : pick(['+', '-', '×']);

    if (op === '×') {
      const a = randInt(2, 9);
      const b = randInt(2, 9);
      const prod = a * b;
      const opts = shuffle([
        prod.toString(),
        (prod + a).toString(),
        (prod - b).toString(),
        (prod + 2).toString(),
      ]);

      if (chosenType === 'complete_equation') {
        return {
          id,
          type: 'complete_equation',
          classLevel,
          topic: 'Multiplication',
          difficulty,
          equationParts: { left: `${a} × ${b}`, op: '=', result: `${prod}` },
          questionEn: `Complete the multiplication: ${a} × ${b} = ?`,
          questionUr: `ضرب کا عمل مکمل کریں: ${a} × ${b} = ؟`,
          optionsEn: opts,
          optionsUr: opts,
          correctAnswerEn: prod.toString(),
          correctAnswerUr: prod.toString(),
          explanationEn: `${a} multiplied by ${b} means adding ${a}, ${b} times. ${a} × ${b} = ${prod}.`,
          explanationUr: `${a} کو ${b} بار جمع کرنے سے ضرب کا حاصل ${prod} بنتا ہے۔`,
        };
      }

      return {
        id,
        type: 'mcq',
        classLevel,
        topic: 'Multiplication',
        difficulty,
        questionEn: `What is ${a} × ${b}?`,
        questionUr: `${a} × ${b} کا حاصل ضرب کیا ہوگا؟`,
        optionsEn: opts,
        optionsUr: opts,
        correctAnswerEn: prod.toString(),
        correctAnswerUr: prod.toString(),
        explanationEn: `${a} × ${b} = ${prod}.`,
        explanationUr: `${a} ضرب ${b} برابر ہے ${prod} کے۔`,
      };
    }

    if (chosenType === 'word_problem') {
      const a = randInt(8, 25);
      const b = randInt(4, 15);
      const isAdd = Math.random() > 0.4;
      const ans = isAdd ? a + b : a - b;

      const qEn = isAdd
        ? `Ali has ${a} colorful marbles. His friend gave him ${b} more marbles. How many marbles does Ali have now?`
        : `Fatima baked ${a} cookies. She shared ${b} cookies with her classmates. How many cookies are left?`;

      const qUr = isAdd
        ? `علی کے پاس ${a} بنٹے (ماربلز) تھے۔ اس کے دوست نے اسے ${b} مزید بنٹے دیے۔ اب علی کے پاس کل کتنے بنٹے ہیں؟`
        : `فاطمہ نے ${a} بسکٹس بنائے۔ اس نے ${b} بسکٹس اپنی کلاس کو دے دیے۔ اب اس کے پاس کتنے بسکٹس بچے ہیں؟`;

      const opts = shuffle([
        ans.toString(),
        (ans + 2).toString(),
        (ans - 3).toString(),
        (ans + 5).toString(),
      ]);

      return {
        id,
        type: 'word_problem',
        classLevel,
        topic: isAdd ? 'Addition Word Problem' : 'Subtraction Word Problem',
        difficulty,
        questionEn: qEn,
        questionUr: qUr,
        optionsEn: opts,
        optionsUr: opts,
        correctAnswerEn: ans.toString(),
        correctAnswerUr: ans.toString(),
        explanationEn: isAdd
          ? `Add Ali's original marbles and the new ones: ${a} + ${b} = ${ans}.`
          : `Subtract the cookies given away: ${a} - ${b} = ${ans}.`,
        explanationUr: isAdd
          ? `پہلے والے ماربلز میں نئے ماربلز جمع کریں: ${a} + ${b} = ${ans}۔`
          : `بسکٹس کی کل تعداد میں سے دیے گئے بسکٹس تفریق کریں: ${a} - ${b} = ${ans}۔`,
      };
    }

    // Default addition or subtraction
    const a = randInt(10, maxVal);
    const b = randInt(5, maxVal / 2);
    const ans = op === '+' ? a + b : a - b;
    const opts = shuffle([
      ans.toString(),
      (ans + 1).toString(),
      (ans - 2).toString(),
      (ans + 10).toString(),
    ]);

    return {
      id,
      type: chosenType === 'type_answer' ? 'type_answer' : 'mcq',
      classLevel,
      topic: op === '+' ? 'Addition' : 'Subtraction',
      difficulty,
      questionEn: `Calculate: ${a} ${op} ${b} = ?`,
      questionUr: `حل کیجیے: ${a} ${op} ${b} = ؟`,
      optionsEn: opts,
      optionsUr: opts,
      correctAnswerEn: ans.toString(),
      correctAnswerUr: ans.toString(),
      explanationEn: `Operating step by step: ${a} ${op} ${b} = ${ans}.`,
      explanationUr: `مرحلہ وار حساب لگائیں: ${a} ${op} ${b} = ${ans}۔`,
    };
  }

  // --- MIDDLE SCHOOL GENERATOR (Classes 4 - 6) ---
  private static generateMiddleSchoolQuestion(classLevel: ClassLevel, difficulty: Difficulty): QuizQuestion {
    const types: QuestionType[] = ['mcq', 'fill_blank', 'complete_equation', 'word_problem', 'match'];
    const chosenType = pick(types);
    const id = `mid-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const topicKind = pick(['fraction', 'percentage', 'lcm_hcf', 'integers', 'perimeter']);

    if (topicKind === 'fraction') {
      const den = pick([4, 6, 8, 10, 12]);
      const num1 = randInt(1, den - 2);
      const num2 = randInt(1, den - num1);
      const sumNum = num1 + num2;
      const ans = `${sumNum}/${den}`;

      const opts = shuffle([
        ans,
        `${sumNum + 1}/${den}`,
        `${sumNum}/${den * 2}`,
        `${Math.abs(num1 - num2)}/${den}`,
      ]);

      return {
        id,
        type: 'mcq',
        classLevel,
        topic: 'Fractions',
        difficulty,
        questionEn: `Add the fractions with common denominators: ${num1}/${den} + ${num2}/${den} = ?`,
        questionUr: `ہم مخرج کسروں کو جمع کریں: ${num1}/${den} + ${num2}/${den} = ؟`,
        optionsEn: opts,
        optionsUr: opts,
        correctAnswerEn: ans,
        correctAnswerUr: ans,
        explanationEn: `When denominators are the same, simply add numerators: (${num1} + ${num2}) / ${den} = ${ans}.`,
        explanationUr: `جب مخرج یکساں ہوں تو صرف شمار کنندہ جمع ہوتے ہیں: (${num1} + ${num2}) / ${den} = ${ans}۔`,
      };
    }

    if (topicKind === 'percentage') {
      const pct = pick([10, 20, 25, 50, 75]);
      const base = randInt(2, 20) * 20; // 40, 80, 120, etc.
      const ans = (pct / 100) * base;

      const opts = shuffle([
        ans.toString(),
        (ans + 10).toString(),
        (ans - 5).toString(),
        (ans * 2).toString(),
      ]);

      return {
        id,
        type: 'mcq',
        classLevel,
        topic: 'Percentages',
        difficulty,
        questionEn: `What is ${pct}% of ${base}?`,
        questionUr: `${base} کا ${pct} فیصد کتنا ہوگا؟`,
        optionsEn: opts,
        optionsUr: opts,
        correctAnswerEn: ans.toString(),
        correctAnswerUr: ans.toString(),
        explanationEn: `${pct}% means ${pct}/100. So (${pct}/100) × ${base} = ${ans}.`,
        explanationUr: `${pct}% کا مطلب ہے ${pct}/100۔ لہٰذا (${pct}/100) × ${base} = ${ans}۔`,
      };
    }

    if (topicKind === 'integers') {
      const a = randInt(-15, 10);
      const b = randInt(-10, 15);
      const isAdd = Math.random() > 0.5;
      const ans = isAdd ? a + b : a - b;
      const expr = isAdd ? `${a} + (${b})` : `${a} - (${b})`;

      const opts = shuffle([
        ans.toString(),
        (-ans).toString(),
        (ans + 2).toString(),
        (ans - 2).toString(),
      ]);

      return {
        id,
        type: 'mcq',
        classLevel,
        topic: 'Integers',
        difficulty,
        questionEn: `Evaluate integer expression: ${expr} = ?`,
        questionUr: `صحیح اعداد کی قیمت معلوم کریں: ${expr} = ؟`,
        optionsEn: opts,
        optionsUr: opts,
        correctAnswerEn: ans.toString(),
        correctAnswerUr: ans.toString(),
        explanationEn: `Operating on the number line: ${expr} gives ${ans}.`,
        explanationUr: `عددی خط پر حرکت کرتے ہوئے: ${expr} کا نتیجہ ${ans} آتا ہے۔`,
      };
    }

    // Default Geometry / Perimeter
    const length = randInt(6, 18);
    const width = randInt(4, 12);
    const perimeter = 2 * (length + width);
    const area = length * width;
    const askArea = Math.random() > 0.5;

    const opts = shuffle([
      askArea ? area.toString() : perimeter.toString(),
      askArea ? (area + 10).toString() : (perimeter + 4).toString(),
      askArea ? (area - 8).toString() : (perimeter - 6).toString(),
      (length + width).toString(),
    ]);

    return {
      id,
      type: chosenType === 'fill_blank' ? 'fill_blank' : 'mcq',
      classLevel,
      topic: 'Geometry Measurement',
      difficulty,
      questionEn: askArea
        ? `Find the AREA of a rectangle with length = ${length} cm and width = ${width} cm.`
        : `Find the PERIMETER of a rectangle with length = ${length} cm and width = ${width} cm.`,
      questionUr: askArea
        ? `ایک مستطیل کا رقبہ معلوم کریں جس کی لمبائی = ${length} سینٹی میٹر اور چوڑائی = ${width} سینٹی میٹر ہے۔`
        : `ایک مستطیل کا احاطہ معلوم کریں جس کی لمبائی = ${length} سینٹی میٹر اور چوڑائی = ${width} سینٹی میٹر ہے۔`,
      optionsEn: opts,
      optionsUr: opts,
      correctAnswerEn: askArea ? area.toString() : perimeter.toString(),
      correctAnswerUr: askArea ? area.toString() : perimeter.toString(),
      explanationEn: askArea
        ? `Area = Length × Width = ${length} × ${width} = ${area} cm².`
        : `Perimeter = 2 × (Length + Width) = 2 × (${length} + ${width}) = 2 × ${length + width} = ${perimeter} cm.`,
      explanationUr: askArea
        ? `رقبہ = لمبائی × چوڑائی = ${length} × ${width} = ${area} مربع سینٹی میٹر۔`
        : `احاطہ = 2 × (لمبائی + چوڑائی) = 2 × (${length} + ${width}) = ${perimeter} سینٹی میٹر۔`,
    };
  }

  // --- JUNIOR HIGH GENERATOR (Classes 7 - 9) ---
  private static generateJuniorHighQuestion(classLevel: ClassLevel, difficulty: Difficulty): QuizQuestion {
    const id = `jhigh-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const topicKind = pick(['linear_eq', 'pythagoras', 'exponents', 'polynomial']);

    if (topicKind === 'linear_eq') {
      const a = randInt(2, 7);
      const x = randInt(2, 9);
      const b = randInt(1, 15);
      const c = a * x + b;

      const opts = shuffle([
        x.toString(),
        (x + 1).toString(),
        (x - 1).toString(),
        (x * 2).toString(),
      ]);

      return {
        id,
        type: 'mcq',
        classLevel,
        topic: 'Linear Equations',
        difficulty,
        questionEn: `Solve for x: ${a}x + ${b} = ${c}`,
        questionUr: `x کی قیمت معلوم کریں: ${a}x + ${b} = ${c}`,
        optionsEn: opts,
        optionsUr: opts,
        correctAnswerEn: x.toString(),
        correctAnswerUr: x.toString(),
        explanationEn: `Subtract ${b}: ${a}x = ${c - b}. Divide by ${a}: x = ${c - b} / ${a} = ${x}.`,
        explanationUr: `دونوں طرف سے ${b} تفریق کریں: ${a}x = ${c - b}۔ اب ${a} پر تقسیم کریں: x = ${x}۔`,
      };
    }

    if (topicKind === 'pythagoras') {
      const triples = [
        { a: 3, b: 4, c: 5 },
        { a: 6, b: 8, c: 10 },
        { a: 5, b: 12, c: 13 },
        { a: 8, b: 15, c: 17 },
      ];
      const trip = pick(triples);
      const opts = shuffle([
        trip.c.toString(),
        (trip.c + 2).toString(),
        (trip.a + trip.b).toString(),
        (trip.c - 1).toString(),
      ]);

      return {
        id,
        type: 'mcq',
        classLevel,
        topic: 'Pythagorean Theorem',
        difficulty,
        questionEn: `In a right triangle with legs a = ${trip.a} and b = ${trip.b}, find hypotenuse c.`,
        questionUr: `ایک قائمۃ الزاویہ مثلث کے اضلاع a = ${trip.a} اور b = ${trip.b} ہیں۔ وتر (Hypotenuse) c معلوم کریں۔`,
        optionsEn: opts,
        optionsUr: opts,
        correctAnswerEn: trip.c.toString(),
        correctAnswerUr: trip.c.toString(),
        explanationEn: `c² = a² + b² = ${trip.a}² + ${trip.b}² = ${trip.a * trip.a} + ${trip.b * trip.b} = ${trip.c * trip.c}. c = √${trip.c * trip.c} = ${trip.c}.`,
        explanationUr: `مسئلہ فیثاغورث سے: c² = ${trip.a}² + ${trip.b}² = ${trip.c * trip.c}۔ پس وتر c = ${trip.c} ہے۔`,
      };
    }

    if (topicKind === 'exponents') {
      const base = pick([2, 3, 5]);
      const p1 = randInt(2, 4);
      const p2 = randInt(2, 3);
      const sumP = p1 + p2;
      const ans = Math.pow(base, sumP);

      const opts = shuffle([
        `${base}^${sumP} (= ${ans})`,
        `${base}^${p1 * p2}`,
        `${base * 2}^${sumP}`,
        `${base}^${p1 - p2}`,
      ]);

      return {
        id,
        type: 'mcq',
        classLevel,
        topic: 'Exponents & Powers',
        difficulty,
        questionEn: `Simplify using index laws: ${base}^${p1} × ${base}^${p2} = ?`,
        questionUr: `قوت نما کے قوانین سے حل کریں: ${base}^${p1} × ${base}^${p2} = ؟`,
        optionsEn: opts,
        optionsUr: opts,
        correctAnswerEn: `${base}^${sumP} (= ${ans})`,
        correctAnswerUr: `${base}^${sumP} (= ${ans})`,
        explanationEn: `When multiplying identical bases, add exponents: ${base}^(${p1}+${p2}) = ${base}^${sumP} = ${ans}.`,
        explanationUr: `یکساں بنیاد کی ضرب میں قوت نما جمع ہوتے ہیں: ${base}^(${p1}+${p2}) = ${base}^${sumP} = ${ans}۔`,
      };
    }

    // Default Coordinate geometry
    const x1 = randInt(1, 4);
    const y1 = randInt(1, 4);
    const x2 = x1 + 3;
    const y2 = y1 + 4;
    const dist = 5;

    const opts = shuffle(['5', '7', '12', '25']);

    return {
      id,
      type: 'mcq',
      classLevel,
      topic: 'Coordinate Geometry',
      difficulty,
      questionEn: `Find distance between points (${x1}, ${y1}) and (${x2}, ${y2}).`,
      questionUr: `نقاط (${x1}, ${y1}) اور (${x2}, ${y2}) کے درمیان فاصلہ معلوم کریں۔`,
      optionsEn: opts,
      optionsUr: opts,
      correctAnswerEn: '5',
      correctAnswerUr: '5',
      explanationEn: `d = √((x₂ - x₁)² + (y₂ - y₁)²) = √(3² + 4²) = √25 = 5 units.`,
      explanationUr: `فاصلے کے فارمولے سے: d = √(3² + 4²) = √25 = 5 اکائیاں۔`,
    };
  }

  // --- HIGH SCHOOL GENERATOR (Classes 10 - 12) ---
  private static generateHighSchoolQuestion(classLevel: ClassLevel, difficulty: Difficulty): QuizQuestion {
    const id = `hschool-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const topicKind = pick(['quadratic', 'trig_identity', 'calculus_derivative', 'matrix_det']);

    if (topicKind === 'calculus_derivative') {
      const a = randInt(2, 5);
      const n = randInt(2, 4);
      const b = randInt(2, 7);
      // f(x) = a*x^n + b*x
      const deriv = `${a * n}x^${n - 1 > 1 ? n - 1 : ''} + ${b}`;
      const opts = shuffle([
        deriv,
        `${a * n}x^${n} + ${b}`,
        `${a}x^${n - 1} + ${b}`,
        `${a * (n + 1)}x^${n + 1} + ${b}`,
      ]);

      return {
        id,
        type: 'mcq',
        classLevel,
        topic: 'Calculus: Derivatives',
        difficulty,
        questionEn: `Find the derivative d/dx of f(x) = ${a}x^${n} + ${b}x`,
        questionUr: `تفاعل f(x) = ${a}x^${n} + ${b}x کا مشتق (Derivative) معلوم کریں۔`,
        optionsEn: opts,
        optionsUr: opts,
        correctAnswerEn: deriv,
        correctAnswerUr: deriv,
        explanationEn: `Using the power rule d/dx(c·xⁿ) = c·n·xⁿ⁻¹: ${a}(${n}x^${n - 1}) + ${b}(1) = ${deriv}.`,
        explanationUr: `پاور رول کے تحت: d/dx(xⁿ) = n·xⁿ⁻¹۔ پس نتیجہ = ${deriv}۔`,
      };
    }

    if (topicKind === 'matrix_det') {
      const a = randInt(1, 5);
      const b = randInt(1, 4);
      const c = randInt(1, 4);
      const d = randInt(2, 6);
      const det = a * d - b * c;

      const opts = shuffle([
        det.toString(),
        (a * d + b * c).toString(),
        (det + 3).toString(),
        (det - 4).toString(),
      ]);

      return {
        id,
        type: 'mcq',
        classLevel,
        topic: 'Matrices & Determinants',
        difficulty,
        questionEn: `Find determinant of 2×2 matrix: [[${a}, ${b}], [${c}, ${d}]]`,
        questionUr: `2×2 قالب [[${a}, ${b}], [${c}, ${d}]] کا مقطع (Determinant) معلوم کریں۔`,
        optionsEn: opts,
        optionsUr: opts,
        correctAnswerEn: det.toString(),
        correctAnswerUr: det.toString(),
        explanationEn: `det = (a·d) - (b·c) = (${a} × ${d}) - (${b} × ${c}) = ${a * d} - ${b * c} = ${det}.`,
        explanationUr: `مقطع = (a·d) - (b·c) = (${a} × ${d}) - (${b} × ${c}) = ${det}۔`,
      };
    }

    if (topicKind === 'trig_identity') {
      const opts = shuffle(['1', '0', 'sin(θ)', 'tan²(θ)']);
      return {
        id,
        type: 'mcq',
        classLevel,
        topic: 'Trigonometry',
        difficulty,
        questionEn: `What is the simplified value of: sin²(θ) + cos²(θ)?`,
        questionUr: `مثلثی شناخت sin²(θ) + cos²(θ) کی قیمت کیا ہے؟`,
        optionsEn: opts,
        optionsUr: opts,
        correctAnswerEn: '1',
        correctAnswerUr: '1',
        explanationEn: `By the fundamental Pythagorean trigonometric identity, sin²(θ) + cos²(θ) = 1 for all angles θ.`,
        explanationUr: `بنیادی مثلثی شناخت کے مطابق تمام زاویوں کے لیے sin²(θ) + cos²(θ) = 1 ہوتا ہے۔`,
      };
    }

    // Default Quadratic roots
    const r1 = randInt(1, 4);
    const r2 = randInt(2, 5);
    const sum = r1 + r2;
    const prod = r1 * r2;

    const opts = shuffle([
      `x = ${r1}, x = ${r2}`,
      `x = -${r1}, x = -${r2}`,
      `x = ${r1 + 1}, x = ${r2}`,
      `x = 0, x = ${prod}`,
    ]);

    return {
      id,
      type: 'mcq',
      classLevel,
      topic: 'Quadratic Equations',
      difficulty,
      questionEn: `Find the roots of quadratic equation: x² - ${sum}x + ${prod} = 0`,
      questionUr: `دو درجی مساوات x² - ${sum}x + ${prod} = 0 کے روٹس (Roots) معلوم کریں۔`,
      optionsEn: opts,
      optionsUr: opts,
      correctAnswerEn: `x = ${r1}, x = ${r2}`,
      correctAnswerUr: `x = ${r1}, x = ${r2}`,
      explanationEn: `Factor into (x - ${r1})(x - ${r2}) = 0. Therefore roots are x = ${r1} and x = ${r2}.`,
      explanationUr: `تجزی کرنے پر: (x - ${r1})(x - ${r2}) = 0 حاصل ہوتا ہے۔ پس روٹس x = ${r1} اور x = ${r2} ہیں۔`,
    };
  }

  // --- UNIVERSITY LEVEL GENERATOR ---
  private static generateUniversityQuestion(difficulty: Difficulty): QuizQuestion {
    const id = `univ-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const topics = [
      'eigenvalues',
      'partial_derivative',
      'abstract_algebra_groups',
      'ode_separable',
      'complex_residue',
    ];
    const chosen = pick(topics);

    if (chosen === 'partial_derivative') {
      const opts = shuffle(['2xy', 'y²', '2x + y', '2x']);
      return {
        id,
        type: 'mcq',
        classLevel: 'university',
        topic: 'Multivariable Calculus',
        difficulty,
        questionEn: `Given f(x, y) = x²y + y³, compute the partial derivative ∂f/∂x.`,
        questionUr: `اگر f(x, y) = x²y + y³ ہو، تو جزوی مشتق ∂f/∂x معلوم کریں۔`,
        optionsEn: opts,
        optionsUr: opts,
        correctAnswerEn: '2xy',
        correctAnswerUr: '2xy',
        explanationEn: `Treating y as a constant, d/dx(x²y) = 2xy and d/dx(y³) = 0. Thus ∂f/∂x = 2xy.`,
        explanationUr: `متغیر y کو ساکن (Constant) فرض کرتے ہوئے، x²y کا مشتق 2xy اور y³ کا مشتق 0 بنتا ہے۔ پس ∂f/∂x = 2xy۔`,
      };
    }

    if (chosen === 'abstract_algebra_groups') {
      const opts = shuffle([
        'Order of H divides order of G',
        'Order of G divides order of H',
        '|G| = |H|²',
        'H must be an abelian group',
      ]);
      return {
        id,
        type: 'mcq',
        classLevel: 'university',
        topic: 'Abstract Algebra',
        difficulty,
        questionEn: `What does Lagrange's Theorem state regarding a subgroup H of a finite group G?`,
        questionUr: `کسی محدود گروپ G کے ذیلی گروپ H کے بارے میں لاگرینج تھیورم (Lagrange's Theorem) کیا بیان کرتا ہے؟`,
        optionsEn: opts,
        optionsUr: opts,
        correctAnswerEn: 'Order of H divides order of G',
        correctAnswerUr: 'Order of H divides order of G',
        explanationEn: `Lagrange's Theorem states that for any finite group G and subgroup H, |H| divides |G|, and |G| / |H| = [G : H].`,
        explanationUr: `لاگرینج تھیورم کے مطابق کسی محدود گروپ کے ذیلی گروپ کا درجہ اصل گروپ کے درجے کو پورا تقسیم کرتا ہے۔`,
      };
    }

    if (chosen === 'eigenvalues') {
      const opts = shuffle(['λ = 3, 5', 'λ = 0, 15', 'λ = 2, 8', 'λ = -3, -5']);
      return {
        id,
        type: 'mcq',
        classLevel: 'university',
        topic: 'Linear Algebra',
        difficulty,
        questionEn: `What are the eigenvalues of diagonal matrix [[3, 0], [0, 5]]?`,
        questionUr: `ڈائیگونل قالب [[3, 0], [0, 5]] کی آئیگن ویلیوز کیا ہیں؟`,
        optionsEn: opts,
        optionsUr: opts,
        correctAnswerEn: 'λ = 3, 5',
        correctAnswerUr: 'λ = 3, 5',
        explanationEn: `For any diagonal or triangular matrix, the eigenvalues are simply the entries along the main diagonal: 3 and 5.`,
        explanationUr: `کسی بھی ڈائیگونل قالب کی آئیگن ویلیوز اس کے وتر کے ارکان ہی ہوتے ہیں، یعنی 3 اور 5۔`,
      };
    }

    if (chosen === 'ode_separable') {
      const opts = shuffle(['y = Ce^(2x)', 'y = 2x² + C', 'y = ln(2x) + C', 'y = Ce^(-2x)']);
      return {
        id,
        type: 'mcq',
        classLevel: 'university',
        topic: 'Differential Equations',
        difficulty,
        questionEn: `Solve the first-order differential equation: dy/dx = 2y`,
        questionUr: `پہلے درجے کی تفاعلی مساوات dy/dx = 2y کا عام حل کیا ہے؟`,
        optionsEn: opts,
        optionsUr: opts,
        correctAnswerEn: 'y = Ce^(2x)',
        correctAnswerUr: 'y = Ce^(2x)',
        explanationEn: `Separate variables: dy/y = 2 dx. Integrate both sides: ln|y| = 2x + C₁ ⇒ y = Ce^(2x).`,
        explanationUr: `متغیرات الگ کریں: dy/y = 2 dx۔ تکامل لینے سے ln|y| = 2x + C حاصل ہوا، پس y = Ce^(2x)۔`,
      };
    }

    // Default Complex analysis
    const opts = shuffle(['2πi × (sum of residues)', '0', 'πi', '2π']);
    return {
      id,
      type: 'mcq',
      classLevel: 'university',
      topic: 'Complex Analysis',
      difficulty,
      questionEn: `According to Cauchy's Residue Theorem, what is ∮_C f(z) dz equal to?`,
      questionUr: `کوشی ریزیڈیو تھیورم کے مطابق بند دائرہ تکامل ∮_C f(z) dz کس کے مساوی ہے؟`,
      optionsEn: opts,
      optionsUr: opts,
      correctAnswerEn: '2πi × (sum of residues)',
      correctAnswerUr: '2πi × (sum of residues)',
      explanationEn: `Cauchy's Residue Theorem states that ∮_C f(z) dz = 2πi ∑ Res(f, zₖ) for poles enclosed by contour C.`,
      explanationUr: `کوشی ریزیڈیو تھیورم کے تحت تکامل 2πi × (ریزیڈیوز کا مجموعہ) کے مساوی ہوتا ہے۔`,
    };
  }

  // --- RICH CURATED FALLBACK BANK ---
  private static getCuratedBank(classLevel: ClassLevel): QuizQuestion[] {
    return [
      {
        id: `cur-1-${classLevel}`,
        type: 'mcq',
        classLevel,
        topic: 'Number Sense',
        difficulty: 'easy',
        questionEn: 'Which of the following is an even number?',
        questionUr: 'درج ذیل میں سے کون سا عدد جفت (Even) ہے؟',
        optionsEn: ['14', '17', '21', '25'],
        optionsUr: ['14', '17', '21', '25'],
        correctAnswerEn: '14',
        correctAnswerUr: '14',
        explanationEn: 'Even numbers are divisible by 2 with no remainder. 14 ÷ 2 = 7.',
        explanationUr: 'جفت اعداد 2 پر پورا تقسیم ہو جاتے ہیں۔ 14 تقسیم 2 = 7۔',
      },
      {
        id: `cur-2-${classLevel}`,
        type: 'true_false',
        classLevel,
        topic: 'Arithmetic',
        difficulty: 'medium',
        questionEn: 'Is zero (0) considered an even integer?',
        questionUr: 'کیا صفر (0) کو ایک جفت صحیح عدد مانا جاتا ہے؟',
        optionsEn: ['True', 'False'],
        optionsUr: ['درست (True)', 'غلط (False)'],
        correctAnswerEn: 'True',
        correctAnswerUr: 'درست (True)',
        explanationEn: '0 is an integer divisible by 2 (0 / 2 = 0 with no remainder). Therefore 0 is even.',
        explanationUr: '0 کو 2 پر تقسیم کرنے سے 0 حاصل ہوتا ہے بغیر کسی باقی کے، اس لیے 0 جفت عدد ہے۔',
      },
      {
        id: `cur-3-${classLevel}`,
        type: 'mcq',
        classLevel,
        topic: 'Geometry',
        difficulty: 'medium',
        questionEn: 'How many sides does a regular hexagon have?',
        questionUr: 'ایک مسدس (Hexagon) کے کتنے اضلاع ہوتے ہیں؟',
        optionsEn: ['6', '5', '8', '7'],
        optionsUr: ['6', '5', '8', '7'],
        correctAnswerEn: '6',
        correctAnswerUr: '6',
        explanationEn: 'Hexa means six. A hexagon has 6 straight sides and 6 vertices.',
        explanationUr: 'مسدس کے 6 اضلاع اور 6 کونے ہوتے ہیں۔',
      },
      {
        id: `cur-4-${classLevel}`,
        type: 'word_problem',
        classLevel,
        topic: 'Word Problem',
        difficulty: 'easy',
        questionEn: 'A box contains 24 chocolates. If 4 children share them equally, how many chocolates does each child get?',
        questionUr: 'ایک ڈبے میں 24 چاکلیٹس ہیں۔ اگر 4 بچے برابر بانٹ لیں تو ہر بچے کو کتنی چاکلیٹس ملیں گی؟',
        optionsEn: ['6', '5', '8', '4'],
        optionsUr: ['6', '5', '8', '4'],
        correctAnswerEn: '6',
        correctAnswerUr: '6',
        explanationEn: 'Divide total chocolates by number of children: 24 ÷ 4 = 6 chocolates each.',
        explanationUr: '24 کو 4 پر تقسیم کریں: 24 ÷ 4 = 6 چاکلیٹس ہر بچے کو ملیں گی۔',
      },
    ];
  }

  /**
   * Generate arithmetic questions specifically tailored for the 3D wooden game boards:
   * Addition (+), Subtraction (-), Multiplication (×), Division (÷), Mixed (+ − × ÷),
   * Missing Number, Number Sequence, Times Tables, Fractions, Quiz, and Mental Math.
   * Scaled across Nursery -> Class 12 & University across 10 progressive levels for 20 questions.
   */
  public static generateArithmeticQuestions(
    opType: GameMode | string,
    classLevel: ClassLevel,
    levelTier: number = 1,
    count: number = 20
  ): QuizQuestion[] {
    const questions: QuizQuestion[] = [];
    const usedKeys = new Set<string>();

    const isEarly = classLevel === 'nursery' || classLevel === 'kg';
    const isPrimary = classLevel === 'class1' || classLevel === 'class2' || classLevel === 'class3';
    const isMiddle = classLevel === 'class4' || classLevel === 'class5' || classLevel === 'class6';
    const isJunior = classLevel === 'class7' || classLevel === 'class8' || classLevel === 'class9';
    const isAdvanced = classLevel === 'class10' || classLevel === 'class11' || classLevel === 'class12' || classLevel === 'university';

    const emojis = ['🍎', '⭐', '🎈', '🐱', '🚗', '🍓', '🧸', '🌸', '🍪', '🦁', '⚽', '🚀'];

    let attempts = 0;
    while (questions.length < count && attempts < count * 15) {
      attempts++;
      const allowDuplicate = attempts > count * 10;
      let chosenOp = opType;

      if (opType === 'mixed') {
        const pool = isEarly
          ? ['addition', 'subtraction']
          : isPrimary
          ? ['addition', 'subtraction', 'multiplication']
          : ['addition', 'subtraction', 'multiplication', 'division'];
        chosenOp = pick(pool);
      } else if (opType === 'quiz') {
        const pool = isEarly
          ? ['addition', 'subtraction', 'missing_number']
          : ['addition', 'subtraction', 'multiplication', 'division', 'fractions', 'missing_number', 'sequence', 'algebra'];
        chosenOp = pick(pool);
      }

      const id = `game-${chosenOp}-${levelTier}-${Date.now()}-${questions.length}-${Math.random().toString(36).substring(2, 6)}`;
      const difficulty: Difficulty = levelTier <= 2 ? 'easy' : levelTier <= 6 ? 'medium' : levelTier <= 8 ? 'hard' : 'expert';

      // --- ALGEBRA MODE ---
      if (chosenOp === 'algebra') {
        if (isEarly || isPrimary) {
          const x = randInt(2, isEarly ? 6 : 15);
          const a = randInt(1, isEarly ? 5 : 12);
          const sum = a + x;
          const key = `alg-pri-${a}-${x}`;
          if (!allowDuplicate && usedKeys.has(key)) continue;
          usedKeys.add(key);

          const opts = buildUniqueOptions(x.toString(), [(x + 1).toString(), Math.max(1, x - 1).toString(), (x + 2).toString()]);
          questions.push({
            id,
            type: 'mcq',
            classLevel,
            topic: 'Algebra Basics',
            difficulty,
            questionEn: `Find x:  ${a} + x = ${sum}`,
            questionUr: `x کی قیمت معلوم کریں:  ${a} + x = ${sum}`,
            optionsEn: opts,
            optionsUr: opts,
            correctAnswerEn: x.toString(),
            correctAnswerUr: x.toString(),
            explanationEn: `Subtract ${a} from ${sum}: x = ${sum} - ${a} = ${x}.`,
            explanationUr: `${sum} میں سے ${a} تفریق کریں: x = ${sum} - ${a} = ${x}۔`,
            hintEn: `What number added to ${a} gives ${sum}?`,
            hintUr: `${a} میں کیا جمع کریں کہ ${sum} بن جائے؟`,
          });
        } else if (isMiddle) {
          const a = randInt(2, 6);
          const x = randInt(2, 10);
          const b = randInt(1, 12);
          const c = a * x + b;
          const key = `alg-mid-${a}-${x}-${b}`;
          if (!allowDuplicate && usedKeys.has(key)) continue;
          usedKeys.add(key);

          const opts = buildUniqueOptions(x.toString(), [(x + 1).toString(), Math.max(1, x - 1).toString(), (x + 3).toString()]);
          questions.push({
            id,
            type: 'mcq',
            classLevel,
            topic: 'Linear Algebra',
            difficulty,
            questionEn: `Solve for x:  ${a}x + ${b} = ${c}`,
            questionUr: `x کی قیمت معلوم کریں:  ${a}x + ${b} = ${c}`,
            optionsEn: opts,
            optionsUr: opts,
            correctAnswerEn: x.toString(),
            correctAnswerUr: x.toString(),
            explanationEn: `${a}x = ${c} - ${b} = ${c - b}, so x = ${c - b} ÷ ${a} = ${x}.`,
            explanationUr: `${a}x = ${c - b}، پس x = ${c - b} ÷ ${a} = ${x}۔`,
            hintEn: `Subtract ${b} first, then divide by ${a}.`,
            hintUr: `پہلے ${b} تفریق کریں، پھر ${a} پر تقسیم کریں۔`,
          });
        } else if (isJunior) {
          const kind = pick(['linear', 'expand', 'identity']);
          if (kind === 'expand') {
            const a = randInt(2, 5);
            const b = randInt(2, 7);
            const c = randInt(1, 6);
            const ans = `${a * b}x + ${a * c}`;
            const key = `alg-exp-${a}-${b}-${c}`;
            if (!allowDuplicate && usedKeys.has(key)) continue;
            usedKeys.add(key);

            const opts = buildUniqueOptions(ans, [`${a * b}x + ${c}`, `${a + b}x + ${a * c}`, `${a * b}x - ${a * c}`]);
            questions.push({
              id,
              type: 'mcq',
              classLevel,
              topic: 'Algebraic Expansion',
              difficulty,
              questionEn: `Expand:  ${a}(${b}x + ${c}) = ?`,
              questionUr: `توسیع کریں:  ${a}(${b}x + ${c}) = ؟`,
              optionsEn: opts,
              optionsUr: opts,
              correctAnswerEn: ans,
              correctAnswerUr: ans,
              explanationEn: `Distribute ${a}: (${a} × ${b}x) + (${a} × ${c}) = ${ans}.`,
              explanationUr: `${a} کو بریکٹ کے دونوں ارکان سے ضرب دیں: ${ans}۔`,
              hintEn: `Multiply ${a} with both terms inside brackets.`,
              hintUr: `${a} کو بریکٹ کے اندر ہر رکن سے ضرب دیں۔`,
            });
          } else if (kind === 'identity') {
            const a = randInt(2, 6);
            const ans = `x² + ${2 * a}x + ${a * a}`;
            const key = `alg-id-${a}`;
            if (!allowDuplicate && usedKeys.has(key)) continue;
            usedKeys.add(key);

            const opts = buildUniqueOptions(ans, [
              `x² + ${a * a}`,
              `x² + ${a}x + ${a * a}`,
              `x² + ${2 * a}x + ${2 * a}`,
            ]);
            questions.push({
              id,
              type: 'mcq',
              classLevel,
              topic: 'Algebraic Identities',
              difficulty,
              questionEn: `Expand identity:  (x + ${a})² = ?`,
              questionUr: `الجبرائی کلیے سے کھولیں:  (x + ${a})² = ؟`,
              optionsEn: opts,
              optionsUr: opts,
              correctAnswerEn: ans,
              correctAnswerUr: ans,
              explanationEn: `Using (A + B)² = A² + 2AB + B²: x² + 2(${a})x + ${a}² = ${ans}.`,
              explanationUr: `(A + B)² = A² + 2AB + B² کے مطابق جواب ${ans} ہے۔`,
              hintEn: `Remember (a + b)² = a² + 2ab + b².`,
              hintUr: `کلیہ یاد کریں: (a + b)² = a² + 2ab + b²۔`,
            });
          } else {
            const a = randInt(3, 8);
            const x = randInt(-6, 9);
            const b = randInt(2, 10);
            const c = a * x - b;
            const key = `alg-jun-lin-${a}-${x}-${b}`;
            if (!allowDuplicate && usedKeys.has(key)) continue;
            usedKeys.add(key);

            const opts = buildUniqueOptions(x.toString(), [(x + 1).toString(), (x - 1).toString(), (-x === x ? x + 2 : -x).toString()]);
            questions.push({
              id,
              type: 'mcq',
              classLevel,
              topic: 'Linear Equations',
              difficulty,
              questionEn: `Solve for x:  ${a}x - ${b} = ${c}`,
              questionUr: `x کی قیمت معلوم کریں:  ${a}x - ${b} = ${c}`,
              optionsEn: opts,
              optionsUr: opts,
              correctAnswerEn: x.toString(),
              correctAnswerUr: x.toString(),
              explanationEn: `Add ${b}: ${a}x = ${c + b}, then divide by ${a}: x = ${x}.`,
              explanationUr: `${b} جمع کریں: ${a}x = ${c + b}، پس x = ${x}۔`,
              hintEn: `Add ${b} to both sides first.`,
              hintUr: `پہلے دونوں طرف ${b} جمع کریں۔`,
            });
          }
        } else {
          // High school & University Algebra
          const kind = pick(['quad', 'det', 'func']);
          if (kind === 'det') {
            const a = randInt(2, 6);
            const b = randInt(1, 5);
            const c = randInt(1, 4);
            const d = randInt(2, 7);
            const det = a * d - b * c;
            const key = `alg-det-${a}-${b}-${c}-${d}`;
            if (!allowDuplicate && usedKeys.has(key)) continue;
            usedKeys.add(key);

            const opts = buildUniqueOptions(det.toString(), [(a * d + b * c).toString(), (det + 2).toString(), (det - 3).toString()]);
            questions.push({
              id,
              type: 'mcq',
              classLevel,
              topic: 'Matrix Algebra',
              difficulty,
              questionEn: `Determinant of [[${a}, ${b}], [${c}, ${d}]] = ?`,
              questionUr: `قالب [[${a}, ${b}], [${c}, ${d}]] کا مقطع (Determinant) معلوم کریں:`,
              optionsEn: opts,
              optionsUr: opts,
              correctAnswerEn: det.toString(),
              correctAnswerUr: det.toString(),
              explanationEn: `det = (${a} × ${d}) - (${b} × ${c}) = ${a * d} - ${b * c} = ${det}.`,
              explanationUr: `مقطع = (${a} × ${d}) - (${b} × ${c}) = ${det}۔`,
              hintEn: `Use ad - bc.`,
              hintUr: `فارمولا ad - bc استعمال کریں۔`,
            });
          } else if (kind === 'func') {
            const m = randInt(2, 5);
            const x = randInt(2, 5);
            const c = randInt(1, 9);
            const ans = m * x * x + c;
            const key = `alg-fn-${m}-${x}-${c}`;
            if (!allowDuplicate && usedKeys.has(key)) continue;
            usedKeys.add(key);

            const opts = buildUniqueOptions(ans.toString(), [(m * x + c).toString(), (ans + m).toString(), (ans - 2).toString()]);
            questions.push({
              id,
              type: 'mcq',
              classLevel,
              topic: 'Algebraic Functions',
              difficulty,
              questionEn: `If f(x) = ${m}x² + ${c}, find f(${x}) = ?`,
              questionUr: `اگر f(x) = ${m}x² + ${c} ہو تو f(${x}) معلوم کریں:`,
              optionsEn: opts,
              optionsUr: opts,
              correctAnswerEn: ans.toString(),
              correctAnswerUr: ans.toString(),
              explanationEn: `f(${x}) = ${m}(${x})² + ${c} = ${m * x * x} + ${c} = ${ans}.`,
              explanationUr: `x = ${x} درج کرنے سے: ${m}(${x})² + ${c} = ${ans}۔`,
              hintEn: `Square ${x} first, multiply by ${m}, then add ${c}.`,
              hintUr: `پہلے ${x} کا مربع لیں، ${m} سے ضرب دیں پھر ${c} جمع کریں۔`,
            });
          } else {
            const r1 = randInt(1, 5);
            const r2 = randInt(2, 6);
            const ans = `x = ${r1}, ${r2}`;
            const key = `alg-quad-${r1}-${r2}`;
            if (!allowDuplicate && usedKeys.has(key)) continue;
            usedKeys.add(key);

            const opts = buildUniqueOptions(ans, [
              `x = -${r1}, -${r2}`,
              `x = ${r1 + 1}, ${r2}`,
              `x = ${r1}, -${r2}`,
            ]);
            questions.push({
              id,
              type: 'mcq',
              classLevel,
              topic: 'Quadratic Algebra',
              difficulty,
              questionEn: `Roots of x² - ${r1 + r2}x + ${r1 * r2} = 0:`,
              questionUr: `مساوات x² - ${r1 + r2}x + ${r1 * r2} = 0 کے روٹس:`,
              optionsEn: opts,
              optionsUr: opts,
              correctAnswerEn: ans,
              correctAnswerUr: ans,
              explanationEn: `(x - ${r1})(x - ${r2}) = 0 ⇒ x = ${r1}, ${r2}.`,
              explanationUr: `تجزی (x - ${r1})(x - ${r2}) = 0 سے x = ${r1}, ${r2} حاصل ہوتا ہے۔`,
              hintEn: `Find two numbers that add to ${r1 + r2} and multiply to ${r1 * r2}.`,
              hintUr: `ایسے دو اعداد تلاش کریں جن کا مجموعہ ${r1 + r2} اور حاصل ضرب ${r1 * r2} ہو۔`,
            });
          }
        }
        continue;
      }

      // --- MISSING NUMBER PUZZLE MODE ---
      if (chosenOp === 'missing_number') {
        if (isEarly) {
          const a = randInt(1, Math.min(8, levelTier + 3));
          const b = randInt(1, 6);
          const sum = a + b;
          const key = `miss-${a}+?=${sum}`;
          if (!allowDuplicate && usedKeys.has(key)) continue;
          usedKeys.add(key);

          const opts = buildUniqueOptions(b.toString(), [(b + 1).toString(), (b + 2).toString(), (b + 3).toString()]);
          questions.push({
            id,
            type: 'missing_number',
            classLevel,
            topic: 'Missing Number',
            difficulty,
            questionEn: `${a} + ❓ = ${sum}`,
            questionUr: `${a} + ❓ = ${sum}`,
            optionsEn: opts,
            optionsUr: opts,
            correctAnswerEn: b.toString(),
            correctAnswerUr: b.toString(),
            explanationEn: `Subtract ${a} from ${sum}: ${sum} - ${a} = ${b}.`,
            explanationUr: `${sum} میں سے ${a} نکالیں: ${sum} - ${a} = ${b}۔`,
            hintEn: `What number added to ${a} gives ${sum}?`,
            hintUr: `${a} میں کیا جمع کریں کہ ${sum} بن جائے؟`,
          });
          continue;
        }

        const modeType = pick(['add', 'sub', 'mult']);
        if (modeType === 'add') {
          const maxVal = isPrimary ? 30 * levelTier : 80 * levelTier;
          const a = randInt(10, maxVal);
          const b = randInt(5, maxVal);
          const sum = a + b;
          const key = `miss-add-${a}-${b}`;
          if (!allowDuplicate && usedKeys.has(key)) continue;
          usedKeys.add(key);

          const opts = buildUniqueOptions(b.toString(), [(b + 2).toString(), Math.max(1, b - 3).toString(), (b + 10).toString()]);
          questions.push({
            id,
            type: 'missing_number',
            classLevel,
            topic: 'Missing Addend',
            difficulty,
            questionEn: `${a} + ❓ = ${sum}`,
            questionUr: `${a} + ❓ = ${sum}`,
            optionsEn: opts,
            optionsUr: opts,
            correctAnswerEn: b.toString(),
            correctAnswerUr: b.toString(),
            explanationEn: `${sum} - ${a} = ${b}. Therefore the missing number is ${b}.`,
            explanationUr: `${sum} میں سے ${a} تفریق کرنے سے ${b} حاصل ہوتا ہے۔`,
            hintEn: `Subtract ${a} from total ${sum}.`,
            hintUr: `کل رقم ${sum} میں سے ${a} تفریق کریں۔`,
          });
        } else if (modeType === 'sub') {
          const a = randInt(20, 100);
          const b = randInt(5, a - 5);
          const diff = a - b;
          const key = `miss-sub-${a}-${b}`;
          if (!allowDuplicate && usedKeys.has(key)) continue;
          usedKeys.add(key);

          const opts = buildUniqueOptions(b.toString(), [(b + 5).toString(), Math.max(1, b - 2).toString(), (b + 10).toString()]);
          questions.push({
            id,
            type: 'missing_number',
            classLevel,
            topic: 'Missing Subtrahend',
            difficulty,
            questionEn: `${a} - ❓ = ${diff}`,
            questionUr: `${a} - ❓ = ${diff}`,
            optionsEn: opts,
            optionsUr: opts,
            correctAnswerEn: b.toString(),
            correctAnswerUr: b.toString(),
            explanationEn: `${a} - ${diff} = ${b}.`,
            explanationUr: `${a} - ${diff} = ${b}۔`,
            hintEn: `Subtract ${diff} from ${a}.`,
            hintUr: `${a} میں سے ${diff} تفریق کریں۔`,
          });
        } else {
          const a = randInt(2, Math.min(12, levelTier + 4));
          const b = randInt(2, Math.min(12, levelTier + 3));
          const prod = a * b;
          const key = `miss-mult-${a}-${b}`;
          if (!allowDuplicate && usedKeys.has(key)) continue;
          usedKeys.add(key);

          const opts = buildUniqueOptions(b.toString(), [(b + 1).toString(), Math.max(1, b - 1).toString(), (b + 2).toString()]);
          questions.push({
            id,
            type: 'missing_number',
            classLevel,
            topic: 'Missing Factor',
            difficulty,
            questionEn: `${a} × ❓ = ${prod}`,
            questionUr: `${a} × ❓ = ${prod}`,
            optionsEn: opts,
            optionsUr: opts,
            correctAnswerEn: b.toString(),
            correctAnswerUr: b.toString(),
            explanationEn: `Divide ${prod} by ${a}: ${prod} ÷ ${a} = ${b}.`,
            explanationUr: `${prod} کو ${a} پر تقسیم کریں: ${prod} ÷ ${a} = ${b}۔`,
            hintEn: `Divide the product by ${a}.`,
            hintUr: `حاصل ضرب کو ${a} پر تقسیم کریں۔`,
          });
        }
        continue;
      }

      // --- NUMBER SEQUENCE MODE ---
      if (chosenOp === 'sequence') {
        if (isEarly) {
          const start = randInt(1, 16);
          const seq = [start, start + 1, start + 2, start + 3];
          const missIdx = randInt(0, 3);
          const ans = seq[missIdx].toString();
          const display = seq.map((n, i) => (i === missIdx ? '❓' : n)).join(', ');
          const key = `seq-early-${start}-${missIdx}`;
          if (!allowDuplicate && usedKeys.has(key)) continue;
          usedKeys.add(key);

          const opts = buildUniqueOptions(ans, [
            (seq[missIdx] + 1).toString(),
            Math.max(0, seq[missIdx] - 1).toString(),
            (seq[missIdx] + 2).toString(),
          ]);
          questions.push({
            id,
            type: 'mcq',
            classLevel,
            topic: 'Number Sequence',
            difficulty,
            questionEn: `What is the missing number in the sequence?\n${display}`,
            questionUr: `ترتیب میں خالی جگہ (❓) پر کیا آئے گا؟\n${display}`,
            optionsEn: opts,
            optionsUr: opts,
            correctAnswerEn: ans,
            correctAnswerUr: ans,
            explanationEn: `The numbers count upwards by 1. The missing number is ${ans}.`,
            explanationUr: `اعداد ایک کے اضافے سے آگے بڑھ رہے ہیں۔ گمشدہ عدد ${ans} ہے۔`,
            hintEn: `Count forward from ${start}.`,
            hintUr: `${start} سے آگے گنیں۔`,
          });
          continue;
        }

        const step = isPrimary ? randInt(2, 5) : randInt(3, 10);
        const start = randInt(2, 25);
        const seq = [start, start + step, start + 2 * step, start + 3 * step, start + 4 * step];
        const missIdx = randInt(2, 3);
        const ans = seq[missIdx].toString();
        const display = seq.map((n, i) => (i === missIdx ? '❓' : n)).join(', ');
        const key = `seq-step-${start}-${step}-${missIdx}`;
        if (!allowDuplicate && usedKeys.has(key)) continue;
        usedKeys.add(key);

        const opts = buildUniqueOptions(ans, [
          (seq[missIdx] + step).toString(),
          (seq[missIdx] - step).toString(),
          (seq[missIdx] + 2).toString(),
        ]);
        questions.push({
          id,
          type: 'mcq',
          classLevel,
          topic: 'Number Sequence',
          difficulty,
          questionEn: `Find the pattern and missing value:\n${display}`,
          questionUr: `ترتیب کا اندازہ لگائیں اور خالی جگہ (❓) پر آنے والا عدد بتائیں:\n${display}`,
          optionsEn: opts,
          optionsUr: opts,
          correctAnswerEn: ans,
          correctAnswerUr: ans,
          explanationEn: `Common difference is +${step}. Thus ${seq[missIdx - 1]} + ${step} = ${ans}.`,
          explanationUr: `ہر عدد میں ${step} کا اضافہ ہو رہا ہے۔ پس ${seq[missIdx - 1]} + ${step} = ${ans}۔`,
          hintEn: `Look at the difference between consecutive numbers: +${step}.`,
          hintUr: `مسلسل اعداد کے درمیان فرق دیکھیں: +${step}۔`,
        });
        continue;
      }

      // --- TIMES TABLES MODE ---
      if (chosenOp === 'times_tables') {
        const tableBase = isPrimary
          ? randInt(2, Math.min(10, levelTier + 3))
          : randInt(4, Math.min(16, levelTier + 7));
        const multiplier = randInt(2, 12);
        const prod = tableBase * multiplier;
        const key = `table-${tableBase}x${multiplier}`;
        if (!allowDuplicate && usedKeys.has(key)) continue;
        usedKeys.add(key);

        const opts = buildUniqueOptions(prod.toString(), [
          (prod + tableBase).toString(),
          Math.max(1, prod - tableBase).toString(),
          (prod + 2).toString(),
        ]);

        questions.push({
          id,
          type: 'mcq',
          classLevel,
          topic: `Times Table: ${tableBase}`,
          difficulty,
          questionEn: `${tableBase} × ${multiplier} = ?`,
          questionUr: `${tableBase} × ${multiplier} = ؟`,
          optionsEn: opts,
          optionsUr: opts,
          correctAnswerEn: prod.toString(),
          correctAnswerUr: prod.toString(),
          explanationEn: `${tableBase} times ${multiplier} equals ${prod}.`,
          explanationUr: `${tableBase} کو ${multiplier} سے ضرب دینے پر حاصل ضرب ${prod} بنتا ہے۔`,
          hintEn: `Think of ${multiplier} groups of ${tableBase}.`,
          hintUr: `${tableBase} کے ${multiplier} گروپس کے بارے میں سوچیں۔`,
        });
        continue;
      }

      // --- FRACTIONS MODE ---
      if (chosenOp === 'fractions') {
        const den = pick([4, 6, 8, 10, 12]);
        const n1 = randInt(1, den - 3);
        const n2 = randInt(1, den - n1 - 1);
        const isAdd = Math.random() > 0.3;
        const numAns = isAdd ? n1 + n2 : Math.max(1, n1 - n2);
        const ans = `${numAns}/${den}`;
        const key = `frac-${n1}-${n2}-${den}-${isAdd}`;
        if (!allowDuplicate && usedKeys.has(key)) continue;
        usedKeys.add(key);

        const opts = buildUniqueOptions(
          ans,
          [`${numAns + 1}/${den}`, `${numAns}/${den * 2}`, `${numAns + 2}/${den}`],
          (s) => `${numAns + s + 2}/${den}`
        );

        questions.push({
          id,
          type: 'mcq',
          classLevel,
          topic: isAdd ? 'Fraction Addition' : 'Fraction Subtraction',
          difficulty,
          questionEn: `${n1}/${den} ${isAdd ? '+' : '-'} ${n2}/${den} = ?`,
          questionUr: `${n1}/${den} ${isAdd ? '+' : '-'} ${n2}/${den} = ؟`,
          optionsEn: opts,
          optionsUr: opts,
          correctAnswerEn: ans,
          correctAnswerUr: ans,
          explanationEn: `Common denominator is ${den}. Calculate: (${n1} ${isAdd ? '+' : '-'} ${n2}) / ${den} = ${ans}.`,
          explanationUr: `مشترک مخرج ${den} ہے۔ شمار کنندہ کا حساب لگائیں: (${n1} ${isAdd ? '+' : '-'} ${n2}) / ${den} = ${ans}۔`,
          hintEn: `Keep the denominator ${den} and operate on the numerators.`,
          hintUr: `مخرج ${den} کو برقرار رکھیں اور اوپر والے اعداد حل کریں۔`,
        });
        continue;
      }

      // --- MENTAL MATH MODE ---
      if (chosenOp === 'mental_math') {
        const type = pick(['double', 'half', 'add_near_ten', 'percentage']);
        if (type === 'double') {
          const val = randInt(12, 75);
          const ans = val * 2;
          const key = `mental-double-${val}`;
          if (!allowDuplicate && usedKeys.has(key)) continue;
          usedKeys.add(key);

          const opts = buildUniqueOptions(ans.toString(), [(ans + 2).toString(), (ans - 4).toString(), (ans + 10).toString()]);
          questions.push({
            id,
            type: 'mcq',
            classLevel,
            topic: 'Mental Math: Double',
            difficulty,
            questionEn: `Mental Math: What is DOUBLE of ${val}?`,
            questionUr: `ذہنی حساب: ${val} کا دگنا (Double) کیا ہوگا؟`,
            optionsEn: opts,
            optionsUr: opts,
            correctAnswerEn: ans.toString(),
            correctAnswerUr: ans.toString(),
            explanationEn: `${val} × 2 = ${ans}.`,
            explanationUr: `${val} × 2 = ${ans}۔`,
            hintEn: `Add ${val} to itself!`,
            hintUr: `${val} کو اپنے آپ میں جمع کریں!`,
          });
        } else if (type === 'half') {
          const val = randInt(10, 50) * 2; // guaranteed even
          const ans = val / 2;
          const key = `mental-half-${val}`;
          if (!allowDuplicate && usedKeys.has(key)) continue;
          usedKeys.add(key);

          const opts = buildUniqueOptions(ans.toString(), [(ans + 1).toString(), (ans - 2).toString(), (ans + 5).toString()]);
          questions.push({
            id,
            type: 'mcq',
            classLevel,
            topic: 'Mental Math: Half',
            difficulty,
            questionEn: `Mental Math: What is HALF of ${val}?`,
            questionUr: `ذہنی حساب: ${val} کا آدھا (Half) کیا ہوگا؟`,
            optionsEn: opts,
            optionsUr: opts,
            correctAnswerEn: ans.toString(),
            correctAnswerUr: ans.toString(),
            explanationEn: `${val} ÷ 2 = ${ans}.`,
            explanationUr: `${val} تقسیم 2 = ${ans}۔`,
            hintEn: `Divide ${val} equally into 2 parts.`,
            hintUr: `${val} کو 2 برابر حصوں میں تقسیم کریں۔`,
          });
        } else {
          const base = randInt(2, 10) * 10;
          const pct = pick([10, 50]);
          const ans = (pct / 100) * base;
          const key = `mental-pct-${pct}-${base}`;
          if (!allowDuplicate && usedKeys.has(key)) continue;
          usedKeys.add(key);

          const opts = buildUniqueOptions(ans.toString(), [(ans + 5).toString(), (ans + 10).toString(), (ans * 2 + 1).toString()]);
          questions.push({
            id,
            type: 'mcq',
            classLevel,
            topic: 'Mental Math: Quick Percent',
            difficulty,
            questionEn: `Mental Math: What is ${pct}% of ${base}?`,
            questionUr: `ذہنی حساب: ${base} کا ${pct}% کتنا ہوگا؟`,
            optionsEn: opts,
            optionsUr: opts,
            correctAnswerEn: ans.toString(),
            correctAnswerUr: ans.toString(),
            explanationEn: `${pct}% of ${base} = (${pct}/100) × ${base} = ${ans}.`,
            explanationUr: `${base} کا ${pct}% = (${pct}/100) × ${base} = ${ans}۔`,
            hintEn: pct === 50 ? '50% means exactly half!' : '10% means divide by 10!',
            hintUr: pct === 50 ? '50 فیصد کا مطلب بالکل آدھا ہے!' : '10 فیصد کا مطلب 10 پر تقسیم ہے!',
          });
        }
        continue;
      }

      // --- NURSERY / KG (Picture counting & gentle arithmetic) ---
      if (isEarly) {
        const emoji = pick(emojis);
        if (chosenOp === 'subtraction') {
          const a = randInt(2, Math.min(10, levelTier + 5));
          const b = randInt(1, a - 1);
          const ans = a - b;
          const key = `early-sub-${a}-${b}`;
          if (!allowDuplicate && usedKeys.has(key)) continue;
          usedKeys.add(key);

          const display = Array(a).fill(emoji).join(' ');
          const opts = buildUniqueOptions(ans.toString(), [(ans + 1).toString(), (ans + 2).toString(), (ans + 3).toString()]);

          questions.push({
            id,
            type: 'picture_based',
            classLevel,
            topic: 'Subtraction',
            difficulty,
            visualEmoji: emoji,
            visualCount: a,
            questionEn: `${display}\n${a} - ${b} = ?`,
            questionUr: `${display}\n${a} - ${b} = ؟`,
            optionsEn: opts,
            optionsUr: opts,
            correctAnswerEn: ans.toString(),
            correctAnswerUr: ans.toString(),
            explanationEn: `Start with ${a} ${emoji}, remove ${b} ${emoji}: ${a} - ${b} = ${ans}.`,
            explanationUr: `شروع میں ${a} ${emoji} ہیں، ${b} نکالیں: باقی ${ans} بچے ہیں۔`,
            hintEn: `Count the items left after removing ${b}.`,
            hintUr: `${b} اشیاء نکال کر باقی گنیں۔`,
          });
        } else if (chosenOp === 'multiplication') {
          const groups = randInt(2, Math.min(5, levelTier + 2));
          const perGroup = randInt(1, 5);
          const ans = groups * perGroup;
          const key = `early-mult-${groups}-${perGroup}`;
          if (!allowDuplicate && usedKeys.has(key)) continue;
          usedKeys.add(key);

          const groupDisplay = Array(groups).fill(Array(perGroup).fill(emoji).join('')).join('  |  ');
          const opts = buildUniqueOptions(ans.toString(), [(ans + 1).toString(), (ans + 2).toString(), Math.max(1, ans - 1).toString()]);

          questions.push({
            id,
            type: 'picture_based',
            classLevel,
            topic: 'Grouping & Multiplication',
            difficulty,
            visualEmoji: emoji,
            visualCount: ans,
            questionEn: `${groupDisplay}\n${groups} × ${perGroup} = ?`,
            questionUr: `${groupDisplay}\n${groups} × ${perGroup} = ؟`,
            optionsEn: opts,
            optionsUr: opts,
            correctAnswerEn: ans.toString(),
            correctAnswerUr: ans.toString(),
            explanationEn: `${groups} groups of ${perGroup} ${emoji} equals ${ans}.`,
            explanationUr: `${perGroup} اشیاء کے ${groups} گروپس مل کر ${ans} بنتے ہیں۔`,
            hintEn: `Count all ${emoji} in every group!`,
            hintUr: `تمام گروپس کے ${emoji} ایک ساتھ گنیں!`,
          });
        } else if (chosenOp === 'division') {
          const friends = randInt(2, 4);
          const each = randInt(1, 5);
          const total = friends * each;
          const key = `early-div-${total}-${friends}`;
          if (!allowDuplicate && usedKeys.has(key)) continue;
          usedKeys.add(key);

          const display = Array(total).fill(emoji).join(' ');
          const opts = buildUniqueOptions(each.toString(), [(each + 1).toString(), (each + 2).toString(), (each + 3).toString()]);

          questions.push({
            id,
            type: 'picture_based',
            classLevel,
            topic: 'Equal Sharing',
            difficulty,
            visualEmoji: emoji,
            visualCount: total,
            questionEn: `${display}\n${total} ÷ ${friends} = ?`,
            questionUr: `${display}\n${total} ÷ ${friends} = ؟`,
            optionsEn: opts,
            optionsUr: opts,
            correctAnswerEn: each.toString(),
            correctAnswerUr: each.toString(),
            explanationEn: `Sharing ${total} ${emoji} equally among ${friends} gives ${each} each.`,
            explanationUr: `${total} ${emoji} کو ${friends} حصوں میں برابر بانٹنے سے ہر حصے میں ${each} آتے ہیں۔`,
            hintEn: `Split ${total} into ${friends} equal groups.`,
            hintUr: `${total} کو ${friends} برابر گروپس میں تقسیم کریں۔`,
          });
        } else {
          // Addition
          const a = randInt(1, Math.min(9, levelTier + 4));
          const b = randInt(1, Math.min(9, levelTier + 4));
          const ans = a + b;
          const key = `early-add-${a}-${b}`;
          if (!allowDuplicate && usedKeys.has(key)) continue;
          usedKeys.add(key);

          const displayA = Array(a).fill(emoji).join(' ');
          const displayB = Array(b).fill(emoji).join(' ');
          const opts = buildUniqueOptions(ans.toString(), [(ans + 1).toString(), (ans + 2).toString(), Math.max(1, ans - 1).toString()]);

          questions.push({
            id,
            type: 'picture_based',
            classLevel,
            topic: 'Addition',
            difficulty,
            visualEmoji: emoji,
            visualCount: ans,
            questionEn: `${displayA}  +  ${displayB}\n${a} + ${b} = ?`,
            questionUr: `${displayA}  +  ${displayB}\n${a} + ${b} = ؟`,
            optionsEn: opts,
            optionsUr: opts,
            correctAnswerEn: ans.toString(),
            correctAnswerUr: ans.toString(),
            explanationEn: `Count all items together: ${a} + ${b} = ${ans}.`,
            explanationUr: `تمام اشیاء کو ملا کر گنیں: ${a} + ${b} = ${ans}۔`,
            hintEn: `Count all ${emoji} together!`,
            hintUr: `تمام ${emoji} ایک ساتھ گنیں!`,
          });
        }
        continue;
      }

      // --- PRIMARY (Classes 1 to 3) ---
      if (isPrimary) {
        if (chosenOp === 'addition') {
          // Class 1: 5+3 (single-digit). Class 2: 25+16 (2-digit). Class 3: 148+235 (3-digit).
          let a = randInt(3, 10);
          let b = randInt(2, 9);
          if (classLevel === 'class2') {
            a = randInt(15, 45);
            b = randInt(12, 38);
          } else if (classLevel === 'class3') {
            a = randInt(100, 350);
            b = randInt(80, 250);
          }
          const ans = a + b;
          const key = `pri-add-${a}-${b}`;
          if (!allowDuplicate && usedKeys.has(key)) continue;
          usedKeys.add(key);

          const opts = buildUniqueOptions(ans.toString(), [(ans + 2).toString(), Math.max(1, ans - 1).toString(), (ans + 10).toString()]);
          questions.push({
            id,
            type: 'mcq',
            classLevel,
            topic: 'Addition',
            difficulty,
            questionEn: `${a} + ${b} = ?`,
            questionUr: `${a} + ${b} = ؟`,
            optionsEn: opts,
            optionsUr: opts,
            correctAnswerEn: ans.toString(),
            correctAnswerUr: ans.toString(),
            explanationEn: `${a} + ${b} = ${ans}.`,
            explanationUr: `${a} میں ${b} جمع کرنے سے ${ans} بنتا ہے۔`,
            hintEn: `Sum the units, then tens.`,
            hintUr: `پہلے اکائی پھر دہائی جمع کریں۔`,
          });
        } else if (chosenOp === 'subtraction') {
          let a = randInt(7, 18);
          let b = randInt(2, a - 1);
          if (classLevel === 'class2') {
            a = randInt(30, 85);
            b = randInt(12, a - 8);
          } else if (classLevel === 'class3') {
            a = randInt(200, 750);
            b = randInt(45, a - 25);
          }
          const ans = a - b;
          const key = `pri-sub-${a}-${b}`;
          if (!allowDuplicate && usedKeys.has(key)) continue;
          usedKeys.add(key);

          const opts = buildUniqueOptions(ans.toString(), [(ans + 2).toString(), Math.max(1, ans - 2).toString(), (ans + 10).toString()]);
          questions.push({
            id,
            type: 'mcq',
            classLevel,
            topic: 'Subtraction',
            difficulty,
            questionEn: `${a} - ${b} = ?`,
            questionUr: `${a} - ${b} = ؟`,
            optionsEn: opts,
            optionsUr: opts,
            correctAnswerEn: ans.toString(),
            correctAnswerUr: ans.toString(),
            explanationEn: `${a} - ${b} = ${ans}.`,
            explanationUr: `${a} میں سے ${b} نکالیں تو ${ans} بچتا ہے۔`,
            hintEn: `Subtract ${b} from ${a}.`,
            hintUr: `${a} میں سے ${b} تفریق کریں۔`,
          });
        } else if (chosenOp === 'multiplication') {
          const maxTable = classLevel === 'class1' ? 5 : classLevel === 'class2' ? 9 : 12;
          const a = randInt(2, maxTable);
          const b = randInt(2, maxTable);
          const ans = a * b;
          const key = `pri-mult-${a}-${b}`;
          if (!allowDuplicate && usedKeys.has(key)) continue;
          usedKeys.add(key);

          const opts = buildUniqueOptions(ans.toString(), [(ans + a).toString(), Math.max(1, ans - b).toString(), (ans + 4).toString()]);
          questions.push({
            id,
            type: 'mcq',
            classLevel,
            topic: 'Multiplication',
            difficulty,
            questionEn: `${a} × ${b} = ?`,
            questionUr: `${a} × ${b} = ؟`,
            optionsEn: opts,
            optionsUr: opts,
            correctAnswerEn: ans.toString(),
            correctAnswerUr: ans.toString(),
            explanationEn: `${a} × ${b} = ${ans}.`,
            explanationUr: `${a} کو ${b} سے ضرب دینے پر ${ans} حاصل ہوتا ہے۔`,
            hintEn: `Recall the times table of ${a}.`,
            hintUr: `${a} کا پہاڑا یاد کریں۔`,
          });
        } else {
          // Division
          const divisor = randInt(2, 6);
          const ans = randInt(2, 9);
          const dividend = divisor * ans;
          const key = `pri-div-${dividend}-${divisor}`;
          if (!allowDuplicate && usedKeys.has(key)) continue;
          usedKeys.add(key);

          const opts = buildUniqueOptions(ans.toString(), [(ans + 1).toString(), Math.max(1, ans - 1).toString(), (ans + 3).toString()]);
          questions.push({
            id,
            type: 'mcq',
            classLevel,
            topic: 'Division',
            difficulty,
            questionEn: `${dividend} ÷ ${divisor} = ?`,
            questionUr: `${dividend} ÷ ${divisor} = ؟`,
            optionsEn: opts,
            optionsUr: opts,
            correctAnswerEn: ans.toString(),
            correctAnswerUr: ans.toString(),
            explanationEn: `${dividend} ÷ ${divisor} = ${ans} because ${divisor} × ${ans} = ${dividend}.`,
            explanationUr: `${dividend} ÷ ${divisor} = ${ans} کیونکہ ${divisor} × ${ans} = ${dividend}۔`,
            hintEn: `How many times does ${divisor} fit into ${dividend}?`,
            hintUr: `${divisor} کو کتنی بار ضرب دیں کہ ${dividend} بن جائے؟`,
          });
        }
        continue;
      }

      // --- MIDDLE SCHOOL (Classes 4 to 6: Multi-digits, Decimals, Fractions) ---
      if (isMiddle) {
        if (chosenOp === 'addition') {
          const isDec = Math.random() > 0.4;
          if (isDec) {
            const a = randInt(10, 80) / 10;
            const b = randInt(5, 60) / 10;
            const ans = parseFloat((a + b).toFixed(1));
            const key = `mid-dec-add-${a}-${b}`;
            if (!allowDuplicate && usedKeys.has(key)) continue;
            usedKeys.add(key);

            const opts = buildUniqueOptions(ans.toFixed(1), [(ans + 0.5).toFixed(1), Math.max(0.1, ans - 0.3).toFixed(1), (ans + 1.2).toFixed(1)]);
            questions.push({
              id,
              type: 'mcq',
              classLevel,
              topic: 'Decimal Addition',
              difficulty,
              questionEn: `${a} + ${b} = ?`,
              questionUr: `${a} + ${b} = ؟`,
              optionsEn: opts,
              optionsUr: opts,
              correctAnswerEn: ans.toFixed(1),
              correctAnswerUr: ans.toFixed(1),
              explanationEn: `Align the decimal points: ${a} + ${b} = ${ans}.`,
              explanationUr: `اعشاریہ کے مقامات سیدھ میں رکھ کر جمع کریں: ${a} + ${b} = ${ans}۔`,
              hintEn: `Keep the decimal point aligned!`,
              hintUr: `اعشاریہ کو ایک قطار میں رکھیں۔`,
            });
          } else {
            const a = randInt(150, 850);
            const b = randInt(80, 650);
            const ans = a + b;
            const key = `mid-add-${a}-${b}`;
            if (!allowDuplicate && usedKeys.has(key)) continue;
            usedKeys.add(key);

            const opts = buildUniqueOptions(ans.toString(), [(ans + 10).toString(), (ans - 10).toString(), (ans + 100).toString()]);
            questions.push({
              id,
              type: 'mcq',
              classLevel,
              topic: 'Multi-digit Addition',
              difficulty,
              questionEn: `${a} + ${b} = ?`,
              questionUr: `${a} + ${b} = ؟`,
              optionsEn: opts,
              optionsUr: opts,
              correctAnswerEn: ans.toString(),
              correctAnswerUr: ans.toString(),
              explanationEn: `${a} + ${b} = ${ans}.`,
              explanationUr: `${a} + ${b} = ${ans}۔`,
              hintEn: `Carry over digits when sum exceeds 9.`,
              hintUr: `9 سے بڑا حاصل آنے پر اگلی طرف منتقل کریں۔`,
            });
          }
        } else if (chosenOp === 'subtraction') {
          const a = randInt(250, 950);
          const b = randInt(35, a - 25);
          const ans = a - b;
          const key = `mid-sub-${a}-${b}`;
          if (!allowDuplicate && usedKeys.has(key)) continue;
          usedKeys.add(key);

          const opts = buildUniqueOptions(ans.toString(), [(ans + 10).toString(), Math.max(1, ans - 10).toString(), (ans + 2).toString()]);
          questions.push({
            id,
            type: 'mcq',
            classLevel,
            topic: 'Subtraction with Borrowing',
            difficulty,
            questionEn: `${a} - ${b} = ?`,
            questionUr: `${a} - ${b} = ؟`,
            optionsEn: opts,
            optionsUr: opts,
            correctAnswerEn: ans.toString(),
            correctAnswerUr: ans.toString(),
            explanationEn: `${a} - ${b} = ${ans}.`,
            explanationUr: `${a} میں سے ${b} تفریق کرنے سے ${ans} حاصل ہوتا ہے۔`,
            hintEn: `Borrow from the tens or hundreds column if needed.`,
            hintUr: `ضرورت ہو تو بائیں کالم سے ادھار لیں۔`,
          });
        } else if (chosenOp === 'multiplication') {
          const a = randInt(14, 45);
          const b = randInt(4, 15);
          const ans = a * b;
          const key = `mid-mult-${a}-${b}`;
          if (!allowDuplicate && usedKeys.has(key)) continue;
          usedKeys.add(key);

          const opts = buildUniqueOptions(ans.toString(), [(ans + 10).toString(), (ans - a).toString(), (ans + b).toString()]);
          questions.push({
            id,
            type: 'mcq',
            classLevel,
            topic: 'Two-digit Multiplication',
            difficulty,
            questionEn: `${a} × ${b} = ?`,
            questionUr: `${a} × ${b} = ؟`,
            optionsEn: opts,
            optionsUr: opts,
            correctAnswerEn: ans.toString(),
            correctAnswerUr: ans.toString(),
            explanationEn: `${a} × ${b} = ${ans}.`,
            explanationUr: `${a} × ${b} = ${ans}۔`,
            hintEn: `Multiply tens and units separately.`,
            hintUr: `دہائی اور اکائی کو الگ الگ ضرب دے کر جمع کریں۔`,
          });
        } else {
          const divisor = randInt(4, 15);
          const ans = randInt(7, 30);
          const dividend = divisor * ans;
          const key = `mid-div-${dividend}-${divisor}`;
          if (!allowDuplicate && usedKeys.has(key)) continue;
          usedKeys.add(key);

          const opts = buildUniqueOptions(ans.toString(), [(ans + 2).toString(), (ans - 1).toString(), (ans + 5).toString()]);
          questions.push({
            id,
            type: 'mcq',
            classLevel,
            topic: 'Division',
            difficulty,
            questionEn: `${dividend} ÷ ${divisor} = ?`,
            questionUr: `${dividend} ÷ ${divisor} = ؟`,
            optionsEn: opts,
            optionsUr: opts,
            correctAnswerEn: ans.toString(),
            correctAnswerUr: ans.toString(),
            explanationEn: `${dividend} ÷ ${divisor} = ${ans}.`,
            explanationUr: `${dividend} تقسیم ${divisor} = ${ans}۔`,
            hintEn: `Think: ${divisor} × ? = ${dividend}`,
            hintUr: `سوچیں: ${divisor} کو کس سے ضرب دیں کہ ${dividend} آئے؟`,
          });
        }
        continue;
      }

      // --- JUNIOR HIGH (Classes 7 to 9: Integers, Algebra, Exponents) ---
      if (isJunior) {
        if (chosenOp === 'addition' || chosenOp === 'subtraction') {
          const isAlgebra = Math.random() > 0.4;
          if (isAlgebra) {
            const c1 = randInt(2, 7);
            const c2 = randInt(2, 6);
            const isAdd = chosenOp === 'addition';
            const res = isAdd ? c1 + c2 : c1 - c2;
            const expr = isAdd ? `${c1}x + ${c2}x` : `${c1}x - ${c2}x`;
            const ans = `${res}x`;
            const key = `jun-alg-${c1}-${c2}-${isAdd}`;
            if (!allowDuplicate && usedKeys.has(key)) continue;
            usedKeys.add(key);

            const opts = buildUniqueOptions(ans, [`${res + 1}x`, `${res - 2}x`, `${res}x²`]);
            questions.push({
              id,
              type: 'mcq',
              classLevel,
              topic: 'Algebraic Terms',
              difficulty,
              questionEn: `Simplify like terms: ${expr} = ?`,
              questionUr: `ہم جنس متغیرات کو آسان بنائیں: ${expr} = ؟`,
              optionsEn: opts,
              optionsUr: opts,
              correctAnswerEn: ans,
              correctAnswerUr: ans,
              explanationEn: `(${c1} ${isAdd ? '+' : '-'} ${c2})x = ${ans}.`,
              explanationUr: `(${c1} ${isAdd ? '+' : '-'} ${c2})x = ${ans}۔`,
              hintEn: `Combine coefficients of x.`,
              hintUr: `x کے ضریبوں کو ملائیں۔`,
            });
          } else {
            // Negative Integers
            const a = randInt(-25, 20);
            const b = randInt(-15, 25);
            const isAdd = chosenOp === 'addition';
            const ans = isAdd ? a + b : a - b;
            const expr = isAdd ? `${a} + (${b})` : `${a} - (${b})`;
            const key = `jun-int-${a}-${b}-${isAdd}`;
            if (!allowDuplicate && usedKeys.has(key)) continue;
            usedKeys.add(key);

            const opts = buildUniqueOptions(ans.toString(), [(-ans === ans ? ans + 4 : -ans).toString(), (ans + 3).toString(), (ans - 2).toString()]);
            questions.push({
              id,
              type: 'mcq',
              classLevel,
              topic: 'Integer Arithmetic',
              difficulty,
              questionEn: `Evaluate: ${expr} = ?`,
              questionUr: `قیمت معلوم کریں: ${expr} = ؟`,
              optionsEn: opts,
              optionsUr: opts,
              correctAnswerEn: ans.toString(),
              correctAnswerUr: ans.toString(),
              explanationEn: `Operating on integers: ${expr} = ${ans}.`,
              explanationUr: `صحیح اعداد کا حساب: ${expr} = ${ans}۔`,
              hintEn: `Watch negative signs carefully!`,
              hintUr: `منفی علامتوں کا خاص خیال رکھیں۔`,
            });
          }
        } else if (chosenOp === 'multiplication') {
          const a = randInt(2, 6);
          const b = randInt(2, 5);
          const ans = `${a * b}x²`;
          const key = `jun-mult-${a}-${b}`;
          if (!allowDuplicate && usedKeys.has(key)) continue;
          usedKeys.add(key);

          const opts = buildUniqueOptions(ans, [`${a + b}x`, `${a * b}x`, `${a * b}x³`]);
          questions.push({
            id,
            type: 'mcq',
            classLevel,
            topic: 'Algebraic Product',
            difficulty,
            questionEn: `Multiply: (${a}x) × (${b}x) = ?`,
            questionUr: `ضرب دیں: (${a}x) × (${b}x) = ؟`,
            optionsEn: opts,
            optionsUr: opts,
            correctAnswerEn: ans,
            correctAnswerUr: ans,
            explanationEn: `Multiply coefficients: ${a} × ${b} = ${a * b}. Add powers: x¹ · x¹ = x². Result: ${ans}.`,
            explanationUr: `${a} × ${b} = ${a * b} اور x · x = x²۔ پس حاصل ضرب = ${ans}۔`,
            hintEn: `Multiply the numbers and add exponents of x.`,
            hintUr: `اعداد کو ضرب دیں اور x کی قوتیں جمع کریں۔`,
          });
        } else {
          // Junior division: integer division & algebraic term division
          const divisor = randInt(2, 9) * (Math.random() > 0.5 ? -1 : 1);
          const quotient = randInt(2, 12);
          const dividend = divisor * quotient;
          const useAlgebra = Math.random() > 0.5;
          if (useAlgebra) {
            const dPos = Math.abs(divisor);
            const dvdPos = dPos * quotient;
            const ans = `${quotient}x`;
            const key = `jun-div-alg-${dvdPos}-${dPos}`;
            if (!allowDuplicate && usedKeys.has(key)) continue;
            usedKeys.add(key);

            const opts = buildUniqueOptions(ans, [`${quotient}x²`, `${quotient + 2}x`, `${Math.max(1, quotient - 1)}x`]);
            questions.push({
              id,
              type: 'mcq',
              classLevel,
              topic: 'Algebraic Division',
              difficulty,
              questionEn: `Divide: (${dvdPos}x²) ÷ (${dPos}x) = ?`,
              questionUr: `تقسیم کریں: (${dvdPos}x²) ÷ (${dPos}x) = ؟`,
              optionsEn: opts,
              optionsUr: opts,
              correctAnswerEn: ans,
              correctAnswerUr: ans,
              explanationEn: `${dvdPos} ÷ ${dPos} = ${quotient} and x² ÷ x = x. Result: ${ans}.`,
              explanationUr: `${dvdPos} ÷ ${dPos} = ${quotient} اور x² ÷ x = x۔ نتیجہ: ${ans}۔`,
              hintEn: `Divide coefficients and subtract exponents of x.`,
              hintUr: `اعداد کو تقسیم کریں اور x کی قوتیں تفریق کریں۔`,
            });
          } else {
            const key = `jun-div-${dividend}-${divisor}`;
            if (!allowDuplicate && usedKeys.has(key)) continue;
            usedKeys.add(key);

            const opts = buildUniqueOptions(quotient.toString(), [(-quotient).toString(), (quotient + 2).toString(), (quotient - 1).toString()]);
            questions.push({
              id,
              type: 'mcq',
              classLevel,
              topic: 'Integer Division',
              difficulty,
              questionEn: `Divide: (${dividend}) ÷ (${divisor}) = ?`,
              questionUr: `تقسیم کریں: (${dividend}) ÷ (${divisor}) = ؟`,
              optionsEn: opts,
              optionsUr: opts,
              correctAnswerEn: quotient.toString(),
              correctAnswerUr: quotient.toString(),
              explanationEn: `(${dividend}) ÷ (${divisor}) = ${quotient}.`,
              explanationUr: `(${dividend}) ÷ (${divisor}) = ${quotient}۔`,
              hintEn: `Remember sign rules: negative ÷ negative = positive.`,
              hintUr: `علامتوں کا اصول یاد رکھیں: منفی ÷ منفی = مثبت۔`,
            });
          }
        }
        continue;
      }

      // --- HIGH SCHOOL & UNIVERSITY (Classes 10 to 12 & University) ---
      if (isAdvanced) {
        if (chosenOp === 'addition' || chosenOp === 'subtraction') {
          const c1 = randInt(2, 6);
          const c2 = randInt(1, 5);
          const isAdd = chosenOp === 'addition';
          const coeff = isAdd ? c1 + c2 : c1 - c2;
          const ans = `${coeff}x² + ${isAdd ? '-1x' : '5x'}`.replace('+-', '- ');
          const key = `adv-poly-${c1}-${c2}-${isAdd}`;
          if (!allowDuplicate && usedKeys.has(key)) continue;
          usedKeys.add(key);

          const cleanAns = isAdd ? `${coeff}x² - x` : `${coeff}x² + 5x`;
          const opts = buildUniqueOptions(cleanAns, [
            `${coeff}x³ + 5x`,
            `${c1 * c2 + 1}x² + 5x`,
            `${coeff + 1}x² - x`,
          ]);
          questions.push({
            id,
            type: 'mcq',
            classLevel,
            topic: 'Polynomial Expression',
            difficulty,
            questionEn: `Evaluate: (${c1}x² + 2x) ${isAdd ? '+' : '-'} (${c2}x² - 3x) = ?`,
            questionUr: `قیمت معلوم کریں: (${c1}x² + 2x) ${isAdd ? '+' : '-'} (${c2}x² - 3x) = ؟`,
            optionsEn: opts,
            optionsUr: opts,
            correctAnswerEn: cleanAns,
            correctAnswerUr: cleanAns,
            explanationEn: `Combine like terms: (${c1} ${isAdd ? '+' : '-'} ${c2})x² + (2 ${isAdd ? '-' : '+'} 3)x = ${cleanAns}.`,
            explanationUr: `ہم جنس قوتوں کو حل کریں: ${cleanAns} حاصل ہوتا ہے۔`,
            hintEn: `Combine x² terms and x terms separately.`,
            hintUr: `x² اور x کے ارکان الگ الگ حل کریں۔`,
          });
        } else if (chosenOp === 'multiplication') {
          const a = randInt(2, 5);
          const b = randInt(1, 7);
          const ans = `${a * 2}x + ${a * b}`;
          const key = `adv-dist-${a}-${b}`;
          if (!allowDuplicate && usedKeys.has(key)) continue;
          usedKeys.add(key);

          const opts = buildUniqueOptions(ans, [`${a * 2}x² + ${a * b}`, `${a}x + ${b}`, `${a * 2}x - ${a * b}`]);
          questions.push({
            id,
            type: 'mcq',
            classLevel,
            topic: 'Distributive Expansion',
            difficulty,
            questionEn: `Expand expression: ${a}(2x + ${b}) = ?`,
            questionUr: `توسیع کریں: ${a}(2x + ${b}) = ؟`,
            optionsEn: opts,
            optionsUr: opts,
            correctAnswerEn: ans,
            correctAnswerUr: ans,
            explanationEn: `${a} · 2x + ${a} · ${b} = ${ans}.`,
            explanationUr: `${a} کو بریکٹ کے ہر رکن سے ضرب دیں: ${ans}۔`,
            hintEn: `Multiply ${a} by both terms inside the bracket.`,
            hintUr: `${a} کو بریکٹ کے دونوں ارکان سے ضرب دیں۔`,
          });
        } else {
          // Advanced division: polynomial / rational term division
          const a = randInt(2, 6);
          const k = randInt(2, 9);
          const p = randInt(2, 4);
          const ans = `${k}x^${p - 1}`;
          const key = `adv-div-${a}-${k}-${p}`;
          if (!allowDuplicate && usedKeys.has(key)) continue;
          usedKeys.add(key);

          const opts = buildUniqueOptions(ans, [`${k}x^${p}`, `${k + a}x^${p - 1}`, `${k * a}x`]);
          questions.push({
            id,
            type: 'mcq',
            classLevel,
            topic: 'Polynomial Division',
            difficulty,
            questionEn: `Simplify quotient: (${a * k}x^${p}) ÷ (${a}x) = ?`,
            questionUr: `تقسیم حل کریں: (${a * k}x^${p}) ÷ (${a}x) = ؟`,
            optionsEn: opts,
            optionsUr: opts,
            correctAnswerEn: ans,
            correctAnswerUr: ans,
            explanationEn: `${a * k} ÷ ${a} = ${k}, and x^${p} ÷ x = x^${p - 1}. Answer: ${ans}.`,
            explanationUr: `${a * k} ÷ ${a} = ${k} اور x^${p} ÷ x = x^${p - 1}۔ جواب: ${ans}۔`,
            hintEn: `Divide coefficients and subtract exponents.`,
            hintUr: `ضریبوں کو تقسیم کریں اور قوت نما تفریق کریں۔`,
          });
        }
      }
    }

    return questions.slice(0, count);
  }
}

