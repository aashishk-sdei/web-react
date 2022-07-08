import axios from "axios";
import { getAccessToken } from "./../../services";
import { getDate, getMaskDate } from "./../../utils";
const { REACT_APP_API } = process.env;
const TREEID = "75ada45a-4222-4072-a11c-34bdc59895a8";
const REQUEST = "REQUEST";
const SUCCESS = "SUCCESS";
const FAILURE = "FAILURE";

const actionCreator = (type, payload) => {
  return {
    type,
    payload,
  };
};

const headers = (getState, isPrivate = false, headersData = {}, isPay = false) => {
  if (!isPay) {
    const accessToken = getAccessToken();
    const bearer = `Bearer ${accessToken}`;
    const Authorization = ("Authorization", bearer);
    let header = {
      "content-type": "application/json",
      Authorization,
      ...headersData,
    };
    let token = null;
    if (isPrivate && getState().auth.loginData) {
      token = `${getState().auth.loginData.token}`;
    }
    header.accessToken = token;
    return header;
  } else {
    return {
      "Content-type": "application/json",
      ...headersData,
    };
  }
};

const callApi = (getState, method = "GET", url = "", data = {}, isPrivateHeaders = true, headersData = {}, isPay = false) => {
  let httpRequest = {
    method,
    data,
    headers: headers(getState, isPrivateHeaders, headersData, isPay),
    url /*,
        validateStatus: function (status) {
            return [200, 204, 301, 302].includes(status); // Reject only if the status code is greater than or equal to 500
        }*/,
  };
  return axios(httpRequest);
};

const createActionTypes = (base) => {
  return [REQUEST, SUCCESS, FAILURE].reduce((current, nextVal) => {
    current[nextVal] = base + "_" + nextVal;
    return current;
  }, {});
};
const getRestrictOrNew = async (compareProfile, compareProfileIndex, _data, key, index, field, newField) => {
  let compare = false;
  if (compareProfileIndex[key] !== _data[key]) {
    const dataLength = !_data[key] || 0 === _data[key].length;
    const compareDataLength = !compareProfileIndex[key] || 0 === compareProfileIndex[key].length;
    if ((dataLength && !compareDataLength) || (!dataLength && compareDataLength)) {
      if (dataLength) {
        compareProfile.familyList[index].isNew = true;
        newField.push(key);
      } else if (compareDataLength) {
        _data.isNew = true;
        newField.push(key);
      }
    } else {
      _data.restrict = true;
      compareProfile.familyList[index].restrict = true;
      field.push(key);
    }
    compare = true;
  }
  return compare;
};
const getFamilyList = async (data, compare, compareProfile) => {
  const familyList = data.familyList.map((_data) => {
    const index = compareProfile.familyList.findIndex((_compareProfile) => _data.id === _compareProfile.id); //Check person Logic here
    if (index === -1) {
      //New Record
      _data.isNew = true;
      compare = true;
      _data.comparePerson = null;
    } else {
      const compareProfileIndex = compareProfile.familyList[index];
      let field = [];
      let newField = [];
      const checkRestrictOrNew = async (key) => {
        if (await getRestrictOrNew(compareProfile, compareProfileIndex, _data, key, index, field, newField)) {
          compare = true;
        }
      };
      checkRestrictOrNew("district");
      checkRestrictOrNew("birthYear");
      checkRestrictOrNew("firstName");
      checkRestrictOrNew("lastName");
      checkRestrictOrNew("placeofBirth");
      checkRestrictOrNew("citySameHouse");
      checkRestrictOrNew("race");
      checkRestrictOrNew("occupation");
      _data.field = field;
      _data.newField = newField;
      if (_data.comparePerson) {
        _data.comparePerson["field"] = field;
        _data.comparePerson["newField"] = newField;
      }
      compareProfile.familyList[index].field = field;
      compareProfile.familyList[index].newField = newField;
    }
    _data.comparePerson = compareProfile.familyList[index];
    return _data;
  });
  return { familyList, compare };
};
const checkCompareData = async (data, compareProfile) => {
  if (!compareProfile) {
    return {
      data: data,
      compareToProfile: null,
      compareTo: true,
    };
  }
  let compareToProfile = compareProfile;
  let dataProfile = data;
  let compare = false;
  if (compareProfile.familyList && data.familyList) {
    const { familyList, compare: compareAS } = await getFamilyList(data, compare, compareProfile);
    dataProfile.familyList = familyList;
    compare = compareAS;
  }
  return {
    data: dataProfile,
    compareToProfile: compareToProfile,
    compareTo: compare,
  };
};
const generateData = (data) => {
  let pct = 0.2;
  let array = new Uint8Array(1);
  let crypt = window.crypto.getRandomValues(array);
  let rand = crypt;
  if (rand < pct) {
    return false;
  }
  let generateDataProfile = { ...data };
  let familyList = generateDataProfile.familyList;
  let headIndex = familyList.findIndex((_data) => _data.relationship === "HEAD");
  if (headIndex !== -1 && familyList[headIndex].relationship === "HEAD") {
    familyList = [
      ...familyList.slice(0, headIndex),
      {
        ...familyList[headIndex],
        firstName: familyList[headIndex].firstName + " C",
        race: "",
        citySameHouse: familyList[headIndex].citySameHouse + " US",
        birthYear: "1921",
      },
      ...familyList.slice(headIndex + 1),
    ];
  }
  if (headIndex !== 3 && familyList[3]) {
    familyList = [
      ...familyList.slice(0, 3),
      {
        ...familyList[3],
        firstName: familyList[3].firstName + " C",
        birthYear: "" + (parseInt(familyList[3].birthYear) + 3),
      },
      ...familyList.slice(4),
    ];
    familyList = [
      ...familyList.slice(0, 3),
      {
        ...familyList[3],
        firstName: familyList[3].firstName + " C",
        district: "b " + familyList[3].district,
      },
      ...familyList.slice(4),
    ];
  }
  if (headIndex !== 4 && familyList[4]) {
    familyList = [...familyList.slice(0, 4), ...familyList.slice(5)];
  }
  if (headIndex !== 1 && familyList[1]) {
    familyList = [...familyList.slice(0, 1), ...familyList.slice(2)];
  }
  generateDataProfile.familyList = familyList;
  return generateDataProfile;
};
export const dateToAge = (d1, d2) => {
  let date1 = new Date(d1);
  let date2 = new Date(d2);
  let diff = new Date(date2.getTime() - date1.getTime());
  return diff.getUTCFullYear() - 1970;
};
export const dateToLocalString = (date, zone = undefined, options = { weekday: "long", year: "numeric", month: "short", day: "numeric" }) => new Date(date).toLocaleDateString(zone, options);

export const ssdiFieldVal = (data, val) => `${data[val] && data[val].toLowerCase()}`;

export const compareCond = (val, compareVal, fieldVal, data, compareTo) => {
  if (val !== compareVal) {
    let field = [fieldVal],
      newField = [];
    data[fieldVal].restrict = true;
    compareTo[fieldVal].restrict = true;
    compareTo[fieldVal].field = field;
    compareTo[fieldVal].newField = newField;
    data[fieldVal].field = field;
    data[fieldVal].newField = newField;
  }
};
export const compareSsdiNameCondition = (exactVal, compareVal, fieldVal, data, compareTo) => {
  if (exactVal.firstName !== compareVal.comparefirstName || exactVal.lastName !== compareVal.comparelastName || exactVal.middleName !== compareVal.comparemiddleName) {
    let field = [],
      newField = [];
    data[fieldVal].restrict = true;
    compareTo[fieldVal].restrict = true;
    compareTo[fieldVal].field = field;
    compareTo[fieldVal].newField = newField;
    data[fieldVal].field = field;
    data[fieldVal].newField = newField;
    if (exactVal.firstName !== compareVal.comparefirstName) field.push("firstName");
    if (exactVal.lastName !== compareVal.comparelastName) field.push("lastName");
    if (exactVal.middleName !== compareVal.comparemiddleName) field.push("middleName");
  }
};
export const deathDateLightValue = (data) => {
  let date = "";
  if (data.deathDate) {
    date = `( Age   ${dateToAge(data.birthDate, data.deathDate)} `;
  }
  if (!data.birthDate) {
    date += "Estimated )";
  } else {
    date += ")";
  }
  return date;
};
export const compareTossdi = (ssdiData, comparedProfile) => {
  let data = {},
    compareTo = {};
  let firstName = ssdiFieldVal(ssdiData, "firstName"),
    lastName = ssdiFieldVal(ssdiData, "lastName"),
    middleName = ssdiFieldVal(ssdiData, "middleName"),
    comparefirstName = ssdiFieldVal(comparedProfile, "firstName"),
    comparelastName = ssdiFieldVal(comparedProfile, "lastName"),
    comparemiddleName = ssdiFieldVal(comparedProfile, "middleName"),
    birthdate = dateToLocalString(ssdiData.birthDate),
    compareBirtdate = dateToLocalString(comparedProfile && comparedProfile.birthDate),
    deathdate = dateToLocalString(ssdiData.deathDate),
    compareDeathDate = comparedProfile.deathDate ? dateToLocalString(comparedProfile.deathDate) : "",
    stateName = ssdiData.stateName || "",
    compareStateName = comparedProfile.stateName || "";
  data.name = { value: { firstName, lastName, middleName } };
  compareTo.name = {
    value: {
      firstName: comparefirstName,
      lastName: comparelastName,
      middleName: comparemiddleName,
    },
  };
  data.namePlace = `in United States Social Security Death Index`;
  data.birthDate = { value: birthdate ? birthdate : "-" };
  data.deathDate = {
    value: deathdate,
    lightValue: deathDateLightValue(ssdiData),
  };
  data.stateName = { value: stateName };
  data.treeData = `${firstName} ${middleName} ${lastName}`;
  compareTo.birthDate = {
    value: comparedProfile.birthDate ? compareBirtdate : "-",
  };
  compareTo.deathDate = {
    value: compareDeathDate,
    lightValue: deathDateLightValue(comparedProfile),
  };
  compareTo.stateName = { value: compareStateName };
  let exactVal = { firstName, middleName, lastName },
    compareVal = { comparefirstName, comparelastName, comparemiddleName };
  compareSsdiNameCondition(exactVal, compareVal, "name", data, compareTo);
  compareCond(birthdate, compareBirtdate, "birthDate", data, compareTo);
  compareCond(deathdate, compareDeathDate, "deathDate", data, compareTo);
  compareCond(stateName, compareStateName, "stateName", data, compareTo);
  return { data, compareTo };
};
export const mapCondForNotif = (item, payload) => {
  if (typeof item === "string") {
    let combinedGuid = item.split("|"),
      returnData;
    if (payload.user.userId === combinedGuid[2] && payload.story.storyId === combinedGuid[1]) {
      returnData = payload;
    } else {
      returnData = item;
    }
    return returnData;
  } else {
    return item;
  }
};
export { REACT_APP_API, TREEID, REQUEST, SUCCESS, FAILURE, actionCreator, headers, callApi, createActionTypes, checkCompareData, generateData };

// universal form
const getUSDateField = (data, value, type, maskingFields) => {
  if (value?.rawDate && !maskingFields) {
    data.push({ text: getDate(value, maskingFields), type });
  } else if (maskingFields) {
    if (!value.rowDate && value.yearValue) {
      data.push({ text: getMaskDate(value, maskingFields), type });
    }
  }
};
const isUSMaskKey = (maskingFields, key) => {
  let bool = false;
  const maskList = (maskingFields || []).map((item) => item?.componentName?.toLowerCase());
  if (maskList.includes(key.toLowerCase())) {
    bool = true;
  }
  return bool;
};
export const getUSFieldValue = (data, mask, keys, element, maskingFields) => {
  let { key, type, event, relation } = keys,
    value = element[key];
  if (type === "GUID" && event === element.event && relation === element.relation) {
    if (value?.placeHierarchy?.fullChainName) {
      data.push({ text: value.placeHierarchy.fullChainName, type });
    } else if (!value?.placeHierarchy?.fullChainName && value?.raw?.value) {
      data.push({ text: value.raw.value, type });
    }
    maskingFields && mask.push(isUSMaskKey(maskingFields, key));
  } else if (type === "Date" && event === element.event && relation === element.relation) {
    getUSDateField(data, value, type, maskingFields);
    maskingFields && mask.push(isUSMaskKey(maskingFields, key));
  } else {
    relation === element.relation && value?.value && data.push({ text: value.value, type });
    maskingFields && mask.push(isUSMaskKey(maskingFields, key));
  }
};

export const getElasticQuery = (res) => {
  return res?.data?.elasticQuery || null;
};
