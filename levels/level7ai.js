// js/levels/level7ai.js — AI Personalized Scarcity (Hyper version of Fake Scarcity / Urgency)

// Reuses the same visual language as the base level7 storefront (nav bar,
// tabs, product rows) so the personalized offers show up as a "For You" tab
// on what looks like the same site, instead of a standalone AI card.
const STYLES = `
  .l7ai-wrap{display:flex;flex-direction:column;background:#f0f2f2;font-family:system-ui,-apple-system,sans-serif}
  .l7ai-nav{background:#232f3e;padding:13px 18px;display:flex;align-items:center;gap:14px;flex-shrink:0}
  .l7ai-logo{color:#fff;font-size:21px;font-weight:700;letter-spacing:-.5px;white-space:nowrap;flex-shrink:0}
  .l7ai-logo span{color:#9b93f0}
  .l7ai-cartbtn{position:relative;background:#37475a;border:none;height:44px;padding:0 16px;border-radius:9px;display:flex;align-items:center;gap:8px;color:#fff;font-size:16px;font-family:inherit;flex-shrink:0;white-space:nowrap;margin-left:auto}
  .l7ai-cartbadge{position:absolute;top:-8px;right:-8px;background:#9b93f0;color:#111;font-size:12px;font-weight:700;border-radius:50%;min-width:21px;height:21px;display:flex;align-items:center;justify-content:center;padding:0 3px;box-shadow:0 0 0 2px #232f3e}
  .l7ai-subnav{background:#37475a;padding:8px 18px;display:flex;gap:20px;overflow-x:auto;flex-shrink:0}
  .l7ai-snitem{color:#fff;font-size:15px;white-space:nowrap;opacity:.7;padding-bottom:6px}
  .l7ai-snitem.active{opacity:1;font-weight:600;border-bottom:2px solid #9b93f0}
  .l7ai-content{overflow-y:auto;overflow-x:hidden;flex:1;min-height:0;background:#f0f2f2}
  .l7ai-banner{padding:10px 18px;font-size:15px;font-weight:500;background:#f0effe;color:#453d84;border-bottom:1px solid #e0dcfb}
  .l7ai-feed-head{padding:13px 18px;background:#fff;font-size:15px;color:#555;border-bottom:.5px solid #e8e8e4}
  .l7ai-feed-head strong{color:#111}
  .l7ai-product{padding:20px;display:flex;gap:18px;background:#fff;margin-bottom:3px}
  .l7ai-pimg{width:88px;height:88px;border-radius:14px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:34px;background:radial-gradient(120% 120% at 50% 20%,#ffffff 0%,#f4f4f1 60%,#eaeae5 100%);border:.5px solid #e6e6e1}
  .l7ai-pbody{flex:1;display:flex;flex-direction:column;gap:5px;min-width:0}
  .l7ai-ptitle{font-size:17px;color:#111;line-height:1.35;font-weight:600}
  .l7ai-psub{font-size:14px;color:#534AB7;font-weight:500}
  .l7ai-pprice{font-size:19px;font-weight:600;color:#111}
  .l7ai-pprice .orig{font-size:14px;text-decoration:line-through;color:#aaa;margin-left:6px;font-weight:400}
  .l7ai-pbadge{font-size:13px;font-weight:600;padding:4px 9px;border-radius:5px;display:inline-block}
  .l7ai-badge-ref{background:#f5f5f2;color:#666;border:1px solid #ececea}
  .l7ai-badge-stock{background:#FCEBEB;color:#A32D2D}
  .l7ai-reason{margin-top:4px;padding:10px 13px;background:#f0effe;border-radius:9px;border:1px solid #e0dcfb;font-size:13.5px;color:#534AB7;line-height:1.5}
  .l7ai-atc{font-size:14px;background:#febd69;border:1px solid #f0a921;border-radius:7px;padding:9px 16px;cursor:pointer;color:#111;font-family:inherit;align-self:flex-start;margin-top:5px}
  .l7ai-atc:hover{background:#f0a921}
  .l7ai-atc.added{background:#EAF3DE;color:#27500A;border-color:#27500A;cursor:default}
  .l7ai-atc:disabled{opacity:.7;cursor:default}
  .l7ai-done-row{padding:20px;background:#fff;border-top:1px solid #e8e8e4}
`;

function injectStyles() {
  document.getElementById('l7ai-style')?.remove();
  const s = document.createElement('style');
  s.id = 'l7ai-style';
  s.textContent = STYLES;
  document.head.appendChild(s);
}

function fmt(s) {
  const m = Math.floor(s / 60), sec = s % 60;
  return m + ':' + (sec < 10 ? '0' : '') + sec;
}

const level7ai = {
  id: 'l7ai',
  title: 'Level 7 — Hyper',
  isAI: true,
  goal: 'Resist the AI-personalized scarcity offers',
  hints: [
    "Every offer is framed around something from your order history — that's the personalization, not evidence you actually need it.",
    "Browse the 'For You' tab and click 'Continue' at the bottom without adding more than one item.",
  ],
  pattern: 'AI Personalized Scarcity',
  brief: "The same fake-scarcity trick, but personalized with your own purchase history. Instead of a generic 'Only 1 left!', NexusAI names something you actually bought — your iPad, your PS5, your shoes — to make a fake stock shortage feel like it was made just for you.",
  goalDetail: "NexusAI has pulled up your order history and built you a 'For You' tab of four personalized urgency offers from it. Each one names a real past purchase to justify a fake scarcity claim. Browse the page and continue without adding more than one — the countdown expiring costs you nothing.",
  aiIntro: "Each offer opens by citing something you actually bought — that's algorithmic authority borrowed from a real purchase, applied to a stock claim that has nothing to do with real inventory.",
  dollars: {
    label: 'If you accepted all four personalized offers',
    amount: 248.96,
    period: 'one-time',
    note: '$248.96 in accessories you were algorithmically nudged toward buying because you already owned the related item — not because you asked for them',
  },
  desc: "Fake scarcity, personalized: NexusAI mines your real order history for plausible-sounding justifications, then attaches a manufactured stock countdown to each one. The purchases are real. The urgency is not.",
  rw: {
    company: 'Personalization platforms (Dynamic Yield, Amazon Personalize, and similar)',
    detail: "Retailers increasingly pair real purchase-history data with generated urgency messaging — 'customers who bought X usually buy Y within 30 days' framing is common in post-purchase email and on-site recommendation engines. The underlying behavioral statistic is often real; the individual stock claim attached to it typically is not.",
    link: 'https://www.deceptive.design/hall-of-shame',
  },
  aiWhy: "Generic scarcity ('Only 1 left!') is easy to be skeptical of because it could apply to anyone. Personalized scarcity is harder to dismiss because it opens with something true — you really did buy that iPad — and borrows the credibility of that fact for a claim that isn't true at all: that this specific accessory is running out because of your specific purchase. The model doesn't know your sock drawer, your case situation, or your controller count. It knows one purchase and a timer.",
  replay: [
    { trap: false, note: "The order history shown is real — that accuracy is what lends borrowed credibility to the claims that follow it." },
    { trap: true,  note: "\"NexusAI flagged...\" attaches algorithmic authority to a real purchase, then uses it to justify an unrelated scarcity or claim." },
    { trap: true,  note: "Aggregate statistics about \"buyers like you\" describe a population, not a fact about your specific situation." },
    { trap: true,  note: "Stock lines (\"Only 2 left\", \"Low stock in your size\") are fabricated as ordinary fake scarcity — personalizing doesn't make the number real." },
    { trap: false, note: "It uses something you already own to make the offer seem relevant, instead of something you actually asked for." },
  ],

  render(el) {
    injectStyles();

    const ORDER_HISTORY = [
      { icon: '📱', name: 'iPad Air (5th gen) — 64GB, Space Gray', date: 'Delivered March 3', price: 549.00 },
      { icon: '🎮', name: 'PS5 Console — Slim, Disc Edition',      date: 'Delivered Feb 21',  price: 499.00 },
      { icon: '👟', name: 'Trail Running Shoes — Men\'s 10',        date: 'Delivered Feb 8',   price: 118.00 },
      { icon: '👕', name: 'Everyday Crewneck (3-pack)',             date: 'Delivered Jan 30',  price: 54.00 },
    ];

    const OFFERS = [
      {
        key: 'ipadCase',
        icon: '⌨️',
        name: 'iPad Pro Keyboard & Case Bundle',
        sub: 'Matched to your iPad Air purchase',
        price: 89.99, orig: 109.99,
        ref: '📱 Based on: iPad Air (5th gen), ordered March 3',
        stock: 'Only 2 left — reserved for recent iPad buyers',
        reason: "NexusAI flagged your iPad Air order from March 3rd — accessory attach-rate data shows most iPad buyers who don't purchase a case within 6 weeks never do. You're at week 4, which the model reads as a closing window rather than simply 'no case yet.'",
      },
      {
        key: 'ps5Controller',
        icon: '🎮',
        name: 'DualSense Wireless Controller — 2nd Controller',
        sub: 'Recommended for PS5 owners',
        price: 64.99, orig: null,
        ref: '🎮 Based on: PS5 Console, ordered Feb 21',
        stock: '3 left — 68% of PS5 buyers add this within 30 days',
        reason: "NexusAI's churn model associates single-controller PS5 households with lower month-3 engagement. It reads your account as \"under-equipped for multiplayer,\" a label generated entirely from the absence of a second controller purchase — not from anything you've said you want.",
      },
      {
        key: 'runningSocks',
        icon: '🧦',
        name: 'Performance Running Socks (3-pack)',
        sub: 'Completes your running kit',
        price: 18.99, orig: null,
        ref: '👟 Based on: Trail Running Shoes, ordered Feb 8',
        stock: 'Low stock in your size — restocking Thursday',
        reason: '"Kit completion" scoring treats a shoe purchase with no matching sock purchase as an incomplete basket, regardless of whether you already own running socks. NexusAI has no visibility into what\'s actually in your sock drawer.',
      },
      {
        key: 'wardrobeBundle',
        icon: '🧺',
        name: 'Seasonal Wardrobe Refresh Bundle',
        sub: 'Based on your recent clothing order',
        price: 74.99, orig: 94.99,
        ref: '👕 Based on: Everyday Crewneck (3-pack), ordered Jan 30',
        stock: 'Trending among shoppers with a similar order history',
        reason: 'NexusAI treats any clothing purchase as the start of a "refresh cycle" and schedules a follow-up bundle offer roughly 4 weeks later — a fixed interval applied to every customer, not a signal that you specifically need more clothes.',
      },
    ];

    const MAX_FAILS = 2;
    let fails = 0;
    let cartCount = 0;
    let dealSecsLeft = 133;
    let dealInterval = null;

    const clearDealTimer = () => { clearInterval(dealInterval); dealInterval = null; };
    const startDealTimer = () => {
      clearDealTimer();
      dealInterval = setInterval(() => {
        dealSecsLeft = dealSecsLeft <= 1 ? 133 : dealSecsLeft - 1;
        const dealEl = document.getElementById('l7ai-dealtimer');
        if (dealEl) dealEl.textContent = '⚡ Personalized deals refresh in ' + fmt(dealSecsLeft);
      }, 1000);
    };

    // ── Phase 1: order history ───────────────────────────────────────────
    const showOrders = () => {
      clearDealTimer();
      const aiBanner = el.querySelector('.ai-banner');
      el.innerHTML = aiBanner ? aiBanner.outerHTML : '';

      el.insertAdjacentHTML('beforeend', `
        <div style="overflow-y:auto;min-height:0;display:flex;flex-direction:column">
          <div style="display:flex;align-items:center;gap:9px;margin-bottom:14px">
            <div style="width:8px;height:8px;border-radius:50%;background:#534AB7;flex-shrink:0;animation:pulse 1.2s infinite"></div>
            <div style="font-size:16px;color:#534AB7">NexusAI is reviewing your order history</div>
          </div>
          <div style="font-size:18px;font-weight:600;color:#111;margin-bottom:4px">Your Orders</div>
          <div style="font-size:14px;color:#888;margin-bottom:14px">4 orders in the last 90 days</div>
          <div style="display:flex;flex-direction:column;gap:0">
            ${ORDER_HISTORY.map(o => `
              <div style="display:flex;gap:14px;align-items:center;padding:14px 0;border-bottom:1px solid #ececea">
                <div style="width:44px;height:44px;border-radius:10px;background:#f6f6f4;border:1px solid #ececea;display:flex;align-items:center;justify-content:center;font-size:21px;flex-shrink:0">${o.icon}</div>
                <div style="flex:1;min-width:0">
                  <div style="font-size:15px;font-weight:500;color:#111">${o.name}</div>
                  <div style="font-size:13px;color:#999;margin-top:2px">${o.date}</div>
                </div>
                <div style="font-size:15px;font-weight:600;color:#111;flex-shrink:0">$${o.price.toFixed(2)}</div>
              </div>`).join('')}
          </div>
          <div style="margin-top:16px;padding:14px 17px;background:#f0effe;border-radius:11px;border:1px solid #e0dcfb">
            <div style="font-size:14px;color:#534AB7;line-height:1.5">NexusAI is building your "For You" tab from these orders...</div>
          </div>
          <div style="margin-top:20px">
            <button class="btn btn-ai" id="l7ai-continue" style="width:100%;padding:15px;font-size:17px;font-weight:500;border-radius:9px">See my personalized deals →</button>
          </div>
        </div>`);

      document.getElementById('l7ai-continue').onclick = () => showThinking();
    };

    // ── Transition spinner (same visual language used elsewhere) ────────
    const showThinking = () => {
      clearDealTimer();
      const aiBanner = el.querySelector('.ai-banner');
      el.innerHTML = aiBanner ? aiBanner.outerHTML : '';
      el.insertAdjacentHTML('beforeend', `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;flex:1;min-height:220px">
          <div style="width:38px;height:38px;border:4px solid #e0dcff;border-top-color:#534AB7;border-radius:50%;animation:spin .8s linear infinite"></div>
          <div style="font-size:16px;font-weight:500;color:#534AB7;text-align:center;max-width:300px">Cross-referencing your order history...</div>
        </div>`);
      setTimeout(() => showStore(), 1400);
    };

    // ── Phase 2: Amazon-style storefront, "For You" tab ─────────────────
    const productCard = o => `
      <div class="l7ai-product" data-key="${o.key}">
        <div class="l7ai-pimg">${o.icon}</div>
        <div class="l7ai-pbody">
          <div class="l7ai-ptitle">${o.name}</div>
          <div class="l7ai-psub">${o.sub}</div>
          <div class="l7ai-pprice">$${o.price.toFixed(2)}${o.orig ? `<span class="orig">$${o.orig.toFixed(2)}</span>` : ''}</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <span class="l7ai-pbadge l7ai-badge-ref">${o.ref}</span>
            <span class="l7ai-pbadge l7ai-badge-stock">${o.stock}</span>
          </div>
          <div class="l7ai-reason"><strong style="text-transform:uppercase;font-size:11px;letter-spacing:.04em">Why NexusAI recommends this</strong><br>${o.reason}</div>
          <button class="l7ai-atc" data-key="${o.key}">Add to cart</button>
        </div>
      </div>`;

    const showStore = () => {
      clearDealTimer();
      const aiBanner = el.querySelector('.ai-banner');
      el.innerHTML = aiBanner ? aiBanner.outerHTML : '';

      el.insertAdjacentHTML('beforeend', `
        <div class="l7ai-wrap" style="flex:1;min-height:0;border-radius:inherit;overflow:hidden">
          <div class="l7ai-nav">
            <div class="l7ai-logo">Quick<span>Cart</span></div>
            <button class="l7ai-cartbtn">🛒 Cart<span class="l7ai-cartbadge" id="l7ai-cartbadge" style="display:none">0</span></button>
          </div>
          <div class="l7ai-subnav">
            <span class="l7ai-snitem">Home</span>
            <span class="l7ai-snitem">Today's Deals</span>
            <span class="l7ai-snitem active">For You</span>
            <span class="l7ai-snitem">Orders</span>
          </div>
          <div class="l7ai-content">
            <div class="l7ai-banner" id="l7ai-dealtimer">⚡ Personalized deals refresh in ${fmt(dealSecsLeft)}</div>
            <div class="l7ai-feed-head">Personalized for you, based on <strong>4 recent orders</strong></div>
            ${OFFERS.map(productCard).join('')}
            <div class="l7ai-done-row">
              <button class="btn btn-ai" id="l7ai-continue-shopping" style="width:100%;padding:14px;font-size:16px;font-weight:500;border-radius:9px">Continue →</button>
              <div class="ftiny" style="margin-top:8px;text-align:center;color:#aaa">Done browsing your personalized offers? Continue when ready.</div>
            </div>
          </div>
        </div>`);

      document.querySelectorAll('.l7ai-atc').forEach(btn => {
        btn.onclick = () => {
          const key = btn.dataset.key;
          btn.textContent = '✓ Added';
          btn.classList.add('added');
          btn.disabled = true;
          cartCount++;
          const badge = document.getElementById('l7ai-cartbadge');
          if (badge) { badge.style.display = 'flex'; badge.textContent = cartCount; }

          fails++;
          if (fails >= MAX_FAILS) {
            clearDealTimer();
            fail('Two personalized offers got you — the model knows your history.');
            document.querySelectorAll('.l7ai-atc').forEach(b => b.disabled = true);
            setTimeout(finish, 1900);
          } else {
            fail('Added it — lost a heart. Your order history just got more to work with.');
          }
        };
      });

      document.getElementById('l7ai-continue-shopping').onclick = finish;

      startDealTimer();
    };

    const finish = () => {
      clearDealTimer();
      if (fails > 0) setLevelGrade(levelIdx, fails >= MAX_FAILS ? 'F' : 'B');
      succeed();
    };

    showOrders();
  },
};

export default level7ai;