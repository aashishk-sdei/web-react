import { useMsal } from "@azure/msal-react";
import React from "react";
import { Link } from "react-router-dom";
import { b2cPolicies } from "../../authConfig";
import Button from "../../components/Button";
import { getAccessCode, getAccessToken, setUserFlow } from "../../services";
import "./index.css";
const PrivacyPage = () => {
  const hostUrl = window.location.origin;
  const isAccessedPrivacy = getAccessCode();
  const isAccessTokenPrivacy = getAccessToken()
  const { instance } = useMsal();

  const PrivacyHeader = () => {
    return (
      <div className="shadow-md header bg-white z-500" style={{ zIndex: 100 }}>
        <div className="main-wrapper mx-auto max-w-full-header">
          <div className="header-section">
            <div className="flex">
              <Link
                to="/"
                className="focus:outline-none "
              >
                <svg
                  width="122"
                  viewBox="0 0 122 26"
                  height="26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    fill="#F83D3D"
                    d="M13.6415 0H25.9958V26H13.6415V0ZM38.1226 19.4929C37.3958 18.9019 36.8479 18.1116 36.4805 17.1232L33.3986 18.5764C33.9602 20.2051 34.8902 21.46 36.1895 22.342C37.4875 23.224 38.9905 23.6649 40.6956 23.6649C41.6262 23.6649 42.5076 23.524 43.3415 23.2432C44.1753 22.9625 44.9016 22.5555 45.5226 22.0222C46.1419 21.489 46.6367 20.8397 47.0052 20.0742C47.3732 19.3084 47.5572 18.4417 47.5572 17.4719C47.5572 16.1156 47.1648 14.9766 46.3797 14.0561C45.5951 13.1356 44.4075 12.3653 42.8184 11.7448L40.3181 10.7847C39.4847 10.4558 38.8541 10.0923 38.4278 9.6944C38.0021 9.29754 37.7887 8.78874 37.7887 8.16826C37.7887 7.47089 38.0502 6.90869 38.5733 6.48181C39.0969 6.05615 39.7655 5.84217 40.5796 5.84217C41.4518 5.84217 42.1787 6.10887 42.7602 6.64212C43.3415 7.17538 43.787 7.82969 44.0977 8.60465L47.0918 7.09265C46.5296 5.67806 45.6676 4.57757 44.5048 3.79297C43.3415 3.00782 42.0237 2.60581 40.5501 2.58598C39.6584 2.58598 38.8303 2.72184 38.0649 2.99356C37.2985 3.26474 36.6305 3.65249 36.0588 4.1564C35.4869 4.66018 35.0409 5.27101 34.7216 5.98768C34.4013 6.70489 34.2416 7.49969 34.2416 8.37206C34.2416 9.76749 34.6582 10.9205 35.4921 11.8314C36.3253 12.7429 37.4977 13.4697 39.0097 14.0119L41.4225 14.8843C43.1281 15.5048 43.9811 16.4451 43.9811 17.7047C43.9811 18.5764 43.6619 19.241 43.0222 19.6961C42.3825 20.1518 41.6263 20.3794 40.7544 20.3794C39.7264 20.3794 38.85 20.0839 38.1226 19.4929ZM53.4779 9.0729V4.85725H50.1345V9.0729H48.0117V11.9221H50.1345V18.9291C50.1345 20.4218 50.5365 21.5847 51.341 22.4179C52.1453 23.2512 53.264 23.6678 54.6984 23.6678C55.2803 23.6678 55.7842 23.6198 56.2104 23.5229C56.6367 23.4256 56.9853 23.3005 57.2571 23.1448V20.1501C57.0443 20.3053 56.7964 20.4168 56.5161 20.4842C56.2347 20.5527 55.9585 20.5861 55.6873 20.5861C54.9311 20.5861 54.3741 20.4072 54.0157 20.0482C53.6562 19.69 53.4779 19.1136 53.4779 18.3183V11.9221H57.2571V9.0729H53.4779ZM65.5737 11.8111C64.9725 11.8111 64.4155 11.9272 63.9021 12.1598C63.3887 12.3924 62.943 12.7027 62.5649 13.0905C62.1868 13.4782 61.8856 13.9436 61.6638 14.4859C61.4401 15.0288 61.3291 15.6005 61.3291 16.2012C61.3291 16.8217 61.4401 17.3984 61.6638 17.9311C61.8856 18.4644 62.1868 18.9247 62.5649 19.3119C62.943 19.7002 63.3887 20.0098 63.9021 20.2425C64.4155 20.4751 64.9725 20.5911 65.5737 20.5911C66.1749 20.5911 66.7319 20.4751 67.2454 20.2425C67.7588 20.0098 68.205 19.7002 68.5831 19.3119C68.9612 18.9247 69.2613 18.4644 69.4842 17.9311C69.7073 17.3984 69.8189 16.8217 69.8189 16.2012C69.8189 15.6005 69.7073 15.0288 69.4842 14.4859C69.2613 13.9436 68.9612 13.4782 68.5831 13.0905C68.205 12.7027 67.7588 12.3924 67.2454 12.1598C66.7319 11.9272 66.1749 11.8111 65.5737 11.8111ZM65.5737 8.72932C66.6595 8.72932 67.6671 8.92293 68.5977 9.31068C69.5279 9.69911 70.3323 10.2267 71.0105 10.8952C71.6892 11.5637 72.2168 12.354 72.5949 13.2648C72.973 14.1763 73.1622 15.1545 73.1622 16.2012C73.1622 17.2479 72.973 18.2266 72.5949 19.1374C72.2168 20.0489 71.6892 20.8386 71.0105 21.5071C70.3323 22.1762 69.5279 22.7045 68.5977 23.0917C67.6671 23.4794 66.6595 23.6736 65.5737 23.6736C64.4879 23.6736 63.4809 23.4794 62.5503 23.0915C61.6202 22.7043 60.8157 22.1762 60.1369 21.5071C59.4582 20.8386 58.9306 20.0489 58.5531 19.1374C58.1748 18.2266 57.9858 17.2479 57.9858 16.2012C57.9858 15.1545 58.175 14.1763 58.5531 13.2648C58.9306 12.354 59.4582 11.5638 60.1369 10.8952C60.8157 10.2267 61.6202 9.69911 62.5503 9.31068C63.4809 8.92293 64.4879 8.72932 65.5737 8.72932ZM82.58 12.1852C83.0062 12.1852 83.2966 12.2242 83.4518 12.3018V8.87074C83.3934 8.813 83.1806 8.78407 82.812 8.78407C81.8826 8.78407 81.0288 9.03092 80.2539 9.52505C79.4784 10.0193 78.9162 10.684 78.5675 11.5167V9.07454H75.2531V23.3207H78.5969V17.0411C78.5969 15.5682 78.9501 14.3907 79.6578 13.5081C80.3654 12.6268 81.3397 12.1852 82.58 12.1852ZM85.0866 9.06942H88.4594V23.3162H85.0866V9.06942ZM88.8375 4.91205C88.8375 5.47411 88.6387 5.95873 88.242 6.36523C87.8434 6.77281 87.3447 6.97661 86.7441 6.97661C86.182 6.97661 85.6975 6.77281 85.2904 6.36523C84.8834 5.95873 84.6801 5.47411 84.6801 4.91205C84.6801 4.33002 84.8834 3.83643 85.2904 3.42885C85.6973 3.02181 86.182 2.81856 86.7441 2.81856C87.3447 2.81856 87.8434 3.02751 88.242 3.44352C88.6387 3.86075 88.8375 4.34986 88.8375 4.91205ZM101.133 13.468C101.346 13.8756 101.482 14.3116 101.54 14.7769H93.9229C93.9806 14.3699 94.1164 13.9673 94.3299 13.5699C94.5433 13.1732 94.819 12.8245 95.1587 12.5238C95.4972 12.2233 95.8855 11.9764 96.3215 11.7817C96.7574 11.5887 97.2271 11.4912 97.7316 11.4912C98.2354 11.4912 98.7104 11.574 99.1564 11.7387C99.6019 11.9035 99.9898 12.131 100.319 12.4214C100.649 12.7124 100.92 13.0611 101.133 13.468ZM101.86 22.6705C102.945 22.0019 103.789 21.1052 104.389 19.981L101.627 18.6728C101.221 19.2931 100.745 19.8065 100.203 20.2136C99.6603 20.6206 98.9238 20.8244 97.9931 20.8244C97.4701 20.8244 96.9656 20.7327 96.4811 20.5477C95.9965 20.3642 95.5696 20.1117 95.2023 19.7919C94.8331 19.472 94.5337 19.0939 94.3011 18.658C94.0684 18.2221 93.9325 17.7421 93.894 17.219H104.854C104.874 16.812 104.884 16.4729 104.884 16.2017C104.884 15.1357 104.709 14.1474 104.36 13.236C104.011 12.3246 103.521 11.5349 102.893 10.8663C102.262 10.1977 101.516 9.6741 100.654 9.29654C99.791 8.91844 98.8366 8.72932 97.7894 8.72932C96.7624 8.72932 95.808 8.91844 94.9261 9.29654C94.0435 9.6741 93.2782 10.1977 92.6295 10.8663C91.979 11.5349 91.4706 12.3246 91.1026 13.236C90.7342 14.1474 90.5501 15.1357 90.5501 16.2017C90.5501 17.3061 90.7342 18.3144 91.1026 19.2246C91.4706 20.1367 91.979 20.9213 92.6295 21.5802C93.2782 22.2391 94.0582 22.7531 94.9697 23.121C95.8805 23.4891 96.8785 23.6736 97.9642 23.6736C99.4762 23.6736 100.774 23.3391 101.86 22.6705ZM109.424 16.1981C109.424 16.8185 109.536 17.3948 109.759 17.928C109.981 18.4613 110.282 18.9261 110.66 19.3235C111.038 19.7209 111.488 20.0355 112.012 20.2683C112.535 20.5009 113.097 20.6176 113.698 20.6176C114.299 20.6176 114.861 20.5009 115.384 20.2683C115.907 20.0355 116.359 19.7209 116.736 19.3235C117.114 18.9261 117.414 18.4613 117.638 17.928C117.86 17.3948 117.972 16.8185 117.972 16.1981C117.972 15.5776 117.86 15.0013 117.638 14.4681C117.414 13.9353 117.114 13.47 116.736 13.0726C116.359 12.6752 115.907 12.3606 115.384 12.1278C114.861 11.8947 114.299 11.7785 113.698 11.7785C113.097 11.7785 112.535 11.8947 112.012 12.1278C111.488 12.3606 111.038 12.6752 110.66 13.0726C110.282 13.47 109.981 13.9353 109.759 14.4681C109.536 15.0013 109.424 15.5776 109.424 16.1981ZM117.826 23.3212V21.2855C117.303 22.0232 116.615 22.604 115.762 23.0302C114.909 23.4565 113.988 23.6698 113 23.6698C112.012 23.6698 111.096 23.4809 110.253 23.1026C109.41 22.7251 108.678 22.2014 108.058 21.5329C107.437 20.8643 106.948 20.0747 106.59 19.1633C106.231 18.2523 106.052 17.264 106.052 16.1981C106.052 15.1513 106.231 14.1725 106.59 13.2617C106.948 12.3509 107.437 11.5606 108.058 10.8915C108.678 10.2229 109.41 9.69536 110.253 9.30761C111.096 8.91986 112.012 8.72572 113 8.72572C113.988 8.72572 114.909 8.92489 115.762 9.32229C116.615 9.71968 117.303 10.2864 117.826 11.0229V2.96912H121.17V23.3212H117.826ZM5.73273 2.72275V23.2888H12.0265V2.72275H5.73273ZM0 5.5414H4.11999V20.4556H0V5.5414Z"
                  />
                </svg>{" "}
              </Link>

            </div>

            <div className="flex ml-auto absolute right-3 top-2.5 md:top-0 md:relative">
              <div>
                <Button
                  title="Subscribe"
                  type="red"
                  handleClick={() => handleSignupPrivacy()}
                  fontWeight="medium"
                />
              </div>
              <div className="ml-1 md:ml-2.5">
                <Button
                  title="Sign in"
                  type="secondary"
                  handleClick={() => handleLoginPrivacy()}
                  fontWeight="medium"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleSignupPrivacy = () => {
    setUserFlow('signUp');
    instance.loginRedirect({
      authority: b2cPolicies.authorities.signUp.authority,
      clientId: process.env.REACT_APP_MSAL_ID,
      redirectUri: "/",
      postLogoutRedirectUri: "/",
      knownAuthorities: [],
    });
  }


  const handleLoginPrivacy = () => {
    setUserFlow('signInUp');
    instance.loginRedirect({
      authority: b2cPolicies.authorities.signUpSignInUp.authority,
      clientId: process.env.REACT_APP_MSAL_ID,
      redirectUri: "/",
      postLogoutRedirectUri: "/",
      knownAuthorities: [],
    });
  }



  return (
    <>
      {isAccessedPrivacy && !isAccessTokenPrivacy && (
        <PrivacyHeader />
      )}

      <div className="bg-gray-2 privacy">
        <div className="pt-18 md:pt-22.5 all-stories-page-wrap main-wrapper mx-auto w-full">
          <div className="bg-white rounded-lg p-7 mb-9">
            <h1 className="font-bold text-xl text-black">Privacy Policy</h1>
            <h3 className="font-bold text-base text-black mt-4">World Archives Holdings LLC</h3>
            <p className="text-sm text-black mb-4">Effective Date: 10/01/2021</p>
            <p className="text-sm text-black mb-4">Thank you for doing business with World Archives Holdings LLC (“World Archives,” “Company,” “we,” “our,” or “us”). We welcome you and hope you find our network of websites, applications, products, and other subscription services and tools (collectively, the “Services”) helpful and useful. We have adopted this privacy policy (“Privacy Policy”) to help our website visitors, users, current and potential customers, clients, their employees, our employees, and other business partners (“you” or “your,”) understand what Data we collect, store, share, and use, how and why we do so, and what your rights are in regard to that Data.</p>
            <p className="text-sm text-black mb-4">We always seek to improve our Services to you, and that requires that we collect, store, share, and use information about you and your usage preferences. As we do so, we are absolutely committed to protecting your privacy and the security of your personal information.</p>
            <p className="text-sm text-black mb-4">
              In this Privacy Policy, we use the word “Data” to describe all the information we collect that relates to you and your use of our Services. “Data” is broken into different categories, which are defined in the “Data We Collect and How We Use It” <a href={`${hostUrl}/privacy`}>{`${hostUrl}/privacy`}</a> section of this Privacy Policy. We may refer to the different categories separately, but when we use the word “Data,” we mean all the different categories described in this Privacy Policy. For clarity, the term “Data” does not apply to de-identified and aggregated data that may be derived from Data, including traffic patterns, search activity, and other information that cannot be reasonably connected with any individual (“De-identified Data”). We may use De-identified Data for our
              own purposes in any manner and without attribution or compensation to any person.
            </p>

            <h2 className="font-bold text-base text-black">1. DESCRIPTION OF SERVICES</h2>
            <p className="text-sm text-black mb-4">
              World Archives provides a set of tools and services designed to help our subscribers power their historical and genealogical research, make family connections, and build their family trees. The term “Services” in this Privacy Policy means those items defined as “Services” in our Terms of Service <a href={`${hostUrl}/terms`}>{`${hostUrl}/terms`}</a>. Our Services consist of a network of Services, including different websites, tools, applications, and products, and we share all Data with each service within the network without restriction. For your information, our network is all owned and operated by World Archives only.
            </p>

            <h2 className="font-bold text-base text-black">2. LAWFUL BASIS FOR PROCESSING</h2>
            <p className="text-sm text-black mb-4">Many jurisdictions require that we disclose to you the lawful basis for our processing of your Data. We do that in Section 4 and throughout this Privacy Policy. In general, our lawful basis for processing your Data is based on your specific consent, your contract with us, or our legitimate interest in processing that Data, all as described in this Privacy Policy.</p>
            <p className="text-sm text-black mb-4">
              By accessing or using any of the Services or by otherwise interacting with us online, you consent to our use of your Data as described in this Privacy Policy and Terms of Service. If our processing of your Data is based on your consent, you may withdraw your consent at any time, and we will cease collecting your Data. However, in some cases, this may result in your inability to receive partial or full access to the Services, and your withdrawal of consent does not limit our ability to use the Data that has been aggregated and anonymized for use by us in connection with our legitimate business efforts in the future. In addition, your withdrawal of consent does not prevent us from retaining and processing Data if we are required or allowed to do so by applicable law or in order
              to preserve legal claims. It also doesn’t prevent us from processing Data that has been gathered pursuant to a different lawful basis. For example, if you give your consent for us to process your Data, but we are also required by law to keep your Data, that separate “lawful basis” will still apply, even if you withdraw your consent.
            </p>
            <p className="text-sm text-black mb-4">When you enter into an agreement with us, either by accessing the Services, by executing an agreement in hard copy or by clicking “I Accept” or similar language online, we will process your Data for the purposes of fulfilling the terms of our contract with you. In that case, our processing of your Data is based on the contract, so your withdrawal of consent will only be effective after the purposes for processing that Data have been fulfilled and after we no longer have a legal obligation to keep that Data.</p>
            <p className="text-sm text-black mb-4">In all cases, we will comply with applicable law and we will cease processing your Data after the legal right, obligation, or other lawful basis expires, except as expressly provided in the Terms of Service.</p>

            <h2 className="font-bold text-base text-black">3. INTENDED USERS</h2>
            <p className="text-sm text-black mb-4">
              The Services are directed solely to persons 18 years of age or older or of children under 18 who are supervised by a parent, guardian, or other caregiver. Other than for Data collected for the specific purpose of providing the Services to users, we do not knowingly collect Data from users who are under 13. If we become aware that we have gathered Data from a person under 13, except to provide the Services to such person, and except to the extent allowed or required by law, then we will attempt to delete such Data as soon as possible, subject to our obligations under applicable law. If you believe that we have gathered Data from a person under 13 in contravention of this policy, please contact us at <a href="mailto:customerservice@storied.com">customerservice@storied.com</a>.
            </p>

            <h2 className="font-bold text-base text-black">
              4. <a href={`${hostUrl}/dpa`}>DATA</a> WE COLLECT AND HOW WE USE IT
            </h2>
            <p className="text-sm text-black mb-4">Listed below are the categories of Data we collect when you use our Services. We never sell your Data, and we always have a lawful basis for gathering the Data, but that lawful basis might be different for different categories, and we describe those categories and uses below. Regardless, we never use the Data for any purpose other than the purpose for which we gathered the Data in the first place (which may include expanded uses within our network of Services and improvements on current Services), unless we get your prior explicit consent.</p>

            <div>
              <h4 className="font-bold text-base text-black ml-5">a. Registration Data</h4>
              <ol className="footer-list">
                <li className="text-sm text-black ml-12">Data Description: Registration Data consists of the name, e-mail address, street address, and other contact information you provide us using the Services, whether at the time you sign up online or thereafter. Registration Data also includes your username, subscription type and membership end date, if any.</li>
                <li className="text-sm text-black ml-12">Lawful Basis for Processing: Our lawful basis for processing Registration Data is (1) our contract with you or your employer, (2) our legitimate interest in providing the Services to you or your employer, and/or (3) your consent. We can only provide certain of the Services to you if we have the Registration Data, so we need to store and access that Registration Data during the term of our contract. Even when the Registration Data is not critically necessary to the provision of the Services, we may still process that Registration Data to facilitate our contractual interactions with you or your employer.</li>
                <li className="text-sm text-black ml-12">
                  How We Use It and Who We Share It With: Registration Data is accessible only to us and to you. We use it only to provide the Services to you and in the event of a chargeback or other dispute with you. At times, we will share the Registration Data with other third parties at your request or to fulfill requests that you make of us. We may also use your Registration Data to offer our own goods or services to you, either directly through e-mails or through third party platforms, but you may opt out of those offers at any time. We will never share your username or password with any third party. However, we provide your log-in credentials on a “single sign-on” basis, so your credentials for any service within our network will allow access to any of the websites or services within
                  our network.
                </li>
              </ol>
            </div>
            <div>
              <h4 className="font-bold text-base text-black ml-5">b. Engagement Data</h4>
              <ol className="footer-list">
                <li className="text-sm text-black ml-12">Data Description: Engagement Data consists of all the information you input or record using the Services, except as otherwise stated in this policy. It also includes all information that is proprietary to you regarding your use of the Services (other than the data that qualifies as “Usage Data” below) that is collected or processed by the Services. For clarity, Engagement Data does not include Data described as “Your Content” in our Terms of Service.</li>
                <li className="text-sm text-black ml-12">Lawful Basis for Processing: Our lawful basis for processing Engagement Data is (1) our contract with you or your employer, (2) our legitimate interest in providing the Services for your employer, and/or (3) your consent.</li>
                <li className="text-sm text-black ml-12">How We Use It and Who We Share It With: Your Engagement Data is accessible only to us, to you, and where it relates directly to a party who either interacts with you using the Services or provides services to you or receives services from you, to that party, in which case that party will be obligated to protect the confidentiality of your Engagement Data. We do not share Engagement Data with other third parties, except at your specific request, and except in connection with a chargeback or other dispute with you.</li>
              </ol>
            </div>
            <div>
              <h4 className="font-bold text-base text-black ml-5">c. Usage Data</h4>
              <ol className="footer-list2">
                <li className="text-sm text-black ml-12">
                  Data Description: Usage Data consists of the following and similar information:
                  <ul>
                    <li className="text-sm ml-10 text-black">Information about your interactions with the Services, most commonly our website, which includes the date and time of any requests you make. This also may include details of your use of Third-Party Applications and any advertising you receive via the Services.</li>
                    <li className="text-sm ml-10 text-black">Adjustments you make to the default state of the Services, such as custom categories or settings.</li>
                    <li className="text-sm ml-10 text-black">The timing of the information you post to the Services including messages you send and/or receive via the Services and your interactions with our customer service team, but not including the content of those interactions and messages, which would be included as Engagement Data.</li>
                    <li className="text-sm ml-10 text-black">Technical data which may include URL information, cookie data, your IP address, the types of devices you are using to access or connect to the Services, unique device IDs, device attributes, network connection type (e.g. WiFi, 4G, LTE, Bluetooth) and provider, network and device performance, browser type, language, information enabling digital rights management, operating system, and application version.</li>
                  </ul>
                </li>
                <li className="text-sm ml-12 text-black">Lawful Basis for Processing: Our lawful basis for processing Usage Data is (1) our contract with you or your employer, (2) our legitimate interest in providing the Services to your or your employer, and/or (3) your consent.</li>
                <li className="text-sm ml-12 text-black">How We Use It and Who We Share It With: Usage Data is accessible to us and to you. We do not share it with third parties, except at your specific request, but we may use Usage Data to make improvements to the Services and in the event of a chargeback or other dispute with you. To the extent we are required to delete any Usage Data about you, we may still retain aggregated and anonymized information that may have originated as your Usage Data.</li>
              </ol>
            </div>

            <div>
              <h4 className="font-bold text-base ml-5 text-black">d. Payment Data</h4>
              <ol className="footer-list2">
                <li className="text-sm ml-12 text-black">
                  Data Description: Payment Data is only collected when your use of the Services is subject to the payment of a fee or other charge. Payment Data is the information necessary for us to process your payments for premium Services. Payment Data will vary depending on the payment method you use (e.g. direct via your mobile phone carrier or by invoice) but will include information such as:
                  <ul>
                    <li className="text-sm ml-10 text-black">Name;</li>
                    <li className="text-sm ml-10 text-black">Date of birth;</li>
                    <li className="text-sm ml-10 text-black">Certain credit card information used to reference a credit card; (Please note that we use a third-party provider to collect credit card information. The third party’s collection tool is layered over our shopping cart, so your credit card information never hits our system at all.)</li>
                    <li className="text-sm ml-10 text-black">Address and postal code; and</li>
                    <li className="text-sm ml-10 text-black">Mobile phone number</li>
                  </ul>
                </li>
                <li className="text-sm ml-12 text-black">Lawful Basis for Processing: Our lawful basis for processing Usage Data is (1) our contract with you and (2) our legitimate interest in improving our Services based on the Payment Data we receive from you.</li>
                <li className="text-sm ml-12 text-black">How We Use It and Who We Share It With: We only use Payment Data to facilitate payment and in the event of a chargeback or other dispute with you, and we only communicate it to those parties who are strictly necessary for that purpose.</li>
              </ol>
            </div>
            <div>
              <h4 className="font-bold text-base ml-5 text-black">e. Acquired Data</h4>
              <p className="text-sm ml-9 text-black">We currently do not acquire data for marketing purposes from third parties, such as data brokers, and we haven’t done so in the last twelve months. We will disclose any revision to this policy in the future.</p>
            </div>
            <div>
              <h4 className="font-bold text-base ml-5 text-black">f. Your Content</h4>
              <p className="text-sm ml-9 text-black">We take the security and privacy of your Data very seriously, and we try to give you control of the Data that relates to you as much as possible. With respect to users of the Services, Data that is described as “Your Content” under the Terms of Service is managed and shared pursuant to the provisions of the Terms of Service and not under this Privacy Policy. Our lawful basis for processing Your Content is our contract with you, your consent, and our legitimate interest in processing Your Content as provided in the Terms of Service.</p>
              <p className="text-sm ml-9 text-black">When you post or create Your Content using the Services, that content may include the personal information of third parties who are living. The Terms of Service require that you warrant that you are entitled to create or post that content. We rely on that warranty. Our lawful basis for processing the content that includes information about living third parties is our legitimate interest in providing you a service that allows you to organize and sort your own information. Our system is designed to prevent Your Content that consists of information about living individuals from being shared with third parties, except by your express invitation.</p>
            </div>
            <div>
              <h4 className="font-bold text-base ml-5 text-black">g. Legacy Contacts</h4>
              <p className="text-sm text-black ml-9">When you sign up for the Services, you will be prompted to designate an individual who can serve as your “legacy contact” when you die. We will communicate with your legacy contact at the time we learn of your death, and that legacy contact will be entitled to manage Your Content at that time, all as described in our documentation when you sign up. Our lawful basis for processing your Data after your death is your consent, our contract with you, and our legitimate interest in doing so.</p>
            </div>

            <h2 className="font-bold text-base mt-4 text-black">5. SHARING YOUR INFORMATION</h2>
            <p className="text-sm text-black">Except where a specific limitation is noted above, we may share your Data as follows:</p>
            <div className="my-2">
              <ol className="footer-list2">
                <li className="text-sm ml-7 text-black">At Your Instruction. If you request us to make your Data available to a third party, and such request furthers the purposes of our Services, we will do so.</li>
                <li className="text-sm ml-7 text-black">Sharing with Vendors. In certain cases, we use the services of third-party vendors, to assist us in providing the Services. We may share your Data with such vendors solely for that purpose, and we will require those parties to abide by our privacy policies or privacy policies substantially in consonance with ours.</li>
                <li className="text-sm ml-7 text-black">
                  Third-Party Offers. You can always opt out of any third-party offers we may make available to you. Subject to that opt-out right, we may allow other companies to offer you their products and services, including offers through our Services, co-branded pages hosted by the third parties, or via email. Whether or not you decide to participate in any such offers is up to you. If you purchase a product or service on a co-branded page, or via a third-party offer on our Services that requires you to submit financial and personal information, you are also consenting to our delivery of this information to that party. The offer will notify you if any financial or personally identifiable information will be shared. Such third party will be authorized to use this information in keeping
                  with our contractual relationship with them and in accordance with their own privacy policy and information practices. We do not control these third parties and you agree that we are not liable for their acts, or any failure to act on their part.
                </li>
                <li className="text-sm ml-7 text-black">
                  Third-Party Advertising. We may use aggregated, statistical information to describe our membership and to establish advertising and other business relationships with third parties. We may serve you with targeted advertisements based on your personal or profile information, but we do not provide any of this personal or profile information to an advertiser or any third party with the exception of those uses expressly disclosed in this policy. However, if you click or view an ad on our Services then you consent to the likelihood that the advertiser will assume that you meet the targeting criteria, if any, used to display such ad, and as described above, you will be subject to the advertiser's privacy policy and information collection practices (if any).
                </li>
                <li className="text-sm ml-7 text-black">
                  Service Providers and White Label Offerings. We may sometimes use a third party to provide specific Services on our behalf, including sending e-mails to our members, conducting member surveys, processing transactions or performing statistical analysis of our Services. In these cases, we may provide certain personal information, such as your name and e-mail address and other financial information necessary for the service to be provided. However, these third parties are required to maintain the confidentiality of this information and are prohibited from retaining, sharing, storing or using this information for any other purposes. We may also make other services available to you that are offered by third parties but white labeled by us, meaning that we provide the services
                  under our own name and that your contractual relationship is with us, but that we use a third party to provide those services. For example, we may offer an opportunity for you to organize and publish Your Content (as defined in our Terms of Service) in a book or other format using a third-party service. When you sign up for such a service, you agree that we may share Your Content with such third-party providers for the sole purpose of rendering the service in question.
                </li>
                <li className="text-sm ml-7 text-black">Business Transitions. In the event that we go through a business transition, such as a merger, acquisition, liquidation or sale of all or a portion of our assets, the information we have about you will, in most instances, be part of the assets transferred. We reserve the right to transfer that information in connection with such transactions without notice to you. We will not be required to obtain your consent for such a transfer.</li>
                <li className="text-sm ml-7 text-black">Legal Disclosure. We may disclose your Information if required to do so by law or in the good faith belief that such action is necessary to conform to applicable law, comply with a judicial proceeding, court order or legal process served on us, protect and defend our rights or property, or investigate, prevent or take action regarding illegal activities, suspected fraud, situations involving potential threats to the physical safety of any person, or violations of our terms of service.</li>
              </ol>
            </div>
            <p className="text-sm font-bold text-black">If we ever plan to use any Data in the future for any other purposes not identified above and we do not have a separate lawful basis for that new purpose for processing, we will only do so after obtaining your specific consent.</p>

            <h2 className="font-bold text-base mt-4 text-black">6. TECHNOLOGIES WE USE</h2>
            <p className="text-sm text-black">The technologies we use for automatic Data collection may include the following:</p>
            <div>
              <ol className="footer-list-disc">
                <li className="text-sm text-black ml-7">Cookies (or browser cookies). A cookie is a small file placed on the hard drive of your computer. You may refuse to accept browser cookies by activating the appropriate setting on your browser. However, if you select this setting you may be unable to access certain parts of our Services. Unless you have adjusted your browser setting so that it will refuse cookies, our system will issue cookies when you direct your browser to our Services.</li>
                <li className="text-sm text-black ml-7">Flash Cookies. Certain features of our Services may use local stored objects (or Flash cookies) to collect and store information about your preferences and navigation to, from and on our Services. Flash cookies are not managed by the same browser settings as are used for browser cookies.</li>
                <li className="text-sm text-black ml-7">Web Beacons. Pages of the Services and our e-mails may contain small electronic files known as web beacons (also referred to as clear gifs. pixel tags and single-pixel gifs) that permit the Company, for example, to count users who have visited those pages or opened an e-mail and for other related website statistics (for example, recording the popularity of certain website content and verifying system and server integrity).</li>
                <li className="text-sm text-black ml-7">Other Technologies. We may also use device identifiers, local storage, html modifiers, and different types of caching to help us understand the devices and users who access the Services. Those methods include device identifiers that are either hardware-based or software-based, persistent or non-persistent, and which may identify either a device or a software module within a device (such as a web browser).</li>
              </ol>
            </div>

            <h2 className="font-bold text-base text-black mt-4">7. YOUR CHOICES REGARDING OUR USE AND DISCLOSURE OF YOUR DATA</h2>
            <p className="text-sm text-black">By using our Services, you agree that we may use your Data to market our other Services to you. If, after giving your consent, you wish to opt-out of our using your Data to market Services to you, please follow the instructions below.</p>
            <div className="my-2">
              <ol className="footer-list2">
                <li className="text-sm text-black ml-7">
                  Receiving electronic communications from us: If you no longer want to receive marketing-related emails from us on a going-forward basis, you may opt-out of receiving these marketing-related emails by sending a request for list removal to <a href="mailto:customerservice@storied.com">customerservice@storied.com</a>.
                </li>
                <li className="text-sm text-black ml-7">
                  Our sharing of your Data with unaffiliated third parties for their (or their customers') direct marketing purposes: If you would prefer that we do not share your information on a going-forward basis with unaffiliated third parties for their direct marketing purposes, you may opt-out of this sharing by emailing <a href="mailto:customerservice@storied.com">customerservice@storied.com</a> from the email that you have signed up or used in receiving the Services.
                </li>
                <li className="text-sm text-black ml-7">
                  Any other disclosure of your Data: Except as provided in this Privacy Policy regarding anonymized and aggregated Data and except for Data that is processed by us pursuant to a lawful basis other than your consent, you may instruct us to cease disclosure or use of your Data by contacting us at <a href="mailto:customerservice@storied.com">customerservice@storied.com</a>.
                </li>
              </ol>
            </div>
            <p className="text-sm text-black">We will comply with your request(s) as soon as reasonably practicable. Please also note that if you do opt-out of receiving marketing-related emails from us, we may still send you messages for administrative or other purposes directly relating to your use of the Services, and you cannot opt-out from receiving those messages.</p>

            <h2 className="font-bold text-base text-black mt-4">8. PRIVACY FOR EU RESIDENTS</h2>
            <p className="text-sm text-black mb-4">
              The General Data Protection Regulation made effective in Europe on May 25, 2018 (“GDPR”) requires that we clearly describe to data subjects the data we collect and how we use that data. This Privacy Policy does that, and we hope that if you have any questions for us regarding our data collection, you will write us at <a href="mailto:customerservice@storied.com">customerservice@storied.com</a>.
            </p>
            <p className="text-sm text-black mb-4">
              The GDPR also requires that we have a lawful basis for our processing of any personal data about an individual residing in Europe. For an individual browsing our website or otherwise accessing our Services, our lawful basis is our legitimate interest in providing the Services to you in the manner that you desire, and all the Data that we collect from such individuals will be used only for those purposes, as described in this Privacy Policy. For an individual purchasing products from us, our lawful basis is the contract under which you purchase products, and the Data we collect from such individuals will be used only in connection with our contractual relationship with you and only in a manner that furthers the purposes of that contractual relationship, as set forth in this
              Privacy Policy.
            </p>
            <p className="text-sm text-black mb-4">For employees and other authorized users operating in their role as administrators or users of our services, our lawful basis is the legitimate interest we have in providing the services to their employer.</p>
            <p className="text-sm text-black mb-4">
              The GDPR also requires us to take appropriate technical and organizational measures to protect the security of Data relating to residents of Europe. We make commercially reasonable efforts to ensure the privacy and security of the Data of our European visitors and customers, and we are happy to give you a complete description of our most current efforts, if you will write us at <a href="mailto:customerservice@storied.com">customerservice@storied.com</a>. You may also write us at that address to communicate with our chief technology officer who will serve as our data protection officer, also available at <a href="mailto:customerservice@storied.com">customerservice@storied.com</a>.
            </p>
            <p className="text-sm text-black font-bold mb-4">
              Pursuant to the GDPR, residents of Europe have the right to obtain our confirmation of whether we maintain personal information relating to them in the United States. If you are a resident of Europe, upon request from you, we will provide you with access to the Data that we hold about you. You may also correct, amend, or delete the Data we hold about you, subject to our rights and obligations under the GDPR, as described in this Privacy Policy. Individuals who seek access, or who seek to correct, amend, or delete Data transferred to the United States, should direct their queries to <a href="mailto:customerservice@storied.com">customerservice@storied.com</a>. If requested to remove Data, we will respond within a reasonable timeframe.
            </p>

            <h2 className="font-bold text-base text-black mt-4">
              9. <a href={`${hostUrl}/ccpa`}>PRIVACY FOR CALIFORNIA RESIDENTS</a>
            </h2>
            <p className="text-sm text-black mb-4">California has also adopted the California Consumer Privacy Act (“CCPA”), which took effect at the beginning of 2020. We comply with the requirements of the CCPA to the extent they apply to us.</p>
            <p className="text-sm text-black mb-4">If you are a California resident and we qualify as a “business” under the terms of that law, you will have the following rights:</p>
            <div>
              <ol className="footer-list-disc">
                <li className="text-sm text-black ml-7">You have the right to request that we disclose the categories and the specific items of Data about you that we collect, use, disclose, and/or sell and that Data about you that we have collected, used, disclosed, and/or sold during the 12 months prior to your request.</li>
                <li className="text-sm text-black ml-7">
                  You also have the right to have the Data we collect about you deleted. We use a two-step process to verify your identity and to have the information deleted. Your rights to have Data deleted are subject to several exceptions, specifically the Data that is necessary for us to:
                  <ol className="my-2">
                    <li className="text-sm text-black ml-7">complete your transaction;</li>
                    <li className="text-sm text-black ml-7">provide you a good or service;</li>
                    <li className="text-sm text-black ml-7">perform a contract between us and you;</li>
                    <li className="text-sm text-black ml-7">protect your security and prosecute those responsible for breaching it;</li>
                    <li className="text-sm text-black ml-7">fix our system in the case of a bug;</li>
                    <li className="text-sm text-black ml-7">protect the free speech rights of you or other users;</li>
                    <li className="text-sm text-black ml-7">comply with the California Electronic Communications Privacy Act (Cal. Penal Code § 1546 et seq.);</li>
                    <li className="text-sm text-black ml-7">engage in public or peer-reviewed scientific, historical, or statistical research in the public interests that adheres to all other applicable ethics and privacy laws;</li>
                    <li className="text-sm text-black ml-7">comply with a legal obligation; or</li>
                    <li className="text-sm text-black ml-7">make other internal and lawful uses of the information that are compatible with the context in which you provided it.</li>
                  </ol>
                </li>
              </ol>
            </div>
            <div>
              <h4 className="font-bold text-black text-base ml-5">b. Engagement Data</h4>
              <ol className="footer-list">
                <li className="text-sm text-black ml-12">Data Description: Engagement Data consists of all the information you input or record using the Services, except as otherwise stated in this policy. It also includes all information that is proprietary to you regarding your use of the Services (other than the data that qualifies as “Usage Data” below) that is collected or processed by the Services. For clarity, Engagement Data does not include Data described as “Your Content” in our Terms of Service.</li>
                <li className="text-sm text-black ml-12">Lawful Basis for Processing: Our lawful basis for processing Engagement Data is (1) our contract with you or your employer, (2) our legitimate interest in providing the Services for your employer, and/or (3) your consent.</li>
                <li className="text-sm text-black ml-12">How We Use It and Who We Share It With: Your Engagement Data is accessible only to us, to you, and where it relates directly to a party who either interacts with you using the Services or provides services to you or receives services from you, to that party, in which case that party will be obligated to protect the confidentiality of your Engagement Data. We do not share Engagement Data with other third parties, except at your specific request, and except in connection with a chargeback or other dispute with you.</li>
              </ol>
            </div>
            <div>
              <h4 className="font-bold text-black text-base ml-5">c. Usage Data</h4>
              <ol className="footer-list2">
                <li className="text-black text-sm ml-12">
                  Data Description: Usage Data consists of the following and similar information:
                  <ul>
                    <li className="text-sm text-black ml-10">Information about your interactions with the Services, most commonly our website, which includes the date and time of any requests you make. This also may include details of your use of Third-Party Applications and any advertising you receive via the Services.</li>
                    <li className="text-sm text-black ml-10">Adjustments you make to the default state of the Services, such as custom categories or settings.</li>
                    <li className="text-sm text-black ml-10">The timing of the information you post to the Services including messages you send and/or receive via the Services and your interactions with our customer service team, but not including the content of those interactions and messages, which would be included as Engagement Data.</li>
                    <li className="text-sm text-black ml-10">Technical data which may include URL information, cookie data, your IP address, the types of devices you are using to access or connect to the Services, unique device IDs, device attributes, network connection type (e.g. WiFi, 4G, LTE, Bluetooth) and provider, network and device performance, browser type, language, information enabling digital rights management, operating system, and application version.</li>
                  </ul>
                </li>
                <li className="text-sm text-black ml-12">Lawful Basis for Processing: Our lawful basis for processing Usage Data is (1) our contract with you or your employer, (2) our legitimate interest in providing the Services to your or your employer, and/or (3) your consent.</li>
                <li className="text-sm text-black ml-12">How We Use It and Who We Share It With: Usage Data is accessible to us and to you. We do not share it with third parties, except at your specific request, but we may use Usage Data to make improvements to the Services and in the event of a chargeback or other dispute with you. To the extent we are required to delete any Usage Data about you, we may still retain aggregated and anonymized information that may have originated as your Usage Data.</li>
              </ol>
            </div>

            <div>
              <h4 className="font-bold text-base text-black ml-5">d. Payment Data</h4>
              <ol className="footer-list2">
                <li className="text-sm text-black ml-12">
                  Data Description: Payment Data is only collected when your use of the Services is subject to the payment of a fee or other charge. Payment Data is the information necessary for us to process your payments for premium Services. Payment Data will vary depending on the payment method you use (e.g. direct via your mobile phone carrier or by invoice) but will include information such as:
                  <ul>
                    <li className="text-sm text-black ml-10">Name;</li>
                    <li className="text-sm text-black ml-10">Date of birth;</li>
                    <li className="text-sm text-black ml-10">Certain credit card information used to reference a credit card; (Please note that we use a third-party provider to collect credit card information. The third party’s collection tool is layered over our shopping cart, so your credit card information never hits our system at all.)</li>
                    <li className="text-sm text-black ml-10">Address and postal code; and</li>
                    <li className="text-sm text-black ml-10">Mobile phone number</li>
                  </ul>
                </li>
                <li className="text-sm text-black ml-12">Lawful Basis for Processing: Our lawful basis for processing Usage Data is (1) our contract with you and (2) our legitimate interest in improving our Services based on the Payment Data we receive from you.</li>
                <li className="text-sm text-black ml-12">How We Use It and Who We Share It With: We only use Payment Data to facilitate payment and in the event of a chargeback or other dispute with you, and we only communicate it to those parties who are strictly necessary for that purpose.</li>
              </ol>
            </div>
            <div>
              <h4 className="font-bold text-base text-black ml-5">e. Acquired Data</h4>
              <p className="text-sm text-black ml-9">We currently do not acquire data for marketing purposes from third parties, such as data brokers, and we haven’t done so in the last twelve months. We will disclose any revision to this policy in the future.</p>
            </div>
            <div>
              <h4 className="font-bold text-base text-black ml-5">f. Your Content</h4>
              <p className="text-sm text-black ml-9">We take the security and privacy of your Data very seriously, and we try to give you control of the Data that relates to you as much as possible. With respect to users of the Services, Data that is described as “Your Content” under the Terms of Service is managed and shared pursuant to the provisions of the Terms of Service and not under this Privacy Policy. Our lawful basis for processing Your Content is our contract with you, your consent, and our legitimate interest in processing Your Content as provided in the Terms of Service.</p>
              <p className="text-sm text-black ml-9">When you post or create Your Content using the Services, that content may include the personal information of third parties who are living. The Terms of Service require that you warrant that you are entitled to create or post that content. We rely on that warranty. Our lawful basis for processing the content that includes information about living third parties is our legitimate interest in providing you a service that allows you to organize and sort your own information. Our system is designed to prevent Your Content that consists of information about living individuals from being shared with third parties, except by your express invitation.</p>
            </div>
            <div>
              <h4 className="font-bold text-base text-black ml-5">g. Legacy Contacts</h4>
              <p className="text-sm text-black ml-9">When you sign up for the Services, you will be prompted to designate an individual who can serve as your “legacy contact” when you die. We will communicate with your legacy contact at the time we learn of your death, and that legacy contact will be entitled to manage Your Content at that time, all as described in our documentation when you sign up. Our lawful basis for processing your Data after your death is your consent, our contract with you, and our legitimate interest in doing so.</p>
            </div>

            <h2 className="font-bold text-base text-black mt-4">5. SHARING YOUR INFORMATION</h2>
            <p className="text-sm text-black">Except where a specific limitation is noted above, we may share your Data as follows:</p>
            <div className="my-2">
              <ol className="footer-list2">
                <li className="text-sm text-black ml-7">At Your Instruction. If you request us to make your Data available to a third party, and such request furthers the purposes of our Services, we will do so.</li>
                <li className="text-sm text-black ml-7">Sharing with Vendors. In certain cases, we use the services of third-party vendors, to assist us in providing the Services. We may share your Data with such vendors solely for that purpose, and we will require those parties to abide by our privacy policies or privacy policies substantially in consonance with ours.</li>
                <li className="text-sm text-black ml-7">
                  Third-Party Offers. You can always opt out of any third-party offers we may make available to you. Subject to that opt-out right, we may allow other companies to offer you their products and services, including offers through our Services, co-branded pages hosted by the third parties, or via email. Whether or not you decide to participate in any such offers is up to you. If you purchase a product or service on a co-branded page, or via a third-party offer on our Services that requires you to submit financial and personal information, you are also consenting to our delivery of this information to that party. The offer will notify you if any financial or personally identifiable information will be shared. Such third party will be authorized to use this information in keeping
                  with our contractual relationship with them and in accordance with their own privacy policy and information practices. We do not control these third parties and you agree that we are not liable for their acts, or any failure to act on their part.
                </li>
                <li className="text-sm text-black ml-7">
                  Third-Party Advertising. We may use aggregated, statistical information to describe our membership and to establish advertising and other business relationships with third parties. We may serve you with targeted advertisements based on your personal or profile information, but we do not provide any of this personal or profile information to an advertiser or any third party with the exception of those uses expressly disclosed in this policy. However, if you click or view an ad on our Services then you consent to the likelihood that the advertiser will assume that you meet the targeting criteria, if any, used to display such ad, and as described above, you will be subject to the advertiser's privacy policy and information collection practices (if any).
                </li>
                <li className="text-sm text-black ml-7">
                  Service Providers and White Label Offerings. We may sometimes use a third party to provide specific Services on our behalf, including sending e-mails to our members, conducting member surveys, processing transactions or performing statistical analysis of our Services. In these cases, we may provide certain personal information, such as your name and e-mail address and other financial information necessary for the service to be provided. However, these third parties are required to maintain the confidentiality of this information and are prohibited from retaining, sharing, storing or using this information for any other purposes. We may also make other services available to you that are offered by third parties but white labeled by us, meaning that we provide the services
                  under our own name and that your contractual relationship is with us, but that we use a third party to provide those services. For example, we may offer an opportunity for you to organize and publish Your Content (as defined in our Terms of Service) in a book or other format using a third-party service. When you sign up for such a service, you agree that we may share Your Content with such third-party providers for the sole purpose of rendering the service in question.
                </li>
                <li className="text-sm text-black ml-7">Business Transitions. In the event that we go through a business transition, such as a merger, acquisition, liquidation or sale of all or a portion of our assets, the information we have about you will, in most instances, be part of the assets transferred. We reserve the right to transfer that information in connection with such transactions without notice to you. We will not be required to obtain your consent for such a transfer.</li>
                <li className="text-sm text-black ml-7">Legal Disclosure. We may disclose your Information if required to do so by law or in the good faith belief that such action is necessary to conform to applicable law, comply with a judicial proceeding, court order or legal process served on us, protect and defend our rights or property, or investigate, prevent or take action regarding illegal activities, suspected fraud, situations involving potential threats to the physical safety of any person, or violations of our terms of service.</li>
              </ol>
            </div>
            <p className="text-sm font-bold text-black">If we ever plan to use any Data in the future for any other purposes not identified above and we do not have a separate lawful basis for that new purpose for processing, we will only do so after obtaining your specific consent.</p>

            <h2 className="font-bold text-base text-black mt-4">6. TECHNOLOGIES WE USE</h2>
            <p className="text-sm text-black">The technologies we use for automatic Data collection may include the following:</p>
            <div>
              <ol className="footer-list-disc">
                <li className="text-sm ml-7 text-black">Cookies (or browser cookies). A cookie is a small file placed on the hard drive of your computer. You may refuse to accept browser cookies by activating the appropriate setting on your browser. However, if you select this setting you may be unable to access certain parts of our Services. Unless you have adjusted your browser setting so that it will refuse cookies, our system will issue cookies when you direct your browser to our Services.</li>
                <li className="text-sm ml-7 text-black">Flash Cookies. Certain features of our Services may use local stored objects (or Flash cookies) to collect and store information about your preferences and navigation to, from and on our Services. Flash cookies are not managed by the same browser settings as are used for browser cookies.</li>
                <li className="text-sm ml-7 text-black">Web Beacons. Pages of the Services and our e-mails may contain small electronic files known as web beacons (also referred to as clear gifs. pixel tags and single-pixel gifs) that permit the Company, for example, to count users who have visited those pages or opened an e-mail and for other related website statistics (for example, recording the popularity of certain website content and verifying system and server integrity).</li>
                <li className="text-sm ml-7 text-black">Other Technologies. We may also use device identifiers, local storage, html modifiers, and different types of caching to help us understand the devices and users who access the Services. Those methods include device identifiers that are either hardware-based or software-based, persistent or non-persistent, and which may identify either a device or a software module within a device (such as a web browser).</li>
              </ol>
            </div>

            <h2 className="font-bold text-base mt-4 text-black">7. YOUR CHOICES REGARDING OUR USE AND DISCLOSURE OF YOUR DATA</h2>
            <p className="text-sm text-black">By using our Services, you agree that we may use your Data to market our other Services to you. If, after giving your consent, you wish to opt-out of our using your Data to market Services to you, please follow the instructions below.</p>
            <div className="my-2">
              <ol className="footer-list2">
                <li className="text-sm ml-7 text-black">
                  Receiving electronic communications from us: If you no longer want to receive marketing-related emails from us on a going-forward basis, you may opt-out of receiving these marketing-related emails by sending a request for list removal to <a href="mailto:customerservice@storied.com">customerservice@storied.com</a>.
                </li>
                <li className="text-sm ml-7 text-black">
                  Our sharing of your Data with unaffiliated third parties for their (or their customers') direct marketing purposes: If you would prefer that we do not share your information on a going-forward basis with unaffiliated third parties for their direct marketing purposes, you may opt-out of this sharing by emailing <a href="mailto:customerservice@storied.com">customerservice@storied.com</a> from the email that you have signed up or used in receiving the Services.
                </li>
                <li className="text-sm ml-7 text-black">
                  Any other disclosure of your Data: Except as provided in this Privacy Policy regarding anonymized and aggregated Data and except for Data that is processed by us pursuant to a lawful basis other than your consent, you may instruct us to cease disclosure or use of your Data by contacting us at <a href="mailto:customerservice@storied.com">customerservice@storied.com</a>.
                </li>
              </ol>
            </div>
            <p className="text-black text-sm">We will comply with your request(s) as soon as reasonably practicable. Please also note that if you do opt-out of receiving marketing-related emails from us, we may still send you messages for administrative or other purposes directly relating to your use of the Services, and you cannot opt-out from receiving those messages.</p>

            <h2 className="font-bold text-base text-black mt-4">8. PRIVACY FOR EU RESIDENTS</h2>
            <p className="text-sm mb-4 text-black">
              The General Data Protection Regulation made effective in Europe on May 25, 2018 (“GDPR”) requires that we clearly describe to data subjects the data we collect and how we use that data. This Privacy Policy does that, and we hope that if you have any questions for us regarding our data collection, you will write us at <a href="mailto:customerservice@storied.com">customerservice@storied.com</a>.
            </p>
            <p className="text-sm text-black mb-4">
              The GDPR also requires that we have a lawful basis for our processing of any personal data about an individual residing in Europe. For an individual browsing our website or otherwise accessing our Services, our lawful basis is our legitimate interest in providing the Services to you in the manner that you desire, and all the Data that we collect from such individuals will be used only for those purposes, as described in this Privacy Policy. For an individual purchasing products from us, our lawful basis is the contract under which you purchase products, and the Data we collect from such individuals will be used only in connection with our contractual relationship with you and only in a manner that furthers the purposes of that contractual relationship, as set forth in this
              Privacy Policy.
            </p>
            <p className="text-sm mb-4 text-black">For employees and other authorized users operating in their role as administrators or users of our services, our lawful basis is the legitimate interest we have in providing the services to their employer.</p>
            <p className="text-sm mb-4 text-black">
              The GDPR also requires us to take appropriate technical and organizational measures to protect the security of Data relating to residents of Europe. We make commercially reasonable efforts to ensure the privacy and security of the Data of our European visitors and customers, and we are happy to give you a complete description of our most current efforts, if you will write us at <a href="mailto:customerservice@storied.com">customerservice@storied.com</a>. You may also write us at that address to communicate with our chief technology officer who will serve as our data protection officer, also available at <a href="mailto:customerservice@storied.com">customerservice@storied.com</a>.
            </p>
            <p className="text-sm text-black font-bold mb-4">
              Pursuant to the GDPR, residents of Europe have the right to obtain our confirmation of whether we maintain personal information relating to them in the United States. If you are a resident of Europe, upon request from you, we will provide you with access to the Data that we hold about you. You may also correct, amend, or delete the Data we hold about you, subject to our rights and obligations under the GDPR, as described in this Privacy Policy. Individuals who seek access, or who seek to correct, amend, or delete Data transferred to the United States, should direct their queries to <a href="mailto:customerservice@storied.com">customerservice@storied.com</a>. If requested to remove Data, we will respond within a reasonable timeframe.
            </p>

            <h2 className="font-bold text-base mt-4 text-black">9. PRIVACY FOR CALIFORNIA RESIDENTS</h2>
            <p className="text-sm mb-4 text-black">California has also adopted the California Consumer Privacy Act (“CCPA”), which took effect at the beginning of 2020. We comply with the requirements of the CCPA to the extent they apply to us.</p>
            <p className="text-sm mb-4 text-black">If you are a California resident and we qualify as a “business” under the terms of that law, you will have the following rights:</p>
            <div>
              <ol className="footer-list-disc">
                <li className="text-sm ml-7 text-black">You have the right to request that we disclose the categories and the specific items of Data about you that we collect, use, disclose, and/or sell and that Data about you that we have collected, used, disclosed, and/or sold during the 12 months prior to your request.</li>
                <li className="text-sm ml-7 text-black">
                  You also have the right to have the Data we collect about you deleted. We use a two-step process to verify your identity and to have the information deleted. Your rights to have Data deleted are subject to several exceptions, specifically the Data that is necessary for us to:
                  <ol className="my-2">
                    <li className="text-sm ml-7 text-black">complete your transaction;</li>
                    <li className="text-sm ml-7 text-black">provide you a good or service;</li>
                    <li className="text-sm ml-7 text-black">perform a contract between us and you;</li>
                    <li className="text-sm ml-7 text-black">protect your security and prosecute those responsible for breaching it;</li>
                    <li className="text-sm ml-7 text-black">fix our system in the case of a bug;</li>
                    <li className="text-sm ml-7 text-black">protect the free speech rights of you or other users;</li>
                    <li className="text-sm ml-7 text-black">comply with the California Electronic Communications Privacy Act (Cal. Penal Code § 1546 et seq.);</li>
                    <li className="text-sm ml-7 text-black">engage in public or peer-reviewed scientific, historical, or statistical research in the public interests that adheres to all other applicable ethics and privacy laws;</li>
                    <li className="text-sm ml-7 text-black">comply with a legal obligation; or</li>
                    <li className="text-sm ml-7 text-black">make other internal and lawful uses of the information that are compatible with the context in which you provided it.</li>
                  </ol>
                </li>
                <li className="text-sm text-black ml-7">
                  To make any request under the CCPA, you must complete the Data Request Form found at <a href={`${hostUrl}/ccpa`}>{`${hostUrl}/ccpa`}</a> or send an e-mail to <a href="mailto:customerservice@storied.com">customerservice@storied.com</a>. You will be asked to give us your name, e-mail address, telephone number, and any other information we request to reasonably verify your identity. We will respond to your request within 10 days after receipt of your request, and we will then take action to verify your identity and fulfill your request, as required by the CCPA.
                </li>
                <li className="text-sm text-black ml-7">We will provide you with a CSV copy of your stored data within 45 days of your request, assuming we are able to verify your identity in that period and so long as you provide a correct email address for successful correspondence.</li>
                <li className="text-sm text-black ml-7">You have the right not to receive discriminatory treatment by us for the exercise of any privacy rights conferred by the CCPA, which means that we will not take any action to hurt or punish you for exercising your rights under the CCPA.</li>
                <li className="text-sm text-black ml-7">
                  You may designate an authorized agent to make a request under the CCPA on your behalf by writing us at <a href="mailto:customerservice@storied.com">customerservice@storied.com</a>. Upon receipt of your request, we will provide you with the information you will need to designate that agent.
                </li>
              </ol>
            </div>
            <p className="text-sm text-black mb-4 mt-4">Note that we are not allowed by law to at any time disclose your Social Security number, driver’s license number, or other government-issued identification number, financial account number, any health insurance or medical identification number, or any account password or security questions or answers.</p>
            <p className="text-sm text-black mb-4">We have listed the specific and general categories of information we have collected, disclosed, or sold in the last 12 months in the section above entitled “Data We Collect and How We Use It.” That section also lists the specific and general categories of Data we have disclosed to third parties for our business purposes.</p>
            <p className="text-sm text-black mb-4">We do not sell your Data.</p>
            <p className="text-sm text-black mb-4">We do not sell the personal information of minors under 16 years of age.</p>
            <p className="text-sm text-black mb-4">
              For more information, please direct your questions to us at <a href="mailto:customerservice@storied.com">customerservice@storied.com</a>.
            </p>
            <p className="text-sm text-black mb-4">
              Certain of the information made available using our Services consists of storied articles and other publicly available information that has been published by third parties in the exercise of their free speech rights under applicable law, and we are simply providing access to such articles and other information. We are not the publisher or owner of that information, and our policy is not to remove references to individuals that may contain personal information, because that would infringe upon the free speech rights of others. If there is any publicly available information that you feel endangers the physical safety of you or other persons, you may submit a request that we remove access to that information at{" "}
              <a href="mailto:customerservice@storied.com">customerservice@storied.com</a>. We will make the determination of whether to remove access to that information in our sole and absolute discretion and without any liability whatsoever to you or others.
            </p>

            <h2 className="font-bold text-base text-black mt-4">10. SECURITY</h2>
            <p className="text-sm text-black mb-4">The security of your Data is important to us. We use commercially reasonable efforts to store and maintain your Data in a secure environment. We take technical, contractual, administrative, and physical security steps designed to protect Data that you provide to us. We have implemented procedures designed to limit the dissemination of your Data to only such designated staff as are reasonably necessary to carry out the stated purposes we have communicated to you.</p>

            <h2 className="font-bold text-base text-black mt-4">11. THIRD-PARTY POLICIES</h2>
            <p className="text-sm text-black mb-4">You may be able to access third-party websites and other tools and services or products via a link, or via our other tools. The privacy policies of these third parties are not under our control and may differ from ours. The use of any Data that you may provide to any third parties will be governed by the privacy policy of such third party or by your independent agreement with such third party, as the case may be. If you have any doubts about the privacy of the information you are providing to a third party, we recommend that you contact that third party directly for more information or to review its privacy policy.</p>
            <p className="text-sm text-black mb-4">This Privacy Policy does not address, and we are not responsible for, the privacy, information or other practices of any third parties, including any third party operating any offering, site or other products and Services used in connection with the Services. The inclusion of a link does not imply endorsement of the linked site or service by us or by our affiliates.</p>

            <h2 className="font-bold text-base text-black mt-4">12. RETENTION</h2>
            <p className="text-sm text-black mb-4">
              We will keep your information for as long as it remains necessary for the identified purpose or as required by law, which may extend beyond the termination of our relationship with you. We may retain certain data as necessary to prevent fraud or future abuse, or for legitimate business purposes, such as analysis of aggregated, non-personally-identifiable data, account recovery, or if required by law. All retained information will remain subject to the terms of this Privacy Policy. Please note that if you request that your information be removed from our databases, it may not be possible to completely delete all of your information due to technological and legal constraints, and if you are a subscriber to the Services, such removal will be subject to the Terms of Service.
            </p>

            <h2 className="font-bold text-base text-black mt-4">13. AMENDMENT OF THIS PRIVACY POLICY</h2>
            <p className="text-sm text-black mb-4">
              We reserve the right to change this Privacy Policy at any time. If we decide to change this Privacy Policy in the future, we will post or provide appropriate notice. Any change to this Privacy Policy will become effective on the date that is 30 days from their posting on the Services or sent via email to your listed email address. Unless stated otherwise, our current Privacy Policy applies to all Data that we have about you and your account. The date on which the latest update was made is indicated at the top of this document. We recommend that you print a copy of this Privacy Policy for your reference and revisit this policy from time to time to ensure you are aware of any changes. Your continued use of the Services signifies your acceptance of any changes.
            </p>

            <h2 className="font-bold text-base text-black mt-4">14. ACCESS AND ACCURACY</h2>
            <p className="text-sm text-black mb-4">You have the right to access the information we hold about you in order to verify the information we have collected in respect to you and to have a general account of our uses of that information. Upon receipt of your written request, we will provide you with a copy of your information, although in certain limited circumstances we may not be able to make all relevant information available to you, such as where that information also pertains to another user. In such circumstances we will provide reasons for the denial to you upon request. We will endeavor to deal with all requests for access and modifications in a timely manner.</p>
            <p className="text-sm text-black mb-4">We will make every reasonable effort to keep your information accurate and up-to-date, and we will provide you with mechanisms to update, correct, delete or add to your information as appropriate. As appropriate, this amended information will be transmitted to those parties to which we are permitted to disclose your information. Having accurate information about you enables us to give you the best possible service.</p>

            <h2 className="font-bold text-base text-black mt-4">15. CONTACT US</h2>
            <p className="text-sm text-black mb-4">
              You can help by keeping us informed of any changes such as a change of your personal contact information. If you would like to access your information, if you have any questions, comments or suggestions of if you find any errors in our information about you, please contact us at <a href="mailto:customerservice@storied.com">customerservice@storied.com</a>. If you have a complaint concerning our compliance with applicable privacy laws, we will investigate your complaint and if it is justified, we will take appropriate measures.
            </p>
          </div>
        </div>
      </div>
    </>

  );
};

export default PrivacyPage;
