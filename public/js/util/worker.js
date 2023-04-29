console.log("Service Worker Loaded...");

self.addEventListener("push", (e) => {
    const data = e.data.json();
    console.log("Push Recieved...");
    self.registration.showNotification(data.title, {
        body: "Don't forget to take your medication on time. Stay on top of your health and wellness by following your prescribed regimen.",
        icon: "/img/medicine.png",
    });
});
