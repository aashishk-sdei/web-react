import React, { useEffect, useMemo, useState } from "react";
import { Redirect, Route, useHistory, useLocation } from "react-router-dom";
import { decodeJWTtoken, getAccessToken, getSubscription, getSubscriptionDetails } from '../services';
import { userPayWallDetailCancel, newSubscriberData } from './../utils'
import {
  EARLIER_PLAN_ID,
  STAR_PLUS_PLAN_ID
} from "./../utils/constant"
import {useFeatureFlag} from './../services/featureFlag'
import Loader from "../components/Loader";
import { getBillingInformation } from "../redux/actions/payments";
import { useDispatch } from "react-redux";
const PaymentRoute = ({ component: Component, ...rest }) => {
  const dispatch = useDispatch();
  const accessToken = getAccessToken();
  const locationUse = useLocation();
  const history = useHistory();
  const locationName = locationUse.pathname.split("/");
  const planName = locationName[2] || ""
  const {enabled:paywallFeatureFlag} =useFeatureFlag('Paywall');
  const expirypaywall = useMemo(() => {
    if(!paywallFeatureFlag) return ""
    if (getSubscription()) {
      let subdata = getSubscriptionDetails();
      if (subdata?.endDate) {
        return newSubscriberData(subdata);
      } else if(subdata?.subscriptionId) {
        return {...subdata, recurlyId:subdata.subscriptionId}
      }
    }
    else {
      return userPayWallDetailCancel(decodeJWTtoken());
    }
  }, [])
  const [isLoading, setLoading] = useState(!!expirypaywall);
  useEffect(() => {
    if (expirypaywall && expirypaywall.recurlyId) {
        dispatch(getBillingInformation(expirypaywall.recurlyId)).then((data)=>{
          setLoading(false)
          if(["Cancelled"].includes(data.subscriptionStatus)) {
            history.replace('/settings/3');
          }
        })
    }
}, [expirypaywall])
  useEffect(() => {
    if (locationUse.hash.search("#state") !== -1) {
      history.replace('/');
    }
  }, [locationUse.hash])
  if(isLoading) {
    return <Loader />
  }
  return (
    <Route
      {...rest}
      render={(props) => {
        return (!accessToken || (accessToken && ((!planName && expirypaywall !== EARLIER_PLAN_ID) || (planName === "bundle") || (planName === "early" && expirypaywall !== STAR_PLUS_PLAN_ID)))) ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/" }} />
        );
      }}
    />
  );
};

export default PaymentRoute;
