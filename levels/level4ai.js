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
    { trap: true, note: 'Each variant uses a different grammatical structure to describe the same choices.' },
    { trap: true, note: 'Timer + reshuffling = double pressure. Your mental model of the form resets every round.' },
    { trap: false, note: 'The winning move: read each checkbox independently and ask "what does checking this DO?" before saving.' },
  ],

  render(el) {
    let variant = 0;
    let attempts = 0;

    const show = () => {
      const aiBanner = el.querySelector('.ai-banner');
      el.innerHTML = aiBanner ? aiBanner.outerHTML : '';

      const v = VARIANTS[variant % VARIANTS.length];

      const contextNote = `<div class="fs" style="color:#534AB7;margin-bottom:6px">The AI has reshuffled the form (variant ${variant + 1}). <em>One option always opts you out — find it.</em></div>`;
      const skipNote = attempts >= 2
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
        const ok = cb0 && cb1 && cb2 && !cb0.checked && !cb1.checked && cb2.checked;

        if (ok) { succeed(); return; }

        if (attempts >= 3) {
          fail('The dark pattern wins this round.');
          setTimeout(() => {
            const aiBanner2 = el.querySelector('.ai-banner');
            el.innerHTML = aiBanner2 ? aiBanner2.outerHTML : '';
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

export default level4ai;