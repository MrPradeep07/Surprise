/* =================== SCENE NAVIGATION =================== */
const scenes = ['s-intro','s-game1','s-game2','s-game3','s-final','s-success'];
let currentScene = 0;
let totalScore = 0;

function goTo(id) {
  const cur = document.querySelector('.screen.active');
  const tgt = document.getElementById(id);
  if (cur === tgt) return;
  const idx = scenes.indexOf(id);
  if (idx >= 0) currentScene = idx;
  if (cur) {
    cur.classList.remove('active');
    setTimeout(() => {
      tgt.classList.add('active');
      updateDots();
      onEnter(id);
    }, 200);
  } else {
    tgt.classList.add('active');
    updateDots();
    onEnter(id);
  }
}

function onEnter(id) {
  if (id === 's-game1') resetGame1();
  if (id === 's-game2') resetGame2();
  if (id === 's-game3') resetGame3();
  if (id === 's-final') resetFinal();
  if (id === 's-success') celebrate();
  if (id === 's-game2' || id === 's-game3' || id === 's-final') {
    document.getElementById('scoreboard').classList.remove('hidden');
  } else {
    document.getElementById('scoreboard').classList.add('hidden');
  }
}

function addScore(n) {
  totalScore += n;
  document.getElementById('scoreVal').textContent = totalScore;
}

/* =================== DOTS =================== */
const dotsEl = document.getElementById('dots');
scenes.forEach(() => {
  const d = document.createElement('div');
  d.className = 'dot';
  dotsEl.appendChild(d);
});
function updateDots() {
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.remove('active','done');
    if (i < currentScene) d.classList.add('done');
    if (i === currentScene) d.classList.add('active');
  });
}
updateDots();

/* =================== FLOATING EMOJIS =================== */
const floatEmojis = ['💖','✨','🌸','💫','🎈','⭐','💕','🎀'];
function spawnEmoji() {
  const el = document.createElement('div');
  el.className = 'float-em';
  el.textContent = floatEmojis[Math.floor(Math.random()*floatEmojis.length)];
  el.style.left = Math.random() * 100 + 'vw';
  el.style.top = '100vh';
  el.style.animationDuration = (Math.random() * 6 + 8) + 's';
  el.style.fontSize = (Math.random() * 20 + 20) + 'px';
  document.getElementById('floatEmoji').appendChild(el);
  setTimeout(() => el.remove(), 15000);
}
setInterval(spawnEmoji, 900);
for (let i=0; i<5; i++) setTimeout(spawnEmoji, i*300);

/* =================== MUSIC =================== */
const bgMusic = document.getElementById('bgMusic');
const musicIcon = document.getElementById('musicIcon');
const musicBtn = document.getElementById('musicBtn');
let musicOn = false;

function toggleMusic() {
  if (musicOn) {
    bgMusic.pause();
    musicIcon.textContent = '🔇';
    musicBtn.classList.remove('on');
  } else {
    bgMusic.play().catch(()=>{});
    musicIcon.textContent = '🎵';
    musicBtn.classList.add('on');
  }
  musicOn = !musicOn;
}
document.addEventListener('click', function autoOn() {
  if (!musicOn) toggleMusic();
  document.removeEventListener('click', autoOn);
}, { once: true });

/* =================== GAME 1 =================== */
let g1Timer = null, g1Interval = null, g1Score = 0, g1TimeLeft = 10, g1Playing = false;

function resetGame1() {
  g1Score = 0;
  g1TimeLeft = 10;
  g1Playing = false;
  document.getElementById('g1Score').textContent = 0;
  document.getElementById('g1Time').textContent = 10;
  document.getElementById('g1Result').classList.add('hidden');
  document.getElementById('g1Start').classList.remove('hidden');
  const area = document.getElementById('playArea');
  area.querySelectorAll('.heart').forEach(h => h.remove());
}

function startGame1() {
  g1Playing = true;
  g1Score = 0;
  g1TimeLeft = 10;
  document.getElementById('g1Start').classList.add('hidden');
  document.getElementById('g1Result').classList.add('hidden');
  document.getElementById('g1Score').textContent = 0;
  document.getElementById('g1Time').textContent = 10;

  g1Timer = setInterval(spawnHeart, 550);

  g1Interval = setInterval(() => {
    g1TimeLeft--;
    document.getElementById('g1Time').textContent = g1TimeLeft;
    if (g1TimeLeft <= 0) endGame1();
  }, 1000);
}

function spawnHeart() {
  if (!g1Playing) return;
  const area = document.getElementById('playArea');
  const h = document.createElement('div');
  h.className = 'heart';
  h.textContent = ['💖','💗','💓','💕','❤️'][Math.floor(Math.random()*5)];
  const rect = area.getBoundingClientRect();
  h.style.left = Math.random() * (rect.width - 50) + 'px';
  h.style.top  = Math.random() * (rect.height - 50) + 'px';
  h.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!g1Playing) return;
    g1Score++;
    document.getElementById('g1Score').textContent = g1Score;
    h.classList.add('popped');
    smallBurst(h);
    setTimeout(() => h.remove(), 400);
  });
  area.appendChild(h);
  setTimeout(() => { if (h.parentNode) h.remove(); }, 1300);
}

function endGame1() {
  g1Playing = false;
  clearInterval(g1Timer);
  clearInterval(g1Interval);
  document.getElementById('playArea').querySelectorAll('.heart').forEach(h => h.remove());
  addScore(g1Score);

  const result = document.getElementById('g1Result');
  let msg = '';
  if (g1Score >= 15) msg = `🔥 Wah! <b>${g1Score} hearts</b> pakde! Pradeep impress ho gaya!`;
  else if (g1Score >= 8) msg = `😍 <b>${g1Score} hearts</b> — Pradeep kehte hain "kaafi accha!"`;
  else msg = `😅 Sirf <b>${g1Score} hearts</b>? Pradeep kehte hain "koi baat nahi, agli baar!"`;
  result.innerHTML = `${msg}<br><br><button class="btn-primary" onclick="goTo('s-game2')">Next Game 🎮</button>`;
  result.classList.remove('hidden');
}

/* =================== GAME 2 =================== */
let g2Opened = false;
let g2MessageIndex = 0;
const g2Messages = [
  "Sach bataun? Tumse baat karke din accha ho jata hai 😊",
  "Pata hai, tumhare jaisi dost sabko nahi milti 💫",
  "Kabhi kabhi lagta hai... tum sirf dost nahi ho 🌟"
];

function resetGame2() {
  g2Opened = false;
  g2MessageIndex = Math.floor(Math.random() * 3);
  document.getElementById('g2Result').classList.add('hidden');
  document.querySelectorAll('#boxes .box').forEach(b => {
    b.classList.remove('opened');
    b.textContent = '🎁';
    b.style.pointerEvents = 'auto';
  });
}

function openBox(i) {
  if (g2Opened) return;
  g2Opened = true;
  const boxes = document.querySelectorAll('#boxes .box');
  boxes.forEach((b, idx) => {
    setTimeout(() => {
      b.classList.add('opened');
      if (idx === g2MessageIndex) {
        b.textContent = '💌';
      } else {
        b.textContent = ['🌸','✨','🎈','⭐'][idx % 4];
      }
    }, idx * 300);
  });

  setTimeout(() => {
    const found = (i === g2MessageIndex);
    if (found) addScore(5);
    const result = document.getElementById('g2Result');
    const msg = g2Messages[g2MessageIndex];
    let header = found 
      ? `💖 Wow! Tumne message dhundh liya! +5 points` 
      : `💌 Message tha box #${g2MessageIndex+1} me... par koi baat nahi!`;
    result.innerHTML = `${header}<br><br><b>${msg}</b><br><br>
      <button class="btn-primary" onclick="goTo('s-game3')">Last Game 🎯</button>`;
    result.classList.remove('hidden');
  }, 1200);
}

/* =================== GAME 3 =================== */
const emojiPairs = ['💖','🌸','⭐','🎈','💫','🍀','🎀','🌈'];
let memFlipped = [], memMatched = 0, memLocked = false;

function resetGame3() {
  memFlipped = [];
  memMatched = 0;
  memLocked = false;
  document.getElementById('g3Result').classList.add('hidden');
  const grid = document.getElementById('memoryGrid');
  grid.innerHTML = '';
  const deck = [...emojiPairs, ...emojiPairs].sort(() => Math.random() - 0.5);
  deck.forEach((emoji, i) => {
    const card = document.createElement('div');
    card.className = 'mem-card';
    card.dataset.emoji = emoji;
    card.dataset.idx = i;
    card.textContent = '❓';
    card.onclick = () => flipCard(card);
    grid.appendChild(card);
  });
}

function flipCard(card) {
  if (memLocked) return;
  if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
  card.classList.add('flipped');
  card.textContent = card.dataset.emoji;
  memFlipped.push(card);

  if (memFlipped.length === 2) {
    memLocked = true;
    const [a, b] = memFlipped;
    if (a.dataset.emoji === b.dataset.emoji) {
      setTimeout(() => {
        a.classList.add('matched');
        b.classList.add('matched');
        memMatched++;
        memFlipped = [];
        memLocked = false;
        if (memMatched === 8) endGame3();
      }, 400);
    } else {
      setTimeout(() => {
        a.classList.remove('flipped');
        b.classList.remove('flipped');
        a.textContent = '❓';
        b.textContent = '❓';
        memFlipped = [];
        memLocked = false;
      }, 900);
    }
  }
}

function endGame3() {
  addScore(10);
  const result = document.getElementById('g3Result');
  result.innerHTML = `🧠 Shabaash! Saare jodi mil gaye! <b>+10 points</b><br><br>
    <button class="btn-primary" onclick="goTo('s-final')">Ek Aakhri Baat 💗</button>`;
  result.classList.remove('hidden');
}

/* =================== FINAL =================== */
const noMessages = [
  "Nahi 😅", "Pakka? 🥺", "Soch lo... 🤔", "Ek baar phir? 🙃",
  "Pradeep ka dil toot jayega 💔", "Please na 🥹", "Pradeep ro dega 😭",
  "Chalo haan bol do 😌", "Yes dabao bas 👉", "Bhaag ke kahan jaogi 😜",
  "Ruk jaao! Pradeep wait kar raha hai 💘", "Last chance! 🌹"
];
let noCount = 0;

function resetFinal() {
  noCount = 0;
  const noBtn = document.getElementById('noBtn');
  noBtn.style.transform = '';
  noBtn.textContent = 'Nahi 😅';
  document.getElementById('finalHint').textContent = '';
  const yes = document.getElementById('yesBtn');
  yes.style.transform = '';
}

function moveNo() {
  const btn = document.getElementById('noBtn');
  noCount++;
  const scale = Math.max(0.35, 1 - noCount * 0.08);
  const x = (Math.random() - 0.5) * 260;
  const y = (Math.random() - 0.5) * 120;
  btn.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  if (noCount < noMessages.length) {
    btn.textContent = noMessages[noCount];
  }
  const yes = document.getElementById('yesBtn');
  yes.style.transform = `scale(${1 + noCount * 0.08})`;

  const hints = [
    "", "Soch rahi ho? 😏", "Yaar bas ek baar haan bol do 🙈",
    "Dekho No button chhota ho raha hai 😂", "Pradeep wait kar raha hai! 🥺",
    "Kab tak bhaagogi? 😜", "Theek hai, Pradeep wait karega 💕"
  ];
  if (noCount < hints.length) {
    document.getElementById('finalHint').textContent = hints[noCount];
  }
}

function sayYes() {
  goTo('s-success');
}

/* =================== SUCCESS =================== */
function celebrate() {
  bigConfetti();
  fireworks();
  const iv = setInterval(() => {
    smallBurst(null, Math.random()*window.innerWidth, Math.random()*window.innerHeight*0.5);
  }, 400);
  setTimeout(() => clearInterval(iv), 6000);
}

/* =================== FX =================== */
const canvas = document.getElementById('fx');
const ctx = canvas.getContext('2d');
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

let particles = [];
let animating = false;

function bigConfetti() {
  const colors = ['#ff4d6d','#ff8fa3','#ffd6e0','#ffcc00','#c41e5c','#7b2ff7','#ffe066'];
  for (let i = 0; i < 200; i++) {
    particles.push({
      x: Math.random()*canvas.width,
      y: -20 - Math.random()*300,
      vx: Math.random()*4 - 2,
      vy: Math.random()*5 + 3,
      w: Math.random()*10 + 5,
      h: Math.random()*6 + 4,
      color: colors[Math.floor(Math.random()*colors.length)],
      rot: Math.random()*360,
      vrot: Math.random()*12 - 6,
      life: 1,
      shape: Math.random() > 0.5 ? 'rect' : 'circle'
    });
  }
  if (!animating) { animating = true; loop(); }
}

function smallBurst(el, x, y) {
  let cx = x, cy = y;
  if (el) {
    const r = el.getBoundingClientRect();
    cx = r.left + r.width/2;
    cy = r.top + r.height/2;
  }
  const colors = ['#ff4d6d','#ff8fa3','#ffd6e0','#ffcc00','#7b2ff7'];
  for (let i = 0; i < 25; i++) {
    const angle = Math.random()*Math.PI*2;
    const speed = Math.random()*6 + 2;
    particles.push({
      x: cx, y: cy,
      vx: Math.cos(angle)*speed,
      vy: Math.sin(angle)*speed,
      w: Math.random()*6 + 3,
      h: Math.random()*6 + 3,
      color: colors[Math.floor(Math.random()*colors.length)],
      rot: Math.random()*360,
      vrot: Math.random()*15 - 7,
      life: 1,
      shape: 'rect'
    });
  }
  if (!animating) { animating = true; loop(); }
}

function fireworks() {
  const colors = ['#ff4d6d','#ffd6e0','#ffcc00','#7b2ff7','#ff8fa3'];
  let c = 0;
  const iv = setInterval(() => {
    const cx = Math.random()*canvas.width;
    const cy = Math.random()*canvas.height*0.6 + 50;
    const col = colors[Math.floor(Math.random()*colors.length)];
    for (let i = 0; i < 55; i++) {
      const a = (i/55)*Math.PI*2;
      const sp = Math.random()*6 + 2;
      particles.push({
        x: cx, y: cy,
        vx: Math.cos(a)*sp,
        vy: Math.sin(a)*sp,
        w: 4, h: 4,
        color: col, rot:0, vrot:0, life:1, shape:'circle'
      });
    }
    c++;
    if (c > 5) clearInterval(iv);
  }, 450);
}

function loop() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.13;
    p.vx *= 0.995;
    p.rot += p.vrot;
    p.life -= 0.008;
    if (p.life <= 0 || p.y > canvas.height + 60) {
      particles.splice(i, 1);
      return;
    }
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot * Math.PI / 180);
    ctx.fillStyle = p.color;
    if (p.shape === 'circle') {
      ctx.beginPath(); ctx.arc(0,0,p.w/2,0,Math.PI*2); ctx.fill();
    } else {
      ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
    }
    ctx.restore();
  });
  if (particles.length > 0) requestAnimationFrame(loop);
  else { animating = false; ctx.clearRect(0,0,canvas.width,canvas.height); }
}

/* =================== REPLAY =================== */
function replay() {
  totalScore = 0;
  document.getElementById('scoreVal').textContent = 0;
  particles = [];
  ctx.clearRect(0,0,canvas.width,canvas.height);
  resetFinal();
  goTo('s-intro');
}
