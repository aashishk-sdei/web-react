import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, NavLink, useHistory, useLocation } from "react-router-dom";
import { useDispatch, connect } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import "./index.css";

//Components
import Translator from "../Translator";
import ImagePopper from "../../components/ImagePopper";
import Typography from "../Typography";
import Icon from "../Icon";
import MyTooltip from "../Tooltip";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { FooterLinks } from "../../components/Footer";

//Utils
import { decodeDataToURL, getAvatarName, routeNames } from "./../../utils";
import { getQueryParam } from "../utils";
import { getCustomImageUrl } from "../../utils";

//Actions
import { submitWW1Form, clearWwiFormQuery } from "../../redux/actions/ww1";
import { submitWW2Form, clearWwiiFormQuery } from "../../redux/actions/ww2";
import { submitUSFederalCensusForm, clearUsFormQuery } from "../../redux/actions/USFederalCensus";
import { submitUniversalSearchForm, clearUniversalFormQuery } from "../../redux/actions/universalSearch";
import { submitGermanForm, clearGermanFormQuery } from "../../redux/actions/germanToAmerica";
import { submitRussianForm, clearRussianFormQuery } from "../../redux/actions/russian";
import { submitIrishForm, clearIrishFormQuery } from "../../redux/actions/irish";
import { getTreesList, addRecentViewTree, getNewsPaperFreeViewsCount } from "./../../redux/actions/homepage";
import { updateNotifCount } from "../../redux/actions/notification";
import { removeRecentTree, getAccessToken } from "../../services";

//Menu
import { accountMenu } from "../../pages/PersonViewPage/menus";
import { clearMassachussetsFormQuery, submitMassachusettsForm } from "../../redux/actions/massachusetts";
import { clearUSCensusFormQuery, submitUSCensusForm } from "../../redux/actions/USCensus";
import { clearUsFederal1800FormQuery, submitUSFederal1800Form } from "../../redux/actions/usFedral1800";
import { clearUsFederal1810FormQuery, submitUSFederal1810Form } from "../../redux/actions/usCensus1810";
import { clearUsFederal1820FormQuery, submitUSFederal1820Form } from "../../redux/actions/usCensus1820";
import { clearUsFederal1830FormQuery, submitUSFederal1830Form } from "../../redux/actions/usCensus1830";
import { clearIUSSocialFormQuery, submitUSSocialSecurityForm } from "../../redux/actions/USSocialSecurity";
import { clearItaliansFormQuery, submitItaliansForm } from "../../redux/actions/ItaliansToAmerica";
import { clearMMFormQuery, submitMMForm } from "../../redux/actions/massachusettsMarriages";
import { clearTexasMarriagesFormQuery, submitTexasMarriagesForm } from "../../redux/actions/texasMarriages";
import { clearWMFormQuery, submitWMForm } from "../../redux/actions/washintonMarriages";
import { clearNYCFormQuery, submitNYCForm } from "../../redux/actions/NYC";
import { clearOhioFormQuery, submitOhioForm } from "../../redux/actions/ohioDeaths";
import { clearUsFederal1840FormQuery, submitUSFederal1840Form } from "../../redux/actions/usCensus1840";
import { clearUs1901FormQuery, submitUsCensus1901Form } from "../../redux/actions/UsCensus1901";
import { clearUs1881FormQuery, submitUsCensus1881Form } from "../../redux/actions/UsCensus1881";
import { clearUs1871FormQuery, submitUsCensus1871Form } from "../../redux/actions/UsCensus1871";
import { clearuk1891FormQuery, submitUkCensus1891Form } from "../../redux/actions/Ukcensus1891";
import { clearuk1861FormQuery, submitUkCensus1861Form } from "../../redux/actions/ukCensus1861";
import { clearuk1851FormQuery, submitUkCensus1851Form } from "../../redux/actions/ukCensus1851";
import { clearCivilWarFormQuery, submitCivilWarForm } from "../../redux/actions/civilWar";
import { clearuk1841FormQuery, submitUkCensus1841Form } from "../../redux/actions/Ukcensus1841";
import { clearNYDeathsFormQuery, submitNYDeathsForm } from "../../redux/actions/NYDeaths";

const showMasking = false;
const getTitle = (locationName, sidebar) => {
  let isHeaderDisable = false;
  let type = "";
  let title = null;
  const pathName = locationName[1];
  if (pathName === "records") {
    title = sidebar.contentCatalog?.collectionTitle || "";
    isHeaderDisable = true;
  } else if (pathName === "search" && locationName[2] === "newspaper") {
    let spiltName = locationName[3]?.split("-");
    spiltName.splice(spiltName.length - 5, 5);
    title = <span className="capitalize">{spiltName.join(" ")}</span>;
    isHeaderDisable = true;
    type = "newspaper";
  }
  return { isHeaderDisable, title, type };
};
const Masking = ({ checked, onChange }) => {
  return (
    <div className="flex justify-center mr-2">
      <MyTooltip type="hover" open={true} placement="top" title="Mask" fontWeight="400" padding="6">
        <div className="form-check form-check-inline">
          <input className="form-check-input form-check-input rounded-full h-4 w-4 border border-gray-3 bg-white focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="mask" value="false" checked={checked == "false"} onChange={(e) => onChange(e.target.value)} />
        </div>
      </MyTooltip>
      <MyTooltip type="hover" open={true} placement="top" title="No Mask" fontWeight="400" padding="6">
        <div className="form-check form-check-inline">
          <input className="form-check-input form-check-input rounded-full h-4 w-4 border border-gray-3 bg-white focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="mask" value="true" checked={checked == "true"} onChange={(e) => onChange(e.target.value)} />
        </div>
      </MyTooltip>
      <MyTooltip type="hover" open={true} placement="top" title="Rights" fontWeight="400" padding="6">
        <div className="form-check form-check-inline">
          <input className="form-check-input form-check-input rounded-full h-4 w-4 border border-gray-3 bg-white focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="mask" value="rights" checked={checked == "rights"} onChange={(e) => onChange(e.target.value)} />
        </div>
      </MyTooltip>
    </div>
  );
};

const getMobileTrees = (homepage, setIsOn, setIspeopleTab, dispatch, userProfileAccount, clearAppErrorState) => {
  return homepage?.trees ? (
    homepage.trees.map((item, index) => (
      <NavLink
        key={index}
        onClick={() => {
          setIsOn(false);
          setIspeopleTab(false);
          clearAppErrorState();
          addRecentViewTree(item?.treeId);
          removeRecentTree();
          dispatch(getTreesList(userProfileAccount?.id));
        }}
        to={`/family/pedigree-view/${item.treeId}/${item.homePersonId}/4`}
        className="ml-0 active:bg-gray-1 active:text-gray-7"
      >
        <p className="flex justify-between">
          <Typography size={16}> {item.treeName} </Typography>
          <Typography size={16}>
            <span className="whitespace-nowrap ml-2">
              {item.personCount}
              {`${item.personCount === 1 ? " Person" : " People"}`}
            </span>
          </Typography>
        </p>
      </NavLink>
    ))
  ) : (
    <>
      <div className="flex justify-between">
        <p className="pr-2 two-lines-ellipsis">
          <Typography size={12} text="secondary" weight="medium">
            {" "}
            <Translator tkey="home.profile.trees"></Translator>{" "}
          </Typography>
        </p>
        <p className="whitespace-nowrap">
          <Typography size={10}>
            <Translator tkey="home.profile.noTrees"></Translator>
          </Typography>
        </p>
      </div>
    </>
  );
};
const getArrowIcon = (cond) => (cond ? "upArrow" : "downArrow");
const dropdownClass = (cond, treelist = false) => (cond ? `lft-0 block ${treelist && "people-dd"}` : "hidden");
const Header = ({ handleLogout, clearAppErrorState, user: { userFirstName, userLastName, imgSrc, userProfileAccount }, sidebar: sidebar, dispatchtreesget, homepage, ...props }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const locationUse = useLocation();
  const locationName = locationUse.pathname.split("/");
  const { isHeaderDisable, title } = getTitle(locationName, sidebar);
  const [isOn, setIsOn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const [switchStatus, setSwitchStatus] = useState("true");
  const [isOnAccount, setIsOnAccount] = useState(false);
  const [universalFormSwitchStatus, setUniversalFormSwitchStatus] = useState("true");
  const isSwitchStatus = localStorage.getItem("switch_status"),
    isUniversalSwitchStatus = localStorage.getItem("universal_form_switch_status");
  const [IspeopleTab, setIspeopleTab] = useState(false);
  const avatarName = getAvatarName(userFirstName, userLastName, true);
  const pathArr = locationUse.pathname.split("/");
  pathArr.shift();
  const showFooter = pathArr[0].toLowerCase() === "";
  const familyRoute = "family";

  const options = {
    logMessageContent: true,
    //logger: LogLevel.Warning,
    headers: {
      "wa-clientId": process.env.REACT_APP_CLIENT_ID,
      "wa-requestId": uuidv4(),
    },
    accessTokenFactory: () => getAccessToken(),
  };

  const checkActive = (_match, location) => {
    if (!location) return false;
    const { pathname } = location;
    return pathname === "/";
  };

  useEffect(() => {
    if (userProfileAccount?.id && isMobile) {
      dispatchtreesget(userProfileAccount);
    }
    if (userProfileAccount?.id && !localStorage.getItem("viewCount")) {
      dispatch(getNewsPaperFreeViewsCount());
    }
  }, [userProfileAccount]);

  useEffect(() => {
    window.addEventListener("resize", handleResize, true);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    let connection = new HubConnectionBuilder().withUrl(`${process.env.REACT_APP_API}/notificationHub`, options).build();
    connection.serverTimeoutInMilliseconds = 180000;
    if (getAccessToken()) {
      function startSignalR() {
        connection = new HubConnectionBuilder().withUrl(`${process.env.REACT_APP_API}/notificationHub`, options).build();
        connection.serverTimeoutInMilliseconds = 180000;
        connection
          .start({ transport: "longPolling" })
          .then(() => {
            console.log("connection started");
          })
        connection.on("SendNotification", (data) => {
          dispatch(updateNotifCount(data));
        });
      }
      startSignalR();
      connection.onclose(() => {
        console.log("connection idle");
        startSignalR();
      });
    }
    return () => {
      console.log("connection stop");
      connection.stop();
    };
  }, [getAccessToken()]);

  function handleResize() {
    const width = window.innerWidth;
    if (width <= 767) {
      setIsMobile(true);
    } else {
      setIsOn(false);
      setIsMobile(false);
      setIsOnAccount(false);
    }
  }

  useEffect(() => {
    return history.listen((location) => setCurrentPath(location.pathname));
  }, [history]);

  useEffect(() => {
    const switch_status = isSwitchStatus || "true",
      universal_switch_status = isUniversalSwitchStatus || "true";
    setSwitchStatus(switch_status);
    setUniversalFormSwitchStatus(universal_switch_status);
    setCurrentPath(window.location.pathname);
  }, [isSwitchStatus, isUniversalSwitchStatus]);

  const censusSwitchChange = (_values, isMasking) => {
    if (currentPath === "/search/1790-united-states-federal-census/result") {
      dispatch(clearUSCensusFormQuery(uuidv4()));
      dispatch(submitUSCensusForm(_values, isMasking));
    }
    if (currentPath === "/search/1800-united-states-federal-census/result") {
      dispatch(clearUsFederal1800FormQuery(uuidv4()));
      dispatch(submitUSFederal1800Form(_values, isMasking));
    }
    if (currentPath === "/search/1810-united-states-federal-census/result") {
      dispatch(clearUsFederal1810FormQuery(uuidv4()));
      dispatch(submitUSFederal1810Form(_values, isMasking));
    }
    if (currentPath === "/search/1820-united-states-federal-census/result") {
      dispatch(clearUsFederal1820FormQuery(uuidv4()));
      dispatch(submitUSFederal1820Form(_values, isMasking));
    }
    if (currentPath === "/search/1830-united-states-federal-census/result") {
      dispatch(clearUsFederal1830FormQuery(uuidv4()));
      dispatch(submitUSFederal1830Form(_values, isMasking));
    }
    if (currentPath === "/search/1840-united-states-federal-census/result") {
      dispatch(clearUsFederal1840FormQuery(uuidv4()));
      dispatch(submitUSFederal1840Form(_values, isMasking));
    }
    if (currentPath === "/search/1940-united-states-federal-census/result") {
      dispatch(clearUsFormQuery(uuidv4()));
      dispatch(submitUSFederalCensusForm(_values, isMasking));
    }
    if (currentPath === "/search/1901-united-kingdom-census/result") {
      dispatch(clearUs1901FormQuery(uuidv4()));
      dispatch(submitUsCensus1901Form(_values, isMasking));
    }
    if (currentPath === "/search/1881-united-kingdom-census/result") {
      dispatch(clearUs1881FormQuery(uuidv4()));
      dispatch(submitUsCensus1881Form(_values, isMasking));
    }
    if (currentPath === "/search/1871-united-kingdom-census/result") {
      dispatch(clearUs1871FormQuery(uuidv4()));
      dispatch(submitUsCensus1871Form(_values, isMasking));
    }
    if (currentPath === "/search/1891-united-kingdom-census/result") {
      dispatch(clearuk1891FormQuery(uuidv4()));
      dispatch(submitUkCensus1891Form(_values, isMasking));
    }
    if (currentPath === "/search/1861-united-kingdom-census/result") {
      dispatch(clearuk1861FormQuery(uuidv4()));
      dispatch(submitUkCensus1861Form(_values, isMasking));
    }
    if (currentPath === "/search/1851-united-kingdom-census/result") {
      dispatch(clearuk1851FormQuery(uuidv4()));
      dispatch(submitUkCensus1851Form(_values, isMasking));
    }
    if (currentPath === "/search/1841-united-kingdom-census/result") {
      dispatch(clearuk1841FormQuery(uuidv4()));
      dispatch(submitUkCensus1841Form(_values, isMasking));
    }
  };

  const immigrantsSwitchChange = (_values, isMasking) => {
    if (currentPath === "/search/russian-immigrants/result") {
      dispatch(clearRussianFormQuery(uuidv4()));
      dispatch(submitRussianForm(_values, isMasking));
    }
    if (currentPath === "/search/german-immigrants/result") {
      dispatch(clearGermanFormQuery(uuidv4()));
      dispatch(submitGermanForm(_values, isMasking));
    }
    if (currentPath === "/search/italian-immigrants/result") {
      dispatch(clearItaliansFormQuery(uuidv4()));
      dispatch(submitItaliansForm(_values, isMasking));
    }
    if (currentPath === "/search/irish-famine-passenger-records/result") {
      dispatch(clearIrishFormQuery(uuidv4()));
      dispatch(submitIrishForm(_values, isMasking));
    }
  };

  const marriagesSwitchChange = (_values, isMasking) => {
    if (currentPath === "/search/massachusetts-state-marriages/result") {
      dispatch(clearMMFormQuery(uuidv4()));
      dispatch(submitMMForm(_values, isMasking));
    }
    if (currentPath === "/search/texas-marriages/result") {
      dispatch(clearTexasMarriagesFormQuery(uuidv4()));
      dispatch(submitTexasMarriagesForm(_values, isMasking));
    }
    if (currentPath === "/search/washington-state-marriages/result") {
      dispatch(clearWMFormQuery(uuidv4()));
      dispatch(submitWMForm(_values, isMasking));
    }
    if (currentPath === "/search/new-york-city-marriages/result") {
      dispatch(clearNYCFormQuery(uuidv4()));
      dispatch(submitNYCForm(_values, isMasking));
    }
  };

  const handleSwitchChange = (isMasking) => {
    setSwitchStatus(isMasking);
    localStorage.setItem("switch_status", isMasking);
    const _values = decodeDataToURL(locationUse.search);
    if (currentPath === "/search/world-war-i-casualties/result") {
      dispatch(clearWwiFormQuery(uuidv4()));
      dispatch(submitWW1Form(_values, isMasking));
    }
    if (currentPath === "/search/world-war-ii-army-enlistments/result") {
      dispatch(clearWwiiFormQuery(uuidv4()));
      dispatch(submitWW2Form(_values, isMasking));
    }
    if (currentPath === "/search/us-civil-war-soldiers/result") {
      dispatch(clearCivilWarFormQuery(uuidv4()));
      dispatch(submitCivilWarForm(_values, isMasking));
    }

    censusSwitchChange(_values, isMasking);

    if (currentPath === "/search/massachusetts-state-deaths/result") {
      dispatch(clearMassachussetsFormQuery(uuidv4()));
      dispatch(submitMassachusettsForm(_values, isMasking));
    }
    if (currentPath === "/search/new-york-state-deaths/result") {
      dispatch(clearNYDeathsFormQuery(uuidv4()));
      dispatch(submitNYDeathsForm(_values, isMasking));
    }
    if (currentPath === "/search/ohio-state-deaths/result") {
      dispatch(clearOhioFormQuery(uuidv4()));
      dispatch(submitOhioForm(_values, isMasking));
    }
    if (currentPath === "/search/united-states-social-security-death-index/result") {
      dispatch(clearIUSSocialFormQuery(uuidv4()));
      dispatch(submitUSSocialSecurityForm(_values, isMasking));
    }

    immigrantsSwitchChange(_values, isMasking);
    marriagesSwitchChange(_values, isMasking);
  };

  const handleUniversalSwitchChange = (isMasking) => {
    setUniversalFormSwitchStatus(isMasking);
    localStorage.setItem("universal_form_switch_status", isMasking);
    let query = getQueryParam();
    if (query[0] === "?") {
      query = query.substring(1);
    }
    dispatch(clearUniversalFormQuery(uuidv4()));
    dispatch(submitUniversalSearchForm({ query }, isMasking));
  };

  const goToSettingsPage = () => {
    clearAppErrorState();
    return history.push(`/settings`);
  };

  // menu event for avatar popper
  const handleMenu = (e) => {
    switch (e.id) {
      case 1:
        goToSettingsPage();
        break;

      case 2:
        handleLogout();
        break;

      default:
        break;
    }
  };

  const showUniversalMaskToggle = () => {
    if (currentPath === "/search/all-historical-records/result") return true;
    else if (currentPath !== "/search/all-historical-records/result") {
      return false;
    }
  };

  const showSwitchMaskToggle = () => {
    let bool = false;
    if (routeNames.includes(currentPath)) {
      bool = true;
    }
    return bool;
  };

  const handleBack = () => {
    history.go(-1);
  };

  const onNavigationClick = () => {
    setIsOn(!isOn);
    setIsOnAccount(false);
    clearAppErrorState();
  };

  const Footer = () => (
    <div className="m-0 md:hidden">
      <div className="flex space-x-2 border-t border-gray-2 border-solid mb-nav">
        <FooterLinks onNavigation={() => onNavigationClick()} />
      </div>
      <div className="mt-1 mb-2 text-xs text-gray-5">2022 &copy; Storied.com</div>
    </div>
  );

  const MainHeader = () => (
    <div className="header-section">
      <div className="flex">
        <span className="sr-only">Workflow</span>
        <Link to="/" tabIndex={-1} className=" rounded-sm hidden md:block focus:ring-0 focus:outline-none" onClick={() => clearAppErrorState()}>
          <svg width="94" height="20" viewBox="0 0 94 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.4935 0H19.9968V20H10.4935V0ZM29.3251 14.9945C28.766 14.5399 28.3445 13.932 28.0619 13.1717L25.6912 14.2895C26.1233 15.5424 26.8386 16.5077 27.838 17.1862C28.8365 17.8646 29.9927 18.2038 31.3043 18.2038C32.0202 18.2038 32.6982 18.0954 33.3396 17.8794C33.981 17.6635 34.5397 17.3504 35.0174 16.9402C35.4938 16.53 35.8744 16.0305 36.1578 15.4417C36.4409 14.8526 36.5824 14.1859 36.5824 13.44C36.5824 12.3966 36.2806 11.5204 35.6767 10.8124C35.0731 10.1043 34.1596 9.51177 32.9373 9.03447L31.0139 8.29591C30.3728 8.0429 29.8878 7.76333 29.5598 7.45723C29.2324 7.15196 29.0682 6.76057 29.0682 6.28328C29.0682 5.74683 29.2694 5.31437 29.6718 4.98601C30.0746 4.65858 30.5888 4.49398 31.215 4.49398C31.886 4.49398 32.4451 4.69913 32.8924 5.10933C33.3396 5.51952 33.6823 6.02284 33.9213 6.61896L36.2245 5.45588C35.792 4.36773 35.1289 3.52121 34.2344 2.91767C33.3396 2.31371 32.3259 2.00447 31.1924 1.98921C30.5065 1.98921 29.8695 2.09372 29.2807 2.30274C28.6912 2.51134 28.1773 2.80961 27.7375 3.19723C27.2976 3.58475 26.9545 4.05462 26.7089 4.60591C26.4625 5.15761 26.3397 5.76899 26.3397 6.44004C26.3397 7.51346 26.6601 8.40042 27.3016 9.10105C27.9426 9.8022 28.8444 10.3613 30.0075 10.7784L31.8634 11.4495C33.1754 11.9268 33.8317 12.6501 33.8317 13.619C33.8317 14.2895 33.586 14.8008 33.094 15.1509C32.6019 15.5014 32.0202 15.6764 31.3496 15.6764C30.5587 15.6764 29.8847 15.4491 29.3251 14.9945ZM41.1369 6.97915V3.73634H38.565V6.97915H36.9321V9.17081H38.565V14.5609C38.565 15.7091 38.8743 16.6036 39.4931 17.2446C40.1118 17.8855 40.9723 18.206 42.0757 18.206C42.5233 18.206 42.9109 18.169 43.2388 18.0945C43.5667 18.0197 43.8349 17.9234 44.0439 17.8037V15.5001C43.8802 15.6194 43.6895 15.7052 43.4739 15.7571C43.2575 15.8097 43.045 15.8355 42.8364 15.8355C42.2547 15.8355 41.8262 15.6978 41.5505 15.4217C41.274 15.1461 41.1369 14.7028 41.1369 14.091V9.17081H44.0439V6.97915H41.1369ZM50.4413 9.08544C49.9789 9.08544 49.5504 9.17479 49.1555 9.35371C48.7605 9.53263 48.4177 9.77134 48.1269 10.0696C47.836 10.3679 47.6043 10.7258 47.4337 11.143C47.2616 11.5606 47.1763 12.0004 47.1763 12.4624C47.1763 12.9397 47.2616 13.3834 47.4337 13.7932C47.6043 14.2034 47.836 14.5574 48.1269 14.8553C48.4177 15.154 48.7605 15.3921 49.1555 15.5712C49.5504 15.7501 49.9789 15.8393 50.4413 15.8393C50.9038 15.8393 51.3323 15.7501 51.7272 15.5712C52.1222 15.3921 52.4654 15.154 52.7562 14.8553C53.0471 14.5574 53.2779 14.2034 53.4494 13.7932C53.621 13.3834 53.7068 12.9397 53.7068 12.4624C53.7068 12.0004 53.621 11.5606 53.4494 11.143C53.2779 10.7258 53.0471 10.3679 52.7562 10.0696C52.4654 9.77134 52.1222 9.53263 51.7272 9.35371C51.3323 9.17479 50.9038 9.08544 50.4413 9.08544ZM50.4413 6.71486C51.2766 6.71486 52.0516 6.86379 52.7675 7.16206C53.483 7.46085 54.1018 7.86666 54.6235 8.38094C55.1455 8.89513 55.5514 9.50306 55.8423 10.2037C56.1331 10.9048 56.2786 11.6573 56.2786 12.4624C56.2786 13.2676 56.1331 14.0205 55.8423 14.7211C55.5514 15.4222 55.1455 16.0297 54.6235 16.5439C54.1018 17.0587 53.483 17.465 52.7675 17.7628C52.0516 18.0611 51.2766 18.2104 50.4413 18.2104C49.6061 18.2104 48.8315 18.0611 48.1156 17.7627C47.4001 17.4649 46.7813 17.0587 46.2592 16.5439C45.7371 16.0297 45.3313 15.4222 45.0408 14.7211C44.7499 14.0205 44.6045 13.2676 44.6045 12.4624C44.6045 11.6573 44.75 10.9048 45.0408 10.2037C45.3313 9.50306 45.7371 8.89523 46.2592 8.38094C46.7813 7.86666 47.4001 7.46085 48.1156 7.16206C48.8315 6.86379 49.6061 6.71486 50.4413 6.71486ZM63.5231 9.37325C63.8509 9.37325 64.0743 9.40325 64.1937 9.46292V6.82365C64.1488 6.77923 63.9851 6.75697 63.7016 6.75697C62.9866 6.75697 62.3299 6.94686 61.7337 7.32696C61.1372 7.70717 60.7047 8.21843 60.4366 8.85897V6.98041H57.887V17.939H60.4591V13.1085C60.4591 11.9755 60.7309 11.0697 61.2753 10.3909C61.8195 9.71291 62.569 9.37325 63.5231 9.37325ZM65.4513 6.97648H68.0457V17.9355H65.4513V6.97648ZM68.3366 3.7785C68.3366 4.21086 68.1837 4.58364 67.8785 4.89633C67.5719 5.20986 67.1882 5.36662 66.7263 5.36662C66.2938 5.36662 65.9211 5.20986 65.608 4.89633C65.2949 4.58364 65.1385 4.21086 65.1385 3.7785C65.1385 3.33078 65.2949 2.9511 65.608 2.63758C65.921 2.32447 66.2938 2.16812 66.7263 2.16812C67.1882 2.16812 67.5719 2.32885 67.8785 2.64886C68.1837 2.96981 68.3366 3.34604 68.3366 3.7785ZM77.7948 10.36C77.9585 10.6736 78.063 11.0089 78.1079 11.3669H72.2484C72.2928 11.0538 72.3973 10.7441 72.5615 10.4384C72.7256 10.1332 72.9377 9.86497 73.199 9.63369C73.4594 9.40252 73.7581 9.21262 74.0935 9.06286C74.4287 8.91435 74.7901 8.83942 75.1782 8.83942C75.5657 8.83942 75.9311 8.90307 76.2742 9.02974C76.6168 9.15651 76.9152 9.33156 77.1685 9.55489C77.4221 9.77875 77.6306 10.047 77.7948 10.36ZM78.3539 17.4388C79.1887 16.9246 79.8375 16.2348 80.2995 15.37L78.175 14.3637C77.8623 14.8409 77.4965 15.2358 77.0793 15.5489C76.6618 15.862 76.0952 16.0188 75.3793 16.0188C74.977 16.0188 74.5889 15.9482 74.2163 15.8059C73.8435 15.6648 73.5151 15.4705 73.2325 15.2245C72.9486 14.9785 72.7182 14.6876 72.5393 14.3523C72.3603 14.017 72.2558 13.6478 72.2262 13.2454H80.6571C80.6723 12.9323 80.6796 12.6715 80.6796 12.4629C80.6796 11.6429 80.5456 10.8826 80.2769 10.1815C80.0087 9.48048 79.6319 8.87297 79.1482 8.35868C78.6631 7.84439 78.0892 7.44161 77.426 7.15118C76.7623 6.86033 76.0281 6.71486 75.2226 6.71486C74.4326 6.71486 73.6984 6.86033 73.0201 7.15118C72.3412 7.44161 71.7525 7.84439 71.2534 8.35868C70.753 8.87297 70.362 9.48048 70.079 10.1815C69.7955 10.8826 69.6539 11.6429 69.6539 12.4629C69.6539 13.3124 69.7955 14.088 70.079 14.7882C70.362 15.4898 70.753 16.0933 71.2534 16.6002C71.7525 17.107 72.3524 17.5024 73.0536 17.7854C73.7542 18.0685 74.5219 18.2104 75.3571 18.2104C76.5202 18.2104 77.5187 17.9531 78.3539 17.4388ZM84.1723 12.4601C84.1723 12.9373 84.2581 13.3806 84.4297 13.7908C84.6008 14.201 84.8325 14.5585 85.1233 14.8642C85.4139 15.1699 85.76 15.412 86.1628 15.591C86.5656 15.7699 86.9976 15.8597 87.46 15.8597C87.9221 15.8597 88.3544 15.7699 88.7572 15.591C89.1596 15.412 89.5066 15.1699 89.7971 14.8642C90.088 14.5585 90.3188 14.201 90.4908 13.7908C90.6615 13.3806 90.7477 12.9373 90.7477 12.4601C90.7477 11.9828 90.6615 11.5395 90.4908 11.1293C90.3188 10.7195 90.088 10.3615 89.7971 10.0559C89.5066 9.75017 89.1596 9.50812 88.7572 9.3291C88.3544 9.14976 87.9221 9.06041 87.46 9.06041C86.9976 9.06041 86.5656 9.14976 86.1628 9.3291C85.76 9.50812 85.4139 9.75017 85.1233 10.0559C84.8325 10.3615 84.6008 10.7195 84.4297 11.1293C84.2581 11.5395 84.1723 11.9828 84.1723 12.4601ZM90.6357 17.9394V16.3734C90.2334 16.9409 89.704 17.3877 89.0476 17.7155C88.3914 18.0435 87.6834 18.2076 86.9231 18.2076C86.1628 18.2076 85.4583 18.0622 84.8098 17.7712C84.1614 17.4808 83.5984 17.078 83.1216 16.5637C82.6438 16.0495 82.2676 15.442 81.992 14.741C81.7159 14.0403 81.5784 13.28 81.5784 12.4601C81.5784 11.6548 81.7159 10.902 81.992 10.2013C82.2676 9.5007 82.6438 8.89278 83.1216 8.37807C83.5984 7.86378 84.1614 7.45797 84.8098 7.1597C85.4583 6.86143 86.1628 6.71209 86.9231 6.71209C87.6834 6.71209 88.3914 6.8653 89.0476 7.17099C89.704 7.47668 90.2334 7.91258 90.6357 8.47913V2.28394H93.2076V17.9394H90.6357ZM4.40979 2.09442V17.9145H9.25116V2.09442H4.40979ZM0 4.26262H3.16922V15.7351H0V4.26262Z"
              fill="#F83D3D"
            />
          </svg>{" "}
        </Link>
        <Link to="/" onClick={() => clearAppErrorState()} className="md:hidden">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M25.9958 0H13.6415V26H25.9958V0ZM5.73273 2.72275V23.2888H12.0265V2.72275H5.73273ZM0 5.5414H4.11999V20.4556H0V5.5414Z" fill="#F83D3D" />
          </svg>
        </Link>
      </div>
      <div className="hamburger-menu">
        <button
          type="button"
          onClick={() => {
            setIsMobile(true);
            setIsOn(!isOn);
          }}
          className="bg-white rounded-md p-1 inline-flex items-center justify-center "
        >
          <span className="sr-only">Open menu</span>
          <Icon type={isOn ? "delete" : "hamburger"} color="default" size="medium" />
        </button>
      </div>
      <nav className={isMobile && isOn ? "main-nav-mobile" : "main-nav"}>
        <NavLink
          onClick={() => {
            onNavigationClick();
          }}
          to={`/${getQueryParam()}`}
          isActive={checkActive}
          className="nav-link"
          activeClassName="active"
        >
          <Translator tkey="header.home"></Translator>
        </NavLink>
        <NavLink
          onClick={() => {
            onNavigationClick();
          }}
          to={`/stories`}
          className="nav-link"
          activeClassName="active"
        >
          <Translator tkey="header.stories"></Translator>
        </NavLink>

        {!isMobile ? (
          <NavLink
            onClick={() => {
              onNavigationClick();
            }}
            to={`/family${getQueryParam()}`}
            className="nav-link"
            activeClassName="active"
          >
            {" "}
            <Translator tkey="header.people"></Translator>
          </NavLink>
        ) : (
          <>
            <NavLink to="#" className="nav-link">
              <div className="flex justify-between" onClick={() => setIspeopleTab(!IspeopleTab)}>
                <Translator tkey="header.people"></Translator>
                <div className="mt-1">
                  <Icon type={getArrowIcon(IspeopleTab)} color="default" size="small" />
                </div>
              </div>
            </NavLink>
            <div className={dropdownClass(IspeopleTab, true)}>{getMobileTrees(homepage, setIsOn, setIspeopleTab, dispatch, userProfileAccount, clearAppErrorState)}</div>
          </>
        )}
        <NavLink
          onClick={() => {
            onNavigationClick();
          }}
          to={`/explore${getQueryParam()}`}
          className="nav-link"
          activeClassName="active"
        >
          <Translator tkey="header.explore"></Translator>
        </NavLink>
        <NavLink
          onClick={() => {
            onNavigationClick();
          }}
          to={`/search${getQueryParam()}`}
          className="nav-link"
          activeClassName="active"
        >
          <Translator tkey="header.search"></Translator>
        </NavLink>
        <div className="my-account">
          <NavLink to="#" className="nav-link">
            <div className="flex justify-between" onClick={() => setIsOnAccount(!isOnAccount)}>
              <Translator tkey="header.myAccount"></Translator>
              <div className="mt-1">
                <Icon type={getArrowIcon(isOnAccount)} color="default" size="small" />
              </div>
            </div>
          </NavLink>
        </div>
        <div className={dropdownClass(isOnAccount)}>
          <NavLink
            onClick={() => {
              onNavigationClick();
            }}
            to="/settings"
            className="ml-0 active:bg-gray-1 active:text-gray-7"
          >
            Settings
          </NavLink>
          <NavLink onClick={() => handleLogout()} to="/" className="ml-0 active:bg-gray-1 active:text-gray-7">
            <Translator tkey="header.logout"></Translator>
          </NavLink>
        </div>
        {showFooter && <Footer />}
      </nav>
      <div className="flex items-center md:min-w-30 justify-end">
        <NavLink to={`/clues`} onClick={() => clearAppErrorState()} className={`nav-link clues-link ${isOn && isMobile && "invisible"}`}>
          {locationUse.pathname === "/clues" ? (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z" fill="#EFEFF0" />
              <path
                d="M14.9827 16.408C14.8622 16.6079 14.7034 16.7822 14.5156 16.9208C14.3277 17.0594 14.1144 17.1596 13.8878 17.2157C13.6612 17.2719 13.4257 17.2829 13.1949 17.248C12.964 17.2132 12.7423 17.1332 12.5424 17.0127C12.3424 16.8921 12.1682 16.7334 12.0296 16.5455C11.891 16.3577 11.7908 16.1443 11.7346 15.9177C11.6785 15.6911 11.6675 15.4557 11.7024 15.2248C11.7372 14.994 11.8172 14.7723 11.9377 14.5724L12.1214 14.2681C12.1695 14.188 12.2328 14.1181 12.308 14.0625C12.3831 14.007 12.4684 13.9668 12.5591 13.9444C12.6498 13.9219 12.744 13.9176 12.8364 13.9317C12.9288 13.9457 13.0174 13.9779 13.0973 14.0264L14.9247 15.1279C15.0049 15.1759 15.0747 15.2393 15.1303 15.3144C15.1858 15.3895 15.226 15.4749 15.2485 15.5656C15.2709 15.6563 15.2752 15.7505 15.2612 15.8429C15.2471 15.9352 15.2149 16.0239 15.1664 16.1038L14.9827 16.408Z"
                fill="#FC4040"
              />
              <path d="M17.8927 8.61669C17.3884 8.36958 16.809 8.32332 16.2719 8.48728C15.7348 8.65124 15.28 9.01318 14.9997 9.49981L13.5917 11.8307C13.4943 11.9922 13.465 12.1858 13.5103 12.3688C13.5555 12.5519 13.6716 12.7095 13.8331 12.807L15.6601 13.9082C15.74 13.9567 15.8287 13.989 15.921 14.0031C16.0134 14.0172 16.1077 14.013 16.1984 13.9905C16.2892 13.9681 16.3746 13.9279 16.4497 13.8724C16.5249 13.8168 16.5883 13.7469 16.6363 13.6668L16.6725 13.6089C16.8888 13.2513 17.2057 12.9655 17.5836 12.7871C17.9621 12.6092 18.2794 12.3229 18.4952 11.9646L18.7153 11.6002C18.8648 11.3522 18.9622 11.0764 19.0016 10.7896C19.0411 10.5027 19.0218 10.2109 18.9448 9.93175C18.8679 9.65263 18.7349 9.39209 18.554 9.16601C18.3731 8.93992 18.1481 8.75302 17.8927 8.61669Z" fill="#FC4040" />
              <path d="M13.4998 20.6461C13.1557 20.9529 12.9442 21.3814 12.9099 21.8412C12.8757 22.301 13.0214 22.7561 13.3163 23.1105C13.6113 23.4649 14.0323 23.6909 14.4907 23.7408C14.9491 23.7907 15.4089 23.6605 15.7731 23.3778L16.0464 23.15C16.1912 23.0293 16.2822 22.856 16.2994 22.6683C16.3166 22.4806 16.2587 22.2937 16.1383 22.1486L14.7731 20.5095C14.7135 20.4375 14.6402 20.3779 14.5576 20.3343C14.4749 20.2907 14.3844 20.2638 14.2913 20.2553C14.1982 20.2468 14.1043 20.2568 14.0151 20.2847C13.9259 20.3127 13.843 20.3579 13.7714 20.418L13.4998 20.6461Z" fill="#FC4040" />
              <path
                d="M20.7657 16.5977C21.0851 17.0591 21.2175 17.6245 21.1361 18.1798C21.0546 18.735 20.7654 19.2387 20.3269 19.5889L18.2334 21.3316C18.1618 21.3916 18.0791 21.4367 17.99 21.4646C17.9008 21.4924 17.8071 21.5024 17.7141 21.4939C17.6212 21.4854 17.5308 21.4587 17.4482 21.4152C17.3656 21.3717 17.2924 21.3123 17.2328 21.2404L15.8676 19.6013C15.8075 19.5296 15.7622 19.4468 15.7343 19.3576C15.7064 19.2684 15.6964 19.1745 15.7049 19.0814C15.7134 18.9883 15.7403 18.8978 15.7839 18.8151C15.8275 18.7324 15.8871 18.6592 15.9591 18.5996L16.0129 18.5547C16.3339 18.2872 16.5686 17.9308 16.6874 17.5302C16.8063 17.1294 17.0411 16.7728 17.3623 16.5053L17.6894 16.2331C17.9121 16.0475 18.1703 15.9092 18.4483 15.8268C18.7262 15.7443 19.0181 15.7194 19.306 15.7535C19.5939 15.7876 19.8718 15.8801 20.1228 16.0252C20.3738 16.1704 20.5925 16.3651 20.7657 16.5977Z"
                fill="#FC4040"
              />
            </svg>
          ) : (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z" fill="#EFEFF0" />
              <path
                d="M14.9827 16.408C14.8622 16.6079 14.7034 16.7822 14.5156 16.9208C14.3277 17.0594 14.1144 17.1596 13.8878 17.2157C13.6612 17.2719 13.4257 17.2829 13.1949 17.248C12.964 17.2132 12.7423 17.1332 12.5424 17.0127C12.3424 16.8921 12.1682 16.7334 12.0296 16.5455C11.891 16.3577 11.7908 16.1443 11.7346 15.9177C11.6785 15.6911 11.6675 15.4557 11.7024 15.2248C11.7372 14.994 11.8172 14.7723 11.9377 14.5724L12.1214 14.2681C12.1695 14.188 12.2328 14.1181 12.308 14.0625C12.3831 14.007 12.4684 13.9668 12.5591 13.9444C12.6498 13.9219 12.744 13.9176 12.8364 13.9317C12.9288 13.9457 13.0174 13.9779 13.0973 14.0264L14.9247 15.1279C15.0049 15.1759 15.0747 15.2393 15.1303 15.3144C15.1858 15.3895 15.226 15.4749 15.2485 15.5656C15.2709 15.6563 15.2752 15.7505 15.2612 15.8429C15.2471 15.9352 15.2149 16.0239 15.1664 16.1038L14.9827 16.408Z"
                fill="#212121"
              />
              <path d="M17.8927 8.61669C17.3884 8.36958 16.809 8.32332 16.2719 8.48728C15.7348 8.65124 15.28 9.01318 14.9997 9.49981L13.5917 11.8307C13.4943 11.9922 13.465 12.1858 13.5103 12.3688C13.5555 12.5519 13.6716 12.7095 13.8331 12.807L15.6601 13.9082C15.74 13.9567 15.8287 13.989 15.921 14.0031C16.0134 14.0172 16.1077 14.013 16.1984 13.9905C16.2892 13.9681 16.3746 13.9279 16.4497 13.8724C16.5249 13.8168 16.5883 13.7469 16.6363 13.6668L16.6725 13.6089C16.8888 13.2513 17.2057 12.9655 17.5836 12.7871C17.9621 12.6092 18.2794 12.3229 18.4952 11.9646L18.7153 11.6002C18.8648 11.3522 18.9622 11.0764 19.0016 10.7896C19.0411 10.5027 19.0218 10.2109 18.9448 9.93175C18.8679 9.65263 18.7349 9.39209 18.554 9.16601C18.3731 8.93992 18.1481 8.75302 17.8927 8.61669Z" fill="#212121" />
              <path d="M13.4998 20.6461C13.1557 20.9529 12.9442 21.3814 12.9099 21.8412C12.8757 22.301 13.0214 22.7561 13.3163 23.1105C13.6113 23.4649 14.0323 23.6909 14.4907 23.7408C14.9491 23.7907 15.4089 23.6605 15.7731 23.3778L16.0464 23.15C16.1912 23.0293 16.2822 22.856 16.2994 22.6683C16.3166 22.4806 16.2587 22.2937 16.1383 22.1486L14.7731 20.5095C14.7135 20.4375 14.6402 20.3779 14.5576 20.3343C14.4749 20.2907 14.3844 20.2638 14.2913 20.2553C14.1982 20.2468 14.1043 20.2568 14.0151 20.2847C13.9259 20.3127 13.843 20.3579 13.7714 20.418L13.4998 20.6461Z" fill="#212121" />
              <path
                d="M20.7657 16.5977C21.0851 17.0591 21.2175 17.6245 21.1361 18.1798C21.0546 18.735 20.7654 19.2387 20.3269 19.5889L18.2334 21.3316C18.1618 21.3916 18.0791 21.4367 17.99 21.4646C17.9008 21.4924 17.8071 21.5024 17.7141 21.4939C17.6212 21.4854 17.5308 21.4587 17.4482 21.4152C17.3656 21.3717 17.2924 21.3123 17.2328 21.2404L15.8676 19.6013C15.8075 19.5296 15.7622 19.4468 15.7343 19.3576C15.7064 19.2684 15.6964 19.1745 15.7049 19.0814C15.7134 18.9883 15.7403 18.8978 15.7839 18.8151C15.8275 18.7324 15.8871 18.6592 15.9591 18.5996L16.0129 18.5547C16.3339 18.2872 16.5686 17.9308 16.6874 17.5302C16.8063 17.1294 17.0411 16.7728 17.3623 16.5053L17.6894 16.2331C17.9121 16.0475 18.1703 15.9092 18.4483 15.8268C18.7262 15.7443 19.0181 15.7194 19.306 15.7535C19.5939 15.7876 19.8718 15.8801 20.1228 16.0252C20.3738 16.1704 20.5925 16.3651 20.7657 16.5977Z"
                fill="#212121"
              />
            </svg>
          )}
        </NavLink>
        <NavLink to={`/notifications`} onClick={() => clearAppErrorState()} className={`nav-link notifications-link ${isOn && isMobile && "invisible"}`}>
          <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.66675 15.5C5.75143 15.7885 5.92726 16.0417 6.16792 16.2219C6.40858 16.4021 6.70112 16.4994 7.00175 16.4994C7.30238 16.4994 7.59492 16.4021 7.83558 16.2219C8.07624 16.0417 8.25207 15.7885 8.33675 15.5" stroke="#212122" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 3V1.5" stroke="#212122" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 3C8.32608 3 9.59785 3.52678 10.5355 4.46447C11.4732 5.40215 12 6.67392 12 8C12 12.6973 13 13.5 13 13.5H1C1 13.5 2 12.2227 2 8C2 6.67392 2.52678 5.40215 3.46447 4.46447C4.40215 3.52678 5.67392 3 7 3V3Z" stroke="#212122" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {props.notifCount > 0 && (
            <span className="ntf-count bg-redShades-4 absolute h-4 leading-3 -top-1 rounded-full flex items-center justify-center">
              <Typography size={10} weight="medium">
                <span className="text-white block">{props.notifCount}</span>
              </Typography>
            </span>
          )}
        </NavLink>
        <div className="absolute top-1.5 right-8 md:top-0 md:right-0 md:relative">
          {showMasking && showUniversalMaskToggle() && <Masking checked={universalFormSwitchStatus} onChange={handleUniversalSwitchChange} />}
          {showMasking && showSwitchMaskToggle() && <Masking checked={switchStatus} onChange={handleSwitchChange} />}
        </div>
        <div className="relative avatar-dropdown focus:outline-none focus:ring-2 focus:ring-inset cursor-pointer z-10">
          <ImagePopper type="avatar" avatarName={avatarName} imgSrc={getCustomImageUrl('q=100,w=32,h=32', imgSrc)} menu={accountMenu} handleMenu={handleMenu} showFooter={pathArr[0].toLowerCase() === familyRoute} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="shadow-md header bg-white z-500" style={{ zIndex: 100 }}>
      <div className="main-wrapper mx-auto max-w-full-header">
        {isHeaderDisable ? (
          <div className="py-3 w-full justify-center h-16 flex items-center text-center px-14 relative">
            <button className="absolute flex left-1 items-center" onClick={() => handleBack()}>
              <span className="mr-1.5">
                <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.43088 11.4308L1.66688 6.66634C1.63592 6.63542 1.61136 6.59871 1.5946 6.55829C1.57784 6.51787 1.56921 6.47454 1.56921 6.43079C1.56921 6.38703 1.57784 6.3437 1.5946 6.30329C1.61136 6.26287 1.63592 6.22615 1.66688 6.19523L6.43088 1.43079" stroke="#212122" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <Typography text="secondary" size={14} weight="medium">
                Back
              </Typography>
            </button>
            <h2 className="">
              <Typography text="secondary" size={14} weight="medium">
                {title}
              </Typography>
            </h2>
          </div>
        ) : (
          <MainHeader />
        )}
      </div>
    </div>
  );
};

Header.propTypes = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  sidebar: state.sidebar,
  homepage: state.homepage,
  notifCount: state?.notification?.notifCount,
});

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchtreesget: (userProfileAccount) => dispatch(getTreesList(userProfileAccount.id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
