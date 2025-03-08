import React, { useState, useEffect } from "react";
import { useUpdateProfileMutation } from "../../store/apiSlices/userApiSlice";
import { toast, ToastContainer } from "react-toastify"; // Import ToastContainer here
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS

function Notifications() {
  const [isNotificationActive, setIsNotificationActive] = useState(false);
  const [updateProfile, { isLoading, isError, isSuccess }] =
    useUpdateProfileMutation();

  useEffect(() => {
    // Retrieve the notification state from localStorage on initial load
    const savedNotificationState = localStorage.getItem("isNotificationActive");
    if (savedNotificationState !== null) {
      setIsNotificationActive(JSON.parse(savedNotificationState)); // Parse and set the value from localStorage
    }
  }, []);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Notifications updated successfully!");
    }

    if (isError) {
      toast.error("Error updating notifications");
    }
  }, [isSuccess, isError]);

  const handleToggle = async () => {
    // Toggle the notification state
    const newNotificationState = !isNotificationActive;
    setIsNotificationActive(newNotificationState);

    // Update the profile with the new notification setting
    try {
      await updateProfile({ isNotificationActive: newNotificationState });

      // Save the new state in localStorage
      localStorage.setItem(
        "isNotificationActive",
        JSON.stringify(newNotificationState)
      );
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        margin: "20px",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
        maxWidth: "500px",
        margin: "50px auto",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          color: "#333",
          fontSize: "24px",
          marginBottom: "20px",
          fontWeight: "600",
        }}
      >
        Notification Preferences
      </h2>

      {/* Toggle Switch UI */}
      <label
        style={{
          position: "relative",
          display: "inline-block",
          width: "80px",
          height: "40px",
          marginBottom: "20px",
        }}
      >
        <input
          type="checkbox"
          checked={isNotificationActive}
          onChange={handleToggle}
          style={{
            opacity: 0,
            width: 0,
            height: 0,
          }}
        />
        <span
          style={{
            position: "absolute",
            cursor: "pointer",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: isNotificationActive ? "#4caf50" : "#ccc",
            transition: "0.4s",
            borderRadius: "50px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <span
            style={{
              position: "absolute",
              content: '""',
              height: "32px",
              width: "32px",
              borderRadius: "50%",
              left: "4px",
              bottom: "4px",
              backgroundColor: "white",
              transition: "0.4s",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              transform: isNotificationActive ? "translateX(40px)" : "none",
            }}
          ></span>
        </span>
      </label>

      <div
        style={{
          fontSize: "18px",
          color: "#666",
          marginBottom: "30px",
        }}
      >
        {isNotificationActive
          ? "Notifications are ON"
          : "Notifications are OFF"}
      </div>

      {/* Action buttons */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={handleToggle}
          style={{
            backgroundColor: isNotificationActive ? "#4caf50" : "#ff6347",
            border: "none",
            padding: "10px 20px",
            color: "white",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            transition: "0.3s",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {isNotificationActive
            ? "Turn Off Notifications"
            : "Turn On Notifications"}
        </button>
      </div>

      {/* Loading, Success, and Error Feedback */}
      {isLoading && (
        <p style={{ fontSize: "14px", color: "#777" }}>Updating...</p>
      )}

      {isSuccess && (
        <p
          style={{
            fontSize: "14px",
            color: "#4caf50",
            fontWeight: "bold",
          }}
        >
          Notifications updated successfully!
        </p>
      )}

      {isError && (
        <p
          style={{
            fontSize: "14px",
            color: "#e74c3c",
            fontWeight: "bold",
          }}
        >
          Error updating notifications!
        </p>
      )}

      {/* Toast Notification container */}
      <ToastContainer />
    </div>
  );
}

export default Notifications;
