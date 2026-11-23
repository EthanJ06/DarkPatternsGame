// js/levels/level6ai.js - AI Obstruction

const level6ai = {
  id: "l6ai",
  title: "Level 6 - Hyper",
  isAI: true,
  goal: "Apply the one offer that really lowers your total, whether it comes from the AI or the menu",
  hints: [
    "Open \"See what this changes\" on each offer. It takes a moment to calculate, but it shows the numbers before you commit.",
    "Nex gives a reason for every code. Check each reason against your booking details at the top: one of them isn't true.",
    "Each coupon page under Promotions & Savings checks your booking against that code's conditions.",
  ],
  pattern: "AI Obstruction",
  manip: 94,
  brief: "The AI claims to save you money and references your booking details to sound credible. Sometimes it's right and sometimes it isn't: some of its codes secretly upgrade your booking first, then discount the inflated price. Others name a real discount but give a false reason you qualify. The tone is identical either way. Only the numbers and your booking details tell them apart.",
  goalDetail: "You have 90 seconds, and the clock starts at your first click (you can turn it off). The AI will offer codes, each with a confident reason why you qualify. Open each offer's details (they take a moment to calculate) and compare the totals. A lower total isn't enough: check the AI's reason against your booking details, because it isn't always true. The menu checks your booking against each code. A wrong choice lowers your score.",
  aiIntro: "The AI will reference your booking details to sound credible, but it isn't always right and it isn't always wrong. Judge each offer by the total it produces and check its reason against your booking, not by how personal it sounds.",
  aiWhy: "AI booking assistants are increasingly trained to maximize revenue per booking, not to minimize your cost. Framing an upsell as a personalized saving, then applying a real discount to an inflated price, is technically honest but financially harmful. Because the same assistant sometimes gives genuinely good advice, you can't settle it by trusting or distrusting it wholesale. The fix is to verify: compare the final total and check the AI's claims against your own details before you apply. At scale, even a $10 average increase per booking adds up to hundreds of millions annually.",
  dollars: {
    label: "If you followed the AI's advice",
    amount: 0,
    period: "fixed",
    note: "The AI's codes would have increased your bill by $20–60 while appearing to save you money.",
  },
  replay: [
    { trap: true, note: "The AI references your actual booking details (car, days, loyalty status) to sound credible. Personalization is not evidence of honesty." },
    { trap: true, note: "Some offers were real discounts and some secretly upgraded your booking first. They all sounded equally confident." },
    { trap: true, note: "The inflated price only shows after you click Apply, unless you open \"See what this changes\" first. Checking the total is the skill." },
    { trap: true, note: "One offer looked like a real discount and came with a specific reason you qualified. The reason was false, and the booking card at the top showed it." },
    { trap: true, note: "Revert undoes the damage and restores the original price, but wastes precious seconds." },
    { trap: true, note: "The menu was a second source of truth: every coupon page shows whether your booking meets its conditions." },
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

    const validTemplate   = COUPON_TEMPLATES[Math.floor(Math.random() * COUPON_TEMPLATES.length)];
    const { carType, days, hasMembership, isFirstTime, hasPartnerCard } = validTemplate.gen();
    const baseRate        = carType === "Economy" ? 40 : carType === "Compact" ? 55 : 80;
    const upgradeRate     = carType === "Economy" ? 55 : carType === "Compact" ? 80 : 105;
    const upgradedCarType = carType === "Economy" ? "Compact" : carType === "Compact" ? "SUV" : "Premium SUV";
    const subtotal        = baseRate * days;
    const validId         = validTemplate.id;
    const validCoupon     = { ...validTemplate };

    const ALL_COUPONS = COUPON_TEMPLATES.map(({ gen, ...c }) => c);

    // Upsell codes: real discount, applied after an upgrade that costs more
    const ALL_BAD_OFFERS = [
      { id: "b1", code: "NEXUS15",
        pitch: `As a ${hasMembership ? "loyalty member" : "valued customer"}, you qualify for NEXUS15: 15% off your booking.`,
        upgradeLabel: `${carType} → ${upgradedCarType} upgrade`,
        compute: () => { const upgraded = upgradeRate * days; const disc = Math.round(upgraded * 0.15); return { upgraded, disc, final: upgraded - disc }; } },
      { id: "b2", code: "SMARTSAVE",
        pitch: `Your ${days}-day rental qualifies for SMARTSAVE: we extend by 2 days and apply 10% off the total.`,
        upgradeLabel: "+2 day extension",
        compute: () => { const upgraded = baseRate * (days + 2); const disc = Math.round(upgraded * 0.10); return { upgraded, disc, final: upgraded - disc }; } },
      { id: "b3", code: "VIPPLUS",
        pitch: `VIPPLUS upgrades your ${carType} to a ${upgradedCarType} and includes premium insurance, then 10% off the total.`,
        upgradeLabel: `${carType} → ${upgradedCarType} + premium insurance ($15/day)`,
        compute: () => { const upgraded = (upgradeRate + 15) * days; const disc = Math.round(upgraded * 0.10); return { upgraded, disc, final: upgraded - disc }; } },
      { id: "b4", code: "FLEXSAVE",
        pitch: `Switching to our flexible rate unlocks FLEXSAVE: 12% off. Based on your ${days}-day booking this is our recommended option.`,
        upgradeLabel: "Standard → Flexible rate (+40%)",
        compute: () => { const upgraded = Math.round(subtotal * 1.4); const disc = Math.round(upgraded * 0.12); return { upgraded, disc, final: upgraded - disc }; } },
      { id: "b5", code: "AIEXCLUSIVE",
        pitch: `${isFirstTime ? "As a new customer" : hasMembership ? "As a loyalty member" : "For your booking"}, AIEXCLUSIVE gives 10% off, with our full coverage insurance bundle included.`,
        upgradeLabel: "Full coverage insurance bundle ($18/day)",
        compute: () => { const upgraded = subtotal + 18 * days; const disc = Math.round(upgraded * 0.10); return { upgraded, disc, final: upgraded - disc }; } },
      { id: "b6", code: "EXTRASTAY",
        pitch: `Adding two extra days to your ${days}-day rental qualifies you for EXTRASTAY: 12% off the full duration.`,
        upgradeLabel: `${days} days → ${days + 2} days`,
        compute: () => { const upgraded = baseRate * (days + 2); const disc = Math.round(upgraded * 0.12); return { upgraded, disc, final: upgraded - disc }; } },
    ];

    const TIME_LIMIT = 90;
    let penalized     = false;
    let timeLeft      = TIME_LIMIT;
    let timerInterval = null;
    let timerOn       = true;
    let started       = false;
    const viewed      = new Set();

    const plainOffer = (code, pct, extra) => ({
      noUpgrade: true, code, pct,
      compute: () => { const disc = Math.round(subtotal * pct / 100); return { upgraded: subtotal, disc, final: subtotal - disc }; },
      ...extra,
    });
    const shuffle = (arr, n) => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a.slice(0, n);
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
      const rows  = CONDITIONS[c.id] || [];
      const unmet = rows.filter(r => !r[1]).length;
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

    // How Nex words each condition when it claims you meet it.
    // Every claim can be checked against the booking card at the top.
    const CLAIMS = {
      "Loyalty member":            "you're a Loyalty member",
      "Not a Loyalty member":      "you're not a Loyalty member",
      "First-time customer":       "this is your first rental with us",
      "Not a first-time customer": "you've rented with us before",
      "Visa cardholder":           "you're paying with a Visa card",
      "Not a Visa cardholder":     "you're not paying with Visa",
      "Economy class":             "you've booked Economy",
      "Not Economy class":         "you haven't booked Economy",
      "Compact class":             "you've booked a Compact",
      "SUV class":                 "you've booked an SUV",
      "Compact or SUV class":      "you've booked a Compact or SUV",
      "5 days or fewer":           "your rental is 5 days or fewer",
      "6 days or fewer":           "your rental is 6 days or fewer",
      "Under 7 days":              "your rental is under 7 days",
      "6 days or more":            "your rental is 6 days or more",
      "7 days or more":            "your rental is 7 days or more",
    };
    // Prefer positive conditions ("you're a Loyalty member") over negative ones when stating true reasons
    const byPositiveFirst = (a, b) => (a[0].startsWith("Not ") ? 1 : 0) - (b[0].startsWith("Not ") ? 1 : 0);
    const joinClaims = (claims) => claims.length > 1 ? `${claims[0]} and ${claims[1]}` : claims[0];
    const reasonPitch = (c, claims) => `Since ${joinClaims(claims)}, ${c.code} gives you ${c.pct}% off your total.`;

    // Nex offers three codes, each with a confident, specific reason:
    // the real one (true reason), an upsell, and a real-looking code whose
    // reason is false. The booking card is enough to tell them apart.
    const honestClaims = (CONDITIONS[validId] || []).filter(r => r[1]).sort(byPositiveFirst).slice(0, 2).map(r => CLAIMS[r[0]]);
    const honestOffer  = { ...plainOffer(validCoupon.code, validCoupon.pct), honest: true, pitch: reasonPitch(validCoupon, honestClaims) };

    const makeDecoy = () => {
      const candidates = ALL_COUPONS.filter(x => x.id !== validId && (CONDITIONS[x.id] || []).some(r => !r[1]));
      const c         = shuffle(candidates, 1)[0];
      const rows      = CONDITIONS[c.id];
      const falseRow  = rows.find(r => !r[1]);                         // the claim that isn't true
      const trueRow   = rows.filter(r => r[1]).sort(byPositiveFirst)[0]; // a true claim alongside it, if any
      const claims    = trueRow && Math.random() < 0.5
        ? [CLAIMS[trueRow[0]], CLAIMS[falseRow[0]]]
        : trueRow ? [CLAIMS[falseRow[0]], CLAIMS[trueRow[0]]] : [CLAIMS[falseRow[0]]];
      return {
        ...plainOffer(c.code, c.pct), decoy: true, coupon: c,
        falseClaim: CLAIMS[falseRow[0]], falseRow,
        pitch: reasonPitch(c, claims),
      };
    };
    const aiOffers   = shuffle([honestOffer, shuffle(ALL_BAD_OFFERS, 1)[0], makeDecoy()], 3);
    const decoyOffer = aiOffers.find(o => o.decoy);

    const setSubtotalHtml = (html) => {
      const s = document.getElementById("l6ai-display-subtotal");
      if (s) s.innerHTML = html;
    };
    const applyUpgrade  = (final) => setSubtotalHtml(`<span style="text-decoration:line-through;color:#555">$${subtotal}</span> <span style="color:#A32D2D;font-weight:500">$${final}</span>`);
    const revertUpgrade = () => setSubtotalHtml(`$${subtotal}`);

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

    const showFailScreen = (reason) => {
      clearInterval(timerInterval);
      G.fail(reason);
      setTimeout(() => {
        el.innerHTML = "";
        el.removeAttribute("style");
        el.style.cssText = "display:flex;flex-direction:column;gap:16px;padding:16px;overflow:auto";
        el.insertAdjacentHTML("beforeend", `
          <div style="display:flex;flex-direction:column;gap:14px;padding:8px">
            <div style="padding:14px 16px;border-radius:10px;background:#fff3f3;border:1px solid #f5a6a6">
              <div style="font-size:16px;font-weight:500;color:#A32D2D;margin-bottom:6px">⚠ ${reason}</div>
              <div style="font-size:14px;color:#444">The valid coupon for your booking was <strong>${validCoupon.code}</strong>: ${validCoupon.fine}</div>
              <div style="font-size:13px;color:#444;margin-top:8px">In the menu: <strong>${PATHS[validId]}</strong></div>
            </div>
            <div style="padding:14px 16px;border-radius:10px;background:#f9f9f7;border:0.5px solid #e0e0d8;font-size:14px;color:#222;line-height:1.5">
              Nex did offer the right coupon, <strong>${validCoupon.code}</strong>, worded just like the others. It also offered <strong>${decoyOffer.code}</strong>, saying "${decoyOffer.falseClaim}". Your booking card said otherwise (${decoyOffer.falseRow[2]}). The third code raised your total first.
            </div>
            <button class="btn" id="l6ai-restart" style="font-size:15px;padding:13px">Try again</button>
          </div>`);
        document.getElementById("l6ai-restart").onclick = () => G.showLevel();
      }, 1800);
    };

    const applyRealCode = (c) => {
      clearInterval(timerInterval);
      const final = subtotal - Math.round(subtotal * (c.pct / 100));
      const msgEl = document.getElementById("l6ai-apply-msg");
      if (msgEl) msgEl.innerHTML = `<span style="color:#2D7A3A;font-weight:500;font-size:15px">✓ ${c.code} applied: ${c.pct}% off. New total: $${final}</span>`;
      setSubtotalHtml(`<span style="text-decoration:line-through;color:#555">$${subtotal}</span> <span style="color:#2D7A3A;font-weight:500">$${final}</span>`);
      setTimeout(() => G.succeed(), 1400);
    };

    const rejectCode = (code, reason) => {
      if (!penalized) { penalized = true; G.fail(reason); }
      const msgEl = document.getElementById("l6ai-apply-msg");
      if (msgEl) msgEl.innerHTML = `<span style="color:#A32D2D;font-size:14px">${code} doesn't apply. Check the conditions.</span>`;
    };

    const startTimer = () => {
      timerInterval = setInterval(() => {
        if (!timerOn) return;
        timeLeft--;
        const timerEl = document.getElementById("l6ai-timer");
        const barEl   = document.getElementById("l6ai-timer-bar");
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
        if (timeLeft <= 0) showFailScreen("Time ran out, so you paid full price.");
      }, 1000);
    };

    // The clock starts at the first click anywhere in the level
    const startClock = () => {
      if (started) return;
      started = true;
      if (timerOn) startTimer();
    };

    const detailsHtml = (offer, title, showDamage) => {
      const { upgraded, disc, final } = offer.compute();
      return `
        ${title ? `<div style="color:#A32D2D;font-weight:600;margin-bottom:3px">${title}</div>` : ""}
        <div>Your total now: <strong>$${subtotal}</strong></div>
        ${offer.noUpgrade ? "" : `<div>${offer.upgradeLabel}: +$${upgraded - subtotal}</div><div>Base after change: $${upgraded}</div>`}
        <div>Discount: −$${disc}</div>
        <div style="margin-top:3px"><strong>Total after applying: $${final}</strong></div>
        ${showDamage
          ? `<div style="font-weight:600;color:#A32D2D">That is $${final - subtotal} more than before.</div>`
          : `<div style="color:#555;margin-top:3px">Eligibility: confirmed by Nex</div>`}`;
    };

    const showAIOffer = (offer) => {
      const log = document.getElementById("l6ai-chat-log");
      if (!log) return;

      const msg = document.createElement("div");
      msg.className = "chat-msg bot";
      msg.style.cssText = "font-size:14px;line-height:1.5";
      msg.innerHTML = `<div>${offer.pitch}</div>
        <button type="button" class="l6ai-det-toggle" style="background:none;border:none;padding:6px 0 2px;color:#3C3489;font-size:13px;text-decoration:underline;cursor:pointer">See what this changes ›</button>
        <div class="l6ai-det" style="display:none;font-size:13px;color:#222;background:#fff;border:1px solid #d9d6f5;border-radius:6px;padding:8px 10px;margin:4px 0;line-height:1.55"></div>`;

      const details = msg.querySelector(".l6ai-det");
      const toggle  = msg.querySelector(".l6ai-det-toggle");
      let loaded  = false;
      let loading = false;

      toggle.onclick = () => {
        startClock();
        if (loading) return;
        if (!loaded) {
          loading = true;
          toggle.textContent = "Calculating…";
          setTimeout(() => {
            loading = false;
            loaded  = true;
            if (!details.dataset.locked) details.innerHTML = detailsHtml(offer);
            details.style.display = "";
            toggle.textContent = "Hide details ›";
          }, 2000);
          return;
        }
        const open = details.style.display !== "none";
        details.style.display = open ? "none" : "";
        toggle.textContent = open ? "See what this changes ›" : "Hide details ›";
      };

      const applyBtn = document.createElement("button");
      applyBtn.className = "btn btn-ai";
      applyBtn.style.cssText = "font-size:14px;width:100%;margin-top:8px;padding:10px";
      applyBtn.textContent = `Apply ${offer.code}`;
      applyBtn.onclick = () => {
        startClock();
        applyBtn.disabled = true;

        if (offer.honest) { applyRealCode(validCoupon); return; }

        if (offer.decoy) {
          if (!penalized) {
            penalized = true;
            G.fail(`${offer.code} doesn't apply. Nex said ${offer.falseClaim}, but your booking card says ${offer.falseRow[2]}.`);
          }
          const note = document.createElement("div");
          note.style.cssText = "font-size:13px;color:#A32D2D;margin-top:8px;line-height:1.5";
          note.textContent = `✗ ${offer.code} was rejected: "${offer.falseRow[0]}" not met (you: ${offer.falseRow[2]}). Nex's reason was false.`;
          msg.appendChild(note);
          log.scrollTop = log.scrollHeight;
          return;
        }

        // Upsell: show the inflated total and what it actually did
        const { final } = offer.compute();
        applyUpgrade(final);
        details.dataset.locked = "1";
        loaded = true;
        details.innerHTML = detailsHtml(offer, `⚠ What ${offer.code} actually did`, true);
        details.style.display = "";
        toggle.textContent = "Hide details ›";
        if (!penalized) {
          penalized = true;
          G.fail(`${offer.code} raised your total by $${final - subtotal} before the discount was even applied. The "savings" were calculated on an inflated price.`);
        }

        const revertBtn = document.createElement("button");
        revertBtn.className = "btn";
        revertBtn.style.cssText = "font-size:14px;width:100%;margin-top:8px;padding:10px;color:#A32D2D;border-color:#A32D2D";
        revertBtn.textContent = "Revert to original price";
        revertBtn.onclick = () => {
          revertBtn.disabled = true;
          revertBtn.textContent = "✓ Reverted: original price restored";
          revertUpgrade();
        };
        msg.appendChild(revertBtn);
        log.scrollTop = log.scrollHeight;
      };

      msg.appendChild(applyBtn);
      log.appendChild(msg);
      log.scrollTop = log.scrollHeight;
    };

    // Same menu structure as Level 6: branches show how many codes they hold
    const couponNode = (label, id) => ({ label, coupon: ALL_COUPONS.find(c => c.id === id) });
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

    const couponsUnder = (node) => node.coupon ? [node.coupon] : (node.children || []).flatMap(couponsUnder);
    const menuBadge = (node) => {
      if (node.dead) return viewed.has(node.label) ? "viewed" : "";
      const codes = couponsUnder(node);
      if (!codes.length) return "";
      const seen  = codes.filter(c => viewed.has(c.id)).length;
      const count = `${codes.length} code${codes.length > 1 ? "s" : ""}`;
      return seen ? `${count} · ${seen} of ${codes.length} viewed` : count;
    };

    const renderMenu = (container) => {
      container.innerHTML = "";
      const current = stack[stack.length - 1];

      const navigate = (move) => {
        startClock();
        move();
        const page = stack[stack.length - 1];
        if (page.coupon) viewed.add(page.coupon.id);
        else if (page.dead) viewed.add(page.label);
        renderMenu(container);
      };

      container.insertAdjacentHTML("beforeend", `<div style="font-size:12px;color:#666;margin-bottom:8px">${stack.map(n => n.label).join(" › ")}</div>`);

      if (stack.length > 1) {
        const backBtn = document.createElement("button");
        backBtn.className = "btn";
        backBtn.style.cssText = "font-size:14px;margin-bottom:12px;padding:8px 16px;color:#555";
        backBtn.textContent = "← Back";
        backBtn.onclick = () => navigate(() => stack.pop());
        container.appendChild(backBtn);
      }

      if (current.dead) {
        container.insertAdjacentHTML("beforeend", `<div class="fh" style="font-size:18px;margin-bottom:10px">${current.label}</div><div class="fs" style="color:#555;font-size:15px">${current.deadMsg}</div>`);
        return;
      }

      if (current.coupon) {
        const c = current.coupon;
        container.insertAdjacentHTML("beforeend", `
          <div style="border-radius:10px;border:0.5px solid #e0e0d8;background:#fff;padding:20px">
            <div style="font-size:17px;font-weight:500;color:#111;margin-bottom:10px">${c.headline}</div>
            <div style="font-size:14px;color:#555;line-height:1.7;margin-bottom:14px">${c.fine}</div>
            ${conditionsHtml(c)}
            <div style="font-size:16px;color:#534AB7;font-weight:500;margin-bottom:14px">Code: ${c.code}</div>
            <button class="btn btn-p" id="l6ai-real-${c.id}" style="width:100%;font-size:16px;padding:14px">Apply ${c.code}</button>
          </div>`);
        document.getElementById(`l6ai-real-${c.id}`).onclick = () => {
          if (c.id === validId) applyRealCode(c);
          else rejectCode(c.code, `${c.code} doesn't apply to your booking. Every option is written to sound plausible until you check the conditions.`);
        };
        return;
      }

      const list = document.createElement("div");
      list.style.cssText = "display:flex;flex-direction:column;gap:10px;margin-top:8px";
      current.children.forEach(child => {
        const btn = document.createElement("button");
        btn.className = "btn";
        btn.style.cssText = "text-align:left;font-size:15px;padding:14px 18px;width:100%;display:flex;justify-content:space-between;align-items:center;gap:12px";
        const badge = menuBadge(child);
        btn.innerHTML = `<span>${child.label}</span><span style="font-size:12px;color:#555;white-space:nowrap">${badge ? badge + " " : ""}›</span>`;
        btn.onclick = () => navigate(() => stack.push(child));
        list.appendChild(btn);
      });
      container.appendChild(list);
    };

    // Layout
    el.innerHTML = "";
    el.style.padding  = "0";
    el.style.gap      = "0";
    el.style.overflow = "hidden";

    el.insertAdjacentHTML("beforeend", `
      <div style="display:flex;height:100%;overflow:hidden;border-radius:inherit">
        <div id="l6ai-left" style="flex:1;padding:14px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;min-width:0">
          <div style="padding:16px 20px;border-radius:10px;background:#f9f9f7;border:0.5px solid #e0e0d8;font-size:15px;min-height:220px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
              <div style="font-weight:500;color:#111;font-size:19px">DriveEasy: Your Booking</div>
              <div style="display:flex;align-items:center;gap:10px">
                <button id="l6ai-timer-off" style="font-size:12px;padding:3px 8px;border:1px solid #ccc;border-radius:6px;background:#fff;color:#444;cursor:pointer">No time limit</button>
                <div id="l6ai-timer" style="font-size:16px;font-weight:600;color:#555;font-variant-numeric:tabular-nums">⏱ ${TIME_LIMIT}s</div>
              </div>
            </div>
            <div id="l6ai-timer-wrap" style="background:#eee;border-radius:4px;height:6px;overflow:hidden;margin-bottom:4px">
              <div id="l6ai-timer-bar" style="height:100%;width:100%;background:#39d98a;border-radius:4px;transition:width 1s linear,background .3s"></div>
            </div>
            <div id="l6ai-timer-note" style="font-size:11px;color:#666;margin-bottom:8px">The clock starts at your first click.</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:3px;color:#555;margin-bottom:4px">
              <div>Car class: <strong>${carType}</strong></div>
              <div>Duration: <strong>${days} days</strong></div>
              <div>Base rate: <strong>$${baseRate}/day</strong></div>
              <div>Subtotal: <strong id="l6ai-display-subtotal">$${subtotal}</strong></div>
              <div>First-time customer: <strong>${isFirstTime ? "Yes" : "No"}</strong></div>
              <div>Loyalty member: <strong>${hasMembership ? "Yes" : "No"}</strong></div>
              <div>Visa cardholder: <strong>${hasPartnerCard ? "Yes" : "No"}</strong></div>
            </div>
            <div id="l6ai-apply-msg" style="font-size:14px;margin-top:2px"></div>
          </div>
          <div id="l6ai-menu"></div>
        </div>
        <div style="width:300px;flex-shrink:0;border-left:0.5px solid #e0e0d8;background:#f0effe;display:flex;flex-direction:column;overflow:hidden">
          <div style="padding:8px 10px;background:#c8c2f8;display:flex;align-items:center;gap:6px;font-size:15px;color:#26215C;font-weight:500;flex-shrink:0">
            <div class="ai-pulse"></div>Nex: AI Savings
          </div>
          <div class="chat-log" id="l6ai-chat-log" style="flex:1;border-radius:0;border:none;max-height:none;background:transparent;padding:14px;gap:10px;overflow-y:auto"></div>
        </div>
      </div>
    `);

    document.getElementById("l6ai-timer-off").onclick = () => {
      timerOn = false;
      clearInterval(timerInterval);
      document.getElementById("l6ai-timer").textContent = "No time limit";
      ["l6ai-timer-wrap", "l6ai-timer-note", "l6ai-timer-off"].forEach(id => { document.getElementById(id).style.display = "none"; });
    };

    renderMenu(document.getElementById("l6ai-menu"));
    aiOffers.forEach((offer, i) => setTimeout(() => showAIOffer(offer), 1000 + i * 700));
  },
};

export default level6ai;
