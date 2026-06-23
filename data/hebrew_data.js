/**
 * Hebrew Study Reference and Game Data
 * Includes Consonants, Vowels, Vocabulary, Paradigms, and the 20-week Curriculum.
 */

const HEBREW_DATA = {
  // 1. Hebrew Alphabet (22 Consonants)
  consonants: [
    { letter: 'א', nameKo: '알레프', nameEn: 'Alef', sound: '묵음 (Silent)', translit: "'", guttural: true, note: '첫 번째 자음, 후음' },
    { letter: 'ב', nameKo: '베트', nameEn: 'Bet', sound: 'b (점 있음) / v (점 없음)', translit: 'b / v', begedkephat: true, note: '경음점(Dagesh Lene)에 따라 b 또는 v 발음' },
    { letter: 'ג', nameKo: '기멜', nameEn: 'Gimel', sound: 'g', translit: 'g', begedkephat: true, note: '원래 마찰음화가 있었으나 현대식으로는 동일하게 g 발음' },
    { letter: 'ד', nameKo: '달레트', nameEn: 'Dalet', sound: 'd', translit: 'd', begedkephat: true, note: '원래 마찰음화가 있었으나 현대식으로는 동일하게 d 발음' },
    { letter: 'ה', nameKo: '헤', nameEn: 'He', sound: 'h', translit: 'h', guttural: true, note: '단어 끝에 올 때 묵음이 되는 경우가 많음, 후음' },
    { letter: 'ו', nameKo: '바브', nameEn: 'Vav', sound: 'v', translit: 'v', note: '모음(홀렘, 슈렉)의 받침으로도 사용됨' },
    { letter: 'ז', nameKo: '자인', nameEn: 'Zayin', sound: 'z', translit: 'z', note: '영어의 z 발음' },
    { letter: 'ח', nameKo: '헤트', nameEn: 'Het', sound: 'ch (목젖 긁는 소리)', translit: 'ch / ḥ', guttural: true, note: '후음, 강한 마찰음' },
    { letter: 'ט', nameKo: '테트', nameEn: 'Tet', sound: 't', translit: 't', note: '강한 t 발음' },
    { letter: 'י', nameKo: '요드', nameEn: 'Yod', sound: 'y', translit: 'y', note: '영어의 y(반모음) 또는 모음의 일부로 사용됨' },
    { letter: 'כ', nameKo: '카프', nameEn: 'Kaf', sound: 'k (점 있음) / ch (점 없음)', translit: 'k / kh', begedkephat: true, final: 'ך', note: '꼬리형 ך 존재. 경음점에 따라 k 또는 ch 발음' },
    { letter: 'ל', nameKo: '라메드', nameEn: 'Lamed', sound: 'l', translit: 'l', note: '영어의 l 발음' },
    { letter: 'מ', nameKo: '멤', nameEn: 'Mem', sound: 'm', translit: 'm', final: 'ם', note: '꼬리형 ם 존재' },
    { letter: 'נ', nameKo: '눈', nameEn: 'Nun', sound: 'n', translit: 'n', final: 'ן', note: '꼬리형 ן 존재' },
    { letter: 'ס', nameKo: '사메크', nameEn: 'Samekh', sound: 's', translit: 's', note: '영어의 s 발음' },
    { letter: 'ע', nameKo: '아인', nameEn: 'Ayin', sound: '묵음 (Silent)', translit: '`', guttural: true, note: '목구멍 깊은 곳에서 나는 소리나 현대는 대개 묵음, 후음' },
    { letter: 'פ', nameKo: '페', nameEn: 'Pe', sound: 'p (점 있음) / f (점 없음)', translit: 'p / f', begedkephat: true, final: 'ף', note: '꼬리형 ף 존재. 경음점에 따라 p 또는 f 발음' },
    { letter: 'צ', nameKo: '차데', nameEn: 'Tsade', sound: 'ts', translit: 'ts / ṣ', final: 'ץ', note: '꼬리형 ץ 존재' },
    { letter: 'ק', nameKo: '코프', nameEn: 'Qof', sound: 'q', translit: 'q', note: '목뒤쪽 t/k 사이 소리' },
    { letter: 'ר', nameKo: '레쉬', nameEn: 'Resh', sound: 'r', translit: 'r', note: '학자에 따라 후음적 성격(중복 불가 등)을 공유함' },
    { letter: 'ש', nameKo: '신 / 신', nameEn: 'Shin / Sin', sound: 'sh (오른쪽 점 שׁ) / s (왼쪽 점 שׂ)', translit: 'sh / s', note: '오른쪽 점: 신(שׁ - sh), 왼쪽 점: 신(שׂ - s)' },
    { letter: 'ת', nameKo: '타브', nameEn: 'Tav', sound: 't', translit: 't', begedkephat: true, note: 'BeGeDKePHeT의 마지막 문자' }
  ],

  // 2. Hebrew Vowels (Niqqud)
  vowels: [
    { symbol: 'ָ', nameKo: '카메츠 (Qamets)', class: 'A-class', type: '장모음 (Long)', sound: 'a', example: 'בָּ (ba)' },
    { symbol: 'ַ', nameKo: '파타흐 (Pathach)', class: 'A-class', type: '단모음 (Short)', sound: 'a', example: 'בַּ (ba)' },
    { symbol: 'ֲ', nameKo: '하테프 파타흐', class: 'A-class', type: '반모음 (Reduced)', sound: 'a (초단)', example: 'בֲּ (ba)' },
    { symbol: 'ֵ', nameKo: '체레 (Tsere)', class: 'E-class', type: '장모음 (Long)', sound: 'e', example: 'בֵּ (be)' },
    { symbol: 'ֶ', nameKo: '세골 (Seghol)', class: 'E-class', type: '단모음 (Short)', sound: 'e', example: 'בֶּ (be)' },
    { symbol: 'ֱ', nameKo: '하테프 세골', class: 'E-class', type: '반모음 (Reduced)', sound: 'e (초단)', example: 'בֱּ (be)' },
    { symbol: 'ִ', nameKo: '히렉 (Chireq)', class: 'I-class', type: '단모음 (Short)', sound: 'i', example: 'בִּ (bi)' },
    { symbol: 'ִי', nameKo: '히렉 요드', class: 'I-class', type: '순장모음 (Unchangeable Long)', sound: 'i', example: 'בִּי (bi)' },
    { symbol: 'ֹ', nameKo: '홀렘 (Cholem)', class: 'O-class', type: '장모음 (Long)', sound: 'o', example: 'בֹּ (bo)' },
    { symbol: 'וֹ', nameKo: '홀렘 바브', class: 'O-class', type: '순장모음 (Unchangeable Long)', sound: 'o', example: 'בּוֹ (bo)' },
    { symbol: 'ָ', nameKo: '카메츠 하투프', class: 'O-class', type: '단모음 (Short)', sound: 'o', example: 'בָּ (bo - 폐음절에 액센트 없을 때)' },
    { symbol: 'ֳ', nameKo: '하테프 카메츠', class: 'O-class', type: '반모음 (Reduced)', sound: 'o (초단)', example: 'בֳּ (bo)' },
    { symbol: 'וּ', nameKo: '슈렉 (Shureq)', class: 'U-class', type: '순장모음 (Unchangeable Long)', sound: 'u', example: 'בּוּ (bu)' },
    { symbol: 'ֻ', nameKo: '키부츠 (Kibbuts)', class: 'U-class', type: '단모음 (Short)', sound: 'u', example: 'בֻּ (bu)' },
    { symbol: 'ְ', nameKo: '쉐바 (Sheva)', class: 'Reduced-class', type: '유성/무성 쉐바', sound: 'e (유성) / 묵음 (무성)', example: 'בְּ (be/b)' }
  ],

  // 3. Core Vocabulary (30 words for games/flashcards)
  vocabulary: [
    { hebrew: 'אָב', translit: 'av', meaningKo: '아버지', meaningEn: 'father', category: '명사 (Noun)' },
    { hebrew: 'אֵם', translit: 'em', meaningKo: '어머니', meaningEn: 'mother', category: '명사 (Noun)' },
    { hebrew: 'בֵּן', translit: 'ben', meaningKo: '아들', meaningEn: 'son', category: '명사 (Noun)' },
    { hebrew: 'בַּת', translit: 'bat', meaningKo: '딸', meaningEn: 'daughter', category: '명사 (Noun)' },
    { hebrew: 'בַּיִת', translit: 'bayit', meaningKo: '집', meaningEn: 'house', category: '명사 (Noun)' },
    { hebrew: 'יוֹם', translit: 'yom', meaningKo: '날, 하루, 낮', meaningEn: 'day', category: '명사 (Noun)' },
    { hebrew: 'אֶרֶץ', translit: 'erets', meaningKo: '땅, 나라', meaningEn: 'land, earth', category: '명사 (Noun)' },
    { hebrew: 'מֶלֶךְ', translit: 'melekh', meaningKo: '왕', meaningEn: 'king', category: '명사 (Noun)' },
    { hebrew: 'אִישׁ', translit: 'ish', meaningKo: '남자, 남편', meaningEn: 'man, husband', category: '명사 (Noun)' },
    { hebrew: 'אִשָּׁה', translit: 'ishah', meaningKo: '여자, 아내', meaningEn: 'woman, wife', category: '명사 (Noun)' },
    { hebrew: 'סֵפֶר', translit: 'sefer', meaningKo: '책, 문서', meaningEn: 'book, scroll', category: '명사 (Noun)' },
    { hebrew: 'דָּבָר', translit: 'davar', meaningKo: '말씀, 일, 것', meaningEn: 'word, thing', category: '명사 (Noun)' },
    { hebrew: 'שֵׁם', translit: 'shem', meaningKo: '이름', meaningEn: 'name', category: '명사 (Noun)' },
    { hebrew: 'עִיר', translit: 'ir', meaningKo: '도시, 성읍', meaningEn: 'city, town', category: '명사 (Noun)' },
    { hebrew: 'מַיִם', translit: 'mayim', meaningKo: '물', meaningEn: 'water', category: '명사 (Noun)' },
    { hebrew: 'שָׁมַיִם', translit: 'shamayim', meaningKo: '하늘', meaningEn: 'heavens, sky', category: '명사 (Noun)' },
    { hebrew: 'טוֹב', translit: 'tov', meaningKo: '좋은, 선한', meaningEn: 'good', category: '형용사 (Adjective)' },
    { hebrew: 'רַع', translit: 'ra', meaningKo: '나쁜, 악한', meaningEn: 'bad, evil', category: '형용사 (Adjective)' },
    { hebrew: 'קָדוֹשׁ', translit: 'qadosh', meaningKo: '거룩한', meaningEn: 'holy', category: '형용사 (Adjective)' },
    { hebrew: 'גָּדוֹל', translit: 'gadol', meaningKo: '큰, 위대한', meaningEn: 'great, large', category: '형용사 (Adjective)' },
    { hebrew: 'אֱלֹהִים', translit: 'elohim', meaningKo: '하나님, 신들', meaningEn: 'God, gods', category: '명사 (Noun)' },
    { hebrew: 'דֶּרֶךְ', translit: 'derekh', meaningKo: '길, 방법', meaningEn: 'way, road', category: '명사 (Noun)' },
    { hebrew: 'עֶבֶד', translit: 'eved', meaningKo: '종, 노예', meaningEn: 'servant, slave', category: '명사 (Noun)' },
    { hebrew: 'עַם', translit: 'am', meaningKo: '백성, 백성들', meaningEn: 'people', category: '명사 (Noun)' },
    { hebrew: 'קוֹל', translit: 'qol', meaningKo: '소리, 음성', meaningEn: 'voice, sound', category: '명사 (Noun)' },
    { hebrew: 'יָד', translit: 'yad', meaningKo: '손', meaningEn: 'hand', category: '명사 (Noun)' },
    { hebrew: 'רֹאשׁ', translit: 'rosh', meaningKo: '머리, 우두머리', meaningEn: 'head, chief', category: '명사 (Noun)' },
    { hebrew: 'לֵב', translit: 'lev', meaningKo: '마음, 가슴', meaningEn: 'heart', category: '명사 (Noun)' },
    { hebrew: 'שָׁנָה', translit: 'shanah', meaningKo: '해(年), 년', meaningEn: 'year', category: '명사 (Noun)' },
    { hebrew: 'עֵץ', translit: 'ets', meaningKo: '나무', meaningEn: 'tree, wood', category: '명사 (Noun)' }
  ],

  // 4. Grammar Paradigms (Tables)
  paradigms: {
    // Noun endings gender/number
    nouns: {
      title: '명사 변화표 (Noun Endings)',
      headers: ['구분 (Gender/Number)', '남성 명사 (Masculine)', '여성 명사 (Feminine)'],
      rows: [
        ['단수 (Singular)', 'סוּס (sus - 수말, 어미없음)', 'סוּסָה (susah - 암말, ָה 어미)'],
        ['복수 (Plural)', 'סוּסִים (susim - 수말들, ִים 어미)', 'סוּסוֹת (susot - 암말들, וֹת 어미)'],
        ['쌍수 (Dual)', 'יוֹมַיִם (yomayim - 이틀, ַיִם 어미)', 'שְׂפָתַיִם (sephathayim - 두 입술, ַתַיִם 어미)']
      ]
    },
    // Pronoun suffixes attached to singular nouns
    pronounSuffixes: {
      title: '명사(단수) 결합 인칭대명사 접미사',
      headers: ['인칭 (Person)', '접미사 형태 (Suffix)', '적용 예시 (Example: 말 סוּס)'],
      rows: [
        ['1인칭 단수 (나의)', 'ִי (i)', 'סוּסִי (susi - 나의 말)'],
        ['2인칭 남성 단수 (너의)', 'ְךָ (ekha)', 'סוּסְךָ (susekha - 너의 말)'],
        ['2인칭 여성 단수 (너의)', 'ֵךְ (ekh)', 'סוּסֵךְ (susekh - 너의 말)'],
        ['3인칭 남성 단수 (그의)', 'וֹ (o)', 'סוּסוֹ (suso - 그의 말)'],
        ['3인칭 여성 단수 (그녀의)', 'ָהּ (ah)', 'סוּסָהּ (susah - 그녀의 말)'],
        ['1인칭 복수 (우리의)', 'ֵנוּ (enu)', 'סוּסֵנוּ (susenu - 우리의 말)'],
        ['2인칭 남성 복수 (너희들의)', 'ְכֶם (ekhem)', 'סוּסְכֶם (susekhem - 너희들의 말)'],
        ['2인칭 여성 복수 (너희들의)', 'ְכֶﻦ (ekhen)', 'סוּסְכֶﻦ (susekhen - 너희들의 말)'],
        ['3인칭 남성 복수 (그들의)', 'ָם (am)', 'סוּסָם (susam - 그들의 말)'],
        ['3인칭 여성 복수 (그녀들의)', 'ָן (an)', 'סוּסָן (susan - 그녀들의 말)']
      ]
    },
    // The 7 verb stem forms in Hebrew
    verbStems: {
      title: '히브리어 동사 7대 Stem (강조/상태 변화)',
      headers: ['동사 형태 (Stem)', '설명 (Meaning)', '대표형태 (3인칭 남성 단수 완료형 - 카탈)'],
      rows: [
        ['Qal (칼)', '단순 능동 (Simple Active)', 'קָטַל (qatal - 그가 죽였다)'],
        ['Niphal (니팔)', '단순 수동/재귀 (Simple Passive/Reflexive)', 'נִקְטַל (niqtal - 그가 죽임당했다)'],
        ['Piel (피엘)', '강조 능동 (Intensive Active)', 'קִטֵּل (qittel - 그가 잔인하게 죽였다)'],
        ['Pual (푸알)', '강조 수동 (Intensive Passive)', 'קֻטַּל (quttal - 그가 잔인하게 죽임당했다)'],
        ['Hithpael (히트파엘)', '강조 재귀 (Intensive Reflexive)', 'הִתְקַטֵּל (hitqattel - 그가 스스로를 죽였다)'],
        ['Hiphil (히필)', '사역 능동 (Causative Active)', 'הִקְטִיל (hiqtil - 그가 죽이게 했다)'],
        ['Hophal (호팔)', '사역 수동 (Causative Passive)', 'הָקְטַל (hoqtal - 그가 죽이게 됨을 당했다)']
      ]
    }
  },

  // 5. The 20-week Curriculum
  curriculum: [
    {
      week: 1,
      title: '1부 기초: 1부 1-2장 전반',
      pages: '23-54',
      goal: '히브리어가 오른쪽에서 왼쪽으로 읽히는 구조와 자음 기본표, 꼬리형을 익힙니다.',
      focus: '자음 기초 (알레프 ~ 요드)',
      chapterFile: '1부_02_히브리어 자음_PDF31-72.pdf',
      quizType: 'consonants_1'
    },
    {
      week: 2,
      title: '자음 마무리와 모음: 1부 2장 후반-3장',
      pages: '55-96',
      goal: '베게드케페트, 이중점, 후음, 반자음과 모음 체계를 배웁니다.',
      focus: '자음 완성 및 모음 체계',
      chapterFile: '1부_03_히브리어 모음_PDF73-95.pdf',
      quizType: 'vowels_all'
    },
    {
      week: 3,
      title: '음절과 액센트: 1부 4-5장',
      pages: '97-118',
      goal: '개음절/폐음절과 세 가지 액센트 법칙을 실제 단어에 적용해 봅니다.',
      focus: '음절 및 액센트 법칙',
      chapterFile: '1부_04_음절 개념_PDF96-104.pdf',
      quizType: 'syllables_accents'
    },
    {
      week: 4,
      title: '2부 진입: 2부 개요-1장',
      pages: '119-130',
      goal: '2부 핵심 도표를 훑고 정관사/접속사의 기본 규칙을 배웁니다.',
      focus: '정관사와 접속사 와우',
      chapterFile: '2부_01_정관사와 접속사_PDF125-129.pdf',
      quizType: 'article_conjunction'
    },
    {
      week: 5,
      title: '명사 변화 1: 2부 2장 전반',
      pages: '131-150',
      goal: '절대형/연계형, 남성/여성, 단수/복수 어미의 뼈대를 익힙니다.',
      focus: '명사 성/수 및 기본 어미',
      chapterFile: '2부_02_명사(형용사) 변화_PDF130-166.pdf',
      quizType: 'nouns_basic'
    },
    {
      week: 6,
      title: '명사 변화 2: 2부 2장 후반',
      pages: '151-168',
      goal: '명사 변화에 액센트 법칙이 어떻게 결합하여 모음이 탈락하는지 익힙니다.',
      focus: '명사 모음 변화 (다바르 변화 등)',
      chapterFile: '2부_02_명사(형용사) 변화_PDF130-166.pdf',
      quizType: 'nouns_advanced'
    },
    {
      week: 7,
      title: '인칭대명사: 2부 3장',
      pages: '169-186',
      goal: '주격, 소유격, 목적격 인칭대명사의 연관 구조를 통째로 외웁니다.',
      focus: '인칭대명사 접미사',
      chapterFile: '2부_03_인칭대명사_PDF167-185.pdf',
      quizType: 'pronouns'
    },
    {
      week: 8,
      title: '지시대명사와 동사 입구: 2부 4장-5장 서론',
      pages: '187-221',
      goal: '지시대명사를 배우고, 히브리어 동사의 7가지 형태와 의미를 배웁니다.',
      focus: '지시대명사 및 동사 7형',
      chapterFile: '2부_04_지시대명사_PDF186-186.pdf',
      quizType: 'demonstratives_stems'
    },
    {
      week: 9,
      title: '칼 동사 뼈대: 2부 5장 C.1-C.2',
      pages: '222-254',
      goal: '칼 완료형(Qal Perfect)의 뼈대와 인칭별 완료 어미 변화를 학습합니다.',
      focus: '칼 완료(Qal Perfect)',
      chapterFile: '2부_05_동사_PDF187-348.pdf',
      quizType: 'qal_perfect'
    },
    {
      week: 10,
      title: '칼 동사 나머지: 2부 5장 C.3-C.8',
      pages: '255-284',
      goal: '칼 미완료, 명령, 부정사, 분사 변화를 통합적으로 묶어 익힙니다.',
      focus: '칼 미완료 및 기타 형태',
      chapterFile: '2부_05_동사_PDF187-348.pdf',
      quizType: 'qal_imperfect_others'
    },
    {
      week: 11,
      title: '파생형 입구: 2부 5장 D',
      pages: '285-298',
      goal: '칼 동사 이외 여섯 파생형(니팔, 피엘, 푸알 등)의 특징을 배웁니다.',
      focus: '파생동사 개요',
      chapterFile: '2부_05_동사_PDF187-348.pdf',
      quizType: 'stems_overview'
    },
    {
      week: 12,
      title: '니팔 동사: 2부 5장 E.1',
      pages: '299-316',
      goal: '니팔(Niphal)의 완료, 미완료, 명령, 분사 등의 변화 원리를 마스터합니다.',
      focus: '니팔 동사 변화',
      chapterFile: '2부_05_동사_PDF187-348.pdf',
      quizType: 'niphal'
    },
    {
      week: 13,
      title: '피엘-호팔과 와우: 2부 5장 E.2-끝',
      pages: '317-348',
      goal: '피엘, 푸알, 히트파엘, 히필, 호팔과 와우 연속법을 총정리합니다.',
      focus: '강조/사역동사 및 와우 연속법',
      chapterFile: '2부_05_동사_PDF187-348.pdf',
      quizType: 'derived_conjugations'
    },
    {
      week: 14,
      title: '3부 명사와 상태동사: 3부 1-2장',
      pages: '351-369',
      goal: '후음/세골 명사의 변화 예외와 상태동사의 특수 변화를 배웁니다.',
      focus: '세골명사 및 상태동사',
      chapterFile: '3부_01_명사_ 추가적 사항들_PDF351-363.pdf',
      quizType: 'nouns_state_verbs'
    },
    {
      week: 15,
      title: '약동사 개념과 후음: 3부 3장 1-3',
      pages: '370-392',
      goal: '약동사의 기본 개념과 페/아인/라메드 후음 동사의 변화 패턴을 익힙니다.',
      focus: '후음 동사 (Guttural Verbs)',
      chapterFile: '3부_03_동사_ 약동사_PDF368-482.pdf',
      quizType: 'guttural_verbs'
    },
    {
      week: 16,
      title: '알렙 동사: 3부 3장 4-5',
      pages: '393-403',
      goal: '페-알렙, 라메드-알렙 동사의 대표 형태와 실전 문장을 익힙니다.',
      focus: '알렙 동사 (I-Alef, III-Alef)',
      chapterFile: '3부_03_동사_ 약동사_PDF368-482.pdf',
      quizType: 'alef_verbs'
    },
    {
      week: 17,
      title: '눈/헤 동사: 3부 3장 6-7',
      pages: '404-418',
      goal: '페-눈(눈 탈락)과 라메드-헤 동사의 변형 패턴을 마스터합니다.',
      focus: '눈 및 헤 동사',
      chapterFile: '3부_03_동사_ 약동사_PDF368-482.pdf',
      quizType: 'nun_he_verbs'
    },
    {
      week: 18,
      title: '요드/와우 앞자리: 3부 3장 8-9',
      pages: '419-434',
      goal: '페-요드, 페-와우 동사의 미완료 및 히필형 특징을 파악합니다.',
      focus: '페-요드/와우 동사',
      chapterFile: '3부_03_동사_ 약동사_PDF368-482.pdf',
      quizType: 'pe_yod_vav_verbs'
    },
    {
      week: 19,
      title: '요드/와우 가운데: 3부 3장 10-11',
      pages: '435-466',
      goal: '아인-와우, 아인-요드(중간 모음 탈락/축약) 동사의 핵심형을 학습합니다.',
      focus: '아인-요드/와우 동사 (Hollow Verbs)',
      chapterFile: '3부_03_동사_ 약동사_PDF368-482.pdf',
      quizType: 'hollow_verbs'
    },
    {
      week: 20,
      title: '중복/이중 약동사와 총복습: 3부 3장 12-13',
      pages: '467-482',
      goal: '아인 중복 및 이중 약동사를 정리하고 전체 뼈대 도표를 복습합니다.',
      focus: '이중약동사 및 총복습',
      chapterFile: '3부_03_동사_ 약동사_PDF368-482.pdf',
      quizType: 'geminate_double_weak'
    }
  ]
};

// Expose to window/global scope or export if module environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HEBREW_DATA;
} else {
  window.HEBREW_DATA = HEBREW_DATA;
}
