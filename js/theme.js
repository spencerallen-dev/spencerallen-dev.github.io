// Universal Theme Manager (Dark / Light Mode)
(function() {
  // Apply theme immediately before DOM render to prevent flashing
  const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();

function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const updateToggleState = () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    toggleBtn.innerHTML = isLight ? '☀️ Light' : '🌙 Dark';
    toggleBtn.setAttribute('title', isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode');
  };

  updateToggleState();

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    if (newTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    localStorage.setItem('theme', newTheme);
    updateToggleState();
  });
}

document.addEventListener('DOMContentLoaded', initThemeToggle);
