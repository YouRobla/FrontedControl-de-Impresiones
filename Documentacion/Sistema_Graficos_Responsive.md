# Sistema de Gráficos Responsive

## Descripción General

Se implementó un sistema de gráficos completamente responsive que se adapta automáticamente a diferentes tamaños de pantalla (móvil, tablet y desktop) utilizando un hook personalizado y tecnologías modernas de React.

## Componentes Principales

### Hook `useChartDimensions`

Hook personalizado que calcula dinámicamente las dimensiones de los gráficos según el tamaño de la pantalla y el contenedor.

```1:56:src/hooks/useChartDimensions.js
import { useState, useEffect, useRef } from "react";
import { useTheme, useMediaQuery } from "@mui/material";

/**
 * Hook personalizado para calcular dimensiones responsive de gráficos
 * @returns {Object} { width, height, containerRef, isMobile }
 */
export const useChartDimensions = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const containerRef = useRef(null);
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(280);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        
        // Ajustar ancho según el tamaño de pantalla
        if (isMobile) {
          // En móvil, usar todo el ancho disponible menos padding
          setWidth(Math.max(containerWidth - 32, 300));
          setHeight(250); // Altura más pequeña en móvil
        } else if (isTablet) {
          // En tablet, usar ancho completo menos padding
          setWidth(Math.max(containerWidth - 24, 400));
          setHeight(280);
        } else {
          // En desktop, usar ancho completo
          setWidth(containerWidth);
          setHeight(280);
        }
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    
    // Usar ResizeObserver para detectar cambios en el contenedor
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateDimensions);
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [isMobile, isTablet]);

  return { width, height, containerRef, isMobile };
};
```

### Características Clave

1. **Detección de Breakpoints**: Utiliza `useMediaQuery` de Material-UI para detectar móvil, tablet y desktop
2. **ResizeObserver**: Detecta cambios en el tamaño del contenedor automáticamente
3. **Event Listener**: Escucha cambios en el tamaño de la ventana
4. **Limpieza de Recursos**: Limpia correctamente los listeners y observers al desmontar

## Implementación en Componentes de Gráficos

### Ejemplo: Gráfico de Impresiones

```6:78:src/Pages/Dashboard/GraficoImpresiones.jsx
export default function GraficoImpresiones() {
  const { data, loading } = useDashboard();
  const { width, height, containerRef, isMobile } = useChartDimensions();

  if (loading) {
    return (
      <Paper elevation={2} sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: height }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 2, height: "100%" }}>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2, 
          fontWeight: 600, 
          color: "primary.main",
          fontSize: { xs: "1rem", sm: "1.25rem" }
        }}
      >
        Impresiones Mensuales
      </Typography>
      <Box 
        ref={containerRef} 
        sx={{ 
          width: "100%", 
          minHeight: height,
          overflowX: "auto",
          overflowY: "hidden"
        }}
      >
        <LineChart
          width={width}
          height={height}
          margin={{
            top: 10,
            bottom: isMobile ? 50 : 40,
            left: isMobile ? 45 : 50,
            right: 10,
          }}
          series={[
            {
              data: data.impresionesMensuales || [],
              label: "Impresiones",
              color: "#1976d2",
            },
          ]}
          xAxis={[
            {
              scaleType: "point",
              data: data.meses || [],
            },
          ]}
          yAxis={[
            {
              label: "Cantidad",
            },
          ]}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        />
      </Box>
    </Paper>
  );
}
```

## Ventajas del Sistema

1. **Reutilizable**: Un solo hook puede ser usado en todos los gráficos
2. **Automático**: Se adapta sin necesidad de configuración manual
3. **Performante**: Usa ResizeObserver para cambios eficientes
4. **Consistente**: Todos los gráficos tienen el mismo comportamiento responsive
5. **Accesible**: Ajusta márgenes y tamaños según el dispositivo

## Dimensiones por Dispositivo

- **Móvil**: Ancho dinámico (mínimo 300px), altura 250px
- **Tablet**: Ancho dinámico (mínimo 400px), altura 280px
- **Desktop**: Ancho completo del contenedor, altura 280px

