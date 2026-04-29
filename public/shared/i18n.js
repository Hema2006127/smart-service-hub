/* ══ SHARED i18n SYSTEM ══ */
let _currentLang = localStorage.getItem('nexbank-lang') || 'ar';

function setLang(l) {
  _currentLang = l;
  localStorage.setItem('nexbank-lang', l);
  document.documentElement.setAttribute('lang', l === 'ar' ? 'ar' : 'en');
  // Update all data-i18n elements
  const L = (window.PAGE_LANG || {})[l] || {};
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (L[k] !== undefined) el.textContent = L[k];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const k = el.getAttribute('data-i18n-ph');
    if (L[k] !== undefined) el.placeholder = L[k];
  });
  // Update lang button
  const langBtn = document.getElementById('langLabel') || document.getElementById('loginLangBtn');
  if (langBtn) langBtn.textContent = l === 'ar' ? 'EN' : 'عر';
  // Re-apply theme button label
  if (typeof applyThemeBtn === 'function') {
    applyThemeBtn(document.documentElement.getAttribute('data-theme') || 'dark');
  }
}

function toggleLang() {
  setLang(_currentLang === 'ar' ? 'en' : 'ar');
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  setLang(_currentLang);
});
