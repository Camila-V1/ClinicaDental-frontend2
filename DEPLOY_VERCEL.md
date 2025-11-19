# 🚀 Guía de Despliegue en Vercel - Clínica Dental Frontend

## 📋 Requisitos Previos

1. ✅ Cuenta en Vercel (gratis): https://vercel.com
2. ✅ Backend desplegado en Render
3. ✅ Repositorio GitHub del frontend
4. ✅ Node.js 18+ instalado localmente

---

## 🔧 Paso 1: Preparar el Proyecto

### 1.1 Verificar archivos de configuración

Ya están creados:
- ✅ `vercel.json` - Configuración de Vercel
- ✅ `.env.production` - Variables de entorno para producción
- ✅ `vite.config.ts` - Configuración de Vite

### 1.2 Actualizar `.gitignore`

Asegúrate de que `.env.local` NO esté en el repositorio:
```bash
# Verificar que .env.local esté ignorado
cat .gitignore | grep .env
```

---

## 🌐 Paso 2: Subir a GitHub

### 2.1 Inicializar Git (si no está hecho)

```bash
git init
git add .
git commit -m "feat: preparar frontend para deploy en Vercel"
```

### 2.2 Crear repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre: `ClinicaDental-frontend2`
3. Descripción: "Frontend React + TypeScript para sistema de clínica dental"
4. Visibilidad: **Public** o **Private**
5. Click **"Create repository"**

### 2.3 Conectar y subir

```bash
git remote add origin https://github.com/TU_USUARIO/ClinicaDental-frontend2.git
git branch -M main
git push -u origin main
```

---

## 🚀 Paso 3: Desplegar en Vercel

### Opción A: Desde la Web (Recomendado)

1. **Ir a Vercel:**
   - Visita: https://vercel.com
   - Click en **"Login"** o **"Sign Up"**
   - Conecta con GitHub

2. **Importar Proyecto:**
   - Click en **"Add New..."** → **"Project"**
   - Busca `ClinicaDental-frontend2`
   - Click en **"Import"**

3. **Configurar Proyecto:**
   ```
   Project Name: clinica-dental-frontend
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Variables de Entorno:**
   
   En la sección **"Environment Variables"**, agregar:
   
   | Name | Value |
   |------|-------|
   | `VITE_API_URL` | `https://clinica-dental-backend.onrender.com` |
   | `VITE_API_BASE_URL` | `https://clinica-dental-backend.onrender.com` |
   | `VITE_ENV` | `production` |
   | `VITE_DEBUG` | `false` |
   | `VITE_API_TIMEOUT` | `15000` |
   | `VITE_BASE_DOMAIN` | `onrender.com` |

5. **Deploy:**
   - Click en **"Deploy"**
   - Espera 2-3 minutos ⏳

6. **¡Listo!** 🎉
   - Tu app estará en: `https://clinica-dental-frontend.vercel.app`

### Opción B: Desde CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Seguir las instrucciones:
# - Set up and deploy? Y
# - Which scope? (tu cuenta)
# - Link to existing project? N
# - What's your project's name? clinica-dental-frontend
# - In which directory is your code located? ./
# - Want to override settings? N

# Deploy a producción
vercel --prod
```

---

## 🔧 Paso 4: Configurar Backend para CORS

En tu backend (Render), asegúrate de que el CORS permita tu dominio de Vercel:

**En el archivo `settings.py` del backend:**

```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://clinica-dental-frontend.vercel.app',  # ← Agregar esto
    'https://*.vercel.app',  # Permite todos los deploys de preview
]

# O usa wildcard (menos seguro pero más flexible)
CORS_ALLOW_ALL_ORIGINS = True  # Solo para desarrollo
```

**Actualizar en Render:**
1. Ve a tu servicio backend en Render
2. **Environment** → Agregar:
   ```
   CORS_ALLOWED_ORIGINS=https://clinica-dental-frontend.vercel.app,https://*.vercel.app
   ```
3. El servicio se reiniciará automáticamente

---

## 🌐 Paso 5: Dominio Personalizado (Opcional)

### 5.1 Configurar en Vercel

1. En tu proyecto de Vercel, ve a **"Settings"** → **"Domains"**
2. Click en **"Add Domain"**
3. Ingresa tu dominio: `app.tuclinica.com`
4. Vercel te dará las configuraciones DNS

### 5.2 Configurar DNS

En tu proveedor de dominios (ej: Namecheap, GoDaddy):

**Para subdominio (`app.tuclinica.com`):**
```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

**Para dominio raíz (`tuclinica.com`):**
```
Type: A
Name: @
Value: 76.76.21.21
```

### 5.3 Esperar propagación
- DNS puede tardar hasta 48 horas (normalmente 5-10 minutos)
- Vercel automáticamente configura HTTPS

---

## 📊 Paso 6: Verificar Deployment

### 6.1 Probar la aplicación

Visita tu URL de Vercel:
```
https://clinica-dental-frontend.vercel.app
```

### 6.2 Verificar conexión con backend

1. **Abrir DevTools** (F12)
2. **Console** → Verificar que no haya errores de CORS
3. **Network** → Verificar llamadas a `https://clinica-dental-backend.onrender.com`
4. **Intentar login** con las credenciales:
   ```
   Email: paciente1@test.com
   Password: password123
   ```

### 6.3 Verificar funcionalidades

- ✅ Login funciona
- ✅ Dashboard carga
- ✅ Citas se muestran
- ✅ Odontograma se visualiza
- ✅ Facturas cargan

---

## 🔄 Actualizaciones Automáticas

### Cada vez que hagas `git push`:

```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main
```

**Vercel automáticamente:**
1. ✅ Detecta el push
2. ✅ Ejecuta `npm run build`
3. ✅ Despliega la nueva versión
4. ✅ Te notifica por email

### Preview Deployments

Cada **Pull Request** crea un deployment de preview:
- URL única: `https://clinica-dental-frontend-git-feature-branch.vercel.app`
- Perfecto para testing antes de merge

---

## 🐛 Troubleshooting

### Error: "Build failed"

**Solución 1:** Verificar logs en Vercel
```
Vercel Dashboard → Deployments → Click en el deployment fallido → View Logs
```

**Solución 2:** Build local
```bash
npm run build
# Si falla localmente, arreglar errores primero
```

### Error: CORS

**Problema:** Peticiones bloqueadas por CORS
**Solución:** Verificar que el backend tenga configurado el dominio de Vercel en `CORS_ALLOWED_ORIGINS`

### Error: "Cannot GET /ruta"

**Problema:** Rutas de React no funcionan
**Solución:** El `vercel.json` ya tiene el rewrite configurado. Verificar que esté en la raíz del proyecto.

### Error: Variables de entorno no funcionan

**Problema:** Las variables no se cargan
**Solución 1:** Verificar que empiecen con `VITE_`
**Solución 2:** Redeployar después de agregar variables:
```bash
vercel --prod
```

### Error: Build tarda mucho

**Problema:** Node modules muy grandes
**Solución:** Limpiar cache
```bash
npm run build -- --force
```

### Error: "Out of memory"

**Problema:** Build se queda sin memoria
**Solución:** Agregar variable de entorno en Vercel:
```
NODE_OPTIONS=--max_old_space_size=4096
```

---

## 📈 Optimizaciones

### 1. Lazy Loading

Ya implementado en las rutas:
```typescript
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

### 2. Code Splitting

Vite automáticamente hace code splitting por rutas.

### 3. Imagen Optimization

Usa el componente de Vercel:
```typescript
import Image from 'next/image'; // Si usas Next.js
```

### 4. Analytics

Activar Vercel Analytics:
1. **Project Settings** → **Analytics**
2. Enable Analytics
3. Agrega el script en `index.html`

---

## 💰 Costos

### Plan Hobby (Gratis):
- ✅ Deployments ilimitados
- ✅ 100GB de bandwidth/mes
- ✅ HTTPS automático
- ✅ Dominio personalizado
- ✅ Preview deployments
- ✅ Suficiente para proyectos personales

### Plan Pro ($20/mes):
- ✅ Todo lo del Hobby
- ✅ 1TB bandwidth
- ✅ Más builds concurrentes
- ✅ Passwordd protection
- ✅ Analytics avanzados

---

## 📝 Comandos Útiles

```bash
# Ver deployments
vercel ls

# Ver logs en tiempo real
vercel logs

# Alias a producción
vercel alias set deployment-url.vercel.app app.tuclinica.com

# Remover deployment
vercel rm deployment-url

# Descargar código de un deployment
vercel pull
```

---

## 🔗 URLs Finales

Después del deploy tendrás:

**Frontend (Vercel):**
```
https://clinica-dental-frontend.vercel.app
```

**Backend (Render):**
```
https://clinica-dental-backend.onrender.com
```

**Admin Django:**
```
https://clinica-dental-backend.onrender.com/admin/
```

---

## 📞 Recursos

- **Vercel Docs:** https://vercel.com/docs
- **Vite Deployment:** https://vitejs.dev/guide/static-deploy.html
- **Vercel CLI:** https://vercel.com/docs/cli
- **Support:** https://vercel.com/support

---

## 🎉 ¡Listo!

Tu **Clínica Dental** está completamente desplegada:

✅ **Frontend:** Vercel (React + TypeScript + Vite)
✅ **Backend:** Render (Django + PostgreSQL)
✅ **HTTPS:** Automático en ambos
✅ **CI/CD:** Git push → Auto deploy

**¡Tu sistema está en producción! 🦷✨**

---

## 🔐 Credenciales de Prueba

Para probar la aplicación desplegada:

**Paciente:**
```
Email: paciente1@test.com
Password: password123
```

**Odontólogo:**
```
Email: odontologo@clinica-demo.com
Password: password123
```

**Admin:**
```
Email: admin@clinica-demo.com
Password: admin123
```
