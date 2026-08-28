// Permanent Dark Mode Enforcer
(function() {
  try {
    localStorage.removeItem('theme');
    document.documentElement.removeAttribute('data-theme');
  } catch (e) {}
})();

