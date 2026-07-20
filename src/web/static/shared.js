(function () {
  // Initialize theme immediately to prevent FOUC (Flash of Unstyled Content)
  const savedTheme = localStorage.getItem('selected-theme') || 'glassmorphism';
  document.documentElement.className = 'theme-' + savedTheme;

  // Sync selector control if it exists in the DOM
  function syncThemeSelector() {
    const selector = document.getElementById('theme-selector');
    if (selector) {
      selector.value = savedTheme;
    }
  }

  // Global helper to switch themes
  window.changeTheme = function (theme) {
    document.documentElement.className = 'theme-' + theme;
    localStorage.setItem('selected-theme', theme);
  };

  // Setup UI elements on DOM Ready
  window.addEventListener('DOMContentLoaded', function () {
    syncThemeSelector();

    let popover = document.getElementById('info-popover');
    if (!popover) {
      popover = document.createElement('div');
      popover.id = 'info-popover';
      document.body.appendChild(popover);
    }

    let anchor = null;

    // Capture phase (true) so we fire before inline onclick handlers on parent elements.
    document.addEventListener('click', function (e) {
      const icon = e.target.closest('.info-icon');
      if (icon) {
        // Prevent parent handlers (e.g. table-header sort) from firing.
        e.stopPropagation();

        if (anchor === icon) {
          popover.classList.remove('visible');
          anchor = null;
          return;
        }

        anchor = icon;
        popover.textContent = icon.title || icon.dataset.tip || '';
        popover.classList.add('visible');

        const rect = icon.getBoundingClientRect();
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const scrollX = window.scrollX || document.documentElement.scrollLeft;
        popover.style.top = (rect.bottom + scrollY + 6) + 'px';
        popover.style.left = (rect.left + scrollX) + 'px';

        requestAnimationFrame(function () {
          const pr = popover.getBoundingClientRect();
          if (pr.right > window.innerWidth - 8) {
            popover.style.left = Math.max(8, window.innerWidth - pr.width - 8) + 'px';
          }
        });
      } else {
        popover.classList.remove('visible');
        anchor = null;
      }
    }, true);
  });
})();

