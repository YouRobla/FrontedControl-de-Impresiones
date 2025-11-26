import { useState, useEffect, useRef } from "react";
import { Paper, Typography, Box, CircularProgress } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { useDashboard } from "./DashboardDataProvider";

export default function GraficoImpresiones() {
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

  if (loading) {
    return (
      <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 280 }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "primary.main" }}>
        Impresiones Mensuales
      </Typography>
      <Box ref={containerRef} sx={{ width: "100%", minHeight: 280 }}>
        <LineChart
          width={width}
          height={280}
          margin={{ top: 10, bottom: 40, left: 50, right: 10 }}
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
