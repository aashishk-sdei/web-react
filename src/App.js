import React,{ useEffect } from "react";
import { MsalProvider } from "@azure/msal-react";
import { reactPlugin } from "./AppInsights";
import { AppInsightsErrorBoundary } from "@microsoft/applicationinsights-react-js";
import './App.css';

// Auth
import ErrorWrapper from "./ErrorWrapper";

// Redux setup
import { Provider } from "react-redux";
import store from "./redux/store";

const App = ({ instance }) => {

  useEffect(() => {
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    }
  }, [])

  const handlePopState = () => {
    const simplePopOver = document.getElementById("simple-popover")
    if(simplePopOver) simplePopOver.remove();
  }

  return (
    <MsalProvider instance={instance}>
      <Provider store={store}>
      <AppInsightsErrorBoundary onError={() => <ErrorWrapper appErrorState={true} />} appInsights={reactPlugin}>
        <ErrorWrapper />
        </AppInsightsErrorBoundary>
      </Provider>
    </MsalProvider>
  )
}

export default App;
