/* ============================================
   A Invenção do Dia Azul — Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Navbar scroll effect ---
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // --- Active nav link on scroll ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const updateActiveLink = () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  };
  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // --- Mobile nav toggle ---
  const navToggle = document.getElementById('navToggle');
  const navLinksEl = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navLinksEl.classList.toggle('open');
  });

  // Close mobile nav on link click
  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinksEl.classList.remove('open');
    });
  });

  // --- Scroll reveal animations ---
  const revealElements = document.querySelectorAll(
    '.section-header, .gallery-item, .process-step, .offering-card, .kit-card, .process-photos, .about-content, .contact-content'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Language toggle ---
  const langBtns = document.querySelectorAll('.lang-btn');
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      langBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const hash = anchor.getAttribute('href');

      // Skip Snipcart's own routes (e.g. #/cart, #/checkout) — let Snipcart handle them
      if (hash.startsWith('#/')) return;

      e.preventDefault();

      // If the Snipcart overlay is open (e.g. after placing an order), close it
      // so the user can return to the homepage.
      if (window.Snipcart && window.Snipcart.api && window.Snipcart.api.theme) {
        try { window.Snipcart.api.theme.cart.close(); } catch (err) { /* ignore */ }
      }

      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update the URL hash so Snipcart's hash-based state is cleared too.
        history.replaceState(null, '', hash);
      }
    });
  });

  // --- Snipcart: auto-close cart after an order is completed ---
  document.addEventListener('snipcart.ready', () => {
    if (!window.Snipcart) return;
    Snipcart.events.on('order.completed', () => {
      try { Snipcart.api.theme.cart.close(); } catch (err) { /* ignore */ }
      // Clear any leftover Snipcart hash (e.g. #/order-complete) and
      // scroll back to the top of the page.
      history.replaceState(null, '', window.location.pathname + window.location.search);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

});
