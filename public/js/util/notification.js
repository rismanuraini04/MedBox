const publicVapidKey =
    "BA4F6DxP4DxOGTb5Ys06sPwVkzRj-OmIAPQZO6fQ8_F8p9BSG9QdJ5CjZwWBBboGddxNQbQ9jEy7Ehwpz1-IkO4";
const notification = document.getElementById("notif");

if ("Notification" in window) {
    if (Notification.permission !== "granted") {
        notification.classList.remove("hidden"); // jika browser belum mengijinkan notifikasi maka tampilkan ui permintaan akses notifikasi
    } else {
        // Cek apakah user sudah subs ke layanan notifikasi
        httpRequest({
            url: "/api/v1/user/notification/status",
            method: "GET",
        })
            .then((data) => {
                // Jika user belum subs, maka subs layanan notifikasi
                if (!data.success) {
                    serviceWorkerRegister().catch((err) => console.log(err));
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

document.getElementById("notif-button").addEventListener("click", (e) => {
    e.preventDefault();
    Notification.requestPermission().then(async (permission) => {
        if (permission === "granted") {
            httpRequest({
                url: "/api/v1/user/notification/status",
                method: "GET",
            })
                .then((data) => {
                    // Jika user belum subs, maka subs layanan notifikasi
                    if (!data.success) {
                        notification.classList.add("hidden");
                        serviceWorkerRegister().catch((err) =>
                            console.log(err)
                        );
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    });
});

async function serviceWorkerRegister() {
    // Register Service Worker
    console.log("Registering service worker...");
    const register = await navigator.serviceWorker.register("/worker.js", {
        scope: "/",
    });

    // Register Push
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey), //from stringConverter.js,
    });

    httpRequest({
        url: "/api/v1/user/notification/subscribe",
        body: subscription,
        method: "POST",
    });
}