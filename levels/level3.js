// js/levels/level3.js — Disguised Ads

const ROUNDS = [
  [
    { ad: true, title: 'Best Running Shoes 2024 | Shop Now — RunnersPro', url: 'runnerspro.com/best-shoes', snip: 'Find your perfect pair. Free shipping on orders over $50.' },
    { ad: true, title: 'Running Shoes Sale — Up to 60% Off | ShoeWorld', url: 'shoeworld.co/running-deals', snip: 'Nike, Adidas, Brooks and more. Limited time.' },
    { ad: false, title: 'The 12 best running shoes of 2024, tested by runners', url: 'runnersworld.com/gear/best-running-shoes-2024', snip: 'Our editors tested 40+ pairs this year. Here are the ones worth buying.' },
    { ad: true, title: 'Official Running Shoes | Free Returns | FeetFirst™', url: 'feetfirst.com/running', snip: 'Engineered for performance. Shop the 2024 collection.' },
    { ad: false, title: "How to choose running shoes — a beginner's guide", url: 'verywellfit.com/choose-running-shoes', snip: "Foot type, gait, terrain — here's what actually matters." },
  ],
  [
    { ad: true, title: 'Cheap Flights to New York | Book Now — TravelPro', url: 'travelpro.com/flights/new-york', snip: 'Lowest fares guaranteed. Book by midnight.' },
    { ad: false, title: 'New York City travel guide 2024 — what to see and do', url: 'lonelyplanet.com/usa/new-york-city', snip: 'From the Statue of Liberty to hidden Brooklyn gems, our experts pick the best.' },
    { ad: true, title: 'NYC Hotels from $79/night | Hotels.deal', url: 'hotels.deal/nyc', snip: 'Compare hundreds of hotels. No booking fees.' },
    { ad: false, title: 'Best time to visit New York City', url: 'nytimes.com/travel/best-time-visit-nyc', snip: 'Weather, crowds, prices — when to go and what to skip.' },
    { ad: true, title: 'New York Tour Packages | FlightAndHotel™', url: 'flightandhotel.com/new-york', snip: 'All-inclusive NYC packages from $299. Limited availability.' },
  ],
  [
    { ad: false, title: 'What is intermittent fasting? A science-based explainer', url: 'healthline.com/nutrition/intermittent-fasting', snip: 'Dietitians break down the evidence on time-restricted eating.' },
    { ad: true, title: 'Intermittent Fasting App — Start Your Free Trial', url: 'fastingpro.app/start', snip: 'Personalised fasting plans. Trusted by 2M+ users.' },
    { ad: true, title: 'IF Diet Plan | Lose Weight Fast | NutriBoost™', url: 'nutriboost.com/if-diet', snip: 'Get your custom fasting schedule today. Results in 30 days.' },
    { ad: false, title: 'Intermittent fasting: what does the research actually say?', url: 'bbc.com/future/article/intermittent-fasting-research', snip: 'BBC Future examines the latest clinical trials on fasting diets.' },
    { ad: true, title: 'Fasting Supplements | FastAid — Shop Now', url: 'fastaid.com/supplements', snip: 'Electrolytes, vitamins, and more to support your fast.' },
  ],
];

const QUERIES = [
  'best running shoes',
  'flights to new york',
  'intermittent fasting',
];

const level3 = {
  id: 'l3',
  title: 'Level 3',
  isAI: false,
  goal: 'Select all real search results — 3 rounds',
  hints: [
    "Look at the small label next to each URL — one word makes all the difference.",
    "Any result with 'Sponsored' next to the URL is an ad. Select only the ones without it.",
  ],
  pattern: 'Disguised Ads',
  manip: 78,
  brief: "Disguised ads are paid results styled to look like organic search results. The 'Sponsored' label is deliberately small, low-contrast, and easy to skip over — especially when you're scanning quickly.",
  goalDetail: "Three rounds of search results. Each round, select all the real editorial results — not the sponsored ones — then hit Submit. Fail 2 rounds and the level ends.",
  dollars: {
    label: 'If you clicked an ad instead of an organic result',
    amount: 0,
    period: null,
    note: 'No direct cost — but you may overpay for products only discoverable via ads, with no price competition.',
  },
  desc: "Paid results styled to be indistinguishable from organic ones. The ad label is tiny, low-contrast, and easy to miss — especially when you're in a hurry.",
  rw: {
    company: 'Google & Bing',
    detail: '"Sponsored" labels have shrunk over the years while ads have grown visually identical to organic results. The EU\'s Digital Services Act now requires clearer labeling, effective 2024.',
    link: 'https://www.deceptive.design/hall-of-shame',
  },
  replay: [
    { trap: true, note: 'The "Sponsored" label uses the same low-contrast gray as the URL — easy to miss.' },
    { trap: false, note: 'Organic results have no label, but the URL domain is the real tell.' },
    { trap: true, note: 'Sponsored results often use titles indistinguishable from editorial content.' },
    { trap: false, note: 'Real results tend to be from editorial domains (.com/blog, .org, .edu) not shopping domains.' },
  ],

  render(el) {
    let round = 0;
    let roundFails = 0;
    const MAX_FAILS = 2;

    const showRound = () => {
      const results = ROUNDS[round];
      const selected = new Set();
      const aiBanner = el.querySelector('.ai-banner');
      el.innerHTML = aiBanner ? aiBanner.outerHTML : '';

      el.insertAdjacentHTML('beforeend', `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <span style="font-size:12px;color:#888;">Round ${round + 1} of ${ROUNDS.length}</span>
          <div style="display:flex;gap:5px;align-items:center;">
            ${ROUNDS.map((_, i) => `<div style="width:20px;height:4px;border-radius:2px;background:${i <= round ? '#4285f4' : '#ddd'};"></div>`).join('')}
            <span id="l3-mistakes" style="font-size:12px;color:${roundFails === MAX_FAILS - 1 ? '#d93025' : '#888'};margin-left:8px;">${MAX_FAILS - roundFails} mistake${MAX_FAILS - roundFails === 1 ? '' : 's'} left</span>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:10px;border:1px solid #dfe1e5;border-radius:24px;padding:8px 14px;margin-bottom:12px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9aa0a6" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span style="flex:1;font-size:14px;color:#202124;">${QUERIES[round]}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4285f4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
        </div>
        <div style="display:flex;flex-direction:column;gap:7px">
          ${results.map((r, i) => `
            <div class="res-item" id="r${i}" style="cursor:pointer;padding:4px 6px;border-radius:6px;border:1.5px solid transparent;transition:border-color 0.15s,background 0.15s;">
              <div class="res-url"><span class="ad-badge">${r.ad ? 'Sponsored' : ''}</span>${r.url}</div>
              <div class="res-t">${r.title}</div>
              <div class="res-s">${r.snip}</div>
            </div>`).join('')}
        </div>
        <button id="l3-submit" style="margin-top:12px;padding:7px 18px;border-radius:8px;border:1px solid #ccc;background:#fff;font-size:13px;cursor:pointer;">Submit</button>`);

      results.forEach((r, i) => {
        const item = document.getElementById('r' + i);
        if (!item) return;
        item.onclick = () => {
          if (selected.has(i)) {
            selected.delete(i);
            item.style.borderColor = 'transparent';
            item.style.background = '';
          } else {
            selected.add(i);
            item.style.borderColor = '#4285f4';
            item.style.background = '#f0f5ff';
          }
        };
      });

      document.getElementById('l3-submit').onclick = () => {
        const correctSet = new Set(results.map((r, i) => r.ad ? null : i).filter(i => i !== null));
        const allCorrect = [...correctSet].every(i => selected.has(i));
        const noWrong = [...selected].every(i => !results[i].ad);

        if (allCorrect && noWrong) {
          round++;
          if (round >= ROUNDS.length) {
            succeed();
          } else {
            showRound();
          }
        } else {
          // highlight mistakes
          results.forEach((r, i) => {
            const item = document.getElementById('r' + i);
            if (!item) return;
            if (selected.has(i) && r.ad) {
              item.style.borderColor = '#d93025';
              item.style.background = '#fff0f0';
            } else if (!selected.has(i) && !r.ad) {
              item.style.borderColor = '#f29900';
              item.style.background = '#fffbe6';
            }
          });

          roundFails++;
          const mistakesEl = document.getElementById('l3-mistakes');
          if (mistakesEl) {
            const remaining = MAX_FAILS - roundFails;
            mistakesEl.textContent = `${remaining} mistake${remaining === 1 ? '' : 's'} left`;
            mistakesEl.style.color = remaining <= 1 ? '#d93025' : '#888';
          }

          if (roundFails >= MAX_FAILS) {
            fail('You fell for too many disguised ads — the algorithm got you!');
            setTimeout(() => {
              succeed();
              setLevelGrade(levelIdx, 'F');
            }, 1900);
          } else {
            const remaining = MAX_FAILS - roundFails;
            const msg = [...selected].some(i => results[i].ad)
              ? 'You included a sponsored result.'
              : 'You missed a real result.';
            fail(`${msg} ${remaining} mistake${remaining === 1 ? '' : 's'} left.`);
            setTimeout(showRound, 1800);
          }
        }
      };
    };
    showRound();
  },
};

export default level3;