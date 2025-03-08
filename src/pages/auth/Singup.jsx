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
    try {
      const userData = await register({ name, email, password }).unwrap();
      dispatch(setCredentials(userData));
      toast.success("Registration Successful!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      navigate("/dashboard");
    } catch (err) {
      toast.error("Registration Failed!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
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
        background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
        padding: 2,
      }}
    >
      <Card
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: 800,
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
          background: "#fff",
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "block" },
            background: `url(${SignUp2}) center/cover`,
          }}
          style={{ height: "300px", marginTop: "13%" }}
        />

        <Divider
          orientation="vertical"
          flexItem
          sx={{
            display: { xs: "none", md: "block" },
            width: "1px",
            background: "#ddd",
          }}
        />

        <Box sx={{ flex: 1, padding: 4 }}>
          <CardContent>
            <Typography
              variant="h4"
              align="center"
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: 1,
                color: "#333",
                mb: 3,
              }}
            >
              Sign Up
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Username"
                margin="normal"
                variant="outlined"
                required
                value={name}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                variant="outlined"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                margin="normal"
                variant="outlined"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
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
                sx={{
                  mt: 3,
                  padding: "12px",
                  fontSize: "16px",
                  background: "#1fb988",
                  "&:hover": { background: "#1fb988" },
                }}
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </Button>

              <Typography
                variant="body2"
                component={Link}
                to="/auth/login"
                align="center"
                sx={{
                  display: "block",
                  mt: 2,
                  color: "#555",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Already have an account? Login
              </Typography>
            </Box>
          </CardContent>
        </Box>
      </Card>
      <ToastContainer />
    </Box>
  );
};

export default Signup;
