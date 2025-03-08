import React from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

import { drawerWidth } from "../../constant/constant";

// Styled AppBar component
const AppBarStyled = styled(MuiAppBar)(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  width: `calc(100% - ${theme.spacing(8)} + 1px)`,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function Header({ open, handleDrawerOpen, handleDrawerClose }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const navigate = useNavigate(); // Initialize navigate

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear authentication data (like tokens, session storage, etc.)
    localStorage.clear(); // Example: Clear localStorage (adjust as needed)
    sessionStorage.clear(); // Example: Clear sessionStorage (adjust as needed)

    navigate("/sign-in"); // Navigate to the login page after logout
  };

  return (
    <AppBarStyled position="fixed" open={open}>
      <Toolbar>
        {/* Drawer Toggle Icon */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{ marginRight: 1, ...(open && { display: "none" }) }}
        >
          <MenuIcon />
        </IconButton>

        {/* Drawer Close Icon */}
        <IconButton
          color="inherit"
          aria-label="close drawer"
          onClick={handleDrawerClose}
          edge="start"
          sx={{ marginRight: 1, ...(!open && { display: "none" }) }}
        >
          <ChevronLeftIcon />
        </IconButton>

        {/* AppBar Title */}
        <Typography variant="h6" noWrap component="div">
          Smart Ticket Support System
        </Typography>

        {/* Settings Icon - opens a menu */}
        <IconButton
          color="inherit"
          onClick={handleMenuClick}
          sx={{ marginLeft: "auto" }}
        >
          <SettingsIcon />
        </IconButton>

        {/* Menu for Profile and Logout */}
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          {/* Profile Option */}
          <MenuItem
            component={Link}
            to="/super/profile"
            onClick={handleMenuClose}
          >
            <PersonIcon sx={{ marginRight: 1 }} />
            Profile
          </MenuItem>

          {/* Logout Option */}
          <MenuItem onClick={handleLogout}>
            {" "}
            {/* Updated to use handleLogout */}
            <ExitToAppIcon sx={{ marginRight: 1 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBarStyled>
  );
}
