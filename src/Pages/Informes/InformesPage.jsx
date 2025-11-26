import { useState } from "react";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AssessmentIcon from "@mui/icons-material/Assessment";
import InformesHeader from "./InformesHeader";
import ReporteImpresiones from "./ReporteImpresiones";
import ReporteGastos from "./ReporteGastos";
import ReporteGeneral from "./ReporteGeneral";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`informes-tabpanel-${index}`}
      aria-labelledby={`informes-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `informes-tab-${index}`,
    "aria-controls": `informes-tabpanel-${index}`,
  };
}

export default function InformesPage() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <InformesHeader />

      <Paper elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="tipos de reportes"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTab-root": {
              minHeight: 72,
            },
          }}
        >
          <Tab
            icon={<PrintIcon />}
            iconPosition="start"
            label="Reporte de Impresiones"
            {...a11yProps(0)}
            sx={{ textTransform: "none", fontSize: "0.95rem", fontWeight: 600 }}
          />
          <Tab
            icon={<ReceiptIcon />}
            iconPosition="start"
            label="Reporte de Gastos"
            {...a11yProps(1)}
            sx={{ textTransform: "none", fontSize: "0.95rem", fontWeight: 600 }}
          />
          <Tab
            icon={<AssessmentIcon />}
            iconPosition="start"
            label="Reporte General"
            {...a11yProps(2)}
            sx={{ textTransform: "none", fontSize: "0.95rem", fontWeight: 600 }}
          />
        </Tabs>
      </Paper>

      <TabPanel value={value} index={0}>
        <ReporteImpresiones />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ReporteGastos />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ReporteGeneral />
      </TabPanel>
    </>
  );
}
