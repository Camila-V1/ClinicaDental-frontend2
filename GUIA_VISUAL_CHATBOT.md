# 🎯 Guía Visual del Chatbot

## 📍 Ubicación

El chatbot aparece como una **burbuja flotante** en la esquina inferior derecha de TODAS las páginas:

```
┌─────────────────────────────────────┐
│                                     │
│         Tu Aplicación               │
│                                     │
│                                     │
│                                     │
│                                  💬 │  <- Burbuja flotante
└─────────────────────────────────────┘
```

---

## 🎨 Componente Visual

### 1. Burbuja Flotante (Cerrado)
```
    ╭────╮
    │ 💬 │  <- Gradiente purple/blue
    ╰────╯
```
- **Color**: Gradiente #667eea → #764ba2
- **Tamaño**: 60px × 60px
- **Efecto hover**: Escala 1.1
- **Shadow**: Sombra con efecto glow

---

### 2. Ventana de Chat (Abierto)

```
╔════════════════════════════════════╗
║  🤖  Asistente Virtual        🗑️ ✕ ║  <- Header (gradiente)
║       ● En línea                   ║
╠════════════════════════════════════╣
║                                    ║
║  🤖 ¡Hola! ¿En qué puedo          ║
║     ayudarte?                      ║
║     ┌─────────┐ ┌──────────┐     ║
║     │Ver citas│ │Próxima...│     ║  <- Sugerencias
║     └─────────┘ └──────────┘     ║
║     10:30                          ║
║                                    ║
║                Ver mis citas 🎤    ║  <- Usuario
║                         10:31      ║
║                                    ║
║  🤖 Aquí están tus citas:         ║
║     ┌──────────────────────────┐  ║
║     │📅 2024-03-15 - 10:00    │  ║
║     │🏥 Dr. García             │  ║  <- Card de datos
║     │📝 Control                │  ║
║     │[CONFIRMADA]              │  ║
║     └──────────────────────────┘  ║
║     10:32                          ║
║                                    ║
║  🤖 ⋯  <- Escribiendo...          ║
║                                    ║
╠════════════════════════════════════╣
║  🎤  ┌─────────────────────┐  ✉️  ║  <- Input
║      │ Escribe mensaje...  │      ║
╚════════════════════════════════════╝
```

**Dimensiones**:
- Ancho: 380px
- Alto: 600px
- Max-height: 80vh

---

## 🎭 Estados Visuales

### Botón de Micrófono

#### Normal (Verde)
```
╭───╮
│🎤 │  <- Verde (#10b981)
╰───╯
```

#### Escuchando (Rojo pulsante)
```
╭───╮
│🎤 │  <- Rojo (#ef4444) + animación pulse
╰───╯
```

---

### Indicador "Escribiendo..."
```
🤖  ● ● ●  <- Dots que saltan
```
Animación de 3 puntos con delay escalonado (0s, 0.2s, 0.4s)

---

### Mensajes

#### Mensaje del Bot
```
┌─────────────────────────────────┐
│ 🤖  ┌─────────────────────────┐ │
│     │ Texto del mensaje       │ │  <- Fondo blanco
│     └─────────────────────────┘ │
│     10:30                       │
└─────────────────────────────────┘
```

#### Mensaje del Usuario
```
┌─────────────────────────────────┐
│     ┌─────────────────────────┐ │
│     │ 🎤 Texto del mensaje    │ │  <- Gradiente purple
│     └─────────────────────────┘ 🤖│
│                           10:31 │
└─────────────────────────────────┘
```

#### Mensaje de Error
```
🤖  ┌─────────────────────────┐
    │ ⚠️ Error al procesar   │  <- Fondo rojo claro
    │ │                       │  <- Borde rojo izquierdo
    └─────────────────────────┘
```

---

## 📊 Tipos de Respuesta con Datos

### 1. Lista de Citas
```
┌────────────────────────────┐
│ 📅  2024-03-15 - 10:00    │
│ 🏥  Dr. García             │
│ 📝  Control                │
│ [CONFIRMADA]               │  <- Badge verde
└────────────────────────────┘
```

### 2. Próxima Cita (Destacada)
```
┌────────────────────────────┐  <- Fondo con gradiente sutil
│ 📆  2024-03-15 a las 10:00│
│ ⏰  En 2 días              │
│ 🏥  Dr. García             │
│ 📝  Control                │
└────────────────────────────┘
```

### 3. Tratamientos con Progress
```
┌────────────────────────────┐
│ 🦷  Ortodoncia            │
│ 🏥  Dr. García             │
│ 💰  Bs. 5000.00            │
│ ▓▓▓▓▓▓▓▓░░░░░░░░  65%    │  <- Barra de progreso
└────────────────────────────┘
```

### 4. Facturas Pendientes
```
┌────────────────────────────┐
│ 💰  FACT-0001             │
│ 📅  2024-03-01             │
│ Total: Bs. 500.00          │
│ Saldo: Bs. 250.00          │  <- Texto rojo
└────────────────────────────┘
```

### 5. Historial de Pagos
```
┌────────────────────────────┐
│ ✅  Bs. 250.00            │
│ 📅  2024-03-10             │
│ 💳  Efectivo               │
│ 📄  FACT-0001              │
└────────────────────────────┘
```

### 6. Historial Clínico
```
┌────────────────────────────┐
│ 📄  Consulta              │
│ 📅  2024-03-01             │
│ 🏥  Dr. García             │
│ Caries en pieza #16        │  <- Diagnóstico
└────────────────────────────┘
```

### 7. Cancelar Cita
```
┌────────────────────────────┐
│ 📅  2024-03-15 - 10:00    │
│ 🏥  Dr. García             │
│ 📝  Control                │
│ ┌────────────────────────┐ │
│ │ ❌ Cancelar esta cita  │ │  <- Botón rojo claro
│ └────────────────────────┘ │
└────────────────────────────┘
```

### 8. Lista de Comandos (Ayuda)
```
┌────────────────────────────┐  <- Fondo azul claro
│ Ver mis citas próximas     │  <- Borde azul izquierdo
│ Ejemplo: "Ver mis citas"   │
└────────────────────────────┘
┌────────────────────────────┐
│ Consultar saldo pendiente  │
│ Ejemplo: "Cuánto debo"     │
└────────────────────────────┘
```

---

## 🎬 Flujo de Interacción

### Flujo Típico:

1. **Usuario ve burbuja** 💬 en esquina inferior derecha
2. **Click en burbuja** → Se abre ventana con mensaje de bienvenida
3. **Usuario escribe** "Ver mis citas" → Enter o click en ✉️
4. **Aparece "escribiendo..."** → Dots animados
5. **Bot responde** con cards de citas + sugerencias
6. **Usuario clickea sugerencia** → Se envía automáticamente
7. **Bot responde nuevamente**
8. **Usuario cierra** → Click en X o burbuja desaparece

---

## 🎤 Flujo con Voz:

1. **Usuario click en 🎤** (verde)
2. **Botón cambia a rojo pulsante** + "Escuchando..."
3. **Usuario habla**: "Ver mis citas"
4. **Usuario click en 🎤 nuevamente** → Detiene grabación
5. **Mensaje se envía automáticamente** con badge 🎤
6. **Bot responde** igual que con texto

---

## 📱 Responsive Mobile

### Desktop
```
┌──────────────────────────┐
│                          │
│    Tu Aplicación      💬 │
│                          │
└──────────────────────────┘
```

### Mobile (Ventana abierta = Full Screen)
```
╔════════════════════════════╗
║ 🤖 Asistente    🗑️ ✕      ║
╠════════════════════════════╣
║                            ║
║  [Mensajes ocupan         ║
║   toda la pantalla]       ║
║                            ║
║                            ║
╠════════════════════════════╣
║ 🎤 [────────────] ✉️       ║
╚════════════════════════════╝
```

---

## 🎨 Paleta de Colores

```
Primario (Bot):     #667eea → #764ba2  (Gradiente purple)
Verde (Voz):        #10b981
Rojo (Grabando):    #ef4444
Azul (Sugerencias): #3b82f6
Fondo:              #f9fafb
Texto:              #374151
Error:              #fee2e2 (fondo) + #991b1b (texto)
Gris claro:         #e5e7eb
```

---

## ✨ Animaciones

1. **slideUp**: Ventana aparece desde abajo (300ms)
2. **fadeIn**: Mensajes aparecen con fade (300ms)
3. **typing**: Dots suben y bajan (1.4s loop)
4. **pulse**: Botón de voz pulsa (1.5s loop)
5. **hover**: Sugerencias saltan hacia arriba (-2px)

---

## 🔍 Cómo Probar

1. Abrir `http://localhost:5173/`
2. Login como paciente
3. Ver burbuja 💬 en esquina inferior derecha
4. Clickear para abrir
5. Escribir: "Ver mis citas"
6. Observar respuesta con cards
7. Clickear sugerencia
8. Probar voz: Click 🎤 → Hablar → Click 🎤
9. Limpiar historial con 🗑️
10. Cerrar con ✕

---

## 🎯 Comandos para Probar

| Comando | Respuesta Esperada |
|---------|-------------------|
| "Hola" | Saludo del bot |
| "Ver mis citas" | Lista de citas con cards |
| "Próxima cita" | Card destacado |
| "Mis tratamientos" | Tratamientos con progress |
| "Cuánto debo" | Facturas pendientes |
| "Ver mis pagos" | Historial de pagos |
| "Historial clínico" | Episodios clínicos |
| "Ayuda" | Lista de comandos |

---

**¡Disfruta tu nuevo asistente virtual! 🎉**
