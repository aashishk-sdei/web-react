import { Typography } from "@material-ui/core";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMsal, UnauthenticatedTemplate } from "@azure/msal-react";
import { b2cPolicies } from "../../authConfig";
import { setUserFlow, setUploadTree, removeUploadTree, getVerifiedCookie, setSignUpUser } from "../../services";
import Button from "../../components/Button";
import { useFeatureFlag } from "./../../services/featureFlag";

import "./index.css";
import PaymentModal from "../Payment/PaymentsModal";

// Images
import logo from "../../assets/images/logo.svg";

import img1 from "../../assets/images/img-1.png";
import img2 from "../../assets/images/img-2.png";

import WaitList from "./WaitList.js";
import lo01 from "../../assets/images/lo-01.png";
import lo02 from "../../assets/images/lo-02.png";
import smLo02 from "../../assets/images/Family-Tree-320.png";
import lo03 from "../../assets/images/lo-03.png";
import smlo03 from "../../assets/images/sm-lo-03.png";
import xslo03 from "../../assets/images/xs-lo-03.png";
import xxslo03 from "../../assets/images/xxs-lo-03.png";
import moblo03 from "../../assets/images/mob-lo-003.png";
import BeyondtheTree from "../../assets/images/Beyond-the-Tree-320.png";
import lo04 from "../../assets/images/lo-04.png";
import familyStory from "../../assets/images/family-story.png";

import losl01 from "../../assets/images/lo-sl-01.png";
import losl02 from "../../assets/images/lo-sl-02.png";
import losl03 from "../../assets/images/lo-sl-03.png";
import losl04 from "../../assets/images/lo-sl-04.png";
import losl05 from "../../assets/images/lo-sl-05.png";
import losl06 from "../../assets/images/lo-sl-06.png";
import losl07 from "../../assets/images/lo-sl-07.png";
import losl08 from "../../assets/images/lo-sl-08.png";

import pathOne from "../../assets/images/path-one.svg";
import pathTwo from "../../assets/images/path-two.png";
import smpathTwo from "../../assets/images/sm-path-two.png";
import xspathTwo from "../../assets/images/xs-path-two.png";
import mobpathTwo from "../../assets/images/mob-path-two.png";
import smobpathTwo from "../../assets/images/smob-path-two.svg";

const LoggedOutHomepage = () => {
  const { enabled: accessValue } = useFeatureFlag("Paywall");
  const { enabled: accessValuewaitlist } = useFeatureFlag("WaitList");
  const { instance } = useMsal();
  const [openWaitList, setOpenWaitList] = useState(false);
  const [step, setStep] = useState(0);
  const [showPaymentModal, setPaymentModal] = useState(false);
  const [payuserdata, setpayuserdata] = useState(false);
  const setStepFunction = (data) => {
    if (data) {
      setStep(data);
    } else {
      setOpenWaitList(false);
      setStep(0);
    }
  };

  const handleVerifiedCookiedBasedModal = (fn, params = null) => {
    if (accessValuewaitlist) {
      let verifiedCookie = getVerifiedCookie();
      if (!verifiedCookie) {
        setOpenWaitList(true);
        setStepFunction(1);
      } else {
        handleLogin();
      }
    } else {
      fn(params);
    }
  };

  const handleSignup = (payUser = false) => {
    setUserFlow("signUp");
    if (accessValue && payUser) {
      setPaymentModal(true);
      setpayuserdata(payUser);
      removeUploadTree();
    } else {
      removeUploadTree();
      instance.loginRedirect({
        authority: payUser ? b2cPolicies.authorities.subscribe.authority : b2cPolicies.authorities.signUp.authority,
        clientId: process.env.REACT_APP_MSAL_ID,
        redirectUri: "/",
        postLogoutRedirectUri: "/",
        knownAuthorities: [],
      });
    }
  };

  const handleProceedclick = () => {
    let payUser = payuserdata;
    if (payUser) {
      setSignUpUser(true);
    }
    instance.loginRedirect({
      authority: payUser ? b2cPolicies.authorities.subscribe.authority : b2cPolicies.authorities.signUp.authority,
      clientId: process.env.REACT_APP_MSAL_ID,
      redirectUri: "/payment/early",
      postLogoutRedirectUri: "/",
      knownAuthorities: [],
    });
  };

  const handleUploadTree = (from) => {
    if (from) setUploadTree(true);
    setUserFlow("signUp");
    instance.loginRedirect({
      authority: b2cPolicies.authorities.signUp.authority,
      clientId: process.env.REACT_APP_MSAL_ID,
      redirectUri: "/",
      postLogoutRedirectUri: "/",
      knownAuthorities: [],
    });
  };

  const handleLogin = () => {
    setUserFlow("signInUp");
    removeUploadTree();
    instance.loginRedirect({
      authority: b2cPolicies.authorities.signUpSignInUp.authority,
      clientId: process.env.REACT_APP_MSAL_ID,
      redirectUri: "/",
      postLogoutRedirectUri: "/",
      knownAuthorities: [],
    });
  };
  return (
    <>
      <UnauthenticatedTemplate>
        <div className="shadow-md header bg-white z-500" style={{ zIndex: 100 }}>
          <div className="main-wrapper mx-auto max-w-full-header">
            <div className="header-section h-14">
              <div className="flex my-auto">
                <Link to="/" className="focus:outline-none ">
                  <img src={logo} alt="Storied" className="logo" />
                </Link>
              </div>
              <div className="flex ml-auto absolute right-3 top-3 md:top-0 md:relative">
                <div>
                  <Button
                    type="red"
                    title={accessValue ? "Subscribe" : "Sign Up"}
                    fontWeight="medium"
                    handleClick={() => {
                      accessValue ? handleSignup(accessValue) : handleVerifiedCookiedBasedModal(handleSignup);
                    }}
                  />
                </div>
                <div className="ml-1 md:ml-2.5">
                  <Button type="secondary" title="Sign in" fontWeight="medium" handleClick={() => handleVerifiedCookiedBasedModal(handleLogin)} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <main className="pt-14 md:pt-14 mx-auto w-full">
          <section className="section-wrapper gray-background lo-section-one">
            <div className="lo-container">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-12 lg:col-span-5 xl:col-span-4">
                  <figure className="mb-8">
                    <svg width="196" height="42" viewBox="0 0 196 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M58.9301 27.6604C59.5236 29.2571 60.4087 30.5337 61.5828 31.4884C62.7579 32.4431 64.1734 32.9204 65.8342 32.9204C67.2425 32.9204 68.464 32.5528 69.4975 31.8167C70.5308 31.0815 71.0466 30.0079 71.0466 28.5997C71.0466 26.565 69.6685 25.0461 66.9133 24.0438L63.0157 22.6346C60.5733 21.7587 58.6795 20.5845 57.3335 19.1121C55.9864 17.6408 55.3135 15.7782 55.3135 13.524C55.3135 12.1148 55.5713 10.8309 56.0889 9.6723C56.6046 8.5146 57.3251 7.52788 58.2489 6.71409C59.1724 5.90008 60.2515 5.27371 61.4895 4.83565C62.726 4.39672 64.0637 4.17725 65.5041 4.17725C67.8845 4.20929 70.0133 4.85869 71.8924 6.127C73.7708 7.39444 75.1634 9.17214 76.0715 11.4573L71.2348 13.8997C70.7329 12.6479 70.0133 11.5909 69.0742 10.7295C68.1349 9.86807 66.9607 9.43725 65.5517 9.43725C64.2366 9.43725 63.1567 9.78292 62.3108 10.4705C61.4659 11.1601 61.0434 12.0683 61.0434 13.1948C61.0434 14.1971 61.3882 15.019 62.0758 15.6601C62.7645 16.3029 63.783 16.89 65.1293 17.4213L69.1683 18.9723C71.7352 19.9746 73.6536 21.219 74.9211 22.7059C76.1894 24.1928 76.8232 26.0328 76.8232 28.2238C76.8232 29.7904 76.5261 31.1904 75.9315 32.4275C75.3363 33.664 74.537 34.7128 73.5366 35.5743C72.5334 36.4357 71.3602 37.0932 70.0133 37.5466C68.6662 38.0003 67.2425 38.2278 65.7391 38.2278C62.9848 38.2278 60.5568 37.5157 58.46 36.0909C56.3612 34.6661 54.8589 32.6389 53.9517 30.0079L58.9301 27.6604Z"
                        fill="#FC4040"
                      />
                      <path d="M86.387 7.84619V14.6561H92.4917V19.2586H86.387V29.591C86.387 30.8757 86.6749 31.8067 87.2556 32.3855C87.8346 32.9653 88.7344 33.2543 89.956 33.2543C90.394 33.2543 90.8402 33.2003 91.2948 33.0897C91.7475 32.9809 92.148 32.8007 92.4917 32.5501V37.3876C92.0528 37.6391 91.4897 37.8412 90.801 37.9984C90.1125 38.1549 89.2985 38.2325 88.3585 38.2325C86.0414 38.2325 84.2342 37.5594 82.935 36.2134C81.6355 34.8674 80.9861 32.989 80.9861 30.5777V19.2586H77.5569V14.6561H80.9861V7.84619H86.387Z" fill="#FC4040" />
                      <path
                        d="M105.927 19.0795C104.956 19.0795 104.056 19.2672 103.226 19.6429C102.397 20.0186 101.677 20.5199 101.066 21.1463C100.456 21.7726 99.9691 22.5243 99.6107 23.4004C99.2494 24.2774 99.0702 25.201 99.0702 26.1712C99.0702 27.1736 99.2494 28.1052 99.6107 28.9657C99.9691 29.8272 100.456 30.5707 101.066 31.1962C101.677 31.8235 102.397 32.3236 103.226 32.6996C104.056 33.0753 104.956 33.2627 105.927 33.2627C106.898 33.2627 107.798 33.0753 108.627 32.6996C109.456 32.3236 110.177 31.8235 110.788 31.1962C111.399 30.5707 111.884 29.8272 112.244 28.9657C112.604 28.1052 112.784 27.1736 112.784 26.1712C112.784 25.201 112.604 24.2774 112.244 23.4004C111.884 22.5243 111.399 21.7726 110.788 21.1463C110.177 20.5199 109.456 20.0186 108.627 19.6429C107.798 19.2672 106.898 19.0795 105.927 19.0795ZM105.927 14.1013C107.681 14.1013 109.308 14.4141 110.812 15.0404C112.314 15.6679 113.614 16.5201 114.709 17.6001C115.806 18.6799 116.658 19.9565 117.269 21.4279C117.879 22.9003 118.185 24.4805 118.185 26.1712C118.185 27.862 117.879 29.4431 117.269 30.9144C116.658 32.3868 115.806 33.6624 114.709 34.7424C113.614 35.8233 112.314 36.6766 110.812 37.3021C109.308 37.9284 107.681 38.242 105.927 38.242C104.173 38.242 102.546 37.9284 101.043 37.3018C99.5403 36.6764 98.2408 35.8233 97.1443 34.7424C96.0478 33.6624 95.1956 32.3868 94.5857 30.9144C93.9747 29.4431 93.6694 27.862 93.6694 26.1712C93.6694 24.4805 93.9749 22.9003 94.5857 21.4279C95.1956 19.9565 96.0478 18.6801 97.1443 17.6001C98.2408 16.5201 99.5403 15.6679 101.043 15.0404C102.546 14.4141 104.173 14.1013 105.927 14.1013Z"
                        fill="#FC4040"
                      />
                      <path d="M134.807 19.8722C134.556 19.7469 134.087 19.6839 133.398 19.6839C131.395 19.6839 129.821 20.3972 128.678 21.8209C127.535 23.2465 126.964 25.1487 126.964 27.5279V37.672H121.562V14.6589H126.917V18.6039C127.48 17.2588 128.388 16.1851 129.641 15.3867C130.893 14.5885 132.272 14.1897 133.773 14.1897C134.369 14.1897 134.712 14.2364 134.807 14.3297V19.8722Z" fill="#FC4040" />
                      <path d="M137.448 14.6505H142.896V37.6645H137.448V14.6505ZM143.507 7.93478C143.507 8.84272 143.186 9.62556 142.545 10.2822C141.901 10.9406 141.095 11.2698 140.125 11.2698C139.217 11.2698 138.434 10.9406 137.777 10.2822C137.119 9.62556 136.791 8.84272 136.791 7.93478C136.791 6.99457 137.119 6.19724 137.777 5.53883C138.434 4.88131 139.217 4.55298 140.125 4.55298C141.095 4.55298 141.901 4.89052 142.545 5.56253C143.186 6.23652 143.507 7.02661 143.507 7.93478Z" fill="#FC4040" />
                      <path
                        d="M164.026 23.8705C163.932 23.1189 163.713 22.4146 163.369 21.7562C163.024 21.0989 162.586 20.5355 162.054 20.0654C161.522 19.5964 160.895 19.2288 160.175 18.9626C159.455 18.6966 158.688 18.5629 157.874 18.5629C157.059 18.5629 156.3 18.7203 155.596 19.0321C154.892 19.3466 154.264 19.7454 153.718 20.2309C153.169 20.7166 152.724 21.2799 152.379 21.9208C152.034 22.5627 151.815 23.213 151.721 23.8705H164.026ZM168.629 32.2771C167.658 34.0932 166.296 35.5417 164.543 36.6217C162.789 37.7017 160.692 38.242 158.25 38.242C156.496 38.242 154.884 37.944 153.412 37.3495C151.94 36.7551 150.68 35.9249 149.632 34.8605C148.581 33.796 147.76 32.5286 147.166 31.0553C146.57 29.5849 146.273 27.9562 146.273 26.1721C146.273 24.4502 146.57 22.8535 147.166 21.3813C147.76 19.9091 148.581 18.6334 149.632 17.5533C150.68 16.4733 151.916 15.6275 153.342 15.0176C154.766 14.4068 156.308 14.1013 157.967 14.1013C159.659 14.1013 161.201 14.4068 162.594 15.0176C163.987 15.6275 165.192 16.4733 166.211 17.5533C167.227 18.6334 168.018 19.9091 168.581 21.3813C169.145 22.8535 169.427 24.4502 169.427 26.1721C169.427 26.6102 169.412 27.158 169.379 27.8155H151.675C151.737 28.6604 151.956 29.4358 152.332 30.1399C152.708 30.8442 153.192 31.455 153.788 31.9716C154.381 32.4882 155.071 32.8962 155.854 33.1925C156.636 33.4914 157.451 33.6396 158.296 33.6396C159.8 33.6396 160.989 33.3103 161.866 32.6528C162.742 31.9953 163.51 31.1659 164.167 30.1638L168.629 32.2771Z"
                        fill="#FC4040"
                      />
                      <path
                        d="M176.762 26.1661C176.762 27.1682 176.942 28.0991 177.303 28.9606C177.662 29.822 178.149 30.5728 178.759 31.2147C179.369 31.8567 180.096 32.365 180.942 32.7409C181.788 33.1167 182.695 33.3052 183.666 33.3052C184.637 33.3052 185.545 33.1167 186.39 32.7409C187.235 32.365 187.964 31.8567 188.574 31.2147C189.185 30.5728 189.67 29.822 190.031 28.9606C190.389 28.0991 190.57 27.1682 190.57 26.1661C190.57 25.1638 190.389 24.2328 190.031 23.3713C189.67 22.5108 189.185 21.7591 188.574 21.1172C187.964 20.4752 187.235 19.9669 186.39 19.591C185.545 19.2144 184.637 19.0267 183.666 19.0267C182.695 19.0267 181.788 19.2144 180.942 19.591C180.096 19.9669 179.369 20.4752 178.759 21.1172C178.149 21.7591 177.662 22.5108 177.303 23.3713C176.942 24.2328 176.762 25.1638 176.762 26.1661ZM190.335 37.6726V34.3841C189.49 35.5758 188.379 36.514 187 37.2025C185.622 37.8912 184.135 38.2358 182.539 38.2358C180.942 38.2358 179.463 37.9305 178.101 37.3195C176.739 36.7096 175.557 35.8637 174.556 34.7837C173.552 33.7037 172.762 32.4282 172.184 30.956C171.604 29.4844 171.315 27.8878 171.315 26.1661C171.315 24.4751 171.604 22.894 172.184 21.4227C172.762 19.9514 173.552 18.6747 174.556 17.5938C175.557 16.5138 176.739 15.6616 178.101 15.0352C179.463 14.4089 180.942 14.0953 182.539 14.0953C184.135 14.0953 185.622 14.417 187 15.059C188.379 15.7009 189.49 16.6163 190.335 17.806V4.79614H195.736V37.6726H190.335Z"
                        fill="#FC4040"
                      />
                      <path d="M41.9929 0H22.0359V42H41.9929V0Z" fill="#FC4040" />
                      <path d="M9.26074 4.39844V37.6205H19.4276V4.39844H9.26074Z" fill="#FC4040" />
                      <path d="M6.65537 8.95142H0V33.0436H6.65537V8.95142Z" fill="#FC4040" />
                    </svg>
                  </figure>
                  <Typography variant="h1" className="heading-1 lyon-font-regular">
                    It's about stories,
                    <br className="hidden lg:block" /> not just records.
                  </Typography>
                  <Typography variant="h4" className="heading-4 ">
                    Experience a brand new way to find and share your family history.
                  </Typography>
                  <div className="mb-2">
                    <Button type="primary" size="large" title="Get Started" fontWeight="medium" handleClick={() => handleVerifiedCookiedBasedModal(handleSignup)} />
                  </div>
                </div>
                <div className="col-span-12 lg:col-span-7 xl:col-span-8">
                  <figure className="banner-box">
                    <img src={lo01} alt="Hero Storied" />
                  </figure>
                </div>
              </div>
              <div className="path-one">
                <img src={pathOne} alt="tree path" />
              </div>
            </div>
          </section>
          <section className="section-wrapper skyblue-background lo-section-two">
            <div className="lo-container">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-12 lg:col-span-6 order-last lg:order-first">
                  <figure className="img-treeview">
                    <img src={lo02} alt="Hero Storied tree" className="lg-tree" />
                    <img src={smLo02} alt="Hero Storied tree" className="mob-320-tree" />
                  </figure>
                </div>
                <div className="col-span-12 lg:col-span-6">
                  <div className="lg:pl-4 xl-pl-0">
                    <Typography variant="h2" className="heading-1 white lyon-font-regular">
                      Let us help you search.
                    </Typography>
                    <Typography variant="h4" className="heading-4 white">
                      Upload your tree or start building one today for free. Storied will instantly begin showing you clues about your family and you can start capturing and sharing stories right away.
                    </Typography>
                    <div className="mb-2">
                      <Button type="default" size="large" title="Upload Your Tree" handleClick={() => handleVerifiedCookiedBasedModal(handleUploadTree, "upload")} fontWeight="medium" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="path-two">
                <img src={pathTwo} alt="tree path" className="lgpath-two" />
                <img src={smpathTwo} alt="tree path" className="smpath-two" />
                <img src={xspathTwo} alt="tree path" className="xspath-two" />
                <img src={mobpathTwo} alt="tree path" className="mobpath-two" />
                <img src={smobpathTwo} alt="tree path" className="smobpath-two" />
              </div>
            </div>
          </section>

          <section className="section-wrapper gray-background lo-section-three">
            <div className="lo-container">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-12 lg:col-span-6">
                  <figure className="beyond-tree">
                    <img src={lo03} alt="Hero Storied tree" className="lo3" />
                    <img src={smlo03} alt="Hero Storied tree" className="smlo3" />
                    <img src={xslo03} alt="Hero Storied tree" className="xssmlo3" />
                    <img src={xxslo03} alt="Hero Storied tree" className="xxssmlo3" />
                    <img src={moblo03} alt="Hero Storied tree" className="moblo03" />
                    <img src={BeyondtheTree} alt="Hero Storied tree" className="BeyondtheTree" />
                  </figure>
                </div>
                <div className="col-span-12 lg:col-span-6">
                  <Typography variant="h2" className="heading-1  lyon-font-regular">
                    Go beyond the tree.
                  </Typography>
                  <Typography variant="h4" className="heading-4 ">
                    Some of the most meaningful relationships in your life are people not found in a family tree. Storied makes it easy to connect people beyond family relationships.
                  </Typography>
                  <div className="mb-2">
                    <Button type="primary" size="large" title="Start Your Story" handleClick={() => handleVerifiedCookiedBasedModal(handleSignup)} fontWeight="medium" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section-wrapper lo-section-four">
            <div className="lo-container">
              <div className="grid grid-cols-1">
                <div className="mb-10">
                  <Typography variant="h2" className="heading-1 lyon-font-regular lg:text-center">
                    The most affordable option for family history.
                  </Typography>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 items-start">
                <div className="col-span-2 lg:col-span-1">
                  <div className="mb-6">
                    <div className="blog-card">
                      <figure>
                        <img src={img1} alt="Search more than 1 billion records " />
                      </figure>
                      <h4 className="heading-6 typo-font-medium">Search our vast collection of records</h4>
                      <Typography variant="p" className="paragraph-1">
                        at a fraction of the cost of other websites.
                      </Typography>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <div className="mb-6">
                    <div className="blog-card ">
                      <figure>
                        <img src={img2} alt="Census, birth, death, marriage, military, and more." />
                      </figure>
                      <h4 className="heading-6 typo-font-medium">Access every type of essential record</h4>
                      <Typography variant="p" className="paragraph-1">
                        including census, birth, death, marriage, military, and more.
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section-wrapper gray-background lo-section-two">
            <div className="lo-container">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-12 lg:col-span-5">
                  <Typography variant="h1" className="heading-1  lyon-font-regular">
                    Follow your favorite topics.
                  </Typography>
                  <Typography variant="h4" className="heading-4 ">
                    Topic pages are hubs for stories about common events or figures. Browse stories or contribute your own.
                  </Typography>
                </div>
                <div className="col-span-12 lg:col-span-7">
                  <figure>
                    <img src={lo04} className="ml-auto w-full favorite-topics" alt="Follow your favorite topics" />
                  </figure>
                </div>
              </div>
            </div>
          </section>
          <section className="section-carousel">
            <div className="carousel-container">
              <div className="mb-10">
                <Typography variant="h2" className="heading-1 white lyon-font-regular text-center px-4 smd:px-0">
                  Get inspired by other stories.
                </Typography>
              </div>
              <div className="section-ticker">
                <div className="scroller-ticker">
                  <div className="logo-slider">
                    <div>
                      <div className="cu-link">
                        <img src={losl01} alt="carousel1" />
                      </div>
                      <div className="cu-link">
                        <img src={losl02} alt="carousel1" />
                      </div>
                      <div className="cu-link">
                        <img src={losl03} alt="carousel1" />
                      </div>
                      <div className="cu-link">
                        <img src={losl04} alt="carousel1" />
                      </div>
                      <div className="cu-link">
                        <img src={losl05} alt="carousel1" />
                      </div>
                      <div className="cu-link">
                        <img src={losl06} alt="carousel1" />
                      </div>
                      <div className="cu-link">
                        <img src={losl07} alt="carousel1" />
                      </div>
                      <div className="cu-link">
                        <img src={losl08} alt="carousel1" />
                      </div>
                    </div>
                    <div>
                      <div className="cu-link">
                        <img src={losl01} alt="carousel1" />
                      </div>
                      <div className="cu-link">
                        <img src={losl02} alt="carousel1" />
                      </div>
                      <div className="cu-link">
                        <img src={losl03} alt="carousel1" />
                      </div>
                      <div className="cu-link">
                        <img src={losl04} alt="carousel1" />
                      </div>
                      <div className="cu-link">
                        <img src={losl05} alt="carousel1" />
                      </div>
                      <div className="cu-link">
                        <img src={losl06} alt="carousel1" />
                      </div>
                      <div className="cu-link">
                        <img src={losl07} alt="carousel1" />
                      </div>
                      <div className="cu-link">
                        <img src={losl08} alt="carousel1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="section-wrapper dark-blue-background">
            <div className="lo-container">
              <div className="grid grid-cols-12 gap-1 items-center">
                <div className="col-span-12 lg:col-span-6 order-last lg:order-first">
                  <figure className="figure-family-box">
                    <img src={familyStory} className="ml-auto mr-10" alt="Start your family story." />
                  </figure>
                </div>
                <div className="col-span-12 lg:col-span-6">
                  <div className="start-family ">
                    <Typography variant="h1" className="heading-1 white lyon-font-regular px-4 smd:px-0">
                      Start your family story.
                    </Typography>
                    <Typography variant="h4" className="heading-4 white">
                      Begin by browsing, recording, and sharing your stories.
                    </Typography>
                    <div className="mb-2 flex justify-center">
                      <Button type="default" size="large" title="Get Started" handleClick={() => handleVerifiedCookiedBasedModal(handleSignup)} fontWeight="medium" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </UnauthenticatedTemplate>
      {openWaitList && <WaitList setStepFunction={setStepFunction} step={step} handleLogin={handleLogin} handleSignup={handleSignup} openWaitList={openWaitList} setOpenWaitList={setOpenWaitList} />}
      <PaymentModal setPaymentModal={setPaymentModal} signup={true} handleProceedclick={handleProceedclick} showPaymentModal={showPaymentModal} canClose={true} />
    </>
  );
};
export default LoggedOutHomepage;
