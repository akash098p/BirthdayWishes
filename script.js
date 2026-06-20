// ── Background stars ──
const starsEl = document.getElementById('stars');
for (let i = 0; i < 60; i++) {
  const s = document.createElement('div');
  s.className = 'star';
  s.style.cssText = `
    left:${Math.random()*100}%;
    top:${Math.random()*100}%;
    animation-duration:${1.5+Math.random()*3}s;
    animation-delay:${Math.random()*3}s;
    width:${2+Math.random()*4}px;
    height:${2+Math.random()*4}px;
    opacity:${0.2+Math.random()*0.8};
  `;
  starsEl.appendChild(s);
}

// ── Floating background emojis ──
const bgEmojisEl = document.getElementById('bg-emojis');
const bgEmojis = ['🎈','🎉','✨','🌟','💫','🎊','🥳','🎁','🎀','❤️','🩷','💛','💚','💙','💜'];
for (let i = 0; i < 20; i++) {
  const e = document.createElement('div');
  e.className = 'bg-emoji';
  e.textContent = bgEmojis[Math.floor(Math.random()*bgEmojis.length)];
  e.style.cssText = `
    left:${Math.random()*100}%;
    font-size:${1.2+Math.random()*2}rem;
    animation-duration:${6+Math.random()*10}s;
    animation-delay:${Math.random()*8}s;
  `;
  bgEmojisEl.appendChild(e);
}

// ── Mouse sparkle trail ──
const sparkleEmojis = ['✨','⭐','💫','🌟','🎇','🎆'];
let lastSparkle = 0;
document.addEventListener('mousemove', e => {
  const now = Date.now();
  if (now - lastSparkle < 80) return;
  lastSparkle = now;
  const s = document.createElement('div');
  s.className = 'sparkle';
  s.textContent = sparkleEmojis[Math.floor(Math.random()*sparkleEmojis.length)];
  s.style.left = e.clientX - 10 + 'px';
  s.style.top  = e.clientY - 10 + 'px';
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 800);
});

// ── Confetti engine ──
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let confettiParticles = [];
let confettiRunning = false;
const CONFETTI_COLORS = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#c77dff','#ff922b','#f783ac'];

function spawnConfetti(n = 80) {
  for (let i = 0; i < n; i++) {
    confettiParticles.push({
      x: Math.random() * canvas.width,
      y: -10,
      w: 8 + Math.random() * 8,
      h: 4 + Math.random() * 6,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      vx: (Math.random() - 0.5) * 6,
      vy: 2 + Math.random() * 4,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.2,
      life: 1,
    });
  }
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confettiParticles = confettiParticles.filter(p => p.life > 0);
  confettiParticles.forEach(p => {
    p.x  += p.vx; p.y += p.vy;
    p.rot += p.rotV;
    p.vy += 0.08;
    if (p.y > canvas.height) p.life = 0;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
    ctx.restore();
  });
  if (confettiParticles.length > 0 || confettiRunning) {
    requestAnimationFrame(animateConfetti);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function startConfetti() {
  confettiRunning = true;
  spawnConfetti(120);
  animateConfetti();
  setTimeout(() => { confettiRunning = false; }, 3000);
  let t = 0;
  const burst = setInterval(() => {
    spawnConfetti(60);
    t++;
    if (t > 5) clearInterval(burst);
  }, 400);
}

// ── Fireworks ──
function launchFirework() {
  const fw = document.getElementById('fireworks');
  const x = 20 + Math.random() * 60; // % positions
  const y = 10 + Math.random() * 50;
  const div = document.createElement('div');
  div.className = 'firework';
  div.style.left = x + 'vw';
  div.style.top  = y + 'vh';
  const colors = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#c77dff','#fff'];
  const n = 16;
  for (let i = 0; i < n; i++) {
    const spark = document.createElement('div');
    spark.className = 'fw-spark';
    const angle = (i / n) * Math.PI * 2;
    const dist = 40 + Math.random() * 60;
    spark.style.cssText = `
      --tx:${Math.cos(angle)*dist}px;
      --ty:${Math.sin(angle)*dist}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      animation-duration:${0.6+Math.random()*0.4}s;
    `;
    div.appendChild(spark);
  }
  fw.appendChild(div);
  setTimeout(() => div.remove(), 1200);
}

// ── Main GSAP logic (from original script.js) ──
const { gsap, gsap: { to, timeline, set, delayedCall }, Splitting } = window;
Splitting();

const BTN = document.querySelector('.birthday-button__button');
const SOUNDS = {
  CHEER: new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/cheer.mp3'),
  MATCH: new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/match-strike-trimmed.mp3'),
  TUNE:  new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/happy-birthday-trimmed.mp3'),
  ON:    new Audio('https://assets.codepen.io/605876/switch-on.mp3'),
  BLOW:  new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/blow-out.mp3'),
  POP:   new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/pop-trimmed.mp3'),
  HORN:  new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/horn.mp3'),
};
Object.values(SOUNDS).forEach(s => s.muted = false);

const EYES = document.querySelector('.cake__eyes');
const BLINK = eyes => {
  gsap.set(eyes, { scaleY: 1 });
  if (eyes.BLINK_TL) eyes.BLINK_TL.kill();
  eyes.BLINK_TL = new gsap.timeline({ delay: Math.floor(Math.random()*4)+1, onComplete: ()=>BLINK(eyes) });
  eyes.BLINK_TL.to(eyes, { duration: 0.05, transformOrigin: '50% 50%', scaleY: 0, yoyo: true, repeat: 1 });
};
BLINK(EYES);

const FROSTING_TL = () =>
  timeline()
    .to('#frosting', { scaleX:1.015, duration:0.25 }, 0)
    .to('#frosting', { scaleY:1, duration:1 }, 0)
    .to('#frosting', { duration:1, morphSVG:'.cake__frosting--end' }, 0);

const SPRINKLES_TL = () =>
  timeline().to('.cake__sprinkle', { scale:1, duration:0.06, stagger:0.02 });

const SPIN_TL = () =>
  timeline()
    .set('.cake__frosting-patch', { display:'block' })
    .to(['.cake__frosting--duplicate','.cake__sprinkles--duplicate'], { x:0, duration:1 }, 0)
    .to(['.cake__frosting--start','.cake__sprinkles--initial'], { x:65, duration:1 }, 0)
    .to('.cake__face', { duration:1, x:-48.82 }, 0);

const FLICKER_TL = timeline()
  .to('.candle__flame-outer', { duration:0.1, repeat:-1, yoyo:true, morphSVG:'#flame-outer' })
  .to('.candle__flame-inner', { duration:0.1, repeat:-1, yoyo:true, morphSVG:'#flame-inner' }, 0);

const SHAKE_TL = () =>
  timeline({ delay:0.5 })
    .set('.cake__face', { display:'none' })
    .set('.cake__face--straining', { display:'block' })
    .to('.birthday-button', {
      onComplete: () => {
        set('.cake__face--straining', { display:'none' });
        set('.cake__face', { display:'block' });
      },
      x:1, y:1, repeat:13, duration:0.1
    }, 0)
    .to('.cake__candle', {
      onComplete: () => FLICKER_TL.play(),
      onStart: () => {
        SOUNDS.POP.play();
        delayedCall(0.2, ()=>SOUNDS.POP.play());
        delayedCall(0.4, ()=>SOUNDS.POP.play());
      },
      ease:'Elastic.easeOut', duration:0.2, stagger:0.2, scaleY:1
    }, 0.2);

const FLAME_TL = () =>
  timeline()
    .to('.cake__candle', { '--flame':1, stagger:0.2, duration:0.1 })
    .to('body', { '--flame':1, '--lightness':5, duration:0.2, delay:0.2 });

const LIGHTS_OUT = () =>
  timeline()
    .to('body', {
      onStart: ()=>SOUNDS.BLOW.play(),
      delay:0.5, '--lightness':0, duration:0.1,
      '--glow-saturation':0, '--glow-lightness':0, '--glow-alpha':1, '--transparency-alpha':1
    })
    .to('#dark-overlay', { opacity:1, duration:0.4 }, 0.5);

const RESET = () => {
  set('.char', { '--hue':()=>Math.random()*360, '--char-sat':0, '--char-light':0, x:0, y:0, opacity:1 });
  set('body', { '--frosting-hue':Math.random()*360, '--glow-saturation':50, '--glow-lightness':35, '--glow-alpha':0.4, '--transparency-alpha':0, '--flame':0 });
  set('.cake__candle', { '--flame':0 });
  to('#dark-overlay', { opacity:0, duration:0.5 });
  to('body', { '--lightness':8, duration:0.25 });
  set('.cake__frosting--end', { opacity:0 });
  set('#frosting', { transformOrigin:'50% 10%', scaleX:0, scaleY:0 });
  set('.cake__frosting-patch', { display:'none' });
  set(['.cake__frosting--duplicate','.cake__sprinkles--duplicate'], { x:-65 });
  set('.cake__face', { x:-110 });
  set('.cake__face--straining', { display:'none' });
  set('.cake__sprinkle', { '--sprinkle-hue':()=>Math.random()*360, scale:0, transformOrigin:'50% 50%' });
  set('.birthday-button', { scale:0.6, x:0, y:0 });
  set('.birthday-button__cake', { display:'none' });
  set('.cake__candle', { scaleY:0, transformOrigin:'50% 100%' });
};
RESET();

// ── Click counter & message ──
let clickCount = 0;
const badge = document.getElementById('click-badge');
const popup  = document.getElementById('msg-popup');
const messages = [
  { icon:'🥳🎉🎂', text:'Make a wish! ✨' },
  { icon:'🌟💫✨', text:'You\'re amazing! 🎈' },
  { icon:'🎁🎀🎊', text:'Wishing you joy! 💖' },
  { icon:'🦄🌈🎉', text:'Dreams come true! 🌟' },
  { icon:'🎆🎇✨', text:'Shine bright! 💫' },
];

function showPopup() {
  const m = messages[clickCount % messages.length];
  popup.querySelector('.popup-emojis').textContent = m.icon;
  popup.querySelector('span + *') && null;
  popup.childNodes[1].textContent = m.text;
  popup.classList.add('show');
  setTimeout(() => popup.classList.remove('show'), 2500);
}

// Fireworks burst on click
function burstFireworks(count = 4) {
  for (let i = 0; i < count; i++) {
    setTimeout(launchFirework, i * 250);
  }
}

const MASTER_TL = timeline({
  onStart: () => {
    SOUNDS.ON.play();
    clickCount++;
    badge.textContent = `🎊 Celebrations: ${clickCount}`;
    showPopup();
    startConfetti();
    burstFireworks(6);
  },
  onComplete: () => {
    delayedCall(2, RESET);
    BTN.removeAttribute('disabled');
  },
  paused: true,
})
  .set('.birthday-button__cake', { display:'block' })
  .to('.birthday-button', { onStart:()=>SOUNDS.CHEER.play(), scale:1, duration:0.2 })
  .to('.char', { '--char-sat':70, '--char-light':65, duration:0.2 }, 0)
  .to('.char', { onStart:()=>SOUNDS.HORN.play(), delay:0.75, y:()=>gsap.utils.random(-100,-200), x:()=>gsap.utils.random(-50,50), duration:()=>gsap.utils.random(0.5,1) })
  .to('.char', { opacity:0, duration:0.25 }, '>-0.5')
  .add(FROSTING_TL())
  .add(SPRINKLES_TL())
  .add(SPIN_TL())
  .add(SHAKE_TL())
  .add(FLAME_TL(), 'FLAME_ON')
  .add(LIGHTS_OUT(), 'LIGHTS_OUT');

SOUNDS.TUNE.onended = SOUNDS.MATCH.onended = () => MASTER_TL.play();
MASTER_TL.addPause('FLAME_ON',   ()=>SOUNDS.MATCH.play());
MASTER_TL.addPause('LIGHTS_OUT', ()=>SOUNDS.TUNE.play());

BTN.addEventListener('click', () => {
  BTN.setAttribute('disabled', true);
  MASTER_TL.restart();
});
