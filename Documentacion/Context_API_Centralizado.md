# Context API Centralizado para Gestión de Estado Global

## 📋 Descripción General

Se implementó una arquitectura de gestión de estado global usando React Context API, centralizando toda la lógica de negocio, estado de datos, filtros y operaciones CRUD en un único provider llamado `NoteContext`. Esta implementación elimina la "prop drilling" y facilita el mantenimiento del código.

## 🎯 Objetivo del Sistema

Crear una solución centralizada que:
- Elimine la necesidad de pasar props manualmente a través de múltiples componentes
- Gestione el estado de la aplicación de forma consistente
- Permita acceso global a datos y funciones desde cualquier componente
- Optimice las consultas a Supabase con filtros y paginación integrados

## 🏗️ Arquitectura del Sistema

### 1. Creación del Context y Provider

```javascript
export const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  // Estado local del provider
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtros globales
  const [filtroUsuario, setFiltroUsuario] = useState("all");
  const [filtroFecha, setFiltroFecha] = useState(null);
  const [filtroCantidad, setFiltroCantidad] = useState(5);
  
  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  
  // ... lógica del provider
  
  return (
    <NoteContext.Provider value={{ /* valores expuestos */ }}>
      {children}
    </NoteContext.Provider>
  );
};
```

**Características clave:**
- `createContext()`: Crea el contexto reutilizable
- Estado local: Todos los datos viven dentro del provider
- `children`: Renderiza los componentes hijos con acceso al contexto

### 2. Integración en la Aplicación

El provider envuelve toda la aplicación en `MainLayout.jsx`:

```javascript
export default function MainLayout() {
  return (
    <>
      <NoteProvider>
        <Navbar navlinks={NavLinks}/>
        <Container sx={{ mt: 2}}>
          <Outlet /> 
        </Container>
      </NoteProvider>
    </>
  );
}
```

**Ventajas de esta ubicación:**
- Todos los componentes hijos tienen acceso al contexto
- No importa cuán anidado esté un componente, puede acceder a los datos
- Evita prop drilling completamente

## 🔄 Flujo de Datos Completo

```
NoteProvider (estado global)
    ↓
proporciona contexto
    ↓
MainLayout obtiene datos/funciones via useContext
    ↓
ImpresionesPage obtiene datos/funciones via useContext
    ↓
TablaImpresiones obtiene datos/funciones via useContext
    ↓
FiltroBusqueda modifica filtros → trigger useEffect → fetchNotas()
    ↓
Backend (Supabase) ejecuta consulta filtrada
    ↓
Notas se actualizan en estado global
    ↓
Todos los componentes que usan notas se re-renderizan automáticamente
```

## 📊 Estado Global Expuesto

El contexto proporciona 17 valores y funciones:

### Estado de Datos
```javascript
notas          // Array con todas las impresiones
loading        // Boolean - estado de carga
error          // String - mensaje de error
```

### Operaciones CRUD
```javascript
addImpresion(record)      // Crea nueva impresión
editImpresion(id, record) // Actualiza impresión existente
deleteImpresion(id)       // Elimina impresión
fetchNotas()              // Recarga datos manualmente
```

### Control de Filtros
```javascript
filtroUsuario         // "all" | "alumno" | "maestro"
setFiltroUsuario      // Función para cambiar filtro
filtroFecha          // Objeto dayjs o null
setFiltroFecha       // Función para cambiar fecha
filtroCantidad       // 5 | 10 | 20 | 50
setFiltroCantidad    // Función para cambiar cantidad
```

### Control de Paginación
```javascript
paginaActual      // Número de página actual
setPaginaActual   // Función para cambiar página
totalPaginas      // Total de páginas calculado
```

## 🔧 Implementación Técnica Detallada

### 1. Función Principal: fetchNotas()

Esta función es el corazón del sistema, maneja:
- Consultas a Supabase con filtros aplicados
- Paginación eficiente con `.range()`
- Cálculo automático de total de páginas
- Manejo de errores

```javascript
const fetchNotas = async () => {
  setLoading(true);
  setError(null);

  try {
    // PASO 1: Contar total de registros con filtros
    let queryBase = supabase.from("impresiones").select("id", { count: "exact" });
    
    if (filtroUsuario !== "all") queryBase = queryBase.eq("usuario", filtroUsuario);
    if (filtroFecha) {
      // ... lógica de filtro de fecha
    }
    
    const { count } = await queryBase;
    if (count) setTotalPaginas(Math.ceil(count / filtroCantidad));

    // PASO 2: Obtener datos con paginación
    const desde = (paginaActual - 1) * filtroCantidad;
    const hasta = desde + filtroCantidad - 1;
    
    let query = supabase
      .from("impresiones")
      .select(`
        id,
        usuario,
        fecha,
        detalle_impresion (id, tipo, paginas, costo)
      `)
      .order("fecha", { ascending: false })
      .range(desde, hasta);
    
    // Aplicar filtros a la consulta principal
    if (filtroUsuario !== "all") query = query.eq("usuario", filtroUsuario);
    if (filtroFecha) { /* aplicar filtro de fecha */ }
    
    const { data, error } = await query;
    if (error) throw error;
    
    setNotas(data || []);
  } catch (err) {
    console.error("❌ Error al obtener datos:", err);
    setError("Error al obtener los datos. Intenta nuevamente.");
  } finally {
    setLoading(false);
  }
};
```

**Desglose del proceso:**

1. **Inicialización:** Activa loading, limpia errores previos
2. **Conteo total:** Cuenta registros con filtros aplicados para calcular páginas
3. **Cálculo de rango:** Determina desde/hasta según página actual
4. **Consulta principal:** Obtiene datos con relaciones (detalle_impresion)
5. **Ordenamiento:** Más recientes primero (`descending`)
6. **Paginación:** Usa `.range()` de Supabase para eficiencia
7. **Actualización:** Guarda datos en estado
8. **Error handling:** Captura y muestra errores
9. **Finalización:** Desactiva loading

### 2. Operación CRUD: addImpresion()

Implementa transacciones parciales para mantener consistencia:

```javascript
const addImpresion = async (newRecord) => {
  try {
    // PASO 1: Insertar registro principal
    const { data: impresion, error: error1 } = await supabase
      .from("impresiones")
      .insert([{
        usuario: newRecord.usuario,
        fecha: newRecord.fecha || new Date().toISOString().slice(0, 10),
      }])
      .select()
      .single();
    
    if (error1) throw error1;

    // PASO 2: Insertar detalles relacionados
    if (newRecord.detalles?.length > 0) {
      const detallesConFk = newRecord.detalles.map((d) => ({
        impresion_id: impresion.id,
        tipo: d.tipo,
        paginas: d.paginas,
        costo: d.costo,
      }));
      
      const { error: error2 } = await supabase
        .from("detalle_impresion")
        .insert(detallesConFk);
      
      if (error2) throw error2;
    }

    // PASO 3: Refrescar datos
    await fetchNotas();
  } catch (err) {
    console.error("🚨 Error al agregar impresión:", err);
    setError("No se pudo agregar la impresión.");
  }
};
```

**Puntos clave:**
- Dos inserciones separadas (tabla principal + tabla relacionada)
- Usa el ID retornado de la primera inserción
- Refresh automático después de insertar
- Manejo de errores específico

### 3. Operación CRUD: editImpresion()

Estrategia de "borrar y recrear" para simplificar la lógica:

```javascript
const editImpresion = async (id, updatedRecord) => {
  try {
    // PASO 1: Actualizar registro principal
    const { error: error1 } = await supabase
      .from("impresiones")
      .update({
        usuario: updatedRecord.usuario,
        fecha: updatedRecord.fecha,
      })
      .eq("id", id);
    
    if (error1) throw error1;

    // PASO 2: Borrar detalles antiguos
    await supabase.from("detalle_impresion").delete().eq("impresion_id", id);

    // PASO 3: Insertar nuevos detalles
    if (updatedRecord.detalles?.length > 0) {
      const nuevosDetalles = updatedRecord.detalles.map((d) => ({
        impresion_id: id,
        tipo: d.tipo,
        paginas: d.paginas,
        costo: d.costo,
      }));
      
      await supabase.from("detalle_impresion").insert(nuevosDetalles);
    }

    // PASO 4: Refrescar datos
    await fetchNotas();
  } catch (err) {
    console.error("❌ Error al editar impresión:", err);
    setError("Error al editar la impresión.");
  }
};
```

**Por qué este enfoque:**
- Evita lógica compleja de comparación de cambios
- Garantiza que los detalles siempre coinciden con lo mostrado
- Más fácil de mantener y depurar
- Performance aceptable para volúmenes pequeños

### 4. Operación CRUD: deleteImpresion()

Simple y directo gracias a CASCADE en Supabase:

```javascript
const deleteImpresion = async (id) => {
  try {
    const { error } = await supabase
      .from("impresiones")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    
    await fetchNotas();
  } catch (err) {
    console.error("❌ Error al eliminar impresión:", err);
    setError("No se pudo eliminar el registro.");
  }
};
```

### 5. Hook de Efecto Automático

Cada vez que cambia un filtro o la página, se recarga automáticamente:

```javascript
useEffect(() => {
  fetchNotas();
}, [filtroUsuario, filtroFecha, filtroCantidad, paginaActual]);
```

**Beneficios:**
- Reactividad automática
- No requiere llamadas manuales
- Siempre datos sincronizados

## 🎯 Uso en Componentes

### Ejemplo 1: TablaImpresiones.jsx

```javascript
export default function TablaImpresiones() {
  const {
    notas,
    loading,
    error,
    filtroCantidad,
    setFiltroCantidad,
    paginaActual,
    setPaginaActual,
    totalPaginas,
  } = useContext(NoteContext);
  
  // Usa directamente los valores sin props
  return (
    <Table>
      {notas.map((row) => (
        <TableRow key={row.id}>
          {/* renderizado */}
        </TableRow>
      ))}
    </Table>
  );
}
```

### Ejemplo 2: FiltroBusqueda.jsx

```javascript
export default function FiltroBusqueda() {
  const {
    filtroUsuario,
    setFiltroUsuario,
    filtroFecha,
    setFiltroFecha,
  } = useContext(NoteContext);
  
  // Modifica filtros directamente
  return (
    <Select
      value={filtroUsuario}
      onChange={(e) => setFiltroUsuario(e.target.value)}
    >
      {/* opciones */}
    </Select>
  );
}
```

### Ejemplo 3: DeleteDialog.jsx

```javascript
export default function DeleteDialog({ open, handleClose, id }) {
  const { deleteImpresion } = useContext(NoteContext);
  
  const handleDelete = () => {
    deleteImpresion(id); // Función ya disponible
    handleClose();
  };
  
  return <Dialog>{/* UI */}</Dialog>;
}
```

## 💡 Ventajas del Sistema

### 1. Sin Prop Drilling
**Antes (sin Context):**
```
App → ImpresionesPage → TablaImpresiones → BotonEditar → ModalEditar
   ↓ pasando props               ↓ pasando props            ↓ usándolas
```

**Después (con Context):**
```
App → ImpresionesPage → TablaImpresiones → BotonEditar → ModalEditar
                                                         ↓
                                                useContext(NoteContext)
                                                ¡Acceso directo!
```

### 2. Estado Centralizado
- Una sola fuente de verdad
- Cambios consistentes en toda la app
- Fácil debugging (todo en un lugar)

### 3. Reutilización
- Cualquier componente puede acceder
- No importa cuán anidado esté
- Sin dependencias entre componentes

### 4. Mantenibilidad
- Lógica de negocio centralizada
- Fácil agregar nuevos filtros/funcionalidades
- Testing simplificado

### 5. Performance
- Recarga automática solo cuando cambia estado relevante
- Consultas optimizadas con filtros en servidor
- Paginación reduce carga de datos

## 📈 Comparación: Context vs Props

| Aspecto | Props Manuales | Context API |
|---------|---------------|-------------|
| **Profundidad de props** | 5+ niveles | 0 niveles (directo) |
| **Cambios** | Modificar múltiples archivos | Un archivo (Context) |
| **Reutilización** | Cada componente necesita props | useContext en cualquier lado |
| **Mantenibilidad** | Difícil de seguir | Fácil de entender |
| **Testing** | Mockear muchas props | Mockear un contexto |

## ✅ Conclusión

El sistema de Context API centralizado proporciona:

1. **Arquitectura limpia:** Separación clara entre lógica de negocio y UI
2. **Código mantenible:** Cambios en un solo lugar se propagan automáticamente
3. **Desarrollo ágil:** Nuevos componentes solo usan `useContext()`
4. **Escalabilidad:** Fácil agregar nuevas funciones/filtros
5. **Experiencia de desarrollador:** Menos código boilerplate

Esta implementación representa una evolución significativa respecto a pasar props manualmente, mejorando tanto el código como la experiencia de desarrollo.

