import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useContext, useEffect, useState } from "react";
import { GastosContext } from "../../Context/GastosContext";

export default function DeleteDialogGastos({ open, handleClose, id }) {
  const [idDelete, setIdDelete] = useState(null);
  const { deleteGasto } = useContext(GastosContext);

  useEffect(() => {
    setIdDelete(id);
  }, [id]);

  const handleDelete = () => {
    deleteGasto(idDelete);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="delete-dialog-title"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id="delete-dialog-title" sx={{ fontWeight: 600 }}>
        Confirmar eliminación
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          ¿Estás seguro de que deseas eliminar este gasto? 
          Esta acción no se puede deshacer.
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          autoFocus
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

