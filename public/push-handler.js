if (Notification.permission !== "granted") {
  Notification.requestPermission().then(function (result) {
    if (result === "granted") {
      console.log("알림권한 수락됨");
    }
  });
}

navigator.serviceWorker.register("/service-worker.js");
navigator.serviceWorker.ready
  .then(function (registration) {
    return registration.pushManager
      .getSubscription()
      .then(async function (subscription) {
        if (subscription) {
          return subscription;
        }
        const response = await fetch("http://43.202.181.150:30800/vapidPublicKey");
        const vapidPublicKey = await response.text();
        const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
        return registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        });
      });
  })
  .then(function (subscription) {
    fetch("http://43.202.181.150:30800/register", {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        subscription: subscription,
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          console.log("구독 정보 전송 성공");
        } else {
          console.error("구독 정보 전송 실패");
        }
      })
      .catch((error) => {
        console.error("구독 정보 전송 오류:", error);
      });
  });

function urlBase64ToUint8Array(base64String) {
  var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  var base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
