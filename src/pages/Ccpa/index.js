import React from 'react'
import { Formik, Form, Field } from "formik";
import './index.css';
import { useDispatch } from 'react-redux';
import { submitCCPA } from '../../redux/actions/ccpa';

const Ccpa = () => {

  const dispatch = useDispatch()

const initialValues = {
  fn : "",
  ln : "",
  email : "",
  country : "",
  state : "",
  providePersonal : "",
  requestPersonal : "",
  deletePersonal : ""
}

  const formValidate = (values) => {
    let error = {
      invalid: "Invalid",
    };
    if (values.fn === "" || values.ln === "" || values.email === "" || values.country === "" || values.state === "") {
      error.invalid = "Invalid";
    }
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      error.invalid = "Invalid";
    }
    else {
      error = {};
    }
    return error;
  };

  const handleChange = (e, setFieldValue, name, value) => {
    if (e.target.checked) {
      setFieldValue(name, value)
    }
    else {
      setFieldValue(name, "")
    }
  }

  return (
    <Formik initialValues={initialValues} validate={formValidate}
     onSubmit={(values , {setSubmitting , resetForm}) => {
       let requestType = []
       if(values.providePersonal){
        requestType.push(values.providePersonal)
       }
       if(values.requestPersonal){
        requestType.push(values.requestPersonal)
       }
       if(values.deletePersonal){
        requestType.push(values.deletePersonal)
       }

       const payload = {
         emailAddress: values.email,
         firstName: values.fn,
         lastName: values.ln,
         region: values.country,
         state: values.state,
         requestType: requestType.join("-")
       }

      console.log(payload)
      dispatch(submitCCPA(payload , resetForm))
      setSubmitting(false)

      }}
      >
      {({dirty , isSubmitting , isValid , setFieldValue}) => (
       <Form className='bg-gray-2 privacy'>
          <div>
          <div className="pt-18 md:pt-22.5 all-stories-page-wrap main-wrapper mx-auto w-full flex justify-center">
            <div className='bg-white rounded-lg p-7 mb-9 w-full lg:w-3/5'>
              <h1 className='font-bold text-xl text-black'>CCPA</h1>
              <p className='text-sm text-black mb-4'>If you are a California resident, the California Consumer Privacy Act (CCPA) permits you to request access and request to delete personal information and categories of personal information about you. Please provide the following information so that we may process your request. Please note that requesting deletion of your personal information does not ensure complete or comprehensive deletion as there may be circumstances in which the law does not require or permit us to delete the information.</p>
              <h3 className='font-bold text-sm text-black mt-4'>Request Type:</h3>
              <div>
                <Field type="checkbox" onChange = {(e) => handleChange(e , setFieldValue , "providePersonal" , "Provide me information about personal information collection, use, and sharing")} name="providePersonal" className="w-5 relative top-0.5" /> <span className="text-sm text-black">Provide me information about personal information collection, use, and sharing</span>
              </div>
              <div>
                <Field type="checkbox" onChange = {(e) => handleChange(e , setFieldValue , "requestPersonal" , "Request my personal information")} name="requestPersonal" className="w-5 relative top-0.5" /> <span className="text-sm text-black">Request my personal information</span>
              </div>
              <div>
                <Field type="checkbox" onChange = {(e) => handleChange(e , setFieldValue , "deletePersonal" , "Delete my personal information")} name="deletePersonal" className="w-5 relative top-0.5" /> <span className="text-sm text-black">Delete my personal information</span>
              </div>
              <div className='ccpa-form mt-5 mb-6'>
                <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5'>
                  <div>
                    <div>
                      <label class="block text-gray-6 text-sm mb-1" for="">First Name</label>
                      <div>
                        <Field name="fn" className='ccpa-input w-full text-base focus:ring-blue-4 border border-gray-4 rounded-lg h-10 px-4 text-gray-7' type="text" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label class="block text-gray-6 text-sm mb-1" for="">Last Name</label>
                    <div>
                      <Field name="ln" className='ccpa-input w-full text-base focus:ring-blue-4 border border-gray-4 rounded-lg h-10 px-4 text-gray-7' type="text" />
                    </div>
                  </div>
                </div>

                <div className='mt-5 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1'>
                  <div>
                    <div>
                      <label class="block text-gray-6 text-sm mb-1" for="">Email Address</label>
                      <div>
                        <Field name="email" className='ccpa-input w-full md:w-3/4 text-base focus:ring-blue-4 border border-gray-4 rounded-lg h-10 px-4 text-gray-7' type="text" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className='mt-5 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5'>
                  <div>
                    <div>
                      <label class="block text-gray-6 text-sm mb-1" for="">Country or Region</label>
                      <div>
                        <Field name="country" className='ccpa-input w-full text-base focus:ring-blue-4 border border-gray-4 rounded-lg h-10 px-4 text-gray-7' type="text" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label class="block text-gray-6 text-sm mb-1" for="">State</label>
                    <div>
                      <Field name="state" className='ccpa-input w-full text-base focus:ring-blue-4 border border-gray-4 rounded-lg h-10 px-4 text-gray-7' type="text" />
                    </div>
                  </div>
                </div>
                <div className='w-full flex justify-end mt-10'>
                  <button disabled={!dirty || isSubmitting || !isValid}   type="submit" className='disabled:opacity-50 bg-blue-4 active:bg-blue-5 text-white font-semibold text-base px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-1 justify-center w-full sm:w-auto order-last flex '>Submit</button>
                </div>
              </div>
            </div>

          </div>
        </div>
       </Form>
      )}

    </Formik>
  )
}

export default Ccpa