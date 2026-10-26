/* The shell contains no personal data. User data stays in localStorage. */
const CACHE = "mexico26-v4";
const SHELL = [
  "/",
  "/manifest.webmanifest",
  "/icon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-512.png",
];
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await cache.addAll(SHELL);
      // Initial page scripts loaded before the worker took control must also be cached.
      const shell = await cache.match("/");
      const html = await shell.text();
      const assets = [...html.matchAll(/(?:src|href)="([^\"]+)"/g)]
        .map((match) => match[1])
        .filter((path) => path.startsWith("/_next/static/"));
      await cache.addAll([...new Set(assets)]);
      await self.skipWaiting();
    })(),
  );
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith("mexico26-") && k !== CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});
self.addEventListener("fetch", (event) => {
  const req = event.request,
    url = new URL(req.url);
  if (
    req.method !== "GET" ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith("/api/")
  )
    return;
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then(async (response) => {
          if (response.ok) {
            const cache = await caches.open(CACHE);
            await cache.put("/", response.clone());
          }
          return response;
        })
        .catch(() => caches.match("/")),
    );
    return;
  }
  if (
    url.pathname.startsWith("/_next/static/") ||
    SHELL.includes(url.pathname)
  ) {
    event.respondWith(
      caches.match(req).then(
        (cached) =>
          cached ||
          fetch(req).then(async (response) => {
            if (response.ok) {
              const cache = await caches.open(CACHE);
              await cache.put(req, response.clone());
            }
            return response;
          }),
      ),
    );
  }
});
