import { useState } from "react";
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Box,
  Button,
  Drawer,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink } from "react-router";
import DrawerList from "./DrawerList";

export default function Navbar({ navlinks }) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {/* Botón menú solo en pantallas pequeñas */}
          <IconButton
            color="inherit"
            size="large"
            onClick={toggleDrawer(true)}
            sx={{ display: { md: "none", xs: "flex" } }}
            title="Abrir menú"
            aria-label="Abrir menú"
          >
            <MenuIcon />
          </IconButton>

          {/* Título */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            News
          </Typography>

          {/* Links horizontales */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 2,
              alignItems: "center",
            }}
          >
            {navlinks.map((navlink) => (
              <Button
                key={navlink.title}
                component={NavLink}
                to={navlink.path}
                startIcon={navlink.Icon}
                sx={{
                  color: "white",
                  "&.active": {
                    borderBottom: "2px solid white",
                    borderRadius: 0,
                  },
                }}
              >
                {navlink.title}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer solo visible en móvil */}
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <DrawerList navlinks={navlinks} toggleDrawer={toggleDrawer} />
      </Drawer>
    </>
  );
}
