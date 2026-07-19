// Fade-in content
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

// Comparative Widget Logic
const variantsData = {
  "600": {
    name: "737-600",
    seats: "108 - 130 (Max 149)",
    range: "5,648 km (3,050 nmi)",
    length: "31.2 m (102 ft 6 in)",
    wingspan: "34.3 m (112 ft 7 in)",
    engines: "CFM56-7B20 / CFM56-7B22",
    built: "69 units"
  },
  "700": {
    name: "737-700",
    seats: "126 - 149 (Max 149)",
    range: "6,010 km (3,245 nmi)",
    length: "33.6 m (110 ft 4 in)",
    wingspan: "34.3 m (35.8 m w/ winglets)",
    engines: "CFM56-7B20 / CFM56-7B24",
    built: "1,128 units"
  },
  "800": {
    name: "737-800",
    seats: "162 - 189 (Max 189)",
    range: "5,436 km (2,935 nmi)",
    length: "39.5 m (129 ft 6 in)",
    wingspan: "34.3 m (35.8 m w/ winglets)",
    engines: "CFM56-7B24 / CFM56-7B27",
    built: "4,977 units"
  },
  "900": {
    name: "737-900ER",
    seats: "177 - 189 (Max 220)",
    range: "5,460 km (2,950 nmi)",
    length: "42.1 m (138 ft 2 in)",
    wingspan: "34.3 m (35.8 m w/ winglets)",
    engines: "CFM56-7B26 / CFM56-7B27",
    built: "565 units"
  }
};

function initComparator() {
  const buttons = document.querySelectorAll('.compare-btn');
  
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const variantKey = btn.getAttribute('data-variant');
      
      // Update active button styling
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Update values in UI
      const data = variantsData[variantKey];
      if (data) {
        document.getElementById('comp-name').textContent = data.name;
        document.getElementById('comp-seats').textContent = data.seats;
        document.getElementById('comp-range').textContent = data.range;
        document.getElementById('comp-length').textContent = data.length;
        document.getElementById('comp-wingspan').textContent = data.wingspan;
        document.getElementById('comp-engines').textContent = data.engines;
        document.getElementById('comp-built').textContent = data.built;
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initComparator();
});
