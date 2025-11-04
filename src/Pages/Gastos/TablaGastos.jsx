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
  Chip,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import DeleteDialogGastos from "./DeleteDialogGastos";
import { FormAddGasto } from "./FormAddGasto";
import { GastosContext } from "../../Context/GastosContext";

const CATEGORIAS_COLORS = {
  papel: "primary",
  tinta: "secondary",
  mantenimiento: "warning",
  reparacion: "error",
  suministros: "info",
  otros: "default",
};

const CATEGORIAS_LABELS = {
  papel: "Papel",
  tinta: "Tinta",
  mantenimiento: "Mantenimiento",
  reparacion: "Reparación",
  suministros: "Suministros",
  otros: "Otros",
};

export default function TablaGastos() {
  const {
    gastos,
    loading,
    error,
    filtroCantidad,
    setFiltroCantidad,
    paginaActual,
    setPaginaActual,
    totalPaginas,
  } = useContext(GastosContext);

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
    <Paper sx={{ mb: 4, p: 2, borderRadius: 2, border: "1px solid #ffcdd2" }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "error.main" }}>
        Listado de Gastos
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
            {gastos.length === 0 ? (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h6" color="text.secondary">
                  No hay datos para mostrar
                </Typography>
              </Box>
            ) : (
              <Table sx={{ minWidth: 650 }} aria-label="tabla gastos">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#ffebee" }}>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>#</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>Categoría</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>Descripción</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>Monto</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>Fecha</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gastos.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell align="center">{row.id}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={CATEGORIAS_LABELS[row.categoria] || row.categoria}
                          color={CATEGORIAS_COLORS[row.categoria] || "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">{row.descripcion || "-"}</TableCell>
                      <TableCell align="center">
                        {`S/ ${Number(row.monto || 0).toFixed(2)}`}
                      </TableCell>
                      <TableCell align="center">{row.fecha}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="error"
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
                  ))}
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
              mt: 2,
            }}
            >
              <Grid item size={{xs:12,sm:11}} display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Mostrando {(paginaActual - 1) * filtroCantidad + 1}–
                {Math.min(paginaActual * filtroCantidad, gastos.length)} de{" "}
                {totalPaginas * filtroCantidad} registros
              </Typography>

              <Pagination
                count={totalPaginas}
                page={paginaActual}
                onChange={(_, value) => setPaginaActual(value)}
                color="error"
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
      <DeleteDialogGastos
        open={openDelete}
        handleClose={handleCloseDelete}
        id={selectedRow?.id}
      />

      {/* ✏️ Modal editar */}
      <FormAddGasto
        open={openEdit}
        handleClose={handleCloseEdit}
        mode="edit"
        initialData={selectedRow}
      />
    </Paper>
  );
}

