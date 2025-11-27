import { Paper, Typography, Box, CircularProgress } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { useDashboard } from "./DashboardDataProvider";
import { useChartDimensions } from "../../hooks/useChartDimensions";

export default function GraficoIngresosGastos() {
  const { data, loading } = useDashboard();
  const { width, height, containerRef, isMobile } = useChartDimensions();

  if (loading) {
    return (
      <Paper elevation={2} sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: height }}>
          <CircularProgress />
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
        Ingresos vs Gastos
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
            bottom: isMobile ? 80 : 60,
            left: isMobile ? 45 : 50,
            right: 10,
          }}
          series={[
            {
              data: data.ingresosMensuales || [],
              label: "Ingresos",
              id: "ingresos",
              color: "#2e7d32",
            },
            {
              data: data.gastosMensuales || [],
              label: "Gastos",
              id: "gastos",
              color: "#d32f2f",
            },
          ]}
          xAxis={[
            {
              data: data.meses || [],
              scaleType: "band",
            },
          ]}
          slotProps={{
            legend: {
              direction: "row",
              position: { vertical: "bottom", horizontal: "middle" },
              padding: 0,
            },
          }}
        />
      </Box>
    </Paper>
  );
}
