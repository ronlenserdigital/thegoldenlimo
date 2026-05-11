/* Golden Limousine LLC — script.js v3 */
const WEB3FORMS_KEY = 'YOUR_WEB3FORMS_KEY';

/* ── Nav scroll ── */
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });
}

/* ── Hamburger / Overlay ── */
const hamburger = document.getElementById('hamburger');
const overlay   = document.getElementById('mobile-overlay');
const closeBtn  = document.getElementById('mobile-close');

function openMenu() {
  hamburger && hamburger.classList.add('open');
  if (overlay) {
    overlay.style.display = 'flex';
    requestAnimationFrame(() => overlay.classList.add('open'));
  }
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  hamburger && hamburger.classList.remove('open');
  if (overlay) {
    overlay.classList.remove('open');
    setTimeout(() => { if (!overlay.classList.contains('open')) overlay.style.display = 'none'; }, 400);
  }
  document.body.style.overflow = '';
}

if (hamburger) hamburger.addEventListener('click', openMenu);
if (closeBtn)  closeBtn.addEventListener('click', closeMenu);
if (overlay)   overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

/* ── Testimonial Tabs ── */
const tabs   = document.querySelectorAll('.t-tab');
const panels = document.querySelectorAll('.t-item');

function activateTab(idx) {
  tabs.forEach((t, i) => {
    t.classList.toggle('active', i === idx);
  });
  panels.forEach((p, i) => {
    if (i === idx) {
      p.style.display = 'block';
      requestAnimationFrame(() => p.classList.add('active'));
    } else {
      p.classList.remove('active');
      setTimeout(() => { if (!p.classList.contains('active')) p.style.display = 'none'; }, 500);
    }
  });
}

tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => activateTab(i));
});

// Init first tab
if (tabs.length) activateTab(0);

/* ── IntersectionObserver Reveal ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── Web3Forms ── */
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const msg = document.getElementById('form-msg');
    const orig = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const data = new FormData(form);
    data.append('access_key', WEB3FORMS_KEY);

    try {
      const res  = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data });
      const json = await res.json();
      if (json.success) {
        msg.className = 'form-msg success';
        msg.textContent = 'Received. We will be in touch within one business day.';
        form.reset();
      } else throw new Error();
    } catch {
      msg.className = 'form-msg error';
      msg.textContent = 'Something went wrong. Call us directly at 434-481-5466.';
    }

    btn.textContent = orig;
    btn.disabled = false;
  });
}
