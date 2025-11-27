# 🌐 CONFIGURACIÓN MULTI-TENANT - URLS DINÁMICAS

## ❌ PROBLEMA DETECTADO

El frontend estaba enviando **TODAS las peticiones** a:
```
https://clinica-dental-backend.onrender.com/api/token/
```

Esto provocaba error **401 Unauthorized** porque:
1. ❌ El backend NO recibía el header `Host` correcto
2. ❌ El tenant no se podía detectar (siempre usaba `clinica_demo` por defecto)
3. ❌ Las credenciales no coincidían con el tenant correcto

## ✅ SOLUCIÓN IMPLEMENTADA

### 📝 Cambio en `src/config/tenantConfig.ts`

**ANTES** (Incorrecto):
```typescript
export const getApiBaseUrl = (): string => {
  const apiUrl = import.meta.env.VITE_API_URL;
  return apiUrl || 'https://clinica-dental-backend.onrender.com';
};
```

**DESPUÉS** (Correcto):
```typescript
export const getApiBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    return 'https://clinica-dental-backend.onrender.com';
  }

  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  
  // 🏠 DESARROLLO LOCAL
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }
  
  // 🌐 PRODUCCIÓN: usar el mismo subdominio que el frontend
  return `${protocol}//${hostname}`;
};
```

## 🎯 CÓMO FUNCIONA AHORA

### En Desarrollo Local:
```
Frontend: http://localhost:5173
Backend:  http://localhost:8000
Tenant:   clinica_demo (por defecto)
```

### En Producción - Clínica Demo:
```
Frontend: https://clinicademo1.dentaabcxy.store
Backend:  https://clinicademo1.dentaabcxy.store
Tenant:   clinica_demo (detectado desde subdominio)
```

### En Producción - Otras Clínicas:
```
Frontend: https://clinicaabc.dentaabcxy.store
Backend:  https://clinicaabc.dentaabcxy.store
Tenant:   clinica_abc (detectado desde subdominio)
```

## 🔧 CONFIGURACIÓN DE RENDER

### 1. Custom Domain para el Backend

En tu servicio de Render (`clinica-dental-backend`), debes agregar **custom domains**:

```
✅ clinicademo1.dentaabcxy.store
✅ clinicaabc.dentaabcxy.store
✅ clinicaxyz.dentaabcxy.store
```

### 2. DNS en dentaabcxy.store

Agrega registros CNAME para cada subdominio:

```dns
clinicademo1  CNAME  clinica-dental-backend.onrender.com
clinicaabc    CNAME  clinica-dental-backend.onrender.com
clinicaxyz    CNAME  clinica-dental-backend.onrender.com
```

### 3. Frontend en Vercel

Cada deploy del frontend debe usar:

```
✅ Frontend URL: https://clinicademo1.dentaabcxy.store
✅ Backend URL:  https://clinicademo1.dentaabcxy.store (MISMO DOMINIO)
```

## 🧪 CÓMO PROBAR

### 1. Login desde el navegador

Abre:
```
https://clinicademo1.dentaabcxy.store/login
```

El frontend enviará:
```javascript
POST https://clinicademo1.dentaabcxy.store/api/token/
{
  "email": "admin@clinicademo1.com",
  "password": "admin123"
}

Headers:
  Host: clinicademo1.dentaabcxy.store
  X-Tenant-ID: clinica_demo
  Content-Type: application/json
```

### 2. Verifica los logs

**Frontend (Console del navegador):**
```
🚀 [API REQUEST] ==================
  Method: POST
  BaseURL: https://clinicademo1.dentaabcxy.store
  URL: /api/token/
  Full URL: https://clinicademo1.dentaabcxy.store/api/token/
  X-Tenant-ID: clinica_demo
====================================
```

**Backend (Logs de Render):**
```
🏢 [TenantMiddleware] Host detectado: clinicademo1.dentaabcxy.store
🏢 [TenantMiddleware] Subdominio extraído: clinicademo1
🏢 [TenantMiddleware] Tenant detectado: clinica_demo
✅ [TenantMiddleware] Schema activado: clinica_demo
```

## 🔍 DEBUGGING

### Si sigue fallando:

1. **Verifica la URL en el navegador:**
   ```javascript
   // Abre la consola del navegador (F12)
   console.log('Frontend URL:', window.location.href);
   console.log('API Base URL:', window.location.protocol + '//' + window.location.hostname);
   ```

2. **Verifica el header Host:**
   ```bash
   # Desde curl
   curl -X POST https://clinicademo1.dentaabcxy.store/api/token/ \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@clinicademo1.com","password":"admin123"}' \
     -v | grep "Host:"
   ```

3. **Verifica el custom domain en Render:**
   - Ve a tu servicio en Render
   - Sección "Settings" → "Custom Domains"
   - Debe aparecer: `clinicademo1.dentaabcxy.store` con status "Active"

## 📋 CHECKLIST DE CONFIGURACIÓN

- [ ] ✅ `tenantConfig.ts` modificado para usar `${protocol}//${hostname}`
- [ ] ✅ Custom domain agregado en Render
- [ ] ✅ DNS CNAME configurado en dentaabcxy.store
- [ ] ✅ Frontend desplegado en Vercel con dominio correcto
- [ ] ✅ Test manual: Login desde navegador
- [ ] ✅ Verificar logs del backend (Render)
- [ ] ✅ Verificar console del frontend (F12)

## 🎉 RESULTADO ESPERADO

Al hacer login desde `https://clinicademo1.dentaabcxy.store/login`:

```
✅ Frontend → POST https://clinicademo1.dentaabcxy.store/api/token/
✅ Backend recibe: Host: clinicademo1.dentaabcxy.store
✅ Tenant detectado: clinica_demo
✅ Credenciales validadas: admin@clinicademo1.com
✅ Login exitoso → Dashboard
```

## 🚨 ERRORES COMUNES

### Error 1: 401 Unauthorized
**Causa:** URL incorrecta (usando `clinica-dental-backend.onrender.com`)
**Solución:** Verifica que `getApiBaseUrl()` retorne el subdominio correcto

### Error 2: Custom domain no funciona
**Causa:** DNS no propagado o custom domain no configurado en Render
**Solución:** Espera 24-48 horas para propagación DNS

### Error 3: CORS error
**Causa:** Backend no acepta el origen del frontend
**Solución:** Agrega `https://clinicademo1.dentaabcxy.store` en `ALLOWED_HOSTS` del backend

---

**Última actualización:** 26 de Noviembre de 2025  
**Estado:** ✅ IMPLEMENTADO
