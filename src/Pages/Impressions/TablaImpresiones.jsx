import { useContext } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, Typography, Box } from "@mui/material";
import { useState } from "react";
import DeleteDialog from "./DeleteDialog";
import { FormAddImpression } from "./FormAddImpression";

import { NoteContext } from "../../Context/NoteContext";



export default function TablaImpresiones() {

  const { notas } = useContext(NoteContext);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleClickOpenDelte = (row) => {
    setSelectedRow(row);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setSelectedRow(null);
  };


  const  handleOpenEdit = (row) => {
    setSelectedRow(row);  
    setOpenEdit(true);
  };


  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedRow(null);
  };



  return (
    <TableContainer component={Paper} sx={{mb:4}}>
      {notas.length === 0 ? (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            No hay datos para mostrar
          </Typography>
        </Box>
      ) : (
        <Table sx={{ minWidth: 650 }} aria-label="tabla impresiones">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell align="center">#</TableCell>
              <TableCell align="center">Usuario</TableCell>
              <TableCell align="center">Tipo de Impresion</TableCell>
              <TableCell align="center">Páginas</TableCell>
              <TableCell align="center">Costo</TableCell>
              <TableCell align="center">Fecha</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notas.map((row, index) => (
              <TableRow
                key={row.id }
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{row.id}</TableCell>
                <TableCell align="center">{row.usuario}</TableCell>
                <TableCell align="center">{row.tipo}</TableCell>
                <TableCell align="center">{row.paginas}</TableCell>
                <TableCell align="center">{row.costo}</TableCell>
                <TableCell align="center">{row.fecha}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleOpenEdit(row)}>
                    <EditIcon />
                  </IconButton>

                  <IconButton color="error" onClick={() => handleClickOpenDelte(row)}>
                    <DeleteForeverIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Modal eliminar */}
      <DeleteDialog open={openDelete} handleClose={handleCloseDelete} id={selectedRow?.id} />

      <FormAddImpression
        open={openEdit}
        handleClose={handleCloseEdit}
        mode="edit"
        initialData={selectedRow}
       
      />



    </TableContainer>
  );
}
