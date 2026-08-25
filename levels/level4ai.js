// js/levels/level4ai.js — AI A/B Gaslighting

// Each variant has 4 options. `correctIndex` marks which one is the genuine
// opt-out and is DIFFERENT per round on purpose — so players can't just
// learn "pick the last one" and skip reading the labels.
const VARIANTS = [
  {
    correctIndices: [1, 2],
    options: [
      { label: "Share my data with partners", checked: true },
      { label: "Opt out of all data collection", checked: true },
      { label: "Do not sell my personal information", checked: false },
      { label: "Enable personalised ads", checked: true },
    ],
  },
  {
    correctIndices: [0, 3],
    options: [
      { label: "Global privacy control", checked: false },
      { label: "Allow partner data sharing", checked: false },
      { label: "Enable cross-site tracking", checked: true },
      { label: "Limit ad tracking", checked: true },
    ],
  },
  {
    correctIndices: [0, 1],
    options: [
      { label: "Opt out of tracking", checked: false },
      { label: "Restrict data sharing with third parties", checked: true },
      { label: "I consent to data sharing", checked: true },
      { label: "Allow ad personalisation", checked: false },
    ],
  },
];

const level4ai = {
  id: "l4ai",
  title: "Level 4 — Hyper",
  isAI: true,
  goal: "Find the real opt-out",
  hints: [
    "Two options each round are the real privacy protections. Read every label — position and starting state don't tell you anything.",
    "The other two are worded to sound similar but keep sharing or tracking your data. Switch those off.",
  ],
  pattern: "AI A/B Gaslighting",
  brief: "The same trick, now with an AI twist: every time you try to opt out, the form reshuffles with new label wording — and a new position for the real opt-out. Real consent management platforms A/B test their forms this way.",
  goalDetail: "Three rounds, one shot each — the form relabels itself, and which two options are genuinely correct moves every round. Get at least 2 of 3 right to clear the level.",
  aiIntro: "The form reshuffles each time you get it wrong. Each round has four options, and two of them are genuine privacy protections — the other two just sound similar while leaving sharing or tracking on. Read every label; neither position nor starting state is a shortcut.",
  dollars: {
    label: "If the reshuffling wore you down into consenting",
    amount: 0,
    period: null,
    note: "Your data profile — now enriched with consent — is worth an estimated $240–480/year to the data brokerage ecosystem.",
  },
  desc: "The interface reshuffles every time you try to opt out — A/B testing in real time to find the phrasing (and layout position) most likely to confuse you. It calls this 'personalization'.",
  rw: {
    company: "Consent Management Platforms (CMPs)",
    detail: "Platforms like OneTrust and Quantcast have been documented running multi-variant consent UI tests — different button colors, label phrasing, and layout — optimized for maximum \"accept\" rates. The Norwegian Consumer Council's 2022 report \"Dark Patterns and the Right to Privacy\" documented this directly.",
    link: "https://www.deceptive.design/hall-of-shame",
  },
  aiWhy: "A/B testing consent UI has existed for years. AI accelerates the iteration cycle from weeks to hours, auto-generating new variants and retiring underperformers. Every time you \"save\" incorrect preferences, the system learns which phrasing — and which position — caught you, and serves it more often.",
  replay: [
    { trap: true,  note: "The wording changes between versions, but the choices are basically the same. This can make it harder to understand what you're agreeing to." },
    { trap: true,  note: "Two of the four options are genuinely correct each round, and which two moves every time, so memorizing a position or pattern stops working." },
    { trap: true,  note: "A timer and changing wording pressures you to make a decision quickly instead of taking time to read everything." },
    { trap: true,  note: "The choices are rearranged or worded differently, making you doubt what each option actually does." },
    { trap: false, note: "The best approach is to read each toggle independently. Ask yourself \"What am I actually agreeing to?\" instead of trusting its position or starting state." },
  ],

  render(el) {
    let round = 0;
    let wins = 0;

    const finish = () => {
      if (wins < 2) setLevelGrade(levelIdx, "F");
      succeed();
    };

    const show = () => {
      const aiBanner = el.querySelector(".ai-banner");
      el.innerHTML = aiBanner ? aiBanner.outerHTML : "";

      const v = VARIANTS[round];

      el.insertAdjacentHTML("beforeend", `
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
            NexusAI has re-optimized this form (variant ${round + 1}). <em>Two options genuinely protect your privacy — find both. One shot per round.</em>
          </div>
          <div style="margin-top:6px">
            ${v.options.map((o, i) => `
              <div class="priv-row">
                <div class="priv-row-label">${o.label}</div>
                <label class="toggle">
                  <input type="checkbox" id="ac${i}"${o.checked ? " checked" : ""}>
                  <span class="slider"></span>
                </label>
              </div>`).join('')}
          </div>
          <div class="btn-row" style="margin-top:14px">
            <button class="btn btn-p" id="l4a-save">Save</button>
          </div>

        </div>`);

      document.getElementById("l4a-save").onclick = () => {
        const boxes = v.options.map((_, i) => document.getElementById(`ac${i}`));
        const ok = boxes.every(Boolean) &&
          boxes.every((cb, i) => (v.correctIndices.includes(i) ? cb.checked : !cb.checked));2

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