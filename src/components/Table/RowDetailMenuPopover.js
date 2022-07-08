import React, { useState } from "react";
import Popover from "@material-ui/core/Popover";
import PropTypes from "prop-types";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Button from "../Button";
import { makeStyles } from "@material-ui/core/styles";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

const useStyles = makeStyles(() => ({
  menuItem: {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 14,
    color: "#000",
  },
}));
const RowDetailMenuPopover = ({ menu, handleMenu, setRowElement, disabledMenuItem }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setRowElement(null);
  };

  const handleMenuOption = (ele) => {
    handleMenu(ele);
    setAnchorEl(null);
    setRowElement(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "interaction-menu" : undefined;

  return (
    <div>
      <Button handleClick={handleClick} icon="menuHorizontal" title="" type="default" fontWeight="medium"/>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <MenuList autoFocusItem={open}>
            {menu &&
              menu.map((ele, key) => (
                <MenuItem 
                key={key} 
                classes={{ root: classes.menuItem }}
                disabled={disabledMenuItem(ele)}
                onClick={() => handleMenuOption(ele)}>
                  <span>{ele.name}</span>
                </MenuItem>
              ))}
          </MenuList>
        </ClickAwayListener>
      </Popover>
    </div>
  );
};
export default RowDetailMenuPopover;

RowDetailMenuPopover.propTypes = {
    menu: PropTypes.arrayOf(PropTypes.object),
    handleMenu: PropTypes.func
};

RowDetailMenuPopover.defaultProps = {
  menu: [
    {
      id: 1,
      name: "InteractionMenuPopover",
    }
  ],
  handleMenu: undefined
};