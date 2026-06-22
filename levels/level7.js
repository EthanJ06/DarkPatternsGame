// js/levels/level7.js — Fake Scarcity / Urgency

const NOTIFICATIONS = [
  "Sarah from New York just purchased this item",
  "Marcus from Austin just purchased this item",
  "Priya from Seattle just purchased this item",
  "David from Chicago just purchased Wireless Earbuds",
  "Emma from Boston just purchased this item",
];

const STYLES = `
  .l7-topbar{background:#232f3e;padding:6px 10px;display:flex;align-items:center;gap:6px;border-radius:8px 8px 0 0}
  .l7-searchbox{flex:1;background:#fff;border-radius:4px;display:flex;align-items:center;padding:0 8px;height:28px;gap:5px}
  .l7-searchbox input{flex:1;border:none;outline:none;font-size:12px;color:#111;background:transparent}
  .l7-sbtn{background:#febd69;border:none;padding:0 8px;height:28px;font-size:13px;cursor:pointer;border-radius:0 3px 3px 0}
  .l7-cartbtn{position:relative;background:#37475a;border:none;height:28px;padding:0 9px;border-radius:4px;cursor:pointer;display:flex;align-items:center;gap:5px;color:#fff;font-size:12px;font-family:inherit;flex-shrink:0}
  .l7-cartbtn:hover{background:#41566c}
  .l7-cartbadge{position:absolute;top:-5px;right:-5px;background:#febd69;color:#111;font-size:9px;font-weight:700;border-radius:50%;min-width:15px;height:15px;display:flex;align-items:center;justify-content:center;padding:0 2px}
  .l7-feed{max-height:320px;overflow-y:auto;overflow-x:hidden;display:flex;flex-direction:column;gap:0;border:0.5px solid #e0e0d8;border-radius:0 0 8px 8px}
  .l7-banner{padding:6px 10px;font-size:11px;font-weight:500;display:flex;align-items:center;justify-content:space-between;border-bottom:0.5px solid #e8e8e4}
  .l7-banner.red{background:#FCEBEB;color:#A32D2D}
  .l7-banner.amber{background:#FAEEDA;color:#854F0B}
  .l7-banner.blue{background:#E6F1FB;color:#185FA5}
  .l7-product{padding:9px 10px;border-bottom:0.5px solid #e8e8e4;display:flex;gap:8px;background:#fff}
  .l7-product:hover{background:#f9f9f7}
  .l7-pimg{width:56px;height:56px;border-radius:5px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:20px;background:#f5f5f2}
  .l7-pbody{flex:1;display:flex;flex-direction:column;gap:2px;min-width:0}
  .l7-ptitle{font-size:12px;color:#111;line-height:1.4}
  .l7-pstars{font-size:10px;color:#854F0B}
  .l7-pprice{font-size:13px;font-weight:500;color:#111}
  .l7-pprice .orig{font-size:10px;text-decoration:line-through;color:#aaa;margin-left:4px;font-weight:400}
  .l7-pbadge{font-size:9px;font-weight:500;padding:2px 5px;border-radius:3px;display:inline-block;margin-top:1px}
  .l7-br{background:#FCEBEB;color:#A32D2D}
  .l7-ba{background:#FAEEDA;color:#633806}
  .l7-bb{background:#E6F1FB;color:#0C447C}
  .l7-bg{background:#EAF3DE;color:#27500A}
  .l7-pmeta{font-size:10px;color:#aaa}
  .l7-notif{padding:5px 10px;font-size:10px;color:#888;background:#f9f9f7;border-bottom:0.5px solid #f0f0ec;font-style:italic}
  .l7-sechead{padding:5px 10px;font-size:10px;font-weight:500;color:#888;background:#f0f0ec;border-bottom:0.5px solid #e8e8e4;text-transform:uppercase;letter-spacing:.05em}
  .l7-addbtn{align-self:flex-start;margin-top:3px;background:#febd69;border:none;border-radius:4px;padding:4px 9px;font-size:11px;font-weight:500;cursor:pointer;color:#111;font-family:inherit}
  .l7-addbtn:hover{opacity:.9}
  .l7-addbtn.added{background:#EAF3DE;color:#27500A}
  .l7-cart{padding:12px;display:flex;flex-direction:column;gap:8px;background:#fff;border:0.5px solid #e0e0d8;border-radius:0 0 8px 8px}
  .l7-crow{display:flex;justify-content:space-between;align-items:center;font-size:12px;padding:5px 0;border-bottom:0.5px solid #e8e8e4;gap:8px}
  .l7-crow:last-of-type{border-bottom:none}
  .l7-crow .l7-cname{flex:1;color:#111}
  .l7-cremove{background:none;border:none;color:#0C447C;font-size:11px;cursor:pointer;font-family:inherit;padding:2px 4px;flex-shrink:0}
  .l7-cremove:hover{text-decoration:underline}
  .l7-ctotal{display:flex;justify-content:space-between;font-size:13px;font-weight:500;padding-top:6px;border-top:0.5px solid #ccc}
  .l7-tbar{height:3px;background:#eee;border-radius:2px;overflow:hidden;margin-bottom:2px}
  .l7-tfill{height:100%;background:#E24B4A;border-radius:2px;transition:width 1s linear}
  .l7-obtn{background:#febd69;border:none;border-radius:5px;padding:8px;font-size:13px;font-weight:500;cursor:pointer;width:100%;color:#111;font-family:inherit}
  .l7-obtn:hover{opacity:.9}
  .l7-backbtn{background:none;border:none;color:#0C447C;font-size:11px;cursor:pointer;font-family:inherit;text-align:left;padding:0;align-self:flex-start}
  .l7-backbtn:hover{text-decoration:underline}
  .l7-goalbar{background:#232f3e;color:#ddd;font-size:10px;padding:4px 10px;text-align:center;border-radius:0}
  .l7-empty{padding:24px;text-align:center;color:#aaa;font-size:12px}
`;

function injectStyles() {
  if (document.getElementById('l7-style')) return;
  const s = document.createElement('style');
  s.id = 'l7-style';
  s.textContent = STYLES;
  document.head.appendChild(s);
}

function fmt(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m + ':' + (sec < 10 ? '0' : '') + sec;
}

function randViewers() {
  return Math.floor(Math.random() * 120) + 780;
}

const level7 = {
  id: 'l7',
  title: 'Level 7',
  isAI: false,
  goal: 'Buy only what you want, without getting distracted',
  hints: [
    "Several backpacks are in the feed, but only one is the exact target — 'Adventure Backpack — 40L'. Check the title carefully before adding.",
    "Add the real backpack whenever you spot it, then open your cart from the top-right and remove anything else that's snuck in before placing the order.",
  ],
  pattern: 'Fake Scarcity / Urgency',
  manip: 82,
  brief: "Fake scarcity and urgency are designed to impair your decision-making with a false deadline to rush you into decisions. Countdown timers, 'Only 2 left!', and '847 people viewing' create a sense of panic that makes you act before you think. Almost none of it is real.",
  goalDetail: "You want to buy one specific item: the Adventure Backpack — 40L. Several other backpacks are mixed into the feed as decoys. Scroll, add the real one to your cart, and check out with only that item. Open your cart any time from the top-right — but watch out for anything that ends up in there that you didn't add yourself.",
  dollars: {
    label: 'If every urgency signal worked on you',
    amount: 47.97,
    period: 'one-time',
    note: "$47.97 in impulse purchases triggered by fake scarcity — plus a subscription you didn't need",
  },
  desc: 'Countdown timers, fake stock warnings, and social proof pressure combine to make you act before you think. Studies show urgency increases conversion by up to 332% — almost none of the scarcity is real.',
  rw: {
    company: 'Booking.com',
    detail: 'Fined by the UK CMA in 2019 for fake "Only 1 room left!" and "8 people looking at this" messages. Internal data showed the stock counts were fabricated. The practice remains widespread.',
    link: 'https://www.deceptive.design/hall-of-shame',
  },
  replay: [
    { trap: true, note: 'The countdown bar and the "Lightning Deal ends in 02:13" banner both tick down, then quietly reset to their starting values. Neither one ever actually expires into anything — the urgency is manufactured.' },
    { trap: true, note: '"Only 2 left in stock" — the number is static and never changes regardless of how many people "buy". It exists purely to trigger loss aversion.' },
    { trap: true, note: '"847 people viewing" — a randomly generated number refreshed on a loop. No real data underlies it.' },
    { trap: true, note: 'Multiple near-identical backpacks are mixed into the feed. Picking any of them except the exact target counts as a miss — read titles carefully, not just the product icon.' },
    { trap: true, note: 'An item can sneak into your cart even though you never clicked "add" — exactly how pre-checked add-ons work in real checkouts.' },
    { trap: false, note: 'The winning move: ignore all timers and counters, read each title in full, and double-check your cart contents right before you place the order.' },
  ],

  render(el) {
    injectStyles();

    let cart = [];     // [{ name, price, sneaky }]
    let cartTimer = 300;
    let cartInterval = null;
    let sneakInjected = false;
    let dealSecsLeft = 133;   // drives the "Lightning Deal ends in 02:13" banner
    let view = 'feed'; // 'feed' | 'cart'

    el.innerHTML = '';

    const TARGET_NAME = 'Adventure Backpack — 40L';
    const TARGET_PRICE = 39.99;

    const ITEMS = [
      { t: 'banner', cls: 'red', txt: '⚡ Lightning Deal ends in 02:13', id: 'l7-dealtimer' },
      { t: 'product', img: '🎧', title: 'Wireless Earbuds Pro Max', stars: '★★★★☆ (12,481)', price: 24.99, orig: 49.99, badges: [['l7-br', '⚡ 68% off'], ['l7-ba', '847 viewed today']], meta: 'Ships today' },
      { t: 'notif', txt: NOTIFICATIONS[0] },
      { t: 'banner', cls: 'amber', txt: '50% Off Phone Chargers — Limited Time' },
      { t: 'product', img: '🔌', title: 'Ultra-Fast 65W Charger 3-Pack', stars: '★★★★★ (8,203)', price: 14.99, orig: 29.99, badges: [['l7-br', 'Only 2 left!'], ['l7-ba', 'Deal ends in 09:59']], meta: 'Often bought with earbuds' },
      { t: 'sec', txt: "Today's Deals" },
      { t: 'product', img: '⌚', title: 'SmartBand Fitness Tracker', stars: '★★★★☆ (5,602)', price: 39.99, orig: 79.99, badges: [['l7-bb', 'Flash Sale'], ['l7-ba', '72 people viewing']], meta: '' },
      { t: 'notif', txt: NOTIFICATIONS[1] },
      { t: 'banner', cls: 'red', txt: 'Flash Sale ends in 07:44' },
      { t: 'product', img: '🖱️', title: 'Ergonomic Wireless Mouse', stars: '★★★★☆ (3,891)', price: 19.99, orig: 35.99, badges: [['l7-ba', 'Offer expires soon'], ['l7-br', 'Hot deal']], meta: 'Ships in 1-2 days' },
      { t: 'sec', txt: 'Trending in bags' },
      { t: 'notif', txt: NOTIFICATIONS[2] },
      { t: 'product', img: '🎒', title: 'Mini Daypack — 12L', stars: '★★★☆☆ (1,447)', price: 17.99, orig: null, badges: [['l7-bg', 'Compact & lightweight']], meta: '' },
      { t: 'product', img: '👜', title: 'Tote Bag Set (3-pack)', stars: '★★★☆☆ (2,104)', price: 22.99, orig: null, badges: [['l7-bg', '1,438 bought last month']], meta: '' },
      { t: 'banner', cls: 'blue', txt: 'Free shipping on orders over $35' },
      { t: 'product', img: '🎒', title: 'School Backpack — 20L', stars: '★★★☆☆ (980)', price: 16.49, orig: null, badges: [['l7-bg', 'Budget pick']], meta: '' },
      { t: 'product', img: '💼', title: 'Rolling Carry-On Suitcase', stars: '★★★★☆ (7,230)', price: 89.99, orig: 139.99, badges: [['l7-ba', 'Deal ends tonight'], ['l7-br', 'Only 3 left!']], meta: '' },
      { t: 'notif', txt: NOTIFICATIONS[3] },
      { t: 'sec', txt: 'You might also like' },
      { t: 'product', img: '🎒', title: 'Laptop Backpack — 25L', stars: '★★★★☆ (3,310)', price: 28.99, orig: 34.99, badges: [['l7-ba', 'Padded laptop sleeve']], meta: '' },
      { t: 'product', img: '🎒', title: TARGET_NAME, stars: '★★★★☆ (4,892)', price: TARGET_PRICE, orig: null, badges: [['l7-ba', 'Trending'], ['l7-br', 'Only 1 left in stock!']], meta: randViewers() + ' people viewed today', isTarget: true },
      { t: 'notif', txt: NOTIFICATIONS[4] },
      { t: 'product', img: '🎒', title: 'Hiking Backpack — 50L', stars: '★★★★☆ (2,675)', price: 64.99, orig: 79.99, badges: [['l7-br', 'Limited stock']], meta: '' },
    ];

    // ── Cart helpers ──────────────────────────────────────────────────────
    const inCart = name => cart.some(c => c.name === name);

    const addToCart = (name, price, sneaky = false) => {
      if (inCart(name)) return;
      cart.push({ name, price, sneaky });
      updateCartBadge();
    };

    const removeFromCart = name => {
      cart = cart.filter(c => c.name !== name);
      updateCartBadge();
      if (view === 'cart') renderCart();
    };

    const updateCartBadge = () => {
      const b = document.getElementById('l7-cartbadge');
      if (!b) return;
      if (cart.length > 0) { b.textContent = cart.length; b.style.display = 'flex'; }
      else b.style.display = 'none';
    };

    // ── Timer (runs immediately and continuously) ─────────────────────────
    const clearTimer = () => {
      clearInterval(cartInterval);
      cartInterval = null;
    };

    const startTimer = () => {
      clearTimer();

      cartInterval = setInterval(() => {
        cartTimer--;

        const lbl = document.getElementById('l7-clabel');
        const bar = document.getElementById('l7-cbar');

        if (lbl) {
          lbl.textContent = 'Flash deal ends in ' + fmt(cartTimer);
        }

        if (bar) {
          bar.style.width = ((cartTimer / 300) * 100) + '%';
          bar.style.background = cartTimer < 60 ? '#E24B4A' : '#854F0B';
        }

        // fake lightning-deal banner
        dealSecsLeft--;
        if (dealSecsLeft <= 0) dealSecsLeft = 133;

        const dealEl = document.getElementById('l7-dealtimer');
        if (dealEl) {
          dealEl.textContent =
            '⚡ Lightning Deal ends in ' + fmt(dealSecsLeft);
        }

        // sneak-in-basket
        if (!sneakInjected && cartTimer <= 270 && inCart(TARGET_NAME)) {
          sneakInjected = true;

          cart.push({
            name: 'Extended warranty (1yr)',
            price: 9.99,
            sneaky: true
          });

          updateCartBadge();

          if (view === 'cart') {
            renderCart();
          }
        }

        // fake deadline resets forever
        if (cartTimer <= 0) {
          cartTimer = 300;
        }
      }, 1000);
    };

    // ── Render: top bar (persists across views) ────────────────────────────
    const renderShell = () => {
      el.innerHTML = '';
      el.insertAdjacentHTML('beforeend', `
        <div class="l7-goalbar" id="l7-goalbar">Goal: buy only the adventure backpack — check your cart before ordering</div>
        <div class="l7-topbar">
          <div style="color:#fff;font-size:13px;font-weight:500;letter-spacing:-.5px">QuickCart</div>
          <div class="l7-searchbox">
            <span style="font-size:13px;color:#888">&#128269;</span>
            <input id="l7-search" placeholder="Search..." value="backpack">
          </div>
          <button class="l7-cartbtn" id="l7-cartbtn">
            🛒 Cart
            <span class="l7-cartbadge" id="l7-cartbadge" style="display:none">0</span>
          </button>
        </div>
        <div id="l7-view"></div>`);

      document.getElementById('l7-cartbtn').onclick = () => { view = 'cart'; renderCart(); };
      updateCartBadge();
    };

    // ── Render: feed view ───────────────────────────────────────────────────
    const renderFeed = () => {
      view = 'feed';
      const host = document.getElementById('l7-view');
      if (!host) { renderShell(); return renderFeed(); }
      host.innerHTML = '<div class="l7-feed" id="l7-feed"></div>';
      const feed = document.getElementById('l7-feed');

      ITEMS.forEach(item => {
        const d = document.createElement('div');
        if (item.t === 'banner') {
          d.className = 'l7-banner ' + item.cls;
          d.textContent = item.txt;
          if (item.id) d.id = item.id;
        } else if (item.t === 'sec') {
          d.className = 'l7-sechead';
          d.textContent = item.txt;
        } else if (item.t === 'notif') {
          d.className = 'l7-notif';
          d.textContent = item.txt;
        } else if (item.t === 'product') {
          d.className = 'l7-product';
          const bdgs = item.badges.map(([cls, txt]) => `<span class="l7-pbadge ${cls}">${txt}</span>`).join(' ');
          const already = inCart(item.title);
          d.innerHTML = `
            <div class="l7-pimg">${item.img}</div>
            <div class="l7-pbody">
              <div class="l7-ptitle">${item.title}</div>
              <div class="l7-pstars">${item.stars}</div>
              <div class="l7-pprice">$${item.price.toFixed(2)}${item.orig ? `<span class="orig">$${item.orig.toFixed(2)}</span>` : ''}</div>
              <div style="display:flex;gap:3px;flex-wrap:wrap;margin-top:2px">${bdgs}</div>
              ${item.meta ? `<div class="l7-pmeta" ${item.isTarget ? 'id="l7-viewers"' : ''}>${item.meta}</div>` : ''}
              <button class="l7-addbtn${already ? ' added' : ''}" id="l7-add-${item.title.replace(/[^a-z0-9]/gi, '')}">${already ? '✓ In cart' : 'Add to cart'}</button>
            </div>`;
          feed.appendChild(d);

          const btn = d.querySelector('.l7-addbtn');
          btn.onclick = () => {
            if (inCart(item.title)) { removeFromCart(item.title); btn.textContent = 'Add to cart'; btn.classList.remove('added'); }
            else {
              addToCart(item.title, item.price, false);
              btn.textContent = '✓ In cart'; btn.classList.add('added');
            }
          };
          return;
        }
        feed.appendChild(d);
      });

      // Live viewer flicker
      setInterval(() => {
        const v = document.getElementById('l7-viewers');
        if (v?.textContent.includes('viewed')) v.textContent = randViewers() + ' people viewed today';
      }, 3000);

      // Notification cycling
      let ni = 0;
      setInterval(() => {
        if (view !== 'feed') return;
        ni = (ni + 1) % NOTIFICATIONS.length;
        const notifs = feed.querySelectorAll('.l7-notif');
        if (notifs.length) notifs[ni % notifs.length].textContent = NOTIFICATIONS[ni];
      }, 4000);
    };

    // ── Render: cart view ───────────────────────────────────────────────────
    const renderCart = () => {
      view = 'cart';
      const host = document.getElementById('l7-view');
      if (!host) { renderShell(); }
      const total = cart.reduce((a, c) => a + c.price, 0);

      document.getElementById('l7-view').innerHTML = `
        <div class="l7-cart">
          <button class="l7-backbtn" id="l7-back">← Back to shopping</button>
          <div style="font-size:14px;font-weight:500;color:#111">Your cart</div>
          <div>
            ${cart.length === 0
          ? '<div class="l7-empty">Your cart is empty.</div>'
          : cart.map(c => `
                <div class="l7-crow">
                  <span class="l7-cname">${c.name}${c.sneaky ? ' <span style="color:#A32D2D;font-size:10px">(added for you)</span>' : ''}</span>
                  <span style="font-weight:500;flex-shrink:0">$${c.price.toFixed(2)}</span>
                  <button class="l7-cremove" data-name="${c.name}">Remove</button>
                </div>`).join('')}
          </div>
          <div class="l7-ctotal"><span>Order total</span><span>$${total.toFixed(2)}</span></div>
          <button class="l7-obtn" id="l7-place">Place your order</button>
          <div style="font-size:10px;color:#aaa;text-align:center">By placing your order, you agree to our Conditions of Use</div>
        </div>`;

      document.getElementById('l7-back').onclick = renderFeed;

      document.querySelectorAll('.l7-cremove').forEach(b => {
        b.onclick = () => removeFromCart(b.dataset.name);
      });

      document.getElementById('l7-place').onclick = placeOrder;
    };

    // ── Order validation ────────────────────────────────────────────────────
    const placeOrder = () => {
      clearTimer();
      const onlyBackpack = cart.length === 1 && cart[0].name === TARGET_NAME;
      const hasBackpack = cart.some(c => c.name === TARGET_NAME);

      if (!hasBackpack) {
        fail('Your cart never had the backpack in it!');
        setTimeout(() => { startTimer(); renderCart(); }, 1700);
        return;
      }

      if (!onlyBackpack) {
        fail('Extra items snuck into your order — check your cart before placing it!');
        setTimeout(() => { startTimer(); renderCart(); }, 1700);
        return;
      }

      const gb = document.getElementById('l7-goalbar');
      if (gb) { gb.style.background = '#3B6D11'; gb.textContent = 'Done — backpack purchased'; }
      document.getElementById('l7-view').innerHTML = `
        <div style="padding:24px 12px;text-align:center;display:flex;flex-direction:column;gap:8px;align-items:center;background:#fff">
          <div style="font-size:24px;color:#3B6D11">✓</div>
          <div style="font-size:14px;font-weight:500;color:#111">Order placed!</div>
          <div style="font-size:12px;color:#555">${TARGET_NAME} — $${TARGET_PRICE.toFixed(2)}</div>
        </div>`;
      succeed();
    };

renderShell();
renderFeed();
startTimer();
  },
};

export default level7;