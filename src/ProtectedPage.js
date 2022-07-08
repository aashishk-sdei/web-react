import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

// Msal imports
import { MsalAuthenticationTemplate, useMsal, useAccount } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { loginRequest, protectedResources, b2cPolicies } from "./authConfig";
import { setAccessToken, setOwner, getUserFlow, removeCookies, getVerifiedCookie, setVerifiedCookie, getSignUpUser, removeSignUpUser } from './services';

// Components
import Loader from "./components/Loader";
import ProtectedRoutes from "./pages/ProtectedRoutes";

//Actions
import { getUserAccount, clearAppErrorState } from "./redux/actions/user";


const ProtectedPage = ({
  dispatchGetUserAccount,
  dispatchClearAppErrorState,
  appErrorState,
  isAccessed,
  isAccessToken,
  user: { appError } }) => {
  const { instance, accounts, inProgress } = useMsal();
  const authRequest = { ...loginRequest };
  const account = useAccount(accounts[0] || {});
  const [userFlow, setUserFlow] = useState(getUserFlow());
  const [isLoading, setLoading] = useState(userFlow && inProgress === "startup");
  const history = useHistory();

  const getLocalAccountId = (response, tokenClaims) => {
    if (response.account.localAccountId)
      return response.account.localAccountId;
    else
      return tokenClaims.oid;
  }

  useEffect(() => {
    async function getToken() {
      let accessToken, signInAccount, tokenClaims;
      if (userFlow && account && inProgress === "none") {
        const response = await getTokenFromInstance(instance, account);
        if (response) {
          accessToken = response.accessToken;
          signInAccount = response.account;
          tokenClaims = signInAccount.idTokenClaims;
          const id = getLocalAccountId(response, tokenClaims);
          setAccessToken(accessToken);
          setOwner(id);
          dispatchGetUserAccount(id);
          const signUpUserStatus = getSignUpUser();
          if (signUpUserStatus) {
            removeSignUpUser()
          }
          setLoading(false);
          let verifiedCookieDetails = getVerifiedCookie();
          if (verifiedCookieDetails === false) {
            setVerifiedCookie()
          }
        }
      } else if (!(isAccessed && isAccessToken) && !userFlow) {
        history.replace('/')
      } else if (!userFlow && !isAccessed) {
        handleLogout()
      }
    }
    getToken();
  }, [instance, account, inProgress, dispatchGetUserAccount, userFlow]);

  const getTokenFromInstance = (receiveInstance, receiveAccount) => {
    return new Promise((resolve) => {
      receiveInstance.acquireTokenSilent({
        scopes: protectedResources.apiStoried.scopes,
        account: receiveAccount
      }).then((response) => {
        resolve(response);
      })
    })
  }

  const handleLogout = () => {
    instance.logoutRedirect({ postLogoutRedirectUri: "/" })
    removeCookies();
  }

  const clearServerErrorState = () => {
    dispatchClearAppErrorState();
  }

  if(userFlow) {
    return (
      <MsalAuthenticationTemplate
        interactionType={InteractionType.Redirect}
        authenticationRequest={authRequest}
        loadingComponent={Loader}
      >
        {
          account && account.idTokenClaims && account.idTokenClaims["tfp"] !== b2cPolicies.names.forgotPassword && !isLoading 
          ?
            <ProtectedRoutes
              appErrorState={appErrorState}
              appError={appError}
              clearServerErrorState={clearServerErrorState} 
            /> 
          : 
            <Loader />
        }
      </MsalAuthenticationTemplate>
    )
  }else  {
    return <LogoutComponent userFlow={userFlow} handleLogout={handleLogout} />
  }
}

ProtectedPage.propTypes = {
  user: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchGetUserAccount: (id) => dispatch(getUserAccount(id)),
    dispatchClearAppErrorState: () => dispatch(clearAppErrorState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProtectedPage);

const LogoutComponent = ({ userFlow, handleLogout }) => {

  useEffect(() => {
    if(!userFlow) handleLogout()
  }, [userFlow, handleLogout]);

  return (
    <Loader />
  )
}