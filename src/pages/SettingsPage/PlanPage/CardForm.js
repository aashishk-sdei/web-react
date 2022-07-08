import React, { useMemo, useState } from "react";
import { Formik, Form, Field } from "formik";
import {
    getCardNames,
    getDateStrings
} from "./../../../utils/index";
import TailwindModal from "../../../components/TailwindModal";
import Button from "../../../components/Button";
import Typography from "../../../components/Typography"
import { useDispatch, useSelector } from "react-redux";
import className from "classnames";
import NumberFormat from 'react-number-format';
import { UpdatePaymentCard, getBillingInformation } from "../../../redux/actions/payments";
const getExValue = (exValue) => {
    if (exValue === "1/") {
        exValue = `0${exValue}`;
    }
    return exValue
}
const handleDateKeyPressStatus = e => {
    if (!(e.which > 46 && e.which < 58)) {
        e.preventDefault();
    }
}
function validateCurrentDate(expDate) {
    const monthYear = expDate.split("/");
    let returnVal = false;
    const currentYear = new Date().getFullYear().toString().substring(2);
    let month = new Date().getMonth()
    let monthYearDate = monthYear[1]
    if (Number(monthYearDate) === Number(currentYear)) {
        if (Number(monthYear[0]) <= month) {
            returnVal = true;
        }
    } else if (Number(monthYearDate) <= Number(currentYear)) {
        returnVal = true;
    }
    return returnVal
}
const getCountryProps = (values) => {
    const country = values.country
    let obj = {
        minLength: 4,
        maxLength: 10
    }
    if (country === 'US') {
        obj = {
            minLength: 5,
            maxLength: 5
        }
    } else if (country === 'AU') {
        obj = {
            minLength: 4,
            maxLength: 4
        }
    } else if (country === 'IE') {
        obj = {
            minLength: 3,
            maxLength: 3
        }
    }
    return obj
}
const cardNumberValidation = (values, error) => {
    if (!values.cardNumber) {
        error.cardNumber = 'This is required.'
    } else if ((values.cardNumber.substring(0, 2) == 34 || values.cardNumber.substring(0, 2) == 37) && values.cardNumber.replaceAll(/\s/g, '').length < 15) {
        error.cardNumber = 'Check your card number.'
    } else if (values.cardNumber && values.cardNumber.substring(0, 2) != 34 && values.cardNumber.substring(0, 2) != 37 && values.cardNumber.replaceAll(/\s/g, '').length < 16) {
        error.cardNumber = 'Check your card number.'
    }
    return error
}
function getMonthStatus(val) {
    if (val.length === 1 && val[0] > 1) {
      val = '0' + val;
    }
  
    if (val.length === 2) {
      if (Number(val) === 0 || (Number(val[0]) !== 0 && Number(val[1]) > 2)) {
        let extra = val[1]
        val = '01';
        return { val, extra }
      }
    }
  
    return val;
  }
const cardValueFormat = (value, formik, format, setFormat) => {
    const _format = (value.slice(0, 2) === '37' || value.slice(0, 2) === '34') ? '#### ###### #####' : '#### #### #### ####'
    _format !== format && setFormat(_format)
    formik.setFieldValue("cardNumber", value, true)
}
const cardExpiryDateValidation = (values, error) => {
    if (!values.expiryDate) {
        error.expiryDate = 'This is required.'
    } else if (!/^(0[1-9]|1[0-2])?\/(\d{2})$/i.test(values.expiryDate)) {
        error.expiryDate = 'Check your expiration date.'
    } else if (validateCurrentDate(values.expiryDate)) {
        error.expiryDate = 'Check your expiration date.'
    }
    return error
}
const validateForm = (values) => {
    let error = {}
    if (!values.cardName) {
        error.cardName = 'This is required.'
    }
    error = cardNumberValidation(values, error)
    error = cardExpiryDateValidation(values, error)
    if (!values.cvc) {
        error.cvc = 'This is required.'
    } else if ((values.cardNumber.substring(0, 2) == 34 || values.cardNumber.substring(0, 2) == 37)) {
        if ((values.cvc.replaceAll(/\s/g, '')).length < 4) {
            error.cvc = 'check your CVV'
        }
    } else if ((values.cvc.replaceAll(/\s/g, '')).length < 3) {
        error.cvc = 'check your CVV'
    }
    if (!values.country) {
        error.country = 'This is required.';
    }
    if (!values.postalCode) {
        error.postalCode = 'This is required.';
    } else {
        const minMaxObj = getCountryProps(values);
        if (values.postalCode.length < minMaxObj.minLength) {
            error.postalCode = 'Check your Zip or Postal code.'
        }
    }
    if (Object.keys(error).length === 0) {
        return null
    }
    return error
}
const getMonStringStatus = (month, year, status, exDate) => {
    let _str = `${month}`
    if (year.length) {
        _str += '/' + year
    } else {
        if (month.length > 1 && status != 'backspace') {
            _str += '/'
        } else if (exDate.substr(-1) === '/' && status === 'backspace') {
            _str = exDate?.substring(0, exDate.length - 2);
        } else if (exDate.substr(-2, 1) === '/' && status === 'backspace') {
            _str = exDate?.substring(0, exDate.length - 1)
        }
    }
    return _str
}
const handleDatekeydownStatus = (e, formik) => {
    let key = e.keyCode || e.charCode;
    if (key === 8 || key === 46) {
        formik.setStatus('backspace')
    } else {
        formik.setStatus('')
    }
}
function cardExpiry(val, form) {
    const status = form.status
    const exDate = form.values.expiryDate
    let month = getMonthStatus(val.substring(0, 2));
    let year = val.substring(3, 5);
    if (typeof month === 'string') {
        return getMonStringStatus(month, year, status, exDate);
    } else {
        return `${month.val}/${month.extra}${year.length ? year[0] : ''}`;
    }
}
const CardForm = ({
    openCardModal,
    setCardModal,
    setCardaddedModal,
    expirypaywall
}) => {
    const dispatch = useDispatch()
    const [format, setFormat] = useState('#### #### #### ####')
    const { userAccount } = useSelector((state) => state.user);
    const {
        counties,
    } = useSelector(state => state.location);
    const handleSubmitAction = (values, { setSubmitting }) => {
        const { firstName, lastName } = getCardNames(values.cardName);
        const { month, year } = getDateStrings(values.expiryDate);
        const postData = {
            "RecurlySubscriptionUuid": expirypaywall.recurlyId,
            "UserInformation": {
                "Firstname": firstName || "",
                "Lastname": lastName
            },
            "BillingInformation": {
                "Zipcode": values.postalCode,
                "Country": values.country
            },
            "CreditCardInformation": {
                "CreditCardNumber": values.cardNumber,
                "Cvv2Number": values.cvc,
                "ExpirationMonth": month,
                "ExpirationYear": year
            }
        }
        dispatch(UpdatePaymentCard(postData, setSubmitting)).then((data) => {
            if (data) {
                dispatch(getBillingInformation(expirypaywall.recurlyId))
                setCardModal(false);
                setCardaddedModal(true);
            }
        })
    }
    const initialValues = useMemo(() => {
        let _initialValues = {
            cardNumber: "",
            cardName: "",
            expiryDate: "",
            cvc: "",
            postalCode: "",
            checkTerms: false,
            country: ''
        }
        if (userAccount?.firstName && userAccount?.lastName) {
            _initialValues.cardName = userAccount?.firstName + ' ' + userAccount?.lastName
        }
        return _initialValues
    }, [userAccount])
    return <TailwindModal
        title="Add a Card"
        showClose={true}
        innerClasses={"max-w-105.5"}
        titleFontWeight={"typo-font-medium"}
        modalWrap={"py-6 px-8"}
        modalHead={"pb-5"}
        modalPadding={"p-0"}
        content={
            <Formik
                initialValues={initialValues}
                validateOnChange={false}
                validateOnBlur
                enableReinitialize={true}
                validate={validateForm}
                onSubmit={handleSubmitAction}
            >
                {(formik) => {
                    const cardNameError = formik.touched?.cardName && formik.errors?.cardName
                    const cardNumberError = formik.touched?.cardNumber && formik.errors?.cardNumber
                    return (
                        <>
                            <Form>
                                <div className="mb-6">
                                    <span className="text-gray-6 text-sm mb-1.5 block">Name on card</span>
                                    <Field
                                        type="text"
                                        name="cardName"
                                        autoFocus
                                        className={className("appearance-none block w-full h-10 text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent placeholder-gray-4::placeholder", {
                                            "border-transparent ring-2 ring-maroon-4 focus:ring-maroon-4": cardNameError
                                        })}
                                    />
                                    {cardNameError && (<Typography text="danger" weight="regular" size={12}><span className='block mt-1'>{formik.errors.cardName}</span></Typography>)}
                                </div>
                                <div className="mb-6">
                                    <div className="mb-4">
                                        <span className="text-gray-6 text-sm mb-1.5 block">Card information</span>
                                        <Field
                                            type="text"
                                            name="cardNumber"
                                        >
                                            {(field) => {
                                                return <div>
                                                    <NumberFormat
                                                        onValueChange={({ value }) => {
                                                            cardValueFormat(value, formik, format, setFormat)
                                                        }}
                                                        className={className("appearance-none block w-full h-10 text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent placeholder-gray-4::placeholder", {
                                                            "border-transparent ring-2 ring-maroon-4 focus:ring-maroon-4": cardNumberError
                                                        })}
                                                        name="cardNumber"
                                                        placeholder="1234 1234 1234 1234"
                                                        format={format}
                                                        {...field}
                                                    />
                                                </div>
                                            }}
                                        </Field>
                                        {cardNumberError && (<Typography text="danger" weight="regular" size={12}><span className='block mt-1'>{formik.errors.cardNumber}</span></Typography>)}
                                    </div>
                                    <div className="flex flex-wrap -mx-1.5">
                                        <div className="w-1/2 px-1.5">
                                            <Field
                                                type="text"
                                                placeholder="MM/YY"
                                                name="expiryDate"
                                                onKeyDown={(e) => handleDatekeydownStatus(e, formik)}
                                                onKeyPress={(e) => handleDateKeyPressStatus(e)}
                                                onChange={(e) => {
                                                    let exValue = e.target.value
                                                    exValue = getExValue(exValue)
                                                    let dateArr = exValue.split('');
                                                    let finalArr = dateArr.filter((char, index) => !(char === '/' && index !== 2));
                                                    finalArr = finalArr.join("");
                                                    let setVal = finalArr?.slice(0, 5);
                                                    setVal = cardExpiry(setVal, formik)
                                                    formik.setFieldValue('expiryDate', setVal, true)
                                                }}
                                                className={className("appearance-none block w-full h-10 text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent placeholder-gray-4::placeholder", {
                                                    "border-transparent ring-2 ring-maroon-4 focus:ring-maroon-4": formik.touched?.expiryDate && formik.errors?.expiryDate
                                                })}
                                            />
                                            {formik.touched?.expiryDate && formik.errors?.expiryDate && (<Typography text="danger" weight="regular" size={12}><span className='block mt-1'>{formik.errors.expiryDate}</span></Typography>)}
                                        </div>
                                        <div className="w-1/2 px-1.5">
                                            <Field
                                                type="text"
                                                name="cvc">
                                                {(field) => (
                                                    <div>
                                                        <NumberFormat
                                                            onValueChange={({ value }) => {
                                                                formik.setFieldValue("cvc", value, true)
                                                            }}
                                                            name="cvc"
                                                            placeholder="CVV"
                                                            className={className("appearance-none block w-full h-10 text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent placeholder-gray-4::placeholder", {
                                                                "border-transparent ring-2 ring-maroon-4 focus:ring-maroon-4": formik.touched?.cvc && formik.errors?.cvc
                                                            })}
                                                            format={'####'}
                                                            {...field}
                                                        />
                                                    </div>
                                                )}
                                            </Field>
                                            {formik.touched?.cvc && formik.errors?.cvc && (<Typography text="danger" weight="regular" size={12}><span className='block mt-1'>{formik.errors.cvc}</span></Typography>)}
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="flex flex-wrap -mx-1.5">
                                        <div className="w-1/2 px-1.5">
                                            <span className="text-gray-6 text-sm mb-1.5 block">Country</span>
                                            <div className="relative">
                                                <Field
                                                    as="select"
                                                    id="country"
                                                    name="country"
                                                    autoComplete="country-name"
                                                    className={className("appearance-none w-full pr-10 relative z-10 bg-transparent h-10 text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent placeholder-gray-4::placeholder", {
                                                        "border-transparent ring-2 ring-maroon-4 focus:ring-maroon-4": formik.touched?.country && formik.errors?.country
                                                    })}
                                                >
                                                    <option value="" hidden>Search</option>
                                                    {counties.map((country) => {
                                                        return <option key={country.countryId} value={country.countryAbbr}>{country.countryName}</option>
                                                    })}
                                                </Field>
                                                <div class="absolute top-0 right-0 mr-1 h-10 w-10 flex items-center justify-center rounded-lg">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
                                                        <path d="M1.375 1.40562L6.735 6.76512C6.76978 6.79995 6.81109 6.82759 6.85656 6.84644C6.90203 6.8653 6.95078 6.875 7 6.875C7.04922 6.875 7.09797 6.8653 7.14344 6.84644C7.18891 6.82759 7.23022 6.79995 7.265 6.76512L12.625 1.40562" stroke="#555658" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                                        </path>
                                                    </svg>
                                                </div>
                                            </div>
                                            {formik.touched?.country && formik.errors?.country && (<Typography text="danger" weight="regular" size={12}><span className='block mt-1'>{formik.errors.country}</span></Typography>)}
                                        </div>
                                        <div className="w-1/2 px-1.5">
                                            <span className="text-gray-6 text-sm mb-1.5 block">Zip or Postal Code</span>
                                            <Field
                                                type="text"
                                                name="postalCode"
                                                {...getCountryProps(formik.values)}
                                                className={className("appearance-none block w-full h-10 text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent placeholder-gray-4::placeholder", {
                                                    "border-transparent ring-2 ring-maroon-4 focus:ring-maroon-4": formik.touched?.postalCode && formik.errors?.postalCode
                                                })}
                                            />
                                            {formik.touched?.postalCode && formik.errors?.postalCode && (<Typography text="danger" weight="regular" size={12}><span className='block mt-1'>{formik.errors.postalCode}</span></Typography>)}
                                        </div>
                                    </div>
                                </div>
                                <div className="buttons mt-10 ml-auto flex items-center justify-end">
                                    <div>
                                        <Button
                                            size="large"
                                            title="Back"
                                            fontWeight="medium"
                                            disabled={formik.isSubmitting}
                                            type="default-dark"
                                        />
                                    </div>
                                    <div className="ml-2">
                                        <Button
                                            buttonType="submit"
                                            size="large"
                                            title="Save"
                                            disabled={formik.isSubmitting || (formik.dirty && !formik.isValid)}
                                            loading={formik.isSubmitting}
                                            fontWeight="medium"
                                        />
                                    </div>
                                </div>
                            </Form>
                        </>
                    )
                }
                }
            </Formik>

        }
        showModal={openCardModal}
        setShowModal={setCardModal}
    />
}
export default CardForm