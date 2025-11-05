// Fade-in content (simpler version without button animations)
window.addEventListener('load', () => {
  const main = document.querySelector('.main-content');
  main.classList.add('visible');
});

// Particle background
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let particles = [];
let w, h;

// Debounce resize events for better performance
let resizeTimeout;
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(resize, 150);
});
resize();

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
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

for (let i = 0; i < 100; i++) particles.push(new Particle());

// Set fill style once outside the loop
ctx.fillStyle = '#00d4ff';

function animate() {
  ctx.clearRect(0, 0, w, h);
  
  // Batch draw operations for better performance
  ctx.beginPath();
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.update();
    ctx.moveTo(p.x + p.size, p.y);
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
  }
  ctx.fill();
  
  requestAnimationFrame(animate);
}
animate();
