import { makeStyles, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useHistory } from "react-router-dom";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import Typography from "../Typography";
import className from "classnames";
import "./index.css";
import { useState } from "react";

const useStyles = makeStyles({
  input: {
    padding: "0 1rem !important",
    height: "100%",
  },
  inputRoot: {
    width: (props) => props.width,
    fontSize: (props) => props.fontSize,
    height: (props) => props.height,
    borderRadius: (props) => props.borderRadius,
    padding: "2px 0px !important",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      border: "1px solid #ccc",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#295DA1",
      borderWidth: 2,
    },
  },
  endAdornment: {
    display: (props) => {
      if (props.closeIconDisable) {
        return "none";
      }
    },
  },
  popper: {
    width: 0,
    position: "absolute",
    top: 0,
    marginTop: (props) => props.popoverMt,
  },
  root: {
    width: "100%",
  },
});

const SearchTopics = ({ options, ...props }) => {
  const handleRenderOption = (option, { inputValue }) => {
    const matches = match(option.name, inputValue);
    const parts = parse(option.name, matches);

    return (
      <div>
        {parts.map((part, index) => (
          <Typography size={14} text="secondary">
            <span key={index} className={className("", { "typo-font-bold": part.highlight, "typo-font-regular": !part.highlight })}>
              {part.text}
            </span>
          </Typography>
        ))}
      </div>
    );
  };
  const history = useHistory();
  const classes = useStyles({ ...props });

  //input related
  const [fieldinputValue, setInputValue] = useState("");

  return (
    <div className={`${props.mainClass}`}>
      <Autocomplete
        disablePortal={true}
        classes={{
          inputRoot: classes.inputRoot,
          input: classes.input,
          endAdornment: classes.endAdornment,
          root: classes.root,
          popper: classes.popper,
        }}
        options={options}
        freeSolo={false}
        style={{ width: "100%" }}
        onChange={(_e, values) => {
          console.log("values", values);

          setInputValue("");
          values?.seoName && history.push(`/explore/topic${values.route}`);
        }}
        onInputChange={(_event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        blurOnSelect
        clearOnBlur
        inputValue={fieldinputValue}
        getOptionLabel={(option) => option.name}
        renderOption={handleRenderOption}
        value={""}
        closeIcon={fieldinputValue ? undefined : null}
        renderInput={(params) => (
          <div ref={params.InputProps.ref} className="relative">
            <span className="icon absolute z-10 left-3 top-2">
              {props?.leftIcon || (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.22674 13.1309C4.01019 14.9744 5.49388 16.4311 7.3514 17.1806C9.20892 17.9302 11.2881 17.9111 13.1316 17.1277C14.9751 16.3442 16.4318 14.8605 17.1813 13.003C17.9309 11.1455 17.9118 9.06629 17.1284 7.22282C16.3449 5.37935 14.8612 3.9226 13.0037 3.17306C11.1462 2.42351 9.067 2.44257 7.22353 3.22602C5.38006 4.00948 3.92331 5.49317 3.17377 7.35069C2.42423 9.20821 2.44328 11.2874 3.22674 13.1309V13.1309Z" stroke="#555658" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15.5176 15.5167L21.3751 21.3751" stroke="#555658" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <TextField {...params} placeholder={"Search"} variant="outlined" />
          </div>
        )}
      />
    </div>
  );
};

export default SearchTopics;

SearchTopics.defaultProps = {
  options: [],
  width: "100%",
  height: 40,
  borderRadius: 8,
  popoverMt: 36,
  fontSize: 14,
  mainClass: "flex mt-0 w-full",
};
