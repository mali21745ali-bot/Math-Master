export interface AppTranslations {
  appName: string;
  appSubtitle: string;
  tagline: string;
  nav: {
    home: string;
    selectClass: string;
    topics: string;
    games: string;
    puzzle: string;
    quiz: string;
    dailyChallenge: string;
    progress: string;
    achievements: string;
    leaderboard: string;
    settings: string;
    about: string;
  };
  common: {
    start: string;
    continue: string;
    playAgain: string;
    submit: string;
    check: string;
    next: string;
    previous: string;
    hint: string;
    shuffle: string;
    reset: string;
    exit: string;
    score: string;
    time: string;
    moves: string;
    level: string;
    points: string;
    coins: string;
    streak: string;
    correct: string;
    wrong: string;
    explanation: string;
    congratulations: string;
    wellDone: string;
    tryAgain: string;
    easy: string;
    medium: string;
    hard: string;
    expert: string;
    all: string;
    practice: string;
    takeQuiz: string;
    learnTopic: string;
    question: string;
    of: string;
    accuracy: string;
    reviewWrong: string;
    viewSolution: string;
    save: string;
    cancel: string;
    loading: string;
    soundOn: string;
    soundOff: string;
    search: string;
  };
  classes: Record<string, { title: string; age: string; desc: string }>;
  games: Record<string, { title: string; desc: string; instructions: string }>;
  achievements: Record<string, { title: string; desc: string }>;
  sections: {
    featuredGames: string;
    chooseYourClass: string;
    quickStats: string;
    dailyChallengeTitle: string;
    dailyChallengeDesc: string;
    continueLearning: string;
    topTopics: string;
    recentBadges: string;
    leaderboardTitle: string;
    localLeaderboardNote: string;
  };
}

export const translations: { en: AppTranslations; ur: AppTranslations } = {
  en: {
    appName: 'MATH MASTER',
    appSubtitle: 'ریاضی کی دنیا',
    tagline: 'Learn Mathematics, Play Games, Become a Math Master!',
    nav: {
      home: 'Home',
      selectClass: 'Select Class',
      topics: 'Math Topics',
      games: 'Play Games',
      puzzle: 'Number Puzzle',
      quiz: 'Quiz Competition',
      dailyChallenge: 'Daily Challenge',
      progress: 'My Progress',
      achievements: 'Achievements',
      leaderboard: 'Leaderboard',
      settings: 'Settings',
      about: 'About Us',
    },
    common: {
      start: 'Start',
      continue: 'Continue',
      playAgain: 'Play Again',
      submit: 'Submit Answer',
      check: 'Check',
      next: 'Next',
      previous: 'Previous',
      hint: 'Get Hint',
      shuffle: 'Shuffle',
      reset: 'Reset',
      exit: 'Exit',
      score: 'Score',
      time: 'Time',
      moves: 'Moves',
      level: 'Level',
      points: 'Points',
      coins: 'Coins',
      streak: 'Streak',
      correct: 'Correct! Excellent job!',
      wrong: 'Not quite. Try to understand the solution.',
      explanation: 'Step-by-step Explanation',
      congratulations: 'Congratulations! You Did It!',
      wellDone: 'Well Done!',
      tryAgain: 'Try Again',
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      expert: 'Expert',
      all: 'All',
      practice: 'Practice',
      takeQuiz: 'Take Quiz',
      learnTopic: 'Learn Concept',
      question: 'Question',
      of: 'of',
      accuracy: 'Accuracy',
      reviewWrong: 'Review Mistakes',
      viewSolution: 'View Solution',
      save: 'Save Changes',
      cancel: 'Cancel',
      loading: 'Loading...',
      soundOn: 'Sound Effects: ON',
      soundOff: 'Sound Effects: OFF',
      search: 'Search topics, formulas, or concepts...',
    },
    classes: {
      nursery: { title: 'Nursery', age: 'Ages 3-4', desc: 'Fun with counting, shapes, fruit counting & basic numbers.' },
      kg: { title: 'Kindergarten (KG)', age: 'Ages 4-5', desc: 'Number recognition, comparing sizes, basic addition with pictures.' },
      class1: { title: 'Class 1', age: 'Ages 5-6', desc: 'Addition, subtraction, number order, even/odd, simple shapes.' },
      class2: { title: 'Class 2', age: 'Ages 6-7', desc: '2-digit addition & subtraction, 2x to 5x times tables, time & money.' },
      class3: { title: 'Class 3', age: 'Ages 7-8', desc: 'Multiplication, division, basic fractions, 3-digit numbers, word problems.' },
      class4: { title: 'Class 4', age: 'Ages 8-9', desc: 'Long division, factor trees, equivalent fractions, geometry perimeter.' },
      class5: { title: 'Class 5', age: 'Ages 9-10', desc: 'Decimals, percentages, LCM & HCF, area & volume, angles.' },
      class6: { title: 'Class 6', age: 'Ages 10-11', desc: 'Negative integers, ratios & proportions, algebraic expressions, polygons.' },
      class7: { title: 'Class 7', age: 'Ages 11-12', desc: 'Linear equations in one variable, powers & exponents, rational numbers.' },
      class8: { title: 'Class 8', age: 'Ages 12-13', desc: 'Square roots & cube roots, linear graphs, algebraic identities, mensuration.' },
      class9: { title: 'Class 9', age: 'Ages 13-14', desc: 'Polynomials, coordinate geometry, linear equations in two variables, probability.' },
      class10: { title: 'Class 10', age: 'Ages 14-15', desc: 'Quadratic equations, arithmetic progressions, trigonometry, statistics.' },
      class11: { title: 'Class 11', age: 'Ages 15-16', desc: 'Sets & relations, complex numbers, permutations, conic sections, limits.' },
      class12: { title: 'Class 12', age: 'Ages 16-17', desc: 'Differential calculus, integrals, vectors, 3D geometry, matrices & determinants.' },
      university: { title: 'University Level', age: 'Higher Education', desc: 'Advanced Calculus, Linear Algebra, Real Analysis, Abstract Algebra, Differential Equations.' },
    },
    games: {
      addition: {
        title: 'Addition Challenge',
        desc: 'Race against time to sum up numbers accurately.',
        instructions: 'Calculate the total and choose or type the right answer before the countdown ends!',
      },
      subtraction: {
        title: 'Subtraction Challenge',
        desc: 'Master difference calculations with positive & negative results.',
        instructions: 'Subtract numbers with speed and precision.',
      },
      multiplication: {
        title: 'Multiplication Challenge',
        desc: 'Speed test your times tables and large product skills.',
        instructions: 'Find the product of the given factors as quickly as possible.',
      },
      division: {
        title: 'Division Challenge',
        desc: 'Conquer quotients and remainders with clean division.',
        instructions: 'Divide dividend by divisor. Select the quotient accurately.',
      },
      sequence: {
        title: 'Number Sequence Game',
        desc: 'Detect arithmetic, geometric, Fibonacci, and square patterns.',
        instructions: 'Analyze the rule governing the sequence and fill in the next number.',
      },
      missingNumber: {
        title: 'Missing Number Game',
        desc: 'Fill in the hidden value in balanced mathematical equations.',
        instructions: 'Find what number makes the equation true (e.g. 14 + ? = 35).',
      },
      memory: {
        title: 'Memory Math Game',
        desc: 'Flip cards to match mathematical expressions with their evaluated answers.',
        instructions: 'Click two cards at a time. Match expressions like (6 × 7) with 42.',
      },
      speedMath: {
        title: 'Speed Math Challenge',
        desc: '60 seconds rapid fire sprint. How many problems can you solve?',
        instructions: 'Answer as many rapid arithmetic questions as you can in 60 seconds.',
      },
      mentalMath: {
        title: 'Mental Math Challenge',
        desc: 'Train your brain to compute multi-step arithmetic without pencil and paper.',
        instructions: 'Follow the progressive operations in your mind and enter the final result.',
      },
      shapes: {
        title: 'Shape Recognition Game',
        desc: 'Identify 2D & 3D geometric figures, vertex counts, angles, and symmetries.',
        instructions: 'Look at the visual description or image and identify the exact shape.',
      },
      fractionPuzzle: {
        title: 'Fraction Puzzle',
        desc: 'Match visual pies, simplify fractions, and find common denominators.',
        instructions: 'Compare visual fractional segments with numerical fractions.',
      },
      equationSolver: {
        title: 'Equation Solver Challenge',
        desc: 'Balance the scales and isolate variables in linear and quadratic forms.',
        instructions: 'Solve for variable x by applying inverse operations step by step.',
      },
      riddles: {
        title: 'Mathematical Riddles',
        desc: 'Clever brain-teasers, paradoxes, and logic puzzles for sharp minds.',
        instructions: 'Read carefully! Math riddles test logic, attention to detail, and creative thinking.',
      },
      geometry: {
        title: 'Geometry Challenge',
        desc: 'Compute area, perimeter, hypotenuse with Pythagorean theorem, and interior angles.',
        instructions: 'Calculate geometric measurements using standard geometric theorems.',
      },
      timesTables: {
        title: 'Times Tables Master',
        desc: 'Interactive multiplication table grid and rapid mastery quiz.',
        instructions: 'Practice any times table from 1 to 20 or test your full mastery.',
      },
    },
    achievements: {
      mathBeginner: { title: 'Math Beginner', desc: 'Scored your first 100 points in mathematics!' },
      numberMaster: { title: 'Number Master', desc: 'Solved 10 number sequence or missing number puzzles.' },
      puzzleExpert: { title: 'Puzzle Expert', desc: 'Solved the sliding tile puzzle in under 50 moves.' },
      speedChampion: { title: 'Speed Champion', desc: 'Answered 10 speed math questions in 60 seconds.' },
      multiplicationMaster: { title: 'Multiplication Master', desc: 'Achieved 100% on a times tables challenge.' },
      mathGenius: { title: 'Math Genius', desc: 'Reached 1,000 total score points.' },
      dailyStreaker: { title: 'Daily Streaker', desc: 'Completed daily challenges on multiple days.' },
      fractionWizard: { title: 'Fraction Wizard', desc: 'Mastered fraction operations with flying colors.' },
      universityScholar: { title: 'University Scholar', desc: 'Conquered advanced calculus and linear algebra questions.' },
    },
    sections: {
      featuredGames: 'Featured Math Games',
      chooseYourClass: 'Select Your Class Level',
      quickStats: 'Your Math Journey',
      dailyChallengeTitle: "Today's Daily Challenge",
      dailyChallengeDesc: 'Fresh mathematics problems every day to boost your streak and earn rewards!',
      continueLearning: 'Quick Launch',
      topTopics: 'Core Mathematical Topics',
      recentBadges: 'Badges Earned',
      leaderboardTitle: 'Hall of Fame & Rankings',
      localLeaderboardNote: 'Scores saved locally on your device. Compete with yourself and friends!',
    },
  },
  ur: {
    appName: 'میتھ ماسٹر',
    appSubtitle: 'ریاضی کی دنیا',
    tagline: 'ریاضی سیکھیں، کھیل کھیلیں، میتھ ماسٹر بنیں!',
    nav: {
      home: 'ہوم اسکرین',
      selectClass: 'کلاس کا انتخاب',
      topics: 'ریاضی کے موضوعات',
      games: 'کھیل کھیلیں',
      puzzle: 'نمبر پزل',
      quiz: 'کوئز مقابلہ',
      dailyChallenge: 'روزانہ کا چیلنج',
      progress: 'میری پیش رفت',
      achievements: 'اعزازات و بیجز',
      leaderboard: 'لیڈر بورڈ',
      settings: 'ترتیبات',
      about: 'ہمارے متعلق',
    },
    common: {
      start: 'شروع کریں',
      continue: 'جاری رکھیں',
      playAgain: 'دوبارہ کھیلیں',
      submit: 'جواب جمع کروائیں',
      check: 'چیک کریں',
      next: 'اگلا',
      previous: 'پچھلا',
      hint: 'اشارہ لیں',
      shuffle: 'ترتیب بدلیں',
      reset: 'دوبارہ ترتیب دیں',
      exit: 'باہر نکلیں',
      score: 'اسکور',
      time: 'وقت',
      moves: 'چالیں',
      level: 'لیول',
      points: 'پوائنٹس',
      coins: 'سکے',
      streak: 'تسلسل (Streak)',
      correct: 'شاباش! بالکل درست جواب!',
      wrong: 'افسوس! جواب درست نہیں۔ حل ملاحظہ کریں۔',
      explanation: 'قدم بہ قدم وضاحت و حل',
      congratulations: 'مبارک ہو! آپ جیت گئے!',
      wellDone: 'بہت خوب!',
      tryAgain: 'دوبارہ کوشش کریں',
      easy: 'آسان (Easy)',
      medium: 'درمیانہ (Medium)',
      hard: 'مشکل (Hard)',
      expert: 'ماہرانہ (Expert)',
      all: 'تمام',
      practice: 'مشق کریں',
      takeQuiz: 'کوئز شروع کریں',
      learnTopic: 'تصور سیکھیں',
      question: 'سوال',
      of: 'از',
      accuracy: 'درستگی کا تناسب',
      reviewWrong: 'غلط جوابات کا جائزہ',
      viewSolution: 'حل دیکھیں',
      save: 'تبدیلیاں محفوظ کریں',
      cancel: 'منسوخ کریں',
      loading: 'لوڈ ہو رہا ہے...',
      soundOn: 'آواز: فعال',
      soundOff: 'آواز: بند',
      search: 'موضوعات، فارمولے یا تصورات تلاش کریں...',
    },
    classes: {
      nursery: { title: 'نرسری', age: 'عمر 3 تا 4 سال', desc: 'گنتی، اشکال کی پہچان، پھلوں کی گنتی اور بنیادی اعداد۔' },
      kg: { title: 'کے جی (KG)', age: 'عمر 4 تا 5 سال', desc: 'اعداد کی پہچان، سائز کا موازنہ، تصویروں کی مدد سے جمع۔' },
      class1: { title: 'جماعت اول (Class 1)', age: 'عمر 5 تا 6 سال', desc: 'جمع، تفریق، اعداد کی ترتیب، طاق و جفت اور بنیادی اشکال۔' },
      class2: { title: 'جماعت دوم (Class 2)', age: 'عمر 6 تا 7 سال', desc: 'دو ہندسی جمع و تفریق، 2 تا 5 کے پہاڑے، وقت اور روپے پیسے۔' },
      class3: { title: 'جماعت سوم (Class 3)', age: 'عمر 7 تا 8 سال', desc: 'ضرب، تقسیم، کسر کی ابتدا، تین ہندسی اعداد اور لفظی سوالات۔' },
      class4: { title: 'جماعت چہارم (Class 4)', age: 'عمر 8 تا 9 سال', desc: 'طویل تقسیم، مفرد اجزائے ضربی، مساوی کسریں اور احاطہ۔' },
      class5: { title: 'جماعت پنجم (Class 5)', age: 'عمر 9 تا 10 سال', desc: 'اعشاریہ، فیصد، ذواضعاف اقل اور عاد اعظم، رقبہ اور حجم۔' },
      class6: { title: 'جماعت ششم (Class 6)', age: 'عمر 10 تا 11 سال', desc: 'منفی اعداد، نسبت و تناسب، الجبرا کی ابتدا اور کثیر الاضلاع۔' },
      class7: { title: 'جماعت ہفتم (Class 7)', age: 'عمر 11 تا 12 سال', desc: 'یک متغیرہ لکیری مساوات، قوت نما، ناطق اعداد اور زاویے۔' },
      class8: { title: 'جماعت ہشتم (Class 8)', age: 'عمر 12 تا 13 سال', desc: 'جزر المربع اور جزر المکعب، الجبرائی شناختیں اور پیمائش۔' },
      class9: { title: 'جماعت نہم (Class 9)', age: 'عمر 13 تا 14 سال', desc: 'کثیر رقمی جملے، محدد جیومیٹری، دو متغیر مساوات، امکانات۔' },
      class10: { title: 'جماعت دہم (Class 10)', age: 'عمر 14 تا 15 سال', desc: 'دو درجی مساواتیں، حسابی تصاعد، علم المثلث اور شماریات۔' },
      class11: { title: 'جماعت گیارہویں (Class 11)', age: 'عمر 15 تا 16 سال', desc: 'سیٹ اور تفاعل، مخلوط اعداد، تبدل و تالیف، مخروطی تراشے۔' },
      class12: { title: 'جماعت بارہویں (Class 12)', age: 'عمر 16 تا 17 سال', desc: 'تفاضلی و تکاملی حساب (Calculus)، سمتیے، قالب (Matrices)۔' },
      university: { title: 'یونیورسٹی لیول', age: 'اعلیٰ تعلیم', desc: 'اعلیٰ کیلکولس، لکیری الجبرا، تجریدی الجبرا، تفاعلی مساوات۔' },
    },
    games: {
      addition: {
        title: 'جمع چیلنج',
        desc: 'وقت کے ساتھ دوڑیں اور درست جمع کر کے پوائنٹس حاصل کریں۔',
        instructions: 'اعداد کو جمع کریں اور وقت ختم ہونے سے پہلے درست جواب منتخب کریں!',
      },
      subtraction: {
        title: 'تفریق چیلنج',
        desc: 'مثبت اور منفی تفریق کے سوالات میں مہارت حاصل کریں۔',
        instructions: 'تفریق کے سوالات کو تیزی اور درستگی سے حل کریں۔',
      },
      multiplication: {
        title: 'ضرب چیلنج',
        desc: 'پہاڑوں اور ضرب کی مشق کے ساتھ تیز رفتار بنیں۔',
        instructions: 'دیے گئے اعداد کا حاصل ضرب جتنی جلدی ممکن ہو بتائیں۔',
      },
      division: {
        title: 'تقسیم چیلنج',
        desc: 'تقسیم کے عمل، خارج قسمت اور باقی کی فہم پکی کریں۔',
        instructions: 'مقسوم کو مقسوم علیہ سے تقسیم کر کے درست جواب منتخب کریں۔',
      },
      sequence: {
        title: 'اعداد کی ترتیب کا کھیل',
        desc: 'حسابی، ہندسی اور منطقی تسلسل کی پہچان کریں۔',
        instructions: 'اعداد کے درمیان اصول کو سمجھیں اور اگلا عدد بتائیں۔',
      },
      missingNumber: {
        title: 'گمشدہ عدد تلاش کریں',
        desc: 'مساوات کو متوازن کرنے والا گمشدہ عدد دریافت کریں۔',
        instructions: 'معلوم کریں کہ کون سا عدد مساوات کو درست بناتا ہے۔',
      },
      memory: {
        title: 'یادداشت کا ریاضی کھیل',
        desc: 'کارڈز پلٹیں اور سوالات کو ان کے درست جوابات سے جوڑیں۔',
        instructions: 'ایک وقت میں دو کارڈز کھولیں اور مماثل ریاضیاتی کارڈز جوڑیں۔',
      },
      speedMath: {
        title: 'اسپیڈ میتھ چیلنج',
        desc: '60 سیکنڈز کا طوفانی چیلنج۔ آپ کتنے سوالات حل کر سکتے ہیں؟',
        instructions: '60 سیکنڈز میں زیادہ سے زیادہ حسابی سوالات حل کریں۔',
      },
      mentalMath: {
        title: 'ذہنی ریاضی چیلنج',
        desc: 'قلم اور کاغذ کے بغیر ذہن میں مرحلہ وار حساب کتاب کی تربیت۔',
        instructions: 'ذہن میں حسابی مراحل طے کریں اور آخری نتیجہ درج کریں۔',
      },
      shapes: {
        title: 'اشکال کی پہچان',
        desc: 'ہندسی اشکال، زاویوں، اضلاع اور راس کی پہچان کریں۔',
        instructions: 'دی گئی شکل یا خصوصیات دیکھ کر درست شکل منتخب کریں۔',
      },
      fractionPuzzle: {
        title: 'کسر پزل (Fractions)',
        desc: 'تصویری کسروں کو مساوی اعداد اور حصوں سے ملائیں۔',
        instructions: 'تصویری حصوں کا موازنہ حسابی کسروں سے کریں۔',
      },
      equationSolver: {
        title: 'مساوات حل کرنے کا چیلنج',
        desc: 'ترازو متوازن کریں اور نامعلوم متغیر x کی قیمت نکالیں۔',
        instructions: 'معکوس حسابی مراحل اپنا کر متغیر x کی قیمت تلاش کریں۔',
      },
      riddles: {
        title: 'ریاضیاتی پہیلیاں',
        desc: 'تیز دماغوں کے لیے دلچسپ پہیلیاں، منطق اور ذہنی آزمائش۔',
        instructions: 'غور سے پڑھیں! ریاضیاتی پہیلیاں منطقی سوچ اور توجہ کی آزمائش کرتی ہیں۔',
      },
      geometry: {
        title: 'جیومیٹری چیلنج',
        desc: 'رقبہ، احاطہ، مسئلہ فیثاغورث اور اندرونی زاویوں کا حساب لگائیں۔',
        instructions: 'جیومیٹری کے اصولوں کی مدد سے مطلوبہ پیمائش معلوم کریں۔',
      },
      timesTables: {
        title: 'پہاڑوں کا استاد (Times Tables)',
        desc: 'ضرب کے پہاڑوں کا انٹرایکٹو گرڈ اور تیز رفتار ٹیسٹ۔',
        instructions: '1 سے 20 تک پہاڑوں کی مشق کریں یا مکمل ٹیسٹ دیں۔',
      },
    },
    achievements: {
      mathBeginner: { title: 'ریاضی کا مبتدی', desc: 'پہلے 100 پوائنٹس حاصل کرنے پر مبارکباد!' },
      numberMaster: { title: 'اعداد کا استاد', desc: 'ترتیب اور گمشدہ اعداد کے 10 سوالات حل کیے۔' },
      puzzleExpert: { title: 'پزل کا ماہر', desc: 'سلائیڈنگ ٹائل پزل 50 سے کم چالوں میں حل کیا۔' },
      speedChampion: { title: 'اسپیڈ چیمپئن', desc: '60 سیکنڈز میں 10 درست تیز رفتار جوابات دیے۔' },
      multiplicationMaster: { title: 'پہاڑوں کا ماسٹر', desc: 'ضرب کے چیلنج میں 100 فیصد درستگی حاصل کی۔' },
      mathGenius: { title: 'ریاضی کا نابغہ', desc: 'مجموعی طور پر 1,000 پوائنٹس حاصل کیے۔' },
      dailyStreaker: { title: 'روزانہ کا مستقل مزاج', desc: 'مسلسل دنوں میں روزانہ کا چیلنج مکمل کیا۔' },
      fractionWizard: { title: 'کسروں کا جادوگر', desc: 'کسر کے تمام پیچیدہ سوالات کامیابی سے حل کیے۔' },
      universityScholar: { title: 'یونیورسٹی اسکالر', desc: 'کیلکولس اور لکیری الجبرا کے اعلیٰ سوالات حل کیے۔' },
    },
    sections: {
      featuredGames: 'نمایاں ریاضیاتی کھیل',
      chooseYourClass: 'اپنی کلاس کا انتخاب کریں',
      quickStats: 'آپ کا ریاضیاتی سفر',
      dailyChallengeTitle: 'آج کا روزانہ چیلنج',
      dailyChallengeDesc: 'روزانہ نئے ریاضی سوالات حل کریں، پوائنٹس اور تسلسل برقرار رکھیں!',
      continueLearning: 'فوری آغاز',
      topTopics: 'ریاضی کے بنیادی و اعلیٰ موضوعات',
      recentBadges: 'حاصل کردہ بیجز',
      leaderboardTitle: 'اعزازی بورڈ و درجہ بندی',
      localLeaderboardNote: 'اسکورز آپ کے براؤزر میں محفوظ ہیں۔ خود سے اور دوستوں سے مقابلہ کریں!',
    },
  },
};
