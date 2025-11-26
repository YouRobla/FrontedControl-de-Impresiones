import { Grid, Paper, Typography, Box, Button } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ClearIcon from "@mui/icons-material/Clear";
import dayjs from "dayjs";

export default function FiltroInformes({ filtroFecha, setFiltroFecha }) {
  const handleFechaChange = (newValue) => {
    setFiltroFecha(newValue);
  };

  const handleReset = () => {
    setFiltroFecha(null);
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "info.main" }}>
        Filtros de Reporte
      </Typography>
      
      <Grid container spacing={2} alignItems="center">
        <Grid item size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Filtrar por mes/año"
                value={filtroFecha}
                onChange={handleFechaChange}
                format="MM/YYYY"
                views={["year", "month"]}
                openTo="month"
                disableFuture
                slotProps={{
                  textField: { size: "small", fullWidth: true },
                }}
                sx={{ flex: 1 }}
              />
            </LocalizationProvider>
            {filtroFecha && (
              <Button
                size="small"
                variant="outlined"
                color="info"
                startIcon={<ClearIcon />}
                onClick={handleReset}
                sx={{
                  minWidth: "auto",
                  whiteSpace: "nowrap",
                  height: "40px",
                }}
              >
                Todos
              </Button>
            )}
          </Box>
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
          <Typography variant="body2" color="textSecondary">
            {filtroFecha
              ? `Mostrando reportes de ${filtroFecha.format("MMMM YYYY")}. Haz clic en "Todos" para ver todos los períodos.`
              : "Mostrando el mes actual. Selecciona un mes y año para filtrar reportes específicos."}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

