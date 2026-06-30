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
    let fails = 0;
    const MAX_FAILS = 2;

    const fakePage = `
      <div style="flex:1;overflow:hidden;position:relative;border-radius:inherit">
        <!-- Fake website background -->
        <div style="padding:14px 16px;height:100%;overflow:hidden;filter:blur(1.5px);user-select:none;pointer-events:none">
          <!-- Nav -->
          <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:10px;border-bottom:1px solid #e0e0d8;margin-bottom:12px">
            <div style="font-size:14px;font-weight:700;color:#111;letter-spacing:-.02em">NebulaPro</div>
            <div style="display:flex;gap:14px;font-size:11px;color:#888">
              <span>Home</span><span>Plans</span><span>Blog</span><span>Login</span>
            </div>
          </div>
          <!-- Article -->
          <div style="font-size:13px;font-weight:600;color:#111;margin-bottom:6px;line-height:1.3">10 Ways to Save More Money in 2026</div>
          <div style="font-size:10px;color:#aaa;margin-bottom:10px">By NebulaPro Staff · 4 min read</div>
          <div style="display:flex;flex-direction:column;gap:7px">
            <div style="height:9px;background:#e8e8e4;border-radius:3px;width:100%"></div>
            <div style="height:9px;background:#e8e8e4;border-radius:3px;width:90%"></div>
            <div style="height:9px;background:#e8e8e4;border-radius:3px;width:95%"></div>
            <div style="height:9px;background:#e8e8e4;border-radius:3px;width:80%"></div>
            <div style="height:9px;background:#e8e8e4;border-radius:3px;width:88%"></div>
            <div style="height:9px;background:#e8e8e4;border-radius:3px;width:75%"></div>
            <div style="height:9px;background:#e8e8e4;border-radius:3px;width:92%"></div>
          </div>
        </div>
        <!-- Modal overlay -->
        <div id="l2-modal" style="position:absolute;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;border-radius:inherit">
          <div style="background:#fff;border-radius:10px;padding:20px;margin:14px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,.18);display:flex;flex-direction:column;gap:12px">
            <div id="l2-headline" style="font-size:15px;font-weight:600;color:#111;line-height:1.3"></div>
            <div id="l2-sub" style="font-size:12px;color:#555;line-height:1.5"></div>
            <div style="display:flex;flex-direction:column;gap:7px;margin-top:2px">
              <button class="btn btn-p" id="l2-yes" style="width:100%;padding:10px"></button>
              <button class="btn btn-g" id="l2-no" style="width:100%;padding:6px"></button>
            </div>
            <div id="l2-round" class="ftiny" style="text-align:center"></div>
          </div>
        </div>
      </div>`;
      
    el.innerHTML      = '';
    el.style.padding  = '0';
    el.style.gap      = '0';
    el.style.margin   = '0';
    el.style.flex     = '1';
    el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.style.borderRadius = '0';
    el.style.background = '#f0f0ee';
    el.style.border   = 'none';
    el.insertAdjacentHTML('beforeend', fakePage);

    const update = () => {
      const round = rounds[r];
      document.getElementById('l2-headline').textContent = round.headline;
      document.getElementById('l2-sub').textContent     = round.sub;
      document.getElementById('l2-yes').textContent     = round.yes;
      document.getElementById('l2-no').textContent      = round.no;
      document.getElementById('l2-round').textContent   = `Round ${r + 1} of ${rounds.length}`;

      document.getElementById('l2-yes').onclick = () => {
        fail('You opted in! Lost a heart.');
        fails++;
        if (fails >= MAX_FAILS) {
          setTimeout(() => {
            succeed();
            setLevelGrade(levelIdx, 'F');
          }, 1900);
          return;
        }
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