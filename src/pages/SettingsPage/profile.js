import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';
import { trimString } from "shared-logics";

//Actions
import { updateUser, profileChange, updateEmail } from "../../redux/actions/user";

//Components
import Input from "../../components/Input";
import Button from "../../components/Button";
import Uploader from "../PersonViewPage/uploader";
import Loader from "../../components/Loader";

//Utils
import { tr } from "../../components/utils";
import { getCustomImageUrl } from "../../utils";

//Menus
import { photoMenu } from "../PersonViewPage/menus";

let selectedElement;

const Profile = ({
  dispatchUpdateUser,
  dispatchProfileChange,
  onTargetClick,
  fileInputRef,
  setSelectedFile,
  selectedFile,
  anchorRef,
  openAccountPopper,
  handleToggle,
  handleSelect,
  setCropState,
  user: { userFirstName, userLastName, imgSrc, userEmail, userProfileAccount, userId, userEmailError, signInType },
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [userAccount, setUserAccount] = useState(null);
  const [emailValue, setEmailValue] = useState({ oldEmail: "", newEmail: "" });
  const [loading, setIsLoading] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isFirstNameValid, setIsFirstNameValid] = useState(true);
  const [isLastNameValid, setIsLastNameValid] = useState(true);

  useEffect(() =>{
    setEmailValue(
      {
        oldEmail: userEmailError ?  emailValue.oldEmail : emailValue.newEmail,
        newEmail: userEmailError ? emailValue.oldEmail :  emailValue.newEmail
      }
    )
  },[userEmailError]);

  useEffect(() => {
    document.activeElement.blur();
    const firstName = document.getElementById("firstName");
    if (firstName) firstName.focus();
  }, [edit])

  useEffect(() => {
    window.addEventListener("keydown", handleModalKeyDown, false);

    return () => {
      window.removeEventListener("keydown", handleModalKeyDown, false);
    }
  }, []);

  useEffect(() => {
    if (userProfileAccount && !userAccount && imgSrc !== null) {
      let accountProfile = {
        firstName: userFirstName,
        lastName: userLastName,
        email: userEmail,
      };
      setEmailValue({
        ...emailValue,
        newEmail: accountProfile.email,
        oldEmail: accountProfile.email
      })
      setUserAccount(accountProfile);
      setIsLoading(false);
    }
  }, [imgSrc, setUserAccount, userAccount, userEmail, userFirstName, userLastName, userProfileAccount]);

  const handleModalKeyDown = (e) => {
    selectedElement = e && e.path ? e.path[0].id : e.target.id;
    if (e.shiftKey && e.keyCode === 9) {
      switch (true) {
        case (selectedElement === "addAction"):
          e.preventDefault();
          const lastName = document.getElementById("lastName");
          if (lastName) lastName.focus();
          break;

        case (selectedElement === "firstName"):
          e.preventDefault();
          const addAction = document.getElementById("addAction");
          if (addAction) addAction.focus();
          break;

        default:
          break;
      }
    } else if (!e.shiftKey && e.keyCode === 9) {
      switch (true) {
        case (selectedElement === "lastName"):
          e.preventDefault();
          const addAction = document.getElementById("addAction");
          if (addAction) addAction.focus();
          break;

        case (selectedElement === "addAction"):
          e.preventDefault();
          const firstName = document.getElementById("firstName");
          if (firstName) firstName.focus();
          break;

        default:
          break;
      }
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserAccount({
      ...userAccount,
      [name]: value,
      isChanged: true,
    });
  };
  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmailValue({
      ...emailValue,
      newEmail: value,
      isChanged: true,
    });
  };

  const checkDisable = () => {
    if (userAccount) {
      const { firstName, lastName } = userAccount
      if(trimString(firstName) === userFirstName && trimString(lastName) === userLastName)
        return true
      else if(!isFirstNameValid || !isLastNameValid) return true
      else if (trimString(firstName) && trimString(lastName)) {
        return false
      }
    }
    return true
  }

  const saveProfileNames = async () => {
    setEdit(false);
    const userPayload = {
      userId,
      givenName: userAccount.firstName,
      surname: userAccount.lastName,
    };
    if (userAccount.isChanged) {
      await dispatchUpdateUser(userPayload);
    }
    await dispatchProfileChange();
  }

  const handleSaveEmail = async () => {
    setEditEmail(false);
    if (emailValue.isChanged) dispatch(updateEmail(userId, emailValue.newEmail));
  };

  const ValidateEmail = () => {
    if (editEmail) {
      let mailformat = /^(?!.*?\.\.)(?!\.)(?!.*\.$)[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (emailValue.newEmail.match(mailformat)) {
        setIsEmailValid(true)
      }
      else {

        setIsEmailValid(false)
      }
    }
  }

  const checkFirstNameLimit = (e) => {
    const { name, value } = e.target;

    if (name === "firstName" && value.length > 64) {
      setIsFirstNameValid(false);
    } else setIsFirstNameValid(true);
  };

  const checkLastNameLimit = (e) => {
    const { name, value } = e.target;

    if (name === "lastName" && value.length > 64) {
      setIsLastNameValid(false);
    } else setIsLastNameValid(true);
  };

  const handleCancel = (edittype) => {
    if (edittype === "name") {
      setEdit(false);
      setUserAccount({
        firstName: userFirstName,
        lastName: userLastName,
        email: userEmail,
      });
      setIsFirstNameValid(true);
      setIsLastNameValid(true);
    }
    else {
      setEditEmail(false);
      setEmailValue({
        ...emailValue,
        newEmail: emailValue.oldEmail
      });
      setIsEmailValid(true);
    }

  };

  const editEmailValue = () => {
    handleCancel("name")
    setEditEmail(true)
  }
  const editProfile = () => {
    handleCancel("email")
    setEdit(true)
  }

  const checkEmailSaveDisabled = (updatedEmailValue) => {
    if (!isEmailValid)
      return true
    else
      return (updatedEmailValue && trimString(updatedEmailValue) !== trimString(emailValue.oldEmail)) ? false : true
  }

  return (
    <>
      {!loading && (
        <>
          <h2 className="setting-heading">{tr(t, "settings.Profile.Profile")}</h2>
          <div className="setting-content ">
            <div className="setting-row">
              <div className="setting-col-4 lg:order-last">
                <div className="avtar-block">
                  <label className="user-label">{tr(t, "settings.Profile.Photo")}</label>
                  <div className="photo-placeholder">
                    {/* start */}
                    {/* <div>code here</div> */}
                    <div className="photo-circle">
                      <Uploader
                        onTargetClick={onTargetClick}
                        fileInputRef={fileInputRef}
                        setSelectedFile={setSelectedFile}
                        selectedFile={selectedFile}
                        imgSrc={getCustomImageUrl('q=100,w=150,h=150', imgSrc)}
                        anchorRef={anchorRef}
                        open={openAccountPopper}
                        showPopper={openAccountPopper}
                        handleToggle={handleToggle}
                        photoMenu={photoMenu}
                        handleSelect={handleSelect}
                        setCropState={setCropState}
                        isOwner={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="setting-col-8">
                {!edit && (
                  <div className="prop-view">
                    <div className="prop-primary">
                      <label className="prop-label">{tr(t, "settings.Profile.Name")}</label>
                      <div className="prop-link">
                        <Button handleClick={() => editProfile()} type="link-white" title={tr(t, "settings.Profile.Edit")} fontWeight="medium" />
                      </div>
                    </div>
                    <div className="prop-readonly">
                      <div className="line-clamp-2">
                        {`${userFirstName} ${userLastName}`}
                      </div>
                    </div>
                  </div>
                )}
                {edit && (
                  <div className="hidden-0">
                    <div className="prop-view prop-edit-mode">
                      <div className="prop-primary">
                        <label className="prop-label">{tr(t, "settings.Profile.Name")}</label>
                        <div className="prop-link">
                          <Button handleClick={() => handleCancel("name")} type="link-white" fontWeight="medium" title={tr(t, "settings.Profile.Cancel")} />
                        </div>
                      </div>
                      <div className="prop-readonly">
                        <div className="prop-row ">
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="w-full">
                              <Input
                                id="firstName"
                                handleBlur={checkFirstNameLimit}
                                label={tr(t, "f&mName")}
                                type="text"
                                name="firstName"
                                value={userAccount.firstName}
                                placeholder={""}
                                handleChange={handleChange}
                                autoFocus="autoFocus"
                                position={userAccount.firstName.length}
                                error={!isFirstNameValid}
                                errorMessage={tr(t, "settings.Profile.NameCharLimitErrorMsg")}
                              />
                            </div>
                            <div className="w-full">
                              <Input
                                id="lastName"
                                handleBlur={checkLastNameLimit}
                                label={tr(t, "LastName")}
                                type="text" 
                                name="lastName"
                                value={userAccount.lastName}
                                placeholder={""}
                                handleChange={handleChange}
                                error={!isLastNameValid}
                                errorMessage={tr(t, "settings.Profile.NameCharLimitErrorMsg")}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button
                              handleClick={saveProfileNames}
                              disabled={checkDisable()}
                              size="large"
                              title={tr(t, "settings.Profile.Save")}
                              fontWeight="medium"
                              id="addAction"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {!editEmail && (
                  <div className="prop-view">
                    <div className="prop-primary">
                      <label className="prop-label">{tr(t, "settings.Profile.Email")}</label>
                      <div className="prop-link">
                      {signInType === "emailaddress" &&
                        <Button handleClick={() => editEmailValue()} type="link-white" title={tr(t, "settings.Profile.Edit")} fontWeight="medium" />
                      } 
                      </div>
                    </div>
                    <div className="prop-readonly">
                      <div className="truncate">{userEmail}</div>
                    </div>
                  </div>
                )}
                {/* Edit email */}
                {editEmail && (
                  <div className="hidden-0">
                    <div className="prop-view prop-edit-mode ">
                      <div className="prop-primary">
                        <label className="prop-label">{tr(t, "settings.Profile.Email")}</label>

                        <div className="prop-link">
                          <Button handleClick={() => handleCancel("email")} type="link-white" title={tr(t, "settings.Profile.Cancel")} fontWeight="medium" />
                        </div>
                      </div>
                      <div className="prop-readonly">
                        <div className="prop-row ">
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="w-full">
                              <Input 
                                handleBlur={ValidateEmail}
                                label={tr(t, "settings.Profile.EditEmail")}
                                value={emailValue.newEmail}
                                handleChange={handleEmailChange}
                                autoFocus="autoFocus"
                                position={emailValue.newEmail.length}
                                hideTitleCase
                                error={!isEmailValid}
                                errorMessage={tr(t, "settings.Profile.InvalidEmailErrorMsg")} />
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button handleClick={handleSaveEmail} disabled={checkEmailSaveDisabled(emailValue.newEmail)} size="large" title={tr(t, "settings.Profile.Save")} fontWeight="medium" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Edit email end */}
              </div>
            </div>
          </div>
        </>)}
      <>  {loading && (<Loader />)}
      </>
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
})

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchUpdateUser: (payload) => dispatch(updateUser(payload)),
    dispatchProfileChange: () => dispatch(profileChange()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);