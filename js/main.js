// Fade-in content
window.addEventListener('load', () => {
  const main = document.querySelector('.main-content');
  const buttons = document.querySelectorAll('.buttons a');
  if (main) main.classList.add('visible');
  buttons.forEach((btn, i) => setTimeout(() => btn.classList.add('visible'), i * 200));
});

// Particle background - Dense ambient glowing blue dots across the entire screen
const canvas = document.getElementById('bg');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;
  let animId = null;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    initParticles();
  }
  window.addEventListener('resize', resize);
  window.addEventListener('load', resize);

  class Particle {
    constructor() {
      this.reset(true);
    }
    reset(initial = false) {
      this.x = Math.random() * (w || window.innerWidth);
      this.y = initial ? Math.random() * (h || window.innerHeight) : (Math.random() > 0.5 ? 0 : (h || window.innerHeight));
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.size = Math.random() * 2.4 + 1.0;
      this.baseAlpha = Math.random() * 0.55 + 0.4;
      this.alpha = this.baseAlpha;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += this.pulseSpeed;
      this.alpha = this.baseAlpha + Math.sin(this.pulse) * 0.25;

      if (this.x < -10) this.x = w + 10;
      if (this.x > w + 10) this.x = -10;
      if (this.y < -10) this.y = h + 10;
      if (this.y > h + 10) this.y = -10;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${Math.max(0.15, Math.min(1, this.alpha))})`;
      ctx.shadowBlur = this.size > 2 ? 8 : 4;
      ctx.shadowColor = '#00d4ff';
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(350, Math.max(160, Math.floor(((w || window.innerWidth) * (h || window.innerHeight)) / 4000)));
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    
    animId = requestAnimationFrame(animate);
  }

  resize();
  if (animId) cancelAnimationFrame(animId);
  animate();

  window.addEventListener('pageshow', () => {
    resize();
    if (animId) cancelAnimationFrame(animId);
    animate();
  });
}
