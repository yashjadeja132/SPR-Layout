import React from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

const drawerWidth = 240;

function Dashboard() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = () => setOpen(!open);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Super Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        sx={{
          // width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            // width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "primary.dark", // Dark background for the drawer
            color: "white",
            transition: "all 0.3s ease", // Smooth transition
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <List>
          <ListItem button>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText primary="Users" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          padding: 3,
          marginLeft: open ? `${drawerWidth}px` : "0px",
          transition: "margin-left 0.3s ease", // Smooth transition for content shift
        }}
      >
        <Grid container spacing={3}>
          {/* Section 1 */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 3,
                bgcolor: "primary.main",
                color: "white",
                borderRadius: 2,
                boxShadow: 3,
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-10px)", // Hover effect
                  boxShadow: 6, // Enhanced shadow on hover
                },
              }}
            >
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4">1250</Typography>
            </Box>
          </Grid>

          {/* Section 2 */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 3,
                bgcolor: "secondary.main",
                color: "white",
                borderRadius: 2,
                boxShadow: 3,
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-10px)", // Hover effect
                  boxShadow: 6, // Enhanced shadow on hover
                },
              }}
            >
              <Typography variant="h6">Active Tickets</Typography>
              <Typography variant="h4">80</Typography>
            </Box>
          </Grid>

          {/* Section 3 */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 3,
                bgcolor: "info.main",
                color: "white",
                borderRadius: 2,
                boxShadow: 3,
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-10px)", // Hover effect
                  boxShadow: 6, // Enhanced shadow on hover
                },
              }}
            >
              <Typography variant="h6">Pending Approvals</Typography>
              <Typography variant="h4">12</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Dashboard;
