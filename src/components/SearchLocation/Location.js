import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import LocationOptions from "./LocationOptions";
// utils
import { tr } from "../utils";
import { setLocationChanged, getLocationChanged } from "../utils/location";

// redux
import { connect, useDispatch } from "react-redux";
import { getAutoCompleteTest, getBirthAutoCompleteTest, getDeathAutoCompleteTest, clearOptionsPayload, getAutocompleteRequest } from "../../redux/actions/family";
import { getApiCancelToken } from "../../redux/requests";
let timer;
const getSearchText = (val) => (val ? val : "");
const useStyles = makeStyles({
  inputRoot: {
    width: "100%",
    height: 40,
    borderRadius: 8,
    padding: "2px 0px !important",
  },
  inputRootForTable: {
    width: "100%",
    height: 40,
    borderRadius: 4,
    padding: "2px 0px !important",
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "1px solid #397388",
    },
  },
  input: {
    padding: "0 1rem !important",
    textTransform: "capitalize !important",
    height: "100%",
  },
  endAdornment: {
    display: "none",
  },
  root: {
    width: "100%",
  },
  listbox: {
    maxHeight: 235,
  },
  eventModalListbox: {
    maxHeight: 150,
    paddingBottom: "5px !important",
  },
  birthList: {
    maxHeight: 226,
  },
  longbirthList: {
    maxHeight: 265,
  },
  deathList: {
    maxHeight: 192,
  },
  popper: {
    marginTop: "36px !important",
    paddingBottom: "16px !important",
  },
});

const getLocationValue = (searchValue) => {
  return searchValue;
};

let keyCodes = [9, 13, 27];
let keyCode = "";
let myLocation = {
  target: {
    locationId: "",
    name: "",
    value: "",
  },
};
const cancelPreviousToken = (source) => {
  if (source.current) {
    source.current.cancel();
  }
};
let oldValue = "";

const Location = ({ id = "locations-filter", name, value = "", placeholder, handleSelectedValue, family: { options, birthPlaceOptions, deathPlaceOptions, optionLoading }, dispatchGetAutoCompleteTest, dispatchGetBirthAutoCompleteTest, dispatchGetDeathAutoCompleteTest, dispatchAutocompleteRequest, freeSolo = false, inputRef, highLight, locationType = "normal", modalType, isLiving, disablePortal = true, tableType, ...props }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const eventRef = useRef();
  const pageRef = useRef(1);
  const prevHeight = useRef(0);
  const refId = useRef();
  const [location, setLocation] = useState(value);
  const [listHeight, setListHeight] = useState(null);
  const [inputTextValue, setInputTextValue] = useState("");
  const myOptions = props.dataSource === "birthPlaceOptions" ? birthPlaceOptions : props.dataSource === "deathPlaceOptions" ? deathPlaceOptions : options;
  const dispatch = useDispatch();

  oldValue = value;

  const locationValue = useMemo(() => getLocationValue(location), [location]);

  useEffect(() => {
    setLocation(value);
  }, [value]);

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
          if (props.dataSource === "birthPlaceOptions") {
            dispatch(clearOptionsPayload("birthPlace"));
            dispatchGetBirthAutoCompleteTest(searchText, sourceToken, requestId.current);
          } else if (props.dataSource === "deathPlaceOptions") {
            dispatch(clearOptionsPayload("deathPlace"));
            dispatchGetDeathAutoCompleteTest(searchText, sourceToken, requestId.current);
          } else {
            dispatchAutocompleteRequest();
            dispatchGetAutoCompleteTest(searchText, sourceToken, requestId.current);
          }
        }
      }, 100);
    },
    [dispatch]
  );

  useEffect(() => {
    if (locationType === "table") {
      if (inputRef && value && value.length === 1) inputRef.focus();
      if (inputRef) inputRef.focus();
    }
  }, [value]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (locationType === "table") {
        if (inputRef) inputRef.focus();
        if (inputRef && highLight && !getLocationChanged()) inputRef.select();
      }
      if (!periousName.current) {
        if (props.dataSource === "birthPlaceOptions") {
          dispatchGetBirthAutoCompleteTest(locationValue, null, refId.current);
        } else if (props.dataSource === "deathPlaceOptions") {
          dispatchGetDeathAutoCompleteTest(locationValue, null, refId.current);
        } else {
          dispatchGetAutoCompleteTest(locationValue, null, refId.current);
        }
      }
    }, 250);
    return () => {
      return clearTimeout(delayDebounceFn);
    };
  }, [locationValue, dispatchGetAutoCompleteTest, dispatchGetBirthAutoCompleteTest, dispatchGetDeathAutoCompleteTest]);

  useEffect(() => {
    if (pageRef.current > 1) {
      eventRef.current.target.scrollTop = prevHeight.current;
    }
  }, [myOptions]);

  useEffect(() => {
    let ele = document.getElementsByClassName("eventpopper-location")[0];
    let tableElement = document.getElementsByClassName("table-location")[0];

    if (tableType === "LIFE_EVENTS" && tableElement) {
      let pos = tableElement.getBoundingClientRect().y;
      let winHeight = window.innerHeight;
      let listheight = winHeight - pos - 78;
      setListHeight(listheight);
    }
    if (ele) {
      let pos = ele.getBoundingClientRect().y;
      let winHeight = window.innerHeight;
      let listheight = winHeight - pos - 68;
      setListHeight(listheight);
    }
  }, []);

  const loadMore = () => {
    const sourceToken = getApiCancelToken();
    source.current = sourceToken;
    if (props.dataSource === "birthPlaceOptions") {
      dispatchGetBirthAutoCompleteTest(periousName.current, refId.current, pageRef.current);
    } else if (props.dataSource === "deathPlaceOptions") {
      dispatchGetDeathAutoCompleteTest(periousName.current, refId.current, pageRef.current);
    } else {
      dispatchGetAutoCompleteTest(periousName.current, refId.current, pageRef.current);
    }
  };

  //to get height of menu list height
  const getListHeightClass = () => {
    switch (true) {
      case modalType && !isLiving && id === "birthPlace":
        return classes.longbirthList;
      case modalType && isLiving && id === "birthPlace":
        return classes.birthList;
      case modalType && !isLiving && id === "deathPlace":
        return classes.deathList;
      case locationType === "death-place":
        return classes.listbox;
      case locationType === "event-location":
        return classes.eventModalListbox;
      default:
        return;
    }
  };

  const getLocationPopperClass = () => {
    if (locationType === "table" && disablePortal === false) return;
    else return classes.popper;
  };

  // callbacks
  const checkOption = (myVal) => {
    return new Promise((resolve) => {
      const myOption = myOptions.find((ele) => ele.name.toUpperCase() === myVal.toUpperCase());
      resolve(myOption);
    });
  };

  const onInputChange = (_e, val, reason) => {
    setInputTextValue(val);
    if (reason !== "reset") {
      setLocationChanged(true);
      setLocation(val);
      handleReset();
      callbackApi(val);
    }
    if (val === "" && props.handleEmpty) {
      props.handleEmpty();
    }
  };

  const handleReset = () => {
    pageRef.current = 1;
    refId.current = uuidv4();
  };

  const onChange = (e, val, reason) => {
    if (!keyCodes.includes(e.keyCode) && reason === "select-option") {
      myLocation = {
        target: {
          locationId: val.id,
          name: "location",
          value: val.name,
        },
      };
      onFinal(myLocation, e);
    }
  };

  const onBlur = async (e) => {
    if (!keyCodes.includes(e.keyCode)) {
      setTimeout(async () => {
        const option = await checkOption(e.target.value);
        myLocation = {
          target: {
            locationId: option ? option.id : "",
            name: "location",
            value: option ? option.name : e.target.value,
          },
        };
        onFinal(myLocation, e);
      }, 500);
    }
  };

  const onKeyDown = async (e) => {
    keyCode = e.keyCode;
    if (keyCodes.includes(keyCode)) {
      const option = await checkOption(e.target.value);
      myLocation = {
        target: {
          locationId: option ? option.id : "",
          name: "location",
          value: option ? option.name : e.target.value,
        },
      };
      onFinal(myLocation, e);
    }
  };

  const onFinal = (selectedLocation, event) => {
    const oldLocation = {
      target: {
        locationId: "",
        name: "location",
        value: oldValue.length === 1 ? props?.actualValue : oldValue,
      },
    };
    const finalLocation = event.keyCode === 27 && locationType === "table" ? oldLocation : selectedLocation;
    handleSelectedValue(finalLocation, event);
    setLocationChanged(false);
  };

  return (
    <div className="flex mt-0 w-full h-full">
      <Autocomplete
        {...props}
        id={id}
        name={name}
        inputValue={inputTextValue}
        options={myOptions}
        freeSolo={freeSolo}
        loading={optionLoading}
        getOptionLabel={(option) => option.name}
        style={{ width: "100%" }}
        value={{ id: null, name: locationValue }}
        getOptionSelected={(o, v) => o.name === v.name}
        renderInput={(params) => {
          if (locationType === "table") {
            return (
              <TextField
                inputRef={(input) => {
                  inputRef = input;
                }}
                {...params}
                placeholder={tr(t, placeholder)}
                variant="outlined"
              />
            );
          } else {
            return <TextField {...params} placeholder={tr(t, placeholder)} variant="outlined" />;
          }
        }}
        renderOption={(option, { inputValue }) => {
          return <LocationOptions option={option} inputValue={inputValue} />;
        }}
        popperOptions={{
          placement: "bottom",
        }}
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
          inputRoot: locationType === "table" ? classes.inputRootForTable : classes.inputRoot,
          input: classes.input,
          endAdornment: classes.endAdornment,
          root: classes.root,
          popper: getLocationPopperClass(),
          listbox: getListHeightClass(),
        }}
        disablePortal={disablePortal}
        autoComplete={true}
        blurOnSelect={false}
        onInputChange={onInputChange}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
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
    dispatchGetBirthAutoCompleteTest: (value, source, reqId, page) => dispatch(getBirthAutoCompleteTest(value, source, reqId, page)),
    dispatchGetDeathAutoCompleteTest: (value, source, reqId, page) => dispatch(getDeathAutoCompleteTest(value, source, reqId, page)),
    dispatchAutocompleteRequest: () => dispatch(getAutocompleteRequest())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Location);