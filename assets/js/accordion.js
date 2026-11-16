/**
 * Accessible FAQ Accordion Functionality
 * Task 2 Implementation
 */

document.addEventListener('DOMContentLoaded', () => {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');

    if (!header || !content) return;

    // Initialize initial state
    if (item.classList.contains('active')) {
      content.style.maxHeight = content.scrollHeight + 'px';
      header.setAttribute('aria-expanded', 'true');
    } else {
      content.style.maxHeight = '0px';
      header.setAttribute('aria-expanded', 'false');
    }

    header.addEventListener('click', () => {
      const isCurrentlyActive = item.classList.contains('active');

      // Optional: Close other open accordion items for clean UX
      accordionItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherHeader = otherItem.querySelector('.accordion-header');
          const otherContent = otherItem.querySelector('.accordion-content');
          if (otherContent) otherContent.style.maxHeight = '0px';
          if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isCurrentlyActive) {
        item.classList.remove('active');
        content.style.maxHeight = '0px';
        header.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Recalculate max-height on window resize to prevent layout clipping
  window.addEventListener('resize', () => {
    const activeItem = document.querySelector('.accordion-item.active');
    if (activeItem) {
      const activeContent = activeItem.querySelector('.accordion-content');
      if (activeContent) {
        activeContent.style.maxHeight = activeContent.scrollHeight + 'px';
      }
    }
  }, { passive: true });
});
