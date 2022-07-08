import * as API_URLS from "../constants/apiUrl";
import * as CONSTANTS from "../constants/actionTypes";
import { actionCreator, callApi } from "../utils";
import { addMessage } from "./toastr";
import { strFirstUpCase } from "../../utils";
import { paymentSuccessNewSubs, SetCookieSubs } from './../../services';
import { v4 as uuidv4 } from "uuid";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const createHeaderForStoried = () => {
  return {
    "wa-clientId": CLIENT_ID,
    "wa-requestId": uuidv4(),
  };
};
const createHeader = () => {
  return {
    "X-Api-Key": "C5BFF7F0-B4DF-475E-A331-F737424F013C",
  };
};
const subscriptionInfoFunc = (subData) => {
  submitSubscriptionInfo(subData).then(() => {
    getSubscriptionInfo().then(subDetail => {
      SetCookieSubs(JSON.stringify(subDetail));
    })
  })
}
export const upgradeCardDetails = (formData, recurlyId) => {
  return (dispatch, getState) => {
    let url = `${API_URLS.UPGRADECARDDETAILS}?planCode=${formData.planId}&recurlySubscriptionUuid=${recurlyId}&isDowngrade=false`,
      staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.SUBMITCARDDETAILS.REQUEST));
    callApi(getState, "GET", url, {}, false, staticHeader, true)
      .then((res) => {
        if (res?.data?.success) {
          dispatch(actionCreator(CONSTANTS.SUBMITCARDDETAILS.SUCCESS, res?.data?.success));
        } else {
          dispatch(actionCreator(CONSTANTS.SUBMITCARDDETAILS.FAILURE, res?.data?.errors?.[0]));
          dispatch(addMessage(strFirstUpCase(res?.data?.errors[0]), "error"));
        }
      })
      .catch((err) => {
        console.log(err)
        dispatch(actionCreator(CONSTANTS.SUBMITCARDDETAILS.FAILURE, err));
        dispatch(addMessage("Sorry, your payment is unsuccessfull. Please try again.", "error"));
      });
  };
};
export const resetStatus = () => {
  return (dispatch, _getState) => {
    dispatch(actionCreator(CONSTANTS.SUBMITCARDDETAILS.RESET));
  }
}
export const submitCardDetails = (formData, setordersummarypage) => {
  const requestData = { ...formData };
  return (dispatch, getState) => {
    let url = API_URLS.SUBMITCARDDETAILS,
      staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.SUBMITCARDDETAILS.REQUEST));
    callApi(getState, "POST", url, requestData, false, staticHeader, true)
      .then((res) => {
        if (res?.data?.flagProcess) {
          paymentSuccessNewSubs(true);
          let subData = {
            subscriptionId: res.data.recurlySubscriptionUuid,
            planId: formData?.UserInformation?.PlanId,
            startDate: new Date()
          };
          subscriptionInfoFunc(subData)
          dispatch(actionCreator(CONSTANTS.SUBMITCARDDETAILS.SUCCESS, requestData));
        } else {
          setordersummarypage(false);
          dispatch(actionCreator(CONSTANTS.SUBMITCARDDETAILS.FAILURE, res?.errorMessage));
          dispatch(addMessage(strFirstUpCase(res?.data?.errorMessage), "error"));
        }
      })
      .catch((err) => {
        setordersummarypage(false)
        dispatch(actionCreator(CONSTANTS.SUBMITCARDDETAILS.FAILURE, err));
        dispatch(addMessage("Sorry, your payment is unsuccessfull. Please try again.", "error"));
      });
  };
};
export const submitSubscriptionInfo = (data) => {
  let url = API_URLS.SubmitSubscriptionInfo,
    getState = () => {
      return {};
    },
    staticHeader = createHeaderForStoried();
  return callApi(getState, "POST", url, data, false, staticHeader)
    .then((res) => {
      return res.data
    }).catch((err) => {
      console.log(err);
    });
};
export const getSubscriptionInfo = () => {
  let url = API_URLS.GetSubscriptionInfo,
    getState = () => {
      return {};
    },
    staticHeader = createHeaderForStoried();
  return callApi(getState, "GET", url, {}, false, staticHeader)
    .then((res) => {
      return res.data
    }).catch((err) => {
      console.log(err);
    });
};
export const getTaxApiDetails = (taxDetailsformData, setformData, formData, setordersummarypage) => {
  return (dispatch, getState) => {
    let url = `${API_URLS.TAXAPIDETAILS}?amount=${taxDetailsformData.amount}&zipcode=${taxDetailsformData.zipcode}&country=${taxDetailsformData.country}`,
      staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.TAXAPIDETAILS.REQUEST));
    callApi(getState, "GET", url, {}, false, staticHeader, true)
      .then((res) => {
        if (res?.status === 200) {
          dispatch(actionCreator(CONSTANTS.TAXAPIDETAILS.SUCCESS, res?.data));
          setformData({ ...formData, ...taxDetailsformData })
          setordersummarypage(true)
        } else {
          dispatch(actionCreator(CONSTANTS.TAXAPIDETAILS.FAILURE, res?.data?.errors?.[0]));
          dispatch(addMessage(strFirstUpCase(res?.data?.errors[0]), "error"));
        }
      })
      .catch((err) => {
        console.log(err)
        dispatch(actionCreator(CONSTANTS.TAXAPIDETAILS.FAILURE, err));
        dispatch(addMessage("Sorry, getting tax api issue. Please try again.", "error"));
      });
  };
};

export const cancelPayment = (values, {setMemCancelModal, setMemDropModal, setSubmitting}) => {
  return (dispatch, getState) => {
    let url = `${API_URLS.cancelSubscription()}`,
      staticHeader = createHeader();
    return callApi(getState, "POST", url, values, false, staticHeader, true)
      .then((_res) => {
          setSubmitting(false);
          setMemCancelModal(false); 
          setMemDropModal(true);
        return null;
      })
      .catch((_err) => {
        setSubmitting(false);
        dispatch(addMessage("Something Wrong Happend", "error"));
      });
  };
};

export const getBillingInformation = (recurlyUuid) => {
  return (dispatch, getState) => {
    let url = `${API_URLS.GetBillingInformation(recurlyUuid)}`,
      staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.BILLINGDETAILS.REQUEST));

    return callApi(getState, "GET", url, {}, false, staticHeader, true)
      .then((res) => {
        if (res?.status === 200) {
          dispatch(actionCreator(CONSTANTS.BILLINGDETAILS.SUCCESS, res?.data));
          return res.data
        } else {
          dispatch(actionCreator(CONSTANTS.BILLINGDETAILS.FAILURE, null));
        }

        return null;
      })
      .catch((err) => {
        console.log(err)
        dispatch(actionCreator(CONSTANTS.BILLINGDETAILS.FAILURE, null));
        dispatch(addMessage("Card information is not found.", "error"));
      });
  };
};

export const getCalculateRefundAmount = (planID, startDate) => {
  return (dispatch, getState) => {
    let url = `${API_URLS.CalculateRefundAmount(planID, startDate)}`,
      staticHeader = createHeader();
    return callApi(getState, "GET", url, {}, false, staticHeader, true)
      .then((res) => {
        if (res?.status === 200) {
          return res.data
        }
        return null;
      })
      .catch((err) => {
        console.log(err)
        dispatch(addMessage("Card information is not found.", "error"));
      });
  };
};
const getrecurring  = (recurring) => {
  if( recurring ) {
    recurring = recurring.split('=');
    if(recurring.length === 2 && recurring[0] === "NewRecurlySubscriptionId") {
      recurring = recurring[1]
    } else {
      recurring = false
    }
  }
  return recurring
}
export const updateUpgradePlans = (formData, setordersummarypage) => {
  const requestData = { ...formData };
  return (dispatch, getState) => {
    let url = `${API_URLS.ChangeSubscription}`,
      staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.SUBMITCARDDETAILS.REQUEST));
    callApi(getState, "POST", url, requestData, false, staticHeader, true)
      .then((res) => {
        if (res?.data?.success) {
          let recurring = res.data.messages?.[0];
          recurring = getrecurring(recurring)
          if(recurring) {
            paymentSuccessNewSubs(true);
            let subData = {
              subscriptionId: recurring,
              planId: formData.NewPlanId,
              startDate: new Date()
            };
            subscriptionInfoFunc(subData)
          }
          dispatch(actionCreator(CONSTANTS.SUBMITCARDDETAILS.SUCCESS, requestData));
        } else {
          setordersummarypage(false)
          dispatch(actionCreator(CONSTANTS.SUBMITCARDDETAILS.FAILURE, res?.errorMessage));
          dispatch(addMessage(strFirstUpCase(res?.data?.errors?.[0] || "Sorry, your payment was unsuccessfull. Please try again."), "error"));
        }
      })
      .catch((err) => {
        setordersummarypage(false)
        dispatch(actionCreator(CONSTANTS.SUBMITCARDDETAILS.FAILURE, err));
        dispatch(addMessage("Sorry, your payment was unsuccessfull. Please try again.", "error"));
      });
  };
};

export const getCountriesWithAbbr = (loading = true) => {
  return (dispatch, getState) => {
    let url = API_URLS.COUNTRYWITHABBR,
      staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.LOCATION.COUNTY.REQUEST, loading));
    return callApi(getState, "GET", url, {}, false, staticHeader)
      .then((res) => {
        dispatch(actionCreator(CONSTANTS.LOCATION.COUNTY.SUCCESS, res.data));
        return res.data
      })
      .catch((err) => {
        dispatch(actionCreator(CONSTANTS.LOCATION.COUNTY.FAILURE, err));
      });
  }
}
export const UpdatePaymentCard = (formData, setSubmitting, callBack= false) => {
  const requestData = { ...formData };
  return (dispatch, getState) => {
    let url = API_URLS.UpdatePaymentCard(),
      staticHeader = createHeader();
    return callApi(getState, "POST", url, requestData, false, staticHeader, true)
      .then((res) => {
        setSubmitting(false)
        if(res.data.success) {
          callBack && callBack(formData, res.data)
          return res.data
        } else {
          const message = res.data.errorWithField?.[0] || "Sorry, your card is not added. Please try again"
          dispatch(addMessage(message, "error"));
          return false
        }
      })
      .catch((_err) => {
        dispatch(addMessage("Sorry, your card is not added. Please try again.", "error"));
        setSubmitting(false)
      });
  };
};