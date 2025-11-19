# 🔧 SOLUCIÓN ERROR CORS

## ❌ Error Actual
```
Access to XMLHttpRequest at 'http://clinica-demo.localhost:8000/api/token/' 
from origin 'http://clinica-demo.localhost:5173' has been blocked by CORS policy
```

## ✅ Solución - Configurar Backend Django

### 1. Instalar django-cors-headers (si no está)
```bash
pip install django-cors-headers
```

### 2. Editar `settings.py` del Backend Django

```python
# settings.py

# Agregar en INSTALLED_APPS
INSTALLED_APPS = [
    # ... otras apps
    'corsheaders',  # ← Agregar esto
]

# Agregar en MIDDLEWARE (¡debe estar ANTES de CommonMiddleware!)
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # ← Agregar esto AQUÍ
    'django.middleware.common.CommonMiddleware',
    # ... resto del middleware
]

# Configuración CORS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://clinica-demo.localhost:5173",
    # Agregar más subdominios según sea necesario
]

# Alternativamente, para desarrollo (SOLO desarrollo):
# CORS_ALLOW_ALL_ORIGINS = True  # ⚠️ NO usar en producción

# Permitir credenciales (cookies, headers de auth)
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

### 3. Configuración para Multi-Tenant

Si usas subdominios dinámicos (clinica-1, clinica-2, etc.):

```python
# settings.py

# Opción 1: Regex pattern (requiere django-cors-headers >= 3.3)
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^http://[\w-]+\.localhost:5173$",  # Cualquier subdominio de localhost:5173
]

# Opción 2: Lista explícita
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://clinica-demo.localhost:5173",
    "http://clinica-test.localhost:5173",
    # ... agregar cada subdominio
]

# Opción 3: SOLO PARA DESARROLLO
# CORS_ALLOW_ALL_ORIGINS = True
```

### 4. Verificar ALLOWED_HOSTS

```python
# settings.py

ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    '.localhost',  # Permite todos los subdominios de localhost
    'clinica-demo.localhost',
]

# Para producción:
# ALLOWED_HOSTS = [
#     'clinica-dental.com',
#     '.clinica-dental.com',  # Permite subdominios
# ]
```

### 5. Reiniciar el servidor Django

```bash
python manage.py runserver 0.0.0.0:8000
```

## 🧪 Probar que funciona

1. Abrir DevTools → Network
2. Intentar login
3. Verificar que aparece:
   - ✅ Request Method: OPTIONS (preflight)
   - ✅ Status: 200 OK
   - ✅ Response Headers: `Access-Control-Allow-Origin: http://clinica-demo.localhost:5173`

## 📝 Configuración Completa Recomendada

```python
# settings.py - Sección CORS completa

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',  # ← CORS
    'django_tenants',
    
    # Apps propias
    # ...
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # ← DEBE IR AQUÍ
    'django.middleware.common.CommonMiddleware',
    'django_tenants.middleware.main.TenantMainMiddleware',  # Si usas tenants
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# CORS Settings
if DEBUG:
    # Desarrollo: Permitir subdominios con regex
    CORS_ALLOWED_ORIGIN_REGEXES = [
        r"^http://[\w-]+\.localhost:\d+$",
    ]
    CORS_ALLOW_ALL_ORIGINS = False  # Usar regex en su lugar
else:
    # Producción: Lista específica
    CORS_ALLOWED_ORIGINS = [
        "https://app.clinica-dental.com",
        "https://clinica-demo.clinica-dental.com",
    ]

CORS_ALLOW_CREDENTIALS = True

ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    '.localhost',  # Subdominios de localhost
    '.clinica-dental.com',  # Producción
]
```

## 🔍 Verificar Instalación

```bash
# En el backend Django
python -c "import corsheaders; print(corsheaders.__version__)"
```

Si da error, instalar:
```bash
pip install django-cors-headers
```

## ⚠️ Notas Importantes

1. **El middleware DEBE ir ANTES de CommonMiddleware**
2. **NO usar `CORS_ALLOW_ALL_ORIGINS = True` en producción**
3. **Reiniciar servidor Django después de cambios**
4. **Limpiar caché del navegador si persiste el error**

---

**Estado**: 🔴 Pendiente - Requiere configuración en el backend Django
