/* =========================================
   HUMAN FIREWALL CHAMPIONSHIP — script.js
   ========================================= */

// ── FISHBONE DIAGRAM ──────────────────────────────────────────
const bones = document.querySelectorAll('.bone');
const bonePanel = document.getElementById('bonePanel');
const bonePanelTitle = document.getElementById('bonePanelTitle');
const bonePanelText = document.getElementById('bonePanelText');

bones.forEach(bone => {
  bone.addEventListener('click', () => {
    const cause = bone.dataset.cause;
    const detail = bone.dataset.detail;
    bonePanelTitle.textContent = cause;
    bonePanelText.textContent = detail;
    bonePanel.classList.add('visible');
    bones.forEach(b => b.style.opacity = '0.5');
    bone.style.opacity = '1';
  });
});


// ── ROADMAP ───────────────────────────────────────────────────
const phaseData = {
  1: {
    week: 'Week 1',
    title: 'Awareness',
    desc: 'Establish the knowledge foundation. Employees learn the 5 indicators of phishing, complete the first Header Detective challenge, and are introduced to the tournament rules and scoring system.',
    items: ['Kick-off Briefing', 'Header Detective Intro Round', 'Phishing Indicators Cheat Sheet', 'Team Registration']
  },
  2: {
    week: 'Week 2',
    title: 'Practice',
    desc: 'Daily micro-challenges build the habit of scrutinising email headers. AR markers go live in the office. The first leaderboard snapshot is published — generating social competition.',
    items: ['Daily 2-Min Challenges', 'AR Office Scan Activated', 'First Leaderboard Drop', 'Peer Learning Pairs']
  },
  3: {
    week: 'Week 3',
    title: 'Competition',
    desc: 'Department-vs-department tournament peaks. Points for every legitimate phishing report. Live leaderboard updates twice daily. "Elite Defender" badges awarded for top reporters.',
    items: ['Live Leaderboard', 'Dept Tournament Active', 'Elite Defender Badges', 'Mid-Sprint Scoring']
  },
  4: {
    week: 'Week 4',
    title: 'Habit Lock',
    desc: 'Competition wraps. Focus shifts to internalisation. Employees complete a final self-assessment, champions are celebrated, and reporting channels are reinforced as permanent fixtures.',
    items: ['Final Assessment', 'Champion Recognition', 'Behaviour Audit', 'Permanent Reporting Habit']
  }
};

const phases = document.querySelectorAll('.phase');
const phaseDetailWeek = document.getElementById('phaseDetailWeek');
const phaseDetailTitle = document.getElementById('phaseDetailTitle');
const phaseDetailDesc = document.getElementById('phaseDetailDesc');
const phaseDetailItems = document.getElementById('phaseDetailItems');

function setPhase(num) {
  const data = phaseData[num];
  phaseDetailWeek.textContent = data.week;
  phaseDetailTitle.textContent = data.title;
  phaseDetailDesc.textContent = data.desc;
  phaseDetailItems.innerHTML = data.items.map(i => `<li>${i}</li>`).join('');
  phases.forEach(p => p.classList.remove('active'));
  document.querySelector(`.phase[data-phase="${num}"]`).classList.add('active');
}

phases.forEach(phase => {
  phase.addEventListener('click', () => setPhase(parseInt(phase.dataset.phase)));
});

// Init with phase 1
setPhase(1);


// ── HEADER DETECTIVE GAME ──────────────────────────────────────
const gameRounds = [
  {
    headers: [
      { field: 'From', value: 'security-alerts@g00gle-support.net', isSuspect: true, explanation: '⚠️ Lookalike domain: "g00gle-support.net" uses zeros instead of "o" — a classic typosquatting attack.' },
      { field: 'Reply-To', value: 'noreply@accounts.google.com', isSuspect: false },
      { field: 'Subject', value: 'URGENT: Your account will be suspended in 24 hours', isSuspect: true, explanation: '⚠️ Urgency tactics ("URGENT", "24 hours") are a hallmark of social engineering — designed to bypass rational thinking.' },
      { field: 'Date', value: 'Thu, 17 Apr 2025 03:14:22 +0000', isSuspect: false },
      { field: 'Return-Path', value: '<bounce@phishing-relay77.ru>', isSuspect: true, explanation: '⚠️ Suspicious Return-Path domain: ".ru" TLD combined with "phishing-relay" in the domain name is a clear red flag.' },
    ],
    body: 'Dear valued customer, We have detected unusual activity in your account. Please verify your information immediately to avoid suspension. Click here to confirm: http://bit.ly/acct-verify-now',
    suspectCount: 3
  },
  {
    headers: [
      { field: 'From', value: 'hr-department@yourcompany-benefits.info', isSuspect: true, explanation: '⚠️ External domain impersonating internal HR. Your company HR would use an @yourcompany.com address, not a separate domain.' },
      { field: 'Subject', value: 'Q2 Payroll Update — Action Required', isSuspect: false },
      { field: 'Date', value: 'Mon, 21 Apr 2025 08:02:11 +0000', isSuspect: false },
      { field: 'X-Mailer', value: 'Mass Mailer Pro 9.1', isSuspect: true, explanation: '⚠️ "Mass Mailer Pro" in the X-Mailer header indicates bulk email software — not standard corporate email infrastructure.' },
      { field: 'Reply-To', value: 'collect-data@form-submit.xyz', isSuspect: true, explanation: '⚠️ Reply-To domain (.xyz) differs from the sender domain. Replies will go to an attacker-controlled address, not internal HR.' },
    ],
    body: 'Hi Team, As part of our Q2 payroll review, please update your banking details by end of day. Use the secure form below to submit your new account information.',
    suspectCount: 3
  },
  {
    headers: [
      { field: 'From', value: 'admin@microsoft.com', isSuspect: false },
      { field: 'Subject', value: 'Your Microsoft 365 subscription receipt', isSuspect: false },
      { field: 'Date', value: 'Fri, 18 Apr 2025 11:33:09 +0000', isSuspect: false },
      { field: 'Received', value: 'from mail-spoof-inject.net (203.0.113.44)', isSuspect: true, explanation: '⚠️ The "Received" header shows the actual sending server: "mail-spoof-inject.net". The From address can be spoofed — trace the origin!' },
      { field: 'DKIM-Signature', value: 'd=microsoftt.com; s=selector1; FAIL', isSuspect: true, explanation: '⚠️ DKIM signature failure AND the domain "microsoftt.com" (double-t) is a lookalike. Legitimate Microsoft emails pass DKIM from microsoft.com.' },
    ],
    body: 'Thank you for your Microsoft 365 renewal. Your subscription has been processed for $299.99. If you did not authorise this charge, call our support line immediately at +1-800-FAKE-NUM.',
    suspectCount: 2
  }
];

let currentRound = 0;
let currentScore = 0;
let selectedFields = new Set();
let roundSubmitted = false;

const gameEmail = document.getElementById('gameEmail');
const gameFeedback = document.getElementById('gameFeedback');
const gameRoundEl = document.getElementById('gameRound');
const gameScoreEl = document.getElementById('gameScore');
const gameNextBtn = document.getElementById('gameNextBtn');
const gameComplete = document.getElementById('gameComplete');
const gameFinalMsg = document.getElementById('gameFinalMsg');
const gameRestart = document.getElementById('gameRestart');

function renderRound(roundIndex) {
  const round = gameRounds[roundIndex];
  selectedFields.clear();
  roundSubmitted = false;
  gameNextBtn.style.display = 'none';
  gameFeedback.innerHTML = '';
  gameRoundEl.textContent = roundIndex + 1;

  let html = '';

  round.headers.forEach((header, i) => {
    html += `
      <div class="email-header-row">
        <div class="email-field-label">${header.field}</div>
        <div class="email-field-val" data-index="${i}">${escapeHtml(header.value)}</div>
      </div>
    `;
  });

  html += `<hr class="email-body-divider" />`;
  html += `<div class="email-body-text">${escapeHtml(round.body)}</div>`;
  html += `<div class="game-instruction">🔍 Click on any fields that look suspicious, then submit.</div>`;
  html += `<button class="game-submit-btn" id="gameSubmitBtn" style="margin-top:16px">Submit Analysis</button>`;

  gameEmail.innerHTML = html;

  // Field click handlers
  document.querySelectorAll('.email-field-val').forEach(el => {
    el.addEventListener('click', () => {
      if (roundSubmitted) return;
      const idx = parseInt(el.dataset.index);
      if (selectedFields.has(idx)) {
        selectedFields.delete(idx);
        el.classList.remove('selected-suspect');
      } else {
        selectedFields.add(idx);
        el.classList.add('selected-suspect');
      }
    });
  });

  document.getElementById('gameSubmitBtn').addEventListener('click', submitRound);
}

function submitRound() {
  if (roundSubmitted) return;
  roundSubmitted = true;

  const round = gameRounds[currentRound];
  const allFields = document.querySelectorAll('.email-field-val');
  let correctHits = 0;
  let falsePosCount = 0;
  let explanations = [];

  allFields.forEach(el => {
    const idx = parseInt(el.dataset.index);
    const header = round.headers[idx];
    el.classList.remove('selected-suspect');

    if (header.isSuspect) {
      el.classList.add('correct');
      if (selectedFields.has(idx)) {
        correctHits++;
        explanations.push(header.explanation);
      } else {
        el.classList.add('missed');
        explanations.push(`<span style="color:var(--red)">Missed:</span> ${header.explanation}`);
      }
    } else {
      if (selectedFields.has(idx)) {
        falsePosCount++;
        el.style.background = 'rgba(224,92,92,0.08)';
        el.style.borderColor = 'rgba(224,92,92,0.2)';
      }
    }
  });

  const roundPoints = Math.max(0, correctHits * 10 - falsePosCount * 5);
  currentScore += roundPoints;
  gameScoreEl.textContent = currentScore;

  let feedbackHtml = `<div style="margin:12px 0;padding:16px;background:var(--surface);border-radius:8px;border:1px solid var(--border)">`;
  feedbackHtml += `<div style="font-weight:600;color:var(--text);margin-bottom:8px">Found ${correctHits}/${round.suspectCount} suspicious fields — +${roundPoints} pts</div>`;
  explanations.forEach(e => {
    feedbackHtml += `<div style="font-size:13px;color:var(--text-muted);margin-bottom:6px;line-height:1.5">${e}</div>`;
  });
  feedbackHtml += `</div>`;
  gameFeedback.innerHTML = feedbackHtml;

  document.getElementById('gameSubmitBtn').remove();

  if (currentRound < gameRounds.length - 1) {
    gameNextBtn.style.display = 'inline-block';
  } else {
    showGameComplete();
  }
}

function showGameComplete() {
  const maxScore = gameRounds.length * 30;
  const pct = Math.round((currentScore / maxScore) * 100);
  let msg = '';
  if (pct >= 80) msg = `Outstanding! You scored ${currentScore}/${maxScore} — you're Elite Defender material. 🎖️`;
  else if (pct >= 50) msg = `Good work! You scored ${currentScore}/${maxScore}. Keep practising the Header Detective daily.`;
  else msg = `You scored ${currentScore}/${maxScore}. Review the missed headers and try again — habit takes repetition!`;
  gameFinalMsg.textContent = msg;
  gameComplete.style.display = 'block';
}

gameNextBtn.addEventListener('click', () => {
  currentRound++;
  renderRound(currentRound);
});

gameRestart.addEventListener('click', () => {
  currentRound = 0;
  currentScore = 0;
  gameComplete.style.display = 'none';
  renderRound(0);
});

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Init game
renderRound(0);


// ── CHARTS ────────────────────────────────────────────────────
const chartDefaults = {
  color: '#9a97a0',
  font: {
    family: "'DM Sans', sans-serif",
    size: 12
  }
};
Chart.defaults.color = chartDefaults.color;
Chart.defaults.font = chartDefaults.font;

// 1. Click Rate Chart (Line)
const clickRateCtx = document.getElementById('clickRateChart').getContext('2d');
new Chart(clickRateCtx, {
  type: 'line',
  data: {
    labels: ['Day 0', 'Day 7', 'Day 14', 'Day 21', 'Day 30', 'Day 45', 'Day 60'],
    datasets: [
      {
        label: 'Phishing Click Rate (%)',
        data: [25, 22, 17, 12, 8, 6, 4],
        borderColor: '#c8a96e',
        backgroundColor: 'rgba(200,169,110,0.08)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#c8a96e',
        pointRadius: 5,
        borderWidth: 2
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#202535',
        borderColor: 'rgba(200,169,110,0.3)',
        borderWidth: 1,
        callbacks: {
          label: ctx => ` ${ctx.raw}% click rate`
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#6b6876' }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#6b6876', callback: v => v + '%' },
        min: 0,
        max: 30
      }
    }
  }
});

// 2. Reporting Chart (Bar)
const reportingCtx = document.getElementById('reportingChart').getContext('2d');
new Chart(reportingCtx, {
  type: 'bar',
  data: {
    labels: ['Pre-Prog', 'Week 1', 'Week 2', 'Week 3', 'Week 4', '60-Day Follow-Up'],
    datasets: [
      {
        label: 'Reports Submitted',
        data: [4, 8, 18, 31, 36, 29],
        backgroundColor: ctx => {
          const val = ctx.raw;
          if (val <= 4) return 'rgba(224,92,92,0.5)';
          if (val >= 30) return 'rgba(76,175,130,0.6)';
          return 'rgba(200,169,110,0.5)';
        },
        borderRadius: 6,
        borderSkipped: false
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#202535',
        borderColor: 'rgba(200,169,110,0.3)',
        borderWidth: 1,
        callbacks: {
          label: ctx => ` ${ctx.raw} reports submitted`
        }
      }
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#6b6876' } },
      y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#6b6876' }, min: 0 }
    }
  }
});

// 3. Comparison Chart (Grouped Bar)
const comparisonCtx = document.getElementById('comparisonChart').getContext('2d');
new Chart(comparisonCtx, {
  type: 'bar',
  data: {
    labels: ['Completion Rate', 'Learner Satisfaction', 'Behaviour Change (Reporting)', 'Knowledge Retention (30-day)'],
    datasets: [
      {
        label: 'Old: Compliance Videos',
        data: [100, 34, 8, 22],
        backgroundColor: 'rgba(107,104,118,0.45)',
        borderRadius: 4,
        borderSkipped: false
      },
      {
        label: 'New: Human Firewall Championship',
        data: [96, 92, 300, 87],
        backgroundColor: 'rgba(200,169,110,0.6)',
        borderRadius: 4,
        borderSkipped: false
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#9a97a0',
          boxWidth: 12,
          padding: 16
        }
      },
      tooltip: {
        backgroundColor: '#202535',
        borderColor: 'rgba(200,169,110,0.3)',
        borderWidth: 1,
        callbacks: {
          label: ctx => ` ${ctx.dataset.label}: ${ctx.raw}%`
        }
      }
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#6b6876' } },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#6b6876', callback: v => v + '%' },
        min: 0
      }
    }
  }
});


// ── SCROLL ANIMATIONS ─────────────────────────────────────────
const observerOptions = { threshold: 0.08, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

const animateEls = document.querySelectorAll(
  '.tna-card, .strategy-card, .build-feature, .kp-card, .chart-card, .objective, .phase'
);
animateEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// Nav active link highlight on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${entry.target.id}` ? 'var(--accent)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
