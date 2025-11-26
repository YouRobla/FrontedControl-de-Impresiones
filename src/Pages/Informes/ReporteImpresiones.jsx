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
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DescriptionIcon from "@mui/icons-material/Description";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ClearIcon from "@mui/icons-material/Clear";
import { NoteContext } from "../../Context/NoteContext";
import { supabase } from "../../supabaseClient";
import dayjs from "dayjs";
import { PDFImpresiones } from "./PDFs/PDFImpresiones";

export default function ReporteImpresiones() {
  const { loading: loadingContext } = useContext(NoteContext);
  const [tipoReporte, setTipoReporte] = useState("mes");
  const [filtroFecha, setFiltroFecha] = useState(null);
  const [todasLasImpresiones, setTodasLasImpresiones] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener todas las impresiones
  useEffect(() => {
    const fetchTodas = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("impresiones")
          .select(`
            id,
            usuario,
            fecha,
            detalle_impresion (
              id,
              tipo,
              paginas,
              costo
            )
          `)
          .order("fecha", { ascending: false });

        if (error) throw error;
        setTodasLasImpresiones(data || []);
      } catch (err) {
        console.error("Error al obtener impresiones:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTodas();
  }, []);

  // Calcular datos según filtros
  const datosCalculados = useMemo(() => {
    let impresionesFiltradas = [...todasLasImpresiones];

    // Filtrar por mes si es necesario
    if (tipoReporte === "mes" && filtroFecha) {
      const mesFiltro = filtroFecha.format("YYYY-MM");
      impresionesFiltradas = impresionesFiltradas.filter(nota => {
        const mesNota = dayjs(nota.fecha).format("YYYY-MM");
        return mesNota === mesFiltro;
      });
    }

    // Calcular totales
    const totalImpresiones = impresionesFiltradas.length;
    const totalPaginas = impresionesFiltradas.reduce((acc, nota) => {
      const paginasDetalle = nota.detalle_impresion?.reduce((sum, det) => 
        sum + Number(det.paginas || 0), 0) || 0;
      return acc + paginasDetalle;
    }, 0);

    const totalIngresos = impresionesFiltradas.reduce((acc, nota) => {
      const ingresosDetalle = nota.detalle_impresion?.reduce((sum, det) => 
        sum + Number(det.costo || 0), 0) || 0;
      return acc + ingresosDetalle;
    }, 0);

    // Expandir detalles para tabla
    const filasDetalle = [];
    impresionesFiltradas.forEach(nota => {
      nota.detalle_impresion?.forEach(detalle => {
        filasDetalle.push({
          fecha: nota.fecha,
          usuario: nota.usuario,
          tipo: detalle.tipo,
          paginas: detalle.paginas,
          ingreso: detalle.costo
        });
      });
    });

    // Resumen mensual (solo si es "total")
    let resumenPorMes = [];
    if (tipoReporte === "total") {
      const mesesMap = new Map();
      todasLasImpresiones.forEach(nota => {
        const mes = dayjs(nota.fecha).format("YYYY-MM");
        const mesLabel = dayjs(nota.fecha).format("MMMM YYYY");

        if (!mesesMap.has(mes)) {
          mesesMap.set(mes, {
            mes: mesLabel,
            mesKey: mes,
            impresiones: 0,
            paginas: 0,
            ingresos: 0
          });
        }

        const mesData = mesesMap.get(mes);
        mesData.impresiones += 1;
        nota.detalle_impresion?.forEach(det => {
          mesData.paginas += Number(det.paginas || 0);
          mesData.ingresos += Number(det.costo || 0);
        });
      });

      resumenPorMes = Array.from(mesesMap.values()).sort((a, b) => 
        a.mesKey > b.mesKey ? -1 : 1
      );
    }

    return {
      totalImpresiones,
      totalPaginas,
      totalIngresos,
      filasDetalle,
      resumenPorMes
    };
  }, [todasLasImpresiones, tipoReporte, filtroFecha]);

  const handleReset = () => {
    setFiltroFecha(null);
  };

  const handleExportarPDF = () => {
    PDFImpresiones({
      tipoReporte,
      filtroFecha,
      datos: datosCalculados,
      todasLasImpresiones: tipoReporte === "total" ? todasLasImpresiones : undefined
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
            <Typography variant="h6" sx={{ fontWeight: 600, color: "primary.main" }}>
              Filtros del Reporte
            </Typography>
          </Grid>
          <Grid item size={{ xs: 12, md: 4 }} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PictureAsPdfIcon />}
              onClick={handleExportarPDF}
              disabled={tipoReporte === "mes" && !filtroFecha}
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
                onChange={(e) => setTipoReporte(e.target.value)}
                size="small"
              >
                <MenuItem value="mes">Por Mes</MenuItem>
                <MenuItem value="total">Todos los Meses</MenuItem>
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

          {tipoReporte === "total" && <Grid item size={{ xs: 12, md: 6 }} />}

          {filtroFecha && (
            <Grid item size={{ xs: 12, md: 2 }}>
              <Button
                fullWidth
                size="small"
                variant="outlined"
                color="primary"
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
                  ? `Mostrando reporte de impresiones para ${filtroFecha.format("MMMM YYYY")}`
                  : "Selecciona un mes para ver el reporte de impresiones de ese período"
                : "Mostrando reporte de todas las impresiones de todos los meses"}
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
                <PrintIcon color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Total Impresiones</Typography>
                  <Typography variant="h4" color="primary.main" sx={{ fontWeight: "bold" }}>
                    {datosCalculados.totalImpresiones}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    registros
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
                <DescriptionIcon color="info" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Total Páginas</Typography>
                  <Typography variant="h4" color="info.main" sx={{ fontWeight: "bold" }}>
                    {datosCalculados.totalPaginas}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    páginas impresas
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
                <TrendingUpIcon color="success" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Total Ingresos</Typography>
                  <Typography variant="h4" color="success.main" sx={{ fontWeight: "bold" }}>
                    S/{datosCalculados.totalIngresos.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ingresos generados
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla de Detalle */}
      <Paper elevation={2} sx={{ p: 2, borderRadius: 2, border: "1px solid #e3f2fd" }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "primary.main" }}>
          Detalle de Impresiones
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Fecha</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Usuario</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Tipo</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Páginas</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Ingreso (S/)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {datosCalculados.filasDetalle.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      {tipoReporte === "mes" && !filtroFecha
                        ? "Selecciona un mes para ver los datos"
                        : "No hay datos para mostrar"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                datosCalculados.filasDetalle.map((fila, index) => (
                  <TableRow key={index} hover>
                    <TableCell align="center">
                      {dayjs(fila.fecha).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell align="center">{fila.usuario}</TableCell>
                    <TableCell align="center">{fila.tipo}</TableCell>
                    <TableCell align="center">{fila.paginas}</TableCell>
                    <TableCell align="center" sx={{ color: "success.main", fontWeight: 600 }}>
                      S/{Number(fila.ingreso).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Resumen Mensual (solo si es "total") */}
      {tipoReporte === "total" && datosCalculados.resumenPorMes.length > 0 && (
        <Paper elevation={2} sx={{ p: 2, mt: 3, borderRadius: 2, border: "1px solid #e3f2fd" }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "primary.main" }}>
            Resumen por Mes
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Mes</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Impresiones</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Total Páginas</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Total Ingresos (S/)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {datosCalculados.resumenPorMes.map((mes) => (
                  <TableRow key={mes.mesKey} hover>
                    <TableCell align="center" sx={{ fontWeight: 500 }}>
                      {mes.mes.charAt(0).toUpperCase() + mes.mes.slice(1)}
                    </TableCell>
                    <TableCell align="center">{mes.impresiones}</TableCell>
                    <TableCell align="center">{mes.paginas}</TableCell>
                    <TableCell align="center" sx={{ color: "success.main", fontWeight: 600 }}>
                      S/{mes.ingresos.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}
