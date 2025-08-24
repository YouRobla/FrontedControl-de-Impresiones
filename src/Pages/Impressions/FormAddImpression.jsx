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
import { useState, useEffect } from "react";

const PRICES = {
  blanco_negro: 0.1,
  color: 0.2,
};

export const FormAddImpression = ({ open, handleClose, initialData, mode = "add" }) => {
  const [formData, setFormData] = useState({
    userType: "",
    pages: 1,
    printType: "blanco_negro",
    finalPrice: (1 * PRICES["blanco_negro"]).toFixed(2),
  });

  const [errors, setErrors] = useState({});

 
    // Si pasas datos iniciales (cuando editas), se cargan al abrir el modal
  useEffect(() => {
    if (initialData) {
      setFormData({
        userType: initialData.userType || "",
        pages: initialData.pages || 1,
        printType: initialData.printType || "blanco_negro",
        finalPrice: parseFloat(initialData.finalPrice || (1 * PRICES["blanco_negro"])).toFixed(2),
      });
    }
  }, [initialData, open]);


  // Calcula automáticamente el precio cuando cambian páginas o tipo
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      finalPrice: (prev.pages * PRICES[prev.printType]).toFixed(2),
    }));
  }, [formData.pages, formData.printType]);

   const validateForm = () => {
    let newErrors = {};
    if (!formData.userType) newErrors.userType = "Selecciona un tipo de usuario";
    if (!formData.pages || formData.pages < 1) newErrors.pages = "Debe ser al menos 1 página";
    if (!formData.finalPrice || isNaN(Number(formData.finalPrice)))
      newErrors.finalPrice = "Ingresa un precio válido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSave = () => {
    if (validateForm()) {
      if (mode === "add") {
        console.log("📄 Nueva impresión:", formData);
      } else {
        console.log("✏️ Edición de impresión:", formData);
      }
      handleClose();
    }
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
            <FormControl fullWidth error={Boolean(errors.userType)}>
              <InputLabel id="tipeUsers">Tipo de Usuario</InputLabel>
              <Select
                labelId="tipeUsers"
                label="Tipo de Usuario"
                value={formData.userType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    userType: e.target.value,
                  })
                }
              >
                <MenuItem value="alumno">Alumno</MenuItem>
                <MenuItem value="maestro">Maestro</MenuItem>
              </Select>
              {errors.userType && (
                <Typography variant="caption" color="error">
                  {errors.userType}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Número de páginas */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Número de Páginas"
              type="number"
              value={formData.pages}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pages: parseInt(e.target.value) || 1,
                })
              }
              error={Boolean(errors.pages)}
              helperText={errors.pages}
              slotProps={{
                htmlInput: { min: 1 },
              }}
            />
          </Grid>

          {/* Tipo de impresión */}
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Impresión</InputLabel>
              <Select
              label="Tipo de Impresión"
                value={formData.printType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    printType: e.target.value,
                  })
                }
              >
                <MenuItem value="blanco_negro">
                  Blanco y Negro (S/0.10)
                </MenuItem>
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
              value={formData.finalPrice}
              onChange={(e) => {
                let value = e.target.value.replace(/[^0-9.]/g, "");
                setFormData({
                  ...formData,
                  finalPrice: value,
                });
              }}
              onBlur={(e) => {
                let value = parseFloat(e.target.value || 0).toFixed(2);
                setFormData({
                  ...formData,
                  finalPrice: value,
                });
              }}
              error={Boolean(errors.finalPrice)}
              helperText={errors.finalPrice}
              slotProps={{
                htmlInput: { inputMode: "decimal" },
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Puedes ajustar el precio si hubo un costo adicional.
            </Typography>
          </Grid>

          {/* Alerta con total */}
          <Grid size={12}>
            <Alert severity="info">
              <Typography variant="body2">
                Total a cobrar: <strong>S/{formData.finalPrice}</strong>
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
