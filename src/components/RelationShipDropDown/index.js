import React, { useState } from 'react';
import Typeahead from '../Typeahead';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import Typography from "../Typography";
import className from "classnames";
import { strFirstUpCase} from "../../utils"
const relationshipArray = (name, valuesPn) => {
   return [
       { id: "Mother", name: `${name} is ${valuesPn.givenName.givenName}'s Mother` },
       {id: "Father", name: `${name} is ${valuesPn.givenName.givenName}'s Father` },
       { id: "Spouse", name: `${name} is ${valuesPn.givenName.givenName}'s Spouse` },
       {id: "Son", name: `${name} is ${valuesPn.givenName.givenName}'s Son` },
       { id: "Daughter", name: `${name} is ${valuesPn.givenName.givenName}'s Daugther` },
       { id: "Brother", name: `${name} is ${valuesPn.givenName.givenName}'s Brother` },
       { id: "Sister", name: `${name} is ${valuesPn.givenName.givenName}'s Sister` }
    ]
} 
const getName = (person) => {
    let name = []
    if (person && person.firstName) {
        name.push(strFirstUpCase(person.firstName))
    }
    if (person && person.lastName) {
        name.push(strFirstUpCase(person.lastName))
    }
    return name.join(' ')
}

const Realationshipdropdown = ({ field, form, getOptionDisabled = [], modalPerson, ...props }) => {
    const name = getName(modalPerson);
    const valuesPn = form.values.pn;
    const [_relationshipArray, setRelationshipArray] = useState(relationshipArray(name, valuesPn))
    const handleChange = (val) => {
         form.setFieldValue(`${field.name}`, val?.name || "")
    }
    const value = field.value || ""
    const renderOption = (option) => {
        const matchesValues = match(option.name, value);
        const partsData = parse(option.name, matchesValues);
        return <React.Fragment>
            <div className="flex flex-col w-full pb-1">
                <div>
                    {partsData.map((partkey, index) => (
                        <Typography size={16} text="secondary">
                            <span key={index} className={className('', { "typo-font-bold": partkey.highlight, "typo-font-regular": !partkey.highlight })}>
                                {partkey.text}
                            </span>
                        </Typography>
                    ))}
                </div>
            </div>
        </React.Fragment>
    }

    return (
        <div className="flex mt-0 w-full">
            <Typeahead 
                id={"68658"}
                {...props}
                getOptionDisabled={getOptionDisabled}
                options={_relationshipArray}
                value={value ? {id:value,name:value} : null}
                handleChange={handleChange}
                placeholder={props.placeholder ? props.placeholder : "Search Relationship"}
                disabled={props.disabled}
                renderOption={renderOption}
                setRelationshipArray={setRelationshipArray}
                // extraRender={getDateString}
                open={props.open}
                type={props.type}
            />
        </div>
    );
}



export default Realationshipdropdown;