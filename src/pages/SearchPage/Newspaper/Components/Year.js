import React from "react";
import { useSelector } from "react-redux";

const Year = ({ field, ...props }) => {
    const {
        minDate, 
        maxDate
    } = useSelector(state => state.location);
    return <select
        {...props}
        {...field}
        onChange={(e) => {
            field.onChange(e)
            props.onChange && props.onChange(e)
        }}
        className={`appearance-none w-full pr-10 py-2 px-3 border-gray-3 z-10 bg-transparent rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-transparent ${props.className}`}
    >
        <option value="">Year</option>
        {Array.from({ length: (maxDate-minDate) }, (_v, k) => {
            return maxDate - k
        })
            .map(year => <option key={year} value={year}>{year}</option>)}
    </select>
}
export default Year;