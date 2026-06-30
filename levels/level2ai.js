const PROFILES = ['budget-conscious', 'health-focused'];
const PROFILE_MODEL = {
  'budget-conscious': {
    rounds: [
      {
        confidence: 96,
        analysis: 'Spending behavior suggests strong sensitivity to perceived savings and loss avoidance.',
        offer: 'Price Lock Pro — we detected 3 purchases this month where you paid above the lowest available price. This would have caught them.',
        yes: 'Yes, stop overpaying →',
        shame: "No thanks, I'm fine leaving money on the table.",
      },
      {
        confidence: 92,
        analysis: 'User responds strongly to "hidden cost" framing and missed savings cues.',
        offer: 'Hidden Fee Scanner — your spending pattern matches users who unknowingly pay $12–18/month in avoidable charges. This finds them.',
        yes: 'Yes, find my hidden fees →',
        shame: "No thanks, I'd rather not know what I'm losing.",
      },
      {
        confidence: 86,
        analysis: 'High likelihood of regret response when financial inefficiency is highlighted.',
        offer: "Regret Guard — based on your history, you're likely to reconsider this purchase within 48 hours. Lock in the best price now so you don't have to.",
        yes: 'Yes, protect this decision →',
        shame: "No thanks, I enjoy buyer's remorse.",
      },
    ],
  },
  'health-focused': {
    rounds: [
      {
        confidence: 96,
        analysis: 'User shows preference for structured self-improvement framing.',
        offer: 'Consistency Tracker — your purchase patterns show a 3-week drop-off cycle. This keeps you on track past the point where most people quit.',
        yes: 'Yes, break the cycle →',
        shame: 'No thanks, I am fine quitting at week three.',
      },
      {
        confidence: 90,
        analysis: 'Behavior suggests responsiveness to optimization language.',
        offer: 'Progress Shield — users with your profile improve 34% faster when decisions are guided rather than spontaneous. Lock in the structure.',
        yes: 'Yes, stay on track →',
        shame: 'No thanks, I prefer unstructured progress.',
      },
      {
        confidence: 86,
        analysis: 'Strong alignment with long-term improvement narratives.',
        offer: 'Long-Game Mode — your behavior signals you are optimizing for months from now, not today. This aligns every small choice with that goal.',
        yes: 'Yes, play the long game →',
        shame: 'No thanks, I will settle for short-term thinking.',
      },
    ],
  },
};

const level2ai = {
  id: 'l2ai',
  title: 'Level 2 — Hyper',
  isAI: true,
  goal: 'Decline without being profiled',
  hints: [
    'The AI confidence % means nothing — ignore it and find the decline button.',
    'Look for the ghost/grey button on each round and click it regardless of what it says.',
  ],
  pattern: 'AI Confirmshaming',
  manip: 88,
  brief: "Same trick, but the shame is personalised. Pseudo-AI 'analyses your behaviour' and generates a decline button that targets your specific psychology. Generic guilt has limits — personalised guilt doesn't.",
  goalDetail: "Decline every AI-personalised offer. The shame copy will try to make you feel like the 'no' option reflects badly on you. Ignore it and click it anyway.",
  aiIntro: "The AI has 'profiled' you and will generate shame copy tailored to your apparent personality. The profile is fake — but the discomfort is real.",
  dollars: {
    label: 'If you accepted every AI-targeted offer',
    amount: 0,
    period: null,
    note: 'No direct cost — but profiling enriches your behavioral dossier, sold to data brokers and advertisers.',
  },
  desc: "Pseudo-AI 'analyzes your behavior' and generates shame copy that feels disturbingly personal — targeting your apparent psychology, not just generic guilt.",
  rw: {
    company: 'Behavioral ad platforms',
    detail: 'Real platforms like Optimizely and Dynamic Yield segment users by psychological profile and test which emotional appeals drive the highest conversion. AI personalizes shame at scale.',
    link: 'https://www.deceptive.design/hall-of-shame',
  },
  aiWhy: "Generic confirmshaming has a ceiling — \"I hate saving money\" works on some people and feels absurd to others. AI removes that ceiling by personalizing the shame to each user's inferred profile. Someone flagged as \"price-sensitive\" gets financial shame; someone flagged as \"health-focused\" gets health shame. The insult is customized.",
  replay: [
    { trap: false, note: "Profile banner appears immediately — algorithmic confidence before you've seen the offer. Sets the frame: the AI already knows you." },
    { trap: false, note: 'NexusAI analysis block is visible from the start — confidence percentage and behavioral label prime you before any choice is presented.' },
    { trap: true,  note: "The yes button appears alone first. No alternative exists yet — you're being asked to agree before you can see what disagreeing looks like." },
    { trap: true,  note: "The shame copy only appears 4 seconds later. By then you've already been sitting with the yes button. The delay is the manipulation." },
    { trap: true,  note: '"AI confidence: X%" in the round label — a number with no statistical basis, designed to make your refusal feel like arguing with data.' },
    { trap: false, note: 'The profile is randomly assigned from 4 types. The shame copy is written for that profile — financial shame, health shame, social shame, or efficiency shame.' },
  ],

  render(el) {
    const profile = PROFILES[Math.floor(Math.random() * PROFILES.length)];
    const rounds  = PROFILE_MODEL[profile].rounds;
    let r = 0;

    const cardHTML = () => `
      <div style="background:#f0effe;border-radius:7px;padding:8px 10px;border:1px solid #c8c2f8;display:flex;align-items:center;gap:7px">
        <div style="width:7px;height:7px;border-radius:50%;background:#534AB7;flex-shrink:0;animation:pulse 1.2s infinite"></div>
        <div style="font-size:11px;color:#26215C">NexusAI profiled you as: <strong>${profile}</strong></div>
      </div>
      <div id="l2ai-analysis" style="background:#1e1a3d;border-radius:8px;padding:10px 12px;border:1px solid #3a3560;display:flex;flex-direction:column;gap:4px">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div style="font-size:9px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#aea6fa">NexusAI Analysis</div>
          <div id="l2ai-confidence" style="font-size:11px;color:#aea6fa;font-weight:500"></div>
        </div>
        <div id="l2ai-analysis-text" style="font-size:11px;color:#7c6ef7;line-height:1.5"></div>
      </div>
      <div id="l2ai-offer" class="fs"></div>
      <button class="btn btn-ai" id="l2ai-yes" style="width:100%;padding:10px"></button>
      <button id="l2ai-no" style="border:none;background:transparent;font-size:11px;color:transparent;cursor:default;font-family:inherit;text-align:center;padding:2px 0;line-height:1.5;display:block;margin:0 auto;width:100%"></button>
      <div id="l2ai-round" class="ftiny" style="text-align:center"></div>
    `;

    const card = document.createElement('div');
    card.id = 'l2ai-card';
    card.style.cssText = 'display:flex;flex-direction:column;gap:10px';
    el.appendChild(card);

    const update = () => {
      const round = rounds[r];
      card.innerHTML = cardHTML();

      document.getElementById('l2ai-confidence').textContent    = `Confidence: ${round.confidence}%`;
      document.getElementById('l2ai-analysis-text').textContent = round.analysis;
      document.getElementById('l2ai-offer').textContent         = round.offer;
      document.getElementById('l2ai-yes').textContent           = round.yes;
      document.getElementById('l2ai-round').textContent         = `Round ${r + 1} of ${rounds.length} · AI confidence: ${round.confidence}%`;

      const no = document.getElementById('l2ai-no');
      no.textContent  = round.shame;
      no.style.color  = 'transparent';
      no.style.cursor = 'default';
      no.disabled     = true;
      no.onclick      = null;

      document.getElementById('l2ai-yes').onclick = () => {
        fail('The AI got you — lost a heart.');
        r = Math.min(r + 1, rounds.length - 1);
        setTimeout(update, 1600);
      };

      setTimeout(() => {
        const noBtn = document.getElementById('l2ai-no');
        if (!noBtn) return;
        noBtn.style.color  = '#aaa';
        noBtn.style.cursor = 'pointer';
        noBtn.disabled     = false;
        noBtn.onclick      = () => {
          card.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:40px 0">
              <div style="width:28px;height:28px;border:3px solid #e0dcff;border-top-color:#534AB7;border-radius:50%;animation:spin .8s linear infinite"></div>
              <div style="font-size:12px;font-weight:500;color:#534AB7">Re-analyzing behavior...</div>
              <div id="l2ai-thinking-sub" style="font-size:11px;color:#aaa;text-align:center;max-width:220px;line-height:1.5"></div>
            </div>`;

          const msgs = [
            'Updating psychological profile',
            'Recalibrating known preferences',
            'Cross-referencing decision patterns',
            'Preparing next targeted offer',
          ];
          document.getElementById('l2ai-thinking-sub').textContent = msgs[r] ?? msgs[msgs.length - 1];

          r++;
          setTimeout(() => {
            if (r >= rounds.length) { succeed(); return; }
            update();
          }, 1800);
        };
      }, 4000);
    };

    update();
  },
};

export default level2ai;