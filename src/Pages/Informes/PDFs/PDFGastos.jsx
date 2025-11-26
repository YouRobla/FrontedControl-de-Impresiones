import React from "react";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import dayjs from "dayjs";

const CATEGORIAS_LABELS = {
  papel: "Papel",
  tinta: "Tinta",
  mantenimiento: "Mantenimiento",
  reparacion: "Reparación",
  suministros: "Suministros",
  otros: "Otros",
};

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
    backgroundColor: "#ffebee",
    padding: 5,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ffebee",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ffebee",
    borderBottomStyle: "solid",
  },
  tableHeader: {
    backgroundColor: "#ffebee",
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
const PDFDocument = ({ tipoReporte, filtroFecha, fechaInicio, fechaFin, datos }) => {
  let periodoTexto = "";
  if (tipoReporte === "mes" && filtroFecha) {
    periodoTexto = filtroFecha.format("MMMM YYYY");
  } else if (tipoReporte === "periodo" && fechaInicio && fechaFin) {
    periodoTexto = `${fechaInicio.format("DD/MM/YYYY")} al ${fechaFin.format("DD/MM/YYYY")}`;
  } else {
    periodoTexto = "Todos los períodos";
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>REPORTE DE GASTOS</Text>
        <Text style={styles.subtitle}>Período: {periodoTexto}</Text>
        <Text style={styles.subtitle}>Fecha de generación: {dayjs().format("DD/MM/YYYY HH:mm")}</Text>

        {/* Resumen */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryItem}>
            <Text>Total Gastos</Text>
            <Text style={styles.summaryValue}>S/{datos.totalGastos.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text>Categorías</Text>
            <Text style={styles.summaryValue}>{datos.categoriasUnicas}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text>Registros</Text>
            <Text style={styles.summaryValue}>{datos.totalRegistros}</Text>
          </View>
        </View>

        {/* Gastos por Categoría */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gastos por Categoría</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Categoría</Text>
              <Text style={styles.tableCell}>Cantidad</Text>
              <Text style={styles.tableCell}>Total (S/)</Text>
              <Text style={styles.tableCell}>Porcentaje</Text>
            </View>
            {datos.gastosPorCategoria.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>
                  {CATEGORIAS_LABELS[item.categoria] || item.categoria}
                </Text>
                <Text style={styles.tableCell}>{item.cantidad}</Text>
                <Text style={styles.tableCell}>S/{item.total.toFixed(2)}</Text>
                <Text style={styles.tableCell}>{item.porcentaje}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Detalle de Gastos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalle de Gastos</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Fecha</Text>
              <Text style={styles.tableCell}>Categoría</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>Descripción</Text>
              <Text style={styles.tableCell}>Monto</Text>
            </View>
            {datos.gastosFiltrados.slice(0, 30).map((gasto) => (
              <View key={gasto.id} style={styles.tableRow}>
                <Text style={styles.tableCell}>{dayjs(gasto.fecha).format("DD/MM/YYYY")}</Text>
                <Text style={styles.tableCell}>
                  {CATEGORIAS_LABELS[gasto.categoria] || gasto.categoria}
                </Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>{gasto.descripcion}</Text>
                <Text style={styles.tableCell}>S/{Number(gasto.monto).toFixed(2)}</Text>
              </View>
            ))}
          </View>
          {datos.gastosFiltrados.length > 30 && (
            <Text style={{ fontSize: 8, marginTop: 5, color: "#666" }}>
              * Mostrando solo los primeros 30 registros de {datos.gastosFiltrados.length} totales
            </Text>
          )}
        </View>

        <Text style={styles.footer}>
          Generado el {dayjs().format("DD/MM/YYYY HH:mm")} - Control de Impresiones
        </Text>
      </Page>
    </Document>
  );
};

// Función para exportar PDF
export const PDFGastos = ({ tipoReporte, filtroFecha, fechaInicio, fechaFin, datos }) => {
  let nombreArchivo = "";
  if (tipoReporte === "mes" && filtroFecha) {
    nombreArchivo = `Reporte_Gastos_${filtroFecha.format("MMMM_YYYY")}_${dayjs().format("DDMMYYYY")}.pdf`;
  } else if (tipoReporte === "periodo" && fechaInicio && fechaFin) {
    nombreArchivo = `Reporte_Gastos_${fechaInicio.format("DDMMYYYY")}_${fechaFin.format("DDMMYYYY")}.pdf`;
  } else {
    nombreArchivo = `Reporte_Gastos_Total_${dayjs().format("DDMMYYYY")}.pdf`;
  }

  pdf(
    <PDFDocument
      tipoReporte={tipoReporte}
      filtroFecha={filtroFecha}
      fechaInicio={fechaInicio}
      fechaFin={fechaFin}
      datos={datos}
    />
  )
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

