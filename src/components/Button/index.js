import React, { useState } from "react";
import PropTypes from "prop-types";
import "./index.css";

// Components
import Loader from "../Loader";
import Icon from "../Icon";
import Translator from "../Translator";

const Button = ({ type, title, size, width, icon, disabled, handleClick, loading, tkey, buttonType, _textColor, fontWeight, ...props }) => {
  const getBtnType = () => {
    switch (type) {
      case "default":
        return "btn-default";
      case "default-dark":
        return "btn-default-dark";
      case "primary":
        return "btn-primary";
      case "primary-inverted":
        return "btn-primary-inverted";
      case "secondary":
        return "btn-secondary";
      case "danger":
        return "btn-danger";
        case "success":
          return "btn-success";
      case "red":
        return "btn-red";
      case "red-dark":
        return "btn-red-dark";
      case "skyblue":
        return "btn-skyblue";
      case "white":
        return "btn-white";
      case "link-white":
        return "link-white";
      case "link-danger":
        return "link-danger";
      case "maroon":
        return "btn-maroon";
      case "stepper":
        return "btn-stepper";
      default:
        return "";
    }
  };
  const btnType = getBtnType();

  const getBtnSize = () => {
    switch (size) {
      case "small":
        return "btn-small";
      case "medium":
        return "btn-medium";
      case "large":
        return "btn-large";
      case "xlarge":
        return "btn-xlarge typo-font-bold";
      default:
        return "";
    }
  };
  const btnSize = getBtnSize();

  const getBtnWidth = () => {
    return (width === "full")?"w-full":""
  };
  const btnWidth = getBtnWidth();

  const btnDisable = disabled || loading ? "btn-disable" : "";

  const getlocalIconColor = () => {
    switch (type) {
      case "default":
        return "secondary";
      case "stepper":
        return "default";
      default:
        return "white";
    }
  };
  const localIconColor = getlocalIconColor();

  const [iconColor, setIconColor] = useState(localIconColor);

  const handleMouseEnter = () => {
    if (type === "stepper") setIconColor("primary");
  };

  const handleMouseLeave = () => {
    if (type === "stepper") setIconColor(localIconColor);
  };

  const getTitle = (tkeyin) => {
    return tkeyin !== "" ? <Translator tkey={tkeyin} /> : title;
  };

  const getFontWeight = () => {
    switch (fontWeight) {
      case "regular":
        return "typo-font-regular";
      case "light":
        return "typo-font-light";
      case "medium":
        return "typo-font-medium";
      case "bold":
        return "typo-font-bold";
      case "lyon-regular":
        return "lyon-font-regular";
      case "lyon-medium":
        return "lyon-font-medium";
      default:
        return "typo-font-medium";
    }
  };
  return (
      <button type={buttonType ? buttonType : "button"} className={`btn ${btnType} ${btnSize} ${btnWidth} ${btnDisable}`} onClick={!disabled ? handleClick : undefined} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} {...props}>
      {icon ? (
        <div className="flex items-center swapper">
          <Icon type={icon} color={iconColor} size={size} />
          <div className={`ml-2 typo-font-light ml-swapper ${getFontWeight()}`} > {getTitle(tkey)}</div>
        </div>
      ) : (
        <div className="flex justify-center items-center w-full">
          {loading && (
            <span className="mr-2">
              <Loader spinner={true} color="default" size={12} />
            </span>
          )}
          <span className={getFontWeight()}>{getTitle(tkey)}</span>
        </div>
      )}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(["default", "default-dark", "primary", "primary-inverted", "secondary", "danger", "success", "skyblue", "white", "link-white","link-danger", "red", "red-dark", "stepper"]),
  title: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large", "xlarge"]),
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  disabled: PropTypes.bool,
  handleClick: PropTypes.func,
  tkey: PropTypes.string,
};

Button.defaultProps = {
  type: "primary",
  title: "Learn more",
  size: "medium",
  icon: false,
  disabled: false,
  handleClick: undefined,
  tkey: "",
};

export default Button;
