// __ Servive Worker für eine Progressive Webapp - ermöglicht offlein funktionalität durch caching 
const CACHE = 'expensetrack-v4'; // name des caches speichers 

// Dateien die beim starten der app gecached werden sollen 
const ASSETS = [
  '/',
  '/static/css/stylesheet.css',
  '/static/js/script.js',
  '/static/manifest.json',
];

// INstall Event - wird einmalig vorbefüllt mit den ASSETS Dateien, damit die app auch offline funktioniert
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS))
  );
  self.skipWaiting(); // überspringe die wartephaes und aktibiere den worker 
});


// Activate -Event -> sorgt dafür dass alte caches aufgeräumt werden, 
// löscht alle caches die nicht expensetrack-v4 heißen 
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim(); //übernimmt die kontrolle über alle öffenen tabs
});


// Fetch- Event -> Anfragen abfragen 
// Nur Get Anfragen werden behandelt
// Cache-First Strategie: 
//  1. Liegt die Ressource im Cach -> direkt zurückgeben aúch offline 
// 2. Liegt die Ressource nicht im Cache -> fetch von der Netzwerk, im Cache speichern und zurückgeben
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((cached) =>
      cached ?? fetch(e.request).then((res) => {
        const clone = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, clone));
        return res;
      })
    )
  );
});
