import { useContext } from "react";
import { GastosContext } from "../../Context/GastosContext";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Grid,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

const CATEGORIAS = [
  { value: "all", label: "Todas" },
  { value: "papel", label: "Papel" },
  { value: "tinta", label: "Tinta" },
  { value: "mantenimiento", label: "Mantenimiento" },
  { value: "reparacion", label: "Reparación" },
  { value: "suministros", label: "Suministros" },
  { value: "otros", label: "Otros" },
];

export default function FiltroBusquedaGastos() {
  const {
    filtroCategoria,
    setFiltroCategoria,
    filtroFecha,
    setFiltroFecha,
  } = useContext(GastosContext);

  return (
    <Paper sx={{ p: 2, mb: 3, borderRadius: 2, backgroundColor: "#fafafa" }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Filtros de búsqueda
      </Typography>

      <Grid container spacing={2}>
        {/* Filtro por categoría */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <FormControl size="small" fullWidth>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              label="Categoría"
            >
              {CATEGORIAS.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Filtro por día/mes/año con formato personalizado */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha"
                value={filtroFecha}
                onChange={(newValue) => setFiltroFecha(newValue)}
                format="DD/MM/YYYY" // 👈 Aquí defines el formato visible
                views={["year", "month", "day"]}
                openTo="day"
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
                color="error"
                startIcon={<ClearIcon />}
                onClick={() => setFiltroFecha(null)}
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
      </Grid>
    </Paper>
  );
}

