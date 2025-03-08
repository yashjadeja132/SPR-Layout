import React, { useState, useEffect } from "react";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../../store/apiSlices/userApiSlice";

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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error loading profile</div>;
  }

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#e5e7eb",
      padding: "16px",
    },
    card: {
      width: "100%",
      maxWidth: "400px",
      padding: "32px",
      backgroundColor: "#fff",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
      borderRadius: "16px",
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
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      marginBottom: "32px",
      textAlign: "center",
      color: "#1f2937",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Profile</h1>

        <label style={styles.label}>Name</label>
        <input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleChange}
          placeholder="Enter your name"
          style={styles.input}
        />

        <label style={styles.label}>Email</label>
        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          placeholder="Enter your email"
          style={styles.input}
        />

        <label style={styles.label}>Password</label>
        <div style={styles.inputContainer}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={profile.password}
            onChange={handleChange}
            placeholder="Enter new password"
            style={styles.input}
          />
          <span
            style={styles.togglePassword}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "👁️" : "🙈"}
          </span>
        </div>

        <button
          onClick={handleSave}
          disabled={isUpdating}
          style={{
            ...styles.button,
            ...(isUpdating ? styles.buttonHover : {}),
          }}
        >
          {isUpdating ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}

export default Profile;
