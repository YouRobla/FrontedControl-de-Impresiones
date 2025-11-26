import { useContext, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Chip,
} from "@mui/material";
import { NoteContext } from "../../Context/NoteContext";
import { GastosContext } from "../../Context/GastosContext";
import dayjs from "dayjs";

export default function TablaResumenInformes({ filtroFecha = null }) {
  const { notas, loading: loadingNotas } = useContext(NoteContext);
  const { gastos, loading: loadingGastos } = useContext(GastosContext);

  const loading = loadingNotas || loadingGastos;

  // Agrupar datos por mes
  const resumenPorMes = useMemo(() => {
    const mesesMap = new Map();

    // Procesar impresiones
    notas.forEach((nota) => {
      const fecha = dayjs(nota.fecha);
      const mesKey = fecha.format("YYYY-MM");
      const mesLabel = fecha.format("MMMM YYYY");

      if (!mesesMap.has(mesKey)) {
        mesesMap.set(mesKey, {
          mes: mesLabel,
          mesKey: mesKey,
          ingresos: 0,
          gastos: 0,
          impresiones: 0,
          paginas: 0,
        });
      }

      const mesData = mesesMap.get(mesKey);
      mesData.impresiones += 1;

      // Calcular ingresos de esta impresión
      const ingresosImpresion = nota.detalle_impresion?.reduce((sum, det) => {
        const paginas = Number(det.paginas || 0);
        mesData.paginas += paginas;
        return sum + Number(det.costo || 0);
      }, 0) || 0;

      mesData.ingresos += ingresosImpresion;
    });

    // Procesar gastos
    gastos.forEach((gasto) => {
      const fecha = dayjs(gasto.fecha);
      const mesKey = fecha.format("YYYY-MM");
      const mesLabel = fecha.format("MMMM YYYY");

      if (!mesesMap.has(mesKey)) {
        mesesMap.set(mesKey, {
          mes: mesLabel,
          mesKey: mesKey,
          ingresos: 0,
          gastos: 0,
          impresiones: 0,
          paginas: 0,
        });
      }

      const mesData = mesesMap.get(mesKey);
      mesData.gastos += Number(gasto.monto || 0);
    });

    // Convertir a array y ordenar por fecha descendente
    let resumenArray = Array.from(mesesMap.values()).map((mes) => ({
      ...mes,
      ganancia: mes.ingresos - mes.gastos,
    }));

    resumenArray = resumenArray.sort((a, b) => (a.mesKey > b.mesKey ? -1 : 1));

    // Si hay un filtro de fecha, filtrar solo ese mes
    if (filtroFecha) {
      const mesFiltro = filtroFecha.format("YYYY-MM");
      resumenArray = resumenArray.filter((mes) => mes.mesKey === mesFiltro);
    }

    return resumenArray;
  }, [notas, gastos, filtroFecha]);

  // Calcular totales
  const totales = useMemo(() => {
    return resumenPorMes.reduce(
      (acc, mes) => ({
        ingresos: acc.ingresos + mes.ingresos,
        gastos: acc.gastos + mes.gastos,
        impresiones: acc.impresiones + mes.impresiones,
        paginas: acc.paginas + mes.paginas,
      }),
      { ingresos: 0, gastos: 0, impresiones: 0, paginas: 0 }
    );
  }, [resumenPorMes]);

  const gananciaTotal = totales.ingresos - totales.gastos;

  if (loading) {
    return (
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ mb: 4, p: 2, borderRadius: 2, border: "1px solid #e3f2fd" }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "info.main" }}>
        Resumen Mensual
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Mes
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Impresiones
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Páginas
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Ingresos (S/)
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Gastos (S/)
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Ganancia Neta (S/)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resumenPorMes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="textSecondary">
                    No hay datos para mostrar
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {resumenPorMes.map((mes) => (
                  <TableRow key={mes.mesKey} hover>
                    <TableCell align="center" sx={{ fontWeight: 500 }}>
                      {mes.mes.charAt(0).toUpperCase() + mes.mes.slice(1)}
                    </TableCell>
                    <TableCell align="center">{mes.impresiones}</TableCell>
                    <TableCell align="center">{mes.paginas}</TableCell>
                    <TableCell align="center" sx={{ color: "success.main", fontWeight: 600 }}>
                      S/{mes.ingresos.toFixed(2)}
                    </TableCell>
                    <TableCell align="center" sx={{ color: "error.main", fontWeight: 600 }}>
                      S/{mes.gastos.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`S/${mes.ganancia.toFixed(2)}`}
                        color={mes.ganancia >= 0 ? "success" : "error"}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}

                {/* Fila de totales */}
                <TableRow sx={{ backgroundColor: "#f5f5f5", borderTop: "2px solid #1976d2" }}>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>
                    TOTAL
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>
                    {totales.impresiones}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>
                    {totales.paginas}
                  </TableCell>
                  <TableCell align="center" sx={{ color: "success.main", fontWeight: 700 }}>
                    S/{totales.ingresos.toFixed(2)}
                  </TableCell>
                  <TableCell align="center" sx={{ color: "error.main", fontWeight: 700 }}>
                    S/{totales.gastos.toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={`S/${gananciaTotal.toFixed(2)}`}
                      color={gananciaTotal >= 0 ? "success" : "error"}
                      size="medium"
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

