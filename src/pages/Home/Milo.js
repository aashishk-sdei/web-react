import { Field, Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import NumberFormat from "react-number-format";
import { useDispatch, useSelector } from "react-redux";
import Typography from "../../components/Typography";
import { isMiloModalOpen } from "../../redux/actions/homepage";
import "../../pages/Home/index.css";
import milosvg from "../../assets/images/milo.svg";
import { addMiloDetails, updateMiloDetails } from "../../redux/actions/milo";
import { phoneFormat } from "../../utils";

const Milo = ({ isCommunicationPage, setShowModal }) => {
  const dispatch = useDispatch();
  const { userFirstName, userLastName, optInStatus, mobileNumber, frequency } = useSelector((state) => state.user);
  const inputRef = useRef(null);
  const [editField, setEditField] = useState(false);
  const initialValues = {
    mobileNumber: mobileNumber ? phoneFormat(mobileNumber) : "",
    optInStatus: optInStatus ? optInStatus : false,
    frequency: frequency ? frequency : "Weekly",
  };
  const modalInitialValues = {
    mobileNumber: "",
    optInStatus: false,
    frequency: "Weekly",
  };
  const modalFormValidate = (values) => {
    let error = {
      invaild: "Invalid",
    };
    if (values.mobileNumber === "" || values.mobileNumber.length < 14 || !values.optInStatus) {
      error.invaild = "Invalid";
    } else {
      error = {};
    }
    return error;
  };
  const formValidate = (values) => {
    let error = {
      invaild: "Invalid",
    };
    if (values.mobileNumber === "" || values.mobileNumber.length < 14) {
      error.invaild = "Invalid";
    } else {
      error = {};
    }
    return error;
  };
  const handleChange = ({ target }, setFieldValue) => {
    const { name, value } = target;
    if (name === "optInStatus") {
      setFieldValue(name, target.checked);
    } else {
      setFieldValue(name, value);
    }
  };
  const getMobileNumber = (newNumber) => {
    let num = "";
    if (mobileNumber === newNumber) {
      num = `${newNumber.replace(/[()-\s]/g, "")}`;
    } else {
      num = `+1${newNumber.replace(/[()-\s]/g, "")}`;
    }
    return num;
  };
  const handleSubmit = (value, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    const payload = {
      ...value,
      mobileNumber: getMobileNumber(value.mobileNumber),
      displayName: `${userFirstName} ${userLastName}`,
    };
    const data = {
      ...value,
      displayName: `${userFirstName} ${userLastName}`,
      mobileNumber: `+1${value.mobileNumber.replace(/[()-\s]/g, "")}`,
    };
    if (isCommunicationPage && mobileNumber) {
      dispatch(updateMiloDetails({ ...payload, isNumberUpdated: true }, data));
    } else {
      dispatch(addMiloDetails(payload, setShowModal, resetForm));
    }
    setEditField(false);
    setSubmitting(false);
  };

  useEffect(() => {
    dispatch(isMiloModalOpen(true));
    return () => {
      dispatch(isMiloModalOpen(false));
    };
  }, []);

  useEffect(() => {
    if (!isCommunicationPage && inputRef.current) {
      inputRef?.current?.focus();
    }
  }, []);

  return (
    <div className="milo-modal">
      <div className="flex justify-center items-center mb-4 milo-modal-icon">
        <img src={milosvg} alt="" />
      </div>
      <Formik enableReinitialize={true} initialValues={isCommunicationPage ? initialValues : modalInitialValues} validate={isCommunicationPage ? formValidate : modalFormValidate} onSubmit={handleSubmit}>
        {({ setFieldValue, values, isValid, dirty, isSubmitting }) => (
          <Form>
            <div className="text-center mt-5">
              <Typography size={isCommunicationPage ? 16 : 20} weight="bold">
                <h4 className="text-gray-7 mb-5">Meet Milo, our Story Assistant</h4>
              </Typography>
              <Typography size={14}>
                <p className="text-gray-7 mb-5">
                  Milo helps you write stories you may not <br /> have thought of on your own.
                </p>
              </Typography>

              <Typography size={12}>
                <p className="text-gray-5">
                  By checking the SMS box, you agree to receive <br /> story prompt texts from Storied at:
                </p>
              </Typography>

              {!isCommunicationPage ? (
                <Field name="mobileNumber">
                  {() => (
                    <div className="relative">
                      <span className="milo-staticnumber text-base text-gray-7 font-semibold">+1</span>
                      <NumberFormat getInputRef={inputRef} name="mobileNumber" placeholder="(444) 444-4444" format="(###) ###-####" mask="" className="milo-input appearance-none w-full h-10 text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent" value={values.mobileNumber} onChange={(e) => handleChange(e, setFieldValue)} />
                    </div>
                  )}
                </Field>
              ) : (
                <div className="flex justify-center">
                  {editField && (
                    <>
                      {!isCommunicationPage && (
                        <Field name="mobileNumber">
                          {() => (
                            <div className="relative">
                              <span className="milo-staticnumber font-semibold text-base text-gray-7 ">+1</span>
                              <NumberFormat name="mobileNumber" getInputRef={inputRef} placeholder="(444) 444-4444" format="(###) ###-####" mask="" className="milo-input appearance-none w-full h-10 text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent" value={values.mobileNumber} onChange={(e) => handleChange(e, setFieldValue)} />
                            </div>
                          )}
                        </Field>
                      )}

                      {isCommunicationPage && (
                        <Field name="mobileNumber">
                          {() => (
                            <div className="relative">
                              <span className="milo-staticnumber1 font-semibold text-base text-gray-7 ">+1</span>
                              <NumberFormat disabled={!values.optInStatus} name="mobileNumber" getInputRef={inputRef} placeholder="(444) 444-4444" format="(###) ###-####" mask="" className="milo-input appearance-none w-full h-10 text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent" value={values.mobileNumber} onChange={(e) => handleChange(e, setFieldValue)} />
                            </div>
                          )}
                        </Field>
                      )}
                    </>
                  )}
                  {!editField && (
                    <>
                      {mobileNumber && <p className="text-base text-black my-5 font-semibold">+1 {phoneFormat(mobileNumber)}</p>}
                      {!mobileNumber && (
                        <Field name="mobileNumber">
                          {() => (
                            <div className="relative">
                              <span className="milo-staticnumber1 text-base text-gray-7 font-semibold ">+1</span>
                              <NumberFormat disabled={!values.optInStatus} name="mobileNumber" getInputRef={inputRef} placeholder="(444) 444-4444" format="(###) ###-####" mask="" className="milo-input appearance-none w-full h-10 text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent" value={values.mobileNumber} onChange={(e) => handleChange(e, setFieldValue)} />
                            </div>
                          )}
                        </Field>
                      )}
                    </>
                  )}
                  {mobileNumber && (
                    <div className={`mt-4 pt-1 ml-3 ${editField && "hidden"}`}>
                      <button type="button" onClick={() => setEditField(true)}>
                        <svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.44348 9.33182L6.13379 9.6616L6.46357 7.34942L12.4033 1.40969C12.5335 1.27969 12.688 1.17659 12.858 1.1063C13.028 1.03601 13.2102 0.999885 13.3941 1C13.5781 1.00012 13.7602 1.03647 13.9302 1.10697C14.1001 1.17748 14.2545 1.28077 14.3845 1.41093C14.5145 1.5411 14.6176 1.6956 14.6878 1.86561C14.7581 2.03561 14.7943 2.2178 14.7941 2.40177C14.794 2.58574 14.7577 2.76788 14.6872 2.9378C14.6167 3.10772 14.5134 3.26209 14.3832 3.39209L8.44348 9.33182Z" stroke="#747578" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M3.8 8.46948H1.93333C1.6858 8.46948 1.4484 8.56782 1.27337 8.74285C1.09833 8.91788 1 9.15528 1 9.40282V11.2695C1 11.517 1.09833 11.7544 1.27337 11.9294C1.4484 12.1045 1.6858 12.2028 1.93333 12.2028H14.0667C14.3142 12.2028 14.5516 12.1045 14.7266 11.9294C14.9017 11.7544 15 11.517 15 11.2695V9.40282C15 9.15528 14.9017 8.91788 14.7266 8.74285C14.5516 8.56782 14.3142 8.46948 14.0667 8.46948H12.2" stroke="#747578" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              )}
              <div className="flex justify-center mb-5">
                <Field type="checkbox" name="optInStatus" className="w-5 mt-1" checked={values.optInStatus} onChange={(e) => handleChange(e, setFieldValue)} /> <span className="text-gray-7 mx-1 text-sm">Opt in for Story Assistant SMS</span>
              </div>
              <div className="border-t border-solid border-gray-3">
                <Typography size={14}>
                  <h4 className="mt-4 text-gray-7">How often should we send you prompts?</h4>
                </Typography>
                <div className="relative w-full px-5 pt-3 mb-7">
                  <Field name="frequency" className={`block appearance-none h-10 w-full border border-gray-3  tw-sel-src bg-white px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent text-base`} id="dropdown" disabled={isCommunicationPage && !values.optInStatus} placeholder="Select" as="select">
                    <option className="text-sm" value="Daily">
                      Daily
                    </option>
                    <option className="text-sm" value="Weekly">
                      Weekly
                    </option>
                    <option className="text-sm" value="Monthly">
                      Monthly
                    </option>
                  </Field>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pt-3.5 pr-9">
                    <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.375 1.4055L6.735 6.765C6.76978 6.79983 6.81109 6.82747 6.85656 6.84632C6.90203 6.86517 6.95078 6.87488 7 6.87488C7.04922 6.87488 7.09797 6.86517 7.14344 6.84632C7.18891 6.82747 7.23022 6.79983 7.265 6.765L12.625 1.4055" stroke="#555658" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
              {!isCommunicationPage ? (
                <button type="submit" className="disabled:opacity-50 bg-blue-4 active:bg-blue-5 text-white font-semibold text-base px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-1 w-full mb-2" disabled={!dirty || isSubmitting || !isValid}>
                  Save
                </button>
              ) : (
                <button type="submit" className=" disabled:opacity-50 bg-blue-4 active:bg-blue-5 text-white font-semibold text-base px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-1 w-24 mb-3" disabled={!dirty || isSubmitting || !isValid}>
                  Save
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Milo;
