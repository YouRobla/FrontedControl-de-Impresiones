import {Typography, Button, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { useState } from "react";
import { FormAddGasto } from "./FormAddGasto";

export default function GastosHeader() {

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Grid container spacing={2} alignItems="center" sx={{mb:2}}>
  <Grid size={{xs:12 ,sm:8}}>
    <Typography variant="h4" gutterBottom>
      Control de Gastos
    </Typography>
    <Typography variant="body1" color="textSecondary">
      Registra y controla todos los gastos operativos
    </Typography>
  </Grid>

  <Grid size={{xs:12 ,sm:4}} display="flex" justifyContent={{ xs: "flex-start", sm: "flex-end" }} >
    <Button
      variant="contained"
      color="error"
      startIcon={<AddIcon />}
      size="large"
      onClick={handleClickOpen}
    >
      Nuevo Gasto
    </Button>
  </Grid>

  <FormAddGasto open={open} handleClose={handleClose}  />
</Grid>
  );
}
