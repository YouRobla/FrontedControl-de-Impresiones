import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  Typography,
} from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { GastosContext } from "../../Context/GastosContext";

const CATEGORIAS = [
  { value: "papel", label: "Papel" },
  { value: "tinta", label: "Tinta" },
  { value: "mantenimiento", label: "Mantenimiento de Impresora" },
  { value: "reparacion", label: "Reparación" },
  { value: "suministros", label: "Suministros Varios" },
  { value: "otros", label: "Otros" },
];

export const FormAddGasto = ({
  open,
  handleClose,
  initialData,
  mode = "add",
}) => {
  const { addGasto, editGasto } = useContext(GastosContext);

  // Datos base
  const DEFAULT_FORM = {
    categoria: "papel",
    descripcion: "",
    monto: 0,
    fecha: new Date().toISOString().slice(0, 10),
  };

  const [formData, setFormData] = useState(DEFAULT_FORM);

  // 🔹 Cargar datos iniciales (modo editar)
  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          categoria: initialData.categoria || "papel",
          descripcion: initialData.descripcion || "",
          monto: initialData.monto || 0,
          fecha: initialData.fecha || new Date().toISOString().slice(0, 10),
        });
      } else {
        setFormData(DEFAULT_FORM);
      }
    }
  }, [open, initialData]);

  // 🔹 Funciones de control
  const handleChange = (field) => (e) => {
    const value = field === "monto" ? Number(e.target.value) || 0 : e.target.value;
    setFormData({ ...formData, [field]: value });
  };

  // 🔹 Cálculo total
  const total = formData.monto || 0;

  // ✅ Optimización visual: cierre instantáneo + guardado en background
  const handleSave = async () => {
    handleClose(); // 🚀 Cierra el modal al instante
    // Ejecuta la operación sin bloquear la UI
    setTimeout(async () => {
      try {
        if (mode === "add") {
          await addGasto(formData);
        } else {
          await editGasto(initialData.id, formData);
        }
      } catch (err) {
        console.error("❌ Error en guardado:", err);
      } 
    }, 0);
  };

  return (
    <Dialog open={open} keepMounted onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle fontWeight={600}>
        {mode === "add" ? "Nuevo Gasto" : "Editar Gasto"}
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          {mode === "add"
            ? "Completa los datos para registrar un nuevo gasto."
            : "Modifica la información del gasto seleccionado."}
        </DialogContentText>

        <Grid container spacing={2}>
          {/* Categoría */}
          <Grid item size={{xs:12, sm:6}}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="categoria-label">Categoría</InputLabel>
              <Select
                labelId="categoria-label"
                label="Categoría"
                value={formData.categoria}
                onChange={handleChange("categoria")}
              >
                {CATEGORIAS.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Fecha */}
          <Grid item size={{xs:12, sm:6}}>
            <TextField
              fullWidth
              label="Fecha"
              type="date"
              value={formData.fecha}
              onChange={handleChange("fecha")}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ mb: 2 }}
            />
          </Grid>

          {/* Descripción */}
          <Grid item size={{xs:12}}>
            <TextField
              fullWidth
              label="Descripción"
              value={formData.descripcion}
              onChange={handleChange("descripcion")}
              multiline
              rows={3}
              placeholder="Ej: Compra de papel A4, Mantenimiento preventivo, etc."
              sx={{ mb: 2 }}
            />
          </Grid>

          {/* Monto */}
          <Grid item size={{xs:12}}>
            <TextField
              fullWidth
              label="Monto (S/)"
              type="number"
              value={formData.monto}
              onChange={handleChange("monto")}
              inputProps={{ min: 0, step: 0.01 }}
              sx={{ mb: 2 }}
            />
          </Grid>
        </Grid>

        <Alert severity="info">
          <Typography variant="body2">
            Total: <strong>S/{total.toFixed(2)}</strong>
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button variant="contained" color="error" onClick={handleSave}>
          {mode === "add" ? "Guardar" : "Actualizar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

