import React, { createRef, useEffect, useState } from "react"
import classname from "classnames"
import { useSelector } from "react-redux";
import Skeleton from "../../../components/Skeleton";
import { useHistory } from "react-router-dom";

function getDaysInCurrentMonth(date) {
    return new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
    ).getDate();
}
const CalendarData = ({
    yearMonth,
    publicationName
}) => {
    const [html, setHtml] = useState(null)
    const history = useHistory()
    const {
        dates,
        datesLoading,
        yearMonthLoading
    } = useSelector((state) => state.browseLocation);
    const thead = <thead className="typo-font-bold text-sm text-gray-7">
        <tr>
            <th>
                <div className="w-full flex justify-center">
                    <p className="text-center text-gray-7">S</p>
                </div>
            </th>
            <th>
                <div className="w-full flex justify-center">
                    <p className="text-center text-gray-7">M</p>
                </div>
            </th>
            <th>
                <div className="w-full flex justify-center">
                    <p className="text-center text-gray-7">T</p>
                </div>
            </th>
            <th>
                <div className="w-full flex justify-center">
                    <p className="text-center text-gray-7">W</p>
                </div>
            </th>
            <th>
                <div className="w-full flex justify-center">
                    <p className="text-center text-gray-7">T</p>
                </div>
            </th>
            <th>
                <div className="w-full flex justify-center">
                    <p className="text-center text-gray-7">F</p>
                </div>
            </th>
            <th>
                <div className="w-full flex justify-center">
                    <p className="text-center text-gray-7">S</p>
                </div>
            </th>
        </tr>
    </thead>
    useEffect(() => {
        const year = yearMonth.year
        const month = yearMonth.month
        const date = new Date(`${month}/01/${year}`);
        const getDayStart = date.getDay();
        const getTotalDays = getDaysInCurrentMonth(date);
        let mainHtml = []
        let _html = []
        for (let i = 0; i < getDayStart; i++) {
            _html.push(<td key={`no_${year}_${month}_${i}`} className="pt-3">
                <div className="flex w-full justify-center items-center" />
            </td>)
        }
        for (let day = 1; day <= getTotalDays; day++) {
            const newRef = createRef();
            const isIncludes = dates.includes(`${year}-${month}-${day}`)
            _html.push(<td key={`${year}_${month}_${day}`} className="pt-3">
                <div className={classname("flex w-full justify-center items-center cursor-pointer")} onClick={() => {
                    if (isIncludes) {
                        const name = publicationName.toLowerCase().replace(/ /g, "-")
                        const options = { month: 'short' };
                        const monthName = new Intl.DateTimeFormat('en-US', options).format(new Date(`${month}/01/2020`));
                        history.push(`/search/newspaper/${name}-${monthName.toLowerCase()}-${day}-${year}-p-1`)
                    } else if (!newRef.current.classList.contains("bg-gray-5")) {
                        newRef.current.classList.add("bg-gray-5")
                        newRef.current.classList.add("text-white")
                        setTimeout(() => {
                            if (newRef.current) {
                                newRef.current.classList.remove("bg-gray-5");
                                newRef.current.classList.remove("text-white");
                            }
                        }, 3000)
                    }
                }}>
                    <p ref={newRef} className={classname("w-6 h-6 flex items-center justify-center rounded-full", {
                        //"bg-gray-5 text-white": !isIncludes,
                        "bg-blue-5 text-white": isIncludes
                    })}>{day}</p>
                </div>
            </td>);
            if (_html.length === 7 || day === getTotalDays) {
                mainHtml.push(<tr key={`day_${day}`}>{_html}</tr>)
                _html = []
            }
        }
        setHtml(mainHtml)
    }, [yearMonth, dates])
    const skeltonTR = <tr>
        <td colSpan="7"><Skeleton width={'100%'} height={24} /></td>
    </tr>
    return <table className="PubCalendar w-full">
        {thead}
        <tbody className="text-gray-6 text-sm typo-font-medium">
            {datesLoading || yearMonthLoading ? <>{skeltonTR}
                {skeltonTR}
                {skeltonTR}
                {skeltonTR}
                {skeltonTR}
            </> : html}
        </tbody>
    </table>
}
export default CalendarData;