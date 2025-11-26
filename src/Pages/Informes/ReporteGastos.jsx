import { useState, useContext, useMemo, useEffect } from "react";
import {
  Paper,
  Typography,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  CircularProgress,
  Chip,
} from "@mui/material";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import CategoryIcon from "@mui/icons-material/Category";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ClearIcon from "@mui/icons-material/Clear";
import { GastosContext } from "../../Context/GastosContext";
import { supabase } from "../../supabaseClient";
import dayjs from "dayjs";
import { PDFGastos } from "./PDFs/PDFGastos";

const CATEGORIAS_LABELS = {
  papel: "Papel",
  tinta: "Tinta",
  mantenimiento: "Mantenimiento",
  reparacion: "Reparación",
  suministros: "Suministros",
  otros: "Otros",
};

export default function ReporteGastos() {
  const { loading: loadingContext } = useContext(GastosContext);
  const [tipoReporte, setTipoReporte] = useState("mes");
  const [filtroFecha, setFiltroFecha] = useState(null);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [todosLosGastos, setTodosLosGastos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener todos los gastos
  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("gastos")
          .select("*")
          .order("fecha", { ascending: false });

        if (error) throw error;
        setTodosLosGastos(data || []);
      } catch (err) {
        console.error("Error al obtener gastos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  // Calcular datos según filtros
  const datosCalculados = useMemo(() => {
    let gastosFiltrados = [...todosLosGastos];

    // Filtrar según tipo de reporte
    if (tipoReporte === "mes" && filtroFecha) {
      const mesFiltro = filtroFecha.format("YYYY-MM");
      gastosFiltrados = gastosFiltrados.filter(gasto => {
        const mesGasto = dayjs(gasto.fecha).format("YYYY-MM");
        return mesGasto === mesFiltro;
      });
    } else if (tipoReporte === "periodo" && fechaInicio && fechaFin) {
      gastosFiltrados = gastosFiltrados.filter(gasto => {
        const fechaGasto = dayjs(gasto.fecha);
        return fechaGasto >= fechaInicio && fechaGasto <= fechaFin;
      });
    }

    // Calcular totales
    const totalGastos = gastosFiltrados.reduce((acc, g) => acc + Number(g.monto || 0), 0);
    const categoriasUnicas = new Set(gastosFiltrados.map(g => g.categoria)).size;
    const totalRegistros = gastosFiltrados.length;

    // Agrupar por categoría
    const gastosPorCategoria = {};
    gastosFiltrados.forEach(gasto => {
      if (!gastosPorCategoria[gasto.categoria]) {
        gastosPorCategoria[gasto.categoria] = {
          cantidad: 0,
          total: 0
        };
      }
      gastosPorCategoria[gasto.categoria].cantidad += 1;
      gastosPorCategoria[gasto.categoria].total += Number(gasto.monto || 0);
    });

    // Convertir a array y calcular porcentajes
    const gastosPorCategoriaArray = Object.entries(gastosPorCategoria).map(([cat, data]) => ({
      categoria: cat,
      cantidad: data.cantidad,
      total: data.total,
      porcentaje: totalGastos > 0 ? ((data.total / totalGastos) * 100).toFixed(2) : 0
    })).sort((a, b) => b.total - a.total);

    return {
      totalGastos,
      categoriasUnicas,
      totalRegistros,
      gastosPorCategoria: gastosPorCategoriaArray,
      gastosFiltrados: gastosFiltrados.sort((a, b) => dayjs(b.fecha) - dayjs(a.fecha))
    };
  }, [todosLosGastos, tipoReporte, filtroFecha, fechaInicio, fechaFin]);

  const handleReset = () => {
    setFiltroFecha(null);
    setFechaInicio(null);
    setFechaFin(null);
  };

  const handleExportarPDF = () => {
    if ((tipoReporte === "mes" && !filtroFecha) || (tipoReporte === "periodo" && (!fechaInicio || !fechaFin))) {
      return;
    }
    PDFGastos({
      tipoReporte,
      filtroFecha,
      fechaInicio,
      fechaFin,
      datos: datosCalculados
    });
  };

  if (loading || loadingContext) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Filtros */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item size={{ xs: 12, md: 8 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "error.main" }}>
              Filtros del Reporte
            </Typography>
          </Grid>
          <Grid item size={{ xs: 12, md: 4 }} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="error"
              startIcon={<PictureAsPdfIcon />}
              onClick={handleExportarPDF}
              disabled={(tipoReporte === "mes" && !filtroFecha) || (tipoReporte === "periodo" && (!fechaInicio || !fechaFin))}
            >
              Exportar PDF
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="flex-end">
          <Grid item size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel id="tipo-reporte-label">Tipo de Reporte</InputLabel>
              <Select
                labelId="tipo-reporte-label"
                label="Tipo de Reporte"
                value={tipoReporte}
                onChange={(e) => {
                  setTipoReporte(e.target.value);
                  handleReset();
                }}
                size="small"
              >
                <MenuItem value="mes">Por Mes</MenuItem>
                <MenuItem value="total">Total</MenuItem>
                <MenuItem value="periodo">Por Período</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {tipoReporte === "mes" && (
            <Grid item size={{ xs: 12, md: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Seleccionar Mes"
                  value={filtroFecha}
                  onChange={(newValue) => setFiltroFecha(newValue)}
                  format="MM/YYYY"
                  views={["year", "month"]}
                  openTo="month"
                  disableFuture
                  slotProps={{
                    textField: { size: "small", fullWidth: true },
                  }}
                />
              </LocalizationProvider>
            </Grid>
          )}

          {tipoReporte === "periodo" && (
            <>
              <Grid item size={{ xs: 12, md: 4 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Fecha Inicio"
                    value={fechaInicio}
                    onChange={(newValue) => setFechaInicio(newValue)}
                    format="DD/MM/YYYY"
                    views={["year", "month", "day"]}
                    disableFuture
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item size={{ xs: 12, md: 4 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Fecha Fin"
                    value={fechaFin}
                    onChange={(newValue) => setFechaFin(newValue)}
                    format="DD/MM/YYYY"
                    views={["year", "month", "day"]}
                    disableFuture
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            </>
          )}

          {tipoReporte === "total" && <Grid item size={{ xs: 12, md: 6 }} />}

          {(filtroFecha || fechaInicio || fechaFin) && (
            <Grid item size={{ xs: 12, md: 2 }}>
              <Button
                fullWidth
                size="small"
                variant="outlined"
                color="error"
                startIcon={<ClearIcon />}
                onClick={handleReset}
                sx={{ height: "40px" }}
              >
                Limpiar
              </Button>
            </Grid>
          )}

          <Grid item size={{ xs: 12 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              {tipoReporte === "mes"
                ? filtroFecha
                  ? `Mostrando reporte de gastos para ${filtroFecha.format("MMMM YYYY")}`
                  : "Selecciona un mes para ver el reporte de gastos de ese período"
                : tipoReporte === "total"
                ? "Mostrando reporte de todos los gastos de todos los períodos"
                : fechaInicio && fechaFin
                ? `Mostrando reporte de gastos del período ${fechaInicio.format("DD/MM/YYYY")} al ${fechaFin.format("DD/MM/YYYY")}`
                : "Selecciona un período para ver el reporte de gastos"}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Resumen en Tarjetas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <TrendingDownIcon color="error" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Total Gastos</Typography>
                  <Typography variant="h4" color="error.main" sx={{ fontWeight: "bold" }}>
                    S/{datosCalculados.totalGastos.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    gasto total
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <CategoryIcon color="warning" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Categorías</Typography>
                  <Typography variant="h4" color="warning.main" sx={{ fontWeight: "bold" }}>
                    {datosCalculados.categoriasUnicas}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    categorías diferentes
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <AccountBalanceIcon color="info" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Registros</Typography>
                  <Typography variant="h4" color="info.main" sx={{ fontWeight: "bold" }}>
                    {datosCalculados.totalRegistros}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    registros de gastos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla de Detalle por Categoría */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2, border: "1px solid #ffebee" }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "error.main" }}>
          Gastos por Categoría
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#ffebee" }}>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Categoría</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Cantidad</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Total (S/)</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Porcentaje</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {datosCalculados.gastosPorCategoria.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      {tipoReporte === "mes" && !filtroFecha
                        ? "Selecciona un mes para ver los datos"
                        : tipoReporte === "periodo" && (!fechaInicio || !fechaFin)
                        ? "Selecciona un período completo para ver los datos"
                        : "No hay datos para mostrar"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                datosCalculados.gastosPorCategoria.map((item) => (
                  <TableRow key={item.categoria} hover>
                    <TableCell align="center">
                      <Chip
                        label={CATEGORIAS_LABELS[item.categoria] || item.categoria}
                        color="error"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">{item.cantidad}</TableCell>
                    <TableCell align="center" sx={{ color: "error.main", fontWeight: 600 }}>
                      S/{item.total.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">{item.porcentaje}%</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Tabla de Detalle de Gastos */}
      <Paper elevation={2} sx={{ p: 2, borderRadius: 2, border: "1px solid #ffebee" }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "error.main" }}>
          Detalle de Gastos
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#ffebee" }}>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Fecha</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Categoría</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Descripción</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Monto (S/)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {datosCalculados.gastosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      {tipoReporte === "mes" && !filtroFecha
                        ? "Selecciona un mes para ver los datos"
                        : tipoReporte === "periodo" && (!fechaInicio || !fechaFin)
                        ? "Selecciona un período completo para ver los datos"
                        : "No hay datos para mostrar"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                datosCalculados.gastosFiltrados.map((gasto) => (
                  <TableRow key={gasto.id} hover>
                    <TableCell align="center">
                      {dayjs(gasto.fecha).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={CATEGORIAS_LABELS[gasto.categoria] || gasto.categoria}
                        color="error"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">{gasto.descripcion}</TableCell>
                    <TableCell align="center" sx={{ color: "error.main", fontWeight: 600 }}>
                      S/{Number(gasto.monto).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
