/* ==========================================================================
   dashboard.js — dashboard shell logic (sidebar/topbar nav, theme, modals,
   logout, profile). Animation Library rendering lives in js/animations.js.
   ========================================================================== */

let CURRENT_USER = null;

document.addEventListener('DOMContentLoaded', () => {
  NB.initTheme();

  /* ---------------- auth guard ---------------- */
  CURRENT_USER = NB.store.get(NB.KEYS.CURRENT_USER);
  if (!CURRENT_USER) {
    window.location.href = 'index.html';
    return;
  }

  initSidebarUser();
  initSidebarNav();
  initHamburger();
  initTopbarDropdowns();
  initThemeSwitch();
  initModals();
  initLogout();

  // Deep-link support: #library, #profile, #settings
  if (location.hash) {
    const page = location.hash.replace('#', '');
    if (document.getElementById('page-' + page)) switchPage(page);
  }
});

/* ============================================================
   SIDEBAR USER + NAV
   ============================================================ */
function initSidebarUser() {
  const profile = NB.store.get(NB.KEYS.PROFILE + CURRENT_USER.email, {
    name: CURRENT_USER.name, username: CURRENT_USER.email.split('@')[0], email: CURRENT_USER.email, bio: '', skills: [], avatar: null
  });
  document.getElementById('sidebarUserName').textContent = profile.name;
  document.getElementById('sidebarUserEmail').textContent = profile.email;
  setAvatarEl(document.getElementById('sidebarAvatar'), profile);
  setAvatarEl(document.getElementById('topbarAvatar'), profile);
}

function setAvatarEl(el, profile) {
  if (!el) return;
  if (profile.avatar) {
    el.style.backgroundImage = `url(${profile.avatar})`;
    el.style.backgroundSize = 'cover';
    el.style.backgroundPosition = 'center';
    el.textContent = '';
  } else {
    el.style.backgroundImage = '';
    el.textContent = NB.initials(profile.name);
  }
}

function initSidebarNav() {
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      switchPage(item.dataset.page);
      closeSidebarMobile();
    });
  });
  document.querySelectorAll('.dropdown-item[data-page]').forEach(item => {
    item.addEventListener('click', () => switchPage(item.dataset.page));
  });
}

function switchPage(page) {
  document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item[data-page]').forEach(n => n.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (!target) return;
  target.classList.add('active');
  document.querySelector(`.nav-item[data-page="${page}"]`)?.classList.add('active');
  history.replaceState(null, '', '#' + page);
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // refresh dynamic content when relevant
  if (page === 'profile') renderProfilePage();
  document.getElementById('userDropdown')?.classList.remove('open');
}
window.switchPage = switchPage;

function initHamburger() {
  const btn = document.getElementById('hamburgerBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  btn?.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
  });
  overlay?.addEventListener('click', closeSidebarMobile);
}
function closeSidebarMobile() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}

/* ============================================================
   TOPBAR DROPDOWNS
   ============================================================ */
function initTopbarDropdowns() {
  setupDropdown('topbarUserBtn', 'userDropdown');
  document.getElementById('sidebarUserBtn')?.addEventListener('click', () => switchPage('profile'));
}

function setupDropdown(btnId, dropId) {
  const btn = document.getElementById(btnId);
  const drop = document.getElementById(dropId);
  if (!btn || !drop) return;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const willOpen = !drop.classList.contains('open');
    document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
    if (willOpen) drop.classList.add('open');
  });
}
document.addEventListener('click', () => document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open')));

/* ============================================================
   THEME SWITCH (topbar)
   ============================================================ */
function initThemeSwitch() {
  const saved = NB.store.get(NB.KEYS.THEME, 'dark');
  document.querySelectorAll('#themeSwitch button').forEach(b => {
    b.classList.toggle('active', b.dataset.theme === saved);
    b.addEventListener('click', () => {
      NB.setTheme(b.dataset.theme);
      document.querySelectorAll('#themeSwitch button').forEach(x => x.classList.toggle('active', x === b));
      syncSettingsThemeUI();
    });
  });
}
function syncSettingsThemeUI() {
  const saved = NB.store.get(NB.KEYS.THEME, 'dark');
  document.querySelectorAll('#settingsThemeOptions .theme-opt').forEach(el => {
    el.classList.toggle('active', el.dataset.theme === saved);
  });
}

/* ============================================================
   LOGOUT
   ============================================================ */
function initLogout() {
  const doLogout = () => {
    NB.store.remove(NB.KEYS.CURRENT_USER);
    window.location.href = 'index.html';
  };
  document.getElementById('logoutBtn')?.addEventListener('click', (e) => { e.preventDefault(); doLogout(); });
  document.getElementById('dropdownLogoutBtn')?.addEventListener('click', doLogout);
}

/* ============================================================
   MODALS (generic open/close — used by the animation code viewer)
   ============================================================ */
function initModals() {
  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.openModal));
  });
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => btn.closest('.modal-overlay').classList.remove('open'));
  });
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('open'); });
  });
}
function openModal(id) {
  document.getElementById(id).classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}
window.openModal = openModal;
window.closeModal = closeModal;

/* ============================================================
   ANIMATION LIBRARY STATS (used by animations.js + profile page)
   ============================================================ */
function getLibraryStats() {
  return NB.store.get(NB.KEYS.STATS + CURRENT_USER.email, { copied: 0 });
}
function bumpCopiedCount() {
  const stats = getLibraryStats();
  stats.copied = (stats.copied || 0) + 1;
  NB.store.set(NB.KEYS.STATS + CURRENT_USER.email, stats);
  if (document.getElementById('page-profile')?.classList.contains('active')) renderProfilePage();
}
window.bumpCopiedCount = bumpCopiedCount;

/* ============================================================
   PROFILE PAGE
   ============================================================ */
function renderProfilePage() {
  const profile = NB.store.get(NB.KEYS.PROFILE + CURRENT_USER.email, {
    name: CURRENT_USER.name, username: CURRENT_USER.email.split('@')[0], email: CURRENT_USER.email, bio: '', skills: [], avatar: null
  });
  document.getElementById('profileNameDisplay').textContent = profile.name;
  document.getElementById('profileUsernameDisplay').textContent = '@' + profile.username;
  document.getElementById('profileBioDisplay').textContent = profile.bio || 'No bio yet.';
  setAvatarEl(document.getElementById('profileAvatarBig'), profile);
  document.getElementById('profileSkillsDisplay').innerHTML = (profile.skills || []).map(s => `<span class="skill-tag">${NB.escapeHTML(s)}</span>`).join('') || '<span style="color:var(--fg-low); font-size:0.85rem;">No skills added yet.</span>';

  const stats = getLibraryStats();
  document.getElementById('profileStatProjects').textContent = (typeof ANIMATIONS !== 'undefined') ? ANIMATIONS.length : 0;
  document.getElementById('profileStatTasks').textContent = stats.copied || 0;

  const users = NB.store.get(NB.KEYS.USERS, []);
  const me = users.find(u => u.email === CURRENT_USER.email);
  const days = me ? Math.max(1, Math.floor((Date.now() - new Date(me.createdAt).getTime()) / 86400000)) : 1;
  document.getElementById('profileStatDays').textContent = days;
}
window.renderProfilePage = renderProfilePage;
