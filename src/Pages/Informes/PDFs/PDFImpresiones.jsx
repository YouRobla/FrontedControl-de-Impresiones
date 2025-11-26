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
const PDFDocument = ({ tipoReporte, filtroFecha, datos }) => {
  const periodoTexto = tipoReporte === "mes" && filtroFecha
    ? filtroFecha.format("MMMM YYYY")
    : "Todos los meses";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>REPORTE DE IMPRESIONES</Text>
        <Text style={styles.subtitle}>Período: {periodoTexto}</Text>
        <Text style={styles.subtitle}>Fecha de generación: {dayjs().format("DD/MM/YYYY HH:mm")}</Text>

        {/* Resumen */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryItem}>
            <Text>Total Impresiones</Text>
            <Text style={styles.summaryValue}>{datos.totalImpresiones}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text>Total Páginas</Text>
            <Text style={styles.summaryValue}>{datos.totalPaginas}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text>Total Ingresos</Text>
            <Text style={styles.summaryValue}>S/{datos.totalIngresos.toFixed(2)}</Text>
          </View>
        </View>

        {/* Detalle */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalle de Impresiones</Text>
          <View style={styles.table}>
            {/* Encabezado */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Fecha</Text>
              <Text style={styles.tableCell}>Usuario</Text>
              <Text style={styles.tableCell}>Tipo</Text>
              <Text style={styles.tableCell}>Páginas</Text>
              <Text style={styles.tableCell}>Ingreso</Text>
            </View>
            {/* Filas */}
            {datos.filasDetalle.map((fila, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{dayjs(fila.fecha).format("DD/MM/YYYY")}</Text>
                <Text style={styles.tableCell}>{fila.usuario}</Text>
                <Text style={styles.tableCell}>{fila.tipo}</Text>
                <Text style={styles.tableCell}>{fila.paginas}</Text>
                <Text style={styles.tableCell}>S/{Number(fila.ingreso).toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Resumen mensual si es total */}
        {tipoReporte === "total" && datos.resumenPorMes && datos.resumenPorMes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumen por Mes</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.tableCell}>Mes</Text>
                <Text style={styles.tableCell}>Impresiones</Text>
                <Text style={styles.tableCell}>Páginas</Text>
                <Text style={styles.tableCell}>Ingresos</Text>
              </View>
              {datos.resumenPorMes.map((mes) => (
                <View key={mes.mesKey} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{mes.mes}</Text>
                  <Text style={styles.tableCell}>{mes.impresiones}</Text>
                  <Text style={styles.tableCell}>{mes.paginas}</Text>
                  <Text style={styles.tableCell}>S/{mes.ingresos.toFixed(2)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <Text style={styles.footer}>
          Generado el {dayjs().format("DD/MM/YYYY HH:mm")} - Control de Impresiones
        </Text>
      </Page>
    </Document>
  );
};

// Función para exportar PDF
export const PDFImpresiones = ({ tipoReporte, filtroFecha, datos }) => {
  const periodoTexto = tipoReporte === "mes" && filtroFecha
    ? filtroFecha.format("MMMM_YYYY")
    : "Todos_los_meses";
  
  const nombreArchivo = `Reporte_Impresiones_${periodoTexto}_${dayjs().format("DDMMYYYY")}.pdf`;

  // Generar blob y descargar
  pdf(<PDFDocument tipoReporte={tipoReporte} filtroFecha={filtroFecha} datos={datos} />)
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

