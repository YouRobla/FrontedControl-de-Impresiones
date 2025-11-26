
import CssBaseline from "@mui/material/CssBaseline";
import { createBrowserRouter, RouterProvider } from "react-router";
import MainLayout from "./Components/navbar/MainLayout";
import ImpresionesPage from "./Pages/Impressions/ImpresionesPage";
import GastosPage from "./Pages/Gastos/GastosPage";
import InformesPage from "./Pages/Informes/InformesPage";
import DashboardPage from "./Pages/Dashboard/DashboardPage";



const router = createBrowserRouter([

  {
      element: <MainLayout/>,
      children: [
       {
    path: "/",
    element: <DashboardPage />,
  },
   {
    path: "/impressions",
    element: <ImpresionesPage/>,
  },
   {
    path: "/bills",
    element: <GastosPage/>,
  },
  {
    path: "/information",
    element: <InformesPage />,
  },
      ] 
    }
  
]);

export default function App() {
  return (
    <>
        <CssBaseline />
        <RouterProvider router={router} />
    </>
  );
}
