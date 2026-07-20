// Fade-in content
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
  window.addEventListener('load', resize);

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

// Dynamic Flight Computer Logic
let planesData = [];

function fetchPlanes() {
  const gridContainer = document.getElementById('aircraft-grid');
  
  fetch('planes.json')
    .then(response => {
      if (!response.ok) throw new Error('System telemetry loading failed');
      return response.json();
    })
    .then(data => {
      planesData = data;
      renderPlanesList();
      checkUrlParams();
    })
    .catch(error => {
      console.error(error);
      if (gridContainer) {
        gridContainer.innerHTML = `<div class="error-message">SYSTEM ERROR: Failed to load aircraft database. Please refresh.</div>`;
      }
    });
}

function renderPlanesList() {
  const gridContainer = document.getElementById('aircraft-grid');
  if (!gridContainer) return;
  
  gridContainer.innerHTML = '';
  const fragment = document.createDocumentFragment();
  
  planesData.forEach(plane => {
    const card = document.createElement('div');
    card.className = `aircraft-card ${plane.theme}`;
    card.setAttribute('data-id', plane.id);
    
    const header = document.createElement('div');
    header.className = 'aircraft-card-header';
    
    const h3 = document.createElement('h3');
    h3.textContent = plane.name;
    
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = plane.tag;
    
    header.appendChild(h3);
    header.appendChild(badge);
    
    const p = document.createElement('p');
    p.textContent = plane.summary;
    
    const btn = document.createElement('button');
    btn.className = 'initialize-btn';
    btn.textContent = 'SYS_LOAD //';
    
    card.appendChild(header);
    card.appendChild(p);
    card.appendChild(btn);
    
    card.addEventListener('click', () => {
      loadPlaneDetail(plane.id);
    });
    
    fragment.appendChild(card);
  });
  
  gridContainer.appendChild(fragment);
}

function loadPlaneDetail(planeId, skipPushState = false) {
  const plane = planesData.find(p => p.id === planeId);
  if (!plane) return;
  
  const gridContainer = document.getElementById('aircraft-grid');
  const detailContainer = document.getElementById('detail-panel-container');
  const detailContent = document.getElementById('detail-content');
  const backButton = document.getElementById('back-btn');
  
  if (!gridContainer || !detailContainer || !detailContent) return;
  
  // Set back button theme class to match the selected plane's theme
  if (backButton) {
    backButton.className = 'back-btn';
    // The panel container will host the specific theme variables
    detailContainer.className = `detail-panel-container ${plane.theme}`;
  }
  
  // Render Specifications table
  let specsRows = '';
  for (const [key, value] of Object.entries(plane.specs)) {
    specsRows += `
      <tr>
        <th>${escapeHtml(key)}</th>
        <td>${escapeHtml(value)}</td>
      </tr>
    `;
  }
  
  // Render Operators
  let operatorsHtml = '';
  if (plane.operators && plane.operators.length > 0) {
    plane.operators.forEach(op => {
      const isClassified = op.status.toLowerCase().includes('classified') || op.status.toLowerCase().includes('secret');
      const statusClass = isClassified ? 'badge-secret' : '';
      operatorsHtml += `
        <div class="operator-card">
          <h4>${escapeHtml(op.name)} <span class="badge ${statusClass}">${escapeHtml(op.status)}</span></h4>
          <p>${escapeHtml(op.desc)}</p>
        </div>
      `;
    });
  }
  
  // Build Full Panel HTML
  detailContent.innerHTML = `
    <div class="aviation-detail-panel">
      <h2>${escapeHtml(plane.name)}</h2>
      <div class="detail-tagline">${escapeHtml(plane.tag)}</div>
      
      <div class="detail-img-container">
        <img src="${escapeHtml(plane.image)}" alt="${escapeHtml(plane.name)} view" class="detail-img">
      </div>
      
      <div class="detail-section">
        <h3>🚀 History & Design</h3>
        <p>${plane.story.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>
      </div>
      
      <div class="detail-section">
        <h3>📊 Technical Specifications</h3>
        <table class="specs-table">
          <tbody>
            ${specsRows}
          </tbody>
        </table>
      </div>
      
      <div class="detail-section">
        <h3>✈️ Active Fleets & Operators</h3>
        <div class="operators-grid">
          ${operatorsHtml}
        </div>
      </div>
    </div>
  `;
  
  // Smooth swapping animations
  gridContainer.classList.add('hidden');
  
  setTimeout(() => {
    gridContainer.style.display = 'none';
    detailContainer.style.display = 'block';
    
    // Force reflow
    detailContainer.offsetHeight;
    
    detailContainer.classList.add('visible');
    
    // Update Page Title
    document.title = `${plane.name} – Aviation – Spencer Allen`;
    
    // Push history state for shareability
    if (!skipPushState) {
      const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?plane=' + encodeURIComponent(planeId);
      window.history.pushState({ planeId: planeId }, '', newUrl);
    }
  }, 300);
}

function showListLayout(skipPushState = false) {
  const gridContainer = document.getElementById('aircraft-grid');
  const detailContainer = document.getElementById('detail-panel-container');
  
  if (!gridContainer || !detailContainer) return;
  
  detailContainer.classList.remove('visible');
  
  setTimeout(() => {
    detailContainer.style.display = 'none';
    gridContainer.style.display = 'grid';
    
    // Force reflow
    gridContainer.offsetHeight;
    
    gridContainer.classList.remove('hidden');
    document.title = 'Aviation – Spencer Allen';
    
    if (!skipPushState) {
      const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.pushState({ planeId: null }, '', cleanUrl);
    }
  }, 300);
}

function checkUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const planeId = params.get('plane');
  if (planeId && planesData.some(p => p.id === planeId)) {
    loadPlaneDetail(planeId, true);
  }
}

// Simple HTML escape function to prevent XSS
function escapeHtml(text) {
  const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return String(text).replace(/[&<>"']/g, char => escapeMap[char]);
}

// Listen to browser back/forward buttons
window.addEventListener('popstate', (event) => {
  if (event.state && event.state.planeId) {
    loadPlaneDetail(event.state.planeId, true);
  } else {
    showListLayout(true);
  }
});

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  fetchPlanes();
  
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      showListLayout();
    });
  }
});
