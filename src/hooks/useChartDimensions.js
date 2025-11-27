import { useState, useEffect, useRef } from "react";
import { useTheme, useMediaQuery } from "@mui/material";

/**
 * Hook personalizado para calcular dimensiones responsive de gráficos
 * @returns {Object} { width, height, containerRef }
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
    
    // Usar ResizeObserver para detectar cambios en el contenedor si está disponible
    let resizeObserver = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(updateDimensions);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }
    }

    return () => {
      window.removeEventListener("resize", updateDimensions);
      if (resizeObserver && containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [isMobile, isTablet]);

  return { width, height, containerRef, isMobile };
};

