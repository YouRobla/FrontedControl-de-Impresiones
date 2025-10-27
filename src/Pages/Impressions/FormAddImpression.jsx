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
  IconButton,
  Divider,
  CircularProgress,
} from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { useState, useEffect, useContext } from "react";
import { NoteContext } from "../../Context/NoteContext";

const PRICES = {
  "B/N": 0.1,
  Color: 0.2,
};

export const FormAddImpression = ({
  open,
  handleClose,
  initialData,
  mode = "add",
}) => {
  const { addImpresion, editImpresion } = useContext(NoteContext);



  // Datos base
  const DEFAULT_DETAIL = { tipo: "B/N", paginas: 1, costo: 0.1 };
  const DEFAULT_FORM = {
    usuario: "alumno",
    fecha: new Date().toISOString().slice(0, 10),
    detalles: [DEFAULT_DETAIL],
  };

  const [formData, setFormData] = useState(DEFAULT_FORM);

  // 🔹 Cargar datos iniciales (modo editar)
  useEffect(() => {
    if (open) {
      if (initialData) {
        const detallesAdaptados =
          initialData.detalle_impresion?.map((d) => ({
            tipo: d.tipo,
            paginas: d.paginas,
            costo: Number(d.costo),
          })) || [DEFAULT_DETAIL];

        setFormData({
          usuario: initialData.usuario,
          fecha: initialData.fecha,
          detalles: detallesAdaptados,
        });
      } else {
        setFormData(DEFAULT_FORM);
      }
    }
  }, [open, initialData]);

  // 🔹 Funciones de control dinámico
  const handleChangeUsuario = (e) =>
    setFormData({ ...formData, usuario: e.target.value });

  const handleAddDetalle = () => {
    setFormData((prev) => ({
      ...prev,
      detalles: [...prev.detalles, { ...DEFAULT_DETAIL }],
    }));
  };

  const handleRemoveDetalle = (index) => {
    setFormData((prev) => ({
      ...prev,
      detalles: prev.detalles.filter((_, i) => i !== index),
    }));
  };

  const handleChangeDetalle = (index, field, value) => {
    const newDetalles = [...formData.detalles];
    newDetalles[index][field] =
      field === "paginas" ? Number(value) || 0 : value;

    // Recalcular costo automático
    if (field === "tipo" || field === "paginas") {
      const tipo = newDetalles[index].tipo;
      const paginas = newDetalles[index].paginas;
      newDetalles[index].costo = (paginas * PRICES[tipo]).toFixed(2);
    }

    setFormData({ ...formData, detalles: newDetalles });
  };

  // 🔹 Cálculo total
  const total = formData.detalles.reduce(
    (acc, d) => acc + Number(d.costo),
    0
  );

  // ✅ Optimización visual: cierre instantáneo + guardado en background
  const handleSave = async () => {
    handleClose(); // 🚀 Cierra el modal al instante
    // Ejecuta la operación sin bloquear la UI
    setTimeout(async () => {
      try {
        if (mode === "add") {
          await addImpresion(formData);
        } else {
          await editImpresion(initialData.id, formData);
        }
      } catch (err) {
        console.error("❌ Error en guardado:", err);
      } 
    }, 0);
  };
  return (
    <Dialog open={open} keepMounted onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle fontWeight={600}>
        {mode === "add" ? "Nueva Impresión" : "Editar Impresión"}
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          {mode === "add"
            ? "Completa los datos para registrar una nueva impresión."
            : "Modifica la información de la impresión seleccionada."}
        </DialogContentText>

        {/* Usuario */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="user-type-label">Tipo de Usuario</InputLabel>
          <Select
            labelId="user-type-label"
            label="Tipo de Usuario"
            value={formData.usuario}
            onChange={handleChangeUsuario}
          >
            <MenuItem value="alumno">Alumno</MenuItem>
            <MenuItem value="maestro">Maestro</MenuItem>
          </Select>
        </FormControl>

        {/* Detalles dinámicos */}
        {formData.detalles.map((detalle, index) => (
          
          <Grid
            container
            spacing={2}
            key={index}
            alignItems="center"
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              p: 2,
              mb: 2,
              backgroundColor: "#fafafa",
            }}
          >
            <Grid item size={{xs:12,sm:4}}>
              <FormControl fullWidth>
                <InputLabel id={`tipo-${index}`}>Tipo de Impresión</InputLabel>
                <Select
                  labelId={`tipo-${index}`}
                  value={detalle.tipo}
                  label="Tipo de Impresión"
                  onChange={(e) =>
                    handleChangeDetalle(index, "tipo", e.target.value)
                  }
                >
                  <MenuItem value="B/N">Blanco y Negro (S/0.10)</MenuItem>
                  <MenuItem value="Color">Color (S/0.20)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={{xs:12,sm:3}}>  
              <TextField
                fullWidth
                label="Páginas"
                type="number"
                value={detalle.paginas}
                onChange={(e) =>
                  handleChangeDetalle(index, "paginas", e.target.value)
                }
              />
            </Grid>

            <Grid item size={{xs:12,sm:3}}>
              <TextField
                fullWidth
                label="Costo (S/)"
                value={detalle.costo}
                onChange={(e) =>
                  handleChangeDetalle(index, "costo", e.target.value)
                }
              />
            </Grid>

            <Grid item size={{xs:12,sm:2}} sx={{ textAlign: "center" }}>
              {formData.detalles.length > 1 && (
                <IconButton
                  color="error"
                  onClick={() => handleRemoveDetalle(index)}
                >
                  <RemoveCircle />
                </IconButton>
              )}
            </Grid>
          </Grid>
        ))}

        <Button
          startIcon={<AddCircle />}
          onClick={handleAddDetalle}
          sx={{ mb: 2 }}
        >
          Agregar otro tipo de impresión
        </Button>

        <Divider sx={{ my: 2 }} />

        <Alert severity="info">
          <Typography variant="body2">
            Total a cobrar: <strong>S/{total.toFixed(2)}</strong>
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSave}>
          {mode === "add" ? "Guardar" : "Actualizar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
