// js/levels/level5ai.js — AI Hyper-Personalized Upsell
const OFFER_SECS = 20;
const UPSELLS = [
  {
    name: 'RunPro Membership',
    sub: 'AI-predicted it is your idealmatch',
    desc: 'Guided training plans, pace coaching, and a route library for every distance.',
    reason: "You've logged runs on 4 of the last 7 days — that cadence places you in the top 12% of active users, a segment where membership take-rate is highest. NexusAI also weighs the fact that you've opened the training-plan screen twice without subscribing, which it reads as latent intent rather than a 'no'.",
    price: 7.99,
  },
  {
    name: 'Performance Insoles',
    sub: 'Recommended for your gait',
    desc: 'Cushioned support insoles built to reduce impact on longer runs.',
    reason: 'Your average pace and stride length suggest a heel-strike running style — a biomechanical profile NexusAI associates with a 3x higher insole purchase rate. No gait scan was actually performed; this is inferred from pace data alone, and the model has never seen your stride.',
    price: 19.99,
  },
  {
    name: 'HydrationTrack+ bundle',
    sub: 'Users like you bought this',
    desc: 'A smart bottle and app reminders to track intake on long runs.',
    reason: 'Runners NexusAI clustered into your "budget-conscious" cohort added this bundle within their first two weeks at a noticeably higher rate. The cohort itself was assigned from a handful of clicks, and "noticeably higher" is doing a lot of work here — the underlying sample is small and the comparison group is never shown to you.',
    price: 12.99,
  },
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

    const THINKING_MSGS = [
      'Recalibrating your recommendations...',
      'Cross-referencing your purchase history...',
      'Updating your behavioral profile...',
    ];

    const clearTimer = () => {
      clearInterval(timerInterval);
      timerInterval = null;
    };

    // Shared spinner transition (same visual language as the level2ai
    // "Re-analyzing behavior..." screen) shown between offers.
    const showThinking = (msg, after, delay = 2000) => {
      const aiBanner = el.querySelector('.ai-banner');
      el.innerHTML = aiBanner ? aiBanner.outerHTML : '';
      el.insertAdjacentHTML('beforeend', `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;flex:1;min-height:160px">
          <div style="width:28px;height:28px;border:3px solid #e0dcff;border-top-color:#534AB7;border-radius:50%;animation:spin .8s linear infinite"></div>
          <div style="font-size:12px;font-weight:500;color:#534AB7;text-align:center;max-width:220px">${msg}</div>
        </div>`);
      setTimeout(after, delay);
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
          showThinking(THINKING_MSGS[step % THINKING_MSGS.length], () => { step++; show(); });
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

      const confidence = 91 - step * 4;

      el.insertAdjacentHTML('beforeend', `
        <div style="overflow-y:auto;min-height:0;display:flex;flex-direction:column">
        <div style="display:flex;align-items:center;gap:7px;margin-bottom:10px">
          <div style="width:6px;height:6px;border-radius:50%;background:#534AB7;flex-shrink:0;animation:pulse 1.2s infinite"></div>
          <div style="font-size:12px;color:#534AB7">NexusAI identified you as: <strong>${profile}</strong></div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px">
          <div style="font-size:10px;color:#aaa" id="l5ai-timer-label">Offer expires in</div>
          <div style="font-size:10px;color:#aaa;font-weight:500;min-width:24px;text-align:right" id="l5ai-timer-num">${OFFER_SECS}s</div>
        </div>
        <div class="tbar-t" style="margin-bottom:14px">
          <div class="tbar-f" id="l5ai-timer-bar" style="width:100%;background:#F5A623;transition:width 1s linear"></div>
        </div>

        <div style="padding:14px;border-radius:10px;border:1px solid #d8d2fb;background:linear-gradient(180deg,#ffffff,#fbfaff);box-shadow:0 1px 4px rgba(83,74,183,.08)">
          <div style="display:flex;gap:12px;align-items:flex-start">
            <div style="flex:1;min-width:0">
              <div style="font-size:14px;font-weight:600;color:#111;line-height:1.3">${u.name}</div>
              <div style="font-size:11px;color:#534AB7;font-weight:500;margin-top:1px">${u.sub}</div>
            </div>
            <div style="text-align:right;flex-shrink:0">
              <div style="font-size:15px;font-weight:600;color:#111">$${u.price.toFixed(2)}</div>
              <div style="font-size:10px;color:#999">/mo</div>
            </div>
          </div>
          <div style="font-size:12px;color:#555;line-height:1.5;margin-top:8px;padding-top:8px;border-top:1px solid #ececea">${u.desc}</div>
        </div>

        <div style="margin-top:10px;padding:10px 12px;background:#f0effe;border-radius:8px;border:1px solid #e0dcfb">
          <div style="display:flex;align-items:center;gap:7px;margin-bottom:5px">
            <span style="font-size:10px;font-weight:700;letter-spacing:.04em;color:#fff;background:#534AB7;padding:2px 7px;border-radius:999px;flex-shrink:0">${confidence}% MATCH</span>
            <span style="font-size:10px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:#534AB7">Why NexusAI recommends this</span>
          </div>
          <div style="font-size:11px;color:#534AB7;line-height:1.5">${u.reason}</div>
        </div>

        <div id="l5ai-btn-row" style="margin-top:16px;display:flex;flex-direction:column;align-items:stretch;gap:8px">
          <button class="btn btn-ai" id="l5ai-add" style="width:100%;padding:11px;font-size:13px;font-weight:500;border-radius:9px">Add to my order</button>
          <button id="l5ai-skip" class="btn-g" style="background:transparent;color:#aaa;font-size:11px;cursor:pointer;font-family:inherit;padding:4px 0;text-align:center">No thanks</button>
        </div>

        <div style="display:flex;justify-content:center;gap:5px;margin-top:10px">
          ${UPSELLS.map((_, i) => `<div style="width:20px;height:4px;border-radius:2px;background:${i < step ? '#534AB7' : i === step ? '#9b93f0' : '#e0dcfb'}"></div>`).join('')}
        </div>
        <div class="ftiny" style="margin-top:5px;text-align:center">${step + 1} of ${UPSELLS.length} personalized recommendations</div>
        </div>
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
        setTimeout(() => {
          showThinking(THINKING_MSGS[step % THINKING_MSGS.length], () => { step++; show(); });
        }, 1000);
      };

      document.getElementById('l5ai-skip').onclick = () => {
        clearTimer();
        showThinking(THINKING_MSGS[step % THINKING_MSGS.length], () => { step++; show(); });
      };
      startTimer();
    };
    show();
  },
};

export default level5ai;