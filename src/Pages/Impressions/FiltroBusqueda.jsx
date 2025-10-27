import { useContext } from "react";
import { NoteContext } from "../../Context/NoteContext";
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
} from "@mui/material";

export default function FiltroBusqueda() {
  const {
    filtroUsuario,
    setFiltroUsuario,
    filtroFecha,
    setFiltroFecha,
  } = useContext(NoteContext);

  return (
    <Paper sx={{ p: 2, mb: 3, borderRadius: 2, backgroundColor: "#fafafa" }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Filtros de búsqueda
      </Typography>

      <Grid container spacing={2}>
        {/* Filtro por persona */}
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl size="small" fullWidth>
            <InputLabel>Persona</InputLabel>
            <Select
              value={filtroUsuario}
              onChange={(e) => setFiltroUsuario(e.target.value)}
              label="Persona"
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="alumno">Alumnos</MenuItem>
              <MenuItem value="maestro">Maestros</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Filtro por día/mes/año con formato personalizado */}
        <Grid size={{ xs: 12, md: 6 }}>
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
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
    </Paper>
  );
}
