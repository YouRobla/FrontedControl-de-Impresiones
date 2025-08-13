
import CssBaseline from "@mui/material/CssBaseline";
import { createBrowserRouter, RouterProvider } from "react-router";
import MainLayout from "./Components/navbar/MainLayout";
import ImpresionesPage from "./Pages/Impressions/ImpresionesPage";



const router = createBrowserRouter([

  {
      element: <MainLayout/>,
      children: [
       {
    path: "/",
    element: <div>Dashbord</div>,
  },
   {
    path: "/impressions",
    element: <ImpresionesPage/>,
  },
   {
    path: "/bills",
    element: <div>bills</div>,
  },
  {
    path: "/information",
    element: <div>informacion</div>,
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
