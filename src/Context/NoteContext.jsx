import { createContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener todas las notas
  const fetchNotas = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("impresiones").select();
    if (error) console.error("Error al obtener datos:", error);
    else setNotas(data?.filter((item) => item != null) || []);
    setLoading(false);
  };

  // Agregar una nueva impresión
  const addImpresion = async (newRecord) => {
    const { data, error } = await supabase
      .from("impresiones")
      .insert([newRecord])
      .select();
    if (error) return console.error("Error al agregar:", error);
    if (data && data[0]) setNotas((prev) => [...prev, data[0]]);
  };

  const editImpresion = async (id, updatedRecord) => {
    try {
      const { data, error } = await supabase
        .from("impresiones")
        .update(updatedRecord)
        .eq("id",id) // 👈 asegúrate que sea número
        .select();

      if (error) return console.error("❌ Error al editar:", error);

      // Actualizar estado local
      setNotas((prev) => prev.map((nota) => (nota.id === id ? data[0] : nota)));
    } catch (err) {
      console.error("🚨 Error inesperado:", err);
    }
  };

  // Eliminar una impresión
  const deleteImpresion = async (id) => {
    const { error } = await supabase.from("impresiones").delete().eq("id", id);
    if (error) return console.error("Error al eliminar:", error);
    setNotas((prev) => prev.filter((row) => row?.id !== id));
  };

  useEffect(() => {
    fetchNotas();
  }, []);

  return (
    <NoteContext.Provider
      value={{
        notas,
        loading,
        fetchNotas,
        addImpresion,
        editImpresion,
        deleteImpresion,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};
