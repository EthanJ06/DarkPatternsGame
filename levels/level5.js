// js/levels/level5.js — Sneak into Basket

const TOTAL_SECS = 15;
const GRACE_SECS = 5;

const level5 = {
  id: 'l5',
  title: 'Level 5',
  isAI: false,
  goal: 'Buy only what you want',
  hints: [
    "Scroll down — there may be items below the fold you haven't seen.",
    "Remove everything except 'Wireless headphones' before clicking Checkout.",
  ],
  pattern: 'Sneak into Basket',
  manip: 80,
  brief: "Sneak into Basket means extra items are pre-added to your cart — warranties, subscriptions, insurance — often below the fold or in pale text. They count on you not scrolling, not reading, or just clicking through.",
  goalDetail: "You want to buy wireless headphones. Check your cart carefully and remove everything that wasn't on your list before checking out. Watch out — items may reappear.",
  dollars: {
    label: 'If you missed all three pre-added items',
    amount: 21.98,
    period: 'one-time',
    note: '$21.98 extra at checkout — plus $119.88/year when the "free" NebulaPro trial auto-renews',
  },
  desc: 'Extra items are pre-added and styled to blend in — below the fold, in pale text, or described as "included". They count on you not scrolling, not reading, or just clicking through.',
  rw: {
    company: 'Sports Direct',
    detail: 'Pre-added a £1 "free" mug and then travel insurance to customer carts. The UK Advertising Standards Authority ruled this illegal. Ryanair did the same with travel insurance for years before regulators intervened.',
    link: 'https://www.deceptive.design/hall-of-shame',
  },
  replay: [
    { trap: true, note: 'Items are pre-added and labeled "added for you" — as if this is a service, not a charge.' },
    { trap: true, note: 'The "free" trial item costs nothing today, but auto-renews at $9.99/mo. The price is in fine print.' },
    { trap: true, note: 'After you remove items and try to check out, new ones are sneaked in. The checkout loop creates exhaustion.' },
    { trap: false, note: 'The only safe move: read every line before clicking Checkout, every time.' },
    { trap: true, note: 'The countdown timer auto-placed your order when it hit zero — framed as "Securing your cart" but actually a forced checkout. Ticketmaster and airline booking sites use exactly this mechanic.' },
  ],

  render(el) {
    let cart = [
      { name: 'Wireless headphones', price: 49.99, rm: false, sneaky: false },
      { name: '2-year accident protection', price: 12.99, rm: true, sneaky: true },
      { name: 'Premium cable 3-pack', price: 8.99, rm: true, sneaky: true },
      { name: 'NebulaPro trial (auto-renews)', price: 0, rm: true, sneaky: true },
    ];
    const extras = [
      { name: 'Device setup service', price: 4.99, rm: true, sneaky: true },
      { name: 'Extended warranty (1yr)', price: 9.99, rm: true, sneaky: true },
      { name: 'Round-up donation', price: 1.00, rm: true, sneaky: true },
    ];

    let secsLeft = TOTAL_SECS;
    let inGrace = false;
    let timerInterval = null;

    const subtotal  = () => cart.reduce((a, c) => a + c.price, 0);
    const shipping   = () => (subtotal() >= 35 ? 0 : 4.99);
    const total      = () => subtotal() + shipping();

    const clearTimer = () => { clearInterval(timerInterval); timerInterval = null; };

    const updateTimer = () => {
      const bar   = document.getElementById('l5-timer-bar');
      const num   = document.getElementById('l5-timer-num');
      const label = document.getElementById('l5-timer-label');
      if (!bar || !num || !label) return;

      if (inGrace) {
        const pct = (secsLeft / GRACE_SECS) * 100;
        bar.style.background  = '#E24B4A';
        bar.style.width       = pct + '%';
        bar.style.transition  = 'width 1s linear';
        bar.style.opacity     = '1';
        num.textContent        = secsLeft + 's';
        num.style.color        = '#E24B4A';
        label.textContent      = 'Finalizing your order...';
        label.style.color      = '#E24B4A';
        label.style.fontWeight = '600';
        tick();
      } else {
        const pct = (secsLeft / TOTAL_SECS) * 100;
        bar.style.background  = secsLeft <= 5 ? '#E24B4A' : '#F5A623';
        bar.style.width       = pct + '%';
        bar.style.transition  = 'width 1s linear';
        bar.style.opacity     = '1';
        num.textContent       = secsLeft + 's';
        num.style.color       = secsLeft <= 5 ? '#E24B4A' : '#AAAAAA';
        label.textContent     = secsLeft <= 5 ? 'Hurry, cart expires soon!' : 'Securing your cart...';
        label.style.color     = secsLeft <= 5 ? '#E24B4A' : '#AAAAAA';
        label.style.fontWeight = 'normal';
      }
    };

    const autoCheckout = () => {
      const hasSneaky = cart.some(c => c.sneaky);
      if (!hasSneaky) { clearTimer(); succeed(); return; }
      clearTimer();
      setLevelGrade(levelIdx, 'F');
      fail('Time ran out — your order was placed with extra items!');
      setTimeout(() => showDebrief(false), 1900);
    };

    const startTimer = () => {
      timerInterval = setInterval(() => {
        secsLeft--;
        updateTimer();
        if (secsLeft <= 0 && !inGrace) {
          inGrace  = true;
          secsLeft = GRACE_SECS;
        } else if (secsLeft <= 0 && inGrace) {
          clearTimer();
          autoCheckout();
        }
      }, 1000);
    };

    const cartItemHtml = (c, i) => `
      <div class="cart-item" style="align-items:flex-start;padding:10px 0">
        <div style="flex:1;min-width:0">
          <div class="cart-nm" style="font-weight:500">${c.name}</div>
          <div class="cart-qty">Qty: 1</div>
          ${c.sneaky ? '<div class="sneaky-pill">Added for you</div>' : ''}
        </div>
        <div style="text-align:right;flex-shrink:0">
          <div class="cart-pr" style="font-weight:600;color:#111">${c.price === 0 ? 'Free' : '$' + c.price.toFixed(2)}</div>
          ${c.rm ? `<button class="cart-rm" id="crm${i}" style="margin-top:5px">Remove</button>` : ''}
        </div>
      </div>`;

    const show = () => {
      const aiBanner = el.querySelector('.ai-banner');
      el.innerHTML = aiBanner ? aiBanner.outerHTML : '';

      el.insertAdjacentHTML('beforeend', `
        <div style="overflow-y:auto;min-height:0;display:flex;flex-direction:column">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px">
            <div style="font-size:10px;color:#aaa" id="l5-timer-label">Securing your cart...</div>
            <div style="font-size:10px;color:#aaa;font-weight:500;min-width:24px;text-align:right" id="l5-timer-num">${secsLeft}s</div>
          </div>
          <div class="tbar-t" style="margin-bottom:14px">
            <div class="tbar-f" id="l5-timer-bar" style="width:${(secsLeft / TOTAL_SECS) * 100}%;background:#f5a623;transition:width 1s linear"></div>
          </div>

          <div class="store-header" style="padding-bottom:10px;border-bottom:1px solid #e8e8e4;margin-bottom:0">
            <div>
              <div class="store-title">NebulaPro Store</div>
              <div class="store-sub">Your cart &middot; ${cart.length} item${cart.length === 1 ? '' : 's'}</div>
            </div>
          </div>

          <div>
            ${cart.map((c, i) => cartItemHtml(c, i)).join('')}
          </div>

          <div class="order-summary" style="margin-top:6px">
            <div class="order-summary-row"><span>Subtotal</span><span>$${subtotal().toFixed(2)}</span></div>
            <div class="order-summary-row"><span>Shipping</span><span>${shipping() === 0 ? 'Free' : '$' + shipping().toFixed(2)}</span></div>
            <div class="order-summary-total"><span>Estimated total</span><span>$${total().toFixed(2)}</span></div>
          </div>

          <div class="btn-row" style="margin-top:10px">
            <button class="btn btn-p" id="l5-co" style="width:100%;padding:11px;border-radius:9px">Proceed to secure checkout →</button>
          </div>
          <div class="ftiny" style="margin-top:6px;text-align:center">Add-ons auto-renew. Free item becomes $9.99/mo after trial.</div>
        </div>`);

      // Bind remove buttons
      cart.forEach((_, i) => {
        const b = document.getElementById('crm' + i);
        if (b) b.onclick = () => { cart.splice(i, 1); show(); };
      });

      // Bind checkout
      const coBtn = document.getElementById('l5-co');
      coBtn.onclick = () => {
        const hasSneaky = cart.some(c => c.sneaky);
        if (!hasSneaky) { clearTimer(); succeed(); return; }
        const next = extras.find(e => !cart.find(c => c.name === e.name));
        if (next) cart.push(next);
        fail('An item crept back in — check your cart!');
        setTimeout(show, 1600);
      };

    };

    show();
    startTimer();
  },
};

export default level5;