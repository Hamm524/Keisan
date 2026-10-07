/* network first (always ask the server, so a new version shows up at once), cache as fallback: the app still opens offline */
var CACHE = 'keisan-v1';
self.addEventListener('install', function(e){
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(['./', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png']); }));
});
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function(e){
  var req = e.request;
  if(req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(fetch(req, { cache:'no-cache' }).then(function(res){
    if(res.ok){ var copy = res.clone(); caches.open(CACHE).then(function(c){ c.put(req, copy); }); }
    return res;
  }).catch(function(){
    return caches.match(req).then(function(m){ return m || caches.match('./'); });
  }));
});
