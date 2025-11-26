import { Typography, Grid } from "@mui/material";

export default function DashboardHeader() {
  return (
    <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
      <Grid size={{ xs: 12, sm: 8 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Resumen general de impresiones, ingresos y gastos
        </Typography>
      </Grid>
    </Grid>
  );
}

