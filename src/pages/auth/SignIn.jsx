import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../store/apiSlices/authApiSlice";
import { setCredentials as setLoginCredentials } from "../../store/stateSlices/authStateSlice";
import LoginImage from "../../assets/svg/login.jpg";
import { useDispatch } from "react-redux";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading, error }] = useLoginMutation();
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(credentials).unwrap();
      const userRole = response.user.role;

      dispatch(setLoginCredentials(response));

      // Navigate based on user role
      if (userRole === "super-admin") {
        navigate("/super"); // Super Admin Dashboard
      } else if (userRole === "admin") {
        navigate("/admin"); // Admin Dashboard
      } else if (userRole === "user") {
        navigate("/user"); // User Dashboard
      } else {
        navigate("/sign-in"); // Default fallback
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
        padding: 2,
      }}
    >
      <Card
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: 1000,
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
          background: "#fff",
        }}
      >
        {/* Left Side - Image */}
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "block" },
            background: `url(${LoginImage}) center/cover`,
          }}
        />

        {/* Divider */}
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            display: { xs: "none", md: "block" },
            width: "1px",
            background: "#ddd",
          }}
        />

        {/* Right Side - Login Form */}
        <Box sx={{ flex: 1, padding: 4 }}>
          <CardContent>
            <Typography
              variant="h4"
              align="center"
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
                color: "#333",
                mb: 3,
              }}
            >
              Login
            </Typography>

            {error && (
              <Alert severity="error">
                {error.data?.message || "Login failed"}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{
                  mt: 3,
                  borderRadius: "5px",
                  padding: "12px",
                  fontSize: "16px",
                  bgcolor: "primary.main",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                ) : (
                  "Login"
                )}
              </Button>
            </form>

            <Typography
              variant="body2"
              component={Link}
              to="/sign-up"
              align="center"
              sx={{
                display: "block",
                mt: 2,
                color: "#555",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Don't have an account? Sign up here!
            </Typography>
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
};

export default Login;
