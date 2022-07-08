import { Field, FieldArray } from "formik";
import { v4 as uuidv4 } from "uuid";
import TWDropDownComponent from "../../components/TWDropDown/TWDropDownComponent";
import SearchLocation from "../../components/FWSearchLocation"
import { CheckExactField, getFirstAndLastName, handleSearchType, getLastNode } from "./helper";
import { tr } from "../../components/utils";
import { getDisabledOptions, handleYearkeypress, getYearsOptions } from "../../utils";
import { handleBirthSearchType, getDropDown, getLocationSpecification } from "../../utils/search";

export const inputField = (label, formikLiteral, values, setFieldValue, handleChange, defaultSearch, t) => {
  const data = getLastNode(values, formikLiteral);
  return (
    <>
      <label
        className="block text-gray-6 text-sm mb-1"
        htmlFor="grid-input-field"
      >
        {label}
      </label>
      <Field
        name={`${formikLiteral}.t`}
        id="grid-input-field"
        type="text"
        maxLength="35"
        className={`appearance-none block w-full h-10 text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent`}
        onChange={(e) =>
          handleSearchType(
            e,
            handleChange,
            setFieldValue,
            formikLiteral,
            formikLiteral,
            values,
            defaultSearch
          )
        }
      />
      {data?.t && (
        <Field
          name={`${formikLiteral}.s`}
          defaultValue="0"
          onChange={CheckExactField.bind(this, setFieldValue)}
          options={getFirstAndLastName(tr, t)}
          component={TWDropDownComponent}
          getdisabledoptions={getDisabledOptions(
            getFirstAndLastName,
            data.t
          )}
        />
      )}
    </>
  )
}

export const yearField = (label, formikLiteral, values, setFieldValue, defaultSearch) => {
  const data = getLastNode(values, formikLiteral);
  return (
    <>
      <label className="block text-gray-6 text-sm mb-1 w-full" htmlFor="grid-year">
        {label}
      </label>
      <Field
        name={`${formikLiteral}.y`}
        maxLength="4"
        className={`appearance-none block w-full h-10 text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent placeholder-gray-4::placeholder`}
        id="grid-year"
        type="text"
        onKeyPress={handleYearkeypress}
        onChange={(e) =>
          handleBirthSearchType(e, setFieldValue, formikLiteral, formikLiteral, values, defaultSearch)
        }
      />
      {data?.y && (
        <Field
          name={`${formikLiteral}.s`}
          onChange={CheckExactField.bind(this, setFieldValue)}
          component={TWDropDownComponent}
          options={getYearsOptions()}
        />
      )}
    </>
  )
}

export const dropDownField = (label, formikLiteral, values, dropdown, dropdownLoading, t) => {
  return (
    <>
      <label className="block text-gray-6 text-sm mb-1 w-full" htmlFor="grid-race">
        {label}
      </label>
      <div className="relative">
        <Field
          name={formikLiteral}
          className={`block appearance-none h-10 w-full border border-gray-3 text-gray-${values[formikLiteral] ? "7" : "4"
            } tw-sel-src bg-white px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent`}
          id="dropdown"
          placeholder="Select"
          as="select"
        >
          {getDropDown(dropdown, dropdownLoading, t)}
        </Field>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-7">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </>
  )
}

export const locationField = (label, formikLiteral, name, values, setFieldValue, placeholder) => {
  return (
    <>
      <label
        className="block text-gray-6 text-sm mb-1"
        htmlFor="locations-filter"
      >
        {label}
      </label>
      <div className="relative">
        <Field
          name={name}
          relatedField={`${formikLiteral}.li.s`}
          relatedNameField={`${formikLiteral}.l.s`}
          component={SearchLocation}
          freeSolo={true}
          searchType={true}
          placeholder={placeholder}
          id="locations-filter"
          highlight={true}
        />
      </div>
      {getLocationSpecification(
        values[name],
        `${formikLiteral}.li.s`,
        `${formikLiteral}.l.s`,
        setFieldValue
      )}
    </>
  )
}

//rel
const getRelationshipStr = (arr) => {
  let str = "";
  for (let i = 0; i < arr.length; i++) {
    str += `${arr[i].f || ""}${arr[i].l ? " " : ""}${arr[i].l || ""}${i === arr.length - 1 ? "" : ", "}`;
  }
  return str;
};
export const getRelationship = (Relationships) => {
  let html = [];
  if (Relationships?.length) {
    let parents = Relationships.filter((y) => y.r === "Father" || y.r === "Mother");
    let spouse = Relationships.filter((y) => y.r === "Spouse");
    let children = Relationships.filter((y) => y.r === "Child");
    let sibling = Relationships.filter((y) => y.r === "Sibling");
    if (parents.length) {
      html.push(
        <div className="refine-row border-b border-gray-2 pb-2 pt-2" key={uuidv4()}>
          <div className="label-wrap mb-2">
            <p className="text-gray-5 text-xs">{`Parents`}</p>
          </div>
          <div className="row flex content-row pb-1 items-center">
            <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{getRelationshipStr(parents)}</div>
          </div>
        </div>
      );
    }
    if (spouse.length) {
      html.push(
        <div className="refine-row border-b border-gray-2 pb-2 pt-2" key={uuidv4()}>
          <div className="label-wrap mb-2">
            <p className="text-gray-5 text-xs">{"Spouse"}</p>
          </div>
          <div className="row flex content-row pb-1 items-center">
            <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{getRelationshipStr(spouse)}</div>
          </div>
        </div>
      );
    }
    if (children.length) {
      html.push(
        <div className="refine-row border-b border-gray-2 pb-2 pt-2" key={uuidv4()}>
          <div className="label-wrap mb-2">
            <p className="text-gray-5 text-xs">{children.length === 1 ? "Child" : "Children"}</p>
          </div>
          <div className="row flex content-row pb-1 items-center">
            <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{getRelationshipStr(children)}</div>
          </div>
        </div>
      );
    }
    if (sibling.length) {
      html.push(
        <div className="refine-row border-b border-gray-2 pb-2 pt-2" key={uuidv4()}>
          <div className="label-wrap mb-2">
            <p className="text-gray-5 text-xs">Sibling</p>
          </div>
          <div className="row flex content-row pb-1 items-center">
            <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{getRelationshipStr(sibling)}</div>
          </div>
        </div>
      );
    }
  }
  return html;
};
const getIndex = (index, place) => (index + 1 ? index + 1 : place + 1);
const pushRelation = (relType, { unshift, insert }, existRelation, data) => {
  let obj = { f: "", l: "" };
  if (relType === 1 && !existRelation("Father").length) {
    obj.r = "Father";
    unshift(obj);
  }
  if (relType === 2 && !existRelation("Mother").length) {
    obj.r = "Mother";
    insert(existRelation("Father").length ? 1 : 0, obj);
  }
  if (relType === 3 && existRelation("Sibling").length < 5) {
    let dataArr = data?.map((y) => y.r);
    let siblingIndex = dataArr.lastIndexOf("Sibling");
    let motherIndex = dataArr.lastIndexOf("Mother");
    obj.r = "Sibling";
    insert(getIndex(siblingIndex, motherIndex), obj);
  }
  if (relType === 4 && existRelation("Spouse").length < 5) {
    let dataArr = data?.map((y) => y.r);
    let siblingIndex = dataArr.lastIndexOf("Sibling");
    let spouseIndex = dataArr.lastIndexOf("Spouse");
    obj.r = "Spouse";
    insert(getIndex(spouseIndex, siblingIndex), obj);
  }
  if (relType === 5 && existRelation("Child").length < 5) {
    let dataArr = data?.map((y) => y.r);
    let childIndex = dataArr?.lastIndexOf("Child");
    let spouseIndex = dataArr?.lastIndexOf("Spouse");
    obj.r = "Child";
    insert(getIndex(childIndex, spouseIndex), obj);
  }
};

export const relationShipField = (name, t) => {
  return (
    <FieldArray name={name}>
      {(fieldArrayProps) => {
        const {
          remove,
          insert,
          unshift,
          form: { values },
        } = fieldArrayProps;
        const existRelation = (type) => (values.rs || []).filter((y) => y.r === type);
        return (
          <>
            <div className="advance-search-container mb-5">
              {values?.rs?.length ? (
                <div className="flex flex-wrap items-center -mx-2 mb-0 relative pl-16 pr-12 md:px-0">
                  <div className="md:w-1/4 px-2  text-right hidden md:block"></div>
                  <div className="w-3/6 md:w-64 px-2 mb-1">{tr(t, "f&mName")}</div>
                  <div className="w-3/6 md:w-48 px-2 mb-1">{tr(t, "LastName")}</div>
                </div>
              ) : null}

              {(values.rs || []).map((item, index) => {
                return (
                  <div key={`${index}`} className="flex flex-wrap items-center -mx-2 md:mb-4 pl-16 pr-12 md:px-0 relative">
                    <div className="absolute left-0 top-2 md:relative md:top-0 md:w-1/4 px-2 md:text-right">
                      <label className="text-gray-6 text-sm">{item.r}</label>
                    </div>
                    <div className="w-3/6 px-2 mb-3 md:w-64 md:mb-0">
                      <Field name={`rs[${index}].f`} className="appearance-none block w-full h-10 text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent" type="text" />
                    </div>
                    <div className="w-3/6 md:w-48 px-2 mb-3 md:mb-0">
                      <Field name={`rs[${index}].l`} className="appearance-none block w-full h-10 text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent" type="text" />
                    </div>
                    <button className="p-3 absolute right-1.5 top-0 bg-gray-1 hover:bg-gray-2 rounded-lg outline-none focus:outline-none" type="button" onClick={() => remove(index)}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 13L13 1" stroke="#747578" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M13 13L1 1" stroke="#747578" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                );
              })}
              <div className="flex flex-wrap -mx-2 mb-3.5 pt-1 items-center relative pl-16 md:pl-0">
                <div className="md:w-1/4 px-2 mb-3 md:mb-0 text-right absolute top-1 md:top-0 left-0 md:relative">
                  <label className="text-gray-6 text-sm">{tr(t, "search.unisearchform.advsearch.add")}</label>
                </div>
                <div className="md:w-64 px-2 mb-3 md:mb-0 md:w-64 px-2 mb-3 md:mb-0 flex-grow">
                  <div className="add-buttons text-base -mx-3 flex flex-wrap">
                    <span className={`${!existRelation("Father").length ? "text-blue-4 px-3 cursor-pointer hover:underline" : "text-gray-4 px-3"}`} onClick={() => pushRelation(1, { unshift, insert }, existRelation, values.rs)}>
                      {tr(t, "search.unisearchform.advsearch.father")}
                    </span>
                    <span className={`${!existRelation("Mother").length ? "text-blue-4 px-3 cursor-pointer hover:underline" : "text-gray-4 px-3"}`} onClick={() => pushRelation(2, { unshift, insert }, existRelation, values.rs)}>
                      {tr(t, "search.unisearchform.advsearch.mother")}
                    </span>
                    <span className={`${existRelation("Sibling").length < 5 ? "text-blue-4 px-3 cursor-pointer hover:underline" : "text-gray-4 px-3"}`} onClick={() => pushRelation(3, { unshift, insert }, existRelation, values.rs)}>
                      {tr(t, "search.unisearchform.advsearch.sibling")}
                    </span>
                    <span className={`${existRelation("Spouse").length < 5 ? "text-blue-4 px-3 cursor-pointer hover:underline" : "text-gray-4 px-3"}`} onClick={() => pushRelation(4, { unshift, insert }, existRelation, values.rs)}>
                      {tr(t, "search.unisearchform.advsearch.spouse")}
                    </span>
                    <span className={`${existRelation("Child").length < 5 ? "text-blue-4 px-3 cursor-pointer hover:underline" : "text-gray-4 px-3"}`} onClick={() => pushRelation(5, { unshift, insert }, existRelation, values.rs)}>
                      {tr(t, "search.unisearchform.advsearch.child")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      }}
    </FieldArray>
  );
};
