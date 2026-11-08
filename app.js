'use strict';
/* ================= Helpers ================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};
const uid = () => Math.random().toString(36).slice(2, 9);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

const ICONS = {
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  users: '<circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-6 7-6s7 2 7 6"/><path d="M16 4a4 4 0 010 8M22 21c0-3-2-5-4-5.5"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/>',
  cards: '<rect x="3" y="7" width="14" height="14" rx="3"/><path d="M7 3h11a3 3 0 013 3v11"/>',
  gamepad: '<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 11v3M5.5 12.5h3"/><circle cx="16" cy="11" r=".8"/><circle cx="18" cy="14" r=".8"/>',
  abc: '<path d="M3 17l4-10 4 10M4.5 13h5"/><path d="M14 7h3.5a2 2 0 010 4H14zM14 11h4a2 2 0 010 4h-4z"/>',
  wheel: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>',
  board: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20l4-4 4 4M7 9l3 3 3-3 4 3"/>',
  cap: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5M22 9v6"/>',
  sparkles: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7z"/>',
  link: '<path d="M10 14a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1"/><path d="M14 10a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/>',
  shuffle: '<path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
  volume: '<path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13"/>',
  left: '<path d="M15 18l-6-6 6-6"/>', right: '<path d="M9 18l6-6-6-6"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>', play: '<path d="M7 4l13 8-13 8z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  check: '<path d="M5 12l5 5 9-10"/>', moon: '<path d="M21 13A9 9 0 1111 3a7 7 0 0010 10z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>', refresh: '<path d="M20 11a8 8 0 10-2.3 5.7M20 4v7h-7"/>',
  mega: '<path d="M3 11v2a2 2 0 002 2h2l6 4V5L7 9H5a2 2 0 00-2 2z"/><path d="M17 8a5 5 0 010 8"/>',
  bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0012 3z"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>', eraser: '<path d="M16 3l5 5-11 11H5l-2-2z"/><path d="M9 9l6 6M10 19h11"/>'
};
const I = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;

/* ================= Data ================= */
const DEFAULT_VOCAB = [
  ['serendipity', 'finding something good by chance', 'Meeting my best friend was pure serendipity.'],
  ['resilient', 'able to recover quickly from difficulties', 'Children are often very resilient.'],
  ['curious', 'eager to know or learn something', 'She is curious about everything around her.'],
  ['brave', 'ready to face danger or pain', 'The brave firefighter saved the cat.'],
  ['journey', 'travelling from one place to another', 'Our journey to Almaty took six hours.'],
  ['generous', 'happy to give more than expected', 'He is very generous with his time.'],
  ['ancient', 'very, very old', 'We visited an ancient castle in Scotland.'],
  ['whisper', 'to speak very quietly', 'She whispered the answer to her friend.'],
  ['delicious', 'having a very pleasant taste', 'This soup is absolutely delicious!'],
  ['explore', 'to travel around a place to learn about it', "Let's explore the forest this weekend."],
  ['honest', 'always telling the truth', 'Always be honest with your friends.'],
  ['library', 'a place where books are kept', 'I borrowed a book from the school library.']
].map(([w, m, e]) => ({ w, m, e }));

const DEFAULT_QUIZ = {
  id: 'q-sample', title: 'Everyday English — A2', questions: [
    { q: 'What time ___ you usually get up?', o: ['do', 'does', 'are', 'is'], a: 0 },
    { q: 'Which word is a fruit?', o: ['carrot', 'banana', 'potato', 'onion'], a: 1 },
    { q: 'The opposite of "hot" is…', o: ['warm', 'cold', 'big', 'fast'], a: 1 },
    { q: '"How are you?" — "___"', o: ["I'm fine, thanks.", "I'm 12.", "I'm from Almaty.", "It's Monday."], a: 0 },
    { q: 'One child, two ___', o: ['childs', 'childrens', 'children', 'childes'], a: 2 }
  ]
};

const GRAMMAR = [
  { id: 'g-present', title: 'Present Simple vs Continuous', level: 'A2', color: 'sun', questions: [
    { q: 'Listen! The baby ___.', o: ['cries', 'is crying', 'cry', 'crying'], a: 1 },
    { q: 'She ___ coffee every morning.', o: ['drinks', 'is drinking', 'drink', 'drinking'], a: 0 },
    { q: 'Look, it ___ outside!', o: ['snows', 'snow', 'is snowing', 'snowed'], a: 2 },
    { q: 'Water ___ at 100°C.', o: ['is boiling', 'boils', 'boil', 'boiled'], a: 1 },
    { q: 'What ___ you ___ right now?', o: ['do / do', 'are / doing', 'does / do', 'is / doing'], a: 1 },
    { q: 'My brother usually ___ to work by bus.', o: ['go', 'is going', 'goes', 'going'], a: 2 }
  ] },
  { id: 'g-past', title: 'Past Simple — Irregular Verbs', level: 'A2', color: 'coral', questions: [
    { q: 'Yesterday I ___ a great film.', o: ['see', 'seen', 'saw', 'seed'], a: 2 },
    { q: 'We ___ to London last summer.', o: ['goed', 'went', 'gone', 'go'], a: 1 },
    { q: 'She ___ a beautiful song at the concert.', o: ['sang', 'sung', 'singed', 'sings'], a: 0 },
    { q: 'They ___ pizza for dinner.', o: ['eated', 'ate', 'eaten', 'eat'], a: 1 },
    { q: 'He ___ his keys this morning.', o: ['losed', 'lose', 'lost', 'losted'], a: 2 },
    { q: 'I ___ a letter to my grandma.', o: ['wrote', 'written', 'writed', 'write'], a: 0 }
  ] },
  { id: 'g-articles', title: 'Articles: a / an / the', level: 'A1', color: 'mint', questions: [
    { q: 'I saw ___ elephant at the zoo.', o: ['a', 'an', 'the', '—'], a: 1 },
    { q: '___ sun is very bright today.', o: ['A', 'An', 'The', '—'], a: 2 },
    { q: 'She is ___ teacher.', o: ['a', 'an', 'the', '—'], a: 0 },
    { q: 'I love ___ music.', o: ['a', 'an', 'the', '—'], a: 3 },
    { q: 'Can you close ___ door, please?', o: ['a', 'an', 'the', '—'], a: 2 },
    { q: 'He wants to be ___ engineer.', o: ['a', 'an', 'the', '—'], a: 1 }
  ] },
  { id: 'g-perfect', title: 'Present Perfect', level: 'B1', color: 'indigo', questions: [
    { q: 'I ___ never ___ to Japan.', o: ['have / been', 'has / been', 'did / go', 'am / going'], a: 0 },
    { q: 'She ___ just ___ her homework.', o: ['have / finished', 'has / finished', 'is / finishing', 'did / finish'], a: 1 },
    { q: '___ you ever ___ sushi?', o: ['Did / eat', 'Have / eaten', 'Has / eaten', 'Do / eat'], a: 1 },
    { q: 'We ___ here since 2020.', o: ['live', 'lived', 'have lived', 'are living'], a: 2 },
    { q: 'They ___ the film yet.', o: ["haven't seen", "didn't see", "don't see", "hasn't seen"], a: 0 }
  ] }
];

const DEFAULT_CLASSES = [
  { id: 'c1', name: '7A', grade: 'Grade 7 · A2', students: 24, progress: 72 },
  { id: 'c2', name: '8B', grade: 'Grade 8 · B1', students: 21, progress: 48 },
  { id: 'c3', name: '9C', grade: 'Grade 9 · B1+', students: 26, progress: 86 }
];
const DEFAULT_NAMES = ['Aruzhan', 'Dias', 'Amina', 'Alikhan', 'Dana', 'Nursultan', 'Aisha', 'Temirlan'];

const TOOLS = [
  { id: 'create', title: 'Quiz Builder', desc: 'Build multiple-choice quizzes in minutes', icon: 'edit', color: 'violet' },
  { id: 'flashcards', title: 'Flashcards', desc: 'Flip, listen and learn new words', icon: 'cards', color: 'sky' },
  { id: 'scramble', title: 'Word Scramble', desc: 'Unscramble the letters to spell the word', icon: 'shuffle', color: 'pink' },
  { id: 'match', title: 'Match Up', desc: 'Pair each word with its meaning', icon: 'link', color: 'mint' },
  { id: 'grammar', title: 'Grammar Practice', desc: 'Tenses, articles and more', icon: 'abc', color: 'sun' },
  { id: 'wheel', title: 'Spin the Wheel', desc: 'Pick a random student fairly', icon: 'wheel', color: 'coral' },
  { id: 'timer', title: 'Class Timer', desc: 'Keep every activity on track', icon: 'timer', color: 'teal' },
  { id: 'board', title: 'Whiteboard', desc: 'Draw and explain on the screen', icon: 'board', color: 'indigo' }
];

const NAV = [
  ['home', 'Dashboard', 'home', 'violet'], ['classes', 'My Classes', 'users', 'sky'], ['create', 'Quiz Builder', 'edit', 'pink'],
  ['flashcards', 'Flashcards', 'cards', 'teal'], ['games', 'Games', 'gamepad', 'mint'], ['grammar', 'Grammar', 'abc', 'sun'],
  ['wheel', 'Spin the Wheel', 'wheel', 'coral'], ['timer', 'Class Timer', 'timer', 'indigo'], ['board', 'Whiteboard', 'board', 'sky'],
  ['courses', 'Courses', 'cap', 'violet']
];

const TIPS = [
  'Start each lesson with a 2-minute warm-up game to wake up the class.',
  'Use the Spin the Wheel tool so every student gets a fair chance to speak.',
  'Let students hear new words — press the speaker icon on any flashcard.',
  'Short quizzes at the end of a lesson help students remember more.',
  'Praise effort, not only correct answers. Mistakes help us learn!'
];

const getVocab = () => store.get('vocab', DEFAULT_VOCAB);
const getQuizzes = () => store.get('quizzes', [DEFAULT_QUIZ]);
const getClasses = () => store.get('classes', DEFAULT_CLASSES);

/* ================= Effects ================= */
function speak(text) {
  if (!('speechSynthesis' in window)) return toast('Speech is not supported in this browser', 'err');
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-GB'; u.rate = .9;
  speechSynthesis.speak(u);
}
function toast(msg, type = '') {
  const t = document.createElement('div');
  t.className = 'toast ' + type; t.textContent = msg;
  $('#toasts').appendChild(t);
  setTimeout(() => t.classList.add('out'), 2600);
  setTimeout(() => t.remove(), 3100);
}
let actx;
function beep(freq = 880, dur = .15, type = 'sine', vol = .12, delay = 0) {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + delay;
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g).connect(actx.destination); o.start(t); o.stop(t + dur);
  } catch (e) {}
}
const winSound = () => { beep(660, .12); beep(880, .12, 'sine', .12, .1); beep(1320, .25, 'sine', .12, .2); };
function confetti(n = 170) {
  const c = $('#confetti'), x = c.getContext('2d'), dpr = devicePixelRatio || 1;
  c.width = innerWidth * dpr; c.height = innerHeight * dpr; x.scale(dpr, dpr);
  const cols = ['#7c5cff', '#22d3ee', '#ff5d8f', '#fbbf24', '#34d399', '#a855f7'];
  const ps = Array.from({ length: n }, () => ({
    x: innerWidth / 2 + (Math.random() - .5) * 240, y: innerHeight * .4,
    vx: (Math.random() - .5) * 16, vy: -Math.random() * 15 - 5, r: Math.random() * 7 + 5,
    c: cols[Math.random() * cols.length | 0], a: Math.random() * 6, va: (Math.random() - .5) * .35
  }));
  let f = 0;
  (function loop() {
    x.clearRect(0, 0, innerWidth, innerHeight);
    ps.forEach(p => {
      p.vy += .34; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.va;
      x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.globalAlpha = Math.max(0, 1 - f / 170);
      x.fillStyle = p.c; x.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); x.restore();
    });
    if (++f < 180) requestAnimationFrame(loop); else x.clearRect(0, 0, innerWidth, innerHeight);
  })();
}
function countUp(root) {
  $$('[data-count]', root).forEach(el => {
    const end = +el.dataset.count, t0 = performance.now(), dur = 1400;
    (function f(t) {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(f);
    })(t0);
  });
}
function bindTilt(root) {
  $$('.tilt', root).forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--rx', ((.5 - y) * 10).toFixed(2) + 'deg');
      el.style.setProperty('--ry', ((x - .5) * 12).toFixed(2) + 'deg');
      el.style.setProperty('--mx', x * 100 + '%'); el.style.setProperty('--my', y * 100 + '%');
    });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
  });
}
function wavePath(y, amp, period, w = 2400, h = 200) {
  let d = `M0 ${y} Q${period / 4} ${y - amp} ${period / 2} ${y}`;
  for (let x = period / 2; x < w; x += period / 2) d += ` T${x + period / 2} ${y}`;
  return d + ` V${h} H0Z`;
}
const waves = () => `<svg class="waves" viewBox="0 0 1200 200" preserveAspectRatio="none" aria-hidden="true">
  <path class="w1" d="${wavePath(100, 38, 600)}"/><path class="w2" d="${wavePath(130, 30, 1200)}"/><path class="w3" d="${wavePath(158, 20, 400)}"/></svg>`;

const pageHead = (title, sub, icon, color) => `<section class="page-head reveal c-${color}">
  <span class="ph-ball"></span><span class="ph-ball s"></span>
  <div class="ph-icon">${I(icon)}</div><div><h1>${title}</h1><p>${sub}</p></div>${waves()}</section>`;

const toolCards = list => list.map((t, i) => `<a href="#${t.id}" class="tool-card tilt reveal c-${t.color}" style="--i:${i}">
  <span class="tc-blob"></span>${t.tag ? `<span class="tag">${t.tag}</span>` : ''}
  <span class="tc-icon">${I(t.icon)}</span><h3>${t.title}</h3><p>${t.desc}</p>
  <span class="tc-go">Open ${I('arrow')}</span></a>`).join('');

const ring = (pct, r = 36, color = '') => {
  const C = 2 * Math.PI * r;
  return `<svg viewBox="0 0 ${2 * r + 12} ${2 * r + 12}"><circle class="ring-bg" cx="${r + 6}" cy="${r + 6}" r="${r}"/>
    <circle class="ring-fg" cx="${r + 6}" cy="${r + 6}" r="${r}" stroke-dasharray="${C}" stroke-dashoffset="${C}" data-off="${C * (1 - pct / 100)}" ${color ? `style="stroke:${color}"` : ''}/></svg>`;
};
const animateRings = root => requestAnimationFrame(() => requestAnimationFrame(() =>
  $$('.ring-fg[data-off]', root).forEach(r => r.style.strokeDashoffset = r.dataset.off)));

/* ================= Views ================= */
function viewHome() {
  const vocab = getVocab(), wod = vocab[new Date().getDate() % vocab.length] || DEFAULT_VOCAB[0];
  const stats = [
    [getClasses().reduce((s, c) => s + (+c.students || 0), 0), 'Students'],
    [getQuizzes().length + GRAMMAR.length, 'Quizzes ready'],
    [vocab.length, 'Words in deck'], [TOOLS.length, 'Teaching tools']
  ];
  const week = [['Mon', 42], ['Tue', 65], ['Wed', 51], ['Thu', 88], ['Fri', 73], ['Sat', 30], ['Sun', 22]];
  return {
    html: `
    <section class="hero">
      <div class="hero-text">
        <span class="pill">${I('sparkles')} English Teacher Studio</span>
        <h1>Make every English lesson <span class="rot" id="rot">fun</span></h1>
        <p>Create quizzes, flashcards and games for your students in seconds — all in one beautiful place.</p>
        <div class="hero-cta">
          <a href="#create" class="btn primary">${I('plus')} Create a quiz</a>
          <a href="#games" class="btn ghost">${I('play')} Play a game</a>
        </div>
      </div>
      <div class="orb-wrap" aria-hidden="true">
        <div class="ring r3"></div><div class="ring r1"></div><div class="ring r2"></div><div class="orb"></div>
        <span class="fl a">Aa</span><span class="fl b">Hello! 👋</span><span class="fl c">ABC</span><span class="fl d">📚</span>
      </div>
      ${waves()}
    </section>
    <section class="stats">${stats.map((s, i) => `<div class="stat glass reveal" style="--i:${i + 1}"><b data-count="${s[0]}">0</b><span>${s[1]}</span></div>`).join('')}</section>
    <section class="block glass reveal" style="--i:2">
      <div class="block-head"><h2>Create a task</h2><p>Tests, word games and interactive activities for your lessons</p></div>
      <div class="tool-grid">${toolCards(TOOLS)}</div>
    </section>
    <section class="two-col">
      <div class="block glass reveal" style="--i:3">
        <div class="block-head"><h2>Word of the day</h2><p>Share it with your class</p></div>
        <div class="wod">
          <div class="wod-word"><h3>${esc(wod.w)}</h3><button class="icon-btn" data-speak="${esc(wod.w)}" aria-label="Listen">${I('volume')}</button></div>
          <p>${esc(wod.m)}</p><em>“${esc(wod.e)}”</em>
          <a href="#flashcards" class="btn ghost sm" style="align-self:flex-start">${I('cards')} Practise all words</a>
        </div>
      </div>
      <div class="block glass reveal" style="--i:4">
        <div class="block-head"><h2>Weekly activity</h2><p>Tasks completed by your students</p></div>
        <div class="chart">${week.map(([l, v], i) => `<div class="bar-col"><div class="bar-wrap"><div class="bar" style="--h:${v}%;--i:${i}"><span>${v}</span></div></div><small>${l}</small></div>`).join('')}</div>
      </div>
    </section>`,
    mount(v) {
      countUp(v);
      const words = ['fun', 'creative', 'interactive', 'memorable', 'exciting'];
      let i = 0; const el = $('#rot', v);
      const t = setInterval(() => {
        el.classList.add('out');
        setTimeout(() => { i = (i + 1) % words.length; el.textContent = words[i]; el.classList.remove('out'); }, 380);
      }, 2600);
      return () => clearInterval(t);
    }
  };
}

function viewClasses() {
  const colors = ['#7c5cff', '#0ea5e9', '#ff4f8b', '#10b981', '#f59e0b', '#4f46e5'];
  return {
    html: `${pageHead('My Classes', 'Keep track of your groups and their progress', 'users', 'sky')}
    <section class="block glass reveal" style="--i:1">
      <div class="block-head row"><div><h2>Your classes</h2><p>Hover a card to remove it</p></div>
        <button class="btn primary" id="addClass">${I('plus')} New class</button></div>
      <form id="classForm" class="inline-form hidden">
        <input name="name" placeholder="Class name (e.g. 10A)" required>
        <input name="grade" placeholder="Grade & level (e.g. Grade 10 · B1)">
        <input name="students" type="number" min="1" max="60" placeholder="Students" required>
        <button class="btn primary">${I('check')} Add</button>
      </form>
      <div id="classGrid" class="class-grid"></div>
    </section>`,
    mount(v) {
      const grid = $('#classGrid', v), form = $('#classForm', v);
      const draw = () => {
        const cs = getClasses();
        grid.innerHTML = cs.map((c, i) => `<div class="class-card tilt reveal" style="--i:${i}">
          <button class="icon-btn del" data-id="${c.id}" aria-label="Delete">${I('trash')}</button>
          <div class="ring-box">${ring(c.progress, 36, colors[i % colors.length])}<b>${c.progress}%</b></div>
          <div><h3>${esc(c.name)}</h3><p>${esc(c.grade)}</p><p>${I('users')} ${c.students} students</p></div></div>`).join('')
          || '<p class="empty">No classes yet — add your first one!</p>';
        bindTilt(grid); animateRings(grid);
      };
      draw();
      $('#addClass', v).onclick = () => { form.classList.toggle('hidden'); form.classList.add('pop-in'); form.name.focus(); };
      form.onsubmit = e => {
        e.preventDefault();
        const cs = getClasses();
        cs.push({ id: uid(), name: form.name.value.trim(), grade: form.grade.value.trim() || 'English', students: +form.students.value, progress: Math.floor(Math.random() * 40) });
        store.set('classes', cs); form.reset(); form.classList.add('hidden'); draw(); toast('Class added ✨', 'ok');
      };
      grid.onclick = e => {
        const b = e.target.closest('.del'); if (!b) return;
        store.set('classes', getClasses().filter(c => c.id !== b.dataset.id)); draw(); toast('Class removed');
      };
    }
  };
}

function viewCreate() {
  const editor = () => {
    const id = uid();
    return `<div class="q-edit pop-in"><div class="q-edit-head"><b>Question <span class="qn"></span></b>
      <button type="button" class="icon-btn del-q" aria-label="Remove">${I('trash')}</button></div>
      <input class="q-text" placeholder="Type the question… e.g. She ___ to school every day.">
      <div class="opts">${[0, 1, 2, 3].map(i => `<div class="opt-edit"><label class="radio-wrap" title="Correct answer">
        <input type="radio" name="c${id}" value="${i}" ${i === 0 ? 'checked' : ''}><span class="radio"></span></label>
        <input class="q-opt" placeholder="Option ${'ABCD'[i]}"></div>`).join('')}</div></div>`;
  };
  return {
    html: `${pageHead('Quiz Builder', 'Create multiple-choice quizzes for your students', 'edit', 'violet')}
    <div class="builder">
      <section class="block glass reveal" style="--i:1">
        <div class="block-head"><h2>New quiz</h2><p>Tick the circle next to the correct answer</p></div>
        <label class="field"><span>Quiz title</span><input id="qTitle" placeholder="e.g. Unit 3 — Food & Drinks"></label>
        <div id="qList" class="q-list"></div>
        <div class="row gap"><button class="btn ghost" id="addQ">${I('plus')} Add question</button>
          <button class="btn primary" id="saveQ">${I('check')} Save quiz</button></div>
      </section>
      <section class="block glass reveal" style="--i:2">
        <div class="block-head"><h2>Your quizzes</h2><p>Open one to play it with your class</p></div>
        <div id="savedList" class="saved-list"></div>
      </section>
    </div>`,
    mount(v) {
      const list = $('#qList', v);
      const renumber = () => $$('.qn', list).forEach((s, i) => s.textContent = i + 1);
      const add = () => { list.insertAdjacentHTML('beforeend', editor()); renumber(); };
      const drawSaved = () => {
        $('#savedList', v).innerHTML = getQuizzes().map((q, i) => `<div class="saved c-violet" style="--i:${i}">
          <span class="tc-icon">${I('edit')}</span><div><b>${esc(q.title)}</b><small>${q.questions.length} questions</small></div>
          <a class="icon-btn" href="#play/${q.id}" aria-label="Play">${I('play')}</a>
          <button class="icon-btn del-quiz" data-id="${q.id}" aria-label="Delete">${I('trash')}</button></div>`).join('')
          || '<p class="empty">No quizzes yet.</p>';
      };
      add(); add(); drawSaved();
      $('#addQ', v).onclick = () => { add(); list.lastElementChild.querySelector('.q-text').focus(); };
      list.onclick = e => {
        const b = e.target.closest('.del-q'); if (!b) return;
        const card = b.closest('.q-edit');
        card.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(.9)' }], { duration: 250, easing: 'ease-in' }).onfinish = () => { card.remove(); renumber(); };
      };
      $('#saveQ', v).onclick = () => {
        const title = $('#qTitle', v).value.trim();
        const questions = $$('.q-edit', list).map(c => ({
          q: $('.q-text', c).value.trim(), o: $$('.q-opt', c).map(i => i.value.trim()), a: +$('input[type=radio]:checked', c).value
        })).filter(q => q.q || q.o.some(Boolean));
        if (!title) { $('#qTitle', v).classList.add('shake'); setTimeout(() => $('#qTitle', v).classList.remove('shake'), 500); return toast('Please add a quiz title', 'err'); }
        if (!questions.length) return toast('Add at least one question', 'err');
        if (questions.some(q => !q.q || q.o.some(o => !o))) return toast('Fill in every question and all 4 options', 'err');
        const qs = getQuizzes(); qs.unshift({ id: 'q-' + uid(), title, questions }); store.set('quizzes', qs);
        $('#qTitle', v).value = ''; list.innerHTML = ''; add(); add(); drawSaved();
        toast('Quiz saved! 🎉', 'ok'); confetti(90); winSound();
      };
      $('#savedList', v).onclick = e => {
        const b = e.target.closest('.del-quiz'); if (!b) return;
        store.set('quizzes', getQuizzes().filter(q => q.id !== b.dataset.id)); drawSaved(); toast('Quiz deleted');
      };
    }
  };
}

function viewPlay(id) {
  const quiz = [...getQuizzes(), ...GRAMMAR].find(q => q.id === id);
  if (!quiz) return { html: `${pageHead('Quiz not found', 'It may have been deleted', 'edit', 'pink')}<a class="btn primary" href="#create">Back to quizzes</a>` };
  const back = id.startsWith('g-') ? '#grammar' : '#create';
  return {
    html: `${pageHead(esc(quiz.title), `${quiz.questions.length} questions · good luck!`, 'play', quiz.color || 'violet')}
      <section class="block glass reveal player" style="--i:1"><div class="progress"><span id="pBar"></span></div><div id="stage"></div></section>`,
    mount(v) {
      let i = 0, score = 0; const qs = quiz.questions, stage = $('#stage', v);
      const result = () => {
        const pct = Math.round(score / qs.length * 100);
        stage.innerHTML = `<div class="result swap-in">
          <div class="ring-box"><svg width="0" height="0" style="position:absolute"><defs><linearGradient id="rg" x1="0" x2="1"><stop offset="0" stop-color="#6d5dfc"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs></svg>
          ${ring(pct, 70)}<b><span data-count="${pct}">0</span>%</b></div>
          <h2>${pct >= 80 ? 'Excellent work! 🎉' : pct >= 50 ? 'Good job! 👍' : 'Keep practising! 💪'}</h2>
          <p>You got ${score} out of ${qs.length} correct.</p>
          <div class="row gap center"><button class="btn primary" id="again">${I('refresh')} Try again</button><a class="btn ghost" href="${back}">Back</a></div></div>`;
        animateRings(stage); countUp(stage);
        if (pct >= 50) { confetti(); winSound(); }
        $('#again', stage).onclick = () => { i = 0; score = 0; show(); };
      };
      const show = () => {
        $('#pBar', v).style.width = (i / qs.length * 100) + '%';
        if (i >= qs.length) return result();
        const q = qs[i];
        stage.innerHTML = `<div class="swap-in"><span class="q-count">Question ${i + 1} of ${qs.length}</span>
          <h2 class="q-title">${esc(q.q)}</h2>
          <div class="answers">${q.o.map((o, k) => `<button class="answer" data-k="${k}" style="--i:${k}"><span class="letter">${'ABCD'[k]}</span>${esc(o)}</button>`).join('')}</div>
          <div class="q-foot"><span class="chip">⭐ Score: <b id="sc">${score}</b></span>
          <button class="btn primary hidden" id="next">${i + 1 === qs.length ? 'See results' : 'Next'} ${I('arrow')}</button></div></div>`;
        $$('.answer', stage).forEach(b => b.onclick = () => {
          const k = +b.dataset.k; $$('.answer', stage).forEach(x => x.disabled = true);
          if (k === q.a) { b.classList.add('right'); score++; beep(880, .1); beep(1320, .18, 'sine', .12, .09); }
          else { b.classList.add('wrong'); $(`.answer[data-k="${q.a}"]`, stage).classList.add('right'); beep(200, .3, 'triangle', .15); }
          $('#sc', stage).textContent = score;
          const n = $('#next', stage); n.classList.remove('hidden'); n.classList.add('pop-in'); n.focus();
          n.onclick = () => { i++; show(); };
        });
      };
      show();
    }
  };
}

function viewFlashcards() {
  return {
    html: `${pageHead('Flashcards', 'Click the card to flip it · press ← → to move · Space to flip', 'cards', 'sky')}
    <section class="block glass reveal fc-wrap" style="--i:1">
      <div class="fc-scene" id="scene"><div class="fc" id="fc">
        <div class="fc-face fc-front"><span class="fc-tag">Word</span><h2 id="fcWord"></h2>
          <button class="icon-btn" id="fcSpeak" aria-label="Listen">${I('volume')}</button><small>Click to see the meaning</small></div>
        <div class="fc-face fc-back"><span class="fc-tag">Meaning</span><h3 id="fcMean"></h3><p id="fcEx"></p></div>
      </div></div>
      <div class="fc-controls">
        <button class="icon-btn lg" id="prev" aria-label="Previous">${I('left')}</button>
        <span class="chip" id="fcCount"></span>
        <button class="icon-btn lg" id="shuf" aria-label="Shuffle">${I('shuffle')}</button>
        <button class="icon-btn lg" id="nextC" aria-label="Next">${I('right')}</button>
      </div>
      <div class="dots" id="dots"></div>
    </section>
    <section class="block glass reveal" style="--i:2">
      <div class="block-head"><h2>Your word deck</h2><p>Add new words — they are saved in this browser</p></div>
      <form id="wForm" class="inline-form"><input name="w" placeholder="Word" required><input name="m" placeholder="Meaning" required>
        <input name="e" placeholder="Example sentence"><button class="btn primary">${I('plus')} Add</button></form>
      <div class="chips" id="chips"></div>
    </section>`,
    mount(v) {
      let deck = getVocab(), i = 0, busy = false;
      const fc = $('#fc', v), scene = $('#scene', v);
      const fill = () => {
        const c = deck[i] || { w: 'Empty deck', m: 'Add some words below', e: '' };
        $('#fcWord', v).textContent = c.w; $('#fcMean', v).textContent = c.m; $('#fcEx', v).textContent = c.e ? `“${c.e}”` : '';
        $('#fcCount', v).textContent = deck.length ? `${i + 1} / ${deck.length}` : '0 / 0';
        $('#dots', v).innerHTML = deck.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('');
      };
      const chips = () => {
        $('#chips', v).innerHTML = deck.map((c, k) => `<span class="chip" style="--i:${k}">${esc(c.w)}<button data-k="${k}" aria-label="Remove">×</button></span>`).join('');
      };
      const go = dir => {
        if (busy || deck.length < 2) return; busy = true;
        scene.animate([{ transform: 'none', opacity: 1 }, { transform: `translateX(${-dir * 70}px) rotate(${-dir * 5}deg)`, opacity: 0 }], { duration: 220, easing: 'ease-in' }).onfinish = () => {
          fc.style.transition = 'none'; fc.classList.remove('flipped'); void fc.offsetWidth; fc.style.transition = '';
          i = (i + dir + deck.length) % deck.length; fill();
          scene.animate([{ transform: `translateX(${dir * 70}px) rotate(${dir * 5}deg)`, opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 480, easing: 'cubic-bezier(.22,.9,.24,1)' }).onfinish = () => busy = false;
        };
      };
      fc.onclick = e => { if (e.target.closest('#fcSpeak')) return; fc.classList.toggle('flipped'); };
      $('#fcSpeak', v).onclick = e => { e.stopPropagation(); if (deck[i]) speak(deck[i].w); };
      $('#prev', v).onclick = () => go(-1);
      $('#nextC', v).onclick = () => go(1);
      $('#shuf', v).onclick = () => { deck = shuffle(deck); i = 0; fc.classList.remove('flipped'); fill(); scene.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-3deg) scale(.96)' }, { transform: 'rotate(3deg) scale(.98)' }, { transform: 'none' }], { duration: 500 }); toast('Deck shuffled 🔀'); };
      $('#wForm', v).onsubmit = e => {
        e.preventDefault(); const f = e.target;
        const all = getVocab(); const w = { w: f.w.value.trim(), m: f.m.value.trim(), e: f.e.value.trim() };
        all.push(w); store.set('vocab', all); deck.push(w); f.reset(); fill(); chips(); toast(`“${w.w}” added`, 'ok');
      };
      $('#chips', v).onclick = e => {
        const b = e.target.closest('button[data-k]'); if (!b) return;
        const w = deck[+b.dataset.k]; deck = deck.filter(x => x !== w);
        store.set('vocab', getVocab().filter(x => x.w !== w.w)); i = Math.min(i, Math.max(0, deck.length - 1)); fill(); chips();
      };
      const key = e => {
        if (e.target.matches('input,textarea')) return;
        if (e.key === 'ArrowRight') go(1); else if (e.key === 'ArrowLeft') go(-1);
        else if (e.key === ' ') { e.preventDefault(); fc.classList.toggle('flipped'); }
      };
      document.addEventListener('keydown', key);
      fill(); chips();
      return () => document.removeEventListener('keydown', key);
    }
  };
}

function viewGames() {
  const games = [TOOLS[2], TOOLS[3], TOOLS[1], TOOLS[5]];
  return { html: `${pageHead('Games', 'Interactive word games to play together in class', 'gamepad', 'mint')}
    <section class="block glass reveal" style="--i:1"><div class="block-head"><h2>Choose a game</h2><p>All games use your vocabulary deck</p></div>
    <div class="tool-grid">${toolCards(games)}</div></section>` };
}

function viewScramble() {
  return {
    html: `${pageHead('Word Scramble', 'Click the letters in the right order to spell the word', 'shuffle', 'pink')}
    <section class="block glass reveal game" style="--i:1">
      <div class="scr-top"><span class="chip">⭐ Score <b id="sc">0</b></span><span class="chip">🔥 Streak <b id="st">0</b></span></div>
      <p class="clue" id="clue"></p>
      <div class="slots" id="slots"></div>
      <div class="tiles" id="tiles"></div>
      <div class="row gap center"><button class="btn ghost" id="clr">Clear</button><button class="btn ghost" id="hint">${I('bulb')} Hint</button>
        <button class="btn primary" id="skip">Skip ${I('arrow')}</button></div>
    </section>`,
    mount(v) {
      const words = getVocab().filter(x => /^[a-z]+$/i.test(x.w) && x.w.length <= 12);
      let word = '', letters = [], picked = [], score = 0, streak = 0, lock = false, last = '';
      const slots = $('#slots', v), tiles = $('#tiles', v);
      const render = () => {
        slots.classList.remove('win');
        slots.innerHTML = [...word].map((_, k) => picked[k] != null ? `<button class="tile" data-p="${k}" style="--i:${k}">${letters[picked[k]]}</button>` : '<span class="slot"></span>').join('');
        tiles.innerHTML = letters.map((l, k) => picked.includes(k) ? '<span class="tile ghost"></span>' : `<button class="tile" data-k="${k}" style="--i:${k}">${l}</button>`).join('');
      };
      const next = () => {
        if (!words.length) { $('#clue', v).textContent = 'Add some single words to your Flashcards deck first.'; return; }
        let item; do { item = words[Math.random() * words.length | 0]; } while (words.length > 1 && item.w === last);
        last = item.w; word = item.w.toLowerCase(); picked = []; lock = false;
        do { letters = shuffle([...word]); } while (word.length > 1 && letters.join('') === word && new Set(word).size > 1);
        $('#clue', v).innerHTML = `Clue: <b>${esc(item.m)}</b>`; render();
      };
      const check = () => {
        const guess = picked.map(k => letters[k]).join('');
        if (guess === word) {
          lock = true; score++; streak++; $('#sc', v).textContent = score; $('#st', v).textContent = streak;
          slots.classList.add('win'); winSound(); if (streak % 5 === 0) { confetti(); toast(`${streak} in a row! Amazing! 🔥`, 'ok'); }
          setTimeout(next, 1100);
        } else {
          lock = true; streak = 0; $('#st', v).textContent = 0; beep(200, .3, 'triangle', .15);
          slots.classList.add('shake'); setTimeout(() => { slots.classList.remove('shake'); picked = []; lock = false; render(); }, 650);
        }
      };
      tiles.onclick = e => { const b = e.target.closest('[data-k]'); if (!b || lock) return; picked.push(+b.dataset.k); beep(520 + picked.length * 40, .06); render(); if (picked.length === word.length) check(); };
      slots.onclick = e => { const b = e.target.closest('[data-p]'); if (!b || lock) return; picked.splice(+b.dataset.p, 1); render(); };
      $('#clr', v).onclick = () => { if (!lock) { picked = []; render(); } };
      $('#skip', v).onclick = () => { streak = 0; $('#st', v).textContent = 0; toast(`The word was “${word}”`); next(); };
      $('#hint', v).onclick = () => {
        if (lock) return; picked = [];
        const k = letters.findIndex(l => l === word[0]); picked.push(k); render(); toast(`It starts with “${word[0].toUpperCase()}”`);
      };
      next();
    }
  };
}

function viewMatch() {
  return {
    html: `${pageHead('Match Up', 'Click a word, then click its meaning', 'link', 'mint')}
    <section class="block glass reveal game" style="--i:1">
      <div class="scr-top"><span class="chip">🎯 Moves <b id="mv">0</b></span><span class="chip">⏱ Time <b id="tm">0:00</b></span>
        <button class="btn ghost sm" id="restart">${I('refresh')} New round</button></div>
      <div class="match"><div class="m-col" id="mL"></div><div class="m-col" id="mR"></div></div>
    </section>`,
    mount(v) {
      let sel = { L: null, R: null }, matched = 0, moves = 0, t0 = 0, iv = null, total = 0;
      const tick = () => { const s = Math.floor((Date.now() - t0) / 1000); $('#tm', v).textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
      const start = () => {
        const pairs = shuffle(getVocab()).slice(0, 6); total = pairs.length;
        $('#mL', v).innerHTML = shuffle(pairs).map((p, i) => `<button class="m-item" data-side="L" data-id="${esc(p.w)}" style="--i:${i}">${esc(p.w)}</button>`).join('');
        $('#mR', v).innerHTML = shuffle(pairs).map((p, i) => `<button class="m-item" data-side="R" data-id="${esc(p.w)}" style="--i:${i + 3}">${esc(p.m)}</button>`).join('');
        sel = { L: null, R: null }; matched = 0; moves = 0; $('#mv', v).textContent = 0;
        clearInterval(iv); t0 = Date.now(); tick(); iv = setInterval(tick, 1000);
      };
      $('.match', v).onclick = e => {
        const b = e.target.closest('.m-item'); if (!b || b.classList.contains('matched')) return;
        const side = b.dataset.side;
        if (sel[side]) sel[side].classList.remove('sel');
        sel[side] = sel[side] === b ? null : b; if (sel[side]) { b.classList.add('sel'); beep(600, .05); }
        if (sel.L && sel.R) {
          const { L, R } = sel; sel = { L: null, R: null }; moves++; $('#mv', v).textContent = moves;
          L.classList.remove('sel'); R.classList.remove('sel');
          if (L.dataset.id === R.dataset.id) {
            L.classList.add('matched'); R.classList.add('matched'); matched++; beep(880, .1); beep(1180, .15, 'sine', .12, .08);
            if (matched === total) { clearInterval(iv); setTimeout(() => { confetti(); winSound(); toast(`All matched in ${moves} moves! 🏆`, 'ok'); }, 300); }
          } else {
            [L, R].forEach(x => { x.classList.add('wrong'); setTimeout(() => x.classList.remove('wrong'), 500); }); beep(200, .25, 'triangle', .14);
          }
        }
      };
      $('#restart', v).onclick = start;
      start();
      return () => clearInterval(iv);
    }
  };
}

function viewGrammar() {
  const list = GRAMMAR.map(g => ({ id: 'play/' + g.id, title: g.title, desc: `${g.questions.length} questions · fill the gap`, icon: 'abc', color: g.color, tag: g.level }));
  return { html: `${pageHead('Grammar Practice', 'Choose a topic and test your students', 'abc', 'sun')}
    <section class="block glass reveal" style="--i:1"><div class="block-head"><h2>Topics</h2><p>Ready-made gap-fill quizzes</p></div>
    <div class="tool-grid">${toolCards(list)}</div></section>` };
}

function viewWheel() {
  const COLORS = ['#7c5cff', '#22d3ee', '#ff5d8f', '#fbbf24', '#34d399', '#a855f7', '#fb923c', '#38bdf8'];
  return {
    html: `${pageHead('Spin the Wheel', 'Who answers next? Let the wheel decide!', 'wheel', 'coral')}
    <div class="wheel-layout">
      <section class="block glass reveal" style="--i:1"><div class="wheel-stage"><div class="pointer" id="ptr"></div>
        <canvas id="wheel" width="900" height="900"></canvas><button class="spin-btn" id="spin">SPIN</button></div></section>
      <section class="block glass reveal" style="--i:2">
        <div class="block-head"><h2>Students</h2><p>One name per line</p></div>
        <textarea id="names" rows="9"></textarea>
        <div class="row gap" style="margin-top:12px"><button class="btn ghost" id="shufN">${I('shuffle')} Shuffle</button>
          <button class="btn ghost" id="saveN">${I('check')} Save list</button></div>
        <div id="winner"></div>
      </section>
    </div>`,
    mount(v) {
      const cv = $('#wheel', v), ctx = cv.getContext('2d'), ta = $('#names', v), S = cv.width, R = S / 2 - 10;
      ta.value = store.get('names', DEFAULT_NAMES).join('\n');
      let rot = 0, spinning = false, raf = 0;
      const names = () => ta.value.split('\n').map(s => s.trim()).filter(Boolean);
      const draw = () => {
        const n = names(), seg = 2 * Math.PI / Math.max(n.length, 1);
        ctx.clearRect(0, 0, S, S); ctx.save(); ctx.translate(S / 2, S / 2);
        if (!n.length) { ctx.fillStyle = '#ddd'; ctx.beginPath(); ctx.arc(0, 0, R, 0, 7); ctx.fill(); }
        n.forEach((name, i) => {
          const a = rot + i * seg;
          const g = ctx.createRadialGradient(0, 0, R * .2, 0, 0, R);
          const c = COLORS[i % COLORS.length]; g.addColorStop(0, c + 'cc'); g.addColorStop(1, c);
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, R, a, a + seg); ctx.closePath(); ctx.fillStyle = g; ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 4; ctx.stroke();
          ctx.save(); ctx.rotate(a + seg / 2); ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff';
          ctx.font = `800 ${Math.max(22, Math.min(46, 300 / n.length + 14))}px "Plus Jakarta Sans", sans-serif`;
          ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 6; ctx.fillText(name.slice(0, 14), R - 34, 0); ctx.restore();
        });
        ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.lineWidth = 14; ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.stroke();
        for (let k = 0; k < 24; k++) { const a = k / 24 * Math.PI * 2; ctx.beginPath(); ctx.arc(Math.cos(a) * R, Math.sin(a) * R, 5, 0, 7); ctx.fillStyle = k % 2 ? '#fde68a' : '#fff'; ctx.fill(); }
        ctx.restore();
      };
      const indexAt = r => {
        const n = names().length, seg = 2 * Math.PI / n;
        let a = (1.5 * Math.PI - r) % (2 * Math.PI); if (a < 0) a += 2 * Math.PI;
        return Math.floor(a / seg) % n;
      };
      $('#spin', v).onclick = () => {
        const n = names(); if (spinning) return; if (n.length < 2) return toast('Add at least 2 names', 'err');
        spinning = true; $('#winner', v).innerHTML = '';
        const start = rot, delta = Math.PI * 2 * (5 + Math.random() * 3) + Math.random() * Math.PI * 2, dur = 5200, t0 = performance.now();
        let lastIdx = indexAt(rot);
        const step = t => {
          const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
          rot = start + delta * e; draw();
          const idx = indexAt(rot);
          if (idx !== lastIdx) { lastIdx = idx; beep(1400, .03, 'square', .04); const ptr = $('#ptr', v); ptr.classList.remove('tick'); void ptr.offsetWidth; ptr.classList.add('tick'); }
          if (p < 1) raf = requestAnimationFrame(step);
          else {
            spinning = false; const w = n[indexAt(rot)];
            $('#winner', v).innerHTML = `<div class="winner"><small>The winner is</small><h3>${esc(w)}</h3><button class="btn sm" id="rmW">Remove from list</button></div>`;
            $('#rmW', v).onclick = () => { ta.value = names().filter(x => x !== w).join('\n'); $('#winner', v).innerHTML = ''; draw(); };
            confetti(); winSound();
          }
        };
        raf = requestAnimationFrame(step);
      };
      ta.oninput = draw;
      $('#shufN', v).onclick = () => { ta.value = shuffle(names()).join('\n'); draw(); };
      $('#saveN', v).onclick = () => { store.set('names', names()); toast('List saved ✓', 'ok'); };
      if (document.fonts) document.fonts.ready.then(draw);
      draw();
      return () => cancelAnimationFrame(raf);
    }
  };
}

function viewTimer() {
  const R = 115, C = 2 * Math.PI * R;
  return {
    html: `${pageHead('Class Timer', 'Set a time limit for tasks, tests and group work', 'timer', 'teal')}
    <section class="block glass reveal timer-box" style="--i:1">
      <div class="timer-ring" id="tBox"><svg viewBox="0 0 260 260"><defs><linearGradient id="tg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#6d5dfc"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs>
        <circle class="ring-bg" cx="130" cy="130" r="${R}"/><circle id="tRing" cx="130" cy="130" r="${R}" stroke-dasharray="${C}" stroke-dashoffset="0"/></svg>
        <div class="t-display" id="tDisp">05:00</div></div>
      <div class="presets">${[1, 2, 3, 5, 10, 15].map(m => `<button class="chip-btn ${m === 5 ? 'on' : ''}" data-m="${m}">${m} min</button>`).join('')}</div>
      <div class="row gap center"><button class="btn primary" id="tStart">${I('play')} Start</button><button class="btn ghost" id="tReset">${I('refresh')} Reset</button></div>
    </section>`,
    mount(v) {
      let total = 300, left = 300, running = false, endAt = 0, raf = 0;
      const disp = $('#tDisp', v), ringEl = $('#tRing', v), btn = $('#tStart', v);
      const paint = () => {
        const s = Math.ceil(left); disp.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
        ringEl.style.strokeDashoffset = C * (1 - left / total);
      };
      const loop = () => {
        left = Math.max(0, (endAt - performance.now()) / 1000); paint();
        if (left <= 0) {
          running = false; btn.innerHTML = `${I('play')} Start`; $('#tBox', v).classList.add('done');
          [0, .35, .7].forEach(d => beep(988, .25, 'square', .08, d)); toast("⏰ Time's up!", 'ok'); return;
        }
        raf = requestAnimationFrame(loop);
      };
      btn.onclick = () => {
        if (running) { running = false; cancelAnimationFrame(raf); btn.innerHTML = `${I('play')} Resume`; return; }
        if (left <= 0) left = total;
        $('#tBox', v).classList.remove('done'); running = true; endAt = performance.now() + left * 1000; btn.textContent = 'Pause'; loop();
      };
      const reset = () => { running = false; cancelAnimationFrame(raf); left = total; btn.innerHTML = `${I('play')} Start`; $('#tBox', v).classList.remove('done'); paint(); };
      $('#tReset', v).onclick = reset;
      $('.presets', v).onclick = e => {
        const b = e.target.closest('[data-m]'); if (!b) return;
        $$('.presets .on', v).forEach(x => x.classList.remove('on')); b.classList.add('on'); total = +b.dataset.m * 60; reset();
      };
      paint();
      return () => cancelAnimationFrame(raf);
    }
  };
}

function viewBoard() {
  const COLS = ['#161a36', '#6d5dfc', '#ef4444', '#10b981', '#0ea5e9', '#f59e0b', '#ec4899'];
  return {
    html: `${pageHead('Whiteboard', 'Draw, write and explain — great for a projector', 'board', 'indigo')}
    <section class="block glass reveal" style="--i:1">
      <div class="board-tools">${COLS.map((c, i) => `<button class="sw ${i === 0 ? 'on' : ''}" data-c="${c}" style="background:${c}" aria-label="Colour"></button>`).join('')}
        <input type="range" id="bSize" min="2" max="30" value="5" aria-label="Brush size">
        <button class="chip-btn" id="bErase">${I('eraser')} Eraser</button><button class="chip-btn" id="bClear">${I('trash')} Clear</button>
        <button class="chip-btn" id="bSave">${I('download')} Save PNG</button></div>
      <canvas id="board"></canvas>
    </section>`,
    mount(v) {
      const cv = $('#board', v), ctx = cv.getContext('2d');
      let color = COLS[0], erase = false, drawing = false, last = null;
      const fit = () => {
        const dpr = devicePixelRatio || 1, r = cv.getBoundingClientRect();
        const tmp = document.createElement('canvas'); tmp.width = cv.width; tmp.height = cv.height;
        if (cv.width && cv.height) tmp.getContext('2d').drawImage(cv, 0, 0);
        cv.width = r.width * dpr; cv.height = r.height * dpr; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height);
        if (tmp.width && tmp.height) ctx.drawImage(tmp, 0, 0); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      };
      const pos = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
      cv.onpointerdown = e => { drawing = true; last = pos(e); cv.setPointerCapture(e.pointerId); ctx.beginPath(); ctx.arc(last.x, last.y, +$('#bSize', v).value / 2, 0, 7); ctx.fillStyle = erase ? '#fff' : color; ctx.fill(); };
      cv.onpointermove = e => {
        if (!drawing) return; const p = pos(e), size = +$('#bSize', v).value;
        ctx.strokeStyle = erase ? '#fff' : color; ctx.lineWidth = erase ? size * 3 : size;
        ctx.beginPath(); ctx.moveTo(last.x, last.y); const mx = (last.x + p.x) / 2, my = (last.y + p.y) / 2;
        ctx.quadraticCurveTo(last.x, last.y, mx, my); ctx.lineTo(p.x, p.y); ctx.stroke(); last = p;
      };
      cv.onpointerup = cv.onpointercancel = () => drawing = false;
      $('.board-tools', v).onclick = e => {
        const s = e.target.closest('.sw');
        if (s) { color = s.dataset.c; erase = false; $$('.sw', v).forEach(x => x.classList.toggle('on', x === s)); $('#bErase', v).classList.remove('on'); }
      };
      $('#bErase', v).onclick = e => { erase = !erase; e.currentTarget.classList.toggle('on', erase); };
      $('#bClear', v).onclick = () => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height); ctx.restore(); };
      $('#bSave', v).onclick = () => { const a = document.createElement('a'); a.download = 'whiteboard.png'; a.href = cv.toDataURL('image/png'); a.click(); };
      cv.width = 0; fit();
      window.addEventListener('resize', fit);
      return () => window.removeEventListener('resize', fit);
    }
  };
}

function viewCourses() {
  const L = [['A1', 'Beginner', 'Greetings, numbers, family, colours', 24, 80, 'mint'], ['A2', 'Elementary', 'Daily routines, food, Past Simple', 28, 55, 'sky'],
    ['B1', 'Intermediate', 'Travel, opinions, Present Perfect', 32, 30, 'violet'], ['B2', 'Upper-Intermediate', 'Debates, conditionals, essay writing', 30, 12, 'pink'],
    ['C1', 'Advanced', 'Academic English, idioms, presentations', 26, 0, 'sun']];
  return {
    html: `${pageHead('Courses', 'Lesson plans from A1 to C1 (CEFR levels)', 'cap', 'violet')}
    <section class="block glass reveal" style="--i:1"><div class="block-head"><h2>English levels</h2><p>Track how far each level has gone</p></div>
    <div class="level-grid">${L.map(([c, n, d, les, p, col], i) => `<div class="level tilt reveal c-${col}" style="--i:${i}">
      <div class="lv-badge">${c}</div><h3>${n}</h3><p>${d}</p><div class="lv-bar"><span data-w="${p}"></span></div>
      <div class="lv-meta"><span>${les} lessons</span><span>${p}%</span></div></div>`).join('')}</div></section>`,
    mount(v) { setTimeout(() => $$('.lv-bar span', v).forEach(s => s.style.width = s.dataset.w + '%'), 300); }
  };
}

/* ================= Router ================= */
const ROUTES = { home: viewHome, classes: viewClasses, create: viewCreate, play: viewPlay, flashcards: viewFlashcards, games: viewGames,
  scramble: viewScramble, match: viewMatch, grammar: viewGrammar, wheel: viewWheel, timer: viewTimer, board: viewBoard, courses: viewCourses };
let cleanup = null, first = true;

function setActive(name, arg) {
  const parent = { scramble: 'games', match: 'games', play: arg && arg.startsWith('g-') ? 'grammar' : 'create' }[name] || name;
  let active = null;
  $$('#nav a').forEach(a => { const on = a.dataset.r === parent; a.classList.toggle('active', on); if (on) active = a; });
  const ind = $('#navInd');
  if (active) { ind.style.opacity = 1; ind.style.top = active.offsetTop + 'px'; ind.style.height = active.offsetHeight + 'px'; } else ind.style.opacity = 0;
}

function router() {
  const [name, arg] = location.hash.slice(1).split('/');
  const key = ROUTES[name] ? name : 'home';
  const view = $('#view');
  closeMenu();
  view.classList.add('leaving');
  setTimeout(() => {
    if (cleanup) { try { cleanup(); } catch (e) {} cleanup = null; }
    const out = ROUTES[key](arg);
    view.innerHTML = out.html;
    window.scrollTo({ top: 0, behavior: first ? 'auto' : 'smooth' });
    cleanup = out.mount ? out.mount(view) || null : null;
    setActive(key, arg);
    bindTilt(view);
    requestAnimationFrame(() => view.classList.remove('leaving'));
    const titles = { home: 'Dashboard' };
    document.title = `${titles[key] || (NAV.find(n => n[0] === key) || [, key[0].toUpperCase() + key.slice(1)])[1]} · EnglishSpace`;
    first = false;
  }, first ? 0 : 280);
}

/* ================= Shell ================= */
function closeMenu() { $('#sidebar').classList.remove('open'); $('#overlay').classList.remove('show'); }
function initShell() {
  $('#nav').insertAdjacentHTML('beforeend', NAV.map(([r, label, icon, col]) => `<a href="#${r}" data-r="${r}" class="c-${col}"><span class="ni">${I(icon)}</span>${label}</a>`).join(''));
  $('#menuBtn').innerHTML = I('menu');
  $('#menuBtn').onclick = () => { $('#sidebar').classList.add('open'); $('#overlay').classList.add('show'); };
  $('#overlay').onclick = closeMenu;
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  const msgs = [['mega', 'Welcome back, Nurkhanym Raiyskizi! Ready for a great lesson today?'], ['sparkles', 'New: Spin the Wheel and Class Timer are ready to use'],
    ['cards', 'Tip: press ← → and Space on the Flashcards page'], ['edit', 'Build your own quiz in under 2 minutes'], ['gamepad', 'Try Word Scramble and Match Up with your class']];
  const row = msgs.map(([i, t]) => `<span>${I(i)} ${t}</span>`).join('');
  $('#marquee').innerHTML = row + row;

  let tipI = new Date().getDay() % TIPS.length;
  $('#tipIcon').innerHTML = I('bulb'); $('#tip').textContent = TIPS[tipI];
  setInterval(() => { const p = $('#tip'); p.style.opacity = 0; setTimeout(() => { tipI = (tipI + 1) % TIPS.length; p.textContent = TIPS[tipI]; p.style.opacity = 1; }, 400); }, 9000);

  const sysDark = matchMedia('(prefers-color-scheme: dark)').matches;
  const applyTheme = t => { document.documentElement.dataset.theme = t; $('#themeBtn').innerHTML = I(t === 'dark' ? 'sun' : 'moon'); };
  applyTheme(store.get('theme', sysDark ? 'dark' : 'light'));
  $('#themeBtn').onclick = () => { const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; applyTheme(t); store.set('theme', t); };

  const glow = $('.cursor-glow');
  window.addEventListener('pointermove', e => { glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`; }, { passive: true });

  document.addEventListener('pointerdown', e => {
    const b = e.target.closest('.btn'); if (!b) return;
    const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height), sp = document.createElement('span');
    sp.className = 'ripple'; sp.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
    b.appendChild(sp); setTimeout(() => sp.remove(), 700);
  });
  document.addEventListener('click', e => { const s = e.target.closest('[data-speak]'); if (s) speak(s.dataset.speak); });
  window.addEventListener('resize', () => { const [n, a] = location.hash.slice(1).split('/'); setActive(ROUTES[n] ? n : 'home', a); });
}

initShell();
window.addEventListener('hashchange', router);
router();
