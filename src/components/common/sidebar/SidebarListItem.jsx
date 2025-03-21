import React from "react";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

const SidebarListItem = ({ open, listItem }) => {
  return (
    <ListItem
      disablePadding
      sx={{ display: "block", background: listItem.active && "#44d489" }}
    >
      <ListItemButton
        sx={[
          {
            minHeight: 48,
            px: 2.5,
          },
          open
            ? {
                justifyContent: "initial",
              }
            : {
                justifyContent: "center",
              },
        ]}
      >
        <ListItemIcon
          sx={[
            {
              minWidth: 0,
              justifyContent: "center",
              color: listItem.active && "#ffffff",
            },
            open
              ? {
                  mr: 3,
                }
              : {
                  mr: "auto",
                },
          ]}
        >
          {listItem.icon}
        </ListItemIcon>

        <ListItemText
          primary={listItem.name}
          sx={[
            open
              ? {
                  opacity: 1,
                }
              : {
                  opacity: 0,
                },
            { color: listItem.active && "#ffffff" },
          ]}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default SidebarListItem;
