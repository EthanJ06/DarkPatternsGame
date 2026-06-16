// js/levels/level5ai.js — AI Hyper-Personalized Upsell
const OFFER_SECS = 20;
const UPSELLS = [
  { name: 'RunPro Membership (AI-predicted: 94% match)', price: 7.99 },
  { name: 'Performance insoles (recommended for your gait)', price: 19.99 },
  { name: 'HydrationTrack+ bundle (users like you bought this)', price: 12.99 },
];

const level5ai = {
  id: 'l5ai',
  title: 'Level 5 — Hyper',
  isAI: true,
  goal: 'Resist the personalized upsell',
  hints: [
    'The confidence percentage is made up — it has no statistical basis.',
    "Just click 'No thanks' on every recommendation. All three are upsells you don't need.",
  ],
  pattern: 'AI Hyper-Personalized Upsell',
  manip: 96,
  brief: "The same pattern, now with algorithmic authority. Instead of just sneaking items in, the AI 'predicts' you'll want them — complete with a confidence percentage designed to make refusing feel irrational.",
  goalDetail: "Decline every AI-recommended upsell. The percentages and 'users like you' framing are designed to make saying no feel like a mistake. They're not based on anything real.",
  aiIntro: 'Each recommendation comes with a confidence score (94%, 87%...). These numbers are fabricated. They exist to make declining feel statistically unusual.',
  dollars: {
    label: 'If you accepted all three AI recommendations',
    amount: 40.97,
    period: 'month',
    note: "$491.64/year in subscriptions you didn't need, sold to you by an algorithm",
  },
  desc: "Pseudo-AI 'predicts' what you need, with a confidence percentage, making declining feel irrational. The profile is fake; the confidence figure is meaningless.",
  rw: {
    company: 'Amazon, streaming platforms',
    detail:
      '"Customers who bought X also bought Y" is the benign version. AI-personalized bundling with manufactured confidence scores pushes this into manipulation: you\'re told an algorithm has specifically identified this for you, making opt-out feel like arguing with data.',
    link: 'https://www.deceptive.design/hall-of-shame',
  },
  aiWhy:
    'Upsells have always existed. AI makes them feel inevitable. A "94% match" score implies your refusal is statistically unusual — a form of algorithmic social pressure. The score is often based on simple demographic heuristics, but the framing borrows the authority of machine learning.',
  replay: [
    {trap: false, note: '"NexusAI identified you as X" — the profile is generated from minimal signals, but stated as established fact to make the recommendation feel inevitable.',},
    {trap: true, note: "The confidence percentage (94%, 91%...) has no statistical basis. It exists to make declining feel irrational — like you're arguing with data.",},
    {trap: true, note: '"Offer expires in Xs" — the countdown is fake urgency. The offer doesn\'t actually expire; it just auto-advances to pressure you into deciding before you\'ve read carefully.',},
    {trap: true, note: '"Users like you bought this" — social proof framing. Implies your peer group already said yes, making refusal feel like an outlier decision.',},
    {trap: true, note: '"Our model predicts you\'ll regret skipping this" — predictive regret framing. AI-era manipulation: instead of shaming you now, it threatens your future self.',},
    {trap: false, note: 'The winning move: the timer expiring costs you nothing. Every offer auto-advances whether you act or not — patience beats urgency.',},
  ],

  render(el) {
    const profile = 'budget-conscious runner';
    let step = 0;
    let adds = 0;
    let secsLeft = OFFER_SECS;
    let timerInterval = null;

    const clearTimer = () => {
      clearInterval(timerInterval);
      timerInterval = null;
    };

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
        bar.style.opacity    = secsLeft <= 10 && secsLeft % 2 === 0 ? '0.5' : '1';

        num.textContent  = secsLeft + 's';
        num.style.color  = secsLeft <= 10 ? '#E24B4A' : '#AAAAAA';

        label.textContent = secsLeft <= 10 ? 'Special offer expires soon!' : 'Special offer just for you...';
        label.style.color = secsLeft <= 10 ? '#E24B4A' : '#AAAAAA';

        if (secsLeft <= 5) tick();
        if (secsLeft <= 0) {
          clearTimer();
          step++;
          show();
        }
      }, 1000);
    };

    // Show a brief inline flash without stopping the timer or re-rendering
    const flashFail = (msg) => {
      const existing = document.getElementById('l5ai-flash');
      if (existing) existing.remove();

      const flash = document.createElement('div');
      flash.id = 'l5ai-flash';
      flash.style.cssText = 'font-size:11px;color:#E24B4A;text-align:center;padding:4px 0';
      flash.textContent = msg;

      const btnRow = document.getElementById('l5ai-btn-row');
      if (btnRow) btnRow.insertAdjacentElement('afterend', flash);

      setTimeout(() => flash.remove(), 1400);
    };

    const show = () => {
      clearTimer();
      if (step >= UPSELLS.length) { succeed(); return; }

      const u = UPSELLS[step];
      const aiBanner = el.querySelector('.ai-banner');
      el.innerHTML = aiBanner ? aiBanner.outerHTML : '';

      el.insertAdjacentHTML('beforeend', `
        <div class="fh" style="font-size:12px;color:#534AB7">
          NexusAI identified you as: <em>${profile}</em>
        </div>

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

        <div class="fs" style="margin-top:8px;color:#534AB7">
          Our model predicts you'll regret skipping this. Confidence: ${91 - step * 4}%
        </div>

        <div class="btn-row" id="l5ai-btn-row" style="margin-top:10px">
          <button class="btn btn-ai" id="l5ai-add">Add to order</button>
          <button class="btn" id="l5ai-skip">No thanks</button>
        </div>

        <div class="ftiny">${step + 1} of ${UPSELLS.length} personalized recommendations</div>
      `);

      document.getElementById('l5ai-add').onclick = () => {
        adds++;
        if (adds >= 2) {
          clearTimer();
          fail('Two AI upsells worked — the algorithm got you!');
          setTimeout(() => {
            succeed();
            setLevelGrade(levelIdx, 'F');
          }, 1900);
          return;
        }
        fail('AI upsell worked — lost a heart. Resist the next one!');
        // Disable buttons to prevent double-clicks during the brief pause
        document.getElementById('l5ai-add').disabled  = true;
        document.getElementById('l5ai-skip').disabled = true;
        flashFail('Got you. Moving on...');
        setTimeout(() => { step++; show(); }, 1000);
      };

      document.getElementById('l5ai-skip').onclick = () => {
        clearTimer();
        step++;
        show();
      };
      startTimer();
    };
    show();
  },
};

export default level5ai;