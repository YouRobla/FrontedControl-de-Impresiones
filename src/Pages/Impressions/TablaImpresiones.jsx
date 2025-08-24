import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import { useState } from "react";
import DeleteDialog from "./DeleteDialog";
import { FormAddImpression } from "./FormAddImpression";

function createData(indice, usuario, tipo, paginas, costo, fecha) {
  return { indice, usuario, tipo, paginas, costo, fecha };
}

const rows = [
  createData(1, "Maestro", "B/N", 10, 1.0, "2025-09-01"),
  createData(2, "Alumno", "Color", 5, 2.5, "2025-09-05"),
  createData(3, "Maestro", "B/N", 10, 1.0, "2025-09-01"),
  createData(4, "Alumno", "Color", 5, 2.5, "2025-09-05"),
  createData(5, "Maestro", "B/N", 10, 1.0, "2025-09-01"),
  createData(6, "Alumno", "Color", 5, 2.5, "2025-09-05"),
  createData(7, "Maestro", "B/N", 10, 1.0, "2025-09-01"),
  createData(8, "Alumno", "Color", 5, 2.5, "2025-09-05"),
];

export default function TablaImpresiones() {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  // 👉 aquí guardamos la fila seleccionada
  const [selectedRow, setSelectedRow] = useState(null);

const handleClickOpen = (row) => {
  setSelectedRow(row);
  setOpen(true);
};
const handleClose = () => {
  setOpen(false);
  setSelectedRow(null); // limpiar también aquí
};
const openEditForm = (row) => {
  setSelectedRow({
    userType: row.usuario.toLowerCase(), // "Maestro" -> "maestro"
    pages: row.paginas,
    printType: row.tipo === "B/N" ? "blanco_negro" : "color",
    finalPrice: row.costo.toFixed(2),
  });
  setOpenEdit(true);
}
  const closeEditForm = () => {
    setOpenEdit(false);
    setSelectedRow(null);  // limpiamos al cerrar
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
          {rows.map((row) => (
            <TableRow
              key={row.indice}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="center">{row.indice}</TableCell>
              <TableCell align="center">{row.usuario}</TableCell>
              <TableCell align="center">{row.tipo}</TableCell>
              <TableCell align="center">{row.paginas}</TableCell>
              <TableCell align="center">{row.costo}</TableCell>
              <TableCell align="center">{row.fecha}</TableCell>
              <TableCell align="center">
                {/* Pasamos row al hacer click */}
                <IconButton color="primary" onClick={() => openEditForm(row)}>
                  <EditIcon />
                </IconButton>
              <IconButton color="error" onClick={() => handleClickOpen(row)}>
                <DeleteForeverIcon />
              </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal eliminar */}
      <DeleteDialog open={open} handleClose={handleClose} row={selectedRow} />

      {/* Modal editar */}
      <FormAddImpression
        open={openEdit}
        handleClose={closeEditForm}
        mode="edit"
        initialData={selectedRow}   // 👉 aquí le mandamos la data de la fila
      />
    </TableContainer>
  );
}
