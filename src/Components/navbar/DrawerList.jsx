import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { NavLink } from "react-router";

export default function DrawerList({ navlinks, toggleDrawer }) {
    return (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
            <List>
                {navlinks.map((navlink) => (
                    <ListItem key={navlink.title} disablePadding>
                        <ListItemButton
                            component={NavLink}
                            to={navlink.path}
                            sx={{
                                "&.active": {
                                    backgroundColor: "action.selected",
                                },
                            }}
                        >
                            <ListItemIcon>
                                {navlink.Icon}
                            </ListItemIcon>
                            <ListItemText primary={navlink.title} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}

 