import {Typography, Button, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { useState } from "react";
import { FormAddImpression } from "./FormAddImpression";

export default function ImpresionesHeader() {

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  }
  return (
    <Grid container spacing={2} alignItems="center" sx={{mb:2}}>
  <Grid size={{xs:12 ,sm:8}}>
    <Typography variant="h4" gutterBottom>
      Control de Impresiones
    </Typography>
    <Typography variant="body1" color="textSecondary">
      Registra y controla todas las impresiones
    </Typography>
  </Grid>

  <Grid size={{xs:12 ,sm:4}} display="flex" justifyContent={{ xs: "flex-start", sm: "flex-end" }} >
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      size="large"
      onClick={handleClickOpen}
    >
      Nueva Impresión
    </Button>
  </Grid>

  <FormAddImpression open={open} handleClose={handleClose}  />
</Grid>
  );
}
