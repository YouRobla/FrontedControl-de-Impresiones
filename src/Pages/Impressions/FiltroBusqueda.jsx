import {
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function FiltroBusqueda() {
  return (
    <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2}>

        {/* Filtro por persona */}
        <Grid size={{xs:12,md:4}}>
          <FormControl size="small" fullWidth>
            <InputLabel>Persona</InputLabel>
            <Select defaultValue="all" label="Persona">
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="student">Alumnos</MenuItem>
              <MenuItem value="teacher">Maestros</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Filtro por tipo de impresión */}
        <Grid  size={{xs:12,md:4}}>
          <FormControl size="small" fullWidth>
            <InputLabel>Tipo de impresión</InputLabel>
            <Select defaultValue="all" label="Tipo de impresión">
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="bw">Blanco y Negro</MenuItem>
              <MenuItem value="color">Color</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
}
