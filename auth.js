/* ==========================================================================
   auth.js — front-end authentication simulation (localStorage only)
   No backend, no encryption. For demonstration purposes only.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const authPage = document.getElementById('authPage');
  if (!authPage) return; // only runs on index.html

  /* ---------------- tab switching ---------------- */
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  function switchTab(tab) {
    const isLogin = tab === 'login';
    tabLogin.classList.toggle('active', isLogin);
    tabRegister.classList.toggle('active', !isLogin);
    loginForm.classList.toggle('active', isLogin);
    registerForm.classList.toggle('active', !isLogin);
  }
  tabLogin.addEventListener('click', () => switchTab('login'));
  tabRegister.addEventListener('click', () => switchTab('register'));
  document.querySelectorAll('[data-switch]').forEach(el => {
    el.addEventListener('click', (e) => { e.preventDefault(); switchTab(el.dataset.switch); });
  });

  /* ---------------- show / hide password ---------------- */
  document.querySelectorAll('.pw-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.target);
      const isPw = input.type === 'password';
      input.type = isPw ? 'text' : 'password';
      btn.textContent = isPw ? 'HIDE' : 'SHOW';
    });
  });

  /* ---------------- helpers ---------------- */
  function getUsers() { return NB.store.get(NB.KEYS.USERS, []); }
  function saveUsers(users) { NB.store.set(NB.KEYS.USERS, users); }

  function seedDemoUserIfEmpty() {
    const users = getUsers();
    if (users.length === 0) {
      users.push({
        name: 'Demo User',
        email: 'demo@frameforge.app',
        password: 'demo123',
        createdAt: new Date().toISOString()
      });
      saveUsers(users);
    }
  }
  seedDemoUserIfEmpty();

  /* ---------------- LOGIN ---------------- */
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;

    NB.setFieldError('loginEmail', '');
    NB.setFieldError('loginPassword', '');

    let valid = true;
    if (!email || !NB.validEmail(email)) { NB.setFieldError('loginEmail', 'Enter a valid email address.'); valid = false; }
    if (!password) { NB.setFieldError('loginPassword', 'Enter your password.'); valid = false; }
    if (!valid) return;

    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user || user.password !== password) {
      NB.setFieldError('loginPassword', 'Incorrect email or password.');
      NB.toast('error', 'Login failed', 'Check your email and password and try again.');
      return;
    }

    const remember = document.getElementById('rememberMe').checked;
    NB.store.set(NB.KEYS.CURRENT_USER, { name: user.name, email: user.email, remember });
    NB.toast('success', 'Welcome back', `Logged in as ${user.name}.`);
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 500);
  });

  /* ---------------- REGISTER ---------------- */
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim().toLowerCase();
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirm').value;

    ['regName', 'regEmail', 'regPassword', 'regConfirm'].forEach(id => NB.setFieldError(id, ''));

    let valid = true;
    if (!name) { NB.setFieldError('regName', 'Enter your full name.'); valid = false; }
    if (!email || !NB.validEmail(email)) { NB.setFieldError('regEmail', 'Enter a valid email address.'); valid = false; }
    if (!password || password.length < 8) { NB.setFieldError('regPassword', 'Password must be at least 8 characters.'); valid = false; }
    if (confirm !== password) { NB.setFieldError('regConfirm', 'Passwords do not match.'); valid = false; }

    const users = getUsers();
    if (valid && users.some(u => u.email === email)) {
      NB.setFieldError('regEmail', 'An account with this email already exists.');
      valid = false;
    }
    if (!valid) return;

    users.push({ name, email, password, createdAt: new Date().toISOString() });
    saveUsers(users);
    NB.store.set(NB.KEYS.CURRENT_USER, { name, email, remember: true });

    // seed an empty profile
    NB.store.set(NB.KEYS.PROFILE + email, {
  name,
  username: email.split('@')[0],
  email,
  bio: 'New to FrameForge — exploring and creating my first animations.',
  skills: [],
  avatar: null
});

    NB.toast('success', 'Account created', `Welcome to FrameForge, ${name.split(' ')[0]}!`);
setTimeout(() => { window.location.href = 'dashboard.html'; }, 600);
  });

  /* ---------------- forgot password (demo) ---------------- */
  document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    if (!email || !NB.validEmail(email)) {
      NB.toast('info', 'Enter your email first', 'Type your email above, then click "Forgot password?" again.');
      return;
    }
    NB.toast('info', 'Reset link sent', `If an account exists for ${email}, a reset link was "sent" (demo only).`);
  });
});
