const CACHE='am-finanze-v3';
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(['./manifest.webmanifest','./icon.svg'])));
  self.skipWaiting();
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith('am-finanze-')&&key!==CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin||!url.pathname.includes('/finanze/'))return;
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(new Request(event.request,{cache:'no-store'})).catch(()=>new Response('Sei offline. Riconnettiti a Internet e riapri Aerial Move Finanze.',{headers:{'Content-Type':'text/plain;charset=utf-8'}})));
  }
});