// ── Español Study — Shared JS ──
// Loaded on every page. Handles theme, font size, and XP helpers.

(function () {
  // ── Theme ──
  function applyTheme() {
    const t = localStorage.getItem('es_theme') || 'dark';
    if (t === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
    document.querySelectorAll('.themeBtn').forEach(b => b.textContent = t === 'light' ? '🌙' : '☀️');
  }

  window.toggleTheme = function () {
    const l = document.body.classList.toggle('light');
    localStorage.setItem('es_theme', l ? 'light' : 'dark');
    document.querySelectorAll('.themeBtn').forEach(b => b.textContent = l ? '🌙' : '☀️');
  };

  // ── Font size ──
  function applyFont() {
    const fs = parseInt(localStorage.getItem('es_fontsize') || '18');
    document.body.style.fontSize = fs + 'px';
  }

  window.toggleFont = function (d) {
    let f = parseInt(document.body.style.fontSize || '18');
    f = Math.min(24, Math.max(14, f + d));
    document.body.style.fontSize = f + 'px';
    localStorage.setItem('es_fontsize', f);
  };

  window.resetFont = function () {
    document.body.style.fontSize = '18px';
    localStorage.setItem('es_fontsize', 18);
  };

  // ── Mobile menu ──
  window.toggleMenu = function () {
    const m = document.getElementById('mobileMenu');
    if (m) m.classList.toggle('open');
  };

  // ── XP ──
  window.awardXP = function (n, source) {
    const xp = parseInt(localStorage.getItem('es_xp') || '0') + n;
    localStorage.setItem('es_xp', xp);
    const log = (() => { try { return JSON.parse(localStorage.getItem('es_xpLog') || '[]'); } catch { return []; } })();
    log.push({ date: new Date().toISOString(), amount: n, source: source || 'general' });
    if (log.length > 500) log.splice(0, log.length - 500);
    localStorage.setItem('es_xpLog', JSON.stringify(log));
    // Update any XP badge on page
    document.querySelectorAll('.xpBadge,[id="xpBadge"]').forEach(el => {
      el.textContent = '⚡ ' + xp.toLocaleString() + ' XP';
    });
  };

  window.getXP = function () {
    return parseInt(localStorage.getItem('es_xp') || '0');
  };

  // ── SRS Mastery ──
  const SRS_INTERVALS = [0, 1, 3, 7, 14, 30];

  window.getMastery = function () {
    try { return JSON.parse(localStorage.getItem('es_mastery') || '{}'); } catch { return {}; }
  };

  window.updateMastery = function (word, dir) {
    const m = getMastery();
    if (!m[word]) m[word] = { level: 0, nextReview: Date.now(), lastSeen: null };
    m[word].level = Math.min(5, Math.max(0, m[word].level + dir));
    m[word].lastSeen = Date.now();
    m[word].nextReview = Date.now() + SRS_INTERVALS[m[word].level] * 86400000;
    localStorage.setItem('es_mastery', JSON.stringify(m));
  };

  window.isDue = function (word) {
    const m = getMastery()[word];
    return m && m.level < 5 && m.nextReview <= Date.now();
  };

  // ── Study streak ──
  window.markStudiedToday = function () {
    const days = (() => { try { return JSON.parse(localStorage.getItem('es_studyDays') || '[]'); } catch { return []; } })();
    const today = new Date().toDateString();
    if (!days.includes(today)) {
      days.push(today);
      localStorage.setItem('es_studyDays', JSON.stringify(days));
    }
    // Compute streak
    let streak = 0;
    let d = new Date();
    while (true) {
      if (days.includes(d.toDateString())) { streak++; d.setDate(d.getDate() - 1); }
      else break;
    }
    localStorage.setItem('es_streak', streak);
    return streak;
  };

  // ── Init on load ──
  document.addEventListener('DOMContentLoaded', function () {
    applyTheme();
    applyFont();
    markStudiedToday();
  });

})();
