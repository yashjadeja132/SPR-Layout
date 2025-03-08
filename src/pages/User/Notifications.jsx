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
    <div>
      <h2>Notifications</h2>

      {/* Toggle Switch UI with inline CSS */}
      <label style={{ position: "relative", display: "inline-block", width: "60px", height: "34px" }}>
        <input
          type="checkbox"
          checked={isNotificationActive}
          onChange={handleToggle}
          style={{ opacity: 0, width: 0, height: 0 }}
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
            borderRadius: "34px",
          }}
        >
          <span
            style={{
              position: "absolute",
              content: '""',
              height: "26px",
              width: "26px",
              borderRadius: "50%",
              left: "4px",
              bottom: "4px",
              backgroundColor: "white",
              transition: "0.4s",
              transform: isNotificationActive ? "translateX(26px)" : "none",
            }}
          ></span>
        </span>
      </label>

      <div>
        {isNotificationActive
          ? "Notifications are ON"
          : "Notifications are OFF"}
      </div>

      {/* Optionally show loading state */}
      {isLoading && <p>Updating...</p>}

      {/* Toast Notification container */}
      <ToastContainer />
    </div>
  );
}

export default Notifications;
