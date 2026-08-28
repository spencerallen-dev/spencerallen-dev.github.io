// Fade-in content
window.addEventListener('load', () => {
  const main = document.querySelector('.main-content');
  main.classList.add('visible');
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
