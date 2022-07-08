import React, { useEffect } from "react";
import { Redirect, Route, useHistory, useLocation } from "react-router-dom";
import { useFeatureFlag } from './../services/featureFlag'
import Loader from "../components/Loader";
const ShareStoryRoute = ({ component: Component, ...rest }) => {
  const locationUse = useLocation();
  const history = useHistory();
  const { enabled: StoryShareFlag, flagLoading } = useFeatureFlag('StoryShare');

  useEffect(() => {
    if (locationUse.hash.search("#state") !== -1) {
      history.replace('/');
    }
  }, [locationUse.hash])
  if (flagLoading) {
    return <Loader />
  }
  return (
    <Route
      {...rest}
      render={(props) => {
        return (StoryShareFlag) ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/" }} />
        );
      }}
    />
  );
};

export default ShareStoryRoute;
