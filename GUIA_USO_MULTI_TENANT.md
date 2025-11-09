# 🚀 GUÍA RÁPIDA - SISTEMA MULTI-TENANT LISTO

## ✅ ESTADO ACTUAL

- **Backend**: ✅ Terminado y probado con django-tenants
- **Frontend**: ✅ Configurado con detección automática de tenant
- **Servidor Frontend**: 🟢 Corriendo en `http://localhost:5174/`

---

## 🏢 CÓMO FUNCIONA

### **1. Acceso Normal (Schema Público)**

```
URL: http://localhost:5174/
```

- Detecta: tenant = "public"
- API usa: `http://localhost:8000`
- Schema PostgreSQL: `public`

### **2. Acceso por Tenant (Subdominios)**

Primero, configura el archivo **hosts** de Windows:

```powershell
# Como Administrador:
notepad C:\Windows\System32\drivers\etc\hosts
```

Agrega estas líneas:

```
127.0.0.1 localhost
127.0.0.1 clinica-demo.localhost
127.0.0.1 clinica-abc.localhost
```

Luego accede a:

```
URL: http://clinica-demo.localhost:5174/
```

- Detecta: tenant = "clinica-demo"
- API usa: `http://clinica-demo.localhost:8000`
- Schema PostgreSQL: `clinica_demo`

---

## 📋 PASOS PARA PROBAR

### 1️⃣ **Crear Tenants en Django Admin**

```
1. Ir a: http://localhost:8000/admin/
2. Crear modelo "Clinica":
   - Schema name: clinica_demo
   - Nombre: "Clínica Demo"
   
3. Crear modelo "Domain":
   - Domain: clinica-demo.localhost
   - Tenant: Clínica Demo
   - Is primary: ✓
```

### 2️⃣ **Probar Detección de Tenant**

Abre la consola del navegador y ejecuta:

```javascript
// En http://localhost:5174/
console.log(window.location.hostname); // "localhost"

// En http://clinica-demo.localhost:5174/
console.log(window.location.hostname); // "clinica-demo.localhost"
```

### 3️⃣ **Verificar API Calls**

1. Abre DevTools → Network tab
2. Haz login en cada dominio
3. Verifica que las peticiones van a:
   - `localhost`: → `http://localhost:8000/api/token/`
   - `clinica-demo.localhost`: → `http://clinica-demo.localhost:8000/api/token/`

---

## 🎯 FLUJO COMPLETO DE PRUEBA

### A. En Schema Público (localhost)

```
1. http://localhost:5174/
2. Ver badge: "🌐 Schema Público"
3. Login como admin
4. Dashboard muestra datos del schema público
```

### B. En Tenant (clinica-demo)

```
1. http://clinica-demo.localhost:5174/
2. Ver badge: "🏢 clinica-demo"
3. Registrar usuario (paciente/doctor)
4. Login con ese usuario
5. Dashboard muestra datos SOLO del tenant clinica-demo
```

### C. Cambiar entre Tenants

El componente `TenantInfo` muestra el tenant actual en el header del dashboard.

Cada tenant es **completamente independiente**:
- Usuarios separados
- Datos separados
- Tokens JWT separados

---

## 🔧 ARCHIVOS CREADOS/MODIFICADOS

### ✅ Nuevos:
- `src/config/tenantConfig.ts` - Detección de tenant
- `src/context/TenantContext.tsx` - Context global
- `src/components/tenant/TenantInfo.tsx` - Badge visual

### 🔄 Modificados:
- `src/config/apiConfig.ts` - URL dinámica según tenant
- `src/App.tsx` - Envuelto con TenantProvider
- `.env.local` - Variables multi-tenant
- `src/pages/dashboard/AdminDashboard.tsx` - Muestra badge de tenant

---

## 📊 COMPONENTE TenantInfo

Ya está incluido en **AdminDashboard**. Se ve así:

```
┌─────────────────────────────────────────┐
│ 🏥 Dashboard Administrador              │
│ Bienvenido, admin@example.com           │
│                          [🏢 clinica-demo] [Cerrar Sesión] │
└─────────────────────────────────────────┘
```

El badge cambia automáticamente:
- Schema público: `🌐 Schema Público` (gris)
- Tenant: `🏢 nombre-tenant` (azul)

---

## 🧪 COMANDOS ÚTILES

### Ver tenant actual en consola:

```javascript
import { getTenantInfo } from './config/tenantConfig';
console.log(getTenantInfo());
```

### Cambiar de tenant programáticamente:

```javascript
import { switchTenant } from './config/tenantConfig';
switchTenant('clinica-abc'); // Redirige a clinica-abc.localhost:5174
```

---

## ⚠️ TROUBLESHOOTING

### Problema: No detecta el subdominio
**Solución**: 
1. Verifica archivo hosts
2. Reinicia navegador
3. Limpia caché (Ctrl+Shift+Delete)

### Problema: CORS error
**Solución**: Backend debe permitir subdominios en `CORS_ALLOWED_ORIGINS`

### Problema: 404 en API
**Solución**: Verifica que el Domain esté creado en Django Admin con el subdominio exacto

### Problema: Token inválido entre tenants
**Solución**: Normal. Cada tenant tiene tokens separados. Hacer logout y login en cada tenant.

---

## 🎨 AGREGAR TenantInfo A OTROS DASHBOARDS

### DoctorDashboard:

```tsx
import TenantInfo from '../../components/tenant/TenantInfo';

// En el header, junto al botón de logout:
<TenantInfo />
```

### Con detalles completos:

```tsx
<TenantInfo showDetails />
```

Muestra:
```
ℹ️ Información del Tenant
Tenant: clinica-demo
Schema: clinica_demo
API URL: http://clinica-demo.localhost:8000
Hostname: clinica-demo.localhost
```

---

## 📚 RESUMEN TÉCNICO

### Variables de Entorno:
```bash
VITE_ENV=development
VITE_API_BASE_URL=http://localhost:8000
```

### Detección de Tenant:
```typescript
// tenantConfig.ts
getCurrentTenant() → "clinica-demo" | "public"
getApiBaseUrl()   → "http://clinica-demo.localhost:8000"
isPublicSchema()  → true | false
```

### Context API:
```typescript
const { tenant, isPublic, apiBaseUrl, switchTenant } = useTenant();
```

### Axios Automático:
- Lee hostname del navegador
- Construye URL dinámica
- Todas las peticiones van al tenant correcto

---

## ✅ CHECKLIST FINAL

- [x] tenantConfig.ts creado
- [x] TenantContext.tsx creado
- [x] TenantInfo.tsx creado
- [x] apiConfig.ts actualizado
- [x] App.tsx con TenantProvider
- [x] AdminDashboard con badge de tenant
- [x] Servidor corriendo: http://localhost:5174/
- [ ] Archivo hosts configurado (hazlo manualmente)
- [ ] Tenants creados en Django Admin (backend ya listo)
- [ ] Probar login en localhost
- [ ] Probar login en clinica-demo.localhost

---

## 🚀 SIGUIENTE PASO

**HAZ ESTO AHORA:**

1. **Configura archivo hosts:**
   ```powershell
   # Como Administrador
   notepad C:\Windows\System32\drivers\etc\hosts
   ```
   
   Agrega:
   ```
   127.0.0.1 clinica-demo.localhost
   ```

2. **Crea un tenant en Django Admin:**
   - http://localhost:8000/admin/
   - Crear Clinica y Domain

3. **Prueba el sistema:**
   - http://localhost:5174/ → Login normal
   - http://clinica-demo.localhost:5174/ → Login en tenant

---

**🎉 SISTEMA MULTI-TENANT LISTO PARA USAR!**

Frontend detecta automáticamente el tenant y enruta todas las peticiones al backend correcto.

---

_Implementación completada: 7 de Noviembre, 2025 - 19:15_
