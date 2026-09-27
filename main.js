/* ==========================================================================
   main.js — shared utilities used across every page
   (theme system, toasts, storage helpers, landing-page interactions)
   ========================================================================== */

const NB = (() => {

  /* ---------------- storage helpers ---------------- */
  const store = {
    get(key, fallback = null) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) {
        console.error('NB.store.get error', key, e);
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.error('NB.store.set error', key, e);
        return false;
      }
    },
    remove(key) { localStorage.removeItem(key); }
  };

  const KEYS = {
    USERS: 'nb_users',
    CURRENT_USER: 'nb_current_user',
    THEME: 'nb_theme',
    SETTINGS: 'nb_settings',
    PROFILE: 'nb_profile_',     // + email
    STATS: 'nb_stats_'          // + email — animation library engagement (codes copied, etc.)
  };

  /* ---------------- toast notifications ---------------- */
  function toast(type, title, body = '', duration = 4200) {
    const stack = document.getElementById('toastStack');
    if (!stack) return;
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    const icons = { success: '✓', error: '!', info: 'i' };
    el.innerHTML = `
      <div class="toast-icon">${icons[type] || 'i'}</div>
      <div style="flex:1;">
        <div class="toast-title">${escapeHTML(title)}</div>
        ${body ? `<div class="toast-body">${escapeHTML(body)}</div>` : ''}
      </div>
      <button class="toast-close" aria-label="Dismiss">&times;</button>
    `;
    stack.appendChild(el);
    const remove = () => {
      el.classList.add('hide');
      setTimeout(() => el.remove(), 320);
    };
    el.querySelector('.toast-close').addEventListener('click', remove);
    const timer = setTimeout(remove, duration);
    el.addEventListener('mouseenter', () => clearTimeout(timer));
  }

  function escapeHTML(str) {
    const d = document.createElement('div');
    d.textContent = str == null ? '' : String(str);
    return d.innerHTML;
  }

  /* ---------------- theme system ---------------- */
  function applyTheme(theme) {
    // theme: 'dark' | 'light' | 'system'
    let resolved = theme;
    if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    if (resolved === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  function initTheme() {
    const saved = store.get(KEYS.THEME, 'dark');
    applyTheme(saved);
    return saved;
  }

  function setTheme(theme) {
    store.set(KEYS.THEME, theme);
    applyTheme(theme);
  }

  /* ---------------- route-field decorative background ---------------- */
  function initRouteField() {
    const field = document.getElementById('routeField');
    if (!field) return;
    const count = window.innerWidth < 720 ? 5 : 10;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot';
      dot.style.left = Math.random() * 100 + '%';
      dot.style.top = Math.random() * 100 + '%';
      dot.style.setProperty('--dx', (Math.random() * 240 - 120) + 'px');
      dot.style.setProperty('--dy', (Math.random() * 200 - 140) + 'px');
      dot.style.animationDelay = (Math.random() * 10) + 's';
      dot.style.animationDuration = (10 + Math.random() * 8) + 's';
      field.appendChild(dot);
    }
  }

  /* ---------------- scroll reveal ---------------- */
  function initScrollReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(el => obs.observe(el));
  }

  /* ---------------- form validation helpers ---------------- */
  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  function setFieldError(id, msg) {
    const err = document.getElementById(id + 'Err');
    const input = document.getElementById(id);
    if (err) err.textContent = msg || '';
    if (input) input.style.borderColor = msg ? 'var(--coral)' : '';
  }

  /* ---------------- misc ---------------- */
  function initials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || name[0].toUpperCase();
  }

  function timeAgo(iso) {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    return Math.floor(diff / 86400) + 'd ago';
  }

  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

  return { store, KEYS, toast, escapeHTML, initTheme, setTheme, applyTheme, initRouteField, initScrollReveal, validEmail, setFieldError, initials, timeAgo, uid };
})();

/* ==========================================================================
   Landing-page-only interactions (guarded so dashboard.html can share this file)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  NB.initTheme();
  NB.initRouteField();
  NB.initScrollReveal();

  const landing = document.getElementById('landingPage');
  const authPage = document.getElementById('authPage');
  if (!landing) return; // not on index.html

  const showAuth = (tab = 'login') => {
    landing.style.display = 'none';
    authPage.style.display = 'block';
    window.scrollTo(0, 0);
    document.getElementById('tab' + (tab === 'login' ? 'Login' : 'Register')).click();
  };
  const showLanding = () => {
    authPage.style.display = 'none';
    landing.style.display = 'block';
    window.scrollTo(0, 0);
  };

  document.getElementById('navGetStartedBtn')?.addEventListener('click', () => showAuth('register'));
  document.getElementById('heroGetStartedBtn')?.addEventListener('click', () => showAuth('register'));
  document.getElementById('mobileGetStartedBtn')?.addEventListener('click', () => showAuth('register'));
  document.getElementById('navLoginBtn')?.addEventListener('click', () => showAuth('login'));
  document.getElementById('heroLoginBtn')?.addEventListener('click', () => showAuth('login'));
  document.getElementById('mobileLoginBtn')?.addEventListener('click', () => showAuth('login'));
  document.getElementById('authBrandLink')?.addEventListener('click', (e) => { e.preventDefault(); showLanding(); });

  // mobile menu
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  mobileToggle?.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

  // contact form validation (front-end only demo)
  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    const name = document.getElementById('cName').value.trim();
    const email = document.getElementById('cEmail').value.trim();
    const message = document.getElementById('cMessage').value.trim();

    NB.setFieldError('cName', '');
    NB.setFieldError('cEmail', '');
    NB.setFieldError('cMessage', '');

    if (!name) { NB.setFieldError('cName', 'Please enter your name.'); valid = false; }
    if (!email || !NB.validEmail(email)) { NB.setFieldError('cEmail', 'Please enter a valid email.'); valid = false; }
    if (!message) { NB.setFieldError('cMessage', 'Please enter a message.'); valid = false; }

    if (!valid) return;
    NB.toast('success', 'Message sent', "We'll get back to you within a day.");
    contactForm.reset();
  });

  // If already logged in, jump straight to the dashboard
  const current = NB.store.get(NB.KEYS.CURRENT_USER);
  if (current) {
    window.location.href = 'dashboard.html';
  }
});
