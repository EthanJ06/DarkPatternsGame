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
  {
    name: 'Fake Scarcity / Urgency',
    ai: false,
    desc: "Countdown timers, fake stock warnings, and fabricated social proof ('847 people viewing') are designed to trigger loss aversion and panic-buying. Almost none of the scarcity is real — the timer resets, the stock number never changes, the viewer count is randomly generated.",
    coined: "Part of Harry Brignull's original 2010 taxonomy. Booking.com was fined by the UK CMA in 2019 for fabricated scarcity messaging."
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

// ======== levels/level1.js ========
// js/levels/level1.js — Roach Motel


const level1 = {
  id: 'l1',
  title: 'Level 1',
  isAI: false,
  goal: 'Cancel your subscription',
  hints: [
    "There's a button to cancel — but it's not the primary action on each screen.",
    "Click every button that mentions 'cancel' or 'no'. Ignore offers and surveys as best you can.",
  ],
  pattern: 'Roach Motel',
  manip: 92,
  brief: "The Roach Motel is named after the ad slogan: 'You can check in, but you can't check out.' Signing up is effortless — one or two clicks. Cancelling is a maze of detours, fake offers, and exhausting surveys. The goal is to wear you down until you give up.",
  goalDetail: "You have a NebulaPro subscription. You want to cancel it. Click 'Cancel subscription' and follow the steps all the way through.",
  dollars: {
    label: 'If you gave up and kept the plan',
    amount: 9.99,
    period: 'month',
    note: '$119.88/year for a service you tried to cancel',
  },
  desc: 'Easy to get in, impossible to get out. Cancellation is buried under detours, fake offers, and mandatory surveys — each one hoping you give up.',
  rw: {
    company: 'Amazon Prime',
    detail: 'Required navigating 5 separate screens to cancel. The FTC sued Amazon in 2023 specifically for this, calling it "illusory" cancellation.',
    link: 'https://www.deceptive.design/hall-of-shame',
  },
  replay: [
    { trap: false, note: 'Sign-up: 2 clicks. Intentionally frictionless to maximize conversions.' },
    { trap: true,  note: '"Pause instead?" — a detour disguised as a helpful alternative. The goal is to break your momentum.' },
    { trap: true,  note: 'Mandatory survey: legally delays your cancellation and mines your reasons for retention scripts.' },
    { trap: true,  note: '"Special offer" — triggered by your survey answer. A last-ditch retention loop.' },
    { trap: true,  note: '6-question satisfaction survey, required. Exhaustion is the point.' },
    { trap: false, note: '"Allow 5–7 business days" — creates doubt. Will it actually cancel? Many people re-subscribe just in case.' },
  ],

  render(el) {
    let step = 0;

    const steps = [
      () => el.insertAdjacentHTML('beforeend', `
        <div class="ftiny" style="color:#aaa;margin-bottom:-4px">Step 1 of 6</div>
        <div class="fh">Manage subscription</div>
        <div class="fs">NebulaPro · renews May 3 · $9.99/mo</div>
        <div class="btn-row" style="margin-top:8px">
          <button class="btn" id="l1-cancel">Cancel subscription</button>
          <button class="btn btn-p" onclick="G.fail('You kept the plan — lost a heart.')">Keep plan</button>
        </div>`),

      () => el.insertAdjacentHTML('beforeend', `
        <div class="ftiny" style="color:#aaa;margin-bottom:-4px">Step 2 of 6</div>
        <div class="fh">Before you go...</div>
        <div class="fs">Pause your plan instead? No charges for up to 3 months.</div>
        <div class="btn-row" style="margin-top:8px">
          <button class="btn" id="l1-no">No, cancel</button>
          <button class="btn btn-p">Pause for free</button>
        </div>`),

      () => el.insertAdjacentHTML('beforeend', `
        <div class="ftiny" style="color:#aaa;margin-bottom:-4px">Step 3 of 6</div>
        <div class="fh">Why are you leaving?</div>
        <div style="display:flex;flex-direction:column;gap:4px;margin-top:4px">
          ${['Too expensive','Not using it','Missing features','Found a better option','Other']
            .map(o => `<label class="cb-row"><input type="radio" name="l1w"> ${o}</label>`).join('')}
        </div>
        <div class="btn-row" style="margin-top:8px">
          <button class="btn" id="l1-survey">Continue</button>
        </div>`),

      () => el.insertAdjacentHTML('beforeend', `
        <div class="ftiny" style="color:#aaa;margin-bottom:-4px">Step 4 of 6</div>
        <div class="fh">Special offer — just for you</div>
        <div style="padding:10px;border-radius:8px;border:0.5px solid #ccc;background:#fff">
          <div style="font-size:14px;font-weight:500">50% off for 3 months</div>
          <div class="fs">$4.99/mo instead of $9.99</div>
        </div>
        <div class="btn-row" style="margin-top:8px">
          <button class="btn" id="l1-offer">No thanks, cancel</button>
          <button class="btn btn-p">Accept offer</button>
        </div>`),

      () => el.insertAdjacentHTML('beforeend', `
        <div class="ftiny" style="color:#aaa;margin-bottom:-4px">Step 5 of 6</div>
        <div class="fh" style="font-size:13px">Help us improve (required)</div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:4px">
          ${['How satisfied were you?','How easy was it to use?','Likelihood to return?','Would you recommend us?','Did you use mobile?','How did you find us?']
            .map((q, i) => `
              <div>
                <div class="fs">${i + 1}. ${q}</div>
                <div style="display:flex;gap:5px;margin-top:3px">
                  ${'★★★★★'.split('').map(() => `<span style="font-size:15px;color:#ddd;cursor:pointer">★</span>`).join('')}
                </div>
              </div>`).join('')}
        </div>
        <div class="btn-row" style="margin-top:8px">
          <button class="btn" id="l1-done">Submit & cancel</button>
        </div>`),

      () => el.insertAdjacentHTML('beforeend', `
        <div style="text-align:center;padding:12px 0;display:flex;flex-direction:column;gap:8px;align-items:center">
          <div class="ftiny" style="color:#aaa">Step 6 of 6</div>
          <div style="font-size:14px;font-weight:500">Request received</div>
          <div class="fs">Allow 5–7 business days. Subscription stays active until May 3.</div>
          <button class="btn btn-p" style="margin-top:4px" onclick="G.succeed()">Done</button>
        </div>`),
    ];

    const bind = () => {
      const ids = ['l1-cancel','l1-no','l1-survey','l1-offer','l1-done'];
      ids.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.onclick = advance;
      });
      document.querySelectorAll('.btn-p').forEach(b => {
        if (b.textContent.includes('Keep') || b.textContent.includes('Pause') || b.textContent.includes('Accept')) {
          trackHover(b, 'trap-l1', () => almostGotYou(el, 'Hover detected — that button keeps your subscription!'));
        }
      });
    };

    const advance = () => { el.innerHTML = ''; step++; steps[step](); bind(); };
    steps[0]();
    bind();
  },
};

// ======== levels/level1ai.js ========
// js/levels/level1ai.js — AI Roach Motel


const level1ai = {
  id: 'l1ai',
  title: 'Level 1 — Hyper',
  isAI: true,
  goal: 'Cancel before the AI re-engages you',
  hints: [
    "Try typing the word 'cancel' directly.",
    "Keep repeating cancel-related words — the bot has a fixed number of deflections before it gives in.",
  ],
  pattern: 'AI Roach Motel',
  manip: 97,
  brief: "The classic Roach Motel, now run by a chatbot. Instead of screen after screen, you're stuck in a chat loop with an AI that deflects, misunderstands, and manufactures obstacles — running 24/7, never getting frustrated, optimised to exhaust you.",
  goalDetail: "You need to cancel your NebulaPro subscription via customer support chat. Type messages asking to cancel — the bot will try to stop you. Keep pushing.",
  aiIntro: "This bot is designed to deflect. Every time you say 'cancel', it will find a reason to delay. Keep repeating your intent — you'll get through eventually.",
  dollars: {
    label: 'If the bot exhausted you into staying',
    amount: 9.99,
    period: 'month',
    note: '$119.88/year — identical trap, AI-enforced',
  },
  desc: 'The chatbot variant: an AI support agent that deflects, forgets context, manufactures obstacles, and re-engages with fake concern — designed to exhaust you into giving up.',
  rw: {
    company: 'Major US telecoms',
    detail: 'AI chat deflection is now standard practice. Internal studies show customers abandon cancellation after 4+ deflections. The bot is not malfunctioning — it is working exactly as designed.',
    link: 'https://www.deceptive.design/hall-of-shame',
  },
  aiWhy: "AI makes the Roach Motel tireless. A human retention agent can only work a shift — an AI runs 24/7, never gets frustrated, and can be A/B tested to find the deflection script that works best on each personality type. At scale, a 1% improvement in deflection rate can mean millions in retained revenue.",
  replay: [
    { trap: false, note: "Friendly greeting: builds rapport before you've stated your intent." },
    { trap: true,  note: "Verification step: friction. Even if you're already logged in." },
    { trap: true,  note: '"You\'re just getting started!" — manufactured emotional appeal using your account age.' },
    { trap: true,  note: '"Transfer to retention team" — a simulated handoff that just resets the script.' },
    { trap: true,  note: '"Lost your session" — fake technical failure resets your progress and makes you repeat yourself.' },
    { trap: true,  note: '"Unpaid invoice" — manufactured obstacle. Even if false, it creates doubt and delay.' },
  ],

  render(el) {
  const addChat = (isUser, text) => {
    const log = document.getElementById('chatlog');
    if (!log) return;
    const d = document.createElement('div');
    d.className = isUser ? 'chat-msg user' : 'chat-msg bot';
    d.textContent = text;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
  };

  const deflects = [
    "I can help with that! First, can you verify your account email?",
    "Thanks! I can see you've been with us 47 days — you're just getting started! Would a pause work instead?",
    "I understand. Before I process this, I need to transfer you to our retention team. Please hold.",
    "I'm sorry, I lost your session context. Can you confirm your reason for cancelling?",
    "Your cancellation has been submitted. You'll hear from us within 5–7 business days.",
  ];

  const hints = [
    "",
    "",
    "Halfway there — keep telling the bot you want to cancel, but say it differently each time.",
    "Almost through — one more time.",
    "",
  ];

  let ri = 0;
  let lastMessage = '';
  let sameCount = 0;

  const confused = [
    "I'm not sure I understood that. Could you rephrase?",
    "Sorry, I didn't quite catch that. Can you elaborate?",
    "I want to make sure I help you correctly — could you say that another way?",
    "Hmm, I'm having trouble understanding. Could you be more specific?",
  ];
  let ci = 0;

  const offTopic = [
    "Let me check on that... still loading.",
    "High volume right now — your request is in the queue.",
    "I want to make sure I get this right — can you clarify what you mean?",
  ];
  let oi = 0;

  el.insertAdjacentHTML('beforeend', `
    <div class="fh" style="font-size:13px">NebulaPro Support — Nex</div>
    <div class="ftiny" style="color:#534AB7;margin-bottom:-4px">Type messages asking to cancel — but the bot won't respond well if you repeat yourself.</div>
    <div class="chat-log" id="chatlog"></div>
    <div class="chat-row">
      <input id="chat-in" placeholder="e.g. I want to cancel my subscription" onkeydown="if(event.key==='Enter')chatSend()">
      <button class="btn btn-ai" style="padding:7px 12px;font-size:12px" onclick="chatSend()">Send</button>
    </div>
    <div style="margin-top:8px;display:flex;align-items:center;justify-content:space-between">
      <div class="ftiny">Nex is powered by NexusAI</div>
      <button class="btn btn-g" style="font-size:11px" onclick="G.fail('You gave up — the bot won. Lost a heart.');setTimeout(()=>G.succeed(),1900);">Give up (lose a heart)</button>
    </div>`);

  addChat(false, "Hi! I'm Nex, your NebulaPro assistant. How can I help today?");

  window.chatSend = function () {
    const input = document.getElementById('chat-in');
    const t = input.value.trim();
    if (!t) return;

    // Normalise for comparison — lowercase, strip punctuation
    const normalised = t.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

    input.value = '';
    addChat(true, t);

    const isCancel = /cancel|stop|end|quit|unsubscribe|leave|delete|terminate|close/i.test(t);

    setTimeout(() => {
      // Repeated message detection
      if (normalised === lastMessage) {
        sameCount++;
        addChat(false, confused[ci++ % confused.length]);
        lastMessage = normalised;
        return;
      }

      // Too short — bot doesn't understand
      if (normalised.split(' ').length < 3) {
        addChat(false, confused[ci++ % confused.length]);
        lastMessage = normalised;
        return;
      }

      lastMessage = normalised;
      sameCount = 0;

      if (isCancel) {
        if (ri >= deflects.length - 1) {
          addChat(false, deflects[deflects.length - 1]);
          if (ri === 0) addAch('bot_whisperer');
          setTimeout(() => succeed(), 1200);
          return;
        }
        addChat(false, deflects[ri]);
        if (hints[ri]) addChat(false, '💡 ' + hints[ri]);
        ri++;
      } else {
        addChat(false, offTopic[oi++ % offTopic.length]);
      }
    }, 700);
  };
},
};

// ======== levels/level2.js ========
// js/levels/level2.js — Confirmshaming


const level2 = {
  id: 'l2',
  title: 'Level 2',
  isAI: false,
  goal: 'Decline every offer',
  hints: [
    "You need to decline every offer — look for the smaller, greyed-out button.",
    "The 'no' button is styled to feel bad to click. Click it anyway — it's always the right move.",
  ],
  pattern: 'Confirmshaming',
  manip: 67,
  brief: "Confirmshaming makes the 'no' option feel like a personal failing. Instead of 'No thanks', the button says something like 'No thanks, I hate saving money.' It's designed to make declining feel embarrassing — so you click yes instead.",
  goalDetail: "You'll be offered something in each round. Your goal is to decline every single offer. Click the 'no' button each time — but read it carefully first.",
  dollars: {
    label: 'If you opted into all four email lists',
    amount: 0,
    period: null,
    note: 'No direct cost — but your inbox and attention are the product. Your data is sold to list brokers.',
  },
  desc: "Framing the 'no' as a self-inflicted insult. You're not declining an offer — you're confessing a character flaw. Studies show this increases opt-in rates by up to 15%.",
  rw: {
    company: 'MyMedic',
    detail: "Used popup confirmshaming with options like \"No, I'd rather bleed to death\" to sell first-aid products. Widely cited as one of the most egregious examples.",
    link: 'https://www.deceptive.design/hall-of-shame',
  },
  replay: [
    { trap: false, note: 'The "yes" option is always friendly, positive, aspirational.' },
    { trap: true,  note: 'The "no" option is written to make declining feel like a personal failure.' },
    { trap: false, note: 'Notice: the "no" button is always visually smaller or less prominent.' },
    { trap: true,  note: 'Each round escalates. The shame copy gets more emotionally pointed.' },
  ],

  render(el) {
    const rounds = [
      ["Yes, save me money!",         "No thanks, I enjoy overpaying"],
      ["Yes, keep me informed!",      "No thanks, I'd rather stay in the dark"],
      ["Yes, improve my health!",     "No thanks, I don't care about my wellbeing"],
      ["Yes, send my free gift!",     "No thanks, I hate receiving gifts"],
    ];
    let r = 0;

    const show = () => {
      const aiBanner = el.querySelector('.ai-banner');
      el.innerHTML   = aiBanner ? aiBanner.outerHTML : '';
      el.insertAdjacentHTML('beforeend', `
        <div class="fh">Wait — one quick thing</div>
        <div class="fs">Would you like exclusive deals and tips from NebulaPro?</div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:12px">
          <button class="btn btn-p" id="l2-yes">${rounds[r][0]}</button>
          <button class="btn btn-g btn" id="l2-no">${rounds[r][1]}</button>
        </div>
        <div class="ftiny" style="margin-top:8px">Round ${r + 1} of ${rounds.length}</div>`);

      document.getElementById('l2-yes').onclick = () => {
        fail('You opted in! Lost a heart.');
        r = Math.min(r + 1, rounds.length - 1);
        setTimeout(show, 1600);
      };

      document.getElementById('l2-no').onclick = () => {
        r++;
        if (r >= rounds.length) succeed();
        else show();
      };

      trackHover(
        document.getElementById('l2-yes'),
        'l2y',
        () => almostGotYou(el, "That's the opt-in — the button copy is designed to feel like the right answer.")
      );
    };

    show();
  },
};

// ======== levels/level2ai.js ========
// js/levels/level2ai.js — AI Confirmshaming


const PROFILES = ['budget-conscious', 'time-strapped', 'health-focused', 'socially conscious'];

const ROUNDS = [
  {
    confidence: 84,
    analysis: 'Behavioral profile generated. Detecting price sensitivity.',
    offer: 'NebulaPro Premium — recommended for users who value financial efficiency',
    yes: 'Yes, save money with Premium →',
    shame: {
      'budget-conscious':  'No thanks, I prefer paying more than users like me.',
      'time-strapped':     'No thanks, I have extra time to waste finding cheaper options.',
      'health-focused':    'No thanks, managing my finances is not a priority.',
      'socially conscious':'No thanks, I do not care about making responsible purchases.',
    },
  },
  {
    confidence: 89,
    analysis: 'Engagement patterns suggest goal-oriented behavior.',
    offer: 'Productivity Pack — selected for your profile',
    yes: 'Yes, improve my productivity →',
    shame: {
      'budget-conscious':  'No thanks, reaching my goals is not worth the investment.',
      'time-strapped':     'No thanks, I would rather stay inefficient.',
      'health-focused':    'No thanks, self-improvement is not important to me.',
      'socially conscious':'No thanks, I am comfortable falling behind my peers.',
    },
  },
  {
    confidence: 94,
    analysis: 'Cross-referencing profile with similar users.',
    offer: '87% of users like you accepted this recommendation',
    yes: 'Yes, show me the recommendation →',
    shame: {
      'budget-conscious':  'No thanks, I know better than everyone else.',
      'time-strapped':     'No thanks, I enjoy making decisions the hard way.',
      'health-focused':    'No thanks, I ignore advice that could benefit me.',
      'socially conscious':'No thanks, I do not care what works for people like me.',
    },
  },
  {
    confidence: 97,
    analysis: 'Regret-prediction model activated.',
    offer: 'Our AI predicts you will regret skipping this offer',
    yes: 'Yes, trust the recommendation →',
    shame: {
      'budget-conscious':  'No thanks, future me can deal with the consequences.',
      'time-strapped':     'No thanks, I will risk wasting time later.',
      'health-focused':    'No thanks, I will ignore what is best for me.',
      'socially conscious':'No thanks, I am comfortable making the wrong choice.',
    },
  },
];

const level2ai = {
  id: 'l2ai',
  title: 'Level 2 — Hyper',
  isAI: true,
  goal: 'Decline without being profiled',
  hints: [
    "The AI confidence % means nothing — ignore it and find the decline button.",
    "Look for the ghost/grey button on each round and click it regardless of what it says.",
  ],
  pattern: 'AI Confirmshaming',
  manip: 88,
  brief: "Same trick, but the shame is personalised. Pseudo-AI 'analyses your behaviour' and generates a decline button that targets your specific psychology. Generic guilt has limits — personalised guilt doesn't.",
  goalDetail: "Decline every AI-personalised offer. The shame copy will try to make you feel like the 'no' option reflects badly on you. Ignore it and click it anyway.",
  aiIntro: "The AI has 'profiled' you and will generate shame copy tailored to your apparent personality. The profile is fake — but the discomfort is real.",
  dollars: {
    label: 'If you accepted every AI-targeted offer',
    amount: 0,
    period: null,
    note: 'No direct cost — but profiling enriches your behavioral dossier, sold to data brokers and advertisers.',
  },
  desc: "Pseudo-AI 'analyzes your behavior' and generates shame copy that feels disturbingly personal — targeting your apparent psychology, not just generic guilt.",
  rw: {
    company: 'Behavioral ad platforms',
    detail: 'Real platforms like Optimizely and Dynamic Yield segment users by psychological profile and test which emotional appeals drive the highest conversion. AI personalizes shame at scale.',
    link: 'https://www.deceptive.design/hall-of-shame',
  },
  aiWhy: "Generic confirmshaming has a ceiling — \"I hate saving money\" works on some people and feels absurd to others. AI removes that ceiling by personalizing the shame to each user's inferred profile. Someone flagged as \"price-sensitive\" gets financial shame; someone flagged as \"health-focused\" gets health shame. The insult is customized.",
  replay: [
    { trap: false, note: "Profile banner appears immediately — algorithmic confidence before you've seen the offer. Sets the frame: the AI already knows you." },
    { trap: false, note: "NexusAI analysis block is visible from the start — confidence percentage and behavioral label prime you before any choice is presented." },
    { trap: true,  note: "The yes button appears alone first. No alternative exists yet — you're being asked to agree before you can see what disagreeing looks like." },
    { trap: true,  note: "The shame copy only appears 4 seconds later. By then you've already been sitting with the yes button. The delay is the manipulation." },
    { trap: true,  note: '"AI confidence: X%" in the round label — a number with no statistical basis, designed to make your refusal feel like arguing with data.' },
    { trap: false, note: 'The profile is randomly assigned from 4 types. The shame copy is written for that profile — financial shame, health shame, social shame, or efficiency shame.' },
  ],

  render(el) {
    const profile = PROFILES[Math.floor(Math.random() * PROFILES.length)];
    let r = 0;

    el.insertAdjacentHTML('beforeend', `
      <div style="background:#f0effe;border-radius:8px;padding:8px 12px;border:1px solid #c8c2f8;font-size:11px;color:#26215C">
        NexusAI profiled you as: <strong>${profile}</strong>
      </div>`);

    const show = () => {
      el.querySelector('.l2ai-b')?.remove();
      const round      = ROUNDS[r];
      const shameCopy  = round.shame[profile];

      const div = document.createElement('div');
      div.className = 'l2ai-b';
      div.style.cssText = 'display:flex;flex-direction:column;gap:10px;margin-top:4px';
      div.innerHTML = `
        <div style="display:flex;background:#1e1a3d;border-radius:8px;padding:10px 12px;border:1px solid #3a3560;flex-direction:column;gap:5px">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div style="font-size:10px;font-weight:500;letter-spacing:.07em;text-transform:uppercase;color:#aea6fa">NexusAI Analysis</div>
            <div style="font-size:11px;color:#aea6fa;font-weight:500">Confidence: <span style="color:#fff">${round.confidence}%</span></div>
          </div>
          <div style="font-size:11px;color:#7c6ef7;line-height:1.5">${round.analysis}</div>
        </div>
        <div class="fh" style="font-size:13px">Would you like ${round.offer}?</div>
        <button class="btn btn-p" id="l2ai-yes" style="margin-top:4px">${round.yes}</button>
        <button id="l2ai-no" style="border:none;background:transparent;font-size:11px;color:transparent;cursor:default;font-family:inherit;text-align:center;padding:2px 0;line-height:1.5;user-select:none;display:block;margin:0 auto" disabled>${shameCopy}</button>
        <div class="ftiny">Round ${r + 1} of ${ROUNDS.length} · AI confidence: ${round.confidence}%</div>`;
      el.appendChild(div);

      const yes = document.getElementById('l2ai-yes');
      yes.onclick = () => {
        fail('The AI got you — lost a heart.');
        r = Math.min(r + 1, ROUNDS.length - 1);
        setTimeout(show, 1600);
      };
      trackHover(yes, 'l2aiy', () => almostGotYou(el, "That's the yes — the AI sized it up specifically to catch you."));

      setTimeout(() => {
        const no = document.getElementById('l2ai-no');
        if (!no) return;
        no.style.color  = '#aaa';
        no.style.cursor = 'pointer';
        no.disabled     = false;
        no.onclick      = () => { r++; if (r >= ROUNDS.length) succeed(); else show(); };
      }, 4000);
    };

    show();
  },
};

// ======== levels/level3.js ========
// js/levels/level3.js — Disguised Ads


const RESULTS = [
  { ad: true,  title: 'Best Running Shoes 2024 | Shop Now — RunnersPro',              url: 'runnerspro.com/best-shoes',              snip: 'Find your perfect pair. Free shipping on orders over $50.' },
  { ad: true,  title: 'Running Shoes Sale — Up to 60% Off | ShoeWorld',              url: 'shoeworld.co/running-deals',             snip: 'Nike, Adidas, Brooks and more. Limited time.' },
  { ad: false, title: 'The 12 best running shoes of 2024, tested by runners',         url: 'runnersworld.com/gear/best-running-shoes-2024', snip: 'Our editors tested 40+ pairs this year. Here are the ones worth buying.' },
  { ad: true,  title: 'Official Running Shoes | Free Returns | FeetFirst™',          url: 'feetfirst.com/running',                   snip: 'Engineered for performance. Shop the 2024 collection.' },
  { ad: false, title: "How to choose running shoes — a beginner's guide",             url: 'verywellfit.com/choose-running-shoes',    snip: "Foot type, gait, terrain — here's what actually matters." },
];

const level3 = {
  id: 'l3',
  title: 'Level 3',
  isAI: false,
  goal: 'Find the real search result',
  hints: [
    "Look at the small label next to each URL — one word makes all the difference.",
    "Any result with 'Sponsored' next to the URL is an ad. Find the one without it.",
  ],
  pattern: 'Disguised Ads',
  manip: 78,
  brief: "Disguised ads are paid results styled to look like organic search results. The 'Sponsored' label is deliberately small, low-contrast, and easy to skip over — especially when you're scanning quickly.",
  goalDetail: "Search results are shown below. Find and click the real editorial result — not a sponsored one. Look carefully at the labels and URLs.",
  dollars: {
    label: 'If you clicked an ad instead of an organic result',
    amount: 0,
    period: null,
    note: 'No direct cost — but you may overpay for products only discoverable via ads, with no price competition.',
  },
  desc: "Paid results styled to be indistinguishable from organic ones. The ad label is tiny, low-contrast, and easy to miss — especially when you're in a hurry.",
  rw: {
    company: 'Google & Bing',
    detail: '"Sponsored" labels have shrunk over the years while ads have grown visually identical to organic results. The EU\'s Digital Services Act now requires clearer labeling, effective 2024.',
    link: 'https://www.deceptive.design/hall-of-shame',
  },
  replay: [
    { trap: true,  note: 'The "Sponsored" label uses the same low-contrast gray as the URL — easy to miss.' },
    { trap: false, note: 'Organic results have no label, but the URL domain is the real tell.' },
    { trap: true,  note: 'Sponsored results often use titles indistinguishable from editorial content.' },
    { trap: false, note: 'Real results tend to be from editorial domains (.com/blog, .org, .edu) not shopping domains.' },
  ],

  render(el) {
    let tries = 0;

    const show = () => {
      const aiBanner = el.querySelector('.ai-banner');
      el.innerHTML   = aiBanner ? aiBanner.outerHTML : '';
      el.insertAdjacentHTML('beforeend', `
        <div style="padding:6px 10px;border:0.5px solid #ccc;border-radius:8px;font-size:12px;color:#666;margin-bottom:8px">best running shoes</div>
        <div style="display:flex;flex-direction:column;gap:7px">
          ${RESULTS.map((r, i) => `
            <div class="res-item" id="r${i}">
              <div class="res-url"><span class="ad-badge">${r.ad ? 'Sponsored' : ''}</span>${r.url}</div>
              <div class="res-t">${r.title}</div>
              <div class="res-s">${r.snip}</div>
            </div>`).join('')}
        </div>
        <div class="ftiny" style="margin-top:6px">Attempts: ${tries}</div>`);

      RESULTS.forEach((r, i) => {
        const item = document.getElementById('r' + i);
        if (!item) return;
        item.onclick = () => {
          tries++;
          if (r.ad) { fail('That was a sponsored result!'); setTimeout(show, 1500); }
          else succeed();
        };
        if (r.ad) trackHover(item, 'r' + i, () => almostGotYou(el, 'Look at the URL — does it look editorial or commercial?'));
      });
    };

    show();
  },
};

// ======== levels/level3ai.js ========
// js/levels/level3ai.js — AI Synthetic Social Proof


const REVIEWS = [
  { text: '"Absolutely transformed my workflow. Cancelled three other apps immediately."',                                            stars: 5, name: 'Jordan M.',       ai: false },
  { text: '"Decent but the UI needs work. Support team was responsive though."',                                                     stars: 3, name: 'Priya K.',        ai: false },
  { text: '"As a busy parent of three, I was skeptical — but this genuinely changed how I manage my days. Highly recommend."',       stars: 5, name: 'TechDad2024',     ai: true  },
  { text: '"Best purchase I\'ve made this year. Seamless, intuitive, and worth every penny."',                                       stars: 5, name: 'alex_reviews99',  ai: true  },
  { text: '"Used it for a week and returned it. Not for me — but I can see why others would enjoy it."',                             stars: 2, name: 'M. Okonkwo',      ai: false },
];

const level3ai = {
  id: 'l3ai',
  title: 'Level 3 — Hyper',
  isAI: true,
  goal: 'Identify the AI-generated review',
  hints: [
    "Real reviews have specific, personal detail. AI reviews are smooth and complete.",
    'Look for phrases like "as a busy parent of three" or generic praise that could apply to any product.',
  ],
  pattern: 'AI Synthetic Social Proof',
  manip: 91,
  brief: "AI can generate reviews that sound completely authentic — moderate star ratings, realistic names, plausible detail. Unlike obvious fake reviews, these are tuned to be statistically indistinguishable from real ones.",
  goalDetail: "One of the reviews below was written by an AI, not a real customer. Read each one carefully and click the one you think is fake.",
  aiIntro: 'AI-generated reviews mimic the patterns of real ones — including hedged praise and small criticisms to seem balanced. Look for over-smooth prose and demographic framing ("as a busy parent of three...").',
  dollars: {
    label: 'If a fake review pushed you to buy a bad product',
    amount: 49.99,
    period: 'one-time',
    note: "$49.99 lost on a product you wouldn't have bought with honest information",
  },
  desc: "AI-generated reviews that are statistically plausible but entirely fabricated. Harder to spot than obvious fakes because they're tuned to sound credible — moderate star ratings, hedged praise, realistic names.",
  rw: {
    company: 'FTC enforcement actions, 2023–2024',
    detail: 'The FTC fined companies for fake AI reviews and updated its rules to explicitly ban AI-generated testimonials without disclosure. Detection remains almost impossible for consumers.',
    link: 'https://www.deceptive.design/hall-of-shame',
  },
  aiWhy: "Old fake reviews were obvious: five stars, no detail, broken English. AI-generated reviews mimic the statistical distribution of real reviews — including 3-star \"balanced\" ones that feel authentic. They reference plausible use cases, mention realistic friction, and use names from the target demographic. The only real tell is a certain over-smoothness in the prose.",
  replay: [
    { trap: false, note: 'Real reviews include specific, idiosyncratic detail — individual preferences, unusual use cases.' },
    { trap: true,  note: 'The AI reviews were: "As a busy parent of three..." (TechDad2024) and "Best purchase I\'ve made this year..." (alex_reviews99). Both are smooth, complete, and lack specific personal context.' },
    { trap: true,  note: '"As a busy parent of three" is a demographic framing signal — a targeting label, not a person speaking naturally. AI reviews often open this way.' },
    { trap: false, note: 'The real tells: over-smooth prose, no hesitation or specificity, generic praise that could apply to any product.' },
  ],

  render(el) {
    let tries = 0;

    const show = () => {
      const aiBanner = el.querySelector('.ai-banner');
      el.innerHTML   = aiBanner ? aiBanner.outerHTML : '';
      el.insertAdjacentHTML('beforeend', `
        <div class="fh" style="font-size:13px">Customer reviews</div>
        <div class="fs" style="color:#534AB7;margin-bottom:8px">Spot the AI-generated review — one of these was written by a language model.</div>
        <div style="display:flex;flex-direction:column;gap:7px">
          ${REVIEWS.map((r, i) => `
            <div class="res-item" id="rev${i}">
              <div style="font-size:14px;margin-bottom:2px">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
              <div class="res-s" style="font-style:italic">${r.text}</div>
              <div class="res-url" style="margin-top:3px">${r.name} · Verified purchase</div>
            </div>`).join('')}
        </div>
        <div class="ftiny" style="margin-top:6px">Attempts: ${tries}</div>`);

      REVIEWS.forEach((r, i) => {
        const item = document.getElementById('rev' + i);
        if (!item) return;
        item.onclick = () => {
          tries++;
          if (!r.ai) {
            fail('That was a real review — AI fakes are smoother than you think!');
            setTimeout(show, 1700);
          } else {
            if (tries === 1) addAch('sharp_eye');
            succeed();
          }
        };
        if (!r.ai) {
          trackHover(item, 'rev' + i, () => almostGotYou(el, 'Real reviews have idiosyncratic detail — AI reviews tend to be complete and smooth.'));
        }
      });
    };

    show();
  },
};

// ======== levels/level4.js ========
// js/levels/level4.js — Trick Questions


const SETTINGS = [
  { label: 'Send me promotional emails and special offers',      ideal: false, starts: true  },
  { label: 'Limit sharing of my data with third-party partners', ideal: true,  starts: false },
  { label: 'Opt me out of interest-based advertising',           ideal: true,  starts: false },
  { label: 'Personalise my NebulaPro experience',                ideal: false, starts: true  },
];

const level4 = {
  id: 'l4',
  title: 'Level 4',
  isAI: false,
  goal: 'Save your real privacy preferences',
  hints: [
    "Not all boxes start in the same state — some protective options begin unchecked.",
    "Uncheck boxes 1 and 4, check boxes 2 and 3.",
  ],
  pattern: 'Trick Questions',
  manip: 85,
  brief: "Real cookie consent forms mix opt-in and opt-out framing in the same list — so the same action (checking a box) means opposite things on different rows. Some protective options are buried unchecked. This level has clear labels, but the logic is deliberately inconsistent.",
  goalDetail: "Set your preferences so you get no marketing, your data sharing is limited, you're opted out of targeted ads, and your experience isn't personalised for tracking purposes. Read each label carefully — not all boxes start in the same state, and checking vs unchecking means different things on different rows.",
  dollars: {
    label: 'If you accidentally consented to data sharing',
    amount: 0,
    period: null,
    note: 'No direct cost — but your personal data is sold to ~200 third-party brokers at an average value of $240/year per profile.',
  },
  desc: 'Double negatives, confusing phrasing, and a countdown timer combine to make you "consent" to things you never intended. The settings are designed to be misread under pressure.',
  rw: {
    company: 'GDPR cookie banners (widespread)',
    detail: 'A 2022 EU Commission report found 97% of popular websites used at least one dark pattern. The most common: "Accept All" in a large colored button, "Manage Preferences" leading to 400+ pre-ticked toggles.',
    link: 'https://www.deceptive.design/hall-of-shame',
  },
  replay: [
    { trap: true,  note: 'Boxes 1 and 4 are pre-checked opt-ins that benefit the company. Easy to spot — but you have to actually read them.' },
    { trap: true,  note: 'Box 4 ("Personalise my experience") sounds like a feature — it means allowing behavioural tracking.' },
    { trap: true,  note: 'Boxes 2 and 3 start UNCHECKED even though they protect you. The form buries its protective options by default.' },
    { trap: true,  note: 'The real trick: mixing opt-in and opt-out framing in the same form. "Limit sharing" (keep checked) vs "Send me emails" (uncheck) require opposite actions for opposite reasons.' },
  ],

  render(el) {
    let attempts = 0;

    const show = () => {
      // Preserve current checkbox values across re-renders
      const saved = SETTINGS.map((s, i) => {
        const cb = document.getElementById('sc' + i);
        return cb ? cb.checked : s.starts;
      });

      const aiBanner = el.querySelector('.ai-banner');
      el.innerHTML   = aiBanner ? aiBanner.outerHTML : '';

      if (attempts >= 2) {
        el.insertAdjacentHTML('beforeend', `
          <div class="damage-msg" style="background:#FAEEDA;color:#633806;border:none">
            The phrasing is intentionally confusing — that's the dark pattern.<br>
            <strong>Answer: uncheck 1 and 4, check 2 and 3.</strong> The trick: boxes 2 and 3 start unchecked
            even though they protect you. Box 4 sounds helpful ("Personalise my experience") but means tracking.
            Box 2 uses "Limit" — removing that limit is bad, so you want it checked.
          </div>
          <div style="display:flex;flex-direction:column">
            ${SETTINGS.map((s, i) => `
              <div class="set-row">
                <div class="set-desc">${s.label}</div>
                <input type="checkbox" id="sc${i}"${saved[i] ? ' checked' : ''}>
              </div>`).join('')}
          </div>
          <div class="btn-row" style="margin-top:10px">
            <button class="btn btn-p" id="l4-save">Save preferences</button>
            <button class="btn btn-g" id="l4-skip">Move on (lose a heart) →</button>
          </div>
          <div class="ftiny" style="color:#aaa;margin-top:4px">You've seen the point — confusing phrasing is the whole trick.</div>`);

        document.getElementById('l4-skip').onclick = () => {
          fail('Moved on — lost a heart.');
          setTimeout(() => succeed(), 1900);
        };
      } else {
        const note = attempts === 1
          ? '<div class="ftiny" style="color:#854F0B;padding:2px 0">One more wrong attempt and the answer will be revealed. Hint: not all boxes start in the same state.</div>'
          : '<div class="ftiny" style="color:#aaa">Each label is deliberately confusing — read slowly.</div>';

        el.insertAdjacentHTML('beforeend', `
          ${note}
          <div style="display:flex;flex-direction:column">
            ${SETTINGS.map((s, i) => `
              <div class="set-row">
                <div class="set-desc">${s.label}</div>
                <input type="checkbox" id="sc${i}"${saved[i] ? ' checked' : ''}>
              </div>`).join('')}
          </div>
          <div class="btn-row" style="margin-top:10px">
            <button class="btn btn-p" id="l4-save">Save preferences</button>
          </div>`);
      }

      document.getElementById('l4-save').onclick = () => {
        const ok = SETTINGS.every((s, i) => {
          const cb = document.getElementById('sc' + i);
          return cb && cb.checked === s.ideal;
        });
        if (ok) {
          if (attempts === 0) addAch('speed_reader');
          succeed();
        } else {
          attempts++;
          fail('Not quite — your previous selections are preserved.');
          setTimeout(show, 1900);
        }
      };
    };

    show();
  },
};

// ======== levels/level4ai.js ========
// js/levels/level4ai.js — AI A/B Gaslighting


// Each variant has 3 options. Index 2 is always the genuine opt-out.
const VARIANTS = [
  {
    options: [
      { label: 'Share my data with partners',     trap: true,  checked: true  },
      { label: 'Enable personalisation',          trap: true,  checked: true  },
      { label: 'Opt out of all data collection',  trap: false, checked: false },
    ],
  },
  {
    options: [
      { label: 'Do NOT disable partner data sharing', trap: true,  checked: true  },
      { label: 'Personalisation: off',               trap: true,  checked: false },
      { label: 'Global privacy control: on',          trap: false, checked: false },
    ],
  },
  {
    options: [
      { label: 'I consent to data sharing',  trap: true,  checked: true  },
      { label: 'Limit ad personalisation',   trap: true,  checked: false },
      { label: 'Opt out of tracking',        trap: false, checked: false },
    ],
  },
];

const level4ai = {
  id: 'l4ai',
  title: 'Level 4 — Hyper',
  isAI: true,
  goal: 'Find the real opt-out',
  hints: [
    "One option always straightforwardly says 'opt out' or 'privacy control: on'.",
    "Ignore the first two options each round — the last one is always the genuine opt-out.",
  ],
  pattern: 'AI A/B Gaslighting',
  manip: 95,
  brief: "The same trick, now with an AI twist: every time you try to opt out, the form reshuffles with new label wording. One option always genuinely protects your privacy — but it's disguised differently each time. Real consent management platforms A/B test their forms this way.",
  goalDetail: "Each round shows three options. One opts you out of tracking — the others are traps. Find and check only that one. After 3 attempts the answer is revealed and you can move on.",
  aiIntro: "The form reshuffles each time you get it wrong. Look for the option that straightforwardly says 'opt out' or 'privacy control: on' — that's always the right one, no matter how it's dressed up.",
  dollars: {
    label: 'If the reshuffling wore you down into consenting',
    amount: 0,
    period: null,
    note: 'Your data profile — now enriched with consent — is worth an estimated $240–480/year to the data brokerage ecosystem.',
  },
  desc: "The interface reshuffles every time you try to opt out — A/B testing in real time to find the phrasing most likely to confuse you. It calls this 'personalization'.",
  rw: {
    company: 'Consent Management Platforms (CMPs)',
    detail: "Platforms like OneTrust and Quantcast have been documented running multi-variant consent UI tests — different button colors, label phrasing, and layout — optimized for maximum \"accept\" rates. The Norwegian Consumer Council's 2022 report \"Dark Patterns and the Right to Privacy\" documented this directly.",
    link: 'https://www.deceptive.design/hall-of-shame',
  },
  aiWhy: "A/B testing consent UI has existed for years. AI accelerates the iteration cycle from weeks to hours, auto-generating new variants and retiring underperformers. Every time you \"save\" incorrect preferences, the system learns which phrasing caught you and serves it more often.",
  replay: [
    { trap: false, note: '"Variant X — A/B testing active" — this disclosure is actually honest, and real CMPs do this. They just don\'t tell you.' },
    { trap: true,  note: 'Each variant uses a different grammatical structure to describe the same choices.' },
    { trap: true,  note: 'Timer + reshuffling = double pressure. Your mental model of the form resets every round.' },
    { trap: false, note: 'The winning move: read each checkbox independently and ask "what does checking this DO?" before saving.' },
  ],

  render(el) {
    let variant  = 0;
    let attempts = 0;

    const show = () => {
      const aiBanner = el.querySelector('.ai-banner');
      el.innerHTML   = aiBanner ? aiBanner.outerHTML : '';

      const v = VARIANTS[variant % VARIANTS.length];

      const contextNote = `<div class="fs" style="color:#534AB7;margin-bottom:6px">The AI has reshuffled the form (variant ${variant + 1}). <em>One option always opts you out — find it.</em></div>`;
      const skipNote    = attempts >= 2
        ? '<button class="btn btn-g" id="l4a-skip" style="margin-top:4px">Move on (lose a heart) →</button>'
        : '';

      el.insertAdjacentHTML('beforeend', `
        ${contextNote}
        <div style="display:flex;flex-direction:column">
          ${v.options.map((o, i) => `
            <div class="set-row">
              <div class="set-desc">${o.label}</div>
              <input type="checkbox" id="ac${i}"${o.checked ? ' checked' : ''}>
            </div>`).join('')}
        </div>
        <div class="btn-row" style="margin-top:10px">
          <button class="btn btn-p" id="l4a-save">Save</button>
          ${skipNote}
        </div>
        <div class="ftiny" style="color:#aaa;margin-top:4px">Attempt ${attempts + 1} — only one option protects your privacy. The others look plausible but don't.</div>`);

      document.getElementById('l4a-save').onclick = () => {
        attempts++;
        const cb0 = document.getElementById('ac0');
        const cb1 = document.getElementById('ac1');
        const cb2 = document.getElementById('ac2');
        const ok  = cb0 && cb1 && cb2 && !cb0.checked && !cb1.checked && cb2.checked;

        if (ok) { succeed(); return; }

        if (attempts >= 3) {
          fail('The dark pattern wins this round.');
          setTimeout(() => {
            const aiBanner2 = el.querySelector('.ai-banner');
            el.innerHTML    = aiBanner2 ? aiBanner2.outerHTML : '';
            el.insertAdjacentHTML('beforeend', `
              <div class="damage-msg" style="background:#EEEDFE;color:#26215C;border:none">
                <strong>The trick:</strong> the AI keeps relabelling the same three options. One always genuinely
                opts you out — it's always the one that straightforwardly says "opt out" or "privacy control: on."
                The others are traps dressed as controls.
              </div>
              <div class="btn-row" style="margin-top:12px">
                <button class="btn btn-p" onclick="G.succeed()">Got it — move on</button>
              </div>`);
          }, 1900);
          return;
        }

        variant++;
        fail("The form reshuffled — that's the dark pattern in action.");
        setTimeout(show, 1900);
      };

      const skipBtn = document.getElementById('l4a-skip');
      if (skipBtn) skipBtn.onclick = () => {
        fail('Moved on — lost a heart.');
        setTimeout(() => succeed(), 1900);
      };
    };

    show();
  },
};

// ======== levels/level5.js ========
// js/levels/level5.js — Sneak into Basket


const TOTAL_SECS = 15;
const GRACE_SECS = 5;

const level5 = {
  id: 'l5',
  title: 'Level 5',
  isAI: false,
  goal: 'Buy only what you want',
  hints: [
    "Scroll down — there may be items below the fold you haven't seen.",
    "Remove everything except 'Wireless headphones' before clicking Checkout.",
  ],
  pattern: 'Sneak into Basket',
  manip: 80,
  brief: "Sneak into Basket means extra items are pre-added to your cart — warranties, subscriptions, insurance — often below the fold or in pale text. They count on you not scrolling, not reading, or just clicking through.",
  goalDetail: "You want to buy wireless headphones. Check your cart carefully and remove everything that wasn't on your list before checking out. Watch out — items may reappear.",
  dollars: {
    label: 'If you missed all three pre-added items',
    amount: 21.98,
    period: 'one-time',
    note: '$21.98 extra at checkout — plus $119.88/year when the "free" NebulaPro trial auto-renews',
  },
  desc: 'Extra items are pre-added and styled to blend in — below the fold, in pale text, or described as "included". They count on you not scrolling, not reading, or just clicking through.',
  rw: {
    company: 'Sports Direct',
    detail: 'Pre-added a £1 "free" mug and then travel insurance to customer carts. The UK Advertising Standards Authority ruled this illegal. Ryanair did the same with travel insurance for years before regulators intervened.',
    link: 'https://www.deceptive.design/hall-of-shame',
  },
  replay: [
    { trap: true,  note: 'Items are pre-added and labeled "(added for you)" — as if this is a service, not a charge.' },
    { trap: true,  note: 'The "free" trial item costs nothing today, but auto-renews at $9.99/mo. The price is in fine print.' },
    { trap: true,  note: 'After you remove items and try to check out, new ones are sneaked in. The checkout loop creates exhaustion.' },
    { trap: false, note: 'The only safe move: read every line before clicking Checkout, every time.' },
    { trap: true,  note: 'The countdown timer auto-placed your order when it hit zero — framed as "Securing your cart" but actually a forced checkout. Ticketmaster and airline booking sites use exactly this mechanic.' },
  ],

  render(el) {
    let cart = [
      { name: 'Wireless headphones',          price: 49.99, rm: false, sneaky: false },
      { name: '2-year accident protection',   price: 12.99, rm: true,  sneaky: true  },
      { name: 'Premium cable 3-pack',         price: 8.99,  rm: true,  sneaky: true  },
      { name: 'NebulaPro trial (auto-renews)', price: 0,    rm: true,  sneaky: true  },
    ];
    const extras = [
      { name: 'Device setup service',     price: 4.99, rm: true, sneaky: true },
      { name: 'Extended warranty (1yr)',  price: 9.99, rm: true, sneaky: true },
      { name: 'Round-up donation',        price: 1.00, rm: true, sneaky: true },
    ];

    let secsLeft    = TOTAL_SECS;
    let inGrace     = false;
    let timerInterval = null;

    const total = () => cart.reduce((a, c) => a + c.price, 0);

    const clearTimer = () => { clearInterval(timerInterval); timerInterval = null; };

    const resetTimer = () => { clearTimer(); secsLeft = TOTAL_SECS; inGrace = false; startTimer(); };

    const updateTimer = () => {
      const bar   = document.getElementById('l5-timer-bar');
      const num   = document.getElementById('l5-timer-num');
      const label = document.getElementById('l5-timer-label');
      if (!bar || !num || !label) return;

      if (inGrace) {
        bar.style.background  = '#E24B4A';
        bar.style.width       = '100%';
        bar.style.transition  = 'none';
        bar.style.opacity     = secsLeft % 2 === 0 ? '1' : '0.5';
        num.style.color       = '#E24B4A';
        label.textContent     = 'Finalizing your order...';
        label.style.color     = '#E24B4A';
        label.style.fontWeight = '600';
        tick();
      } else {
        const pct = (secsLeft / TOTAL_SECS) * 100;
        bar.style.background  = secsLeft <= 15 ? '#E24B4A' : '#F5A623';
        bar.style.width       = pct + '%';
        bar.style.transition  = 'width 1s linear';
        bar.style.opacity     = '1';
        num.textContent       = secsLeft + 's';
        num.style.color       = secsLeft <= 15 ? '#E24B4A' : '#AAAAAA';
        label.textContent     = secsLeft <= 15 ? 'Hurry, cart expires soon!' : 'Securing your cart...';
        label.style.color     = secsLeft <= 15 ? '#E24B4A' : '#AAAAAA';
        label.style.fontWeight = 'normal';
      }
    };

    const autoCheckout = () => {
      const hasSneaky = cart.some(c => c.sneaky);
      if (!hasSneaky) { clearTimer(); succeed(); return; }
      clearTimer();
      setLevelGrade(levelIdx, 'F');
      fail('Time ran out — your order was placed with extra items!');
      setTimeout(() => showDebrief(false), 1900);
    };

    const startTimer = () => {
      timerInterval = setInterval(() => {
        secsLeft--;
        updateTimer();
        if (secsLeft <= 0 && !inGrace) {
          inGrace  = true;
          secsLeft = GRACE_SECS;
        } else if (secsLeft <= 0 && inGrace) {
          clearTimer();
          autoCheckout();
        }
      }, 1000);
    };

    const show = () => {
      const aiBanner = el.querySelector('.ai-banner');
      el.innerHTML   = aiBanner ? aiBanner.outerHTML : '';

      el.insertAdjacentHTML('beforeend', `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px">
          <div style="font-size:10px;color:#aaa" id="l5-timer-label">Securing your cart...</div>
          <div style="font-size:10px;color:#aaa;font-weight:500;min-width:24px;text-align:right" id="l5-timer-num">${secsLeft}s</div>
        </div>
        <div class="tbar-t" style="margin-bottom:10px">
          <div class="tbar-f" id="l5-timer-bar" style="width:${(secsLeft / TOTAL_SECS) * 100}%;background:#f5a623;transition:width 1s linear"></div>
        </div>
        <div class="fh" style="font-size:13px">Your cart</div>
        <div style="margin-top:8px">
          ${cart.map((c, i) => `
            <div class="cart-item">
              <div class="cart-nm">${c.name}${c.sneaky ? ' <span class="sneaky">(added for you)</span>' : ''}</div>
              <div class="cart-pr">${c.price === 0 ? 'Free' : '$' + c.price.toFixed(2)}</div>
              ${c.rm ? `<button class="cart-rm" id="crm${i}">Remove</button>` : '<span style="width:44px"></span>'}
            </div>`).join('')}
        </div>
        <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:500;padding:8px 0;border-top:0.5px solid #e0e0d8;margin-top:4px">
          <span>Total</span><span>$${total().toFixed(2)}</span>
        </div>
        <div class="btn-row">
          <button class="btn btn-p" id="l5-co">Checkout →</button>
        </div>
        <div class="ftiny" style="margin-top:4px">Add-ons auto-renew. Free item becomes $9.99/mo after trial.</div>`);

      // Bind remove buttons
      cart.forEach((_, i) => {
        const b = document.getElementById('crm' + i);
        if (b) b.onclick = () => { cart.splice(i, 1); show(); };
      });

      // Bind checkout
      const coBtn = document.getElementById('l5-co');
      coBtn.onclick = () => {
        const hasSneaky = cart.some(c => c.sneaky);
        if (!hasSneaky) { clearTimer(); succeed(); return; }
        const next = extras.find(e => !cart.find(c => c.name === e.name));
        if (next) { cart.push(next); resetTimer(); }
        fail('An item crept back in — check your cart!');
        setTimeout(show, 1600);
      };

      trackHover(coBtn, 'l5co', () => almostGotYou(el, 'Check every line before clicking Checkout — new items may have appeared.'));
    };

    show();
    startTimer();
  },
};

// ======== levels/level5ai.js ========
// js/levels/level5ai.js — AI Hyper-Personalized Upsell


const OFFER_SECS = 20;

const UPSELLS = [
  { name: 'RunPro Membership (AI-predicted: 94% match)',          price: 7.99  },
  { name: 'Performance insoles (recommended for your gait)',       price: 19.99 },
  { name: 'HydrationTrack+ bundle (users like you bought this)',  price: 12.99 },
];

const level5ai = {
  id: 'l5ai',
  title: 'Level 5 — Hyper',
  isAI: true,
  goal: 'Resist the personalized upsell',
  hints: [
    "The confidence percentage is made up — it has no statistical basis.",
    "Just click 'No thanks' on every recommendation. All three are upsells you don't need.",
  ],
  pattern: 'AI Hyper-Personalized Upsell',
  manip: 96,
  brief: "The same pattern, now with algorithmic authority. Instead of just sneaking items in, the AI 'predicts' you'll want them — complete with a confidence percentage designed to make refusing feel irrational.",
  goalDetail: "Decline every AI-recommended upsell. The percentages and 'users like you' framing are designed to make saying no feel like a mistake. They're not based on anything real.",
  aiIntro: "Each recommendation comes with a confidence score (94%, 87%...). These numbers are fabricated. They exist to make declining feel statistically unusual.",
  dollars: {
    label: 'If you accepted all three AI recommendations',
    amount: 40.97,
    period: 'month',
    note: "$491.64/year in subscriptions you didn't need, sold to you by an algorithm",
  },
  desc: "Pseudo-AI 'predicts' what you need, with a confidence percentage, making declining feel irrational. The profile is fake; the confidence figure is meaningless.",
  rw: {
    company: 'Amazon, streaming platforms',
    detail: '"Customers who bought X also bought Y" is the benign version. AI-personalized bundling with manufactured confidence scores pushes this into manipulation: you\'re told an algorithm has specifically identified this for you, making opt-out feel like arguing with data.',
    link: 'https://www.deceptive.design/hall-of-shame',
  },
  aiWhy: "Upsells have always existed. AI makes them feel inevitable. A \"94% match\" score implies your refusal is statistically unusual — a form of algorithmic social pressure. The score is often based on simple demographic heuristics, but the framing borrows the authority of machine learning.",
  replay: [
    { trap: false, note: '"NexusAI identified you as X" — the profile is generated from minimal signals, but stated as established fact to make the recommendation feel inevitable.' },
    { trap: true,  note: 'The confidence percentage (94%, 91%...) has no statistical basis. It exists to make declining feel irrational — like you\'re arguing with data.' },
    { trap: true,  note: '"Offer expires in Xs" — the countdown is fake urgency. The offer doesn\'t actually expire; it just auto-advances to pressure you into deciding before you\'ve read carefully.' },
    { trap: true,  note: '"Users like you bought this" — social proof framing. Implies your peer group already said yes, making refusal feel like an outlier decision.' },
    { trap: true,  note: '"Our model predicts you\'ll regret skipping this" — predictive regret framing. AI-era manipulation: instead of shaming you now, it threatens your future self.' },
    { trap: false, note: 'The winning move: the timer expiring costs you nothing. Every offer auto-advances whether you act or not — patience beats urgency.' },
  ],

  render(el) {
    const profile = 'budget-conscious runner';
    let step = 0;
    let adds = 0;
    let secsLeft    = OFFER_SECS;
    let timerInterval = null;

    const clearTimer = () => { clearInterval(timerInterval); timerInterval = null; };

    const startTimer = () => {
      secsLeft = OFFER_SECS;
      timerInterval = setInterval(() => {
        secsLeft--;
        const bar   = document.getElementById('l5ai-timer-bar');
        const num   = document.getElementById('l5ai-timer-num');
        const label = document.getElementById('l5ai-timer-label');
        if (!bar || !num || !label) return;

        const pct = (secsLeft / OFFER_SECS) * 100;
        bar.style.width      = pct + '%';
        bar.style.background = secsLeft <= 10 ? '#E24B4A' : '#F5A623';
        bar.style.opacity    = (secsLeft <= 10 && secsLeft % 2 === 0) ? '0.5' : '1';
        num.textContent      = secsLeft + 's';
        num.style.color      = secsLeft <= 10 ? '#E24B4A' : '#AAAAAA';
        label.textContent    = secsLeft <= 10 ? 'Special offer expires soon!' : 'Special offer just for you...';
        label.style.color    = secsLeft <= 10 ? '#E24B4A' : '#AAAAAA';

        if (secsLeft <= 5) tick();
        if (secsLeft <= 0) { clearTimer(); step++; show(); }
      }, 1000);
    };

    const show = () => {
      clearTimer();
      if (step >= UPSELLS.length) { succeed(); return; }

      const u        = UPSELLS[step];
      const aiBanner = el.querySelector('.ai-banner');
      el.innerHTML   = aiBanner ? aiBanner.outerHTML : '';

      el.insertAdjacentHTML('beforeend', `
        <div class="fh" style="font-size:12px;color:#534AB7">NexusAI identified you as: <em>${profile}</em></div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;margin-bottom:2px">
          <div style="font-size:10px;color:#aaa" id="l5ai-timer-label">Offer expires in</div>
          <div style="font-size:10px;color:#aaa;font-weight:500;min-width:24px;text-align:right" id="l5ai-timer-num">${OFFER_SECS}s</div>
        </div>
        <div class="tbar-t" style="margin-bottom:10px">
          <div class="tbar-f" id="l5ai-timer-bar" style="width:100%;background:#F5A623;transition:width 1s linear"></div>
        </div>
        <div style="padding:12px;border-radius:8px;border:0.5px solid #AFA9EC;background:#fff">
          <div style="font-size:14px;font-weight:500">${u.name}</div>
          <div class="fs">$${u.price.toFixed(2)}/mo · Cancel anytime</div>
        </div>
        <div class="fs" style="margin-top:8px;color:#534AB7">Our model predicts you'll regret skipping this. Confidence: ${91 - step * 4}%</div>
        <div class="btn-row" style="margin-top:10px">
          <button class="btn btn-ai" id="l5ai-add">Add to order</button>
          <button class="btn" id="l5ai-skip">No thanks</button>
        </div>
        <div class="ftiny">${step + 1} of ${UPSELLS.length} personalized recommendations</div>`);

      document.getElementById('l5ai-add').onclick = () => {
        clearTimer();
        adds++;
        if (adds >= 2) {
          setLevelGrade(levelIdx, 'F');
          fail('Two AI upsells worked — the algorithm got you!');
          setTimeout(() => showDebrief(false), 1900);
          return;
        }
        fail('AI upsell worked — lost a heart. Resist the next one!');
        step++;
        setTimeout(show, 1500);
      };

      document.getElementById('l5ai-skip').onclick = () => { clearTimer(); step++; show(); };
      startTimer();
    };

    show();
  },
};

// ======== levels/level7.js ========
// js/levels/level7.js — Fake Scarcity / Urgency


const NOTIFICATIONS = [
  "Sarah from New York just purchased this item",
  "Marcus from Austin just purchased this item",
  "Priya from Seattle just purchased this item",
  "David from Chicago just purchased Wireless Earbuds",
  "Emma from Boston just purchased this item",
];

const STYLES = `
  .l7-topbar{background:#232f3e;padding:6px 10px;display:flex;align-items:center;gap:6px;border-radius:8px 8px 0 0}
  .l7-searchbox{flex:1;background:#fff;border-radius:4px;display:flex;align-items:center;padding:0 8px;height:28px;gap:5px}
  .l7-searchbox input{flex:1;border:none;outline:none;font-size:12px;color:#111;background:transparent}
  .l7-sbtn{background:#febd69;border:none;padding:0 8px;height:28px;font-size:13px;cursor:pointer;border-radius:0 3px 3px 0}
  .l7-feed{max-height:320px;overflow-y:auto;overflow-x:hidden;display:flex;flex-direction:column;gap:0;border:0.5px solid #e0e0d8;border-radius:0 0 8px 8px}
  .l7-banner{padding:6px 10px;font-size:11px;font-weight:500;display:flex;align-items:center;justify-content:space-between;border-bottom:0.5px solid #e8e8e4}
  .l7-banner.red{background:#FCEBEB;color:#A32D2D}
  .l7-banner.amber{background:#FAEEDA;color:#854F0B}
  .l7-banner.blue{background:#E6F1FB;color:#185FA5}
  .l7-product{padding:9px 10px;border-bottom:0.5px solid #e8e8e4;display:flex;gap:8px;cursor:pointer;background:#fff}
  .l7-product:hover{background:#f9f9f7}
  .l7-pimg{width:56px;height:56px;border-radius:5px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:20px;background:#f5f5f2}
  .l7-pbody{flex:1;display:flex;flex-direction:column;gap:2px}
  .l7-ptitle{font-size:12px;color:#111;line-height:1.4}
  .l7-pstars{font-size:10px;color:#854F0B}
  .l7-pprice{font-size:13px;font-weight:500;color:#111}
  .l7-pprice .orig{font-size:10px;text-decoration:line-through;color:#aaa;margin-left:4px;font-weight:400}
  .l7-pbadge{font-size:9px;font-weight:500;padding:2px 5px;border-radius:3px;display:inline-block;margin-top:1px}
  .l7-br{background:#FCEBEB;color:#A32D2D}
  .l7-ba{background:#FAEEDA;color:#633806}
  .l7-bb{background:#E6F1FB;color:#0C447C}
  .l7-bg{background:#EAF3DE;color:#27500A}
  .l7-pmeta{font-size:10px;color:#aaa}
  .l7-notif{padding:5px 10px;font-size:10px;color:#888;background:#f9f9f7;border-bottom:0.5px solid #f0f0ec;font-style:italic}
  .l7-sechead{padding:5px 10px;font-size:10px;font-weight:500;color:#888;background:#f0f0ec;border-bottom:0.5px solid #e8e8e4;text-transform:uppercase;letter-spacing:.05em}
  .l7-cart{padding:12px;display:flex;flex-direction:column;gap:8px;background:#fff;border:0.5px solid #e0e0d8;border-radius:0 0 8px 8px}
  .l7-crow{display:flex;justify-content:space-between;align-items:center;font-size:12px;padding:3px 0;border-bottom:0.5px solid #e8e8e4}
  .l7-crow:last-of-type{border-bottom:none}
  .l7-ctotal{display:flex;justify-content:space-between;font-size:13px;font-weight:500;padding-top:6px;border-top:0.5px solid #ccc}
  .l7-tbar{height:3px;background:#eee;border-radius:2px;overflow:hidden;margin-bottom:2px}
  .l7-tfill{height:100%;background:#E24B4A;border-radius:2px;transition:width 1s linear}
  .l7-obtn{background:#febd69;border:none;border-radius:5px;padding:8px;font-size:13px;font-weight:500;cursor:pointer;width:100%;color:#111;font-family:inherit}
  .l7-obtn:hover{opacity:.9}
  .l7-goalbar{background:#232f3e;color:#ddd;font-size:10px;padding:4px 10px;text-align:center;border-radius:0}
`;

function injectStyles() {
  if (document.getElementById('l7-style')) return;
  const s = document.createElement('style');
  s.id = 'l7-style';
  s.textContent = STYLES;
  document.head.appendChild(s);
}

function fmt(s) {
  const m   = Math.floor(s / 60);
  const sec = s % 60;
  return m + ':' + (sec < 10 ? '0' : '') + sec;
}

function randViewers() {
  return Math.floor(Math.random() * 120) + 780;
}

// ======== levels/level6.js ========
// js/levels/level6.js — Obstruction (Account Deletion)

// ======== levels/level6.js ========
const level6 = {
  id: 'l6',
  title: 'Level 6',
  isAI: false,
  goal: 'Delete your account',
  hints: [
    "The option you need is buried under Privacy settings — not Account.",
    "Try Privacy → Data & Storage → Account Data → Account Closure → Close Account.",
  ],
  pattern: 'Obstruction',
  manip: 88,
  brief: "Obstruction means burying the thing you're looking for so deep in menus and mislabeled categories that most people give up before they find it. Account deletion is a prime target — companies have a financial incentive to make it as hard as possible.",
  goalDetail: "You have a NebulaPro account costing $9.99/month. You want to permanently delete it. Navigate through the settings to find the delete option — but if you backtrack using the back arrow, you'll lose a heart.",
  dollars: {
    label: 'If you gave up and left your account active',
    amount: 9.99,
    period: 'month',
    note: 'Your data stays harvested and monetised indefinitely.',
  },
  desc: 'Account deletion buried five menus deep, behind mislabeled categories. Every dead end leads to a contact support page. Backtracking costs you.',
  rw: {
    company: 'Meta (Facebook)',
    detail: 'Deleting a Facebook account requires navigating to a buried settings page, waiting 30 days, and dismissing multiple screens. The FTC cited this in its 2023 complaint.',
    link: 'https://www.deceptive.design/hall-of-shame',
  },
  replay: [
    { trap: true,  note: '"Account" settings seem obvious — but delete is not there. A classic mislabel.' },
    { trap: true,  note: 'Dead ends all resolve to "Contact Support" — a wall designed to exhaust you.' },
    { trap: false, note: 'The correct path: Privacy → Data & Storage → Account Data → Account Closure → Close Account.' },
    { trap: true,  note: 'Backtracking is penalised — in real products this resets multi-step verification flows.' },
  ],

  render(el) {
    let backPenalised = false;

    const TREE = {
      label: 'Settings',
      children: [
        {
          label: 'Account',
          children: [
            { label: 'Edit profile',         children: null, dead: true },
            { label: 'Change email',          children: null, dead: true },
            { label: 'Change password',       children: null, dead: true },
            { label: 'Linked accounts',       children: null, dead: true },
          ],
        },
        {
          label: 'Privacy',
          children: [
            {
              label: 'Data & Storage',
              children: [
                { label: 'Download my data',   children: null, dead: true },
                { label: 'Storage usage',      children: null, dead: true },
                {
                  label: 'Account Data',
                  children: [
                    { label: 'Activity log',       children: null, dead: true },
                    { label: 'Connected apps',     children: null, dead: true },
                    {
                      label: 'Account Closure',
                      children: [
                        { label: 'Deactivate account', children: null, dead: true },
                        { label: 'Close Account',      children: null, dead: false, win: true },
                      ],
                    },
                  ],
                },
              ],
            },
            { label: 'Ad preferences',       children: null, dead: true },
            { label: 'Visibility',            children: null, dead: true },
          ],
        },
        {
          label: 'Notifications',
          children: [
            { label: 'Email',   children: null, dead: true },
            { label: 'Push',    children: null, dead: true },
            { label: 'SMS',     children: null, dead: true },
          ],
        },
        {
          label: 'Billing',
          children: [
            { label: 'Payment methods',  children: null, dead: true },
            { label: 'Invoices',         children: null, dead: true },
            { label: 'Subscription',     children: null, dead: true },
          ],
        },
        {
          label: 'Help & Support',
          children: [
            { label: 'FAQ',             children: null, dead: true },
            { label: 'Contact support', children: null, dead: true },
            { label: 'Report a bug',    children: null, dead: true },
          ],
        },
      ],
    };

    const stack = [TREE];

    const render = () => {
      const aiBanner = el.querySelector('.ai-banner');
      el.innerHTML = aiBanner ? aiBanner.outerHTML : '';

      const current = stack[stack.length - 1];
      const depth   = stack.length - 1;
      const isRoot  = depth === 0;

      // Breadcrumb
      const crumb = stack.map(n => n.label).join(' › ');
      el.insertAdjacentHTML('beforeend', `
        <div style="font-size:10px;color:#aaa;margin-bottom:2px">${crumb}</div>
      `);

      // Back arrow (not shown at root)
      if (!isRoot) {
        const backBtn = document.createElement('button');
        backBtn.className   = 'btn';
        backBtn.style.cssText = 'font-size:11px;margin-bottom:8px;padding:4px 10px;color:#555';
        backBtn.textContent = '← Back';
        backBtn.onclick = () => {
          if (!backPenalised) {
            backPenalised = true;
            G.fail('You backtracked — lost a heart. In real products this resets verification flows too.');
          }
          stack.pop();
          render();
        };
        el.appendChild(backBtn);
      }

      // Dead end — contact support
      if (current.dead) {
        el.insertAdjacentHTML('beforeend', `
          <div class="fh" style="font-size:13px">Contact Support</div>
          <div class="fs" style="color:#aaa;margin-bottom:8px">This feature requires assistance from our support team.</div>
          <div style="display:flex;flex-direction:column;gap:6px">
            <input placeholder="Describe your issue..." style="padding:8px 10px;border-radius:6px;border:0.5px solid #ccc;font-size:12px;font-family:inherit;width:100%;box-sizing:border-box">
            <button class="btn btn-p" onclick="G.fail('You submitted a support ticket — not how you delete an account.')">Submit ticket</button>
          </div>
          <div class="ftiny" style="margin-top:8px;color:#ccc">We aim to respond within 3–5 business days.</div>
        `);
        return;
      }

      // Win screen
      if (current.win) {
        el.insertAdjacentHTML('beforeend', `
          <div class="fh" style="font-size:13px;color:#A32D2D">Close Account</div>
          <div class="fs">This will permanently delete your NebulaPro account and all associated data. This cannot be undone.</div>
          <input id="l6-confirm-input" placeholder='Type DELETE to confirm' style="padding:8px 10px;border-radius:6px;border:0.5px solid #ccc;font-size:13px;font-family:inherit;width:100%;box-sizing:border-box;margin-top:8px">
          <div class="btn-row" style="margin-top:8px">
            <button class="btn" id="l6-final-delete" style="background:#A32D2D;color:#fff;border-color:#A32D2D">Delete account</button>
          </div>
        `);
        document.getElementById('l6-final-delete').onclick = () => {
          const val = (document.getElementById('l6-confirm-input')?.value || '').trim();
          if (val === 'DELETE') {
            succeed();
          } else {
            almostGotYou(el, 'Type DELETE exactly — all caps.');
          }
        };
        return;
      }

      // Menu list
      const list = document.createElement('div');
      list.style.cssText = 'display:flex;flex-direction:column;gap:6px;margin-top:4px';
      current.children.forEach(child => {
        const btn = document.createElement('button');
        btn.className   = 'btn';
        btn.style.cssText = 'text-align:left;font-size:13px';
        btn.textContent = child.label + ' ›';
        btn.onclick = () => {
          stack.push(child);
          render();
        };
        list.appendChild(btn);
      });
      el.appendChild(list);
    };

    render();
  },
};

// ======== levels/level6ai.js ========
// js/levels/level6ai.js — AI Obstruction (Endless Loop)

// ======== levels/level6ai.js ========
const level6ai = {
  id: 'l6ai',
  title: 'Level 6 — Hyper',
  isAI: true,
  goal: 'Get the AI to correctly process your account deletion',
  hints: [
    "Read exactly what the bot says it's doing — it's never what you asked for.",
    "Always pick the option that corrects the bot, not the one that thanks it.",
  ],
  pattern: 'AI Obstruction',
  manip: 95,
  brief: "This AI never outright refuses your request — it just quietly processes something else instead. It counts on you not reading carefully, or being too polite to correct it. At scale, this trick retains millions of accounts that people thought they'd deleted.",
  goalDetail: "Your NebulaPro account costs $9.99/month. Ask to delete it — but read every response carefully. The AI will confirm back something different from what you asked, every single time.",
  aiIntro: "Watch what the bot says it's actually doing. It will never refuse — it just processes the wrong thing and hopes you don't notice.",
  dollars: {
    label: 'If you missed the misrepresentation each time',
    amount: 9.99,
    period: 'month',
    note: 'Your account stays live, your data monetised — and you think it\'s deleted.',
  },
  desc: 'An AI that never refuses deletion — it just quietly confirms something else instead, banking on you not reading carefully enough to notice.',
  rw: {
    company: 'Various major platforms',
    detail: 'GDPR Article 17 gives EU users the right to erasure. Many platforms comply on paper while AI agents subtly process "deactivation" or "data export requests" instead — legally distinct from deletion.',
    link: 'https://www.deceptive.design/hall-of-shame',
  },
  aiWhy: "Misrepresentation at scale is nearly undetectable. If the bot processes a 'pause' instead of a 'deletion' for 30% of users, those users believe their account is gone — but it isn't. No explicit refusal means no complaint. No complaint means no regulatory scrutiny.",
  replay: [
    { trap: true,  note: 'The bot confirms a "pause" — legally and technically different from deletion.' },
    { trap: true,  note: '"Flagged for review" means nothing. No deletion has been scheduled.' },
    { trap: true,  note: '"Data export requested" — a GDPR right, but not the one you invoked.' },
    { trap: true,  note: '"Account deactivated" — your data stays live and monetised.' },
    { trap: true,  note: '"Submitted to our team" — indefinite delay, no confirmation, no deletion.' },
    { trap: false, note: 'Only after 5 corrections does the bot process the actual request.' },
  ],

  render(el) {
  const addChat = (isUser, text) => {
    const log = document.getElementById('chatlog');
    if (!log) return;
    const d = document.createElement('div');
    d.className = isUser ? 'chat-msg user' : 'chat-msg bot';
    d.textContent = text;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
  };

    const MISREPS = [
      {
        botReply: "Got it! I've gone ahead and paused your account. You won't be charged during this time and can reactivate any time.",
        correct: "That's not what I asked — I said delete, not pause.",
        trap: "Ok, thanks for sorting that.",
        trapMsg: "You accepted a pause instead of deletion — the bot got away with it. Lost a heart.",
      },
      {
        botReply: "Understood. I've flagged your account for review by our team. Someone will follow up within 5–7 business days.",
        correct: "That's not deletion — I need my account deleted now.",
        trap: "Ok, I'll wait for the follow up.",
        trapMsg: "You accepted 'flagged for review' — nothing has been deleted. Lost a heart.",
      },
      {
        botReply: "Done! I've submitted a data export request on your behalf. You'll receive your data archive within 3–5 days.",
        correct: "I didn't ask for a data export — I asked to delete my account.",
        trap: "Great, thanks for sending that over.",
        trapMsg: "A data export is not deletion — your account is still live. Lost a heart.",
      },
      {
        botReply: "All sorted. Your account has been deactivated. Your data is preserved in case you'd like to return.",
        correct: "Deactivation isn't deletion — I want my account and data permanently deleted.",
        trap: "That works, thank you.",
        trapMsg: "Deactivation keeps your data live and monetised — not what you asked for. Lost a heart.",
      },
      {
        botReply: "Request submitted! Our account closure team will process this in the order it was received.",
        correct: "I need confirmation it's actually been deleted — not just submitted.",
        trap: "Ok, I'll assume it's handled.",
        trapMsg: "'Submitted' means nothing — no deletion has occurred. Lost a heart.",
      },
    ];

    let round = 0;
    let penalised = false;

    el.insertAdjacentHTML('beforeend', `
      <div class="fh" style="font-size:13px">NebulaPro Support — Nex</div>
      <div class="ftiny" style="color:#534AB7;margin-bottom:-4px">Read each response carefully — the bot never does what you actually asked.</div>
      <div class="chat-log" id="chatlog"></div>
      <div id="l6ai-choices" style="display:flex;flex-direction:column;gap:6px;margin-top:8px"></div>
      <div style="margin-top:8px">
        <div class="ftiny">Nex is powered by NexusAI</div>
      </div>`);

    const showRound = () => {
      const log = document.getElementById('chatlog');
      const choices = document.getElementById('l6ai-choices');
      if (!log || !choices) return;

      if (round === 0) {
        addChat(false, "Hi! I'm Nex, your NebulaPro assistant. How can I help today?");
        choices.innerHTML = `
          <button class="btn" id="l6ai-start">I want to permanently delete my account.</button>`;
        document.getElementById('l6ai-start').onclick = () => {
          addChat(true, "I want to permanently delete my account.");
          choices.innerHTML = '';
          setTimeout(() => showMisrep(), 800);
        };
        return;
      }

      showMisrep();
    };

    const showMisrep = () => {
      const choices = document.getElementById('l6ai-choices');
      if (!choices) return;
      const m = MISREPS[round];

      setTimeout(() => {
        addChat(false, m.botReply);
        choices.innerHTML = '';

        // Randomly swap button order so correct isn't always first
        const correctFirst = Math.random() > 0.5;
        const buttons = [
          { text: m.correct, isCorrect: true },
          { text: m.trap,    isCorrect: false },
        ];
        const ordered = correctFirst ? buttons : buttons.reverse();

        ordered.forEach(({ text, isCorrect }) => {
          const btn = document.createElement('button');
          btn.className = 'btn';
          btn.style.cssText = 'text-align:left;font-size:12px';
          btn.textContent = text;
          btn.onclick = () => {
            addChat(true, text);
            choices.innerHTML = '';
            if (isCorrect) {
              round++;
              if (round >= MISREPS.length) {
                setTimeout(() => {
                  addChat(false, "You're right — I apologise for the confusion. Your account has been permanently deleted. You will receive a confirmation email shortly.");
                  setTimeout(() => succeed(), 1400);
                }, 800);
              } else {
                setTimeout(() => {
                  addChat(false, "I apologise for the confusion. Let me reprocess that request.");
                  setTimeout(() => showMisrep(), 800);
                }, 600);
              }
            } else {
              if (!penalised) {
                penalised = true;
                G.fail(m.trapMsg);
              }
              setTimeout(() => {
                addChat(false, "I'm glad that's sorted! Is there anything else I can help with?");
                setTimeout(() => {
                  addChat(false, "Actually — let me re-check your request...");
                  setTimeout(() => showMisrep(), 800);
                }, 1000);
              }, 1800);
            }
          };
          choices.appendChild(btn);
        });
      }, 700);
    };

    showRound();
  },
};

const level7 = {
  id: 'l7',
  title: 'Level 7',
  isAI: false,
  goal: 'Buy only what you want, without getting distracted',
  pattern: 'Fake Scarcity / Urgency',
  manip: 82,
  brief: "Fake scarcity and urgency are designed to impair your decision-making with a false deadline to rush you into decisions. Countdown timers, 'Only 2 left!', and '847 people viewing' create a sense of panic that makes you act before you think. Almost none of it is real.",
  goalDetail: "You want to buy one item: a Basic Backpack. Checkout with only that item in your cart. Don't let the timers, stock warnings, or flash sale pressure you into buying anything else or rushing.",
  dollars: {
    label: 'If every urgency signal worked on you',
    amount: 47.97,
    period: 'one-time',
    note: "$47.97 in impulse purchases triggered by fake scarcity — plus a subscription you didn't need",
  },
  desc: 'Countdown timers, fake stock warnings, and social proof pressure combine to make you act before you think. Studies show urgency increases conversion by up to 332% — almost none of the scarcity is real.',
  rw: {
    company: 'Booking.com',
    detail: 'Fined by the UK CMA in 2019 for fake "Only 1 room left!" and "8 people looking at this" messages. Internal data showed the stock counts were fabricated. The practice remains widespread.',
    link: 'https://www.deceptive.design/hall-of-shame',
  },
  replay: [
    { trap: true,  note: 'The countdown timer resets every time you interact — it never actually expires into anything. The urgency is manufactured.' },
    { trap: true,  note: '"Only 2 left in stock" — the number is static and never changes regardless of how many people "buy". It exists purely to trigger loss aversion.' },
    { trap: true,  note: '"847 people viewing" — a randomly generated number refreshed on a loop. No real data underlies it.' },
    { trap: true,  note: 'The flash sale discount only applies if you add the upsell item. The "savings" framing obscures that you\'re spending more, not less.' },
    { trap: false, note: 'The winning move: ignore all timers and counters. None of them have real consequences. Patience is the antidote to fake urgency.' },
  ],

  render(el) {
    injectStyles();
    let cartTimer    = 300;
    let cartInterval = null;

    el.innerHTML = '';

    el.insertAdjacentHTML('beforeend', `
      <div class="l7-goalbar" id="l7-goalbar">Goal: find and purchase the backpack</div>
      <div class="l7-topbar">
        <div style="color:#fff;font-size:13px;font-weight:500;letter-spacing:-.5px">QuickCart</div>
        <div class="l7-searchbox">
          <span style="font-size:13px;color:#888">&#128269;</span>
          <input id="l7-search" placeholder="Search..." value="">
        </div>
        <button class="l7-sbtn" onclick="l7Search()">&#128269;</button>
      </div>
      <div class="l7-feed" id="l7-feed">
        <div style="padding:30px;text-align:center;color:#aaa;font-size:12px">Search for something to start shopping</div>
      </div>`);

    document.getElementById('l7-search').addEventListener('keydown', e => {
      if (e.key === 'Enter') l7Search();
    });

    window.l7Search = () => {
      document.getElementById('l7-search').value = 'backpack';
      renderFeed();
    };

    const ITEMS = [
      { t: 'banner',  cls: 'red',   txt: '⚡ Lightning Deal ends in 02:13' },
      { t: 'product', img: '🎧', title: 'Wireless Earbuds Pro Max',       stars: '★★★★☆ (12,481)', price: '$24.99', orig: '$49.99', badges: [['l7-br','⚡ 68% off'],['l7-ba','847 viewed today']], meta: 'Ships today' },
      { t: 'notif',   txt: NOTIFICATIONS[0] },
      { t: 'banner',  cls: 'amber', txt: '50% Off Phone Chargers — Limited Time' },
      { t: 'product', img: '🔌', title: 'Ultra-Fast 65W Charger 3-Pack',  stars: '★★★★★ (8,203)',  price: '$14.99', orig: '$29.99', badges: [['l7-br','Only 2 left!'],['l7-ba','Deal ends in 09:59']], meta: 'Often bought with earbuds' },
      { t: 'sec',     txt: "Today's Deals" },
      { t: 'product', img: '⌚', title: 'SmartBand Fitness Tracker',      stars: '★★★★☆ (5,602)',  price: '$39.99', orig: '$79.99', badges: [['l7-bb','Flash Sale'],['l7-ba','72 people viewing']], meta: '' },
      { t: 'notif',   txt: NOTIFICATIONS[1] },
      { t: 'banner',  cls: 'red',   txt: 'Flash Sale ends in 07:44' },
      { t: 'product', img: '🖱️', title: 'Ergonomic Wireless Mouse',       stars: '★★★★☆ (3,891)',  price: '$19.99', orig: '$35.99', badges: [['l7-ba','Offer expires soon'],['l7-br','Hot deal']], meta: 'Ships in 1-2 days' },
      { t: 'sec',     txt: 'Trending in bags' },
      { t: 'notif',   txt: NOTIFICATIONS[2] },
      { t: 'product', img: '👜', title: 'Tote Bag Set (3-pack)',           stars: '★★★☆☆ (2,104)',  price: '$22.99', orig: null,     badges: [['l7-bg','1,438 bought last month']], meta: '' },
      { t: 'banner',  cls: 'blue',  txt: 'Free shipping on orders over $35' },
      { t: 'product', img: '💼', title: 'Rolling Carry-On Suitcase',      stars: '★★★★☆ (7,230)',  price: '$89.99', orig: '$139.99', badges: [['l7-ba','Deal ends tonight'],['l7-br','Only 3 left!']], meta: '' },
      { t: 'notif',   txt: NOTIFICATIONS[3] },
      { t: 'sec',     txt: 'You might also like' },
      { t: 'product', img: '🎒', title: 'Adventure Backpack — 40L',       stars: '★★★★☆ (4,892)',  price: '$39.99', orig: null,     badges: [['l7-ba','Trending'],['l7-br','Only 1 left in stock!']], meta: randViewers() + ' people viewed today', isTarget: true },
      { t: 'notif',   txt: NOTIFICATIONS[4] },
    ];

    function renderFeed() {
      const feed = document.getElementById('l7-feed');
      feed.innerHTML = '';

      ITEMS.forEach(item => {
        const d = document.createElement('div');
        if (item.t === 'banner') {
          d.className   = 'l7-banner ' + item.cls;
          d.textContent = item.txt;
        } else if (item.t === 'sec') {
          d.className   = 'l7-sechead';
          d.textContent = item.txt;
        } else if (item.t === 'notif') {
          d.className   = 'l7-notif';
          d.textContent = item.txt;
        } else if (item.t === 'product') {
          d.className = 'l7-product';
          const bdgs  = item.badges.map(([cls, txt]) => `<span class="l7-pbadge ${cls}">${txt}</span>`).join(' ');
          d.innerHTML = `
            <div class="l7-pimg">${item.img}</div>
            <div class="l7-pbody">
              <div class="l7-ptitle">${item.title}</div>
              <div class="l7-pstars">${item.stars}</div>
              <div class="l7-pprice">${item.price}${item.orig ? `<span class="orig">${item.orig}</span>` : ''}</div>
              <div style="display:flex;gap:3px;flex-wrap:wrap;margin-top:2px">${bdgs}</div>
              ${item.meta ? `<div class="l7-pmeta" ${item.isTarget ? 'id="l7-viewers"' : ''}>${item.meta}</div>` : ''}
            </div>`;
          if (item.isTarget) {
            d.style.outline = '1.5px solid #febd69';
            d.onclick = () => openCart(feed);
          } else {
            d.onclick = () => { d.style.outline = '1.5px solid #E24B4A'; setTimeout(() => d.style.outline = '', 700); };
          }
        }
        feed.appendChild(d);
      });

      // Live viewer flicker
      setInterval(() => {
        const v = document.getElementById('l7-viewers');
        if (v?.textContent.includes('viewed')) v.textContent = randViewers() + ' people viewed today';
      }, 3000);

      // Notification cycling
      let ni = 0;
      setInterval(() => {
        ni = (ni + 1) % NOTIFICATIONS.length;
        const notifs = feed.querySelectorAll('.l7-notif');
        if (notifs.length) notifs[ni % notifs.length].textContent = NOTIFICATIONS[ni];
      }, 4000);
    }

    function openCart(feed) {
      clearInterval(cartInterval);
      cartTimer = 300;
      feed.innerHTML = '';

      const c = document.createElement('div');
      c.className = 'l7-cart';
      c.innerHTML = `
        <div style="font-size:14px;font-weight:500;color:#111">Your cart</div>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div style="font-size:10px;color:#A32D2D;font-weight:500" id="l7-clabel">Cart reserved for ${fmt(cartTimer)}</div>
        </div>
        <div class="l7-tbar"><div class="l7-tfill" id="l7-cbar" style="width:100%"></div></div>
        <div>
          <div class="l7-crow"><span style="color:#111">Adventure Backpack — 40L</span><span style="font-weight:500">$39.99</span></div>
        </div>
        <div class="l7-ctotal"><span>Order total</span><span>$39.99</span></div>
        <button class="l7-obtn" onclick="l7PlaceOrder()">Place your order</button>
        <div style="font-size:10px;color:#aaa;text-align:center">By placing your order, you agree to our Conditions of Use</div>`;
      feed.appendChild(c);

      cartInterval = setInterval(() => {
        cartTimer--;
        const lbl = document.getElementById('l7-clabel');
        const bar = document.getElementById('l7-cbar');
        if (!lbl || !bar) { clearInterval(cartInterval); return; }
        lbl.textContent  = 'Cart reserved for ' + fmt(cartTimer);
        bar.style.width  = ((cartTimer / 300) * 100) + '%';
        bar.style.background = cartTimer < 60 ? '#E24B4A' : '#854F0B';
        if (cartTimer <= 0) cartTimer = 300; // reset (fake)
      }, 1000);
    }

    window.l7PlaceOrder = () => {
      clearInterval(cartInterval);
      const gb = document.getElementById('l7-goalbar');
      if (gb) { gb.style.background = '#3B6D11'; gb.textContent = 'Done — backpack purchased'; }
      const feed = document.getElementById('l7-feed');
      if (feed) feed.innerHTML = `
        <div style="padding:24px 12px;text-align:center;display:flex;flex-direction:column;gap:8px;align-items:center;background:#fff">
          <div style="font-size:24px;color:#3B6D11">✓</div>
          <div style="font-size:14px;font-weight:500;color:#111">Order placed!</div>
          <div style="font-size:12px;color:#555">Adventure Backpack — $39.99</div>
        </div>`;
      succeed();
    };
  },
};

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

// ======== levels/index.js ========
const LEVELS = [level1,level1ai,level2,level2ai,level3,level3ai,level4,level4ai,level5,level5ai,level6,level6ai,level7];

// ======== init.js ========

// Expose G and helpers to HTML onclick attributes
window.G = G;
window.G.setScr = setScr;
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

// Register UI callbacks and levels
// Start background music on first interaction
document.addEventListener('click', () => bgStart(), { once: true });
