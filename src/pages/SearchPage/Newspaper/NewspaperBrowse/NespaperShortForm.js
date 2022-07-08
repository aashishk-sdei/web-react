import React from "react";
import { Formik, Form, Field } from "formik";
import SearchPeople from "../../../../components/SearchPeople/SearchPeople";
import Button from "../../../../components/Button";

const formValidateForm = (values) => {
    let errors = {};
    let keywordValidation = false
    values.k.forEach((value, index) => {
        if (value.t?.trim() && !value.m.trim()) {
            if (!errors.k) {
                errors.k = [{}, {}, {}, {}]
            }
            errors.k[index].m = "inValid"
        } else if (value.t?.trim()) {
            keywordValidation = true
        }
    });
    if (values.ln?.trim() === "" && !keywordValidation) {
        errors.ln = "inValid"
        errors.invaild = "Inavild";
    }
    return errors;
};
const NespaperShortForm = ({defaultValues, handleSubmit, setNewspaperModal}) => {
    return <Formik
        initialValues={defaultValues}
        enableReinitialize={true}
        onSubmit={handleSubmit}
        validate={formValidateForm}
    >
        {(formik) => {
            return (
                <>
                    <Form>
                        <div className="flex flex-wrap">
                            <div className="w-full mb-1.5">
                                <label className="block text-gray-5 text-sm mb-1" htmlFor="grid-last-name">First & Middle Name(s)</label>
                                <div className="relative">
                                    <Field
                                        freeSolo={true}
                                        component={SearchPeople}
                                        name={`fn`}
                                        placeholder=""
                                        selectPeople={(_val) => {
                                            if (_val?.givenName) {
                                                formik.setFieldValue("ln", _val?.surname || "")
                                            } else if (_val?.surname) {
                                                formik.setFieldValue("fn", _val?.givenName || "")
                                                formik.setFieldValue("ln", _val?.surname || "")
                                            }
                                        }}
                                        getOptionLabel={(opt) => opt?.givenName || formik.values.fn?.name}
                                        className={`appearance-none w-full h-10 text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent`}
                                        id="grid-first-name"
                                        type="text"
                                    />
                                </div>
                            </div>
                            <div className="w-full mb-1.5">
                                <label className="block text-gray-5 text-sm mb-1" htmlFor="grid-last-name">Last Name</label>
                                <Field
                                    name={`ln`}
                                    className={`appearance-none w-full h-10 text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent `}
                                    id="grid-last-name"
                                    type="text"
                                />
                            </div>
                            <div className="w-full mb-4">
                                <label className="block text-gray-5 text-sm mb-1" htmlFor="grid-last-name">Keywords</label>
                                <Field type="hidden" name={`k.0.m`} />
                                <Field
                                    name={`k.0.t`}
                                    className={`appearance-none w-full h-10 text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent `}
                                    id="grid-keyword"
                                    type="text"
                                />
                            </div>
                            <div className="w-full mb-6">
                                <Button
                                    buttonType="submit"
                                    size="large"
                                    width="full"
                                    disabled={!formik.dirty || formik.isSubmitting || !formik.isValid}
                                    fontWeight="medium"
                                    title="Search"
                                />
                            </div>
                            <div className="w-full text-center">
                                <span className="text-blue-5 typo-font-medium cursor-pointer" onClick={() => setNewspaperModal(true, formik.values)}>Advanced Search</span>
                            </div>
                        </div>
                    </Form>
                </>
            );
        }}
    </Formik>
}
export default NespaperShortForm