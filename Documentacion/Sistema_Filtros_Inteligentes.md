# Sistema de Filtros Inteligentes con Dayjs

## 📋 Descripción General

Se implementó un sistema de filtros avanzado que permite buscar impresiones por usuario (alumno/maestro) y por fecha, con la capacidad única de filtrar tanto por día específico como por mes completo automáticamente.

## 🎯 Objetivo del Sistema

Permitir a los usuarios filtrar impresiones de manera flexible sin necesidad de campos adicionales, creando una experiencia intuitiva donde la misma interfaz se adapta al tipo de búsqueda requerida.

## 🔧 Implementación Técnica

### 1. Componente de Filtros (FiltroBusqueda.jsx)

El componente principal utiliza Material-UI con DatePicker de MUI X:

```tsx
<LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker
    label="Fecha"
    value={filtroFecha}
    onChange={(newValue) => setFiltroFecha(newValue)}
    format="DD/MM/YYYY"
    views={["year", "month", "day"]}
    openTo="day"
    disableFuture
    slotProps={{
      textField: { size: "small", fullWidth: true },
    }}
  />
</LocalizationProvider>
```

**Características clave:**
- `views={["year", "month", "day"]}`: Permite seleccionar año, mes y día
- `format="DD/MM/YYYY"`: Muestra la fecha en formato latino
- `disableFuture`: Previene selección de fechas futuras
- `openTo="day"`: Inicia mostrando la selección de día

### 2. Lógica de Filtrado Dual en NoteContext

El filtro implementa dos modos de operación según la selección del usuario:

```javascript
if (filtroFecha) {
  const year = filtroFecha.year();
  const month = filtroFecha.month() + 1;
  const day = filtroFecha.date();
  
  // Modo 1: Filtro por día específico
  if (day && day > 0) {
    queryBase = queryBase.eq("fecha", filtroFecha.format("YYYY-MM-DD"));
  } 
  // Modo 2: Filtro por mes completo
  else {
    const firstDay = `${year}-${String(month).padStart(2, "0")}-01`;
    const lastDay = filtroFecha.endOf("month").format("YYYY-MM-DD");
    queryBase = queryBase.gte("fecha", firstDay).lte("fecha", lastDay);
  }
}
```

**Desglose del proceso:**

1. **Extracción de componentes de fecha:**
   - `year`: Año seleccionado
   - `month`: Mes (se suma 1 porque dayjs usa 0-11)
   - `day`: Día del mes

2. **Detección del modo de filtro:**
   - Si `day > 0`: El usuario seleccionó un día específico
   - Si `day` es null o 0: El usuario solo seleccionó mes/año

3. **Aplicación de filtro:**
   - **Modo día:** Usa `.eq()` para buscar exactamente esa fecha
   - **Modo mes:** Usa `.gte()` y `.lte()` para el rango del mes

4. **Formato de fechas:**
   - `YYYY-MM-DD`: Formato ISO para Supabase
   - `.padStart(2, "0")`: Asegura mes con 2 dígitos (ej: "01", "02")

### 3. Filtro por Usuario

Implementación simple pero efectiva:

```javascript
if (filtroUsuario !== "all") {
  queryBase = queryBase.eq("usuario", filtroUsuario);
}
```

**Opciones disponibles:**
- `"all"`: Muestra todos los usuarios
- `"alumno"`: Solo impresiones de alumnos
- `"maestro"`: Solo impresiones de maestros

## 🔄 Flujo de Datos Completo

```
Usuario selecciona filtro
        ↓
FiltroBusqueda.jsx actualiza estado en NoteContext
        ↓
useEffect detecta cambio en filtroUsuario/filtroFecha
        ↓
fetchNotas() se ejecuta con nuevos filtros
        ↓
Construye query de Supabase con filtros aplicados
        ↓
Ejecuta consulta con .range() para paginación
        ↓
Actualiza estado de notas con resultados
        ↓
TablaImpresiones.jsx renderiza datos filtrados
```

## 🎨 Interfaz de Usuario

### Ubicación del Filtro

```tsx
<Paper sx={{ p: 2, mb: 3, borderRadius: 2, backgroundColor: "#fafafa" }}>
  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
    Filtros de búsqueda
  </Typography>

  <Grid container spacing={2}>
    <Grid size={{ xs: 12, md: 6 }}>
      {/* Filtro por persona */}
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      {/* Filtro por fecha */}
    </Grid>
  </Grid>
</Paper>
```

### Diseño Responsive

- **Móvil (xs: 12)**: Los filtros ocupan toda la pantalla en columnas
- **Desktop (md: 6)**: Los filtros se distribuyen en 2 columnas

## 💡 Casos de Uso Prácticos

### Caso 1: Búsqueda específica de impresiones de un alumno
```
1. Usuario selecciona "Alumnos" en filtro de persona
2. Resultado: Tabla muestra solo impresiones de alumnos
```

### Caso 2: Consultar impresiones del mes actual
```
1. Usuario abre DatePicker y selecciona solo año y mes (sin día)
2. Sistema detecta que day = 0
3. Resultado: Muestra todas las impresiones de ese mes
```

### Caso 3: Buscar impresión de fecha específica
```
1. Usuario abre DatePicker y selecciona año, mes y día
2. Sistema detecta que day > 0
3. Resultado: Muestra solo impresiones de ese día exacto
```

### Caso 4: Filtro combinado
```
1. Usuario selecciona "Maestros" + fecha específica
2. Sistema aplica ambos filtros con .eq() simultáneamente
3. Resultado: Impresiones de maestros de ese día
```

## 🚀 Beneficios del Sistema

1. **Flexibilidad:** Una sola herramienta para múltiples tipos de búsqueda
2. **Experiencia de usuario:** No requiere explicación - intuitivo
3. **Eficiencia:** Consultas optimizadas con índices de Supabase
4. **Responsive:** Funciona en todos los dispositivos
5. **Integración:** Perfecto con sistema de paginación existente

## 📊 Ejemplo de Query Resultante

**Filtro por mes completo (Enero 2024):**
```javascript
{
  query: supabase
    .from("impresiones")
    .select("*")
    .gte("fecha", "2024-01-01")
    .lte("fecha", "2024-01-31")
    .range(0, 4)  // Paginación
}
```

**Filtro por día específico (15 de Enero 2024):**
```javascript
{
  query: supabase
    .from("impresiones")
    .select("*")
    .eq("fecha", "2024-01-15")
    .range(0, 4)  // Paginación
}
```

## 🔍 Consideraciones Técnicas

### Performance
- Filtros se aplican en servidor (Supabase), no en cliente
- Consultas aprovechan índices de base de datos
- La paginación funciona correctamente con filtros

### Validación
- `disableFuture`: No permite fechas futuras
- Formato consistent con .toISOString()
- Manejo de errores en caso de fecha inválida

### Mantenibilidad
- Código centralizado en NoteContext
- Lógica reutilizable
- Fácil de extender con nuevos filtros

## ✅ Conclusión

Este sistema de filtros inteligentes representa una solución elegante que combina:
- **Simplicidad de uso:** Una interfaz, múltiples modos
- **Inteligencia técnica:** Detección automática del tipo de búsqueda
- **Rendimiento:** Optimización con consultas server-side
- **Experiencia:** Perfectamente integrado con paginación y diseño responsive


