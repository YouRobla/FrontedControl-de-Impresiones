import { createContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export const GastosContext = createContext();

export const GastosProvider = ({ children }) => {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Filtros
  const [filtroCategoria, setFiltroCategoria] = useState("all");
  const [filtroFecha, setFiltroFecha] = useState(null); // dayjs()
  const [filtroCantidad, setFiltroCantidad] = useState(5); // 👈 cantidad por página
  // 🔹 Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // 🔹 Obtener datos desde Supabase con filtros y paginación
  const fetchGastos = async () => {
    setLoading(true);
    setError(null);

    try {
      let queryBase = supabase.from("gastos").select("id", { count: "exact" });
      // Aplicar filtros también al conteo total
      if (filtroCategoria !== "all") queryBase = queryBase.eq("categoria", filtroCategoria);
      if (filtroFecha) {
        const year = filtroFecha.year();
        const month = filtroFecha.month() + 1;
        const day = filtroFecha.date();
        if (day && day > 0) {
          queryBase = queryBase.eq("fecha", filtroFecha.format("YYYY-MM-DD"));
        } else {
          const firstDay = `${year}-${String(month).padStart(2, "0")}-01`;
          const lastDay = filtroFecha.endOf("month").format("YYYY-MM-DD");
          queryBase = queryBase.gte("fecha", firstDay).lte("fecha", lastDay);
        }
      }

      const { count } = await queryBase;
      if (count) setTotalPaginas(Math.ceil(count / filtroCantidad));

      // Calcular rango (paginación supabase usa .range)
      const desde = (paginaActual - 1) * filtroCantidad;
      const hasta = desde + filtroCantidad - 1;

      let query = supabase
        .from("gastos")
        .select("*")
        .order("fecha", { ascending: false })
        .range(desde, hasta);

      if (filtroCategoria !== "all") query = query.eq("categoria", filtroCategoria);

      if (filtroFecha) {
        const year = filtroFecha.year();
        const month = filtroFecha.month() + 1;
        const day = filtroFecha.date();
        if (day && day > 0) {
          query = query.eq("fecha", filtroFecha.format("YYYY-MM-DD"));
        } else {
          const firstDay = `${year}-${String(month).padStart(2, "0")}-01`;
          const lastDay = filtroFecha.endOf("month").format("YYYY-MM-DD");
          query = query.gte("fecha", firstDay).lte("fecha", lastDay);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      setGastos(data || []);
    } catch (err) {
      console.error("❌ Error al obtener datos:", err);
      setError("Error al obtener los datos. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // 🧩 CRUD
  const addGasto = async (newRecord) => {
    try {
      const { error } = await supabase
        .from("gastos")
        .insert([
          {
            categoria: newRecord.categoria,
            descripcion: newRecord.descripcion,
            monto: newRecord.monto,
            fecha: newRecord.fecha || new Date().toISOString().slice(0, 10),
          },
        ]);

      if (error) throw error;
      await fetchGastos();
    } catch (err) {
      console.error("🚨 Error al agregar gasto:", err);
      setError("No se pudo agregar el gasto.");
    }
  };

  const editGasto = async (id, updatedRecord) => {
    try {
      const { error } = await supabase
        .from("gastos")
        .update({
          categoria: updatedRecord.categoria,
          descripcion: updatedRecord.descripcion,
          monto: updatedRecord.monto,
          fecha: updatedRecord.fecha,
        })
        .eq("id", id);

      if (error) throw error;
      await fetchGastos();
    } catch (err) {
      console.error("❌ Error al editar gasto:", err);
      setError("Error al editar el gasto.");
    }
  };

  const deleteGasto = async (id) => {
    try {
      const { error } = await supabase.from("gastos").delete().eq("id", id);
      if (error) throw error;
      await fetchGastos();
    } catch (err) {
      console.error("❌ Error al eliminar gasto:", err);
      setError("No se pudo eliminar el registro.");
    }
  };

  // 🔁 Refetch cuando cambien los filtros
  useEffect(() => {
    fetchGastos();
  }, [filtroCategoria, filtroFecha, filtroCantidad, paginaActual]);

  return (
    <GastosContext.Provider
      value={{
        gastos,
        loading,
        error,
        fetchGastos,
        addGasto,
        editGasto,
        deleteGasto,
        filtroCategoria,
        setFiltroCategoria,
        filtroFecha,
        setFiltroFecha,
        filtroCantidad,
        setFiltroCantidad,
        paginaActual,
        setPaginaActual,
        totalPaginas,
      }}
    >
      {children}
    </GastosContext.Provider>
  );
};

