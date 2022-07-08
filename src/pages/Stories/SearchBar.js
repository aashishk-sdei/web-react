import React from "react";
import { Field, Formik } from "formik";
import TextField from "@material-ui/core/TextField";
import { getOptionLabel } from "shared-logics";
import SearchPeople from "../../components/SearchPeople/SearchPeople";
import "./index.css";
const getPersonSelected = (treePeople, id) => {
  if (id && treePeople) {
    const _person = treePeople.find((_per) => _per.id === id);
    return { ..._person, name: getOptionLabel(_person) };
  }
  return {};
};
const SearchBar = ({ primaryPersonId, treePeople, selectPeople, placeholder = "Search", disabled = false }) => {
  return (
    <Formik initialValues={{ search: getPersonSelected(treePeople, primaryPersonId) }} enableReinitialize={true}>
      <Field
        name="search"
        component={SearchPeople}
        placeholder={placeholder}
        freeSolo={true}
        closeIconDisable={false}
        highlight={true}
        height={40}
        fontSize={14}
        popoverMt={36}
        renderInput={(params) => (
          <div ref={params.InputProps.ref} className="relative">
            <span className="icon absolute z-10 left-3 top-2">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.22674 13.1309C4.01019 14.9744 5.49388 16.4311 7.3514 17.1806C9.20892 17.9302 11.2881 17.9111 13.1316 17.1277C14.9751 16.3442 16.4318 14.8605 17.1813 13.003C17.9309 11.1455 17.9118 9.06629 17.1284 7.22282C16.3449 5.37935 14.8612 3.9226 13.0037 3.17306C11.1462 2.42351 9.067 2.44257 7.22353 3.22602C5.38006 4.00948 3.92331 5.49317 3.17377 7.35069C2.42423 9.20821 2.44328 11.2874 3.22674 13.1309V13.1309Z" stroke="#555658" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15.5176 15.5167L21.3751 21.3751" stroke="#555658" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <TextField {...params} placeholder={placeholder} variant="outlined" />
          </div>
        )}
        options={treePeople}
        selectPeople={selectPeople}
        getOptionDisabled={[]}
        disabled={disabled}
      />
    </Formik>
  );
};
export default SearchBar;
