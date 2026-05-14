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

    // Mobile Menu Toggle
    const menuIcon = document.querySelector('.collapsed-menu-icon');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuIcon && navLinks) {
      menuIcon.addEventListener('click', function() {
        navLinks.classList.toggle('mobile-active');
        // Toggle icon between bars and X
        const icon = this.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    }
  });
})();
