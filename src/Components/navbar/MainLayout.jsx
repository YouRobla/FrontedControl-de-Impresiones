

import { Outlet } from "react-router";
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Container } from "@mui/material";
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import DescriptionIcon from '@mui/icons-material/Description';
import Navbar from "./Navbar";
import { NoteProvider } from "../../Context/NoteContext";

const NavLinks =[
    {
        title:"Dashboard",path:'/',Icon:< DashboardIcon/>
    },
    {
        title:"Impresiones",path:'/impressions',Icon:<LocalPrintshopIcon />
    },
    {
        title:"Gastos",path:'/bills',Icon:<CurrencyExchangeIcon />
    },
    {
        title:"Informes",path:'/information',Icon:<DescriptionIcon/>
    }
]

export default function MainLayout() {
  return (
    <>
    <NoteProvider>
      <Navbar  navlinks={NavLinks}/>
      <Container sx={{ mt: 2}}  >
        <Outlet /> 
      </Container>
    </NoteProvider>
    </>
  );
}
