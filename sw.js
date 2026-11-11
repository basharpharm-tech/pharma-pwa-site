const scope = self.registration.scope;
const prefix = "pharma-pwa:" + scope + ":";
const cacheName = prefix + "a741e8992a2fb023231f";
const paths = ["assets/AssetManifest.bin", "assets/AssetManifest.bin.json", "assets/FontManifest.json", "assets/NOTICES", "assets/assets/data/diarrhea.json", "assets/assets/data/listofdiseases.json", "assets/assets/fonts/NotoNaskhArabic-Regular.ttf", "assets/assets/fonts/Roboto-Bold.ttf", "assets/assets/fonts/Roboto-Italic.ttf", "assets/assets/fonts/Roboto-Medium.ttf", "assets/assets/fonts/Roboto-Regular.ttf", "assets/assets/icons/someone.png", "assets/assets/icons/user.png", "assets/assets/icons/woman.png", "assets/assets/images/logo.png", "assets/assets/translations/ar.json", "assets/assets/translations/en.json", "assets/fonts/MaterialIcons-Regular.otf", "assets/packages/cupertino_icons/assets/CupertinoIcons.ttf", "assets/shaders/ink_sparkle.frag", "assets/shaders/stretch_effect.frag", "canvaskit/canvaskit.js", "canvaskit/canvaskit.wasm", "favicon.png", "flutter_bootstrap.js", "icons/Icon-192.png", "icons/Icon-512.png", "index.html", "main.dart.js", "manifest.json", "version.json"];
const resources = new Set(paths.map(path => new URL(path, scope).href));
const index = new URL("index.html", scope).href;

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    await cache.addAll([...resources].map(url => new Request(url, {cache: "reload"})));
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith(prefix) && key !== cacheName) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  url.search = "";
  const key = req.mode === "navigate" && (url.href === scope || url.href === index)
    ? index : url.href;
  if (!resources.has(key)) return;
  event.respondWith((async () => {
    const cache = await caches.open(cacheName);
    return await cache.match(key) || fetch(req);
  })());
});
