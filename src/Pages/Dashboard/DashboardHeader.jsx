import { Typography, Grid } from "@mui/material";

export default function DashboardHeader() {
  return (
    <Grid container spacing={2} alignItems="center" sx={{ mb: { xs: 2, sm: 2 } }}>
      <Grid size={{ xs: 12, sm: 8 }}>
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
        >
          Dashboard
        </Typography>
        <Typography 
          variant="body1" 
          color="textSecondary"
          sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
        >
          Resumen general de impresiones, ingresos y gastos
        </Typography>
      </Grid>
    </Grid>
  );
}

