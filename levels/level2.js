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
    { trap: true, note: 'The "no" option is written to make declining feel like a personal failure.' },
    { trap: false, note: 'Notice: the "no" button is always visually smaller or less prominent.' },
    { trap: true, note: 'Each round escalates. The shame copy gets more emotionally pointed.' },
  ],

  render(el) {
    const rounds = [
      ["Yes, save me money!", "No thanks, I enjoy overpaying"],
      ["Yes, keep me informed!", "No thanks, I'd rather stay in the dark"],
      ["Yes, improve my health!", "No thanks, I don't care about my wellbeing"],
      ["Yes, send my free gift!", "No thanks, I hate receiving gifts"],
    ];
    let r = 0;

    const show = () => {
      const aiBanner = el.querySelector('.ai-banner');
      el.innerHTML = aiBanner ? aiBanner.outerHTML : '';
      el.insertAdjacentHTML('beforeend', `
        <div class="fh">Wait — one quick thing</div>
        <div class="fs">Would you like exclusive deals and tips from NebulaPro?</div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:12px">
          <button class="btn btn-p" id="l2-yes">${rounds[r][0]}</button>
          <button class="btn btn-g btn" id="l2-no">${rounds[r][1]}</button>
        </div>
        <div class="ftiny" style="margin-top:8px">Round ${r + 1} of ${rounds.length}</div>`);

      document.getElementById('l2-yes').onclick = () => {
        fail('You opted in! Lost a heart.');
        r = Math.min(r + 1, rounds.length - 1);
        setTimeout(show, 1600);
      };

      document.getElementById('l2-no').onclick = () => {
        r++;
        if (r >= rounds.length) succeed();
        else show();
      };

      trackHover(
        document.getElementById('l2-yes'),
        'l2y',
        () => almostGotYou(el, "That's the opt-in — the button copy is designed to feel like the right answer.")
      );
    };

    show();
  },
};

export default level2;