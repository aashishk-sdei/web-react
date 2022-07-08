import React, { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { useMsal, useAccount } from "@azure/msal-react";
import { connect } from "react-redux";

// Components
import Loader from "../components/Loader";
import SnackbarComponent from "../components/Snackbar"
import ProtectedPage from "../ProtectedPage";
import ShareStoryRoute from "./ShareStoryRoute";

//Actions
import { clearAccess } from "../redux/actions/user";

//Services
import { getAccessCode, getAccessToken } from "../services";
import ShareStory from "./ShareStory";
const AccessPage = lazy(() => import('./AccessPage'));
const LoggedOutHomepage = lazy(() => import('./LoggedOutHomepage'));
const Terms = lazy(() => import(`./Terms`))
const Privacy = lazy(() => import(`./Privacy`))
const DPA = lazy(() => import(`./Dpa`))
const StoryPreview = lazy(() => import('./ShareStory/StoryPreview'));

const Main = ({
    user: { accessCodeInvalid, redirectToLogin },
    dispatchClearAccess,
    appErrorState,
}) => {
    const { accounts, inProgress } = useMsal();
    const account = useAccount(accounts[0] || {});
    const [isAccessed, setIsAccessed] = useState(getAccessCode());
    const [isAccessToken, setIsAccessToken] = useState(getAccessToken());

    useEffect(() => {
        if (redirectToLogin) {
            setIsAccessed(true);
            dispatchClearAccess();
        }
    }, [accessCodeInvalid, dispatchClearAccess, redirectToLogin])

    useEffect(() => {
        if (account && inProgress == "none") {
            setIsAccessToken(true)
        }
    }, [account, inProgress])
    
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen"><Loader /></div>}>
            <div className="application-wrapper">
                <Router>
                    {
                        process.env.REACT_APP_ENV.toLowerCase() === 'production' ?
                            <Switch>
                                {!isAccessToken && (<Route exact path="/" component={LoggedOutHomepage} />)}
                                {!isAccessToken && (<Route exact path="/terms" component={Terms} />)}
                                {!isAccessToken && (<Route exact path="/privacy" component={Privacy} />)}
                                {!isAccessToken && (<Route exact path="/dpa" component={DPA} />)}
                                {isAccessToken && (<Route exact path="/" component={ProtectedPage} />)}
                                <Route
                                    render={(props) =>
                                        isAccessToken ? <ProtectedPage {...props} appErrorState={appErrorState} /> : <Redirect to="/" />
                                    }
                                />
                            </Switch>
                            :
                            <Switch>
                                {!isAccessed && (<Route exact path="/" component={AccessPage} />)}
                                {isAccessed && !isAccessToken && (<Route exact path="/" component={LoggedOutHomepage} />)}
                                {isAccessed && !isAccessToken && (<Route exact path="/terms" component={Terms} />)}
                                {isAccessed && !isAccessToken && (<Route exact path="/privacy" component={Privacy} />)}
                                {isAccessed && !isAccessToken && (<Route exact path="/dpa" component={DPA} />)}
                                <ShareStoryRoute exact path="/invitation/:messageID" component={ShareStory} />
                                {!isAccessToken && <ShareStoryRoute exact path="/story-preview/:storyId" component={StoryPreview} />}
                                {isAccessed && isAccessToken && (<Route exact path="/" component={ProtectedPage} />)}
                                <Route
                                    render={(props) =>
                                        <ProtectedPage {...props} appErrorState={appErrorState} isAccessed={isAccessed} isAccessToken={isAccessToken} />
                                    }
                                />
                            </Switch>
                    }
                </Router>
            </div>
            <SnackbarComponent />
        </Suspense>
    );
}

const mapStateToProps = (state) => ({
    user: state.user
});

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchClearAccess: () => dispatch(clearAccess())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Main);
