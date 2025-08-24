import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(indice, usuario,tipo,paginas,costo,fecha) {
  return { indice, usuario, tipo,paginas,costo,fecha};
}


const rows = [
  createData(1, "Maestro", "B/N", 10, 1.00,"2025-09-01"),
  createData(2, "Alumno", "Color", 5, 2.50, "2025-09-05"),
  createData(3, "Admin", "B/N", 20, 3.00, "2025-09-10"),
];

export default function TablaImpresiones() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
         <TableRow sx={{ backgroundColor: "#f5f5f5" }}> 
            <TableCell align="center">#</TableCell>
            <TableCell align="center">Usuario</TableCell>
            <TableCell align="center">Tipo de Impresions</TableCell>
            <TableCell align="center">Paginas</TableCell>
            <TableCell align="center">Costo</TableCell>
            <TableCell align="center">Fecha</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.indice}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >

              <TableCell align="center" >{row.indice}</TableCell>
              <TableCell align="center">{row.usuario}</TableCell>
              <TableCell align="center">{row.tipo}</TableCell>
              <TableCell align="center">{row.paginas}</TableCell>
              <TableCell align="center">{row.costo}</TableCell>
              <TableCell align="center">{row.fecha}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

