import { createContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Filtros
  const [filtroUsuario, setFiltroUsuario] = useState("all");
  const [filtroFecha, setFiltroFecha] = useState(null); // dayjs()
  const [filtroCantidad, setFiltroCantidad] = useState(5); // 👈 cantidad por página
   // 🔹 Paginación
   const [paginaActual, setPaginaActual] = useState(1);
   const [totalPaginas, setTotalPaginas] = useState(1);
  // 🔹 Obtener datos desde Supabase con filtros y paginación
  const fetchNotas = async () => {
    setLoading(true);
    setError(null);

    try {
      let queryBase = supabase.from("impresiones").select("id", { count: "exact" });
      // Aplicar filtros también al conteo total
      if (filtroUsuario !== "all") queryBase = queryBase.eq("usuario", filtroUsuario);
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
        .from("impresiones")
        .select(
          `
          id,
          usuario,
          fecha,
          detalle_impresion (
            id,
            tipo,
            paginas,
            costo
          )
        `
        )
        .order("fecha", { ascending: false })
        .range(desde, hasta);

      if (filtroUsuario !== "all") query = query.eq("usuario", filtroUsuario);

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
      setNotas(data || []);
    } catch (err) {
      console.error("❌ Error al obtener datos:", err);
      setError("Error al obtener los datos. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // 🧩 CRUD
  const addImpresion = async (newRecord) => {
    try {
      const { data: impresion, error: error1 } = await supabase
        .from("impresiones")
        .insert([
          {
            usuario: newRecord.usuario,
            fecha: newRecord.fecha || new Date().toISOString().slice(0, 10),
          },
        ])
        .select()
        .single();

      if (error1) throw error1;

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

      await fetchNotas();
    } catch (err) {
      console.error("🚨 Error al agregar impresión:", err);
      setError("No se pudo agregar la impresión.");
    }
  };

  const editImpresion = async (id, updatedRecord) => {
    try {
      const { error: error1 } = await supabase
        .from("impresiones")
        .update({
          usuario: updatedRecord.usuario,
          fecha: updatedRecord.fecha,
        })
        .eq("id", id);
      if (error1) throw error1;

      await supabase.from("detalle_impresion").delete().eq("impresion_id", id);

      if (updatedRecord.detalles?.length > 0) {
        const nuevosDetalles = updatedRecord.detalles.map((d) => ({
          impresion_id: id,
          tipo: d.tipo,
          paginas: d.paginas,
          costo: d.costo,
        }));
        await supabase.from("detalle_impresion").insert(nuevosDetalles);
      }

      await fetchNotas();
    } catch (err) {
      console.error("❌ Error al editar impresión:", err);
      setError("Error al editar la impresión.");
    }
  };

  const deleteImpresion = async (id) => {
    try {
      const { error } = await supabase.from("impresiones").delete().eq("id", id);
      if (error) throw error;
      await fetchNotas();
    } catch (err) {
      console.error("❌ Error al eliminar impresión:", err);
      setError("No se pudo eliminar el registro.");
    }
  };

  // 🔁 Refetch cuando cambien los filtros
 useEffect(() => {
    fetchNotas();
  }, [filtroUsuario, filtroFecha, filtroCantidad, paginaActual]);

  return (
    <NoteContext.Provider
      value={{
        notas,
        loading,
        error,
        fetchNotas,
        addImpresion,
        editImpresion,
        deleteImpresion,
        filtroUsuario,
        setFiltroUsuario,
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
    </NoteContext.Provider>
  );
};
