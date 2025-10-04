# Función VIA — Landing universal (Android + iOS + Desktop)

## Estructura
- `index.html`: Landing con detección de plataforma y CTAs.
- `manifest.webmanifest`: Manifest PWA.
- `sw.js`: Service Worker (cache básico + offline).
- `install.js`: Manejo del `beforeinstallprompt` (Android) e instrucciones iOS.
- `icons/`: Iconos 192/512 y maskable.

## Cómo publicar rápido
### Opción A — GitHub Pages
1. Crea un repositorio (público): `via-pwa-landing`.
2. Sube estos archivos a la rama `main` en la raíz.
3. En Settings → Pages, selecciona `Deploy from a branch`, Branch `main` → `/ (root)`.
4. Espera el deploy: tu URL será `https://<usuario>.github.io/via-pwa-landing/`.
5. Abre la URL en Android (Chrome) e iOS (Safari) y sigue las instrucciones de la landing.

### Opción B — Netlify / Vercel
- Arrastra la carpeta al panel de Netlify o conecta el repo.
- Asegúrate de que `index.html` esté en la raíz. Sin build step.

## QR
Genera un QR que apunte a la URL pública (ej.: `https://<usuario>.github.io/via-pwa-landing/`).

## Personalización
- Cambia colores en `index.html` (`:root`) y `theme_color` en el manifest.
- Sustituye iconos en `icons/` por tus versiones (192 y 512 px). Agrega `apple-touch-icon` a 180×180 si lo prefieres.
- Ajusta el caching en `sw.js` según tus rutas finales.

## Pruebas
- Chrome DevTools → Application: verifica Manifest + Service Worker.
- En iOS: Safari no muestra prompt; usa "Agregar a pantalla de inicio".