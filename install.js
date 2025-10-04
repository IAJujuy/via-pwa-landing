// install.js — compatible con GitHub Project Pages (subcarpeta)
// Cambios clave: registro del SW con ruta relativa ./sw.js?v=2
let deferredPrompt;

function isIOS() {
  const ua = window.navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}
function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}
function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const androidCta = document.getElementById('android-cta');
  if (androidCta) androidCta.style.display = 'inline-flex';
});

async function triggerInstall() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;
  deferredPrompt = null;

  const androidCta = document.getElementById('android-cta');
  if (androidCta) androidCta.style.display = 'none';

  const msg = document.getElementById('msg');
  if (msg) msg.textContent = (choice.outcome === 'accepted')
    ? 'Instalación aceptada'
    : 'Instalación descartada';
}

function routeByPlatform() {
  const iosBlock = document.getElementById('ios-block');
  const androidBlock = document.getElementById('android-block');
  const desktopBlock = document.getElementById('desktop-block');
  const installedNote = document.getElementById('installed');

  // Oculta todo por defecto si existen
  [iosBlock, androidBlock, desktopBlock].forEach(el => { if (el) el.style.display = 'none'; });

  if (isStandalone()) {
    if (installedNote) installedNote.style.display = 'block';
    return;
  }

  if (isIOS()) {
    if (iosBlock) iosBlock.style.display = 'block';
  } else if (isAndroid()) {
    if (androidBlock) androidBlock.style.display = 'block';
  } else {
    if (desktopBlock) desktopBlock.style.display = 'block';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  routeByPlatform();

  // REGISTRO DEL SERVICE WORKER — ruta relativa + versión para forzar actualización
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js?v=2')
      .catch(err => console.error('SW register failed:', err));
  }

  const installBtn = document.getElementById('android-cta');
  if (installBtn) installBtn.addEventListener('click', triggerInstall);
});
