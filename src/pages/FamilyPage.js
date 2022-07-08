import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import * as services from "../services";
// Actions
import { showFooter } from "../redux/actions/layout"
import {
  getFamily,
  startNewTree,
  importGedCom,
  getImportStatus,
  assignHomePerson,
  handleSelectHomePerson,
  updateGedcom,
  refetchFamily,
  refetchComplete,

  // Pedigree View Actions
  clearFamily,
  getEditPerson,
  addParent,
  addSibling,
  addSpouse,
  addChild,
  getTreePersonOptions,
  addParentsViaPlaceHolders,
  saveParentsViaPlaceHolders,
  saveEditPerson,
  cancelModal,
  getIsLivingStatus,
  refetchFamilyTreeAndList
} from "../redux/actions/family";

// Components
import Stepper from "../components/Stepper";
import Loader from "../components/Loader";
import GetStartSteps from "./FamilyStepper/GetStartSteps";
import GetUploadSteps from "./FamilyStepper/GetUploadSteps";
import PedigreeViewPage from "./PedigreeViewPage";
import Modal from "./Common/Modal";
import DeletePersonModal from "../components/DeletePersonModal";
import { getQueryParam } from "../components/utils";
import { parentsplaceholder } from "../data/treeData";

// Services
import { setNewTree, setRecentTree, getRecentTree } from "../services";

// Utils
import {
  MALE, 
  FEMALE,
  modalType,
  getRelatedParentIdOrGender,
  getSelectedGender,
  getPathString,
  getNodeTypeById,
  getNoOfSpouses,
  getGenerationFromPath
} from "../utils";
import { deletePerson } from "../redux/actions/person";

let resetZoom = true

export const setZoomReset = (value) => {
  resetZoom = value
}

const {
  ADD_CHILD,
  ADD_PARENT,
  ADD_SIBLING,
  ADD_SPOUSE,
  EDIT_PERSON,
  ADD_FATHER_OR_MOTHER
} = modalType;

const IMPORTCOMPLETED = "IMPORTCOMPLETED";

let statusTimer;

let lastRedirection = true;

const FamilyPage = ({
  family: {
    family,
    stepper,
    startTree,
    homePersons,
    newTreeId,
    selectedHomePerson,
    progress,
    importStatus,
    assigned,
    checkRefetchFamily,
    treePersonOptions,
    refetchTreePostDeletetion,
    deletingPerson
  },
  user: { userAccount },
  dispatchShowFooter,
  dispatchGetFamily,
  dispatchStartNewTree,
  dispatchImportGedCom,
  dispatchGetImportStatus,
  dispatchAssignHomePerson,
  dispatchHandleSelectHomePerson,
  dispatchUpdateGedcom,
  dispatchRefetchFamily,
  dispatchSaveEditPerson,
  dispatchGetTreePersonOptions,
  // Pedigree View Actions
  dispatchClearFamily,
  dispatchGetEditPerson,
  dispatchAddParent,
  dispatchAddSpouse,
  dispatchAddSibling,
  dispatchAddChild,
  dispatchAddParentsViaNodes,
  dispatchSaveParentsViaNodes,
  dispatchCancelModal,
  dispatchGetIsLivingStatus,
  dispatchDeletePerson,
  dispatchRefetchComplete,
  dispatchRefetchFamilyTreeAndList
}) => {
  const { treeId, primaryPersonId, level, addPerson } = useParams();
  const history = useHistory();
  const [userForm, setFormData] = useState(null);
  const [step, setActiveStep] = useState(0);
  const [uploadStep, setUploadStep] = useState(false);
  const [privacyCheck, setPrivacyCheck] = useState(false);
  const [fileReady, setFileReady] = useState(false);
  const [file, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [homePersonCheck, setHomePersonCheck] = useState(true);
  const [done, setDone] = useState(false);
  const [showmodal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [newParent, setNewParent] = useState(null);
  const [childName, setChildName] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [choosenPerson, setChoosenPerson] = useState(null);
  const [preAdd, setPreAdd] = useState(false);
  const isOwner = services.isUserOwner(family?.treeInfo?.OwnerId)

  useEffect(() => {
    dispatchShowFooter(false)
    return () => {
      dispatchShowFooter()
    }
  }, [dispatchShowFooter])
  

  useEffect(() => {
    if (!treeId && !primaryPersonId && !level) {
      const lastTree = getRecentTree();
      if (lastRedirection && lastTree?.treeId) {
        lastRedirection = false;

        return history.push(`/family/pedigree-view/${lastTree.treeId}/${lastTree.primaryPersonId}/${lastTree.level}`);
      }
    }

    return () => {
      lastRedirection = true;
    }
  });

  useEffect(()=>{
    if(refetchTreePostDeletetion && family){
      if(refetchTreePostDeletetion.id === primaryPersonId){
      history.push(`/family/pedigree-view/${treeId}/${family.treeInfo.HomePersonId}/4`);
      dispatchRefetchComplete()
      }
      else {
        dispatchRefetchFamilyTreeAndList(treeId, primaryPersonId, level);
        dispatchRefetchComplete();
      }
    }
  },[refetchTreePostDeletetion, treeId, primaryPersonId, level, dispatchRefetchComplete, family, history, dispatchRefetchFamilyTreeAndList])


  useEffect(() => {
    if (userAccount) {
      setFormData(userAccount)
    }
  }, [setFormData, userAccount]);

  useEffect(() => {
    if (startTree) {
      resetStepper();
      return history.push(`/family/pedigree-view/${startTree.treeId}/${startTree.primaryPersonId}/${startTree.level}`)
    }
  }, [startTree, history]);

  useEffect(() => {
    if (treeId && primaryPersonId && level) {
      setZoomReset(true)
      dispatchGetFamily(treeId, primaryPersonId, level);
      dispatchGetTreePersonOptions(treeId)
    }
  }, [treeId, primaryPersonId, level, dispatchGetFamily, dispatchGetTreePersonOptions]);

  useEffect(() => {
    if (!assigned && importStatus && importStatus.toUpperCase() === IMPORTCOMPLETED) {
      clearInterval(statusTimer);
      dispatchAssignHomePerson(newTreeId, selectedHomePerson.personId, homePersonCheck);
    }
  }, [importStatus, newTreeId, selectedHomePerson, dispatchAssignHomePerson]);

  useEffect(() => {
    if (assigned) dispatchUpdateGedcom(newTreeId, selectedHomePerson.personId, 4);
  }, [assigned, dispatchUpdateGedcom, selectedHomePerson])

  useEffect(() => {
    if (newParent && modalAction === null) setNewParent(null);
  }, [newParent, modalAction, setNewParent])

  const resetStepper = () => {
    setActiveStep(0);
    setUploadStep(false);
    setPrivacyCheck(false);
    setFileReady(false);
    setSelectedFile(null);
    setUploading(false);
    setHomePersonCheck(true);
    setDone(false);
  }

  const handleInputChange = (e) => {
    if (e.target.birthLocationId || e.target.birthLocationId === "") {
      setFormData({
        ...userForm,
        [e.target.name]: e.target.value,
        birthLocationId: e.target.birthLocationId
      });
    }
    else {
      setFormData({
        ...userForm,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
    dispatchDeletePerson(choosenPerson)
  }

  const handleNextStep = (selectedButton) => {
    if (selectedButton === 1) {
      setUploadStep(false);
      setNewTree(true);
    }
    if (selectedButton === 2) {
      setUploadStep(true);
      setNewTree(false);
    }
    if (selectedButton === 3) {
      handleUploading(true);
      return;
    }
    if (step >= 0 && step < 2) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBackStep = () => {
    if (step <= 2 && step > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
      setFileReady(false);
      setPrivacyCheck(false);
    }
  };

  const handleStartNewTree = async () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    await dispatchStartNewTree(userForm);
  };

  const handleCheck = (event) => {
    if (event) setPrivacyCheck(event.target.checked);
    else setPrivacyCheck(false);
  };

  const handleFileReady = (fileisReady) => {
    setFileReady(fileisReady);
  };

  const handleSelectedFile = (selectedFile) => {
    setSelectedFile(selectedFile);
  };

  const handleUploading = (upload) => {
    setUploading(upload);
    handleImportGedcom();
  };

  const handleImportGedcom = async () => {
    const FileName = file && file.name.split(".")[0];
    const FormFile = file;
    if (FileName && FormFile) await dispatchImportGedCom(FileName, FormFile);
  };

  const handleLearnMore = () => {
    setShowModal(!showmodal);
  };

  const handleHomePerson = async (_event, value) => {
    await dispatchHandleSelectHomePerson(value);
  };

  const handleChangeHomePerson = (value) => {
    return value;
  };

  const handleHomePersonCheck = (event) => {
    setHomePersonCheck(event.target.checked);
  };

  const handleDone = async () => {
    setDone(true);
    statusTimer = setInterval(async () => {
      await dispatchGetImportStatus(newTreeId);
    }, 3000);
  };

  const checkDisabled = () => {
    return !((userForm.firstName || userForm.lastName).trim())
  }
  //treeListOptions state change to show it optimistically
  const changePeopleList = (nodeId, modalPerson) => {
    const { firstName, lastName, birth, death, isLiving } = modalPerson;
    treePersonOptions.map((function (ele) {
      if (ele.id === nodeId) {
        ele.givenName.givenName = firstName;
        ele.surname.surname = lastName;
        ele.birthDate.rawDate = birth;
        ele.deathDate.rawDate = death;
        ele.birthDate.year = birth;
        ele.deathDate.year = death;
        ele.isLiving = isLiving;
      }
    }))
  }

  //to search spouse node in family json
  const searchSpouses = (arr, nodeId) => {
    return arr.filter((obj) => obj.id === nodeId)[0];
  };

  //Find edited node in family json
  const findItem = (arr, itemId, nestingKey) =>
    arr.reduce((a, item) => {
      if (a) return a;
      if (item.id === itemId) return item;
      if (nestingKey) {
        if (item[nestingKey])
          return findItem(item[nestingKey], itemId, nestingKey);
      } else {
        return searchSpouses(arr, itemId);
      }
      if (item.schildspouse) return searchSpouses(item.schildspouse, itemId);
    }, null);

  const upDateFamily = (result, modalPerson, treeData) => {
    result.firstName = modalPerson.firstName;
    result.lastName = modalPerson.lastName;
    result.attributes.gender = modalPerson.gender;
    result.isLiving = modalPerson.isLiving;
    result.attributes.birth.RawDate = modalPerson.birth;
    result.attributes.birth.Year = modalPerson.birth;
    result.attributes.birth.Month = modalPerson.birth;
    result.attributes.birth.Day = modalPerson.birth;
    result.attributes.birthLocation = modalPerson.birthPlace;
    result.attributes.death.RawDate = modalPerson.death;
    result.attributes.death.Year = modalPerson.death;
    result.attributes.death.Month = modalPerson.death;
    result.attributes.death.Day = modalPerson.birth;
    result.attributes.deathLocation = modalPerson.deathPlace;
    return { ...treeData, result };
  };

  const handleSaveEdit = async (editPerson, modalPerson) => {
    const treeData = _.cloneDeep(family);
    let newFamily;
    const Id = editPerson.id;
    let resultNode = "";
    if (treeData.id === Id) resultNode = treeData;
    if (resultNode === "") resultNode = findItem(treeData.parents, Id, "parents");
    if (!resultNode) resultNode = findItem(treeData.spouses, Id);
    if (!resultNode) resultNode = findItem(treeData.spouses, Id, "schild");
    if (!resultNode) resultNode = findItem(treeData.directChildren, Id, "directChildren");
    if (resultNode) {
      newFamily = upDateFamily(resultNode, modalPerson, treeData)
    }
    changePeopleList(Id, modalPerson);
    await dispatchSaveEditPerson(newFamily, editPerson, modalPerson, treeId)
  }

  const getPropsForUpload = () => {
    return {
      step,
      handleNextStep,
      handleBackStep,
      handleInputChange,
      privacyCheck,
      handleCheck,
      fileReady,
      handleFileReady,
      handleSelectedFile,
      uploading,
      progress,
      homePersons,
      selectedHomePerson,
      handleChangeHomePerson,
      handleHomePerson,
      homePersonCheck,
      handleHomePersonCheck,
      done,
      handleDone,
      showmodal,
      handleLearnMore,
      userForm,
      checkDisabled
    }
  }

  const getPropsForStart = () => {
    return {
      step,
      handleNextStep,
      handleBackStep,
      userForm,
      handleInputChange,
      handleStartNewTree,
      showmodal,
      handleLearnMore,
      checkDisabled
    }
  }

  const getPropsForTree = () => {
    return {
      resetZoom,
      handleView,
      handleFocus,
      handleEdit,
      handleAddChild,
      handleAddParent,
      handleAddSibling,
      handleAddSpouse,
      refetchAfterParentsAdded,
      makeHomePersonAsFocus,
      handleSearchFocus,
      handleNextGeneration,
      isOwner
    }
  }

  // View Person
  const handleView = (node) => {
    if (isOwner)
      return history.push(`/family/person-page/${treeId}/${node.id}${getQueryParam()}`);
    else
      return history.push(`/family/person-page/${treeId}/${node.id}/${family?.treeInfo?.OwnerId}${getQueryParam()}`);
  }

  // Make a Focus Person
  const handleFocus = async (node) => {
    if(isOwner){
      const recentTree = { treeId, primaryPersonId: node.id, level };
      setRecentTree(recentTree);
    }
    setZoomReset(true)

    await dispatchClearFamily();
    return history.push(`/family/pedigree-view/${treeId}/${node.id}/${level}${getQueryParam()}`);
  }

  // Make Home Person as a Focus Person
  const makeHomePersonAsFocus = async (homePersonTreeId, homePersonId, homePersonLevel) => {
    if(isOwner){
      const recentTree = { treeId: homePersonTreeId, primaryPersonId: homePersonId, level: homePersonLevel };
      setRecentTree(recentTree);
    }
    await dispatchClearFamily();
    setZoomReset(false)
    return history.push(`/family/pedigree-view/${homePersonTreeId}/${homePersonId}/${homePersonLevel}${getQueryParam()}`);
  }

  // Make a SearchAble Focus Person
  const handleSearchFocus = async (treePersonId) => {
    if (primaryPersonId === treePersonId) return;
    if(isOwner){
      const recentTree = { treeId, primaryPersonId: treePersonId, level };
      setRecentTree(recentTree);
    }
    setZoomReset(true)
    await dispatchClearFamily();
    services.setTreePan(true)
    return history.push(`/family/pedigree-view/${treeId}/${treePersonId}/${level}${getQueryParam()}`);
  }

  const checkHomePerson = (id) => {
    if(id === family.treeInfo.HomePersonId) return "HOME_PERSON";
    return "VIEW"
  }

  // Quick Edit
  const handleEdit = async (node) => {
    setZoomReset(false)
    setModalAction(EDIT_PERSON);
    let selectedNode = {
      ...node,
      nodeType: checkHomePerson(node.id)
    }
    await dispatchGetEditPerson(selectedNode);
  }
  //check auto populate add person
  const addPersonNode = (node) => {
    return node.path === "" && addPerson
  }
  // Add Child
  const handleAddChild = async (node) => {
    setModalAction(ADD_CHILD);
    let nodeType = getNodeTypeById(node.id, family);
    let generation = getGenerationFromPath(node.path);
    const selectedNode = {
      id: uuidv4(),
      treeId,
      relationAdded: ADD_CHILD,
      nodeType,
      treePersonId: node.id, 
      generation,
      filialRelationshipId: uuidv4(),
      isLiving:  generation <= 6 ? true : false,
      firstName: node.firstName,
      lastName: node.lastName,
      selectedName: `${node.firstName || node.lastName}`,
      fetchChildren: true,
      nodeGender: node.gender,
      primaryPersonId: node.id,
      homePersonId: primaryPersonId
    } 
    const _preAdd = addPersonNode(node)
    setPreAdd(_preAdd)
    await dispatchAddChild(selectedNode, _preAdd)
  }

  // Add Parent
  const handleAddParent = async (node) => {
    setModalAction(ADD_PARENT);
    const parentsLength = node.relatedParentIds ? Object.keys(node.relatedParentIds).length : 0
    const gender = parentsLength === 1 ? getRelatedParentIdOrGender(node.relatedParentIds).gender : "";
    let nodeType = getNodeTypeById(node.id, family);
    let generation = getGenerationFromPath(node.path)
    const selectedNode = {
      id: uuidv4(),
      relationAdded: ADD_PARENT,
      nodeType,
      homePersonId: primaryPersonId,
      generation,
      treeId,
      filialRelationshipId: node.cFilialId || uuidv4(),
      isLiving: generation <= 4 ? true : false,
      childId: node.id,
      selectedName: node.firstName || node.lastName,
      parentId: parentsLength === 1 ? getRelatedParentIdOrGender(node.relatedParentIds).parentId : null,
      fetchSiblings: parentsLength === 1,
      gender,
      requiredGender: gender === MALE || gender === FEMALE ? true : false,
    }
    const _preAdd = addPersonNode(node)
    setPreAdd(_preAdd)
    await dispatchAddParent(selectedNode, _preAdd);
  }

  //Add Father or Mother form placeholder
  const handleNextGeneration = async (selectedNode) => {
    let generation = getGenerationFromPath(selectedNode.path) - 1
    let node = {
      ...selectedNode,
      treeId,
      isLiving: generation <= 4 ? await dispatchGetIsLivingStatus(treeId, selectedNode.parentId, 'parent') : false
    }
    await dispatchAddParentsViaNodes();
    setModalAction(ADD_FATHER_OR_MOTHER);
    const parentPath = getPathString(node.path, true);
    const updatedData = { ...family };
    const getStrEval = _.get(updatedData, parentPath)
    const childData = parentPath
      ? getStrEval
      : updatedData;
    const name = `${childData.firstName} ${childData.lastName}`;
    node.childSurname = childData.lastName
    setChildName(name);
    setNewParent(node)
  }

  //Save parents via placeholder node
  const saveplaceholderParents = async (newData) => {
    const parentPath = getPathString(newParent.path, true);
    const { birth, death } = newData;
    const parentsData = {
      id: uuidv4(),
      parentId: newData.parentId,
      firstName: newData.firstName,
      lastName: newData.lastName,
      isLiving: newData.isLiving,
      attributes: {
        gender: newData.gender,
        birth: {
          RawDate: birth,
          Day: birth,
          Month: birth,
          Year: birth,
          NormalizedDate: birth,
        },
        birthLocation: newData.birthPlace,
        death: {
          RawDate: death,
          Day: death,
          Month: death,
          Year: death,
          NormalizedDate: death,
        },
        deathLocation: newData.deathPlace,
        imgsrc: newData.imgsrc,
      },
      birthLocationId: newData.birthLocationId,
      deathLocationId: newData.deathLocationId
    };

    const updatedData = { ...family };
    const getParentPathStrEval = _.get(updatedData, parentPath);
    const childData = parentPath ? getParentPathStrEval : updatedData;

    await dispatchSaveParentsViaNodes(
      childData,
      parentsData,
      treeId,
      parentsData.attributes.gender
    );
    addParentsWitoutRefetchingTree(childData, parentsData);
  };

  //Add parent via placeholdernode for optimistic rendering on tree
  const addParentsWitoutRefetchingTree = (childData, parentData) => {
    if (parentData.attributes.gender === "Male") {
      childData.attributes.relatedParentIds = { ...childData.attributes.relatedParentIds, [parentData.id]: "Male" }
      addNextGenParentToChild(childData.parents[0], parentData)
    }
    else {
      childData.attributes.relatedParentIds = { ...childData.attributes.relatedParentIds, [parentData.id]: "Female" }
      addNextGenParentToChild(childData.parents[1], parentData)
    }
    return { ...family, childData };
  }
  //To keep tree initial position and show change optimistically without refetch
  const addNextGenParentToChild = (childNode, parentData) => {
    let treelevel = childNode.attributes.path ? childNode.attributes.path.split("/").length : 0

    childNode.firstName = parentData.firstName;
    childNode.lastName = parentData.lastName;
    childNode.attributes.gender = parentData.attributes.gender;
    childNode.isLiving = parentData.isLiving;
    childNode.id = parentData.id;
    childNode.attributes.title = "";
    childNode.attributes.birth.RawDate = parentData.attributes.birth.RawDate;
    childNode.attributes.birth.Year = parentData.attributes.birth.Year;
    childNode.attributes.birth.Month = parentData.attributes.birth.Month;
    childNode.attributes.birth.Day = parentData.attributes.birth.Day;
    childNode.attributes.birthLocation = parentData.attributes.birthLocation;
    childNode.attributes.death.RawDate = parentData.attributes.death.RawDate;
    childNode.attributes.death.Year = parentData.attributes.death.Year;
    childNode.attributes.death.Month = parentData.attributes.death.Month;
    childNode.attributes.death.Day = parentData.attributes.birth.Day;
    childNode.attributes.deathLocation = parentData.attributes.deathLocation;
    if (treelevel % 4 !== 0) childNode.parents = parentsplaceholder(childNode);
  }

  // Add Sibling
  const handleAddSibling = async (node) => {
    const parentsLength = node.relatedParentIds ? Object.keys(node.relatedParentIds).length : 0
    let nodeType = getNodeTypeById(node.id, family);
    let generation = getGenerationFromPath(node.path)
    setModalAction(ADD_SIBLING);
    const selectedNode = {
      id: uuidv4(),
      treeId,
      relationAdded: ADD_SIBLING,
      nodeType,
      filialRelationshipId: uuidv4(),
      homePersonId: primaryPersonId,
      generation,
      selectedName: `${node.firstName || node.lastName}`,
      fetchParents: parentsLength !== 0,
      primaryPersonId: node.id,
      isLiving: generation <= 6 ? true : false
    }
    const _preAdd = addPersonNode(node)
    setPreAdd(_preAdd)
    await dispatchAddSibling(selectedNode, _preAdd);
  }

  // Add Spouse
  const handleAddSpouse = async (node) => {
    setModalAction(ADD_SPOUSE);
    const gender = getSelectedGender(node.gender);
    let nodeType = getNodeTypeById(node.id, family);
    let generation = getGenerationFromPath(node.path)
    const selectedNode = {
      id: uuidv4(),
      treeId,
      relationAdded: ADD_SPOUSE,
      nodeType,
      directChildren: getNoOfSpouses(node.id, family),
      homePersonId: primaryPersonId,
      generation,
      treePersonId: node.id,
      filialRelationshipId: node.cFilialId || uuidv4(),
      spousalRelationshipId: uuidv4(),
      isLiving:  generation <= 6 ? true : false,
      selectedName: node.firstName || node.lastName,
      fetchChildren: true,
      gender,
      requiredGender:
      gender === MALE || gender === FEMALE ? true : false
    }
    console.log(selectedNode,"===")
    let nodeWithSpouse = {
      ...selectedNode,
      spousesLength: selectedNode.nodeType === 'schild' ? getNoOfSpouses(node.id, family, 'schild') : getNoOfSpouses(node.id, family, 'parents'),
    }
    const _preAdd = addPersonNode(node)
    setPreAdd(_preAdd)
    await dispatchAddSpouse(nodeWithSpouse,  _preAdd);
  }

  const redirectUrl = async () => {
    if (checkRefetchFamily) {
      setTimeout(async () => {
        if (modalAction === EDIT_PERSON)
          setZoomReset(false)
        else
          setZoomReset(true)
        await dispatchRefetchFamily(treeId, primaryPersonId, level);
        await dispatchGetTreePersonOptions(treeId);
        setModalAction(null);
        setNewParent(null);
      }, 3000);
    }
    else {
      setModalAction(null);
      setNewParent(null);
      await dispatchCancelModal();
    }
  }

  const refetchAfterParentsAdded = () => {
    setTimeout(async () => {
      dispatchGetTreePersonOptions(treeId);
    }, 3000);
  }

  const handleDeletePerson = (selectedPerson) => {
    setChoosenPerson(selectedPerson);
    setShowDeleteModal(true);
  }


  if (window.location.href.includes('pedigree-view')) {
    return (
      <>
        <PedigreeViewPage
          {...getPropsForTree()}
        />
        <Modal
          preAdd= {preAdd}
          treeId={treeId}
          modalAction={modalAction}
          setModalAction={setModalAction}
          redirectUrl={redirectUrl}
          newParent={newParent}
          childName={childName}
          saveplaceholderParents={saveplaceholderParents}
          handleSaveEdit={handleSaveEdit}
          handleDeletePerson={handleDeletePerson}
        />

        <DeletePersonModal 
        showDeleteModal={showDeleteModal}
        choosenPerson={choosenPerson}
        setShowDeleteModal={setShowDeleteModal}
        handleDelete={handleDelete}
        loading={deletingPerson}
        />
      </>
    )
  } else if ((stepper || !treeId) && !getRecentTree()?.treeId) {
    return (
      <div className="main-container">
        <div className="start-tree-wrapper">
          <Stepper
            step={step}
            content={
              uploadStep ? (
                <GetUploadSteps {...getPropsForUpload()} />
              ) : (
                <GetStartSteps {...getPropsForStart()} />
              )
            }
          />
        </div>
      </div>
    );
  } else {
    return <Loader />
  }
};

FamilyPage.propTypes = {
  family: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  family: state.family,
  user: state.user
});

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchShowFooter: (show) => dispatch(showFooter(show)),
    dispatchGetFamily: (treeId, primaryPersonId, level) => dispatch(getFamily(treeId, primaryPersonId, level)),
    dispatchStartNewTree: (userForm) => dispatch(startNewTree(userForm)),
    dispatchImportGedCom: (FileName, FormFile) => dispatch(importGedCom(FileName, FormFile)),
    dispatchGetImportStatus: (treeId) => dispatch(getImportStatus(treeId)),
    dispatchAssignHomePerson: (treeId, personId, homePersonCheck) => dispatch(assignHomePerson(treeId, personId, homePersonCheck)),
    dispatchHandleSelectHomePerson: (value) => dispatch(handleSelectHomePerson(value)),
    dispatchUpdateGedcom: (treeId, personId, level) => dispatch(updateGedcom(treeId, personId, level)),
    dispatchRefetchFamily: (treeId, primaryPersonId, level) => dispatch(refetchFamily(treeId, primaryPersonId, level)),
    dispatchAddParentsViaNodes: () => dispatch(addParentsViaPlaceHolders()),
    dispatchSaveParentsViaNodes: (childData, resultedData, treeId, gender) => dispatch(saveParentsViaPlaceHolders(childData, resultedData, treeId, gender)),
    dispatchSaveEditPerson: (family, editPerson, modalPerson, treeId) => dispatch(saveEditPerson(family, editPerson, modalPerson, treeId)),
    // Pedigree View Actions
    dispatchClearFamily: () => dispatch(clearFamily()),
    dispatchGetEditPerson: (personId) => dispatch(getEditPerson(personId)),
    dispatchAddParent: (selectedNode, preAdd= false) => dispatch(addParent(selectedNode, preAdd)),
    dispatchAddSpouse: (selectedNode, preAdd= false) => dispatch(addSpouse(selectedNode, preAdd)),
    dispatchAddSibling: (selectedNode, preAdd= false) => dispatch(addSibling(selectedNode, preAdd)),
    dispatchAddChild: (selectedNode, preAdd= false) => dispatch(addChild(selectedNode, preAdd)),
    dispatchGetTreePersonOptions: (treeId) => dispatch(getTreePersonOptions(treeId)),
    dispatchDeletePerson: (personId) => dispatch(deletePerson(personId)),
    dispatchCancelModal: () => dispatch(cancelModal()),
    dispatchGetIsLivingStatus: (treeId, personId, relation) => dispatch(getIsLivingStatus(treeId, personId, relation)),
    dispatchRefetchComplete: () => dispatch(refetchComplete()),
    dispatchRefetchFamilyTreeAndList: (treeId, primaryPersonId, level) => dispatch(refetchFamilyTreeAndList(treeId, primaryPersonId, level))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FamilyPage);
