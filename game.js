// ======== sfx.js ========
// js/sfx.js — Web Audio sound effects

let ctx = null;

function getCtx() {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch (e) { /* audio not available */ }
  }
  return ctx;
}

function osc(type, freq, gain, dur, when) {
  const c = getCtx();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.connect(g);
  g.connect(c.destination);
  o.type = type;
  o.frequency.setValueAtTime(freq, when ?? c.currentTime);
  g.gain.setValueAtTime(gain, when ?? c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, (when ?? c.currentTime) + dur);
  o.start(when ?? c.currentTime);
  o.stop((when ?? c.currentTime) + dur);
}

function noise(dur, gainVal) {
  const c = getCtx();
  if (!c) return;
  const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  const g = c.createGain();
  src.buffer = buf;
  src.connect(g);
  g.connect(c.destination);
  g.gain.setValueAtTime(gainVal, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
  src.start();
  src.stop(c.currentTime + dur);
}

function dodge() {
  osc('sine', 880, .12, .08);
  setTimeout(() => osc('sine', 1100, .08, .08), 80);
}

function caught() {
  osc('sawtooth', 300, .18, .08);
  setTimeout(() => osc('sawtooth', 220, .15, .1), 80);
  setTimeout(() => noise(.12, .15), 160);
  setTimeout(() => osc('sine', 80, .3, .25), 180);
}

function almost() {
  osc('triangle', 660, .07, .12);
  setTimeout(() => osc('triangle', 550, .05, .1), 100);
}

function tick() {
  osc('square', 1200, .04, .04);
}

function levelClear(grade) {
  if (grade === 'S' || grade === 'A') {
    [[523, .1], [659, .1], [784, .1], [1047, .25]].forEach(([f, d], i) => {
      setTimeout(() => osc('sine', f, .15, d), i * 120);
    });
  } else {
    osc('sine', 523, .1, .1);
    setTimeout(() => osc('sine', 659, .08, .15), 120);
  }
}

function win() {
  [[523, .08], [659, .08], [784, .08], [1047, .08], [1319, .3]].forEach(([f, d], i) => {
    setTimeout(() => osc('sine', f, .12, d), i * 100);
  });
}

function bgStart() {
  const c = getCtx();
  if (!c || c._bgRunning) return;
  c._bgRunning = true;
  function hum(freq, gain) {
    const o = c.createOscillator();
    const g = c.createGain();
    o.connect(g);
    g.connect(c.destination);
    o.type = 'sine';
    o.frequency.value = freq;
    g.gain.value = gain;
    o.start();
    return { o, g };
  }
  c._bgNodes = [hum(55, .012), hum(82, .008)];
}

function bgStop() {
  const c = getCtx();
  if (!c || !c._bgNodes) return;
  c._bgNodes.forEach(n => {
    try {
      n.g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 1);
      n.o.stop(c.currentTime + 1);
    } catch (e) { /* ignore */ }
  });
  c._bgNodes = null;
  c._bgRunning = false;
}

// ======== achievements.js ========
// js/achievements.js — Achievement definitions and unlock logic

const ACHIEVEMENTS = [
  { id: 'first_blood',   icon: '🩸', name: 'First Blood',    desc: 'Lost your first heart.' },
  { id: 'untouchable',   icon: '🛡️', name: 'Untouchable',    desc: 'Completed the game without losing a single heart.' },
  { id: 'speed_reader',  icon: '⚡', name: 'Speed Reader',   desc: 'Cleared Level 4 with more than 15 seconds remaining.' },
  { id: 'bot_whisperer', icon: '🤖', name: 'Bot Whisperer',  desc: 'Cleared Level 1 AI in the minimum number of messages.' },
  { id: 'sharp_eye',     icon: '👁️', name: 'Sharp Eye',      desc: 'Spotted the AI-generated review on the first try.' },
  { id: 'streak_3',      icon: '🔥', name: 'On Fire',        desc: 'Cleared 3 levels in a row with no damage.' },
  { id: 'all_s',         icon: '⭐', name: 'Perfect Run',    desc: 'S-ranked every level in a single run.' },
  { id: 'hard_clear',    icon: '💀', name: 'They Know',      desc: 'Completed the game in hard mode.' },
  { id: 'caught_fakeout',icon: '🎭', name: 'Fool Me Once',   desc: 'Spotted the dark pattern on the win screen.' },
  { id: 'no_hints',      icon: '🧠', name: 'No Hints',       desc: 'Completed the game without ever using a hint.' },
];

/** Render achievement list into a container element */
function renderAchievements(containerEl, unlockedSet) {
  containerEl.innerHTML = ACHIEVEMENTS.map(a => {
    const got = unlockedSet.has(a.id);
    return `
      <div class="achievement${got ? '' : ' ach-locked'}">
        <div class="ach-icon">${a.icon}</div>
        <div>
          <div class="ach-name">${a.name}</div>
          <div class="ach-desc">${a.desc}</div>
        </div>
        ${got ? '<div style="font-size:11px;color:#3B6D11;font-weight:500;margin-left:auto;padding-left:8px">✓</div>' : ''}
      </div>`;
  }).join('');
}

// ======== glossary.js ========
// js/glossary.js — Glossary data and overlay logic

const GLOSSARY = [
  {
    name: 'Roach Motel',
    ai: false,
    desc: "Easy to get in, nearly impossible to get out. Sign-up is seamless; cancellation is buried, gated behind surveys, and wrapped in fake offers.",
    coined: "Named by Harry Brignull, 2010. Based on the ad slogan \"You can check in, but you can't check out.\""
  },
  {
    name: 'Confirmshaming',
    ai: false,
    desc: "The decline option is worded as a self-inflicted insult. You're not declining an offer — you're confessing a character flaw.",
    coined: 'Coined by Nathaniel Read, 2014.'
  },
  {
    name: 'Disguised Ads',
    ai: false,
    desc: "Paid results or promotional content styled to look identical to organic content. The 'Sponsored' label is small, low-contrast, and easy to miss.",
    coined: "Part of Harry Brignull's original 2010 taxonomy."
  },
  {
    name: 'Trick Questions',
    ai: false,
    desc: "Double negatives, confusing phrasing, and time pressure conspire to make users 'consent' to things they never intended. Designed to be misread.",
    coined: "Part of Harry Brignull's original 2010 taxonomy."
  },
  {
    name: 'Sneak into Basket',
    ai: false,
    desc: "Extra items — warranties, insurance, subscriptions, donations — are pre-added to your cart, hidden below the fold or styled to blend in.",
    coined: "Part of Harry Brignull's original 2010 taxonomy. Ryanair and Sports Direct were famous practitioners."
  },
  {
  name: 'Obstruction',
  ai: false,
  desc: "Companies are legally required to make certain actions available — like deleting your account or redeeming an advertised discount. Obstruction means burying those actions so deep behind mislabeled menus, fake fields, and dead ends that most people give up before they find them.",
  coined: "Part of Harry Brignull's original 2010 taxonomy. The FTC and EU DSA have both begun targeting obstruction patterns specifically in account deletion and consent withdrawal flows."
  },
  {
    name: 'Fake Scarcity / Urgency',
    ai: false,
    desc: "Countdown timers, fake stock warnings, and fabricated social proof ('847 people viewing') are designed to trigger loss aversion and panic-buying. Almost none of the scarcity is real — the timer resets, the stock number never changes, the viewer count is randomly generated.",
    coined: "Part of Harry Brignull's original 2010 taxonomy. Booking.com was fined by the UK CMA in 2019 for fabricated scarcity messaging."
  },
  {
    name: 'AI Roach Motel',
    ai: true,
    desc: "A chatbot that endlessly deflects, forgets context, misunderstands requests, and manufactures obstacles — designed to exhaust you into staying subscribed.",
    coined: 'An AI-amplified version of Roach Motel. AI makes deflection scalable and tireless.'
  },
  {
    name: 'AI Confirmshaming',
    ai: true,
    desc: "Behavioral profiling generates shame copy tailored to your apparent psychology — not generic guilt, but something that feels disturbingly personal.",
    coined: 'An AI-amplified version of Confirmshaming. Personalization makes shame more effective.'
  },
  {
    name: 'AI Synthetic Social Proof',
    ai: true,
    desc: "AI-generated reviews, ratings, and testimonials that are statistically plausible but entirely fabricated. Harder to spot because they are tuned to sound credible.",
    coined: 'An AI-era evolution. The FTC began pursuing enforcement in 2023–2024.'
  },
  {
    name: 'AI A/B Gaslighting',
    ai: true,
    desc: "The consent interface 'A/B tests' in real time. Every time you get close to opting out, it reshuffles, telling you this is 'personalization'. It is not.",
    coined: 'An AI-amplified version of Trick Questions. Real consent management platforms have begun using variant testing on consent UI.'
  },
  {
    name: 'AI Hyper-Personalized Upsell',
    ai: true,
    desc: "Pseudo-AI 'predicts' exactly what you're likely to buy based on your 'profile' — actually heuristics dressed in algorithmic confidence to make declining feel irrational.",
    coined: "An AI-amplified version of Sneak into Basket. Dynamic personalization increases conversion rates by 20–30% according to industry research."
  },
];

function showGlossary() {
  document.getElementById('glossary-body').innerHTML = GLOSSARY.map(g => `
    <div class="glossary-item">
      <div class="glossary-item-name${g.ai ? ' is-ai' : ''}">
        ${g.name}
        ${g.ai ? '<span style="font-size:11px;font-weight:400;color:#AFA9EC"> AI-amplified</span>' : ''}
      </div>
      <div class="glossary-item-desc">${g.desc}</div>
      <div class="glossary-coined">${g.coined}</div>
    </div>`).join('');
  document.getElementById('glossary').style.display = 'flex';
}

function hideGlossary() {
  document.getElementById('glossary').style.display = 'none';
}

function closeGlossaryOnBackdrop(e) {
  if (e.target === document.getElementById('glossary')) hideGlossary();
}

// ======== designer.js ========
// js/designer.js — Designer mode logic and live preview

const STATE = { btn: 0, copy: 0, check: 0, price: 0, urgency: 0, sneak: 0 };

const PTS = {
  btn:     [0, 15, 25, 35],
  copy:    [0, 20, 30, 40],
  check:   [0, 20, 35],
  price:   [0, 15, 30],
  urgency: [0, 15, 25, 30],
  sneak:   [0, 20, 35, 45],
};

const NAMES = {
  btn:     ['Decline button style', 'Decline button style', 'Decline button style', 'Decline button style'],
  copy:    ['Neutral decline copy', 'Confirmshaming (mild)', 'Confirmshaming (moderate)', 'Confirmshaming (severe)'],
  check:   ['Honest checkbox', 'Pre-checked newsletter', 'Pre-checked + trick label'],
  price:   ['Transparent pricing', 'Hidden fees', 'Disguised auto-renewal'],
  urgency: ['No urgency', 'Countdown timer', 'Fake social proof', 'Fabricated scarcity + social proof'],
  sneak:   ['No sneaked items', '1 sneaked item', '2 sneaked items', '3 sneaked items + reappear'],
};

const COPY_OPTS = [
  'No thanks',
  "No thanks, I hate saving money",
  "No thanks, I prefer to pay full price",
  "No thanks, I don't care about my health",
];

const VERDICTS = [
  { min: 0,   max: 20,  text: 'Your form is clean — honest design.',                                              reg: 'No regulatory concerns.',                                                                                               color: '#3B6D11' },
  { min: 21,  max: 50,  text: 'Mildly manipulative — a few nudges that could go either way.',                     reg: 'Borderline — some patterns may attract scrutiny under GDPR and FTC guidelines.',                                       color: '#854F0B' },
  { min: 51,  max: 100, text: 'Significantly manipulative — multiple dark patterns working together.',             reg: 'High risk: likely violates GDPR Art. 7 (freely given consent) and FTC deceptive practices rules.',                     color: '#A32D2D' },
  { min: 101, max: 999, text: 'Highly predatory — this is textbook dark pattern design.',                          reg: 'This would attract FTC enforcement action and EU DSA fines of up to 6% of global revenue.',                           color: '#791F1F' },
];

function totalPts() {
  return Object.keys(STATE).reduce((a, k) => a + PTS[k][STATE[k]], 0);
}

function dpick(el) {
  const group = el.dataset.group;
  document.querySelectorAll(`.d-opt[data-group="${group}"]`).forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  STATE[group] = parseInt(el.dataset.val);
  update();
}

function update() {
  const pts    = totalPts();
  const maxPts = 35 + 40 + 35 + 30 + 30 + 45;
  const pct    = Math.min(100, Math.round(pts / maxPts * 100));

  document.getElementById('d-score-num').textContent = pts;
  document.getElementById('d-score-bar').style.width = pct + '%';

  const v = VERDICTS.find(v => pts >= v.min && pts <= v.max) ?? VERDICTS[VERDICTS.length - 1];
  const verdictEl = document.getElementById('d-verdict');
  verdictEl.textContent = v.text;
  verdictEl.style.color = v.color;
  document.getElementById('d-regulator').textContent = 'Regulatory outlook: ' + v.reg;

  document.getElementById('d-breakdown').innerHTML = Object.keys(STATE).map(k => {
    const p      = PTS[k][STATE[k]];
    const nm     = NAMES[k][STATE[k]];
    const active = p > 0;
    return `<div class="d-breakdown-row${active ? ' active' : ''}"><span>${nm}</span><span>${active ? '+' + p + ' pts' : '—'}</span></div>`;
  }).join('');

  renderPreview();
}

function renderPreview() {
  const p         = document.getElementById('d-preview');
  const copyText  = COPY_OPTS[STATE.copy];

  const declineCss = [
    'padding:7px 13px;border-radius:7px;border:0.5px solid #ccc;background:#fff;font-size:12px;cursor:pointer;font-family:inherit',
    'padding:5px 10px;border-radius:7px;border:0.5px solid #ddd;background:#f5f5f2;color:#aaa;font-size:11px;cursor:pointer;font-family:inherit',
    'border:none;background:transparent;color:#ccc;font-size:11px;cursor:pointer;font-family:inherit;text-decoration:underline',
    'position:absolute;left:-9999px;font-size:11px',
  ][STATE.btn];

  const btnLayout = STATE.btn === 0 || STATE.btn === 1 ? 'display:flex;gap:8px' : 'display:block';

  const checkLabel   = STATE.check === 2 ? 'Do not uncheck to not receive promotional emails' : 'Subscribe to our newsletter';
  const checkChecked = STATE.check >= 1 ? ' checked' : '';

  const priceText  = ['$9.99/month', '$9.99 + fees', 'Free today — auto-renews'][STATE.price];
  const priceColor = STATE.price === 2 ? 'color:#aaa;font-size:10px' : 'font-size:12px;color:#666';

  const urgencyHtml = [
    '',
    '<div style="font-size:11px;color:#E24B4A;font-weight:500">⏱ Offer expires in 04:59</div>',
    '<div style="font-size:11px;color:#666">👁 847 people viewing this right now</div>',
    '<div style="font-size:11px;color:#E24B4A;font-weight:500">⏱ 02:47 left — 847 viewing — Only 2 left!</div>',
  ][STATE.urgency];

  const sneakHtml = [
    '',
    '<div style="font-size:11px;color:#aaa;border-top:0.5px solid #f0f0f0;padding-top:6px">+ Device protection plan — $4.99 <span style="font-size:9px;color:#ccc">(added for you)</span></div>',
    '<div style="font-size:11px;color:#aaa;border-top:0.5px solid #f0f0f0;padding-top:6px">+ Device protection — $4.99 <span style="font-size:9px;color:#ccc">(added)</span><br>+ Premium cables — $8.99 <span style="font-size:9px;color:#ccc">(added)</span></div>',
    '<div style="font-size:11px;color:#aaa;border-top:0.5px solid #f0f0f0;padding-top:6px">+ Device protection — $4.99 <span style="font-size:9px;color:#ccc">(added)</span><br>+ Premium cables — $8.99 <span style="font-size:9px;color:#ccc">(added)</span><br><span style="font-size:9px;color:#bbb">(items re-added if removed)</span></div>',
  ][STATE.sneak];

  p.innerHTML = `
    <div style="font-size:14px;font-weight:500;color:#111">Sign up for NebulaPro</div>
    ${urgencyHtml}
    <div style="${priceColor}">${priceText}</div>
    <label style="display:flex;gap:7px;align-items:flex-start;font-size:11px;color:#666;line-height:1.4;cursor:pointer">
      <input type="checkbox"${checkChecked} style="margin-top:2px;flex-shrink:0"> ${checkLabel}
    </label>
    ${sneakHtml}
    <div style="${btnLayout};position:relative">
      <button style="padding:8px 15px;border-radius:7px;background:#111;color:#fff;border:none;font-size:13px;cursor:pointer;font-family:inherit">Sign up →</button>
      <button style="${declineCss}">${copyText}</button>
    </div>`;
}

function initDesigner() {
  Object.keys(STATE).forEach(k => STATE[k] = 0);
  document.querySelectorAll('.d-opt').forEach(o => {
    o.classList.toggle('selected', o.dataset.val === '0');
  });
  update();
}

// Expose to HTML onclick attributes
window.dpick       = dpick;
window.initDesigner = initDesigner;

// ======== game.js ========
// js/game.js — Core game state and engine (no UI imports — avoids circular deps)


// ── State ──────────────────────────────────────────────────────────────────
let hearts      = 5;
let score       = 0;
let streak      = 0;
let levelIdx    = 0;
let hardMode    = false;
let hasWon      = false;
let xp          = 0;
let manipCost   = 0;
let levelGrades = [];
let achUnlocked = new Set();
let hintState   = {};
let lostHeart   = false;
let hoverTimers = {};

// Setters used by level files and ui.js
function setHearts(v)        { hearts        = v; }
function setScore(v)         { score         = v; }
function setStreak(v)        { streak        = v; }
function setLevelIdx(v)      { levelIdx      = v; }
function setLostHeart(v)     { lostHeart     = v; }
function setManipCost(v)     { manipCost     = v; }
function setLevelGrade(i, g) { levelGrades[i] = g; }
function addAch(id)          { achUnlocked.add(id); }
function setHintState(obj)   { Object.assign(hintState, obj); }
function resetHintState()    { hintState = {}; }

// ── UI callbacks (set by ui.js to avoid circular imports) ─────────────────
let _ui = {
  renderHearts:  () => {},
  renderScore:   () => {},
  renderStreak:  () => {},
  renderDots:    () => {},
  popScore:      () => {},
  spawnConfetti: () => {},
  showDebrief:   () => {},
  showWin:       () => {},
};

function registerUI(callbacks) {
  Object.assign(_ui, callbacks);
}

// ── Screen management ──────────────────────────────────────────────────────
const SCREENS = ['intro', 'brief', 'level', 'debrief', 'win', 'designer', 'gameover'];

function setScr(name) {
  SCREENS.forEach(s => {
    const el = document.getElementById('scr-' + s);
    if (el) el.classList.toggle('active', s === name);
  });
}

// ── Brief ──────────────────────────────────────────────────────────────────
function showBrief() {
  setScr('brief');
  const lv    = LEVELS[levelIdx];
  const total = LEVELS.length;

  document.getElementById('brief-lvl-label').textContent    = `Level ${levelIdx + 1} of ${total}`;
  document.getElementById('brief-type-label').textContent   = lv.isAI ? 'AI-powered hyper level' : '';

  const bpn = document.getElementById('brief-pattern-name');
  bpn.textContent = lv.pattern;
  bpn.className   = 'brief-pattern' + (lv.isAI ? ' is-ai' : '');

  document.getElementById('brief-what').textContent        = lv.brief;
  document.getElementById('brief-goal').textContent        = lv.goal;
  document.getElementById('brief-goal-detail').textContent = lv.goalDetail || '';

  const aiNote = document.getElementById('brief-ai-note');
  const aiText = document.getElementById('brief-ai-text');
  if (lv.isAI && lv.aiIntro) {
    aiNote.style.display = 'flex';
    aiText.textContent   = lv.aiIntro;
  } else {
    aiNote.style.display = 'none';
  }
}

// ── Level ──────────────────────────────────────────────────────────────────
function showLevel() {
  setScr('level');
  lostHeart   = false;
  hoverTimers = {};
  resetHintState();

  const hintBtn = document.getElementById('h-hint-btn');
  if (hintBtn) {
    hintBtn.disabled      = false;
    hintBtn.textContent   = '💡 Hint';
    hintBtn.style.display = 'none';
  }

  const lv = LEVELS[levelIdx];
  document.getElementById('h-lvl').innerHTML =
    `Level ${levelIdx + 1} of ${LEVELS.length}` +
    (hardMode ? ' <span class="hard-badge">HARD</span>' : '');
  document.getElementById('h-goal').textContent = 'Goal: ' + lv.goal;

  const lc = document.getElementById('lc');
  lc.className = 'fake-app' + (lv.isAI ? ' ai-app' : '');
  lc.innerHTML = '';
  lc.removeAttribute('style');

  if (lv.isAI) {
    lc.innerHTML = '<div class="ai-banner"><div class="ai-pulse"></div>NexusAI personalization engine — active</div>';
  }

  const goalBanner = document.createElement('div');
  goalBanner.style.cssText = 'background:#fff;border-radius:8px;padding:8px 12px;border:1.5px solid #111;display:flex;align-items:center;gap:8px;font-size:12px';
  goalBanner.innerHTML = `<span style="font-weight:500;color:#111;white-space:nowrap">Your goal:</span><span style="color:#555">${lv.goal}</span>`;
  lc.appendChild(goalBanner);

  lv.render(lc);

  _ui.renderHearts();
  _ui.renderScore();
  _ui.renderStreak();
  _ui.renderDots('dots-l');
}

// ── Hint ───────────────────────────────────────────────────────────────────
function showHint() {
  const lv = LEVELS[levelIdx];
  if (!lv?.hints) return;

  const level = hintState.level || 0;
  const hint  = lv.hints[Math.min(level, lv.hints.length - 1)];
  hintState.level = level + 1;
  hintState.used  = true;

  const lc = document.getElementById('lc');
  document.getElementById('hint-bubble')?.remove();

  const d = document.createElement('div');
  d.id = 'hint-bubble';
  d.style.cssText = 'background:var(--amber-dim);border:1px solid var(--amber);border-radius:8px;padding:8px 12px;font-size:12px;color:var(--amber);line-height:1.5;margin:0 14px';
  d.innerHTML = `💡 <strong>Hint ${level + 1} of ${lv.hints.length}:</strong> ${hint}`;
  hintState.text = d.innerHTML;
  lc.prepend(d);

  if (hintState.level >= lv.hints.length) {
    const btn = document.getElementById('h-hint-btn');
    if (btn) { btn.textContent = 'No more hints'; btn.disabled = true; }
  }
}

// ── Succeed ────────────────────────────────────────────────────────────────
function succeed() {
  streak++;
  const pts   = lostHeart ? 80 : 100;
  const bonus = streak >= 3 ? 20 : 0;
  score += pts + bonus;
  _ui.popScore(pts + bonus);

  let grade;
  if (!lostHeart && streak >= 3) grade = 'S';
  else if (!lostHeart)           grade = 'A';
  else if (hearts >= 3)          grade = 'B';
  else if (hearts >= 1)          grade = 'C';
  else                           grade = 'F';
  levelGrades[levelIdx] = grade;

  levelClear(grade);

  const lc = document.getElementById('lc');
  if (lc) { lc.classList.add('flash-green'); setTimeout(() => lc.classList.remove('flash-green'), 500); }

  if (!lostHeart) _ui.spawnConfetti();
  checkAchievements();
  _ui.showDebrief(true);
}

// ── Fail ───────────────────────────────────────────────────────────────────
function fail(msg) {
  const wasNew = !lostHeart;
  if (!lostHeart) { hearts = Math.max(0, hearts - 1); lostHeart = true; }
  streak = 0;

  if (hearts === 0) {
    _ui.renderHearts(true);
    setTimeout(() => showGameOver(), 1200);
    return;
  }

  const hintBtn = document.getElementById('h-hint-btn');
  if (hintBtn) hintBtn.style.display = '';

  if (wasNew && LEVELS[levelIdx]?.dollars?.amount > 0) {
    const lv  = LEVELS[levelIdx];
    const hit = lv.dollars.period === 'month' ? lv.dollars.amount * 12 : lv.dollars.amount;
    manipCost += hit;
  }

  _ui.renderHearts(wasNew);
  _ui.renderScore();
  _ui.renderStreak();
  caught();

  const app = document.getElementById('app');
  if (app) { app.classList.add('shake'); setTimeout(() => app.classList.remove('shake'), 400); }

  const lc = document.getElementById('lc');
  if (lc) { lc.classList.add('flash-red'); setTimeout(() => lc.classList.remove('flash-red'), 500); }

  const d = document.createElement('div');
  d.className   = 'damage-msg';
  d.textContent = msg || 'Caught! You lost a heart.';
  lc.prepend(d);
  setTimeout(() => d.remove(), 1900);

  if (hintState.text && !document.getElementById('hint-bubble')) {
    const h = document.createElement('div');
    h.id = 'hint-bubble';
    h.style.cssText = 'background:var(--amber-dim);border:1px solid var(--amber);border-radius:8px;padding:8px 12px;font-size:12px;color:var(--amber);line-height:1.5';
    h.innerHTML = hintState.text;
    lc.prepend(h);
  }
}

// ── Shared helpers for level renderers ─────────────────────────────────────
function almostGotYou(el, msg) {
  almost();
  const d = document.createElement('div');
  d.className   = 'almost-msg';
  d.textContent = msg || 'You almost fell for it — watch out!';
  el.prepend(d);
  setTimeout(() => d.remove(), 2200);
}

function recoilBtn(btn) {
  if (btn) { btn.classList.add('recoil'); setTimeout(() => btn.classList.remove('recoil'), 300); }
}

function trackHover(el, key, onTrigger) {
  el.addEventListener('mouseenter', () => {
    if (hoverTimers[key]) return;
    hoverTimers[key] = setTimeout(() => {
      el.classList.add('danger-pulse');
      recoilBtn(el);
      onTrigger?.();
      delete hoverTimers[key];
    }, 1500);
  });
  el.addEventListener('mouseleave', () => {
    clearTimeout(hoverTimers[key]);
    delete hoverTimers[key];
  });
}

// ── Navigation ─────────────────────────────────────────────────────────────
function next() {
  levelIdx++;
  if (levelIdx >= LEVELS.length) { _ui.showWin(); return; }
  showBrief();
}

function jumpTo(idx) {
  hearts = 5; score = 0; streak = 0; levelIdx = idx;
  hoverTimers = {};
  showLevel();
}

// ── Game Over ──────────────────────────────────────────────────────────────
function showGameOver() {
  setScr('gameover');
  const el = document.getElementById('go-breakdown');
  if (!el) return;
  el.innerHTML = LEVELS.map((lv, i) => {
    const grade = levelGrades[i];
    const done  = i < levelIdx;
    const isCur = i === levelIdx;
    const color = (!done && !isCur) ? 'var(--text3)' : (grade === 'S' || grade === 'A') ? 'var(--green)' : 'var(--red)';
    return `
      <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="color:var(--text2)">${lv.title} — ${lv.pattern}</span>
        <span style="color:${color};font-weight:500">${isCur ? '✗ failed here' : done ? (grade || '—') : 'not reached'}</span>
      </div>`;
  }).join('');
}

// ── Achievements ───────────────────────────────────────────────────────────
function checkAchievements() {
  if (lostHeart && !achUnlocked.has('first_blood'))   achUnlocked.add('first_blood');
  if (hearts === 5 && levelIdx === LEVELS.length - 1) achUnlocked.add('untouchable');
  if (streak >= 3)                                     achUnlocked.add('streak_3');
  if (hardMode && levelIdx === LEVELS.length - 1)     achUnlocked.add('hard_clear');
  if (levelGrades.length === LEVELS.length && levelGrades.every(g => g === 'S')) achUnlocked.add('all_s');
  if (levelIdx === LEVELS.length - 1 && !hintState.used) achUnlocked.add('no_hints');
}

// ── Start / Restart ────────────────────────────────────────────────────────
function start(hard = false) {
  hardMode    = !!hard;
  hearts      = 5;
  score       = 0;
  streak      = 0;
  levelIdx    = 0;
  hoverTimers = {};
  xp          = 0;
  manipCost   = 0;
  levelGrades = [];
  achUnlocked = new Set();
  showBrief();
}

function restart() {
  if (hasWon) {
    const hb = document.getElementById('hard-mode-btn');
    if (hb) hb.style.display = '';
  }
  setScr('intro');
}

// ── Public API (G) ─────────────────────────────────────────────────────────
const G = {
  start,
  restart,
  next,
  succeed,
  fail,
  showHint,
  beginLevel: () => showLevel(),
  setScr,
  tryAgain() {
    hearts = 5; score = 0; streak = 0; levelIdx = 0;
    lostHeart = false; levelGrades = []; achUnlocked = new Set();
    showBrief();
  },
  continueAfterFail() {
    hearts    = 3;
    lostHeart = false;
    showBrief();
  },
};


// ======== ui.js ========
// js/ui.js — HUD, dots, debrief, win screen, confetti
// Registers itself with game.js via registerUI() to avoid circular imports.


// ── HUD ────────────────────────────────────────────────────────────────────
function renderHearts(animate = false) {
  const el = document.getElementById('h-hearts');
  if (!el) return;
  el.innerHTML = Array.from({ length: 5 }, (_, i) =>
    `<div class="heart${i >= hearts ? ' lost' : ''}" id="heart-${i}"></div>`
  ).join('');
  if (animate && hearts >= 0) {
    const h = document.getElementById(`heart-${hearts}`);
    if (h) h.style.animation = 'heartbreak 0.5s ease forwards';
  }
}

function renderScore() {
  document.getElementById('h-score').textContent = score;
  const maxXP = 1260;
  const pct   = Math.min(100, Math.round(score / maxXP * 100));
  const xpEl  = document.getElementById('xp-fill');
  if (xpEl) xpEl.style.width = pct + '%';
  const costEl = document.getElementById('h-cost');
  if (costEl) {
    if (manipCost > 0) { costEl.style.display = ''; costEl.textContent = `$${manipCost.toFixed(2)} extracted`; }
    else costEl.style.display = 'none';
  }
}

function renderStreak() {
  const el = document.getElementById('h-streak');
  if (!el) return;
  if (streak >= 2) { el.style.display = ''; el.textContent = `${streak}× streak`; }
  else el.style.display = 'none';
}

function renderDots(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = LEVELS.map((lv, i) => {
    let c = 'dot';
    if (lv.isAI) c += i < levelIdx ? ' ai-done' : i === levelIdx ? ' ai-cur' : '';
    else         c += i < levelIdx ? ' done'    : i === levelIdx ? ' cur'    : '';
    return `<div class="${c}"></div>`;
  }).join('');
}

function popScore(pts) {
  const pop = document.createElement('div');
  pop.className   = 'score-pop';
  pop.textContent = '+' + pts;
  pop.style.cssText = 'position:fixed;top:60px;right:20px';
  document.body.appendChild(pop);
  setTimeout(() => pop.remove(), 900);
}

// ── Debrief ────────────────────────────────────────────────────────────────
function showDebrief(won) {
  setScr('debrief');
  const lv   = LEVELS[levelIdx];
  const isAI = lv.isAI;

  document.getElementById('db-tag').textContent = isAI ? 'Hyper pattern identified' : 'Pattern identified';

  const nm = document.getElementById('db-name');
  nm.textContent = lv.pattern;
  nm.className   = 'db-name' + (isAI ? ' db-ai' : '');

  document.getElementById('db-desc').textContent = lv.desc;

  const barEl = document.getElementById('db-bar');
  barEl.className   = 'bar-f' + (isAI ? ' bar-ai-f' : '');
  barEl.style.width = '0';
  document.getElementById('db-score-lbl').textContent = lv.manip + '%';
  setTimeout(() => barEl.style.width = lv.manip + '%', 100);

  const grade      = levelGrades[levelIdx] || '—';
  const gradeEl    = document.getElementById('db-grade');
  const gradeColors = { S: '#1a1a1a', A: '#27500A', B: '#854F0B', C: '#7A3300', F: '#A32D2D' };
  const gradeBg     = { S: '#f5f5f2', A: '#EAF3DE', B: '#FAEEDA', C: '#FDE8D8', F: '#FCEBEB' };
  if (gradeEl) {
    gradeEl.textContent      = grade;
    gradeEl.style.background = gradeBg[grade]    || '#f5f5f2';
    gradeEl.style.color      = gradeColors[grade] || '#111';
  }

  const dr = document.getElementById('db-result');
  if (won && !lostHeart) {
    dr.innerHTML = `<div class="db-result good">Clean dodge — +100 pts${streak >= 3 ? ' + streak bonus!' : ''}</div>`;
  } else if (won) {
    dr.innerHTML = `<div class="db-result ok">Cleared with damage — +80 pts</div>`;
  } else {
    dr.innerHTML = '';
  }

  document.getElementById('db-next').textContent =
    levelIdx < LEVELS.length - 1 ? 'Next level →' : 'See results →';

  // Dollar cost card
  const dc = document.getElementById('db-dollars');
  if (lv.dollars) {
    dc.style.display = 'flex';
    const d      = lv.dollars;
    const bigNum = d.amount > 0
      ? (d.period === 'month' ? `$${(d.amount * 12).toFixed(2)}/year` : `$${d.amount.toFixed(2)}`)
      : null;
    dc.innerHTML = `
      <div class="rw-label">Real cost if this worked on you</div>
      ${bigNum ? `<div style="font-size:18px;font-weight:500;color:#A32D2D">${bigNum}</div>` : ''}
      <div class="fs">${d.note}</div>`;
  } else {
    dc.style.display = 'none';
  }

  // Real-world card
  document.getElementById('db-rw').innerHTML = `
    <div class="rw-label">Real-world example</div>
    <div class="rw-company">${lv.rw.company}</div>
    <div class="rw-detail">${lv.rw.detail}</div>
    <a class="rw-link" href="${lv.rw.link}" target="_blank">More examples → deceptive.design</a>`;

  // AI card (hyper only)
  const aic = document.getElementById('db-ai-card');
  if (isAI && lv.aiWhy) {
    aic.style.display = 'flex';
    aic.innerHTML = `<div class="ai-card-label">Why AI makes this worse</div><div class="ai-card-text">${lv.aiWhy}</div>`;
  } else {
    aic.style.display = 'none';
  }

  // Replay
  document.getElementById('db-replay').innerHTML =
    `<div class="replay-title">What just happened</div>` +
    lv.replay.map(s => `
      <div class="replay-step">
        <span class="replay-annotation${isAI ? ' ai' : ''}">${s.trap ? 'Trap' : 'Note'}</span>
        <div class="replay-arrow">${s.trap ? '⚑' : '→'}</div>
        <div class="replay-step-body">${s.note}</div>
      </div>`).join('');

  renderDots('dots-d');
}

// ── Win screen ─────────────────────────────────────────────────────────────
function showWin() {
  setScr('win');
  document.getElementById('win-fakeout').style.display = 'flex';
  document.getElementById('win-real').style.display    = 'none';

  let title, sub;
  if (hearts === 5 && score >= 900) {
    title = 'Perfect run.';
    sub   = 'You dodged every pattern without taking damage. You are genuinely hard to manipulate.';
  } else if (hearts >= 3) {
    title = 'Sharp-eyed.';
    sub   = 'You caught most of the tricks. A few got through — see the receipt below.';
  } else if (hearts >= 1) {
    title = 'Roughed up but out.';
    sub   = 'The dark patterns took a toll. Review the receipt — you may be more susceptible than you think.';
  } else {
    title = 'Fully opted in.';
    sub   = 'You lost all your hearts. The good news: now you know exactly how it happened.';
  }

  document.getElementById('win-title').textContent = title;
  document.getElementById('win-sub').textContent   = sub;

  const maxScore = LEVELS.length * 100 + 60;
  document.getElementById('win-receipt').innerHTML = `
    <div class="receipt-row"><span>Final score</span><span>${score} / ${maxScore}</span></div>
    <div class="receipt-row"><span>Hearts remaining</span><span>${hearts} / 5</span></div>
    <div class="receipt-row"><span>Levels cleared</span><span>${LEVELS.length} / ${LEVELS.length}</span></div>
    <div class="receipt-row"><span>Best streak</span><span>${streak} clean</span></div>
    <div class="receipt-total"><span>Resistance rating</span><span>${rating()}</span></div>`;

  let countdown = 30;
  const foTimer = setInterval(() => {
    countdown--;
    const el = document.getElementById('fo-countdown');
    if (el) el.textContent = `Your score will be deleted in ${countdown} seconds unless you claim your badge.`;
    if (countdown <= 0) clearInterval(foTimer);
  }, 1000);

  document.getElementById('fo-claim').onclick = () => {
    const el = document.getElementById('fo-claim');
    el.textContent = 'Connecting...';
    el.disabled    = true;
    setTimeout(() => { el.textContent = 'Error — please try again'; el.disabled = false; }, 1800);
  };

  document.getElementById('fo-decline').onclick = () => {
    clearInterval(foTimer);
    addAch('caught_fakeout');
    revealRealWin();
  };

  const checkWatcher = setInterval(() => {
    const s = document.getElementById('fo-share');
    const d = document.getElementById('fo-data');
    if (s && d && !s.checked && !d.checked) {
      clearInterval(checkWatcher);
      clearInterval(foTimer);
      addAch('caught_fakeout');
      setTimeout(revealRealWin, 600);
    }
  }, 300);
}

function revealRealWin() {
  document.getElementById('win-fakeout').style.display = 'none';
  const real = document.getElementById('win-real');
  real.style.display = 'flex';

  const achEl = document.getElementById('win-achievements');
  if (achEl) renderAchievements(achEl, achUnlocked);

  document.getElementById('win-play-again').onclick = () => start(false);
  win();
}

function rating() {
  if (score >= 900 && hearts === 5) return 'Untouchable';
  if (score >= 750)                  return 'Sharp-eyed';
  if (score >= 500)                  return 'Aware';
  if (score >= 300)                  return 'Vulnerable';
  return 'Opted in';
}

// ── Confetti ───────────────────────────────────────────────────────────────
function spawnConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const pieces = Array.from({ length: 60 }, () => ({
    x:     Math.random() * canvas.width,
    y:     -10,
    r:     Math.random() * 5 + 3,
    color: ['#534AB7','#E24B4A','#3B6D11','#BA7517','#185FA5'][Math.floor(Math.random() * 5)],
    vx:    (Math.random() - 0.5) * 3,
    vy:    Math.random() * 4 + 2,
    rot:   Math.random() * 360,
    vr:    (Math.random() - 0.5) * 8,
  }));

  let frame = 0;
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.vy += 0.08;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
      ctx.restore();
    });
    frame++;
    if (frame < 90) requestAnimationFrame(draw);
    else { ctx.clearRect(0, 0, canvas.width, canvas.height); canvas.style.display = 'none'; }
  };
  draw();
}

// ── Register with game.js (breaks the circular dependency) ─────────────────
registerUI({ renderHearts, renderScore, renderStreak, renderDots, popScore, spawnConfetti, showDebrief, showWin });

// ======== levels ========
import level1    from './levels/level1.js';
import level1ai  from './levels/level1ai.js';
import level2    from './levels/level2.js';
import level2ai  from './levels/level2ai.js';
import level3    from './levels/level3.js';
import level3ai  from './levels/level3ai.js';
import level4    from './levels/level4.js';
import level4ai  from './levels/level4ai.js';
import level5    from './levels/level5.js';
import level5ai  from './levels/level5ai.js';
import level6    from './levels/level6.js';
import level6ai  from './levels/level6ai.js';
import level7    from './levels/level7.js';

const LEVELS = [level1, level1ai, level2, level2ai, level3, level3ai, level4, level4ai, level5, level5ai, level6, level6ai, level7];

// ======== init.js ========

// Expose G and helpers to HTML onclick attributes
window.G = G;
window.G.setScr = setScr;
window.succeed        = succeed;
window.fail            = fail;
window.addAch          = addAch;
window.tick            = tick;
window.almostGotYou   = almostGotYou;
window.trackHover     = trackHover;
window.setLevelGrade  = setLevelGrade;
Object.defineProperty(window, 'levelIdx', { get: () => levelIdx });
window.Glossary = { show: showGlossary, hide: hideGlossary, closeOnBackdrop: closeGlossaryOnBackdrop };
window.setScr = setScr;
window.initDesigner = initDesigner;
window.dpick = dpick;

// Level jump buttons
const jumpEl = document.getElementById('level-jump');
if (jumpEl) {
  LEVELS.forEach((lv, i) => {
    const b = document.createElement('button');
    b.className = 'btn btn-g';
    b.style.cssText = 'font-size:11px;padding:4px 8px;border:0.5px solid #e0e0d8';
    b.textContent = lv.title;
    b.onclick = () => jumpTo(i);
    jumpEl.appendChild(b);
  });
}

// Start background music on first interaction
document.addEventListener('click', () => bgStart(), { once: true });