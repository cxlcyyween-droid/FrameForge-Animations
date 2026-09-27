/* ==========================================================================
   animations.js — CSS Animation Library: search, filtering, cards,
   live previews, the "View Code" modal, and "Copy CSS" / "Copy" actions.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('animGrid');
  if (!grid) return; // not on a page with the library

  let activeCategory = 'all';
  let searchQuery = '';

  /* ---------------- inject every animation's CSS once, up front ---------------- */
  injectLibraryStyles();

  /* ---------------- category filter pills ---------------- */
  const pillsWrap = document.getElementById('animCategoryPills');
  pillsWrap.innerHTML = ANIMATION_CATEGORIES.map(c => `
    <div class="filter-pill${c.id === 'all' ? ' active' : ''}" data-category="${c.id}">${c.label}</div>
  `).join('');
  pillsWrap.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      pillsWrap.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.dataset.category;
      renderGrid();
    });
  });

  /* ---------------- search ---------------- */
  const searchInput = document.getElementById('animSearch');
  searchInput?.addEventListener('input', () => {
    searchQuery = searchInput.value.trim().toLowerCase();
    renderGrid();
  });

  /* ---------------- render ---------------- */
  function getFiltered() {
    return ANIMATIONS.filter(a => {
      const matchesCategory = activeCategory === 'all' || a.category === activeCategory;
      const matchesSearch = !searchQuery || a.name.toLowerCase().includes(searchQuery);
      return matchesCategory && matchesSearch;
    });
  }

  function renderGrid() {
    const items = getFiltered();

    if (!items.length) {
      grid.innerHTML = `
        <div class="empty-state anim-empty">
          <div class="ic">🔍</div>
          <h4>No animations found</h4>
          <p>Try a different search term or category.</p>
        </div>`;
      return;
    }

    grid.innerHTML = items.map(a => `
      <div class="anim-card" data-id="${a.id}">
        <div class="anim-preview" id="preview-${a.id}">${a.html}</div>
        <div class="anim-card-body">
          <div class="anim-name">${NB.escapeHTML(a.name)}</div>
          <div class="anim-meta">
            <span class="anim-badge">${categoryLabel(a.category)}</span>
          </div>
          <p class="anim-desc">${NB.escapeHTML(a.description)}</p>
        </div>
        <div class="anim-actions">
          <button class="btn btn-ghost btn-sm" data-action="preview" data-id="${a.id}">Preview</button>
          <button class="btn btn-ghost btn-sm" data-action="view-code" data-id="${a.id}">View Code</button>
          <button class="btn btn-primary btn-sm" data-action="copy-css" data-id="${a.id}">Copy CSS</button>
          <span class="anim-copied-badge" id="copied-${a.id}">Copied!</span>
        </div>
      </div>
    `).join('');
  }

  function categoryLabel(id) {
    const found = ANIMATION_CATEGORIES.find(c => c.id === id);
    return found ? found.fullLabel : id;
  }

  /* ---------------- one-time style injection ---------------- */
  function injectLibraryStyles() {
    if (document.getElementById('ff-anim-styles')) return;
    const style = document.createElement('style');
    style.id = 'ff-anim-styles';
    style.textContent = ANIMATIONS.map(a => a.css).join('\n\n');
    document.head.appendChild(style);
  }

  /* ---------------- card actions (event delegation) ---------------- */
  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const anim = ANIMATIONS.find(a => a.id === btn.dataset.id);
    if (!anim) return;

    if (btn.dataset.action === 'preview') restartPreview(anim);
    if (btn.dataset.action === 'view-code') openCodeModal(anim);
    if (btn.dataset.action === 'copy-css') copyCss(anim, btn);
  });

  function restartPreview(anim) {
    const el = document.getElementById('preview-' + anim.id);
    if (!el) return;
    const nodes = [el, ...el.querySelectorAll('*')];

    // restart any looping keyframe animation by forcing a reflow
    nodes.forEach(n => { n.style.animation = 'none'; });
    void el.offsetWidth;
    nodes.forEach(n => { n.style.animation = ''; });

    // simulate ":hover" for hover-triggered effects (Scale Up, Shine Sweep,
    // Underline Reveal, Flip Card) via the companion .ff-preview class
    nodes.forEach(n => n.classList.add('ff-preview'));
    setTimeout(() => nodes.forEach(n => n.classList.remove('ff-preview')), 1600);
  }

  /* ---------------- copy CSS (card button) ---------------- */
  function copyCss(anim, btn) {
    copyText(anim.css).then(() => {
      showCopiedBadge(anim.id);
      if (typeof bumpCopiedCount === 'function') bumpCopiedCount();
    });
  }

  function showCopiedBadge(id) {
    const badge = document.getElementById('copied-' + id);
    if (!badge) return;
    badge.classList.add('show');
    clearTimeout(badge._hideTimer);
    badge._hideTimer = setTimeout(() => badge.classList.remove('show'), 1500);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* no-op */ }
    document.body.removeChild(ta);
  }

  /* ============================================================
     CODE VIEWER MODAL
     ============================================================ */
  const codeModalOverlay = document.getElementById('codeModalOverlay');
  const codeModalTitle = document.getElementById('codeModalTitle');
  const codeBlockHtml = document.getElementById('codeBlockHtml');
  const codeBlockCss = document.getElementById('codeBlockCss');
  const codeModalCopyCss = document.getElementById('codeModalCopyCss');
  let currentModalAnim = null;

  function openCodeModal(anim) {
    currentModalAnim = anim;
    codeModalTitle.textContent = anim.name + ' — code';
    codeBlockHtml.innerHTML = highlightHTML(anim.html);
    codeBlockCss.innerHTML = highlightCSS(anim.css);
    setCodeTab('html');
    if (typeof openModal === 'function') openModal('codeModalOverlay');
    else codeModalOverlay.classList.add('open');
  }

  function setCodeTab(tab) {
    document.querySelectorAll('.code-tab').forEach(t => t.classList.toggle('active', t.dataset.codeTab === tab));
    document.getElementById('codePaneHtml').classList.toggle('active', tab === 'html');
    document.getElementById('codePaneCss').classList.toggle('active', tab === 'css');
  }

  document.querySelectorAll('.code-tab').forEach(tab => {
    tab.addEventListener('click', () => setCodeTab(tab.dataset.codeTab));
  });

  document.querySelectorAll('.code-copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!currentModalAnim) return;
      const target = btn.dataset.copyTarget;
      const text = target === 'html' ? currentModalAnim.html : currentModalAnim.css;
      copyText(text).then(() => {
        const original = btn.textContent;
        btn.textContent = 'Copied!';
        if (target === 'css' && typeof bumpCopiedCount === 'function') bumpCopiedCount();
        setTimeout(() => { btn.textContent = original; }, 1300);
      });
    });
  });

  codeModalCopyCss?.addEventListener('click', () => {
    if (!currentModalAnim) return;
    copyText(currentModalAnim.css).then(() => {
      showCopiedBadge(currentModalAnim.id);
      const original = codeModalCopyCss.textContent;
      codeModalCopyCss.textContent = 'Copied!';
      if (typeof bumpCopiedCount === 'function') bumpCopiedCount();
      setTimeout(() => { codeModalCopyCss.textContent = original; }, 1300);
    });
  });

  /* ============================================================
     LIGHTWEIGHT SYNTAX HIGHLIGHTING (no external libraries)
     ============================================================ */
  function esc(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function highlightCSS(code) {
    const lines = esc(code).split('\n');
    return lines.map(line => {
      // comments
      if (/^\s*\/\*/.test(line) || /^\s*\*/.test(line)) {
        return `<span class="tok-comment">${line}</span>`;
      }
      // @keyframes / selector lines ending in {
      const selectorMatch = line.match(/^(\s*)([^{}:]+)(\{?)\s*$/);
      if (selectorMatch && line.trim().endsWith('{')) {
        return `${selectorMatch[1]}<span class="tok-sel">${selectorMatch[2]}</span><span class="tok-punct">{</span>`;
      }
      if (line.trim() === '}') return `<span class="tok-punct">}</span>`;
      // property: value;
      const propMatch = line.match(/^(\s*)([a-zA-Z-]+)(\s*:\s*)([^;]+)(;?)\s*$/);
      if (propMatch) {
        return `${propMatch[1]}<span class="tok-prop">${propMatch[2]}</span><span class="tok-punct">${propMatch[3]}</span><span class="tok-val">${propMatch[4]}</span><span class="tok-punct">${propMatch[5]}</span>`;
      }
      return line;
    }).join('\n');
  }

  function highlightHTML(code) {
    const escaped = esc(code);
    return escaped
      .replace(/(&lt;\/?)([a-zA-Z0-9-]+)/g, '$1<span class="tok-tag">$2</span>')
      .replace(/([a-zA-Z-]+)(=)(&quot;|")([^"&]*)(&quot;|")/g, '<span class="tok-attr">$1</span>$2<span class="tok-str">$3$4$5</span>');
  }
});
