// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyCE63GL0YwSvc-KTQE_RZ4AgGELFc-yUME",
    authDomain: "horario-esfm.firebaseapp.com",
    projectId: "horario-esfm",
    storageBucket: "horario-esfm.firebasestorage.app",
    messagingSenderId: "1046696947499",
    appId: "1:1046696947499:web:8d593fcab4ef61379a9f6e"
});

const messaging = firebase.messaging();

// Recibir notificaciones cuando la app está CERRADA
messaging.onBackgroundMessage((payload) => {
    console.log('📩 Notificación en segundo plano:', payload);
    
    const { title, body } = payload.notification;
    
    self.registration.showNotification(title, {
        body: body,
        icon: 'icon-192.png',
        badge: 'icon-192.png',
        vibrate: [200, 100, 200],
        data: payload.data
    });
});