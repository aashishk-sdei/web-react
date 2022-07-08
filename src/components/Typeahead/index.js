import React, { useRef, useMemo } from 'react';
import Typography from "./../../components/Typography"
import className from "classnames";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import './index.css'

const filter = createFilterOptions();
const useStyles = makeStyles({
    inputRoot: {
        width: props => props.width,
        fontSize: props => props.fontSize,
        height: props => props.height,
        borderRadius: props => props.borderRadius,
        padding: "2px 0px !important",
        "&:hover .MuiOutlinedInput-notchedOutline": {
            border: '1px solid #ccc'
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#295DA1",
            borderWidth: 2
        }
    },
    input: {
        padding: "0 1rem !important",
        height: "100%"
    },
    endAdornment: {
        display: props => {
            if (props.closeIconDisable) {
                return "none"
            }
        }
    },
    root: {
        width: '100%',
    },
    popper: {
        width: 0,
        position: 'absolute',
        top: 0,
        marginTop: props => props.popoverMt,
    },
    inputRoot1: {
        width: "100%",
        height: 32,
        borderRadius: 8,
        padding: "2px 0px !important",
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#295DA1",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "1px solid #ccc",
        },
    },
    input1: {
        padding: "0 0 0 2rem !important",
        textTransform: "capitalize",
        height: "100%"
    },
    endAdornment1: {
        display: "none",
    },
    paper1: {
        boxShadow: "none",
        overflow: "visible"
    },
    listbox1: {
        overflowY: "overlay !important",
        maxHeight: "100% !important",
        "&.MuiAutocomplete-listbox": {
            padding: "0 0"
        }
    },
    popper1: {
        position: 'static',
    },
    inputRoot2: {
        height: 40,
        borderRadius: 8,
        padding: "2px 0px !important",
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#295DA1",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "1px solid #ccc",
        },
    },
    input2: {
        padding: "0 1rem !important",
        textTransform: "capitalize",
        height: "100%"
    },
    endAdornment2: {
        display: "none"
    },
    root2: {
        width: '100%',
    },
    paper2: {
        marginTop: "40px"
    }
});
const loadNextPageDataFn = (event, loadNextPage, loadNext, page) => {
    const listboxNode = event.currentTarget;
    if (listboxNode.scrollTop + listboxNode.clientHeight === listboxNode.scrollHeight) {
        page.current = page.current + 1;
        loadNextPage ? loadNextPage(page.current) : loadNext(page.current)
    }
}
const getRender = (props) => {
    if (!props.highlight && props.renderOption) {
        return { renderOption: props.renderOption }
    } else {
        return {}
    }
}
const _renderOption = (addNewText, value, extraRender, option) => {
    if (option.newValue) {
        return <React.Fragment>
            <div className="flex items-center w-full">
                <div dangerouslySetInnerHTML={{ __html: addNewText?.replace("%s", `<b>${option.name}</b>`) || `Add <b>${option.name}</b>` }} >
                </div>
            </div>
        </React.Fragment>
    } else {
        const matches = match(option.name, value);
        const parts = parse(option.name, matches);
        return <React.Fragment>
            <div className="flex flex-col w-full pb-1">
                <div>
                    {parts.map((part, index) => (
                        <Typography size={16} text="secondary">
                            <span key={index} className={className('', { "typo-font-bold": part.highlight, "typo-font-regular": !part.highlight })}>
                                {part.text}
                            </span>
                        </Typography>
                    ))}
                </div>
                {extraRender && <>
                    <Typography size={12}>
                        <span className='whitespace-nowrap mr-1'>
                            {extraRender(option)}
                        </span>
                        {option.treeName && <span className={`${extraRender(option) && 'dot-seprator'} break-all inline-block`}>
                            {option.treeName}
                        </span>}
                    </Typography>
                </>
                }
            </div>
        </React.Fragment>
    }
}
const renderOptionPropFn = (highlight, renderOption, extraRender, value, getOptionDisabled, addNewText) => {
    let customprops = {};
    if (highlight) {
        customprops['renderOption'] = renderOption ? renderOption : _renderOption.bind(null, addNewText, value, extraRender)
    }
    if (getOptionDisabled) {
        customprops['getOptionDisabled'] = (option) => {
            return getOptionDisabled.findIndex(_dis => option.id && option.id === _dis.id) !== -1
        }
    }
    return customprops
}
const valEmptySet = (val, handleChange, page) => {
    if (val === "") {
        handleChange({ id: "", name: "" }, page.current)
    }
}

const Typeahead = ({ options, optionLoading, pagination, value, placeholder, handleChange, freeSolo, getOptionDisabled, ...props }) => {
    const classes = useStyles({ ...props, value: value });
    let page = useRef(1);
    let currentTxt = useRef("");
    const loadNextPageData = (event) => {
        loadNextPageDataFn(event, props.loadNextPage, loadNext, page)
    }
    const loadNext = (currentPage) => {
        handleChange(value, currentPage)
    }
    const handleChangeField = (e, val) => {
        if ((typeof val?.inputValue === 'string' || typeof val === 'string') && props.addNew && props.addNewItem) {
            props.addNewItem(val)
        } else {
            if (val?.id) {
                page.current = 1
                handleChange(val, page.current)
            }
            if (val?.personId) {
                props.handleSelect(e, val);
            }
        }
    }
    const handleInputChange = (_e, val, reason) => {
        if (reason !== 'reset') {
            page.current = 1
            currentTxt.current = val;
            props.callbackApi && props.callbackApi(val)
            valEmptySet(val, handleChange, page)
            freeSolo && handleChange({ id: "", name: val }, page.current)
        }
    }
    const getClasses = (type) => {
        switch (type) {
            case "drawer":
                return {
                    inputRoot: classes.inputRoot1,
                    input: classes.input1,
                    endAdornment: classes.endAdornment1,
                    paper: classes.paper1,
                    listbox: classes.listbox1,
                    popper: classes.popper1
                }
            case "combobox":
                return {
                    inputRoot: classes.inputRoot2,
                    paper: classes.paper2,
                    input: classes.input2,
                    endAdornment: classes.endAdornment2,
                    root: classes.root2
                }
            case "story":
            default:
                return {
                    inputRoot: classes.inputRoot,
                    input: classes.input,
                    endAdornment: classes.endAdornment,
                    root: classes.root,
                    popper: classes.popper
                }
        }
    }
    const renderOptionProp = useMemo(() => {
        return renderOptionPropFn(
            props.highlight,
            props.renderOption,
            props.extraRender,
            currentTxt.current,
            getOptionDisabled,
            props.addNewText);
    }, [
        props.highlight,
        props.renderOption,
        props.extraRender,
        currentTxt.current,
        getOptionDisabled
    ])
    return (
        <div className={`${props.mainClass}`}>
            <Autocomplete
                id={props.id}
                options={options}
                {...getRender(props)}
                {...props.addNew ? {
                    filterOptions: (myOptions, params) => {
                        const filtered = filter(myOptions, params);
                        if (currentTxt.current !== '') {
                            filtered.push({
                                inputValue: currentTxt.current,
                                newValue: true,
                                name: currentTxt.current,
                            });
                        }

                        return filtered;
                    }
                } : {}}
                onInputChange={handleInputChange}
                {...pagination ? {
                    ListboxProps: {
                        onScroll: (event) => {
                            loadNextPageData(event)
                        }
                    }
                } : {}}
                {...props.serverPagination ? props.serverPagination : {}}
                autoHighlight={props.autoHighlight}
                open={props.open}
                autoSelect={props.autoSelect}
                freeSolo={freeSolo}
                getOptionLabel={(option) => {
                    return props.getOptionLabel ? props.getOptionLabel(option) : option.name || ""
                }}
                getOptionSelected={(option, _value) => {
                    return props.getOptionSelected ? props.getOptionSelected(option, _value) : option.name === _value.name
                }}
                {...renderOptionProp}
                style={{ width: "100%" }}
                value={value}
                disabled={props.disabled}
                renderInput={props.renderInput ? props.renderInput : (params) => <TextField {...params} autoFocus={props.autoFocus} placeholder={placeholder} variant="outlined" />}
                onChange={handleChangeField}
                disablePortal={true}
                loading={optionLoading}
                classes={getClasses(props.type)}
            />
        </div>
    );
}

Typeahead.defaultProps = {
    freeSolo: true,
    pagination: false,
    options: [],
    optionLoading: false,
    value: null,
    placeholder: '',
    width: '100%',
    height: 40,
    borderRadius: 8,
    popoverMt: 36,
    highlight: false,
    autoHighlight: false,
    autoSelect: false,
    disabled: false,
    closeIconDisable: true,
    getOptionDisabled: [],
    autoFocus: false,
    mainClass: 'flex mt-0 w-full',
    addNew: false
}


export default Typeahead;