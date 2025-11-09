# 🦷 GUÍA 17: GESTIÓN COMPLETA DEL PLAN DE TRATAMIENTO

## ✅ IMPLEMENTACIÓN COMPLETADA

### 📋 Archivos Modificados/Creados

1. **src/services/planesService.ts** ✅
   - ✅ `presentarPlan()` - PROPUESTO → PRESENTADO
   - ✅ `aceptarPlan()` - PRESENTADO → ACEPTADO
   - ✅ `rechazarPlan()` - PROPUESTO/PRESENTADO → RECHAZADO
   - ✅ `cancelarPlan()` - ACEPTADO/EN_PROGRESO → CANCELADO
   - ✅ `completarItemManual()` - Completar ítem sin episodio

2. **src/pages/odontologo/PlanDetalle.tsx** ✅
   - ✅ Vista completa con todas las acciones del plan
   - ✅ Botones contextuales según estado del plan
   - ✅ Gestión de ítems (editar, eliminar, completar)
   - ✅ Confirmaciones y validaciones
   - ✅ Información contextual según estado

3. **src/components/planes/ModalEditarItem.tsx** ✅
   - ✅ Modal para editar notas y fecha estimada
   - ✅ Validación de campos
   - ✅ Diseño inline styles consistente

---

## 🎯 Flujo de Estados del Plan

```
PROPUESTO ──► PRESENTADO ──► ACEPTADO ──► EN_PROGRESO ──► COMPLETADO
    │              │
    └──► RECHAZADO └──► RECHAZADO
         
         ACEPTADO/EN_PROGRESO ──► CANCELADO
```

---

## 🔐 Permisos por Estado

### PROPUESTO
- ✅ Agregar ítems
- ✅ Editar ítems
- ✅ Eliminar ítems
- ✅ Presentar plan
- ✅ Rechazar plan

### PRESENTADO
- ✅ Agregar ítems
- ✅ Editar ítems
- ✅ Eliminar ítems
- ✅ Aceptar plan
- ✅ Rechazar plan

### ACEPTADO
- ❌ NO editar ítems (presupuesto CONGELADO)
- ✅ Vincular episodios
- ✅ Cancelar plan
- ⚡ Auto-transición a EN_PROGRESO al crear primer episodio

### EN_PROGRESO
- ❌ NO editar ítems
- ✅ Completar ítems manualmente
- ✅ Vincular episodios
- ✅ Cancelar plan
- ⚡ Auto-transición a COMPLETADO cuando todos los ítems completos

### COMPLETADO
- 🎉 Finalizado
- ❌ No se puede editar

### RECHAZADO/CANCELADO
- 🚫 Plan cerrado
- ❌ No se puede editar

---

## 🎯 Funcionalidades Implementadas

### 1. Acciones del Plan

#### Presentar Plan
```typescript
handlePresentarPlan()
```
- Valida que tenga al menos 1 ítem
- Confirmación: "¿Presentar plan al paciente?"
- PROPUESTO → PRESENTADO

#### Aceptar Plan
```typescript
handleAceptarPlan()
```
- Advertencia: Presupuesto CONGELADO
- No se podrán editar ítems después
- PRESENTADO → ACEPTADO

#### Rechazar Plan
```typescript
handleRechazarPlan()
```
- Solicita motivo (opcional)
- PROPUESTO/PRESENTADO → RECHAZADO

#### Cancelar Plan
```typescript
handleCancelarPlan()
```
- Solicita motivo (obligatorio)
- Confirmación: "Esta acción no se puede deshacer"
- ACEPTADO/EN_PROGRESO → CANCELADO

### 2. Gestión de Ítems

#### Editar Ítem
```typescript
handleEditarItem(item)
```
- Solo ítems en estado PENDIENTE
- Solo si plan.puede_ser_editado === true
- Abre ModalEditarItem
- Permite editar: notas y fecha_estimada
- NO permite cambiar: servicio ni material

#### Eliminar Ítem
```typescript
handleEliminarItem(item)
```
- Solo ítems en estado PENDIENTE
- Confirmación: "Esta acción no se puede deshacer"
- Recarga plan completo después

#### Completar Ítem Manual
```typescript
handleCompletarItem(item)
```
- Solo si plan en EN_PROGRESO
- Solo ítems en estado EN_PROGRESO
- Para procedimientos realizados sin registrar episodio
- Actualiza progreso del plan automáticamente

---

## 🎨 Componentes Visuales

### Header del Plan
- Título del plan
- Badge de estado con colores
- Nombre del paciente
- Fecha de creación
- Botones de acción contextuales

### Cards de Información
1. **Estado** - Estado actual del plan
2. **Prioridad** - BAJA/MEDIA/ALTA/URGENTE
3. **Procedimientos** - Cantidad de ítems
4. **Fecha Creación** - Día y mes

### Precio Total y Progreso
- Card verde con gradiente
- Precio total en grande
- Cantidad de servicios
- Barra de progreso animada
- Porcentaje completado
- Fechas de inicio y finalización

### Lista de Ítems
Cada ítem muestra:
- Número de orden (#1, #2, etc.)
- Nombre del servicio
- Badge de estado (PENDIENTE/EN_PROGRESO/COMPLETADO)
- Material seleccionado (si aplica)
- Notas (si tiene)
- Fecha estimada (si tiene)
- Desglose de precios:
  * Honorarios
  * Materiales fijos
  * Material opcional
- Botones de acción (según permisos)

### Información Contextual
Box azul al final con información específica según el estado:
- PROPUESTO: Instrucciones para presentar
- PRESENTADO: Qué hacer (aceptar/rechazar)
- ACEPTADO: Info sobre presupuesto congelado
- EN_PROGRESO: Cómo completar ítems
- COMPLETADO: Mensaje de felicitación

---

## 📋 ModalEditarItem

### Características
- Header azul con título "✏️ Editar Servicio"
- Info del servicio (no editable):
  * Nombre
  * Precio total
  * Material seleccionado
- Campos editables:
  * **Notas** - Textarea con 4 filas
  * **Fecha Estimada** - Input tipo date
- Advertencia: "No puedes cambiar el servicio ni el material"
- Botones:
  * Cancelar (gris)
  * Guardar Cambios (azul con loading)

### Validación
- No permite cambiar servicio
- No permite cambiar material
- Solo actualiza notas y fecha estimada
- Confirmación: "✅ Ítem actualizado exitosamente"

---

## 🧪 Cómo Probar

### Flujo Completo

1. **Crear Plan** (Estado: PROPUESTO)
   ```
   Dashboard → Planes → ➕ Nuevo Plan
   - Seleccionar paciente
   - Ingresar título: "Ortodoncia Completa"
   - Guardar
   ```

2. **Agregar Servicios**
   ```
   Click "➕ Agregar Servicio"
   - Agregar 3-4 servicios diferentes
   - Algunos con materiales opcionales
   - Verificar precios dinámicos
   ```

3. **Editar Ítem**
   ```
   Click ✏️ en un ítem
   - Agregar notas: "Procedimiento prioritario"
   - Agregar fecha estimada
   - Guardar
   ```

4. **Presentar Plan**
   ```
   Click "📋 Presentar Plan"
   - Confirmar
   - Verificar estado: PRESENTADO
   - Verificar badge color azul
   ```

5. **Aceptar Plan**
   ```
   Click "✔️ Aceptar Plan"
   - Leer advertencia sobre congelación
   - Confirmar
   - Verificar estado: ACEPTADO
   - Verificar que ya NO aparece botón "Agregar Servicio"
   - Verificar que NO hay botones de editar/eliminar
   ```

6. **Vincular Episodio** (Guía 18 - próxima)
   ```
   Ir a Agenda → Atender Cita
   - Al registrar episodio, vincular a ítem del plan
   - Plan auto-transición a EN_PROGRESO
   ```

7. **Completar Ítems**
   ```
   Opción A: Automático (al vincular episodios)
   Opción B: Manual
   - Click "✅ Completar" en ítem EN_PROGRESO
   - Confirmar
   - Ver progreso actualizado
   ```

8. **Plan Completado**
   ```
   Cuando todos los ítems completados:
   - Auto-transición a COMPLETADO
   - Badge morado
   - Mensaje: "Tratamiento finalizado exitosamente"
   ```

### Flujos Alternativos

#### Rechazar Plan
```
Estado: PROPUESTO o PRESENTADO
1. Click "✖️ Rechazar"
2. Ingresar motivo: "Paciente no acepta presupuesto"
3. Confirmar
4. Verificar estado: RECHAZADO
5. Verificar badge rojo
```

#### Cancelar Plan
```
Estado: ACEPTADO o EN_PROGRESO
1. Click "🚫 Cancelar Plan"
2. Ingresar motivo obligatorio: "Paciente abandonó tratamiento"
3. Confirmar advertencia
4. Verificar estado: CANCELADO
5. Verificar badge rojo
```

#### Eliminar Ítem
```
Estado: PROPUESTO o PRESENTADO
Ítem: PENDIENTE
1. Click 🗑️ en ítem
2. Confirmar: "Esta acción no se puede deshacer"
3. Verificar que ítem desaparece
4. Verificar que precio total se actualiza
5. Verificar que cantidad de ítems disminuye
```

---

## 🎯 Validaciones Implementadas

### ✅ Validaciones de Plan
- ❌ No presentar plan vacío (sin ítems)
- ❌ No editar ítems en plan ACEPTADO
- ❌ No agregar ítems en plan ACEPTADO
- ✅ Motivo obligatorio al cancelar
- ✅ Confirmaciones en acciones críticas

### ✅ Validaciones de Ítems
- ❌ Solo editar ítems PENDIENTES
- ❌ Solo eliminar ítems PENDIENTES
- ❌ Solo completar ítems EN_PROGRESO
- ✅ Confirmación antes de eliminar
- ✅ Confirmación antes de completar

### ✅ Permisos por Estado
- ✅ Botones aparecen solo cuando aplican
- ✅ Estados disabled cuando procesando
- ✅ Opacidad visual en botones disabled
- ✅ Cursor not-allowed en disabled

---

## 📊 Colores de Estados

### Estados del Plan
```typescript
PROPUESTO   → Gris  (#f3f4f6 / #374151)
PRESENTADO  → Azul  (#dbeafe / #1e40af)
ACEPTADO    → Verde (#d1fae5 / #065f46)
EN_PROGRESO → Amarillo (#fef3c7 / #92400e)
COMPLETADO  → Morado (#e9d5ff / #6b21a8)
RECHAZADO   → Rojo (#fee2e2 / #991b1b)
CANCELADO   → Rojo (#fee2e2 / #991b1b)
```

### Estados de Ítems
```typescript
PENDIENTE   → Gris (#f3f4f6 / #374151)
EN_PROGRESO → Amarillo (#fef3c7 / #92400e)
COMPLETADO  → Verde (#d1fae5 / #065f46)
```

---

## 🚀 Próximos Pasos (Guía 18)

### Vincular Episodios desde la Agenda

**Funcionalidad:**
- Detectar automáticamente planes ACEPTADOS o EN_PROGRESO del paciente
- Mostrar selector de ítems del plan en modal de atención
- Vincular episodio a ítem específico del plan
- Actualización automática de progreso (via signals Django)
- Opción de crear "episodio libre" (sin vincular a plan)

**Transiciones Automáticas:**
```
Crear primer episodio vinculado:
  ACEPTADO → EN_PROGRESO

Vincular episodio a ítem:
  Ítem PENDIENTE → EN_PROGRESO

Todos los ítems completados:
  EN_PROGRESO → COMPLETADO
```

---

## ✅ Checklist de Verificación

- [x] Crear funciones de gestión en planesService.ts
- [x] Actualizar PlanDetalle.tsx con acciones completas
- [x] Crear ModalEditarItem.tsx
- [x] Implementar botones contextuales según estado
- [x] Validaciones de permisos por estado
- [x] Confirmaciones en acciones críticas
- [x] Colores y badges de estados
- [x] Información contextual según estado
- [x] Desglose de precios por ítem
- [x] Loading states en botones
- [x] Manejo de errores con mensajes claros
- [ ] Probar flujo completo end-to-end

---

## 🎉 Estado del Sistema

| Guía | Estado | Descripción |
|------|--------|-------------|
| Guía 15 | ✅ COMPLETADO | Crear plan de tratamiento |
| Guía 16 | ✅ COMPLETADO | Agregar ítems con precio dinámico |
| **Guía 17** | **✅ COMPLETADO** | **Gestión completa del plan** |
| Guía 18 | ⏳ PENDIENTE | Vincular episodios desde agenda |

---

## 📝 Notas Técnicas

### Transiciones Automáticas (Backend)
```python
# Django signals automáticos:
- ACEPTADO → EN_PROGRESO (al crear primer episodio)
- Item PENDIENTE → EN_PROGRESO (al vincular episodio)
- Item EN_PROGRESO → COMPLETADO (al completar episodio)
- EN_PROGRESO → COMPLETADO (cuando todos los ítems completos)
```

### Inmutabilidad del Presupuesto
Una vez el plan está ACEPTADO:
- ✅ Precios "congelados" (snapshots)
- ❌ No se pueden agregar/editar/eliminar ítems
- ✅ Solo se pueden vincular episodios
- ✅ Garantiza integridad del presupuesto aprobado

### Mejores Prácticas
1. Siempre agregar motivo al rechazar/cancelar
2. Usar completado manual solo cuando NO hay episodio
3. Revisar plan antes de presentar al paciente
4. No aceptar plan hasta confirmación del paciente
5. Los episodios son la forma principal de completar ítems

---

**✅ GUÍA 17 COMPLETADA CON ÉXITO** 🎉

El sistema de Planes de Tratamiento ahora tiene un ciclo de vida completo con todas las validaciones, transiciones y controles necesarios para una gestión profesional de presupuestos odontológicos.
