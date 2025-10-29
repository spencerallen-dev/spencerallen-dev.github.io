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
    if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
  }
  draw() {
    ctx.fillStyle = '#00d4ff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

for (let i = 0; i < 100; i++) particles.push(new Particle());

function animate() {
  ctx.clearRect(0, 0, w, h);
  particles.forEach(p => { p.update(); p.draw(); });
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
  fetch('posts.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load posts');
      }
      return response.json();
    })
    .then(posts => {
      if (posts.length === 0) {
        container.innerHTML = '<div class="loading-message">No posts yet. Check back soon!</div>';
        return;
      }
      
      // Sort posts by date (newest first)
      posts.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      container.innerHTML = posts.map(post => `
        <article class="blog-post">
          <h3>${post.title}</h3>
          <span class="post-date">${formatDate(post.date)}</span>
          <p class="post-excerpt">${post.excerpt}</p>
          <a href="?post=${post.id}" class="read-more">Read More →</a>
        </article>
      `).join('');
    })
    .catch(error => {
      console.error('Error loading posts:', error);
      container.innerHTML = '<div class="error-message">Failed to load blog posts. Please try again later.</div>';
    });
}

function loadSinglePost(postId, container) {
  fetch('posts.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load posts');
      }
      return response.json();
    })
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
      document.title = `${post.title} – Spencer Allen`;
      
      container.innerHTML = `
        <div class="post-content">
          <h2>${post.title}</h2>
          <span class="post-date">${formatDate(post.date)}</span>
          <p>${post.content}</p>
        </div>
        <div style="text-align: center;">
          <a href="./" class="back-link">← Back to Blog</a>
        </div>
      `;
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
