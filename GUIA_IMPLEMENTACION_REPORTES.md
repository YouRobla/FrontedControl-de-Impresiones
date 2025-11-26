# 📋 Guía de Implementación de Reportes

Esta guía detalla todo lo que necesitas para implementar la lógica de datos en los 3 tipos de reportes.

## 🎯 Estado Actual

La UI de los reportes está **100% completa** con:
- ✅ 3 pestañas (Reporte de Impresiones, Reporte de Gastos, Reporte General)
- ✅ Filtros funcionales (mes, total, período)
- ✅ Tarjetas de resumen
- ✅ Tablas para mostrar datos
- ✅ Diseño responsive y ordenado
- ✅ Inputs del mismo tamaño

**Los datos mostrados son placeholders (0, S/0.00)** - necesitan ser reemplazados con datos reales.

---

## 📊 1. Reporte de Impresiones

### Datos Necesarios

#### Desde `NoteContext`:
- `notas`: Array con todas las impresiones
- Estructura de cada impresión:
  ```javascript
  {
    id: number,
    usuario: string,
    fecha: string, // formato: "YYYY-MM-DD"
    detalle_impresion: [
      {
        id: number,
        tipo: "B/N" | "Color",
        paginas: number,
        costo: number
      }
    ]
  }
  ```

### Funciones a Implementar

#### 1.1. Calcular Estadísticas por Mes
```javascript
// Filtrar impresiones por mes
const impresionesFiltradas = notas.filter(nota => {
  const fechaNota = dayjs(nota.fecha);
  const mesNota = fechaNota.format("YYYY-MM");
  const mesFiltro = filtroFecha.format("YYYY-MM");
  return mesNota === mesFiltro;
});

// Calcular totales
const totalImpresiones = impresionesFiltradas.length;
const totalPaginas = impresionesFiltradas.reduce((acc, nota) => {
  const paginasDetalle = nota.detalle_impresion?.reduce((sum, det) => 
    sum + Number(det.paginas || 0), 0) || 0;
  return acc + paginasDetalle;
}, 0);
const totalIngresos = impresionesFiltradas.reduce((acc, nota) => {
  const ingresosDetalle = nota.detalle_impresion?.reduce((sum, det) => 
    sum + Number(det.costo || 0), 0) || 0;
  return acc + ingresosDetalle;
}, 0);
```

#### 1.2. Generar Tabla de Detalle
```javascript
// Expandir detalles de impresiones en filas individuales
const filasDetalle = [];
notas.forEach(nota => {
  nota.detalle_impresion?.forEach(detalle => {
    filasDetalle.push({
      fecha: nota.fecha,
      usuario: nota.usuario,
      tipo: detalle.tipo,
      paginas: detalle.paginas,
      ingreso: detalle.costo
    });
  });
});
```

#### 1.3. Resumen Mensual (cuando tipoReporte === "total")
```javascript
// Agrupar por mes
const resumenPorMes = {};
notas.forEach(nota => {
  const mes = dayjs(nota.fecha).format("YYYY-MM");
  if (!resumenPorMes[mes]) {
    resumenPorMes[mes] = {
      mes: dayjs(nota.fecha).format("MMMM YYYY"),
      impresiones: 0,
      paginas: 0,
      ingresos: 0
    };
  }
  resumenPorMes[mes].impresiones += 1;
  nota.detalle_impresion?.forEach(det => {
    resumenPorMes[mes].paginas += Number(det.paginas || 0);
    resumenPorMes[mes].ingresos += Number(det.costo || 0);
  });
});
```

---

## 💰 2. Reporte de Gastos

### Datos Necesarios

#### Desde `GastosContext`:
- `gastos`: Array con todos los gastos
- Estructura de cada gasto:
  ```javascript
  {
    id: number,
    categoria: string, // "papel", "tinta", "mantenimiento", etc.
    descripcion: string,
    monto: number,
    fecha: string // formato: "YYYY-MM-DD"
  }
  ```

### Funciones a Implementar

#### 2.1. Filtrar Gastos por Tipo de Reporte

**Por Mes:**
```javascript
const gastosFiltrados = gastos.filter(gasto => {
  const fechaGasto = dayjs(gasto.fecha);
  const mesGasto = fechaGasto.format("YYYY-MM");
  const mesFiltro = filtroFecha.format("YYYY-MM");
  return mesGasto === mesFiltro;
});
```

**Por Período:**
```javascript
const gastosFiltrados = gastos.filter(gasto => {
  const fechaGasto = dayjs(gasto.fecha);
  return fechaGasto >= fechaInicio && fechaGasto <= fechaFin;
});
```

**Total (todos los gastos):**
```javascript
const gastosFiltrados = gastos;
```

#### 2.2. Calcular Totales
```javascript
const totalGastos = gastosFiltrados.reduce((acc, g) => 
  acc + Number(g.monto || 0), 0);
const categoriasUnicas = new Set(gastosFiltrados.map(g => g.categoria)).size;
const totalRegistros = gastosFiltrados.length;
```

#### 2.3. Agrupar por Categoría
```javascript
const gastosPorCategoria = {};
gastosFiltrados.forEach(gasto => {
  if (!gastosPorCategoria[gasto.categoria]) {
    gastosPorCategoria[gasto.categoria] = {
      categoria: gasto.categoria,
      cantidad: 0,
      total: 0
    };
  }
  gastosPorCategoria[gasto.categoria].cantidad += 1;
  gastosPorCategoria[gasto.categoria].total += Number(gasto.monto || 0);
});

// Calcular porcentajes
const totalGastos = Object.values(gastosPorCategoria)
  .reduce((acc, cat) => acc + cat.total, 0);
Object.values(gastosPorCategoria).forEach(cat => {
  cat.porcentaje = totalGastos > 0 
    ? ((cat.total / totalGastos) * 100).toFixed(2) 
    : 0;
});
```

---

## 📈 3. Reporte General

### Datos Necesarios

#### Desde ambos contextos:
- `notas` desde `NoteContext`
- `gastos` desde `GastosContext`

### Funciones a Implementar

#### 3.1. Calcular Ingresos del Mes
```javascript
const fechaBase = filtroFecha || dayjs();
const primerDiaMes = fechaBase.startOf("month").format("YYYY-MM-DD");
const ultimoDiaMes = fechaBase.endOf("month").format("YYYY-MM-DD");

const impresionesMes = notas.filter(nota => 
  nota.fecha >= primerDiaMes && nota.fecha <= ultimoDiaMes
);

const totalIngresos = impresionesMes.reduce((acc, nota) => {
  const ingresosDetalle = nota.detalle_impresion?.reduce((sum, det) => 
    sum + Number(det.costo || 0), 0) || 0;
  return acc + ingresosDetalle;
}, 0);
```

#### 3.2. Calcular Gastos del Mes por Categoría
```javascript
const gastosMes = gastos.filter(gasto => 
  gasto.fecha >= primerDiaMes && gasto.fecha <= ultimoDiaMes
);

const gastosPapel = gastosMes
  .filter(g => g.categoria === "papel")
  .reduce((acc, g) => acc + Number(g.monto || 0), 0);

const gastosTinta = gastosMes
  .filter(g => g.categoria === "tinta")
  .reduce((acc, g) => acc + Number(g.monto || 0), 0);

const gastosMantenimiento = gastosMes
  .filter(g => g.categoria === "mantenimiento")
  .reduce((acc, g) => acc + Number(g.monto || 0), 0);

const otrosGastos = gastosMes
  .filter(g => !["papel", "tinta", "mantenimiento"].includes(g.categoria))
  .reduce((acc, g) => acc + Number(g.monto || 0), 0);

const totalGastos = gastosPapel + gastosTinta + gastosMantenimiento + otrosGastos;
```

#### 3.3. Calcular Métricas Adicionales
```javascript
const gananciaNeta = totalIngresos - totalGastos;
const rentabilidad = totalIngresos > 0 
  ? ((gananciaNeta / totalIngresos) * 100).toFixed(2) 
  : 0;

const totalImpresiones = impresionesMes.length;
const totalPaginas = impresionesMes.reduce((acc, nota) => {
  const paginasDetalle = nota.detalle_impresion?.reduce((sum, det) => 
    sum + Number(det.paginas || 0), 0) || 0;
  return acc + paginasDetalle;
}, 0);
```

---

## 🔧 Pasos de Implementación

### Paso 1: Importar Contextos
En cada componente de reporte, importa los contextos necesarios:

```javascript
import { useContext } from "react";
import { NoteContext } from "../../Context/NoteContext";
import { GastosContext } from "../../Context/GastosContext";

// Dentro del componente:
const { notas, loading: loadingNotas } = useContext(NoteContext);
const { gastos, loading: loadingGastos } = useContext(GastosContext);
```

### Paso 2: Crear Funciones de Cálculo
Crea funciones `useMemo` para calcular los datos cuando cambien los filtros:

```javascript
import { useMemo } from "react";

const datosCalculados = useMemo(() => {
  // Aquí va tu lógica de cálculo
  return {
    totalImpresiones: 0,
    totalPaginas: 0,
    totalIngresos: 0,
    // ...
  };
}, [notas, gastos, tipoReporte, filtroFecha, fechaInicio, fechaFin]);
```

### Paso 3: Reemplazar Placeholders
Reemplaza los valores estáticos (0, S/0.00) con los valores calculados:

```javascript
// Antes:
<Typography variant="h4">0</Typography>

// Después:
<Typography variant="h4">{datosCalculados.totalImpresiones}</Typography>
```

### Paso 4: Manejar Estados de Carga
Muestra un spinner mientras cargan los datos:

```javascript
const loading = loadingNotas || loadingGastos;

if (loading) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
      <CircularProgress />
    </Box>
  );
}
```

---

## 📝 Archivos a Modificar

1. **`src/Pages/Informes/ReporteImpresiones.jsx`**
   - Importar `NoteContext`
   - Agregar funciones de cálculo
   - Reemplazar placeholders en tarjetas y tablas

2. **`src/Pages/Informes/ReporteGastos.jsx`**
   - Importar `GastosContext`
   - Agregar funciones de cálculo
   - Reemplazar placeholders en tarjetas y tablas

3. **`src/Pages/Informes/ReporteGeneral.jsx`**
   - Importar ambos contextos (`NoteContext` y `GastosContext`)
   - Agregar funciones de cálculo
   - Reemplazar placeholders en tarjetas y tablas

---

## ⚠️ Consideraciones Importantes

1. **Formato de Fechas**: Asegúrate de usar el mismo formato (`YYYY-MM-DD`) para comparar fechas
2. **Valores Nulos**: Siempre verifica que los valores existan antes de calcular (`|| 0`)
3. **Performance**: Usa `useMemo` para cálculos pesados y evitar re-renders innecesarios
4. **Filtros Vacíos**: Maneja el caso cuando no hay filtros seleccionados (mostrar mes actual o todos los datos)
5. **Manejo de Errores**: Verifica que los datos existan antes de acceder a propiedades anidadas

---

## 🎨 Mejoras Opcionales Futuras

1. **Exportar a PDF/Excel**: Agregar botones para exportar reportes
2. **Gráficos**: Usar librerías como Chart.js o Recharts para visualizaciones
3. **Filtros Avanzados**: Agregar más opciones de filtrado (por usuario, por categoría, etc.)
4. **Comparación de Períodos**: Comparar un mes con el mes anterior
5. **Tendencias**: Mostrar tendencias de ingresos/gastos en el tiempo

---

## ✅ Checklist de Implementación

- [ ] Importar contextos necesarios en cada componente
- [ ] Crear funciones de cálculo con `useMemo`
- [ ] Implementar filtrado por mes
- [ ] Implementar filtrado por período
- [ ] Implementar cálculo de totales
- [ ] Reemplazar placeholders en tarjetas de resumen
- [ ] Reemplazar placeholders en tablas de detalle
- [ ] Agregar estados de carga
- [ ] Agregar manejo de errores
- [ ] Probar con datos reales
- [ ] Verificar que los filtros funcionen correctamente
- [ ] Optimizar performance si es necesario

¡Listo para implementar! 🚀

