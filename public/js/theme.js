// Theme Toggle - Light/Dark Mode
(function() {
  const THEME_KEY = 'an-luxury-theme';
  const htmlElement = document.documentElement;

  function setTheme(theme) {
    if (theme === 'dark') {
      htmlElement.classList.add('dark-mode');
    } else {
      htmlElement.classList.remove('dark-mode');
    }
    localStorage.setItem(THEME_KEY, theme);
  }

  // Initialize theme on page load
  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    // Default is dark mode (the original design)
    const theme = saved || 'dark';
    setTheme(theme);
  }

  // Run immediately
  initTheme();

  // Bind toggle button after DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const isDark = htmlElement.classList.contains('dark-mode');
        setTheme(isDark ? 'light' : 'dark');
      });
    }
  });
})();
