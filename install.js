// install.js — Project Pages listo (subcarpeta) + soporte de IDs viejos/nuevos
let deferredPrompt;

function isIOS() {
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}
function isAndroid() { return /Android/i.test(navigator.userAgent); }
function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
}

function show(el){ if(el) el.classList ? el.classList.remove('hide') : (el.style.display='block'); }
function hide(el){ if(el) el.classList ? el.classList.add('hide') : (el.style.display='none'); }

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
  if (msg) msg.textContent = (choice.outcome === 'accepted') ? 'Instalación aceptada' : 'Instalación descartada';
}

function routeByPlatform() {
  // IDs “viejos” (bloques)
  const iosBlock = document.getElementById('ios-block');
  const androidBlock = document.getElementById('android-block');
  const desktopBlock = document.getElementById('desktop-block');

  // IDs “nuevos” (CTAs arriba del fold)
  const iosCta = document.getElementById('ios-cta');
  const iosSteps = document.getElementById('ios-steps');
  const androidFallback = document.getElementById('android-fallback');
  const desktopCta = document.getElementById('desktop-cta');

  const installedNote = document.getElementById('installed');

  // Ocultar todo por defecto si existen
  [iosBlock, androidBlock, desktopBlock, iosCta, iosSteps, androidFallback, desktopCta].forEach(hide);

  if (isStandalone()) { show(installedNote); return; }

  if (isIOS()) {
    show(iosBlock);    // viejo
    show(iosCta);      // nuevo
    show(iosSteps);    // nuevo
  } else if (isAndroid()) {
    show(androidBlock);     // viejo
    show(androidFallback);  // nuevo (por si no aparece el prompt)
  } else {
    show(desktopBlock); // viejo
    show(desktopCta);   // nu
