/* ══ SHARED THEME SYSTEM ══ */
function toggleTheme() {
  const h = document.documentElement;
  const next = h.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  h.setAttribute('data-theme', next);
  localStorage.setItem('nexbank-theme', next);
  applyThemeBtn(next);
}
function applyThemeBtn(t) {
  const icon = document.getElementById('themeIcon');
  const label = document.getElementById('themeLabel');
  const isDark = t !== 'light';
  if (icon) icon.textContent = isDark ? '☀️' : '🌙';
  if (label) {
    const L = window.PAGE_LANG || {};
    const lang = localStorage.getItem('nexbank-lang') || 'ar';
    label.textContent = isDark ? (L[lang]?.themeLight || (lang==='ar'?'الثيم الفاتح':'Light Theme')) : (L[lang]?.themeDark || (lang==='ar'?'الثيم الداكن':'Dark Theme'));
  }
}
// Init on load
applyThemeBtn(document.documentElement.getAttribute('data-theme') || 'dark');
