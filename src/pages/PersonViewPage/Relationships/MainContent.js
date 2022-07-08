import React from "react";
import { showBirthandDeath } from "shared-logics"
import { useHistory } from "react-router-dom";
import { getPersonProfileUrl } from "../../../components/utils/genderIcon"
import Button from "../../../components/Button";
import { strFirstUpCase } from "../../../utils";
import "./index.css";
const getName = (person) => {
    let name = []
    if (person && person.givenName) {
        name.push(strFirstUpCase(person.givenName))
    }
    if (person && person.surname) {
        name.push(strFirstUpCase(person.surname))
    }
    return name.join(' ')
}
const DynamicContent = (value) => {
    let Html;
    if (value === 1 || value === 8) {
        Html = <svg width="63" height="60" viewBox="0 0 63 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.48448 9.46667C8.48448 11.447 9.29671 13.3461 10.7425 14.7464C12.1883 16.1467 14.1492 16.9333 16.1938 16.9333C18.2385 16.9333 20.1994 16.1467 21.6451 14.7464C23.0909 13.3461 23.9031 11.447 23.9031 9.46667C23.9031 7.48638 23.0909 5.58721 21.6451 4.18694C20.1994 2.78666 18.2385 2 16.1938 2C14.1492 2 12.1883 2.78666 10.7425 4.18694C9.29671 5.58721 8.48448 7.48638 8.48448 9.46667V9.46667Z" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M29.6851 33.7337C29.6851 30.2682 28.2637 26.9446 25.7336 24.4941C23.2035 22.0437 19.7719 20.667 16.1938 20.667C12.6157 20.667 9.18412 22.0437 6.654 24.4941C4.12388 26.9446 2.70248 30.2682 2.70248 33.7337V39.3337H8.48448L10.4118 58.0003H21.9758L23.9031 39.3337H29.6851V33.7337Z" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M39.3218 9.46667C39.3218 11.447 40.134 13.3461 41.5798 14.7464C43.0256 16.1467 44.9865 16.9333 47.0311 16.9333C49.0758 16.9333 51.0367 16.1467 52.4825 14.7464C53.9283 13.3461 54.7405 11.447 54.7405 9.46667C54.7405 7.48638 53.9283 5.58721 52.4825 4.18694C51.0367 2.78666 49.0758 2 47.0311 2C44.9865 2 43.0256 2.78666 41.5798 4.18694C40.134 5.58721 39.3218 7.48638 39.3218 9.46667V9.46667Z" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M35.4671 39.3331H39.3218L41.2491 57.9997H52.8131L54.7404 39.3331H60.5224V33.7331C60.5201 30.8771 59.5517 28.1005 57.7655 25.8282C55.9792 23.5558 53.4735 21.9129 50.6316 21.1507C47.7898 20.3885 44.7684 20.549 42.0297 21.6078C39.2911 22.6665 36.9859 24.5651 35.4671 27.0131" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    }
    if (value === 2) {
        Html = <svg width="67" height="64" viewBox="0 0 67 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M54.9159 37.8945L41.6559 40.3486" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M39.821 23.3048L30.909 26.1571C30.2194 26.377 29.4704 26.3435 28.8046 26.0631C28.1388 25.7827 27.6027 25.2749 27.2985 24.6364C26.9706 23.9549 26.9291 23.1766 27.1828 22.466C27.4364 21.7554 27.9654 21.1682 28.6579 20.8284L37.2898 16.6247C38.0255 16.2653 38.8296 16.056 39.6522 16.0098C40.4748 15.9636 41.2984 16.0813 42.0721 16.3559L54.8516 20.8832" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12.2448 37.9142H18.5279L27.5529 47.7105C28.0125 48.2263 28.624 48.5937 29.3054 48.7633C29.9867 48.9329 30.7053 48.8966 31.3648 48.6593C32.0242 48.4221 32.593 47.9951 32.9948 47.4358C33.3965 46.8765 33.6121 46.2116 33.6125 45.5302V43.9996L34.0622 44.1738C34.7078 44.4239 35.4068 44.517 36.0981 44.4449C36.7894 44.3728 37.452 44.1377 38.0278 43.7603C38.6036 43.3828 39.0752 42.8745 39.4012 42.2797C39.7273 41.6849 39.8979 41.0218 39.8981 40.3484H41.1548C41.8549 40.3479 42.5411 40.1587 43.1366 39.802C43.732 39.4453 44.2132 38.9352 44.5264 38.3287C44.8395 37.7221 44.9721 37.0432 44.9095 36.3678C44.8469 35.6924 44.5914 35.0472 44.1717 34.5045L36.1051 24.4941" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M29.9712 20.1867L29.0512 19.4525C28.1241 18.7914 27.0031 18.4347 25.8518 18.4346C25.1658 18.4343 24.4862 18.5619 23.8499 18.8104L12.4119 23.2406" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M4.70251 19.004H9.84207C10.4946 18.9777 11.1314 19.2028 11.613 19.6301C12.0946 20.0573 12.3818 20.652 12.4118 21.2839V37.2551C12.3818 37.8872 12.0947 38.482 11.6131 38.9097C11.1316 39.3374 10.4949 39.563 9.84207 39.5374H4.70251" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M62.5226 39.5374H57.383C56.7302 39.563 56.0935 39.3374 55.6119 38.9097C55.1304 38.482 54.8433 37.8872 54.8132 37.2551V21.2839C54.8432 20.652 55.1305 20.0573 55.6121 19.6301C56.0937 19.2028 56.7305 18.9777 57.383 19.004H62.5226" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M33.6125 43.9996L31.0992 41.5654" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M39.8982 40.349L36.1257 36.6953" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    }
    if (value === 3) {
        Html = <svg width="63" height="53" viewBox="0 0 63 53" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.4116 35.5996H56.6676" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M10.4116 43.0664H56.6676" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M8.48438 11.3333C8.48437 12.559 8.73363 13.7727 9.21792 14.905C9.70221 16.0374 10.412 17.0663 11.3069 17.933C12.2017 18.7997 13.2641 19.4872 14.4332 19.9562C15.6024 20.4253 16.8555 20.6667 18.121 20.6667C19.3865 20.6667 20.6397 20.4253 21.8088 19.9562C22.978 19.4872 24.0403 18.7997 24.9352 17.933C25.83 17.0663 26.5399 16.0374 27.0242 14.905C27.5084 13.7727 27.7577 12.559 27.7577 11.3333C27.7577 10.1077 27.5084 8.89399 27.0242 7.76162C26.5399 6.62925 25.83 5.60035 24.9352 4.73367C24.0403 3.86699 22.978 3.1795 21.8088 2.71046C20.6397 2.24141 19.3865 2 18.121 2C16.8555 2 15.6024 2.24141 14.4332 2.71046C13.2641 3.1795 12.2017 3.86699 11.3069 4.73367C10.412 5.60035 9.70221 6.62925 9.21792 7.76162C8.73363 8.89399 8.48437 10.1077 8.48438 11.3333V11.3333Z" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M35.467 11.3333C35.467 12.559 35.7163 13.7727 36.2006 14.905C36.6849 16.0374 37.3947 17.0663 38.2896 17.933C39.1844 18.7997 40.2467 19.4872 41.4159 19.9562C42.5851 20.4253 43.8382 20.6667 45.1037 20.6667C46.3692 20.6667 47.6223 20.4253 48.7915 19.9562C49.9607 19.4872 51.023 18.7997 51.9179 17.933C52.8127 17.0663 53.5225 16.0374 54.0068 14.905C54.4911 13.7727 54.7404 12.559 54.7404 11.3333C54.7404 10.1077 54.4911 8.89399 54.0068 7.76162C53.5225 6.62925 52.8127 5.60035 51.9179 4.73367C51.023 3.86699 49.9607 3.1795 48.7915 2.71046C47.6223 2.24141 46.3692 2 45.1037 2C43.8382 2 42.5851 2.24141 41.4159 2.71046C40.2467 3.1795 39.1844 3.86699 38.2896 4.73367C37.3947 5.60035 36.6849 6.62925 36.2006 7.76162C35.7163 8.89399 35.467 10.1077 35.467 11.3333V11.3333Z" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M27.7578 11.5097C27.7578 10.5196 28.1639 9.56997 28.8868 8.86983C29.6097 8.1697 30.5902 7.77637 31.6125 7.77637C32.6348 7.77637 33.6153 8.1697 34.3381 8.86983C35.061 9.56997 35.4671 10.5196 35.4671 11.5097" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M60.5225 11.333H54.7405" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M8.48439 11.333H2.70239" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M60.5224 50.5338H10.4117C8.36708 50.5338 6.40618 49.7471 4.9604 48.3468C3.51462 46.9466 2.70239 45.0474 2.70239 43.0671V35.6005C2.70239 33.6202 3.51462 31.721 4.9604 30.3207C6.40618 28.9205 8.36708 28.1338 10.4117 28.1338H60.5224" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    }
    if (value === 4) {
        Html = <svg width="63" height="55" viewBox="0 0 63 55" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.4116 32.1865V52.7199H25.8303V37.7865C25.8303 36.7964 26.2364 35.8468 26.9593 35.1467C27.6822 34.4465 28.6626 34.0532 29.685 34.0532H33.5396C34.5619 34.0532 35.5424 34.4465 36.2653 35.1467C36.9882 35.8468 37.3943 36.7964 37.3943 37.7865V52.7199H52.813V32.1865" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M2.70215 28.4536L28.8856 3.09431C29.2436 2.74739 29.6686 2.47218 30.1365 2.28441C30.6043 2.09664 31.1057 2 31.6121 2C32.1186 2 32.62 2.09664 33.0878 2.28441C33.5557 2.47218 33.9807 2.74739 34.3387 3.09431L60.5221 28.4536" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M43.1763 11.6533V7.91992H52.8129V20.9866" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M4.62939 52.7207H58.5947" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    }
    if (value === 5) {
        Html = <svg width="67" height="64" viewBox="0 0 67 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M33.0428 4.66599C33.1479 4.46562 33.3082 4.29733 33.506 4.17978C33.7037 4.06222 33.9312 4 34.1633 4C34.3953 4 34.6228 4.06222 34.8206 4.17978C35.0183 4.29733 35.1786 4.46562 35.2837 4.66599L37.8843 9.74833C37.9745 9.9227 38.1069 10.0733 38.2702 10.1873C38.4336 10.3013 38.623 10.3753 38.8223 10.4029L44.6634 11.2193C44.8914 11.251 45.1059 11.3434 45.2828 11.4862C45.4598 11.6291 45.5923 11.8167 45.6657 12.0282C45.7372 12.2388 45.7459 12.4648 45.6909 12.68C45.6359 12.8953 45.5194 13.0912 45.3547 13.2452L41.1146 17.2275C40.9722 17.3612 40.8655 17.5265 40.8037 17.709C40.7419 17.8915 40.7269 18.0859 40.7599 18.2753L41.7596 23.8878C41.7984 24.1077 41.7722 24.3338 41.684 24.5399C41.5958 24.7461 41.4492 24.9238 41.261 25.0526C41.0715 25.1826 40.8485 25.2593 40.6168 25.2743C40.385 25.2892 40.1535 25.2418 39.9479 25.1372L34.7466 22.504C34.5668 22.412 34.3666 22.3639 34.1633 22.3639C33.96 22.3639 33.7597 22.412 33.5799 22.504L28.3787 25.1372C28.173 25.2418 27.9415 25.2892 27.7098 25.2743C27.478 25.2593 27.255 25.1826 27.0655 25.0526C26.8774 24.9238 26.7307 24.7461 26.6425 24.5399C26.5543 24.3338 26.5281 24.1077 26.567 23.8878L27.5666 18.2753C27.6013 18.0869 27.5883 17.8932 27.5287 17.7107C27.4692 17.5282 27.3649 17.3624 27.2248 17.2275L22.9847 13.2452C22.82 13.0912 22.7035 12.8953 22.6485 12.68C22.5935 12.4648 22.6022 12.2388 22.6737 12.0282C22.7471 11.8167 22.8796 11.6291 23.0566 11.4862C23.2335 11.3434 23.4479 11.251 23.676 11.2193L29.5171 10.4029C29.7164 10.3753 29.9058 10.3013 30.0692 10.1873C30.2325 10.0733 30.3649 9.9227 30.4551 9.74833L33.0428 4.66599Z" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12.9624 35.1279L31.0263 47.8562C31.8891 48.4643 33.0037 48.8002 34.1584 48.8002C35.3132 48.8002 36.4278 48.4643 37.2906 47.8562L55.3639 35.1279" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M53.7915 47.4307L37.3078 59.0563C36.445 59.6644 35.3305 60.0003 34.1757 60.0003C33.0209 60.0003 31.9063 59.6644 31.0436 59.0563L14.541 47.4307C14.0456 47.0796 13.6496 46.6496 13.3789 46.1687C13.1082 45.6879 12.9689 45.1671 12.9702 44.6406V28.0844C12.9712 27.7253 13.103 27.374 13.3497 27.0727C13.5964 26.7714 13.9476 26.5329 14.3611 26.3858C14.7747 26.2386 15.233 26.1891 15.6811 26.2432C16.1293 26.2973 16.5482 26.4526 16.8877 26.6906L31.0404 36.6462C31.9032 37.2543 33.0178 37.5903 34.1725 37.5903C35.3273 37.5903 36.4419 37.2543 37.3047 36.6462L51.4416 26.6906C51.781 26.4518 52.2003 26.2958 52.6489 26.2413C53.0976 26.1868 53.5566 26.2361 53.9707 26.3833C54.3849 26.5305 54.7365 26.7694 54.9834 27.0712C55.2302 27.373 55.3618 27.7248 55.3623 28.0844V44.6506C55.3618 45.1754 55.2217 45.6943 54.951 46.1733C54.6804 46.6523 54.2853 47.0808 53.7915 47.4307Z" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    }
    if (value === 6) {
        Html = <svg width="67" height="64" viewBox="0 0 67 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.70215 19.2002H62.5221V56.5335H4.70215V19.2002Z" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M45.1763 19.2C45.1763 16.2296 43.958 13.3808 41.7893 11.2804C39.6206 9.18 36.6793 8 33.6123 8C30.5454 8 27.604 9.18 25.4354 11.2804C23.2667 13.3808 22.0483 16.2296 22.0483 19.2" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M4.70215 34.1338H29.7575" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M37.4668 34.1338H62.5221" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M33.612 39.7313C32.5897 39.7313 31.6092 39.3379 30.8863 38.6378C30.1634 37.9376 29.7573 36.9881 29.7573 35.9979V32.2646C29.7573 31.2744 30.1634 30.3249 30.8863 29.6247C31.6092 28.9246 32.5897 28.5313 33.612 28.5312C34.6343 28.5313 35.6148 28.9246 36.3377 29.6247C37.0605 30.3249 37.4667 31.2744 37.4667 32.2646V35.9979C37.4667 36.9881 37.0605 37.9376 36.3377 38.6378C35.6148 39.3379 34.6343 39.7313 33.612 39.7313Z" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    }
    if (value === 7) {
        Html = <svg width="67" height="64" viewBox="0 0 67 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M26.54 11C26.54 12.8565 27.3015 14.637 28.6569 15.9497C30.0123 17.2625 31.8507 18 33.7675 18C35.6844 18 37.5227 17.2625 38.8782 15.9497C40.2336 14.637 40.995 12.8565 40.995 11C40.995 9.14349 40.2336 7.36301 38.8782 6.05025C37.5227 4.7375 35.6844 4 33.7675 4C31.8507 4 30.0123 4.7375 28.6569 6.05025C27.3015 7.36301 26.54 9.14349 26.54 11V11Z" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M54.4178 55.9999C54.4178 57.0608 53.9827 58.0782 53.2082 58.8283C52.4337 59.5785 51.3832 59.9999 50.2878 59.9999H25.5078C24.6134 60.0008 23.7428 59.7203 23.027 59.2008C22.3112 58.6813 21.7889 57.9507 21.5387 57.1189C21.2884 56.2872 21.3237 55.3993 21.6393 54.5886C21.9549 53.778 22.5337 53.0886 23.2887 52.6239L43.176 40.3572L40.051 32.2772L33.0905 37.0772C31.3931 38.2451 29.3037 38.7507 27.2386 38.4932C25.1735 38.2357 23.2844 37.2341 21.9478 35.6879L14.0815 26.5519C13.6962 26.1545 13.3988 25.6851 13.2075 25.1724C13.0163 24.6596 12.9353 24.1145 12.9696 23.5703C13.0038 23.0262 13.1525 22.4946 13.4065 22.0081C13.6606 21.5216 14.0146 21.0906 14.4469 20.7415C14.8791 20.3923 15.3806 20.1325 15.9203 19.9778C16.46 19.8232 17.0267 19.777 17.5855 19.8422C18.1444 19.9073 18.6836 20.0824 19.17 20.3567C19.6564 20.631 20.0798 20.9987 20.4142 21.4372L28.286 30.5839L39.6187 22.7439C40.1352 22.3874 40.7296 22.1508 41.3558 22.0527C41.9819 21.9545 42.623 21.9973 43.2293 22.1779C43.8356 22.3584 44.3908 22.6717 44.8519 23.0936C45.3129 23.5155 45.6675 24.0346 45.888 24.6106L50.9046 37.5706C51.5625 39.2901 51.5936 41.1757 50.9926 42.9147C50.3916 44.6536 49.1947 46.1412 47.6006 47.1306L39.6875 51.9999H50.2878C51.3832 51.9999 52.4337 52.4213 53.2082 53.1715C53.9827 53.9216 54.4178 54.939 54.4178 55.9999Z" stroke="#747578" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    }
    return Html
}
const handleOnClick = (setOpenModal) => {
    setOpenModal(true)
}

const forDeletion = ['Family',
    'Friend',
    'Classmate',
    'Neighbor',
    'Military Comrade',
    'Colleague',
    'Fellow Congregant',]
const isLiving = (comingValue) => {
    return comingValue === "yes" ? true : false
}
const MainContent = ({ value, treeProfileId, disableoption, moduleName, moduleObj, setOpenModal, relataionShip, name }) => {
    relataionShip = value == 8 ? relataionShip.filter(key => key.connectionType === "Other") : relataionShip
    const history = useHistory();
    const gotoPersonpage = (personData) => {
        history.push(`/family/person-page/${treeProfileId}/${personData.personId}`);
    }
    return (

        <div className="all-stories-container flex flex-grow pt-6 lg:pt-0 ">
            <div className="middle-content-col flex flex-grow">
                <div className="sideBar md:pl-11 w-full">
                    <div className="flex items-center mb-6">
                        <div className="w-full">
                            <div className="text-gray-7 typo-font-bold text-2xl">{moduleName}</div>
                        </div>
                    </div>
                    {relataionShip.length > 0 &&
                        <div className="p-4 md:p-6 md:pb-2 pb-0 bg-white border-1 border-gray-3 rounded-lg">
                            {relataionShip && relataionShip.map(x => (
                                <>
                                    <div className="flex items-center mb-4">
                                        <div className="w-full lg:w-1/2 sm:pr-2">
                                            {!disableoption && x.isLiving === "Yes" ? (
                                                <div className="flex items-center" >
                                                    <div>
                                                        <img src={getPersonProfileUrl(x)} alt="Story Pic" className="object-cover w-10 h-10 rounded" />
                                                    </div>
                                                    <div className="pl-2" >
                                                        <h2 className="text-sm font-semibold" >{getName(x)}</h2>
                                                        <p className="text-xs text-gray-4 pt-1 break-all">{showBirthandDeath(x.birthDate, x.deathDate, isLiving(x.isLiving), disableoption)}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="Relationperson flex items-center" onClick={() => gotoPersonpage(x)}>
                                                    <div>
                                                        <img src={getPersonProfileUrl(x)} alt="Story Pic" className="object-cover w-10 h-10 rounded" />
                                                    </div>
                                                    <div className="pl-2" >
                                                        <h2 className="text-sm font-semibold break-all hover:text-blue-5 hover:underline cursor-pointer" >{getName(x)}</h2>
                                                        <p className="text-xs text-gray-4 pt-1 break-all">{showBirthandDeath(x.birthDate, x.deathDate, x.isLiving, disableoption)}</p>
                                                    </div>
                                                </div>
                                            )
                                            }

                                        </div>
                                        {[1].includes(value) &&
                                            <div className="lg:w-1/2 w-4/12 flex text-sm sm:pl-2">
                                                <div className="w-full text-right xl:text-left">
                                                    <span className="text-gray-5 capitalize">{[...new Set(x.connection)].join(', ')
                                                    }</span>
                                                </div>
                                            </div>
                                        }
                                        {x.connectionType === "Other" && [8].includes(value) &&
                                            <div className="lg:w-1/2 w-4/12 flex text-sm sm:pl-2">
                                                <div className="w-full text-right xl:text-left">
                                                    <span className="text-gray-5 capitalize">{[...new Set(x.connection.filter(item => !forDeletion.includes(item))
                                                    )].join(', ')}</span>
                                                </div>
                                            </div>
                                        }

                                    </div>
                                </>
                            ))}
                        </div>
                    }
                    {relataionShip.length === 0 &&
                        <div class="no-record w-full max-w-full mt-3 border border-gray-3 text-center bg-gray-1 overflow-hidden relative rounded-lg px-5 py-6 flex items-center flex-col">
                            <div class="w-full flex justify-center mb-5">
                                {DynamicContent(value)}
                            </div>
                            <div class="head mb-5" style={{ maxWidth: 547 }}>
                                <span class="defaultText secondary-color text-base typo-font-regular">
                                    {`${name} has no ${moduleObj.noContent} listed.`} {disableoption && `Would you like to add one now?`}
                                </span>
                            </div>
                            {disableoption && <div class="button-wrap">
                                <Button
                                    handleClick={() => handleOnClick(setOpenModal)}
                                    size="large"
                                    title={`${moduleObj.addbutton}`}
                                    fontWeight="medium"
                                />
                            </div>}

                        </div>
                    }

                </div>
            </div>
        </div>
    )
}


export default MainContent;