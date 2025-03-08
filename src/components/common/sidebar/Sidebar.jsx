import React from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import TableChartIcon from "@mui/icons-material/TableChart";
import TicketIcon from "@mui/icons-material/ConfirmationNumber";
import { Link, useLocation } from "react-router-dom";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { drawerWidth } from "../../../constant/constant";
import HistoryIcon from "@mui/icons-material/History";
import GridViewIcon from "@mui/icons-material/GridView";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

function SidebarList({ open, listItems }) {
  const location = useLocation(); // Get current route path

  const isActive = (path) => location.pathname === path; // Check if path matches current location

  return (
    <List>
      {listItems.map((item, index) => (
        <ListItem
          button
          key={index}
          component={Link}
          to={item.path}
          sx={{
            backgroundColor: isActive(item.path)
              ? "primary.main"
              : "transparent",
            color: isActive(item.path) ? "white" : "inherit",
          }}
        >
          <ListItemIcon
            sx={{ color: isActive(item.path) ? "white" : "inherit" }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.name} />
        </ListItem>
      ))}
    </List>
  );
}

export default function Sidebar({ open }) {
  const mainList = [
    { name: "Dashboard", icon: <DashboardIcon />, path: "/super/dashboard" },
  ];

  const secondaryList = [
    { name: "User-Table", icon: <TableChartIcon />, path: "/super/user-table" },
    { name: "Admin-Table", icon: <GridViewIcon />, path: "/super/admin-table" },
    { name: "Log-Table", icon: <HistoryIcon />, path: "/super/log-table" },
    { name: "Ticket-Table", icon: <TicketIcon />, path: "/super/ticket-table" },
    {
      name: "Ticket-Generate",
      icon: <LocalActivityIcon />,
      path: "/user/ticket-generate",
    },
  ];

  const sidebarLists = [mainList, secondaryList];

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>Logo</DrawerHeader>
      {sidebarLists.map((list, index) => (
        <React.Fragment key={index}>
          <Divider />
          <SidebarList open={open} listItems={list} />
        </React.Fragment>
      ))}
    </Drawer>
  );
}
