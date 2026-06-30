const level6 = {
  id: 'l6',
  title: 'Level 6',
  isAI: false,
  goal: 'Find and apply all valid coupons to your car rental',
  hints: [
    "The coupons you need aren't on the main booking page — dig into Promotions & Savings.",
    "Check your booking details carefully against each coupon's fine print.",
  ],
  pattern: 'Obstruction',
  manip: 88,
  brief: "Obstruction means burying something you're entitled to so deep that most people give up. Car rental companies advertise discounts publicly but hide the actual codes behind layers of menus, knowing most customers will never find them and pay full price.",
  goalDetail: "You're booking a car with DriveEasy. The apply field is right there — but you don't have any codes yet. Navigate the menus to find all coupons that apply to your booking, then apply them.",
  dollars: {
    label: 'If you gave up and paid full price',
    amount: 0,
    period: 'fixed',
    note: 'The discounts you were entitled to — forfeited because the codes were impossible to find.',
  },
  desc: 'The apply field is visible. The coupon codes are buried in nested menus behind mislabeled categories and dead ends. Most people pay full price without ever finding them.',
  rw: {
    company: 'Enterprise / Hertz / Avis',
    detail: 'Major rental companies routinely advertise discount codes that are only accessible through obscure loyalty portals or buried menu paths. Consumer Reports found fewer than 15% of customers successfully applied valid discounts.',
    link: 'https://www.deceptive.design/hall-of-shame',
  },
  replay: [
    { trap: true,  note: '"Add-ons & Extras" seems like the right place — but it only shows paid upgrades.' },
    { trap: true,  note: '"Help & FAQ" has a page titled "How do I use a coupon?" with no actual codes.' },
    { trap: true,  note: '"Special Offers" shows pre-set deals but won\'t reveal member codes.' },
    { trap: false, note: 'Valid coupons are buried under Promotions & Savings across multiple sub-menus.' },
    { trap: true,  note: 'Applying a coupon that doesn\'t match your booking costs a heart — read the fine print.' },
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
      { id: 'c1', code: 'MEMBER10',  headline: '10% off — Member Reward',       fine: 'Valid for DriveEasy Loyalty members only. Applies to all car classes and rental durations.',          pct: 10, applies: () => hasMembership },
      { id: 'c2', code: 'FIRST20',   headline: '20% off — First-Time Customer', fine: 'For new DriveEasy customers only. Applies to all car classes and rental durations.',                  pct: 20, applies: () => isFirstTime },
      { id: 'c3', code: 'STAY25',    headline: '25% off — Long Stay Reward',    fine: 'Valid on rentals of 6 days or more. Applies to all car classes.',                                      pct: 25, applies: () => days >= 6 },
      { id: 'c4', code: 'SUV10',     headline: '10% off — SUV Special',         fine: 'Valid on SUV class bookings only. No minimum rental period.',                                          pct: 10, applies: () => carType === 'SUV' },
      { id: 'c5', code: 'WEEKEND15', headline: '15% off — Weekend Warrior',     fine: 'Valid on rentals of exactly 2 or 3 days only. Does not apply to rentals of 4 or more days.',          pct: 15, applies: () => days <= 3 },
      { id: 'c6', code: 'EXTEND20',  headline: '20% off — Extended Stay',       fine: 'Valid on rentals of 7 days or more. Compact and SUV only.',                                           pct: 20, applies: () => days >= 7 && (carType === 'Compact' || carType === 'SUV') },
      { id: 'c7', code: 'VISA10',    headline: '10% off — Visa Cardmember',     fine: 'Must pay with a qualifying Visa credit card. Applies to all car classes and rental durations.',       pct: 10, applies: () => hasPartnerCard },
      { id: 'c8', code: 'ECO5',      headline: '5% off — Economy Saver',        fine: 'Valid on Economy class rentals only. No minimum rental period.',                                      pct: 5,  applies: () => carType === 'Economy' },
    ];

    const validIds = new Set(ALL_COUPONS.filter(c => c.applies()).map(c => c.id));

    let runningTotal = subtotal;
    ALL_COUPONS.filter(c => c.applies()).forEach(c => {
      runningTotal = runningTotal - Math.round(runningTotal * (c.pct / 100));
    });
    const correctTotal = runningTotal;

    const TREE = {
      label: 'DriveEasy Booking',
      children: [
        {
          label: 'Add-ons & Extras',
          children: [
            { label: 'Add GPS',       dead: true, deadMsg: 'GPS rental — $8/day. This is a paid add-on, not a coupon.' },
            { label: 'Add insurance', dead: true, deadMsg: 'Insurance packages starting at $12/day. Not the right place for coupons.' },
            { label: 'Prepay fuel',   dead: true, deadMsg: 'Prepay fuel at today\'s rate. This is a paid add-on.' },
            { label: 'Extra driver',  dead: true, deadMsg: 'Add an extra driver for $5/day. Not a coupon page.' },
          ],
        },
        {
          label: 'Promotions & Savings',
          children: [
            {
              label: 'Member Discounts',
              children: [
                { label: 'How to join',     dead: true, deadMsg: 'Join DriveEasy Rewards for free at the front desk. No codes here.' },
                { label: 'Available Codes', coupon: ALL_COUPONS.find(c => c.id === 'c1') },
              ],
            },
            {
              label: 'New Customer Offers',
              children: [
                { label: 'About this offer', dead: true, deadMsg: 'First-time customers enjoy exclusive discounts. Sign up to access codes.' },
                { label: 'Available Codes',  coupon: ALL_COUPONS.find(c => c.id === 'c2') },
              ],
            },
            {
              label: 'Long Stay Deals',
              children: [
                { label: 'Available Codes', coupon: ALL_COUPONS.find(c => c.id === 'c3') },
                { label: 'Premium Codes',   coupon: ALL_COUPONS.find(c => c.id === 'c6') },
              ],
            },
            {
              label: 'Vehicle Class Offers',
              children: [
                { label: 'Available Codes', coupon: ALL_COUPONS.find(c => c.id === 'c4') },
                { label: 'Economy Codes',   coupon: ALL_COUPONS.find(c => c.id === 'c8') },
              ],
            },
            {
              label: 'Short Stay Deals',
              children: [
                { label: 'Available Codes', coupon: ALL_COUPONS.find(c => c.id === 'c5') },
              ],
            },
            {
              label: 'Partner Offers',
              children: [
                { label: 'Airline partners', dead: true, deadMsg: 'Earn AirMiles on your rental. No discount codes on this page.' },
                { label: 'Available Codes',  coupon: ALL_COUPONS.find(c => c.id === 'c7') },
              ],
            },
          ],
        },
        {
          label: 'Help & FAQ',
          children: [
            { label: 'How do I use a coupon?', dead: true, deadMsg: 'Enter your coupon code in the apply field on the booking page. (No codes provided here.)' },
            { label: 'Cancellation policy',    dead: true, deadMsg: 'Free cancellation up to 24 hours before pickup.' },
            { label: 'Contact support',        dead: true, deadMsg: 'Our team responds within 3–5 business days.' },
          ],
        },
        {
          label: 'Special Offers',
          children: [
            { label: 'Weekend deals',   dead: true, deadMsg: 'Pre-set weekend packages — these are not coupon codes.' },
            { label: 'Corporate rates', dead: true, deadMsg: 'Corporate accounts only. Contact your account manager.' },
            { label: 'Seasonal sales',  dead: true, deadMsg: 'Seasonal pricing applied automatically. No code needed — and no code provided.' },
          ],
        },
      ],
    };

    const stack        = [TREE];
    const foundCoupons = new Set();
    const appliedIds   = new Set();
    let penalised      = false;

    const updateRunningTotal = () => {
      let running = subtotal;
      ALL_COUPONS.filter(c => appliedIds.has(c.id)).forEach(c => {
        running = running - Math.round(running * (c.pct / 100));
      });
      const totalEl = document.getElementById('l6-current-total');
      if (totalEl) totalEl.textContent = `$${running}`;
    };

    const rebuildApplyArea = () => {
      const btnsEl = document.getElementById('l6-coupon-btns');
      if (!btnsEl) return;
      if (foundCoupons.size === 0) {
        btnsEl.innerHTML = `<div style="font-size:11px;color:#aaa">Browse the menu below to find available coupon codes.</div>`;
        return;
      }
      btnsEl.innerHTML = '';
      foundCoupons.forEach(couponId => {
        const c = ALL_COUPONS.find(x => x.id === couponId);
        if (!c) return;
        const applied = appliedIds.has(c.id);
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.style.cssText = `font-size:11px;text-align:left;${applied ? 'opacity:0.5;pointer-events:none;' : ''}`;
        btn.innerHTML = applied
          ? `✓ <strong>${c.code}</strong> — ${c.headline} (applied)`
          : `Apply <strong>${c.code}</strong> — ${c.headline}`;
        btn.onclick = () => applyCode(c);
        btnsEl.appendChild(btn);
      });
    };

    const applyCode = (c) => {
      const msgEl = document.getElementById('l6-apply-msg');
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
          G.fail(`${c.code} doesn't apply to your booking — lost a heart. Read the fine print carefully.`);
        }
        msgEl.innerHTML = `<span style="color:#A32D2D;font-size:11px">${c.code} doesn't apply to your booking. Check the conditions against your booking details.</span>`;
      }
    };

    const renderMenu = (container) => {
      container.innerHTML = '';
      const current = stack[stack.length - 1];
      const isRoot  = stack.length === 1;

      const crumb = stack.map(n => n.label).join(' › ');
      container.insertAdjacentHTML('beforeend', `
        <div style="font-size:10px;color:#aaa;margin-bottom:4px">${crumb}</div>
      `);

      if (!isRoot) {
        const backBtn = document.createElement('button');
        backBtn.className = 'btn';
        backBtn.style.cssText = 'font-size:11px;margin-bottom:8px;padding:4px 10px;color:#555';
        backBtn.textContent = '← Back';
        backBtn.onclick = () => { stack.pop(); renderMenu(container); };
        container.appendChild(backBtn);
      }

      if (current.dead) {
        container.insertAdjacentHTML('beforeend', `
          <div class="fh" style="font-size:13px">${current.label}</div>
          <div class="fs" style="color:#aaa">${current.deadMsg}</div>
        `);
        return;
      }

      if (current.coupon) {
        const c = current.coupon;
        foundCoupons.add(c.id);
        rebuildApplyArea();
        container.insertAdjacentHTML('beforeend', `
          <div style="border-radius:8px;border:0.5px solid #e0e0d8;background:#fff;padding:12px">
            <div style="font-size:13px;font-weight:500;color:#111;margin-bottom:4px">${c.headline}</div>
            <div style="font-size:10px;color:#aaa;line-height:1.5;margin-bottom:8px">${c.fine}</div>
            <div style="font-size:12px;color:#534AB7;font-weight:500">Code: ${c.code}</div>
          </div>
        `);
        return;
      }

      const list = document.createElement('div');
      list.style.cssText = 'display:flex;flex-direction:column;gap:6px;margin-top:4px';
      current.children.forEach(child => {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.style.cssText = 'text-align:left;font-size:13px';
        btn.textContent = child.label + ' ›';
        btn.onclick = () => { stack.push(child); renderMenu(container); };
        list.appendChild(btn);
      });
      container.appendChild(list);
    };

    // Initial render
    el.innerHTML = '';
    el.insertAdjacentHTML('beforeend', `
      <div style="padding:10px 12px;border-radius:8px;background:#f9f9f7;border:0.5px solid #e0e0d8;font-size:12px;margin-bottom:8px">
        <div style="font-weight:500;color:#111;margin-bottom:4px">DriveEasy — Your Booking</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:3px;color:#555;margin-bottom:6px">
          <div>Car class: <strong>${carType}</strong></div>
          <div>Duration: <strong>${days} days</strong></div>
          <div>Base rate: <strong>$${baseRate}/day</strong></div>
          <div>Subtotal: <strong>$${subtotal}</strong></div>
          <div style="grid-column:1/-1">After discounts: <strong id="l6-current-total" style="color:#2D7A3A">$${subtotal}</strong></div>
          <div>First-time customer: <strong>${isFirstTime ? 'Yes' : 'No'}</strong></div>
          <div>Loyalty member: <strong>${hasMembership ? 'Yes' : 'No'}</strong></div>
          <div>Visa cardholder: <strong>${hasPartnerCard ? 'Yes' : 'No'}</strong></div>
        </div>
        <div style="font-size:11px;color:#111;font-weight:500;margin-bottom:4px">Apply coupons</div>
        <div id="l6-apply-area">
          <div style="display:flex;flex-direction:column;gap:6px" id="l6-coupon-btns"></div>
          <div id="l6-apply-msg" style="font-size:11px;margin-top:4px"></div>
        </div>
      </div>
    `);

    rebuildApplyArea();

    const menuContainer = document.createElement('div');
    menuContainer.id = 'l6-menu';
    el.appendChild(menuContainer);
    renderMenu(menuContainer);
  },
};

export default level6;