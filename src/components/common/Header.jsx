import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import SettingsIcon from "@mui/icons-material/Settings";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { drawerWidth } from "../../constant/constant";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

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

export default function Header({
  open,
  handleDrawerOpen,
  handleDrawerClose,
  userRole,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const userrole = user.role;
  console.log(user, "userrole");
  // Handle settings menu open
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle settings menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Navigate to the user profile page
  const handleProfileClick = () => {
    if (userrole === "super-admin") {
      navigate("/super/profile");
    } else if (userrole === "admin") {
      navigate("/admin/profile");
    } else if (userrole === "user") {
      navigate("/user/profile");
    } else {
      navigate("/user/profile");
    }
    handleMenuClose();
  };

  // Handle logout action
  const handleLogoutClick = () => {
    console.log("Logging out...");
    navigate("/sign-in");
    handleMenuClose();
  };

  const handlenotificationClick = () => {
      
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
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Smart Ticket Support System
        </Typography>

        Settings Icon with Menu
        <IconButton
          color="inherit"
          aria-label="settings"
          aria-controls="settings-menu"
          aria-haspopup="true"
          onClick={handleMenuOpen}
        >
          <SettingsIcon />
        </IconButton>
        <Menu
          id="settings-menu"
          anchorEl={anchorEl}
          open={openMenu}
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
          <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
          <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
          <MenuItem onClick={handlenotificationClick}>Notifications</MenuItem>
        </Menu>
      </Toolbar>
    </AppBarStyled>
  );
}
