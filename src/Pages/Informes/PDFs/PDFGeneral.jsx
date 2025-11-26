import React from "react";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import dayjs from "dayjs";

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
    color: "#666",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    backgroundColor: "#e3f2fd",
    padding: 5,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e3f2fd",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e3f2fd",
    borderBottomStyle: "solid",
  },
  tableHeader: {
    backgroundColor: "#e3f2fd",
    fontWeight: "bold",
  },
  tableCell: {
    padding: 5,
    fontSize: 9,
    flex: 1,
  },
  summaryBox: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#999",
  },
});

// Componente del documento PDF
const PDFDocument = ({ periodoTexto, datos }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>REPORTE GENERAL</Text>
        <Text style={styles.subtitle}>Período: {periodoTexto}</Text>
        <Text style={styles.subtitle}>Fecha de generación: {dayjs().format("DD/MM/YYYY HH:mm")}</Text>

        {/* Resumen */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryItem}>
            <Text>Ingresos</Text>
            <Text style={styles.summaryValue}>S/{datos.totalIngresos.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text>Gastos</Text>
            <Text style={styles.summaryValue}>S/{datos.totalGastos.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text>Ganancia Neta</Text>
            <Text style={styles.summaryValue}>S/{datos.gananciaNeta.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text>Rentabilidad</Text>
            <Text style={styles.summaryValue}>{datos.rentabilidad}%</Text>
          </View>
        </View>

        {/* Resumen de Ingresos y Gastos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen de Ingresos y Gastos</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Concepto</Text>
              <Text style={styles.tableCell}>Monto (S/)</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Ingresos por Impresiones</Text>
              <Text style={styles.tableCell}>S/{datos.totalIngresos.toFixed(2)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Total Ingresos</Text>
              <Text style={styles.tableCell}>S/{datos.totalIngresos.toFixed(2)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Gastos en Papel</Text>
              <Text style={styles.tableCell}>S/{datos.gastosPapel.toFixed(2)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Gastos en Tinta</Text>
              <Text style={styles.tableCell}>S/{datos.gastosTinta.toFixed(2)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Gastos en Mantenimiento</Text>
              <Text style={styles.tableCell}>S/{datos.gastosMantenimiento.toFixed(2)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Otros Gastos</Text>
              <Text style={styles.tableCell}>S/{datos.otrosGastos.toFixed(2)}</Text>
            </View>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Total Gastos</Text>
              <Text style={styles.tableCell}>S/{datos.totalGastos.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Métricas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Métricas Generales</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Métrica</Text>
              <Text style={styles.tableCell}>Valor</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Total Impresiones</Text>
              <Text style={styles.tableCell}>{datos.totalImpresiones}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Total Páginas</Text>
              <Text style={styles.tableCell}>{datos.totalPaginas}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Ganancia Neta</Text>
              <Text style={styles.tableCell}>S/{datos.gananciaNeta.toFixed(2)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Rentabilidad</Text>
              <Text style={styles.tableCell}>{datos.rentabilidad}%</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Estado</Text>
              <Text style={styles.tableCell}>
                {datos.gananciaNeta >= 0 ? "Rentable" : "Pérdida"}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>
          Generado el {dayjs().format("DD/MM/YYYY HH:mm")} - Control de Impresiones
        </Text>
      </Page>
    </Document>
  );
};

// Función para exportar PDF
export const PDFGeneral = ({ filtroFecha, datos, periodoTexto }) => {
  const nombreArchivo = `Reporte_General_${periodoTexto.replace(/\s/g, "_")}_${dayjs().format("DDMMYYYY")}.pdf`;

  pdf(<PDFDocument periodoTexto={periodoTexto} datos={datos} />)
    .toBlob()
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = nombreArchivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error("Error al generar PDF:", error);
      alert("Error al generar el PDF. Por favor, intenta nuevamente.");
    });
};

