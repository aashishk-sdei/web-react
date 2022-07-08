import React, { useState } from "react";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Typography from "../../../components/Typography";
import "./index.css";
const getConnectionTypeFromRelationship = (relataionShip, connectionType) => {
    let count;
    let mainArray = []
    count = relataionShip && relataionShip?.length > 0 && relataionShip.filter(x => {
        if (x.connectionType === "Other") {
        if (mainArray.filter(key => key.givenName === x.givenName && key.customType == x.customType).length > 0) {
            return false
        } else {
            mainArray.push(x)
        }
    }
        return x.connectionType === connectionType
    })
    return count.length > 0 ? count.length :"";
}
const SideBariconDynamicContent = (value) => {
    let Html;
    if (value === 1 || value === 8) {
        Html = <span className="icon flex justify-center mr-4 ml-1.5">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3.58333C3 4.20217 3.24583 4.79566 3.68342 5.23325C4.121 5.67083 4.71449 5.91667 5.33333 5.91667C5.95217 5.91667 6.54566 5.67083 6.98325 5.23325C7.42083 4.79566 7.66667 4.20217 7.66667 3.58333C7.66667 2.9645 7.42083 2.371 6.98325 1.93342C6.54566 1.49583 5.95217 1.25 5.33333 1.25C4.71449 1.25 4.121 1.49583 3.68342 1.93342C3.24583 2.371 3 2.9645 3 3.58333V3.58333Z" stroke="#555658" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M9.41667 11.1663C9.41667 10.0834 8.98646 9.04476 8.22069 8.27899C7.45491 7.51321 6.4163 7.08301 5.33333 7.08301C4.25037 7.08301 3.21175 7.51321 2.44598 8.27899C1.68021 9.04476 1.25 10.0834 1.25 11.1663V12.9163H3L3.58333 18.7497H7.08333L7.66667 12.9163H9.41667V11.1663Z" stroke="#555658" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M12.3333 3.58333C12.3333 4.20217 12.5791 4.79566 13.0167 5.23325C13.4543 5.67083 14.0478 5.91667 14.6666 5.91667C15.2855 5.91667 15.879 5.67083 16.3166 5.23325C16.7541 4.79566 17 4.20217 17 3.58333C17 2.9645 16.7541 2.371 16.3166 1.93342C15.879 1.49583 15.2855 1.25 14.6666 1.25C14.0478 1.25 13.4543 1.49583 13.0167 1.93342C12.5791 2.371 12.3333 2.9645 12.3333 3.58333V3.58333Z" stroke="#555658" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M11.1666 12.917H12.3333L12.9166 18.7503H16.4166L17 12.917H18.75V11.167C18.7493 10.2745 18.4562 9.40685 17.9155 8.69674C17.3749 7.98663 16.6165 7.4732 15.7564 7.23502C14.8963 6.99683 13.9818 7.047 13.1529 7.37786C12.324 7.70871 11.6263 8.30202 11.1666 9.06701" stroke="#555658" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </span>
    }
    if (value === 2) {
        Html = <span className="icon flex justify-center mr-4 ml-1.5">
            <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.4478 7.8418L12.4344 8.60869" stroke="#555658" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M11.8791 3.28276L9.18178 4.1741C8.97305 4.24281 8.74634 4.23236 8.54483 4.14472C8.34332 4.05709 8.18107 3.8984 8.089 3.69888C7.98976 3.48591 7.9772 3.2427 8.05397 3.02064C8.13075 2.79858 8.29085 2.61506 8.50044 2.50888L11.113 1.19521C11.3357 1.08291 11.579 1.01751 11.828 1.00306C12.077 0.988612 12.3263 1.02542 12.5604 1.11121L16.4283 2.52599" stroke="#555658" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M3.53278 7.84807H5.43444L8.166 10.9094C8.30511 11.0706 8.49018 11.1854 8.6964 11.2384C8.90262 11.2914 9.12012 11.2801 9.31971 11.2059C9.51931 11.1318 9.69145 10.9984 9.81305 10.8236C9.93464 10.6488 9.99988 10.441 10 10.2281V9.74974L10.1361 9.80419C10.3315 9.88234 10.5431 9.91143 10.7523 9.8889C10.9615 9.86638 11.1621 9.79292 11.3364 9.67497C11.5106 9.55702 11.6534 9.39816 11.7521 9.21228C11.8507 9.02641 11.9024 8.81919 11.9024 8.60874H12.2828C12.4947 8.6086 12.7024 8.54948 12.8826 8.43801C13.0628 8.32655 13.2085 8.16712 13.3032 7.97758C13.398 7.78805 13.4382 7.57587 13.4192 7.36481C13.4002 7.15375 13.3229 6.95213 13.1959 6.78252L10.7544 3.6543" stroke="#555658" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M8.89787 2.3083L8.61942 2.07885C8.33884 1.87224 7.99954 1.76078 7.65109 1.76074C7.44346 1.76067 7.23776 1.80054 7.0452 1.87819L3.58331 3.26263" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M1.25 1.93913H2.80556C3.00306 1.93089 3.19578 2.00124 3.34155 2.13476C3.48731 2.26828 3.57425 2.4541 3.58333 2.65157V7.64257C3.57425 7.8401 3.48733 8.02601 3.34159 8.15965C3.19585 8.29329 3.00313 8.36381 2.80556 8.35579H1.25" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M18.75 8.35579H17.1945C16.9969 8.36381 16.8042 8.29329 16.6584 8.15965C16.5127 8.02601 16.4258 7.8401 16.4167 7.64257V2.65157C16.4258 2.4541 16.5127 2.26828 16.6585 2.13476C16.8042 2.00124 16.997 1.93089 17.1945 1.93913H18.75" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M9.99999 9.74992L9.23932 8.98926" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M11.9025 8.60857L10.7607 7.4668" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

        </span>
    }
    if (value === 3) {
        Html = <span className="icon flex justify-center mr-4 ml-1.5">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.58331 13H17.5833" stroke="#555658" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M3.58331 15.333H17.5833" stroke="#555658" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M3 5.41667C3 5.79969 3.07544 6.17896 3.22202 6.53283C3.36859 6.88669 3.58343 7.20822 3.85427 7.47906C4.12511 7.7499 4.44664 7.96474 4.80051 8.11131C5.15437 8.25789 5.53364 8.33333 5.91667 8.33333C6.29969 8.33333 6.67896 8.25789 7.03283 8.11131C7.38669 7.96474 7.70822 7.7499 7.97906 7.47906C8.2499 7.20822 8.46474 6.88669 8.61131 6.53283C8.75789 6.17896 8.83333 5.79969 8.83333 5.41667C8.83333 5.03364 8.75789 4.65437 8.61131 4.30051C8.46474 3.94664 8.2499 3.62511 7.97906 3.35427C7.70822 3.08343 7.38669 2.86859 7.03283 2.72202C6.67896 2.57544 6.29969 2.5 5.91667 2.5C5.53364 2.5 5.15437 2.57544 4.80051 2.72202C4.44664 2.86859 4.12511 3.08343 3.85427 3.35427C3.58343 3.62511 3.36859 3.94664 3.22202 4.30051C3.07544 4.65437 3 5.03364 3 5.41667V5.41667Z" stroke="#555658" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M11.1667 5.41667C11.1667 5.79969 11.2421 6.17896 11.3887 6.53283C11.5353 6.88669 11.7501 7.20822 12.021 7.47906C12.2918 7.7499 12.6133 7.96474 12.9672 8.11131C13.3211 8.25789 13.7003 8.33333 14.0834 8.33333C14.4664 8.33333 14.8456 8.25789 15.1995 8.11131C15.5534 7.96474 15.8749 7.7499 16.1457 7.47906C16.4166 7.20822 16.6314 6.88669 16.778 6.53283C16.9246 6.17896 17 5.79969 17 5.41667C17 5.03364 16.9246 4.65437 16.778 4.30051C16.6314 3.94664 16.4166 3.62511 16.1457 3.35427C15.8749 3.08343 15.5534 2.86859 15.1995 2.72202C14.8456 2.57544 14.4664 2.5 14.0834 2.5C13.7003 2.5 13.3211 2.57544 12.9672 2.72202C12.6133 2.86859 12.2918 3.08343 12.021 3.35427C11.7501 3.62511 11.5353 3.94664 11.3887 4.30051C11.2421 4.65437 11.1667 5.03364 11.1667 5.41667V5.41667Z" stroke="#555658" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M8.83331 5.47233C8.83331 5.16291 8.95623 4.86617 9.17502 4.64737C9.39381 4.42858 9.69056 4.30566 9.99998 4.30566C10.3094 4.30566 10.6061 4.42858 10.8249 4.64737C11.0437 4.86617 11.1666 5.16291 11.1666 5.47233" stroke="#555658" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M18.75 5.41699H17" stroke="#555658" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M3 5.41699H1.25" stroke="#555658" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M18.75 17.667H3.58333C2.96449 17.667 2.371 17.4212 1.93342 16.9836C1.49583 16.546 1.25 15.9525 1.25 15.3337V13.0003C1.25 12.3815 1.49583 11.788 1.93342 11.3504C2.371 10.9128 2.96449 10.667 3.58333 10.667H18.75" stroke="#555658" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </span>
    }
    if (value === 4) {
        Html = <span className="icon flex justify-center mr-4 ml-1.5">
            <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.58331 9.93359V16.3503H8.24998V11.6836C8.24998 11.3742 8.3729 11.0774 8.59169 10.8586C8.81048 10.6398 9.10723 10.5169 9.41665 10.5169H10.5833C10.8927 10.5169 11.1895 10.6398 11.4083 10.8586C11.6271 11.0774 11.75 11.3742 11.75 11.6836V16.3503H16.4166V9.93359" stroke="#555658" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M1.25 8.76675L9.17478 0.841973C9.28312 0.733559 9.41177 0.647556 9.55336 0.588879C9.69496 0.530202 9.84673 0.5 10 0.5C10.1533 0.5 10.305 0.530202 10.4466 0.588879C10.5882 0.647556 10.7169 0.733559 10.8252 0.841973L18.75 8.76675" stroke="#555658" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M13.5 3.51628V2.34961H16.4167V6.43294" stroke="#555658" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M1.83331 16.3496H18.1666" stroke="#555658" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </span>
    }
    if (value === 5) {
        Html = <span className="icon flex justify-center mr-4 ml-1.5">
            <svg width="15" height="20" viewBox="0 0 15 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.82757 1.45812C6.85937 1.3955 6.90789 1.34291 6.96774 1.30618C7.0276 1.26944 7.09646 1.25 7.16668 1.25C7.23691 1.25 7.30577 1.26944 7.36563 1.30618C7.42548 1.34291 7.474 1.3955 7.5058 1.45812L8.29291 3.04635C8.32019 3.10084 8.36026 3.14791 8.40971 3.18354C8.45915 3.21916 8.51648 3.24228 8.5768 3.25091L10.3447 3.50602C10.4137 3.51594 10.4786 3.54482 10.5322 3.58945C10.5857 3.63408 10.6258 3.69271 10.648 3.7588C10.6697 3.82463 10.6723 3.89523 10.6557 3.96251C10.639 4.02978 10.6038 4.09099 10.5539 4.13914L9.27058 5.38359C9.22749 5.42538 9.1952 5.47702 9.1765 5.53406C9.1578 5.59111 9.15325 5.65184 9.16325 5.71103L9.46581 7.46493C9.47757 7.53366 9.46964 7.60432 9.44294 7.66873C9.41624 7.73314 9.37186 7.78868 9.31492 7.82893C9.25755 7.86957 9.19007 7.89355 9.11992 7.89821C9.04978 7.90288 8.97971 7.88806 8.91747 7.85538L7.34324 7.03249C7.28883 7.00374 7.22822 6.98872 7.16668 6.98872C7.10515 6.98872 7.04454 7.00374 6.99013 7.03249L5.4159 7.85538C5.35365 7.88806 5.28359 7.90288 5.21344 7.89821C5.1433 7.89355 5.07581 7.86957 5.01845 7.82893C4.96151 7.78868 4.91713 7.73314 4.89043 7.66873C4.86373 7.60432 4.8558 7.53366 4.86756 7.46493L5.17012 5.71103C5.1806 5.65216 5.17667 5.59162 5.15866 5.53459C5.14064 5.47757 5.10908 5.42575 5.06667 5.38359L3.78333 4.13914C3.73349 4.09099 3.69822 4.02978 3.68157 3.96251C3.66492 3.89523 3.66758 3.82463 3.68922 3.7588C3.71142 3.69271 3.75153 3.63408 3.80509 3.58945C3.85865 3.54482 3.92355 3.51594 3.99256 3.50602L5.76045 3.25091C5.82078 3.24228 5.87811 3.21916 5.92755 3.18354C5.97699 3.14791 6.01707 3.10084 6.04435 3.04635L6.82757 1.45812Z" stroke="#555658" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M0.75 10.9775L6.21728 14.9551C6.47842 15.1451 6.81576 15.2501 7.16526 15.2501C7.51477 15.2501 7.85211 15.1451 8.11324 14.9551L13.5834 10.9775" stroke="#555658" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M13.1074 14.8218L8.11842 18.4548C7.85729 18.6448 7.51995 18.7498 7.17044 18.7498C6.82093 18.7498 6.48359 18.6448 6.22246 18.4548L1.22774 14.8218C1.07781 14.7121 0.957949 14.5777 0.876013 14.4274C0.794078 14.2772 0.751925 14.1144 0.752322 13.9499V8.77607C0.75263 8.66384 0.792511 8.55407 0.867182 8.45991C0.941852 8.36576 1.04814 8.29122 1.1733 8.24524C1.29846 8.19927 1.43718 8.1838 1.57282 8.2007C1.70846 8.2176 1.83526 8.26614 1.93801 8.34052L6.22151 11.4516C6.48264 11.6417 6.81998 11.7467 7.16949 11.7467C7.51899 11.7467 7.85634 11.6417 8.11747 11.4516L12.3962 8.34052C12.4989 8.2659 12.6258 8.21714 12.7616 8.2001C12.8974 8.18307 13.0363 8.19848 13.1617 8.24448C13.287 8.29049 13.3934 8.36513 13.4682 8.45944C13.5429 8.55374 13.5827 8.6637 13.5828 8.77607V13.953C13.5827 14.117 13.5403 14.2791 13.4584 14.4288C13.3765 14.5785 13.2569 14.7124 13.1074 14.8218Z" stroke="#555658" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </span>
    }
    if (value === 6) {
        Html = <span className="icon flex justify-center mr-4 ml-1.5">
            <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.25 4H18.75V15.6667H1.25V4Z" stroke="#555658" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M13.5 4C13.5 3.07174 13.1313 2.1815 12.4749 1.52513C11.8185 0.868749 10.9283 0.5 10 0.5C9.07174 0.5 8.1815 0.868749 7.52513 1.52513C6.86875 2.1815 6.5 3.07174 6.5 4" stroke="#555658" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M1.25 8.66699H8.83333" stroke="#555658" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M11.1667 8.66699H18.75" stroke="#555658" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M9.99998 10.416C9.69056 10.416 9.39381 10.2931 9.17502 10.0743C8.95623 9.85551 8.83331 9.55877 8.83331 9.24935V8.08268C8.83331 7.77326 8.95623 7.47652 9.17502 7.25772C9.39381 7.03893 9.69056 6.91602 9.99998 6.91602C10.3094 6.91602 10.6061 7.03893 10.8249 7.25772C11.0437 7.47652 11.1666 7.77326 11.1666 8.08268V9.24935C11.1666 9.55877 11.0437 9.85551 10.8249 10.0743C10.6061 10.2931 10.3094 10.416 9.99998 10.416Z" stroke="#555658" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </span>
    }
    if (value === 7) {
        Html = <span className="icon flex justify-center mr-4 ml-1.5">
            <svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.85968 3.4375C4.85968 4.01766 5.09015 4.57406 5.50038 4.9843C5.91062 5.39453 6.46702 5.625 7.04718 5.625C7.62734 5.625 8.18374 5.39453 8.59398 4.9843C9.00421 4.57406 9.23468 4.01766 9.23468 3.4375C9.23468 2.85734 9.00421 2.30094 8.59398 1.8907C8.18374 1.48047 7.62734 1.25 7.04718 1.25C6.46702 1.25 5.91062 1.48047 5.50038 1.8907C5.09015 2.30094 4.85968 2.85734 4.85968 3.4375V3.4375Z" stroke="#555658" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M13.2972 17.4997C13.2972 17.8312 13.1655 18.1491 12.9311 18.3835C12.6967 18.618 12.3787 18.7497 12.0472 18.7497H4.54719C4.27647 18.7499 4.01297 18.6623 3.79633 18.4999C3.57968 18.3376 3.42161 18.1093 3.34587 17.8494C3.27013 17.5894 3.28082 17.312 3.37634 17.0586C3.47185 16.8053 3.64703 16.5899 3.87553 16.4447L9.89469 12.6113L8.94886 10.0863L6.84219 11.5863C6.32845 11.9513 5.69606 12.1093 5.07103 12.0288C4.44601 11.9483 3.87425 11.6353 3.46969 11.1522L1.08886 8.29717C0.972231 8.17299 0.882216 8.02628 0.824342 7.86606C0.766468 7.70583 0.741956 7.53546 0.752312 7.36542C0.762668 7.19538 0.807672 7.02925 0.884563 6.87723C0.961453 6.72521 1.06861 6.59051 1.19944 6.4814C1.33028 6.3723 1.48203 6.29109 1.64539 6.24276C1.80875 6.19443 1.98027 6.18001 2.14941 6.20037C2.31854 6.22073 2.48173 6.27545 2.62895 6.36117C2.77618 6.44689 2.90432 6.56179 3.00553 6.69883L5.38803 9.55716L8.81803 7.10716C8.97436 6.99574 9.15426 6.92183 9.34378 6.89115C9.53329 6.86048 9.72732 6.87387 9.91082 6.93028C10.0943 6.98669 10.2624 7.08461 10.4019 7.21645C10.5415 7.34829 10.6488 7.5105 10.7155 7.6905L12.2339 11.7405C12.433 12.2778 12.4424 12.8671 12.2605 13.4105C12.0786 13.9539 11.7163 14.4188 11.2339 14.728L8.83886 16.2497H12.0472C12.3787 16.2497 12.6967 16.3814 12.9311 16.6158C13.1655 16.8502 13.2972 17.1681 13.2972 17.4997Z" stroke="#555658" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </span>
    }
    return Html
}

const relationshipCount = (data) => {
    return data.length > 0 ? data.length : ""
}

const Sidebar = ({ callClick, selectButton, activeClass, relataionShip, sidebarValue, moduleName }) => {
    const [viewDropdown, setViewDropdown] = useState(false);
    const activeClassOnSelectButton = (selectedButton) => {
        return selectButton === selectedButton ? activeClass : ""
    }
    return (
        <div className="tw-sidebar-items-wrap w-full relative sm:min-w-60 min-w-full">
            <div className="device-cat-dd md:hidden">
                <ClickAwayListener onClickAway={() => setViewDropdown(false)}>
                    <div className={`tw-sidebar-items-wrap w-full relative sm:min-w-60 min-w-full pl-0 sm:pl-4 md:pl-0 ${viewDropdown ? "dd-open" : ""}`}>
                        <div className="device-cat-dd">
                            <div className="active-cat-item is-relative flex md:w-full items-center" onClick={() => setViewDropdown((prev) => !prev)}>
                                {SideBariconDynamicContent(selectButton)}
                                <Typography size={14} weight="medium">
                                    {moduleName}
								</Typography>
                                <span className="absolute right-4 top-4">
                                    <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11 1.13833L6.23556 5.90233C6.20464 5.93329 6.16792 5.95786 6.1275 5.97461C6.08708 5.99137 6.04376 6 6 6C5.95624 6 5.91292 5.99137 5.8725 5.97461C5.83208 5.95786 5.79536 5.93329 5.76444 5.90233L1 1.13833" stroke="#747578" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <div className={`w-full absolute overflow-visible bg-white z-10 shadow md:shadow-none rounded-lg w-full py-2 lg:py-1 ${!viewDropdown ? "hidden" : ""} block`}>
                            <div className="tw-sidebar-list-items clue-item text-gray-6">
                                {sidebarValue.map((keyName,index) => {
                                    const _count = keyName.id === 1 ? relationshipCount(relataionShip) : getConnectionTypeFromRelationship(relataionShip, keyName.callingname) 
                                    return <button key={index} className={`tw-list-item rounded-full flex items-center w-full ${activeClassOnSelectButton(keyName.id)}`} onClick={() => { callClick(keyName.id, keyName.sidenavname, keyName);setViewDropdown(false) }}>
                                        {SideBariconDynamicContent(keyName.id)}
                                         <span className="defaultText text-sm typo-font-medium">{keyName.sidenavname}</span>
                                        { _count > 0 && <span className="defaultText text-sm typo-font-regular"><span className="count pl-2">({_count})</span></span>}
                                    </button>
                                    // : getConnectionTypeFromRelationship(relataionShip, keyName.callingname)
                                })}
                            </div>
                        </div>
                    </div>
                </ClickAwayListener>
            </div>
            <div className="w-full dd-content absolute overflow-visible lg:relative z-10 shadow md:shadow-none rounded-lg w-full py-2 lg:py-1 hidden md:block">
                <div className="tw-sidebar-list-items text-gray-6">
                    {sidebarValue.map(keyName => {
                        const _count = keyName.id === 1 ? relationshipCount(relataionShip) : getConnectionTypeFromRelationship(relataionShip, keyName.callingname) 
                        return <button className={`tw-list-item rounded-full flex items-center w-full ${activeClassOnSelectButton(keyName.id)}`} onClick={() => callClick(keyName.id, keyName.sidenavname, keyName)}>
                            {SideBariconDynamicContent(keyName.id)}
                            <span className="defaultText text-sm typo-font-medium">{keyName.sidenavname}</span>
                            { _count > 0 && <span className="defaultText text-sm typo-font-regular"><span className="count pl-2">({_count})</span></span>}
                            {/* : getConnectionTypeFromRelationship(relataionShip, keyName.callingname) */}
                        </button>
                    })}
                    
                </div>
            </div>
        </div>

    )
}

export default Sidebar