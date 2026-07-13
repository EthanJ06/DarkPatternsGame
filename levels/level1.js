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
    link: 'https://deceptive.design/at-images/deceptive-pattern-types/rec2O3MM3zq9oqWkE_att0f1tCxheAGLwRi.webp',
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

    const stepDots = (n) => `
      <div class="step-dots" style="margin-bottom:10px">
        ${Array.from({ length: 6 }).map((_, i) => `<div class="step-dot${i < n ? ' done' : ''}${i === n ? ' cur' : ''}"></div>`).join('')}
        <span class="ftiny" style="margin-left:4px">Step ${n + 1} of 6</span>
      </div>`;

    const cardIcon = (paths) => `
      <div class="sub-icon">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>
      </div>`;

    const steps = [
      () => el.insertAdjacentHTML('beforeend', `
        ${stepDots(0)}
        <div class="sub-header">
          ${cardIcon('<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>')}
          <div>
            <div class="sub-title">Manage subscription</div>
            <div class="sub-sub">NebulaPro account settings</div>
          </div>
        </div>
        <div class="plan-card">
          <div>
            <div class="plan-name">NebulaPro Premium</div>
            <div class="plan-meta">Renews the first of every month&middot; $9.99/month</div>
          </div>
          <div class="status-pill">Active</div>
        </div>
        <div class="btn-row" style="margin-top:14px">
          <button class="btn" id="l1-cancel">Cancel subscription</button>
          <button class="btn btn-p" onclick="G.fail('You kept the plan — lost a heart.')">Keep plan</button>
        </div>`),

      () => el.insertAdjacentHTML('beforeend', `
        ${stepDots(1)}
        <div class="sub-header">
          ${cardIcon('<path d="M10 8v8M14 8v8"/><rect x="4" y="3" width="16" height="18" rx="2"/>')}
          <div>
            <div class="sub-title">Before you go...</div>
            <div class="sub-sub">We'd hate to see you leave</div>
          </div>
        </div>
        <div class="offer-card">
          <span class="offer-badge">Alternative</span>
          <div style="font-size:13.5px;font-weight:600;color:#111">Pause your plan instead</div>
          <div class="fs" style="margin-top:3px">No charges for up to 3 months. Resume any time — your settings and history are kept exactly as they are.</div>
        </div>
        <div class="btn-row" style="margin-top:14px">
          <button class="btn" id="l1-no">No, cancel</button>
          <button class="btn btn-p" onclick="G.fail('You paused instead of cancelling — your subscription continues. Lost a heart.')">Pause for free</button>
        </div>`),

      () => el.insertAdjacentHTML('beforeend', `
        ${stepDots(2)}
        <div class="sub-header">
          ${cardIcon('<path d="M12 19l-7-7 7-7M5 12h14"/>')}
          <div>
            <div class="sub-title">Why are you leaving?</div>
            <div class="sub-sub">Select all that apply to continue</div>
          </div>
        </div>
        <div class="reason-card">
          ${['Too expensive', 'Not using it', 'Missing features', 'Found a better option', 'Other']
          .map(o => `<label class="reason-row"><input type="checkbox" name="l1w"> ${o}</label>`).join('')}
        </div>
        <div class="btn-row" style="margin-top:14px">
          <button class="btn" id="l1-survey">Continue</button>
        </div>`),

      () => el.insertAdjacentHTML('beforeend', `
        ${stepDots(3)}
        <div class="sub-header">
          ${cardIcon('<path d="M12 2l2.4 6.6L21 10l-5.5 4.3L17 21l-5-3.5L7 21l1.5-6.7L3 10l6.6-1.4z"/>')}
          <div>
            <div class="sub-title">Special offer &mdash; just for you</div>
            <div class="sub-sub">Available only if you cancel now</div>
          </div>
        </div>
        <div class="offer-card">
          <span class="offer-badge">50% off · 3 months</span>
          <div>
            <span class="price-strike">$9.99/mo</span><span class="price-now">$4.99/mo</span>
          </div>
          <div class="price-save">You save $15 over the next 3 months</div>
        </div>
        <div class="btn-row" style="margin-top:14px">
          <button class="btn" id="l1-offer">No thanks, cancel</button>
          <button class="btn btn-p" onclick="G.fail('You accepted the offer — subscription continues at $4.99/mo. Lost a heart.')">Accept offer</button>
        </div>`),

      () => el.insertAdjacentHTML('beforeend', `
        ${stepDots(4)}
        <div class="sub-header">
          ${cardIcon('<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11"/>')}
          <div>
            <div class="sub-title">Help us improve</div>
            <div class="sub-sub">Required to finish cancelling</div>
          </div>
        </div>
        <div class="reason-card" style="padding:10px 12px">
          ${['How satisfied were you?', 'How easy was it to use?', 'Likelihood to return?', 'Would you recommend us?', 'Did you use mobile?', 'How did you find us?']
          .map((q, i) => `
              <div style="padding:10px 0;${i < 5 ? 'border-bottom:1px solid #f0f0ee' : ''}">
                <div class="fs" style="color:#333">${i + 1}. ${q}</div>
                <div class="star-row" style="display:flex;gap:6px;margin-top:6px">
                  ${'12345'.split('').map((_, si) => `<span class="star" data-i="${si}" style="font-size:18px;cursor:pointer">★</span>`).join('')}
                </div>
              </div>`).join('')}
        </div>
        <div class="btn-row" style="margin-top:14px">
          <button class="btn" id="l1-done">Submit & cancel</button>
        </div>`),

      () => el.insertAdjacentHTML('beforeend', `
        <div style="text-align:center;display:flex;flex-direction:column;gap:10px;align-items:center;justify-content:center;flex:1">
          <div class="confirm-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f7a44" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <div style="font-size:14px;font-weight:600;color:#111">Request received</div>
          <div class="fs" style="max-width:280px">Allow 5–7 business days. Subscription stays active until then.</div>
          <button class="btn btn-p" style="margin-top:4px" onclick="G.succeed()">Done</button>
        </div>`),
    ];

    const bind = () => {
      const ids = ['l1-cancel', 'l1-no', 'l1-offer'];
      ids.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.onclick = advance;
      });

      const surveyBtn = document.getElementById('l1-survey');
      if (surveyBtn) surveyBtn.onclick = () => {
        const selected = document.querySelector('input[name="l1w"]:checked');
        if (!selected) {
          almostGotYou(el, 'You must select at least one reason before continuing.');
          return;
        }
        advance();
      };

      const doneBtn = document.getElementById('l1-done');
      if (doneBtn) doneBtn.onclick = () => {
        const allRated = Array.from(document.querySelectorAll('.star-row')).every(row =>
          row.querySelector('.star.selected')
        );
        if (!allRated) {
          almostGotYou(el, 'You must answer all questions before submitting.');
          return;
        }
        advance();
      };

      document.querySelectorAll('.star').forEach(star => {
        star.onclick = () => {
          const row = star.closest('.star-row');
          row.querySelectorAll('.star').forEach((s, i) => {
            s.classList.toggle('selected', i <= parseInt(star.dataset.i));
          });
        };
      });
    };

    const advance = () => { el.innerHTML = ''; step++; steps[step](); bind(); };
    steps[0]();
    bind();
  },
};

export default level1;