# 🔒 CONFIGURAR CORS EN EL BACKEND

## ❌ Error Actual

```
Access to XMLHttpRequest at 'https://clinica-dental-backend.onrender.com/api/v1/api/token/' 
from origin 'https://www.dentaabcxy.store' has been blocked by CORS policy
```

## ✅ Solución

Debes agregar el dominio del frontend a la configuración CORS del backend Django.

---

## 📝 Pasos en el Backend (Render)

### 1. Editar `settings.py` o archivo de configuración

Busca la variable `CORS_ALLOWED_ORIGINS` y agrega los dominios del frontend:

```python
# settings.py o config/settings/production.py

CORS_ALLOWED_ORIGINS = [
    "https://dentaabcxy.store",           # ✅ Dominio principal
    "https://www.dentaabcxy.store",       # ✅ Con www
    "https://clinica-dental-frontend-three.vercel.app",  # ✅ Vercel subdomain
    # Otros dominios si usas múltiples frontends
]

# Si prefieres permitir todos los subdominios de Vercel (solo desarrollo):
CORS_ALLOW_ALL_ORIGINS = False  # ⚠️ NO usar True en producción

# Opción alternativa con regex:
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://.*\.vercel\.app$",  # ✅ Cualquier subdominio de Vercel
]
```

### 2. Verificar que django-cors-headers está instalado

```bash
pip list | grep django-cors-headers
```

Si no está instalado:
```bash
pip install django-cors-headers
```

### 3. Asegurar middleware en settings.py

```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # ✅ DEBE estar ANTES de CommonMiddleware
    'django.middleware.common.CommonMiddleware',
    # ... resto de middlewares
]

INSTALLED_APPS = [
    # ...
    'corsheaders',  # ✅ Debe estar en INSTALLED_APPS
    # ...
]
```

### 4. Configuración adicional recomendada

```python
# Permitir cookies en requests cross-origin (necesario para JWT)
CORS_ALLOW_CREDENTIALS = True

# Headers permitidos
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Métodos HTTP permitidos
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
```

### 5. Variables de entorno en Render

En Render Dashboard → Environment:

```bash
ALLOWED_HOSTS=clinica-dental-backend.onrender.com,dentaabcxy.store,www.dentaabcxy.store
CORS_ALLOWED_ORIGINS=https://dentaabcxy.store,https://www.dentaabcxy.store,https://clinica-dental-frontend-three.vercel.app
```

### 6. Reiniciar servicio en Render

Después de hacer cambios:
1. Ve a Render Dashboard
2. Selecciona tu servicio backend
3. Click en **"Manual Deploy"** → **"Deploy latest commit"**

---

## 🧪 Verificar que funciona

### Opción 1: Curl desde terminal

```bash
curl -X OPTIONS https://clinica-dental-backend.onrender.com/api/token/ \
  -H "Origin: https://www.dentaabcxy.store" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

**Respuesta esperada:**
```
< HTTP/2 200 
< access-control-allow-origin: https://www.dentaabcxy.store
< access-control-allow-methods: DELETE, GET, OPTIONS, PATCH, POST, PUT
< access-control-allow-headers: accept, authorization, content-type, ...
```

### Opción 2: Navegador

1. Abre `https://www.dentaabcxy.store`
2. Abre DevTools → Console
3. Ejecuta:
   ```javascript
   fetch('https://clinica-dental-backend.onrender.com/api/token/', {
     method: 'OPTIONS',
     headers: { 'Origin': 'https://www.dentaabcxy.store' }
   }).then(r => console.log('✅ CORS OK:', r.headers.get('access-control-allow-origin')))
   ```

**Resultado esperado:** `✅ CORS OK: https://www.dentaabcxy.store`

---

## 🔧 Troubleshooting

### Error: "Middleware not found"
```python
# Verifica que corsheaders esté instalado:
pip freeze | grep django-cors-headers

# Si no está:
pip install django-cors-headers
pip freeze > requirements.txt  # Actualizar requirements
```

### Error: "CORS still blocked"
1. Verifica que el middleware esté **ANTES** de `CommonMiddleware`
2. Verifica que `CORS_ALLOWED_ORIGINS` tenga el protocolo correcto (`https://`)
3. Limpia caché del navegador (Ctrl+Shift+Del)
4. Prueba en modo incógnito

### Error: Cookies no se envían
```python
CORS_ALLOW_CREDENTIALS = True
```

Y en el frontend, axios debe tener:
```typescript
axios.defaults.withCredentials = true;
```

---

## 📋 Checklist Final

- [ ] `django-cors-headers` instalado
- [ ] `corsheaders` en `INSTALLED_APPS`
- [ ] `CorsMiddleware` en `MIDDLEWARE` (antes de `CommonMiddleware`)
- [ ] `CORS_ALLOWED_ORIGINS` incluye:
  - [ ] `https://dentaabcxy.store`
  - [ ] `https://www.dentaabcxy.store`
  - [ ] `https://clinica-dental-frontend-three.vercel.app`
- [ ] `CORS_ALLOW_CREDENTIALS = True`
- [ ] Backend reiniciado/redeployeado en Render
- [ ] Prueba de OPTIONS request exitosa

---

## 📞 Si sigue sin funcionar

Comparte el código de `settings.py` (sección CORS) para revisarlo.
