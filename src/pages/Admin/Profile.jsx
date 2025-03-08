import React, { useState, useEffect } from "react";
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

function Profile() {
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
