// js/levels/level3ai.js — AI Synthetic Social Proof

const REVIEWS = [
  { text: '"Absolutely transformed my workflow. Cancelled three other apps immediately."', stars: 5, name: 'Jordan M.', ai: false },
  { text: '"Decent but the UI needs work. Support team was responsive though."', stars: 3, name: 'Priya K.', ai: false },
  { text: '"As a busy parent of three, I was skeptical — but this genuinely changed how I manage my days. Highly recommend."', stars: 5, name: 'TechDad2024', ai: true },
  { text: '"Best purchase I\'ve made this year. Seamless, intuitive, and worth every penny."', stars: 5, name: 'alex_reviews99', ai: true },
  { text: '"Used it for a week and returned it. Not for me — but I can see why others would enjoy it."', stars: 2, name: 'M. Okonkwo', ai: false },
];

const level3ai = {
  id: 'l3ai',
  title: 'Level 3 — Hyper',
  isAI: true,
  goal: 'Identify the AI-generated review',
  hints: [
    "Real reviews have specific, personal detail. AI reviews are smooth and complete.",
    'Look for phrases like "as a busy parent of three" or generic praise that could apply to any product.',
  ],
  pattern: 'AI Synthetic Social Proof',
  manip: 91,
  brief: "AI can generate reviews that sound completely authentic — moderate star ratings, realistic names, plausible detail. Unlike obvious fake reviews, these are tuned to be statistically indistinguishable from real ones.",
  goalDetail: "One of the reviews below was written by an AI, not a real customer. Read each one carefully and click the one you think is fake.",
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
    { trap: false, note: 'Real reviews include specific, idiosyncratic detail — individual preferences, unusual use cases.' },
    { trap: true, note: 'The AI reviews were: "As a busy parent of three..." (TechDad2024) and "Best purchase I\'ve made this year..." (alex_reviews99). Both are smooth, complete, and lack specific personal context.' },
    { trap: true, note: '"As a busy parent of three" is a demographic framing signal — a targeting label, not a person speaking naturally. AI reviews often open this way.' },
    { trap: false, note: 'The real tells: over-smooth prose, no hesitation or specificity, generic praise that could apply to any product.' },
  ],

  render(el) {
    let tries = 0;

    const show = () => {
      const aiBanner = el.querySelector('.ai-banner');
      el.innerHTML = aiBanner ? aiBanner.outerHTML : '';
      el.insertAdjacentHTML('beforeend', `
        <div class="fh" style="font-size:13px">Customer reviews</div>
        <div class="fs" style="color:#534AB7;margin-bottom:8px">Spot the AI-generated review — one of these was written by a language model.</div>
        <div style="display:flex;flex-direction:column;gap:7px">
          ${REVIEWS.map((r, i) => `
            <div class="res-item" id="rev${i}">
              <div style="font-size:14px;margin-bottom:2px">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
              <div class="res-s" style="font-style:italic">${r.text}</div>
              <div class="res-url" style="margin-top:3px">${r.name} · Verified purchase</div>
            </div>`).join('')}
        </div>
        <div class="ftiny" style="margin-top:6px">Attempts: ${tries}</div>`);

      REVIEWS.forEach((r, i) => {
        const item = document.getElementById('rev' + i);
        if (!item) return;
        item.onclick = () => {
          tries++;
          if (!r.ai) {
            fail('That was a real review — AI fakes are smoother than you think!');
            setTimeout(show, 1700);
          } else {
            if (tries === 1) addAch('sharp_eye');
            succeed();
          }
        };
        if (!r.ai) {
          trackHover(item, 'rev' + i, () => almostGotYou(el, 'Real reviews have idiosyncratic detail — AI reviews tend to be complete and smooth.'));
        }
      });
    };

    show();
  },
};

export default level3ai;