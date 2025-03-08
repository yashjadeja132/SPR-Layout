import React from "react";
import {
  Box,
  CssBaseline,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
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
import { useGetDashboardDataQuery } from "../../store/apiSlices/usersApiSlice"; // Import your API hook

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
  // Fetch the dashboard data
  const { data, error, isLoading } = useGetDashboardDataQuery();

  // Show loading spinner while data is being fetched
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  // Handle error state if the request fails
  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        }}
      >
        <Typography color="error" variant="h5">
          Error fetching data
        </Typography>
      </Box>
    );
  }

  // Extract the relevant data from the API response
  const dashboardData = data.dashboardData;

  // Graph Data (optional, since no graph data is provided in the response)
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Tickets Over Time",
        data: [100, 150, 200, 250, 300, 350, 400], // Static data, you can replace it with dynamic data if available
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
              {dashboardData.users} {/* Use real data */}
            </Typography>
          </StyledBox>
        </Grid>

        {/* Total Tickets */}
        <Grid item xs={12} sm={6} md={4}>
          <StyledBox>
            <Typography variant="h6">Total Tickets</Typography>
            <Typography variant="h3" fontWeight="bold">
              {dashboardData.tickets} {/* Use real data */}
            </Typography>
          </StyledBox>
        </Grid>

        {/* Total Admins */}
        <Grid item xs={12} sm={6} md={4}>
          <StyledBox>
            <Typography variant="h6">Total Admins</Typography>
            <Typography variant="h3" fontWeight="bold">
              {dashboardData.admins} {/* Use real data */}
            </Typography>
          </StyledBox>
        </Grid>

        {/* Total Staffs */}
        <Grid item xs={12} sm={6} md={4}>
          <StyledBox>
            <Typography variant="h6">Total Staffs</Typography>
            <Typography variant="h3" fontWeight="bold">
              {dashboardData.staffs} {/* Use real data */}
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
            <Typography variant="h5" align="center" gutterBottom>
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
