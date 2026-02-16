// Firebase en Service Worker
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

// Recibir notificaciones en segundo plano (app cerrada)
messaging.onBackgroundMessage((payload) => {
    console.log('📩 Notificación en segundo plano:', payload);
    const { title, body } = payload.notification;
    self.registration.showNotification(title, {
        body: body,
        icon: 'icon-192.png',
        badge: 'icon-192.png',
        vibrate: [200, 100, 200]
    });
});

// =============================================
// Tu código existente (sin cambios)
// =============================================

const CACHE_NAME = 'horario-esfm-v1';
const urlsToCache = [
  './',
  'index.html',
  'manifest.json',
  'icon-192.png'
];

// INSTALACIÓN - cachear recursos
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
      .then(function() {
        return self.skipWaiting();
      })
  );
});

// ACTIVACIÓN - limpiar caches antiguos
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(name) {
          return name !== CACHE_NAME;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    }).then(function() {
      return clients.claim();
    })
  );
});

// FETCH - servir desde cache o red
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        return response || fetch(event.request);
      })
  );
});

// 🔔 PUSH - recibir notificaciones push
self.addEventListener('push', function(event) {
  var data = event.data ? event.data.json() : {
    title: 'Horario ESFM',
    body: 'Tienes un nuevo recordatorio'
  };

  var options = {
    body: data.body,
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
      reminderId: data.reminderId
    },
    actions: [
      { action: 'complete', title: '✓ Completar' },
      { action: 'close', title: 'Cerrar' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// CLICK en notificación
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  var reminderId = event.notification.data.reminderId;

  if (event.action === 'complete') {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(function(clientList) {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if ('focus' in client) {
            client.postMessage({
              type: 'COMPLETE_REMINDER',
              reminderId: reminderId
            });
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/?complete=' + reminderId);
        }
      })
    );
  } else if (event.action === 'close') {
    return;
  } else {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(function(clientList) {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if ('focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});