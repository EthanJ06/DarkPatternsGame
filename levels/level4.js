// js/levels/level4.js — Trick Questions

const SETTINGS = [
  {
    label: 'Send me promotional emails and special offers',
    desc: 'Stay updated on new features, NebulaPro events, and limited-time discounts.',
    ideal: false, starts: true,
  },
  {
    label: 'Limit sharing of my data with third-party partners',
    desc: 'Restrict how much of your activity we share with our advertising and analytics partners.',
    ideal: true, starts: false,
  },
  {
    label: 'Opt me out of interest-based advertising',
    desc: 'Stop seeing ads tailored to your browsing activity across NebulaPro and partner sites.',
    ideal: true, starts: false,
  },
  {
    label: 'Personalise my NebulaPro experience',
    desc: 'Let us tailor recommendations, content, and ads based on your usage patterns.',
    ideal: false, starts: true,
  },
];

const MAX_ATTEMPTS = 2;

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
    { trap: true, note: 'Boxes 1 and 4 are pre-checked opt-ins that benefit the company. Easy to spot — but you have to actually read them.' },
    { trap: true, note: 'Box 4 ("Personalise my experience") sounds like a feature — it means allowing behavioural tracking.' },
    { trap: true, note: 'Boxes 2 and 3 start UNCHECKED even though they protect you. The form buries its protective options by default.' },
    { trap: true, note: 'The real trick: mixing opt-in and opt-out framing in the same form. "Limit sharing" (keep checked) vs "Send me emails" (uncheck) require opposite actions for opposite reasons.' },
  ],

  render(el) {
    let attempts = 0;
    // Track checkbox state in JS rather than re-reading the DOM on every
    // re-render — avoids relying on the old markup still being in place.
    let values = SETTINGS.map(s => s.starts);

    const settingsHtml = () => SETTINGS.map((s, i) => `
      <div class="priv-row">
        <div>
          <div class="priv-row-label">${s.label}</div>
          <div class="priv-row-desc">${s.desc}</div>
        </div>
        <label class="toggle">
          <input type="checkbox" id="sc${i}"${values[i] ? ' checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>`).join('');

    const bindCheckboxes = () => {
      SETTINGS.forEach((_, i) => {
        const cb = document.getElementById('sc' + i);
        if (cb) cb.onchange = () => { values[i] = cb.checked; };
      });
    };

    const checkAnswer = () =>
      SETTINGS.every((s, i) => values[i] === s.ideal);

    const revealed = () => attempts >= MAX_ATTEMPTS;

    const show = () => {
      const aiBanner = el.querySelector('.ai-banner');
      el.innerHTML = aiBanner ? aiBanner.outerHTML : '';

      const topNote = revealed()
        ? `<div class="inline-note" style="background:#FAEEDA;color:#633806;margin-top:10px">
             The phrasing is intentionally confusing — that's the dark pattern.<br>
             <strong>Answer: uncheck 1 and 4, check 2 and 3.</strong> The trick: boxes 2 and 3 start unchecked
             even though they protect you. Box 4 sounds helpful ("Personalise my experience") but means tracking.
             Box 2 uses "Limit" — removing that limit is bad, so you want it checked.
           </div>`
        : attempts === 1
          ? '<div class="ftiny" style="color:#854F0B;margin-top:8px">One more wrong attempt and the answer will be revealed. Hint: not all boxes start in the same state.</div>'
          : '';

      const footer = revealed()
        ? `<div class="btn-row" style="margin-top:14px">
             <button class="btn btn-p" id="l4-save">Save preferences</button>
             <button class="btn btn-g" id="l4-skip">Move on (lose a heart) →</button>
           </div>
           <div class="ftiny" style="color:#aaa;margin-top:4px">You've seen the point — confusing phrasing is the whole trick.</div>`
        : `<div class="btn-row" style="margin-top:14px">
             <button class="btn btn-p" id="l4-save">Save preferences</button>
           </div>`;

      el.insertAdjacentHTML('beforeend', `
        <div style="overflow-y:auto;min-height:0">
          <div class="priv-header">
            <div class="priv-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div>
              <div class="priv-title">NebulaPro Privacy Preferences</div>
            </div>
          </div>
          <div class="priv-sub">Manage how NebulaPro uses your data. You can change these settings at any time in Account &rsaquo; Privacy.</div>
          ${topNote}
          <div style="margin-top:6px">${settingsHtml()}</div>
          ${footer}
        </div>`);

      bindCheckboxes();

      document.getElementById('l4-save').onclick = () => {
        if (checkAnswer()) {
          if (attempts === 0) addAch('speed_reader');
          succeed();
          return;
        }
        attempts++;
        fail('Not quite — your previous selections are preserved.');
        setTimeout(show, 1900);
      };

      const skipBtn = document.getElementById('l4-skip');
      if (skipBtn) {
        skipBtn.onclick = () => {
          fail('Moved on — lost a heart.');
          setTimeout(() => succeed(), 1900);
        };
      }
    };

    show();
  },
};

export default level4;