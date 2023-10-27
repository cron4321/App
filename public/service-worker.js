/* eslint-disable no-restricted-globals */

const cacheName = "my-cache";
const filesToCache = ["./", "./index.html", "../src"];

self.addEventListener("install", (event) => {
  console.log("서비스워커 설치됨");
  // event.waitUntil(
  //   caches.open(cacheName).then((cache) => {
  //     return cache.addAll(filesToCache);
  //   })
  // );
});

self.addEventListener("activate", (event) => {
  console.log("서비스워커 동작 시작됨");
});

// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches
//       .match(event.request)
//       .then((response) => {
//         if (!response) {
//           console.log("네트워크에서 데이터 요청", event.request);
//           return fetch(event.request);
//         }
//         console.log("캐시에서 데이터 요청", event.request);
//         return response;
//       })
//       .catch((err) => console.log(err))
//   );
// });

// 푸시 알림 수신 시
self.addEventListener("push", (event) => {
  // 푸시 알림이 도착했을 때의 동작을 정의합니다.
  const payload = event.data ? event.data.json() : "no payload";

  event.waitUntil(
    self.registration.showNotification("새로운 공지사항이 왔습니다!", {
      body: payload.body,
    })
  );
});
