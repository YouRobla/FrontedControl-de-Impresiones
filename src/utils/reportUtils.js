import dayjs from "dayjs";

// Obtener todas las impresiones sin paginación
export const obtenerTodasLasImpresiones = async (supabase) => {
  const { data, error } = await supabase
    .from("impresiones")
    .select(`
      id,
      usuario,
      fecha,
      detalle_impresion (
        id,
        tipo,
        paginas,
        costo
      )
    `)
    .order("fecha", { ascending: false });

  if (error) throw error;
  return data || [];
};

// Obtener todos los gastos sin paginación
export const obtenerTodosLosGastos = async (supabase) => {
  const { data, error } = await supabase
    .from("gastos")
    .select("*")
    .order("fecha", { ascending: false });

  if (error) throw error;
  return data || [];
};

// Filtrar por mes
export const filtrarPorMes = (datos, fecha) => {
  if (!fecha) return datos;
  const mesFiltro = fecha.format("YYYY-MM");
  return datos.filter(item => {
    const fechaItem = dayjs(item.fecha);
    const mesItem = fechaItem.format("YYYY-MM");
    return mesItem === mesFiltro;
  });
};

// Filtrar por período
export const filtrarPorPeriodo = (datos, fechaInicio, fechaFin) => {
  if (!fechaInicio || !fechaFin) return datos;
  return datos.filter(item => {
    const fechaItem = dayjs(item.fecha);
    return fechaItem >= fechaInicio && fechaItem <= fechaFin;
  });
};

