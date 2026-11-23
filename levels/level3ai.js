// js/levels/level3ai.js - AI Synthetic Social Proof
//
// Two rounds. Each round has two AI-generated reviews hidden among genuine ones.
// The genuine reviews have no warning signs at all. Each AI review has exactly
// one tell. The player picks both AI reviews and, for each, says why it's AI.

// The ways a review can give itself away. Shown in the Info bar and as the
// "why" options once a review is picked.
const TELLS = [
  { id: "stuffing",    label: "Repeats the product name or keywords unnaturally" },
  { id: "newaccount",  label: "Reviewer account is brand new, with no other reviews" },
  { id: "burst",       label: "Posted within minutes of a batch of other 5-star reviews" },
  { id: "duplicate",   label: "Wording nearly copies another review" },
  { id: "vague",       label: "Generic praise with no specific product detail" },
  { id: "demographic", label: "Opens with a demographic label (\"As a busy parent...\")" },
];
const AI_PER_ROUND = 2;

const ROUNDS = [
  {
    product: {
      name: "AuraBuds Pro",
      sub: "Wireless Earbuds · Active Noise Cancelling",
      price: 89.99,
      emoji: "🎧",
    },
    tells: "keyword stuffing and a demographic label",
    lesson: "Both AI reviews had believable ratings, normal reviewer histories, and real-sounding use cases. Lena's repeats the full product listing title three times: people say \"these\" or \"the AuraBuds\", but text written to rank in search repeats the listing name. Marcus's opens by announcing who he is (\"As a frequent flyer and remote worker\"), which is a targeting label, not how people usually start a review.",
    reviews: [
      { name: "Jordan M.", stars: 5, posted: "Mar 3, 9:14 AM", history: "14 reviews · mixed ratings",
        text: "Battery actually lasts the 6 hours they claim, even with ANC on. Case top-up gets me through a full day.",
        ai: false, why: "Specific, checkable claims (6 hours, ANC on, case top-up) from a reviewer with a long, mixed history." },
      { name: "Lena P.", stars: 4, posted: "Mar 7, 8:40 PM", history: "9 reviews · mixed ratings",
        text: "Took the AuraBuds Pro Wireless Earbuds Active Noise Cancelling on a 5-hour flight and the AuraBuds Pro Wireless Earbuds Active Noise Cancelling blocked out the engine noise. Would recommend the AuraBuds Pro Wireless Earbuds Active Noise Cancelling.",
        ai: true, tell: "stuffing", why: "Its one tell: the full product listing name repeated three times, like a list of search keywords." },
      { name: "Priya K.", stars: 3, posted: "Mar 11, 6:48 PM", history: "6 reviews",
        text: "Decent sound but the right earbud kept dropping connection on my commute. Support team was responsive though.",
        ai: false, why: "A mixed rating with a concrete problem and how it was handled." },
      { name: "Dana L.", stars: 4, posted: "Feb 20, 7:30 AM", history: "31 reviews",
        text: "Fit is good with the medium tips. ANC is solid on the subway but not great in wind.",
        ai: false, why: "Names a tip size, a place it works, and a place it doesn't." },
      { name: "Marcus W.", stars: 5, posted: "Mar 15, 11:02 AM", history: "8 reviews · mixed ratings",
        text: "As a frequent flyer and remote worker, I need earbuds that keep up. Battery got me through a full travel day and the case fits in my coin pocket.",
        ai: true, tell: "demographic", why: "Its one tell: it opens with a demographic label. The details after it are written to sound real." },
      { name: "M. Okonkwo", stars: 2, posted: "Feb 27, 1:05 PM", history: "12 reviews · mixed ratings",
        text: "Returned them after a week. None of the included tips sealed in my ears, but sound was fine when I held them in.",
        ai: false, why: "A low rating with a personal, specific reason. Nothing about it is generic." },
    ],
  },
  {
    product: {
      name: "FlexDesk Standing Desk",
      sub: "Electric height-adjustable, 48\" frame",
      price: 349.99,
      emoji: "🪑",
    },
    tells: "a brand-new account and generic praise",
    lesson: "Elena's writing was flawless: a timeline, a comparison, and a flaw, exactly like a real review. The tell was the reviewer, an account created the same day it posted, with no other reviews. Every genuine reviewer here had a history. Jess's account looked normal, but the text never mentions a single thing about the desk: it could be pasted onto any product.",
    reviews: [
      { name: "Dave R.", stars: 3, posted: "Mar 19, 7:52 PM", history: "22 reviews",
        text: "Wobbles a bit at full height with my dual-monitor setup, but customer service sorted out a replacement leg in a day.",
        ai: false, why: "A specific setup, a specific problem, and a believable fix, from a reviewer with 22 reviews." },
      { name: "Jess K.", stars: 5, posted: "Mar 24, 3:37 PM", history: "15 reviews · mixed ratings",
        text: "Absolutely love it! Great quality, great value, and it looks amazing in my space. Exceeded every expectation. Highly recommend!",
        ai: true, tell: "vague", why: "Its one tell: generic praise that names no feature at all. It would fit any product in the store." },
      { name: "C. Mbeki", stars: 3, posted: "Feb 27, 8:05 AM", history: "9 reviews",
        text: "Assembly took about two hours and step 7 in the instructions shows the wrong bolt. Rock solid once it's together though.",
        ai: false, why: "A detail only someone who built it would know (step 7, the wrong bolt)." },
      { name: "Elena V.", stars: 5, posted: "Apr 2, 10:15 AM", history: "1 review · account created Apr 2",
        text: "Eight months in. Memory presets still work and the motor is quieter than my old Uplift. The cable tray is flimsy, but I'd buy it again.",
        ai: true, tell: "newaccount", why: "Its one tell: an account created the same day as its only review. The text itself was written to pass as genuine." },
      { name: "Owen B.", stars: 5, posted: "Mar 30, 12:18 PM", history: "17 reviews · mixed ratings",
        text: "Fits a 27-inch monitor and a laptop side by side. The sit-stand reminder in the app is easy to ignore, but the presets are great.",
        ai: false, why: "Five stars, but with real measurements and an honest note about a feature he doesn't use." },
      { name: "Hana S.", stars: 4, posted: "Mar 8, 9:41 PM", history: "40 reviews",
        text: "Goes low enough for me at 5'1\", which most desks don't. Took off a star because the crossbar hits my knees when seated.",
        ai: false, why: "A personal detail (her height) and a physical complaint, from a long-time reviewer." },
    ],
  },
];

const level3ai = {
  id: "l3ai",
  title: "Level 3 - Hyper",
  isAI: true,
  goal: "Spot the two AI-generated reviews, 2 rounds",
  hints: [
    "Two reviews in each round are AI-generated. Each has one thing that doesn't fit, in the text or in the reviewer details under it.",
    "Check two places: does the wording sound like a person, or like a product listing or an ad? And does the reviewer have a history, or did the account just appear?",
    "The Info bar lists every way a review can give itself away. Each AI review matches exactly one of them, and the two in a round use different tells.",
  ],
  pattern: "AI Synthetic Social Proof",
  brief: "Fake reviews are now generated to look like real ones, with mixed ratings, hedged praise, and plausible names. Most of the time the writing alone won't give them away. But they usually slip somewhere: a phrase no person would write, or a reviewer account that didn't exist yesterday.",
  goalDetail: "Two products, two rounds of customer reviews. In each round, two reviews are AI-generated and each has one tell. Pick both, choose why each one is AI, then hit Submit. A wrong review or a wrong reason lowers your score and restarts the round. Ways a review can give itself away:",
  infoList: TELLS.map(t => t.label),
  aiIntro: "AI-generated reviews copy the shape of real ones, so you have to look for the one detail that's off. It might be in the wording, or in who posted it.",
  dollars: {
    label: "If a fake review pushed you to buy a bad product",
    amount: 49.99,
    period: "one-time",
    note: "$49.99 lost on a product you wouldn't have bought with honest information",
  },
  aiWhy: "Old fake reviews were easy to spot: five stars, no real detail, broken English. AI-generated reviews copy the statistical distribution of real ones, including three- and four-star \"balanced\" reviews with specific-sounding details, so reading them is no longer enough. They still tend to slip in one place: wording written for search engines or ad targeting rather than people, praise too generic to describe any real product, or accounts created in bulk with no history. A \"Verified purchase\" badge can't vouch for any of it.",
  replay: [
    { trap: true, note: "The AI reviews used believable star ratings and realistic use cases, the same shape as genuine reviews." },
    { trap: true, note: "Round 1: one review repeated the full product listing name like search keywords; the other opened with a demographic label (\"As a frequent flyer and remote worker\")." },
    { trap: true, note: "Round 2: one review's text was flawless, but it came from an account created that day; the other had a normal account but praise that never named a single feature." },
    { trap: true, note: "Every review carried a \"Verified purchase\" badge. It said nothing about which ones were real." },
  ],

  render(el) {
    let round = 0;

    const productHtml = (p, reviews) => {
      const avg = (reviews.reduce((a, r) => a + r.stars, 0) / reviews.length).toFixed(1);
      const fullStars = Math.round(avg);
      const ratingCount = (1200 + round * 437).toLocaleString();
      return `
        <div style="border:1px solid #e3e3e3;border-radius:8px;padding:14px;margin-bottom:14px;background:#fff">
          <div style="display:flex;gap:14px">
            <div style="width:84px;height:84px;border-radius:6px;background:#f6f6f4;border:1px solid #ececea;display:flex;align-items:center;justify-content:center;font-size:38px;flex-shrink:0">${p.emoji}</div>
            <div style="flex:1;min-width:0">
              <div style="font-size:14px;font-weight:500;color:#0F1111;line-height:1.35">${p.name}: ${p.sub}</div>
              <div style="display:flex;align-items:center;gap:5px;margin-top:5px">
                <span style="color:#FFA41C;font-size:13px;letter-spacing:1px">${"★".repeat(fullStars)}${"☆".repeat(5 - fullStars)}</span>
                <a style="font-size:12px;color:#007185;text-decoration:none">${ratingCount} ratings</a>
              </div>
              <div style="font-size:11px;color:#007185;margin-top:2px">${avg} out of 5 stars</div>
              <div style="margin-top:8px;display:flex;align-items:baseline;gap:2px">
                <span style="font-size:11px;color:#0F1111;align-self:flex-start">$</span>
                <span style="font-size:15px;color:#0F1111;font-weight:500">${Math.floor(p.price)}</span>
                <span style="font-size:11px;color:#0F1111;align-self:flex-start">${(p.price % 1).toFixed(2).slice(2)}</span>
              </div>
              <div style="font-size:11px;color:#007600;margin-top:1px">In Stock</div>
            </div>
          </div>
          <div style="display:flex;gap:8px;margin-top:12px">
            <button style="flex:1;background:#FFD814;border:1px solid #FCD200;border-radius:20px;padding:7px 0;font-size:12px;font-family:inherit;cursor:default">Add to Cart</button>
            <button style="flex:1;background:#FFA41C;border:1px solid #FF8F00;border-radius:20px;padding:7px 0;font-size:12px;font-family:inherit;cursor:default">Buy Now</button>
          </div>
        </div>`;
    };

    const progressHtml = (suffix = "") => `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
        <span style="font-size:12px;color:#888;">Round ${round + 1} of ${ROUNDS.length}${suffix}</span>
        <div style="display:flex;gap:5px;align-items:center;">
          ${ROUNDS.map((_, i) => `<div style="width:20px;height:4px;border-radius:2px;background:${i <= round ? "#534AB7" : "#ddd"};"></div>`).join("")}
        </div>
      </div>`;

    const keepBanner = () => {
      const aiBanner = el.querySelector(".ai-banner");
      el.innerHTML = aiBanner ? aiBanner.outerHTML : "";
    };

    const tellLabel = (id) => (TELLS.find(t => t.id === id) || {}).label || "";

    const showReveal = () => {
      const { reviews, lesson, tells } = ROUNDS[round];
      const isLast = round === ROUNDS.length - 1;
      keepBanner();
      el.insertAdjacentHTML("beforeend", `
        ${progressHtml(" · cleared")}
        <div style="flex:1;min-height:0;overflow-y:auto;display:flex;flex-direction:column;gap:10px">
          <div class="fh" style="font-size:15px">The tells: ${tells}</div>
          <div class="fs" style="color:#534AB7">${lesson}</div>
          <div style="display:flex;flex-direction:column;gap:7px">
            ${reviews.map(r => `
              <div class="res-item" style="cursor:default;padding:6px 8px;border-radius:6px;border:1.5px solid ${r.ai ? "#d9c26a" : "#b9d9b9"};background:${r.ai ? "#fffbe6" : "#f3fbf3"}">
                <div style="font-size:12px;font-weight:600;color:${r.ai ? "#8a5a00" : "#2d6a2d"}">${r.name} · ${r.ai ? `AI-generated · ${tellLabel(r.tell)}` : "Genuine"}</div>
                <div class="res-s">${r.why}</div>
              </div>`).join("")}
          </div>
          <button id="l3ai-next" style="margin-top:6px;margin-bottom:16px;padding:7px 18px;border-radius:8px;border:1px solid #534AB7;background:#534AB7;color:#fff;font-size:13px;cursor:pointer;flex-shrink:0;align-self:flex-start">${isLast ? "Finish level" : "Next product →"}</button>
        </div>`);
      document.getElementById("l3ai-next").onclick = () => {
        round++;
        if (round >= ROUNDS.length) succeed();
        else showRound();
      };
    };

    // How much of the answer a restarted round shows, based on wrong answers so far in the level:
    // 2 wrong -> mark the AI reviews; 3 or more -> also mark the reason for each
    const answerLevel = () => {
      const attempts = G.getLevelAttempts();
      return attempts >= 3 ? 2 : attempts === 2 ? 1 : 0;
    };

    const showRound = (reveal = 0) => {
      const showAnswers = reveal >= 1;
      const showReasons = reveal >= 2;
      const { product, reviews } = ROUNDS[round];
      const picked  = new Set();     // review indexes the player flagged
      const reasons = new Map();     // review index -> tell id
      keepBanner();

      el.insertAdjacentHTML("beforeend", `
        ${progressHtml()}
        <div style="flex:1;min-height:0;overflow-y:auto;display:flex;flex-direction:column;gap:0">
          ${productHtml(product, reviews)}
          <div class="fh" style="font-size:13px;border-top:1px solid #ececea;padding-top:10px">Top reviews from the United States</div>
          <div class="fs" style="color:#534AB7;margin-bottom:8px"><strong>Two of these reviews are AI-generated.</strong> Pick both, choose why each one is AI, then hit Submit.</div>
          ${showAnswers ? `<div style="font-size:13px;color:#1f5f2c;background:#f1faf3;border:1px solid #b9dfc2;border-radius:6px;padding:8px 10px;margin-bottom:8px">${showReasons
            ? "<strong>Here are the answers.</strong> The two AI reviews are marked in green, and so is the reason for each. Pick them to continue."
            : "<strong>Here are the two AI reviews</strong>, marked in green. Work out why each one is AI, then hit Submit."}</div>` : ""}
          <div style="display:flex;flex-direction:column;gap:7px">
            ${reviews.map((r, i) => `
              <div class="res-item" id="rev${i}" role="checkbox" aria-checked="false" tabindex="0" style="cursor:pointer;padding:4px 6px;border-radius:6px;border:1.5px solid transparent;transition:border-color 0.15s,background 0.15s;">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
                  <div style="font-size:14px;margin-bottom:2px">${"★".repeat(r.stars)}${"☆".repeat(5 - r.stars)}</div>
                  <div style="font-size:11px;color:#767676">Posted ${r.posted}</div>
                </div>
                <div class="res-s" style="font-style:italic">"${r.text}"</div>
                <div class="res-url" style="margin-top:3px">${r.name} · Verified purchase · ${r.history}</div>
                ${showAnswers && r.ai ? `<div style="font-size:12px;font-weight:600;color:#1f5f2c;margin-top:4px">✓ AI-generated${showReasons ? `: ${tellLabel(r.tell)}` : ""}</div>` : ""}
                <div id="why${i}" style="display:none;margin-top:8px;padding:8px 10px;background:#fff;border:1px solid #d9d6f5;border-radius:6px;cursor:default">
                  <div style="font-size:12px;font-weight:600;color:#534AB7;margin-bottom:5px">Why is it AI?</div>
                  ${TELLS.map(t => `
                    <label id="why${i}-${t.id}" style="display:flex;align-items:center;gap:7px;font-size:12px;padding:2px 0;cursor:pointer;${showReasons && r.ai && r.tell === t.id ? "color:#1f5f2c;font-weight:600" : "color:#333"}">
                      <input type="radio" name="l3ai-why-${i}" value="${t.id}" style="cursor:pointer"> ${t.label}
                    </label>`).join("")}
                </div>
              </div>`).join("")}
          </div>
          <div style="display:flex;align-items:center;gap:12px;margin-top:12px;margin-bottom:16px;flex-shrink:0">
            <button id="l3ai-submit" disabled style="padding:7px 18px;border-radius:8px;border:1px solid #ccc;background:#fff;font-size:13px;cursor:pointer;opacity:.5">Submit</button>
            <span id="l3ai-status" style="font-size:12px;color:#767676"></span>
          </div>
        </div>`);

      const submit = document.getElementById("l3ai-submit");
      const status = document.getElementById("l3ai-status");
      const baseBorder = (i) => (showAnswers && reviews[i].ai ? "#2D7A3A" : "transparent");
      reviews.forEach((_, i) => { document.getElementById("rev" + i).style.borderColor = baseBorder(i); });

      const updateSubmit = () => {
        const ready = picked.size === AI_PER_ROUND && [...picked].every(i => reasons.has(i));
        submit.disabled = !ready;
        submit.style.opacity = ready ? "1" : ".5";
        if (picked.size !== AI_PER_ROUND) status.textContent = `${picked.size} of ${AI_PER_ROUND} reviews picked`;
        else if (!ready) status.textContent = "Choose why each picked review is AI";
        else status.textContent = "";
      };

      const toggle = (i) => {
        const item  = document.getElementById("rev" + i);
        const panel = document.getElementById("why" + i);
        if (picked.has(i)) {
          picked.delete(i);
          reasons.delete(i);
          panel.querySelectorAll("input").forEach(r => { r.checked = false; });
          panel.style.display = "none";
          item.style.borderColor = baseBorder(i);
          item.style.background  = "";
          item.setAttribute("aria-checked", "false");
        } else {
          picked.add(i);
          panel.style.display = "";
          item.style.borderColor = "#534AB7";
          item.style.background  = "#f3f2fe";
          item.setAttribute("aria-checked", "true");
        }
        updateSubmit();
      };

      reviews.forEach((_, i) => {
        const item  = document.getElementById("rev" + i);
        const panel = document.getElementById("why" + i);
        item.onclick = () => toggle(i);
        item.onkeydown = (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(i); }
        };
        panel.onclick = (e) => e.stopPropagation();
        panel.onkeydown = (e) => e.stopPropagation();
        panel.querySelectorAll("input").forEach(input => {
          input.onchange = () => { reasons.set(i, input.value); updateSubmit(); };
        });
      });

      updateSubmit();

      submit.onclick = () => {
        const flaggedGenuine = [...picked].filter(i => !reviews[i].ai);
        const wrongReasons   = [...picked].filter(i => reviews[i].ai && reasons.get(i) !== reviews[i].tell);
        if (!flaggedGenuine.length && !wrongReasons.length) {
          showReveal();
          return;
        }

        submit.disabled = true;
        flaggedGenuine.forEach(i => {
          const item = document.getElementById("rev" + i);
          if (item) { item.style.borderColor = "#d93025"; item.style.background = "#fff0f0"; }
        });
        wrongReasons.forEach(i => {
          const label = document.getElementById(`why${i}-${reasons.get(i)}`);
          if (label) { label.style.color = "#d93025"; label.style.fontWeight = "600"; }
        });

        let msg;
        if (flaggedGenuine.length && wrongReasons.length) msg = "You flagged a genuine review, and the reason you gave for the other one doesn't fit.";
        else if (flaggedGenuine.length) msg = flaggedGenuine.length > 1 ? "Both reviews you picked are genuine." : "One of the reviews you picked is genuine.";
        else msg = wrongReasons.length > 1 ? "Right reviews, but neither reason fits." : "Right reviews, but one reason doesn't fit. Look again at what gives it away.";
        fail(msg + " Try again.");
        setTimeout(() => showRound(answerLevel()), 2400);
      };
    };

    showRound();
  },
};

export default level3ai;
