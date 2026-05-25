/* ============================================
   INSPECTIONS ARIZONA — MAIN JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Mobile Menu Toggle --- */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* --- Active Nav Link --- */
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
  const current  = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* --- FAQ Accordion --- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer  = btn.nextElementSibling;
      const isOpen  = btn.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-question.open').forEach(b => {
        b.classList.remove('open');
        b.nextElementSibling.classList.remove('open');
      });
      // Toggle current
      if (!isOpen) {
        btn.classList.add('open');
        answer.classList.add('open');
      }
    });
  });

  /* --- Scroll Fade-In --- */
  const faders = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  faders.forEach(el => observer.observe(el));

  /* --- Services Nav Active State (services page) --- */
  const servicesSections = document.querySelectorAll('.service-detail[id]');
  const servicesNavLinks = document.querySelectorAll('.services-nav a');
  if (servicesSections.length && servicesNavLinks.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          servicesNavLinks.forEach(l => l.classList.remove('active'));
          const active = document.querySelector(`.services-nav a[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    servicesSections.forEach(s => sectionObserver.observe(s));
  }

  /* --- Animated Counter (stats) --- */
  const counters = document.querySelectorAll('.stat-number[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const duration = 1800;
        const step   = target / (duration / 16);
        let current  = 0;
        const timer  = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = prefix + (Number.isInteger(target) ? Math.floor(current) : current.toFixed(1)) + suffix;
        }, 16);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* --- Form Submission (demo) --- */
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      const original = btn.innerHTML;
      btn.innerHTML = '✅ Request Sent! We\'ll Call You Shortly.';
      btn.style.background = '#2E9E6B';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 5000);
    });
  });

  /* --- Phone number formatting --- */
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach(input => {
    input.addEventListener('input', () => {
      let val = input.value.replace(/\D/g, '').slice(0, 10);
      if (val.length >= 7) {
        val = `(${val.slice(0,3)}) ${val.slice(3,6)}-${val.slice(6)}`;
      } else if (val.length >= 4) {
        val = `(${val.slice(0,3)}) ${val.slice(3)}`;
      }
      input.value = val;
    });
  });

  /* --- Sticky header shrink --- */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  /* --- Testimonial Slider --- */
  const slider = document.querySelector('.testimonial-slider');
  if (slider) {
    const track = slider.querySelector('.testimonial-track');
    const cards = slider.querySelectorAll('.testimonial-card');
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    const dotsContainer = slider.querySelector('.slider-dots');
    let current = 0;
    let autoTimer;

    // Build dots
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Review ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    function goTo(index) {
      current = (index + cards.length) % cards.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      slider.querySelectorAll('.slider-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    function startAuto() {
      autoTimer = setInterval(() => goTo(current + 1), 4500);
    }

    function resetAuto() {
      clearInterval(autoTimer);
      startAuto();
    }

    prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

    // Touch / swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { goTo(current + (diff > 0 ? 1 : -1)); resetAuto(); }
    });

    startAuto();
  }

  /* --- Image Slider (areas page) --- */
  const imgSlider = document.querySelector('.img-slider');
  if (imgSlider) {
    const track = imgSlider.querySelector('.img-slider-track');
    const imgs = imgSlider.querySelectorAll('.img-slider-track img');
    const prevBtn = imgSlider.querySelector('.img-slider-prev');
    const nextBtn = imgSlider.querySelector('.img-slider-next');
    const dotsContainer = imgSlider.querySelector('.img-slider-dots');
    let current = 0;
    let autoTimer;

    imgs.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Image ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    function goTo(index) {
      current = (index + imgs.length) % imgs.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      imgSlider.querySelectorAll('.slider-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    function startAuto() {
      autoTimer = setInterval(() => goTo(current + 1), 3500);
    }

    function resetAuto() {
      clearInterval(autoTimer);
      startAuto();
    }

    prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { goTo(current + (diff > 0 ? 1 : -1)); resetAuto(); }
    });

    startAuto();
  }

});
