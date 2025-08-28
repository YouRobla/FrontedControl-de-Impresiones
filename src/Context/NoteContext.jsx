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
    else setNotas(data?.filter(item => item != null) || []);
    setLoading(false);
  };

  // Agregar una nueva impresión
  const addImpresion = async (newRecord) => {
    const { data, error } = await supabase.from("impresiones").insert([newRecord]).select();
    if (error) return console.error("Error al agregar:", error);
    if (data && data[0]) setNotas(prev => [...prev, data[0]]);
  };

// Editar una impresión existente
const editImpresion = async (id, updatedRecord) => {
  try {
    const { data, error } = await supabase
      .from("impresiones")
      .update(updatedRecord)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error al editar:", error);
      return;
    }

    if (data && data[0]) {
      // Actualiza el estado local con el registro editado
      setNotas(prev =>
        prev.map(row => (row?.id === id ? data[0] : row))
      );

      // Feedback de éxito
      console.log("Registro actualizado:", data[0]);

      // Opcional: alerta o notificación visual
      alert(`¡Registro actualizado!\nUsuario: ${data[0].usuario}\nCosto: S/${data[0].costo}`);
    } else {
      console.warn("No se encontró el registro para actualizar.");
    }
  } catch (err) {
    console.error("Error inesperado al editar:", err);
  }
};


  // Eliminar una impresión
  const deleteImpresion = async (id) => {
    const { error } = await supabase.from("impresiones").delete().eq("id", id);
    if (error) return console.error("Error al eliminar:", error);
    setNotas(prev => prev.filter(row => row?.id !== id));
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
        deleteImpresion
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};
