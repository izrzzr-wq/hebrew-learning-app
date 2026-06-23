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
  const chKey = `ch${weekNum}`;
  let rawText = CHAPTERS_TEXT[chKey] || "설명 텍스트를 불러오는 중입니다...";
  
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
    
    // Highlight Hebrew letters/words dynamically in the body text
    // Regex matches Hebrew alphabet unicode block characters
    p = p.replace(/([\u0590-\u05FF]+)/g, '<span class="hebrew-word">$1</span>');
    
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

// Game 2: Pronunciation & Vowel Multiple Choice Quiz
function startPronunciationQuiz() {
  showGameArena('pronunciation-quiz-arena');
  document.getElementById('game-header-title').innerText = "발음 & 음가 퀴즈";
  document.getElementById('game-header-desc').innerText = "글자를 보고 가장 정확한 이름과 음가를 찾아보세요.";
  
  // Get pool of questions based on active week
  let pool = [];
  if (activeWeek === 2) {
    // Vowels pool
    pool = HEBREW_DATA.vowels.map(v => ({ q: v.symbol, ans: v.nameKo, hint: `${v.type} (${v.class})` }));
  } else {
    // Consonants pool
    pool = HEBREW_DATA.consonants.map(c => ({ q: c.letter, ans: c.nameKo, hint: `이 자음의 이름은 무엇일까요? (음가: ${c.sound})` }));
  }
  
  // Shuffle and pick 10 questions
  pool.sort(() => Math.random() - 0.5);
  const questions = pool.slice(0, 10);
  
  quizGameInstance = {
    questions: questions,
    currentIndex: 0,
    score: 0,
    total: questions.length,
    answerPool: HEBREW_DATA.consonants.map(c => c.nameKo).concat(HEBREW_DATA.vowels.map(v => v.nameKo))
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
  let wrongAnswers = quizGameInstance.answerPool.filter(ans => ans !== question.ans);
  wrongAnswers.sort(() => Math.random() - 0.5);
  
  choices.push(wrongAnswers[0]);
  choices.push(wrongAnswers[1]);
  choices.push(wrongAnswers[2]);
  
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
