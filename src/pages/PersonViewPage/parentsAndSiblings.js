import React from "react";

// Components
import Table from "../../components/Table";
import { useTranslation } from 'react-i18next';
import { tr } from '../../components/utils';
import { checkUnknown, checkFamilyGroup } from "../../utils";

const getName = (isPrivate, personId, children) => {
    if(isPrivate) {
        return `Private-CHILDREN ${personId === children.id ? "-ISFOCUS" : ""}` 
    }else {
        return `${checkUnknown(children, "FAMILY")}-CHILDREN ${personId === children.id ? "-ISFOCUS" : ""}`
    }
}

const getparentsAndSiblings = (arrayOfParentsAndSiblings, personId, type, isOwner) => {
    const res = [];
    arrayOfParentsAndSiblings && arrayOfParentsAndSiblings.map((parentsAndSiblings,index) => {
        if (parentsAndSiblings.Parents) {
            parentsAndSiblings.Parents.forEach((parent)=>{
                const isPrivate = !isOwner && parent.isLiving;
                res.push({
                    tableType: type,
                    id: parent.id,
                    firstName: parent.firstName.GivenName,
                    lastName: parent.lastName.Surname,
                    name: isPrivate ? "Private" : checkUnknown(parent, "FAMILY"),
                    gender: parent.gender.Gender,
                    imgsrc: isPrivate ? "" : parent.imgsrc,
                    birth: parent.birth.Date,
                    birthLocation: parent.birthLocation.Location,
                    death: parent.death.Date,
                    deathLocation: parent.deathLocation.Location,
                    marriage: parent.marriage.Date,
                    spouse: parent.spouse.length > 0 ? `${parent.spouse[0].firstName} ${parent.spouse[0].lastName}` : "",
                    isFamily: checkFamilyGroup(index),
                    isPrivate,
                    isPrivateSpouse: !isOwner && parent?.spouse[0]?.isLiving,
                })
            })
        }
        if (parentsAndSiblings.children) {
            parentsAndSiblings.children.forEach((children) =>{
                const isPrivate = !isOwner && children.isLiving;
                res.push({    
                    tableType: type,
                    id: children.id,
                    firstName: children.firstName.GivenName,
                    lastName: children.lastName.Surname,
                    name: getName(isPrivate, personId, children),
                    gender: children.gender.Gender,
                    imgsrc:  isPrivate ? "": children.imgsrc,           
                    birth: children.birth.Date,
                    birthLocation: children.birthLocation.Location,
                    death: children.death.Date,
                    deathLocation: children.deathLocation.Location,
                    marriage: children.marriage.Date,
                    spouse: children.spouse.length > 0 ? `${children.spouse[0].firstName} ${children.spouse[0].lastName}` : "",
                    isFamily: checkFamilyGroup(index),
                    isPrivate,
                    isPrivateSpouse: !isOwner && children?.spouse[0]?.isLiving
                })
            })
        }
        return res;
    }) 
    return res;
}

const ParentsAndSiblings = (props) => { 

    const {
        type, 
        parentsAndSiblings, 
        personId, 
        handleUpdate,
        person
    } = props;

    const { t } = useTranslation();
    
    return (
        <Table
            id={"family"}
            type={type}
            columns={[tr(t,"person.table.parentsibling.parentandsibling"), tr(t,"person.table.parentsibling.gender"), tr(t,"person.table.parentsibling.birth"), tr(t,"person.table.parentsibling.bl"), tr(t,"person.table.parentsibling.death"), tr(t,"person.table.parentsibling.dl"), tr(t,"person.table.parentsibling.marriage"), tr(t,"person.table.parentsibling.spouse")]}
            keys={["name", "gender", "birth", "birthLocation", "death", "deathLocation", "marriage", "spouse"]}
            data={getparentsAndSiblings(parentsAndSiblings, personId, type, props.isOwner) || []}
            image={true}
            handleUpdate={handleUpdate}
            loading={person.parentsLoading}
            person={person}
            {...props}
        />
    )
}

export default ParentsAndSiblings;