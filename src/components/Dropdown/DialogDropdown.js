import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Typography from '../Typography';
import "./index.css"

const useStyles = makeStyles(() => ({
    inputRoot: {
        width: "100%",
        height: 42,
        borderRadius: "0.5rem",
        padding: "2px 4px !important",
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#295DA1"
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            border: '1px solid #ccc'
        }
    },
    input: {
        padding: "0 1rem !important",
        color: "#212122",
        background: "#FFFFFF",
        height: "100%",
    },
    option: {

    },
    title: {
        whiteSpace: "normal",
        wordBreak: "break-word",
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    endAdornment: {
        display: "none"
    },
    popper: {
        paddingBottom: "15px !important"
    }
}));



const DialogDropdown = ({ label, options, handleOnChange, selected, isDisabled }) => {
  
    const classes = useStyles();

    return (
        <>
            <div className="mb-1">
                <Typography
                    size={14}
                    text="default"
                >
                    {label}
                </Typography>
            </div>
            <Autocomplete
                id={label}
                className="select-combobox"
                options={options}
                onChange={handleOnChange}
                value={selected}
                disabled={isDisabled}
                disablePortal={true}
                inputValue={selected ? selected.name : ""}
                getOptionLabel={(option) => `${option.name}`}
                renderInput={(params) => <TextField {...params} placeholder={"Select"} variant="outlined" />}
                renderOption={(option) => `${option.name}`}
                disableClearable
                classes={{
                    inputRoot: classes.inputRoot,
                    input: classes.input,
                    popper: classes.popper
                }}
            />
        </>
    );

}

export default DialogDropdown;