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

ctx.fillStyle = '#00d4ff';

function animate() {
  ctx.clearRect(0, 0, w, h);
  
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
