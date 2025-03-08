import React from "react";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";

// Styled components for better customization and hover effects
const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  display: "block",
  borderRadius: "10px",
  margin: "5px 0",
  backgroundColor: active ? theme.palette.primary.main : "transparent",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: active
      ? theme.palette.primary.dark
      : theme.palette.action.hover,
    cursor: "pointer",
  },
}));

const SidebarListItem = ({ open, listItem }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (listItem.path) {
      navigate(listItem.path);
    }
  };

  return (
    <StyledListItem active={listItem.active}>
      <Tooltip title={listItem.name} placement="right" arrow>
        <ListItemButton
          onClick={handleClick}
          sx={{
            minHeight: 48,
            px: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: open ? "flex-start" : "center",
            borderRadius: "8px",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: "#e0e0e0",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              justifyContent: "center",
              color: listItem.active ? "#fff" : "inherit",
              fontSize: open ? "1.5rem" : "1.25rem", // Size change on open
              transition: "all 0.3s",
            }}
          >
            {listItem.icon}
          </ListItemIcon>

          <ListItemText
            primary={listItem.name}
            sx={{
              opacity: open ? 1 : 0,
              color: listItem.active ? "#ffffff" : "inherit",
              fontWeight: open ? "bold" : "normal",
              transition: "opacity 0.3s",
              marginLeft: open ? "10px" : 0,
            }}
          />
        </ListItemButton>
      </Tooltip>
    </StyledListItem>
  );
};

export default SidebarListItem;
