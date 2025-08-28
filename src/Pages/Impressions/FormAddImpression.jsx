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
import { NoteContext } from "../../Context/NoteContext";

const PRICES = {
  blanco_negro: 0.1,
  color: 0.2,
};

export const FormAddImpression = ({
  open,
  handleClose,
  initialData,
  mode = "add",
}) => {
  const { addImpresion, editImpresion } = useContext(NoteContext);

 const DEFAULT_DATA = {
  id: 0,
  usuario: "alumno",
  tipo: "blanco_negro",   // ⚡ debería coincidir con PRICES
  paginas: 1,
  costo: (1 * PRICES["blanco_negro"]).toFixed(2),
 
};

  const [formData, setFormData] = useState(DEFAULT_DATA);


  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({ ...DEFAULT_DATA, ...initialData });
        console.log('Si existen datos mapeados'+initialData.usuario);
      } else {
        setFormData(DEFAULT_DATA);
      }
    }
  }, [open, initialData]);

  // Calcula automáticamente el precio cuando cambian páginas o tipo
  useEffect(() => {
    // Evita el cálculo si `pages` o `printType` no son válidos
    if (formData.paginas > 0 && formData.tipo) {
      setFormData((prev) => ({
        ...prev,
        costo: (prev.paginas * PRICES[prev.tipo]).toFixed(2),
      }));
    }
  }, [formData.paginas, formData.tipo]);

// Estado de validación
const isInvalid =
  formData.costo === "" ||
  isNaN(Number(formData.costo)) ||
  Number(formData.costo) < 0.10;


  
const handleSave = () => {
  if (isInvalid) {
    setShowError(true); // 🚨 Mostrar error
    return; // 🚫 No guardar si el valor es inválido
  }

  setShowError(false); // ✅ Ocultar error si todo está bien
  console.log({ formData });

  if (mode === "add") {
    addImpresion(formData);
  } else {
    editImpresion(formData);
  }
  handleClose();
};


  return (
    <Dialog open={open} keepMounted onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle fontWeight={600}>
        {mode === "add" ? "Nueva Impresión" : "Editar Impresión"}
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          {mode === "add"
            ? "Completa la información para registrar una nueva impresión."
            : "Modifica la información de la impresión seleccionada."}
        </DialogContentText>

        <Grid container spacing={2}>
          {/* Tipo de usuario */}
          <Grid size={12}>
            <FormControl fullWidth >
              <InputLabel id="tipeUsers">Tipo de Usuario</InputLabel>
              <Select
                labelId="tipeUsers"
                label="Tipo de Usuario"
                // CAMBIO: El valor debe venir del estado 'formData', no de 'initialData'.
                value={formData.usuario || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    usuario: e.target.value,
                  })
                }
              >
                <MenuItem value="alumno">Alumno</MenuItem>
                <MenuItem value="maestro">Maestro</MenuItem>
              </Select>
              
            </FormControl>
          </Grid>

          {/* Número de páginas */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
                fullWidth
                label="Número de Páginas"
                type="number"
                value={formData.paginas || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    paginas: parseInt(e.target.value) || 1,
                  })
                }
              />
          </Grid>

          {/* Tipo de impresión */}
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth >
              <InputLabel id="typeImpresion">Tipo de Impresión</InputLabel>
              <Select
              label="Tipo de Impresión"
              labelId="typeImpresion"
              value={formData.tipo || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tipo: e.target.value,   // usar la misma clave que en value
                })
              }
            >
              <MenuItem value="blanco_negro">Blanco y Negro (S/0.10)</MenuItem>
              <MenuItem value="color">Color (S/0.20)</MenuItem>
            </Select>
            </FormControl>
          </Grid>

  

         {/* Precio final editable */}
  <Grid size={12}>
 <TextField
  fullWidth
  label="Precio Final (S/)"
  type="text"
  value={formData.costo ?? ""}
  error={
    formData.costo === "" ||
    Number(formData.costo) < 0.10
  }
  helperText={
    formData.costo === ""
      ? " El campo es obligatorio"
      : isNaN(Number(formData.costo)) || Number(formData.costo) < 0.10
      ? " El valor mínimo aceptado es 0.10"
      : "Puedes ajustar el precio si hubo un costo adicional."
  }
  onChange={(e) => {
    let value = e.target.value;
    // solo números y hasta 2 decimales
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setFormData({ ...formData, costo: value });
    }
  }}
  onBlur={() => {
    if (formData.costo !== "" && !isNaN(Number(formData.costo))) {
      setFormData({
        ...formData,
        costo: Number(formData.costo).toFixed(2),
      });
    }
  }}
/>
</Grid>


          {/* Alerta con total */}
          <Grid size={12}>
            <Alert severity="info">
              <Typography variant="body2">
                {/* CAMBIO: El total también debe reflejar el estado 'formData'. */}
                Total a cobrar: <strong>S/{formData.costo}</strong>
              </Typography>
            </Alert>
          </Grid>
        </Grid>
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