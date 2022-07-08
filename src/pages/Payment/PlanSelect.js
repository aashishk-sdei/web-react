import React from "react"
import Button from "../../components/Button";
import Typography from "../../components/Typography";
import "./index.css";

const PlanSelect = ({ setPlanFunction, showStep, allPlans, selectDefault, setSelectDefaultFunction, planSelection }) => {
    const handleCheck = (event) => {
        setPlanFunction(event)
    }
    return (
        <>
            <div className="max-w-lgl w-full mx-auto pt-18 pb-10 md:py-10 md:px-6 px-0">
                {showStep && <div className="mb-8">
                    <Typography size={14}>
                        Step 1 of 2
                    </Typography>
                </div>
                }
                <div className="mb-8">
                    <h3 className="defaultText secondary-color text-2xl typo-font-medium">Choose a Duration</h3>
                </div>
                {allPlans && Object.keys(allPlans).length !== 0 &&
                    <div className="planSelect border border-gray-2 rounded-2xl overflow-hidden">
                        {allPlans.map((key, items) => (
                            <div className={`planItem flex flex-wrap 
                            ${(items === 0 || items === (allPlans.length - 1)) ? "" : "border-t border-b border-gray-2"} 
                            relative md:items-center card bg-white sm:px-6 py-12 px-3 cursor-pointer result-hover 
                            ${(items === 0 && selectDefault === true) ? "result-selected" : ""}
                            ${planSelection === key.planId? "disabled": ""}`}
                                onMouseOver={() => setSelectDefaultFunction(false)}
                            >
                                <div className="relative md:w-1/2 w-5/12 pr-4">
                                    <div className="absolute flex items-center h-5 -top-8">
                                        <Typography size={12}>
                                            {key.popular}
                                        </Typography>
                                    </div>
                                    <div>
                                        <Typography
                                            size={24}
                                            weight="bold"
                                            text="secondary"
                                        >
                                            {key.title}
                                        </Typography>
                                    </div>
                                    <div>
                                        <Typography size={12}>
                                            {key.description}
                                        </Typography>
                                    </div>
                                </div>
                                <div className="md:w-1/2 w-7/12">
                                    <div className="flex items-center justify-end">
                                        <div className="md:mr-6 mr-3 min-w-26 relative grid justify-end">
                                            {key.offer &&
                                                <div className="absolute -top-8 right-0">
                                                    <span className="savetag text-gray-6 text-xs h-5 bg-gray-2 flex items-center px-2 rounded min-w-8">Save {key.offer}%</span>
                                                </div>
                                            }
                                            <div>
                                                <Typography
                                                    size={20}
                                                    weight="bold"
                                                    text="secondary"
                                                >
                                                    ${key.total_amount}
                                                </Typography>
                                            </div>
                                            <div>
                                                <Typography size={14}>
                                                    Per month
                                                </Typography>
                                            </div>
                                        </div>
                                        <Button
                                            handleClick={() => {
                                                planSelection !== key.planId && handleCheck(key.planId)
                                            }}
                                            size="large"
                                            title="Select"
                                            disabled={planSelection == key.planId}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                        }
                    </div>
                }
            </div>
        </>
    )
}
export default PlanSelect