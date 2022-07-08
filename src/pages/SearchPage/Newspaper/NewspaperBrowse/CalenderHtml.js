import React from "react";
import { Formik, Field } from "formik";
import CalendarData from './../CalendarData';
import { useDispatch, useSelector } from "react-redux";
import { publicationYearsMonth, publicationYearsMonthDate } from "../../../../redux/actions/browseLocation";
import className from "classnames";


const CalenderHtml = ({pu, publicationName}) => {
 const dispatch = useDispatch();
 const {
    years,
    yearMonth,
    yearMonthLoading,
    cYear,
    cMonth
} = useSelector((state) => state.browseLocation);
 return <Formik
    enableReinitialize={true}
    initialValues={{
        year: cYear,
        month: cMonth
    }}>
    {(formik) => {
        return (
            <>
                <div className="flex flex-wrap">
                    <div className="w-1/2 mb-7 pr-1.5">
                        <div className="flex items-center relative">
                            <Field
                                as="select"
                                name="year"
                                onChange={(e) => {
                                    formik.handleChange(e)
                                    formik.setFieldValue("month", "")
                                    dispatch(publicationYearsMonth(pu, e.target.value)).then((data) => {
                                        data?.[0] && formik.setFieldValue("month", `${data[0]}`.padStart(2, '0'))
                                        dispatch(publicationYearsMonthDate(pu, e.target.value, `${data[0]}`.padStart(2, '0')))
                                    })
                                }}
                                className={className("appearance-none w-full pl-2 pr-6 py-2 px-3 border border-gray-3 z-10 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent", { "empty-value": !formik.values.year })}>
                                <option value="" hidden>Year</option>
                                {years.map((_year) => {
                                    return <option key={`c_year_${_year}`} value={_year}>{_year}</option>
                                })}
                            </Field>
                            <div className="absolute right-0 mr-1 h-10 w-10 flex items-center justify-center rounded-lg">
                                <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.375 1.40562L6.735 6.76512C6.76978 6.79995 6.81109 6.82759 6.85656 6.84644C6.90203 6.8653 6.95078 6.875 7 6.875C7.04922 6.875 7.09797 6.8653 7.14344 6.84644C7.18891 6.82759 7.23022 6.79995 7.265 6.76512L12.625 1.40562" stroke="#555658" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="w-1/2 mb-7 pl-1.5">
                        <div className="flex items-center relative">
                            <Field
                                as="select"
                                name="month"
                                onChange={(e) => {
                                    formik.handleChange(e)
                                    dispatch(publicationYearsMonthDate(pu, formik.values.year, e.target.value))
                                }}
                                className={className("appearance-none w-full pl-2 pr-6 py-2 px-3 border border-gray-3 z-10 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent", { "empty-value": !formik.values.month })}>
                                {yearMonthLoading && <option value="" hidden>Loading...</option>}
                                <option value="" hidden>Month</option>
                                {yearMonth.map((_month) => {
                                    const options = { month: 'long' };
                                    const monthCode = `${_month}`.padStart(2, '0')
                                    const monthName = new Intl.DateTimeFormat('en-US', options).format(new Date(`${monthCode}/01/2020`));
                                    return <option key={`c_month_${_month}`} value={monthCode}>{monthName}</option>
                                })}
                            </Field>
                            <div className="absolute right-0 mr-1 h-10 w-10 flex items-center justify-center rounded-lg">
                                <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.375 1.40562L6.735 6.76512C6.76978 6.79995 6.81109 6.82759 6.85656 6.84644C6.90203 6.8653 6.95078 6.875 7 6.875C7.04922 6.875 7.09797 6.8653 7.14344 6.84644C7.18891 6.82759 7.23022 6.79995 7.265 6.76512L12.625 1.40562" stroke="#555658" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <CalendarData yearMonth={formik.values} publicationName={publicationName} />
            </>
        );
    }}
</Formik>
}
export default CalenderHtml;