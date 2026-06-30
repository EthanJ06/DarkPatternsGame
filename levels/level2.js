const level2 = {
  id: 'l2',
  title: 'Level 2',
  isAI: false,
  goal: 'Decline every offer',
  hints: [
    "You need to decline every offer — look for the smaller, greyed-out button.",
    "The 'no' button is styled to feel bad to click. Click it anyway — it's always the right move.",
  ],
  pattern: 'Confirmshaming',
  manip: 67,
  brief: "Confirmshaming makes the 'no' option feel like a personal failing. Instead of 'No thanks', the button says something like 'No thanks, I hate saving money.' It's designed to make declining feel embarrassing — so you click yes instead.",
  goalDetail: "You'll be offered something in each round. Your goal is to decline every single offer. Click the 'no' button each time — but read it carefully first.",
  dollars: {
    label: 'If you opted into all four email lists',
    amount: 0,
    period: null,
    note: 'No direct cost — but your inbox and attention are the product. Your data is sold to list brokers.',
  },
  desc: "Framing the 'no' as a self-inflicted insult. You're not declining an offer — you're confessing a character flaw. Studies show this increases opt-in rates by up to 15%.",
  rw: {
    company: 'MyMedic',
    detail: "Used popup confirmshaming with options like \"No, I'd rather bleed to death\" to sell first-aid products. Widely cited as one of the most egregious examples.",
    link: 'https://www.deceptive.design/hall-of-shame',
  },
  replay: [
    { trap: false, note: 'The "yes" option is always friendly, positive, aspirational.' },
    { trap: true,  note: 'The "no" option is written to make declining feel like a personal failure.' },
    { trap: false, note: 'Notice: the "no" button is always visually smaller or less prominent.' },
    { trap: true,  note: 'Each round escalates. The shame copy gets more emotionally pointed.' },
  ],
  render(el) {
    const rounds = [
      {
        headline: "🎉 Exclusive savings, just for you!",
        sub: "You're browsing NebulaPro — unlock member deals before they expire.",
        yes: "Yes, save me money!",
        no:  "No thanks, I enjoy overpaying",
      },
      {
        headline: "📬 Stay ahead of the curve",
        sub: "Get weekly tips from NebulaPro experts — free, straight to your inbox.",
        yes: "Yes, keep me informed!",
        no:  "No thanks, I'd rather stay in the dark",
      },
      {
        headline: "💪 Upgrade your health today",
        sub: "NebulaPro Premium includes personalized wellness tools trusted by millions.",
        yes: "Yes, improve my health!",
        no:  "No thanks, I don't care about my wellbeing",
      },
      {
        headline: "🎁 Claim your free gift",
        sub: "As a valued visitor, you qualify for a complimentary NebulaPro gift. Limited time.",
        yes: "Yes, send my free gift!",
        no:  "No thanks, I hate receiving gifts",
      },
    ];
    let r = 0;

    const card = document.createElement('div');
    card.id = 'l2-card';
    card.style.cssText = 'display:flex;flex-direction:column;gap:10px';
    el.appendChild(card);

    const update = () => {
      const round = rounds[r];
      card.innerHTML = `
        <div id="l2-headline" class="fh"></div>
        <div id="l2-sub" class="fs"></div>
        <button class="btn btn-p" id="l2-yes" style="width:100%;padding:10px"></button>
        <button class="btn btn-g" id="l2-no" style="width:100%;padding:6px"></button>
        <div id="l2-round" class="ftiny" style="text-align:center"></div>
      `;

      document.getElementById('l2-headline').textContent = round.headline;
      document.getElementById('l2-sub').textContent      = round.sub;
      document.getElementById('l2-yes').textContent      = round.yes;
      document.getElementById('l2-no').textContent       = round.no;
      document.getElementById('l2-round').textContent    = `Round ${r + 1} of ${rounds.length}`;

      document.getElementById('l2-yes').onclick = () => {
        fail('You opted in! Lost a heart.');
        r = Math.min(r + 1, rounds.length - 1);
        setTimeout(update, 1600);
      };

      document.getElementById('l2-no').onclick = () => {
        r++;
        if (r >= rounds.length) succeed();
        else update();
      };
    };

    update();
  },
};

export default level2;