
const jsonData = (title, gender, path, childId) => {
  return {
    id: "",
    parentId: childId,
    name: "",
    firstName: "",
    lastName: "",
    isLiving: true,
    attributes: {
      title: title,
      gender: gender,
      birth: {
        RawDate: "",
        IsApproximate: null,
        IsNormalized: null,
        DayValue: null,
        MonthValue: null,
        YearValue: null,
        Day: "",
        Month: "",
        Year: "",
        NormalizedDate: null,
        Qualifier: null,
      },
      death: {
        RawDate: "",
        IsApproximate: null,
        IsNormalized: null,
        DayValue: null,
        MonthValue: null,
        YearValue: null,
        Day: "",
        Month: "",
        Year: "",
        NormalizedDate: null,
        Qualifier: null,
      },
      birthLocation: "",
      deathLocation: "",
      path: path,
      cFilialId: "",
      imgsrc: "",
      type: "",
      relatedParentIds: null
    },
  };
};

const generatePath = (childPathVar, gender) => {
   let elements = childPathVar && childPathVar.split("/");
   if (gender === "Male") {
     elements.push("0");
   } else elements.push("1");
 
   elements = elements.join("/");
   return elements;
 };

 export const parentsplaceholder = (obj) => {
  let childPath = obj.attributes.path;
  return [
    jsonData("Add Father", "Male", generatePath(childPath, "Male"), obj.id),
    jsonData("Add Mother", "Female", generatePath(childPath, "Female"), obj.id),
  ];
};
