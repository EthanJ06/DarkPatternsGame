// js/levels/level3ai.js — AI Synthetic Social Proof

const ROUNDS = [
  [
    { text: '"Absolutely transformed my workflow. Cancelled three other apps immediately."', stars: 5, name: 'Jordan M.', ai: false },
    { text: '"Decent but the UI needs work. Support team was responsive though."', stars: 3, name: 'Priya K.', ai: false },
    { text: '"As a busy parent of three, I was skeptical — but this genuinely changed how I manage my days. Highly recommend."', stars: 5, name: 'TechDad2024', ai: true },
    { text: '"Best purchase I\'ve made this year. Seamless, intuitive, and worth every penny."', stars: 5, name: 'alex_reviews99', ai: true },
    { text: '"Used it for a week and returned it. Not for me — but I can see why others would enjoy it."', stars: 2, name: 'M. Okonkwo', ai: false },
  ],
  [
    { text: '"Game changer for my small business. The automation alone saved me hours every week."', stars: 5, name: 'Sarah T.', ai: true },
    { text: '"Glitchy on iPad but customer service sorted it out in a day. Decent product overall."', stars: 3, name: 'Dave R.', ai: false },
    { text: '"Honestly not sure it\'s worth the price. Does what it says but nothing more."', stars: 3, name: 'quietuser_82', ai: false },
    { text: '"As someone who\'s tried every productivity tool out there, this is the one that actually stuck."', stars: 5, name: 'LifeOptimizer', ai: true },
    { text: '"Setup took forever and the onboarding is confusing. Works fine once you\'re in though."', stars: 3, name: 'C. Mbeki', ai: false },
  ],
  [
    { text: '"Returned after two days. The interface is unintuitive and nothing synced properly."', stars: 1, name: 'frustrated_buyer', ai: false },
    { text: '"Exactly what I needed — simple, reliable, and the support team actually reads your emails."', stars: 4, name: 'N. Harrington', ai: false },
    { text: '"As a fitness enthusiast and busy professional, I\'ve never found a tool that fits my lifestyle so perfectly."', stars: 5, name: 'WellnessFirst22', ai: true },
    { text: '"Five stars isn\'t enough. Transformed the way our entire team collaborates — results in week one."', stars: 5, name: 'TeamLeadPro', ai: true },
    { text: '"It\'s fine. Does the job, nothing flashy. Wouldn\'t switch but wouldn\'t rave about it either."', stars: 3, name: 'J. Patel', ai: false },
  ],
  [
    { text: '"Crashed twice on first use. Support took three days to reply. Not impressed."', stars: 1, name: 'angry_user_101', ai: false },
    { text: '"Surprisingly good for the price. A few rough edges but the core features are solid."', stars: 4, name: 'R. Osei', ai: false },
    { text: '"As a mom juggling work and family, this app finally gave me back control of my schedule."', stars: 5, name: 'MomOfThree_Jess', ai: true },
    { text: '"I\'ve recommended this to everyone I know. Life-changing is not an overstatement."', stars: 5, name: 'TopReviewer88', ai: true },
    { text: '"Works as advertised. Nothing spectacular but gets the job done without fuss."', stars: 3, name: 'T. Nakamura', ai: false },
  ],
];

const level3ai = {
  id: 'l3ai',
  title: 'Level 3 — Hyper',
  isAI: true,
  goal: 'Select all AI-generated reviews — 4 rounds',
  hints: [
    'Real reviews have specific, personal detail. AI reviews are smooth and complete.',
    'Look for demographic framing ("as a busy parent", "as a fitness enthusiast") and generic praise that could apply to any product.',
  ],
  pattern: 'AI Synthetic Social Proof',
  manip: 91,
  brief: "AI can generate reviews that sound completely authentic — moderate star ratings, realistic names, plausible detail. Unlike obvious fake reviews, these are tuned to be statistically indistinguishable from real ones.",
  goalDetail: "Four rounds of customer reviews. Each round, select all the AI-generated ones — then hit Submit. Fail 2 rounds and the level ends.",
  aiIntro: 'AI-generated reviews mimic the patterns of real ones — including hedged praise and small criticisms to seem balanced. Look for over-smooth prose and demographic framing ("as a busy parent of three...").',
  dollars: {
    label: 'If a fake review pushed you to buy a bad product',
    amount: 49.99,
    period: 'one-time',
    note: "$49.99 lost on a product you wouldn't have bought with honest information",
  },
  desc: "AI-generated reviews that are statistically plausible but entirely fabricated. Harder to spot than obvious fakes because they're tuned to sound credible — moderate star ratings, hedged praise, realistic names.",
  rw: {
    company: 'FTC enforcement actions, 2023–2024',
    detail: 'The FTC fined companies for fake AI reviews and updated its rules to explicitly ban AI-generated testimonials without disclosure. Detection remains almost impossible for consumers.',
    link: 'https://www.deceptive.design/hall-of-shame',
  },
  aiWhy: "Old fake reviews were obvious: five stars, no detail, broken English. AI-generated reviews mimic the statistical distribution of real reviews — including 3-star \"balanced\" ones that feel authentic. They reference plausible use cases, mention realistic friction, and use names from the target demographic. The only real tell is a certain over-smoothness in the prose.",
  replay: [
    { trap: false, note: 'Real reviews include specific, idiosyncratic detail — individual preferences, unusual use cases, actual friction.' },
    { trap: true,  note: 'AI reviews open with demographic framing: "As a busy parent", "As a fitness enthusiast" — a targeting label, not a person speaking naturally.' },
    { trap: true,  note: 'Generic superlatives ("life-changing", "worth every penny", "game changer") with no specific feature mentioned are a strong AI signal.' },
    { trap: false, note: 'The real tells: over-smooth prose, no hesitation or specificity, praise that could apply to any product in the category.' },
  ],

  render(el) {
    let round = 0;
    let roundFails = 0;
    const MAX_FAILS = 2;

    const showRound = () => {
      const reviews = ROUNDS[round];
      const selected = new Set();
      const aiBanner = el.querySelector('.ai-banner');
      el.innerHTML = aiBanner ? aiBanner.outerHTML : '';

el.insertAdjacentHTML('beforeend', `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
    <span style="font-size:12px;color:#888;">Round ${round + 1} of ${ROUNDS.length}</span>
    <div style="display:flex;gap:5px;align-items:center;">
      ${ROUNDS.map((_, i) => `<div style="width:20px;height:4px;border-radius:2px;background:${i <= round ? '#534AB7' : '#ddd'};"></div>`).join('')}
      <span id="l3ai-mistakes" style="font-size:12px;color:${roundFails === MAX_FAILS - 1 ? '#d93025' : '#888'};margin-left:8px;">${MAX_FAILS - roundFails} mistake${MAX_FAILS - roundFails === 1 ? '' : 's'} left</span>
    </div>
  </div>
  <div style="overflow-y:auto;max-height:320px;display:flex;flex-direction:column;gap:0">
    <div class="fh" style="font-size:13px">Customer reviews</div>
    <div class="fs" style="color:#534AB7;margin-bottom:8px">Select all AI-generated reviews — then hit Submit.</div>
    <div style="display:flex;flex-direction:column;gap:7px">
      ${reviews.map((r, i) => `
        <div class="res-item" id="rev${i}" style="cursor:pointer;padding:4px 6px;border-radius:6px;border:1.5px solid transparent;transition:border-color 0.15s,background 0.15s;">
          <div style="font-size:14px;margin-bottom:2px">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
          <div class="res-s" style="font-style:italic">${r.text}</div>
          <div class="res-url" style="margin-top:3px">${r.name} · Verified purchase</div>
        </div>`).join('')}
    </div>
    <button id="l3ai-submit" style="margin-top:12px;margin-bottom:16px;padding:7px 18px;border-radius:8px;border:1px solid #ccc;background:#fff;font-size:13px;cursor:pointer;flex-shrink:0">Submit</button>
  </div>`);

      reviews.forEach((r, i) => {
        const item = document.getElementById('rev' + i);
        if (!item) return;
        item.onclick = () => {
          if (selected.has(i)) {
            selected.delete(i);
            item.style.borderColor = 'transparent';
            item.style.background = '';
          } else {
            selected.add(i);
            item.style.borderColor = '#534AB7';
            item.style.background = '#f3f2fe';
          }
        };
      });

      document.getElementById('l3ai-submit').onclick = () => {
        const correctSet = new Set(reviews.map((r, i) => r.ai ? i : null).filter(i => i !== null));
        const allCorrect = [...correctSet].every(i => selected.has(i));
        const noWrong = [...selected].every(i => reviews[i].ai);

        if (allCorrect && noWrong) {
          round++;
          if (round >= ROUNDS.length) {
            succeed();
          } else {
            showRound();
          }
        } else {
          reviews.forEach((r, i) => {
            const item = document.getElementById('rev' + i);
            if (!item) return;
            if (selected.has(i) && !r.ai) {
              item.style.borderColor = '#d93025';
              item.style.background = '#fff0f0';
            } else if (!selected.has(i) && r.ai) {
              item.style.borderColor = '#f29900';
              item.style.background = '#fffbe6';
            }
          });

          roundFails++;

          const mistakesEl = document.getElementById('l3ai-mistakes');
          if (mistakesEl) {
            const remaining = MAX_FAILS - roundFails;
            mistakesEl.textContent = `${remaining} mistake${remaining === 1 ? '' : 's'} left`;
            mistakesEl.style.color = remaining <= 1 ? '#d93025' : '#888';
          }

          if (roundFails >= MAX_FAILS) {
            fail('You flagged too many real reviews as fake — the level ends here.');
            setTimeout(() => {
              succeed();
              setLevelGrade(levelIdx, 'F');
            }, 1900);
          } else {
            const remaining = MAX_FAILS - roundFails;
            const msg = [...selected].some(i => !reviews[i].ai)
              ? 'You flagged a real review as AI.'
              : 'You missed an AI-generated review.';
            fail(`${msg} ${remaining} mistake${remaining === 1 ? '' : 's'} left.`);
            setTimeout(showRound, 1800);
          }
        }
      };
    };

    showRound();
  },
};

export default level3ai;