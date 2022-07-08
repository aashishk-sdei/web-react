import React, { useState } from "react";
import Typography from "../../components/Typography";
import Button from "../../components/Button";
import TailwindModal from "../../components/TailwindModal";
import { Formik, Form, Field } from "formik";
import OnList from "../../assets/images/onlist.svg";
import WaitList from "../../assets/images/waitlist.svg";
import Giphy from "../../assets/images/giphy.gif";
import { useDispatch } from "react-redux";
import { addUserDetailsToWaitlist, isEmailWhitelist } from "../../redux/actions/waitlist";
import className from "classnames";
import { Link, useHistory } from "react-router-dom";
import Loader from "../../components/Loader";

const getTitle = (values) => {
	let title;
	switch (values) {
		case 1:
			title = "Join Our Waitlist"
			break;
		case 2:
			title = "Enter Your Email"
			break;
		case 4:
			title = "Well, well, well...."
			break;
		default:
			title = ""
			break;
	}
	return title;
}
const getClass = (values, type) => {
	let innerClasses;
	let modalHead;
	switch (values) {
		case 1:
			innerClasses = "max-w-2xl"
			modalHead = "sm:pb-6 pb-10 sml:ml-auto sml:w-2/4 sml:pl-2 pl-0"
			break;
		case 2:
			innerClasses = "max-w-md"
			modalHead = "sm:pb-6 pb-10"
			break;
		case 4:
			innerClasses = "max-w-sm"
			modalHead = "pb-6"
			break;
		case 3:
			innerClasses = "max-w-md"
			modalHead = "pb-6 absolute right-8"
			break;
		default:
			innerClasses = ""
			modalHead = ""
			break;
	}
	return type === 1 ? innerClasses : modalHead;
}
const Waitlist = ({ step, setStepFunction, handleLogin, handleSignup, setOpenWaitList, openWaitList, alreadyViewed = false }) => {
	const [notIntheWhitelist, setNotIntheWhitelist] = useState(false);
	const dispatch = useDispatch();
	const history = useHistory();
	const defaultValues = {
		eid: '',
		fn: '',
		eid1: ''
	}
	const checkValidInputEmail = (value) => {
		return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
	}
	const competitorsEmailDomainCheck = (value) => {
		return /^\w+([-+.']\w+)*@?(ancestry.com|newspapers.com|genealogybank.com|myheritage.com|familysearch.com|newsbank.com)$/i.test(value)
	}
	const checkEmailInputValidation = (value, key, error) => {
		if (value === "") {
			error[key] = "Please enter email";
		} else {
			if (!checkValidInputEmail(value)) {
				error[key] = "Please enter a valid email";
			}
		}
	}
	const formValidate = (values) => {
		let formValue = { ...values };
		let error = {};
		if (step === 2) {
			checkEmailInputValidation(formValue.eid1, 'eid1', error)
		}
		if (step === 1) {
			if (formValue.fn === "") {
				error['fn'] = "Please enter name";
			}
			checkEmailInputValidation(formValue.eid, 'eid', error)
		}
		if (Object.keys(error).length === 0) {
			return null
		}
		return error;
	};

	const handleSubmit = (details, formik) => {
		if (step === 2 && details.eid1) {
			dispatch(isEmailWhitelist(details.eid1, formik, handleLogin, handleSignup, setStepFunction, setNotIntheWhitelist, alreadyViewed))
		}
		if (step === 1 && details.eid && details.fn) {
			dispatch(addUserDetailsToWaitlist(details.fn, details.eid, competitorsEmailDomainCheck, setStepFunction, formik))
		}
	};

	const handleCancelButton = () => {
		setOpenWaitList(false)
		if (alreadyViewed) {
			history.push('/')
		}
	}
	return (
		<>
			<TailwindModal
				title={getTitle(step)}
				innerClasses={getClass(step, 1)}
				titleFontWeight={"text-xl typo-font-bold"}
				modalWrap={"sm:px-8 px-6 py-6"}
				modalHead={getClass(step, 2)}
				modalPadding={"p-0"}
				content={
					<>

						{step === 2 &&
							<Formik
								enableReinitialize={true}
								validateOnBlur={true}
								validate={formValidate}
								initialValues={defaultValues}
								onSubmit={handleSubmit}
								validateOnChange={false}
							>
								{(formik) => {
									return (
										<Form>
											<>
												<div className="w-full mb-4">
													<label
														className="block text-gray-6 text-sm mb-2"
														htmlFor="grid-email"
													>
														Email
													</label>
													<Field
														name={`eid1`}
														className={className("appearance-none w-full h-10 text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent", { "border-transparent ring-2 ring-maroon-4 focus:ring-maroon-4": formik.touched.eid1 && formik.errors?.eid1 })}
														id="grid-email"
														type="text"
													/>
													{formik.touched.eid1 && formik.errors?.eid1 && <div className="text-maroon-4 text-xs mt-1">{formik.errors.eid1}</div>}
												</div>
												<div className="mt-6 flex justify-end">
													<button
														className="disabled:opacity-40 bg-blue-4 active:bg-blue-5 text-white btn btn-primary btn-large w-full"
														disabled={!formik.isValid || formik.isSubmitting}
														type="submit"
													>
														<div class="flex justify-center items-center w-full">
															{formik.isSubmitting && (
																<span className="mr-2">
																	<Loader spinner={true} color="default" size={12} />
																</span>
															)}
															<span class="typo-font-medium">Continue</span>
														</div>
													</button>
												</div>
											</>
										</Form>)
								}}
							</Formik>
						}
						{step === 1 &&
							<Formik
								enableReinitialize={true}
								validateOnBlur={true}
								validate={formValidate}
								initialValues={defaultValues}
								onSubmit={handleSubmit}
								validateOnChange={false}
							>
								{(formik) => {
									return (
										<Form>
											<>
												<div className="sml:flex items-center">
													<div className="sml:w-1/2 w-full flex justify-center mb-4 md:mb-0">
														<img
															src={WaitList}
															className="sml:w-4/5 w-60"
															alt=""
														/>
													</div>
													<div className="sml:w-1/2 w-full sm:mb-4 md:mb-0 sml:pl-2">
														{notIntheWhitelist && <div className="text-maroon-5 text-xs mb-4">The information you entered does not match an account in our records.</div>}
														{alreadyViewed && <div className="text-maroon-5 text-xs mb-4">This story has already been viewed.</div>}
														<div className="mb-4">
															<Typography size={14}>
																Storied is currently in an invite-only Beta. If you have received an invite, please follow the link you were sent.
															</Typography>
														</div>
														<div className="mb-4">
															<Typography size={14}>
																Submit your information below to be considered for the Beta.
															</Typography>
														</div>
														<div className="w-full mb-4">
															<label
																className="block text-gray-6 text-sm mb-2"
																htmlFor="grid-name"
															>
																Name
															</label>
															<Field
																name='fn'
																className={className("appearance-none w-full h-10 text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent", { "border-transparent ring-2 ring-maroon-4 focus:ring-maroon-4": formik.touched.fn && formik.errors?.fn })}
																id="grid-last-name"
																type="text"
															/>
															{formik.touched.fn && formik.errors?.fn && <div className="text-maroon-4 text-xs mt-1">{formik.errors.fn} </div>}
														</div>
														<div className="w-full mb-4">
															<label
																className="block text-gray-6 text-sm mb-2"
																htmlFor="grid-email"
															>
																Email
															</label>
															<Field
																name={`eid`}
																className={className("appearance-none w-full h-10 text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent", { "border-transparent ring-2 ring-maroon-4 focus:ring-maroon-4": formik.touched.eid && formik.errors?.eid })}
																id="grid-email"
																type="text"
															/>
															{formik.touched.eid && formik.errors?.eid && <div className="text-maroon-4 text-xs mt-1">{formik.errors.eid} </div>}
														</div>
														<div className="w-full">
															<Typography size={14}>
																By clicking "Join Waitlist" you agree to the Storied <Link to={"/terms"} className="text-blue-4" target="_blank">Terms and Conditions</Link> and <Link to={"/privacy"} className="text-blue-4" target="_blank">Privacy Statement</Link>.
															</Typography>
														</div>
														<div className={`mt-6 mb-6 flex justify-end pb-8 border-b-1 border-gray-2`}>
															<button
																className="disabled:opacity-40 bg-blue-4 active:bg-blue-5 text-white btn btn-primary btn-large w-full"
																disabled={!formik.isValid || formik.isSubmitting}
																type="submit"
															>
																<div class="flex justify-center items-center w-full">
																	{formik.isSubmitting && (
																		<span className="mr-2">
																			<Loader spinner={true} color="default" size={12} />
																		</span>
																	)}
																	<span class="typo-font-medium">Join Waitlist</span>
																</div>
															</button>
														</div>
														<div className="w-full text-center">
															<Typography size={14}>
																Already have an account?
															</Typography>
														</div>
														<div className="mt-6 flex justify-end">
															<Button
																onClick={() => setStepFunction(2)}
																size="large"
																fontWeight="medium"
																width="full"
																title="Sign In"
																type="default-dark"
															/>
														</div>
													</div>
												</div>
											</>
										</Form>)
								}}
							</Formik>
						}
						{step === 3 &&
							<>
								<div className="w-full flex justify-center mb-5">
									<img
										src={OnList}
										alt=""
									/>
								</div>
								<div className="full text-center mb-4">
									<h3 className="text-xl typo-font-bold mb-4">You're on the List!</h3>
									<Typography size={14}>
										You have been added to our waitlist. We'll send an email to the address you provided when we're ready for you to try out Storied.
									</Typography>
								</div>
								<div className="w-full mt-6 flex justify-center">
									<Button
										onClick={() => {
											if (alreadyViewed) {
												history.push('/')
											} else {
												setStepFunction(0)
											}
										}}
										size="large"
										fontWeight="medium"
										width="full"
										title="Close"
									/>
								</div>
							</>
						}
						{step === 4 &&
							<>
								<div className="w-full flex justify-center mb-4">
									<img
										src={Giphy}
										className="rounded-lg"
										alt="icon"
									/>
								</div>
								<div className="full mb-4">
									<Typography size={14}>
										It looks like you have an email from one of our old friends. We were wondering when you were going to show up!
									</Typography>
								</div>
								<div className="full mb-4">
									<Typography size={14}>
										You've been added to our waitlist and we will send an email to the address you provided when we are ready for you to try out Storied.
									</Typography>
								</div>
								<div className="w-full mt-10 flex justify-center">
									<Button
										onClick={() => setStepFunction(0)}
										size="large"
										fontWeight="medium"
										width="full"
										title="Close"
									/>
								</div>
							</>
						}
					</>
				}
				showModal={openWaitList}
				setShowModal={handleCancelButton}
				clickAwayClose={false}
			/>
		</>
	);
}

export default Waitlist;