// Fade-in content
window.addEventListener('load', () => {
  const main = document.querySelector('.main-content');
  const buttons = document.querySelectorAll('.buttons a');
  main.classList.add('visible');
  buttons.forEach((btn, i) => setTimeout(() => btn.classList.add('visible'), i * 200));
});

// Secret click spot login modal handler
document.addEventListener('DOMContentLoaded', () => {
  const secretSpot = document.getElementById('secret-spot');
  if (secretSpot) {
    secretSpot.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.netlifyIdentity) {
        const user = window.netlifyIdentity.currentUser();
        if (user) {
          window.location.href = 'private/';
        } else {
          window.netlifyIdentity.open('login');
          window.netlifyIdentity.on('login', () => {
            window.location.href = 'private/';
          });
        }
      } else {
        window.location.href = 'private/';
      }
    });
  }
});

// Particle background with resize & BFCache resilience
const canvas = document.getElementById('bg');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;
  let animId = null;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * (w || window.innerWidth);
      this.y = Math.random() * (h || window.innerHeight);
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2 + 1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
    }
  }

  particles = [];
  for (let i = 0; i < 100; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#00d4ff';
    
    ctx.beginPath();
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.update();
      ctx.moveTo(p.x + p.size, p.y);
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    }
    ctx.fill();
    
    animId = requestAnimationFrame(animate);
  }

  if (animId) cancelAnimationFrame(animId);
  animate();

  window.addEventListener('pageshow', (event) => {
    resize();
    if (animId) cancelAnimationFrame(animId);
    animate();
  });
}
