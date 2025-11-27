# Procesamiento de Datos para Visualización

## Descripción General

Se implementó un sistema de procesamiento de datos que transforma datos crudos de Supabase en estructuras optimizadas para visualización en gráficos, calculando agregaciones, totales y agrupaciones necesarias para el Dashboard.

## Función Principal: `procesarDatosDashboard`

Función utilitaria que procesa datos de impresiones y gastos para generar información mensual y agregada.

```9:82:src/utils/dashboardUtils.js
export const procesarDatosDashboard = (impresionesData, gastosData) => {
  // Procesar datos mensuales (últimos 12 meses)
  const meses = [];
  const impresionesPorMes = [];
  const ingresosPorMes = [];
  const gastosPorMes = [];

  // Crear array de últimos 12 meses
  for (let i = 11; i >= 0; i--) {
    const mes = dayjs().subtract(i, "month");
    meses.push(mes.format("MMM"));
    const mesKey = mes.format("YYYY-MM");

    // Filtrar impresiones del mes
    const impresionesDelMes = impresionesData.filter((imp) => {
      const fechaImp = dayjs(imp.fecha).format("YYYY-MM");
      return fechaImp === mesKey;
    });

    // Contar impresiones
    impresionesPorMes.push(impresionesDelMes.length);

    // Calcular ingresos del mes
    const ingresosMes = impresionesDelMes.reduce((acc, imp) => {
      const ingresosDetalle =
        imp.detalle_impresion?.reduce(
          (sum, det) => sum + Number(det.costo || 0),
          0
        ) || 0;
      return acc + ingresosDetalle;
    }, 0);
    ingresosPorMes.push(ingresosMes);

    // Filtrar gastos del mes
    const gastosDelMes = gastosData.filter((gasto) => {
      const fechaGasto = dayjs(gasto.fecha).format("YYYY-MM");
      return fechaGasto === mesKey;
    });

    // Calcular gastos del mes
    const gastosMes = gastosDelMes.reduce(
      (acc, gasto) => acc + Number(gasto.monto || 0),
      0
    );
    gastosPorMes.push(gastosMes);
  }

  // Procesar impresiones por tipo
  const impresionesPorTipo = procesarImpresionesPorTipo(impresionesData);

  // Procesar gastos por categoría
  const gastosPorCategoria = procesarGastosPorCategoria(gastosData);

  // Calcular totales
  const totalImpresiones = impresionesPorMes.reduce((a, b) => a + b, 0);
  const totalIngresos = ingresosPorMes.reduce((a, b) => a + b, 0);
  const totalGastos = gastosPorMes.reduce((a, b) => a + b, 0);
  const gananciaNeta = totalIngresos - totalGastos;

  return {
    meses,
    impresionesMensuales: impresionesPorMes,
    ingresosMensuales: ingresosPorMes,
    gastosMensuales: gastosPorMes,
    impresionesPorTipo,
    gastosPorCategoria,
    totales: {
      impresiones: totalImpresiones,
      ingresos: totalIngresos,
      gastos: totalGastos,
      gananciaNeta,
    },
  };
};
```

## Funciones de Agregación

### Procesar Impresiones por Tipo

Agrupa las impresiones por tipo y suma las páginas de cada tipo.

```89:101:src/utils/dashboardUtils.js
export const procesarImpresionesPorTipo = (impresionesData) => {
  const impresionesPorTipo = {};
  impresionesData.forEach((imp) => {
    imp.detalle_impresion?.forEach((det) => {
      const tipo = det.tipo || "Sin tipo";
      if (!impresionesPorTipo[tipo]) {
        impresionesPorTipo[tipo] = 0;
      }
      impresionesPorTipo[tipo] += Number(det.paginas || 0);
    });
  });
  return impresionesPorTipo;
};
```

### Procesar Gastos por Categoría

Agrupa los gastos por categoría y suma los montos de cada categoría.

```108:118:src/utils/dashboardUtils.js
export const procesarGastosPorCategoria = (gastosData) => {
  const gastosPorCategoria = {};
  gastosData.forEach((gasto) => {
    const categoria = gasto.categoria || "otros";
    if (!gastosPorCategoria[categoria]) {
      gastosPorCategoria[categoria] = 0;
    }
    gastosPorCategoria[categoria] += Number(gasto.monto || 0);
  });
  return gastosPorCategoria;
};
```

## Uso en Componentes

### Ejemplo: Gráfico de Tipo de Impresión

```7:16:src/Pages/Dashboard/GraficoTipoImpresion.jsx
export default function GraficoTipoImpresion() {
  const { data, loading } = useDashboard();
  const { width, height, containerRef, isMobile } = useChartDimensions();

  // Procesar datos para el gráfico
  const chartData = useMemo(() => {
    const tipos = Object.keys(data.impresionesPorTipo || {});
    const valores = Object.values(data.impresionesPorTipo || {});
    return { tipos, valores };
  }, [data.impresionesPorTipo]);
```

### Ejemplo: Gráfico de Categoría de Gastos

```16:27:src/Pages/Dashboard/GraficoCategoriaGastos.jsx
export default function GraficoCategoriaGastos() {
  const { data, loading } = useDashboard();
  const { width, height, containerRef, isMobile } = useChartDimensions();

  // Procesar datos para el gráfico
  const chartData = useMemo(() => {
    const categorias = Object.keys(data.gastosPorCategoria || {}).map(
      (cat) => CATEGORIAS_LABELS[cat] || cat.charAt(0).toUpperCase() + cat.slice(1)
    );
    const valores = Object.values(data.gastosPorCategoria || {});
    return { categorias, valores };
  }, [data.gastosPorCategoria]);
```

## Características del Procesamiento

### 1. Procesamiento Mensual
- Genera arrays para los últimos 12 meses
- Calcula impresiones, ingresos y gastos por mes
- Formatea fechas usando dayjs

### 2. Agregaciones
- **Por Tipo**: Suma páginas de impresiones por tipo
- **Por Categoría**: Suma montos de gastos por categoría

### 3. Cálculo de Totales
- Total de impresiones
- Total de ingresos
- Total de gastos
- Ganancia neta (ingresos - gastos)

### 4. Manejo de Datos Faltantes
- Valores por defecto para datos nulos/undefined
- Validación de tipos de datos
- Formateo seguro de números

## Ventajas del Sistema

1. **Separación de Lógica**: El procesamiento está separado de la UI
2. **Reutilizable**: Las funciones pueden usarse en otros contextos
3. **Testeable**: Fácil de probar con datos mock
4. **Eficiente**: Procesa datos una sola vez
5. **Mantenible**: Cambios en lógica no afectan componentes
6. **Escalable**: Fácil agregar nuevas agregaciones

## Estructura de Datos de Salida

```javascript
{
  meses: ["Ene", "Feb", ...], // Últimos 12 meses
  impresionesMensuales: [10, 15, ...], // Array de 12 valores
  ingresosMensuales: [1000, 1500, ...], // Array de 12 valores
  gastosMensuales: [500, 600, ...], // Array de 12 valores
  impresionesPorTipo: {
    "Color": 500,
    "BN": 300,
    ...
  },
  gastosPorCategoria: {
    "papel": 200,
    "tinta": 150,
    ...
  },
  totales: {
    impresiones: 1000,
    ingresos: 12000,
    gastos: 5000,
    gananciaNeta: 7000
  }
}
```

