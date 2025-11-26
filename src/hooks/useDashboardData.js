import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { procesarDatosDashboard } from "../utils/dashboardUtils";

export const useDashboardData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    impresiones: [],
    gastos: [],
    meses: [],
    impresionesMensuales: [],
    ingresosMensuales: [],
    gastosMensuales: [],
    impresionesPorTipo: {},
    gastosPorCategoria: {},
    totales: {
      impresiones: 0,
      ingresos: 0,
      gastos: 0,
      gananciaNeta: 0,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Obtener todas las impresiones
        const { data: impresionesData, error: errorImpresiones } = await supabase
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

        if (errorImpresiones) throw errorImpresiones;

        // Obtener todos los gastos
        const { data: gastosData, error: errorGastos } = await supabase
          .from("gastos")
          .select("*")
          .order("fecha", { ascending: false });

        if (errorGastos) throw errorGastos;

        // Procesar datos usando función utilitaria
        const datosProcesados = procesarDatosDashboard(
          impresionesData || [],
          gastosData || []
        );

        setData({
          impresiones: impresionesData || [],
          gastos: gastosData || [],
          ...datosProcesados,
        });
      } catch (err) {
        console.error("Error al obtener datos del dashboard:", err);
        setError("Error al cargar los datos del dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

