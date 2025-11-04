import { Grid } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import PaletteIcon from "@mui/icons-material/Palette";
import BuildIcon from "@mui/icons-material/Build";
import CardDetail from "../../Components/CardDetail";
import { useContext } from "react";
import { GastosContext } from "../../Context/GastosContext";
import dayjs from "dayjs";

export default function ResumenGastos() {
  const { gastos } = useContext(GastosContext);

  // Calcular totales del mes actual
  const ahora = dayjs();
  const primerDiaMes = ahora.startOf("month").format("YYYY-MM-DD");
  const ultimoDiaMes = ahora.endOf("month").format("YYYY-MM-DD");

  const gastosMesActual = gastos.filter((gasto) => {
    const fechaGasto = gasto.fecha;
    return fechaGasto >= primerDiaMes && fechaGasto <= ultimoDiaMes;
  });

  const totalPapel = gastosMesActual
    .filter((g) => g.categoria === "papel")
    .reduce((acc, g) => acc + Number(g.monto || 0), 0);

  const totalTinta = gastosMesActual
    .filter((g) => g.categoria === "tinta")
    .reduce((acc, g) => acc + Number(g.monto || 0), 0);

  const totalMantenimiento = gastosMesActual
    .filter((g) => g.categoria === "mantenimiento")
    .reduce((acc, g) => acc + Number(g.monto || 0), 0);

  return (
    <Grid container spacing={3} sx={{mb:2}}>
      <Grid size={{ xs: 12, md: 4 }}>
        <CardDetail
          title="Papel"
          price={totalPapel.toFixed(2)}
          unit="total gastado"
          note="este mes"
          priceColor="error.main"
          icon={<DescriptionIcon sx={{ color: "error.main" }} />}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <CardDetail
          title="Tinta"
          price={totalTinta.toFixed(2)}
          unit="total gastado"
          note="este mes"
          priceColor="error.main"
          icon={<PaletteIcon sx={{ color: "error.main" }} />}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <CardDetail
          title="Mantenimiento"
          price={totalMantenimiento.toFixed(2)}
          unit="total gastado"
          note="este mes"
          priceColor="error.main"
          icon={<BuildIcon sx={{ color: "error.main" }} />}
        />
      </Grid>
    </Grid>
  );
}

