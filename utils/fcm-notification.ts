import { getMessaging, Messaging, getToken, onMessage, MessagePayload } from "firebase/messaging";
import { initializeApp } from "firebase/app";

// Konfigurasi Firebase
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
};

// Inisialisasi Firebase hanya jika berada di browser
let messaging: Messaging | undefined;

if (typeof window !== "undefined") {
    const firebaseApp = initializeApp(firebaseConfig);
    messaging = getMessaging(firebaseApp);
}

const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | undefined> => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
        console.error("Service Worker not supported or running on server.");
        return undefined;
    }

    const existingRegistration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
    if (!existingRegistration) {
        console.log("Registering new Service Worker...");
        return await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    } else {
        console.log("Using existing Service Worker...");
        return existingRegistration;
    }
};

let cachedToken: string | null = null;

export const getFcmToken = async (): Promise<string | null> => {
    if (!messaging) {
        console.error("Firebase Messaging is not initialized.");
        return null;
    }

    if (cachedToken) {
        console.log("Using cached FCM Token:", cachedToken);
        return cachedToken;
    }

    try {
        const serviceWorkerRegistration = await registerServiceWorker();
        if (!serviceWorkerRegistration) {
            console.error("Failed to register Service Worker.");
            return null;
        }

        const vapidKey = process.env.NEXT_PUBLIC_VAPID_KEY;

        const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration });
        console.log("FCM Token generated:", token);

        cachedToken = token; // Cache token
        return token;
    } catch (error) {
        console.error("Error getting FCM token:", error);
        return null;
    }
};

// Hanya untuk log pesan, tidak memunculkan notifikasi
export const onMessageListener = (): Promise<MessagePayload> =>
    new Promise((resolve, reject) => {
        if (!messaging) {
            console.error("Firebase Messaging is not initialized.");
            reject(new Error("Firebase Messaging is not initialized."));
            return;
        }

        // Hanya log, tidak tampilkan notifikasi di frontend
        onMessage(messaging, (payload: MessagePayload) => {
            console.log("Message received in foreground:", payload);
            resolve(payload);
        });
    });

export const requestNotificationPermission = async (): Promise<boolean> => {
    if (typeof window === "undefined") return false;

    try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            console.log("Notification permission granted.");
            return true;
        } else if (permission === "denied") {
            console.warn("Notification permission denied.");
            alert("Aktifkan notifikasi di pengaturan browser untuk mendapatkan pemberitahuan.");
            return false;
        } else {
            console.log("Notification permission not granted yet.");
            return false;
        }
    } catch (error) {
        console.error("Error requesting notification permission:", error);
        return false;
    }
};
