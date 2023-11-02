self.addEventListener("install", (event) => {
  console.log("서비스워커 설치됨");
  event.waitUntil(
    caches.open("my-cache").then((cache) => {
      return cache.addAll([
        "/PWAiconimg/icons/maskable_icon_x512.png",
        "/index.html",
        "/favicon.ico"
      ]);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("서비스워커 동작 시작됨");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("push", (event) => {
  const payload = {
    body: event.data.json().body
  };
  event.waitUntil(self.registration.showNotification("새 공지사항이 있습니다!", payload));
});
