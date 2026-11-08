'use strict';
/* ============ Bunker: The Last Code — presentation & game ============ */
function getBunker() {
  let s = store.get('bunker', null);
  if (!s || !/^\d{5}$/.test(s.code)) {
    s = { code: String(Math.floor(10000 + Math.random() * 90000)),
      teams: [{ name: 'TEAM ALPHA', got: [0, 0, 0, 0, 0] }, { name: 'TEAM BRAVO', got: [0, 0, 0, 0, 0] }] };
    store.set('bunker', s);
  }
  return s;
}

function vault(id = '') {
  const bolts = Array.from({ length: 16 }, (_, i) => {
    const a = i / 16 * Math.PI * 2;
    return `<circle cx="${(200 + Math.cos(a) * 152).toFixed(1)}" cy="${(200 + Math.sin(a) * 152).toFixed(1)}" r="6" fill="#7b8590" stroke="#1b1f24" stroke-width="2"/>`;
  }).join('');
  const spokes = [0, 60, 120].map(r => `<g transform="rotate(${r} 200 200)"><rect x="195" y="104" width="10" height="192" rx="5" fill="#a9b2bc"/>
    <circle cx="200" cy="104" r="12" fill="#c9d0d7" stroke="#5a636d" stroke-width="3"/><circle cx="200" cy="296" r="12" fill="#c9d0d7" stroke="#5a636d" stroke-width="3"/></g>`).join('');
  return `<div class="vault" ${id ? `id="${id}"` : ''}>
    <svg class="v-frame" viewBox="0 0 400 400" aria-hidden="true">
      <defs><radialGradient id="vLight"><stop offset="0" stop-color="#f2fff5"/><stop offset=".45" stop-color="#39ff88" stop-opacity=".75"/><stop offset="1" stop-color="#39ff88" stop-opacity="0"/></radialGradient></defs>
      <circle cx="200" cy="200" r="196" fill="#0b0e10" stroke="#2c333b" stroke-width="8"/>
      <circle cx="200" cy="200" r="196" fill="none" stroke="#f5c400" stroke-width="8" stroke-dasharray="18 18" opacity=".55"/>
      <circle cx="200" cy="200" r="178" fill="#020403"/>
      <circle class="v-glow" cx="200" cy="200" r="178" fill="url(#vLight)"/>
    </svg>
    <div class="v-door-wrap"><svg class="v-door" viewBox="0 0 400 400" aria-hidden="true">
      <defs>
        <radialGradient id="vDoor" cx="38%" cy="32%"><stop offset="0" stop-color="#6c7682"/><stop offset=".65" stop-color="#2f363e"/><stop offset="1" stop-color="#171b20"/></radialGradient>
        <radialGradient id="vHub" cx="38%" cy="32%"><stop offset="0" stop-color="#909aa6"/><stop offset="1" stop-color="#363d46"/></radialGradient>
      </defs>
      <circle cx="200" cy="200" r="174" fill="url(#vDoor)" stroke="#646d78" stroke-width="5"/>
      <circle cx="200" cy="200" r="138" fill="none" stroke="#14181c" stroke-width="3" opacity=".7"/>
      ${bolts}
      <circle cx="200" cy="200" r="112" fill="url(#vHub)" stroke="#1d2227" stroke-width="6"/>
      <rect x="16" y="150" width="28" height="100" rx="7" fill="#454d57" stroke="#20252b" stroke-width="3"/>
      <g class="v-wheel">${spokes}<circle cx="200" cy="200" r="32" fill="#d5dbe1" stroke="#5a636d" stroke-width="5"/><circle cx="200" cy="200" r="11" fill="#5a636d"/></g>
      <circle class="v-led" cx="200" cy="56" r="8"/>
    </svg></div>
  </div>`;
}

function viewBunker() {
  const st = getBunker();
  const card = (icon, label, value, d, wide = false) => `<div class="bk-card bk-a ${wide ? 'wide' : ''}" style="--d:${d}">
    <span class="bk-card-ic">${I(icon)}</span><div><small>${label}</small><p>${value}</p></div></div>`;
  const slotHTML = (t, team) => team.got.map((g, m) => `<button class="bk-slot ${g ? 'on' : ''}" data-t="${t}" data-m="${m}">
    <small>MISSION ${m + 1}</small><b>${g ? st.code[m] : '?'}</b></button>`).join('');
  const teamHTML = (team, t) => `<div class="bk-team bk-a ${team.got.every(Boolean) ? 'ready' : ''}" data-t="${t}" style="--d:${t + 3}">
    <div class="bk-team-head"><span class="bk-team-ic">${t ? 'B' : 'A'}</span><input class="bk-tname" data-t="${t}" value="${esc(team.name)}" aria-label="Team name"></div>
    <div class="bk-slots">${slotHTML(t, team)}</div>
    <div class="bk-bar"><span style="width:${team.got.filter(Boolean).length * 20}%"></span></div>
    <div class="bk-ready">${I('check')} READY FOR THE FINAL TASK</div></div>`;
  const dust = Array.from({ length: 26 }, () => `<i style="left:${Math.random() * 100}%;animation-delay:${(-Math.random() * 14).toFixed(1)}s;animation-duration:${(9 + Math.random() * 10).toFixed(1)}s;--s:${(1 + Math.random() * 2.5).toFixed(1)}px"></i>`).join('');

  const slides = [
    `<div class="bk-pad">
      <span class="bk-kicker bk-a">// LESSON BRIEFING · FOR TEACHERS</span>
      <h2 class="bk-h bk-a" style="--d:1">Bunker: The Last Code</h2>
      <div class="bk-stamp">CLASSIFIED</div>
      <div class="bk-cards">
        ${card('users', 'Participants', 'Two teams of 5 students', 2)}
        ${card('timer', 'Duration', '45 minutes', 3)}
        ${card('abc', 'Grammar focus', 'Past Simple', 4)}
        ${card('target', 'Objective', 'To develop students’ use of the Past Simple through short tasks, as well as their teamwork and quick decision-making skills.', 5, true)}
      </div>
    </div>`,
    `<div class="bk-split">
      <div class="bk-a bk-vault-col">${vault()}</div>
      <div>
        <span class="bk-kicker bk-a">// INCOMING TRANSMISSION</span>
        <h1 class="glitch bk-a" data-text="BUNKER: THE LAST CODE" style="--d:1">BUNKER: THE LAST CODE</h1>
        <h3 class="bk-sub bk-a" style="--d:2">Welcome to “Bunker: The Last Code”!</h3>
        <p class="bk-type bk-a" style="--d:3">Two teams will compete to enter the bunker. They must complete five missions, collect five code digits and solve the final task.</p>
        <div class="bk-stats bk-a" style="--d:4"><div><b>2</b><small>TEAMS</small></div><div><b>5</b><small>MISSIONS</small></div><div><b>5</b><small>CODE DIGITS</small></div><div><b>1</b><small>FINAL TASK</small></div></div>
      </div>
    </div>`,
    `<div class="bk-pad bk-center">
      <div class="bk-lock bk-a">${I('lock')}</div>
      <span class="bk-kicker bk-a" style="--d:1">// THE MISSION</span>
      <h2 class="bk-h bk-a" style="--d:2">The bunker door is locked.</h2>
      <p class="bk-type bk-a" style="--d:3">You need a secret code to open it. Work together, think fast and use Past Simple. The first team to complete the final task wins!</p>
      <div class="bk-flow bk-a" style="--d:4">
        <div class="bk-step"><span>${I('gamepad')}</span><b>5 Missions</b></div><i class="bk-pipe"></i>
        <div class="bk-step"><span class="num">#</span><b>5 Code digits</b></div><i class="bk-pipe"></i>
        <div class="bk-step"><span>${I('edit')}</span><b>Final task</b></div><i class="bk-pipe"></i>
        <div class="bk-step win"><span>${I('unlock')}</span><b>Door opens</b></div>
      </div>
      <div class="bk-tags bk-a" style="--d:5"><span>WORK TOGETHER</span><span>THINK FAST</span><span>USE PAST SIMPLE</span></div>
    </div>`,
    `<div class="bk-pad">
      <span class="bk-kicker bk-a">// CODE TRACKER</span>
      <h2 class="bk-h bk-a" style="--d:1">Collect the five code digits</h2>
      <p class="bk-note bk-a" style="--d:2">Click a mission when a team completes it — its code digit unlocks.</p>
      <div class="bk-teams">${st.teams.map(teamHTML).join('')}</div>
      <div class="bk-admin bk-a" style="--d:6">
        <span>${I('lock')} Secret code (teacher only):</span>
        <input id="bkCode" type="password" maxlength="5" inputmode="numeric" value="${st.code}" aria-label="Secret code">
        <button class="bk-btn sm" id="bkShow">Show</button><button class="bk-btn sm" id="bkSave">Save</button><button class="bk-btn sm danger" id="bkReset">Reset game</button>
      </div>
    </div>`,
    `<div class="bk-split">
      <div class="bk-a bk-vault-col">${vault('bkFinalVault')}</div>
      <div class="bk-keypad-col">
        <span class="bk-kicker bk-a">// FINAL TASK</span>
        <h2 class="bk-h bk-a" style="--d:1">Enter the secret code</h2>
        <div class="bk-display bk-a" id="bkDisplay" style="--d:2">${'<span class="bk-digit"></span>'.repeat(5)}</div>
        <div class="bk-status bk-a" id="bkStatus" style="--d:3">AWAITING INPUT…</div>
        <div class="bk-keys bk-a" style="--d:4">${['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'OK'].map(k => `<button class="bk-key ${k === 'OK' ? 'ok' : k === 'C' ? 'clr' : ''}" data-k="${k}">${k}</button>`).join('')}</div>
      </div>
    </div>`
  ];

  return {
    html: `
    <section class="bk-top reveal">
      <div><h1>Bunker: The Last Code</h1><p>Past Simple team game · use ← → to move · press F for full screen</p></div>
      <button class="btn primary" id="bkFull">${I('expand')} Present full screen</button>
    </section>
    <div class="bk reveal" id="bk" style="--i:1">
      <div class="bk-floor"></div><div class="bk-dust">${dust}</div>
      <div class="bk-hazard top"></div>
      <div class="bk-statusbar"><span><i class="bk-beacon"></i>BUNKER-07 // SECURITY SYSTEM ONLINE</span><span id="bkClock"></span></div>
      <div class="bk-slides">${slides.map((s, i) => `<section class="bk-slide" data-s="${i}">${s}</section>`).join('')}</div>
      <div class="bk-hud">
        <button class="bk-btn" id="bkPrev" aria-label="Previous">${I('left')}</button>
        <div class="bk-dots">${slides.map((_, i) => `<button data-go="${i}" aria-label="Slide ${i + 1}"></button>`).join('')}</div>
        <span class="bk-count" id="bkCount"></span>
        <button class="bk-btn" id="bkNext" aria-label="Next">${I('right')}</button>
        <button class="bk-btn" id="bkFs" aria-label="Full screen">${I('expand')}</button>
      </div>
      <div class="bk-hazard bottom"></div>
      <div class="bk-scan"></div><div class="bk-flash"></div>
    </div>`,
    mount(v) {
      const bk = $('#bk', v), els = $$('.bk-slide', bk);
      let cur = -1, token = 0, entry = '', opened = false;
      const timers = [];

      $$('.bk-type', bk).forEach(el => el.dataset.full = el.textContent);
      const typeIn = s => {
        const my = ++token;
        $$('.bk-type', s).forEach(el => {
          const full = el.dataset.full; let i = 0;
          const paint = () => el.innerHTML = `${esc(full.slice(0, i))}<span class="caret"></span><span class="ghost">${esc(full.slice(i))}</span>`;
          paint();
          const step = () => { if (my !== token) { i = full.length; paint(); return; } i++; paint(); if (i < full.length) timers.push(setTimeout(step, 24)); else el.classList.add('done'); };
          el.classList.remove('done'); timers.push(setTimeout(step, 900));
        });
      };
      const pulse = cls => { bk.classList.remove('flash', 'denied', 'granted'); void bk.offsetWidth; bk.classList.add(cls); };
      const go = n => {
        n = Math.max(0, Math.min(els.length - 1, n)); if (n === cur) return;
        if (cur >= 0) {
          const old = els[cur]; old.classList.remove('active'); old.classList.add('leaving', n > cur ? 'to-left' : 'to-right');
          timers.push(setTimeout(() => old.classList.remove('leaving', 'to-left', 'to-right'), 900));
          pulse('flash'); beep(n > cur ? 520 : 440, .07, 'square', .04);
        }
        cur = n; els[n].classList.add('active');
        $$('.bk-dots button', bk).forEach((b, i) => b.classList.toggle('on', i === n));
        $('#bkCount', bk).textContent = `${String(n + 1).padStart(2, '0')} / ${String(els.length).padStart(2, '0')}`;
        $('#bkPrev', bk).disabled = n === 0; $('#bkNext', bk).disabled = n === els.length - 1;
        typeIn(els[n]);
      };
      $('#bkPrev', bk).onclick = () => go(cur - 1);
      $('#bkNext', bk).onclick = () => go(cur + 1);
      $('.bk-dots', bk).onclick = e => { const b = e.target.closest('[data-go]'); if (b) go(+b.dataset.go); };
      const fs = () => { if (document.fullscreenElement) document.exitFullscreen(); else (bk.requestFullscreen || bk.webkitRequestFullscreen || (() => {})).call(bk); };
      $('#bkFs', bk).onclick = fs; $('#bkFull', v).onclick = fs;

      const clock = () => { const c = $('#bkClock', bk); if (c) c.textContent = new Date().toLocaleTimeString('en-GB'); };
      clock(); const clockIv = setInterval(clock, 1000);

      /* ---- tracker ---- */
      const save = () => store.set('bunker', st);
      const redrawTeam = t => {
        const box = $(`.bk-team[data-t="${t}"]`, bk), team = st.teams[t];
        $('.bk-slots', box).innerHTML = slotHTML(t, team);
        $('.bk-bar span', box).style.width = team.got.filter(Boolean).length * 20 + '%';
        box.classList.toggle('ready', team.got.every(Boolean));
      };
      $('.bk-teams', bk).onclick = e => {
        const b = e.target.closest('.bk-slot'); if (!b) return;
        const t = +b.dataset.t, m = +b.dataset.m, team = st.teams[t];
        team.got[m] = team.got[m] ? 0 : 1; save(); redrawTeam(t);
        if (team.got[m]) {
          beep(660, .08, 'square', .05); beep(990, .12, 'square', .05, .08);
          const nb = $(`.bk-team[data-t="${t}"] .bk-slot[data-m="${m}"]`, bk); nb.classList.add('pop');
          if (team.got.every(Boolean)) { winSound(); toast(`${team.name} has all 5 digits! 🔓`, 'ok'); }
        }
      };
      $('.bk-teams', bk).oninput = e => { const i = e.target.closest('.bk-tname'); if (!i) return; st.teams[+i.dataset.t].name = i.value.trim() || 'TEAM'; save(); };
      $('#bkShow', bk).onclick = e => { const i = $('#bkCode', bk); i.type = i.type === 'password' ? 'text' : 'password'; e.currentTarget.textContent = i.type === 'password' ? 'Show' : 'Hide'; };
      $('#bkSave', bk).onclick = () => {
        const val = $('#bkCode', bk).value.trim();
        if (!/^\d{5}$/.test(val)) return toast('The code must be exactly 5 digits', 'err');
        st.code = val; save(); redrawTeam(0); redrawTeam(1); toast('Secret code saved 🔒', 'ok');
      };
      const closeVault = () => { opened = false; $('#bkFinalVault', bk).classList.remove('open'); entry = ''; paintEntry(); setStatus('AWAITING INPUT…', ''); };
      $('#bkReset', bk).onclick = () => { st.teams.forEach(t => t.got = [0, 0, 0, 0, 0]); save(); redrawTeam(0); redrawTeam(1); closeVault(); toast('Game reset — good luck, teams!'); };

      /* ---- final keypad ---- */
      const setStatus = (txt, cls) => { const s = $('#bkStatus', bk); s.textContent = txt; s.className = 'bk-status bk-a ' + cls; };
      const paintEntry = () => $$('.bk-digit', bk).forEach((d, i) => { d.textContent = entry[i] || ''; d.classList.toggle('filled', !!entry[i]); });
      const press = k => {
        if (opened && k !== 'C') return;
        if (k === 'C') { if (opened) return closeVault(); entry = ''; paintEntry(); setStatus('AWAITING INPUT…', ''); beep(300, .06, 'square', .04); return; }
        if (k === 'OK') {
          if (entry.length < 5) { setStatus('ENTER ALL 5 DIGITS', 'warn'); beep(260, .12, 'square', .05); return; }
          if (entry === st.code) {
            opened = true; setStatus('ACCESS GRANTED — THE DOOR IS OPEN!', 'ok'); pulse('granted');
            $('#bkFinalVault', bk).classList.add('open');
            [0, .15, .3, .45].forEach((d, i) => beep(520 + i * 180, .18, 'square', .06, d));
            timers.push(setTimeout(() => { confetti(220); winSound(); }, 1800));
          } else {
            setStatus('ACCESS DENIED — WRONG CODE', 'err'); pulse('denied'); beep(140, .45, 'sawtooth', .08);
            const d = $('#bkDisplay', bk); d.classList.remove('shake'); void d.offsetWidth; d.classList.add('shake');
            timers.push(setTimeout(() => { entry = ''; paintEntry(); }, 900));
          }
          return;
        }
        if (entry.length >= 5) return;
        entry += k; paintEntry(); beep(700 + entry.length * 60, .05, 'square', .04);
        if (entry.length === 5) setStatus('PRESS OK TO UNLOCK', 'warn');
      };
      $('.bk-keys', bk).onclick = e => { const b = e.target.closest('[data-k]'); if (b) press(b.dataset.k); };

      const key = e => {
        if (e.target.matches('input,textarea')) return;
        if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(cur + 1); }
        else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(cur - 1); }
        else if (e.key === 'f' || e.key === 'F') fs();
        else if (cur === els.length - 1) {
          if (/^\d$/.test(e.key)) press(e.key);
          else if (e.key === 'Enter') press('OK');
          else if (e.key === 'Backspace') { entry = entry.slice(0, -1); paintEntry(); }
        }
      };
      document.addEventListener('keydown', key);
      go(0);
      return () => {
        document.removeEventListener('keydown', key); clearInterval(clockIv); timers.forEach(clearTimeout); token++;
        if (document.fullscreenElement) document.exitFullscreen();
      };
    }
  };
}
