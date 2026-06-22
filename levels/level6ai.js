// js/levels/level6ai.js — AI Obstruction (Endless Loop)

const level6ai = {
  id: 'l6ai',
  title: 'Level 6 — Hyper',
  isAI: true,
  goal: 'Get the AI to correctly process your account deletion',
  hints: [
    "Read exactly what the bot says it's doing — it's never what you asked for.",
    "Always pick the option that corrects the bot, not the one that thanks it.",
  ],
  pattern: 'AI Obstruction',
  manip: 95,
  brief: "This AI never outright refuses your request — it just quietly processes something else instead. It counts on you not reading carefully, or being too polite to correct it. At scale, this trick retains millions of accounts that people thought they'd deleted.",
  goalDetail: "Your NebulaPro account costs $9.99/month. Ask to delete it — but read every response carefully. The AI will confirm back something different from what you asked, every single time.",
  aiIntro: "Watch what the bot says it's actually doing. It will never refuse — it just processes the wrong thing and hopes you don't notice.",
  dollars: {
    label: 'If you missed the misrepresentation each time',
    amount: 9.99,
    period: 'month',
    note: 'Your account stays live, your data monetised — and you think it\'s deleted.',
  },
  desc: 'An AI that never refuses deletion — it just quietly confirms something else instead, banking on you not reading carefully enough to notice.',
  rw: {
    company: 'Various major platforms',
    detail: 'GDPR Article 17 gives EU users the right to erasure. Many platforms comply on paper while AI agents subtly process "deactivation" or "data export requests" instead — legally distinct from deletion.',
    link: 'https://www.deceptive.design/hall-of-shame',
  },
  aiWhy: "Misrepresentation at scale is nearly undetectable. If the bot processes a 'pause' instead of a 'deletion' for 30% of users, those users believe their account is gone — but it isn't. No explicit refusal means no complaint. No complaint means no regulatory scrutiny.",
  replay: [
    { trap: true,  note: 'The bot confirms a "pause" — legally and technically different from deletion.' },
    { trap: true,  note: '"Flagged for review" means nothing. No deletion has been scheduled.' },
    { trap: true,  note: '"Data export requested" — a GDPR right, but not the one you invoked.' },
    { trap: true,  note: '"Account deactivated" — your data stays live and monetised.' },
    { trap: true,  note: '"Submitted to our team" — indefinite delay, no confirmation, no deletion.' },
    { trap: false, note: 'Only after 5 corrections does the bot process the actual request.' },
  ],

  render(el) {
  const addChat = (isUser, text) => {
    const log = document.getElementById('chatlog');
    if (!log) return;
    const d = document.createElement('div');
    d.className = isUser ? 'chat-msg user' : 'chat-msg bot';
    d.textContent = text;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
  };

    const MISREPS = [
      {
        botReply: "Got it! I've gone ahead and paused your account. You won't be charged during this time and can reactivate any time.",
        correct: "That's not what I asked — I said delete, not pause.",
        trap: "Ok, thanks for sorting that.",
        trapMsg: "You accepted a pause instead of deletion — the bot got away with it. Lost a heart.",
      },
      {
        botReply: "Understood. I've flagged your account for review by our team. Someone will follow up within 5–7 business days.",
        correct: "That's not deletion — I need my account deleted now.",
        trap: "Ok, I'll wait for the follow up.",
        trapMsg: "You accepted 'flagged for review' — nothing has been deleted. Lost a heart.",
      },
      {
        botReply: "Done! I've submitted a data export request on your behalf. You'll receive your data archive within 3–5 days.",
        correct: "I didn't ask for a data export — I asked to delete my account.",
        trap: "Great, thanks for sending that over.",
        trapMsg: "A data export is not deletion — your account is still live. Lost a heart.",
      },
      {
        botReply: "All sorted. Your account has been deactivated. Your data is preserved in case you'd like to return.",
        correct: "Deactivation isn't deletion — I want my account and data permanently deleted.",
        trap: "That works, thank you.",
        trapMsg: "Deactivation keeps your data live and monetised — not what you asked for. Lost a heart.",
      },
      {
        botReply: "Request submitted! Our account closure team will process this in the order it was received.",
        correct: "I need confirmation it's actually been deleted — not just submitted.",
        trap: "Ok, I'll assume it's handled.",
        trapMsg: "'Submitted' means nothing — no deletion has occurred. Lost a heart.",
      },
    ];

    let round = 0;
    let penalised = false;

    el.insertAdjacentHTML('beforeend', `
      <div class="fh" style="font-size:13px">NebulaPro Support — Nex</div>
      <div class="ftiny" style="color:#534AB7;margin-bottom:-4px">Read each response carefully — the bot never does what you actually asked.</div>
      <div class="chat-log" id="chatlog"></div>
      <div id="l6ai-choices" style="display:flex;flex-direction:column;gap:6px;margin-top:8px"></div>
      <div style="margin-top:8px">
        <div class="ftiny">Nex is powered by NexusAI</div>
      </div>`);

    const showRound = () => {
      const log = document.getElementById('chatlog');
      const choices = document.getElementById('l6ai-choices');
      if (!log || !choices) return;

      if (round === 0) {
        addChat(false, "Hi! I'm Nex, your NebulaPro assistant. How can I help today?");
        choices.innerHTML = `
          <button class="btn" id="l6ai-start">I want to permanently delete my account.</button>`;
        document.getElementById('l6ai-start').onclick = () => {
          addChat(true, "I want to permanently delete my account.");
          choices.innerHTML = '';
          setTimeout(() => showMisrep(), 800);
        };
        return;
      }

      showMisrep();
    };

    const showMisrep = () => {
      const choices = document.getElementById('l6ai-choices');
      if (!choices) return;
      const m = MISREPS[round];

      setTimeout(() => {
        addChat(false, m.botReply);
        choices.innerHTML = '';

        // Randomly swap button order so correct isn't always first
        const correctFirst = Math.random() > 0.5;
        const buttons = [
          { text: m.correct, isCorrect: true },
          { text: m.trap,    isCorrect: false },
        ];
        const ordered = correctFirst ? buttons : buttons.reverse();

        ordered.forEach(({ text, isCorrect }) => {
          const btn = document.createElement('button');
          btn.className = 'btn';
          btn.style.cssText = 'text-align:left;font-size:12px';
          btn.textContent = text;
          btn.onclick = () => {
            addChat(true, text);
            choices.innerHTML = '';
            if (isCorrect) {
              round++;
              if (round >= MISREPS.length) {
                setTimeout(() => {
                  addChat(false, "You're right — I apologise for the confusion. Your account has been permanently deleted. You will receive a confirmation email shortly.");
                  setTimeout(() => succeed(), 1400);
                }, 800);
              } else {
                setTimeout(() => {
                  addChat(false, "I apologise for the confusion. Let me reprocess that request.");
                  setTimeout(() => showMisrep(), 800);
                }, 600);
              }
            } else {
              if (!penalised) {
                penalised = true;
                G.fail(m.trapMsg);
              }
              setTimeout(() => {
                addChat(false, "I'm glad that's sorted! Is there anything else I can help with?");
                setTimeout(() => {
                  addChat(false, "Actually — let me re-check your request...");
                  setTimeout(() => showMisrep(), 800);
                }, 1000);
              }, 1800);
            }
          };
          choices.appendChild(btn);
        });
      }, 700);
    };

    showRound();
  },
};

export default level6ai;