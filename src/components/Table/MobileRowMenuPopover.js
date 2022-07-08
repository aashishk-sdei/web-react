import React from "react";
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import PropTypes from "prop-types";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
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
const MobileRowMenuPopover = ({ anchorEl, menu, handleMenu, setMobileMenuPop, disabledMenuItem }) => {
  const classes = useStyles();
const open = Boolean(anchorEl);

  const handleClose = () => {
    setMobileMenuPop(null);
  };

  const handleMenuOption = (ele) => {
    handleMenu(ele);
    setMobileMenuPop(null);
  };

  const id = open ? "mobile-interaction-menu" : undefined;

  return (
    <div>
      <Popper id={id} open={open} anchorEl={anchorEl} role={undefined} transition disablePortal placement='bottom-start'>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList>
                  {menu &&
                    menu.map((ele, key) => (
                      <MenuItem 
                      key={key} 
                      classes={{ root: classes.menuItem }} 
                      onClick={() => handleMenuOption(ele)}
                      disabled={disabledMenuItem(ele)}>
                        <span>{ele.name}</span>
                      </MenuItem>
                    ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
}
export default MobileRowMenuPopover;

MobileRowMenuPopover.propTypes = {
    menu: PropTypes.arrayOf(PropTypes.object),
    handleMenu: PropTypes.func
};

MobileRowMenuPopover.defaultProps = {
    menu: [{
        id: 1,
        name: "InteractionMenuPopover"
    }],
    handleMenu: undefined
}