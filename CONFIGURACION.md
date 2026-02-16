# 📱 Horario ESFM - Configuración

## ✅ Cambios Implementados

### 🔐 Sistema de Autenticación
- ✅ Login con Email/Password
- ✅ Login con Google OAuth
- ✅ Pantalla de login/registro moderna
- ✅ Gestión de sesiones persistentes

### ☁️ Sincronización en la Nube
- ✅ Migración automática de datos locales a Firebase
- ✅ Sincronización en tiempo real entre dispositivos
- ✅ Todos los datos en Firestore con reglas de seguridad

### 🔔 Notificaciones Mejoradas
- ✅ Notificaciones tipo alarma (persistentes)
- ✅ Integración con Google Calendar
- ✅ Selector de método de notificaciones
- ✅ Notificación 15 minutos antes del evento
- ✅ Acciones en notificaciones (Completar/Posponer/Cerrar)

### 🐛 Bugs Arreglados
- ✅ Fecha desfasada en recordatorios (problema de zona horaria)
- ✅ Notificaciones que no persistían al cerrar la app

---

## ⚙️ Configuración Necesaria

### 1. Reglas de Firestore

Ya están configuradas en `firestore.rules`. Ejecuta:

\`\`\`bash
firebase deploy --only firestore:rules
\`\`\`

### 2. Google Calendar API (Opcional)

Para usar la integración con Google Calendar:

#### Paso 1: Crear credenciales OAuth 2.0

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto `horario-esfm` (o créalo)
3. Ve a **APIs & Services** > **Credentials**
4. Clic en **Create Credentials** > **OAuth client ID**
5. Tipo: **Web application**
6. Nombre: `Horario ESFM Web`
7. **Authorized JavaScript origins**:
   - `https://horario-esfm.web.app`
   - `https://horario-esfm.firebaseapp.com`
   - `http://localhost:5000` (para desarrollo)
8. **Authorized redirect URIs**:
   - `https://horario-esfm.web.app`
   - `https://horario-esfm.firebaseapp.com`
9. Copia el **Client ID**

#### Paso 2: Habilitar Calendar API

1. En Google Cloud Console
2. Ve a **APIs & Services** > **Library**
3. Busca "Google Calendar API"
4. Clic en **Enable**

#### Paso 3: Crear API Key

1. En **Credentials**
2. Clic en **Create Credentials** > **API key**
3. Restringe la key a "Google Calendar API"
4. Copia la API Key

#### Paso 4: Actualizar el código

En `index.html`, líneas ~4523-4525, reemplaza:

\`\`\`javascript
const CALENDAR_CLIENT_ID = 'TU_CLIENT_ID_AQUI.apps.googleusercontent.com';
const CALENDAR_API_KEY = 'TU_API_KEY_AQUI';
\`\`\`

---

## 🚀 Despliegue

### Desplegar todo:

\`\`\`bash
firebase deploy
\`\`\`

### Solo reglas de Firestore:

\`\`\`bash
firebase deploy --only firestore:rules
\`\`\`

### Solo hosting:

\`\`\`bash
firebase deploy --only hosting
\`\`\`

---

## 📱 Funcionalidades

### Para Usuarios

1. **Registro/Login**
   - Crea tu cuenta con email o Google
   - Tus datos se sincronizan automáticamente

2. **Recordatorios**
   - Agrega recordatorios con fecha y hora
   - Elige si quieres notificaciones web o en Google Calendar
   - Recibe alertas 15 minutos antes

3. **Sincronización**
   - Edita en tu celular → aparece en tu computadora
   - Edita en tu computadora → aparece en tu celular
   - Todo en tiempo real ⚡

4. **Notificaciones**
   - **Web**: Alarmas persistentes en la app
   - **Google Calendar**: Notificaciones del calendario nativo
   - **Ambas**: Recibe en ambos lugares

### Para Administradores

- Las reglas de Firestore aseguran que cada usuario solo vea sus datos
- Logs de autenticación en Firebase Console
- Estadísticas de uso en Firebase Analytics

---

## 🔒 Seguridad

- ✅ Cada usuario solo puede acceder a sus propios datos
- ✅ Autenticación requerida para todas las operaciones
- ✅ Reglas de Firestore estrictas
- ✅ Tokens seguros de Firebase Auth

---

## 🆘 Troubleshooting

### "Notificaciones no funcionan"
- Verifica permisos de notificación en el navegador
- Asegúrate de estar en HTTPS (no HTTP)
- En Chrome: Settings > Privacy > Site Settings > Notifications

### "No sincroniza entre dispositivos"
- Verifica que iniciaste sesión con la misma cuenta
- Revisa la consola del navegador (F12)
- Verifica conexión a internet

### "Error al crear evento en Calendar"
- Verifica que configuraste las credenciales OAuth
- Autoriza los permisos cuando se te solicite
- Revisa que Calendar API esté habilitada

---

## 📞 Soporte

- **Issues**: Reporta bugs en el repositorio
- **Email**: [Tu email de contacto]

---

## 📄 Licencia

Este proyecto es privado y pertenece a E.S.F.M. Simón Bolívar.
