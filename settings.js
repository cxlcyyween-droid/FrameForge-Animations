/* ==========================================================================
   settings.js — settings page + profile editing
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('page-settings')) return;

  const SETTINGS_KEY = NB.KEYS.SETTINGS + '_' + CURRENT_USER.email;
  const defaults = { compact: false, sidebarExpanded: false, animations: true };
  let settings = NB.store.get(SETTINGS_KEY, defaults);
  applySettings(settings);

  /* ---------------- settings nav (tabs) ---------------- */
  document.querySelectorAll('.settings-nav button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.settings-nav button').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.settings-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('pane-' + btn.dataset.pane).classList.add('active');
    });
  });

  /* ---------------- theme options ---------------- */
  function syncThemeOptions() {
    const current = NB.store.get(NB.KEYS.THEME, 'dark');
    document.querySelectorAll('#settingsThemeOptions .theme-opt').forEach(el => {
      el.classList.toggle('active', el.dataset.theme === current);
    });
  }
  syncThemeOptions();
  document.querySelectorAll('#settingsThemeOptions .theme-opt').forEach(el => {
    el.addEventListener('click', () => {
      NB.setTheme(el.dataset.theme);
      syncThemeOptions();
      document.querySelectorAll('#themeSwitch button').forEach(b => b.classList.toggle('active', b.dataset.theme === el.dataset.theme));
      NB.toast('success', 'Theme updated', `Switched to ${el.dataset.theme} mode.`);
    });
  });

  /* ---------------- account settings ---------------- */
  document.getElementById('settingsName').value = CURRENT_USER.name;
  document.getElementById('settingsEmail').value = CURRENT_USER.email;

  document.getElementById('saveAccountBtn').addEventListener('click', () => {
    const name = document.getElementById('settingsName').value.trim();
    const email = document.getElementById('settingsEmail').value.trim().toLowerCase();
    const newPw = document.getElementById('settingsNewPassword').value;
    const confirmPw = document.getElementById('settingsConfirmPassword').value;

    if (!name || !email || !NB.validEmail(email)) {
      NB.toast('error', 'Invalid details', 'Enter a valid name and email address.');
      return;
    }
    if (newPw && newPw.length < 8) {
      NB.toast('error', 'Password too short', 'New password must be at least 8 characters.');
      return;
    }
    if (newPw && newPw !== confirmPw) {
      NB.toast('error', "Passwords don't match", 'Confirm password must match the new password.');
      return;
    }

    const users = NB.store.get(NB.KEYS.USERS, []);
    const idx = users.findIndex(u => u.email === CURRENT_USER.email);
    if (idx === -1) return;

    const emailChanged = email !== CURRENT_USER.email;
    if (emailChanged && users.some(u => u.email === email)) {
      NB.toast('error', 'Email taken', 'Another account already uses this email.');
      return;
    }

    users[idx].name = name;
    users[idx].email = email;
    if (newPw) users[idx].password = newPw;
    NB.store.set(NB.KEYS.USERS, users);

    // migrate namespaced data if email changed
    if (emailChanged) {
      migrateNamespace(CURRENT_USER.email, email);
    }

    CURRENT_USER = { ...CURRENT_USER, name, email };
    NB.store.set(NB.KEYS.CURRENT_USER, CURRENT_USER);

    NB.toast('success', 'Account updated', 'Your changes were saved.');
    document.getElementById('settingsNewPassword').value = '';
    document.getElementById('settingsConfirmPassword').value = '';
    initSidebarUser();
  });

  function migrateNamespace(oldEmail, newEmail) {
    [NB.KEYS.PROFILE, NB.KEYS.STATS].forEach(prefix => {
      const data = NB.store.get(prefix + oldEmail);
      if (data !== null) {
        NB.store.set(prefix + newEmail, data);
        NB.store.remove(prefix + oldEmail);
      }
    });
  }

  /* ---------------- interface toggles ---------------- */
  const toggleCompact = document.getElementById('toggleCompact');
  const toggleSidebarExpanded = document.getElementById('toggleSidebarExpanded');
  const toggleAnimations = document.getElementById('toggleAnimations');

  toggleCompact.classList.toggle('on', settings.compact);
  toggleSidebarExpanded.classList.toggle('on', settings.sidebarExpanded);
  toggleAnimations.classList.toggle('on', settings.animations);

  toggleCompact.addEventListener('click', () => { settings.compact = !settings.compact; persist(); });
  toggleSidebarExpanded.addEventListener('click', () => { settings.sidebarExpanded = !settings.sidebarExpanded; persist(); });
  toggleAnimations.addEventListener('click', () => { settings.animations = !settings.animations; persist(); });

  function persist() {
    NB.store.set(SETTINGS_KEY, settings);
    applySettings(settings);
    [toggleCompact, toggleSidebarExpanded, toggleAnimations].forEach(t => {});
    toggleCompact.classList.toggle('on', settings.compact);
    toggleSidebarExpanded.classList.toggle('on', settings.sidebarExpanded);
    toggleAnimations.classList.toggle('on', settings.animations);
    NB.toast('info', 'Preference saved');
  }

  function applySettings(s) {
    document.body.classList.toggle('compact', !!s.compact);
    document.body.classList.toggle('no-anim', !s.animations);
    document.getElementById('sidebar')?.classList.toggle('open', !!s.sidebarExpanded && window.innerWidth <= 860);
  }

  /* ---------------- profile editing ---------------- */
  const editBtn = document.getElementById('editProfileBtn');
  const editPanel = document.getElementById('profileEditPanel');
  const cancelBtn = document.getElementById('cancelEditProfileBtn');
  const saveBtn = document.getElementById('saveProfileBtn');
  const avatarBtn = document.getElementById('avatarUploadBtn');
  const avatarInput = document.getElementById('avatarFileInput');

  editBtn?.addEventListener('click', () => {
    const profile = NB.store.get(NB.KEYS.PROFILE + CURRENT_USER.email, {
      name: CURRENT_USER.name, username: CURRENT_USER.email.split('@')[0], email: CURRENT_USER.email, bio: '', skills: []
    });
    document.getElementById('editName').value = profile.name;
    document.getElementById('editUsername').value = profile.username;
    document.getElementById('editEmail').value = profile.email;
    document.getElementById('editBio').value = profile.bio || '';
    document.getElementById('editSkills').value = (profile.skills || []).join(', ');
    editPanel.style.display = 'block';
    editPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  cancelBtn?.addEventListener('click', () => { editPanel.style.display = 'none'; });

  saveBtn?.addEventListener('click', () => {
    const name = document.getElementById('editName').value.trim();
    const username = document.getElementById('editUsername').value.trim().replace(/\s+/g, '');
    const email = document.getElementById('editEmail').value.trim().toLowerCase();
    const bio = document.getElementById('editBio').value.trim();
    const skills = document.getElementById('editSkills').value.split(',').map(s => s.trim()).filter(Boolean);

    if (!name || !username) { NB.toast('error', 'Missing details', 'Name and username are required.'); return; }

    const existing = NB.store.get(NB.KEYS.PROFILE + CURRENT_USER.email, {});
    NB.store.set(NB.KEYS.PROFILE + CURRENT_USER.email, { ...existing, name, username, email, bio, skills });
    editPanel.style.display = 'none';
    NB.toast('success', 'Profile updated', 'Your profile changes were saved.');
    initSidebarUser();
    if (typeof renderProfilePage === 'function') renderProfilePage();
  });

  avatarBtn?.addEventListener('click', () => avatarInput.click());
  avatarInput?.addEventListener('change', () => {
    const file = avatarInput.files[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      NB.toast('error', 'Image too large', 'Please choose an image under 1.5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const existing = NB.store.get(NB.KEYS.PROFILE + CURRENT_USER.email, {});
      const ok = NB.store.set(NB.KEYS.PROFILE + CURRENT_USER.email, { ...existing, avatar: reader.result });
      if (ok) {
        NB.toast('success', 'Photo updated');
        initSidebarUser();
        if (typeof renderProfilePage === 'function') renderProfilePage();
      } else {
        NB.toast('error', 'Could not save photo', 'Try a smaller image.');
      }
    };
    reader.readAsDataURL(file);
  });
});
