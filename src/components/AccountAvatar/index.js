import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { grey } from "@material-ui/core/colors";

const colors = ["#5199B5", "#388367", "#885F90", "#B88B82", "#8A4831", "#BC8A40"];
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: 32,
    height: 32,
    "& > *": {
      margin: 0,
    },
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  grey: (props) => {
    return {
      color: theme.palette.getContrastText(grey[900]),
      backgroundColor: props.bgColorCode || props.bgColorCode === 0 ? colors[props.bgColorCode] : grey[900],
      width: theme.spacing(4),
      height: theme.spacing(4),
      fontSize: props.likedPersons && "12px",
    };
  },
}));

const AccountAvatar = ({ avatarName, imgSrc, ...props }) => {
  const classes = useStyles(props);

  return <div className={props.avatarsizeclass?props.avatarsizeclass:"avtar-circle-medium"}>{imgSrc ? <Avatar src={imgSrc} className={classes.small} /> : <Avatar className={classes.grey}>{avatarName.toUpperCase()}</Avatar>}</div>;
};

export default AccountAvatar;
