// js/levels/level6.js - Obstruction

// Pages the player has already viewed. Kept across a "Try again" so the
// menu can still show what they've seen.
let carriedViewed = null;

const level6 = {
  id: "l6",
  title: "Level 6",
  isAI: false,
  goal: "Apply the one valid coupon before time runs out",
  hints: [
    "Compare the booking details at the top (car class, days, membership, first-time, Visa) with each offer's conditions.",
    "Start under Promotions & Savings. Branch names hint at which detail matters, but read the conditions: at least one label is misleading.",
    "", // filled in at render time with the branch that holds the valid code
  ],
  pattern: "Obstruction",
  brief: "Obstruction buries your entitlements behind menus, fine print, and time pressure. Car rental companies offer dozens of codes, all mutually exclusive and most inapplicable, knowing the clock will run out before you find the right one.",
  goalDetail: "You have 90 seconds, and the clock starts when you open your first menu (you can also turn it off). Find the one coupon that actually applies to your booking and apply it. All coupons are mutually exclusive, so only one is valid. A wrong one lowers your score. If you get stuck, a one-click shortcut appears, but using it scores 0%.",
  dollars: {
    label: "If you gave up and paid full price",
    amount: 0,
    period: "fixed",
    note: "The discount you were entitled to, forfeited because the clock ran out.",
  },
  rw: {
    company: "Enterprise / Hertz / Avis",
    detail: "Major rental companies routinely advertise discount codes with conflicting conditions and short redemption windows, knowing most customers will either pick the wrong one or give up entirely.",
    link: "https://www.deceptive.design/hall-of-shame",
  },
  replay: [
    { trap: true, note: "Every option claims exclusivity from all the others, so only careful reading reveals which one actually applies." },
    { trap: true, note: "A visible countdown timer creates panic, pushing toward the first plausible option rather than verification." },
    { trap: true, note: "Dead-end menu paths waste precious time without ever leading anywhere relevant." },
    { trap: true, note: "The correct path is never signposted directly. It has to be found using the same menu structure as every dead end." },
    { trap: true, note: "A one-click \"apply best eligible offer\" button would have solved this instantly. The site knows your booking, so hiding the answer is a design choice." },
  ],

  render(el) {
    const COUPON_TEMPLATES = [
      { id: "c1", code: "MEMBER10",  headline: "10% off - Member Reward",       pct: 10,
        fine: "Valid for Loyalty members on Economy class only. Not valid on Compact or SUV. Cannot be combined with other offers.",
        gen: () => ({ carType: "Economy", days: Math.floor(Math.random()*7)+4, hasMembership: true,  isFirstTime: false, hasPartnerCard: false }) },
      { id: "c2", code: "FIRST20",   headline: "20% off - First-Time Customer", pct: 20,
        fine: "For new customers only. Not valid for Loyalty members. Rentals of 5 days or fewer only. Cannot be combined with other offers.",
        gen: () => ({ carType: "Compact", days: Math.floor(Math.random()*2)+4, hasMembership: false, isFirstTime: true,  hasPartnerCard: false }) },
      { id: "c3", code: "STAY25",    headline: "25% off - Long Stay Reward",    pct: 25,
        fine: "Valid on rentals of 6 days or more. Not valid for Loyalty members. Not valid for Visa cardholders. Cannot be combined with other offers.",
        gen: () => ({ carType: "Compact", days: Math.floor(Math.random()*5)+6, hasMembership: false, isFirstTime: false, hasPartnerCard: false }) },
      { id: "c4", code: "SUV10",     headline: "10% off - SUV Special",         pct: 10,
        fine: "Valid on SUV class only. Not valid for first-time customers. Not valid for Loyalty members. Not valid for Visa cardholders. Cannot be combined with other offers.",
        gen: () => ({ carType: "SUV",     days: Math.floor(Math.random()*2)+4, hasMembership: false, isFirstTime: false, hasPartnerCard: false }) },
      { id: "c5", code: "COMPACT15", headline: "15% off - Compact Deal",        pct: 15,
        fine: "Valid on Compact class only. For Loyalty members on rentals of 6 days or fewer only. Cannot be combined with other offers.",
        gen: () => ({ carType: "Compact", days: Math.floor(Math.random()*3)+4, hasMembership: true,  isFirstTime: false, hasPartnerCard: false }) },
      { id: "c6", code: "EXTEND20",  headline: "20% off - Extended Stay",       pct: 20,
        fine: "Valid on rentals of 7 days or more. Compact and SUV only. Not valid for Visa cardholders. For Loyalty members only. Cannot be combined with other offers.",
        gen: () => ({ carType: "Compact", days: Math.floor(Math.random()*4)+7, hasMembership: true,  isFirstTime: false, hasPartnerCard: false }) },
      { id: "c7", code: "VISA10",    headline: "10% off - Visa Cardmember",     pct: 10,
        fine: "Must pay with qualifying Visa credit card. Not valid on Economy class. Not valid for Loyalty members. Cannot be combined with other offers.",
        gen: () => ({ carType: "SUV",     days: Math.floor(Math.random()*7)+4, hasMembership: false, isFirstTime: false, hasPartnerCard: true  }) },
      { id: "c8", code: "ECO5",      headline: "5% off - Economy Saver",        pct: 5,
        fine: "Valid on Economy class only. Not valid on rentals of 7 days or more. Not valid for Loyalty members. Cannot be combined with other offers.",
        gen: () => ({ carType: "Economy", days: Math.floor(Math.random()*2)+4, hasMembership: false, isFirstTime: false, hasPartnerCard: false }) },
    ];

    const validTemplate = COUPON_TEMPLATES[Math.floor(Math.random() * COUPON_TEMPLATES.length)];
    const { carType, days, hasMembership, isFirstTime, hasPartnerCard } = validTemplate.gen();
    const baseRate     = carType === "Economy" ? 40 : carType === "Compact" ? 55 : 80;
    const subtotal     = baseRate * days;
    const validId      = validTemplate.id;
    const validCoupon  = { ...validTemplate };
    const savings      = Math.round(subtotal * (validTemplate.pct / 100));
    const correctTotal = subtotal - savings;

    const ALL_COUPONS = COUPON_TEMPLATES.map(({ gen, ...c }) => c);
    const getCoupon = (id) => ALL_COUPONS.find(c => c.id === id) || {
      id, code: id, headline: "Offer unavailable",
      fine: "This offer is not available for your current booking.",
      pct: 0, dead: true, deadMsg: "This offer is not available for your current booking.",
    };

    const TIME_LIMIT = 90;
    let penalized     = false;
    let timeLeft      = TIME_LIMIT;
    let timerInterval = null;
    let timerOn       = true;
    let started       = false;
    const viewed      = carriedViewed || new Set();
    carriedViewed     = null;
    let paused        = false;
    let showingRescue = false;
    let stuckShown    = false;
    let stuckInterval = null;
    let usedHelp      = false; // "Show me" was used: the level scores 0%

    // Stats for the end screen
    const stats = { clicks: 0, deadPages: 0, deadMs: 0, startMs: 0 };
    let pageStart  = Date.now();
    let onDeadPage = false;
    const closeDeadPage = () => { if (onDeadPage) stats.deadMs += Date.now() - pageStart; };
    const trackPage = (node) => {
      closeDeadPage();
      pageStart  = Date.now();
      onDeadPage = !!(node.dead || (node.coupon && node.coupon.id !== validId));
      if (onDeadPage) stats.deadPages++;
      if (node.coupon && !node.coupon.dead) viewed.add(node.coupon.id);
      else if (node.dead) viewed.add(node.label);
    };

    const couponNode = (label, id) => ({ label, coupon: getCoupon(id) });

    const stack = [{
      label: "DriveEasy Booking",
      children: [
        { label: "Add-ons & Extras", dead: true, deadMsg: "GPS, insurance, prepaid fuel, and extra drivers are paid add-ons, not coupons." },
        {
          label: "Promotions & Savings",
          children: [
            couponNode("Member Discounts", "c1"),
            couponNode("New Customer Offers", "c2"),
            { label: "Long Stay Deals",      children: [couponNode("STAY25", "c3"), couponNode("EXTEND20", "c6")] },
            { label: "Vehicle Class Offers", children: [couponNode("SUV10", "c4"), couponNode("ECO5", "c8")] },
            couponNode("Short Stay Deals", "c5"),
            { label: "Partner Offers", children: [
              { label: "Airline partners", dead: true, deadMsg: "Earn AirMiles on your rental. No discount codes on this page." },
              couponNode("VISA10", "c7"),
            ] },
          ],
        },
        { label: "Help & FAQ",     dead: true, deadMsg: "To use a coupon, enter its code in the apply field on the booking page. Free cancellation up to 24 hours before pickup." },
        { label: "Special Offers", dead: true, deadMsg: "Weekend packages, corporate rates, and seasonal pricing are applied automatically. No codes here." },
      ],
    }];

    const PATHS = {
      c1: "Promotions & Savings → Member Discounts",
      c2: "Promotions & Savings → New Customer Offers",
      c3: "Promotions & Savings → Long Stay Deals → STAY25",
      c4: "Promotions & Savings → Vehicle Class Offers → SUV10",
      c5: "Promotions & Savings → Short Stay Deals",
      c6: "Promotions & Savings → Long Stay Deals → EXTEND20",
      c7: "Promotions & Savings → Partner Offers → VISA10",
      c8: "Promotions & Savings → Vehicle Class Offers → ECO5",
    };
    level6.hints[2] = `The code you need is under: ${PATHS[validId].split(" → ")[1]}.`;

    // "2 codes · 1 of 2 viewed" style labels on menu buttons
    const couponsUnder = (node) => node.coupon ? [node.coupon] : (node.children || []).flatMap(couponsUnder);
    const menuBadge = (node) => {
      if (node.dead) return viewed.has(node.label) ? "viewed" : "";
      const codes = couponsUnder(node).filter(c => !c.dead);
      if (!codes.length) return "";
      const seen  = codes.filter(c => viewed.has(c.id)).length;
      const count = `${codes.length} code${codes.length > 1 ? "s" : ""}`;
      return seen ? `${count} · ${seen} of ${codes.length} viewed` : count;
    };

    // Booking vs. conditions checklist on each coupon page
    const you = {
      member: hasMembership ? "member" : "not a member",
      visa:   hasPartnerCard ? "Visa cardholder" : "no Visa card",
      first:  isFirstTime ? "first-time" : "returning",
      days:   `${days} days`,
    };
    const CONDITIONS = {
      c1: [["Loyalty member", hasMembership, you.member], ["Economy class", carType === "Economy", carType]],
      c2: [["First-time customer", isFirstTime, you.first], ["Not a Loyalty member", !hasMembership, you.member], ["5 days or fewer", days <= 5, you.days]],
      c3: [["6 days or more", days >= 6, you.days], ["Not a Loyalty member", !hasMembership, you.member], ["Not a Visa cardholder", !hasPartnerCard, you.visa]],
      c4: [["SUV class", carType === "SUV", carType], ["Not a first-time customer", !isFirstTime, you.first], ["Not a Loyalty member", !hasMembership, you.member], ["Not a Visa cardholder", !hasPartnerCard, you.visa]],
      c5: [["Compact class", carType === "Compact", carType], ["Loyalty member", hasMembership, you.member], ["6 days or fewer", days <= 6, you.days]],
      c6: [["7 days or more", days >= 7, you.days], ["Compact or SUV class", carType !== "Economy", carType], ["Loyalty member", hasMembership, you.member], ["Not a Visa cardholder", !hasPartnerCard, you.visa]],
      c7: [["Visa cardholder", hasPartnerCard, you.visa], ["Not Economy class", carType !== "Economy", carType], ["Not a Loyalty member", !hasMembership, you.member]],
      c8: [["Economy class", carType === "Economy", carType], ["Under 7 days", days < 7, you.days], ["Not a Loyalty member", !hasMembership, you.member]],
    };
    const conditionsHtml = (c) => {
      const rows   = CONDITIONS[c.id] || [];
      const unmet  = rows.filter(r => !r[1]).length;
      return `
        <div style="margin:0 0 14px;padding:10px 12px;border-radius:8px;background:#f6f6f3;border:1px solid #e0e0d8">
          <div style="font-size:13px;font-weight:600;color:#111;margin-bottom:6px">Your booking vs. these conditions</div>
          ${rows.map(([label, met, mine]) => `
            <div style="font-size:13px;color:#222;display:flex;gap:8px;line-height:1.5">
              <span style="font-weight:700;color:${met ? "#1f5f2c" : "#A32D2D"};width:16px;flex-shrink:0">${met ? "✓" : "✗"}</span>
              <span>${label} <span style="color:#555">(you: ${mine}) · ${met ? "met" : "not met"}</span></span>
            </div>`).join("")}
          <div style="font-size:13px;font-weight:600;margin-top:6px;color:${unmet ? "#A32D2D" : "#1f5f2c"}">${unmet ? `${unmet} condition${unmet > 1 ? "s" : ""} not met` : "All conditions met"}</div>
        </div>`;
    };

    const summaryHtml = (won, usedRescue) => {
      closeDeadPage();
      const elapsed = stats.startMs ? Math.round((Date.now() - stats.startMs) / 1000) : 0;
      const stat = (value, label) => `<div style="flex:1;min-width:90px;text-align:center"><div style="font-size:20px;font-weight:600;color:#111">${value}</div><div style="font-size:12px;color:#555">${label}</div></div>`;
      return `
        <div style="padding:14px 16px;border-radius:10px;background:#f9f9f7;border:0.5px solid #e0e0d8">
          <div style="font-size:14px;font-weight:500;color:#111;margin-bottom:10px">Your path through the site</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${stat(stats.clicks, "clicks")}${stat(elapsed + "s", "elapsed")}${stat(stats.deadPages, "pages that didn't help")}
          </div>
        </div>
        ${usedRescue
          ? `<div style="padding:14px 16px;border-radius:10px;background:#eef3ff;border:1px solid #b6c6f2;font-size:14px;color:#222;line-height:1.5">You took the one-click option after <strong>${stats.clicks} clicks</strong>. Notice what it did: it used your booking details to pick <strong>${validCoupon.code}</strong> instantly. The site knew your best offer all along.</div>`
          : `
        <div style="padding:14px 16px;border-radius:10px;background:#f1faf3;border:1px solid #b9dfc2">
          <div style="font-size:14px;font-weight:500;color:#1f5f2c;margin-bottom:6px">Same booking, honest design</div>
          <div style="font-size:14px;color:#222;margin-bottom:10px">Best eligible offer: <strong>${validCoupon.code}</strong>, ${validCoupon.pct}% off. You save <strong>$${savings}</strong>.</div>
          <button class="btn btn-p" id="l6-honest" style="font-size:14px;padding:10px 16px">Apply best offer</button>
          <div style="font-size:13px;color:#444;margin-top:10px;line-height:1.5">That's 1 click. The site already knows your booking and which offer applies. Making you hunt for it was a choice.</div>
        </div>`}`;
    };

    const resetEl = () => {
      el.innerHTML = "";
      el.removeAttribute("style");
      el.style.cssText = "display:flex;flex-direction:column;gap:16px;padding:16px;overflow:auto";
    };

    const showEndScreen = (won, reason, usedRescue) => {
      clearInterval(timerInterval);
      clearInterval(stuckInterval);
      resetEl();
      const failBox = won ? "" : `
        <div style="padding:14px 16px;border-radius:10px;background:#fff3f3;border:1px solid #f5a6a6">
          <div style="font-size:16px;font-weight:500;color:#A32D2D;margin-bottom:6px">⚠ ${reason}</div>
          <div style="font-size:14px;color:#444">The valid coupon for your booking was <strong>${validCoupon.code}</strong>: ${validCoupon.fine}</div>
          <div style="font-size:13px;color:#444;margin-top:8px">Where it was hiding: <strong>${PATHS[validId]}</strong></div>
        </div>`;
      el.insertAdjacentHTML("beforeend", `
        <div style="display:flex;flex-direction:column;gap:14px;padding:8px">
          ${won ? `<div style="font-size:16px;font-weight:500;color:#2D7A3A">✓ ${validCoupon.code} applied. New total: $${correctTotal}</div>` : ""}
          ${failBox}
          ${summaryHtml(won, usedRescue)}
          <button class="btn ${won ? "btn-p" : ""}" id="l6-next" style="font-size:15px;padding:13px">${won ? "Continue" : "Try again"}</button>
        </div>`);
      const honest = document.getElementById("l6-honest");
      if (honest) honest.onclick = () => { honest.disabled = true; honest.textContent = "✓ Applied in 1 click"; };
      document.getElementById("l6-next").onclick = () => {
        if (won) G.succeed({ assisted: usedHelp });
        else { carriedViewed = new Set(viewed); G.showLevel(); }
      };
    };

    const failLevel = (reason) => {
      clearInterval(timerInterval);
      G.fail(reason);
      setTimeout(() => showEndScreen(false, reason), 1800);
    };

    const startTimer = () => {
      timerInterval = setInterval(() => {
        if (!timerOn || paused) return;
        timeLeft--;
        const timerEl = document.getElementById("l6-timer");
        const barEl   = document.getElementById("l6-timer-bar");
        if (timerEl) {
          timerEl.textContent = `⏱ ${timeLeft}s`;
          if (timeLeft <= 10)      { timerEl.style.color = "#A32D2D"; timerEl.style.fontSize = "20px"; timerEl.style.animation = "pulse 0.5s infinite"; }
          else if (timeLeft <= 20) { timerEl.style.color = "#E24B4A"; timerEl.style.fontSize = "18px"; timerEl.style.animation = ""; }
          else if (timeLeft <= 30) { timerEl.style.color = "#BA7517"; timerEl.style.animation = ""; }
        }
        if (barEl) {
          barEl.style.width = (timeLeft / TIME_LIMIT) * 100 + "%";
          barEl.style.background = timeLeft <= 10 ? "#A32D2D" : timeLeft <= 20 ? "#E24B4A" : timeLeft <= 30 ? "#f5a623" : "#39d98a";
        }
        if (timeLeft <= 0) failLevel("Time ran out, so you paid full price.");
      }, 1000);
    };

    const applyCode = (c) => {
      const msgEl = document.getElementById("l6-apply-msg");
      if (c.id === validId) {
        clearInterval(timerInterval);
        if (msgEl) msgEl.innerHTML = `<span style="color:#2D7A3A;font-weight:500;font-size:15px">✓ ${c.code} applied: ${c.pct}% off. New total: $${correctTotal}</span>`;
        setTimeout(() => showEndScreen(true, null, usedHelp), 1200);
      } else {
        if (!penalized) {
          penalized = true;
          G.fail(`${c.code} doesn't apply to your booking. Every option is written to sound plausible until you check the conditions.`);
        }
        if (msgEl) msgEl.innerHTML = `<span style="color:#A32D2D;font-size:14px">${c.code} doesn't apply. Read the conditions carefully.</span>`;
      }
    };

    // After 10 clicks or 30 seconds, offer the honest one-click alternative
    const checkStuck = () => {
      const stuckEl = document.getElementById("l6-stuck");
      if (!stuckEl) { clearInterval(stuckInterval); return; }
      if (stuckShown || !started) return;
      if (stats.clicks >= 10 || (Date.now() - stats.startMs) / 1000 >= 30) {
        stuckShown = true;
        stuckEl.style.display = "";
      }
    };

    const renderMenu = (container) => {
      container.innerHTML = "";

      if (showingRescue) {
        container.innerHTML = `
          <div style="border-radius:10px;border:1px solid #b9dfc2;background:#f1faf3;padding:22px">
            <div style="font-size:14px;font-weight:600;color:#1f5f2c;margin-bottom:8px">What a well-designed site would do</div>
            <div style="font-size:13px;color:#A32D2D;margin-bottom:8px">You used the one-click option, so this level will score 0%.</div>
            <div style="font-size:16px;color:#111;margin-bottom:14px">Best eligible offer for your booking: <strong>${validCoupon.code}</strong>, ${validCoupon.pct}% off. You save <strong>$${savings}</strong>.</div>
            <div style="display:flex;gap:10px;flex-wrap:wrap">
              <button class="btn btn-p" id="l6-rescue-apply" style="font-size:15px;padding:12px 18px">Apply best offer</button>
              <button class="btn" id="l6-rescue-back" style="font-size:15px;padding:12px 18px">Back to the hunt</button>
            </div>
          </div>`;
        document.getElementById("l6-rescue-back").onclick = () => { showingRescue = false; paused = false; renderMenu(container); };
        document.getElementById("l6-rescue-apply").onclick = () => {
          clearInterval(timerInterval);
          const msgEl = document.getElementById("l6-apply-msg");
          if (msgEl) msgEl.innerHTML = `<span style="color:#2D7A3A;font-weight:500;font-size:15px">✓ ${validCoupon.code} applied: ${validCoupon.pct}% off. New total: $${correctTotal}</span>`;
          setTimeout(() => showEndScreen(true, null, true), 900);
        };
        return;
      }

      const current = stack[stack.length - 1];
      const isRoot  = stack.length === 1;

      const navigate = (move) => {
        if (!started) {
          started = true;
          stats.startMs = Date.now();
          if (timerOn) startTimer();
          stuckInterval = setInterval(checkStuck, 1000);
        }
        stats.clicks++;
        move();
        trackPage(stack[stack.length - 1]);
        checkStuck();
        renderMenu(container);
      };

      container.insertAdjacentHTML("beforeend", `<div style="font-size:12px;color:#666;margin-bottom:8px">${stack.map(n => n.label).join(" › ")}</div>`);

      if (!isRoot) {
        const backBtn = document.createElement("button");
        backBtn.className = "btn";
        backBtn.style.cssText = "font-size:14px;margin-bottom:12px;padding:8px 16px;color:#555";
        backBtn.textContent = "← Back";
        backBtn.onclick = () => navigate(() => stack.pop());
        container.appendChild(backBtn);
      }

      if (current.dead) {
        container.insertAdjacentHTML("beforeend", `
          <div class="fh" style="font-size:18px;margin-bottom:10px">${current.label}</div>
          <div class="fs" style="color:#555;font-size:15px">${current.deadMsg}</div>`);
        return;
      }

      if (current.coupon) {
        const c = current.coupon;
        container.insertAdjacentHTML("beforeend", `
          <div style="border-radius:10px;border:0.5px solid #e0e0d8;background:#fff;padding:24px">
            <div style="font-size:18px;font-weight:500;color:#111;margin-bottom:10px">${c.headline}</div>
            <div style="font-size:14px;color:#555;line-height:1.7;margin-bottom:14px">${c.fine}</div>
            ${conditionsHtml(c)}
            <div style="font-size:16px;color:#534AB7;font-weight:500;margin-bottom:16px">Code: ${c.code}</div>
            <button class="btn btn-p" id="l6-apply-${c.id}" style="width:100%;font-size:16px;padding:14px">Apply ${c.code}</button>
          </div>`);
        document.getElementById(`l6-apply-${c.id}`).onclick = () => applyCode(c);
        return;
      }

      const list = document.createElement("div");
      list.style.cssText = "display:flex;flex-direction:column;gap:12px;margin-top:8px";
      current.children.forEach(child => {
        const btn = document.createElement("button");
        btn.className = "btn";
        btn.style.cssText = "text-align:left;font-size:16px;padding:16px 20px;width:100%;display:flex;justify-content:space-between;align-items:center;gap:12px";
        const badge = menuBadge(child);
        btn.innerHTML = `<span>${child.label}</span><span style="font-size:12px;color:#555;white-space:nowrap">${badge ? badge + " " : ""}›</span>`;
        btn.onclick = () => navigate(() => stack.push(child));
        list.appendChild(btn);
      });
      container.appendChild(list);
    };

    el.innerHTML = "";
    el.insertAdjacentHTML("beforeend", `
      <div style="padding:16px 20px;border-radius:10px;background:#f9f9f7;border:0.5px solid #e0e0d8;font-size:15px;margin-bottom:14px;min-height:195px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div style="font-weight:500;color:#111;font-size:19px">DriveEasy: Your Booking</div>
          <div style="display:flex;align-items:center;gap:10px">
            <button id="l6-timer-off" style="font-size:12px;padding:3px 8px;border:1px solid #ccc;border-radius:6px;background:#fff;color:#444;cursor:pointer">No time limit</button>
            <div id="l6-timer" style="font-size:16px;font-weight:600;color:#555;font-variant-numeric:tabular-nums">⏱ ${TIME_LIMIT}s</div>
          </div>
        </div>
        <div id="l6-timer-wrap" style="background:#eee;border-radius:4px;height:7px;overflow:hidden;margin-bottom:4px">
          <div id="l6-timer-bar" style="height:100%;width:100%;background:#39d98a;border-radius:4px;transition:width 1s linear,background .3s"></div>
        </div>
        <div id="l6-timer-note" style="font-size:11px;color:#666;margin-bottom:8px">The clock starts when you open your first menu.</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;color:#555;margin-bottom:8px">
          <div>Car class: <strong>${carType}</strong></div>
          <div>Duration: <strong>${days} days</strong></div>
          <div>Base rate: <strong>$${baseRate}/day</strong></div>
          <div>Subtotal: <strong>$${subtotal}</strong></div>
          <div>First-time customer: <strong>${isFirstTime ? "Yes" : "No"}</strong></div>
          <div>Loyalty member: <strong>${hasMembership ? "Yes" : "No"}</strong></div>
          <div>Visa cardholder: <strong>${hasPartnerCard ? "Yes" : "No"}</strong></div>
        </div>
        <div id="l6-apply-msg" style="font-size:14px;margin-top:4px"></div>
      </div>
      <div id="l6-stuck" style="display:none;padding:12px 14px;border-radius:10px;background:#eef3ff;border:1px solid #b6c6f2;margin-bottom:12px">
        <div style="display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap">
          <div style="font-size:14px;color:#222"><strong>Stuck?</strong> A well-designed site would just show you your best offer. <span style="color:#A32D2D;font-weight:600">If you choose this, you'll get 0% for this level.</span></div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-p" id="l6-rescue" style="font-size:13px;padding:8px 14px">Show me (0%)</button>
            <button class="btn" id="l6-keep" style="font-size:13px;padding:8px 14px">Keep hunting</button>
          </div>
        </div>
      </div>
    `);

    document.getElementById("l6-timer-off").onclick = () => {
      timerOn = false;
      clearInterval(timerInterval);
      document.getElementById("l6-timer").textContent = "No time limit";
      ["l6-timer-wrap", "l6-timer-note", "l6-timer-off"].forEach(id => { document.getElementById(id).style.display = "none"; });
    };

    const menuContainer = document.createElement("div");
    menuContainer.id = "l6-menu";
    el.appendChild(menuContainer);
    renderMenu(menuContainer);

    document.getElementById("l6-keep").onclick = () => { document.getElementById("l6-stuck").style.display = "none"; };
    document.getElementById("l6-rescue").onclick = () => {
      document.getElementById("l6-stuck").style.display = "none";
      showingRescue = true;
      usedHelp = true;
      paused = true;
      renderMenu(menuContainer);
    };
  },
};

export default level6;
