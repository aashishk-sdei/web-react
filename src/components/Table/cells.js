import React, { useRef, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

// Components
import Button from "../Button";
import Select from "../Select";
import Location from "../SearchLocation/Location";
import Tooltip from "../Tooltip";
import { boldAllLifeEventsTitles } from "../Table/helpers";

// Local Components
import OutSideDetector from "./OutSideDetector";
import RowDetailMenuPopover from "./RowDetailMenuPopover";
import MobileRowMenuPopover from "./MobileRowMenuPopover";

// Utils
import { cardGender, tableTypes } from "../utils";
import { titleCase } from "../utils/titlecase";
import { rowInteractionMenu, rowInteractionMenuForEvent, mobileRowInteractionMenu } from "../../pages/PersonViewPage/menus";
import { tr } from "../../components/utils";
import { useTranslation } from "react-i18next";
import * as services from "./services";
import { getCustomImageUrl } from "../../utils";

// Images
import men from "./../../assets/images/maleVectoriconlg.svg";
import women from "./../../assets/images/femaleVectoriconlg.svg";
import defaultImage from "./../../assets/images/otherVectoriconlg.svg";

const { PERSONAL_INFO, LIFE_EVENTS, SPOUSES_AND_CHILDREN, PARENTS_AND_SIBLINGS, EVENTS } = tableTypes;

const MAX_WIDTH = 512;

const { MALE, FEMALE, OTHER } = cardGender;

const genderOptions = [MALE, FEMALE, OTHER];

const getImage = (data) => {
  switch (true) {
    case data.imgsrc === "" && data.gender === MALE:
      return men;
    case data.imgsrc === "" && data.gender === FEMALE:
      return women;
    case data.imgsrc === "":
      return defaultImage;
    default:
      return getCustomImageUrl("q=100,w=24,h=24", data.imgsrc);
  }
};

const Cells = ({ dataRow, cellId, actualValue, editTableData, handleBlur, handleChange, handleClose, handleKeyDown, inputWidth, image, nameDetails, handleNameDetails, handleNameBlur, handleNameKeyDown, handleNameCellClick, handleDeleteLifeEvent, handleDeleteClick, keyIndex, isMobile, isRowClick, mobileMenuPop, setMobileMenuPop, person, ...props }) => {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const inputFirstNameRef = useRef(null);
  const inputLastNameRef = useRef(null);
  const [startpos, setStartpos] = useState(1);
  const [rowElement, setRowElement] = useState(null);
  const history = useHistory();
  const { treeId } = useParams();

  useEffect(() => {
    let cursorPosition = startpos;
    if (inputRef.current) {
      inputRef.current.selectionStart = cursorPosition;
      inputRef.current.selectionEnd = cursorPosition;
    }
    if (inputFirstNameRef.current && services.getMultiInput() === "firstName") {
      inputFirstNameRef.current.selectionStart = cursorPosition;
      inputFirstNameRef.current.selectionEnd = cursorPosition;
    }
    if (inputLastNameRef.current && services.getMultiInput() === "lastName") {
      inputLastNameRef.current.selectionStart = cursorPosition;
      inputLastNameRef.current.selectionEnd = cursorPosition;
    }
  }, [editTableData?.value, nameDetails?.firstName, nameDetails?.lastName]);

  //to highlight row on row menu click
  useEffect(() => {
    if (rowElement) rowElement.classList.add("menu-drop-active");
    return () => {
      if (rowElement) rowElement.classList.remove("menu-drop-active");
    };
  }, [rowElement]);

  const handleTitleCase = (e) => {
    const str = e.target.value;
    setStartpos(str.length === 0 ? 1 : e.target.selectionStart);
    const updatedstr = titleCase(str);
    return {
      target: {
        name: e.target.name,
        value: updatedstr,
      },
    };
  };

  const handleChangeVal = (e) => {
    const event = handleTitleCase(e);
    handleChange(event);
  };

  const handleNameDetailsChange = (e) => {
    services.setMultiInput(e.target.name);
    const event = handleTitleCase(e);
    handleNameDetails(event);
  };

  const viewPersonPage = (item) => {
    return history.push(`/family/person-page/${treeId}/${item.id}`);
  };

  const viewTreeViewer = (item) => {
    return history.push(`/family/pedigree-view/${treeId}/${item.id}/4`);
  };

  //to handle row menu interaction
  const showViewMenu = (e) => {
    e.stopPropagation();
    let elem = e.target.parentNode.parentNode;
    let closestTrTag = elem.closest("tr");
    setRowElement(closestTrTag);
  };

  const getRowInteractionMenu = (data) => {
    if (data.isPrivate) {
      return false;
    } else {
      switch (data.tableType) {
        case SPOUSES_AND_CHILDREN:
        case PARENTS_AND_SIBLINGS:
          if (data.name.includes("Unknown")) return false;
          return true;
        case LIFE_EVENTS:
          return props.isOwner;
        default:
          return false;
      }
    }
  };

  const getRowInteractionViewButton = (data) => {
    if (data.isPrivate) {
      return false;
    } else {
      switch (data.tableType) {
        case SPOUSES_AND_CHILDREN:
        case PARENTS_AND_SIBLINGS:
          if (data.name.includes("Unknown")) return false;
          return true;
        default:
          return false;
      }
    }
  };

  const getInputStyle = () => {
    const width = {
      width: inputWidth > MAX_WIDTH ? MAX_WIDTH : inputWidth,
      border: null,
    };
    const nullWidth = {
      width: null,
    };
    if (editTableData.tableType === PERSONAL_INFO) return width;
    else return nullWidth;
  };

  const getMultiInputStyle = () => {
    return {
      border: null,
    };
  };

  const getName = (detail) => {
    if (detail.firstName) return `${detail.firstName}`;
    else return `${detail.lastName}`;
  };

  const handleRowInteractionMenu = (event, rowDetails) => {
    switch (event.id) {
      case 5:
        props.handleCellClick(editTableData, "FROM_MENU");
        break;
      case 1:
        viewPersonPage(rowDetails);
        break;
      case 2:
        viewTreeViewer(rowDetails);
        break;
      case 3:
        let isRowEvent = rowDetails.id === person.personalInfo.id ? false : true;
        handleDeleteClick(rowDetails, isRowEvent);
        break;
      case 4:
        handleDeleteLifeEvent(rowDetails);
        break;
      default:
        break;
    }
  };

  const getMenu = (rowInfo) => {
    if (rowInfo.tableType === "LIFE_EVENTS") {
        setTimeout(() => {
            let listElement = document.getElementById("interaction-menu");
            if (listElement) listElement.classList.add("delete-dropdown-event");
        }, 10); 

      return rowInteractionMenuForEvent;
    } else {
      const customizeMenu = rowInteractionMenu(getName(rowInfo));
      return (
        customizeMenu &&
        customizeMenu.filter((e) => {
          if (props.isOwner) return e;
          else if (e.id !== 3) return e;
        })
      );
    }
  };

  const getDisabledMenuItem = (e, rowInfo) => {
    switch (e.id) {
      case 2:
      case 1:
        return false;
      case 3:
        if (rowInfo.id === person.personalInfo.homePersonId) return true;
        return false;
      default:
        break;
    }
  };

  const getMobileRowMenu = (rowInfo) => {
    if (rowInfo.tableType === "LIFE_EVENTS"){
        setTimeout(() => {
            let listElement = document.getElementById("mobile-interaction-menu");
            if (listElement) listElement.classList.add("delete-dropdown-event");
        }, 5); 
        return rowInteractionMenuForEvent;
    } 
    else {
      const customizeMenu = mobileRowInteractionMenu(getName(dataRow));
      return (
        customizeMenu &&
        customizeMenu.filter((e) => {
          if (props.isOwner) return e;
          else if (e.id !== 3 && e.id !== 5) return e;
        })
      );
    }
  };

  const getBlur = () => {
    if ((keyIndex !== 0 && dataRow.isPrivate) || (keyIndex === 7 && dataRow.isPrivateSpouse)) return "filter blur-sm";
    return "";
  };

  const checkDisabled = () => {
    return (keyIndex !== 0 && dataRow.isPrivate) || (keyIndex === 7 && dataRow.isPrivateSpouse) || dataRow?.relationshipTooltip?.includes(1);
  };

  if (editTableData && editTableData.editTable && editTableData.cellId === cellId) {
    if (editTableData.type === "select") {
      return (
        <div className="edit-cell shadow-1x">
          <Select open={true} id="selectGender" name={editTableData.name} options={genderOptions} value={editTableData.value} handleChange={handleChange} handleClose={handleClose} familyTable={editTableData.tableType === PERSONAL_INFO ? false : true} />
        </div>
      );
    } else if (editTableData.type === "location") {
      return (
        <div className="w-full shadow-1x" style={{ minWidth: "340px" }}>
          <Location id={editTableData.id} className="table-location" name={editTableData.name} value={editTableData.value} placeholder="search.unisearchform.autocomplete" handleSelectedValue={handleChange} freeSolo={true} inputRef={true} locationType="table" tableType={editTableData.tableType} actualValue={dataRow[props.keyValue]}/>
        </div>
      );
    } else if (editTableData.type === "multiInput") {
      return (
        <div className="fullname-box">
          <OutSideDetector handleNameBlur={handleNameBlur}>
            <div className="fullname-control">
              <input ref={inputFirstNameRef} id="firstName" name="firstName" autoFocus={true} value={nameDetails.firstName} onChange={handleNameDetailsChange} placeholder={tr(t, "f&mName")} onKeyDown={handleNameKeyDown} onClick={() => handleNameCellClick("firstName")} style={getMultiInputStyle()} />
              <input ref={inputLastNameRef} id="lastName" name="lastName" value={nameDetails.lastName} onChange={handleNameDetailsChange} placeholder={tr(t, "LastName")} onKeyDown={handleNameKeyDown} onClick={() => handleNameCellClick("lastName")} style={getMultiInputStyle()} />
            </div>
          </OutSideDetector>
        </div>
      );
    } else {
      return (
        <div className="w-full shadow-1x">
          <input ref={inputRef} id={editTableData.id} type={editTableData.type} autoFocus={editTableData.autoFocus} name={editTableData.name} value={editTableData.value} onBlur={handleBlur} onChange={handleChangeVal} onKeyDown={handleKeyDown} style={getInputStyle()} />
        </div>
      );
    }
  } else {
    return (
      <>
        {isMobile && isRowClick && isRowClick.cellId === cellId && getRowInteractionMenu(dataRow) && (keyIndex === 0 || dataRow.type) && (
          <div id="mobile-row-popover">
            <MobileRowMenuPopover anchorEl={mobileMenuPop} menu={getMobileRowMenu(dataRow)} disabledMenuItem={(e) => getDisabledMenuItem(e, dataRow)} handleMenu={(e) => handleRowInteractionMenu(e, dataRow)} setMobileMenuPop={setMobileMenuPop} />
          </div>
        )}

        {getRowInteractionMenu(dataRow) && keyIndex === 0 && (
          <div className="user-drop-menu" onClick={showViewMenu}>
            <div className="inner-drop-menu">
              <RowDetailMenuPopover menu={getMenu(dataRow)} disabledMenuItem={(e) => getDisabledMenuItem(e, dataRow)} handleMenu={(e) => handleRowInteractionMenu(e, dataRow)} setRowElement={setRowElement} />
            </div>
          </div>
        )}

        {image && <img src={props.isOwner || (!props.isOwner && !dataRow.isPrivate) ? getImage(dataRow) : defaultImage} alt="profile-img" className="mr-1.5 avtar-square-small" />}

        <Tooltip type="ellipses" placement="top" title={actualValue} disabled={checkDisabled()} tableName={dataRow.tableType}>
          {dataRow.tableType === LIFE_EVENTS && keyIndex === 1 && boldAllLifeEventsTitles.includes(actualValue) ? (
            <div>
              <b>{actualValue}</b>
            </div>
          ) : dataRow.tableType === EVENTS && keyIndex === 4 ? (
            <div className="flex">{actualValue}</div>
          ) : (
            <div className={getBlur()}>{actualValue}</div>
          )}
        </Tooltip>
        {!isMobile && getRowInteractionViewButton(dataRow) && keyIndex === 0 && (
          <div className="user-view-menu">
            <Button handleClick={() => viewPersonPage(dataRow)} icon="person" title="View" type="default" fontWeight="medium" />
          </div>
        )}
      </>
    );
  }
};

export default Cells;
