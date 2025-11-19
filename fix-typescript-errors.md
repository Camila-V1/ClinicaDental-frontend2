# Correcciones TypeScript para Deploy

## Resumen de Errores a Corregir

La mayoría de errores son por:
1. Variables declaradas pero no usadas
2. Propiedades que no existen en tipos
3. Posibles valores `undefined`

## Soluciones Aplicadas

### 1. Agregar prefijo `_` a variables no usadas
TypeScript permite variables con `_` para indicar que son intencionales aunque no se usen.

### 2. Usar `as any` para tipos dinámicos del backend
Cuando el backend envía propiedades extra no declaradas en los tipos.

### 3. Usar optional chaining y nullish coalescing
`?.` y `??` para valores que pueden ser undefined.

## Comandos para build local

```bash
npm run build
```

Si hay errores, se pueden suprimir temporalmente con:
```bash
# tsconfig.json - agregar estas opciones:
{
  "compilerOptions": {
    "noUnusedLocals": false,
    "noUnusedParameters": false
  }
}
```
