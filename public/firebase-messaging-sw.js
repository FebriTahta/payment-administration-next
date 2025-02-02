// Import Firebase compat library untuk Service Worker
importScripts('https://www.gstatic.com/firebasejs/11.2.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.2.0/firebase-messaging-compat.js');

// Konfigurasi Firebase
firebase.initializeApp({
    apiKey: "AIzaSyDR-kM6MJJceNCeDlxasdhOn68vYWfrs-c",
    authDomain: "payment-notification-smk-1.firebaseapp.com",
    projectId: "payment-notification-smk-1",
    storageBucket: "payment-notification-smk-1.appspot.com",
    messagingSenderId: "818110294406",
    appId: "1:818110294406:web:c4d8d31bad3e745650e407",
});

// Inisialisasi Firebase Messaging
const messaging = firebase.messaging();

// Mendengarkan pesan di background
messaging.onBackgroundMessage((payload) => {
    console.log("[Service Worker] Background message received:", payload);

    const notificationTitle = payload.notification?.title || "Default Title";
    const notificationOptions = {
        body: payload.notification?.body || "Default Body",
        icon: payload.notification?.icon || "/favicon.ico",
    };

    // Tampilkan notifikasi
    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Event untuk menangani klik pada notifikasi
self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    const targetUrl = event.notification.data?.click_action || "/";
    event.waitUntil(
        clients.matchAll({ type: "window" }).then((clientList) => {
            for (const client of clientList) {
                if (client.url === targetUrl && "focus" in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
