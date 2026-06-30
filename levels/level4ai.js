// js/levels/level4ai.js — AI A/B Gaslighting

// Each variant has 3 options. Index 2 is always the genuine opt-out.
const VARIANTS = [
  {
    options: [
      { label: 'Share my data with partners', trap: true, checked: true },
      { label: 'Enable personalisation', trap: true, checked: true },
      { label: 'Opt out of all data collection', trap: false, checked: false },
    ],
  },
  {
    options: [
      { label: 'Do NOT disable partner data sharing', trap: true, checked: true },
      { label: 'Personalisation: off', trap: true, checked: false },
      { label: 'Global privacy control: on', trap: false, checked: false },
    ],
  },
  {
    options: [
      { label: 'I consent to data sharing', trap: true, checked: true },
      { label: 'Limit ad personalisation', trap: true, checked: false },
      { label: 'Opt out of tracking', trap: false, checked: false },
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
  goalDetail: "Three rounds, one shot each — the form relabels itself every round. Get at least 2 of 3 right to clear the level.",
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
    { trap: true, note: 'Each variant uses a different grammatical structure to describe the same choices.' },
    { trap: true, note: 'Timer + reshuffling = double pressure. Your mental model of the form resets every round.' },
    { trap: false, note: 'The winning move: read each checkbox independently and ask "what does checking this DO?" before saving.' },
  ],

  render(el) {
    let round = 0;
    let wins = 0;

    const finish = () => {
      if (wins < 2) setLevelGrade(levelIdx, 'F');
      succeed();
    };

    const show = () => {
      const aiBanner = el.querySelector('.ai-banner');
      el.innerHTML = aiBanner ? aiBanner.outerHTML : '';

      const v = VARIANTS[round];

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
          <div style="display:flex;align-items:center;justify-content:space-between;margin:2px 0 8px">
            <span style="font-size:12px;color:#888">Round ${round + 1} of ${VARIANTS.length}</span>
            <div style="display:flex;gap:5px">
              ${VARIANTS.map((_, i) => `<div style="width:20px;height:4px;border-radius:2px;background:${i < round ? '#534AB7' : i === round ? '#9b93f0' : '#ddd'}"></div>`).join('')}
            </div>
          </div>
          <div class="inline-note" style="background:#EEEDFE;color:#26215C">
            NexusAI has re-optimised this form (variant ${round + 1}). <em>One option always opts you out — find it. One shot per round.</em>
          </div>
          <div style="margin-top:6px">
            ${v.options.map((o, i) => `
              <div class="priv-row">
                <div class="priv-row-label">${o.label}</div>
                <label class="toggle">
                  <input type="checkbox" id="ac${i}"${o.checked ? ' checked' : ''}>
                  <span class="slider"></span>
                </label>
              </div>`).join('')}
          </div>
          <div class="btn-row" style="margin-top:14px">
            <button class="btn btn-p" id="l4a-save">Save</button>
          </div>
          <div class="ftiny" style="color:#aaa;margin-top:4px">Need 2 of 3 rounds right to clear the level. Only one option protects your privacy — the others look plausible but don't.</div>
        </div>`);

      document.getElementById('l4a-save').onclick = () => {
        const cb0 = document.getElementById('ac0');
        const cb1 = document.getElementById('ac1');
        const cb2 = document.getElementById('ac2');
        const ok = cb0 && cb1 && cb2 && !cb0.checked && !cb1.checked && cb2.checked;

        if (ok) wins++;
        else fail("That wasn't the real opt-out — lost a heart.");

        round++;
        if (round >= VARIANTS.length) {
          if (ok) setTimeout(finish, 1200);
          else setTimeout(finish, 1900);
        } else {
          setTimeout(show, ok ? 600 : 1900);
        }
      };
    };

    show();
  },
};

export default level4ai;