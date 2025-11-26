import { useState, useEffect, useRef, useMemo } from "react";
import { Paper, Typography, Box, CircularProgress } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { useDashboard } from "./DashboardDataProvider";

export default function GraficoTipoImpresion() {
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
    const tipos = Object.keys(data.impresionesPorTipo || {});
    const valores = Object.values(data.impresionesPorTipo || {});
    return { tipos, valores };
  }, [data.impresionesPorTipo]);

  if (loading) {
    return (
      <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 280 }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  if (chartData.tipos.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "primary.main" }}>
          Impresiones por Tipo
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
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "primary.main" }}>
        Impresiones por Tipo
      </Typography>
      <Box ref={containerRef} sx={{ width: "100%", minHeight: 280 }}>
        <BarChart
          width={width}
          height={280}
          margin={{ top: 10, bottom: 50, left: 50, right: 10 }}
          series={[
            {
              data: chartData.valores,
              label: "Cantidad",
              id: "cantidad",
              color: "#1976d2",
            },
          ]}
          xAxis={[
            {
              data: chartData.tipos,
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
