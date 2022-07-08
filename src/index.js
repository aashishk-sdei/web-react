import React from "react";
import ReactDOM from "react-dom";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfigForSignUp, msalConfigForLogin, msalConfigForSignUpSubscribe } from "./authConfig";
import { getUserFlow, getSignUpUser } from "./services"
import reportWebVitals from "./reportWebVitals";
import App from "./App";
import { I18nextProvider } from "react-i18next";
import 'tailwindcss/tailwind.css'
import i18n from "./i18n";


const getMsalInstance = () => {
  let userFlow = getUserFlow();
  let policy = msalConfigForLogin
  if( userFlow === "signUp" ){
    if(getSignUpUser()) {
      policy = msalConfigForSignUpSubscribe
    } else {
      policy = msalConfigForSignUp
    }
  }
  if(localStorage.getItem("storyPreviewId")) {
    policy.auth.redirectUri = '/verify-story-permission'
    policy.auth.navigateToLoginRequestUrl = false
  }
  return new PublicClientApplication(policy)
}

ReactDOM.render(  
    <I18nextProvider i18n={i18n}>
      <App instance={getMsalInstance()} />
    </I18nextProvider>
   , document.getElementById('root')
);

reportWebVitals();
