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
  androidCta.style.display = 'inline-flex';
});

async function triggerInstall() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;
  deferredPrompt = null;
  const androidCta = document.getElementById('android-cta');
  androidCta.style.display = 'none';
  const msg = document.getElementById('msg');
  msg.textContent = (choice.outcome === 'accepted') ? 'Instalación aceptada' : 'Instalación descartada';
}

function routeByPlatform() {
  const iosBlock = document.getElementById('ios-block');
  const androidBlock = document.getElementById('android-block');
  const desktopBlock = document.getElementById('desktop-block');

  if (isStandalone()) {
    document.getElementById('installed').style.display = 'block';
    iosBlock.style.display = 'none';
    androidBlock.style.display = 'none';
    desktopBlock.style.display = 'none';
    return;
  }

  if (isIOS()) {
    iosBlock.style.display = 'block';
    androidBlock.style.display = 'none';
    desktopBlock.style.display = 'none';
  } else if (isAndroid()) {
    iosBlock.style.display = 'none';
    androidBlock.style.display = 'block';
    desktopBlock.style.display = 'none';
  } else {
    iosBlock.style.display = 'none';
    androidBlock.style.display = 'none';
    desktopBlock.style.display = 'block';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  routeByPlatform();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
  const installBtn = document.getElementById('android-cta');
  installBtn.addEventListener('click', triggerInstall);
});