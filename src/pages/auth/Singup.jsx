import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/stateSlices/authStateSlice";
import { useRegisterMutation } from "../../store/apiSlices/authApiSlice";
import SignUp2 from "../../assets/SignUp2.avif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register] = useRegisterMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format.");
      setLoading(false);
      return;
    }

    try {
      const userData = await register({ name, email, password }).unwrap();
      dispatch(setCredentials(userData));
      toast.success("Registration Successful!");
      navigate("/user/profile");
    } catch (err) {
      if (err?.status === 409) {
        toast.error("Email already exists. Please use a different email.");
      }
      if (err?.data?.message?.includes("exists")) {
        toast.error("Email already exists. Please use a different email.");
      } else {
        // toast.error("Registration Failed!");
      }
      console.error("Failed to register:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
      style={{
        background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
      }}
    >
      <Card
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: 800,
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "block" },
            background: `url(${SignUp2}) center/cover`,
            height: "300px",
            marginTop: "13%",
          }}
        />
        <Divider
          orientation="vertical"
          flexItem
          sx={{ display: { xs: "none", md: "block" } }}
        />

        <Box sx={{ flex: 1, padding: 4 }}>
          <CardContent>
            <Typography variant="h4" align="center" sx={{ mb: 3 }}>
              Sign Up
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Username"
                margin="normal"
                required
                value={name}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                margin="normal"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </Button>

              <Typography
                component={Link}
                to="/sign-in"
                align="center"
                sx={{ mt: 2 }}
              >
                Already have an account? Login
              </Typography>
            </Box>
          </CardContent>
        </Box>
      </Card>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </Box>
  );
};

export default Signup;
