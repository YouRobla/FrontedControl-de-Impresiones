// Simulamos un backend con datos y paginación
export async function getImpresiones({ page, limit }) {
  const allData = Array.from({ length: 120 }, (_, i) => ({
    usuario: `Usuario ${i + 1}`,
    paginas: Math.floor(Math.random() * 20) + 1,
    impresion: Math.random() > 0.5 ? "Color" : "B/N",
    costo: parseFloat((Math.random() * 10).toFixed(2)),
    fecha: `2025-08-${String((i % 30) + 1).padStart(2, "0")}`
  }));

  // Simulamos tiempo de respuesta
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Calcular inicio y fin según paginación
  const start = page * limit;
  const end = start + limit;

  return {
    records: allData.slice(start, end),
    total: allData.length
  };
}
