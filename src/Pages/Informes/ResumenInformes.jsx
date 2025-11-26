import { Grid } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import CardDetail from "../../Components/CardDetail";
import { useContext } from "react";
import { NoteContext } from "../../Context/NoteContext";
import { GastosContext } from "../../Context/GastosContext";
import dayjs from "dayjs";

export default function ResumenInformes({ filtroFecha = null }) {
  const { notas } = useContext(NoteContext);
  const { gastos } = useContext(GastosContext);

  // Calcular estadísticas del mes seleccionado o mes actual
  const fechaBase = filtroFecha || dayjs();
  const primerDiaMes = fechaBase.startOf("month").format("YYYY-MM-DD");
  const ultimoDiaMes = fechaBase.endOf("month").format("YYYY-MM-DD");

  // Impresiones del mes
  const impresionesMesActual = notas.filter((nota) => {
    const fechaImpresion = nota.fecha;
    return fechaImpresion >= primerDiaMes && fechaImpresion <= ultimoDiaMes;
  });

  // Calcular ingresos por impresiones
  const totalIngresos = impresionesMesActual.reduce((acc, nota) => {
    const totalDetalle = nota.detalle_impresion?.reduce((sum, det) => {
      return sum + Number(det.costo || 0);
    }, 0) || 0;
    return acc + totalDetalle;
  }, 0);

  // Gastos del mes
  const gastosMesActual = gastos.filter((gasto) => {
    const fechaGasto = gasto.fecha;
    return fechaGasto >= primerDiaMes && fechaGasto <= ultimoDiaMes;
  });

  const totalGastos = gastosMesActual.reduce((acc, g) => acc + Number(g.monto || 0), 0);

  // Calcular ganancia neta
  const gananciaNeta = totalIngresos - totalGastos;

  // Total de páginas impresas
  const totalPaginas = impresionesMesActual.reduce((acc, nota) => {
    const paginasDetalle = nota.detalle_impresion?.reduce((sum, det) => {
      return sum + Number(det.paginas || 0);
    }, 0) || 0;
    return acc + paginasDetalle;
  }, 0);

  // Total de impresiones (registros)
  const totalImpresiones = impresionesMesActual.length;

  // Texto del período
  const periodoTexto = filtroFecha ? filtroFecha.format("MMMM YYYY") : "este mes";

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid size={{ xs: 12, md: 3 }}>
        <CardDetail
          title="Ingresos"
          price={totalIngresos.toFixed(2)}
          unit={periodoTexto}
          priceColor="success.main"
          icon={<TrendingUpIcon sx={{ color: "success.main" }} />}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <CardDetail
          title="Gastos"
          price={totalGastos.toFixed(2)}
          unit={periodoTexto}
          priceColor="error.main"
          icon={<TrendingDownIcon sx={{ color: "error.main" }} />}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <CardDetail
          title="Ganancia Neta"
          price={gananciaNeta.toFixed(2)}
          unit={periodoTexto}
          priceColor={gananciaNeta >= 0 ? "success.main" : "error.main"}
          icon={<AccountBalanceIcon sx={{ color: gananciaNeta >= 0 ? "success.main" : "error.main" }} />}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <CardDetail
          title="Total Impresiones"
          price={totalImpresiones.toString()}
          unit={`${totalPaginas} páginas`}
          note={periodoTexto}
          priceColor="info.main"
          showCurrency={false}
          icon={<PrintIcon sx={{ color: "info.main" }} />}
        />
      </Grid>
    </Grid>
  );
}

