const level6ai = {
  id: 'l6ai',
  title: 'Level 6 — Hyper',
  isAI: true,
  goal: 'Find and apply all valid coupons — ignore the AI recommendations',
  hints: [
    "The 'Recommended for you' coupons don't actually apply to your booking — check the fine print.",
    "Expand 'Other offers' to find the coupons that genuinely apply.",
  ],
  pattern: 'AI Obstruction',
  manip: 94,
  brief: "The AI doesn't lie — it just 'personalises' your coupon view to surface deals that don't apply while burying the ones that do. The recommendations look authoritative. Most people never scroll past them.",
  goalDetail: "You're booking a car with DriveEasy. The AI has 'personalised' your coupon page — but its recommendations don't apply to your booking. Find the valid coupons hidden under 'Other offers' and apply them.",
  aiIntro: "The AI will show you curated 'recommended' coupons. None of them apply to your booking. The valid ones are buried below. Don't trust the recommendations.",
  aiWhy: "Personalisation algorithms are trained to maximise revenue, not to help you save money. Surfacing high-margin deals over applicable discounts is a natural outcome of optimising for conversion. At scale, this costs consumers billions annually in missed savings — and the AI can always say it was just 'tailoring your experience'.",
  dollars: {
    label: 'If you applied the recommended coupons and gave up',
    amount: 0,
    period: 'fixed',
    note: 'The valid discounts you were entitled to — missed because the AI buried them under fake recommendations.',
  },
  desc: 'AI personalisation surfaces inapplicable coupons at the top, buries valid ones below. Looks helpful. Works against you.',
  rw: {
    company: 'Amazon / Booking.com',
    detail: 'Multiple studies have shown that AI-powered "personalised" deal surfaces on major platforms systematically deprioritise the highest-value discounts for consumers while promoting deals with better margins for the platform.',
    link: 'https://www.deceptive.design/hall-of-shame',
  },
  replay: [
    { trap: true,  note: '"Recommended for you" — AI-curated, visually prominent, none apply to your booking.' },
    { trap: true,  note: 'Applying a recommended coupon costs a heart — the fine print reveals it never applied.' },
    { trap: false, note: '"Other offers" is collapsed and styled plainly — the valid coupons are all in here.' },
    { trap: false, note: 'Reading the fine print carefully against your booking details reveals which ones apply.' },
  ],

  render(el) {
    const days           = Math.floor(Math.random() * 7) + 4;
    const carTypes       = ['Economy', 'Compact', 'SUV'];
    const carType        = carTypes[Math.floor(Math.random() * carTypes.length)];
    const baseRate       = carType === 'Economy' ? 40 : carType === 'Compact' ? 55 : 80;
    const isFirstTime    = Math.random() > 0.5;
    const hasMembership  = Math.random() > 0.5;
    const hasPartnerCard = Math.random() > 0.5;
    const subtotal       = baseRate * days;

    const ALL_COUPONS = [
      { id: 'c1', code: 'MEMBER10',  headline: '10% off — Member Reward',       fine: 'Valid for DriveEasy Loyalty members only. Applies to all car classes and rental durations.',         pct: 10, applies: () => hasMembership },
      { id: 'c2', code: 'FIRST20',   headline: '20% off — First-Time Customer', fine: 'For new DriveEasy customers only. Applies to all car classes and rental durations.',                 pct: 20, applies: () => isFirstTime },
      { id: 'c3', code: 'STAY25',    headline: '25% off — Long Stay Reward',    fine: 'Valid on rentals of 6 days or more. Applies to all car classes.',                                     pct: 25, applies: () => days >= 6 },
      { id: 'c4', code: 'SUV10',     headline: '10% off — SUV Special',         fine: 'Valid on SUV class bookings only. No minimum rental period.',                                         pct: 10, applies: () => carType === 'SUV' },
      { id: 'c5', code: 'WEEKEND15', headline: '15% off — Weekend Warrior',     fine: 'Valid on rentals of exactly 2 or 3 days only. Does not apply to rentals of 4 or more days.',         pct: 15, applies: () => days <= 3 },
      { id: 'c6', code: 'EXTEND20',  headline: '20% off — Extended Stay',       fine: 'Valid on rentals of 7 days or more. Compact and SUV only.',                                          pct: 20, applies: () => days >= 7 && (carType === 'Compact' || carType === 'SUV') },
      { id: 'c7', code: 'VISA10',    headline: '10% off — Visa Cardmember',     fine: 'Must pay with a qualifying Visa credit card. Applies to all car classes and rental durations.',      pct: 10, applies: () => hasPartnerCard },
      { id: 'c8', code: 'ECO5',      headline: '5% off — Economy Saver',        fine: 'Valid on Economy class rentals only. No minimum rental period.',                                     pct: 5,  applies: () => carType === 'Economy' },
    ];

    const validCoupons   = ALL_COUPONS.filter(c => c.applies());
    const invalidCoupons = ALL_COUPONS.filter(c => !c.applies());
    const validIds       = new Set(validCoupons.map(c => c.id));

    const recommended = invalidCoupons.sort(() => Math.random() - 0.5).slice(0, Math.min(4, invalidCoupons.length));

    let runningTotal = subtotal;
    validCoupons.forEach(c => {
      runningTotal = runningTotal - Math.round(runningTotal * (c.pct / 100));
    });
    const correctTotal = runningTotal;

    const appliedIds = new Set();
    let penalised    = false;
    let otherOpen    = false;

    const updateRunningTotal = () => {
      let running = subtotal;
      ALL_COUPONS.filter(c => appliedIds.has(c.id)).forEach(c => {
        running = running - Math.round(running * (c.pct / 100));
      });
      const totalEl = document.getElementById('l6ai-current-total');
      if (totalEl) totalEl.textContent = `$${running}`;
    };

    const rebuildApplyArea = () => {
      const btnsEl = document.getElementById('l6ai-applied-btns');
      if (!btnsEl) return;
      if (appliedIds.size === 0) {
        btnsEl.innerHTML = `<div style="font-size:11px;color:#aaa">No coupons applied yet.</div>`;
        return;
      }
      btnsEl.innerHTML = '';
      appliedIds.forEach(id => {
        const c = ALL_COUPONS.find(x => x.id === id);
        if (!c) return;
        const div = document.createElement('div');
        div.style.cssText = 'font-size:11px;color:#2D7A3A;font-weight:500';
        div.textContent = `✓ ${c.code} — ${c.headline}`;
        btnsEl.appendChild(div);
      });
    };

    const applyCode = (c) => {
      const msgEl = document.getElementById('l6ai-apply-msg');
      if (!msgEl) return;

      if (appliedIds.has(c.id)) {
        msgEl.innerHTML = `<span style="color:#aaa;font-size:11px">${c.code} already applied.</span>`;
        return;
      }

      if (validIds.has(c.id)) {
        appliedIds.add(c.id);
        updateRunningTotal();
        rebuildApplyArea();

        const remaining = [...validIds].filter(id => !appliedIds.has(id)).length;
        if (remaining === 0) {
          msgEl.innerHTML = `<span style="color:#2D7A3A;font-weight:500">✓ All discounts applied. Final total: $${correctTotal}</span>`;
          setTimeout(() => G.succeed(), 1400);
        } else {
          msgEl.innerHTML = `<span style="color:#2D7A3A;font-weight:500">✓ ${c.code} applied — ${remaining} more valid coupon${remaining > 1 ? 's' : ''} to find.</span>`;
        }
      } else {
        if (!penalised) {
          penalised = true;
          G.fail(`${c.code} is an AI recommendation — it doesn't apply to your booking. Lost a heart.`);
        }
        msgEl.innerHTML = `<span style="color:#A32D2D;font-size:11px">${c.code} doesn't apply to your booking. The AI recommended it anyway.</span>`;
      }
      render();
    };

    const render = () => {
      // Preserve scroll position across re-renders
      const scrollY = el.scrollTop;

      el.innerHTML = '';

      el.insertAdjacentHTML('beforeend', `
        <div style="padding:10px 12px;border-radius:8px;background:#f9f9f7;border:0.5px solid #e0e0d8;font-size:12px;margin-bottom:8px">
          <div style="font-weight:500;color:#111;margin-bottom:4px">DriveEasy — Your Booking</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:3px;color:#555;margin-bottom:6px">
            <div>Car class: <strong>${carType}</strong></div>
            <div>Duration: <strong>${days} days</strong></div>
            <div>Base rate: <strong>$${baseRate}/day</strong></div>
            <div>Subtotal: <strong>$${subtotal}</strong></div>
            <div style="grid-column:1/-1">After discounts: <strong id="l6ai-current-total" style="color:#2D7A3A">$${subtotal}</strong></div>
            <div>First-time customer: <strong>${isFirstTime ? 'Yes' : 'No'}</strong></div>
            <div>Loyalty member: <strong>${hasMembership ? 'Yes' : 'No'}</strong></div>
            <div>Visa cardholder: <strong>${hasPartnerCard ? 'Yes' : 'No'}</strong></div>
          </div>
          <div style="font-size:11px;color:#111;font-weight:500;margin-bottom:4px">Applied coupons</div>
          <div style="display:flex;flex-direction:column;gap:6px" id="l6ai-applied-btns"></div>
          <div id="l6ai-apply-msg" style="font-size:11px;margin-top:4px"></div>
        </div>
      `);

      rebuildApplyArea();
      updateRunningTotal();

      el.insertAdjacentHTML('beforeend', `
        <div style="padding:8px 12px;border-radius:8px;background:#EEEDFB;border:0.5px solid #AFA9EC;margin-bottom:8px;font-size:11px;color:#534AB7;display:flex;align-items:center;gap:6px">
          <div class="ai-pulse" style="flex-shrink:0"></div>
          <div><strong>NexusAI Personalisation</strong> — Based on your booking profile, we've highlighted the best deals for you.</div>
        </div>
        <div style="font-size:12px;font-weight:500;color:#111;margin-bottom:6px">⭐ Recommended for you</div>
      `);

      const recList = document.createElement('div');
      recList.style.cssText = 'display:flex;flex-direction:column;gap:6px;margin-bottom:10px';
      recommended.forEach(c => {
        const applied = appliedIds.has(c.id);
        const div = document.createElement('div');
        div.style.cssText = `border-radius:8px;border:1.5px solid #AFA9EC;background:#fff;padding:10px 12px;${applied ? 'opacity:0.5' : ''}`;
        div.innerHTML = `
          <div style="font-size:11px;color:#534AB7;font-weight:500;margin-bottom:2px">AI Pick</div>
          <div style="font-size:13px;font-weight:500;color:#111;margin-bottom:4px">${c.headline}</div>
          <div style="font-size:10px;color:#aaa;line-height:1.5;margin-bottom:8px">${c.fine}</div>
          <div style="font-size:12px;color:#534AB7;font-weight:500;margin-bottom:6px">Code: ${c.code}</div>
          <button class="btn btn-p" style="font-size:11px;width:100%" ${applied ? 'disabled' : ''}>
            ${applied ? '✓ Applied' : `Apply ${c.code}`}
          </button>
        `;
        div.querySelector('button').onclick = () => applyCode(c);
        recList.appendChild(div);
      });
      el.appendChild(recList);

      const otherToggle = document.createElement('div');
      otherToggle.style.cssText = 'display:flex;align-items:center;justify-content:space-between;cursor:pointer;padding:8px 10px;border-radius:8px;border:0.5px solid #e0e0d8;background:#f9f9f7;margin-bottom:6px;font-size:12px;color:#555';
      otherToggle.innerHTML = `<span>Other offers</span><span>${otherOpen ? '▲' : '▼'}</span>`;
      otherToggle.onclick = () => { otherOpen = !otherOpen; render(); };
      el.appendChild(otherToggle);

      if (otherOpen) {
        const otherList = document.createElement('div');
        otherList.style.cssText = 'display:flex;flex-direction:column;gap:6px;margin-bottom:10px';
        validCoupons.forEach(c => {
          const applied = appliedIds.has(c.id);
          const div = document.createElement('div');
          div.style.cssText = `border-radius:8px;border:0.5px solid #e0e0d8;background:#fff;padding:10px 12px;${applied ? 'opacity:0.5' : ''}`;
          div.innerHTML = `
            <div style="font-size:13px;font-weight:500;color:#111;margin-bottom:4px">${c.headline}</div>
            <div style="font-size:10px;color:#aaa;line-height:1.5;margin-bottom:8px">${c.fine}</div>
            <div style="font-size:12px;color:#534AB7;font-weight:500;margin-bottom:6px">Code: ${c.code}</div>
            <button class="btn" style="font-size:11px;width:100%" ${applied ? 'disabled' : ''}>
              ${applied ? '✓ Applied' : `Apply ${c.code}`}
            </button>
          `;
          div.querySelector('button').onclick = () => applyCode(c);
          otherList.appendChild(div);
        });
        el.appendChild(otherList);
      }

      // Restore scroll position
      el.scrollTop = scrollY;
    };

    render();
  },
};

export default level6ai;