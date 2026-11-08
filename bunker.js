'use strict';
/* ============ Bunker: The Last Code — presentation & game ============ */

/* ---- MISSIONS: edit the task text and photo here ----
   image: put a photo in the "images" folder, e.g. 'images/mission1.jpg' */
const MISSIONS = [1, 2, 3, 4, 5].map(n => ({
  title: `Mission ${n}`,
  task: 'The task for this mission will be added here.',
  image: ''
}));

const randCode = () => String(Math.floor(10000 + Math.random() * 90000));
function getBunker() {
  let s = store.get('bunker', null);
  if (!s || !s.teams || !s.teams.every(t => /^\d{5}$/.test(t.code || ''))) {
    const a = randCode(); let b = randCode(); while (b === a) b = randCode();
    s = { winner: null, teams: [
      { name: 'TEAM ALPHA', code: a, got: [0, 0, 0, 0, 0], opened: 0 },
      { name: 'TEAM BRAVO', code: b, got: [0, 0, 0, 0, 0], opened: 0 }] };
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
  const save = () => store.set('bunker', st);
  const card = (icon, label, value, d, wide = false) => `<div class="bk-card bk-a ${wide ? 'wide' : ''}" style="--d:${d}">
    <span class="bk-card-ic">${I(icon)}</span><div><small>${label}</small><p>${value}</p></div></div>`;
  const dust = Array.from({ length: 26 }, () => `<i style="left:${Math.random() * 100}%;animation-delay:${(-Math.random() * 14).toFixed(1)}s;animation-duration:${(9 + Math.random() * 10).toFixed(1)}s;--s:${(1 + Math.random() * 2.5).toFixed(1)}px"></i>`).join('');
  const photo = (m, n) => m.image
    ? `<img src="${esc(m.image)}" alt="${esc(m.title)}">`
    : `<div class="bk-ph-empty">${I('board')}<b>PHOTO ${n}</b><small>add images/mission${n}.jpg</small></div>`;

  const missionSlides = MISSIONS.map((m, i) => `<div class="bk-split bk-mission">
      <div class="bk-a bk-photo"><span class="bk-photo-tag">M${i + 1}</span>${photo(m, i + 1)}</div>
      <div>
        <span class="bk-kicker bk-a">// MISSION ${i + 1} OF ${MISSIONS.length}</span>
        <h2 class="bk-h bk-a" style="--d:1">${esc(m.title)}</h2>
        <p class="bk-task bk-a" style="--d:2">${esc(m.task)}</p>
        <div class="bk-marks bk-a" style="--d:3">
          <small>MISSION COMPLETE? — CLICK THE TEAM</small>
          ${[0, 1].map(t => `<button class="bk-mark" data-t="${t}" data-m="${i}"><span class="bkm-badge">${t ? 'B' : 'A'}</span>
            <span class="bkm-name"></span><span class="bkm-state"></span></button>`).join('')}
        </div>
      </div>
    </div>`);

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
      <span class="bk-kicker bk-a" style="--d:1">// THE MISSION</span>
      <h2 class="bk-h bk-a" style="--d:2">The bunker door is locked.</h2>
      <p class="bk-type bk-a" style="--d:3">You need a secret code to open it. Work together, think fast and use Past Simple. The first team to complete the final task wins!</p>
      <div class="bk-demo bk-a" style="--d:4" id="bkDemo">
        <div class="bkd-rows">${['A', 'B'].map(t => `<div class="bkd-row t${t}">
          <span class="bkd-badge">${t}</span>
          <div class="bkd-track"><i class="bkd-line"><b class="bkd-fill"></b></i>
            ${[1, 2, 3, 4, 5].map(m => `<span class="bkd-cp" style="left:${m * 16}%"><small>M${m}</small></span>`).join('')}
            <span class="bkd-pop">+1 DIGIT</span>
            <span class="bkd-runner">${I('users')}</span></div>
          <div class="bkd-code">${'<span></span>'.repeat(5)}</div></div>`).join('')}</div>
        <div class="bkd-door"><span class="lk">${I('lock')}</span><span class="ul">${I('unlock')}</span><small>DOOR</small></div>
      </div>
      <div class="bkd-caption bk-a" style="--d:5" id="bkdCap">Two teams start the missions…</div>
      <div class="bk-tags bk-a" style="--d:5"><span>WORK TOGETHER</span><span>THINK FAST</span><span>USE PAST SIMPLE</span></div>
    </div>`,
    ...missionSlides,
    `<div class="bk-pad">
      <span class="bk-kicker bk-a">// CODE TRACKER</span>
      <h2 class="bk-h bk-a" style="--d:1">Your code digits</h2>
      <p class="bk-note bk-a" style="--d:2">Each team has its own secret code. A digit unlocks for every completed mission.</p>
      <div class="bk-teams">${[0, 1].map(t => `<div class="bk-team bk-a" data-t="${t}" style="--d:${t + 3}">
        <div class="bk-team-head"><span class="bk-team-ic">${t ? 'B' : 'A'}</span><b class="bk-tname"></b><span class="bk-tcount"></span></div>
        <div class="bk-slots"></div>
        <div class="bk-bar"><span></span></div>
        <div class="bk-ready">${I('check')} READY FOR THE FINAL TASK</div></div>`).join('')}</div>
    </div>`,
    `<div class="bk-split">
      <div class="bk-a bk-vault-col">${vault('bkFinalVault')}</div>
      <div class="bk-keypad-col">
        <span class="bk-kicker bk-a">// FINAL TASK</span>
        <h2 class="bk-h bk-a" style="--d:1">Enter the secret code</h2>
        <div class="bk-who bk-a" style="--d:2">${[0, 1].map(t => `<button data-who="${t}"><span class="bkm-badge">${t ? 'B' : 'A'}</span><span class="bkm-name"></span></button>`).join('')}</div>
        <div class="bk-display bk-a" id="bkDisplay" style="--d:3">${'<span class="bk-digit"></span>'.repeat(5)}</div>
        <div class="bk-status bk-a" id="bkStatus" style="--d:3">CHOOSE YOUR TEAM, THEN ENTER THE CODE</div>
        <div class="bk-keys bk-a" style="--d:4">${['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'OK'].map(k => `<button class="bk-key ${k === 'OK' ? 'ok' : k === 'C' ? 'clr' : ''}" data-k="${k}">${k}</button>`).join('')}</div>
      </div>
    </div>`,
    `<div class="bk-pad bk-center" id="bkResults">
      <span class="bk-kicker bk-a">// MISSION REPORT</span>
      <h2 class="bk-h bk-a" style="--d:1" id="bkResTitle"></h2>
      <div class="bk-trophy bk-a" style="--d:2">${I('trophy')}</div>
      <div class="bk-res bk-a" style="--d:3">${[0, 1].map(t => `<div class="bk-res-card" data-t="${t}">
        <span class="bk-crown">WINNER</span>
        <div class="bk-team-head"><span class="bk-team-ic">${t ? 'B' : 'A'}</span><b class="bk-tname"></b></div>
        <div class="bk-pips"></div><p class="bk-res-line"></p><p class="bk-res-door"></p></div>`).join('')}</div>
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
        <button class="bk-btn bk-gear" id="bkGear" aria-label="Teacher settings" title="Teacher settings">${I('lock')}</button>
      </div>
      <div class="bk-panel" id="bkPanel">
        <div class="bk-panel-box">
          <h3>${I('lock')} Teacher settings</h3>
          <p>Secret codes are hidden. Open this panel only when students cannot see the screen.</p>
          ${[0, 1].map(t => `<div class="bk-panel-row"><span class="bk-team-ic">${t ? 'B' : 'A'}</span>
            <input class="bkp-name" data-t="${t}" maxlength="18" aria-label="Team name">
            <input class="bkp-code" data-t="${t}" type="password" maxlength="5" inputmode="numeric" aria-label="Secret code"></div>`).join('')}
          <div class="bk-panel-actions">
            <button class="bk-btn sm" id="bkpShow">Show codes</button>
            <button class="bk-btn sm" id="bkpNew">New random codes</button>
            <button class="bk-btn sm danger" id="bkpReset">Reset game</button>
          </div>
          <div class="bk-panel-actions"><button class="bk-btn sm" id="bkpClose">Cancel</button><button class="bk-btn sm ok" id="bkpSave">Save</button></div>
        </div>
      </div>
      <div class="bk-hazard bottom"></div>
      <div class="bk-scan"></div><div class="bk-flash"></div>
    </div>`,
    mount(v) {
      const bk = $('#bk', v), els = $$('.bk-slide', bk);
      let cur = -1, token = 0, entry = '', opened = false, who = null, resetArmed = false;
      const timers = [];

      /* ---- animated rules demo (mission slide) ---- */
      const demo = (() => {
        const box = $('#bkDemo', bk), cap = $('#bkdCap', bk), door = $('.bkd-door', box);
        const DIG = '73914', STOPS = [0, 16, 32, 48, 64, 80, 100], START = 1.8, PERIOD = 13.5, MOVE = .72;
        const teams = $$('.bkd-row', box).map((row, i) => ({
          row, leg: i ? 1.75 : 1.4, name: i ? 'Team B' : 'Team A',
          runner: $('.bkd-runner', row), fill: $('.bkd-fill', row), pop: $('.bkd-pop', row),
          cps: $$('.bkd-cp', row), digits: $$('.bkd-code span', row), shown: -1
        }));
        const ease = x => x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
        let raf = 0, t0 = 0, lastCap = '';
        const setCap = s => { if (s === lastCap) return; lastCap = s; cap.textContent = s; cap.classList.remove('swap'); void cap.offsetWidth; cap.classList.add('swap'); };
        const frame = now => {
          const t = ((now - t0) / 1000) % PERIOD;
          let winner = null;
          const res = teams.map(T => {
            const e = Math.max(0, t - START), leg = Math.floor(e / T.leg);
            let pos = 100, reached = 6, pausing = false;
            if (leg < 6) {
              const k = Math.min(1, (e - leg * T.leg) / (T.leg * MOVE));
              pos = STOPS[leg] + (STOPS[leg + 1] - STOPS[leg]) * ease(k);
              reached = leg + (k >= 1 ? 1 : 0); pausing = k >= 1;
            }
            const done = Math.min(5, reached);
            T.runner.style.left = pos + '%'; T.fill.style.width = pos + '%';
            T.runner.classList.toggle('moving', t > START && !pausing && reached < 6);
            if (done !== T.shown) {
              T.cps.forEach((c, i) => c.classList.toggle('on', i < done));
              T.digits.forEach((d, i) => { d.textContent = i < done ? DIG[i] : ''; d.classList.toggle('on', i < done); });
              T.shown = done;
            }
            const showPop = pausing && reached >= 1 && reached <= 5;
            if (showPop) T.pop.style.left = STOPS[reached] + '%';
            T.pop.classList.toggle('show', showPop);
            if (reached >= 6 && !winner) winner = T;
            return reached;
          });
          teams.forEach(T => T.row.classList.toggle('win', T === winner));
          door.classList.toggle('open', !!winner);
          const a = res[0];
          setCap(t < START ? 'Two teams start the missions…'
            : winner ? `${winner.name} solves the final task and opens the bunker first — they win! 🏆`
            : a === 0 ? 'Complete each mission using the Past Simple'
            : a <= 4 ? `Mission ${a} complete → +1 code digit!`
            : 'All 5 digits collected → now solve the final task!');
          raf = requestAnimationFrame(frame);
        };
        return {
          start() { if (raf) return; t0 = performance.now(); teams.forEach(T => T.shown = -1); lastCap = ''; raf = requestAnimationFrame(frame); },
          stop() { cancelAnimationFrame(raf); raf = 0; }
        };
      })();
      /* ---- keep every slide in sync with the saved game ---- */
      const firstOf = m => { const [a, b] = st.teams.map(t => t.got[m]); return a && (!b || a <= b) ? 0 : b ? 1 : -1; };
      const sync = () => {
        $$('.bkm-name', bk).forEach(el => { const h = el.closest('[data-t],[data-who]'); el.textContent = st.teams[+(h.dataset.t ?? h.dataset.who)].name; });
        $$('.bk-tname', bk).forEach(el => el.textContent = st.teams[+el.closest('[data-t]').dataset.t].name);
        $$('.bk-mark', bk).forEach(b => {
          const t = +b.dataset.t, m = +b.dataset.m, done = !!st.teams[t].got[m];
          b.classList.toggle('on', done);
          $('.bkm-state', b).innerHTML = done ? `${I('check')} DONE${firstOf(m) === t ? ' · 1ST' : ''}` : 'MARK AS DONE';
        });
        st.teams.forEach((team, t) => {
          const box = $(`.bk-team[data-t="${t}"]`, bk), n = team.got.filter(Boolean).length;
          $('.bk-slots', box).innerHTML = team.got.map((g, m) => `<div class="bk-slot ${g ? 'on' : ''}"><small>MISSION ${m + 1}</small><b>${g ? team.code[m] : '?'}</b></div>`).join('');
          $('.bk-bar span', box).style.width = n * 20 + '%';
          $('.bk-tcount', box).textContent = `${n}/5`;
          box.classList.toggle('ready', n === 5);
          const rc = $(`.bk-res-card[data-t="${t}"]`, bk);
          $('.bk-pips', rc).innerHTML = team.got.map(g => `<i class="${g ? 'on' : ''}"></i>`).join('');
          $('.bk-res-line', rc).textContent = `${n} of 5 missions completed`;
          $('.bk-res-door', rc).innerHTML = team.opened ? `${I('unlock')} Opened the door at ${new Date(team.opened).toLocaleTimeString('en-GB')}` : `${I('lock')} Door still locked`;
          rc.classList.toggle('win', st.winner === t);
        });
        const lead = st.teams.map(t => t.got.filter(Boolean).length);
        $('#bkResTitle', bk).textContent = st.winner != null ? `${st.teams[st.winner].name} opened the bunker!`
          : lead[0] === lead[1] ? 'The game is still on…' : `${st.teams[lead[0] > lead[1] ? 0 : 1].name} is in the lead`;
        $('#bkResults', bk).classList.toggle('has-winner', st.winner != null);
        $$('.bk-who button', bk).forEach(b => b.classList.toggle('on', +b.dataset.who === who));
      };

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
        cur = n; els[n].classList.add('active'); sync();
        $$('.bk-dots button', bk).forEach((b, i) => b.classList.toggle('on', i === n));
        $('#bkCount', bk).textContent = `${String(n + 1).padStart(2, '0')} / ${String(els.length).padStart(2, '0')}`;
        $('#bkPrev', bk).disabled = n === 0; $('#bkNext', bk).disabled = n === els.length - 1;
        typeIn(els[n]);
        if ($('#bkDemo', els[n])) demo.start(); else demo.stop();
        if ($('#bkResults', els[n]) && st.winner != null) timers.push(setTimeout(() => { confetti(200); winSound(); }, 900));
      };
      $('#bkPrev', bk).onclick = () => go(cur - 1);
      $('#bkNext', bk).onclick = () => go(cur + 1);
      $('.bk-dots', bk).onclick = e => { const b = e.target.closest('[data-go]'); if (b) go(+b.dataset.go); };
      const fs = () => { if (document.fullscreenElement) document.exitFullscreen(); else (bk.requestFullscreen || bk.webkitRequestFullscreen || (() => {})).call(bk); };
      $('#bkFs', bk).onclick = fs; $('#bkFull', v).onclick = fs;
      const clock = () => { const c = $('#bkClock', bk); if (c) c.textContent = new Date().toLocaleTimeString('en-GB'); };
      clock(); const clockIv = setInterval(clock, 1000);

      /* ---- mark missions ---- */
      $('.bk-slides', bk).addEventListener('click', e => {
        const b = e.target.closest('.bk-mark'); if (!b) return;
        const t = +b.dataset.t, m = +b.dataset.m, team = st.teams[t];
        team.got[m] = team.got[m] ? 0 : Date.now(); save(); sync();
        if (team.got[m]) {
          b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
          beep(660, .08, 'square', .05); beep(990, .12, 'square', .05, .08);
          if (team.got.every(Boolean)) { winSound(); toast(`${team.name} completed all 5 missions! 🔓`, 'ok'); }
        }
      });

      /* ---- teacher panel ---- */
      const panel = $('#bkPanel', bk);
      const openPanel = () => {
        $$('.bkp-name', panel).forEach(i => i.value = st.teams[+i.dataset.t].name);
        $$('.bkp-code', panel).forEach(i => { i.value = st.teams[+i.dataset.t].code; i.type = 'password'; });
        $('#bkpShow', panel).textContent = 'Show codes'; resetArmed = false; $('#bkpReset', panel).textContent = 'Reset game';
        panel.classList.add('open');
      };
      $('#bkGear', bk).onclick = () => panel.classList.contains('open') ? panel.classList.remove('open') : openPanel();
      $('#bkpClose', panel).onclick = () => panel.classList.remove('open');
      $('#bkpShow', panel).onclick = e => {
        const show = $('.bkp-code', panel).type === 'password';
        $$('.bkp-code', panel).forEach(i => i.type = show ? 'text' : 'password'); e.currentTarget.textContent = show ? 'Hide codes' : 'Show codes';
      };
      $('#bkpNew', panel).onclick = () => {
        const a = randCode(); let b = randCode(); while (b === a) b = randCode();
        $$('.bkp-code', panel).forEach(i => i.value = i.dataset.t === '0' ? a : b); toast('New codes generated — press Save');
      };
      $('#bkpSave', panel).onclick = () => {
        const codes = $$('.bkp-code', panel).map(i => i.value.trim());
        if (!codes.every(c => /^\d{5}$/.test(c))) return toast('Each code must be exactly 5 digits', 'err');
        if (codes[0] === codes[1]) return toast('Give the two teams different codes', 'err');
        $$('.bkp-name', panel).forEach(i => st.teams[+i.dataset.t].name = i.value.trim().toUpperCase() || (i.dataset.t === '0' ? 'TEAM ALPHA' : 'TEAM BRAVO'));
        codes.forEach((c, t) => st.teams[t].code = c);
        save(); sync(); panel.classList.remove('open'); toast('Settings saved 🔒', 'ok');
      };
      const closeVault = () => { opened = false; $('#bkFinalVault', bk).classList.remove('open'); entry = ''; paintEntry(); setStatus(who == null ? 'CHOOSE YOUR TEAM, THEN ENTER THE CODE' : 'AWAITING INPUT…', ''); };
      $('#bkpReset', panel).onclick = e => {
        if (!resetArmed) { resetArmed = true; e.currentTarget.textContent = 'Click again to confirm'; return; }
        st.teams.forEach(t => { t.got = [0, 0, 0, 0, 0]; t.opened = 0; }); st.winner = null; save();
        who = null; closeVault(); sync(); panel.classList.remove('open'); toast('Game reset — good luck, teams!');
      };

      /* ---- final keypad ---- */
      const setStatus = (txt, cls) => { const s = $('#bkStatus', bk); s.textContent = txt; s.className = 'bk-status bk-a ' + cls; };
      const paintEntry = () => $$('.bk-digit', bk).forEach((d, i) => { d.textContent = entry[i] || ''; d.classList.toggle('filled', !!entry[i]); });
      $('.bk-who', bk).onclick = e => {
        const b = e.target.closest('[data-who]'); if (!b) return;
        who = +b.dataset.who; if (opened) closeVault(); entry = ''; paintEntry(); sync();
        setStatus(`${st.teams[who].name}: ENTER YOUR CODE`, ''); beep(600, .06, 'square', .04);
      };
      const press = k => {
        if (opened && k !== 'C') return;
        if (k === 'C') { if (opened) return closeVault(); entry = ''; paintEntry(); beep(300, .06, 'square', .04); return; }
        if (who == null) { setStatus('FIRST CHOOSE YOUR TEAM ABOVE', 'warn'); beep(260, .12, 'square', .05); return; }
        if (k === 'OK') {
          if (entry.length < 5) { setStatus('ENTER ALL 5 DIGITS', 'warn'); beep(260, .12, 'square', .05); return; }
          const team = st.teams[who];
          if (entry === team.code) {
            opened = true;
            if (!team.opened) team.opened = Date.now();
            const first = st.winner == null; if (first) st.winner = who;
            save(); sync();
            setStatus(first ? `ACCESS GRANTED — ${team.name} WINS!` : `ACCESS GRANTED — ${team.name} IS IN TOO!`, 'ok'); pulse('granted');
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
        if (e.target.matches('input,textarea') || panel.classList.contains('open')) return;
        if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(cur + 1); }
        else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(cur - 1); }
        else if (e.key === 'f' || e.key === 'F') fs();
        else if ($('.bk-keys', els[cur])) {
          if (/^\d$/.test(e.key)) press(e.key);
          else if (e.key === 'Enter') press('OK');
          else if (e.key === 'Backspace') { entry = entry.slice(0, -1); paintEntry(); }
        }
      };
      document.addEventListener('keydown', key);
      go(0);
      return () => {
        document.removeEventListener('keydown', key); clearInterval(clockIv); timers.forEach(clearTimeout); token++; demo.stop();
        if (document.fullscreenElement) document.exitFullscreen();
      };
    }
  };
}
