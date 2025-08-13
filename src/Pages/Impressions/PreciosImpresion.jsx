import { Grid } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import PaletteIcon from "@mui/icons-material/Palette";
import CardDetail from "../../Components/CardDetail";

export default function PreciosImpresion() {
  return (
    <Grid container spacing={3} sx={{mb:2}}>
      <Grid size={{ xs: 12, md: 6 }}>
        <CardDetail
          title="Blanco y Negro"
          price="0.10"
          unit="por página"
          note="precio habitual"
          icon={<PrintIcon sx={{ color: "grey.600" }} />}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <CardDetail
          title="A Color"
          price="0.20"
          unit="por página"
          note="precio habitual"
          priceColor="primary.main"
          icon={<PaletteIcon sx={{ color: "primary.main" }} />}
        />
      </Grid>
    </Grid>
  );
}
