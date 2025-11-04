import { createContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export const GastosContext = createContext();

// 🔹 Datos de prueba locales
const GASTOS_MOCK = [
  {
    id: 1,
    categoria: "papel",
    descripcion: "Compra de papel A4 500 hojas",
    monto: 25.50,
    fecha: "2024-01-15"
  },
  {
    id: 2,
    categoria: "tinta",
    descripcion: "Cartucho de tinta negra HP",
    monto: 45.00,
    fecha: "2024-01-20"
  },
  {
    id: 3,
    categoria: "mantenimiento",
    descripcion: "Mantenimiento preventivo impresora",
    monto: 120.00,
    fecha: "2024-02-05"
  },
  {
    id: 4,
    categoria: "papel",
    descripcion: "Papel fotográfico 50 hojas",
    monto: 35.75,
    fecha: "2024-02-10"
  },
  {
    id: 5,
    categoria: "tinta",
    descripcion: "Set completo de tintas color",
    monto: 85.50,
    fecha: "2024-02-15"
  },
  {
    id: 6,
    categoria: "reparacion",
    descripcion: "Reparación de bandeja de papel",
    monto: 150.00,
    fecha: "2024-03-01"
  },
  {
    id: 7,
    categoria: "suministros",
    descripcion: "Cables USB y adaptadores",
    monto: 30.00,
    fecha: "2024-03-05"
  },
  {
    id: 8,
    categoria: "papel",
    descripcion: "Papel A4 1000 hojas",
    monto: 48.00,
    fecha: "2024-03-10"
  },
  {
    id: 9,
    categoria: "mantenimiento",
    descripcion: "Limpieza de cabezales",
    monto: 80.00,
    fecha: "2024-03-15"
  },
  {
    id: 10,
    categoria: "otros",
    descripcion: "Gastos varios de oficina",
    monto: 25.00,
    fecha: "2024-03-20"
  },
  {
    id: 11,
    categoria: "tinta",
    descripcion: "Cartucho de tinta magenta",
    monto: 42.00,
    fecha: "2024-04-01"
  },
  {
    id: 12,
    categoria: "papel",
    descripcion: "Papel reciclado 500 hojas",
    monto: 22.50,
    fecha: "2024-04-05"
  }
];

export const GastosProvider = ({ children }) => {
  const [gastos, setGastos] = useState(GASTOS_MOCK); // 🔹 Datos de prueba
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Filtros
  const [filtroCategoria, setFiltroCategoria] = useState("all");
  const [filtroFecha, setFiltroFecha] = useState(null); // dayjs()
  const [filtroCantidad, setFiltroCantidad] = useState(5); // 👈 cantidad por página
  // 🔹 Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // 🔹 Obtener datos locales con filtros y paginación
  const fetchGastos = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 300));

      // Filtrar datos locales
      let datosFiltrados = [...GASTOS_MOCK];

      // Aplicar filtro de categoría
      if (filtroCategoria !== "all") {
        datosFiltrados = datosFiltrados.filter(g => g.categoria === filtroCategoria);
      }

      // Aplicar filtro de fecha
      if (filtroFecha) {
        const year = filtroFecha.year();
        const month = filtroFecha.month() + 1;
        const day = filtroFecha.date();
        
        if (day && day > 0) {
          // Filtro por día específico
          const fechaStr = filtroFecha.format("YYYY-MM-DD");
          datosFiltrados = datosFiltrados.filter(g => g.fecha === fechaStr);
        } else {
          // Filtro por mes completo
          datosFiltrados = datosFiltrados.filter(g => {
            const fechaGasto = new Date(g.fecha);
            return fechaGasto.getFullYear() === year && fechaGasto.getMonth() + 1 === month;
          });
        }
      }

      // Calcular total de páginas
      const total = datosFiltrados.length;
      setTotalPaginas(Math.ceil(total / filtroCantidad));

      // Ordenar por fecha descendente
      datosFiltrados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

      // Aplicar paginación
      const desde = (paginaActual - 1) * filtroCantidad;
      const hasta = desde + filtroCantidad;
      const datosPaginados = datosFiltrados.slice(desde, hasta);

      setGastos(datosPaginados);
    } catch (err) {
      console.error("❌ Error al obtener datos:", err);
      setError("Error al obtener los datos. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // 🧩 CRUD (operaciones locales)
  const addGasto = async (newRecord) => {
    try {
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const nuevoGasto = {
        id: Math.max(...GASTOS_MOCK.map(g => g.id), 0) + 1,
        categoria: newRecord.categoria,
        descripcion: newRecord.descripcion,
        monto: newRecord.monto,
        fecha: newRecord.fecha || new Date().toISOString().slice(0, 10),
      };
      
      GASTOS_MOCK.unshift(nuevoGasto); // Agregar al inicio
      await fetchGastos();
    } catch (err) {
      console.error("🚨 Error al agregar gasto:", err);
      setError("No se pudo agregar el gasto.");
    }
  };

  const editGasto = async (id, updatedRecord) => {
    try {
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const index = GASTOS_MOCK.findIndex(g => g.id === id);
      if (index !== -1) {
        GASTOS_MOCK[index] = {
          ...GASTOS_MOCK[index],
          categoria: updatedRecord.categoria,
          descripcion: updatedRecord.descripcion,
          monto: updatedRecord.monto,
          fecha: updatedRecord.fecha,
        };
      }
      
      await fetchGastos();
    } catch (err) {
      console.error("❌ Error al editar gasto:", err);
      setError("Error al editar el gasto.");
    }
  };

  const deleteGasto = async (id) => {
    try {
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const index = GASTOS_MOCK.findIndex(g => g.id === id);
      if (index !== -1) {
        GASTOS_MOCK.splice(index, 1);
      }
      
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

