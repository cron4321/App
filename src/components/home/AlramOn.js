if (Notification.permission !== "granted") {
  Notification.requestPermission().then(function (result) {
    if (result === "granted") {
      console.log("알림권한 수락됨");
    }
  });
}

navigator.serviceWorker.register("/service-worker.js");
document
  .getElementById("subscribeButton")
  .addEventListener("click", function () {
    navigator.serviceWorker.ready
      .then(function (registration) {
        return registration.pushManager
          .getSubscription()
          .then(async function (subscription) {
            if (subscription) {
              return subscription;
            }
            const response = await fetch(
              "http://localhost:4000/vapidPublicKey"
            );
            const vapidPublicKey = await response.text();
            const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
            return registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: convertedVapidKey,
            });
          });
      })
      .then(function (subscription) {
        console.log(subscription);
        fetch("http://localhost:4000/register", {
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
  });