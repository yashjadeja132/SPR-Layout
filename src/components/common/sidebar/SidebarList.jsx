import React from "react";

import { List } from "@mui/material";

import SidebarListItem from "./SidebarListItem";

const SidebarList = ({ open, listItems }) => {
  return (
    <List>
      {listItems?.map((listItem, index) => (
        <React.Fragment key={index}>
          <SidebarListItem open={open} listItem={listItem} />
        </React.Fragment>
      ))}
    </List>
  );
};

export default SidebarList;
