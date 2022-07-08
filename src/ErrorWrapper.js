import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//Components
import MainPage from "./MainPage";

const ErrorWrapper = ({ appErrorState }) => {
  return (
    <div className="w-full h-full">
      <Router>
        <Switch>
          <Route render={() =>  <MainPage appErrorState={appErrorState} />} />
        </Switch>
      </Router>
    </div>
  );
};

export default ErrorWrapper;