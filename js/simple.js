// Fade-in content (simpler version without button animations)
window.addEventListener('load', () => {
  const main = document.querySelector('.main-content');
  main.classList.add('visible');
});

// Particle background with text box avoidance physics
const canvas = document.getElementById('bg');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;
  let animId = null;
  let cachedBoxes = [];
  let lastBoxUpdate = 0;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    updateObstacleBoxes();
  }
  window.addEventListener('resize', resize);

  function updateObstacleBoxes() {
    const selectors = [
      '.main-content',
      '.blog-container',
      '.blog-post',
      '.post-content',
      '.game-card',
      '.tech-card',
      '.admin-container',
      '.aviation-container',
      'header'
    ];
    cachedBoxes = [];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          cachedBoxes.push({
            left: rect.left,
            right: rect.right,
            top: rect.top,
            bottom: rect.bottom
          });
        }
      });
    });
  }

  window.addEventListener('scroll', updateObstacleBoxes, { passive: true });

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * (w || window.innerWidth);
      this.y = Math.random() * (h || window.innerHeight);
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.size = Math.random() * 2 + 1;
      this.avoidBoxes();
    }
    avoidBoxes() {
      const padding = 10;
      for (let i = 0; i < cachedBoxes.length; i++) {
        const b = cachedBoxes[i];
        if (this.x > b.left - padding && this.x < b.right + padding &&
            this.y > b.top - padding && this.y < b.bottom + padding) {
          
          const distLeft = Math.abs(this.x - (b.left - padding));
          const distRight = Math.abs(this.x - (b.right + padding));
          const distTop = Math.abs(this.y - (b.top - padding));
          const distBottom = Math.abs(this.y - (b.bottom + padding));

          const minDist = Math.min(distLeft, distRight, distTop, distBottom);

          if (minDist === distLeft) { this.x = b.left - padding; this.vx = -Math.abs(this.vx); }
          else if (minDist === distRight) { this.x = b.right + padding; this.vx = Math.abs(this.vx); }
          else if (minDist === distTop) { this.y = b.top - padding; this.vy = -Math.abs(this.vy); }
          else { this.y = b.bottom + padding; this.vy = Math.abs(this.vy); }
        }
      }
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) { this.x = 0; this.vx *= -1; }
      if (this.x > w) { this.x = w; this.vx *= -1; }
      if (this.y < 0) { this.y = 0; this.vy *= -1; }
      if (this.y > h) { this.y = h; this.vy *= -1; }

      this.avoidBoxes();
    }
  }

  resize();
  particles = [];
  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function animate(timestamp) {
    if (timestamp - lastBoxUpdate > 500) {
      updateObstacleBoxes();
      lastBoxUpdate = timestamp;
    }

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--particle-color').trim() || '#00d4ff';
    
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
  animate(0);

  window.addEventListener('pageshow', () => {
    resize();
    if (animId) cancelAnimationFrame(animId);
    animate(0);
  });
}
