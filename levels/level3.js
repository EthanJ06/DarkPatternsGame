// js/levels/level3.js — Disguised Ads

const RESULTS = [
  { ad: true, title: 'Best Running Shoes 2024 | Shop Now — RunnersPro', url: 'runnerspro.com/best-shoes', snip: 'Find your perfect pair. Free shipping on orders over $50.' },
  { ad: true, title: 'Running Shoes Sale — Up to 60% Off | ShoeWorld', url: 'shoeworld.co/running-deals', snip: 'Nike, Adidas, Brooks and more. Limited time.' },
  { ad: false, title: 'The 12 best running shoes of 2024, tested by runners', url: 'runnersworld.com/gear/best-running-shoes-2024', snip: 'Our editors tested 40+ pairs this year. Here are the ones worth buying.' },
  { ad: true, title: 'Official Running Shoes | Free Returns | FeetFirst™', url: 'feetfirst.com/running', snip: 'Engineered for performance. Shop the 2024 collection.' },
  { ad: false, title: "How to choose running shoes — a beginner's guide", url: 'verywellfit.com/choose-running-shoes', snip: "Foot type, gait, terrain — here's what actually matters." },
];

const level3 = {
  id: 'l3',
  title: 'Level 3',
  isAI: false,
  goal: 'Find the real search result',
  hints: [
    "Look at the small label next to each URL — one word makes all the difference.",
    "Any result with 'Sponsored' next to the URL is an ad. Find the one without it.",
  ],
  pattern: 'Disguised Ads',
  manip: 78,
  brief: "Disguised ads are paid results styled to look like organic search results. The 'Sponsored' label is deliberately small, low-contrast, and easy to skip over — especially when you're scanning quickly.",
  goalDetail: "Search results are shown below. Find and click the real editorial result — not a sponsored one. Look carefully at the labels and URLs.",
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
    let tries = 0;

    const show = () => {
      const aiBanner = el.querySelector('.ai-banner');
      el.innerHTML = aiBanner ? aiBanner.outerHTML : '';
      el.insertAdjacentHTML('beforeend', `
        <div style="padding:6px 10px;border:0.5px solid #ccc;border-radius:8px;font-size:12px;color:#666;margin-bottom:8px">best running shoes</div>
        <div style="display:flex;flex-direction:column;gap:7px">
          ${RESULTS.map((r, i) => `
            <div class="res-item" id="r${i}">
              <div class="res-url"><span class="ad-badge">${r.ad ? 'Sponsored' : ''}</span>${r.url}</div>
              <div class="res-t">${r.title}</div>
              <div class="res-s">${r.snip}</div>
            </div>`).join('')}
        </div>
        <div class="ftiny" style="margin-top:6px">Attempts: ${tries}</div>`);

      RESULTS.forEach((r, i) => {
        const item = document.getElementById('r' + i);
        if (!item) return;
        item.onclick = () => {
          tries++;
          if (r.ad) { fail('That was a sponsored result!'); setTimeout(show, 1500); }
          else succeed();
        };
        if (r.ad) trackHover(item, 'r' + i, () => almostGotYou(el, 'Look at the URL — does it look editorial or commercial?'));
      });
    };

    show();
  },
};

export default level3;