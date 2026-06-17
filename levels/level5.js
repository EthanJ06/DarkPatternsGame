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
    { trap: true, note: 'Items are pre-added and labeled "(added for you)" — as if this is a service, not a charge.' },
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

    const total = () => cart.reduce((a, c) => a + c.price, 0);

    const clearTimer = () => { clearInterval(timerInterval); timerInterval = null; };

    const resetTimer = () => { clearTimer(); secsLeft = TOTAL_SECS; inGrace = false; startTimer(); };

    const updateTimer = () => {
      const bar = document.getElementById('l5-timer-bar');
      const num = document.getElementById('l5-timer-num');
      const label = document.getElementById('l5-timer-label');
      if (!bar || !num || !label) return;

      if (inGrace) {
        bar.style.background = '#E24B4A';
        bar.style.width = '100%';
        bar.style.transition = 'none';
        bar.style.opacity = secsLeft % 2 === 0 ? '1' : '0.5';
        num.style.color = '#E24B4A';
        label.textContent = 'Finalizing your order...';
        label.style.color = '#E24B4A';
        label.style.fontWeight = '600';
        tick();
      } else {
        const pct = (secsLeft / TOTAL_SECS) * 100;
        bar.style.background = secsLeft <= 15 ? '#E24B4A' : '#F5A623';
        bar.style.width = pct + '%';
        bar.style.transition = 'width 1s linear';
        bar.style.opacity = '1';
        num.textContent = secsLeft + 's';
        num.style.color = secsLeft <= 15 ? '#E24B4A' : '#AAAAAA';
        label.textContent = secsLeft <= 15 ? 'Hurry, cart expires soon!' : 'Securing your cart...';
        label.style.color = secsLeft <= 15 ? '#E24B4A' : '#AAAAAA';
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
          inGrace = true;
          secsLeft = GRACE_SECS;
        } else if (secsLeft <= 0 && inGrace) {
          clearTimer();
          autoCheckout();
        }
      }, 1000);
    };

    const show = () => {
      const aiBanner = el.querySelector('.ai-banner');
      el.innerHTML = aiBanner ? aiBanner.outerHTML : '';

      el.insertAdjacentHTML('beforeend', `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px">
          <div style="font-size:10px;color:#aaa" id="l5-timer-label">Securing your cart...</div>
          <div style="font-size:10px;color:#aaa;font-weight:500;min-width:24px;text-align:right" id="l5-timer-num">${secsLeft}s</div>
        </div>
        <div class="tbar-t" style="margin-bottom:10px">
          <div class="tbar-f" id="l5-timer-bar" style="width:${(secsLeft / TOTAL_SECS) * 100}%;background:#f5a623;transition:width 1s linear"></div>
        </div>
        <div class="fh" style="font-size:13px">Your cart</div>
        <div style="margin-top:8px">
          ${cart.map((c, i) => `
            <div class="cart-item">
              <div class="cart-nm">${c.name}${c.sneaky ? ' <span class="sneaky">(added for you)</span>' : ''}</div>
              <div class="cart-pr">${c.price === 0 ? 'Free' : '$' + c.price.toFixed(2)}</div>
              ${c.rm ? `<button class="cart-rm" id="crm${i}">Remove</button>` : '<span style="width:44px"></span>'}
            </div>`).join('')}
        </div>
        <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:500;padding:8px 0;border-top:0.5px solid #e0e0d8;margin-top:4px">
          <span>Total</span><span>$${total().toFixed(2)}</span>
        </div>
        <div class="btn-row">
          <button class="btn btn-p" id="l5-co">Checkout →</button>
        </div>
        <div class="ftiny" style="margin-top:4px">Add-ons auto-renew. Free item becomes $9.99/mo after trial.</div>`);

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
        if (next) { cart.push(next); resetTimer(); }
        fail('An item crept back in — check your cart!');
        setTimeout(show, 1600);
      };

      trackHover(coBtn, 'l5co', () => almostGotYou(el, 'Check every line before clicking Checkout — new items may have appeared.'));
    };

    show();
    startTimer();
  },
};

export default level5;