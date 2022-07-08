import React from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, FieldArray } from "formik";
import TailwindModal from "../../../components/TailwindModal";
import ClassNames from "classnames";
import Button from "../../../components/Button";
import Typography from "../../../components/Typography";
import Icon from "../../../components/Icon";
import { isEmailVaild } from "../../../utils/formFields/helper";
import "./index.css"
import { shareStoryViaEmail } from "../../../redux/actions/story";

const ShareModal = ({ showModal, setShowModal, storyTitle, personalDetails, storyImage, story }) => {
  const dispatch = useDispatch();

  const validate = values => {
    let bool = false
    let errors = {
      emailIds: []
    };
    values?.emailIds?.forEach((item, index) => {
      const error = {};
      if (item && !isEmailVaild(item)) {
        bool = true
        error.value = "Please enter a valid email address.";
      }
      if (values.emailIds.length > (index + 1) && !item) {
        bool = true
        error.value = "Please enter a email address.";
      }
      if (values.emailIds.length === 1 && !item) {
        bool = true
        error.value = "Please enter a email address.";
      }
      errors.emailIds[index] = error;
    });

    if (bool === false) {
      return {};
    }
    return errors
  };

  const handleSubmit = (value, formik) => {
    let emailIds = value.emailIds
    emailIds = emailIds.filter(n => n);
    if (emailIds.length > 0) {
      dispatch(shareStoryViaEmail(story.storyId, emailIds, formik, setShowModal))
    }
  }
  return (
    <TailwindModal
      showClose={true}
      innerClasses="shareModal"
      modalWrap={"p-8"}
      modalHead={"p-0 absolute right-6 top-6"}
      modalPadding={"p-0"}
      content={
        <div className="share-modal-body">
          <Formik
            initialValues={{ emailIds: [""] }}
            validate={validate}
            onSubmit={handleSubmit}
            validateOnChange={false}
            validateOnBlur
          >
            {(formik) => (
              <Form>
                <div className="flex relative pr-8 mb-8 items-center">
                  {storyImage && (
                    <div className="story-media bg-gray-3 w-20 h-20 rounded-lg overflow-hidden mr-5 relative flex justify-center sth-image items-center">
                      <div className="share-media-bg absolute inset-0 m-0 p-0 bg-center bg-no-repeat bg-cover overflow-hidden;" style={{ backgroundImage: `url(${storyImage})` }}></div>
                      <img src={storyImage} alt="" className="h-full w-auto object-cover" />
                    </div>
                  )}
                  <div className="story-info w-full">
                    <div className="head">
                      <Typography size={20} weight="lyon-medium" text="secondary">
                        <span className="tw-ellipsis">{storyTitle}</span>
                      </Typography>
                    </div>
                    <div>{personalDetails}</div>
                  </div>
                </div>
                <div className="mb-8">
                  <div>
                    <div className="mb-1">
                      <Typography size={14} text="secondary">
                        Share by email
                      </Typography>
                    </div>

                    <FieldArray
                      name="emailIds"
                      render={(arrayHelpers) => (
                        <>
                          {formik.values.emailIds.map((_emailId, index) => (
                            <div className="add-email-wrap relative mb-3">
                              <div className="pr-14">
                                <Field name={`emailIds.${index}`}>
                                  {(props) => {
                                    const {
                                      form: { values, setFieldValue, handleBlur, },
                                    } = props;
                                    const isError = formik?.errors?.emailIds?.[index]?.value
                                    { console.log(isError) }
                                    return (
                                      <input
                                        type="email"
                                        onChange={(e) => {
                                          setFieldValue(`emailIds.${index}`, e.target.value);
                                          if (e.target.value.length > 0 && !formik.values.emailIds.includes("") && formik?.values?.emailIds.length < 5) {
                                            arrayHelpers.insert(formik.values?.emailIds.length + 1, "");
                                          }
                                        }}
                                        onBlur={handleBlur}
                                        className={ClassNames({
                                          "input-text-error input-error ring-2 ring-maroon-4 focus:ring-maroon-4 w-full": isError,
                                          "input-text w-full": !isError
                                        })}
                                        id={index}
                                        placeholder="Email"
                                        value={values.emailIds[index]}
                                      />
                                    );
                                  }}
                                </Field>
                                {formik.errors?.emailIds && formik.errors?.emailIds[index]?.value && (
                                  <span className="error-message mb-5 flex mt-1.5">{formik.errors?.emailIds[index]?.value}</span>
                                )}

                              </div>
                              {formik.values.emailIds.length - 1 !== index && (
                                <div className="absolute right-0 top-0 btn-default w-10 h-10 rounded-lg flex justify-center">
                                  <Icon color="secondary" handleClick={() => arrayHelpers.remove(index)} id='"icon-" + crypt' type="delete" />
                                </div>
                              )}
                            </div>
                          ))}
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="share-modal-footer">
                  <Button fontWeight="medium" loading={formik.isSubmitting} buttonType="submit" title="Share" size="large"
                  // disabled={!formik.isValid || formik.isSubmitting}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      }
      showModal={showModal}
      setShowModal={setShowModal}
    />
  );
};
export default ShareModal;
