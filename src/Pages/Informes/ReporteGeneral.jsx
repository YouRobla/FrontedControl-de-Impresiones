import { useState, useContext, useMemo, useEffect } from "react";
import {
  Paper,
  Typography,
  Grid,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Chip,
  CircularProgress,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ClearIcon from "@mui/icons-material/Clear";
import { NoteContext } from "../../Context/NoteContext";
import { GastosContext } from "../../Context/GastosContext";
import { supabase } from "../../supabaseClient";
import dayjs from "dayjs";
import { PDFGeneral } from "./PDFs/PDFGeneral";

export default function ReporteGeneral() {
  const { loading: loadingNotas } = useContext(NoteContext);
  const { loading: loadingGastos } = useContext(GastosContext);
  const [filtroFecha, setFiltroFecha] = useState(null);
  const [todasLasImpresiones, setTodasLasImpresiones] = useState([]);
  const [todosLosGastos, setTodosLosGastos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener todos los datos
  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      try {
        const [impresionesRes, gastosRes] = await Promise.all([
          supabase
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
            .order("fecha", { ascending: false }),
          supabase
            .from("gastos")
            .select("*")
            .order("fecha", { ascending: false }),
        ]);

        if (impresionesRes.error) throw impresionesRes.error;
        if (gastosRes.error) throw gastosRes.error;

        setTodasLasImpresiones(impresionesRes.data || []);
        setTodosLosGastos(gastosRes.data || []);
      } catch (err) {
        console.error("Error al obtener datos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  // Calcular datos del mes
  const datosCalculados = useMemo(() => {
    const fechaBase = filtroFecha || dayjs();
    const primerDiaMes = fechaBase.startOf("month").format("YYYY-MM-DD");
    const ultimoDiaMes = fechaBase.endOf("month").format("YYYY-MM-DD");

    // Impresiones del mes
    const impresionesMes = todasLasImpresiones.filter(nota => {
      return nota.fecha >= primerDiaMes && nota.fecha <= ultimoDiaMes;
    });

    // Calcular ingresos
    const totalIngresos = impresionesMes.reduce((acc, nota) => {
      const ingresosDetalle = nota.detalle_impresion?.reduce((sum, det) => 
        sum + Number(det.costo || 0), 0) || 0;
      return acc + ingresosDetalle;
    }, 0);

    const totalImpresiones = impresionesMes.length;
    const totalPaginas = impresionesMes.reduce((acc, nota) => {
      const paginasDetalle = nota.detalle_impresion?.reduce((sum, det) => 
        sum + Number(det.paginas || 0), 0) || 0;
      return acc + paginasDetalle;
    }, 0);

    // Gastos del mes
    const gastosMes = todosLosGastos.filter(gasto => {
      return gasto.fecha >= primerDiaMes && gasto.fecha <= ultimoDiaMes;
    });

    const gastosPapel = gastosMes
      .filter(g => g.categoria === "papel")
      .reduce((acc, g) => acc + Number(g.monto || 0), 0);

    const gastosTinta = gastosMes
      .filter(g => g.categoria === "tinta")
      .reduce((acc, g) => acc + Number(g.monto || 0), 0);

    const gastosMantenimiento = gastosMes
      .filter(g => g.categoria === "mantenimiento")
      .reduce((acc, g) => acc + Number(g.monto || 0), 0);

    const otrosGastos = gastosMes
      .filter(g => !["papel", "tinta", "mantenimiento"].includes(g.categoria))
      .reduce((acc, g) => acc + Number(g.monto || 0), 0);

    const totalGastos = gastosPapel + gastosTinta + gastosMantenimiento + otrosGastos;

    // Calcular ganancia y rentabilidad
    const gananciaNeta = totalIngresos - totalGastos;
    const rentabilidad = totalIngresos > 0 
      ? ((gananciaNeta / totalIngresos) * 100).toFixed(2) 
      : 0;

    return {
      totalIngresos,
      totalGastos,
      gananciaNeta,
      rentabilidad,
      totalImpresiones,
      totalPaginas,
      gastosPapel,
      gastosTinta,
      gastosMantenimiento,
      otrosGastos,
    };
  }, [todasLasImpresiones, todosLosGastos, filtroFecha]);

  const handleReset = () => {
    setFiltroFecha(null);
  };

  const handleExportarPDF = () => {
    PDFGeneral({
      filtroFecha,
      datos: datosCalculados,
      periodoTexto: filtroFecha 
        ? filtroFecha.format("MMMM YYYY")
        : dayjs().format("MMMM YYYY")
    });
  };

  if (loading || loadingNotas || loadingGastos) {
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
            <Typography variant="h6" sx={{ fontWeight: 600, color: "info.main" }}>
              Filtros del Reporte General
            </Typography>
          </Grid>
          <Grid item size={{ xs: 12, md: 4 }} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="info"
              startIcon={<PictureAsPdfIcon />}
              onClick={handleExportarPDF}
            >
              Exportar PDF
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="flex-end">
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

          {filtroFecha && (
            <Grid item size={{ xs: 12, md: 2 }}>
              <Button
                fullWidth
                size="small"
                variant="outlined"
                color="info"
                startIcon={<ClearIcon />}
                onClick={handleReset}
                sx={{ height: "40px" }}
              >
                Todos
              </Button>
            </Grid>
          )}

          {!filtroFecha && <Grid item size={{ xs: 12, md: 2 }} />}

          <Grid item size={{ xs: 12 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              {filtroFecha
                ? `Mostrando reporte general para ${filtroFecha.format("MMMM YYYY")}. Incluye ingresos, gastos y ganancias netas.`
                : `Mostrando reporte general del mes actual (${dayjs().format("MMMM YYYY")}). Selecciona un mes específico o deja vacío para ver el mes actual.`}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Resumen en Tarjetas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <TrendingUpIcon color="success" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Ingresos</Typography>
                  <Typography variant="h4" color="success.main" sx={{ fontWeight: "bold" }}>
                    S/{datosCalculados.totalIngresos.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    total ingresos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <TrendingDownIcon color="error" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Gastos</Typography>
                  <Typography variant="h4" color="error.main" sx={{ fontWeight: "bold" }}>
                    S/{datosCalculados.totalGastos.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    total gastos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <AccountBalanceIcon color="info" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Ganancia Neta</Typography>
                  <Typography 
                    variant="h4" 
                    color={datosCalculados.gananciaNeta >= 0 ? "success.main" : "error.main"} 
                    sx={{ fontWeight: "bold" }}
                  >
                    S/{datosCalculados.gananciaNeta.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    resultado final
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <AssessmentIcon color="warning" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Rentabilidad</Typography>
                  <Typography variant="h4" color="warning.main" sx={{ fontWeight: "bold" }}>
                    {datosCalculados.rentabilidad}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    porcentaje
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla Resumen Mensual */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2, border: "1px solid #e3f2fd" }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "info.main" }}>
          Resumen General del Mes
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                    <TableCell sx={{ fontWeight: 600 }}>Concepto</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Monto (S/)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Ingresos por Impresiones</TableCell>
                    <TableCell align="right" sx={{ color: "success.main", fontWeight: 600 }}>
                      S/{datosCalculados.totalIngresos.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Ingresos</TableCell>
                    <TableCell align="right" sx={{ color: "success.main", fontWeight: 700 }}>
                      S/{datosCalculados.totalIngresos.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Gastos en Papel</TableCell>
                    <TableCell align="right" sx={{ color: "error.main" }}>
                      S/{datosCalculados.gastosPapel.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Gastos en Tinta</TableCell>
                    <TableCell align="right" sx={{ color: "error.main" }}>
                      S/{datosCalculados.gastosTinta.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Gastos en Mantenimiento</TableCell>
                    <TableCell align="right" sx={{ color: "error.main" }}>
                      S/{datosCalculados.gastosMantenimiento.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Otros Gastos</TableCell>
                    <TableCell align="right" sx={{ color: "error.main" }}>
                      S/{datosCalculados.otrosGastos.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Gastos</TableCell>
                    <TableCell align="right" sx={{ color: "error.main", fontWeight: 700 }}>
                      S/{datosCalculados.totalGastos.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                    <TableCell sx={{ fontWeight: 600 }}>Métrica</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Valor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Total Impresiones</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      {datosCalculados.totalImpresiones}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Páginas</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      {datosCalculados.totalPaginas}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Ganancia Neta</TableCell>
                    <TableCell align="right">
                      <Chip 
                        label={`S/${datosCalculados.gananciaNeta.toFixed(2)}`} 
                        color={datosCalculados.gananciaNeta >= 0 ? "success" : "error"} 
                        size="small" 
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Rentabilidad</TableCell>
                    <TableCell align="right">
                      <Chip 
                        label={`${datosCalculados.rentabilidad}%`} 
                        color={Number(datosCalculados.rentabilidad) >= 0 ? "success" : "error"} 
                        size="small" 
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Estado</TableCell>
                    <TableCell align="right">
                      <Chip 
                        label={datosCalculados.gananciaNeta >= 0 ? "Rentable" : "Pérdida"} 
                        color={datosCalculados.gananciaNeta >= 0 ? "success" : "error"} 
                        size="small" 
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Paper>

      {/* Gráfico o Visualización (placeholder) */}
      <Paper elevation={2} sx={{ p: 2, borderRadius: 2, border: "1px solid #e3f2fd" }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "info.main" }}>
          Visualización Comparativa
        </Typography>
        <Box
          sx={{
            height: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f5f5",
            borderRadius: 2,
          }}
        >
          <Typography variant="body1" color="textSecondary">
            {filtroFecha
              ? `Gráfico comparativo de ingresos vs gastos para ${filtroFecha.format("MMMM YYYY")}`
              : `Gráfico comparativo de ingresos vs gastos del mes actual (${dayjs().format("MMMM YYYY")})`}
            <br />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              (Área reservada para gráficos - se implementará después)
            </Typography>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
