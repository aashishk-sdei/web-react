import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import { trimString } from "shared-logics";

// Components
import Typography from "../Typography";
import Button from "../Button";
import Location from "../SearchLocation/Location";
import { titleCase } from "../utils/titlecase";

const useStyles = makeStyles(() => ({
    paper: {
        background: "transparent",
        marginTop: "-3.25rem",
        '@media (max-width:1025px)': {
            maxWidth: "100%",
            left: "0 !important"
        }
    },
}));

const getEmptyForm = (value) => {
    return [
        {
            id: 'age',
            type: 'text',
            name: 'age',
            value: '',
            autoFocus: true,
            editMode: false
        },
        {
            id: 'type',
            type: 'text',
            name: 'type',
            value,
            autoFocus: true,
            editMode: false,
        },
        {
            id: 'date',
            type: 'text',
            name: 'date',
            value: '',
            autoFocus: true,
            editMode: true,
        },
        {
            id: 'location',
            type: 'text',
            locationId: "",
            name: 'location',
            value: '',
            autoFocus: true,
            editMode: false,
        },
        {
            id: 'description',
            type: 'text',
            name: 'description',
            value: '',
            autoFocus: true,
            editMode: false,
        }
    ]
}

const nonEditTableCells = ["age", "type"];
const CANCEL_BUTTON = "CancelButton";
const SAVE_BUTTON = "SaveButton";
const FOCUS_INTERVAL = 100;

let location = {
    target: {
        locationId: "",
        name: "location",
        value: ""
    }
};
let keyEvent = "";
let focusedButton = "";
let locationSelected = false;

const EventPopover = ({ anchorEl, ...props }) => {
    const classes = useStyles();
    const inputRef = useRef(null);
    const [startpos, setStartpos] = useState(1);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popoverevent' : undefined;
    const [formData, setFormData] = useState([]);
    const [disable, setDisable] = useState(true);

    useEffect(() => {
        if (props.lifeEventAdded) {
            location = {
                target: {
                    locationId: "",
                    name: "location",
                    value: ""
                }
            };
            keyEvent = "";
            focusedButton = "";
            setFormData(getEmptyForm(props.value));
            props.handleCloseEventPopover();
        }
    }, [props.lifeEventAdded])

    useEffect(() => {
        setDisable(true);
        setFormData(getEmptyForm(props.value));
    }, [props.value, setDisable]);

    useEffect(() => {
        let cursorPosition = startpos;
        if (inputRef.current) {
            inputRef.current.selectionStart = cursorPosition
            inputRef.current.selectionEnd = cursorPosition
        }
    }, [formData]);

    const handleCancel = () => {
        location = {
            target: {
                locationId: "",
                name: "location",
                value: ""
            }
        };
        keyEvent = "";
        focusedButton = "";
        setFormData(getEmptyForm(props.value));
        props.handleCloseEventPopover();
    }

    const getDisabled = (newForm) => {
        return new Promise((resolve) => {
            const checkArr = ["date", "location", "description"];
            const disabled = newForm.find(ele => checkArr.includes(ele.name) && trimString(ele.value) != "");
            if (disabled) resolve(false);
            else resolve(true)
        })
    }

    const handleChange = async (e) => {
        const { locationId, name, value } = e.target;
        setStartpos(value.length === 0 ? 1 : e.target.selectionStart);
        const newForm = JSON.parse(JSON.stringify(formData));
        const newItem = newForm.find(e1 => e1.name === name);
        newItem.value = name === "description" ? value : titleCase(value);
        if (name === "location") {
            newItem.editMode = false;
            newItem.locationId = locationId;
            locationSelected = false;
        }
        const disabled = await getDisabled(newForm);
        setDisable(disabled);
        setFormData(newForm);
    }

    const handleCellClick = (selectedCell) => {
        if (!locationSelected && !nonEditTableCells.includes(selectedCell.name)) {
            if (selectedCell.name === "location") locationSelected = true;
            const newForm = formData;
            const newEditMode = newForm.reduce((res, ele) => {
                res.push({
                    ...ele,
                    editMode: selectedCell.name === ele.name ? true : false
                });
                return res;
            }, []);
            setFormData(newEditMode);
            setStartpos(selectedCell.value.length);
        }
    }

    const handleSubmit = () => {
        if (!props.loading) props.handleNewEvent(formData);
    }

    const handleLocation = async (value, event) => {
        location = value;
        keyEvent = event;
        focusedButton = "";
        if (event.type === "blur") handleChange(value);
        if (event.type === "click") setNewInputCell("description");
        else handleKeyDown(event);
    }

    const handleKeyDown = (e) => {
        if (e.shiftKey && e.keyCode === 9) {
            const prevCell = getPrevInputCell();
            if (prevCell) {
                e.preventDefault();
                setNewInputCell(prevCell);
                if (prevCell === "location") locationSelected = true;
                else locationSelected = false;
                return;
            } else if ((focusedButton === CANCEL_BUTTON && disable) || focusedButton === SAVE_BUTTON) {
                e.preventDefault();
                setNewInputCell("description");
                focusedButton = "";
                return;
            } else if (focusedButton === CANCEL_BUTTON && !disable) {
                e.preventDefault();
                setNewInputCell(prevCell);
                const saveButton = document.getElementById("table-modal-save");
                setTimeout(() => {
                    if (saveButton) saveButton.focus();
                }, FOCUS_INTERVAL);
                focusedButton = SAVE_BUTTON;
                return;
            } else if (focusedButton === "") {
                e.preventDefault();
                setNewInputCell(prevCell);
                const cancelButton = document.getElementById("table-modal-cancel");
                setTimeout(() => {
                    if (cancelButton) cancelButton.focus();
                }, FOCUS_INTERVAL);
                focusedButton = CANCEL_BUTTON;
                return;
            }
        } else if (!e.shiftKey) {
            if (e.keyCode === 9 || e.keyCode === 13) {
                if (e.keyCode === 13 && (focusedButton === SAVE_BUTTON || focusedButton === CANCEL_BUTTON)) return;
                const nextCell = getNextInputCell();
                if (nextCell) {
                    e.preventDefault();
                    setNewInputCell(nextCell);
                    if (nextCell === "location") locationSelected = true;
                    else locationSelected = false;
                    return;
                } else if ((focusedButton === "" && disable) || focusedButton === SAVE_BUTTON) {
                    e.preventDefault();
                    setNewInputCell(nextCell);
                    const cancelButton = document.getElementById("table-modal-cancel");
                    setTimeout(() => {
                        if (cancelButton) cancelButton.focus();
                    }, FOCUS_INTERVAL);
                    focusedButton = CANCEL_BUTTON;
                    return;
                } else if (focusedButton === "" && !disable) {
                    e.preventDefault();
                    setNewInputCell(nextCell);
                    const saveButton = document.getElementById("table-modal-save");
                    setTimeout(() => {
                        if (saveButton) saveButton.focus();
                    }, FOCUS_INTERVAL);
                    focusedButton = SAVE_BUTTON;
                    return;
                } else if (focusedButton === CANCEL_BUTTON) {
                    e.preventDefault();
                    setNewInputCell("date");
                    focusedButton = "";
                    return;
                }
            }
        }
    }

    const getNextInputCell = () => {
        const currentCell = formData.find((ele) => ele.editMode);
        if (currentCell) {
            switch (currentCell.name) {
                case "date":
                    return "location";

                case "location":
                    return "description";

                default:
                    return null;
            }
        } else {
            return null;
        }
    }

    const getPrevInputCell = () => {
        const currentCell = formData.find((ele) => ele.editMode);
        if (currentCell) {
            switch (currentCell.name) {
                case "location":
                    return "date";

                case "description":
                    return "location";

                default:
                    return null;
            }
        } else {
            return null;
        }
    }

    const setNewInputCell = async (nextName) => {
        handleHighLight(nextName);
        let newFormData = formData;
        const updatedFormData = newFormData.reduce((res, ele) => {
            res.push({
                ...ele,
                editMode: ele.name === nextName && nextName !== null ? true : false,
                locationId: ele.name === "location" ? location.target.locationId : "",
                value: ele.name === "location" ? location.target.value : ele.value,
            });
            return res;
        }, []);
        setFormData(updatedFormData);
        const disabled = await getDisabled(updatedFormData);
        setDisable(disabled);
    }

    const handleHighLight = (selectedId) => {
        setTimeout(() => {
            const highLight = document.getElementById(selectedId);
            if (highLight) highLight.select();
        }, FOCUS_INTERVAL)
    }

    const handleEmpty = async () => {
        let newFormData = formData;
        const updatedFormData = newFormData.reduce((res, ele) => {
            res.push({
                ...ele,
                locationId: "",
                value: ele.name === "location" ? "" : ele.value,
            });
            return res;
        }, []);
        setFormData(updatedFormData);
        const disabled = await getDisabled(updatedFormData);
        setDisable(disabled);
    }

    return (
        <>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleCancel}
                elevation={0}
                classes={{
                    paper: classes.paper
                }}
            >
                <InputTable
                    handleCancel={handleCancel}
                    formData={formData}
                    disable={disable}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    handleCellClick={handleCellClick}
                    handleLocation={handleLocation}
                    handleKeyDown={handleKeyDown}
                    handleEmpty={handleEmpty}
                    inputRef={inputRef}
                    {...props}
                />
            </Popover>
        </>
    );
}

export default EventPopover;

const InputTable = ({ formData, handleCancel, ...props }) => {

    return (
        <div className="flex flex-col overflow-y-visible  overflow-x-hidden pl-0 pr-0 xl:pl-0 xl:pr-3 ">
            <div className="flex justify-end py-1 px-1 xl:px-3 xl:-mx-5" tabIndex={props.disable ? '0' : '1'} onKeyDown={props.handleKeyDown}>
                <Button
                    title="Cancel"
                    type="link-white"
                    size="large"
                    icon="delete"
                    disabled={false}
                    handleClick={handleCancel}
                    id="table-modal-cancel"
                    fontWeight="medium"
                />
            </div>
            <div className="allevent-table-responsive ">
                <div className="allevent-table ">
                    <div className="allevent-row t-head">
                        <div className="allevent-cell all-age">Age</div>
                        <div className="allevent-cell all-event">Event</div>
                        <div className="allevent-cell all-date">Date</div>
                        <div className="allevent-cell all-location">Location</div>
                        <div className="allevent-cell all-description">Description</div>
                    </div>
                    <div className="allevent-row t-body">
                        {formData && formData.map((data, idx) => {
                            return <InputTableCell data={data} idx={idx} {...props} />
                        })}
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap justify-between mt-4 px-4 xl:px-1 pb-1">
                <Typography
                    text="white-color"
                    weight="light"
                    size={14}
                >
                    You can tab or click through fields to edit
                </Typography>
                <div className="flex mt-3 smm:mt-0 w-full smm:w-auto ml-auto" tabIndex={props.disable ? '1' : '0'} onKeyDown={props.handleKeyDown}>
                    <Button
                        title="Save"
                        type="primary"
                        size="large"
                        disabled={props.disable}
                        loading={props.loading}
                        handleClick={props.handleSubmit}
                        id="table-modal-save"
                        fontWeight="medium"
                    />
                </div>
            </div>
        </div>
    )
}

const InputTableCell = ({ data, idx, ...props }) => {

    if (data.editMode) {
        return (
            <div key={idx} className="allevent-cell">
                <div className="allevent-box">
                    <div className="allevent-control">
                        {
                            data.name === "location" ?
                                <div className="w-full shadow-1x">
                                    <Location
                                        id={data.id}
                                        className="eventpopper-location"
                                        name={data.name}
                                        value={data.value}
                                        placeholder="search.unisearchform.autocomplete"
                                        handleSelectedValue={props.handleLocation}
                                        freeSolo={true}
                                        inputRef={true}
                                        highLight={true}
                                        locationType="table"
                                        handleEmpty={props.handleEmpty}
                                        disablePortal={false}
                                    />
                                </div>
                                :
                                <input
                                    ref={props.inputRef}
                                    id={data.id}
                                    type={data.type}
                                    name={data.name}
                                    value={data.value}
                                    autoFocus={data.autoFocus}
                                    onChange={props.handleChange}
                                    onKeyDown={props.handleKeyDown}
                                />
                        }
                    </div>
                </div>
            </div>
        )
    } else {
        return <div key={idx} className="allevent-cell" onClick={() => props.handleCellClick(data)}>
            <div className="allevent-cell-text">
                {idx === 4 ? data.value : titleCase(data.value)}
            </div>
        </div>
    }
}