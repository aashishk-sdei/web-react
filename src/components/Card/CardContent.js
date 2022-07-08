import React from "react";
import FileSelector from "./FileSelector";
import { cardType } from "../utils";
import { titleCase } from "../utils/titlecase"
import { showBirthandDeath } from "shared-logics";
import OtherImg from "../../assets/images/otherVectoriconlg.svg";

const { FOCUSED_LIVING, FOCUSED_DECEASED, MEDIUM_IMG, SMALL_IMG } = cardType;

export const CardContent = ({
    type,
    firstNameWithInitials,
    lastName,
    birth,
    birthPlace,
    death,
    deathPlace,
    isLiving,
    imageURL,
    checkFileSelector,
    handleUploader,
    isOwnerTree
}) => {
    switch (type) {
        case FOCUSED_LIVING:
            return (
                <div className="wa-focused-card-menu focused-card text-white">
                    <div className="flex living">
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <td className="align-top w-12">
                                        {(isOwnerTree || (!isOwnerTree && !isLiving)) ? (checkFileSelector() ? <FileSelector handleUploader={handleUploader} /> : <img src={imageURL} alt="card-pic-medium" className="h-12 w-12 rounded-lg card-content-img" />): <img src={OtherImg} alt="card-pic-medium" className="h-12 w-12 rounded-lg card-content-img" />}
                                    </td>
                                    <td>
                                        <div className="flex focus-node-width p-0">
                                            <div className="pl-2">
                                                <div className="text-base typo-font-medium max-w-xs mb-0.5 truncatetext focus-name-truncate">{(isOwnerTree || (!isOwnerTree && !isLiving)) ? `${titleCase(firstNameWithInitials)} ${titleCase(lastName)}` : "Private"}</div>
                                                <div className="text-xs my-0 ml-3.92 max-w-city truncate">{`B: ${(isOwnerTree || (!isOwnerTree && !isLiving)) ?  titleCase(birth.RawDate) :"Private"}`}</div>
                                                <div className="text-xs my-0 ml-3.92 max-w-city truncate">{`${(isOwnerTree || (!isOwnerTree && !isLiving)) ? titleCase(birthPlace) : ""}`}</div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        case FOCUSED_DECEASED:
            return (
                <div className="wa-focused-card-menu focused-card text-white">
                    <div className="flex deceased">
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <td className="align-top w-12">
                                        {checkFileSelector() ? <FileSelector handleUploader={handleUploader} /> : <img src={imageURL} alt="card-pic-xlarge" className="h-12 w-12 rounded-lg card-content-img" />}
                                    </td>
                                    <td className="align-top">
                                        <div className="flex focus-node-width">
                                            <div className="pl-2">
                                                <div className="text-base typo-font-medium max-w-xs mb-0.5 truncatetext focus-name-truncate">{`${titleCase(firstNameWithInitials)} ${titleCase(lastName)}`}</div>
                                                <div className="mb-2">
                                                    <p className="text-xs -my-0 ml-3.92 max-w-city truncate">{`B: ${titleCase(birth.RawDate)}`}</p>
                                                    <p className=" text-xs my-0 ml-3.92 max-w-city truncate">{`${titleCase(birthPlace)}`}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs -my-0 ml-3.92 max-w-city truncate">{`D: ${titleCase(death.RawDate)}`}</p>
                                                    <p className="text-xs my-0 ml-3.92 max-w-city truncate">{`${titleCase(deathPlace)}`}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        case SMALL_IMG:
            return (
                <div className="wa-card-small-menu">
                    <div className="flex">
                        {imageURL && <span className="h-6 w-6 cardImage">                            <img src={imageURL} alt="card-pic-medium" className="w-5 h-5 m-0.5 rounded-l " />                        </span>}
                        <div className={`${imageURL ? 'px-2' : 'px-4'} py-1`}>
                            <div className={`w-44 text-xs typo-font-medium truncatetext small-name-truncate`}>{(isOwnerTree || (!isOwnerTree && !isLiving)) ?`${titleCase(firstNameWithInitials)} ${titleCase(lastName)}`: "Private"}</div>
                        </div>
                    </div>
                </div>
            );
        case MEDIUM_IMG:
        default:
            return (
                <div className="wa-card-medium">
                    <div className="flex max-w-fitcontent">
                        <span className="h-12">
                            {(isOwnerTree || (!isOwnerTree && !isLiving)) && imageURL && <img src={imageURL} alt="card-pic-medium" className="h-11 w-11 m-0.5 rounded-l max-w-none cardImage" />}
                        </span>
                        <div className={`${isOwnerTree && imageURL ? 'px-2' : 'px-4'} py-1 flex flex-col justify-center max-w-fitcontent`}>
                            <div className={`${isOwnerTree && imageURL ? 'w-32' : 'w-46'} text-xs typo-font-medium max-h-fitcontent max-w-fitcontent truncatetext medium-name-truncate mb-0.5`}>{(isOwnerTree || (!isOwnerTree && !isLiving))? `${titleCase(firstNameWithInitials)} ${titleCase(lastName)}` : "Private"}</div>
                            <p className="text-vs my-0 truncate w-36">{showBirthandDeath(birth.Year, death.Year, isLiving, isOwnerTree)}</p>
                        </div>
                    </div>
                </div>
            );
    }
}