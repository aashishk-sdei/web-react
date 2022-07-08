import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { trimString } from "shared-logics";

// components
import TailwindModal from "../TailwindModal";
import Button from "../Button";
import Input from "../Input";
import DialogDropdown from "../Dropdown/DialogDropdown";
import SelectButton from "../SelectButton";
import Location from "../SearchLocation/Location";
import Typography from "../Typography";
import Checkbox from "../Checkbox";

// utlis
import { tr } from "../utils";
import { MALE, FEMALE, OTHER } from "../../utils";

const RelationshipEventModal = (
  { newEvent,
    eventModalPerson,
    handleChange,
    handleGender,
    setShowEventModal,
    showEventModal,
    setEventModalPerson,
    handleIsLiving,
    handleNewRelationshipEvent,
    handleGetDirectChildren,
    directChildren,
    handleClearEventInfo,
    ...props }) => {
  const { date, locationId, location, description, birthLocationId, deathLocationId, birthLocation, deathLocation, sfirstName, slastName } = eventModalPerson;
  const [option, setOption] = useState(null);
  const [showBottomSection, setShowBottomSection] = useState(false);
  const [selectedLocationValue, setSelectedLocationValue] = useState({ id: locationId, name: location });
  const [selectedBirthLocationValue, setSelectedBirthLocationValue] = useState({ id: birthLocationId, name: birthLocation });
  const [selectedDeathLocationValue, setSelectedDeathLocationValue] = useState({ id: deathLocationId, name: deathLocation });

  useEffect(() => {
    document.activeElement.blur();
    const dateElem = document.getElementById("date");
    if (dateElem) dateElem.focus();
  }, [])

  useEffect(() => {
    if (directChildren && directChildren.length > 0 && eventModalPerson && !eventModalPerson.directChildren) {
      setEventModalPerson({
        ...eventModalPerson,
        directChildren
      })
    }
  }, [directChildren, eventModalPerson, setEventModalPerson, showBottomSection])

  const handleSave = () => {
    setShowEventModal(false);
    handleNewRelationshipEvent(eventModalPerson);
  };

  const handleLocationPlace = (obj, event) => {
    if (selectedLocationValue && selectedLocationValue.name !== obj.target.value) {
      if (event && event.preventDefault && !event.shiftKey) event.preventDefault();
      const { locationId: currentLocationId, name, value } = obj.target;
      setSelectedLocationValue({ id: currentLocationId, name: value });
      const e = {
        target: {
          name,
          value,
          locationId: currentLocationId || "",
        },
      };
      handleChange(e);
      const descriptionInput = document.getElementById("description");
      if(descriptionInput) descriptionInput.focus();
    }
  };

  const handleBirthPlace = (obj, event) => {
    if (selectedBirthLocationValue && selectedBirthLocationValue.name !== obj.target.value) {
      if (event && event.preventDefault && !event.shiftKey) event.preventDefault();
      const { locationId: currentBirthLocationId, value } = obj.target;
      setSelectedBirthLocationValue({ id: currentBirthLocationId, name: value });
      const e = {
        target: {
          name: "birthLocation",
          value,
          birthLocationId: currentBirthLocationId || "",
        },
      };
      handleChange(e);
      if (eventModalPerson.isLiving) {
        setTimeout(() => {
          const isLivingInput = document.getElementById("isLiving");
          if(isLivingInput) isLivingInput.focus();
        }, 500)
      } else {
        const death = document.getElementById("death");
        if(death) death.focus();
      }
    }
  };

  const handleDeathPlace = (obj, event) => {
    if (selectedDeathLocationValue && selectedDeathLocationValue.name !== obj.target.value) {
      if (event && event.preventDefault && !event.shiftKey) event.preventDefault();
      const { locationId: currentDeathLocationId, value } = obj.target;
      setSelectedDeathLocationValue({ id: currentDeathLocationId, name: value });
      const e = {
        target: {
          name: "deathLocation",
          value,
          deathLocationId: currentDeathLocationId || "",
        },
      };
      handleChange(e);
      setTimeout(() => {
        const isLivingInput = document.getElementById("isLiving");
        if(isLivingInput) isLivingInput.focus();
      }, 500)
    }
  };

  const handleOnChange = (event, newValue) => {
    const { name, value } = event.target;
    setOption(newValue);
    setEventModalPerson({
      ...eventModalPerson,
      [name]: value,
      sfirstName: newValue.firstName,
      slastName: newValue.lastName,
      spousalRelationshipId: newValue.spousalRelationshipId,
      spouseId: newValue.spouseId
    });
    if (newValue.spouseId === "00000000-0000-0000-0000-000000000000") {
      handleGetDirectChildren(eventModalPerson);
      setShowBottomSection(true);
    }
    else setShowBottomSection(false);
  };

  const checkDisable = () => {
    if (eventModalPerson.spouseId !== "00000000-0000-0000-0000-000000000000") {
      if (trimString(date) || trimString(location) || trimString(description)) {
        return false;
      }
    }
    else {
      if ((trimString(date) || trimString(location) || trimString(description)) && (trimString(sfirstName) || trimString(slastName))) {
        return false
      }
    }
    return true;
  };

  const closeRelationshipEventModal = () => {
    setShowEventModal(false);
    setEventModalPerson(null);
    handleClearEventInfo();
  }

  const handleChildren = (e, c) => {
    let myChildren = eventModalPerson.directChildren.reduce((res, ele) => {
      if (ele.id === c.id) {
        res.push({
          ...ele,
          check: e.target.checked
        })
      } else {
        res.push(ele);
      }
      return res;
    }, []);
    setEventModalPerson({
      ...eventModalPerson,
      directChildren: myChildren
    })
  }

  const handleCheck = (event) => {
    if (event.target.checked) setSelectedDeathLocationValue({ id: null, name: "" });
    handleIsLiving(event.target.checked);
    setTimeout(() => {
      const checkBox = document.getElementById("isLiving");
      if (checkBox) checkBox.focus();
    }, 100);
  };

  return (
    <>
      <TailwindModal
        title={`Add ${newEvent.name}`}
        innerClasses="max-w-144"
        content={
          <>
            <div className="modal-row modal-res-row">
              <div className="w-full smm:w-1/3 mb-2 smm:mb-0">
                <Input
                  id="date"
                  label="person.table.placelived.date"
                  type="text"
                  name="date"
                  value={date}
                  placeholder="e.g. 5 Jan 1954"
                  handleChange={handleChange}
                  autoFocus={true} />
              </div>
              <div className="w-full smm:w-2/3 ml-0 smm:ml-2 smm:mb-3">
                <div>
                  <Typography size={14} text="default" tkey="person.table.placelived.location"></Typography>
                  <div className="mt-1 location-autocomplete">
                    <Location
                      id="location"
                      name="location"
                      value={selectedLocationValue.name}
                      placeholder="search.unisearchform.autocomplete"
                      handleSelectedValue={handleLocationPlace}
                      freeSolo={true}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <Input
                id="description"
                label="person.table.placelived.desc"
                type="text"
                name="description"
                value={description}
                placeholder=""
                hideTitleCase
                handleChange={handleChange} />
            </div>

            <div className="mb-3">
              <div className="w-full smm:w-3/4 ">
                <DialogDropdown label="Spouse" handleOnChange={handleOnChange} options={props.dropDownPayload} selected={option} />
              </div>
            </div>
            {showBottomSection &&
              <BottomSection
                eventModalPerson={eventModalPerson}
                handleChildren={handleChildren}
                handleBirthPlace={handleBirthPlace}
                handleDeathPlace={handleDeathPlace}
                selectedBirthLocationValue={selectedBirthLocationValue}
                setSelectedBirthLocationValue={setSelectedBirthLocationValue}
                selectedDeathLocationValue={selectedDeathLocationValue}
                setSelectedDeathLocationValue={setSelectedDeathLocationValue}
                handleCheck={handleCheck}
                handleChange={handleChange}
                handleGender={handleGender}
              />
            }
            <div className="mt-4 flex  justify-end">
              <Button type="primary" size="large" tkey={"pedigree.dialog.form.btn.save"} handleClick={handleSave} disabled={checkDisable()} loading={props.addingLifeEvent} id="addAction" fontWeight="medium"/>
            </div>
          </>
        }
        showModal={showEventModal}
        setShowModal={closeRelationshipEventModal}
        modalType="Relational"
      />
    </>
  );
};

const BottomSection = ({
  eventModalPerson: { sfirstName, slastName, gender, isLiving, birth, death, selectedName, directChildren },
  handleChildren,
  handleChange,
  handleGender,
  handleCheck,
  handleBirthPlace,
  handleDeathPlace,
  selectedBirthLocationValue,
  selectedDeathLocationValue,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    document.activeElement.blur();
    const sfirstNameElem = document.getElementById("sfirstName");
    if(sfirstNameElem) sfirstNameElem.focus();
  }, [])

  return (
    <>
      <div>
        <div className="pt-3">
          <h4 className="mb-3">
            <Typography weight="medium" text="black-color">
              {`Spouse of ${selectedName}`}
            </Typography>
          </h4>
        </div>
        <div className="modal-res-row">
          <div className="w-full smm:w-3/5 mb-2 smm:mb-0">
            <Input
              id="sfirstName"
              label={tr(t, "f&mName")}
              type="text"
              name="sfirstName"
              value={sfirstName}
              placeholder=""
              autoFocus
              position={sfirstName.length}
              handleChange={handleChange} />
          </div>
          <div className="w-full smm:w-2/5 ml-0 smm:ml-2">
            <Input
              id="slastName"
              label={tr(t, "LastName")}
              type="text" name="slastName"
              value={slastName}
              placeholder=""
              handleChange={handleChange} />
          </div>
        </div>
        <div className="modal-row">
          <div className="mb-1">
            <Typography size={14} text="default" tkey="pedigree.dialog.form.gender"></Typography>
          </div>
          <div className="flex">
            <SelectButton title={tr(t, "pedigree.dialog.gender.male")} select={gender === MALE ? true : false} handleSelect={handleGender} />
            <SelectButton title={tr(t, "pedigree.dialog.gender.female")} select={gender === FEMALE ? true : false} handleSelect={handleGender} />
            <SelectButton title={tr(t, "pedigree.dialog.gender.other")} select={gender === OTHER ? true : false} handleSelect={handleGender} />
          </div>
        </div>
        <div className="modal-row modal-res-row">
          <div className="w-full smm:w-1/3 mb-2 smm:mb-0">
            <Input
              id="birth"
              label="pedigree.dialog.form.bdoy"
              type="text"
              name="birth"
              value={birth}
              placeholder=""
              handleChange={handleChange} />
          </div>
          <div className="w-full smm:w-2/3 ml-0 smm:ml-2">
            <>
              <Typography size={14} text="default" tkey="pedigree.dialog.form.bplace"></Typography>
              <div className="mt-1">
                <Location
                  id="birthLocation"
                  name="birthLocation"
                  value={selectedBirthLocationValue.name}
                  placeholder="search.unisearchform.autocomplete"
                  handleSelectedValue={handleBirthPlace}
                  freeSolo={true}
                  locationType="event-location"
                  dataSource="birthPlaceOptions"
                />
              </div>
            </>
          </div>
        </div>

        {!isLiving && (
          <div className="modal-row modal-res-row">
            <div className="w-full smm:w-1/3 mb-2 smm:mb-0">
              <Input
                id="death"
                label="pedigree.dialog.form.ddoy"
                type="text"
                name="death"
                value={death}
                placeholder=""
                handleChange={handleChange} />
            </div>
            <div className="w-full smm:w-2/3 ml-0 smm:ml-2">
              <>
                <Typography size={14} text="default" tkey="pedigree.dialog.form.dplace"></Typography>
                <div className="mt-1">
                  <Location
                    id="deathLocation"
                    name="deathLocation"
                    value={selectedDeathLocationValue.name}
                    placeholder="search.unisearchform.autocomplete"
                    handleSelectedValue={handleDeathPlace}
                    freeSolo={true}
                    locationType="event-location"
                    dataSource="deathPlaceOptions"
                  />
                </div>
              </>
            </div>
          </div>
        )}
        <div className="modal-row">
          <div className="-ml-3">

            <Checkbox id="isLiving" obj={null} checked={isLiving} color="primary" label="pedigree.nodeform.living" labelColor="secondary" handleChange={handleCheck} />
          </div>
        </div>
        {directChildren && directChildren.length > 0 && (
          <div className="border-t border-gray-300 mt-4">
            <div className="modal-row mt-2">
              <Typography
                text="secondary"
                size={16}
                weight="bold"
              >
                Include these people as children of this spouse:
              </Typography>
            </div>
            {directChildren.map((ele, idx) =>
              <div key={idx} className="modal-row mt-0.5 -m-3">
                <Checkbox
                  id={ele.id}
                  obj={ele} checked={ele.check}
                  color="primary"
                  label={`${ele.firstName} ${ele.lastName}`}
                  labelColor="secondary"
                  handleChange={handleChildren}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
export default RelationshipEventModal;