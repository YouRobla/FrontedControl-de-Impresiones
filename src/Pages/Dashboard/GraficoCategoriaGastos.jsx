import { useState, useEffect, useRef, useMemo } from "react";
import { Paper, Typography, Box, CircularProgress } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { useDashboard } from "./DashboardDataProvider";

const CATEGORIAS_LABELS = {
  papel: "Papel",
  tinta: "Tinta",
  mantenimiento: "Mantenimiento",
  reparacion: "Reparación",
  suministros: "Suministros",
  otros: "Otros",
};

export default function GraficoCategoriaGastos() {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(500);
  const { data, loading } = useDashboard();

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Procesar datos para el gráfico
  const chartData = useMemo(() => {
    const categorias = Object.keys(data.gastosPorCategoria || {}).map(
      cat => CATEGORIAS_LABELS[cat] || cat.charAt(0).toUpperCase() + cat.slice(1)
    );
    const valores = Object.values(data.gastosPorCategoria || {});
    return { categorias, valores };
  }, [data.gastosPorCategoria]);

  if (loading) {
    return (
      <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 280 }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  if (chartData.categorias.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "error.main" }}>
          Gastos por Categoría
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 280 }}>
          <Typography variant="body2" color="textSecondary">
            No hay datos disponibles
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "error.main" }}>
        Gastos por Categoría
      </Typography>
      <Box ref={containerRef} sx={{ width: "100%", minHeight: 280 }}>
        <BarChart
          width={width}
          height={280}
          margin={{ top: 10, bottom: 50, left: 50, right: 10 }}
          series={[
            {
              data: chartData.valores,
              label: "Monto (S/)",
              id: "gastos",
              color: "#d32f2f",
            },
          ]}
          xAxis={[
            {
              data: chartData.categorias,
              scaleType: "band",
            },
          ]}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        />
      </Box>
    </Paper>
  );
}
