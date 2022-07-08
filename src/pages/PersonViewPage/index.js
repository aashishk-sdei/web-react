import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "./index.css";
import queryString from 'query-string'
import { setZoomReset } from "../FamilyPage";

// Components
import Loader from "../../components/Loader";
import { getQueryParam, tableTypes } from "../../components/utils";
import ImageCropper from "../../components/ImageCropper";
import InvalidFile from "../../components/InvalidFile";
import DeletePersonModal from "../../components/DeletePersonModal";
import RelationshipEventModal from "../../components/Table/RelationshipEventModal";

// Local Components
import NewHeader from "./NewHeader";
import Content from "./content";

// Common
import Modal from "../Common/Modal";

// Actions
import {
  getPerson,
  updatePersonalInfo,
  updateSpousesAndChildren,
  updateParentsAndSiblings,
  updateEvents,
  updateLifeEvents,
  updateParents,
  updateSpouses,
  refetchPersonInfo,
  refetchPersonBasicInfo,
  addLifeEvent,
  addRelationshipEvent,
  addHeroImage,
  deleteHeroImage,
  editHeroImage,
  deleteLifeEvent,
  deletePerson,
  refetchFamilyInfo
} from "../../redux/actions/person";
import { getPersonsClue, clearPersonsClue } from "../../redux/actions/personRecord";
import { showFooter } from "../../redux/actions/layout"

import {
  addParent,
  addSpouse,
  addSibling,
  addChild,
  renderTree,
  addProfileImage,
  deleteProfileImage,
  getProfileImage,
  editProfileImage,
  clearImage,
  showImage,
  getRepresentInfo,
  getPersonSpouses,
  getDirectChildren,
  clearEventInfo
} from "../../redux/actions/family";
import { setProfileImage, addRecentViewPeople } from "../../redux/actions/user";

// Utils
import {
  modalType,
  getSelectedGender,
  MALE,
  FEMALE,
  dataURLtoFile,
  blobToDataUrl
} from "../../utils";
import * as services from "../../services";

//Menus
import { photoMenu, heroPhotoMenu } from "./menus";

//Css services
import { addPersonClass, removePersonClass, removeHiddenHeader } from "./services";

const { ADD_CHILD, ADD_PARENT, ADD_SIBLING, ADD_SPOUSE } = modalType;
const { PERSONAL_INFO, SPOUSES_AND_CHILDREN, PARENTS_AND_SIBLINGS, EVENTS, LIFE_EVENTS } = tableTypes;

let animation = false;

const emptyEvent = { id: '', name: '' };

const PersonPage = ({
  person,
  user: { imgSrc, userId, imageUploaded },
  family: { imageLoading, refetchFamily, deletingPerson, refetchTreePostDeletetion, profileImageAdded, originalImage, imageFetching, showImageCropper, heroImageAdded, originalHeroImage, eventDetails, dropDownPayload, directChildren },
  personRecord: { isPersonClue, personClue },
  dispatchShowFooter,
  dispatchGetPerson,
  dispatchUpdatePersonalInfo,
  dispatchUpdateSpousesAndChildren,
  dispatchSetProfileImage,
  dispatchUpdateParentsAndSiblings,
  dispatchUpdateEvents,
  dispatchUpdateLifeEvents,
  dispatchAddParent,
  dispatchAddSpouse,
  dispatchAddSibling,
  dispatchAddChild,
  dispatchUpdateParents,
  dispatchUpdateSpouses,
  dispatchRenderTree,
  dispatchAddProfileImage,
  dispatchRefetchPersonInfo,
  dispatchRefetchBasicInfo,
  dispatchDeleteProfileImage,
  dispatchDeleteHeroImage,
  dispatchGetProfileImage,
  dispatchEditProfileImage,
  dispatchClearImage,
  dispatchShowImage,
  dispatchGetRepresentInfo,
  dispatchAddRecnetPeople,
  dispatchAddHeroImage,
  dispatchEditHeroImage,
  dispatchGetPersonsClue,
  dispatchClearPersonsClue,
  dispatchGetSpouse,
  dispatchAddRelationshipEvent,
  dispatchDeleteLifeEvent,
  dipatchGetDirectChildren,
  dispatchDeletePerson,
  dipatchClearEventInfo,
  dispatchRefetchFamilyInfo,
  ...props
}) => {
  const queryTab = +queryString.parse(getQueryParam()).tab
  const { treeId, primaryPersonId } = useParams();
  const history = useHistory();
  const fileObject = {
    x: 0,
    y: 0,
    zoom: 1,
    file: null
  }
  const [modalAction, setModalAction] = useState(null);
  const [hideParent, setHideParent] = useState(false);
  const [selectedFile, setSelectedFile] = useState(fileObject);
  const [selectedHeroFile, setSelectedHeroFile] = useState(fileObject);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [imageFile, setImageFile] = useState(null);
  const [showInvalidModal, setShowInvalidModal] = useState(false);
  const [showPopper, setShowPopper] = useState(true);
  const [cropState, setCropState] = useState("create");
  const [compState, setCompState] = useState(null);
  const [tab, setTab] = useState(((queryTab || queryTab === 1) && queryTab <= 5) ? queryTab : 0);
  const fileInputRef = useRef(null);
  const heroImageRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [newEvent, setNewEvent] = useState(emptyEvent);
  const [eventPop, setEventPop] = useState(null);
  const [eventModalPerson, setEventModalPerson] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [choosenPerson, setChoosenPerson] = useState(null);
  const anchorRef = React.useRef(null);
  const showOffset = true;

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);

  //FileSelector
  const fileSelector = document.createElement('input');
  fileSelector.setAttribute('type', 'file');
  fileSelector.accept = 'image/*';
  fileSelector.addEventListener("change", handleFiles, false);

  function handleFiles() {
    const fileList = this.files;
    const file = fileList[0]; /* now you can work with the file list */
    if (compState && compState === 'hero') {
      setSelectedHeroFile({
        ...selectedHeroFile,
        file: file
      });
    }
    else {
      setSelectedFile({
        ...selectedFile,
        file: file
      });
    }
  }

  const handleToggle = () => {
    setOpen((openState) => !openState);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  const getMousePosition = (e) => {
    setMousePosition({
      ...mousePosition,
      x: e.clientX,
      y: e.clientY
    })
  }

  useEffect(() => {
    dispatchShowFooter(false)
    return () => {
      dispatchShowFooter()
    }
  }, [dispatchShowFooter])

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const handleSelect = (e) => {
    handlePhotoMenu(e)
    setOpen(false);
  }

  useEffect(() => {
    if(refetchFamily){
      dispatchRefetchFamilyInfo(treeId, primaryPersonId);
      setShowDeleteModal(false);
    }
  },[refetchFamily, primaryPersonId, treeId, dispatchRefetchFamilyInfo])

  useEffect(() => {
    if(refetchTreePostDeletetion){
      history.push(`/family/pedigree-view/${treeId}/${person.personalInfo.homePersonId}/4${getQueryParam()}`)
    }
  },[history, person.homePersonId, refetchTreePostDeletetion, treeId])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, true);
    dispatchGetPerson(treeId, primaryPersonId);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      dispatchRenderTree();
      dispatchClearImage();
    };
  }, [dispatchGetPerson, treeId, primaryPersonId, dispatchRenderTree, dispatchClearImage]);

  useEffect(() => {
    if (person) setHideParent(Object.keys(person.relatedParentIds).length === 2 ? true : false);
  }, [person, setHideParent]);

  // New modal payload to add relatedevent via allLifeevents table
  useEffect(() => {
    if (eventDetails) {
      setEventModalPerson(eventDetails);
    }
  }, [setEventModalPerson, eventDetails]);

  useEffect(() => {
    if (imageUploaded) {
      setTimeout(async () => {
        await dispatchGetRepresentInfo(userId, treeId, primaryPersonId)
      }, 2000);
    }
  }, [userId, treeId, imageUploaded, primaryPersonId, dispatchGetRepresentInfo]);

  useEffect(() => {
    if (profileImageAdded) {
      setSelectedFile(null);
      setImageFile(null);
      setSelectedHeroFile(null);
      setCompState(null);
      dispatchRefetchPersonInfo(treeId, primaryPersonId);
    }
    if (imgSrc === "") {
      dispatchSetProfileImage(userId)
    }
  }, [profileImageAdded, setSelectedFile, setImageFile, dispatchRefetchPersonInfo, primaryPersonId, treeId, imgSrc, dispatchSetProfileImage, userId])

  useEffect(() => {
    if (heroImageAdded) {
      setImageFile(null);
      setSelectedHeroFile(null);
      setCompState(null);
      dispatchRefetchBasicInfo(primaryPersonId, true);
    }
  }, [heroImageAdded, setImageFile, setSelectedHeroFile, dispatchRefetchBasicInfo, primaryPersonId])

  useEffect(() => {
    if (originalImage) {
      const url = originalImage.originalImagePath;
      blobToDataUrl(url).then((response) => {
        const originalImageFile = dataURLtoFile(response, 'test.png');
        if (originalImage.croppingInfo) {
          setCropState("edit");
          setSelectedFile({
            x: originalImage.croppingInfo.cropX,
            y: originalImage.croppingInfo.cropY,
            height: originalImage.croppingInfo.height,
            width: originalImage.croppingInfo.width,
            zoom: originalImage.croppingInfo.zoomAspect,
            file: originalImageFile
          });
        }
        else {
          setCropState("create");
          setSelectedFile({ ...selectedFile, file: originalImageFile });
        }

      })
    }
  }, [profileImageAdded, setSelectedFile, originalImage])

  useEffect(() => {
    if (originalHeroImage) {
      const url = originalHeroImage.originalImagePath;
      blobToDataUrl(url).then((response) => {
        const originalImageFile = dataURLtoFile(response, 'test.png');
        if (originalHeroImage.croppingInfo) {
          setCropState("edit");
          setSelectedHeroFile({
            x: originalHeroImage.croppingInfo.cropX,
            y: originalHeroImage.croppingInfo.cropY,
            height: originalHeroImage.croppingInfo.height,
            width: originalHeroImage.croppingInfo.width,
            zoom: originalHeroImage.croppingInfo.zoomAspect,
            file: originalImageFile
          });
        }
        else {
          setCropState("create");
          setSelectedHeroFile({ ...selectedHeroFile, file: originalImageFile });
        }

      })
    }
  }, [setSelectedHeroFile, originalHeroImage])

  useEffect(() => {
    if (!showImageCropper) {
      setSelectedFile(null);
      setSelectedHeroFile(null);
      setImageFile(null);
      setCompState(null);
    }
  }, [setSelectedFile, setImageFile, showImageCropper])

  useEffect(() => {
    if (showInvalidModal) {
      dispatchClearImage();
    }
  }, [showInvalidModal, dispatchClearImage])

  useEffect(() => {
    if (selectedFile && selectedFile.file && imageFile) {
      setCompState(null);
      dispatchShowImage();
    }
  }, [selectedFile, imageFile, dispatchShowImage])

  useEffect(() => {
    if (selectedHeroFile && selectedHeroFile.file && imageFile) {
      setCompState('hero');
      dispatchShowImage();
    }
  }, [selectedHeroFile, imageFile, dispatchShowImage])

  useEffect(() => {
    if (treeId && primaryPersonId) {
      dispatchAddRecnetPeople({ treeId, primaryPersonId })
    }
  }, [])

  const handleScroll = () => {
    const position = window.scrollY;
    const mainHeader = document.getElementsByClassName("main-header");
    const fixedHeader = document.getElementsByClassName("fixed-header");
    const personPage = document.getElementById("person-page");


    if (mainHeader && mainHeader[0] && fixedHeader && fixedHeader[0]) {
      if (position >= 1 && (fixedHeader[0].style.visibility === "hidden" || fixedHeader[0].style.visibility === "")) {
        // Main Header InVisible
        // mainHeader[0].style.visibility = "hidden";
        mainHeader[0].classList.remove("person-page-scroll");
        // Height of Header
        let newheight = document.getElementsByClassName("fixed-header")[0].offsetHeight;
        newheight = newheight + 10;
        document.getElementById("person-page").style.marginTop = newheight + "px";

        // Fixed Header Visible
        // fixedHeader[0].style.visibility = "visible";
        fixedHeader[0].style.zIndex = 99;
        fixedHeader[0].classList.add("person-page-scroll");
        personPage.classList.remove("mt-56");
        personPage.classList.add(window.innerWidth < 1024 ? "mt-36" : "mt-24");
        animation = true;

        //Popper Invisible
        setShowPopper(false);
      }
      if (position < 1 && (mainHeader[0].style.visibility === "hidden" || mainHeader[0].style.visibility === "")) {
        // Main Header Visible
        // mainHeader[0].style.visibility = "visible";
        if (animation) mainHeader[0].classList.add("person-page-scroll");

        // Height of Header
        let newheight = document.getElementsByClassName("main-header")[0].offsetHeight;
        newheight = newheight + 10;
        document.getElementById("person-page").style.marginTop = newheight + "px";

        // Fixed Header InVisible
        // fixedHeader[0].style.visibility = "hidden";
        fixedHeader[0].classList.remove("person-page-scroll");
        personPage.classList.remove(window.innerWidth < 1024 ? "mt-36" : "mt-24");
        personPage.classList.add("mt-56");

        //Popper Visible
        setShowPopper(true);
      }
    }
  }

  const handleViewTree = () => {
    if (treeId && primaryPersonId) {
      setZoomReset(true);
      removeHiddenHeader();
      return history.push(`/family/pedigree-view/${treeId}/${primaryPersonId}/4${getQueryParam()}`);
    }
  }

  // Add relationship event Modal Form Handling
  const handleIsLiving = (value) => {
    if (value) {
      setEventModalPerson({
        ...eventModalPerson,
        isLiving: true,
        death: "",
        deathLocation: "",
        deathLocationId: ""
      })
    } else {
      setEventModalPerson({
        ...eventModalPerson,
        isLiving: false,
      })
    }
  }

  const handleUpdate = (payload, changedKey) => {
    switch (payload.tableType) {
      case PERSONAL_INFO:
        // Updating Store
        dispatchUpdatePersonalInfo(person.personalInfo, payload, changedKey, person);
        break;

      case SPOUSES_AND_CHILDREN:
        // Updating Store
        dispatchUpdateSpousesAndChildren(person.spousesAndChildren, payload, changedKey, treeId, person);
        break;

      case PARENTS_AND_SIBLINGS:
        // Updating Store
        dispatchUpdateParentsAndSiblings(person.parentsAndSiblings, payload, changedKey, treeId, person);
        break;

      case EVENTS:
        // Updating Store
        dispatchUpdateEvents(person.events, payload, changedKey, treeId, person);
        break;

      case LIFE_EVENTS:
        // Updating Store
        dispatchUpdateLifeEvents(person.lifeEvents, payload, changedKey, treeId, person);
        break;

      default:
        break;
    }
  }

  const saveImageFile = (file, image) => {
    setSelectedFile(file);
    setImageFile(image);
  }

  const selectShowImage = async () => {
    await dispatchShowImage();
  }

  const closeCropModal = async () => {
    setCompState(null);
    setSelectedFile(null);
    setSelectedHeroFile(null);
    if (fileInputRef.current !== null) {
      fileInputRef.current.value = null;
    }
    if (anchorRef.current !== null) {
      anchorRef.current.files = null;
    }
    await dispatchClearImage();
  }

  const onTargetClick = () => {
    fileInputRef.current.click();
  };

  const handleMenu = (event) => {
    switch (event.id) {
      case 7:
        handleAddParent();
        break;

      case 8:
        handleAddSpouse();
        break;

      case 9:
        handleAddSibling();
        break;

      case 10:
        handleAddChild();
        break;

      case 11:
      case 13:
      case 14:
      case 16:
      case 17:
      case 18:
      case 19:
      case 20:
      case 21:
      case 22:
      case 25:
      case 26:
      case 27:
      case 29:
      case 30:
      case 31:
      case 36:
      case 37:
      case 38:
      case 39:
        setEventPop(document.getElementById("lifeEvents"))
        setNewEvent(event);
        break;
      case 12:
      case 15:
      case 23:
      case 24:
      case 28:
      case 32:
      case 33:
      case 34:
      case 35:
      case 40:
        setNewEvent(event);
        setShowEventModal(true)
        handleRelatedEvent();
        break;
      default:
        break;
    }
  }

  const handleHeaderMenu = (event) => {
    switch (event.id) {
      case 2: handleViewTree();
        break;
      case 4: let selectedPerson = {
        id: person && person.personalInfo && person.personalInfo.id,
        firstName: person && person.personalInfo && person.personalInfo.givenName && person.personalInfo.givenName.givenName,
        lastName : person && person.personalInfo && person.personalInfo.surname && person.personalInfo.surname.surname
      }
        setChoosenPerson(selectedPerson);
        setShowDeleteModal(true);
        break;
      case 1:
      case 3:
      default:
        break;
    }
  }

  const getDisabledMenuItem = (event) => {
    switch (event.id) {
      case 2: 
      case 1:
      case 3: return false;
      case 4: if(person && person.personalInfo && person.personalInfo.id === person.personalInfo.homePersonId) 
                return true;
              return false;
      default:
        break;
    }
  }



  const handleResize = async () => {
    setImageFile(null);
    if (compState) {
      const backgroundImageId = person.personalInfo.backgroundImageId
      await dispatchGetProfileImage(backgroundImageId, true)
    }
    else {
      const profileImageId = person.personalInfo.profileImageId
      await dispatchGetProfileImage(profileImageId)
    }
  }

  const handleChooseNew = () => {
    setCropState("create");
    setImageFile(null);
    fileSelector.click();
  }

  const handleDelete = async () => {
    if (compState && compState === 'hero') {
      await dispatchDeleteHeroImage(primaryPersonId);
      removePersonClass();
    }
    else {
      setSelectedFile(null);
      await dispatchDeleteProfileImage(primaryPersonId)
    }
  }

  const handleImageViewer = () => {
    if (compState && compState === 'hero') {
      history.push(`/media/view-image/${person.personalInfo.backgroundImageId}/false`)
    }
    else {
      history.push(`/media/view-image/${person.personalInfo.profileImageId}/false`)
    }
  }

  const handlePhotoMenu = (e) => {
    switch (e.id) {
      case 1:
        handleImageViewer();
        break;

      case 2:
        handleResize();
        break;

      case 3:
        handleChooseNew();
        break;

      case 4:
        handleDelete();
        break;

      default:
        break;
    }
  }

  // Add Parent
  const handleAddParent = async () => {
    setModalAction(ADD_PARENT);
    const gender = !hideParent && person.parentsAndSiblings.length > 0 ? getSelectedGender(person.parentsAndSiblings[0].Parents[0].gender) : "";
    const selectedNode = {
      id: uuidv4(),
      treeId,
      filialRelationshipId: person.filialRelationshipId || uuidv4(),
      childId: person.personalInfo.id,
      isLiving: true,
      selectedName: person.personalInfo.givenName.givenName || person.personalInfo.surname.surname,
      parentId: !hideParent && person.parentsAndSiblings.length > 0 ? person.parentsAndSiblings[0].Parents[0].id : null,
      fetchSiblings: Object.keys(person.relatedParentIds).length === 1,
      gender,
      requiredGender: gender === MALE || gender === FEMALE ? true : false
    }
    await dispatchAddParent(selectedNode);
  }

  // Add Spouse
  const handleAddSpouse = async () => {
    setModalAction(ADD_SPOUSE);
    const gender = getSelectedGender(person.personalInfo.gender.gender);
    const selectedNode = {
      id: uuidv4(),
      treeId,
      treePersonId: person.personalInfo.id,
      filialRelationshipId: person.filialRelationshipId || uuidv4(),
      spousalRelationshipId: uuidv4(),
      isLiving: true,
      selectedName: person.personalInfo.givenName.givenName || person.personalInfo.surname.surname,
      fetchChildren: true,
      gender,
      requiredGender: gender === MALE || gender === FEMALE ? true : false
    }
    await dispatchAddSpouse(selectedNode);
  }

  // Add Sibling
  const handleAddSibling = async () => {
    setModalAction(ADD_SIBLING);
    const selectedNode = {
      id: uuidv4(),
      treeId,
      filialRelationshipId: uuidv4(),
      isLiving: true,
      selectedName: person.personalInfo.givenName.givenName || person.personalInfo.surname.surname,
      fetchParents: Object.keys(person.relatedParentIds).length > 0 ? true : false,
      primaryPersonId
    }
    await dispatchAddSibling(selectedNode);
  }

  // Add Child
  const handleAddChild = async () => {
    setModalAction(ADD_CHILD);
    const selectedNode = {
      id: uuidv4(),
      treeId,
      treePersonId: person.personalInfo.id,
      filialRelationshipId: uuidv4(),
      isLiving: true,
      firstName: person.personalInfo.givenName.givenName,
      lastName: person.personalInfo.surname.surname,
      selectedName: person.personalInfo.givenName.givenName || person.personalInfo.surname.surname,
      fetchChildren: true,
      nodeGender: person.personalInfo.gender.gender,
      primaryPersonId: person.personalInfo.id,
    }
    await dispatchAddChild(selectedNode)
  }

  // Add Related event via modal
  const handleRelatedEvent = async () => {
    const gender = getSelectedGender(person.personalInfo.gender.gender);
    const reltionshipEventDetail = {
      treeId,
      treePersonId: primaryPersonId,
      isLiving: true,
      selectedName: `${person.personalInfo.givenName.givenName}`,
      gender,
      date: "",
      location: "",
      description: "",
      requiredGender: gender === MALE || gender === FEMALE ? true : false,
    }
    await dispatchGetSpouse(reltionshipEventDetail);
  }

  const handleGetDirectChildren = (dataForDirectChildren) => {
    dipatchGetDirectChildren(dataForDirectChildren);
  }

  const redirectUrl = async (actionType) => {
    setTimeout(async () => {
      switch (actionType) {
        case ADD_PARENT:
        case ADD_SIBLING:
          await dispatchUpdateParents(treeId, primaryPersonId);
          break;

        case ADD_SPOUSE:
        case ADD_CHILD:
          await dispatchUpdateSpouses(treeId, primaryPersonId);
          break;

        default:
          break;
      }
    }, 3000)
  }

  const handleSaveImages = async (croppedImageFile, croppingInfo, fileUrl) => {
    if (compState) {
      switch (cropState) {
        case 'edit': const editHeroImagePayload = {
          authorCredit: "author-credit",
          treeId: treeId,
          treePersonId: primaryPersonId,
          profileImage: croppedImageFile,
          originalImage: selectedHeroFile.file,
          originalImageId: originalHeroImage.originalImageId,
          croppingInfo,
          fileUrl
        }
          await dispatchEditHeroImage(editHeroImagePayload);
          break;
        case "create":
        default:
          const uploadHeroImage = {
            authorCredit: "author-credit",
            treeId: treeId,
            treePersonId: primaryPersonId,
            profileImage: croppedImageFile,
            originalImage: selectedHeroFile.file,
            croppingInfo,
            fileUrl
          }
          addPersonClass();
          await dispatchAddHeroImage(uploadHeroImage, true);
      }
    }
    else if (cropState === "edit") {
      const editImagePayload = {
        ownerId: services.getOwner(),
        authorCredit: "author-credit",
        treeId: treeId,
        treePersonId: primaryPersonId,
        profileImage: croppedImageFile,
        originalImage: selectedFile.file,
        originalImageId: originalImage.originalImageId,
        croppingInfo,
        fileUrl
      }
      await dispatchEditProfileImage(editImagePayload, true)
    }
    else {
      const fileName = selectedFile && selectedFile.file.name.split(".")[0];
      const imagePayload = {
        ownerId: services.getOwner(),
        treeId: treeId,
        treePersonId: primaryPersonId,
        size: 10,
        authorCredit: "author-credit",
        originalImage: selectedFile.file,
        profileImage: croppedImageFile,
        fileName,
        croppingInfo,
        fileUrl
      }
      await dispatchAddProfileImage(imagePayload, true);
    }
  }

  const closeInvalidModal = () => {
    setSelectedFile(null);
    setSelectedHeroFile(null);
    setShowInvalidModal(false);
    if (fileInputRef.current !== null) {
      fileInputRef.current.value = null;
    }
  };

  const handleImageUploader = (files) => {
    if (showInvalidModal) closeInvalidModal();
    const file = files[0];
    setSelectedFile({
      ...selectedFile,
      file
    });
  };

  const handleTab = (selectedTab) => {
    setTab(selectedTab);
    window.scrollTo(0, 0);
  }

  const handleGetPersonsClue = () => {
    dispatchGetPersonsClue(person.personalInfo.id)
  }

  const clearPersonClue = () => {
    dispatchClearPersonsClue()
  }

  const getPropsForHeader = () => {
    return {
      personalInfo: person.personalInfo,
      relation: person.relation,
      imageLoading: person.profileImageLoading,
      Family: person.parentsAndSiblings,
      spousesAndChildren: person.spousesAndChildren,
      lifeEvents: person.lifeEvents,
      handleViewTree,
      saveImageFile,
      setSelectedFile,
      selectedHeroFile,
      setSelectedHeroFile,
      selectedFile,
      onTargetClick,
      fileInputRef,
      heroImageRef,
      tab,
      handleTab,
      photoMenu,
      heroPhotoMenu,
      open,
      anchorRef,
      handleToggle,
      handleClose,
      handleListKeyDown,
      handleSelect,
      selectShowImage,
      showPopper,
      showOffset,
      getMousePosition,
      mousePosition,
      setCompState,
      setCropState,
      setMousePosition,
      handleHeaderMenu,
      getDisabledMenuItem,
      isPersonClue: isPersonClue,
      personClue: personClue,
      handleGetPersonsClue,
      clearPersonClue,
      isOwner: services.isUserOwner(person.personalInfo.ownerId),
      isPrivate: !services.isUserOwner(person.personalInfo.ownerId) && person.personalInfo.isLiving,
    }
  }

  const closeEventPop = () => {
    setEventPop(null);
  }

  const closeNewEvent = () => {
    setNewEvent(emptyEvent);
  }

  const handleNewEvent = (newEventData) => {
    props.dispatchAddLifeEvent(treeId, primaryPersonId, newEventData, person.lifeEvents, person);
  }

  const handleNewRelationshipEvent = (newEventData) => {
    setEventModalPerson(null);
    dispatchAddRelationshipEvent(treeId, primaryPersonId, newEventData, person.lifeEvents, person, newEvent.name);
  }
  const handleChange = (e) => {
    const { name, value, locationId, birthLocationId, deathLocationId } = e.target;
    if (locationId || locationId === "") {
      setEventModalPerson({
        ...eventModalPerson,
        [name]: value,
        locationId,
      });
    } else if (birthLocationId || birthLocationId === "") {
      setEventModalPerson({
        ...eventModalPerson,
        [name]: value,
        birthLocationId,
      });
    }
    else if (deathLocationId || deathLocationId === "") {
      setEventModalPerson({
        ...eventModalPerson,
        [name]: value,
        deathLocationId,
      });
    }
    else {
      setEventModalPerson({
        ...eventModalPerson,
        [name]: value,
      })
    }
  }
  const handleGender = (value) => {
    setEventModalPerson({
      ...eventModalPerson,
      gender: value
    })
  }

  const handleDeleteLifeEvent = (rowDetails) => {
    if (!person.deletingEvent) dispatchDeleteLifeEvent(rowDetails, person.lifeEvents, treeId, primaryPersonId, person)
  }

  const handleClearEventInfo = () => {
    dipatchClearEventInfo();
  }

  const handleDeleteClick = (rowDetails, isRowEvent) => {
    setChoosenPerson({
      ...rowDetails,
      isRowEvent
    });
    setShowDeleteModal(true);
  } 

  const handleDeletePerson = () => {
    dispatchDeletePerson(choosenPerson)
  }
  
  const handleCloseEventPopover = () => {
    setNewEvent(emptyEvent);
    setEventPop(null);
  }

  const getPropsForContent = () => {
    return {
      person,
      treeId,
      hideParent,
      handleMenu,
      handleUpdate,
      primaryPersonId,
      eventPop,
      closeEventPop,
      newEvent,
      closeNewEvent,
      handleNewEvent,
      addingLifeEvent: person.addingLifeEvent,
      lifeEventAdded: person.lifeEventAdded,
      handleCloseEventPopover,
      handleDeleteLifeEvent,
      handleDeleteClick,
      isOwner: services.isUserOwner(person.personalInfo.ownerId),
      isPrivate: !services.isUserOwner(person.personalInfo.ownerId) && person.personalInfo.isLiving,
    }
  }

  const getPropsForRelationalModal = () => {
    return {
      eventDetails,
      eventModalPerson,
      dropDownPayload,
      handleChange,
      handleGender,
      setShowEventModal,
      showEventModal,
      setEventModalPerson,
      handleNewRelationshipEvent,
      handleIsLiving,
      newEvent,
      handleGetDirectChildren,
      directChildren,
      handleClearEventInfo
    }
  }

  if (person.loading) {
    return <div className="h-screen"><Loader color="primary" /></div>
  } else {
    return (
      <div className="person-detail-page">

        <Modal
          modalAction={modalAction}
          setModalAction={setModalAction}
          redirectUrl={redirectUrl}
        />

        {/* <MainHeader
          {...getPropsForHeader()}
        />

        <FixedHeader
          {...getPropsForHeader()}
        /> */}

        <NewHeader
          {...getPropsForHeader()}
        />

        {eventModalPerson && <RelationshipEventModal {...getPropsForRelationalModal()} />}

        <div id="person-page" className="w-full">
          <div className="person-main-content mt-32 main-wrapper mx-auto px-6">
            <Content
              tab={tab}
              {...getPropsForContent()}
            />
          </div>
        </div>

        <ImageCropper
          selectedFile={selectedFile}
          imageFile={imageFile}
          setImageFile={setImageFile}
          closeCropModal={closeCropModal}
          setSelectedFile={setSelectedFile}
          handleSaveImages={handleSaveImages}
          setShowInvalidModal={setShowInvalidModal}
          imageLoading={imageLoading}
          imageFetching={imageFetching}
          showImageCropper={showImageCropper}
          from="pedigree-person"
          cropState={cropState}
          selectedHeroFile={selectedHeroFile}
          setSelectedHeroFile={setSelectedHeroFile}
          compState={compState}
        />

        <InvalidFile
          selectedFile={selectedFile}
          showInvalidModal={showInvalidModal}
          closeInvalidModal={closeInvalidModal}
          handleImageUploader={handleImageUploader}
          selectedHeroFile={selectedHeroFile}
        />

        <DeletePersonModal
          showDeleteModal={showDeleteModal}
          choosenPerson={choosenPerson}
          setShowDeleteModal={setShowDeleteModal}
          handleDelete={handleDeletePerson} 
          loading={deletingPerson} />

      </div>
    );
  }
};

PersonPage.propTypes = {
  person: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  person: state.person,
  family: state.family,
  user: state.user,
  personRecord: state.personRecord
});

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchShowFooter: (show) => dispatch(showFooter(show)),
    dispatchGetPerson: (treeId, primaryPersonId) => dispatch(getPerson(treeId, primaryPersonId)),
    dispatchUpdatePersonalInfo: (oldData, newData, changedKey, person) => dispatch(updatePersonalInfo(oldData, newData, changedKey, person)),
    dispatchUpdateSpousesAndChildren: (oldData, newData, changedKey, treeId, person) => dispatch(updateSpousesAndChildren(oldData, newData, changedKey, treeId, person)),
    dispatchUpdateParentsAndSiblings: (oldData, newData, changedKey, treeId, person) => dispatch(updateParentsAndSiblings(oldData, newData, changedKey, treeId, person)),
    dispatchUpdateEvents: (oldData, newData, changedKey, treeId, person) => dispatch(updateEvents(oldData, newData, changedKey, treeId, person)),
    dispatchUpdateLifeEvents: (oldData, newData, changedKey, treeId, person) => dispatch(updateLifeEvents(oldData, newData, changedKey, treeId, person)),
    dispatchAddParent: (selectedNode) => dispatch(addParent(selectedNode)),
    dispatchAddSpouse: (selectedNode) => dispatch(addSpouse(selectedNode)),
    dispatchAddSibling: (selectedNode) => dispatch(addSibling(selectedNode)),
    dispatchAddRelationshipEvent: (treeId, primaryPersonId, newEvent, oldEvent, person, eventName) => dispatch(addRelationshipEvent(treeId, primaryPersonId, newEvent, oldEvent, person, eventName)),
    dispatchAddChild: (selectedNode) => dispatch(addChild(selectedNode)),
    dispatchUpdateParents: (treeId, primaryPersonId) => dispatch(updateParents(treeId, primaryPersonId)),
    dispatchUpdateSpouses: (treeId, primaryPersonId) => dispatch(updateSpouses(treeId, primaryPersonId)),
    dispatchRenderTree: () => dispatch(renderTree()),
    dispatchAddProfileImage: (imagePayload, personCheck) => dispatch(addProfileImage(imagePayload, personCheck)),
    dispatchDeleteProfileImage: (primaryPersonId) => dispatch(deleteProfileImage(primaryPersonId)),
    dispatchDeleteHeroImage: (primaryPersonId) => dispatch(deleteHeroImage(primaryPersonId)),
    dispatchGetProfileImage: (profileImageId, heroImage) => dispatch(getProfileImage(profileImageId, heroImage)),
    dispatchEditProfileImage: (editImagePayload, personCheck) => dispatch(editProfileImage(editImagePayload, personCheck)),
    dispatchClearImage: () => dispatch(clearImage()),
    dispatchShowImage: () => dispatch(showImage()),
    dispatchSetProfileImage: (userId) => dispatch(setProfileImage(userId)),
    dispatchGetRepresentInfo: (userId, treeId, primaryPersonId) => dispatch(getRepresentInfo(userId, treeId, primaryPersonId)),
    dispatchRefetchPersonInfo: (treeId, primaryPersonId) => dispatch(refetchPersonInfo(treeId, primaryPersonId)),
    dispatchAddLifeEvent: (treeId, primaryPersonId, newEvent, oldEvent, person) => dispatch(addLifeEvent(treeId, primaryPersonId, newEvent, oldEvent, person)),
    dispatchAddRecnetPeople: ({ treeId, primaryPersonId }) => dispatch(addRecentViewPeople({ treeId, primaryPersonId })),
    dispatchAddHeroImage: (imagePayload) => dispatch(addHeroImage(imagePayload)),
    dispatchEditHeroImage: (imagePayload) => dispatch(editHeroImage(imagePayload)),
    dispatchRefetchBasicInfo: (primaryPersonId, dontRefetch) => dispatch(refetchPersonBasicInfo(primaryPersonId, dontRefetch)),
    dispatchGetPersonsClue: (primaryPersonId) => dispatch(getPersonsClue(primaryPersonId)),
    dispatchClearPersonsClue: () => dispatch(clearPersonsClue()),
    dispatchGetSpouse: (selectedNode) => dispatch(getPersonSpouses(selectedNode)),
    dispatchDeleteLifeEvent: (rowDetails, lifeEvents, treeId, treePersonId, person) => dispatch(deleteLifeEvent(rowDetails, lifeEvents, treeId, treePersonId, person)),
    dipatchGetDirectChildren: (selectedNode) => dispatch(getDirectChildren(selectedNode)),
    dipatchClearEventInfo:() => dispatch(clearEventInfo()),
    dispatchDeletePerson:(personId) => dispatch(deletePerson(personId)),
    dispatchRefetchFamilyInfo: (treeId, personId) => dispatch(refetchFamilyInfo(treeId, personId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonPage);