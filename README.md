# Control de Impresiones · I.E. María Inmaculada

Aplicación web para registrar las impresiones, los ingresos y los gastos del área de impresiones de un colegio, con un dashboard de gráficos e informes en PDF. La desarrollé durante mis prácticas como desarrollador full stack (2025).

## Funcionalidades

- Dashboard con el total de impresiones, ingresos, gastos y ganancia neta.
- Gráficos de impresiones mensuales, ingresos vs. gastos, impresiones por tipo y gastos por categoría.
- Registro de impresiones y de gastos.
- Informes en PDF.

## Stack

![React](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite_7-646CFF?style=flat&logo=vite&logoColor=white)
![MUI](https://img.shields.io/badge/Material_UI_7-007FFF?style=flat&logo=mui&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat&logo=supabase&logoColor=white)

MUI X Charts · MUI X Date Pickers · React PDF · React Router · Day.js

## Estructura

```
src/
├── Pages/        # Dashboard, Impresiones, Gastos, Informes
├── Components/   # navbar y tarjetas
├── Context/      # estado compartido (gastos, notas)
├── hooks/        # datos del dashboard y dimensiones de gráficos
└── utils/        # cálculos del dashboard y de los informes
```

## Ejecutar en local

```bash
npm install
# crea un .env con VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY
npm run dev
```
