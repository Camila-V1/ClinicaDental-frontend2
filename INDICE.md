# 📚 ÍNDICE DEL PROYECTO - CLÍNICA DENTAL

## 🎯 Documentos Principales

| Documento | Descripción | Estado |
|-----------|-------------|--------|
| [README_PROYECTO.md](./README_PROYECTO.md) | Información general del proyecto | ✅ |
| [PLAN_IMPLEMENTACION.md](./PLAN_IMPLEMENTACION.md) | Plan detallado con tiempos | ✅ |
| [src/ESTRUCTURA.md](./src/ESTRUCTURA.md) | Explicación de la arquitectura | ✅ |

## 📁 Archivos Creados

### ⚙️ Configuración
- `/.env.local` - Variables de entorno
- `/src/config/constants.ts` - Constantes globales
- `/src/config/apiConfig.ts` - Configuración de Axios

### 🛠️ Utilidades
- `/src/utils/tokenHelpers.ts` - Helpers para JWT

### 📝 TypeScript Types
- `/src/types/auth.types.ts` - Types de autenticación
- `/src/types/usuario.types.ts` - Types de usuarios

## 📂 Estructura de Carpetas

```
src/
├── config/              ⚙️ Configuración (2 archivos)
├── services/            🔌 Servicios API (vacío - listo para implementar)
├── utils/               🛠️ Utilidades (1 archivo)
├── hooks/               🪝 Custom Hooks (vacío - listo para implementar)
├── context/             🌐 Context API (vacío - listo para implementar)
├── types/               📝 TypeScript Types (2 archivos)
│
├── components/          🧩 Componentes
│   ├── common/          # Botones, inputs, tablas, etc.
│   ├── auth/            # LoginForm, RegisterForm, etc.
│   └── layout/          # Header, Sidebar, Footer
│
└── pages/               📄 Páginas por Módulo
    ├── auth/            🔐 Login, Register
    ├── dashboard/       📊 Dashboard principal
    ├── usuarios/        👥 Gestión de usuarios
    ├── agenda/          📅 Citas y calendario
    ├── tratamientos/    🦷 Servicios y presupuestos
    ├── historial-clinico/ 📋 Historiales clínicos
    ├── facturacion/     💰 Facturas y pagos
    ├── inventario/      📦 Insumos y categorías
    └── reportes/        📈 Reportes y estadísticas
```

## 📚 Guías de Implementación

### 🔐 Fase 1: Autenticación
1. [01a1_axios_core_PARTE1.md](./GUIA_FRONT/01a1_axios_core_PARTE1.md) ✅
2. [01a1_axios_core_PARTE2.md](./GUIA_FRONT/01a1_axios_core_PARTE2.md) ⏳ SIGUIENTE
3. [01a1_validators.md](./GUIA_FRONT/01a1_validators.md)
4. [01a2_axios_advanced_PARTE1.md](./GUIA_FRONT/01a2_axios_advanced_PARTE1.md)
5. [01a2_axios_advanced_PARTE2.md](./GUIA_FRONT/01a2_axios_advanced_PARTE2.md)
6. [01a3_http_utils.md](./GUIA_FRONT/01a3_http_utils.md)
7. [01b_auth_service.md](./GUIA_FRONT/01b_auth_service.md)
8. [01c_context_auth.md](./GUIA_FRONT/01c_context_auth.md)
9. [01d_componentes_auth.md](./GUIA_FRONT/01d_componentes_auth.md)

### 👥 Fase 2: Usuarios
10. [02_gestion_usuarios.md](./GUIA_FRONT/02_gestion_usuarios.md)

### 📦 Fase 3: Módulos Core
11. [03_inventario.md](./GUIA_FRONT/03_inventario.md)
12. [04_tratamientos.md](./GUIA_FRONT/04_tratamientos.md)
13. [05_agenda_citas.md](./GUIA_FRONT/05_agenda_citas.md)

### 🦷 Fase 4: Módulos Clínicos
14. [06_historial_clinico.md](./GUIA_FRONT/06_historial_clinico.md)
15. [07_facturacion_pagos.md](./GUIA_FRONT/07_facturacion_pagos.md)

### 📊 Fase 5: Reportes
16. [08_reportes_dashboard.md](./GUIA_FRONT/08_reportes_dashboard.md)

### ⚙️ Fase 6: Configuración
17. [09_configuracion_avanzada.md](./GUIA_FRONT/09_configuracion_avanzada.md)

### 🏢 Configuración Multi-Tenant
18. [10_multi_tenant_config.md](./GUIA_FRONT/10_multi_tenant_config.md)

## 🚀 Comandos Rápidos

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Lint
npm run lint

# Preview producción
npm run preview
```

## 📊 Progreso del Proyecto

### ✅ Completado (Setup Inicial)
- [x] Estructura de carpetas
- [x] Configuración de Axios básica
- [x] Variables de entorno
- [x] Constantes del sistema
- [x] Token helpers
- [x] Types de TypeScript (auth, usuario)

### ⏳ En Progreso
- [ ] Auto-refresh de tokens (01a1_PARTE2)

### 📋 Pendiente
- [ ] Validadores
- [ ] Multi-tenant config
- [ ] Auth service
- [ ] Auth context
- [ ] Componentes de auth
- [ ] Resto de módulos...

## 🎯 Siguiente Paso

**Abrir:** `GUIA_FRONT/01a1_axios_core_PARTE2.md`

**Tarea:** Implementar auto-refresh de tokens JWT

**Archivo a crear:** `src/config/apiConfig.ts` (actualizar interceptor de response)

## 📞 Información Adicional

- **Backend URL**: http://localhost:8000
- **Frontend URL**: http://localhost:5173 (Vite default)
- **Documentación**: Carpeta `GUIA_FRONT/`

---

**Última actualización**: Noviembre 2025
**Estado**: Setup inicial completado ✅
