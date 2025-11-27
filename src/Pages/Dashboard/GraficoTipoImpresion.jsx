import { useMemo } from "react";
import { Paper, Typography, Box, CircularProgress } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { useDashboard } from "./DashboardDataProvider";
import { useChartDimensions } from "../../hooks/useChartDimensions";

export default function GraficoTipoImpresion() {
  const { data, loading } = useDashboard();
  const { width, height, containerRef, isMobile } = useChartDimensions();

  // Procesar datos para el gráfico
  const chartData = useMemo(() => {
    const tipos = Object.keys(data.impresionesPorTipo || {});
    const valores = Object.values(data.impresionesPorTipo || {});
    return { tipos, valores };
  }, [data.impresionesPorTipo]);

  if (loading) {
    return (
      <Paper elevation={2} sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: height }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  if (chartData.tipos.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 2 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2, 
            fontWeight: 600, 
            color: "primary.main",
            fontSize: { xs: "1rem", sm: "1.25rem" }
          }}
        >
          Impresiones por Tipo
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: height }}>
          <Typography variant="body2" color="textSecondary">
            No hay datos disponibles
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 2, height: "100%" }}>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2, 
          fontWeight: 600, 
          color: "primary.main",
          fontSize: { xs: "1rem", sm: "1.25rem" }
        }}
      >
        Impresiones por Tipo
      </Typography>
      <Box 
        ref={containerRef} 
        sx={{ 
          width: "100%", 
          minHeight: height,
          overflowX: "auto",
          overflowY: "hidden"
        }}
      >
        <BarChart
          width={width}
          height={height}
          margin={{
            top: 10,
            bottom: isMobile ? 60 : 50,
            left: isMobile ? 45 : 50,
            right: 10,
          }}
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
