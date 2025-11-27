# 🦷 ¿Qué son los Planes de Tratamiento?

**Fecha:** 27 de noviembre de 2025

---

## 📋 Definición

Los **Planes de Tratamiento** son documentos clínicos que un odontólogo crea para organizar y planificar todos los procedimientos que un paciente necesita realizar.

### Ejemplo real:

Un paciente llega con:
- 2 caries
- Necesita limpieza dental
- Requiere extracción de una muela del juicio

El odontólogo crea un **Plan de Tratamiento** que incluye:
1. **Limpieza dental** - Bs. 60
2. **Obturación (carie diente 16)** - Bs. 80
3. **Obturación (carie diente 24)** - Bs. 80
4. **Extracción muela del juicio** - Bs. 120

**Total del plan:** Bs. 340

---

## 🔄 Estados de un Plan de Tratamiento

### 1. **PROPUESTO** (Inicial)
- El odontólogo lo crea
- Se envía al paciente para aprobación
- Aún no se inicia ningún procedimiento

### 2. **EN_PROGRESO** (Activo)
- El paciente aceptó el plan
- Se están realizando los procedimientos
- Algunos ya están completados, otros pendientes

### 3. **COMPLETADO**
- Todos los procedimientos del plan fueron realizados
- El tratamiento finalizó exitosamente

### 4. **CANCELADO**
- El plan fue rechazado por el paciente
- O se canceló por alguna razón

---

## 📊 KPIs del Dashboard

### **"Tratamientos Activos" = 0**

**¿Qué significa?**
- No hay planes en estado `EN_PROGRESO`
- Es decir, ningún paciente tiene un tratamiento dental en curso actualmente

**¿Por qué puede estar en 0?**
1. ✅ **Normal:** No hay pacientes en tratamiento ahora mismo
2. ✅ **Normal:** Los odontólogos aún no han creado planes
3. ✅ **Normal:** Los planes están en estado PROPUESTO (esperando aprobación)

**¿Es un error?**
❌ **NO es un error**. Es simplemente que no hay tratamientos activos en este momento.

---

### **"Planes Completados" = 0**

**¿Qué significa?**
- Ningún plan de tratamiento ha sido completado este mes
- No se han finalizado tratamientos dentales completos

**¿Por qué puede estar en 0?**
1. ✅ **Normal:** Es inicio de mes y aún no se completan tratamientos
2. ✅ **Normal:** Los tratamientos actuales aún están en progreso
3. ✅ **Normal:** La clínica atiende tratamientos simples (no requieren plan)

**¿Es un error?**
❌ **NO es un error**. Significa que este mes aún no se han completado planes de tratamiento.

---

## 💰 "Ingresos del Mes" mostrando 0

### 🔍 Análisis del Problema

**Según los logs del navegador:**
```
📊 Mapeando KPI: "Ingresos Este Mes" = 440
✅ KPIs mapeados correctamente: {ingresos_mes: 440, ...}
```

**Conclusión:**
✅ **El backend SÍ está enviando 440**
❌ **El frontend NO lo está mostrando correctamente**

---

### 🐛 Posibles Causas (Frontend)

#### **Causa 1: Formateo incorrecto**
El componente `KPICard` puede tener un problema al formatear valores numéricos:

```typescript
// Si value viene como 440 pero format="currency"
formatValue(440) → "Bs. 440.00" ✅ CORRECTO
formatValue(0) → "Bs. 0.00" ❌ INCORRECTO
```

#### **Causa 2: Re-renderizado con datos vacíos**
El componente se puede estar renderizando múltiples veces y en alguna de ellas `kpis.ingresos_mes` es `undefined` o `0`.

#### **Causa 3: Caché del navegador**
La aplicación puede estar usando una versión antigua en caché.

---

## 🔧 Solución Implementada

### **Paso 1: Agregar logs de debugging**

He agregado logs detallados al componente `KPICard` para ver qué valor está recibiendo:

```typescript
console.log(`🔢 [KPICard] Formateando ${label}:`, { val, tipo: typeof val, prefix, format });
```

### **Paso 2: Verificar en el navegador**

Después de recargar la página (Ctrl+Shift+R para borrar caché), deberías ver en la consola:

```
🔢 [KPICard] Formateando Ingresos del Mes: { val: 440, tipo: 'number', prefix: 'Bs. ', format: 'currency' }
💰 [KPICard] Ingresos del Mes formateado: Bs. 440.00
```

Si ves:
```
🔢 [KPICard] Formateando Ingresos del Mes: { val: 0, tipo: 'number', ... }
```

Entonces el problema está en `adminDashboardService.getKPIs()`.

---

## 📝 ¿Cómo crear Planes de Tratamiento?

Para que estos KPIs tengan valores mayores a 0, necesitas:

### **1. Crear un Plan de Tratamiento**

**Ruta:** `/admin/pacientes` → Seleccionar paciente → "Planes de Tratamiento"

**Pasos:**
1. Selecciona un paciente
2. Crea un nuevo plan
3. Agrega los procedimientos necesarios (ej: Limpieza, Obturación, etc.)
4. Guarda el plan con estado "PROPUESTO"

### **2. Activar el Plan**

**Cambiar estado a "EN_PROGRESO":**
1. Edita el plan creado
2. Cambia el estado de PROPUESTO → EN_PROGRESO
3. Ahora aparecerá en "Tratamientos Activos" = 1

### **3. Completar Procedimientos**

**A medida que realizas los procedimientos:**
1. Marca cada procedimiento como completado
2. Cuando TODOS los procedimientos estén completados
3. Cambia el estado del plan a "COMPLETADO"
4. Ahora aparecerá en "Planes Completados" = 1

---

## 🧪 Datos de Prueba

Para probar el sistema, puedes crear:

### **Plan de Tratamiento #1**
- **Paciente:** María García
- **Procedimientos:**
  - Limpieza dental - Bs. 60
  - Obturación - Bs. 80
- **Estado:** EN_PROGRESO
- **Efecto:** "Tratamientos Activos" = 1

### **Plan de Tratamiento #2**
- **Paciente:** Juan Pérez
- **Procedimientos:**
  - Extracción - Bs. 100
  - Consulta - Bs. 30
- **Estado:** COMPLETADO
- **Efecto:** "Planes Completados" = 1

---

## 📊 Relación con otros KPIs

### **Ingresos del Mes vs Planes**

**IMPORTANTE:** Los ingresos NO dependen de los planes:
- ✅ Ingresos = Pagos recibidos de facturas
- ❌ Ingresos ≠ Planes de tratamiento

**Puede haber:**
- Bs. 440 de ingresos (pagos de citas simples)
- 0 planes activos (no hay tratamientos complejos)

Esto es **NORMAL** en clínicas que hacen:
- Consultas simples
- Limpiezas dentales
- Procedimientos rápidos

Que **NO requieren** un plan de tratamiento completo.

---

## 🔗 Endpoints del Backend

### **Planes de Tratamiento:**
```
GET /api/tratamientos/planes/
POST /api/tratamientos/planes/
GET /api/tratamientos/planes/{id}/
PUT /api/tratamientos/planes/{id}/
DELETE /api/tratamientos/planes/{id}/
```

### **Estados disponibles:**
- `PROPUESTO`
- `EN_PROGRESO`
- `COMPLETADO`
- `CANCELADO`

---

## ✅ Resumen

### **¿Es normal tener 0 en estos KPIs?**
✅ **SÍ**, es completamente normal si:
- La clínica es nueva
- No se han creado planes de tratamiento
- Solo se atienden consultas simples

### **¿Cómo tener valores mayores a 0?**
1. Crear planes de tratamiento desde el panel de admin
2. Cambiar estados a EN_PROGRESO
3. Completar los procedimientos
4. Marcar planes como COMPLETADO

### **¿El problema de "Ingresos del Mes" es del backend o frontend?**
🔍 **Aún por determinar**. Los logs muestran que el backend envía 440, pero necesitamos ver los logs del navegador después de agregar el debugging al KPICard.

---

**Próximos pasos:**
1. ✅ Recargar la página con Ctrl+Shift+R
2. ✅ Revisar consola del navegador
3. ✅ Verificar logs de `[KPICard] Formateando Ingresos del Mes`
4. ✅ Crear un plan de tratamiento de prueba
