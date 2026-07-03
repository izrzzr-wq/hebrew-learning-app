// State Variables
let activeWeek = 1;
let completedWeeks = [];
let cardGameInstance = null;
let quizGameInstance = null;
let speedGameInstance = null;

// Web Audio Context for Premium Sound Effects
let audioCtx = null;
function playSound(type) {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Resume context if suspended (browser security)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    const now = audioCtx.currentTime;
    
    if (type === 'correct') {
      // Nice double-tone ding (C5 -> E5)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'incorrect') {
      // Low buzzer sound
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130.81, now); // C3
      osc.frequency.linearRampToValueAtTime(100, now + 0.25);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'complete') {
      // Victory fanfare
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);     // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    }
  } catch (e) {
    console.log("Audio not supported or blocked by browser:", e);
  }
}

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
  loadProgress();
  initDashboard();
  initReferenceTables();
  updateProgressUI();
  
  // Set default view
  switchView('dashboard');
});

// View Navigation Controller
function switchView(viewId) {
  // Hide all views
  const views = ['dashboard-view', 'study-view', 'game-view', 'reference-view'];
  views.forEach(id => {
    document.getElementById(id).style.display = 'none';
  });
  
  // Show selected view
  document.getElementById(viewId + '-view').style.display = 'block';
  
  // Update nav menu active states
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.classList.remove('active');
  });
  
  // Find link matching the view name and mark active
  let activeLink = null;
  if (viewId === 'dashboard') {
    activeLink = navLinks[0];
  } else if (viewId === 'study') {
    activeLink = document.getElementById('nav-study');
  } else if (viewId === 'game') {
    activeLink = document.getElementById('nav-game');
  } else if (viewId === 'reference') {
    activeLink = navLinks[3];
  }
  
  if (activeLink) {
    activeLink.classList.add('active');
  }
  
  // Auto scroll to top
  document.querySelector('.main-content').scrollTop = 0;
}

// LocalStorage Progress Management
function loadProgress() {
  const saved = localStorage.getItem('hebrew_completed_weeks');
  if (saved) {
    completedWeeks = JSON.parse(saved);
  }
}

function saveProgress() {
  localStorage.setItem('hebrew_completed_weeks', JSON.stringify(completedWeeks));
  updateProgressUI();
}

function updateProgressUI() {
  const total = HEBREW_DATA.curriculum.length;
  const count = completedWeeks.length;
  const percentage = Math.round((count / total) * 100);
  
  document.getElementById('overall-progress-percentage').innerText = `${percentage}%`;
  document.getElementById('overall-progress-fill').style.width = `${percentage}%`;
  document.getElementById('overall-progress-text').innerText = `완료한 챕터: ${count} / ${total}`;
}

// Initialize Dashboard UI
function initDashboard() {
  const container = document.getElementById('weeks-container');
  container.innerHTML = '';
  
  HEBREW_DATA.curriculum.forEach(week => {
    const isCompleted = completedWeeks.includes(week.week);
    const cardClass = isCompleted ? 'week-card completed' : 'week-card';
    
    // Check status text
    let statusBadge = '';
    if (isCompleted) {
      statusBadge = '<span class="week-status-badge status-completed">완료</span>';
    }
    
    const cardHtml = `
      <div class="${cardClass}" onclick="openStudyWeek(${week.week})">
        <div class="week-number-badge">
          <span class="lbl">WEEK</span>
          <span class="num">${week.week}</span>
        </div>
        <div class="week-details">
          <div class="week-title">
            <span>${week.title}</span>
            ${statusBadge}
          </div>
          <div class="week-meta">
            <span>📖 PDF 쪽수: ${week.pages}</span>
            <span>🎯 핵심: ${week.focus}</span>
          </div>
          <div class="week-goal">${week.goal}</div>
        </div>
        <button class="week-action-btn">공부하기</button>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', cardHtml);
  });
}

// Initialize Reference Grammar Tables
function initReferenceTables() {
  const container = document.getElementById('reference-tables-container');
  container.innerHTML = '';
  
  Object.keys(HEBREW_DATA.paradigms).forEach(key => {
    const tableData = HEBREW_DATA.paradigms[key];
    
    let tableHeaders = tableData.headers.map(h => `<th>${h}</th>`).join('');
    let tableRows = tableData.rows.map(row => {
      let cells = row.map((cell, idx) => {
        // Highlight Hebrew in cells
        if (cell.includes('(') && idx > 0) {
          const parts = cell.split('(');
          const heb = parts[0].trim();
          const desc = parts[1].replace(')', '');
          return `<td><span class="hebrew-word">${heb}</span> <span style="font-size: 0.8rem; color: var(--text-secondary);">(${desc})</span></td>`;
        }
        return `<td>${cell}</td>`;
      }).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    
    const tableHtml = `
      <div class="reference-section">
        <h3 class="reference-section-title">${tableData.title}</h3>
        <div class="premium-table-wrapper">
          <table class="premium-table">
            <thead>
              <tr>${tableHeaders}</tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', tableHtml);
  });
}

// Open Chapter Study Mode
function openStudyWeek(weekNum) {
  activeWeek = weekNum;
  const weekData = HEBREW_DATA.curriculum.find(w => w.week === weekNum);
  if (!weekData) return;
  
  // Set UI texts
  document.getElementById('study-header-title').innerText = `${weekNum}주차. ${weekData.title}`;
  document.getElementById('study-pages').innerText = `PDF ${weekData.pages}쪽`;
  document.getElementById('study-goal').innerText = weekData.goal;
  
  // Mark completed button toggle
  const btnMark = document.getElementById('btn-mark-complete');
  if (completedWeeks.includes(weekNum)) {
    btnMark.innerText = '↺ 완료 취소하기';
    btnMark.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
    btnMark.style.color = 'var(--color-danger)';
    btnMark.style.borderColor = 'rgba(239, 68, 68, 0.2)';
  } else {
    btnMark.innerText = '✓ 이 주차 학습 완료';
    btnMark.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
    btnMark.style.color = 'var(--color-success)';
    btnMark.style.borderColor = 'rgba(16, 185, 129, 0.3)';
  }
  
  // Load cleaned explanation text
  const weekToChapterMap = {
    1: ["ch1", "ch2"],
    2: ["ch3"],
    3: ["ch4", "ch5"],
    4: ["ch6", "ch7"],
    5: ["ch8"],
    6: ["ch8"],
    7: ["ch9"],
    8: ["ch10"],
    9: ["ch11"],
    10: ["ch11"],
    11: ["ch11"],
    12: ["ch11"],
    13: ["ch11"],
    14: ["ch12", "ch13"],
    15: ["ch14", "ch15"],
    16: ["ch15"],
    17: ["ch15"],
    18: ["ch15"],
    19: ["ch15"],
    20: ["ch15"]
  };
  
  const chKeys = weekToChapterMap[weekNum] || [];
  let rawText = "";
  if (chKeys.length > 0) {
    rawText = chKeys.map(key => CHAPTERS_TEXT[key] || "").filter(t => t !== "").join("\n\n");
  }
  
  if (!rawText) {
    rawText = "설명 텍스트를 불러오는 중입니다...";
  }
  
  // Format the text into HTML
  let formattedHtml = formatExplanationToHtml(rawText, weekNum);
  document.getElementById('explanation-content').innerHTML = formattedHtml;
  
  // Switch view to Study Tab
  switchView('study');
}

// Formatter to render clean explanations, converting markdowns and adding Hebrew font styling
function formatExplanationToHtml(text, weekNum) {
  // Convert Markdown headings
  text = text.replace(/### Page (\d+)/g, '<div style="font-size: 0.8rem; color: var(--text-muted); border-top: 1px solid var(--border-card); margin: 2.5rem 0 1rem; padding-top: 0.5rem;">[교재 원본 PDF $1쪽]</div>');
  text = text.replace(/## (.*)/g, '<h2>$1</h2>');
  text = text.replace(/# (.*)/g, '<h1 style="font-size: 1.8rem; margin-bottom: 1.5rem; color: white;">$1</h1>');
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong style="color: white;">$1</strong>');
  
  // Convert line breaks to paragraphs
  let paragraphs = text.split('\n');
  let bodyHtml = paragraphs.map(p => {
    p = p.trim();
    if (!p) return '';
    if (p.startsWith('<h') || p.startsWith('<div')) return p;
    
    // Highlight Hebrew letters/words dynamically in the body text (Hebrew Unicode range only)
    p = p.replace(/([\u0590-\u05FF\uFB1D-\uFB4F\u25cc]+)/g, '<span class="hebrew-word">$1</span>');
    
    return `<p>${p}</p>`;
  }).join('');
  
  // Add a beautiful pre-verified Hebrew Key Concept Header Card at the beginning of lessons for Weeks 1 and 2
  let keyConceptCard = '';
  if (weekNum === 1) {
    keyConceptCard = `
      <div class="hebrew-block" style="background: linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(6,182,212,0.1) 100%);">
        <h3 style="color: white; margin-bottom: 1rem;">✨ 1주차 핵심 가이드: 히브리어 자음 1부</h3>
        <p style="margin-bottom: 1.5rem;">히브리어 알파벳은 <strong>오른쪽에서 왼쪽</strong>으로 읽습니다. 첫 10개의 자음 모양과 발음(이름)을 카드로 매칭하고 눈으로 익히세요!</p>
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem;">
          ${HEBREW_DATA.consonants.slice(0, 10).map(c => `
            <div style="background: var(--bg-secondary); border: 1px solid var(--border-card); border-radius: 12px; padding: 0.75rem 1rem; text-align: center; min-width: 70px;">
              <div style="font-family: var(--font-hebrew); font-size: 2.2rem; line-height: 1.1; color: white;">${c.letter}</div>
              <div style="font-size: 0.75rem; font-weight: 700; color: var(--color-secondary); margin-top: 0.25rem;">${c.nameKo}</div>
              <div style="font-size: 0.65rem; color: var(--text-muted);">${c.sound.split(' ')[0]}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (weekNum === 2) {
    keyConceptCard = `
      <div class="hebrew-block" style="background: linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(16,185,129,0.1) 100%);">
        <h3 style="color: white; margin-bottom: 1rem;">✨ 2주차 핵심 가이드: 히브리어 모음 체계</h3>
        <p style="margin-bottom: 1.5rem;">히브리어는 본래 자음만 쓰는 언어이며, <strong>Niqqud(점과 선으로 구성된 기호)</strong>를 자음 아래/위에 붙여 모음을 표기합니다. 모음 계열별 소리 차이를 익히세요!</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem;">
          ${HEBREW_DATA.vowels.slice(0, 8).map(v => `
            <div style="background: var(--bg-secondary); border: 1px solid var(--border-card); border-radius: 12px; padding: 0.75rem; text-align: center;">
              <div style="font-family: var(--font-hebrew); font-size: 1.8rem; line-height: 1; color: white;">ב${v.symbol}</div>
              <div style="font-size: 0.8rem; font-weight: 700; color: var(--color-primary-light); margin-top: 0.2rem;">${v.nameKo.split(' ')[0]}</div>
              <div style="font-size: 0.7rem; color: var(--text-secondary);">${v.type} (${v.sound})</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (weekNum === 5 || weekNum === 6) {
    keyConceptCard = `
      <div class="hebrew-block" style="background: linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(16,185,129,0.1) 100%);">
        <h3 style="color: white; margin-bottom: 1rem;">✨ 5-6주차 핵심 가이드: 명사 성/수 어미 변화</h3>
        <p style="margin-bottom: 1.5rem;">명사의 어미를 보면 단수/복수/쌍수 및 남성/여성을 구분할 수 있습니다. 뼈대 규칙을 꼭 외워두세요.</p>
        <div style="display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap;">
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-card); border-radius: 12px; padding: 1rem; text-align: center; min-width: 140px;">
            <div style="font-size: 0.8rem; color: var(--text-muted);">남성 복수</div>
            <div style="font-family: var(--font-hebrew); font-size: 2.2rem; color: white; margin: 0.25rem 0;">ִים</div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--color-secondary);">-임 (im)</div>
          </div>
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-card); border-radius: 12px; padding: 1rem; text-align: center; min-width: 140px;">
            <div style="font-size: 0.8rem; color: var(--text-muted);">여성 단수</div>
            <div style="font-family: var(--font-hebrew); font-size: 2.2rem; color: white; margin: 0.25rem 0;">ָה</div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--color-primary-light);">-아 (ah)</div>
          </div>
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-card); border-radius: 12px; padding: 1rem; text-align: center; min-width: 140px;">
            <div style="font-size: 0.8rem; color: var(--text-muted);">여성 복수</div>
            <div style="font-family: var(--font-hebrew); font-size: 2.2rem; color: white; margin: 0.25rem 0;">וֹת</div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--color-success);">-오트 (ot)</div>
          </div>
        </div>
      </div>
    `;
  }
  
  return keyConceptCard + bodyHtml;
}

// Toggle Week Study Completed status
function markActiveWeekComplete() {
  if (completedWeeks.includes(activeWeek)) {
    // Unmark
    completedWeeks = completedWeeks.filter(w => w !== activeWeek);
    playSound('incorrect');
  } else {
    // Mark completed
    completedWeeks.push(activeWeek);
    playSound('complete');
  }
  saveProgress();
  initDashboard(); // Re-render weeks on dashboard
  openStudyWeek(activeWeek); // Re-load button text
}

// Launch Game from Study Side Panel
function launchGameForActiveWeek() {
  const weekData = HEBREW_DATA.curriculum.find(w => w.week === activeWeek);
  if (!weekData) return;
  
  switchView('game');
  
  // Decide which game is best matching the week
  if (activeWeek === 1) {
    // Week 1: Start card matching with consonants 1-10
    startCardMatchingGame();
  } else if (activeWeek === 2) {
    // Week 2: Start pronunciation/vowel quiz
    startPronunciationQuiz();
  } else {
    // Other weeks: Start speed vocab matching
    startSpeedVocabGame();
  }
}

// --- GAME LOGIC IMPLEMENTATIONS ---

function backToGameMenu() {
  // Show selections, hide arenas
  document.getElementById('game-selection-screen').style.display = 'block';
  document.getElementById('game-play-arena').style.display = 'none';
  document.getElementById('btn-back-to-games').style.display = 'none';
  
  // Stop timers if any
  if (speedGameInstance && speedGameInstance.timerId) {
    clearInterval(speedGameInstance.timerId);
  }
  
  document.getElementById('game-header-title').innerText = "복습 게임 아레나";
  document.getElementById('game-header-desc').innerText = "다양한 게임 모드로 히브리어를 더 빠르게 암기해보세요.";
}

function showGameArena(arenaId) {
  document.getElementById('game-selection-screen').style.display = 'none';
  document.getElementById('game-play-arena').style.display = 'block';
  document.getElementById('btn-back-to-games').style.display = 'block';
  
  // Hide all specific arenas
  const arenas = ['card-matching-arena', 'pronunciation-quiz-arena', 'speed-vocab-arena'];
  arenas.forEach(id => {
    document.getElementById(id).style.display = 'none';
  });
  
  // Show active arena
  document.getElementById(arenaId).style.display = 'block';
}

// Game 1: Card Matching Game
function startCardMatchingGame() {
  showGameArena('card-matching-arena');
  document.getElementById('game-header-title').innerText = "카드 매칭 게임";
  document.getElementById('game-header-desc').innerText = "카드 쌍을 맞춰 자음/모음의 형상과 발음을 완전히 손에 익히세요.";
  
  // Setup card list based on active week
  let items = [];
  if (activeWeek === 2) {
    // Vowels matching
    items = HEBREW_DATA.vowels.slice(0, 8).map(v => ({ key: v.symbol, label: v.symbol, match: v.nameKo.split(' ')[0] }));
  } else {
    // Week 1 or default: Consonants matching (first 8 consonants)
    items = HEBREW_DATA.consonants.slice(0, 8).map(c => ({ key: c.letter, label: c.letter, match: c.nameKo }));
  }
  
  // Prepare dual card deck
  let deck = [];
  items.forEach(item => {
    deck.push({ id: item.key + '_heb', text: item.label, isHebrew: true, matchKey: item.key });
    deck.push({ id: item.key + '_desc', text: item.match, isHebrew: false, matchKey: item.key });
  });
  
  // Shuffle deck
  deck.sort(() => Math.random() - 0.5);
  
  cardGameInstance = {
    deck: deck,
    flipped: [],
    matchedCount: 0,
    totalPairs: items.length,
    turns: 0
  };
  
  // Render cards
  const container = document.getElementById('matching-cards-container');
  container.innerHTML = '';
  
  cardGameInstance.deck.forEach((card, idx) => {
    const isHebClass = card.isHebrew ? 'large-hebrew-font' : '';
    const cardHtml = `
      <div class="flip-card" id="card-${idx}" onclick="flipCard(${idx})">
        <div class="flip-card-inner">
          <div class="flip-card-front">?</div>
          <div class="flip-card-back ${card.isHebrew ? 'hebrew-word' : ''}">${card.text}</div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', cardHtml);
  });
  
  document.getElementById('matching-matches').innerText = `0 / ${cardGameInstance.totalPairs}`;
  document.getElementById('matching-turns').innerText = `0`;
}

function flipCard(idx) {
  const cardElement = document.getElementById(`card-${idx}`);
  if (!cardGameInstance || cardElement.classList.contains('flipped') || cardElement.classList.contains('matched')) return;
  
  // Only allow max 2 flipped cards at a time
  if (cardGameInstance.flipped.length >= 2) return;
  
  // Flip
  cardElement.classList.add('flipped');
  cardGameInstance.flipped.push(idx);
  
  if (cardGameInstance.flipped.length === 2) {
    cardGameInstance.turns++;
    document.getElementById('matching-turns').innerText = cardGameInstance.turns;
    
    // Check match
    const idx1 = cardGameInstance.flipped[0];
    const idx2 = cardGameInstance.flipped[1];
    const card1 = cardGameInstance.deck[idx1];
    const card2 = cardGameInstance.deck[idx2];
    
    if (card1.matchKey === card2.matchKey && card1.isHebrew !== card2.isHebrew) {
      // MATCH SUCCESS
      playSound('correct');
      setTimeout(() => {
        document.getElementById(`card-${idx1}`).classList.add('matched');
        document.getElementById(`card-${idx2}`).classList.add('matched');
        cardGameInstance.flipped = [];
        cardGameInstance.matchedCount++;
        document.getElementById('matching-matches').innerText = `${cardGameInstance.matchedCount} / ${cardGameInstance.totalPairs}`;
        
        // Game complete check
        if (cardGameInstance.matchedCount === cardGameInstance.totalPairs) {
          setTimeout(() => {
            playSound('complete');
            alert(`🎉 축하합니다! 모든 카드를 매칭하셨습니다! \n총 시도 횟수: ${cardGameInstance.turns}회`);
          }, 300);
        }
      }, 500);
    } else {
      // MATCH FAILED
      playSound('incorrect');
      setTimeout(() => {
        document.getElementById(`card-${idx1}`).classList.remove('flipped');
        document.getElementById(`card-${idx2}`).classList.remove('flipped');
        cardGameInstance.flipped = [];
      }, 1000);
    }
  }
}

// Generate custom quiz pools matching the weekly grammar themes
function getQuizPoolForWeek(weekNum) {
  let pool = [];
  
  if (weekNum === 1) {
    // 자음 1부 (1~11번째 자음)
    pool = HEBREW_DATA.consonants.slice(0, 11).map(c => ({
      q: c.letter,
      ans: c.nameKo,
      hint: `이 자음의 이름은 무엇일까요? (음가: ${c.sound.split(' ')[0]})`
    }));
  } 
  else if (weekNum === 2) {
    // 모음 전체 + 자음 2부
    const vowelsPool = HEBREW_DATA.vowels.map(v => ({
      q: `자음 ב에 붙은 모음 [ ב${v.symbol} ] 의 발음은 무엇일까요?`,
      ans: v.nameKo,
      hint: `${v.type} (${v.class})`
    }));
    const consonants2Pool = HEBREW_DATA.consonants.slice(11).map(c => ({
      q: c.letter,
      ans: c.nameKo,
      hint: `이 자음의 이름은 무엇일까요? (음가: ${c.sound.split(' ')[0]})`
    }));
    pool = [...vowelsPool, ...consonants2Pool];
  } 
  else if (weekNum === 3) {
    // 음절 및 액센트 법칙에 대한 개념 퀴즈
    pool = [
      { q: "자음 + 모음 구조의 음절을 무엇이라고 하나요?", ans: "개음절 (열린 음절)", hint: "예: 가, 나, 다" },
      { q: "자음 + 모음 + 자음 구조의 음절을 무엇이라고 하나요?", ans: "폐음절 (닫힌 음절)", hint: "예: 감, 납, 앞" },
      { q: "히브리어 자음 중 '목구멍 소리'를 내는 후음(Guttural)이 아닌 자음은?", ans: "ב (베트)", hint: "후음은 א, ה, ח, ע, (ר) 입니다." },
      { q: "자음 중앙에 찍혀 자음이 중복됨을 나타내는 점의 이름은?", ans: "이중점 (Dagesh Forte)", hint: "자음을 2중으로 발음함을 의미" },
      { q: "베게드케페트(Begedkephat) 문자 중앙에 찍혀 강한 소리를 나타내는 점은?", ans: "경음점 (Dagesh Lene)", hint: "소리를 딱딱하게 내도록 함" }
    ];
  }
  else if (weekNum === 4) {
    // 정관사와 접속사 와우
    pool = [
      { q: "히브리어 정관사의 기본 형태는 무엇인가요?", ans: "הַ (하 + 다음 자음에 이중점)", hint: "정관사 'the'에 해당" },
      { q: "히브리어 접속사 '그리고(and)'의 기본 형태는?", ans: "וְ (와우 쉐바)", hint: "접속사 'and'" },
      { q: "정관사 הַ가 후음(א, ע, ר) 앞에 올 때 일어나는 현상은?", ans: "보상장단 (모음이 카메츠 ָ 로 길어짐)", hint: "후음에는 이중점을 찍지 못하므로 앞의 모음이 길어짐" },
      { q: "접속사 와우(ו)가 순음(ב, מ, פ)이나 쉐바를 가진 자음 앞에 올 때 변하는 형태는?", ans: "וּ (슈렉 '우')", hint: "발음 편의를 위해 변형됨" }
    ];
  }
  else if (weekNum === 5 || weekNum === 6) {
    // 명사 성수 어미 및 명사 변화
    pool = [
      { q: "히브리어 여성 단수 명사의 가장 대표적인 어미는?", ans: "ָה (-아)", hint: "예: סוּסָה (susah - 암말)" },
      { q: "히브리어 남성 복수 명사의 가장 대표적인 어미는?", ans: "ִים (-임)", hint: "예: סוּסִים (susim - 수말들)" },
      { q: "히브리어 여성 복수 명사의 가장 대표적인 어미는?", ans: "וֹת (-오트)", hint: "예: סוּסוֹת (susot - 암말들)" },
      { q: "히브리어 쌍수(Dual, 눈/귀/손/이틀 등) 명사의 대표적인 어미는?", ans: "ַיִם (-아임)", hint: "예: יוֹמַיִם (yomayim - 이틀)" },
      { q: "히브리어 명사가 소유격('~의')을 나타내기 위해 단축되는 형태의 명사를 무엇이라 하나요?", ans: "연계형 (Construct State)", hint: "수식을 받는 명사의 형태 변화" }
    ];
  }
  else if (weekNum === 7) {
    // 인칭대명사 접미사
    pool = [
      { q: "명사 뒤에 붙는 인칭대명사 접미사 중 '나의 (1인칭 단수)'를 뜻하는 형태는?", ans: "ִי (i)", hint: "예: סוּסִי (나의 말)" },
      { q: "명사 뒤에 붙는 인칭대명사 접미사 중 '그의 (3인칭 남성 단수)'를 뜻하는 형태는?", ans: "וֹ (o)", hint: "예: סוּסוֹ (그의 말)" },
      { q: "명사 뒤에 붙는 인칭대명사 접미사 중 '그녀의 (3인칭 여성 단수)'를 뜻하는 형태는?", ans: "ָהּ (ah)", hint: "예: סוּסָהּ (그녀의 말)" },
      { q: "명사 뒤에 붙는 인칭대명사 접미사 중 '너의 (2인칭 남성 단수)'를 뜻하는 형태는?", ans: "ְךָ (ekha)", hint: "예: סוּסְךָ (너의 말)" },
      { q: "명사 뒤에 붙는 인칭대명사 접미사 중 '우리의 (1인칭 복수)'를 뜻하는 형태는?", ans: "ֵנוּ (enu)", hint: "예: סוּסֵנוּ (우리의 말)" }
    ];
  }
  else if (weekNum === 8) {
    // 지시대명사 및 동사 7형
    pool = [
      { q: "히브리어 동사 7대 형태 중 '단순 능동 (Simple Active)'을 뜻하는 형태는?", ans: "Qal (칼)", hint: "예: 카탈 (그가 죽였다)" },
      { q: "히브리어 동사 7대 형태 중 '단순 수동 (Simple Passive)'을 뜻하는 형태는?", ans: "Niphal (니팔)", hint: "예: 니크탈 (그가 죽임당했다)" },
      { q: "히브리어 동사 7대 형태 중 '강조 능동 (Intensive Active)'을 뜻하는 형태는?", ans: "Piel (피엘)", hint: "중앙 자음에 이중점이 있는 형태" },
      { q: "히브리어 동사 7대 형태 중 '강조 수동 (Intensive Passive)'을 뜻하는 형태는?", ans: "Pual (푸알)", hint: "자음 중앙 이중점과 u-a 모음 결합" },
      { q: "히브리어 동사 7대 형태 중 '사역 능동 (Causative Active)'을 뜻하는 형태는?", ans: "Hiphil (히필)", hint: "접두사 헤(ה)와 세골/히렉 모음 결합" },
      { q: "이것(This, 남성 단수)을 뜻하는 히브리어 지시대명사는?", ans: "זֶה (zeh)", hint: "This (Masculine Singular)" }
    ];
  }
  else if (weekNum >= 9 && weekNum <= 13) {
    // 동사 완료/미완료
    pool = [
      { q: "히브리어 칼 완료(Qal Perfect) 3인칭 남성 단수의 기본 형태는?", ans: "קָטַל (qatal)", hint: "그가 죽였다" },
      { q: "완료(Perfect) 시제가 주로 나타내는 의미는?", ans: "동작의 완료 (과거/현재완료 등)", hint: "이미 완료된 동작" },
      { q: "미완료(Imperfect) 시제가 주로 나타내는 의미는?", ans: "동작의 미완료 (미래/지속/반복 등)", hint: "아직 완료되지 않은 동작" },
      { q: "파생동사 중 '사역 능동' 형태로 '~하게 만들다'의 의미를 가진 것은?", ans: "Hiphil (히필)", hint: "Causative Active" },
      { q: "동사 완료형 뒤에 붙어 1인칭 단수 주어('내가 ~했다')를 만드는 어미는?", ans: "תִּי (ti)", hint: "예: 카탈티 (내가 죽였다)" },
      { q: "동사 완료형 뒤에 붙어 3인칭 복수 주어('그들이 ~했다')를 만드는 어미는?", ans: "וּ (u)", hint: "예: 카틀루 (그들이 죽였다)" }
    ];
  }
  else {
    // 3부 약동사
    pool = [
      { q: "히브리어에서 자음 중 목구멍 소리가 나는 후음(Guttural)의 중요한 특징은?", ans: "이중점을 찍지 못하고, 주로 a 계열 모음을 선호함", hint: "א, ה, ח, ע, (ר)" },
      { q: "3개 어근 자음 중 일부가 탈락하거나 변형되는 동사를 무엇이라고 하나요?", ans: "약동사 (Weak Verbs)", hint: "후음이나 요드, 와우, 눈 등을 어근으로 가진 동사" },
      { q: "어근의 첫 번째 자음에 '눈(נ)'이 와서 미완료 등에서 눈이 탈락하는 약동사는?", ans: "페-눈 동사 (I-Nun)", hint: "예: 나타쉬 -> 이토쉬" },
      { q: "어근의 두 번째 자음에 와우(ו)나 요드(י)가 와서 모음처럼 소리나고 탈락하기 쉬운 동사는?", ans: "아인-와우/요드 동사 (Hollow Verbs)", hint: "가운데가 비어있는 동사" }
    ];
  }
  
  return pool;
}

// Game 2: Pronunciation & Vowel Multiple Choice Quiz
function startPronunciationQuiz() {
  showGameArena('pronunciation-quiz-arena');
  document.getElementById('game-header-title').innerText = "발음 & 음가 퀴즈";
  document.getElementById('game-header-desc').innerText = "글자를 보고 가장 정확한 이름과 음가를 찾아보세요.";
  
  // Get pool of questions based on active week
  let pool = getQuizPoolForWeek(activeWeek);
  
  // Shuffle and pick 10 questions (or less if pool is small)
  pool.sort(() => Math.random() - 0.5);
  const questions = pool.slice(0, Math.min(10, pool.length));
  
  quizGameInstance = {
    questions: questions,
    currentIndex: 0,
    score: 0,
    total: questions.length,
    answerPool: HEBREW_DATA.consonants.map(c => c.nameKo)
      .concat(HEBREW_DATA.vowels.map(v => v.nameKo))
      .concat(["개음절 (열린 음절)", "폐음절 (닫힌 음절)", "경음점 (Dagesh Lene)", "이중점 (Dagesh Forte)", "보상장단 (모음이 카메츠 ָ 로 길어짐)", "연계형 (Construct State)"])
  };
  
  loadQuizQuestion();
}

function loadQuizQuestion() {
  if (!quizGameInstance || quizGameInstance.currentIndex >= quizGameInstance.total) {
    // Quiz completed
    playSound('complete');
    alert(`🎉 퀴즈 완료! 최종 점수: ${quizGameInstance.score} / ${quizGameInstance.total}점`);
    backToGameMenu();
    return;
  }
  
  const qIndex = quizGameInstance.currentIndex;
  const question = quizGameInstance.questions[qIndex];
  
  // Update UI stats
  document.getElementById('quiz-score').innerText = quizGameInstance.score;
  document.getElementById('quiz-progress').innerText = `${qIndex + 1} / ${quizGameInstance.total}`;
  
  // Load question characters
  document.getElementById('quiz-question-character').innerText = question.q;
  document.getElementById('quiz-question-hint').innerText = question.hint;
  
  // Generate options (1 correct + 3 incorrect)
  let choices = [question.ans];
  
  // Categorized answer pools for realistic distractors
  const consonantAnswers = HEBREW_DATA.consonants.map(c => c.nameKo);
  const vowelAnswers = HEBREW_DATA.vowels.map(v => v.nameKo);
  const conceptAnswers = [
    "개음절 (열린 음절)", "폐음절 (닫힌 음절)", "경음점 (Dagesh Lene)", "이중점 (Dagesh Forte)",
    "보상장단 (모음이 카메츠 ָ 로 길어짐)", "연계형 (Construct State)", "Qal (칼)", "Niphal (니팔)",
    "Piel (피엘)", "Pual (푸알)", "Hiphil (히필)", "Hophal (호팔)", "Hithpael (히트파엘)",
    "정관사의 기본형", "접속사의 기본형", "유성/무성 쉐바", "후음 (Guttural)", "약동사 (Weak Verbs)"
  ];
  const pronounAnswers = [
    "ִי (i)", "ְךָ (ekha)", "ֵךְ (ekh)", "וֹ (o)", "ָהּ (ah)", "ֵנוּ (enu)", "ְכֶם (ekhem)", "ְכֶﻦ (ekhen)", "ָם (am)", "ָן (an)"
  ];
  
  let currentPool = quizGameInstance.answerPool;
  if (consonantAnswers.includes(question.ans)) {
    currentPool = consonantAnswers;
  } else if (vowelAnswers.includes(question.ans)) {
    currentPool = vowelAnswers;
  } else if (pronounAnswers.includes(question.ans)) {
    currentPool = pronounAnswers;
  } else if (conceptAnswers.includes(question.ans) || conceptAnswers.some(c => question.ans.includes(c))) {
    currentPool = conceptAnswers;
  }
  
  let wrongAnswers = currentPool.filter(ans => ans !== question.ans);
  wrongAnswers.sort(() => Math.random() - 0.5);
  
  let selectedWrongs = [];
  for (let i = 0; i < wrongAnswers.length; i++) {
    if (selectedWrongs.length >= 3) break;
    if (!selectedWrongs.includes(wrongAnswers[i])) {
      selectedWrongs.push(wrongAnswers[i]);
    }
  }
  
  if (selectedWrongs.length < 3) {
    let generalWrongs = quizGameInstance.answerPool.filter(ans => ans !== question.ans && !selectedWrongs.includes(ans));
    generalWrongs.sort(() => Math.random() - 0.5);
    while (selectedWrongs.length < 3 && generalWrongs.length > 0) {
      selectedWrongs.push(generalWrongs.shift());
    }
  }
  
  selectedWrongs.forEach(w => choices.push(w));
  
  // Shuffle choices
  choices.sort(() => Math.random() - 0.5);
  
  // Render options buttons
  const container = document.getElementById('quiz-choices-container');
  container.innerHTML = '';
  
  choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerText = choice;
    btn.onclick = () => selectQuizAnswer(btn, choice, question.ans);
    container.appendChild(btn);
  });
}

function selectQuizAnswer(button, choice, correctAns) {
  // Disable all choice buttons to prevent duplicate taps
  const buttons = document.querySelectorAll('.choice-btn');
  buttons.forEach(btn => btn.disabled = true);
  
  if (choice === correctAns) {
    button.classList.add('correct');
    quizGameInstance.score++;
    document.getElementById('quiz-score').innerText = quizGameInstance.score;
    playSound('correct');
  } else {
    button.classList.add('incorrect');
    // Highlight the correct answer in green
    buttons.forEach(btn => {
      if (btn.innerText === correctAns) {
        btn.classList.add('correct');
      }
    });
    playSound('incorrect');
  }
  
  // Wait 1.5 seconds and load next question
  setTimeout(() => {
    quizGameInstance.currentIndex++;
    loadQuizQuestion();
  }, 1500);
}

// Game 3: Speed Vocabulary Game
function startSpeedVocabGame() {
  showGameArena('speed-vocab-arena');
  document.getElementById('game-header-title').innerText = "스피드 단어 매칭";
  document.getElementById('game-header-desc').innerText = "단어들과 뜻을 제한 시간 내에 빠르게 짝지어 매칭하세요!";
  
  // Pick 5 random words from vocab
  let vocabPool = [...HEBREW_DATA.vocabulary];
  vocabPool.sort(() => Math.random() - 0.5);
  let selected = vocabPool.slice(0, 5);
  
  speedGameInstance = {
    words: selected,
    selectedLeft: null,
    selectedRight: null,
    score: 0,
    timeLeft: 30,
    timerId: null
  };
  
  // Render lists
  renderVocabGameLists();
  
  // Start Timer
  document.getElementById('vocab-timer').innerText = `30초`;
  document.getElementById('vocab-score').innerText = '0';
  
  if (speedGameInstance.timerId) clearInterval(speedGameInstance.timerId);
  speedGameInstance.timerId = setInterval(() => {
    speedGameInstance.timeLeft--;
    document.getElementById('vocab-timer').innerText = `${speedGameInstance.timeLeft}초`;
    
    if (speedGameInstance.timeLeft <= 0) {
      clearInterval(speedGameInstance.timerId);
      playSound('complete');
      alert(`⏱️ 시간 초과! 최종 점수: ${speedGameInstance.score}점`);
      backToGameMenu();
    }
  }, 1000);
}

function renderVocabGameLists() {
  const leftContainer = document.getElementById('vocab-left-list');
  const rightContainer = document.getElementById('vocab-right-list');
  
  leftContainer.innerHTML = '';
  rightContainer.innerHTML = '';
  
  // Left: Hebrew words (original order)
  speedGameInstance.words.forEach((word, idx) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn hebrew-word';
    btn.style.fontSize = '2.2rem';
    btn.style.padding = '0.5rem 1rem';
    btn.innerText = word.hebrew;
    btn.id = `vocab-left-${idx}`;
    btn.onclick = () => selectVocabLeft(idx);
    leftContainer.appendChild(btn);
  });
  
  // Right: Meanings (shuffled)
  let rightItems = speedGameInstance.words.map((w, idx) => ({ idx: idx, meaning: w.meaningKo }));
  rightItems.sort(() => Math.random() - 0.5);
  
  rightItems.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerText = item.meaning;
    btn.id = `vocab-right-${item.idx}`;
    btn.onclick = () => selectVocabRight(item.idx);
    rightContainer.appendChild(btn);
  });
}

function selectVocabLeft(idx) {
  // Clear previous selected styling
  if (speedGameInstance.selectedLeft !== null) {
    document.getElementById(`vocab-left-${speedGameInstance.selectedLeft}`).style.borderColor = 'var(--border-card)';
  }
  
  speedGameInstance.selectedLeft = idx;
  document.getElementById(`vocab-left-${idx}`).style.borderColor = 'var(--color-primary-light)';
  
  checkVocabMatch();
}

function selectVocabRight(idx) {
  // Clear previous selected styling
  if (speedGameInstance.selectedRight !== null) {
    document.getElementById(`vocab-right-${speedGameInstance.selectedRight}`).style.borderColor = 'var(--border-card)';
  }
  
  speedGameInstance.selectedRight = idx;
  document.getElementById(`vocab-right-${idx}`).style.borderColor = 'var(--color-secondary)';
  
  checkVocabMatch();
}

function checkVocabMatch() {
  if (speedGameInstance.selectedLeft !== null && speedGameInstance.selectedRight !== null) {
    const leftIdx = speedGameInstance.selectedLeft;
    const rightIdx = speedGameInstance.selectedRight;
    
    const leftBtn = document.getElementById(`vocab-left-${leftIdx}`);
    const rightBtn = document.getElementById(`vocab-right-${rightIdx}`);
    
    if (leftIdx === rightIdx) {
      // MATCH SUCCESS
      playSound('correct');
      leftBtn.classList.add('correct');
      rightBtn.classList.add('correct');
      
      leftBtn.disabled = true;
      rightBtn.disabled = true;
      
      speedGameInstance.score += 10;
      document.getElementById('vocab-score').innerText = speedGameInstance.score;
      
      // Reset selected slots
      speedGameInstance.selectedLeft = null;
      speedGameInstance.selectedRight = null;
      
      // Check if all matched
      const allLeftDisabled = Array.from(document.querySelectorAll('#vocab-left-list button')).every(b => b.disabled);
      if (allLeftDisabled) {
        setTimeout(() => {
          // Play complete sound, select 5 new words to continue
          playSound('complete');
          
          let vocabPool = [...HEBREW_DATA.vocabulary];
          vocabPool.sort(() => Math.random() - 0.5);
          speedGameInstance.words = vocabPool.slice(0, 5);
          speedGameInstance.selectedLeft = null;
          speedGameInstance.selectedRight = null;
          
          renderVocabGameLists();
        }, 1000);
      }
    } else {
      // MATCH FAILED
      playSound('incorrect');
      leftBtn.classList.add('incorrect');
      rightBtn.classList.add('incorrect');
      
      setTimeout(() => {
        leftBtn.classList.remove('incorrect');
        rightBtn.classList.remove('incorrect');
        leftBtn.style.borderColor = 'var(--border-card)';
        rightBtn.style.borderColor = 'var(--border-card)';
      }, 800);
      
      // Reset selected slots
      speedGameInstance.selectedLeft = null;
      speedGameInstance.selectedRight = null;
    }
  }
}
