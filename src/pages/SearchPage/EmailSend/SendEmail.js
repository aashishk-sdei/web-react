import React from "react";
import { Formik, Form, FieldArray,Field} from "formik";
import { tr } from "../../../components/utils";
import { useTranslation } from "react-i18next";
import {
    getFieldClass
} from "shared-logics";
import AddRecepet from "./AddRecepet"

const validation = (value) => {
    return /^[\w-.]{1,50}@[\w-.]{1,50}\.[\w-.]{2,50}$/.test(value) ? "" : "inValidEmail"
}

const operator = (value) => {
    return !value || (value && value.trim() === "") ? "inValid" : "";
}

const checkingvalidation = (value) => {
    return (value.rn !== "" || value.re !== "") ? true :false
}

const checkEmpty = (value) => {
   return (value.rn.trim() === "" || value.re.trim() === "") ? true :false
    
}

const formValidate = (values) => {
    let error = {};
    if (values.yn.trim() === "") {
        error.yn = "inValid"
        error.invaild = "Inavild";
    }
    if (values.ye.trim() === "") {
        error.ye = "inValid"
        error.invaild = "Inavild";
    }
    if (values.ye !== "" && validation(values.ye)) {
        error.ye = validation(values.ye)
    }
    if (values.msg.trim() === "") {
        error.msg = "inValid" 
        error.invaild = "Inavild";
    }
    values.k.forEach((value, index) => {
        if (!error.k) {
            error.k = []
        }
        if (checkEmpty(value) ) {
            error.k[index] = { rn: operator(value.rn), re: operator(value.re)}
        }
        if (checkingvalidation(value)  && validation(value.re)) {
            error.k[index] = { rn: "", re: validation(value.re) }
        }
    }); 
    if (error.k.length === 0) {
        delete error.k;
    }
    if (Object.keys(error).length === 0) {
        return null;
    }
    return error;
};

const SendEmail = ({
    defaultValues,
    WWIIIClear,
    buttonTitle,
    clearfun,
    handleNewspapperSubmit
}) => {
    const { t } = useTranslation();
    return (
        <>
            <Formik
                enableReinitialize={true}
                onSubmit={handleNewspapperSubmit}
                initialValues={defaultValues}
                validate={formValidate}
            >
                {({
                    dirty,
                    isSubmitting,
                    errors,
                    touched
                }) => (
                        <>
                            <div className="absolute top-0 left-0 bg-black h-full w-full flex items-center justify-center z-500 opacity-40 text-white text-2xl">Coming Soon</div>
                            <Form>
                                <div className="w-full">
                                 <FieldArray component={AddRecepet} name={"k"} />
                                    <div className="flex items-start flex-wrap md:flex-nowrap relative -mx-2 md:mb-3.5">
                                    <div className="w-full md:w-1/2 mx-2 mb-3.5 md:mb-0">
                                            <label
                                                className="block text-gray-6 text-sm mb-1"
                                                htmlFor="grid-first-name"
                                            >
                                                {tr(t, "Your Name")}
                                            </label>
                                            <Field
                                                disabled={true}
                                                name="yn"
                                                className={`appearance-none w-full h-10 text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:border-transparent ${getFieldClass(touched.yn, errors.yn) ? "border-transparent ring-2 ring-maroon-4 focus:ring-maroon-4" : "border  focus:ring-blue-4"}`}
                                                id="grid-first-name"
                                                type="text"
                                            />
                                            {touched.yn && errors.yn && <div className="text-maroon-4 text-xs mt-1.5">Please enter your name </div>}
                                        </div>
                                        <div className="w-full md:w-1/2 mx-2 mb-3.5 md:mb-0">
                                            <label
                                                className="block text-gray-6 text-sm mb-1"
                                                htmlFor="grid-last-name"
                                            >
                                                {tr(t, "Your Email")}
                                            </label>
                                            <Field
                                                disabled={true}
                                                name="ye"
                                                className={`appearance-none w-full h-10 text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:border-transparent ${getFieldClass(touched.ye, errors.ye) ? "border-transparent ring-2 ring-maroon-4 focus:ring-maroon-4" : "border  focus:ring-blue-4"}`}
                                                id="grid-last-name"
                                                type="text"
                                            />
                                            {touched.ye && errors.ye && <div className="text-maroon-4 text-xs mt-1.5">{`Please enter ${errors.ye == "inValid" ? "your" :"valid" } email`} </div>}
                                        </div>


                                    </div>
                                    <div className="flex items-start flex-wrap md:flex-nowrap relative -mx-2 md:mb-12">
                                        <div className="w-full mx-2 mb-6 md:mb-0">
                                            <label
                                                className="block text-gray-6 text-sm mb-1"
                                                htmlFor="grid-last-name"
                                            >
                                                {tr(t, "Message")}
                                            </label>
                                            <Field
                                                name="msg"
                                            className={`appearance-none w-full h-30 resize-none text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:border-transparent ${getFieldClass(touched.msg, errors.msg) ? "border-transparent ring-2 ring-maroon-4 focus:ring-maroon-4" : "border  focus:ring-blue-4"}`}
                                                id="grid-last-name"
                                                as="textarea"
                                         />
                                            {touched.msg && errors.msg && <div className="text-maroon-4 text-xs mt-1.5">Please enter your message </div>}
                                            </div>
                                        
                                        </div>
                                    <div className="sm:flex justify-between w-full">
                                    <div className="buttons ml-auto flex items-center justify-end">
                                          <button
                                            className="disabled:opacity-40 bg-blue-4 active:bg-blue-5 text-white typo-font-medium btn-large inline-flex items-center px-5 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-1 ml-4 w-auto order-last"
                                                disabled={!dirty || isSubmitting}
                                                type="submit"
                                            >
                                                {isSubmitting ? `Loading...` : tr(t, buttonTitle)}
                                            </button>
                                            {WWIIIClear ? (
                                                <button
                                                className="disabled:opacity-40 text-blue-5 active:bg-gray-2 rounded-lg bg-gray-2 typo-font-medium btn-large inline-flex items-center px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-inset w-auto"
                                                    disabled={isSubmitting}
                                                    type="reset"
                                                    onClick={clearfun}
                                                >
                                                    {tr(t, "Cancel")}
                                                </button>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                                </Form>
                            
                        </>
                    )}
            </Formik>
        </>
    );
};
export default SendEmail;
