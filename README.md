# CapiAgenda

PWA de agenda personal/laboral con Next.js, TypeScript, Tailwind CSS y Firebase. Administra tareas en tiempo real y envía recordatorios push cuando faltan 48 horas o menos para su vencimiento.

## Arquitectura gratuita

El proyecto funciona con Firebase Spark, sin asociar una tarjeta:

- Firebase Authentication: acceso con email y contraseña.
- Firestore: tareas y tokens push dentro de la cuota gratuita.
- Firebase Cloud Messaging: entrega de notificaciones.
- GitHub Actions: revisión diaria gratuita a las 08:00 de Argentina.
- Vercel Hobby: alojamiento HTTPS de la PWA.

GitHub Actions reemplaza Cloud Functions y Cloud Scheduler, que requieren el plan Blaze.

## Desarrollo local

```powershell
npm install --offline=false
npm --prefix functions install --offline=false
npm run dev
```

Las siete variables públicas de Firebase viven en `.env.local`. Reiniciá el servidor después de modificarlas.

## Configuración de Firebase

1. En **Authentication → Sign-in method**, activá Email/Password.
2. Creá Firestore en modo producción.
3. En **Project settings → Cloud Messaging → Web Push certificates**, generá la clave VAPID.
4. Desplegá las reglas e índices, sin Functions:

```powershell
firebase login
firebase use capiagenda
firebase deploy --only "firestore:rules,firestore:indexes"
```

Las colecciones `tasks` y `pushTokens` se crean automáticamente desde la aplicación.

## Recordatorios gratuitos con GitHub Actions

El workflow [daily-reminders.yml](./.github/workflows/daily-reminders.yml) se ejecuta todos los días a las 11:00 UTC, equivalentes a las 08:00 de Argentina. También admite ejecución manual.

### Crear la credencial

1. Firebase Console → engranaje → **Project settings**.
2. Abrí **Service accounts**.
3. Tocá **Generate new private key** y descargá el JSON.
4. No copies ese archivo dentro del repositorio y no lo compartas por chat.

### Guardarla en GitHub

1. Repositorio de GitHub → **Settings**.
2. **Secrets and variables → Actions**.
3. **New repository secret**.
4. Nombre exacto: `FIREBASE_SERVICE_ACCOUNT_JSON`.
5. Pegá como valor todo el contenido del JSON descargado.

En **Actions → Recordatorios diarios → Run workflow** puede probarse el envío manualmente. Las ejecuciones programadas funcionan sobre la rama predeterminada del repositorio.

## Verificaciones

```powershell
npm run typecheck
npm run lint
npm run build
npm --prefix functions run build
```

## Publicar la PWA

Conectá el repositorio a Vercel y agregá las siete variables `NEXT_PUBLIC_*` en Production. Vercel entrega HTTPS, necesario para instalar la PWA y recibir notificaciones.

Después agregá el dominio generado por Vercel en **Firebase Authentication → Settings → Authorized domains**.

## Instalar en el celular

- Android/Chrome: menú ⋮ → **Instalar aplicación**.
- iPhone/Safari: Compartir → **Agregar a pantalla de inicio**.

En iPhone, abrí la PWA instalada antes de activar los recordatorios.

## Estructura

- `src/app`: rutas App Router.
- `src/components`: interfaz y formularios.
- `src/lib`: Firebase, Auth, Firestore y Messaging.
- `functions`: worker Node.js ejecutado por GitHub Actions.
- `.github/workflows`: programación diaria gratuita.
- `public`: manifest, Service Worker, iconos e ilustraciones.
- `firestore.rules`: aislamiento por usuario.

Cuando cambia la fecha límite, `notified48h` vuelve a `false`. Las tareas completadas nunca entran en la consulta de recordatorios.
