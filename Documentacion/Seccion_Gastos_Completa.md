# Documentación Completa: Sección de Gastos

## 📋 Descripción General

La sección de Gastos es un módulo completo para el registro, control y gestión de todos los gastos operativos relacionados con el sistema de impresiones. Permite registrar gastos como compra de papel, tinta, mantenimiento de impresoras, reparaciones, suministros varios y otros gastos relacionados.

## 🎯 Objetivo del Sistema

Proporcionar una interfaz completa y funcional para:
- **Registrar gastos operativos** de forma estructurada por categorías
- **Filtrar y buscar** gastos por categoría y fecha
- **Visualizar resúmenes** de gastos por categorías principales
- **Editar y eliminar** registros de gastos
- **Paginación eficiente** para grandes volúmenes de datos
- **Diferenciación visual** mediante tema rojo para distinguirse de la sección de Impresiones

---

## 🏗️ Arquitectura del Sistema

### Estructura de Componentes

```
src/Pages/Gastos/
├── GastosPage.jsx          # Componente principal que orquesta todos los componentes
├── GastosHeader.jsx        # Encabezado con título y botón "Nuevo Gasto"
├── ResumenGastos.jsx       # Tarjetas de resumen con totales por categoría
├── FiltroBusquedaGastos.jsx # Filtros de búsqueda por categoría y fecha
├── TablaGastos.jsx          # Tabla principal con listado de gastos
├── FormAddGasto.jsx        # Formulario modal para agregar/editar gastos
└── DeleteDialogGastos.jsx  # Diálogo de confirmación para eliminar
```

### Flujo de Datos

```
GastosProvider (Contexto Global)
    ↓
Proporciona estado y funciones CRUD
    ↓
GastosPage recibe contexto
    ↓
    ├── GastosHeader → Abre FormAddGasto
    ├── ResumenGastos → Calcula totales desde gastos[]
    ├── FiltroBusquedaGastos → Modifica filtros → trigger useEffect
    └── TablaGastos → Muestra datos filtrados + acciones CRUD
```

---

## 🔧 Contexto Global: GastosContext

### Ubicación
`src/Context/GastosContext.jsx`

### Propósito
Centraliza toda la lógica de negocio, estado de datos, filtros y operaciones CRUD para la sección de gastos.

### Estado Global Expuesto

#### Estado de Datos
```javascript
gastos          // Array con todos los gastos filtrados
loading         // Boolean - estado de carga
error           // String - mensaje de error
```

#### Operaciones CRUD
```javascript
addGasto(record)        // Crea nuevo gasto
editGasto(id, record)    // Actualiza gasto existente
deleteGasto(id)         // Elimina gasto
fetchGastos()           // Recarga datos manualmente
```

#### Control de Filtros
```javascript
filtroCategoria         // "all" | "papel" | "tinta" | "mantenimiento" | etc.
setFiltroCategoria      // Función para cambiar filtro de categoría
filtroFecha            // Objeto dayjs o null
setFiltroFecha         // Función para cambiar fecha
filtroCantidad         // 5 | 10 | 20 | 50 (registros por página)
setFiltroCantidad      // Función para cambiar cantidad
```

#### Control de Paginación
```javascript
paginaActual      // Número de página actual
setPaginaActual   // Función para cambiar página
totalPaginas      // Total de páginas calculado
```

### Funciones Principales

#### 1. fetchGastos()
Función asíncrona que obtiene los gastos desde Supabase aplicando filtros y paginación.

**Flujo de ejecución:**
1. Activa estado de carga (`setLoading(true)`)
2. Limpia errores previos
3. Cuenta registros totales con filtros aplicados
4. Calcula total de páginas
5. Determina rango de paginación (desde/hasta)
6. Ejecuta consulta con filtros:
   - Filtro por categoría (si no es "all")
   - Filtro por fecha (día específico o mes completo)
7. Ordena por fecha descendente (más recientes primero)
8. Aplica paginación con `.range()`
9. Actualiza estado con datos obtenidos
10. Maneja errores y desactiva loading

**Ejemplo de consulta filtrada:**
```javascript
// Filtro por categoría y mes completo
supabase
  .from("gastos")
  .select("*")
  .eq("categoria", "papel")
  .gte("fecha", "2024-01-01")
  .lte("fecha", "2024-01-31")
  .order("fecha", { ascending: false })
  .range(0, 4)  // Primera página, 5 registros
```

#### 2. addGasto(newRecord)
Crea un nuevo registro de gasto en Supabase.

**Parámetros:**
```javascript
{
  categoria: "papel" | "tinta" | "mantenimiento" | "reparacion" | "suministros" | "otros",
  descripcion: string,
  monto: number,
  fecha: string (YYYY-MM-DD)
}
```

**Proceso:**
1. Inserta registro en tabla `gastos`
2. Si hay error, lo captura y muestra mensaje
3. Refresca lista automáticamente con `fetchGastos()`

#### 3. editGasto(id, updatedRecord)
Actualiza un gasto existente.

**Proceso:**
1. Actualiza registro con ID específico
2. Refresca lista automáticamente
3. Maneja errores específicos

#### 4. deleteGasto(id)
Elimina un gasto de la base de datos.

**Proceso:**
1. Elimina registro por ID
2. Refresca lista automáticamente
3. Maneja errores

### Integración en la Aplicación

El `GastosProvider` se integra en `MainLayout.jsx`:

```javascript
<NoteProvider>
  <GastosProvider>
    <Navbar navlinks={NavLinks}/>
    <Container>
      <Outlet /> 
    </Container>
  </GastosProvider>
</NoteProvider>
```

Esto permite que todos los componentes hijos tengan acceso al contexto de gastos.

---

## 📄 Componentes Individuales

### 1. GastosPage.jsx

**Ubicación:** `src/Pages/Gastos/GastosPage.jsx`

**Propósito:** Componente principal que orquesta y renderiza todos los componentes de la sección en orden.

**Estructura:**
```javascript
<>
  <GastosHeader/>          // Título y botón "Nuevo Gasto"
  <ResumenGastos/>         // Tarjetas de resumen
  <FiltroBusquedaGastos/>  // Filtros de búsqueda
  <TablaGastos/>           // Tabla principal
</>
```

**Ruta:** `/bills` (definida en `App.jsx`)

---

### 2. GastosHeader.jsx

**Ubicación:** `src/Pages/Gastos/GastosHeader.jsx`

**Propósito:** Encabezado de la sección con título, descripción y botón para agregar nuevo gasto.

**Características:**
- **Título:** "Control de Gastos" (Typography h4)
- **Descripción:** "Registra y controla todos los gastos operativos"
- **Botón "Nuevo Gasto":** 
  - Color: `error` (rojo) para diferenciación visual
  - Icono: `AddIcon`
  - Tamaño: `large`
  - Acción: Abre modal `FormAddGasto`

**Estado Local:**
```javascript
const [open, setOpen] = useState(false);
```

**Funciones:**
- `handleClickOpen()`: Abre modal de nuevo gasto
- `handleClose()`: Cierra modal

**Layout:**
- Grid responsive: 8 columnas título, 4 columnas botón (sm breakpoint)
- En móvil: título y botón en columnas completas

---

### 3. ResumenGastos.jsx

**Ubicación:** `src/Pages/Gastos/ResumenGastos.jsx`

**Propósito:** Muestra tarjetas de resumen con totales gastados por categorías principales en el mes actual.

**Categorías mostradas:**
1. **Papel** - Total gastado en papel
2. **Tinta** - Total gastado en tinta
3. **Mantenimiento** - Total gastado en mantenimiento

**Cálculo de Totales:**
```javascript
// Obtiene gastos del contexto
const { gastos } = useContext(GastosContext);

// Filtra gastos del mes actual
const ahora = dayjs();
const primerDiaMes = ahora.startOf("month").format("YYYY-MM-DD");
const ultimoDiaMes = ahora.endOf("month").format("YYYY-MM-DD");

const gastosMesActual = gastos.filter((gasto) => {
  return fechaGasto >= primerDiaMes && fechaGasto <= ultimoDiaMes;
});

// Calcula total por categoría
const totalPapel = gastosMesActual
  .filter((g) => g.categoria === "papel")
  .reduce((acc, g) => acc + Number(g.monto || 0), 0);
```

**Diseño:**
- Grid de 3 columnas (responsive: 1 columna en móvil)
- Tarjetas con componente `CardDetail`
- Iconos y precios en color rojo (`error.main`)
- Formato de precio: `S/XX.XX`

**Características Visuales:**
- **Tema rojo:** Todos los iconos y precios usan `color="error.main"`
- **Iconos:** DescriptionIcon, PaletteIcon, BuildIcon
- **Actualización automática:** Se recalcula cuando cambian los gastos

---

### 4. FiltroBusquedaGastos.jsx

**Ubicación:** `src/Pages/Gastos/FiltroBusquedaGastos.jsx`

**Propósito:** Permite filtrar gastos por categoría y fecha con sistema inteligente de filtrado.

#### Filtro por Categoría

**Opciones disponibles:**
```javascript
const CATEGORIAS = [
  { value: "all", label: "Todas" },
  { value: "papel", label: "Papel" },
  { value: "tinta", label: "Tinta" },
  { value: "mantenimiento", label: "Mantenimiento" },
  { value: "reparacion", label: "Reparación" },
  { value: "suministros", label: "Suministros" },
  { value: "otros", label: "Otros" },
];
```

**Implementación:**
- Select de Material UI
- Tamaño: `small`
- Valor controlado por `filtroCategoria` del contexto
- Al cambiar, actualiza contexto y dispara `fetchGastos()`

#### Filtro por Fecha

**Características:**
- DatePicker de MUI X con dayjs
- Formato visual: `DD/MM/YYYY`
- Vistas: año, mes, día
- Bloquea fechas futuras (`disableFuture`)
- Abre por defecto en vista de día

**Sistema de Filtrado Inteligente:**

El filtro funciona de dos formas según la selección:

1. **Filtro por día específico:**
   - Si el usuario selecciona año, mes Y día
   - Query: `fecha = 'YYYY-MM-DD'`
   - Muestra solo gastos de ese día

2. **Filtro por mes completo:**
   - Si el usuario selecciona solo año y mes (sin día)
   - Query: `fecha >= 'YYYY-MM-01' AND fecha <= 'YYYY-MM-31'`
   - Muestra todos los gastos del mes

**Lógica de detección:**
```javascript
const day = filtroFecha.date();
if (day && day > 0) {
  // Filtro por día específico
  query = query.eq("fecha", filtroFecha.format("YYYY-MM-DD"));
} else {
  // Filtro por mes completo
  const firstDay = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = filtroFecha.endOf("month").format("YYYY-MM-DD");
  query = query.gte("fecha", firstDay).lte("fecha", lastDay);
}
```

#### Botón de Reset

**Ubicación:** Aparece junto al DatePicker cuando hay una fecha seleccionada

**Características:**
- Solo visible cuando `filtroFecha !== null`
- Texto: "Todos"
- Icono: `ClearIcon`
- Color: `error` (rojo, consistente con tema)
- Variante: `outlined`
- Acción: Resetea fecha a `null` (muestra todos los días)

**Implementación:**
```javascript
{filtroFecha && (
  <Button
    size="small"
    variant="outlined"
    color="error"
    startIcon={<ClearIcon />}
    onClick={() => setFiltroFecha(null)}
    sx={{
      minWidth: "auto",
      whiteSpace: "nowrap",
      height: "40px",
    }}
  >
    Todos
  </Button>
)}
```

**Layout:**
- Grid de 2 columnas (responsive: 1 columna en móvil)
- Filtro de categoría y fecha lado a lado en desktop
- Paper con fondo `#fafafa` para diferenciación visual

---

### 5. TablaGastos.jsx

**Ubicación:** `src/Pages/Gastos/TablaGastos.jsx`

**Propósito:** Muestra el listado completo de gastos con funcionalidades de edición, eliminación y paginación.

#### Estructura de la Tabla

**Columnas:**
1. **#** - ID del gasto
2. **Categoría** - Chip de color según categoría
3. **Descripción** - Descripción del gasto
4. **Monto** - Monto en formato `S/XX.XX`
5. **Fecha** - Fecha del gasto
6. **Acciones** - Botones de editar y eliminar

#### Encabezado de Tabla

**Diseño con tema rojo:**
```javascript
<TableRow sx={{ backgroundColor: "#ffebee" }}>  // Fondo rojo claro
  <TableCell sx={{ fontWeight: 600 }}>...</TableCell>
</TableRow>
```

#### Chips de Categoría

**Mapeo de colores:**
```javascript
const CATEGORIAS_COLORS = {
  papel: "primary",
  tinta: "secondary",
  mantenimiento: "warning",
  reparacion: "error",
  suministros: "info",
  otros: "default",
};
```

**Implementación:**
```javascript
<Chip
  label={CATEGORIAS_LABELS[row.categoria]}
  color={CATEGORIAS_COLORS[row.categoria]}
  size="small"
/>
```

#### Botones de Acción

**Editar:**
- Icono: `EditIcon`
- Color: `error` (rojo)
- Acción: Abre `FormAddGasto` en modo edición con datos del registro

**Eliminar:**
- Icono: `DeleteForeverIcon`
- Color: `error` (rojo)
- Acción: Abre `DeleteDialogGastos` para confirmación

#### Estados de la Tabla

**Loading:**
```javascript
{loading && (
  <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
    <CircularProgress />
  </Box>
)}
```

**Error:**
```javascript
{!loading && error && (
  <Box sx={{ p: 4, textAlign: "center" }}>
    <Typography variant="h6" color="error">
      {error}
    </Typography>
  </Box>
)}
```

**Sin datos:**
```javascript
{gastos.length === 0 && (
  <Typography variant="h6" color="text.secondary">
    No hay datos para mostrar
  </Typography>
)}
```

#### Paginación

**Características:**
- Componente `Pagination` de Material UI
- Color: `error` (rojo)
- Muestra: "Mostrando X–Y de Z registros"
- Selector de cantidad: 5, 10, 20, 50 registros por página
- Al cambiar cantidad, resetea a página 1

**Implementación:**
```javascript
<Pagination
  count={totalPaginas}
  page={paginaActual}
  onChange={(_, value) => setPaginaActual(value)}
  color="error"
/>

<FormControl size="small" fullWidth>
  <InputLabel>Cantidad</InputLabel>
  <Select
    value={filtroCantidad}
    onChange={(e) => {
      setPaginaActual(1);
      setFiltroCantidad(e.target.value);
    }}
  >
    <MenuItem value={5}>5</MenuItem>
    <MenuItem value={10}>10</MenuItem>
    <MenuItem value={20}>20</MenuItem>
    <MenuItem value={50}>50</MenuItem>
  </Select>
</FormControl>
```

#### Contenedor

**Diseño con tema rojo:**
```javascript
<Paper 
  sx={{ 
    mb: 4, 
    p: 2, 
    borderRadius: 2, 
    border: "1px solid #ffcdd2"  // Borde rojo claro
  }}
>
  <Typography 
    variant="h6" 
    sx={{ 
      mb: 2, 
      fontWeight: 600, 
      color: "error.main"  // Título en rojo
    }}
  >
    Listado de Gastos
  </Typography>
</Paper>
```

---

### 6. FormAddGasto.jsx

**Ubicación:** `src/Pages/Gastos/FormAddGasto.jsx`

**Propósito:** Formulario modal para agregar nuevos gastos o editar gastos existentes.

#### Modos de Operación

**Modo "add":**
- Título: "Nuevo Gasto"
- Descripción: "Completa los datos para registrar un nuevo gasto."
- Botón: "Guardar"

**Modo "edit":**
- Título: "Editar Gasto"
- Descripción: "Modifica la información del gasto seleccionado."
- Botón: "Actualizar"
- Carga datos iniciales del registro seleccionado

#### Campos del Formulario

**1. Categoría:**
- Tipo: Select
- Opciones: Papel, Tinta, Mantenimiento, Reparación, Suministros, Otros
- Valor por defecto: "papel"
- Requerido: Sí

**2. Fecha:**
- Tipo: TextField tipo date
- Valor por defecto: Fecha actual
- Formato: YYYY-MM-DD
- Requerido: Sí

**3. Descripción:**
- Tipo: TextField multiline
- Filas: 3
- Placeholder: "Ej: Compra de papel A4, Mantenimiento preventivo, etc."
- Requerido: No (pero recomendado)

**4. Monto:**
- Tipo: TextField tipo number
- Valor por defecto: 0
- Mínimo: 0
- Paso: 0.01 (permite decimales)
- Formato: S/XX.XX
- Requerido: Sí

#### Estructura de Datos

**Formato de datos:**
```javascript
{
  categoria: string,
  descripcion: string,
  monto: number,
  fecha: string (YYYY-MM-DD)
}
```

**Valores por defecto:**
```javascript
const DEFAULT_FORM = {
  categoria: "papel",
  descripcion: "",
  monto: 0,
  fecha: new Date().toISOString().slice(0, 10),
};
```

#### Carga de Datos (Modo Editar)

**useEffect que carga datos iniciales:**
```javascript
useEffect(() => {
  if (open) {
    if (initialData) {
      setFormData({
        categoria: initialData.categoria || "papel",
        descripcion: initialData.descripcion || "",
        monto: initialData.monto || 0,
        fecha: initialData.fecha || new Date().toISOString().slice(0, 10),
      });
    } else {
      setFormData(DEFAULT_FORM);
    }
  }
}, [open, initialData]);
```

#### Manejo de Cambios

**Función genérica:**
```javascript
const handleChange = (field) => (e) => {
  const value = field === "monto" 
    ? Number(e.target.value) || 0 
    : e.target.value;
  setFormData({ ...formData, [field]: value });
};
```

#### Guardado Optimizado

**Cierre instantáneo + guardado en background:**
```javascript
const handleSave = async () => {
  handleClose(); // Cierra modal al instante
  
  setTimeout(async () => {
    try {
      if (mode === "add") {
        await addGasto(formData);
      } else {
        await editGasto(initialData.id, formData);
      }
    } catch (err) {
      console.error("❌ Error en guardado:", err);
    } 
  }, 0);
};
```

**Ventajas:**
- Usuario ve respuesta instantánea
- Operación asíncrona no bloquea UI
- Mejor experiencia de usuario

#### Alert de Total

**Muestra total calculado:**
```javascript
const total = formData.monto || 0;

<Alert severity="info">
  <Typography variant="body2">
    Total: <strong>S/{total.toFixed(2)}</strong>
  </Typography>
</Alert>
```

#### Diseño

**Dialog:**
- Ancho máximo: `md` (medium)
- Mantiene montado: `keepMounted`
- Tema rojo: Botón "Guardar/Actualizar" con `color="error"`

**Layout:**
- Grid responsive
- Campos en 2 columnas (categoría y fecha)
- Descripción y monto en columna completa

---

### 7. DeleteDialogGastos.jsx

**Ubicación:** `src/Pages/Gastos/DeleteDialogGastos.jsx`

**Propósito:** Diálogo de confirmación para eliminar un gasto.

#### Características

**Título:** "Confirmar eliminación"

**Mensaje:**
```
¿Estás seguro de que deseas eliminar este gasto? 
Esta acción no se puede deshacer.
```

**Botones:**
- **Cancelar:** Variante `contained`, color `inherit` (gris)
- **Eliminar:** Variante `contained`, color `error` (rojo), `autoFocus`

#### Funcionalidad

**Proceso de eliminación:**
```javascript
const handleDelete = () => {
  deleteGasto(idDelete);  // Llama función del contexto
  handleClose();          // Cierra diálogo
};
```

**Gestión de ID:**
```javascript
useEffect(() => {
  setIdDelete(id);
}, [id]);
```

#### Diseño

- Ancho máximo: `xs` (extra small)
- Full width en contenedor
- Botón de eliminar en rojo para indicar acción destructiva

---

## 🎨 Sistema de Diseño y Tema

### Tema Rojo para Diferenciación

La sección de Gastos utiliza consistentemente el color rojo (`error` en Material UI) para diferenciarse visualmente de la sección de Impresiones (que usa azul/primary).

#### Elementos con Tema Rojo

1. **Botón "Nuevo Gasto"** - `color="error"`
2. **Botones de acción en tabla** - Editar y Eliminar con `color="error"`
3. **Paginación** - `color="error"`
4. **Botón "Guardar/Actualizar"** - `color="error"`
5. **Botón "Todos" en filtro** - `color="error"`
6. **Título de tabla** - `color="error.main"`
7. **Borde del Paper** - `border: "1px solid #ffcdd2"`
8. **Encabezado de tabla** - `backgroundColor: "#ffebee"`
9. **Iconos en ResumenGastos** - `sx={{ color: "error.main" }}`
10. **Precios en ResumenGastos** - `priceColor="error.main"`

#### Paleta de Colores

- **Rojo principal:** `error.main` (Material UI)
- **Rojo claro fondo:** `#ffebee`
- **Rojo claro borde:** `#ffcdd2`

### Responsive Design

Todos los componentes son completamente responsive:

- **Móvil (xs):** 1 columna, elementos apilados
- **Tablet (sm):** 2 columnas en algunos layouts
- **Desktop (md+):** Distribución completa en múltiples columnas

---

## 📊 Estructura de Datos

### Tabla Supabase: `gastos`

**Esquema esperado:**
```sql
CREATE TABLE gastos (
  id SERIAL PRIMARY KEY,
  categoria VARCHAR(50) NOT NULL,
  descripcion TEXT,
  monto DECIMAL(10, 2) NOT NULL,
  fecha DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Categorías válidas:**
- `papel`
- `tinta`
- `mantenimiento`
- `reparacion`
- `suministros`
- `otros`

### Formato de Objeto Gasto

```javascript
{
  id: number,
  categoria: string,
  descripcion: string,
  monto: number,
  fecha: string (YYYY-MM-DD)
}
```

**Ejemplo:**
```javascript
{
  id: 1,
  categoria: "papel",
  descripcion: "Compra de papel A4 500 hojas",
  monto: 25.50,
  fecha: "2024-01-15"
}
```

---

## 🔄 Flujos de Usuario

### Flujo 1: Agregar Nuevo Gasto

```
1. Usuario hace clic en "Nuevo Gasto"
   ↓
2. Se abre FormAddGasto en modo "add"
   ↓
3. Usuario completa formulario:
   - Selecciona categoría
   - Ingresa descripción
   - Ingresa monto
   - Selecciona/confirma fecha
   ↓
4. Usuario hace clic en "Guardar"
   ↓
5. Modal se cierra instantáneamente
   ↓
6. addGasto() se ejecuta en background
   ↓
7. fetchGastos() se ejecuta automáticamente
   ↓
8. Tabla se actualiza con nuevo registro
   ↓
9. ResumenGastos recalcula totales
```

### Flujo 2: Editar Gasto Existente

```
1. Usuario hace clic en icono de editar en tabla
   ↓
2. Se abre FormAddGasto en modo "edit"
   ↓
3. Formulario se carga con datos del registro
   ↓
4. Usuario modifica campos deseados
   ↓
5. Usuario hace clic en "Actualizar"
   ↓
6. Modal se cierra instantáneamente
   ↓
7. editGasto() se ejecuta en background
   ↓
8. fetchGastos() se ejecuta automáticamente
   ↓
9. Tabla se actualiza con cambios
```

### Flujo 3: Eliminar Gasto

```
1. Usuario hace clic en icono de eliminar en tabla
   ↓
2. Se abre DeleteDialogGastos
   ↓
3. Usuario confirma eliminación
   ↓
4. deleteGasto() se ejecuta
   ↓
5. fetchGastos() se ejecuta automáticamente
   ↓
6. Tabla se actualiza sin el registro eliminado
   ↓
7. ResumenGastos recalcula totales
```

### Flujo 4: Filtrar Gastos

```
1. Usuario selecciona categoría en filtro
   ↓
2. setFiltroCategoria() actualiza contexto
   ↓
3. useEffect detecta cambio
   ↓
4. fetchGastos() se ejecuta con nuevo filtro
   ↓
5. Tabla muestra solo gastos de esa categoría
```

```
1. Usuario selecciona fecha en DatePicker
   ↓
2. setFiltroFecha() actualiza contexto
   ↓
3. Aparece botón "Todos" para resetear
   ↓
4. useEffect detecta cambio
   ↓
5. fetchGastos() detecta si es día o mes
   ↓
6. Tabla muestra gastos filtrados por fecha
```

---

## 🚀 Optimizaciones Implementadas

### 1. Guardado en Background

El formulario cierra instantáneamente y ejecuta la operación CRUD en background para mejor UX.

### 2. Paginación Eficiente

Solo carga los registros necesarios según la página actual, no todos los registros.

### 3. Filtros Inteligentes

El sistema detecta automáticamente si el usuario quiere filtrar por día específico o mes completo.

### 4. Cálculo de Totales Optimizado

`ResumenGastos` calcula totales del mes actual de forma eficiente usando `filter` y `reduce`.

### 5. Actualización Automática

Después de cualquier operación CRUD, la lista se actualiza automáticamente sin necesidad de refrescar manualmente.

---

## 📝 Casos de Uso Prácticos

### Caso 1: Registrar Compra de Papel

```
1. Usuario hace clic en "Nuevo Gasto"
2. Selecciona categoría: "Papel"
3. Descripción: "Compra de papel A4 500 hojas"
4. Monto: 25.50
5. Fecha: (automática - hoy)
6. Guardar
```

### Caso 2: Ver Gastos de Mantenimiento del Mes

```
1. Usuario selecciona categoría: "Mantenimiento"
2. Usuario selecciona fecha: Solo año y mes (sin día)
3. Sistema muestra todos los gastos de mantenimiento del mes
```

### Caso 3: Buscar Gasto Específico de un Día

```
1. Usuario selecciona fecha: Año, mes Y día
2. Sistema muestra solo gastos de ese día específico
```

### Caso 4: Ver Resumen de Gastos del Mes

```
1. Usuario ingresa a sección Gastos
2. ResumenGastos muestra automáticamente:
   - Total en Papel del mes actual
   - Total en Tinta del mes actual
   - Total en Mantenimiento del mes actual
```

### Caso 5: Resetear Filtro de Fecha

```
1. Usuario tiene fecha seleccionada
2. Aparece botón "Todos" junto al DatePicker
3. Usuario hace clic en "Todos"
4. Filtro se resetea, muestra todos los días
```

---

## 🔍 Integración con Supabase

### Configuración Requerida

1. **Tabla `gastos`** debe existir en Supabase
2. **Políticas RLS (Row Level Security)** configuradas según necesidades
3. **Columnas:** id, categoria, descripcion, monto, fecha

### Consultas Optimizadas

Todas las consultas usan:
- `.order()` para ordenamiento
- `.range()` para paginación
- `.eq()`, `.gte()`, `.lte()` para filtros
- `.select()` con campos específicos

---

## 📚 Dependencias

### Librerías Utilizadas

- **@mui/material:** Componentes de UI
- **@mui/icons-material:** Iconos
- **@mui/x-date-pickers:** DatePicker
- **dayjs:** Manipulación de fechas
- **@supabase/supabase-js:** Cliente de Supabase
- **react:** Framework base

### Hooks Utilizados

- `useState`: Estado local en componentes
- `useEffect`: Efectos secundarios y sincronización
- `useContext`: Acceso al contexto global

---

## ✅ Checklist de Funcionalidades

- [x] CRUD completo (Crear, Leer, Actualizar, Eliminar)
- [x] Filtros por categoría
- [x] Filtros por fecha (día específico y mes completo)
- [x] Botón de reset para filtro de fecha
- [x] Paginación configurable
- [x] Resumen de gastos por categoría
- [x] Cálculo automático de totales del mes
- [x] Diseño responsive
- [x] Tema rojo para diferenciación
- [x] Validación de formularios
- [x] Manejo de errores
- [x] Estados de carga
- [x] Actualización automática después de CRUD
- [x] Confirmación antes de eliminar

---

## 🎯 Características Destacadas

1. **Sistema de Filtros Inteligente:** Detecta automáticamente si filtrar por día o mes
2. **Tema Visual Diferenciado:** Tema rojo consistente en toda la sección
3. **UX Optimizada:** Cierre instantáneo de modales con guardado en background
4. **Resumen Automático:** Cálculo y visualización de totales por categoría
5. **Paginación Eficiente:** Solo carga registros necesarios
6. **Responsive Completo:** Funciona perfectamente en todos los dispositivos
7. **Arquitectura Escalable:** Context API centralizado facilita mantenimiento

---

## 📖 Conclusión

La sección de Gastos es un módulo completo, funcional y bien estructurado que permite gestionar eficientemente todos los gastos operativos del sistema. Con su tema rojo distintivo, filtros inteligentes, y arquitectura escalable, proporciona una experiencia de usuario excelente mientras mantiene código limpio y mantenible.

