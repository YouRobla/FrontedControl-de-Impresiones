import { useContext, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Pagination,
  Grid,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import DeleteDialog from "./DeleteDialog";
import { FormAddImpression } from "./FormAddImpression";
import { NoteContext } from "../../Context/NoteContext";

export default function TablaImpresiones() {
  const {
    notas,
    loading,
    error,
    filtroCantidad,
    setFiltroCantidad,
    paginaActual,
    setPaginaActual,
    totalPaginas,
  } = useContext(NoteContext);

  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleClickOpenDelete = (row) => {
    setSelectedRow(row);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setSelectedRow(null);
  };

  const handleOpenEdit = (row) => {
    setSelectedRow(row);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedRow(null);
  };

  return (
    <Paper sx={{ mb: 4, p: 2, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Listado de Impresiones
      </Typography>
    
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {/* ⚠️ Estado de error */}
      {!loading && error && (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </Box>
      )}

      {/* 📋 Tabla */}
      {!loading && !error && (
        <>
          <TableContainer>
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
                    <TableCell align="center">Tipo(s) de Impresión</TableCell>
                    <TableCell align="center">Total Páginas</TableCell>
                    <TableCell align="center">Costo Total</TableCell>
                    <TableCell align="center">Fecha</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {notas.map((row) => {
                    const totalPaginas = row.detalle_impresion?.reduce(
                      (acc, det) => acc + det.paginas,
                      0
                    );
                    const totalCosto = row.detalle_impresion?.reduce(
                      (acc, det) => acc + Number(det.costo),
                      0
                    );
                    const tipos = row.detalle_impresion
                      ?.map((det) => det.tipo)
                      .join(", ");

                    return (
                      <TableRow key={row.id}>
                        <TableCell align="center">{row.id}</TableCell>
                        <TableCell align="center">
                          {row.usuario.charAt(0).toUpperCase() +
                            row.usuario.slice(1).toLowerCase()}
                        </TableCell>
                        <TableCell align="center">{tipos || "-"}</TableCell>
                        <TableCell align="center">{totalPaginas || 0}</TableCell>
                        <TableCell align="center">
                          {`S/ ${totalCosto?.toFixed(2) || "0.00"}`}
                        </TableCell>
                        <TableCell align="center">{row.fecha}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenEdit(row)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleClickOpenDelete(row)}
                          >
                            <DeleteForeverIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </TableContainer>

       

            <Grid
            container
            spacing={2}
            alignItems="center"
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              p: 2,
             
          
            }}
            >
              <Grid item size={{xs:12,sm:11}} display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Mostrando {(paginaActual - 1) * filtroCantidad + 1}–
                {Math.min(paginaActual * filtroCantidad, notas.length)} de{" "}
                {totalPaginas * filtroCantidad} registros
              </Typography>

              <Pagination
                count={totalPaginas}
                page={paginaActual}
                onChange={(_, value) => setPaginaActual(value)}
                color="primary"
                sx={{ mt: 1 }}
              />
              </Grid>
              <Grid item size={{xs:12,sm:1}}>
                
              <FormControl size="small" fullWidth>
  <InputLabel>Cantidad</InputLabel>
  <Select
    label="Cantidad"
    value={filtroCantidad}
    onChange={(e) => {
      setPaginaActual(1); // 👈 Reinicia a la primera página
      setFiltroCantidad(e.target.value);
    }}
  >
    <MenuItem value={5}>5</MenuItem>
    <MenuItem value={10}>10</MenuItem>
    <MenuItem value={20}>20</MenuItem>
    <MenuItem value={50}>50</MenuItem>
  </Select>
</FormControl>
              </Grid>
            </Grid>

        </>
      )}

      {/* 🗑️ Modal eliminar */}
      <DeleteDialog
        open={openDelete}
        handleClose={handleCloseDelete}
        id={selectedRow?.id}
      />

      {/* ✏️ Modal editar */}
      <FormAddImpression
        open={openEdit}
        handleClose={handleCloseEdit}
        mode="edit"
        initialData={selectedRow}
      />
    </Paper>
  );
}
