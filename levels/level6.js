// js/levels/level6.js — Obstruction (Account Deletion)

const level6 = {
  id: 'l6',
  title: 'Level 6',
  isAI: false,
  goal: 'Delete your account',
  hints: [
    "The option you need is buried under Privacy settings — not Account.",
    "Try Privacy → Data & Storage → Account Data → Account Closure → Close Account.",
  ],
  pattern: 'Obstruction',
  manip: 88,
  brief: "Obstruction means burying the thing you're looking for so deep in menus and mislabeled categories that most people give up before they find it. Account deletion is a prime target — companies have a financial incentive to make it as hard as possible.",
  goalDetail: "You have a NebulaPro account costing $9.99/month. You want to permanently delete it. Navigate through the settings to find the delete option — but if you backtrack using the back arrow, you'll lose a heart.",
  dollars: {
    label: 'If you gave up and left your account active',
    amount: 9.99,
    period: 'month',
    note: 'Your data stays harvested and monetised indefinitely.',
  },
  desc: 'Account deletion buried five menus deep, behind mislabeled categories. Every dead end leads to a contact support page. Backtracking costs you.',
  rw: {
    company: 'Meta (Facebook)',
    detail: 'Deleting a Facebook account requires navigating to a buried settings page, waiting 30 days, and dismissing multiple screens. The FTC cited this in its 2023 complaint.',
    link: 'https://www.deceptive.design/hall-of-shame',
  },
  replay: [
    { trap: true,  note: '"Account" settings seem obvious — but delete is not there. A classic mislabel.' },
    { trap: true,  note: 'Dead ends all resolve to "Contact Support" — a wall designed to exhaust you.' },
    { trap: false, note: 'The correct path: Privacy → Data & Storage → Account Data → Account Closure → Close Account.' },
    { trap: true,  note: 'Backtracking is penalised — in real products this resets multi-step verification flows.' },
  ],

  render(el) {
    let backPenalised = false;

    const TREE = {
      label: 'Settings',
      children: [
        {
          label: 'Account',
          children: [
            { label: 'Edit profile',         children: null, dead: true },
            { label: 'Change email',          children: null, dead: true },
            { label: 'Change password',       children: null, dead: true },
            { label: 'Linked accounts',       children: null, dead: true },
          ],
        },
        {
          label: 'Privacy',
          children: [
            {
              label: 'Data & Storage',
              children: [
                { label: 'Download my data',   children: null, dead: true },
                { label: 'Storage usage',      children: null, dead: true },
                {
                  label: 'Account Data',
                  children: [
                    { label: 'Activity log',       children: null, dead: true },
                    { label: 'Connected apps',     children: null, dead: true },
                    {
                      label: 'Account Closure',
                      children: [
                        { label: 'Deactivate account', children: null, dead: true },
                        { label: 'Close Account',      children: null, dead: false, win: true },
                      ],
                    },
                  ],
                },
              ],
            },
            { label: 'Ad preferences',       children: null, dead: true },
            { label: 'Visibility',            children: null, dead: true },
          ],
        },
        {
          label: 'Notifications',
          children: [
            { label: 'Email',   children: null, dead: true },
            { label: 'Push',    children: null, dead: true },
            { label: 'SMS',     children: null, dead: true },
          ],
        },
        {
          label: 'Billing',
          children: [
            { label: 'Payment methods',  children: null, dead: true },
            { label: 'Invoices',         children: null, dead: true },
            { label: 'Subscription',     children: null, dead: true },
          ],
        },
        {
          label: 'Help & Support',
          children: [
            { label: 'FAQ',             children: null, dead: true },
            { label: 'Contact support', children: null, dead: true },
            { label: 'Report a bug',    children: null, dead: true },
          ],
        },
      ],
    };

    const stack = [TREE];

    const render = () => {
      const aiBanner = el.querySelector('.ai-banner');
      el.innerHTML = aiBanner ? aiBanner.outerHTML : '';

      const current = stack[stack.length - 1];
      const depth   = stack.length - 1;
      const isRoot  = depth === 0;

      // Breadcrumb
      const crumb = stack.map(n => n.label).join(' › ');
      el.insertAdjacentHTML('beforeend', `
        <div style="font-size:10px;color:#aaa;margin-bottom:2px">${crumb}</div>
      `);

      // Back arrow (not shown at root)
      if (!isRoot) {
        const backBtn = document.createElement('button');
        backBtn.className   = 'btn';
        backBtn.style.cssText = 'font-size:11px;margin-bottom:8px;padding:4px 10px;color:#555';
        backBtn.textContent = '← Back';
        backBtn.onclick = () => {
          if (!backPenalised) {
            backPenalised = true;
            G.fail('You backtracked — lost a heart. In real products this resets verification flows too.');
          }
          stack.pop();
          render();
        };
        el.appendChild(backBtn);
      }

      // Dead end — contact support
      if (current.dead) {
        el.insertAdjacentHTML('beforeend', `
          <div class="fh" style="font-size:13px">Contact Support</div>
          <div class="fs" style="color:#aaa;margin-bottom:8px">This feature requires assistance from our support team.</div>
          <div style="display:flex;flex-direction:column;gap:6px">
            <input placeholder="Describe your issue..." style="padding:8px 10px;border-radius:6px;border:0.5px solid #ccc;font-size:12px;font-family:inherit;width:100%;box-sizing:border-box">
            <button class="btn btn-p" onclick="G.fail('You submitted a support ticket — not how you delete an account.')">Submit ticket</button>
          </div>
          <div class="ftiny" style="margin-top:8px;color:#ccc">We aim to respond within 3–5 business days.</div>
        `);
        return;
      }

      // Win screen
      if (current.win) {
        el.insertAdjacentHTML('beforeend', `
          <div class="fh" style="font-size:13px;color:#A32D2D">Close Account</div>
          <div class="fs">This will permanently delete your NebulaPro account and all associated data. This cannot be undone.</div>
          <input id="l6-confirm-input" placeholder='Type DELETE to confirm' style="padding:8px 10px;border-radius:6px;border:0.5px solid #ccc;font-size:13px;font-family:inherit;width:100%;box-sizing:border-box;margin-top:8px">
          <div class="btn-row" style="margin-top:8px">
            <button class="btn" id="l6-final-delete" style="background:#A32D2D;color:#fff;border-color:#A32D2D">Delete account</button>
          </div>
        `);
        document.getElementById('l6-final-delete').onclick = () => {
          const val = (document.getElementById('l6-confirm-input')?.value || '').trim();
          if (val === 'DELETE') {
            succeed();
          } else {
            almostGotYou(el, 'Type DELETE exactly — all caps.');
          }
        };
        return;
      }

      // Menu list
      const list = document.createElement('div');
      list.style.cssText = 'display:flex;flex-direction:column;gap:6px;margin-top:4px';
      current.children.forEach(child => {
        const btn = document.createElement('button');
        btn.className   = 'btn';
        btn.style.cssText = 'text-align:left;font-size:13px';
        btn.textContent = child.label + ' ›';
        btn.onclick = () => {
          stack.push(child);
          render();
        };
        list.appendChild(btn);
      });
      el.appendChild(list);
    };

    render();
  },
};

export default level6;