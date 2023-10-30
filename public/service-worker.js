/* eslint-disable no-restricted-globals */

self.addEventListener("install", (event) => {
  console.log("서비스워커 설치됨");
  // event.waitUntil(
  //   caches.open("my-cache").then((cache) => {
  //     return cache.addAll(["/", "/index.html"]);
  //   })
  // );
});

self.addEventListener("activate", (event) => {
  // SW 활성화 시 추가 동작이 필요한 경우 여기에 추가합니다.
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
    body: event.data.text(),
  };

  event.waitUntil(self.registration.showNotification("새로운 알림", payload));
});
