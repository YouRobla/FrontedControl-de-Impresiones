import { useContext } from "react";
import { Grid, Card, CardContent, Box, Typography, CircularProgress } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useDashboard } from "./DashboardDataProvider";

export default function ResumenDashboard() {
  const { data, loading } = useDashboard();
  const { totales } = data;

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 3 } }}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card elevation={2}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <PrintIcon color="primary" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Total Impresiones
                </Typography>
                <Typography variant="h5" color="primary.main" sx={{ fontWeight: "bold" }}>
                  {totales.impresiones.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card elevation={2}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <TrendingUpIcon color="success" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Total Ingresos
                </Typography>
                <Typography variant="h5" color="success.main" sx={{ fontWeight: "bold" }}>
                  S/{totales.ingresos.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card elevation={2}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <TrendingDownIcon color="error" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Total Gastos
                </Typography>
                <Typography variant="h5" color="error.main" sx={{ fontWeight: "bold" }}>
                  S/{totales.gastos.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card elevation={2}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <AccountBalanceWalletIcon color="info" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Ganancia Neta
                </Typography>
                <Typography variant="h5" color="info.main" sx={{ fontWeight: "bold" }}>
                  S/{totales.gananciaNeta.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
