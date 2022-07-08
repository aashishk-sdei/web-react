import React from 'react';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import {titleCase} from "../utils/titlecase"


const LocationOptions = ({ option, inputValue }) => {
    const Name = `${titleCase(option.name)}`;
    const matches = match(Name, inputValue);
    const parts = parse(Name, matches);

    return (
      <>
        <div>
          {parts.map((part, index) => (
            <span key={index} className={`${part.highlight ? "typo-font-bold" : "typo-font-regular"} text-black`}>
              {part.text}
            </span>
          ))}
        </div>
      </>
    );
}

export default LocationOptions;