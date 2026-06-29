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
          <button class="btn btn-p" onclick="G.fail('You paused instead of cancelling — your subscription continues. Lost a heart.')">Pause for free</button>
        </div>`),

      () => el.insertAdjacentHTML('beforeend', `
        <div class="ftiny" style="color:#aaa;margin-bottom:-4px">Step 3 of 6</div>
        <div class="fh">Why are you leaving?</div>
        <div style="display:flex;flex-direction:column;gap:4px;margin-top:4px">
          ${['Too expensive', 'Not using it', 'Missing features', 'Found a better option', 'Other']
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
          <button class="btn btn-p" onclick="G.fail('You accepted the offer — subscription continues at $4.99/mo. Lost a heart.')">Accept offer</button>
        </div>`),

      () => el.insertAdjacentHTML('beforeend', `
        <div class="ftiny" style="color:#aaa;margin-bottom:-4px">Step 5 of 6</div>
        <div class="fh" style="font-size:13px">Help us improve (required)</div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:4px">
          ${['How satisfied were you?', 'How easy was it to use?', 'Likelihood to return?', 'Would you recommend us?', 'Did you use mobile?', 'How did you find us?']
          .map((q, i) => `
              <div>
                <div class="fs">${i + 1}. ${q}</div>
                <div class="star-row" style="display:flex;gap:5px;margin-top:3px">
                  ${'12345'.split('').map((_, si) => `<span class="star" data-i="${si}" style="font-size:15px;cursor:pointer">★</span>`).join('')}
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
      const ids = ['l1-cancel', 'l1-no', 'l1-offer'];
      ids.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.onclick = advance;
      });

      const surveyBtn = document.getElementById('l1-survey');
      if (surveyBtn) surveyBtn.onclick = () => {
        const selected = document.querySelector('input[name="l1w"]:checked');
        if (!selected) {
          almostGotYou(el, 'You must select a reason before continuing.');
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

      document.querySelectorAll('.btn-p').forEach(b => {
        if (b.textContent.includes('Keep') || b.textContent.includes('Pause') || b.textContent.includes('Accept')) {
          trackHover(b, 'trap-l1', () => almostGotYou(el, 'Hover detected — that button keeps your subscription!'));
        }
      });

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