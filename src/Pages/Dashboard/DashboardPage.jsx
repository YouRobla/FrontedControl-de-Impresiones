import { Box, Grid } from "@mui/material";
import { DashboardDataProvider } from "./DashboardDataProvider";
import DashboardHeader from "./DashboardHeader";
import ResumenDashboard from "./ResumenDashboard";
import GraficoImpresiones from "./GraficoImpresiones";
import GraficoIngresosGastos from "./GraficoIngresosGastos";
import GraficoTipoImpresion from "./GraficoTipoImpresion";
import GraficoCategoriaGastos from "./GraficoCategoriaGastos";

export default function DashboardPage() {
  return (
    <DashboardDataProvider>
      <Box sx={{ pb: { xs: 2, sm: 3 }, px: { xs: 0, sm: 0 } }}>
        <DashboardHeader />
        <ResumenDashboard />

        {/* Gráficos principales */}
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 3 } }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <GraficoImpresiones />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <GraficoIngresosGastos />
          </Grid>
        </Grid>

        {/* Gráficos secundarios */}
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <GraficoTipoImpresion />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <GraficoCategoriaGastos />
          </Grid>
        </Grid>
      </Box>
    </DashboardDataProvider>
  );
}
