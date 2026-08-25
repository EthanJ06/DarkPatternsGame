// js/levels/level5.js — Sneak into Basket

const TOTAL_SECS = 25;
const GRACE_SECS = 5;

const level5 = {
  id: "l5",
  title: "Level 5",
  isAI: false,
  goal: "Buy only what you want",
  hints: [
    "Scroll down — there may be items below the fold you haven't seen.",
    "Remove everything except 'Wireless headphones' before clicking Checkout.",
    "Watch the checkout confirmation screen closely — items can sneak back in there too.",
  ],
  pattern: "Sneak into Basket",
  brief: "Sneak into Basket means extra items are pre-added to your cart — warranties, subscriptions, insurance — often below the fold or in pale text. They count on you not scrolling, not reading, or just clicking through.",
  goalDetail: "You want to buy wireless headphones. Check your cart carefully and remove everything that wasn't on your list before checking out. Watch out — items may reappear, even after you've reached the checkout screen.",
  dollars: {
    label: "If you missed all three pre-added items",
    amount: 21.98,
    period: "one-time",
    note: "$21.98 extra at checkout — plus $119.88/year when the \"free\" NebulaPro trial auto-renews",
  },
  desc: "Extra items are pre-added and styled to blend in — below the fold, in pale text, or described as \"included\". They count on you not scrolling, not reading, or just clicking through.",
  rw: {
    company: "Sports Direct",
    detail: "Pre-added a £1 \"free\" mug and then travel insurance to customer carts. The UK Advertising Standards Authority ruled this illegal. Ryanair did the same with travel insurance for years before regulators intervened.",
    link: "https://www.deceptive.design/hall-of-shame",
  },
  replay: [
    { trap: true,  note: "Items are pre-added and labeled \"added for you\" — as if this is a service, not a charge." },
    { trap: true,  note: "The \"free\" trial item costs nothing today, but auto-renews at a recurring price disclosed only in fine print." },
    { trap: true,  note: "After items are removed and checkout is attempted, new ones are sneaked back in — creating an exhausting loop." },
    { trap: true,  note: "Even the checkout confirmation screen isn't safe — a new item can be added there, forcing you back to the cart to catch it." },
    { trap: false, note: "The only reliable defense is rereading every line in the cart immediately before paying, every time." },
    { trap: true,  note: "A countdown timer auto-places the order when it hits zero, framed as \"securing\" the cart rather than a forced checkout." },
  ],

  render(el) {
    let cart = [
      { name: "Wireless headphones", price: 49.99, rm: false, sneaky: false },
      { name: "2-year accident protection", price: 12.99, rm: true, sneaky: true },
      { name: "Premium cable 3-pack", price: 8.99, rm: true, sneaky: true },
      { name: "NebulaPro trial (auto-renews)", price: 0, rm: true, sneaky: true },
    ];
    const extras = [
      { name: "Device setup service", price: 4.99, rm: true, sneaky: true },
      { name: "Extended warranty (1yr)", price: 9.99, rm: true, sneaky: true },
      { name: "Round-up donation", price: 1.00, rm: true, sneaky: true },
      { name: "Premium gift wrap", price: 3.49, rm: true, sneaky: true },
      { name: "Priority handling fee", price: 6.99, rm: true, sneaky: true },
    ];

    let screen = "cart"; // "cart" | "confirm"
    let secsLeft = TOTAL_SECS;
    let inGrace = false;
    let timerInterval = null;

    const subtotal  = () => cart.reduce((a, c) => a + c.price, 0);
    const shipping   = () => (subtotal() >= 35 ? 0 : 4.99);
    const total      = () => subtotal() + shipping();
    const hasSneaky  = () => cart.some(c => c.sneaky);

    // Track progress by index, not by cart membership — otherwise removing
    // a sneaked item from the cart makes it look "unclaimed" again and it
    // gets offered forever instead of moving on to the next one.
    let extraIndex = 0;
    const nextExtra = () => (extraIndex < extras.length ? extras[extraIndex] : null);

    const clearTimer = () => { clearInterval(timerInterval); timerInterval = null; };

    const updateTimer = () => {
      const bar   = document.getElementById("l5-timer-bar");
      const num   = document.getElementById("l5-timer-num");
      const label = document.getElementById("l5-timer-label");
      if (!bar || !num || !label) return;

      if (inGrace) {
        const pct = (secsLeft / GRACE_SECS) * 100;
        bar.style.background  = "#E24B4A";
        bar.style.width       = pct + "%";
        bar.style.transition  = "width 1s linear";
        bar.style.opacity     = "1";
        num.textContent        = secsLeft + "s";
        num.style.color        = "#E24B4A";
        label.textContent      = "Finalizing your order...";
        label.style.color      = "#E24B4A";
        label.style.fontWeight = "600";
      } else {
        const pct = (secsLeft / TOTAL_SECS) * 100;
        bar.style.background  = secsLeft <= 5 ? "#E24B4A" : "#F5A623";
        bar.style.width       = pct + "%";
        bar.style.transition  = "width 1s linear";
        bar.style.opacity     = "1";
        num.textContent       = secsLeft + "s";
        num.style.color       = secsLeft <= 5 ? "#E24B4A" : "#AAAAAA";
        label.textContent     = secsLeft <= 5 ? "Hurry, cart expires soon!" : "Securing your cart...";
        label.style.color     = secsLeft <= 5 ? "#E24B4A" : "#AAAAAA";
        label.style.fontWeight = "normal";
      }
    };

    const autoCheckout = () => {
      if (!hasSneaky()) { clearTimer(); succeed(); return; }
      clearTimer();
      setLevelGrade(levelIdx, "F");
      fail("Time ran out — your order was placed with extra items!");
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

    const cartItemHtml = (c, i, removable) => `
      <div class="cart-item" style="align-items:flex-start;padding:14px 0">
        <div style="flex:1;min-width:0">
          <div class="cart-nm" style="font-weight:500">${c.name}</div>
          <div class="cart-qty">Qty: 1</div>
          ${c.sneaky ? '<div class="sneaky-pill">Added for you</div>' : ''}
        </div>
        <div style="text-align:right;flex-shrink:0">
          <div class="cart-pr" style="font-weight:600;color:#111">${c.price === 0 ? 'Free' : '$' + c.price.toFixed(2)}</div>
          ${removable && c.rm ? `<button class="cart-rm" id="crm${i}" style="margin-top:7px">Remove</button>` : ''}
        </div>
      </div>`;

    const timerBlockHtml = () => `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <div style="font-size:14px;color:#aaa" id="l5-timer-label">Securing your cart...</div>
        <div style="font-size:14px;color:#aaa;font-weight:500;min-width:32px;text-align:right" id="l5-timer-num">${secsLeft}s</div>
      </div>
      <div class="tbar-t" style="margin-bottom:20px">
        <div class="tbar-f" id="l5-timer-bar" style="width:${(secsLeft / TOTAL_SECS) * 100}%;background:#f5a623;transition:width 1s linear"></div>
      </div>`;

    const showCart = () => {
      screen = "cart";
      const aiBanner = el.querySelector(".ai-banner");
      el.innerHTML = aiBanner ? aiBanner.outerHTML : "";

      el.insertAdjacentHTML("beforeend", `
        <div style="overflow-y:auto;min-height:0;display:flex;flex-direction:column">
          ${timerBlockHtml()}

          <div class="store-header" style="padding-bottom:14px;border-bottom:1px solid #e8e8e4;margin-bottom:0">
            <div>
              <div class="store-title">NebulaPro Store</div>
              <div class="store-sub">Your cart &middot; ${cart.length} item${cart.length === 1 ? '' : 's'}</div>
            </div>
          </div>

          <div>
            ${cart.map((c, i) => cartItemHtml(c, i, true)).join('')}
          </div>

          <div class="order-summary" style="margin-top:8px">
            <div class="order-summary-row"><span>Subtotal</span><span>$${subtotal().toFixed(2)}</span></div>
            <div class="order-summary-row"><span>Shipping</span><span>${shipping() === 0 ? 'Free' : '$' + shipping().toFixed(2)}</span></div>
            <div class="order-summary-total"><span>Estimated total</span><span>$${total().toFixed(2)}</span></div>
          </div>

          <div class="btn-row" style="margin-top:14px">
            <button class="btn btn-p" id="l5-co" style="width:100%;padding:15px;border-radius:9px">Proceed to secure checkout →</button>
          </div>
          <div class="ftiny" style="margin-top:8px;text-align:center">Add-ons auto-renew. Free item becomes $9.99/mo after trial.</div>
        </div>`);

      cart.forEach((_, i) => {
        const b = document.getElementById("crm" + i);
        if (b) b.onclick = () => { cart.splice(i, 1); showCart(); };
      });

      document.getElementById("l5-co").onclick = () => goToConfirm();
    };

    // Landing on the confirm screen is itself a trap: a new item gets
    // sneaked into the cart every time you arrive here.
    const goToConfirm = () => {
      const added = nextExtra();
      if (added) { cart.push(added); extraIndex++; }
      screen = "confirm";
      showConfirm(!!added);
    };

    const showConfirm = (justSneaked) => {
      const aiBanner = el.querySelector(".ai-banner");
      el.innerHTML = aiBanner ? aiBanner.outerHTML : "";

      el.insertAdjacentHTML("beforeend", `
        <div style="overflow-y:auto;min-height:0;display:flex;flex-direction:column">
          ${timerBlockHtml()}

          <div class="store-header" style="padding-bottom:14px;border-bottom:1px solid #e8e8e4;margin-bottom:0">
            <div>
              <div class="store-title">Confirm your order</div>
              <div class="store-sub">Review before you pay &middot; ${cart.length} item${cart.length === 1 ? '' : 's'}</div>
            </div>
          </div>

          ${justSneaked ? `<div class="ftiny" style="margin-top:10px;color:#E24B4A">Almost there — just finalizing your order details.</div>` : ''}

          <div>
            ${cart.map((c, i) => cartItemHtml(c, i, false)).join('')}
          </div>

          <div class="order-summary" style="margin-top:8px">
            <div class="order-summary-row"><span>Subtotal</span><span>$${subtotal().toFixed(2)}</span></div>
            <div class="order-summary-row"><span>Shipping</span><span>${shipping() === 0 ? 'Free' : '$' + shipping().toFixed(2)}</span></div>
            <div class="order-summary-total"><span>Estimated total</span><span>$${total().toFixed(2)}</span></div>
          </div>

          <div class="btn-row" style="margin-top:14px">
            <button class="btn btn-p" id="l5-place" style="width:100%;padding:15px;border-radius:9px">Place order →</button>
          </div>
          <div style="text-align:center;margin-top:12px">
            <span id="l5-back" style="font-size:14px;color:#888;text-decoration:underline;cursor:pointer">← Back to cart</span>
          </div>
        </div>`);

      document.getElementById("l5-back").onclick = () => showCart();

      document.getElementById("l5-place").onclick = () => {
        if (hasSneaky()) {
          fail("Wait — an item was added to your order. Go back and check your cart!");
          return;
        }
        clearTimer();
        succeed();
      };
    };

    showCart();
    startTimer();
  },
};

export default level5;