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
import { color } from "framer-motion";

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
    try {
      const { name, email, password } = profile;
      const updateData = { name, email };

      if (password) {
        updateData.password = password;
      }

      await updateProfile(updateData).unwrap();
      alert("Profile updated successfully!");
      setProfile((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile.");
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error loading profile</div>;
  }

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      //   minHeight: "100vh", // Uncomment if needed for full screen height
      backgroundColor: "#e5e7eb", // Uncomment for a light gray background
      padding: "16px",
      boxShadow: "0 4px 8px rgba(34, 197, 94, 0.6)", // Green shadow
    },

    card: {
      width: "100%",
      maxWidth: "400px",
      padding: "32px",
      backgroundColor: "#fff",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
      borderRadius: "16px",
      position: "relative",
    },
    input: {
      width: "100%",
      height: "48px",
      padding: "8px 16px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      marginBottom: "24px",
      outline: "none",
      fontSize: "16px",
      boxSizing: "border-box",
      backgroundColor: "#f9fafb",
    },
    label: {
      fontSize: "16px",
      fontWeight: "500",
      marginBottom: "8px",
      display: "block",
      color: "#374151",
    },
    button: {
      width: "100%",
      height: "48px",
      backgroundColor: "#3b82f6",
      color: "#fff",
      fontWeight: "600",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.3s",
      marginTop: "16px",
    },
    buttonHover: {
      backgroundColor: "#2563eb",
    },
    togglePassword: {
      position: "absolute",
      right: "16px",
      top: "12px",
      cursor: "pointer",
      color: "#6b7280",
    },
    inputContainer: {
      position: "relative",
    },
    header: {
      display: "flex",
      alignItems: "center",
      marginBottom: "32px",
    },
    backButton: {
      cursor: "pointer",
      color: "#1f2937",
      marginRight: "16px",
      fontSize: "40px",
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      color: "#1f2937",
    },
  };

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
    </Container>
  );
}

export default Profile;
