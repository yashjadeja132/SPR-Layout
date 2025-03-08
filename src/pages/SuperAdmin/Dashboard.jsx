import React from "react";
import { Box, CssBaseline, Grid, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Dummy data
const dashboardData = {
  totalUsers: 1250,
  activeTickets: 80,
  pendingApprovals: 12,
  graphData: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    data: [400, 600, 750, 900, 1100, 1250, 1300],
  },
};

const StyledBox = styled(Box)({
  padding: "20px",
  borderRadius: "15px",
  backdropFilter: "blur(10px)",
  backgroundColor: "rgba(255, 255, 255, 0.15)",
  color: "#fff",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0px 6px 25px rgba(0, 0, 0, 0.3)",
  },
  textAlign: "center",
});

const Dashboard = () => {
  // Graph Data
  const chartData = {
    labels: dashboardData.graphData.labels,
    datasets: [
      {
        label: "User Growth",
        data: dashboardData.graphData.data,
        fill: false,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(75,192,192,1)",
        tension: 0.4, // Smooth curve effect
      },
    ],
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        padding: 3,
      }}
    >
      <CssBaseline />
      <Grid container spacing={3} sx={{ maxWidth: "1200px" }}>
        {/* Total Users */}
        <Grid item xs={12} sm={6} md={4}>
          <StyledBox>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h3" fontWeight="bold">
              {dashboardData.totalUsers}
            </Typography>
          </StyledBox>
        </Grid>

        {/* Active Tickets */}
        <Grid item xs={12} sm={6} md={4}>
          <StyledBox>
            <Typography variant="h6">Active Tickets</Typography>
            <Typography variant="h3" fontWeight="bold">
              {dashboardData.activeTickets}
            </Typography>
          </StyledBox>
        </Grid>

        {/* Pending Approvals */}
        <Grid item xs={12} sm={6} md={4}>
          <StyledBox>
            <Typography variant="h6">Pending Approvals</Typography>
            <Typography variant="h3" fontWeight="bold">
              {dashboardData.pendingApprovals}
            </Typography>
          </StyledBox>
        </Grid>

        {/* Graph Section */}
        <Grid item xs={12}>
          <Box
            sx={{
              backgroundColor: "rgb(254, 247, 247)",
              padding: 3,
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Typography variant="h5" align="center" color="white" gutterBottom>
              User Growth Over Time
            </Typography>
            <Line data={chartData} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
