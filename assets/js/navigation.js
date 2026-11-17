/**
 * Responsive Mobile Navigation / Hamburger Menu
 * Task 2 Implementation
 */

document.addEventListener('DOMContentLoaded', () => {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileBackdrop = document.getElementById('mobileBackdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const siteHeader = document.getElementById('siteHeader');

  if (!hamburgerBtn || !mobileNav || !mobileBackdrop) return;

  function toggleMenu(isOpen) {
    const shouldOpen = typeof isOpen === 'boolean' ? isOpen : !mobileNav.classList.contains('is-open');
    
    hamburgerBtn.classList.toggle('is-active', shouldOpen);
    hamburgerBtn.setAttribute('aria-expanded', shouldOpen);

    const openIcon = hamburgerBtn.querySelector('.open-icon');
    const closeIcon = hamburgerBtn.querySelector('.close-icon');
    if (openIcon && closeIcon) {
      openIcon.style.display = shouldOpen ? 'none' : 'block';
      closeIcon.style.display = shouldOpen ? 'block' : 'none';
    }

    mobileNav.classList.toggle('is-open', shouldOpen);
    mobileBackdrop.classList.toggle('is-visible', shouldOpen);
    
    // Prevent background page from scrolling when menu is open
    document.documentElement.classList.toggle('menu-open', shouldOpen);
    document.body.classList.toggle('menu-open', shouldOpen);
    if (shouldOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
  }

  // Hamburger toggle click
  hamburgerBtn.addEventListener('click', () => toggleMenu());

  // Backdrop click to close
  mobileBackdrop.addEventListener('click', () => toggleMenu(false));

  // Prevent background touch scrolling on backdrop
  mobileBackdrop.addEventListener('touchmove', (e) => {
    e.preventDefault();
  }, { passive: false });

  // Close button inside drawer header
  const mobileCloseBtn = document.getElementById('mobileCloseBtn');
  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', () => toggleMenu(false));
  }

  // Mobile Accordion Toggle Handlers (Auto-close sibling primary accordions)
  const mobileAccordionToggles = mobileNav.querySelectorAll('.mobile-accordion-toggle');
  mobileAccordionToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const item = btn.closest('.mobile-accordion-item');
      if (!item) return;
      const willOpen = !item.classList.contains('is-open');

      // Close all other primary accordions so only one stays open
      if (willOpen) {
        mobileNav.querySelectorAll('.mobile-accordion-item').forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('is-open');
            const otherBtn = otherItem.querySelector('.mobile-accordion-toggle');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });
      }

      item.classList.toggle('is-open', willOpen);
      btn.setAttribute('aria-expanded', willOpen);
    });
  });

  // Mobile Sub-Accordion Toggle Handlers (Auto-close sibling sub-dropdowns)
  const mobileSubToggles = mobileNav.querySelectorAll('.mobile-sub-toggle');
  mobileSubToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const subItem = btn.closest('.mobile-sub-item');
      if (!subItem) return;
      const willOpen = !subItem.classList.contains('is-open');

      // Close sibling sub-items within the same parent panel
      if (willOpen) {
        const parentPanel = subItem.closest('.mobile-accordion-panel');
        if (parentPanel) {
          parentPanel.querySelectorAll('.mobile-sub-item').forEach(otherSub => {
            if (otherSub !== subItem) {
              otherSub.classList.remove('is-open');
              const otherBtn = otherSub.querySelector('.mobile-sub-toggle');
              if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            }
          });
        }
      }

      subItem.classList.toggle('is-open', willOpen);
      btn.setAttribute('aria-expanded', willOpen);
    });
  });

  // Close drawer when any leaf link is clicked
  const allMobileLinks = mobileNav.querySelectorAll('.mobile-nav-link, .mobile-sub-link, .mobile-direct-link, .mobile-nav-footer a');
  allMobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
      toggleMenu(false);
    }
  });

  // Header scroll shadow enhancement
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }, { passive: true });

  // =========================================================================
  // Desktop Mega Dropdown Interactions (Figma Implementation)
  // =========================================================================
  const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');
  const megaPanels = document.querySelectorAll('.mega-panel');
  const megaWrapper = document.getElementById('megaDropdownWrapper');
  let closeTimeout = null;

  function openDropdown(dropdownId, triggerItem) {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }

    // Deactivate previous active items
    dropdownItems.forEach(item => {
      item.classList.remove('is-active');
      const link = item.querySelector('.nav-link');
      if (link) link.setAttribute('aria-expanded', 'false');
    });

    megaPanels.forEach(panel => {
      panel.classList.remove('active');
    });

    // Activate target item and panel
    const targetPanel = document.getElementById(`panel-${dropdownId}`);
    if (targetPanel && triggerItem) {
      triggerItem.classList.add('is-active');
      const link = triggerItem.querySelector('.nav-link');
      if (link) link.setAttribute('aria-expanded', 'true');
      targetPanel.classList.add('active');
      siteHeader.classList.add('dropdown-open');
    }
  }

  function closeDropdown(immediate) {
    if (immediate) {
      if (closeTimeout) clearTimeout(closeTimeout);
      dropdownItems.forEach(item => {
        item.classList.remove('is-active');
        const link = item.querySelector('.nav-link');
        if (link) link.setAttribute('aria-expanded', 'false');
      });
      megaPanels.forEach(panel => panel.classList.remove('active'));
      siteHeader.classList.remove('dropdown-open');
      return;
    }

    closeTimeout = setTimeout(() => {
      dropdownItems.forEach(item => {
        item.classList.remove('is-active');
        const link = item.querySelector('.nav-link');
        if (link) link.setAttribute('aria-expanded', 'false');
      });
      megaPanels.forEach(panel => panel.classList.remove('active'));
      siteHeader.classList.remove('dropdown-open');
    }, 120);
  }

  dropdownItems.forEach(item => {
    const dropdownId = item.getAttribute('data-dropdown');

    // Hover triggers
    item.addEventListener('mouseenter', () => openDropdown(dropdownId, item));
    item.addEventListener('mouseleave', () => closeDropdown(false));

    // Focus triggers for accessibility
    item.addEventListener('focusin', () => openDropdown(dropdownId, item));

    // Click toggle on desktop
    const link = item.querySelector('.nav-link');
    if (link) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth > 991) {
          e.preventDefault();
          if (item.classList.contains('is-active')) {
            closeDropdown(true);
          } else {
            openDropdown(dropdownId, item);
          }
        }
      });
    }
  });

  if (megaWrapper) {
    megaWrapper.addEventListener('mouseenter', () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
        closeTimeout = null;
      }
    });

    megaWrapper.addEventListener('mouseleave', () => closeDropdown(false));
  }

  // Close on click outside or Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && siteHeader.classList.contains('dropdown-open')) {
      closeDropdown(true);
    }
  });

  document.addEventListener('click', (e) => {
    if (!siteHeader.contains(e.target)) {
      closeDropdown(true);
    }
  });
});
