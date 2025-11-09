# 📁 ESTRUCTURA DEL PROYECTO - CLÍNICA DENTAL FRONTEND

## 🎯 Organización por Funcionalidad

```
src/
├── config/              # ⚙️ Configuración general
│   ├── apiConfig.ts     # Configuración de Axios
│   └── constants.ts     # Constantes globales
│
├── services/            # 🔌 Servicios API (comunicación con backend)
│   ├── authService.ts          # Autenticación
│   ├── usuariosService.ts      # Gestión de usuarios
│   ├── agendaService.ts        # Citas y calendario
│   ├── tratamientosService.ts  # Tratamientos y presupuestos
│   ├── historialService.ts     # Historiales clínicos
│   ├── facturacionService.ts   # Facturas y pagos
│   ├── inventarioService.ts    # Inventario de insumos
│   └── reportesService.ts      # Reportes y estadísticas
│
├── utils/               # 🛠️ Utilidades y helpers
│   ├── tokenHelpers.ts         # Manejo de JWT tokens
│   ├── validators.ts           # Validadores de datos
│   ├── formatters.ts           # Formateo de datos
│   └── httpUtils.ts            # Utilidades HTTP
│
├── hooks/               # 🪝 Custom Hooks de React
│   ├── useAuth.ts              # Hook de autenticación
│   ├── useUsuarios.ts          # Hook para usuarios
│   ├── useAgenda.ts            # Hook para citas
│   ├── useTratamientos.ts      # Hook para tratamientos
│   └── ...                     # Más hooks por módulo
│
├── context/             # 🌐 Context API de React
│   ├── AuthContext.tsx         # Contexto de autenticación
│   └── TenantContext.tsx       # Contexto multi-tenant
│
├── components/          # 🧩 Componentes reutilizables
│   ├── common/                 # Componentes comunes
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Table.tsx
│   │   ├── Loading.tsx
│   │   └── ErrorMessage.tsx
│   │
│   ├── auth/                   # Componentes de autenticación
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   └── layout/                 # Componentes de layout
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       ├── Footer.tsx
│       └── MainLayout.tsx
│
├── pages/               # 📄 Páginas organizadas por módulo
│   ├── auth/                   # 🔐 Autenticación
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── ForgotPasswordPage.tsx
│   │
│   ├── dashboard/              # 📊 Dashboard principal
│   │   └── DashboardPage.tsx
│   │
│   ├── usuarios/               # 👥 Gestión de Usuarios
│   │   ├── UsuariosListPage.tsx
│   │   ├── UsuarioDetailPage.tsx
│   │   ├── DoctoresPage.tsx
│   │   └── PacientesPage.tsx
│   │
│   ├── agenda/                 # 📅 Agenda y Citas
│   │   ├── AgendaPage.tsx
│   │   ├── CitasListPage.tsx
│   │   └── NuevaCitaPage.tsx
│   │
│   ├── tratamientos/           # 🦷 Tratamientos
│   │   ├── TratamientosListPage.tsx
│   │   ├── ServiciosPage.tsx
│   │   └── PresupuestosPage.tsx
│   │
│   ├── historial-clinico/      # 📋 Historial Clínico
│   │   ├── HistorialListPage.tsx
│   │   ├── HistorialDetailPage.tsx
│   │   └── OdontogramaPage.tsx
│   │
│   ├── facturacion/            # 💰 Facturación y Pagos
│   │   ├── FacturasListPage.tsx
│   │   ├── FacturaDetailPage.tsx
│   │   └── PagosPage.tsx
│   │
│   ├── inventario/             # 📦 Inventario
│   │   ├── InventarioListPage.tsx
│   │   ├── CategoriasPage.tsx
│   │   └── InsumosPage.tsx
│   │
│   └── reportes/               # 📈 Reportes
│       ├── ReportesPage.tsx
│       └── EstadisticasPage.tsx
│
├── types/               # 📝 TypeScript Types e Interfaces
│   ├── auth.types.ts
│   ├── usuario.types.ts
│   ├── agenda.types.ts
│   ├── tratamiento.types.ts
│   └── ...
│
└── assets/              # 🎨 Recursos estáticos
    ├── images/
    ├── icons/
    └── styles/
```

## 📚 Convenciones de Nomenclatura

### Archivos y Carpetas:
- **Componentes React**: PascalCase (ej: `LoginForm.tsx`)
- **Hooks**: camelCase con prefijo `use` (ej: `useAuth.ts`)
- **Services**: camelCase con sufijo `Service` (ej: `authService.ts`)
- **Utils**: camelCase (ej: `tokenHelpers.ts`)
- **Types**: camelCase con sufijo `.types` (ej: `auth.types.ts`)
- **Carpetas de páginas**: kebab-case (ej: `historial-clinico/`)

### Código:
- **Constantes**: SCREAMING_SNAKE_CASE (ej: `API_ENDPOINTS`)
- **Variables**: camelCase (ej: `userData`)
- **Funciones**: camelCase (ej: `getUserProfile`)
- **Componentes**: PascalCase (ej: `LoginForm`)
- **Interfaces/Types**: PascalCase (ej: `User`, `AuthResponse`)

## 🔄 Flujo de Datos

```
Usuario → Página → Hook → Service → API Backend
                     ↓
                  Context (estado global)
```

## 📦 Módulos del Sistema

1. **🔐 Autenticación**: Login, registro, JWT tokens
2. **👥 Usuarios**: Doctores, pacientes, perfiles
3. **📅 Agenda**: Citas, calendario, horarios
4. **🦷 Tratamientos**: Servicios, planes, presupuestos
5. **📋 Historial Clínico**: Historiales, episodios, odontogramas
6. **💰 Facturación**: Facturas, pagos, estados de cuenta
7. **📦 Inventario**: Categorías, insumos, stock
8. **📊 Reportes**: KPIs, gráficos, estadísticas

## 🚀 Orden de Implementación

Seguir el orden de las guías en `GUIA_FRONT/`:

1. ⚙️ **Config**: Axios, constants, env variables
2. 🔐 **Auth**: Login, register, protected routes
3. 👥 **Usuarios**: Gestión de usuarios
4. 📦 **Inventario**: Categorías e insumos
5. 🦷 **Tratamientos**: Servicios y presupuestos
6. 📅 **Agenda**: Citas y calendario
7. 📋 **Historial**: Historiales clínicos
8. 💰 **Facturación**: Facturas y pagos
9. 📊 **Reportes**: Dashboard y estadísticas

## 🎯 Beneficios de esta Estructura

✅ **Organizada**: Cada módulo tiene su propia carpeta en `pages/`
✅ **Escalable**: Fácil agregar nuevos módulos
✅ **Mantenible**: Código separado por responsabilidad
✅ **Intuitiva**: Estructura clara y predecible
✅ **Profesional**: Sigue mejores prácticas de React/TypeScript
