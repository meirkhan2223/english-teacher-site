'use strict';
/* ============ Bunker: The Last Code — presentation & game ============ */

/* ---- MISSIONS: edit the task texts here ---- */
const MISSIONS = [
  { title: 'Mirror Code', vis: 'mirror',
    task: 'Use the mirror to read the secret message. Tell your team what you see. Write the sentence correctly on your answer sheet.',
    secret: 'WHILE THE TEAM WAS SEARCHING THE BUNKER THE GUARD WAS WATCHING THEM FROM THE CONTROL ROOM' },
  { title: 'Cup Sentences', vis: 'cups',
    task: 'Read the sentences on the cups. Match each English sentence with its Kazakh translation. Put the translation next to the correct cup. Write your answers on the answer sheet.' },
  { title: 'Spiral Text', vis: 'spiral',
    task: 'One player listens to the text through headphones and reads it aloud. The other players listen and fill in the missing Past Simple verbs. Work together and complete the text.',
    /* verbs in [brackets] are hidden on the board until the teacher reveals them */
    text: '1. Yesterday, Team Alpha [entered] the bunker. 2. It [was raining] outside. 3. The team [was looking] for the secret code. 4. Suddenly, they [heard] a loud noise. 5. While Mia [was checking] the map, Tom [found] a key. 6. The lights [were flickering] when the alarm [started]. 7. The guard [was watching] the team from the control room. 8. The students [opened] a small box. 9. While they [were reading] the note, the door [closed]. 10. They [found] the code and [escaped] safely.' },
  { title: 'Grammar Fight', vis: 'quiz',
    task: 'Choose the correct answer for each question. Write the number and the letter on your answer sheet. Be quick and accurate!' },
  { title: 'Captain’s Speech', vis: 'speech',
    task: 'Each captain must defend their team. Say at least three Past Simple sentences. Explain why your team should stay in the bunker.' }
];

/* Mission 4 questions: a = index of the correct option (0 = A, 1 = B, 2 = C) */
const GRAMMAR_FIGHT = [
  { q: 'Yesterday, the team _ the bunker.', kz: 'Кеше топ бункерге кірді.', o: ['enter', 'entered', 'was entering'], a: 1 },
  { q: 'The guard _ the team when the lights went out.', kz: 'Жарық сөнгенде күзетші топты бақылап тұрды.', o: ['watched', 'was watching', 'watch'], a: 1 },
  { q: 'The students _ the secret key near the door.', kz: 'Оқушылар есіктің жанынан құпия кілтті тапты.', o: ['found', 'were finding', 'find'], a: 0 },
  { q: 'They _ TV when the lights went out.', kz: 'Жарық сөнгенде олар теледидар көріп отырды.', o: ['watched', 'were watching', 'watch'], a: 1 },
  { q: 'What _ you doing when the alarm rang?', kz: 'Дабыл соғылғанда сен не істеп жаттың?', o: ['was', 'were', 'did'], a: 1 },
  { q: 'At midnight, the bunker door _ suddenly.', kz: 'Түн ортасында бункердің есігі кенет ашылды.', o: ['opened', 'was opening', 'open'], a: 0 },
  { q: 'We _ for the code when we heard a strange noise.', kz: 'Біртүрлі дыбыс естігенде, біз кодты іздеп жүрдік.', o: ['looked', 'were looking', 'look'], a: 1 },
  { q: 'The captain _ the note and read it aloud.', kz: 'Капитан жазбаны алып, дауыстап оқыды.', o: ['took', 'was taking', 'takes'], a: 0 },
  { q: 'At 8 o’clock, the agents _ inside the bunker.', kz: 'Сағат 8-де агенттер бункердің ішінде ұйықтап жатқан.', o: ['slept', 'were sleeping', 'sleep'], a: 1 },
  { q: 'Choose the correct sentence.', kz: 'Дұрыс сөйлемді таңда.', o: ['They were running when the door closed.', 'They was running when the door closed.', 'They running when the door closed.'], a: 0 }
];

/* ---- mission graphics ---- */
const VIS = {
  mirror: m => `<div class="bkv-mirror">
      <div class="bkv-flip">
        <div class="bkv-face front"><small>// SECRET MESSAGE · USE THE MIRROR</small><p class="flipped">${esc(m.secret)}</p><i class="bkv-shine"></i></div>
        <div class="bkv-face back"><small>// DECODED</small><p>${esc(m.secret)}</p></div>
      </div>
      <div class="bkv-glass" aria-hidden="true"><i></i></div>
    </div>
    <button class="bk-btn sm bkv-teach" data-reveal>Reveal answer</button>`,

  cups: () => {
    const pos = [[78, 120], [184, 96], [290, 124], [396, 98], [500, 122], [96, 286], [204, 262], [312, 290], [418, 264], [516, 288]];
    const cup = ([x, y], i) => `<g transform="translate(${x} ${y})"><g class="bkv-cup" style="--d:${i}">
        <ellipse cx="0" cy="86" rx="50" ry="13" fill="none" stroke="#ffe14d" stroke-width="5" opacity=".85"/>
        <ellipse cx="0" cy="84" rx="34" ry="8" fill="#000" opacity=".35"/>
        <path d="M-38 -10 L-27 82 Q0 92 27 82 L38 -10 Z" fill="url(#cupG)"/>
        <path d="M-38 -10 L-27 82 Q-20 85 -14 86 L-22 -10 Z" fill="#fff" opacity=".18"/>
        <ellipse cx="0" cy="-10" rx="38" ry="11" fill="#ffd6e7"/><ellipse cx="0" cy="-10" rx="32" ry="8" fill="#b0124f"/>
        <rect x="-26" y="22" width="52" height="16" rx="3" fill="#fff" opacity=".9"/>
        <path d="M-20 30 h40" stroke="#7a2a48" stroke-width="2" stroke-dasharray="5 3" opacity=".6"/>
        <circle cx="0" cy="58" r="15" fill="#fff"/><text x="0" y="64" text-anchor="middle">${i + 1}</text>
      </g></g>`;
    return `<svg class="bkv-cups" viewBox="0 0 580 420" aria-hidden="true">
      <defs><linearGradient id="cupG" x1="0" x2="1"><stop offset="0" stop-color="#ff5a9a"/><stop offset=".55" stop-color="#e8236f"/><stop offset="1" stop-color="#a30d4a"/></linearGradient>
        <linearGradient id="paperG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c3326"/><stop offset="1" stop-color="#0d1b13"/></linearGradient></defs>
      <rect x="18" y="20" width="544" height="384" rx="14" fill="url(#paperG)" stroke="rgba(57,255,136,.25)" stroke-dasharray="6 6"/>
      ${pos.map(cup).join('')}
    </svg>
    <div class="bkv-kz k1">аударма?</div><div class="bkv-kz k2">аударма?</div><div class="bkv-kz k3">аударма?</div>
    <div class="bkv-legend"><span>EN</span> sentence on the cup <b>⟶</b> <span class="kz">KZ</span> translation in the ring</div>`;
  },

  spiral: m => {
    const parts = m.text.split(/\[([^\]]+)\]/);
    const len = parts.reduce((s, p) => s + p.length, 0);
    const F = 20, CW = F * .6, GAP = 29, R0 = 66, C = 310;
    let th = -Math.PI / 2, r = R0, L = 0, pts = [];
    let px = C + r * Math.cos(th), py = C + r * Math.sin(th);
    pts.push(`M${px.toFixed(1)} ${py.toFixed(1)}`);
    while (L < len * CW * 1.04 + 40) {
      th += .04; r = R0 + GAP * (th + Math.PI / 2) / (2 * Math.PI);
      const x = C + r * Math.cos(th), y = C + r * Math.sin(th);
      L += Math.hypot(x - px, y - py); px = x; py = y; pts.push(`L${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    const tsp = parts.map((p, i) => i % 2 ? `<tspan class="gap" data-v="${esc(p)}">${'_'.repeat(p.length)}</tspan>` : esc(p)).join('');
    const half = Math.ceil(r + F + 6), vb = `${C - half} ${C - half} ${half * 2} ${half * 2}`;
    return `<svg class="bkv-spiral" viewBox="${vb}" aria-hidden="true">
      <defs><path id="bkSpiralPath" d="${pts.join('')}"/></defs>
      <g class="bkv-sp-rot">
        <use href="#bkSpiralPath" fill="none" stroke="rgba(57,255,136,.08)" stroke-width="${GAP - 4}"/>
        <text font-size="${F}"><textPath href="#bkSpiralPath">${tsp}</textPath></text>
      </g>
      <circle class="bkv-ring r1" cx="${C}" cy="${C}" r="44"/><circle class="bkv-ring r2" cx="${C}" cy="${C}" r="44"/>
      <circle cx="${C}" cy="${C}" r="44" fill="url(#sunG)"/>
      <defs><radialGradient id="sunG" cx="40%" cy="35%"><stop offset="0" stop-color="#ffe6a3"/><stop offset="1" stop-color="#f5a623"/></radialGradient></defs>
      <g transform="translate(${C - 20} ${C - 20}) scale(1.66)" fill="none" stroke="#3a2200" stroke-width="2.2" stroke-linecap="round">
        <path d="M3 15v-3a9 9 0 0 1 18 0v3"/><rect x="2" y="14" width="5" height="7" rx="2" fill="#3a2200"/><rect x="17" y="14" width="5" height="7" rx="2" fill="#3a2200"/></g>
    </svg>
    <button class="bk-btn sm bkv-teach" data-reveal>Show verbs</button>`;
  },

  quiz: () => `<div class="bkq">
      <div class="bkq-pips">${GRAMMAR_FIGHT.map((_, i) => `<button data-q="${i}">${i + 1}</button>`).join('')}</div>
      <div class="bkq-stage"><div class="bkq-card"></div></div>
      <div class="bkq-nav">
        <button class="bk-btn sm" data-qstep="-1" aria-label="Previous question">${I('left')}</button>
        <span class="bkq-count"></span>
        <button class="bk-btn sm" data-qstep="1" aria-label="Next question">${I('arrow')}</button>
        <button class="bk-btn sm bkv-teach static" data-reveal>Show answers</button>
      </div>
    </div>`,

  speech: () => `<div class="bks">
      <div class="bks-stage">
        <div class="bks-eq l">${'<i></i>'.repeat(7)}</div>
        <svg class="bks-mic" viewBox="0 0 120 170" aria-hidden="true">
          <defs><linearGradient id="micG" x1="0" x2="1"><stop offset="0" stop-color="#9aa4ae"/><stop offset=".45" stop-color="#eef2f5"/><stop offset="1" stop-color="#59626c"/></linearGradient></defs>
          <rect x="34" y="6" width="52" height="84" rx="26" fill="url(#micG)" stroke="#2b3138" stroke-width="3"/>
          ${[22, 34, 46, 58, 70].map(y => `<path d="M40 ${y}h40" stroke="#4b545d" stroke-width="2.4" opacity=".55"/>`).join('')}
          <path d="M20 62a40 40 0 0 0 80 0" fill="none" stroke="#c9d0d7" stroke-width="6" stroke-linecap="round"/>
          <path d="M60 102v34M36 150h48" stroke="#c9d0d7" stroke-width="7" stroke-linecap="round"/>
          <circle class="bks-rec" cx="60" cy="118" r="5"/>
        </svg>
        <div class="bks-eq r">${'<i></i>'.repeat(7)}</div>
        <div class="bks-time"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44"/><circle class="bks-arc" cx="50" cy="50" r="44" pathLength="100"/></svg><b>1:00</b><small>SPEECH</small></div>
      </div>
      <div class="bks-teams">${[0, 1].map(t => `<button class="bks-go" data-cap="${t}" data-t="${t}"><span class="bkm-badge">${t ? 'B' : 'A'}</span><span class="bkm-name"></span><em>▶ 60s</em></button>`).join('')}</div>
      <div class="bks-tips"><span>Yesterday we…</span><span>We worked together and…</span><span>We found…</span><span>We never gave up!</span></div>
    </div>`
};

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

/* ---- bunker soundtrack: generated live with WebAudio (no files needed) ---- */
function bunkerMusic() {
  const AC = window.AudioContext || window.webkitAudioContext;
  let ctx = null, master, duck, comp, delay, fb, noiseBuf, iv = 0, step = 0, nextT = 0, playing = false;
  const BPM = 96, S16 = 60 / BPM / 4, VOL = .32;
  const hz = n => 440 * Math.pow(2, (n - 69) / 12);
  /* A minor: Am – F – G – Em, one chord per bar */
  const ROOT = [33, 29, 31, 28], CH = [[57, 60, 64, 69], [53, 57, 60, 65], [55, 59, 62, 67], [52, 55, 59, 64]];
  const ARP = [0, 1, 2, 3, 2, 1, 0, 2, 1, 3, 2, 0, 3, 1, 2, 3];
  const init = () => {
    ctx = new AC();
    comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 4;
    master = ctx.createGain(); master.gain.value = 0; duck = ctx.createGain(); duck.gain.value = 1;
    master.connect(duck).connect(comp).connect(ctx.destination);
    delay = ctx.createDelay(1); delay.delayTime.value = S16 * 3; fb = ctx.createGain(); fb.gain.value = .38;
    const dl = ctx.createBiquadFilter(); dl.type = 'lowpass'; dl.frequency.value = 2200;
    delay.connect(dl).connect(fb).connect(delay); dl.connect(master);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    /* drone pad */
    const pf = ctx.createBiquadFilter(); pf.type = 'lowpass'; pf.frequency.value = 380; pf.Q.value = 6;
    const pg = ctx.createGain(); pg.gain.value = .16; pf.connect(pg).connect(master);
    [[45, -9], [45, 8], [52, 4], [33, 0]].forEach(([n, det]) => { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = hz(n); o.detune.value = det; o.connect(pf); o.start(); });
    const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = .07; lg.gain.value = 260; lfo.connect(lg).connect(pf.frequency); lfo.start();
  };
  const env = (g, t, a, peak, dec) => { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec); };
  const voice = (type, f, t, peak, dec, cut, dest = master, a = .005) => {
    const o = ctx.createOscillator(), g = ctx.createGain(), fl = ctx.createBiquadFilter();
    o.type = type; o.frequency.value = f; fl.type = 'lowpass'; fl.frequency.setValueAtTime(cut, t); fl.frequency.exponentialRampToValueAtTime(Math.max(120, cut / 5), t + dec);
    env(g, t, a, peak, dec); o.connect(fl).connect(g).connect(dest); o.start(t); o.stop(t + a + dec + .05);
  };
  const kick = t => {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(38, t + .18);
    env(g, t, .004, .9, .32); o.connect(g).connect(master); o.start(t); o.stop(t + .4);
  };
  const hat = (t, v) => {
    const n = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    n.buffer = noiseBuf; f.type = 'highpass'; f.frequency.value = 7500; env(g, t, .002, v, .045);
    n.connect(f).connect(g).connect(master); n.start(t, Math.random() * .5); n.stop(t + .08);
  };
  const ping = t => { voice('sine', 1760, t, .12, 1.4, 6000, delay); voice('sine', 1760, t, .07, 1.2, 6000); };
  const tick = () => {
    while (nextT < ctx.currentTime + .15) {
      const t = nextT, s = step % 16, bar = Math.floor(step / 16), c = bar % 4, sec = Math.floor(bar / 4) % 4;
      if (s === 0 || s === 8 || (sec >= 2 && s === 11)) kick(t);
      if (sec >= 1) hat(t, s % 4 === 2 ? .09 : .035);
      if (s % 2 === 0) voice('sawtooth', hz(ROOT[c] + (s === 6 || s === 14 ? 12 : 0)), t, .3, S16 * 1.8, 900);
      if (sec === 1 || sec === 3) voice('square', hz(CH[c][ARP[s]] + 12), t, .045, S16 * 1.6, 3200, s % 4 === 0 ? delay : master);
      if (sec === 2 && s % 8 === 4) voice('triangle', hz(CH[c][3] + 12), t, .08, S16 * 6, 2400, delay, .04);
      if (s === 0 && bar % 8 === 7) ping(t);
      nextT += S16; step++;
    }
  };
  return {
    get on() { return playing; },
    start() {
      if (!AC) return; if (!ctx) init();
      ctx.resume(); if (playing) return; playing = true;
      nextT = ctx.currentTime + .1; step = 0; clearInterval(iv); iv = setInterval(tick, 25);
      master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setTargetAtTime(VOL, ctx.currentTime, .8);
    },
    stop(close = false) {
      if (!ctx) return; playing = false; clearInterval(iv);
      master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setTargetAtTime(0, ctx.currentTime, .25);
      if (close) { const c = ctx; ctx = null; setTimeout(() => c.close(), 900); }
    },
    duck(on) { if (ctx) duck.gain.setTargetAtTime(on ? .3 : 1, ctx.currentTime, .4); }
  };
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
  const missionSlides = MISSIONS.map((m, i) => `<div class="bk-split bk-mission m-${m.vis}">
      <div class="bk-a bk-vis vis-${m.vis}"><span class="bk-photo-tag">M${i + 1}</span>${VIS[m.vis](m)}</div>
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
        <button class="bk-btn bk-music" id="bkMusic" aria-label="Music" title="Music on / off">${I('volume')}<span class="bk-eqm"><i></i><i></i><i></i></span></button>
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
      /* ---- music ---- */
      const music = bunkerMusic(), mBtn = $('#bkMusic', bk);
      let wantMusic = store.get('bunkerMusic', true);
      const paintMusic = () => { mBtn.classList.toggle('on', music.on); mBtn.title = music.on ? 'Music: ON' : 'Music: OFF'; };
      mBtn.onclick = e => { e.stopPropagation(); wantMusic = !music.on; store.set('bunkerMusic', wantMusic); wantMusic ? music.start() : music.stop(); paintMusic(); };
      const firstTouch = () => { if (wantMusic && !music.on) { music.start(); paintMusic(); } };
      bk.addEventListener('pointerdown', firstTouch);
      paintMusic();

      /* ---- mission 4: Grammar Fight quiz ---- */
      const quiz = $('.bkq', bk);
      let qi = 0, qShow = false;
      const blank = (s, ans) => esc(s).replace('_', `<span class="bkq-blank">${qShow && ans ? esc(ans) : ''}</span>`);
      const renderQ = (dir = 0) => {
        const Q = GRAMMAR_FIGHT[qi], c = $('.bkq-card', quiz);
        c.innerHTML = `<span class="bkq-num">QUESTION ${qi + 1}</span>
          <p class="bkq-q">${blank(Q.q, Q.q.includes('_') ? Q.o[Q.a] : '')}</p><p class="bkq-kz">${esc(Q.kz)}</p>
          <div class="bkq-opts">${Q.o.map((o, i) => `<div class="bkq-opt ${qShow ? i === Q.a ? 'ok' : 'no' : ''}" style="--d:${i}"><b>${'ABC'[i]}</b><span>${esc(o)}</span></div>`).join('')}</div>`;
        c.classList.remove('in-l', 'in-r'); void c.offsetWidth; if (dir) c.classList.add(dir > 0 ? 'in-r' : 'in-l');
        $$('.bkq-pips button', quiz).forEach((b, i) => { b.classList.toggle('on', i === qi); b.classList.toggle('seen', i < qi); });
        $('.bkq-count', quiz).textContent = `${qi + 1} / ${GRAMMAR_FIGHT.length}`;
        $('[data-reveal]', quiz).textContent = qShow ? 'Hide answers' : 'Show answers';
        $('.bkq-key', bk)?.remove();
        if (qShow) quiz.insertAdjacentHTML('beforeend', `<div class="bkq-key">${GRAMMAR_FIGHT.map((q, i) => `<span>${i + 1}–${'ABC'[q.a]}</span>`).join('')}</div>`);
      };
      const stepQ = d => { const n = Math.max(0, Math.min(GRAMMAR_FIGHT.length - 1, qi + d)); if (n !== qi) { qi = n; renderQ(d); beep(560 + qi * 30, .05, 'square', .035); } };
      renderQ();

      /* ---- mission 3: spiral gaps ---- */
      const paintSpiral = on => $$('.bkv-spiral .gap', bk).forEach(g => g.textContent = on ? g.dataset.v : '_'.repeat(g.dataset.v.length));

      /* ---- mission 5: speech timer ---- */
      const sp = $('.bks', bk);
      let spIv = 0, spLeft = 60, spWho = null;
      const paintSpeech = () => {
        $('.bks-time b', sp).textContent = `${Math.floor(spLeft / 60)}:${String(spLeft % 60).padStart(2, '0')}`;
        $('.bks-arc', sp).style.strokeDashoffset = 100 - spLeft / 60 * 100;
        sp.classList.toggle('live', spWho != null); music.duck(spWho != null); sp.classList.toggle('low', spWho != null && spLeft <= 10);
        $$('.bks-go', sp).forEach(b => { const on = +b.dataset.cap === spWho; b.classList.toggle('on', on); $('em', b).textContent = on ? '■ STOP' : '▶ 60s'; });
      };
      const stopSpeech = () => { clearInterval(spIv); spIv = 0; spWho = null; spLeft = 60; paintSpeech(); };
      const startSpeech = t => {
        if (spWho === t) return stopSpeech();
        clearInterval(spIv); spWho = t; spLeft = 60; paintSpeech(); beep(880, .1, 'square', .05);
        spIv = setInterval(() => {
          spLeft--; paintSpeech();
          if (spLeft <= 5 && spLeft > 0) beep(700, .06, 'square', .04);
          if (spLeft <= 0) { beep(220, .6, 'sawtooth', .07); toast(`Time! ${st.teams[t].name}’s captain finished the speech`); clearInterval(spIv); spIv = 0; timers.push(setTimeout(stopSpeech, 1200)); }
        }, 1000);
      };
      paintSpeech();

      const hideReveals = () => {
        $$('.bk-vis.revealed', bk).forEach(v => v.classList.remove('revealed'));
        $$('.bkv-mirror ~ [data-reveal]', bk).forEach(b => b.textContent = 'Reveal answer');
        $$('.bkv-spiral ~ [data-reveal]', bk).forEach(b => b.textContent = 'Show verbs');
        paintSpiral(false); if (qShow) { qShow = false; renderQ(); }
      };

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
        hideReveals(); if (spWho != null) stopSpeech();
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
        const rv = e.target.closest('[data-reveal]');
        if (rv) {
          const vis = rv.closest('.bk-vis');
          if (vis.classList.contains("vis-quiz")) { qShow = !qShow; renderQ(); }
          else {
            const on = vis.classList.toggle('revealed');
            if (vis.classList.contains("vis-spiral")) { paintSpiral(on); rv.textContent = on ? 'Hide verbs' : 'Show verbs'; }
            else rv.textContent = on ? 'Hide answer' : 'Reveal answer';
          }
          beep(qShow || vis.classList.contains('revealed') ? 900 : 500, .08, 'square', .04); return;
        }
        const qb = e.target.closest('[data-q]'); if (qb) { const n = +qb.dataset.q; if (n !== qi) { const d = n > qi ? 1 : -1; qi = n; renderQ(d); } return; }
        const qs = e.target.closest('[data-qstep]'); if (qs) return stepQ(+qs.dataset.qstep);
        const cp = e.target.closest('[data-cap]'); if (cp) return startSpeech(+cp.dataset.cap);
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
        firstTouch();
        if (e.key === 'm' || e.key === 'M') return mBtn.click();
        if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(cur + 1); }
        else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(cur - 1); }
        else if (e.key === 'f' || e.key === 'F') fs();
        else if ($('.bkq', els[cur]) && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { e.preventDefault(); stepQ(e.key === 'ArrowDown' ? 1 : -1); }
        else if ($('.bk-keys', els[cur])) {
          if (/^\d$/.test(e.key)) press(e.key);
          else if (e.key === 'Enter') press('OK');
          else if (e.key === 'Backspace') { entry = entry.slice(0, -1); paintEntry(); }
        }
      };
      document.addEventListener('keydown', key);
      go(0);
      return () => {
        document.removeEventListener('keydown', key); clearInterval(clockIv); clearInterval(spIv); music.stop(true); timers.forEach(clearTimeout); token++; demo.stop();
        if (document.fullscreenElement) document.exitFullscreen();
      };
    }
  };
}
