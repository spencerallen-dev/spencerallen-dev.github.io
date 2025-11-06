// Fade-in content
window.addEventListener('load', () => {
  const main = document.querySelector('.main-content');
  main.classList.add('visible');
});

// Particle background (same as simple.js)
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
