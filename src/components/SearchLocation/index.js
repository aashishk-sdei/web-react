import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { connect, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import LocationOptions from "./LocationOptions";

// Utils
import { tr } from "../../components/utils";

// Actions
import { getAutoCompleteTest, getAutocompleteRequest } from "../../redux/actions/family";
import { getApiCancelToken } from "../../redux/requests";
let timer;
const getSearchText = (val) => (val ? val : "");

const useStyles = makeStyles({
  inputRoot: {
    width: "100%",
    height: 40,
    borderRadius: 8,
    padding: "2px 0px !important",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      border: "1px solid #ccc",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#295DA1",
      borderWidth: 2,
    },
  },
  input: {
    padding: "0 1rem !important",
    textTransform: "capitalize",
    height: "100%",
  },
  endAdornment: {
    display: "none",
  },
  root: {
    width: "100%",
  },
  popper: {
    marginTop: "36px !important",
  },
});

const cancelPreviousToken = (source) => {
  if (source.current) {
    source.current.cancel();
  }
};

const SearchLocation = ({ placeholder, searchString = "", handleSelectedValue, family: { options, optionLoading }, dispatchGetAutoCompleteTest, dispatchAutocompleteRequest, id = "locations-filter", value, freeSolo = true, inputRef = false, ...props }) => {
  const classes = useStyles();
  const [location, setLocation] = useState(searchString);
  const [listHeight, setListHeight] = useState(null);
  const [open, setOpen] = useState(false);
  const [inputTextValue, setInputTextValue] = useState("");

  const eventRef = useRef();
  const pageRef = useRef(1);
  const prevHeight = useRef(0);
  const { t } = useTranslation();
  const refId = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (inputRef) {
      inputRef.focus();
    }
  }, [inputRef]);

  const source = useRef(null);
  const periousName = useRef(null);
  let requestId = useRef(null);
  const callbackApi = useCallback(
    (val) => {
      requestId.current = uuidv4();
      if (timer) {
        clearTimeout(timer);
      }
      const searchText = getSearchText(val);
      timer = setTimeout(() => {
        if (periousName.current !== searchText) {
          periousName.current = searchText;
          cancelPreviousToken(source);
          const sourceToken = getApiCancelToken();
          source.current = sourceToken;
          dispatchAutocompleteRequest()
          dispatch(getAutoCompleteTest(searchText, sourceToken, requestId.current));
        }
      }, 300);
    },
    [dispatch]
  );
  useEffect(() => {
    if (!periousName.current) {
      callbackApi(inputTextValue || "");
    }
  }, [callbackApi, periousName]);

  useEffect(() => {
    let ele = document.getElementsByClassName("familystepper1-location")[0];
    if (ele) {
      let pos = ele.getBoundingClientRect().y;
      let winHeight = window.innerHeight;
      let listheight = winHeight - pos - 68;
      setListHeight(listheight);
    }
  }, []);
  const handleChange = (_e, val) => {
    handleSelectedValue(val);
  };

  const handleInputChange = (_e, val, reason) => {
    setInputTextValue(val);
    if (val) setOpen(true);
    if (!val) {
      setOpen(false);
    }
    if (reason !== "reset" && val) {
      handleReset(val);
      callbackApi(val);
    }
  };

  const handleReset = (val) => {
    setLocation(val);
    handleSelectedValue({ id: null, name: val });
    pageRef.current = 1;
    refId.current = uuidv4();
  };

  const loadMore = () => {
    dispatchGetAutoCompleteTest(location, refId.current, pageRef.current);
  };

  useEffect(() => {
    if (pageRef.current > 1) {
      eventRef.current.target.scrollTop = prevHeight.current;
    }
  }, [options]);

  return (
    <div className="flex mt-0 w-full">
      <Autocomplete
        {...props}
        id={id}
        open={open}
        onOpen={() => {
          if (inputTextValue) {
            setOpen(true);
          }
        }}
        inputValue={inputTextValue}
        options={options}
        freeSolo={freeSolo}
        loading={optionLoading}
        getOptionLabel={(option) => option.name}
        style={{ width: "100%" }}
        value={value}
        getOptionSelected={(o, v) => o.name === v.name}
        renderInput={(params) =>
          inputRef ? (
            <TextField
              inputRef={(input) => {
                inputRef = input;
              }}
              {...params}
              placeholder={tr(t, placeholder)}
              variant="outlined"
            />
          ) : (
            <TextField {...params} placeholder={tr(t, placeholder)} variant="outlined" />
          )
        }
        renderOption={(option, { inputValue }) => {
          return <LocationOptions option={option} inputValue={inputValue} />;
        }}
        onChange={handleChange}
        onBlur={props.handleBlur}
        disablePortal={true}
        onInputChange={handleInputChange}
        ListboxProps={{
          style: { maxHeight: listHeight ? `${listHeight}px` : "" },
          onScroll: (e) => {
            const listboxNode = e.currentTarget;
            prevHeight.current = listboxNode.scrollHeight;
            if (listboxNode.scrollTop + listboxNode.clientHeight === listboxNode.scrollHeight) {
              pageRef.current += 1;
              eventRef.current = e;
              loadMore();
            }
          },
        }}
        classes={{
          inputRoot: classes.inputRoot,
          input: classes.input,
          endAdornment: classes.endAdornment,
          root: classes.root,
          popper: classes.popper,
        }}
        blurOnSelect={true}
        onClose={() => setOpen(false)}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  family: state.family,
});

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchGetAutoCompleteTest: (value, source, reqId, page) => dispatch(getAutoCompleteTest(value, source, reqId, page)),
    dispatchAutocompleteRequest: () => dispatch(getAutocompleteRequest())
  };
};

SearchLocation.propTypes = {
  handleSelectedValue: PropTypes.func,
};

SearchLocation.defaultProps = {
  handleSelectedValue: undefined,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchLocation);
