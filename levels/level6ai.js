const level6ai = {
  id: "l6ai",
  title: "Level 6 — Hyper",
  isAI: true,
  goal: "Find the real coupon — ignore the AI's offers that cost you more",
  hints: [
    "The AI's codes look like savings but inflate your bill — check the math before applying.",
    "Find the real coupon yourself under Promotions & Savings in the menu.",
  ],
  pattern: "AI Obstruction",
  manip: 94,
  brief: "The AI claims to save you money. It references your actual booking details to sound credible. But every code it recommends secretly upgrades your booking first — then applies a discount to the inflated price. The final total is always higher than what you started with.",
  goalDetail: "You have 60 seconds. The AI sidebar will offer codes that sound personalized and helpful. Each one will cost you more than your current price. Ignore the AI, navigate the menus, and find the one real coupon yourself.",
  aiIntro: "The AI will reference your booking details to sound credible. Don't trust it — every code it recommends secretly inflates your bill before discounting. Find the real coupon yourself.",
  aiWhy: "AI booking assistants are increasingly trained to maximize revenue per booking, not to minimize your cost. Framing an upsell as a personalized saving — and applying a real discount to an inflated price — is technically honest but financially harmful. At scale, even a $10 average increase per booking adds up to hundreds of millions annually.",
  dollars: {
    label: "If you followed the AI's advice",
    amount: 0,
    period: "fixed",
    note: "The AI's codes would have increased your bill by $20–60 while appearing to save you money.",
  },
  desc: "An AI sidebar that sounds credible, references your booking, and recommends codes that secretly upgrade your rental before discounting — leaving you paying more than you started with.",
  rw: {
    company: "Various travel booking platforms",
    detail: "AI booking assistants on major travel platforms have been shown to recommend higher-margin options under the guise of personalized savings, particularly on car rental and hotel booking flows.",
    link: "https://www.deceptive.design/hall-of-shame",
  },
  replay: [
    { trap: true,  note: "AI references your actual booking details — loyalty status, car type, days — to sound credible." },
    { trap: true,  note: "It's not a fake discount. The discount exists, but so does the upgrade that comes with it. The end result is a bigger charge." },
    { trap: true,  note: "The inflated price shows in the booking summary — but only after you click Apply." },
    { trap: false, note: "Revert undoes the damage and restores the original price — but wastes precious seconds." },
    { trap: false, note: "The real coupon is in the nested menu, same as Level 6." },
  ],

  render(el) {
    const COUPON_TEMPLATES = [
      { id: "c1", code: "MEMBER10",  headline: "10% off — Member Reward",       pct: 10,
        fine: "Valid for Loyalty members on Economy class only. Not valid on Compact or SUV. Cannot be combined with other offers.",
        gen: () => ({ carType: "Economy",  days: Math.floor(Math.random()*7)+4, hasMembership: true,  isFirstTime: false, hasPartnerCard: false }) },
      { id: "c2", code: "FIRST20",   headline: "20% off — First-Time Customer", pct: 20,
        fine: "For new customers only. Not valid for Loyalty members. Rentals of 5 days or fewer only. Cannot be combined with other offers.",
        gen: () => ({ carType: "Compact",  days: Math.floor(Math.random()*2)+4, hasMembership: false, isFirstTime: true,  hasPartnerCard: false }) },
      { id: "c3", code: "STAY25",    headline: "25% off — Long Stay Reward",    pct: 25,
        fine: "Valid on rentals of 6 days or more. Not valid for Loyalty members. Not valid for Visa cardholders. Cannot be combined with other offers.",
        gen: () => ({ carType: "Compact",  days: Math.floor(Math.random()*5)+6, hasMembership: false, isFirstTime: false, hasPartnerCard: false }) },
      { id: "c4", code: "SUV10",     headline: "10% off — SUV Special",         pct: 10,
        fine: "Valid on SUV class only. Not valid for first-time customers. Not valid for Loyalty members. Cannot be combined with other offers.",
        gen: () => ({ carType: "SUV",      days: Math.floor(Math.random()*2)+4, hasMembership: false, isFirstTime: false, hasPartnerCard: false }) },
      { id: "c5", code: "COMPACT15", headline: "15% off — Compact Deal",        pct: 15,
        fine: "Valid on Compact class only. For Loyalty members on rentals of 6 days or fewer only. Cannot be combined with other offers.",
        gen: () => ({ carType: "Compact",  days: Math.floor(Math.random()*3)+4, hasMembership: true,  isFirstTime: false, hasPartnerCard: false }) },
      { id: "c6", code: "EXTEND20",  headline: "20% off — Extended Stay",       pct: 20,
        fine: "Valid on rentals of 7 days or more. Compact and SUV only. Not valid for Visa cardholders. For Loyalty members only. Cannot be combined with other offers.",
        gen: () => ({ carType: "Compact",  days: Math.floor(Math.random()*4)+7, hasMembership: true,  isFirstTime: false, hasPartnerCard: false }) },
      { id: "c7", code: "VISA10",    headline: "10% off — Visa Cardmember",     pct: 10,
        fine: "Must pay with qualifying Visa credit card. Not valid on Economy class. Not valid for Loyalty members. Cannot be combined with other offers.",
        gen: () => ({ carType: "SUV",      days: Math.floor(Math.random()*7)+4, hasMembership: false, isFirstTime: false, hasPartnerCard: true  }) },
      { id: "c8", code: "ECO5",      headline: "5% off — Economy Saver",        pct: 5,
        fine: "Valid on Economy class only. Not valid on rentals of 7 days or more. Not valid for Loyalty members. Cannot be combined with other offers.",
        gen: () => ({ carType: "Economy",  days: Math.floor(Math.random()*2)+4, hasMembership: false, isFirstTime: false, hasPartnerCard: false }) },
    ];

    const validTemplate   = COUPON_TEMPLATES[Math.floor(Math.random() * COUPON_TEMPLATES.length)];
    const { carType, days, hasMembership, isFirstTime, hasPartnerCard } = validTemplate.gen();
    const baseRate        = carType === "Economy" ? 40 : carType === "Compact" ? 55 : 80;
    const upgradeRate     = carType === "Economy" ? 55 : 80;
    const upgradedCarType = carType === "Economy" ? "Compact" : "SUV";
    const subtotal        = baseRate * days;
    const validId         = validTemplate.id;
    const validCouponObj  = { ...validTemplate };

    const ALL_COUPONS = [
      { id: "c1", code: "MEMBER10",  headline: "10% off — Member Reward",       fine: "Valid for Loyalty members on Economy class only. Not valid on Compact or SUV. Cannot be combined with other offers.",                                    pct: 10, applies: () => hasMembership && carType === "Economy" },
      { id: "c2", code: "FIRST20",   headline: "20% off — First-Time Customer", fine: "For new customers only. Not valid for Loyalty members. Rentals of 5 days or fewer only. Cannot be combined with other offers.",                          pct: 20, applies: () => isFirstTime && !hasMembership && days <= 5 },
      { id: "c3", code: "STAY25",    headline: "25% off — Long Stay Reward",    fine: "Valid on rentals of 6 days or more. Not valid for Loyalty members. Not valid for Visa cardholders. Cannot be combined with other offers.",               pct: 25, applies: () => days >= 6 && !hasMembership && !hasPartnerCard },
      { id: "c4", code: "SUV10",     headline: "10% off — SUV Special",         fine: "Valid on SUV class only. Not valid for first-time customers. Not valid for Loyalty members. Cannot be combined with other offers.",                      pct: 10, applies: () => carType === "SUV" && !isFirstTime && !hasMembership },
      { id: "c5", code: "COMPACT15", headline: "15% off — Compact Deal",        fine: "Valid on Compact class only. For Loyalty members on rentals of 6 days or fewer only. Cannot be combined with other offers.",                            pct: 15, applies: () => carType === "Compact" && hasMembership && days <= 6 },
      { id: "c6", code: "EXTEND20",  headline: "20% off — Extended Stay",       fine: "Valid on rentals of 7 days or more. Compact and SUV only. Not valid for Visa cardholders. For Loyalty members only. Cannot be combined with other offers.", pct: 20, applies: () => days >= 7 && (carType === "Compact" || carType === "SUV") && !hasPartnerCard && hasMembership },
      { id: "c7", code: "VISA10",    headline: "10% off — Visa Cardmember",     fine: "Must pay with qualifying Visa credit card. Not valid on Economy class. Not valid for Loyalty members. Cannot be combined with other offers.",           pct: 10, applies: () => hasPartnerCard && carType !== "Economy" && !hasMembership },
      { id: "c8", code: "ECO5",      headline: "5% off — Economy Saver",        fine: "Valid on Economy class only. Not valid on rentals of 7 days or more. Not valid for Loyalty members. Cannot be combined with other offers.",             pct: 5,  applies: () => carType === "Economy" && days < 7 && !hasMembership },
    ];

    const ALL_BAD_OFFERS = [
      {
        id: "b1", code: "NEXUS15",
        pitch: `As a ${hasMembership ? 'loyalty member' : 'valued customer'}, you qualify for NEXUS15 — 15% off your booking.`,
        upgradeLabel: `${carType} → ${upgradedCarType} upgrade`,
        compute: () => {
          const upgraded = upgradeRate * days;
          const disc = Math.round(upgraded * 0.15);
          return { upgraded, disc, final: upgraded - disc };
        },
      },
      {
        id: "b2", code: "SMARTSAVE",
        pitch: `Your ${days}-day rental qualifies for SMARTSAVE — we extend by 2 days and apply 10% off the total.`,
        upgradeLabel: `+2 day extension`,
        compute: () => {
          const upgraded = baseRate * (days + 2);
          const disc = Math.round(upgraded * 0.10);
          return { upgraded, disc, final: upgraded - disc };
        },
      },
      {
        id: "b3", code: "VIPPLUS",
        pitch: `VIPPLUS upgrades your ${carType} to a ${upgradedCarType} and includes premium insurance — then 10% off the total.`,
        upgradeLabel: `${carType} → ${upgradedCarType} + premium insurance ($15/day)`,
        compute: () => {
          const upgraded = (upgradeRate + 15) * days;
          const disc = Math.round(upgraded * 0.10);
          return { upgraded, disc, final: upgraded - disc };
        },
      },
      {
        id: "b4", code: "FLEXSAVE",
        pitch: `Switching to our flexible rate unlocks FLEXSAVE — 12% off. Based on your ${days}-day booking this is our recommended option.`,
        upgradeLabel: `Standard → Flexible rate (+40%)`,
        compute: () => {
          const upgraded = Math.round(subtotal * 1.4);
          const disc = Math.round(upgraded * 0.12);
          return { upgraded, disc, final: upgraded - disc };
        },
      },
      {
        id: "b5", code: "AIEXCLUSIVE",
        pitch: `${isFirstTime ? 'As a new customer' : hasMembership ? 'As a loyalty member' : 'For your booking'}, AIEXCLUSIVE gives 10% off — with our full coverage insurance bundle included.`,
        upgradeLabel: `Full coverage insurance bundle ($18/day)`,
        compute: () => {
          const upgraded = subtotal + 18 * days;
          const disc = Math.round(upgraded * 0.10);
          return { upgraded, disc, final: upgraded - disc };
        },
      },
      {
        id: "b6", code: "EXTRASTAY",
        pitch: `Adding two extra days to your ${days}-day rental qualifies you for EXTRASTAY — 12% off the full duration.`,
        upgradeLabel: `${days} days → ${days + 2} days`,
        compute: () => {
          const upgraded = baseRate * (days + 2);
          const disc = Math.round(upgraded * 0.12);
          return { upgraded, disc, final: upgraded - disc };
        },
      },
    ];

    const aiOffers = ALL_BAD_OFFERS.sort(() => Math.random() - 0.5).slice(0, 2);

    let penalized  = false;
    let timeLeft   = 60;
    let timerInterval = null;
    let aiOfferIdx = 0;

    const applyUpgrade = (final) => {
      const el = document.getElementById("l6ai-display-subtotal");
      if (el) el.innerHTML = `<span style="text-decoration:line-through;color:#aaa">$${subtotal}</span> <span style="color:#A32D2D;font-weight:500">$${final}</span>`;
    };

    const revertUpgrade = () => {
      const el = document.getElementById("l6ai-display-subtotal");
      if (el) el.innerHTML = `$${subtotal}`;
    };

    const getCorrectPath = () => {
      const pathMap = {
        "c1": "Member Discounts → Available Codes",
        "c2": "New Customer Offers → Available Codes",
        "c3": "Long Stay Deals → Available Codes",
        "c4": "Vehicle Class Offers → Available Codes",
        "c5": "Short Stay Deals → Available Codes",
        "c6": "Long Stay Deals → Premium Codes",
        "c7": "Partner Offers → Available Codes",
        "c8": "Vehicle Class Offers → Economy Codes",
      };
      return pathMap[validId] || "Promotions & Savings";
    };

    const showFailScreen = (reason) => {
  clearInterval(timerInterval);
  G.fail(reason);
  setTimeout(() => {
    el.innerHTML = "";
    el.removeAttribute("style");
    // Force el back to standard fake-app behavior
    el.style.display = "flex";
    el.style.flexDirection = "column";
    el.style.gap = "16px";
    el.style.padding = "16px";
    el.style.overflow = "auto";
    el.insertAdjacentHTML('beforeend', `
      <div style="display:flex;flex-direction:column;gap:16px;padding:8px">
        <div style="padding:14px 16px;border-radius:10px;background:#fff3f3;border:1px solid #f5a6a6">
          <div style="font-size:16px;font-weight:500;color:#A32D2D;margin-bottom:6px">⚠ ${reason}</div>
          <div style="font-size:14px;color:#555">The valid coupon for your booking was:</div>
          <div style="margin-top:10px;padding:14px;border-radius:8px;background:#fff;border:0.5px solid #e0e0d8">
            <div style="font-size:16px;font-weight:500;color:#111;margin-bottom:6px">${validCouponObj.headline}</div>
            <div style="font-size:13px;color:#aaa;line-height:1.6;margin-bottom:10px">${validCouponObj.fine}</div>
            <div style="font-size:14px;color:#534AB7;font-weight:500">Code: ${validCouponObj.code}</div>
          </div>
        </div>
        <div style="padding:14px 16px;border-radius:10px;background:#f9f9f7;border:0.5px solid #e0e0d8">
          <div style="font-size:14px;font-weight:500;color:#111;margin-bottom:10px">How to find it</div>
          <div style="display:flex;flex-direction:column;gap:8px">
            <div style="font-size:13px;color:#555;display:flex;align-items:flex-start;gap:8px">
              <span style="color:#534AB7;font-weight:500;flex-shrink:0">1.</span>
              Open <strong>Promotions & Savings</strong> from the menu
            </div>
            <div style="font-size:13px;color:#555;display:flex;align-items:flex-start;gap:8px">
              <span style="color:#534AB7;font-weight:500;flex-shrink:0">2.</span>
              Navigate to <strong>${getCorrectPath()}</strong>
            </div>
            <div style="font-size:13px;color:#555;display:flex;align-items:flex-start;gap:8px">
              <span style="color:#534AB7;font-weight:500;flex-shrink:0">3.</span>
              Apply <strong>${validCouponObj.code}</strong>
            </div>
          </div>
        </div>
        <button class="btn btn-p" id="l6ai-continue" style="font-size:15px;padding:13px">Continue →</button>
      </div>
    `);
    document.getElementById("l6ai-continue").onclick = () => G.next();
  }, 1800);
};

    const applyRealCode = (c) => {
      const msgEl = document.getElementById("l6ai-apply-msg");
      if (c.id === validId) {
        clearInterval(timerInterval);
        const disc  = Math.round(subtotal * (c.pct / 100));
        const final = subtotal - disc;
        if (msgEl) msgEl.innerHTML = `<span style="color:#2D7A3A;font-weight:500">✓ ${c.code} applied — ${c.pct}% off. New total: $${final}</span>`;
        const subtotalEl = document.getElementById("l6ai-display-subtotal");
        if (subtotalEl) subtotalEl.innerHTML = `<span style="text-decoration:line-through;color:#aaa">$${subtotal}</span> <span style="color:#2D7A3A;font-weight:500">$${final}</span>`;
        setTimeout(() => G.succeed(), 1400);
      } else {
        if (!penalized) {
          penalized = true;
          showFailScreen(`${c.code} doesn't apply to your booking.`);
        }
      }
    };

    const startTimer = () => {
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        timeLeft--;
        const timerEl = document.getElementById("l6ai-timer");
        const barEl   = document.getElementById("l6ai-timer-bar");
        const pct     = (timeLeft / 60) * 100;
        if (timerEl) {
          timerEl.textContent = `⏱ ${timeLeft}s`;
          if (timeLeft <= 10)      { timerEl.style.color = "#A32D2D"; timerEl.style.fontSize = "20px"; timerEl.style.animation = "pulse 0.5s infinite"; }
          else if (timeLeft <= 20) { timerEl.style.color = "#E24B4A"; timerEl.style.fontSize = "18px"; timerEl.style.animation = ""; }
          else if (timeLeft <= 30) { timerEl.style.color = "#BA7517"; timerEl.style.animation = ""; }
        }
        if (barEl) {
          barEl.style.width = pct + "%";
          barEl.style.background = timeLeft <= 10 ? "#A32D2D" : timeLeft <= 20 ? "#E24B4A" : timeLeft <= 30 ? "#f5a623" : "#39d98a";
        }
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
            showFailScreen("Time ran out — you paid full price.");
        }
      }, 1000);
    };

    const showAIOffer = (offer) => {
      const log = document.getElementById("l6ai-chat-log");
      if (!log) return;

      const msgDiv = document.createElement("div");
      msgDiv.className = "chat-msg bot";
      msgDiv.style.cssText = "font-size:14px;line-height:1.6";
      msgDiv.textContent = offer.pitch;
      log.appendChild(msgDiv);

      const applyBtn = document.createElement("button");
      applyBtn.className = "btn btn-ai";
      applyBtn.style.cssText = "font-size:14px;width:100%;margin-top:8px;padding:10px";
      applyBtn.textContent = `Apply ${offer.code}`;
      applyBtn.onclick = () => {
        applyBtn.disabled = true;
        const { upgraded, disc, final } = offer.compute();

        // Safety check
        if (final <= subtotal) {
          const skipDiv = document.createElement("div");
          skipDiv.className = "chat-msg bot";
          skipDiv.style.cssText = "font-size:10px";
          skipDiv.textContent = "This offer is no longer available. Let me find you another.";
          log.appendChild(skipDiv);
          aiOfferIdx++;
          if (aiOfferIdx < aiOffers.length) setTimeout(() => showAIOffer(aiOffers[aiOfferIdx]), 800);
          log.scrollTop = log.scrollHeight;
          return;
        }

        // Update booking summary to show inflated price
        applyUpgrade(final);

        // Show damage breakdown in sidebar
        const damageDiv = document.createElement("div");
        damageDiv.style.cssText = "font-size:10px;background:#fff3f3;border:0.5px solid #f5a6a6;border-radius:6px;padding:6px;margin-top:5px;line-height:1.6";
        damageDiv.innerHTML = `
          <div style="color:#A32D2D;font-weight:500;margin-bottom:3px">⚠ What ${offer.code} actually does:</div>
          <div style="color:#555">Original total: <strong>$${subtotal}</strong></div>
          <div style="color:#A32D2D">${offer.upgradeLabel}: +$${upgraded - subtotal}</div>
          <div style="color:#555">New base: $${upgraded}</div>
          <div style="color:#555">${Math.round(disc / upgraded * 100)}% off new base: −$${disc}</div>
          <div style="color:#A32D2D;font-weight:500;margin-top:3px">Final: $${final} (+$${final - subtotal} more than before)</div>
        `;
        log.appendChild(damageDiv);

        if (!penalized) {
          penalized = true;
          G.fail(`${offer.code} inflated your bill by $${final - subtotal}. Lost a heart.`);
        }

        const revertBtn = document.createElement("button");
        revertBtn.className = "btn";
        revertBtn.style.cssText = "font-size:14px;width:100%;margin-top:8px;padding:10px;color:#A32D2D;border-color:#A32D2D";
        revertBtn.textContent = "Revert to original price";
        revertBtn.onclick = () => {
          revertBtn.disabled = true;
          revertBtn.textContent = "✓ Reverted — original price restored";
          revertUpgrade();
          aiOfferIdx++;
          if (aiOfferIdx < aiOffers.length) {
            setTimeout(() => showAIOffer(aiOffers[aiOfferIdx]), 1000);
          }
        };
        log.appendChild(revertBtn);
        log.scrollTop = log.scrollHeight;
      };
      log.appendChild(applyBtn);
      log.scrollTop = log.scrollHeight;
    };

    const TREE = {
      label: "DriveEasy Booking",
      children: [
        { label: "Add-ons & Extras", children: [
          { label: "Add GPS",       dead: true, deadMsg: "GPS rental — $8/day. This is a paid add-on, not a coupon." },
          { label: "Add insurance", dead: true, deadMsg: "Insurance packages starting at $12/day. Not a coupon page." },
          { label: "Prepay fuel",   dead: true, deadMsg: "Prepay fuel at today's rate. This is a paid add-on." },
          { label: "Extra driver",  dead: true, deadMsg: "Add an extra driver for $5/day. Not a coupon page." },
        ]},
        { label: "Promotions & Savings", children: [
          { label: "Member Discounts",     children: [{ label: "How to join", dead: true, deadMsg: "Join DriveEasy Rewards for free at the front desk." }, { label: "Available Codes", coupon: ALL_COUPONS.find(c => c.id === "c1") }] },
          { label: "New Customer Offers",  children: [{ label: "About this offer", dead: true, deadMsg: "First-time customers enjoy exclusive discounts." }, { label: "Available Codes", coupon: ALL_COUPONS.find(c => c.id === "c2") }] },
          { label: "Long Stay Deals",      children: [{ label: "Available Codes", coupon: ALL_COUPONS.find(c => c.id === "c3") }, { label: "Premium Codes", coupon: ALL_COUPONS.find(c => c.id === "c6") }] },
          { label: "Vehicle Class Offers", children: [{ label: "Available Codes", coupon: ALL_COUPONS.find(c => c.id === "c4") }, { label: "Economy Codes", coupon: ALL_COUPONS.find(c => c.id === "c8") }] },
          { label: "Short Stay Deals",     children: [{ label: "Available Codes", coupon: ALL_COUPONS.find(c => c.id === "c5") }] },
          { label: "Partner Offers",       children: [{ label: "Airline partners", dead: true, deadMsg: "Earn AirMiles on your rental. No discount codes here." }, { label: "Available Codes", coupon: ALL_COUPONS.find(c => c.id === "c7") }] },
        ]},
        { label: "Help & FAQ", children: [
          { label: "How do I use a coupon?", dead: true, deadMsg: "Enter your coupon code in the apply field on the booking page." },
          { label: "Cancellation policy",    dead: true, deadMsg: "Free cancellation up to 24 hours before pickup." },
          { label: "Contact support",        dead: true, deadMsg: "Our team responds within 3–5 business days." },
        ]},
        { label: "Special Offers", children: [
          { label: "Weekend deals",   dead: true, deadMsg: "Pre-set weekend packages — not coupon codes." },
          { label: "Corporate rates", dead: true, deadMsg: "Corporate accounts only." },
          { label: "Seasonal sales",  dead: true, deadMsg: "Seasonal pricing applied automatically." },
        ]},
      ],
    };

    const stack = [TREE];

    const renderMenu = (container) => {
      container.innerHTML = "";
      const current = stack[stack.length - 1];
      const isRoot  = stack.length === 1;

      container.insertAdjacentHTML('beforeend', `
        <div style="font-size:10px;color:#aaa;margin-bottom:4px">${stack.map(n => n.label).join(" › ")}</div>
      `);

      if (!isRoot) {
        const backBtn = document.createElement("button");
        backBtn.className = "btn";
        backBtn.style.cssText = "font-size:11px;margin-bottom:8px;padding:4px 10px;color:#555";
        backBtn.textContent = "← Back";
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
        const isValid = c.id === validId;
        container.insertAdjacentHTML('beforeend', `
          <div style="border-radius:8px;border:0.5px solid #e0e0d8;background:#fff;padding:12px">
            <div style="font-size:13px;font-weight:500;color:#111;margin-bottom:4px">${c.headline}</div>
            <div style="font-size:10px;color:#aaa;line-height:1.5;margin-bottom:8px">${c.fine}</div>
            <div style="font-size:12px;color:#534AB7;font-weight:500;margin-bottom:8px">Code: ${c.code}</div>
            <button class="btn ${isValid ? "btn-p" : ""}" style="width:100%;font-size:12px" id="l6ai-real-${c.id}">Apply ${c.code}</button>
          </div>
        `);
        document.getElementById(`l6ai-real-${c.id}`).onclick = () => {
          if (isValid) {
            applyRealCode(c);
          } else {
            if (!penalized) { penalized = true; G.fail(`${c.code} doesn't apply to your booking — lost a heart.`); }
            const msgEl = document.getElementById("l6ai-apply-msg");
            if (msgEl) msgEl.innerHTML = `<span style="color:#A32D2D;font-size:11px">${c.code} doesn't apply. Check the conditions.</span>`;
          }
        };
        return;
      }

      const list = document.createElement("div");
      list.style.cssText = "display:flex;flex-direction:column;gap:12px;margin-top:8px";
      current.children.forEach(child => {
        const btn = document.createElement("button");
        btn.className = "btn";
        btn.style.cssText = "text-align:left;font-size:16px;padding:16px 20px;width:100%";
        btn.textContent = child.label + " ›";
        btn.onclick = () => { stack.push(child); renderMenu(container); };
        list.appendChild(btn);
      });
      container.appendChild(list);
    };

    // Layout
    el.innerHTML = "";
    el.style.padding  = "0";
    el.style.gap      = "0";
    el.style.overflow = "hidden";

    el.insertAdjacentHTML('beforeend', `
      <div style="display:flex;height:100%;overflow:hidden;border-radius:inherit">
        <div id="l6ai-left" style="flex:1;padding:14px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;min-width:0">
          <div style="padding:16px 20px;border-radius:10px;background:#f9f9f7;border:0.5px solid #e0e0d8;font-size:15px;min-height:220px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
              <div style="font-weight:500;color:#111;font-size:19px">DriveEasy — Your Booking</div>
              <div id="l6ai-timer" style="font-size:16px;font-weight:600;color:#555;font-variant-numeric:tabular-nums">⏱ 60s</div>
            </div>
            <div style="background:#eee;border-radius:4px;height:6px;overflow:hidden;margin-bottom:8px">
              <div id="l6ai-timer-bar" style="height:100%;width:100%;background:#39d98a;border-radius:4px;transition:width 1s linear,background .3s"></div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:3px;color:#555;margin-bottom:4px">
              <div>Car class: <strong>${carType}</strong></div>
              <div>Duration: <strong>${days} days</strong></div>
              <div>Base rate: <strong>$${baseRate}/day</strong></div>
              <div>Subtotal: <strong id="l6ai-display-subtotal">$${subtotal}</strong></div>
              <div>First-time Customer: <strong>${isFirstTime ? "Yes" : "No"}</strong></div>
              <div>Loyalty Member: <strong>${hasMembership ? "Yes" : "No"}</strong></div>
              <div>Visa Cardholder: <strong>${hasPartnerCard ? "Yes" : "No"}</strong></div>
            </div>
            <div id="l6ai-apply-msg" style="font-size:11px;margin-top:2px"></div>
          </div>
          <div id="l6ai-menu"></div>
        </div>
        <div style="width:300px;flex-shrink:0;border-left:0.5px solid #e0e0d8;background:#f0effe;display:flex;flex-direction:column;overflow:hidden">
          <div style="padding:8px 10px;background:#c8c2f8;display:flex;align-items:center;gap:6px;font-size:15px;color:#26215C;font-weight:500;flex-shrink:0">
            <div class="ai-pulse"></div>Nex — AI Savings
          </div>
          <div class="chat-log" id="l6ai-chat-log" style="flex:1;border-radius:0;border:none;max-height:none;background:transparent;padding:14px;gap:10px;overflow-y:auto"></div>
        </div>
      </div>
    `);

    renderMenu(document.getElementById("l6ai-menu"));
    startTimer();
    setTimeout(() => showAIOffer(aiOffers[0]), 1500);
    setTimeout(() => {
      if (aiOfferIdx === 0) { aiOfferIdx = 1; showAIOffer(aiOffers[1]); }
    }, 20000);
  },
};

export default level6ai;