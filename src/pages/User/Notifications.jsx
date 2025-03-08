import React, { useState } from "react";

function Notifications() {
  const [isNotificationActive, setIsNotificationActive] = useState(false);

  const handleToggle = () => {
    setIsNotificationActive((prev) => !prev);
  };

  // Inline style objects
  const containerStyle = {
    fontFamily: "Arial, sans-serif",
    color: "#333",
    fontSize: "16px",
    padding: "20px",
  };

  const titleStyle = {
    fontSize: "24px",
    marginBottom: "20px",
  };

  const toggleLabelStyle = {
    display: "flex",
    alignItems: "center",
    fontSize: "16px",
    cursor: "pointer",
  };

  // The switch container style, changes background color based on state
  const switchStyle = {
    position: "relative",
    display: "inline-block",
    width: "60px",
    height: "34px",
    marginLeft: "10px",
    backgroundColor: isNotificationActive ? "#2196F3" : "#ccc",
    borderRadius: "34px",
    transition: "background-color 0.4s",
  };

  // The slider circle style moves based on state
  const sliderStyle = {
    position: "absolute",
    height: "26px",
    width: "26px",
    left: isNotificationActive ? "30px" : "4px",
    bottom: "4px",
    backgroundColor: "white",
    borderRadius: "50%",
    transition: "left 0.4s",
  };

  const statusStyle = {
    marginTop: "10px",
    fontSize: "18px",
    fontWeight: "bold",
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Notifications Of Mail</h2>
      <div style={toggleLabelStyle} onClick={handleToggle}>
        <span>Toggle Notification</span>
        <div style={switchStyle}>
          <div style={sliderStyle}></div>
        </div>
      </div>
      <div style={statusStyle}>{isNotificationActive ? "On" : "Off"}</div>
    </div>
  );
}

export default Notifications;
