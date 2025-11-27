import { Paper, Typography, Box, CircularProgress } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { useDashboard } from "./DashboardDataProvider";
import { useChartDimensions } from "../../hooks/useChartDimensions";

export default function GraficoImpresiones() {
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
        Impresiones Mensuales
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
        <LineChart
          width={width}
          height={height}
          margin={{
            top: 10,
            bottom: isMobile ? 50 : 40,
            left: isMobile ? 45 : 50,
            right: 10,
          }}
          series={[
            {
              data: data.impresionesMensuales || [],
              label: "Impresiones",
              color: "#1976d2",
            },
          ]}
          xAxis={[
            {
              scaleType: "point",
              data: data.meses || [],
            },
          ]}
          yAxis={[
            {
              label: "Cantidad",
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
