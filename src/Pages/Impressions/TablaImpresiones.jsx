import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { getImpresiones } from "./fakeApi";

// Defino las columnas con índice y tipo
const columns = [
  { id: "indice", label: "#", minWidth: 40, align: "center" },
  { id: "usuario", label: "Usuario", minWidth: 170 },
  { id: "tipo", label: "Tipo", minWidth: 120 }, // Nueva columna tipo
  { id: "paginas", label: "Páginas", minWidth: 100, align: "right" },
  { id: "impresion", label: "Impresión", minWidth: 120 },
  {
    id: "costo",
    label: "Costo (S/)",
    minWidth: 120,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  { id: "fecha", label: "Fecha", minWidth: 140 },
];

export default function TablaImpresionesAgrupada() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);

  const fetchData = async () => {
    const data = await getImpresiones({ page, limit: rowsPerPage });

    const rowsWithExtras = data.records.map((row, index) => ({
      ...row,
      indice: page * rowsPerPage + index + 1,
      tipo: row.tipo || "Normal",
    }));

    setRows(rowsWithExtras);
    setTotalRows(data.total);
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: "100%", // para que sea responsivo
        borderRadius: 2,
        overflow: "visible",
        boxShadow: "0 4px 15px rgb(0 0 0 / 0.1)",
      }}
    >
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table stickyHeader aria-label="tabla de impresiones">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#f5f7fa",
                borderBottom: "2px solid #e2e8f0",
              }}
            >
              <TableCell align="center" colSpan={2} sx={{ py: 1.5 }}>
                <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">
                  Usuario
                </Typography>
              </TableCell>
              <TableCell align="center" colSpan={5} sx={{ py: 1.5 }}>
                <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">
                  Detalles de impresión
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: "#edf2f7" }}>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sx={{
                    top: 57,
                    minWidth: column.minWidth,
                    fontWeight: "600",
                    color: "text.primary",
                    fontSize: "0.875rem",
                    py: 1,
                    borderBottom: "1px solid #cbd5e1",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, idx) => (
              <TableRow
                hover
                tabIndex={-1}
                key={idx}
                sx={{
                  backgroundColor: idx % 2 === 0 ? "white" : "#ebf8ff", 
                  "&:hover": {
                    backgroundColor: "#ebf8ff",
                  },
                  cursor: "pointer",
                }}
              >
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      sx={{ py: 1.25, fontSize: "0.9rem", color: "#333" }}
                    >
                      {column.format && typeof value === "number"
                        ? column.format(value)
                        : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No hay registros para mostrar
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
        count={totalRows}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
            fontSize: "0.9rem",
          },
        }}
      />
    </Paper>
  );
}
