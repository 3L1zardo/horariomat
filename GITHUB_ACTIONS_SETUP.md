# 🚀 Configurar Deploy Automático con GitHub Actions

## ✅ Ya está configurado el workflow

El archivo `.github/workflows/firebase-deploy.yml` ya está listo y se ejecutará automáticamente cuando hagas push a:
- `main`
- `master`
- `claude/user-accounts-notifications-8my5o`

## 🔑 Paso 1: Obtener el Token de Firebase

### Opción A: Token CI (Más simple)

1. Abre tu terminal **local** (no en GitHub)
2. Ejecuta:
   ```bash
   firebase login:ci
   ```
3. Se abrirá el navegador para autenticarte
4. Copia el token que aparece en la terminal

### Opción B: Service Account (Más seguro - Recomendado)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto `horario-esfm`
3. Ve a **⚙️ Project Settings** > **Service Accounts**
4. Clic en **Generate New Private Key**
5. Se descargará un archivo JSON
6. **Guarda este archivo de forma segura** (nunca lo subas a Git)

---

## 🔐 Paso 2: Agregar Secrets en GitHub

### Para Token CI:

1. Ve a tu repositorio en GitHub: https://github.com/3L1zardo/horariomat
2. Clic en **Settings** (del repositorio)
3. En el menú izquierdo: **Secrets and variables** > **Actions**
4. Clic en **New repository secret**
5. Agrega:
   - **Name**: `FIREBASE_TOKEN`
   - **Value**: Pega el token que copiaste
6. Clic en **Add secret**

### Para Service Account:

1. En la misma página de Secrets
2. Clic en **New repository secret**
3. Agrega:
   - **Name**: `FIREBASE_SERVICE_ACCOUNT`
   - **Value**: Pega todo el contenido del archivo JSON (completo)
4. Clic en **Add secret**

---

## 🎯 Paso 3: Activar el Deploy

### Opción 1: Push automático (Ya hecho ✅)

Cada vez que hagas push a la rama `claude/user-accounts-notifications-8my5o`, se desplegará automáticamente.

### Opción 2: Deploy manual desde GitHub

1. Ve a tu repositorio en GitHub
2. Clic en **Actions**
3. Selecciona **Deploy to Firebase**
4. Clic en **Run workflow**
5. Selecciona la rama `claude/user-accounts-notifications-8my5o`
6. Clic en **Run workflow**

---

## 📊 Ver el Progreso del Deploy

1. Ve a **Actions** en GitHub
2. Verás el workflow ejecutándose en tiempo real
3. Puedes ver logs y errores si algo falla
4. Cuando termine exitosamente, verás un ✅ verde

---

## 🌐 URLs Después del Deploy

Tu app estará disponible en:
- **Principal**: https://horario-esfm.web.app
- **Alternativa**: https://horario-esfm.firebaseapp.com

---

## 🔍 Troubleshooting

### Error: "FIREBASE_TOKEN not set"
- Verifica que agregaste el secret con el nombre exacto `FIREBASE_TOKEN`
- Asegúrate de estar en la rama correcta

### Error: "Permission denied"
- El token expiró, genera uno nuevo con `firebase login:ci`
- O usa Service Account (recomendado para producción)

### Error: "Project not found"
- Verifica que el proyecto en Firebase sea `horario-esfm`
- Chequea `.firebaserc` para confirmar el nombre del proyecto

---

## ⚡ Deploy Instantáneo (Una vez configurado)

```bash
# Desde tu terminal local:
git add .
git commit -m "Actualizar app"
git push

# GitHub Actions se encarga del resto automáticamente! 🎉
```

---

## 🎊 Resultado Final

Una vez configurado:
1. ✅ Haces push a GitHub
2. ✅ GitHub Actions detecta el push
3. ✅ Instala dependencias
4. ✅ Despliega a Firebase Hosting
5. ✅ Despliega reglas de Firestore
6. ✅ Tu app está en línea en 2-3 minutos

**Sin necesidad de hacer `firebase deploy` manualmente!** 🚀
