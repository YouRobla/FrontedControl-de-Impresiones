import dayjs from "dayjs";

/**
 * Procesa los datos de impresiones y gastos para el dashboard
 * @param {Array} impresionesData - Array de impresiones desde Supabase
 * @param {Array} gastosData - Array de gastos desde Supabase
 * @returns {Object} Objeto con datos procesados para gráficos
 */
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

/**
 * Procesa las impresiones agrupadas por tipo
 * @param {Array} impresionesData - Array de impresiones
 * @returns {Object} Objeto con tipos como keys y cantidad de páginas como valores
 */
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

/**
 * Procesa los gastos agrupados por categoría
 * @param {Array} gastosData - Array de gastos
 * @returns {Object} Objeto con categorías como keys y montos totales como valores
 */
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

