# 🏥 CLÍNICA DENTAL - SISTEMA DE GESTIÓN FRONTEND

Sistema de gestión integral para clínicas dentales con arquitectura multi-tenant.

## 📋 Estado del Proyecto

### ✅ Estructura Base Implementada

```
✅ Carpetas organizadas por módulos
✅ Configuración de Axios
✅ Variables de entorno
✅ Constantes del sistema
✅ Token helpers
✅ Types de TypeScript
```

## 🏗️ Estructura de Carpetas Creada

```
src/
├── 📁 config/              ⚙️ Configuración
│   ├── constants.ts        # Constantes globales
│   └── apiConfig.ts        # Configuración de Axios
│
├── 📁 services/            🔌 Servicios API
│   └── (pendiente)
│
├── 📁 utils/               🛠️ Utilidades
│   └── tokenHelpers.ts     # Manejo de JWT
│
├── 📁 hooks/               🪝 Custom Hooks
│   └── (pendiente)
│
├── 📁 context/             🌐 Context API
│   └── (pendiente)
│
├── 📁 components/          🧩 Componentes
│   ├── common/            # Componentes comunes
│   ├── auth/              # Componentes de auth
│   └── layout/            # Layouts
│
├── 📁 pages/               📄 Páginas por Módulo
│   ├── auth/              🔐 Autenticación
│   ├── dashboard/         📊 Dashboard
│   ├── usuarios/          👥 Usuarios
│   ├── agenda/            📅 Agenda y Citas
│   ├── tratamientos/      🦷 Tratamientos
│   ├── historial-clinico/ 📋 Historiales
│   ├── facturacion/       💰 Facturación
│   ├── inventario/        📦 Inventario
│   └── reportes/          📈 Reportes
│
└── 📁 types/               📝 TypeScript Types
    ├── auth.types.ts      # Types de autenticación
    └── usuario.types.ts   # Types de usuarios
```

## 🚀 Próximos Pasos

### FASE 1: Autenticación (Prioridad Alta) 🔐

Seguir las guías en `GUIA_FRONT/`:

1. **01a1_axios_core_PARTE2.md** - Auto-refresh de tokens
2. **01a1_validators.md** - Validadores
3. **01a2_axios_advanced** - Multi-tenant y debug
4. **01a3_http_utils.md** - Utilidades HTTP
5. **01b_auth_service.md** - AuthService
6. **01c_context_auth.md** - Context de Auth
7. **01d_componentes_auth.md** - Login/Register Forms

### FASE 2: Módulos Core 📦

8. **02_gestion_usuarios.md** - CRUD usuarios
9. **03_inventario.md** - Inventario
10. **04_tratamientos.md** - Tratamientos
11. **05_agenda_citas.md** - Agenda

### FASE 3: Módulos Clínicos 🦷

12. **06_historial_clinico.md** - Historiales
13. **07_facturacion_pagos.md** - Facturación

### FASE 4: Reportes 📊

14. **08_reportes_dashboard.md** - Dashboard
15. **09_configuracion_avanzada.md** - Configuración

## 📦 Dependencias a Instalar

```bash
# Routing
npm install react-router-dom

# Manejo de estado (opcional)
npm install @tanstack/react-query

# Formularios (opcional)
npm install react-hook-form

# Validación
npm install yup

# UI Components (opcional - elegir uno)
npm install @mui/material @emotion/react @emotion/styled  # Material-UI
# O
npm install -D tailwindcss postcss autoprefixer           # Tailwind CSS

# Íconos
npm install react-icons

# Fechas
npm install date-fns

# Notificaciones
npm install react-toastify
```

## ⚙️ Configuración del Backend

El backend debe estar corriendo en:
- **URL Base**: `http://localhost:8000`
- **API**: `http://localhost:8000/api/`

### Variables de Entorno

Archivo `.env.local` ya creado con:
```
VITE_API_URL=http://localhost:8000
VITE_DEBUG=true
```

## 🎯 Características del Sistema

### Módulos Implementados (Planificados):

- ✅ **Autenticación JWT** con auto-refresh
- ✅ **Multi-tenant** (django-tenants)
- 📋 **Gestión de Usuarios** (Admin, Doctores, Recepcionistas, Pacientes)
- 📅 **Agenda de Citas** con calendario
- 🦷 **Tratamientos** y presupuestos
- 📋 **Historial Clínico** con odontogramas
- 💰 **Facturación** y pagos
- 📦 **Inventario** de insumos
- 📊 **Reportes** y estadísticas
- ⚙️ **Configuración** avanzada

## 📝 Convenciones de Código

- **Componentes**: `PascalCase` (ej: `LoginForm.tsx`)
- **Hooks**: `camelCase` con `use` (ej: `useAuth.ts`)
- **Services**: `camelCase` (ej: `authService.ts`)
- **Types**: `PascalCase` (ej: `Usuario`, `AuthResponse`)
- **Constantes**: `SCREAMING_SNAKE_CASE`

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview de producción
npm run preview

# Linting
npm run lint
```

## 📚 Documentación

- **ESTRUCTURA.md**: Explicación detallada de la arquitectura
- **GUIA_FRONT/**: Guías paso a paso para cada módulo

## 🐛 Debugging

El modo debug está activado por defecto en `.env.local`:
```
VITE_DEBUG=true
```

Esto mostrará logs en consola de:
- 🚀 Requests HTTP
- ✅ Responses exitosos
- ❌ Errores
- 🔑 Estado de tokens

## 🤝 Equipo de Desarrollo

Sistema desarrollado para Sistemas de Información 2.

---

**🎯 SIGUIENTE PASO**: Implementar auto-refresh de tokens siguiendo `GUIA_FRONT/01a1_axios_core_PARTE2.md`
