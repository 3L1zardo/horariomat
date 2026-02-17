/**
 * Cloud Functions - HorarioMat
 * Envía notificaciones push a los usuarios cuando sus recordatorios están por vencer.
 * Corre cada minuto para verificar recordatorios dentro de la próxima hora.
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();
const messaging = admin.messaging();

/**
 * Función programada que corre cada minuto.
 * Busca recordatorios que vencen en los próximos 60 minutos y envía:
 *   - Aviso 15 minutos antes
 *   - Notificación exacta en el momento
 *
 * Requiere plan Blaze en Firebase.
 */
exports.sendScheduledReminders = functions.pubsub
    .schedule('every 1 minutes')
    .timeZone('America/La_Paz') // Cambia a tu zona horaria si es necesario
    .onRun(async () => {
        const now = new Date();

        // Ventana de ejecución: ±30 segundos del minuto actual
        const windowStart = new Date(now.getTime() - 30000);
        const windowEnd = new Date(now.getTime() + 30000);

        // Ventana para aviso de 15 minutos antes
        const before15Start = new Date(now.getTime() + 15 * 60000 - 30000);
        const before15End = new Date(now.getTime() + 15 * 60000 + 30000);

        functions.logger.info(`Verificando recordatorios. Ahora: ${now.toISOString()}`);

        try {
            const usersSnapshot = await db.collection('users').get();

            const sendPromises = [];

            for (const userDoc of usersSnapshot.docs) {
                const userData = userDoc.data();
                const fcmToken = userData.fcmToken;

                if (!fcmToken) continue;

                const remindersSnapshot = await db
                    .collection('users')
                    .doc(userDoc.id)
                    .collection('reminders')
                    .where('completed', '==', false)
                    .get();

                for (const reminderDoc of remindersSnapshot.docs) {
                    const reminder = reminderDoc.data();
                    if (!reminder.date || !reminder.time) continue;

                    // Construir fecha del recordatorio
                    const [year, month, day] = reminder.date.split('-').map(Number);
                    const [hour, minute] = reminder.time.split(':').map(Number);
                    const reminderDateTime = new Date(year, month - 1, day, hour, minute, 0);

                    const category = getCategoryLabel(reminder.type);

                    // --- Notificación exacta en el momento ---
                    if (reminderDateTime >= windowStart && reminderDateTime <= windowEnd) {
                        const payload = buildPayload(
                            `🔔 ${category} ${reminder.title}`,
                            buildBody(reminder),
                            reminder,
                            fcmToken
                        );
                        sendPromises.push(
                            safeSend(payload, userDoc.id, reminder.id || reminderDoc.id, 'exact')
                        );
                    }

                    // --- Aviso 15 minutos antes ---
                    if (reminderDateTime >= before15Start && reminderDateTime <= before15End) {
                        const payload = buildPayload(
                            `⏰ En 15 min: ${reminder.title}`,
                            `${category} · ${buildBody(reminder)}`,
                            reminder,
                            fcmToken
                        );
                        sendPromises.push(
                            safeSend(payload, userDoc.id, reminder.id || reminderDoc.id, 'before15')
                        );
                    }
                }
            }

            await Promise.all(sendPromises);
            functions.logger.info(`Notificaciones enviadas: ${sendPromises.length}`);
        } catch (error) {
            functions.logger.error('Error en sendScheduledReminders:', error);
        }
    });

// ── Helpers ────────────────────────────────────────────────────────────────

function buildPayload(title, body, reminder, token) {
    return {
        token,
        notification: { title, body },
        data: {
            reminderId: String(reminder.id || ''),
            url: '/',
            type: reminder.type || 'otro'
        },
        android: {
            priority: 'high',
            notification: {
                channelId: 'reminders',
                priority: 'max',
                defaultVibrateTimings: true
            }
        },
        apns: {
            payload: {
                aps: {
                    sound: 'default',
                    badge: 1
                }
            }
        },
        webpush: {
            headers: { Urgency: 'high' },
            notification: {
                icon: 'https://horario-esfm.web.app/icon-192.png',
                badge: 'https://horario-esfm.web.app/icon-192.png',
                requireInteraction: true,
                vibrate: [300, 100, 300, 100, 300],
                actions: [
                    { action: 'complete', title: '✅ Completar' },
                    { action: 'snooze', title: '⏰ +10 min' }
                ]
            }
        }
    };
}

function buildBody(reminder) {
    const parts = [];
    if (reminder.subject) parts.push(reminder.subject);
    if (reminder.description) parts.push(reminder.description);
    return parts.join(' · ') || 'Recordatorio';
}

function getCategoryLabel(type) {
    const labels = {
        tarea: '📝',
        examen: '📄',
        exposicion: '🎤',
        evento: '🎉',
        congreso: '🎓',
        otro: '📌'
    };
    return labels[type] || '📌';
}

async function safeSend(payload, userId, reminderId, type) {
    try {
        await messaging.send(payload);
        functions.logger.info(`Push enviado [${type}] usuario=${userId} reminder=${reminderId}`);
    } catch (error) {
        // Token inválido/expirado: limpiar del usuario
        if (
            error.code === 'messaging/registration-token-not-registered' ||
            error.code === 'messaging/invalid-registration-token'
        ) {
            functions.logger.warn(`Token inválido para usuario ${userId}, limpiando...`);
            await db.collection('users').doc(userId).update({ fcmToken: admin.firestore.FieldValue.delete() });
        } else {
            functions.logger.error(`Error enviando push [${type}]:`, error.message);
        }
    }
}
