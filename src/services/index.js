import cookie from "react-cookies";
import jwt from 'jsonwebtoken';

export const setOwner = (ownerId) => {
    localStorage.setItem("ownerId", JSON.stringify(ownerId));
    localStorage.setItem("switch_status", true)
}

export const setTreePan = (value) => {
    localStorage.setItem("treePan", value)
}

export const getTreePan = () => {
    return localStorage.getItem("treePan") == "true" ? true : false
}

export const setUserName = (name) => {
    localStorage.setItem("userName", JSON.stringify(name));
}

export const setUserCheck = (check) => {
    cookie.save('checkUser', check, { path: '/' });
}

export const getUserCheck = () => {
    return cookie.load('checkUser') || null;
}

export const removeUploadTree = () => {
    cookie.remove('uploadTree', { path: '/' });
}

export const removeSignUpUser = () => {
    cookie.remove('signUpUser', { path: '/' });
}

export const removeCookies = () => {
    localStorage.clear();
    cookie.remove('checkUser', { path: '/' });
    // cookie.remove('accessCode', { path: '/' });
    cookie.remove('accessToken', { path: '/' });
    cookie.remove('recent-tree', { path: '/' });
    cookie.remove('userFlow', { path: '/' });
    cookie.remove('uploadTree', { path: '/' });
    cookie.remove('checkNewSubscriber', { path: '/' });
    cookie.remove('s_sub', { path: '/' });
    cookie.remove('signUpUser', { path: '/' });
}

export const setAccessCode = (accessCode) => {
    cookie.save('accessCode', accessCode, { path: '/', maxAge: 86400 });
}

export const getAccessCode = () => {
    return cookie.load('accessCode') || null;
}

export const setUserId = (id) => {
    localStorage.setItem("userId", JSON.stringify(id));
}

export const setAccessToken = (accessToken) => {
    cookie.save('accessToken', accessToken, { path: '/', maxAge: 86400 });
}

export const setUserFlow = (userFlow) => {
    cookie.save('userFlow', userFlow, { path: '/', maxAge: 86400 });
}

export const setUploadTree = (upload) => {
    cookie.save('uploadTree', upload, { path: '/' });
}

export const setSignUpUser = (upload) => {
    cookie.save('signUpUser', upload, { path: '/' });
}

export const getAccessToken = () => {
    return cookie.load('accessToken') || null;
}

export const getUploadTree = () => {
    return cookie.load('uploadTree') || null;
}

export const getSignUpUser = () => {
    return cookie.load('signUpUser') || null;
}

export const getUserFlow = () => {
    return cookie.load('userFlow') || null;
}

export const getOwner = () => {
    return JSON.parse(localStorage.getItem("ownerId")) || null;
}

export const getUserName = () => {
    return JSON.parse(localStorage.getItem("userName")) || null;
}

export const setCardTooltip = (value) => {
    localStorage.setItem("card-tooltip", value);
}

export const setNewTree = (value) => {
    localStorage.setItem("new-tree", value);
}

export const getNewTree = () => {
    return localStorage.getItem("new-tree")
}

// Recent Family Tree
export const setRecentTree = (recentTree) => {
    cookie.save('recent-tree', recentTree, { path: '/' });
}

export const getRecentTree = () => {
    return cookie.load('recent-tree') || null;
}

export const removeRecentTree = () => {
    cookie.remove('recent-tree', { path: '/' });
}

export const setVerifiedCookie = () => {
    let d = new Date();
    d.setTime(d.getTime() + (15 * 24 * 60 * 60 * 1000));
    cookie.save('verified-cookie', true, { path: '/', expires: d });
}

export const getVerifiedCookie = () => {
    return cookie.load('verified-cookie') === "true" ? true : false;
}

export const isUserOwner = ownerId => ownerId === getOwner() ? true : false;

export const decodeJWTtoken = () => {
    return jwt.decode(getAccessToken());
}
export const paymentSuccessNewSubs = (bool) => {
    cookie.save('checkNewSubscriber', bool, { path: '/', expires: new Date(new Date().getTime() + (60 * 60 * 24 * 1000) + (10 * 60 * 1000)) });
}
export const SetCookieSubs = (data) => {
    cookie.save('s_sub', data, { path: '/', expires: new Date(new Date().getTime() + (60 * 60 * 24 * 1000) + (10 * 60 * 1000)) });
}
export const getSubscription = () => {
    return cookie.load('checkNewSubscriber') || null;
}
export const getSubscriptionDetails = () => {
    return cookie.load('s_sub') || null;
}
export const setVisitorIDAccess = (data) => {
    cookie.save('visitor_id', data, { path: '/', expires: new Date(new Date().getTime() + (60 * 60 * 24 * 1000 * 10000) + (10 * 60 * 1000)) });
}
export const getVisitorIDCookie = () => {
    return cookie.load('visitor_id') || null;
}