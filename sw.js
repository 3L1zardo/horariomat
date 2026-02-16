// sw.js

self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    const reminderId = event.notification.data.reminderId;

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

self.addEventListener('install', function(event) {
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    event.waitUntil(clients.claim());
});