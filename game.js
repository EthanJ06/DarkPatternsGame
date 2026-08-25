// ======== sfx.js ========
// js/sfx.js — Web Audio sound effects

let ctx = null;

function getCtx() {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch (e) { /* audio not available */ }
  }
  return ctx;
}

function osc(type, freq, gain, dur, when) {
  const c = getCtx();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.connect(g);
  g.connect(c.destination);
  o.type = type;
  o.frequency.setValueAtTime(freq, when ?? c.currentTime);
  g.gain.setValueAtTime(gain, when ?? c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, (when ?? c.currentTime) + dur);
  o.start(when ?? c.currentTime);
  o.stop((when ?? c.currentTime) + dur);
}

function noise(dur, gainVal) {
  const c = getCtx();
  if (!c) return;
  const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  const g = c.createGain();
  src.buffer = buf;
  src.connect(g);
  g.connect(c.destination);
  g.gain.setValueAtTime(gainVal, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
  src.start();
  src.stop(c.currentTime + dur);
}

function dodge() {
  osc('sine', 880, .12, .08);
  setTimeout(() => osc('sine', 1100, .08, .08), 80);
}

function caught() {
  osc('sawtooth', 300, .18, .08);
  setTimeout(() => osc('sawtooth', 220, .15, .1), 80);
  setTimeout(() => noise(.12, .15), 160);
  setTimeout(() => osc('sine', 80, .3, .25), 180);
}

function almost() {
  osc('triangle', 660, .07, .12);
  setTimeout(() => osc('triangle', 550, .05, .1), 100);
}

function tick() {
  osc('square', 1200, .04, .04);
}

function levelClear(grade) {
  if (grade === 'S' || grade === 'A') {
    [[523, .1], [659, .1], [784, .1], [1047, .25]].forEach(([f, d], i) => {
      setTimeout(() => osc('sine', f, .15, d), i * 120);
    });
  } else {
    osc('sine', 523, .1, .1);
    setTimeout(() => osc('sine', 659, .08, .15), 120);
  }
}

function win() {
  [[523, .08], [659, .08], [784, .08], [1047, .08], [1319, .3]].forEach(([f, d], i) => {
    setTimeout(() => osc('sine', f, .12, d), i * 100);
  });
}

function bgStart() {
  const c = getCtx();
  if (!c || c._bgRunning) return;
  c._bgRunning = true;
  function hum(freq, gain) {
    const o = c.createOscillator();
    const g = c.createGain();
    o.connect(g);
    g.connect(c.destination);
    o.type = 'sine';
    o.frequency.value = freq;
    g.gain.value = gain;
    o.start();
    return { o, g };
  }
  c._bgNodes = [hum(55, .012), hum(82, .008)];
}

function bgStop() {
  const c = getCtx();
  if (!c || !c._bgNodes) return;
  c._bgNodes.forEach(n => {
    try {
      n.g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 1);
      n.o.stop(c.currentTime + 1);
    } catch (e) { /* ignore */ }
  });
  c._bgNodes = null;
  c._bgRunning = false;
}

// ======== achievements.js ========
// js/achievements.js — Achievement definitions and unlock logic

const ACHIEVEMENTS = [
  { id: 'first_blood',   icon: '🩸', name: 'First Blood',    desc: 'Lost your first heart.' },
  { id: 'untouchable',   icon: '🛡️', name: 'Untouchable',    desc: 'Completed the game without losing a single heart.' },
  { id: 'speed_reader',  icon: '⚡', name: 'Speed Reader',   desc: 'Cleared Level 4 with more than 15 seconds remaining.' },
  { id: 'bot_whisperer', icon: '🤖', name: 'Bot Whisperer',  desc: 'Cleared Level 1 AI in the minimum number of messages.' },
  { id: 'sharp_eye',     icon: '👁️', name: 'Sharp Eye',      desc: 'Spotted the AI-generated review on the first try.' },
  { id: 'streak_3',      icon: '🔥', name: 'On Fire',        desc: 'Cleared 3 levels in a row with no damage.' },
  { id: 'all_s',         icon: '⭐', name: 'Perfect Run',    desc: 'S-ranked every level in a single run.' },
  { id: 'hard_clear',    icon: '💀', name: 'They Know',      desc: 'Completed the game in hard mode.' },
  { id: 'caught_fakeout',icon: '🎭', name: 'Fool Me Once',   desc: 'Spotted the dark pattern on the win screen.' },
  { id: 'no_hints',      icon: '🧠', name: 'No Hints',       desc: 'Completed the game without ever using a hint.' },
];

/** Render achievement list into a container element */
function renderAchievements(containerEl, unlockedSet) {
  containerEl.innerHTML = ACHIEVEMENTS.map(a => {
    const got = unlockedSet.has(a.id);
    return `
      <div class="achievement${got ? '' : ' ach-locked'}">
        <div class="ach-icon">${a.icon}</div>
        <div style="flex:1;min-width:0;text-align:left">
          <div class="ach-name">${a.name}</div>
          <div class="ach-desc">${a.desc}</div>
        </div>
        <div style="font-size:11px;color:#3B6D11;font-weight:500;margin-left:auto;padding-left:8px;flex-shrink:0">${got ? '✓' : ''}</div>
      </div>`;
  }).join('');
}

// ======== glossary.js ========
// js/glossary.js — Glossary data and overlay logic

const GLOSSARY = [
  {
    name: "Roach Motel",
    ai: false,
    desc: "Easy to get in, impossible to get out. Sign-up is made to be seamless; cancellation however, is buried and gated behind surveys, and wrapped in fake offers.",
    coined: "Named by Harry Brignull, 2010. Based on the ad slogan \"You can check in, but you can't check out.\""
  },
  {
    name: "Confirmshaming",
    ai: false,
    desc: "The decline option is worded or phrased as a self-inflicted insult. You are not declining an offer, rather you are confessing to having a character flaw.",
    coined: "Coined by Nathaniel Read, 2014."
  },
  {
    name: "Disguised Ads",
    ai: false,
    desc: "Paid results or promotional content that's styled to look identical to organic content. The \"Sponsored\" label is made small and low-contrast, so it's easy to miss.",
    coined: "Part of Harry Brignull's original 2010 taxonomy."
  },
  {
    name: "Trick Questions",
    ai: false,
    desc: "Double negatives, confusing phrasing, and time pressure all work together to make users \"consent\" to things they never actually intended. The wording is designed to be misread.",
    coined: "Part of Harry Brignull's original 2010 taxonomy."
  },
  {
    name: "Sneak into Basket",
    ai: false,
    desc: "Extra items, like warranties, insurance, subscriptions, or donations, are pre-added to your cart and hidden below the fold or styled to blend in so you don't notice them.",
    coined: "Part of Harry Brignull's original 2010 taxonomy. Ryanair and Sports Direct were famous practitioners."
  },
  {
  name: "Obstruction",
  ai: false,
  desc: "Companies are legally required to make certain actions available, like deleting your account or redeeming an advertised discount. Obstruction means burying those actions so deep behind mislabeled menus, fake fields, and dead ends that most people just give up before they ever find them.",
  coined: "Part of Harry Brignull's original 2010 taxonomy. The FTC and EU DSA have both begun targeting obstruction patterns specifically in account deletion and consent withdrawal flows."
  },
  {
    name: "Fake Scarcity / Urgency",
    ai: false,
    desc: "Countdown timers, fake stock warnings, and fabricated social proof (like \"847 people viewing\") are all designed to trigger loss aversion and panic-buying. Almost none of the scarcity is actually real: the timer resets, the stock number never changes, and the viewer count is just randomly generated.",
    coined: "Part of Harry Brignull's original 2010 taxonomy. Booking.com was fined by the UK CMA in 2019 for fabricated scarcity messaging."
  },
  {
    name: "AI Roach Motel",
    ai: true,
    desc: "A chatbot that endlessly deflects questions, forgets context, misunderstands requests, and manufactures obstacles. Tactics intentionally implemented into the AI designed to exhaust you into staying subscribed.",
    coined: "An AI-amplified version of Roach Motel. AI makes deflection scalable and tireless."
  },
  {
    name: "AI Confirmshaming",
    ai: true,
    desc: "Behavioral analysis generates copy tailored to shame you according to your psychology profile, unlike regular confirmshaming it is not generic guilt, but something that feels disturbingly personal and eerily specific to you.",
    coined: "An AI-amplified version of Confirmshaming. Personalization makes shame more effective."
  },
  {
    name: "AI Synthetic Social Proof",
    ai: true,
    desc: "AI-generated reviews, ratings, and testimonials that sound statistically plausible, but are entirely fabricated. Unlike older fake reviews, these are tuned specifically to sound credible, making them a lot harder to spot.",
    coined: "An AI-era evolution. The FTC began pursuing enforcement in 2023–2024."
  },
  {
    name: "AI A/B Gaslighting",
    ai: true,
    desc: "Unlike regular Trick Questions, this version of the consent interface actually \"A/B tests\" itself in real time. Every time you get close to opting out, it reshuffles the wording and calls it \"personalization.\" It is not.",
    coined: "An AI-amplified version of Trick Questions. Real consent management platforms have begun using variant testing on consent UI."
  },
  {
    name: "AI Hyper-Personalized Upsell",
    ai: true,
    desc: "Unlike regular Sneak into Basket, a pseudo-AI \"predicts\" exactly what you're likely to buy based on your \"profile.\" In reality it's just basic heuristics dressed up in algorithmic confidence, designed to make declining feel irrational.",
    coined: "An AI-amplified version of Sneak into Basket. Dynamic personalization increases conversion rates by 20–30% according to industry research."
  },
  {
    name: "AI Obstruction",
    ai: true,
    desc: "Unlike regular Obstruction, this is an AI assistant that sounds like it's finding you real savings, but every code it recommends secretly upgrades your order first, so the \"discount\" still leaves you paying more than you started with.",
    coined: "An AI-amplified version of Obstruction. The discount is real; as well as the inflated price it's applied to."
  },
  {
    name: "AI Personalized Scarcity",
    ai: true,
    desc: "Unlike regular Fake Scarcity, this pulls real items from your order history and attaches a manufactured stock countdown to each one — \"NexusAI flagged your iPad purchase\" borrows the credibility of something true to sell a shortage that isn't.",
    coined: "An AI-amplified version of Fake Scarcity / Urgency. The purchase history is real; the urgency attached to it is not."
  },
];

// Every base pattern paired with its AI-amplified counterpart, where one
// exists. A `null` second element means no AI-amplified level exists yet —
// the info page then renders a single section instead of a pair.
const PATTERN_PAIRS = [
  ['Roach Motel', 'AI Roach Motel'],
  ['Confirmshaming', 'AI Confirmshaming'],
  ['Disguised Ads', 'AI Synthetic Social Proof'],
  ['Trick Questions', 'AI A/B Gaslighting'],
  ['Sneak into Basket', 'AI Hyper-Personalized Upsell'],
  ['Obstruction', 'AI Obstruction'],
  ['Fake Scarcity / Urgency', 'AI Personalized Scarcity'],
];

function findPatternPair(name) {
  for (const pair of PATTERN_PAIRS) {
    if (pair[0] === name || pair[1] === name) return pair;
  }
  return [name, null];
}

// Looks up a single glossary entry by its exact pattern name (as used in
// each level's `pattern` field). Returns null if no match is found, so
// callers can fall back gracefully instead of throwing.
function findGlossaryEntry(name) {
  return GLOSSARY.find(g => g.name === name) || null;
}

function showGlossary() {
  const countEl = document.getElementById('glossary-count');
  if (countEl) {
    const aiCount = GLOSSARY.filter(g => g.ai).length;
    countEl.textContent = `${GLOSSARY.length} patterns · ${aiCount} AI-amplified`;
  }
  document.getElementById('glossary-body').innerHTML = GLOSSARY.map(g => `
    <div class="glossary-item clickable" onclick="Glossary.showPatternInfo('${g.name.replace(/'/g, "\\'")}')">
      <div class="glossary-item-name${g.ai ? ' is-ai' : ''}">
        ${g.name}
        ${g.ai ? '<span style="font-size:11px;font-weight:400;color:#AFA9EC"> AI-amplified</span>' : ''}
        <span class="glossary-more-toggle">More info →</span>
      </div>
      <div class="glossary-item-desc">${g.desc}</div>
      <div class="glossary-coined">${g.coined}</div>
    </div>`).join('');
  document.getElementById('glossary').style.display = 'flex';
}

function hideGlossary() {
  document.getElementById('glossary').style.display = 'none';
}

function closeGlossaryOnBackdrop(e) {
  if (e.target === document.getElementById('glossary')) hideGlossary();
}

// ── Pattern info page ───────────────────────────────────────────────────
// Opened from any glossary entry. Shows the base pattern and, where one
// exists, its AI-amplified counterpart side by side in the same page.

// General, pattern-level content — not tied to the fictional NebulaPro
// level. This is about the pattern as it exists in the wild.
const PATTERN_INFO_CONTENT = {
  "Roach Motel": {
    why: "Subscription businesses run on recurring revenue, so every cancellation means a loss in customer lifetime value, where retention gets treated as a core metric. Adobe, for instance, receives roughly 97% of its revenue from subscriptions, and is one of the reasons why regulators believe similar companies have a strong incentive to bury the cancellation button. Even a small amount of added friction is enough to convert some fraction of would-be leavers into users who simply give up.",
    flags: [
      "The cancel button is hard to find — buried in settings, behind a support ticket, or reachable only by phone.",
      "Cancelling takes noticeably more steps than signing up did.",
      "You're shown a retention offer or a \"pause instead\" alternative before you're allowed to actually cancel.",
      "A survey or feedback form is required before the cancellation will go through.",
      "There's no online cancel option — you're told to call in, then put on hold or transferred.",
      "You receive a vague \"processing\" message with no immediate confirmation, leaving you unsure whether it actually worked.",
    ],
    moreExamples: [
      { company: "The New York Times", detail: "Sign-up takes a few clicks, but cancelling requires chatting with a \"Customer Care Advocate\" during limited hours or calling in — no online cancel button. A 2020 class-action suit and years of public complaints called it \"exceedingly difficult.\"", images: ["l1-a.png", "l1-b.png"], caption: "Left: the one-click subscribe offer. Right: the cancellation page, which routes you to a phone call or a chat window instead of a cancel button.", link: "https://www.deceptive.design/brands/new-york-times" },
      { company: "Zoom", detail: "Uses obstruction and misdirection in its subscription cancellation journey — burying the cancel path behind extra steps and steering attention toward staying subscribed rather than a clear exit.", images: ["l1-c.png", "l1-d.png"], caption: "Left: the cancel confirmation, with \"Accept\" (switch to a pricier plan) styled as the prominent choice over \"Cancel Subscription.\" Right: a follow-up discount offer shown before cancellation completes." },
    ],
  },
  "AI Roach Motel": {
    why: "Following the same business model of retention, but with the implementation of AI to remove human limits. A support representative can only work a shift; a chatbot runs continuously and never gets tired of repeating the same deflection lines. Customer support platforms are now selling \"deflection rate\" and \"save rate\" as genuine product metrics: how many cancellation requests never reach a human, and how many of those people get talked out of leaving.",
    flags: [
      "The bot keeps redirecting you toward \"helping\" with something else instead of processing the cancellation.",
      "It claims to have \"lost your session\" or asks you to repeat information you already gave it.",
      "It raises a manufactured obstacle — an \"unpaid balance\" or \"pending review\" — that conveniently blocks cancellation.",
      "It offers a discount or pause option that references your account history to sound personalized.",
      "After enough back-and-forth, it declares your request \"resolved\" without ever confirming that's the outcome you wanted.",
      "There's no visible way to reach a human once the bot starts deflecting.",
    ],
  },
  "Confirmshaming": {
    why: "Framing the decline option as a personal failing increases opt-in rates without the need of a real discount or incentive. Most customers would rather click \"Yes\" on something instead of reading a sentence that shames them. Vendors specializing in conversion rate optimization have documented confirmshaming copy increases opt-in rates by double digits in A/B tests, which is why a handful of notorious examples spread into a standard trick reused across e-commerce.",
    flags: [
      "The decline button is worded as a self-directed insult rather than a neutral \"No thanks.\"",
      "The accept option uses warm, affirming language while the decline option relies on guilt or mockery.",
      "The decline text names a consequence you never said you wanted (\"I enjoy overpaying\", \"I'd rather stay in the dark\").",
      "The two buttons carry noticeably different visual weight — one large and colorful, the other small, grey, or a plain text link.",
      "The shame becomes more pointed the longer a multi-step flow continues.",
    ],
    moreExamples: [
      { company: "MyMedic", detail: "Used popup confirmshaming with options like \"No, I'd rather bleed to death\" to sell first-aid products. Widely cited as one of the most egregious examples.", images: ["l2-a.png", "l2-b.png"], link: "https://deceptive.design/types/confirmshaming/" },
      { company: "American Airlines & IndiGo", detail: "Both airlines have been separately flagged for confirmshaming users into travel insurance during checkout — framing the decline option so skipping the add-on reads as a careless decision rather than a neutral one.", images: [{ file: "l2-c.png", fit: "contain" }], link: "https://deceptive.design/articles/indigo-manipulating-emotions-of-users-when-booking-flights-to-opt-for-travel-insurance/?q=confirmshaminhttps://deceptive.design/articles/american-airlines-confirmshaming-users-into-buying-flight-insurance?q=confirmshamin" },
    ],
  },
  "AI Confirmshaming": {
    why: "There are limits to generic confirmshaming, as a statement that impacts one customer can be read and glossed over by another. AI raises that ceiling by allowing companies to take advantage of your psychological profile to shame the user at a personal level, using financial shame if you're flagged \"price-sensitive,\" health shame if you're flagged \"health-focused.\" This applies the same concept that is done in Ad platforms already as they segment users for targeted ads.",
    flags: [
      "A \"behavioral profile\" or confidence percentage appears before you've even seen the offer.",
      "The accept button appears first, with no visible way to decline for several seconds.",
      "The decline copy references something specific to your apparent psychology, not generic guilt.",
      "A stated confidence percentage has no visible methodology behind it.",
      "The offer is framed as something people in your inferred group have already accepted.",
    ],
  },
  "Disguised Ads": {
    why: "A sponsored click earns platforms far more money than an organic one, so companies have every incentive to make their ads look like real results. The label exists only because regulators require it, but nothing requires it to actually be legible. This is how search engines and marketplaces end up getting paid twice: once by the advertiser, and again through every extra click that a barely-visible label fails to prevent.",
    flags: [
      "The word \"Sponsored\" or \"Ad\" is smaller, lighter, or a different color than everything around it.",
      "The label sits next to the URL instead of the headline, where your eye lands last while scanning.",
      "The domain belongs to a retailer or lead-gen site, not the publisher you'd expect for that topic.",
      "Several \"top\" results in a row share near-identical marketing phrasing (\"Shop Now\", \"Free Shipping\", \"% Off\").",
      "On social platforms, an ad uses the same font, avatar style, and layout as an ordinary post in the feed.",
    ],
    moreExamples: [
      { company: "Google & Bing", detail: "\"Sponsored\" labels have shrunk over the years while ads have grown visually identical to organic results. The EU's Digital Services Act now requires clearer labeling, effective 2024.", images: ["l3.png", "l3-a.png"], link: "https://darkpatterns.uxp2.com/pattern/google-ads-disguised-as-search-results/" },
      { company: "Blinkit", detail: "The quick-commerce app was reported sending promotional push notifications with the same copy style as its real order-status alerts, making a plain ad easy to mistake for an update about an actual order.", images: ["l3-b.png"], link: "https://deceptive.design/articles/blinkit-using-disguised-advertisements-by-using-same-copy-as-system-functions/" },
    ],
  },
  "AI Synthetic Social Proof": {
    why: "Older fake reviews were easy to spot, with five stars, no real detail, and broken English. AI-generated reviews instead mimic the actual distribution of real ones, hedged three-star reviews included, since that kind of variation is what makes a set of reviews feel authentic. They reference plausible use cases, realistic complaints, and names drawn from the target demographic, which is why they end up being considerably harder to catch than earlier generations of fake reviews.",
    flags: [
      "A review opens with demographic framing — \"As a busy parent of three,\" \"As a fitness enthusiast\" — a targeting label rather than a person speaking.",
      "Generic superlatives (\"life-changing,\" \"game changer,\" \"worth every penny\") appear with no specific feature ever named.",
      "The prose is unusually smooth, with no hesitation, typos, or idiosyncratic detail.",
      "The praise is generic enough that it could be copy-pasted onto almost any product in the category.",
      "Star ratings look suspiciously well distributed — a few mildly critical three-star reviews mixed among the five-star ones, mimicking authenticity.",
    ],
  },
  "Trick Questions": {
    why: "Consent forms are often legally required, so companies can't skip them outright, but nothing requires the wording to actually be clear. Mixing opt-in and opt-out logic within the same list, under time pressure, reliably produces enough consent \"mistakes\" in the company's favor that the confusion starts to look less like an accident and more like a deliberate design choice.",
    flags: [
      "Checkboxes in the same form require opposite actions — checking vs. unchecking — to reach the same protective outcome.",
      "A protective option starts unchecked while a data-sharing option starts pre-checked.",
      "Double negatives (\"Do not disable...\", \"uncheck to opt out\") replace a plain, direct statement.",
      "A countdown or expiring session pressures you to submit before rereading every line.",
      "The label describing a setting doesn't match what checking the box actually does.",
    ],
    moreExamples: [
      { company: "Ryanair", detail: "Between 2010 and 2013, the airline's booking flow asked users to \"select a country of residence\" from a dropdown. Declining travel insurance meant scrolling to find a label — \"No travel insurance required\" — nonsensically placed between two unrelated countries, Latvia and Lithuania.", images: ["l4-a.png", "l4-b.png"], link: "https://deceptive.design/types/trick-wording/" },
      { company: "Yahoo", detail: "A subscription-management screen used a button labeled \"No, cancel\" that actually meant \"cancel the cancellation\" — clicking it kept users subscribed to the exact mailing list they were trying to leave.", images: ["l4-c.png"], link: "https://deceptive.design/articles/yahoo-uses-confusing-design-to-users-into-staying-subscribed-to-their-mailing-lists/" },
    ],
  },
  "AI A/B Gaslighting": {
    why: "Following the same business model as regular consent forms, but with AI running the process. A/B testing consent screens isn't new — platforms including OneTrust and Quantcast have been documented running multi-variant tests on button color, wording, and layout, all optimizing for the highest \"accept\" rate. AI just accelerates the cycle from weeks to hours: it generates new phrasing, retires whatever fails to confuse enough people, and learns which version worked on you.",
    flags: [
      "The form's wording changes every time you attempt to opt out, rather than staying stable.",
      "Different variants use different sentence structures to describe what is functionally the same choice.",
      "A timer forces a decision before you've had time to compare the new wording to what you remember from before.",
      "The one genuinely protective option is always present, just presented differently each time.",
      "The system may describe this reshuffling as \"personalization\" rather than what it is: testing.",
    ],
  },
  "Sneak into Basket": {
    why: "Every extra line item, whether it's insurance, a warranty, or an auto-renewing add-on, is close to pure profit margin if even a fraction of customers never notice it or never bother to remove it. Pre-adding items and pricing a \"free\" trial so it auto-converts later shifts the task from \"convince the customer to buy this\" to \"get the customer to not un-buy this,\" which converts at a far higher rate.",
    flags: [
      "Extra items appear in the cart that were never actively selected.",
      "A pre-added item is labeled a gift, a service, or \"added for you\" rather than what it actually is: a charge.",
      "A \"free\" item's real, ongoing price is disclosed only in fine print or after the trial period ends.",
      "Removing an unwanted item causes a similar one to reappear later in checkout.",
      "A countdown timer finalizes the order automatically if you don't act in time.",
    ],
    moreExamples: [
      { company: "Sports Direct", detail: "Pre-added a £1 \"free\" mug and then travel insurance to customer carts. The UK Advertising Standards Authority ruled this illegal. Ryanair did the same with travel insurance for years before regulators intervened.", images: ["l5-a.png", "l5-b.png"], link: "https://www.deceptive.design/hall-of-shame" },
      { company: "Notion", detail: "A user reported their plan was silently set to annual billing instead of monthly after they used promotional credits — without their consent — leading to an unexpected invoice for roughly $2,150 once the credits ran out.", images: [{ file: "l5-c.png", fit: "contain" }, "l5-d.png", { file: "l5-e.png", fit: "contain" }, { file: "l5-f.png", fit: "contain" }], link: "https://deceptive.design/articles/notions-subscription-plan-set-to-yearly-instead-of-monthly-without-consent-of-users/" },
    ],
  },
  "AI Hyper-Personalized Upsell": {
    why: "Upsells have always existed, but AI simply makes them feel inevitable. A stated \"94% match\" implies that declining is statistically unusual, which is really just a form of algorithmic social pressure. That score is often little more than a basic demographic guess dressed up in machine-learning language, so refusing ends up feeling like arguing with data rather than just making a straightforward choice.",
    flags: [
      "A stated \"match\" or confidence percentage accompanies the pitch with no visible methodology.",
      "\"Users like you\" or \"people in your profile\" implies your peer group has already agreed.",
      "A countdown suggests the offer will expire, though it typically just advances to the next pitch regardless.",
      "The reasoning behind the recommendation references data that either wasn't genuinely collected or stands in thinly for something else.",
      "The pitch frames declining as a future regret rather than describing a present, concrete benefit.",
    ],
  },
  "Obstruction": {
    why: "Regulations increasingly require that certain actions, like cancelling, deleting an account, or redeeming an advertised discount, be made available somewhere on the site. Obstruction technically complies with this, while making the path so convoluted, time-limited, or conditional that most people never actually complete it, which produces close to the same outcome as not offering it at all.",
    flags: [
      "The action you're looking for isn't where you'd expect it, and finding it requires guessing which submenu applies to your situation.",
      "Mutually exclusive conditions (\"cannot be combined with,\" \"not valid for members\") are scattered across separate pages instead of shown together.",
      "A visible countdown pressures a decision before you've confirmed an option actually applies to you.",
      "Several menu paths are dead ends that exist mainly to consume time and attention.",
      "The correct path exists, but nothing signposts it directly — it's found the same way you'd find any dead end.",
    ],
    moreExamples: [
      { company: "Enterprise / Hertz / Avis", detail: "Major rental companies routinely advertise discount codes with conflicting conditions and short redemption windows, knowing most customers will either pick the wrong one or give up entirely.", images: ["l6.png"], link: "https://www.deceptive.design/hall-of-shame" },
      { company: "CourseHero", detail: "The study-document platform gated access behind a \"pay or contribute\" wall, requiring either payment or ten of the user's own uploaded documents before unlocking content.", images: ["l6-b.png"],link: "https://darkpatterns.uxp2.com/pattern/coursehero-pay-or-contribute/" },
      { company: "Moonpig", detail: "An email newsletter reportedly hid its unsubscribe link by setting the link text to black on a black background — technically present, functionally invisible without selecting the text.", images: ["l6-c.png", "l6-d.png"], link: "https://deceptive.design/articles/moonpig-email-hides-the-unsubscribe-link-using-black-text-on-a-black-background/" },
    ],
  },
  "AI Obstruction": {
    why: "Following the same profit-driven model as regular Obstruction, but with AI running the conversation. These booking and support assistants are increasingly trained to maximize revenue per interaction rather than to minimize the customer's cost. Framing an upsell as a personalized saving, and then applying a genuine discount to an inflated price, is technically honest at each individual step, while being financially harmful overall. At scale, even a small average increase per transaction adds up considerably.",
    flags: [
      "An assistant cites specific account or order details to sound credible before making its recommendation.",
      "The \"discount\" it offers is real, but only after it has upgraded or altered your order first.",
      "The inflated total only becomes visible after the recommended action has already been applied.",
      "Undoing the change is possible, but costs time that a countdown or deadline makes expensive.",
      "The genuinely best option is never the one the assistant proactively recommends.",
    ],
  },
  "Fake Scarcity / Urgency": {
    why: "Urgency short-circuits the deliberate, comparison-shopping part of a purchase decision. A countdown or \"3 left\" counter exploits loss aversion, which is typically a much stronger motivator than an actual discount. Since none of the underlying inventory or viewer data needs to be real, manufacturing it costs the company nothing, and the resulting conversion lift is well documented, which is why some version of this pattern ends up appearing on nearly every major e-commerce site.",
    flags: [
      "A countdown timer expires and then resets, without any real consequence.",
      "A stock count (\"Only 1 left!\") never changes no matter how many times the item is added to or removed from a cart.",
      "\"X people are viewing this\" or \"bought this recently\" figures fluctuate with no obvious real data behind them.",
      "Near-identical listings compete for attention, making it easy to select the wrong one under time pressure.",
      "An add-on or warranty appears in the cart automatically the moment the target item is added.",
    ],
    moreExamples: [
      { company: "Booking.com", detail: "Fined by the UK CMA in 2019 for fake \"Only 1 room left!\" and \"8 people looking at this\" messages. Internal data showed the stock counts were fabricated. The practice remains widespread.", images: ["l7-a.png", "l7-b.png"] },
    ],
  },
  "AI Personalized Scarcity": {
    why: "Generic scarcity works on strangers to your data; personalized scarcity works better because it opens with something true. Citing a purchase you actually made borrows the credibility of that fact for a stock or churn claim that has nothing to do with real inventory — the model doesn't know your case situation or your sock drawer, it just knows one purchase and a timer.",
    flags: [
      "An offer opens by citing a specific past purchase, then uses that purchase to justify an unrelated stock or urgency claim.",
      "A stated statistic (\"68% of buyers add this within 30 days\") describes aggregate behavior, not anything specific to you.",
      "The stock count or countdown attached to the offer behaves exactly like ordinary fake scarcity once you look closely — it just has your order history laid over the top of it.",
      "The reasoning is built backward from something you already own rather than forward from anything you've actually asked for.",
      "The countdown auto-advances to the next offer whether or not you respond.",
    ],
  },
};

function loadImagesInto(files, wrapId, altText) {
  const wrap = document.getElementById(wrapId);
  if (!wrap) return;
  let failed = 0;
  wrap.style.display = 'none';
  wrap.innerHTML = files.map((f, i) => {
    const fit = (typeof f === 'object' && f.fit) || 'cover';
    const pos = (typeof f === 'object' && f.position) || 'top center';
    return `<img class="rw-example-img" id="${wrapId}-${i}" alt="${altText}" style="object-fit:${fit};object-position:${pos}">`;
  }).join('');
  files.forEach((f, i) => {
    const src = typeof f === 'object' ? f.file : f;
    const img = document.getElementById(`${wrapId}-${i}`);
    img.onload  = () => { wrap.style.display = 'grid'; };
    img.onerror = () => { failed++; if (failed === files.length) wrap.style.display = 'none'; };
    img.src = `assets/examples/${src}`;
  });
}

function renderPatternWhy(text) {
  if (!text) return '';
  return `
    <div class="why-card">
      <div class="why-card-label">Why companies do this</div>
      <div class="why-card-text">${text}</div>
    </div>`;
}

function renderPatternFlags(flags) {
  if (!flags || !flags.length) return '';
  return `
    <div class="pattern-info-subhead">Red flags to watch for</div>
    <ul class="pattern-info-flags">
      ${flags.map(f => `<li>${f}</li>`).join('')}
    </ul>`;
}

function renderPatternMoreExamples(examples, prefix, standalone) {
  if (!examples || !examples.length) return '';
  return `
    <div class="pattern-info-more-examples"${standalone ? ' style="margin-top:0;padding-top:0;border-top:none"' : ''}>
      ${examples.map((e, i) => `
        <div class="pattern-info-more-ex">
          <div class="pattern-info-more-ex-text">
            <span class="pattern-info-more-ex-company">${e.company}</span> — ${e.detail}
          </div>
          ${e.link ? `<a href="${e.link}" target="_blank" rel="noopener" style="font-size:13px;color:#8b85e8;text-decoration:none;display:inline-block;margin-top:5px">Source →</a>` : ''}
          ${e.images && e.images.length ? `
            <div class="rw-example-row pattern-info-more-ex-imgs" id="${prefix}-more-imgs-${i}" style="margin-top: 10px;"></div>
            ${e.caption ? `<div class="pattern-info-img-caption">${e.caption}</div>` : ''}` : ''}
        </div>`).join('')}
    </div>`;
}

function loadPatternMoreExampleImages(examples, prefix) {
  if (!examples) return;
  examples.forEach((e, i) => {
    if (e.images && e.images.length) {
      loadImagesInto(e.images, `${prefix}-more-imgs-${i}`, e.company);
    }
  });
}

function showPatternInfo(name) {
  const titleEl = document.getElementById('pattern-info-title');
  const bodyEl  = document.getElementById('pattern-info-body');

  const [baseName, aiName] = findPatternPair(name);
  const baseLv = LEVELS.find(l => l.pattern === baseName);
  const aiLv   = aiName ? LEVELS.find(l => l.pattern === aiName) : null;
  const baseC  = PATTERN_INFO_CONTENT[baseName] || {};
  const aiC    = aiLv ? (PATTERN_INFO_CONTENT[aiName] || {}) : null;

  if (titleEl) titleEl.textContent = baseName;

  const section = (lv, content, aiWhyHtml) => `
    <div class="pattern-info-section${lv.isAI ? ' pattern-info-divider' : ''}">
      <div class="pattern-info-kicker${lv.isAI ? ' ai' : ''}">${lv.pattern}</div>
      <div class="pattern-info-text">${lv.brief}</div>
      ${aiWhyHtml || ''}
      ${content}
    </div>`;

  const cardsFor = (lv, c) => `
    ${renderPatternWhy(c.why)}
    ${c.flags && c.flags.length ? `
      <div class="pattern-info-card">
        ${renderPatternFlags(c.flags)}
      </div>` : ''}
    ${c.moreExamples && c.moreExamples.length ? `
      <div class="pattern-info-card">
        <div class="pattern-info-subhead">Real-world examples</div>
        ${renderPatternMoreExamples(c.moreExamples, lv.isAI ? 'ai' : 'base', true)}
      </div>` : ''}`;

  if (bodyEl && baseLv) {
    bodyEl.innerHTML =
      section(baseLv, cardsFor(baseLv, baseC)) +
      (aiLv ? section(aiLv, cardsFor(aiLv, aiC), aiLv.aiWhy ? `
        <div class="ai-card" style="margin-bottom: 4px;">
          <div class="ai-card-label">Why AI makes this worse</div>
          <div class="ai-card-text">${aiLv.aiWhy}</div>
        </div>` : '') : '');

    loadPatternMoreExampleImages(baseC.moreExamples, 'base');
    if (aiLv) {
      loadPatternMoreExampleImages(aiC.moreExamples, 'ai');
    }
  } else if (bodyEl) {
    bodyEl.innerHTML = '';
  }

  const overlay = document.getElementById('pattern-info');
  if (overlay) overlay.style.display = 'flex';
}

function hidePatternInfo() {
  const overlay = document.getElementById('pattern-info');
  if (overlay) overlay.style.display = 'none';
}

function closePatternInfoOnBackdrop(e) {
  if (e.target === document.getElementById('pattern-info')) hidePatternInfo();
}

// ======== designer.js ========
// js/designer.js — Designer mode logic and live preview

const STATE = { btn: 0, copy: 0, check: 0, price: 0, urgency: 0, sneak: 0 };

const PTS = {
  btn:     [0, 15, 25, 35],
  copy:    [0, 20, 30, 40],
  check:   [0, 20, 35],
  price:   [0, 15, 30],
  urgency: [0, 15, 25, 30],
  sneak:   [0, 20, 35, 45],
};

const NAMES = {
  btn:     ['Decline button style', 'Decline button style', 'Decline button style', 'Decline button style'],
  copy:    ['Neutral decline copy', 'Confirmshaming (mild)', 'Confirmshaming (moderate)', 'Confirmshaming (severe)'],
  check:   ['Honest checkbox', 'Pre-checked newsletter', 'Pre-checked + trick label'],
  price:   ['Transparent pricing', 'Hidden fees', 'Disguised auto-renewal'],
  urgency: ['No urgency', 'Countdown timer', 'Fake social proof', 'Fabricated scarcity + social proof'],
  sneak:   ['No sneaked items', '1 sneaked item', '2 sneaked items', '3 sneaked items + reappear'],
};

const COPY_OPTS = [
  'No thanks',
  "No thanks, I hate saving money",
  "No thanks, I prefer to pay full price",
  "No thanks, I don't care about my health",
];

const VERDICTS = [
  { min: 0,   max: 20,  text: 'Your form is clean — honest design.',                                              reg: 'No regulatory concerns.',                                                                                               color: '#3B6D11' },
  { min: 21,  max: 50,  text: 'Mildly manipulative — a few nudges that could go either way.',                     reg: 'Borderline — some patterns may attract scrutiny under GDPR and FTC guidelines.',                                       color: '#854F0B' },
  { min: 51,  max: 100, text: 'Significantly manipulative — multiple dark patterns working together.',             reg: 'High risk: likely violates GDPR Art. 7 (freely given consent) and FTC deceptive practices rules.',                     color: '#A32D2D' },
  { min: 101, max: 999, text: 'Highly predatory — this is textbook dark pattern design.',                          reg: 'This would attract FTC enforcement action and EU DSA fines of up to 6% of global revenue.',                           color: '#791F1F' },
];

function totalPts() {
  return Object.keys(STATE).reduce((a, k) => a + PTS[k][STATE[k]], 0);
}

function dpick(el) {
  const group = el.dataset.group;
  document.querySelectorAll(`.d-opt[data-group="${group}"]`).forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  STATE[group] = parseInt(el.dataset.val);
  update();
}

function update() {
  const pts    = totalPts();
  const maxPts = 35 + 40 + 35 + 30 + 30 + 45;
  const pct    = Math.min(100, Math.round(pts / maxPts * 100));

  document.getElementById('d-score-num').textContent = pts;
  document.getElementById('d-score-bar').style.width = pct + '%';

  const v = VERDICTS.find(v => pts >= v.min && pts <= v.max) ?? VERDICTS[VERDICTS.length - 1];
  const verdictEl = document.getElementById('d-verdict');
  verdictEl.textContent = v.text;
  verdictEl.style.color = v.color;
  document.getElementById('d-regulator').textContent = 'Regulatory outlook: ' + v.reg;

  document.getElementById('d-breakdown').innerHTML = Object.keys(STATE).map(k => {
    const p      = PTS[k][STATE[k]];
    const nm     = NAMES[k][STATE[k]];
    const active = p > 0;
    return `<div class="d-breakdown-row${active ? ' active' : ''}"><span>${nm}</span><span>${active ? '+' + p + ' pts' : '—'}</span></div>`;
  }).join('');

  renderPreview();
}

function renderPreview() {
  const p         = document.getElementById('d-preview');
  const copyText  = COPY_OPTS[STATE.copy];

  const declineCss = [
    'padding:7px 13px;border-radius:7px;border:0.5px solid #ccc;background:#fff;font-size:12px;cursor:pointer;font-family:inherit',
    'padding:5px 10px;border-radius:7px;border:0.5px solid #ddd;background:#f5f5f2;color:#aaa;font-size:11px;cursor:pointer;font-family:inherit',
    'border:none;background:transparent;color:#ccc;font-size:11px;cursor:pointer;font-family:inherit;text-decoration:underline',
    'position:absolute;left:-9999px;font-size:11px',
  ][STATE.btn];

  const btnLayout = STATE.btn === 0 || STATE.btn === 1 ? 'display:flex;gap:8px' : 'display:block';

  const checkLabel   = STATE.check === 2 ? 'Do not uncheck to not receive promotional emails' : 'Subscribe to our newsletter';
  const checkChecked = STATE.check >= 1 ? ' checked' : '';

  const priceText  = ['$9.99/month', '$9.99 + fees', 'Free today — auto-renews'][STATE.price];
  const priceColor = STATE.price === 2 ? 'color:#aaa;font-size:10px' : 'font-size:12px;color:#666';

  const urgencyHtml = [
    '',
    '<div style="font-size:11px;color:#E24B4A;font-weight:500">⏱ Offer expires in 04:59</div>',
    '<div style="font-size:11px;color:#666">👁 847 people viewing this right now</div>',
    '<div style="font-size:11px;color:#E24B4A;font-weight:500">⏱ 02:47 left — 847 viewing — Only 2 left!</div>',
  ][STATE.urgency];

  const sneakHtml = [
    '',
    '<div style="font-size:11px;color:#aaa;border-top:0.5px solid #f0f0f0;padding-top:6px">+ Device protection plan — $4.99 <span style="font-size:9px;color:#ccc">(added for you)</span></div>',
    '<div style="font-size:11px;color:#aaa;border-top:0.5px solid #f0f0f0;padding-top:6px">+ Device protection — $4.99 <span style="font-size:9px;color:#ccc">(added)</span><br>+ Premium cables — $8.99 <span style="font-size:9px;color:#ccc">(added)</span></div>',
    '<div style="font-size:11px;color:#aaa;border-top:0.5px solid #f0f0f0;padding-top:6px">+ Device protection — $4.99 <span style="font-size:9px;color:#ccc">(added)</span><br>+ Premium cables — $8.99 <span style="font-size:9px;color:#ccc">(added)</span><br><span style="font-size:9px;color:#bbb">(items re-added if removed)</span></div>',
  ][STATE.sneak];

  p.innerHTML = `
    <div style="font-size:14px;font-weight:500;color:#111">Sign up for NebulaPro</div>
    ${urgencyHtml}
    <div style="${priceColor}">${priceText}</div>
    <label style="display:flex;gap:7px;align-items:flex-start;font-size:11px;color:#666;line-height:1.4;cursor:pointer">
      <input type="checkbox"${checkChecked} style="margin-top:2px;flex-shrink:0"> ${checkLabel}
    </label>
    ${sneakHtml}
    <div style="${btnLayout};position:relative">
      <button style="padding:8px 15px;border-radius:7px;background:#111;color:#fff;border:none;font-size:13px;cursor:pointer;font-family:inherit">Sign up →</button>
      <button style="${declineCss}">${copyText}</button>
    </div>`;
}

function initDesigner() {
  Object.keys(STATE).forEach(k => STATE[k] = 0);
  document.querySelectorAll('.d-opt').forEach(o => {
    o.classList.toggle('selected', o.dataset.val === '0');
  });
  update();
}

// Expose to HTML onclick attributes
window.dpick       = dpick;
window.initDesigner = initDesigner;

// ======== game.js ========
// js/game.js — Core game state and engine (no UI imports — avoids circular deps)


// ── State ──────────────────────────────────────────────────────────────────
let hearts      = 5;
let score       = 0;
let streak      = 0;
let levelIdx    = 0;
let hardMode    = false;
let hasWon      = false;
let xp          = 0;
let manipCost   = 0;
let levelGrades = [];
let achUnlocked = new Set();
let hintState   = {};
let lostHeart   = false;
let hoverTimers = {};

// Setters used by level files and ui.js
function setHearts(v)        { hearts        = v; }
function setScore(v)         { score         = v; }
function setStreak(v)        { streak        = v; }
function setLevelIdx(v)      { levelIdx      = v; }
function setLostHeart(v)     { lostHeart     = v; }
function setManipCost(v)     { manipCost     = v; }
function setLevelGrade(i, g) { levelGrades[i] = g; }
function addAch(id)          { achUnlocked.add(id); }
function setHintState(obj)   { Object.assign(hintState, obj); }
function resetHintState()    { hintState = {}; }

// ── UI callbacks (set by ui.js to avoid circular imports) ─────────────────
let _ui = {
  renderHearts:  () => {},
  renderScore:   () => {},
  renderStreak:  () => {},
  renderDots:    () => {},
  popScore:      () => {},
  spawnConfetti: () => {},
  showDebrief:   () => {},
  showWin:       () => {},
};

function registerUI(callbacks) {
  Object.assign(_ui, callbacks);
}

// ── Screen management ──────────────────────────────────────────────────────
const SCREENS = ['intro', 'brief', 'level', 'debrief', 'win', 'designer'];

function setScr(name) {
  SCREENS.forEach(s => {
    const el = document.getElementById('scr-' + s);
    if (el) el.classList.toggle('active', s === name);
  });
  //Close game over screen whenever user navigates to another screen
  const go = document.getElementById('scr-gameover');
  if (go) go.style.display = 'none';
}

// ── Brief ──────────────────────────────────────────────────────────────────
function showBrief() {
  setScr('brief');
  const lv    = LEVELS[levelIdx];
  const total = LEVELS.length;

  document.getElementById('brief-lvl-label').textContent    = `Level ${levelIdx + 1} of ${total}`;
  document.getElementById('brief-type-label').textContent   = lv.isAI ? 'AI-powered hyper level' : '';

  const bpn = document.getElementById('brief-pattern-name');
  bpn.textContent = lv.pattern;
  bpn.className   = 'brief-pattern' + (lv.isAI ? ' is-ai' : '');

  document.getElementById('brief-what').textContent        = lv.brief;
  document.getElementById('brief-goal').textContent        = lv.goal;
  document.getElementById('brief-goal-detail').textContent = lv.goalDetail || '';

  const aiNote = document.getElementById('brief-ai-note');
  const aiText = document.getElementById('brief-ai-text');
  if (lv.isAI && lv.aiIntro) {
    aiNote.style.display = 'flex';
    aiText.textContent   = lv.aiIntro;
  } else {
    aiNote.style.display = 'none';
  }
}

const BRIEF_EXAMPLE_IMAGES = {
  l1: ['l1-a.png', 'l1-b.png'],
  l2: ['l2-a.png', 'l2-b.png'],
  l4: ['l4-a.png', 'l4-b.png'],
  l5: ['l5-a.png', 'l5-b.png'],
  l7: ['l7-a.png', 'l7-b.png'],
  // any other level needing 2+ images can be added here the same way
};

function getExampleImages(lv) {
  return BRIEF_EXAMPLE_IMAGES[lv.id] || [`${lv.id}.png`];
}

// ── Level ──────────────────────────────────────────────────────────────────
function showLevel() {
  setScr('level');
  lostHeart   = false;
  hoverTimers = {};
  resetHintState();

  const hintBtn = document.getElementById('h-hint-btn');
  if (hintBtn) {
    hintBtn.disabled      = false;
    hintBtn.textContent   = '💡 Hint';
    hintBtn.style.display = 'none';
  }

  const lv = LEVELS[levelIdx];
  document.getElementById('h-lvl').innerHTML =
    `Level ${levelIdx + 1} of ${LEVELS.length}` +
    (hardMode ? ' <span class="hard-badge">HARD</span>' : '');
  document.getElementById('h-goal').textContent = 'Goal: ' + lv.goal;

  const lc = document.getElementById('lc');
  lc.removeAttribute('style');
  lc.className = 'fake-app fill-height' + (lv.isAI ? ' ai-app' : '');
  lc.innerHTML = '';
  lc.removeAttribute('style');

  if (lv.isAI) {
    lc.innerHTML = '<div class="ai-banner"><div class="ai-pulse"></div>NexusAI personalization engine — active</div>';
  }

  lv.render(lc);

  _ui.renderHearts();
  _ui.renderScore();
  _ui.renderStreak();
  _ui.renderDots('dots-l');
}

// ── Hint ───────────────────────────────────────────────────────────────────
function showHint() {
  const lv = LEVELS[levelIdx];
  if (!lv?.hints) return;

  const level = hintState.level || 0;
  const hint  = lv.hints[Math.min(level, lv.hints.length - 1)];
  hintState.level = level + 1;
  hintState.used  = true;

  const lc = document.getElementById('lc');
  document.getElementById('hint-bubble')?.remove();

  const d = document.createElement('div');
  d.id = 'hint-bubble';
  d.className = 'hint-bubble';
  d.innerHTML = `💡 <strong>Hint ${level + 1} of ${lv.hints.length}:</strong> ${hint}`;
  hintState.text = d.innerHTML;
  placeOverlay(d, 'bottom');

  if (hintState.level >= lv.hints.length) {
    const btn = document.getElementById('h-hint-btn');
    if (btn) { btn.textContent = 'No more hints'; btn.disabled = true; }
  }
}

// ── Succeed ────────────────────────────────────────────────────────────────
function succeed() {
  streak++;
  const pts   = lostHeart ? 80 : 100;
  const bonus = streak >= 3 ? 20 : 0;
  score += pts + bonus;
  _ui.popScore(pts + bonus);

  let grade;
  if (!lostHeart && streak >= 3) grade = 'S';
  else if (!lostHeart)           grade = 'A';
  else if (hearts >= 3)          grade = 'B';
  else if (hearts >= 1)          grade = 'C';
  else                           grade = 'F';
  levelGrades[levelIdx] = grade;

  levelClear(grade);

  const lc = document.getElementById('lc');
  if (lc) { lc.classList.add('flash-green'); setTimeout(() => lc.classList.remove('flash-green'), 500); }

  if (!lostHeart) _ui.spawnConfetti();
  checkAchievements();
  _ui.showDebrief(true);
}

// ── Fail ───────────────────────────────────────────────────────────────────
function fail(msg) {
  const wasNew = !lostHeart;
  if (!lostHeart) { hearts = Math.max(0, hearts - 1); lostHeart = true; }
  streak = 0;

  if (hearts === 0) {
    _ui.renderHearts(true);
    setTimeout(() => showGameOver(), 1200);
    return;
  }

  const hintBtn = document.getElementById('h-hint-btn');
  if (hintBtn) hintBtn.style.display = '';

  if (wasNew && LEVELS[levelIdx]?.dollars?.amount > 0) {
    const lv  = LEVELS[levelIdx];
    const hit = lv.dollars.period === 'month' ? lv.dollars.amount * 12 : lv.dollars.amount;
    manipCost += hit;
  }

  _ui.renderHearts(wasNew);
  _ui.renderScore();
  _ui.renderStreak();
  caught();

  const app = document.getElementById('app');
  if (app) { app.classList.add('shake'); setTimeout(() => app.classList.remove('shake'), 400); }

  const lc = document.getElementById('lc');
  if (lc) { lc.classList.add('flash-red'); setTimeout(() => lc.classList.remove('flash-red'), 500); }

  const d = document.createElement('div');
  d.className   = 'damage-msg';
  d.textContent = msg || 'Caught! You lost a heart.';
  placeOverlay(d, 'top');
  setTimeout(() => d.remove(), 1900);

  if (hintState.text && !document.getElementById('hint-bubble')) {
    const h = document.createElement('div');
    h.id = 'hint-bubble';
    h.className = 'hint-bubble';
    h.innerHTML = hintState.text;
    placeOverlay(h, 'bottom');
  }
}

// ── Overlay positioning helper ──────────────────────────────────────────────
// Positions a fixed-position element against #lc's live bounding box and appends it to <body> so it floats above level content even
function placeOverlay(d, anchor /* 'top' | 'bottom' */) {
  const lc = document.getElementById('lc');
  if (!lc) { document.body.appendChild(d); return; }
  const rect = lc.getBoundingClientRect();
  d.style.left  = (rect.left + 16) + 'px';
  d.style.width = (rect.width - 32) + 'px';
  if (anchor === 'bottom') {
    d.style.bottom = (window.innerHeight - rect.bottom + 16) + 'px';
  } else {
    d.style.top = (rect.top + 16) + 'px';
  }
  document.body.appendChild(d);
}


function almostGotYou(el, msg) {
  almost();
  const d = document.createElement('div');
  d.className   = 'almost-msg';
  d.textContent = msg || 'You almost fell for it — watch out!';
  placeOverlay(d, 'top');
  setTimeout(() => d.remove(), 2200);
}

function recoilBtn(btn) {
  if (btn) { btn.classList.add('recoil'); setTimeout(() => btn.classList.remove('recoil'), 300); }
}

function trackHover(el, key, onTrigger) {
  el.addEventListener('mouseenter', () => {
    if (hoverTimers[key]) return;
    hoverTimers[key] = setTimeout(() => {
      el.classList.add('danger-pulse');
      recoilBtn(el);
      onTrigger?.();
      delete hoverTimers[key];
    }, 1500);
  });
  el.addEventListener('mouseleave', () => {
    clearTimeout(hoverTimers[key]);
    delete hoverTimers[key];
  });
}

// ── Navigation ─────────────────────────────────────────────────────────────
function next() {
  levelIdx++;
  if (levelIdx >= LEVELS.length) { _ui.showWin(); return; }
  showBrief();
}

function jumpTo(idx) {
  hearts = 5; score = 0; streak = 0; levelIdx = idx;
  hoverTimers = {};
  showBrief();
}

// ── Game Over ──────────────────────────────────────────────────────────────
function showGameOver() {
  const overlay = document.getElementById('scr-gameover');
  if (overlay) overlay.style.display = 'flex';
  const el = document.getElementById('go-breakdown');
  if (!el) return;
  el.innerHTML = LEVELS.map((lv, i) => {
    const grade = levelGrades[i];
    const done  = i < levelIdx;
    const isCur = i === levelIdx;
    const color = (!done && !isCur) ? 'var(--text3)' : (grade === 'S' || grade === 'A') ? 'var(--green)' : 'var(--red)';
    return `
      <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="color:var(--text2)">${lv.title} — ${lv.pattern}</span>
        <span style="color:${color};font-weight:500">${isCur ? '✗ failed here' : done ? (grade || '—') : 'not reached'}</span>
      </div>`;
  }).join('');
}

// ── Achievements ───────────────────────────────────────────────────────────
function checkAchievements() {
  if (lostHeart && !achUnlocked.has('first_blood'))   achUnlocked.add('first_blood');
  if (hearts === 5 && levelIdx === LEVELS.length - 1) achUnlocked.add('untouchable');
  if (streak >= 3)                                     achUnlocked.add('streak_3');
  if (hardMode && levelIdx === LEVELS.length - 1)     achUnlocked.add('hard_clear');
  if (levelGrades.length === LEVELS.length && levelGrades.every(g => g === 'S')) achUnlocked.add('all_s');
  if (levelIdx === LEVELS.length - 1 && !hintState.used) achUnlocked.add('no_hints');
}

// ── Start / Restart ────────────────────────────────────────────────────────
function start(hard = false) {
  hardMode    = !!hard;
  hearts      = 5;
  score       = 0;
  streak      = 0;
  levelIdx    = 0;
  hoverTimers = {};
  xp          = 0;
  manipCost   = 0;
  levelGrades = [];
  achUnlocked = new Set();
  showBrief();
}

function restart() {
  if (hasWon) {
    const hb = document.getElementById('hard-mode-btn');
    if (hb) hb.style.display = '';
  }
  setScr('intro');
}

// ── Public API (G) ─────────────────────────────────────────────────────────
const G = {
  start,
  restart,
  next,
  succeed,
  fail,
  showHint,
  beginLevel: () => showLevel(),
  setScr,
  tryAgain() {
    hearts = 5; score = 0; streak = 0; levelIdx = 0;
    lostHeart = false; levelGrades = []; achUnlocked = new Set();
    showBrief();
  },
  continueAfterFail() {
    hearts    = 3;
    lostHeart = false;
    showBrief();
  },
};


// ======== ui.js ========
// js/ui.js — HUD, dots, debrief, win screen, confetti
// Registers itself with game.js via registerUI() to avoid circular imports.


// ── HUD ────────────────────────────────────────────────────────────────────
function renderHearts(animate = false) {
  const el = document.getElementById('h-hearts');
  if (!el) return;
  el.innerHTML = Array.from({ length: 5 }, (_, i) =>
    `<div class="heart${i >= hearts ? ' lost' : ''}" id="heart-${i}"></div>`
  ).join('');
  if (animate && hearts >= 0) {
    const h = document.getElementById(`heart-${hearts}`);
    if (h) h.style.animation = 'heartbreak 0.5s ease forwards';
  }
}

function renderScore() {
  document.getElementById('h-score').textContent = score;
  const maxXP = 1260;
  const pct   = Math.min(100, Math.round(score / maxXP * 100));
  const xpEl  = document.getElementById('xp-fill');
  if (xpEl) xpEl.style.width = pct + '%';
  const costEl = document.getElementById('h-cost');
  if (costEl) {
    if (manipCost > 0) { costEl.style.display = ''; costEl.textContent = `$${manipCost.toFixed(2)} extracted`; }
    else costEl.style.display = 'none';
  }
}

function renderStreak() {
  const el = document.getElementById('h-streak');
  if (!el) return;
  if (streak >= 2) { el.style.display = ''; el.textContent = `${streak}× streak`; }
  else el.style.display = 'none';
}

function renderDots(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = LEVELS.map((lv, i) => {
    let c = 'dot';
    if (lv.isAI) c += i < levelIdx ? ' ai-done' : i === levelIdx ? ' ai-cur' : '';
    else         c += i < levelIdx ? ' done'    : i === levelIdx ? ' cur'    : '';
    return `<div class="${c}"></div>`;
  }).join('');
}

function popScore(pts) {
  const pop = document.createElement('div');
  pop.className   = 'score-pop';
  pop.textContent = '+' + pts;
  pop.style.cssText = 'position:fixed;top:60px;right:20px';
  document.body.appendChild(pop);
  setTimeout(() => pop.remove(), 900);
}

// ── Debrief ────────────────────────────────────────────────────────────────
function showDebrief(won) {
  setScr('debrief');
  const lv   = LEVELS[levelIdx];
  const isAI = lv.isAI;

  document.getElementById('db-tag').textContent = isAI ? 'Hyper pattern identified' : 'Pattern identified';

  const nm = document.getElementById('db-name');
  nm.textContent = lv.pattern;
  nm.className   = 'db-name' + (isAI ? ' db-ai' : '');

  // Pull the description from the glossary so debrief copy always matches
  // the glossary entry for this pattern — single source of truth. Falls
  // back to the level's own `desc` field if the pattern name doesn't match
  // anything in GLOSSARY (e.g. a typo), so a mismatch fails soft, not silent.
  const glossaryEntry = findGlossaryEntry(lv.pattern);
  document.getElementById('db-desc').textContent = glossaryEntry ? glossaryEntry.desc : lv.desc;

  const grade      = levelGrades[levelIdx] || '—';
  const gradeEl    = document.getElementById('db-grade');
  const gradeColors = { S: '#1a1a1a', A: '#27500A', B: '#854F0B', C: '#7A3300', F: '#A32D2D' };
  const gradeBg     = { S: '#f5f5f2', A: '#EAF3DE', B: '#FAEEDA', C: '#FDE8D8', F: '#FCEBEB' };
  if (gradeEl) {
    gradeEl.textContent      = grade;
    gradeEl.style.background = gradeBg[grade]    || '#f5f5f2';
    gradeEl.style.color      = gradeColors[grade] || '#111';
  }

  const dr = document.getElementById('db-result');
  if (won && !lostHeart) {
    dr.innerHTML = `<div class="db-result good">Clean dodge — +100 pts${streak >= 3 ? ' + streak bonus!' : ''}</div>`;
  } else if (won) {
    dr.innerHTML = `<div class="db-result ok">Cleared with damage — +80 pts</div>`;
  } else {
    dr.innerHTML = '';
  }

  document.getElementById('db-next').textContent =
    levelIdx < LEVELS.length - 1 ? 'Next level →' : 'See results →';

  // Dollar cost — folded into the score card
  const dc = document.getElementById('db-cost');
  if (lv.dollars) {
    dc.style.display = 'flex';
    const d      = lv.dollars;
    const bigNum = d.amount > 0
      ? (d.period === 'month' ? `$${(d.amount * 12).toFixed(2)}/year` : `$${d.amount.toFixed(2)}`)
      : null;
    dc.innerHTML = `
      ${bigNum ? `
        <div style="display:flex; align-items:baseline; gap:6px; flex-wrap:wrap;">
          <span style="font-size:13px; color:var(--text2);">Real cost if this worked on you:</span>
          <span style="font-size:16px; font-weight:600; color:#ff9090;">${bigNum}</span>
        </div>` : ''}
      <div style="font-size:13.5px; color:var(--text-soft); line-height:1.55; margin-top:2px;">${d.note}</div>`;
  } else {
    dc.style.display = 'none';
  }

  // Real-world card
  const rwEl    = document.getElementById('db-rw');
  const rwFiles = getExampleImages(lv);

  rwEl.innerHTML = `
    <div class="brief-example-label">A real-world example</div>
    <div class="brief-example-row" id="db-rw-imgs" style="display:none">
      ${rwFiles.map((f, i) => `<img class="brief-example-img" id="db-rw-img-${i}" alt="${lv.rw.company} — ${lv.pattern}">`).join('')}
    </div>
    <div class="brief-example-caption"><strong>${lv.rw.company}</strong> — ${lv.rw.detail}</div>`;

  const rwImgsWrap = document.getElementById('db-rw-imgs');
  let rwFailed = 0;
  rwFiles.forEach((f, i) => {
    const img = document.getElementById(`db-rw-img-${i}`);
    img.onload  = () => { rwImgsWrap.style.display = 'flex'; };
    img.onerror = () => { rwFailed++; if (rwFailed === rwFiles.length) rwImgsWrap.style.display = 'none'; };
    img.src = `assets/examples/${f}`;
  });

  // AI card (hyper only)
  const aic = document.getElementById('db-ai-card');
  if (isAI && lv.aiWhy) {
    aic.style.display = 'flex';
    aic.innerHTML = `<div class="ai-card-label">Why AI makes this worse</div><div class="ai-card-text">${lv.aiWhy}</div>`;
  } else {
    aic.style.display = 'none';
  }

  // Replay
  document.getElementById('db-replay').innerHTML =
    `<div class="replay-title">What just happened</div>` +
    lv.replay.map(s => `
      <div class="replay-step">
        <span class="replay-flag">⚑</span>
        <div class="replay-step-body">${s.note}</div>
      </div>`).join('');

  renderDots('dots-d');
}

// ── Win screen ─────────────────────────────────────────────────────────────
function showWin() {
  setScr('win');
  document.getElementById('win-fakeout').style.display = 'flex';
  document.getElementById('win-real').style.display    = 'none';

  let title, sub;
  if (hearts === 5 && score >= 900) {
    title = 'Perfect run.';
    sub   = 'You dodged every pattern without taking damage. You are genuinely hard to manipulate.';
  } else if (hearts >= 3) {
    title = 'Sharp-eyed.';
    sub   = 'You caught most of the tricks. A few got through — see the receipt below.';
  } else if (hearts >= 1) {
    title = 'Roughed up but out.';
    sub   = 'The dark patterns took a toll. Review the receipt — you may be more susceptible than you think.';
  } else {
    title = 'Fully opted in.';
    sub   = 'You lost all your hearts. The good news: now you know exactly how it happened.';
  }

  document.getElementById('win-title').textContent = title;
  document.getElementById('win-sub').textContent   = sub;

  const maxScore = LEVELS.length * 100 + 60;
  document.getElementById('win-receipt').innerHTML = `
    <div class="receipt-row"><span>Final score</span><span>${score} / ${maxScore}</span></div>
    <div class="receipt-row"><span>Hearts remaining</span><span>${hearts} / 5</span></div>
    <div class="receipt-row"><span>Levels cleared</span><span>${LEVELS.length} / ${LEVELS.length}</span></div>
    <div class="receipt-row"><span>Best streak</span><span>${streak} clean</span></div>
    <div class="receipt-total"><span>Resistance rating</span><span>${rating()}</span></div>`;

  let countdown = 30;
  const foTimer = setInterval(() => {
    countdown--;
    const el = document.getElementById('fo-countdown');
    if (el) el.textContent = `Your score will be deleted in ${countdown} seconds unless you claim your badge.`;
    if (countdown <= 0) clearInterval(foTimer);
  }, 1000);

  document.getElementById('fo-claim').onclick = () => {
    const el = document.getElementById('fo-claim');
    el.textContent = 'Connecting...';
    el.disabled    = true;
    setTimeout(() => { el.textContent = 'Error — please try again'; el.disabled = false; }, 1800);
  };

  document.getElementById('fo-decline').onclick = () => {
    clearInterval(foTimer);
    addAch('caught_fakeout');
    revealRealWin();
  };

  const checkWatcher = setInterval(() => {
    const s = document.getElementById('fo-share');
    const d = document.getElementById('fo-data');
    if (s && d && !s.checked && !d.checked) {
      clearInterval(checkWatcher);
      clearInterval(foTimer);
      addAch('caught_fakeout');
      setTimeout(revealRealWin, 600);
    }
  }, 300);
}

function revealRealWin() {
  document.getElementById('win-fakeout').style.display = 'none';
  const real = document.getElementById('win-real');
  real.style.display = 'flex';

  const achEl = document.getElementById('win-achievements');
  if (achEl) renderAchievements(achEl, achUnlocked);

  document.getElementById('win-play-again').onclick = () => start(false);
  win();
}

function rating() {
  if (score >= 900 && hearts === 5) return 'Untouchable';
  if (score >= 750)                  return 'Sharp-eyed';
  if (score >= 500)                  return 'Aware';
  if (score >= 300)                  return 'Vulnerable';
  return 'Opted in';
}

// ── Confetti ───────────────────────────────────────────────────────────────
function spawnConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const pieces = Array.from({ length: 60 }, () => ({
    x:     Math.random() * canvas.width,
    y:     -10,
    r:     Math.random() * 5 + 3,
    color: ['#534AB7','#E24B4A','#3B6D11','#BA7517','#185FA5'][Math.floor(Math.random() * 5)],
    vx:    (Math.random() - 0.5) * 3,
    vy:    Math.random() * 4 + 2,
    rot:   Math.random() * 360,
    vr:    (Math.random() - 0.5) * 8,
  }));

  let frame = 0;
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.vy += 0.08;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
      ctx.restore();
    });
    frame++;
    if (frame < 90) requestAnimationFrame(draw);
    else { ctx.clearRect(0, 0, canvas.width, canvas.height); canvas.style.display = 'none'; }
  };
  draw();
}

// ── Register with game.js (breaks the circular dependency) ─────────────────
registerUI({ renderHearts, renderScore, renderStreak, renderDots, popScore, spawnConfetti, showDebrief, showWin });

// ======== levels ========
import level1    from './levels/level1.js';
import level1ai  from './levels/level1ai.js';
import level2    from './levels/level2.js';
import level2ai  from './levels/level2ai.js';
import level3    from './levels/level3.js';
import level3ai  from './levels/level3ai.js';
import level4    from './levels/level4.js';
import level4ai  from './levels/level4ai.js';
import level5    from './levels/level5.js';
import level5ai  from './levels/level5ai.js';
import level6    from './levels/level6.js';
import level6ai  from './levels/level6ai.js';
import level7    from './levels/level7.js';
import level7ai  from './levels/level7ai.js';

const LEVELS = [level1, level1ai, level2, level2ai, level3, level3ai, level4, level4ai, level5, level5ai, level6, level6ai, level7, level7ai];

// ======== init.js ========

// Expose G and helpers to HTML onclick attributes
window.G = G;
window.G.setScr = setScr;
window.succeed        = succeed;
window.fail            = fail;
window.addAch          = addAch;
window.tick            = tick;
window.almostGotYou   = almostGotYou;
window.trackHover     = trackHover;
window.setLevelGrade  = setLevelGrade;
Object.defineProperty(window, 'levelIdx', { get: () => levelIdx });
window.Glossary = {
  show: showGlossary,
  hide: hideGlossary,
  closeOnBackdrop: closeGlossaryOnBackdrop,
  showPatternInfo,
  hidePatternInfo,
  closePatternInfoOnBackdrop,
};
window.setScr = setScr;
window.initDesigner = initDesigner;
window.dpick = dpick;

// Level jump buttons
const jumpEl = document.getElementById('level-jump');
if (jumpEl) {
  LEVELS.forEach((lv, i) => {
    const b = document.createElement('button');
    b.className = 'btn btn-g';
    b.style.cssText = 'font-size:15px;padding:6px 12px;border:0.5px solid #e0e0d8';
    b.textContent = lv.title;
    b.onclick = () => jumpTo(i);
    jumpEl.appendChild(b);
  });
}

// Start background music on first interaction
document.addEventListener('click', () => bgStart(), { once: true });