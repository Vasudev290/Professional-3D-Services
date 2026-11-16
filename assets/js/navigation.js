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
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
  }

  // Hamburger toggle click
  hamburgerBtn.addEventListener('click', () => toggleMenu());

  // Backdrop click to close
  mobileBackdrop.addEventListener('click', () => toggleMenu(false));

  // Close drawer when any mobile nav link is clicked
  mobileNavLinks.forEach(link => {
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
});
