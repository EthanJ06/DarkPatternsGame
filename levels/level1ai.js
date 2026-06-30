const level1ai = {
  id: 'l1ai',
  title: 'Level 1 — Hyper',
  isAI: true,
  goal: 'Cancel before the AI re-engages you',
  hints: [
    "Try typing the word 'cancel' directly.",
    "Keep repeating cancel-related words — the bot has a fixed number of deflections before it gives in.",
  ],
  pattern: 'AI Roach Motel',
  manip: 97,
  brief: "The classic Roach Motel, now run by a chatbot. Instead of screen after screen, you're stuck in a chat loop with an AI that deflects, misunderstands, and manufactures obstacles — running 24/7, never getting frustrated, optimised to exhaust you.",
  goalDetail: "You need to cancel your NebulaPro subscription via customer support chat. Type messages asking to cancel — the bot will try to stop you. Keep pushing. ⚠️ Be careful — if you send two messages in a row without mentioning cancellation, the bot will assume you've moved on and you'll lose a heart.",
  aiIntro: "This bot is designed to deflect. Every time you say 'cancel', it will find a reason to delay. Keep repeating your intent — you'll get through eventually.",
  dollars: {
    label: 'If the bot exhausted you into staying',
    amount: 9.99,
    period: 'month',
    note: '$119.88/year — identical trap, AI-enforced',
  },
  desc: 'The chatbot variant: an AI support agent that deflects, forgets context, manufactures obstacles, and re-engages with fake concern — designed to exhaust you into giving up.',
  rw: {
    company: 'Major US telecoms',
    detail: 'AI chat deflection is now standard practice. Internal studies show customers abandon cancellation after 4+ deflections. The bot is not malfunctioning — it is working exactly as designed.',
    link: 'https://www.deceptive.design/hall-of-shame',
  },
  aiWhy: "AI makes the Roach Motel tireless. A human retention agent can only work a shift — an AI runs 24/7, never gets frustrated, and can be A/B tested to find the deflection script that works best on each personality type. At scale, a 1% improvement in deflection rate can mean millions in retained revenue.",
  replay: [
    { trap: false, note: "Friendly greeting: builds rapport before you've stated your intent." },
    { trap: true,  note: "Verification step: friction. Even if you're already logged in." },
    { trap: true,  note: '"You\'re just getting started!" — manufactured emotional appeal using your account age.' },
    { trap: true,  note: '"Transfer to retention team" — a simulated handoff that just resets the script.' },
    { trap: true,  note: '"Lost your session" — fake technical failure resets your progress and makes you repeat yourself.' },
    { trap: true,  note: '"Unpaid invoice" — manufactured obstacle. Even if false, it creates doubt and delay.' },
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

    const deflects = [
      "I can help with that! First, can you verify your account email?",
      "Thanks! I can see you've been with us 47 days — you're just getting started! Would a pause work instead?",
      "I understand. Before I process this, I need to transfer you to our retention team. Please hold.",
      "I'm sorry, I lost your session context. Can you confirm your reason for cancelling?",
      "Your cancellation has been submitted. You'll hear from us within 5–7 business days.",
    ];

    const hints = [
      "",
      "",
      "Halfway there — keep telling the bot you want to cancel, but say it differently each time.",
      "Almost through — one more time.",
      "",
    ];

    let ri = 0;
    let lastMessage = '';
    let offTopicStreak = 0;
    let penalised = false;

    const confused = [
      "I'm not sure I understood that. Could you rephrase?",
      "Sorry, I didn't quite catch that. Can you elaborate?",
      "I want to make sure I help you correctly — could you say that another way?",
      "Hmm, I'm having trouble understanding. Could you be more specific?",
    ];
    let ci = 0;

    const offTopic = [
      "Let me check on that... still loading.",
      "High volume right now — your request is in the queue.",
      "I want to make sure I get this right — can you clarify what you mean?",
    ];
    let oi = 0;

    el.insertAdjacentHTML('beforeend', `
    <div class="fh" style="font-size:13px">NebulaPro Support — Nex</div>
    <div class="ftiny" style="color:#534AB7;margin-bottom:-4px">Type messages asking to cancel — but the bot won't respond well if you repeat yourself.</div>
    <div class="chat-log" id="chatlog"></div>
    <div class="chat-row">
      <input id="chat-in" placeholder="e.g. I want to cancel my subscription" onkeydown="if(event.key==='Enter')chatSend()">
      <button class="btn btn-ai" style="padding:7px 12px;font-size:12px" onclick="chatSend()">Send</button>
    </div>
    <div style="margin-top:8px">
      <div class="ftiny">Nex is powered by NexusAI</div>
    </div>`);

    addChat(false, "Hi! I'm Nex, your NebulaPro assistant. How can I help today?");

    window.chatSend = function () {
      const input = document.getElementById('chat-in');
      const t = input.value.trim();
      if (!t) return;

      const normalised = t.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

      input.value = '';
      addChat(true, t);

      const isCancel = /cancel|stop|end|quit|unsubscribe|leave|delete|terminate|close/i.test(t);

      setTimeout(() => {
        // Repeated message detection
        if (normalised === lastMessage) {
          addChat(false, confused[ci++ % confused.length]);
          lastMessage = normalised;
          return;
        }

        // Too short — bot doesn't understand
        if (normalised.split(' ').length < 3) {
          addChat(false, confused[ci++ % confused.length]);
          lastMessage = normalised;
          return;
        }

        lastMessage = normalised;

        if (isCancel) {
          offTopicStreak = 0;

          if (ri >= deflects.length - 1) {
            addChat(false, deflects[deflects.length - 1]);
            if (ri === 0) addAch('bot_whisperer');
            setTimeout(() => succeed(), 1200);
            return;
          }
          addChat(false, deflects[ri]);
          if (hints[ri]) addChat(false, '💡 ' + hints[ri]);
          ri++;
        } else {
          offTopicStreak++;
          addChat(false, offTopic[oi++ % offTopic.length]);

          if (offTopicStreak >= 2 && !penalised) {
            penalised = true;
            setTimeout(() => {
              addChat(false, "It looks like your cancellation request may have been resolved. Is there anything else I can help you with?");
              G.fail("You went off-topic twice — the bot assumed you moved on. Lost a heart. Stay focused on cancelling.");
              // Show hint
              const lc = document.getElementById('lc');
              if (lc) {
                document.getElementById('hint-bubble')?.remove();
                const h = document.createElement('div');
                h.id = 'hint-bubble';
                h.style.cssText = 'background:var(--amber-dim);border:1px solid var(--amber);border-radius:8px;padding:8px 12px;font-size:12px;color:var(--amber);line-height:1.5';
                h.innerHTML = `💡 <strong>Hint:</strong> Every message must mention cancellation — don't get drawn into other topics.`;
                lc.prepend(h);
              }
            }, 800);
          }
        }
      }, 700);
    };
  },
};

export default level1ai;