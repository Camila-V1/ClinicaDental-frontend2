# ✅ INSTRUCCIONES PARA PROBAR MULTI-TENANT

## 🎉 ESTADO ACTUAL: TODO CONFIGURADO

### ✅ Verificación Completada:

- ✅ `tenantConfig.ts` existe
- ✅ `apiConfig.ts` existe  
- ✅ `TenantContext.tsx` existe
- ✅ `.env.local` existe con variables correctas
- ✅ `App.tsx` envuelto con `TenantProvider` → `AuthProvider`
- ✅ Backend corriendo: `http://0.0.0.0:8000/`
- ✅ Frontend corriendo: `http://localhost:5173/`

---

## 🧪 PASOS PARA PROBAR EN EL NAVEGADOR

### 1️⃣ PROBAR SCHEMA PÚBLICO

**Acción:**
1. Abrir **Chrome** o **Edge**
2. Ir a: `http://localhost:5173/`
3. Abrir **DevTools** (Presionar `F12`)
4. Ir a pestaña **Console**

**Logs esperados:**
```
🔍 Detectando tenant desde: localhost
✅ Tenant detectado: public
📡 API URL (público): http://localhost:8000
🏢 Inicializando tenant...
🌐 Schema público detectado
```

**Si NO ves estos logs:**
- Actualizar página (Ctrl+F5)
- Verificar que no hay errores en rojo en Console

---

### 2️⃣ PROBAR TENANT CLINICA-DEMO

**Acción:**
1. **CERRAR** la pestaña anterior completamente
2. Abrir **nueva pestaña**
3. Ir a: `http://clinica-demo.localhost:5173/`
4. Abrir **DevTools** (F12) > **Console**

**Logs esperados:**
```
🔍 Detectando tenant desde: clinica-demo.localhost
✅ Tenant detectado: clinica-demo
📡 API URL (tenant): http://clinica-demo.localhost:8000
🏢 Inicializando tenant...
✅ Tenant inicializado: clinica-demo
```

**Si ves "ERR_NAME_NOT_RESOLVED":**
```powershell
# Ejecutar en PowerShell:
ipconfig /flushdns

# Verificar hosts:
cat C:\Windows\System32\drivers\etc\hosts | Select-String "clinica-demo"
```

**Debe mostrar:**
```
127.0.0.1 clinica-demo.localhost
```

Si no lo muestra, editar hosts:
```powershell
# Como Administrador:
notepad C:\Windows\System32\drivers\etc\hosts

# Agregar:
127.0.0.1 clinica-demo.localhost

# Guardar, cerrar, reiniciar navegador
```

---

### 3️⃣ PROBAR LOGIN (si existe la página)

**Acción:**
1. Ir a: `http://clinica-demo.localhost:5173/login`
2. Abrir **DevTools** (F12) > pestaña **Network**
3. Ingresar credenciales
4. Click en "Iniciar Sesión"

**Peticiones esperadas en Network tab:**
```
✅ POST http://clinica-demo.localhost:8000/api/token/
   Status: 200
   Response: { "access": "...", "refresh": "...", "user": {...} }
```

**En Console tab:**
```
🚀 Request: POST /api/token/
📡 Base URL: http://clinica-demo.localhost:8000
✅ Response: 200 /api/token/
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### ❌ Problema: "No veo logs de tenant en Console"

**Solución:**
1. Verificar que `tenantConfig.ts` tiene `console.log()`:
   ```powershell
   cat src/config/tenantConfig.ts | Select-String "console.log"
   ```

2. Verificar que `TenantContext.tsx` tiene `console.log()`:
   ```powershell
   cat src/context/TenantContext.tsx | Select-String "console.log"
   ```

3. Limpiar caché del navegador:
   - DevTools > Application > Storage > Clear site data
   - O usar: Ctrl+Shift+Delete

---

### ❌ Problema: "CORS Error" en Network tab

**Verificar backend:**
```powershell
# Probar con curl:
curl http://clinica-demo.localhost:8000/api/usuarios/ 2>$null
```

**Debe retornar:** Status 200

**Si no funciona:**
```powershell
# Reiniciar backend:
# En la terminal donde corre el backend, presionar Ctrl+C
# Luego:
cd "c:\Users\asus\Documents\SISTEMAS DE INFORMACION 2\PAUL PROYECTO\ClinicaDental-backend2"
python manage.py runserver 0.0.0.0:8000
```

---

### ❌ Problema: "Token inválido" o "401 Unauthorized"

**Solución:**
1. Limpiar localStorage:
   ```javascript
   // En Console del navegador:
   localStorage.clear();
   location.reload();
   ```

2. Crear usuario de prueba:
   ```powershell
   cd "c:\Users\asus\Documents\SISTEMAS DE INFORMACION 2\PAUL PROYECTO\ClinicaDental-backend2"
   python manage.py shell
   ```

   ```python
   # En el shell de Python:
   from django.db import connection
   from usuarios.models import Usuario

   # Cambiar al schema de clinica-demo
   connection.set_schema('clinica_demo')

   # Crear usuario admin
   usuario = Usuario.objects.create_user(
       email='admin@clinica-demo.com',
       password='admin123',
       first_name='Admin',
       last_name='Demo',
       tipo_usuario='admin'
   )
   print(f'✅ Usuario creado: {usuario.email}')
   exit()
   ```

   **Credenciales:**
   - Email: `admin@clinica-demo.com`
   - Password: `admin123`

---

## 📊 DIAGRAMA DE FLUJO

```
Usuario accede → http://clinica-demo.localhost:5173/
         ↓
TenantContext.tsx:
  - useEffect() ejecuta
  - getCurrentTenant() → "clinica-demo"
  - console.log("🏢 Tenant detectado: clinica-demo")
         ↓
apiConfig.ts:
  - baseURL: getApiBaseUrl()
  - Retorna: "http://clinica-demo.localhost:8000"
  - console.log("📡 API URL: http://clinica-demo.localhost:8000")
         ↓
Usuario hace login → authService.login(credentials)
         ↓
POST http://clinica-demo.localhost:8000/api/token/
         ↓
Backend (django-tenants):
  - Detecta hostname: "clinica-demo.localhost"
  - Busca Domain en DB
  - Usa schema: "clinica_demo"
  - Valida credenciales
  - Retorna: { access, refresh, user }
         ↓
Frontend:
  - Guarda tokens en localStorage
  - Redirige a /dashboard
```

---

## 🎯 CHECKLIST FINAL

Marca cada paso a medida que lo completes:

- [ ] Abrí el navegador en: `http://localhost:5173/`
- [ ] Vi logs de tenant "public" en Console
- [ ] Abrí nueva pestaña: `http://clinica-demo.localhost:5173/`
- [ ] Vi logs de tenant "clinica-demo" en Console
- [ ] Fui a: `http://clinica-demo.localhost:5173/login`
- [ ] Hice login y vi petición en Network tab
- [ ] La petición fue a: `http://clinica-demo.localhost:8000/api/token/`
- [ ] Status fue 200 y obtuve tokens

---

## 📞 AYUDA

**Si completaste todos los pasos y funcionó:**
🎉 ¡PERFECTO! El sistema multi-tenant está 100% operativo.

**Si algo no funcionó:**
Comparte:
1. En qué paso te detuviste
2. Lo que aparece en Console (F12 > Console)
3. Cualquier error en rojo
4. Captura de pantalla del Network tab (si aplica)

---

## 🚀 COMANDOS ÚTILES

### Reiniciar Backend:
```powershell
# Ctrl+C en la terminal del backend, luego:
cd "c:\Users\asus\Documents\SISTEMAS DE INFORMACION 2\PAUL PROYECTO\ClinicaDental-backend2"
python manage.py runserver 0.0.0.0:8000
```

### Reiniciar Frontend:
```powershell
# Ctrl+C en la terminal del frontend, luego:
cd "c:\Users\asus\Documents\SISTEMAS DE INFORMACION 2\PAUL PROYECTO\ClinicaDental-frontend2"
npm run dev
```

### Ver logs en tiempo real:
```powershell
# En la terminal donde corre cada servidor
# Los logs aparecerán automáticamente
```

### Limpiar DNS cache:
```powershell
ipconfig /flushdns
```

### Probar endpoint del backend:
```powershell
# Schema público:
curl http://localhost:8000/api/usuarios/ 2>$null

# Tenant clinica-demo:
curl http://clinica-demo.localhost:8000/api/usuarios/ 2>$null
```

---

**¡Ahora prueba en el navegador y comparte los resultados!** 🚀
