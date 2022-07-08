import { Field } from "formik";
import { tr } from "../../../components/utils";
import { useTranslation } from "react-i18next";
import {
    getFieldClass
} from "shared-logics";




const AddRecepet = ({ push,
    remove, 
    form: { values, touched, errors } }) => {
    const { t } = useTranslation();
    return (<>
        <div >
            {(values.k || []).map((_item, index) => {
                return (
                    <div key={index} className={`flex items-start ${values.k.length > 1 ? "" : "no-cross"} flex-wrap md:flex-nowrap relative -mx-2 md:mb-4`}>
                        <div className="cross-field md:w-1/2 mx-2 mb-3.5 md:mb-0">
                            <label
                                className="block text-gray-6 text-sm mb-1"
                                htmlFor="grid-first-name"
                            >
                                {tr(t, "Recipient Name")}
                            </label>
                            <Field
                                disabled={true}
                                autoFocus={true}
                                name={`k.${index}.rn`}
                                className={`appearance-none w-full h-10 text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:border-transparent ${getFieldClass(touched?.k?.[index]?.rn, errors?.k?.[index]?.rn) ? "border-transparent ring-2 ring-maroon-4 focus:ring-maroon-4" : "border  focus:ring-blue-4"}`}
                                id="grid-first-name"
                                type="text"
                            />
                            {touched?.k?.[index]?.rn && errors?.k?.[index]?.rn && <div className="text-maroon-4 text-xs mt-1">Please enter your name </div>}
                        </div>
                        <div className="w-full md:w-1/2 mx-2 mb-3.5 md:mb-0">
                            <label
                                className="block text-gray-6 text-sm mb-1"
                                htmlFor="grid-last-name"
                            >
                                {tr(t, "Recipient Email")}
                            </label>
                            <Field
                                disabled={true}
                                name={`k.${index}.re`}
                                className={`appearance-none w-full h-10 text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:border-transparent ${getFieldClass(touched?.k?.[index]?.re, errors?.k?.[index]?.re) ? "border-transparent ring-2 ring-maroon-4 focus:ring-maroon-4" : "border  focus:ring-blue-4"}`}
                                id="grid-last-name"
                                type="text"
                                placeholder="name@email.com"
                            />
                            {touched?.k?.[index]?.re && errors?.k?.[index]?.re && <div className="text-maroon-4 text-xs mt-1">{`Please enter ${errors?.k?.[index]?.re == "inValid" ? "your" : "valid"} email`} </div>}
                        </div>
                        {values.k.length > 1 && <button type="button" onClick={() => remove(index)} className="p-3 ml-2 mr-2 md:relative absolute top-6 right-0 bg-gray-1 hover:bg-gray-2 focus:bg-gray-2 rounded-lg outline-none focus:outline-none">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 13L13 1" stroke="#747578" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M13 13L1 1" stroke="#747578" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg></button>}
                    </div>

                )
            })}
            <div className="flex items-start flex-wrap md:flex-nowrap relative mb-3.5 ">
                <button className="flex items-center" type="button" onClick={() => push({ rn: "", re: "" })}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M1 7H13" stroke="#295DA1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7 1V13" stroke="#295DA1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="ml-2 text-blue-5 typo-font-medium text-sm">Add another recipient</span>
                </button>
            </div>

        </div>
    </>)
}

export default AddRecepet;