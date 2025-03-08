import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../../store/apiSlices/userApiSlice";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  CircularProgress,
  Paper,
  Grid,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Profile() {
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (data?.userProfile) {
      setProfile({
        name: data.userProfile.name,
        email: data.userProfile.email,
        password: "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const { name, email, password } = profile;

    // Check if username is missing
    if (!name) {
      toast.error("Username is required.");
      return;
    }

    // Check if password is less than 6 characters
    if (password && password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    // Proceed with profile update
    try {
      const updateData = { name, email };
      if (password) {
        updateData.password = password;
      }

      await updateProfile(updateData).unwrap();
      toast.success("Profile updated successfully!");
      setProfile((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      // Handle email conflict error (e.g., email already exists)
      if (err?.data?.message?.includes("email exists")) {
        toast.error("Email already exists. Please use a different email.");
      } else if (err?.status === 409) {
        toast.error("Email is Already Exists.");
      }
      console.error("Failed to update profile:", err);
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error loading profile</div>;
  }

  return (
    <Container maxWidth="xs" sx={{ paddingTop: "4rem" }}>
      <Paper elevation={5} sx={{ padding: 4, borderRadius: 4 }}>
        <Typography
          variant="h5"
          gutterBottom
          align="center"
          sx={{ color: "#3f51b5", fontWeight: 600 }}
        >
          Update Profile
        </Typography>

        <Box component="form">
          <Grid container spacing={2}>
            {/* Name Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                name="name"
                value={profile.name}
                onChange={handleChange}
                required
                sx={{
                  borderRadius: "12px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#3f51b5",
                  },
                }}
              />
            </Grid>

            {/* Email Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                name="email"
                value={profile.email}
                onChange={handleChange}
                required
                type="email"
                sx={{
                  borderRadius: "12px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#3f51b5",
                  },
                }}
              />
            </Grid>

            {/* Password Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="New Password"
                variant="outlined"
                name="password"
                value={profile.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                required
                sx={{
                  borderRadius: "12px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#3f51b5",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Save Button */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleSave}
                disabled={isUpdating}
                sx={{
                  height: 50,
                  backgroundColor: "#3f51b5",
                  color: "#fff",
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "#303f9f",
                  },
                  borderRadius: "12px",
                  boxShadow: 4,
                }}
              >
                {isUpdating ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </Container>
  );
}

export default Profile;
