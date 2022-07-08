import { Formik, Form, Field } from "formik";
import TailwindModal from "../../../components/TailwindModal";
import MyCheckBox from "../../../components/Checkbox"
import Button from "../../../components/Button";
import "./index.css";

const CancelSubscription = ({ 
    handleSubmitReason,
    setMemberDelModal,
    setMemCancelModal,
    openMemCancelModal
}) => {
    return <TailwindModal
        title="Cancel Membership"
        showClose={true}
        innerClasses={"max-w-105.5"}
        titleFontWeight={"typo-font-bold"}
        modalWrap={"py-6 px-8"}
        modalHead={"pb-6"}
        modalPadding={"p-0"}
        content={
            <Formik
                initialValues={{
                    reasonType: "",
                    reason: ""
                }}
                validate={(values) => {
                    let error = {};
                    if (values.reasonType === "") {
                        error.reasonType = "This field is required";
                    }
                    if (values.reasonType === "Other" && values.reason === "") {
                        error.reason = "This field is required";
                    }
                    if (Object.keys(error).length === 0) {
                        return null
                    }
                    return error;
                }}
                onSubmit={handleSubmitReason}
            >
                {(formik) => {
                    return (
                        <>
                            <Form>
                                <div className="text-gray-6 text-md typo-font-medium text-left text-md mb-5">What could we have done better?</div>
                                <div className="cancelOptions flex flex-wrap flex-col -ml-2.5">
                                    {[
                                        "Too many technical issues",
                                        "Too hard to use",
                                        "Too expensive",
                                        "Not enough content",
                                        "Other"
                                    ].map((label, index) => {
                                        return <div className="w-full mb-1" key={index}>
                                            <MyCheckBox
                                                color="primary"
                                                handleChange={(_e, obj) => {
                                                    if (formik.values.reasonType === obj) {
                                                        formik.setFieldValue("reasonType", "")
                                                        formik.setFieldTouched("reasonType", true)
                                                    } else {
                                                        formik.setFieldValue("reasonType", obj)
                                                        formik.setFieldTouched("reasonType", false)
                                                    }
                                                    formik.setFieldValue("reason", "")
                                                }}
                                                id="reasonType"
                                                checked={formik.values.reasonType === label}
                                                label={label}
                                                labelColor="secondary"
                                                obj={label}
                                            />
                                        </div>
                                    })}
                                    {formik.errors?.reasonType && formik.touched?.reasonTypeCheck && <div className="error-message">{formik.errors?.reasonType}</div>}
                                    {formik.values.reasonType === "Other" && <><div className="w-full mb-2.5 ml-2.5">
                                        <Field
                                            as="textarea"
                                            row="5"
                                            placeholder="Please Explain"
                                            name="reason"
                                            className="h-30 resize-none rounded border border-gray-3 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent"
                                        />
                                    </div></>}
                                    {formik.errors?.reason && formik.touched?.reason && <div className="error-message">{formik.errors?.reason}</div>}
                                </div>
                                <div className="buttons mt-10 ml-auto flex items-center justify-end">
                                    <div>
                                        <Button
                                            size="large"
                                            title="Back"
                                            onClick={() => {
                                                setMemberDelModal(true)
                                                setMemCancelModal(false);
                                            }}
                                            fontWeight="medium"
                                            type="default-dark"
                                        />
                                    </div>
                                    <div className="ml-2">
                                        <Button
                                            size="large"
                                            title="Cancel Membership"
                                            buttonType="submit"
                                            type="danger"
                                            loading={formik.isSubmitting}
                                            disabled={formik.isSubmitting}
                                            fontWeight="medium"
                                        />
                                    </div>
                                </div>
                            </Form>
                        </>)
                }}
            </Formik>
        }
        showModal={openMemCancelModal}
        setShowModal={setMemCancelModal}
    />
}
export default CancelSubscription