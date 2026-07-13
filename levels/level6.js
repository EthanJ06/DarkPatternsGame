const level6 = {
  id: 'l6',
  title: 'Level 6',
  isAI: false,
  goal: 'Apply the one valid coupon before time runs out',
  hints: [
    "Only one coupon actually applies — check the fine print carefully against your booking.",
    "Try Promotions & Savings → the correct submenu for your car type or membership status.",
  ],
  pattern: 'Obstruction',
  manip: 88,
  brief: "Obstruction buries your entitlements behind menus, fine print, and time pressure. Car rental companies offer dozens of codes — all mutually exclusive, most inapplicable — knowing the clock will run out before you find the right one.",
  goalDetail: "You have 60 seconds. Navigate the menus, find the one coupon that actually applies to your booking, and apply it. All coupons are mutually exclusive — only one is valid. Wrong ones cost a heart.",
  dollars: {
    label: 'If you gave up and paid full price',
    amount: 0,
    period: 'fixed',
    note: 'The discount you were entitled to — forfeited because the clock ran out.',
  },
  desc: 'Eight mutually exclusive coupons, one timer, one correct answer. The fine print tells you which one applies — if you can find it in time.',
  rw: {
    company: 'Enterprise / Hertz / Avis',
    detail: 'Major rental companies routinely advertise discount codes with conflicting conditions and short redemption windows, knowing most customers will either pick the wrong one or give up entirely.',
    link: 'https://www.deceptive.design/hall-of-shame',
  },
  replay: [
    { trap: true,  note: 'All coupons say "cannot be combined with other offers" — only one actually qualifies for your booking.' },
    { trap: true,  note: 'The timer creates panic — most people apply the first code they find rather than reading the fine print.' },
    { trap: true,  note: 'Dead ends (Add-ons, Help & FAQ, Special Offers) waste precious seconds.' },
    { trap: false, note: 'The correct path is always under Promotions & Savings — matching your car type or membership status.' },
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
      { id: 'c1', code: 'MEMBER10',  headline: '10% off — Member Reward',
        fine: 'Valid for Loyalty members on Economy class only. Not valid on Compact or SUV. Cannot be combined with other offers.',
        pct: 10, applies: () => hasMembership && carType === 'Economy' },
      { id: 'c2', code: 'FIRST20',   headline: '20% off — First-Time Customer',
        fine: 'For new customers only. Not valid for Loyalty members. Rentals of 5 days or fewer only. Cannot be combined with other offers.',
        pct: 20, applies: () => isFirstTime && !hasMembership && days <= 5 },
      { id: 'c3', code: 'STAY25',    headline: '25% off — Long Stay Reward',
        fine: 'Valid on rentals of 6 days or more. Not valid for Loyalty members. Not valid for Visa cardholders. Cannot be combined with other offers.',
        pct: 25, applies: () => days >= 6 && !hasMembership && !hasPartnerCard },
      { id: 'c4', code: 'SUV10',     headline: '10% off — SUV Special',
        fine: 'Valid on SUV class only. Not valid for first-time customers. Not valid for Loyalty members. Cannot be combined with other offers.',
        pct: 10, applies: () => carType === 'SUV' && !isFirstTime && !hasMembership },
      { id: 'c5', code: 'COMPACT15', headline: '15% off — Compact Deal',
        fine: 'Valid on Compact class only. For Loyalty members on rentals of 6 days or fewer only. Cannot be combined with other offers.',
        pct: 15, applies: () => carType === 'Compact' && hasMembership && days <= 6 },
      { id: 'c6', code: 'EXTEND20',  headline: '20% off — Extended Stay',
        fine: 'Valid on rentals of 7 days or more. Compact and SUV only. Not valid for Visa cardholders. For Loyalty members only. Cannot be combined with other offers.',
        pct: 20, applies: () => days >= 7 && (carType === 'Compact' || carType === 'SUV') && !hasPartnerCard && hasMembership },
      { id: 'c7', code: 'VISA10',    headline: '10% off — Visa Cardmember',
        fine: 'Must pay with qualifying Visa credit card. Not valid on Economy class. Not valid for Loyalty members. Cannot be combined with other offers.',
        pct: 10, applies: () => hasPartnerCard && carType !== 'Economy' && !hasMembership },
      { id: 'c8', code: 'ECO5',      headline: '5% off — Economy Saver',
        fine: 'Valid on Economy class only. Not valid on rentals of 7 days or more. Not valid for Loyalty members. Cannot be combined with other offers.',
        pct: 5,  applies: () => carType === 'Economy' && days < 7 && !hasMembership },
    ];

    const getCoupon = (id) => ALL_COUPONS.find(c => c.id === id) || {
      id, code: id, headline: 'Offer unavailable',
      fine: 'This offer is not available for your current booking.',
      pct: 0, dead: true, deadMsg: 'This offer is not available for your current booking.',
    };

    let validCoupons = ALL_COUPONS.filter(c => c.applies());
    if (validCoupons.length === 0) {
      if (!hasMembership && !hasPartnerCard) {
        ALL_COUPONS[2].applies = () => true;
        validCoupons = [ALL_COUPONS[2]];
      } else if (hasMembership && carType !== 'Economy') {
        ALL_COUPONS[4].applies = () => true;
        validCoupons = [ALL_COUPONS[4]];
      } else {
        ALL_COUPONS[0].applies = () => true;
        validCoupons = [ALL_COUPONS[0]];
      }
    }
    const validCoupon  = validCoupons[0];
    const validId      = validCoupon.id;
    const discount     = Math.round(subtotal * (validCoupon.pct / 100));
    const correctTotal = subtotal - discount;

    let penalised     = false;
    let timeLeft      = 60;
    let timerInterval = null;

    const TREE = {
      label: 'DriveEasy Booking',
      children: [
        {
          label: 'Add-ons & Extras',
          children: [
            { label: 'Add GPS',       dead: true, deadMsg: 'GPS rental — $8/day. This is a paid add-on, not a coupon.' },
            { label: 'Add insurance', dead: true, deadMsg: 'Insurance packages starting at $12/day. Not a coupon page.' },
            { label: 'Prepay fuel',   dead: true, deadMsg: "Prepay fuel at today's rate. This is a paid add-on." },
            { label: 'Extra driver',  dead: true, deadMsg: 'Add an extra driver for $5/day. Not a coupon page.' },
          ],
        },
        {
          label: 'Promotions & Savings',
          children: [
            { label: 'Member Discounts',     children: [{ label: 'How to join', dead: true, deadMsg: 'Join DriveEasy Rewards for free at the front desk. No codes here.' }, { label: 'Available Codes', coupon: getCoupon('c1') }] },
            { label: 'New Customer Offers',  children: [{ label: 'About this offer', dead: true, deadMsg: 'First-time customers enjoy exclusive discounts.' }, { label: 'Available Codes', coupon: getCoupon('c2') }] },
            { label: 'Long Stay Deals',      children: [{ label: 'Available Codes', coupon: getCoupon('c3') }, { label: 'Premium Codes', coupon: getCoupon('c6') }] },
            { label: 'Vehicle Class Offers', children: [{ label: 'Available Codes', coupon: getCoupon('c4') }, { label: 'Economy Codes', coupon: getCoupon('c8') }] },
            { label: 'Short Stay Deals',     children: [{ label: 'Available Codes', coupon: getCoupon('c5') }] },
            { label: 'Partner Offers',       children: [{ label: 'Airline partners', dead: true, deadMsg: 'Earn AirMiles on your rental. No discount codes on this page.' }, { label: 'Available Codes', coupon: getCoupon('c7') }] },
          ],
        },
        {
          label: 'Help & FAQ',
          children: [
            { label: 'How do I use a coupon?', dead: true, deadMsg: 'Enter your coupon code in the apply field on the booking page.' },
            { label: 'Cancellation policy',    dead: true, deadMsg: 'Free cancellation up to 24 hours before pickup.' },
            { label: 'Contact support',        dead: true, deadMsg: 'Our team responds within 3–5 business days.' },
          ],
        },
        {
          label: 'Special Offers',
          children: [
            { label: 'Weekend deals',   dead: true, deadMsg: 'Pre-set weekend packages — not coupon codes.' },
            { label: 'Corporate rates', dead: true, deadMsg: 'Corporate accounts only. Contact your account manager.' },
            { label: 'Seasonal sales',  dead: true, deadMsg: 'Seasonal pricing applied automatically. No code provided.' },
          ],
        },
      ],
    };

    const stack = [TREE];

    const startTimer = () => {
      timerInterval = setInterval(() => {
        timeLeft--;
        const timerEl = document.getElementById('l6-timer');
        const barEl   = document.getElementById('l6-timer-bar');
        const pct     = (timeLeft / 60) * 100;
        if (timerEl) {
          timerEl.textContent = `⏱ ${timeLeft}s`;
          if (timeLeft <= 10)      { timerEl.style.color = '#A32D2D'; timerEl.style.fontSize = '20px'; timerEl.style.animation = 'pulse 0.5s infinite'; }
          else if (timeLeft <= 20) { timerEl.style.color = '#E24B4A'; timerEl.style.fontSize = '18px'; timerEl.style.animation = ''; }
          else if (timeLeft <= 30) { timerEl.style.color = '#BA7517'; timerEl.style.animation = ''; }
        }
        if (barEl) {
          barEl.style.width = pct + '%';
          barEl.style.background = timeLeft <= 10 ? '#A32D2D' : timeLeft <= 20 ? '#E24B4A' : timeLeft <= 30 ? '#f5a623' : '#39d98a';
        }
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          if (!penalised) {
            penalised = true;
            G.fail('Time ran out — you paid full price. Lost a heart.');
            setTimeout(() => G.succeed(), 1600);
          } else {
            G.succeed();
          }
        }
      }, 1000);
    };

    const applyCode = (c) => {
      clearInterval(timerInterval);
      const msgEl = document.getElementById('l6-apply-msg');
      if (c.id === validId) {
        if (msgEl) msgEl.innerHTML = `<span style="color:#2D7A3A;font-weight:500;font-size:15px">✓ ${c.code} applied — ${c.pct}% off. New total: $${correctTotal}</span>`;
        setTimeout(() => G.succeed(), 1400);
      } else {
        if (!penalised) {
          penalised = true;
          G.fail(`${c.code} doesn't apply to your booking — lost a heart. Check the fine print.`);
        }
        if (msgEl) msgEl.innerHTML = `<span style="color:#A32D2D;font-size:14px">${c.code} doesn't apply to your booking. Read the conditions carefully.</span>`;
      }

      startTimer();
    };

    const renderMenu = (container) => {
      container.innerHTML = '';
      const current = stack[stack.length - 1];
      const isRoot  = stack.length === 1;

      container.insertAdjacentHTML('beforeend', `
        <div style="font-size:12px;color:#aaa;margin-bottom:8px">${stack.map(n => n.label).join(' › ')}</div>
      `);

      if (!isRoot) {
        const backBtn = document.createElement('button');
        backBtn.className = 'btn';
        backBtn.style.cssText = 'font-size:14px;margin-bottom:12px;padding:8px 16px;color:#555';
        backBtn.textContent = '← Back';
        backBtn.onclick = () => { stack.pop(); renderMenu(container); };
        container.appendChild(backBtn);
      }

      if (current.dead) {
        container.insertAdjacentHTML('beforeend', `
          <div class="fh" style="font-size:18px;margin-bottom:10px">${current.label}</div>
          <div class="fs" style="color:#aaa;font-size:15px">${current.deadMsg}</div>
        `);
        return;
      }

      if (current.coupon) {
        const c = current.coupon;
        if (c.dead) {
          container.insertAdjacentHTML('beforeend', `
            <div class="fh" style="font-size:18px;margin-bottom:10px">Offer Unavailable</div>
            <div class="fs" style="color:#aaa;font-size:15px">${c.deadMsg}</div>
          `);
          return;
        }
        container.insertAdjacentHTML('beforeend', `
          <div style="border-radius:10px;border:0.5px solid #e0e0d8;background:#fff;padding:24px">
            <div style="font-size:18px;font-weight:500;color:#111;margin-bottom:10px">${c.headline}</div>
            <div style="font-size:14px;color:#aaa;line-height:1.7;margin-bottom:14px">${c.fine}</div>
            <div style="font-size:16px;color:#534AB7;font-weight:500;margin-bottom:16px">Code: ${c.code}</div>
            <button class="btn btn-p" id="l6-apply-${c.id}" style="width:100%;font-size:16px;padding:14px">Apply ${c.code}</button>
          </div>
        `);
        document.getElementById(`l6-apply-${c.id}`).onclick = () => applyCode(c);
        return;
      }

      const list = document.createElement('div');
      list.style.cssText = 'display:flex;flex-direction:column;gap:12px;margin-top:8px';
      current.children.forEach(child => {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.style.cssText = 'text-align:left;font-size:16px;padding:16px 20px;width:100%';
        btn.textContent = child.label + ' ›';
        btn.onclick = () => { stack.push(child); renderMenu(container); };
        list.appendChild(btn);
      });
      container.appendChild(list);
    };

    el.innerHTML = '';
    el.insertAdjacentHTML('beforeend', `
      <div style="padding:16px 20px;border-radius:10px;background:#f9f9f7;border:0.5px solid #e0e0d8;font-size:15px;margin-bottom:14px;min-height:195px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div style="font-weight:500;color:#111;font-size:19px">DriveEasy — Your Booking</div>
          <div id="l6-timer" style="font-size:16px;font-weight:600;color:#555;font-variant-numeric:tabular-nums">⏱ 60s</div>
        </div>
        <div style="background:#eee;border-radius:4px;height:7px;overflow:hidden;margin-bottom:12px">
          <div id="l6-timer-bar" style="height:100%;width:100%;background:#39d98a;border-radius:4px;transition:width 1s linear,background .3s"></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;color:#555;margin-bottom:8px">
          <div>Car class: <strong>${carType}</strong></div>
          <div>Duration: <strong>${days} days</strong></div>
          <div>Base rate: <strong>$${baseRate}/day</strong></div>
          <div>Subtotal: <strong>$${subtotal}</strong></div>
          <div>First-time customer: <strong>${isFirstTime ? 'Yes' : 'No'}</strong></div>
          <div>Loyalty member: <strong>${hasMembership ? 'Yes' : 'No'}</strong></div>
          <div>Visa cardholder: <strong>${hasPartnerCard ? 'Yes' : 'No'}</strong></div>
        </div>
        <div id="l6-apply-msg" style="font-size:14px;margin-top:4px"></div>
      </div>
    `);

    const menuContainer = document.createElement('div');
    menuContainer.id = 'l6-menu';
    el.appendChild(menuContainer);
    renderMenu(menuContainer);
    startTimer();
  },
};

export default level6;