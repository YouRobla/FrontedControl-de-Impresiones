import { Typography, Grid } from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";

export default function InformesHeader() {
  return (
    <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
      <Grid size={{ xs: 12 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 8 }}>
            <Typography variant="h4" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AssessmentIcon color="info" sx={{ fontSize: 40 }} />
              Informes y Reportes
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Visualiza estadísticas, ganancias y análisis de impresiones y gastos
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

