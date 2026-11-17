/**
 * Main Application Script & Core Performance Enhancements
 * Tasks 1, 2 & 6 Implementation
 */

document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll with sticky header offset for all anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const header = document.querySelector('.site-header');
  const headerHeight = header ? header.offsetHeight : 80;

  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 10;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Intersection Observer for Active Navigation Highlighting
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
  }

  // Working Verticals / Industries Carousel Controls
  const industriesTrack = document.getElementById('industriesTrack');
  const indPrevBtn = document.getElementById('indPrevBtn');
  const indNextBtn = document.getElementById('indNextBtn');

  if (industriesTrack && indPrevBtn && indNextBtn) {
    const getScrollStep = () => {
      const card = industriesTrack.querySelector('.industry-card');
      return card ? card.offsetWidth + 24 : 240;
    };

    indPrevBtn.addEventListener('click', () => {
      industriesTrack.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
    });

    indNextBtn.addEventListener('click', () => {
      industriesTrack.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
    });

    const updateArrowStates = () => {
      const atStart = industriesTrack.scrollLeft <= 4;
      const atEnd = industriesTrack.scrollLeft + industriesTrack.clientWidth >= industriesTrack.scrollWidth - 4;
      indPrevBtn.style.opacity = atStart ? '0.4' : '1';
      indPrevBtn.style.pointerEvents = atStart ? 'none' : 'auto';
      indNextBtn.style.opacity = atEnd ? '0.4' : '1';
      indNextBtn.style.pointerEvents = atEnd ? 'none' : 'auto';
    };

    industriesTrack.addEventListener('scroll', updateArrowStates, { passive: true });
    window.addEventListener('resize', updateArrowStates);
    setTimeout(updateArrowStates, 100);
  }

  // Showcase / Portfolio Carousel Controls
  const showcaseTrack = document.getElementById('showcaseTrack');
  const showcasePrevBtn = document.getElementById('showcasePrevBtn');
  const showcaseNextBtn = document.getElementById('showcaseNextBtn');
  const showcaseSidePrev = document.getElementById('showcaseSidePrev');
  const showcaseSideNext = document.getElementById('showcaseSideNext');
  const showcaseDots = document.querySelectorAll('.showcase-dot');

  if (showcaseTrack) {
    const getCardWidth = () => {
      const card = showcaseTrack.querySelector('.showcase-card');
      return card ? card.offsetWidth + 24 : 260;
    };

    const scrollShowcase = (direction) => {
      showcaseTrack.scrollBy({ left: direction * getCardWidth(), behavior: 'smooth' });
    };

    if (showcasePrevBtn) showcasePrevBtn.addEventListener('click', () => scrollShowcase(-1));
    if (showcaseNextBtn) showcaseNextBtn.addEventListener('click', () => scrollShowcase(1));
    if (showcaseSidePrev) showcaseSidePrev.addEventListener('click', () => scrollShowcase(-1));
    if (showcaseSideNext) showcaseSideNext.addEventListener('click', () => scrollShowcase(1));

    showcaseDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index'), 10);
        showcaseTrack.scrollTo({ left: index * getCardWidth(), behavior: 'smooth' });
      });
    });

    const updateShowcaseState = () => {
      const scrollPos = showcaseTrack.scrollLeft;
      const cardWidth = getCardWidth();
      const activeIndex = Math.min(
        showcaseDots.length - 1,
        Math.max(0, Math.round(scrollPos / cardWidth))
      );

      showcaseDots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === activeIndex);
      });

      const atStart = scrollPos <= 4;
      const atEnd = scrollPos + showcaseTrack.clientWidth >= showcaseTrack.scrollWidth - 4;

      if (showcasePrevBtn) showcasePrevBtn.style.opacity = atStart ? '0.3' : '1';
      if (showcaseNextBtn) showcaseNextBtn.style.opacity = atEnd ? '0.3' : '1';
      if (showcaseSidePrev) showcaseSidePrev.style.opacity = atStart ? '0.3' : '1';
      if (showcaseSideNext) showcaseSideNext.style.opacity = atEnd ? '0.3' : '1';
    };

    showcaseTrack.addEventListener('scroll', updateShowcaseState, { passive: true });
    window.addEventListener('resize', updateShowcaseState);
    setTimeout(updateShowcaseState, 100);
  }

  // Testimonials Carousel Controls
  const testimonialsTrack = document.getElementById('testimonialsTrack');
  const testPrevBtn = document.getElementById('testPrevBtn');
  const testNextBtn = document.getElementById('testNextBtn');

  if (testimonialsTrack && testPrevBtn && testNextBtn) {
    const getTestCardWidth = () => {
      const card = testimonialsTrack.querySelector('.testimonial-card');
      return card ? card.offsetWidth + 24 : 344;
    };

    testPrevBtn.addEventListener('click', () => {
      testimonialsTrack.scrollBy({ left: -getTestCardWidth(), behavior: 'smooth' });
    });

    testNextBtn.addEventListener('click', () => {
      testimonialsTrack.scrollBy({ left: getTestCardWidth(), behavior: 'smooth' });
    });

    const updateTestArrowStates = () => {
      const scrollPos = testimonialsTrack.scrollLeft;
      const atStart = scrollPos <= 4;
      const atEnd = scrollPos + testimonialsTrack.clientWidth >= testimonialsTrack.scrollWidth - 4;
      testPrevBtn.style.opacity = atStart ? '0.4' : '1';
      testPrevBtn.style.pointerEvents = atStart ? 'none' : 'auto';
      testNextBtn.style.opacity = atEnd ? '0.4' : '1';
      testNextBtn.style.pointerEvents = atEnd ? 'none' : 'auto';
    };

    testimonialsTrack.addEventListener('scroll', updateTestArrowStates, { passive: true });
    window.addEventListener('resize', updateTestArrowStates);
    setTimeout(updateTestArrowStates, 100);
  }

  // Insights / Success Stories Carousel Controls (Figma Implementation)
  const insightsTrack = document.getElementById('insightsTrack');
  const insightsPrevBtn = document.getElementById('insightsPrevBtn');
  const insightsNextBtn = document.getElementById('insightsNextBtn');
  const insightsDots = document.querySelectorAll('.insights-dot');

  if (insightsTrack) {
    const getCardWidth = () => {
      const card = insightsTrack.querySelector('.insights-card');
      return card ? card.offsetWidth + 32 : 380;
    };

    if (insightsPrevBtn) {
      insightsPrevBtn.addEventListener('click', () => {
        insightsTrack.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
      });
    }

    if (insightsNextBtn) {
      insightsNextBtn.addEventListener('click', () => {
        insightsTrack.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
      });
    }

    insightsDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        insightsTrack.scrollTo({ left: index * getCardWidth(), behavior: 'smooth' });
      });
    });

    const updateInsightsDots = () => {
      const cardWidth = getCardWidth();
      const activeIndex = Math.min(
        insightsDots.length - 1,
        Math.max(0, Math.round(insightsTrack.scrollLeft / cardWidth))
      );
      insightsDots.forEach((dot, idx) => {
        dot.classList.toggle('is-active', idx === activeIndex);
      });
    };

    insightsTrack.addEventListener('scroll', updateInsightsDots, { passive: true });
    window.addEventListener('resize', updateInsightsDots);
  }

  // Interactive Captcha Generation & Verification
  const captchaDisplay = document.getElementById('captchaDisplay');
  const refreshCaptchaBtn = document.getElementById('refreshCaptchaBtn');
  const captchaInput = document.getElementById('captchaInput');

  if (captchaDisplay) {
    const generateCaptcha = () => {
      const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
      let code = '';
      for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    let currentCaptcha = generateCaptcha();
    captchaDisplay.textContent = currentCaptcha;

    if (refreshCaptchaBtn) {
      refreshCaptchaBtn.addEventListener('click', () => {
        currentCaptcha = generateCaptcha();
        captchaDisplay.textContent = currentCaptcha;
        if (captchaInput) captchaInput.value = '';
      });
    }
  }

  // Core Web Vitals Monitoring (Console log for QA and verification)
  if ('PerformanceObserver' in window) {
    try {
      const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log(`[Core Web Vitals] LCP: ${Math.round(entry.startTime)}ms`);
          }
          if (entry.entryType === 'first-input') {
            console.log(`[Core Web Vitals] FID: ${Math.round(entry.processingStart - entry.startTime)}ms`);
          }
        }
      });
      perfObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      perfObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      // Observer not supported in older browser engines
    }
  }
});
