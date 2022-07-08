import { b2cPolicies } from "../../authConfig";
import { setUserFlow } from "../../services";

export const setStoryDetailsFunc = (id) => {
    if (id) {
        localStorage.setItem("loggedInViaStoryPreview", true);
        localStorage.setItem("storyPreviewId", id);
    }
}

export const handleStorySignup = (instance) => {
    setUserFlow('signUp');
    instance.loginRedirect({
        authority: b2cPolicies.authorities.signUp.authority,
        clientId: process.env.REACT_APP_MSAL_ID,
        redirectUri: "/verify-story-permission",
        postLogoutRedirectUri: "/",
        knownAuthorities: [],
    });
}

export const handleStoryLogin = (instance) => {
    setUserFlow('signInUp');
    instance.loginRedirect({
        authority: b2cPolicies.authorities.signUpSignInUp.authority,
        clientId: process.env.REACT_APP_MSAL_ID,
        redirectUri: "/verify-story-permission",
        postLogoutRedirectUri: "/",
        knownAuthorities: [],
    });
}