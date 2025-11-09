# 🏢 GUÍA DE CONFIGURACIÓN MULTI-TENANT

## ✅ IMPLEMENTACIÓN COMPLETADA

El frontend ahora está **completamente configurado** para trabajar con django-tenants del backend.

---

## 📋 ARCHIVOS CREADOS/MODIFICADOS

### ✅ Nuevos Archivos:

1. **`src/config/tenantConfig.ts`**
   - Detecta tenant desde subdominio
   - Construye URL dinámica según tenant
   - Funciones: `getCurrentTenant()`, `getApiBaseUrl()`, `isPublicSchema()`

2. **`src/context/TenantContext.tsx`**
   - Context global de tenant
   - Hook: `useTenant()`
   - Carga inicial con loading state

3. **`src/components/tenant/TenantInfo.tsx`**
   - Componente visual para mostrar tenant actual
   - Útil para debugging

### 🔧 Archivos Modificados:

1. **`src/config/apiConfig.ts`**
   - Ahora usa `getApiBaseUrl()` en lugar de URL fija
   - Detecta automáticamente el tenant y ajusta la URL

2. **`src/App.tsx`**
   - Envuelve con `<TenantProvider>`
   - Orden: BrowserRouter > TenantProvider > AuthProvider

3. **`.env.local`**
   - Variables actualizadas para multi-tenant
   - Configuración desarrollo/producción

---

## 🚀 CÓMO FUNCIONA

### Detección Automática de Tenant:

```
http://localhost:5173/              → tenant: "public"
                                      → API: http://localhost:8000

http://clinica-demo.localhost:5173/ → tenant: "clinica-demo"
                                      → API: http://clinica-demo.localhost:8000

http://clinica-abc.localhost:5173/  → tenant: "clinica-abc"
                                      → API: http://clinica-abc.localhost:8000
```

### Flujo de Peticiones:

1. Usuario entra a `clinica-demo.localhost:5173/login`
2. TenantContext detecta tenant: `"clinica-demo"`
3. Axios usa: `http://clinica-demo.localhost:8000`
4. Django-tenants busca en schema: `clinica_demo`
5. Login exitoso con datos del tenant correcto

---

## 🔧 CONFIGURACIÓN NECESARIA EN WINDOWS

### 1. Editar archivo hosts:

```powershell
# Ejecutar PowerShell como Administrador
notepad C:\Windows\System32\drivers\etc\hosts
```

Agregar estas líneas:

```
127.0.0.1 localhost
127.0.0.1 clinica-demo.localhost
127.0.0.1 clinica-abc.localhost
127.0.0.1 clinica-xyz.localhost
```

### 2. Crear Clínicas en Django Admin:

1. Ir a: `http://localhost:8000/admin/` (schema público)
2. Crear Tenant:
   - Model: `Clinica`
   - Schema name: `clinica_demo`
   - Nombre: "Clínica Demo"

3. Crear Domain:
   - Model: `Domain`
   - Domain: `clinica-demo.localhost`
   - Tenant: Clínica Demo
   - Is primary: ✓

### 3. Verificar configuración:

```powershell
# Probar acceso al backend
curl http://localhost:8000/admin/
curl http://clinica-demo.localhost:8000/api/

# Iniciar frontend
npm run dev

# Acceder
# http://localhost:5173/                    → Schema público
# http://clinica-demo.localhost:5173/       → Tenant clinica-demo
```

---

## 📱 USO EN LOS COMPONENTES

### Ver información del tenant:

```tsx
import { useTenant } from '../context/TenantContext';

function MiComponente() {
  const { tenant, isPublic, apiBaseUrl } = useTenant();
  
  return (
    <div>
      <p>Tenant actual: {tenant}</p>
      <p>Schema público: {isPublic ? 'Sí' : 'No'}</p>
      <p>API URL: {apiBaseUrl}</p>
    </div>
  );
}
```

### Cambiar de tenant:

```tsx
import { useTenant } from '../context/TenantContext';

function TenantSwitcher() {
  const { switchTenant } = useTenant();
  
  return (
    <div>
      <button onClick={() => switchTenant('clinica-demo')}>
        Ir a Clínica Demo
      </button>
      <button onClick={() => switchTenant('clinica-abc')}>
        Ir a Clínica ABC
      </button>
    </div>
  );
}
```

### Mostrar badge del tenant:

```tsx
import TenantInfo from '../components/tenant/TenantInfo';

function Dashboard() {
  return (
    <div>
      <TenantInfo />  {/* Badge simple */}
      <TenantInfo showDetails />  {/* Con detalles completos */}
    </div>
  );
}
```

---

## 🧪 TESTING

### Verificar detección de tenant:

```javascript
// En la consola del navegador:
console.log('Hostname:', window.location.hostname);
console.log('Tenant:', getCurrentTenant());
console.log('API URL:', getApiBaseUrl());
```

### Probar diferentes subdominios:

1. `http://localhost:5173/` → Debe usar API: `http://localhost:8000`
2. `http://clinica-demo.localhost:5173/` → Debe usar API: `http://clinica-demo.localhost:8000`
3. Network tab: Ver que las peticiones van a la URL correcta

---

## ⚠️ TROUBLESHOOTING

### Problema: "No se detecta el tenant"
**Solución:** Verifica archivo hosts, reinicia navegador

### Problema: "404 Not Found en API"
**Solución:** Verifica que el Domain esté creado en Django Admin

### Problema: "CORS error"
**Solución:** Backend debe permitir subdominios:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://clinica-demo.localhost:5173",
    # ... otros
]
```

### Problema: "Token inválido"
**Solución:** Cada tenant tiene sus propios tokens, hacer logout y login de nuevo

---

## 📊 DIAGRAMA DE FLUJO

```
Usuario accede → clinica-demo.localhost:5173
         ↓
TenantContext detecta: "clinica-demo"
         ↓
Axios configura baseURL: http://clinica-demo.localhost:8000
         ↓
Django-tenants detecta: "clinica-demo.localhost"
         ↓
Busca Domain en DB → Tenant: "clinica_demo"
         ↓
Usa schema: "clinica_demo"
         ↓
Retorna datos del tenant correcto
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

- [x] `tenantConfig.ts` creado
- [x] `TenantContext.tsx` creado
- [x] `TenantInfo.tsx` creado
- [x] `apiConfig.ts` actualizado con `getApiBaseUrl()`
- [x] `App.tsx` envuelto con `TenantProvider`
- [x] `.env.local` actualizado
- [x] Archivo hosts configurado (pendiente: hacer manualmente)
- [ ] Tenants creados en Django Admin (pendiente: hacer manualmente)
- [ ] Domains creados en Django Admin (pendiente: hacer manualmente)

---

## 🎯 PRÓXIMOS PASOS

1. **Configurar archivo hosts** (ver sección arriba)
2. **Crear tenants en Django Admin**
3. **Probar login en diferentes subdominios**
4. **Agregar TenantInfo en dashboards** (opcional, para ver tenant actual)
5. **Implementar tenant switcher** (opcional, para cambiar entre clínicas)

---

## 📚 RECURSOS

- **Backend Multi-tenant:** `GUIA_FRONT/10_multi_tenant_config.md`
- **Django-tenants:** https://django-tenants.readthedocs.io/
- **Documentación completa:** Ver archivo en carpeta GUIA_FRONT

---

_Implementación completada: 7 de Noviembre, 2025_
