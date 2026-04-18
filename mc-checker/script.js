const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let particles = [];
let w;
let h;

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
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 2 + 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) {
      this.reset();
    }
  }
}

for (let i = 0; i < 100; i += 1) {
  particles.push(new Particle());
}

ctx.fillStyle = '#00d4ff';

function animate() {
  ctx.clearRect(0, 0, w, h);
  ctx.beginPath();
  for (let i = 0; i < particles.length; i += 1) {
    const p = particles[i];
    p.update();
    ctx.moveTo(p.x + p.size, p.y);
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
  }
  ctx.fill();
  requestAnimationFrame(animate);
}
animate();

const checkerForm = document.getElementById('checkerForm');
const serverInput = document.getElementById('serverInput');
const checkBtn = document.getElementById('checkBtn');
const progressBar = document.getElementById('progressBar');
const statusMessage = document.getElementById('statusMessage');
const resultsText = document.getElementById('resultsText');

checkerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  await checkServer();
});

function setStatus(type, message) {
  statusMessage.className = `mc-status-message ${type}`.trim();
  statusMessage.textContent = message;
}

function setLoading(isLoading) {
  checkBtn.disabled = isLoading;
  progressBar.classList.toggle('active', isLoading);
}

function isLikelyValidHost(input) {
  if (input.length < 1 || input.length > 253 || /\s/.test(input)) {
    return false;
  }
  return /^[a-zA-Z0-9._:-]+$/.test(input);
}

function readMotd(motd) {
  if (!motd) {
    return '';
  }
  if (Array.isArray(motd.clean)) {
    return motd.clean.join('\n').trim();
  }
  if (typeof motd.clean === 'string') {
    return motd.clean.trim();
  }
  if (Array.isArray(motd.html)) {
    return motd.html.join(' ').replace(/<[^>]*>/g, '').trim();
  }
  return '';
}

async function checkServer() {
  const host = serverInput.value.trim();

  if (!host) {
    setStatus('error', 'Please enter a server address.');
    resultsText.textContent = 'No server was provided.';
    resultsText.className = 'server-offline';
    return;
  }

  if (!isLikelyValidHost(host)) {
    setStatus('error', 'That server address format looks invalid.');
    resultsText.textContent = `Invalid host: ${host}`;
    resultsText.className = 'server-offline';
    return;
  }

  setLoading(true);
  setStatus('loading', `Checking ${host}...`);
  resultsText.className = '';
  resultsText.textContent = 'Querying API...';

  try {
    const response = await fetch(`https://api.mcsrvstat.us/2/${encodeURIComponent(host)}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!data || typeof data !== 'object' || !('online' in data)) {
      throw new Error('Unexpected API response format');
    }

    renderResults(host, data);
  } catch (error) {
    setStatus('error', 'Could not check server right now.');
    resultsText.className = 'server-offline';
    resultsText.textContent = [
      `Host: ${host}`,
      '',
      'Error checking server.',
      `Details: ${error.message}`,
      '',
      'Try again shortly. If the issue persists, the API may be unavailable.',
    ].join('\n');
  } finally {
    setLoading(false);
  }
}

function renderResults(host, data) {
  const isOnline = Boolean(data.online);
  const version = typeof data.version === 'string' && data.version ? data.version : 'Unknown';
  const serverHost = typeof data.hostname === 'string' && data.hostname ? data.hostname : host;
  const playersOnline = data.players && Number.isFinite(data.players.online) ? data.players.online : 0;
  const playersMax = data.players && Number.isFinite(data.players.max) ? data.players.max : 'Unknown';
  const motdText = readMotd(data.motd) || 'No MOTD provided.';

  if (isOnline) {
    setStatus('success', 'Server is online.');
    resultsText.className = 'server-online';
  } else {
    setStatus('error', 'Server is offline or unreachable.');
    resultsText.className = 'server-offline';
  }

  resultsText.textContent = [
    `Status: ${isOnline ? 'ONLINE' : 'OFFLINE'}`,
    `Server: ${serverHost}`,
    `IP: ${typeof data.ip === 'string' && data.ip ? data.ip : 'Unknown'}`,
    `Version: ${version}`,
    `Players: ${playersOnline}/${playersMax}`,
    '',
    'MOTD:',
    motdText,
  ].join('\n');
}
