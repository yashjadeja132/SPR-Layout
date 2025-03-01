import React from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import SidebarList from "./SidebarList";
import { drawerWidth } from "../../../constant/constant";

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
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

export default function Sidebar({ open }) {
  const mainList = [
    { name: "Inbox", icon: <InboxIcon /> },
    { name: "Starred", icon: <MailIcon /> },
  ];

  const secondaryList = [
    { name: "All mail", icon: <InboxIcon />, active: true },
    { name: "Trash", icon: <MailIcon /> },
    { name: "Spam", icon: <InboxIcon /> },
  ];

  const sidebarLists = [mainList, secondaryList];

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>Logo</DrawerHeader>
      {sidebarLists?.map((item, index) => (
        <React.Fragment key={index}>
          <Divider />
          <SidebarList open={open} listItems={item} />
        </React.Fragment>
      ))}
    </Drawer>
  );
}
