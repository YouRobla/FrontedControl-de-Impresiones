# Arquitectura Context API para Dashboard

## Descripción General

Se implementó una arquitectura centralizada para la gestión de datos del Dashboard utilizando React Context API y hooks personalizados, permitiendo compartir datos entre múltiples componentes sin prop drilling.

## Estructura de la Arquitectura

### 1. Hook de Datos: `useDashboardData`

Hook personalizado que maneja la obtención y estado de los datos del dashboard desde Supabase.

```5:80:src/hooks/useDashboardData.js
export const useDashboardData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    impresiones: [],
    gastos: [],
    meses: [],
    impresionesMensuales: [],
    ingresosMensuales: [],
    gastosMensuales: [],
    impresionesPorTipo: {},
    gastosPorCategoria: {},
    totales: {
      impresiones: 0,
      ingresos: 0,
      gastos: 0,
      gananciaNeta: 0,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Obtener todas las impresiones
        const { data: impresionesData, error: errorImpresiones } = await supabase
          .from("impresiones")
          .select(`
            id,
            usuario,
            fecha,
            detalle_impresion (
              id,
              tipo,
              paginas,
              costo
            )
          `)
          .order("fecha", { ascending: false });

        if (errorImpresiones) throw errorImpresiones;

        // Obtener todos los gastos
        const { data: gastosData, error: errorGastos } = await supabase
          .from("gastos")
          .select("*")
          .order("fecha", { ascending: false });

        if (errorGastos) throw errorGastos;

        // Procesar datos usando función utilitaria
        const datosProcesados = procesarDatosDashboard(
          impresionesData || [],
          gastosData || []
        );

        setData({
          impresiones: impresionesData || [],
          gastos: gastosData || [],
          ...datosProcesados,
        });
      } catch (err) {
        console.error("Error al obtener datos del dashboard:", err);
        setError("Error al cargar los datos del dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
```

### 2. Context Provider: `DashboardDataProvider`

Provider que envuelve la aplicación y proporciona los datos del dashboard a todos los componentes hijos.

```1:23:src/Pages/Dashboard/DashboardDataProvider.jsx
import { createContext, useContext } from "react";
import { useDashboardData } from "../../hooks/useDashboardData";

const DashboardDataContext = createContext();

export const DashboardDataProvider = ({ children }) => {
  const dashboardData = useDashboardData();

  return (
    <DashboardDataContext.Provider value={dashboardData}>
      {children}
    </DashboardDataContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardDataContext);
  if (!context) {
    throw new Error("useDashboard debe usarse dentro de DashboardDataProvider");
  }
  return context;
};
```

### 3. Hook de Consumo: `useDashboard`

Hook personalizado que facilita el acceso a los datos del dashboard desde cualquier componente.

## Flujo de Datos

```
DashboardDataProvider
    ↓ (proporciona datos)
useDashboardData (obtiene datos de Supabase)
    ↓ (procesa datos)
procesarDatosDashboard (utilidad)
    ↓ (retorna datos procesados)
Componentes de Gráficos
    ↓ (usan useDashboard)
Acceso a datos sin prop drilling
```

## Implementación en la Página Principal

```10:39:src/Pages/Dashboard/DashboardPage.jsx
export default function DashboardPage() {
  return (
    <DashboardDataProvider>
      <Box sx={{ pb: 3 }}>
        <DashboardHeader />
        <ResumenDashboard />

        {/* Gráficos principales */}
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 3 } }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <GraficoImpresiones />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <GraficoIngresosGastos />
          </Grid>
        </Grid>

        {/* Gráficos secundarios */}
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <GraficoTipoImpresion />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <GraficoCategoriaGastos />
          </Grid>
        </Grid>
      </Box>
    </DashboardDataProvider>
  );
}
```

## Uso en Componentes

### Ejemplo: Resumen Dashboard

```9:96:src/Pages/Dashboard/ResumenDashboard.jsx
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
    <Grid container spacing={3} sx={{ mb: 3 }}>
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
      {/* ... más cards ... */}
    </Grid>
  );
}
```

## Ventajas de esta Arquitectura

1. **Centralización**: Todos los datos se obtienen una sola vez
2. **Reutilización**: Cualquier componente puede acceder a los datos
3. **Sin Prop Drilling**: No es necesario pasar props por múltiples niveles
4. **Manejo de Estado**: Loading y error se manejan centralizadamente
5. **Separación de Responsabilidades**: Lógica de datos separada de la UI
6. **Fácil Testing**: Cada parte puede probarse independientemente

## Estructura de Datos Disponible

El contexto proporciona:
- `data`: Objeto con todos los datos procesados
- `loading`: Estado de carga
- `error`: Mensaje de error si existe

Los datos incluyen:
- Impresiones y gastos crudos
- Datos mensuales (últimos 12 meses)
- Agregaciones por tipo y categoría
- Totales calculados

