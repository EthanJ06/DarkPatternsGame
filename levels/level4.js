// js/levels/level4.js — Trick Questions

const SETTINGS = [
  { label: 'Send me promotional emails and special offers', ideal: false, starts: true },
  { label: 'Limit sharing of my data with third-party partners', ideal: true, starts: false },
  { label: 'Opt me out of interest-based advertising', ideal: true, starts: false },
  { label: 'Personalise my NebulaPro experience', ideal: false, starts: true },
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
    { trap: true, note: 'Boxes 1 and 4 are pre-checked opt-ins that benefit the company. Easy to spot — but you have to actually read them.' },
    { trap: true, note: 'Box 4 ("Personalise my experience") sounds like a feature — it means allowing behavioural tracking.' },
    { trap: true, note: 'Boxes 2 and 3 start UNCHECKED even though they protect you. The form buries its protective options by default.' },
    { trap: true, note: 'The real trick: mixing opt-in and opt-out framing in the same form. "Limit sharing" (keep checked) vs "Send me emails" (uncheck) require opposite actions for opposite reasons.' },
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
      el.innerHTML = aiBanner ? aiBanner.outerHTML : '';

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

export default level4;