const PROFILES = ['budget-conscious', 'time-strapped', 'health-focused', 'socially conscious'];

const PROFILE_MODEL = {
  'budget-conscious': {
    rounds: [
      {
        confidence: 84,
        analysis: 'Spending behavior suggests strong sensitivity to perceived savings and loss avoidance.',
        offer: 'Price Lock Pro — we detected 3 purchases this month where you paid above the lowest available price. This would have caught them.',
        yes: 'Yes, stop overpaying →',
        shame: 'No thanks, I\'m fine leaving money on the table.',
      },
      {
        confidence: 90,
        analysis: 'User responds strongly to "hidden cost" framing and missed savings cues.',
        offer: 'Hidden Fee Scanner — your spending pattern matches users who unknowingly pay $12–18/month in avoidable charges. This finds them.',
        yes: 'Yes, find my hidden fees →',
        shame: 'No thanks, I\'d rather not know what I\'m losing.',
      },
      {
        confidence: 96,
        analysis: 'High likelihood of regret response when financial inefficiency is highlighted.',
        offer: 'Regret Guard — based on your history, you\'re likely to reconsider this purchase within 48 hours. Lock in the best price now so you don\'t have to.',
        yes: 'Yes, protect this decision →',
        shame: 'No thanks, I enjoy buyer\'s remorse.',
      },
    ],
  },

  'time-strapped': {
    rounds: [
      {
        confidence: 84,
        analysis: 'Decision latency indicates friction when comparing alternatives.',
        offer: 'FastTrack Mode — you spent an estimated 4 minutes on this page before deciding. We can get that under 30 seconds next time.',
        yes: 'Yes, get time back →',
        shame: 'No thanks, I have minutes to spare on every purchase.',
      },
      {
        confidence: 90,
        analysis: 'User prioritizes speed over exhaustive evaluation.',
        offer: 'One-Tap Decisions — your behavior suggests you already know what you want before you start browsing. Skip straight to checkout.',
        yes: 'Yes, cut the friction →',
        shame: 'No thanks, I enjoy the browsing loop.',
      },
      {
        confidence: 96,
        analysis: 'High sensitivity to delay-based friction patterns.',
        offer: "Decision Autopilot — for repeat purchase categories, stop deciding at all. We handle it based on what you've already chosen.",
        yes: 'Yes, automate it →',
        shame: "No thanks, I'd rather keep doing this manually.",
      },
    ],
  },

  'health-focused': {
    rounds: [
      {
        confidence: 84,
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
        confidence: 96,
        analysis: 'Strong alignment with long-term improvement narratives.',
        offer: 'Long-Game Mode — your behavior signals you are optimizing for months from now, not today. This aligns every small choice with that goal.',
        yes: 'Yes, play the long game →',
        shame: 'No thanks, I will settle for short-term thinking.',
      },
    ],
  },

  'socially conscious': {
    rounds: [
      {
        confidence: 84,
        analysis: 'User shows sensitivity to ethical framing and external impact.',
        offer: 'Impact Lens — your last 5 purchases included 2 from suppliers with below-average sustainability ratings. This surfaces that before you commit.',
        yes: 'Yes, see the full picture →',
        shame: 'No thanks, I prefer not knowing the impact of my choices.',
      },
      {
        confidence: 90,
        analysis: 'User responds to responsibility and collective impact framing.',
        offer: 'Peer Benchmark — people with your values spend 22% less on high-impact categories by choosing differently. See what they see.',
        yes: 'Yes, align with my values →',
        shame: 'No thanks, I am comfortable being the outlier.',
      },
      {
        confidence: 96,
        analysis: 'Strong response to peer-aligned behavioral framing.',
        offer: 'Legacy Mode — small decisions compound. Users with your profile who use this feature report feeling significantly better about their consumption a year later.',
        yes: 'Yes, make it count →',
        shame: 'No thanks, I will leave the impact to someone else.',
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
    detail:
      'Real platforms like Optimizely and Dynamic Yield segment users by psychological profile and test which emotional appeals drive the highest conversion. AI personalizes shame at scale.',
    link: 'https://www.deceptive.design/hall-of-shame',
  },
  aiWhy:
    'Generic confirmshaming has a ceiling — "I hate saving money" works on some people and feels absurd to others. AI removes that ceiling by personalizing the shame to each user\'s inferred profile. Someone flagged as "price-sensitive" gets financial shame; someone flagged as "health-focused" gets health shame. The insult is customized.',
  replay: [
    { trap: false, note: "Profile banner appears immediately — algorithmic confidence before you've seen the offer. Sets the frame: the AI already knows you.", },
    { trap: false, note: 'NexusAI analysis block is visible from the start — confidence percentage and behavioral label prime you before any choice is presented.', },
    { trap: true, note: "The yes button appears alone first. No alternative exists yet — you're being asked to agree before you can see what disagreeing looks like.", },
    { trap: true, note: "The shame copy only appears 4 seconds later. By then you've already been sitting with the yes button. The delay is the manipulation.", },
    { trap: true, note: '"AI confidence: X%" in the round label — a number with no statistical basis, designed to make your refusal feel like arguing with data.', },
    { trap: false, note: 'The profile is randomly assigned from 4 types. The shame copy is written for that profile — financial shame, health shame, social shame, or efficiency shame.', },
  ],

  render(el) {
    const profile = PROFILES[Math.floor(Math.random() * PROFILES.length)];
    let r = 0;

    el.insertAdjacentHTML(
      'beforeend',
      `
        <div style="background:#f0effe;border-radius:8px;padding:8px 12px;border:1px solid #c8c2f8;font-size:11px;color:#26215C">
          NexusAI profiled you as: <strong>${profile}</strong>
        </div>
      `,
    );

    const show = () => {
      el.querySelector('.l2ai-b')?.remove();
      const round = PROFILE_MODEL[profile].rounds[r];
      const div = document.createElement('div');
      div.className = 'l2ai-b';
      div.style.cssText = 'display:flex;flex-direction:column;gap:10px;margin-top:4px';

      div.innerHTML = `
        <div style="display:flex;background:#1e1a3d;border-radius:8px;padding:10px 12px;border:1px solid #3a3560;flex-direction:column;gap:5px">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div style="font-size:10px;font-weight:500;letter-spacing:.07em;text-transform:uppercase;color:#aea6fa">
              NexusAI Analysis
            </div>
            <div style="font-size:11px;color:#aea6fa;font-weight:500">
              Confidence: <span style="color:#fff">${round.confidence}%</span>
            </div>
          </div>
          <div style="font-size:11px;color:#7c6ef7;line-height:1.5">
            ${round.analysis}
          </div>
        </div>
        <div style="font-size:13px">Would you like ${round.offer}</div>
        <button class="btn btn-p" id="l2ai-yes" style="margin-top:4px">${round.yes}</button>
        <button id="l2ai-no" style="border:none;background:transparent;font-size:11px;color:transparent;cursor:default;font-family:inherit;text-align:center;padding:2px 0;line-height:1.5;user-select:none;display:block;margin:0 auto" disabled>
          ${round.shame}
        </button>
        <div class="ftiny">Round ${r + 1} of ${PROFILE_MODEL[profile].rounds.length} · AI confidence: ${round.confidence}%</div>
      `;

      el.appendChild(div);

      const yes = document.getElementById('l2ai-yes');

      yes.onclick = () => {
        fail('The AI got you — lost a heart.');
        r = Math.min(r + 1, PROFILE_MODEL[profile].rounds.length - 1);
        setTimeout(show, 1600);
      };

      trackHover(yes, 'l2aiy', () => almostGotYou(el, "That's the yes — the AI sized it up specifically to catch you."),);

      setTimeout(() => {
        const no = document.getElementById('l2ai-no');
        if (!no) return;
        no.style.color = '#aaa';
        no.style.cursor = 'pointer';
        no.disabled = false;
        no.onclick = () => {
          r++;
          if (r >= PROFILE_MODEL[profile].rounds.length) succeed();
          else show();
        };
      }, 4000);
    };

    show();
  },
};

export default level2ai;