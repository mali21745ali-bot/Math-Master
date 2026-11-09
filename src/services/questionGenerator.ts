import { ClassLevel, Difficulty, QuestionType, QuizQuestion } from '../types';

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
   * Addition (+), Subtraction (-), Multiplication (×), Division (÷), and Mixed (+ − × ÷)
   * Scaled across Nursery -> Class 12 & University across 10 progressive levels.
   */
  public static generateArithmeticQuestions(
    opType: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed',
    classLevel: ClassLevel,
    levelTier: number = 1,
    count: number = 5
  ): QuizQuestion[] {
    const questions: QuizQuestion[] = [];
    const isEarly = classLevel === 'nursery' || classLevel === 'kg';
    const isPrimary = classLevel === 'class1' || classLevel === 'class2' || classLevel === 'class3';
    const isMiddle = classLevel === 'class4' || classLevel === 'class5' || classLevel === 'class6';
    const isJunior = classLevel === 'class7' || classLevel === 'class8' || classLevel === 'class9';
    const isAdvanced = classLevel === 'class10' || classLevel === 'class11' || classLevel === 'class12' || classLevel === 'university';

    const emojis = ['🍎', '⭐', '🎈', '🐱', '🚗', '🍓', '🧸', '🌸', '🍪', '🦁'];

    for (let i = 0; i < count; i++) {
      let chosenOp = opType;
      if (opType === 'mixed') {
        const pool: ('addition' | 'subtraction' | 'multiplication' | 'division')[] =
          isEarly ? ['addition', 'subtraction'] :
          isPrimary ? ['addition', 'subtraction', 'multiplication'] :
          ['addition', 'subtraction', 'multiplication', 'division'];
        chosenOp = pick(pool);
      }

      const id = `arith-${chosenOp}-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`;
      const difficulty = levelTier <= 2 ? 'easy' : levelTier <= 6 ? 'medium' : levelTier <= 8 ? 'hard' : 'expert';

      // --- NURSERY / KG (Picture-based, small single digits) ---
      if (isEarly) {
        const emoji = pick(emojis);
        if (chosenOp === 'subtraction') {
          const a = randInt(2, Math.min(6, levelTier + 2));
          const b = randInt(1, a - 1);
          const ans = a - b;
          const display = Array(a).fill(emoji).join(' ');
          const opts = shuffle([
            ans.toString(),
            (ans + 1).toString(),
            Math.max(0, ans - 1).toString(),
            (ans + 2).toString(),
          ]);

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
            explanationEn: `Take away ${b} from ${a}: ${a} - ${b} = ${ans}.`,
            explanationUr: `${a} میں سے ${b} نکالیں: ${a} - ${b} = ${ans}۔`,
            hintEn: `Count the remaining items after removing ${b}.`,
            hintUr: `${b} اشیاء ہٹانے کے بعد باقی گنیں۔`,
          });
        } else {
          // Addition
          const a = randInt(1, Math.min(5, levelTier + 1));
          const b = randInt(1, Math.min(4, levelTier + 1));
          const ans = a + b;
          const displayA = Array(a).fill(emoji).join(' ');
          const displayB = Array(b).fill(emoji).join(' ');
          const opts = shuffle([
            ans.toString(),
            (ans + 1).toString(),
            Math.max(1, ans - 1).toString(),
            (ans + 2).toString(),
          ]);

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
            explanationEn: `Combine both groups: ${a} + ${b} = ${ans}.`,
            explanationUr: `دونوں گروپس کو ملائیں: ${a} + ${b} = ${ans}۔`,
            hintEn: `Count all the ${emoji} all together!`,
            hintUr: `تمام ${emoji} کو ایک ساتھ گنیں!`,
          });
        }
        continue;
      }

      // --- PRIMARY (Classes 1 to 3) ---
      if (isPrimary) {
        if (chosenOp === 'addition') {
          const maxNum = levelTier <= 3 ? 20 : levelTier <= 7 ? 60 : 120;
          const a = randInt(5, maxNum);
          const b = randInt(3, maxNum / 2);
          const ans = a + b;
          const opts = shuffle([ans.toString(), (ans + 1).toString(), (ans - 2).toString(), (ans + 10).toString()]);

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
            explanationUr: `${a} میں ${b} جمع کرنے سے ${ans} حاصل ہوتا ہے۔`,
            hintEn: `Add the ones digits first, then carry to the tens.`,
            hintUr: `پہلے اکائیوں کو جمع کریں، پھر دہائی کو۔`,
          });
        } else if (chosenOp === 'subtraction') {
          const maxNum = levelTier <= 3 ? 20 : levelTier <= 7 ? 60 : 120;
          const a = randInt(10, maxNum);
          const b = randInt(2, a - 1);
          const ans = a - b;
          const opts = shuffle([ans.toString(), (ans + 2).toString(), (ans - 1).toString(), (ans + 10).toString()]);

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
            explanationUr: `${a} میں سے ${b} نکالنے سے ${ans} بچتا ہے۔`,
            hintEn: `Subtract ${b} from ${a}.`,
            hintUr: `${a} میں سے ${b} تفریق کریں۔`,
          });
        } else if (chosenOp === 'multiplication') {
          const tableMax = levelTier <= 3 ? 5 : levelTier <= 7 ? 10 : 12;
          const a = randInt(2, tableMax);
          const b = randInt(2, tableMax);
          const ans = a * b;
          const opts = shuffle([ans.toString(), (ans + a).toString(), (ans - b).toString(), (ans + 3).toString()]);

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
            explanationUr: `${a} ضرب ${b} برابر ہے ${ans} کے۔`,
            hintEn: `Recall the times table of ${a}.`,
            hintUr: `${a} کا پہاڑا یاد کریں۔`,
          });
        } else {
          // Division
          const divisor = randInt(2, 6);
          const ans = randInt(2, 9);
          const dividend = divisor * ans;
          const opts = shuffle([ans.toString(), (ans + 1).toString(), (ans - 1).toString(), (ans * 2).toString()]);

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
          const isDec = levelTier >= 5;
          if (isDec) {
            const a = (randInt(10, 80) / 10);
            const b = (randInt(5, 50) / 10);
            const ans = parseFloat((a + b).toFixed(1));
            const opts = shuffle([ans.toFixed(1), (ans + 0.5).toFixed(1), (ans - 0.2).toFixed(1), (ans + 1.1).toFixed(1)]);

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
              explanationEn: `Line up decimal points: ${a} + ${b} = ${ans}.`,
              explanationUr: `اعشاریہ کے مقامات سیدھ میں رکھ کر جمع کریں: ${a} + ${b} = ${ans}۔`,
              hintEn: `Keep the decimal point aligned!`,
              hintUr: `اعشاریہ کو ایک قطار میں رکھیں۔`,
            });
          } else {
            const a = randInt(50, 450);
            const b = randInt(40, 350);
            const ans = a + b;
            const opts = shuffle([ans.toString(), (ans + 10).toString(), (ans - 5).toString(), (ans + 100).toString()]);

            questions.push({
              id,
              type: 'mcq',
              classLevel,
              topic: 'Addition with Carrying',
              difficulty,
              questionEn: `${a} + ${b} = ?`,
              questionUr: `${a} + ${b} = ؟`,
              optionsEn: opts,
              optionsUr: opts,
              correctAnswerEn: ans.toString(),
              correctAnswerUr: ans.toString(),
              explanationEn: `${a} + ${b} = ${ans}.`,
              explanationUr: `${a} + ${b} = ${ans}۔`,
              hintEn: `Remember to carry over values greater than 9.`,
              hintUr: `9 سے بڑے عدد کا حاصل آگے منتقل کریں۔`,
            });
          }
        } else if (chosenOp === 'subtraction') {
          const a = randInt(150, 850);
          const b = randInt(30, a - 20);
          const ans = a - b;
          const opts = shuffle([ans.toString(), (ans + 10).toString(), (ans - 10).toString(), (ans + 2).toString()]);

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
            hintEn: `Borrow 10 from the next column if needed.`,
            hintUr: `ضرورت ہو تو بائیں کالم سے 10 ادھار لیں۔`,
          });
        } else if (chosenOp === 'multiplication') {
          const a = randInt(12, 35);
          const b = randInt(4, 12);
          const ans = a * b;
          const opts = shuffle([ans.toString(), (ans + 10).toString(), (ans - a).toString(), (ans + b).toString()]);

          questions.push({
            id,
            type: 'mcq',
            classLevel,
            topic: 'Multi-Digit Multiplication',
            difficulty,
            questionEn: `${a} × ${b} = ?`,
            questionUr: `${a} × ${b} = ؟`,
            optionsEn: opts,
            optionsUr: opts,
            correctAnswerEn: ans.toString(),
            correctAnswerUr: ans.toString(),
            explanationEn: `${a} × ${b} = ${ans}.`,
            explanationUr: `${a} × ${b} = ${ans}۔`,
            hintEn: `Multiply the tens and units separately then sum.`,
            hintUr: `دہائی اور اکائی کو الگ الگ ضرب دے کر جمع کریں۔`,
          });
        } else {
          const divisor = randInt(3, 12);
          const ans = randInt(6, 25);
          const dividend = divisor * ans;
          const opts = shuffle([ans.toString(), (ans + 2).toString(), (ans - 1).toString(), (ans + 5).toString()]);

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
          const coeff1 = randInt(2, 6);
          const coeff2 = randInt(2, 5);
          const isAdd = chosenOp === 'addition';
          const resCoeff = isAdd ? coeff1 + coeff2 : coeff1 - coeff2;
          const expr = isAdd ? `${coeff1}x + ${coeff2}x` : `${coeff1}x - ${coeff2}x`;
          const ans = `${resCoeff}x`;
          const opts = shuffle([ans, `${resCoeff + 1}x`, `${resCoeff - 2}x`, `${resCoeff}x²`]);

          questions.push({
            id,
            type: 'mcq',
            classLevel,
            topic: 'Algebraic Simplification',
            difficulty,
            questionEn: `Simplify like terms: ${expr} = ?`,
            questionUr: `یکساں متغیرات کو آسان بنائیں: ${expr} = ؟`,
            optionsEn: opts,
            optionsUr: opts,
            correctAnswerEn: ans,
            correctAnswerUr: ans,
            explanationEn: `Combine coefficients of x: (${coeff1} ${isAdd ? '+' : '-'} ${coeff2})x = ${ans}.`,
            explanationUr: `x کے ضریبوں کو جمع/تفریق کریں: (${coeff1} ${isAdd ? '+' : '-'} ${coeff2})x = ${ans}۔`,
            hintEn: `Only combine the numerical coefficients of like terms.`,
            hintUr: `صرف ہم جنس ارکان کے عددی ضریبوں کو ملائیں۔`,
          });
        } else if (chosenOp === 'multiplication') {
          const a = randInt(2, 5);
          const b = randInt(2, 4);
          const ans = `${a * b}x²`;
          const opts = shuffle([ans, `${a + b}x`, `${a * b}x`, `${a * b}x³`]);

          questions.push({
            id,
            type: 'mcq',
            classLevel,
            topic: 'Algebraic Multiplication',
            difficulty,
            questionEn: `Multiply expressions: (${a}x) × (${b}x) = ?`,
            questionUr: `الجبری جملوں کو ضرب دیں: (${a}x) × (${b}x) = ؟`,
            optionsEn: opts,
            optionsUr: opts,
            correctAnswerEn: ans,
            correctAnswerUr: ans,
            explanationEn: `(${a} × ${b}) · (x · x) = ${ans}.`,
            explanationUr: `(${a} × ${b}) · (x · x) = ${ans}۔`,
            hintEn: `Multiply numbers, then add exponents of x (x¹ · x¹ = x²).`,
            hintUr: `اعداد کو ضرب دیں اور x کی قوتوں کو جمع کریں۔`,
          });
        } else {
          const a = randInt(2, 6);
          const x = randInt(3, 9);
          const b = a * x;
          const ans = `${x}`;
          const opts = shuffle([ans, `${x + 1}`, `${x - 2}`, `${x * 2}`]);

          questions.push({
            id,
            type: 'mcq',
            classLevel,
            topic: 'Solving Linear Equations',
            difficulty,
            questionEn: `Solve for x: ${a}x = ${b}`,
            questionUr: `x کی قیمت معلوم کریں: ${a}x = ${b}`,
            optionsEn: opts,
            optionsUr: opts,
            correctAnswerEn: ans,
            correctAnswerUr: ans,
            explanationEn: `Divide both sides by ${a}: x = ${b} ÷ ${a} = ${ans}.`,
            explanationUr: `دونوں طرف ${a} سے تقسیم کریں: x = ${b} ÷ ${a} = ${ans}۔`,
            hintEn: `Divide the constant by the coefficient of x.`,
            hintUr: `دائیں طرف کی رقم کو x کے ضریب پر تقسیم کریں۔`,
          });
        }
        continue;
      }

      // --- HIGH SCHOOL & UNIVERSITY (Classes 10 to 12 & University) ---
      if (isAdvanced) {
        if (chosenOp === 'addition' || chosenOp === 'subtraction') {
          const c1 = randInt(1, 4);
          const c2 = randInt(2, 5);
          const isAdd = chosenOp === 'addition';
          const ans = `${isAdd ? c1 + c2 : c1 - c2}x² + 5x`;
          const opts = shuffle([
            ans,
            `${isAdd ? c1 + c2 : c1 - c2}x³ + 5x`,
            `${c1 * c2}x² + 5x`,
            `${isAdd ? c1 + c2 + 1 : c1 - c2 - 1}x² + 5x`,
          ]);

          questions.push({
            id,
            type: 'mcq',
            classLevel,
            topic: 'Polynomial Operations',
            difficulty,
            questionEn: `Evaluate: (${c1}x² + 2x) ${isAdd ? '+' : '-'} (${c2}x² - 3x) = ?`,
            questionUr: `قیمت نکالیں: (${c1}x² + 2x) ${isAdd ? '+' : '-'} (${c2}x² - 3x) = ؟`,
            optionsEn: opts,
            optionsUr: opts,
            correctAnswerEn: ans,
            correctAnswerUr: ans,
            explanationEn: `Combine x² terms and x terms: (${c1} ${isAdd ? '+' : '-'} ${c2})x² + (2 ${isAdd ? '-' : '+'} 3)x = ${ans}.`,
            explanationUr: `ہم جنس قوتوں کو یکجا کریں: ${ans} حاصل ہوتا ہے۔`,
            hintEn: `Group powers of x² and powers of x separately.`,
            hintUr: `x² اور x کی رقمیں الگ الگ جمع کریں۔`,
          });
        } else if (chosenOp === 'multiplication') {
          const a = randInt(2, 4);
          const b = randInt(1, 5);
          const ans = `${a * 2}x + ${a * b}`;
          const opts = shuffle([ans, `${a * 2}x² + ${a * b}`, `${a}x + ${b}`, `${a * 2}x - ${a * b}`]);

          questions.push({
            id,
            type: 'mcq',
            classLevel,
            topic: 'Distributive Law',
            difficulty,
            questionEn: `Expand: ${a}(2x + ${b}) = ?`,
            questionUr: `توسیع کریں: ${a}(2x + ${b}) = ؟`,
            optionsEn: opts,
            optionsUr: opts,
            correctAnswerEn: ans,
            correctAnswerUr: ans,
            explanationEn: `Distribute ${a}: (${a} × 2x) + (${a} × ${b}) = ${ans}.`,
            explanationUr: `${a} کو بریکٹ کے اندر ہر رقم سے ضرب دیں: ${ans}۔`,
            hintEn: `Apply the distributive property: a(b + c) = ab + ac.`,
            hintUr: `خاصیتِ تقسیم a(b + c) = ab + ac کا اطلاق کریں۔`,
          });
        } else {
          // Division / Derivative evaluation
          const k = randInt(2, 6);
          const xVal = randInt(1, 4);
          // d/dx (k*x²) at x = xVal -> 2*k*xVal
          const ans = (2 * k * xVal).toString();
          const opts = shuffle([ans, (2 * k * xVal + 4).toString(), (k * xVal).toString(), (2 * k * (xVal + 1)).toString()]);

          questions.push({
            id,
            type: 'mcq',
            classLevel,
            topic: 'Calculus Derivative Evaluation',
            difficulty,
            questionEn: `If f(x) = ${k}x², calculate the value of f'(${xVal}) = ?`,
            questionUr: `اگر f(x) = ${k}x² ہو، تو f'(${xVal}) کی قیمت کیا ہوگی؟`,
            optionsEn: opts,
            optionsUr: opts,
            correctAnswerEn: ans,
            correctAnswerUr: ans,
            explanationEn: `f'(x) = 2 · ${k} · x = ${2 * k}x. Evaluating at x = ${xVal}: f'(${xVal}) = ${2 * k} × ${xVal} = ${ans}.`,
            explanationUr: `مشتق f'(x) = ${2 * k}x۔ x = ${xVal} درج کرنے سے: ${ans} حاصل ہوا۔`,
            hintEn: `Find the derivative first with the power rule, then substitute x.`,
            hintUr: `پہلے پاور رول سے مشتق لیں، پھر x کی قیمت درج کریں۔`,
          });
        }
      }
    }

    return questions;
  }
}
