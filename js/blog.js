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
  animate(0);

  window.addEventListener('pageshow', () => {
    resize();
    if (animId) cancelAnimationFrame(animId);
    animate(0);
  });
}

// Blog functionality
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function getPostIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('post');
}

// Simple HTML escape function to prevent XSS - optimized
function escapeHtml(text) {
  // Use a map for faster lookups instead of creating DOM elements
  const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return String(text).replace(/[&<>"']/g, char => escapeMap[char]);
}

// Fetch posts with caching to reduce duplication
function fetchPosts() {
  return fetch('posts.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load posts');
      }
      return response.json();
    });
}

function loadBlogPosts() {
  const blogContainer = document.getElementById('blog-posts');
  const postId = getPostIdFromUrl();
  
  if (postId) {
    // Load single post
    loadSinglePost(postId, blogContainer);
  } else {
    // Load all posts
    loadAllPosts(blogContainer);
  }
}

function loadAllPosts(container) {
  fetchPosts()
    .then(posts => {
      if (posts.length === 0) {
        container.innerHTML = '<div class="loading-message">No posts yet. Check back soon!</div>';
        return;
      }
      
      // Sort posts by date (newest first)
      posts.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Use DocumentFragment for better performance
      const fragment = document.createDocumentFragment();
      posts.forEach(post => {
        const article = document.createElement('article');
        article.className = 'blog-post';
        
        const h3 = document.createElement('h3');
        h3.textContent = post.title;
        
        const dateSpan = document.createElement('span');
        dateSpan.className = 'post-date';
        dateSpan.textContent = formatDate(post.date);
        
        const excerpt = document.createElement('p');
        excerpt.className = 'post-excerpt';
        excerpt.textContent = post.excerpt;
        
        const link = document.createElement('a');
        link.href = '?post=' + encodeURIComponent(post.id);
        link.className = 'read-more';
        link.textContent = 'Read More →';
        
        article.appendChild(h3);
        article.appendChild(dateSpan);
        article.appendChild(excerpt);
        article.appendChild(link);
        fragment.appendChild(article);
      });
      
      container.innerHTML = '';
      container.appendChild(fragment);
    })
    .catch(error => {
      console.error('Error loading posts:', error);
      container.innerHTML = '<div class="error-message">Failed to load blog posts. Please try again later.</div>';
    });
}

function loadSinglePost(postId, container) {
  fetchPosts()
    .then(posts => {
      const post = posts.find(p => p.id === postId);
      
      if (!post) {
        container.innerHTML = `
          <div class="error-message">
            Post not found.
            <br><br>
            <a href="./" class="back-link">← Back to Blog</a>
          </div>
        `;
        return;
      }
      
      // Update page title
      document.title = post.title + ' – Spencer Allen';
      
      // Use DOM methods for better performance
      const postDiv = document.createElement('div');
      postDiv.className = 'post-content';
      
      const h2 = document.createElement('h2');
      h2.textContent = post.title;
      
      const dateSpan = document.createElement('span');
      dateSpan.className = 'post-date';
      dateSpan.textContent = formatDate(post.date);
      
      const content = document.createElement('p');
      content.textContent = post.content;
      
      postDiv.appendChild(h2);
      postDiv.appendChild(dateSpan);
      postDiv.appendChild(content);
      
      const backDiv = document.createElement('div');
      backDiv.className = 'back-link-container';
      
      const backLink = document.createElement('a');
      backLink.href = './';
      backLink.className = 'back-link';
      backLink.textContent = '← Back to Blog';
      
      backDiv.appendChild(backLink);
      
      container.innerHTML = '';
      container.appendChild(postDiv);
      container.appendChild(backDiv);
    })
    .catch(error => {
      console.error('Error loading post:', error);
      container.innerHTML = `
        <div class="error-message">
          Failed to load post. Please try again later.
          <br><br>
          <a href="./" class="back-link">← Back to Blog</a>
        </div>
      `;
    });
}

// Load posts when page is ready
if (document.getElementById('blog-posts')) {
  loadBlogPosts();
}
