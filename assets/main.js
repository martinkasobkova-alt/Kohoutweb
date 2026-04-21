/* ============================================================
   KONFIGURACE — uprav zde po dokončení nastavení rezervací a QR Platby
   ============================================================
   1) RESERVIO_URL  — vlož skutečný odkaz na Reservio profil
                     (např. https://www.reservio.com/petr-kohout-maser-terapeut/booking)
   2) QR_PLATBA     — vyplň IBAN podnikatelského účtu Petra
                     (formát bez mezer, např. "CZ6508000000192000145399")
   ============================================================ */
const SITE_CONFIG = {
  RESERVIO_URL: 'https://www.reservio.com/petr-kohout/booking',
  QR_PLATBA: {
    iban: 'CZ0000000000000000000000', // ← TODO: doplnit reálný IBAN
    beneficiary: 'Petr Kohout',
    currency: 'CZK',
  },
};

// Aplikuj rezervační URL na všechny prvky s [data-action="book"]
document.querySelectorAll('[data-action="book"]').forEach(el => {
  el.setAttribute('href', SITE_CONFIG.RESERVIO_URL);
  el.setAttribute('target', '_blank');
  el.setAttribute('rel', 'noopener');
});

// ============================================================
// QR PLATBA — generuje českou QR Platbu (formát SPAYD) pro [.qr-platba]
// ============================================================
// SPAYD spec: SPD*1.0*ACC:<IBAN>*AM:<částka>*CC:CZK*MSG:<zpráva>*X-VS:<VS>
function buildSpayd({ iban, amount, message, vs }) {
  const parts = [
    'SPD*1.0',
    `ACC:${iban.replace(/\s+/g, '')}`,
    amount ? `AM:${Number(amount).toFixed(2)}` : null,
    `CC:${SITE_CONFIG.QR_PLATBA.currency}`,
    message ? `MSG:${encodeURIComponent(message).replace(/%20/g, ' ').toUpperCase()}` : null,
    vs ? `X-VS:${vs}` : null,
  ].filter(Boolean);
  return parts.join('*');
}

function renderQrPaymentBlocks() {
  const blocks = document.querySelectorAll('.qr-platba');
  if (!blocks.length) return;

  const ensureLib = () => new Promise((resolve, reject) => {
    if (window.QRCode) return resolve();
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js';
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.appendChild(s);
  });

  ensureLib().then(() => {
    blocks.forEach(block => {
      const amount = block.dataset.amount || '';
      const message = block.dataset.message || '';
      const vs = block.dataset.vs || '';
      const canvas = block.querySelector('canvas.qr-canvas');
      if (!canvas) return;
      const spayd = buildSpayd({
        iban: SITE_CONFIG.QR_PLATBA.iban,
        amount,
        message,
        vs,
      });
      window.QRCode.toCanvas(canvas, spayd, {
        width: 240,
        margin: 1,
        color: { dark: '#1f2420', light: '#fdfbf7' },
      });
    });
  }).catch(() => {
    blocks.forEach(b => {
      const fallback = b.querySelector('.qr-fallback');
      if (fallback) fallback.style.display = 'block';
    });
  });
}
renderQrPaymentBlocks();

// Sticky header shadow on scroll
const header = document.getElementById('siteHeader');
const onScroll = () => {
  if (window.scrollY > 8) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
function setNavOpen(open) {
  if (!navToggle || !mainNav) return;
  navToggle.classList.toggle('open', open);
  mainNav.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
}
if (navToggle && mainNav) {
  navToggle.setAttribute('type', 'button');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-controls', mainNav.id);
  navToggle.addEventListener('click', (e) => {
    e.preventDefault();
    const next = !mainNav.classList.contains('open');
    setNavOpen(next);
  });
  mainNav.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => setNavOpen(false));
  });
  document.addEventListener('click', (e) => {
    if (!mainNav.classList.contains('open')) return;
    const t = e.target;
    if (navToggle.contains(t) || mainNav.contains(t)) return;
    setNavOpen(false);
  });
}

// Reveal on scroll
const revealables = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('is-visible'), i * 80);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealables.forEach(el => io.observe(el));
} else {
  revealables.forEach(el => el.classList.add('is-visible'));
}
