import React, { useState } from "react";
import SavedModel from "./SavedModel";
const RightPanel = ({ setShowClueView }) => {
  const [showModel, setShowModel] = useState(false);
  const toggleClueView = () => {
    setShowClueView(true);
  };
  const handleShowModel = () => {
    setShowModel(true);
    setTimeout(() => {
      setShowModel(false);
    }, 6000);
  };
  return (
    <>
      <SavedModel showModel={showModel} setShowModel={setShowModel} />
      <div className="clue-content bg-white">
        <div className="clue-header flex justify-between relative">
          <div>
            <div className="flex">
              <div>
                <img src="https://img.freepik.com/free-photo/handsome-young-businessman-shirt-eyeglasses_85574-6228.jpg?size=626&ext=jpg" alt="" />
              </div>
              <div>
                <h2 className="text-sm pl-2 font-semibold break-all">Isaac Leroy Hammack</h2>
                <p className="text-xs text-gray-5 pl-2 pt-1 break-all">-1957 • Mortensen Family Tree</p>
              </div>
            </div>
          </div>
          <div>
            <button>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 13L13 1.00001" stroke="#747578" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13 13L1 1.00001" stroke="#747578" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
        <div className="clue-separator"></div>
        <div className="clue-footer flex justify-between pb-0.5">
          <div className="flex para-content1">
            <div>
              <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.75 5C18.75 4.69058 18.6271 4.39383 18.4083 4.17504C18.1895 3.95625 17.8928 3.83333 17.5833 3.83333H8.83333L7.43333 1.96667C7.32466 1.82177 7.18375 1.70417 7.02175 1.62317C6.85975 1.54217 6.68112 1.5 6.5 1.5H2.41667C2.10725 1.5 1.8105 1.62292 1.59171 1.84171C1.37292 2.0605 1.25 2.35725 1.25 2.66667V15.5C1.25 15.8094 1.37292 16.1062 1.59171 16.325C1.8105 16.5437 2.10725 16.6667 2.41667 16.6667H17.5833C17.8928 16.6667 18.1895 16.5437 18.4083 16.325C18.6271 16.1062 18.75 15.8094 18.75 15.5V5Z" stroke="#48A380" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm pt-1 text-gray-7 break-all">
              You have saved this clue to <span className="font-bold">Isaac Leroy Hamack</span> from the <span className="font-bold">1940 United States Federal Census</span>
            </p>
          </div>
        </div>
      </div>
      <div className="clue-content bg-white">
        <div className="clue-header flex justify-between relative">
          <div>
            <div className="flex">
              <div>
                <img src="https://img.freepik.com/free-photo/handsome-young-businessman-shirt-eyeglasses_85574-6228.jpg?size=626&ext=jpg" alt="" />
              </div>
              <div>
                <h2 className="text-sm pl-2 font-semibold break-all">Isaac Leroy Hammack</h2>
                <p className="text-xs text-gray-5 pl-2 pt-1 break-all">-1957 • Mortensen Family Tree</p>
              </div>
            </div>
          </div>
          <div className="pt-2 hidden md:block clue-viewbtn">
            <button className="flex rounded-lg bg-gray-2">
              <span>
                <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.41699 5.97648C6.41699 6.55638 6.64736 7.11253 7.05741 7.52258C7.46746 7.93263 8.02361 8.16299 8.60351 8.16299C9.18341 8.16299 9.73956 7.93263 10.1496 7.52258C10.5597 7.11253 10.79 6.55638 10.79 5.97648C10.79 5.39658 10.5597 4.84043 10.1496 4.43038C9.73956 4.02033 9.18341 3.78996 8.60351 3.78996C8.02361 3.78996 7.46746 4.02033 7.05741 4.43038C6.64736 4.84043 6.41699 5.39658 6.41699 5.97648Z" fill="#295DA1" />
                  <path
                    d="M12.5065 1.89498H11.7392C11.6778 1.8928 11.6183 1.87248 11.5684 1.83657C11.5185 1.80067 11.4803 1.7508 11.4587 1.69324C11.0984 0.932912 10.7258 0.145767 9.91535 0.145767H7C6.37553 0.145767 6.0461 0.599396 5.44962 1.42327C5.22572 1.73055 5.15225 1.89498 4.9575 1.89498H1.45908C0.256207 1.89498 0.00315407 2.59991 0.00315407 3.19114V9.24808C-0.0103756 9.44302 0.0197361 9.63853 0.0912971 9.82036C0.162858 10.0022 0.274067 10.1658 0.416828 10.2992C0.559589 10.4327 0.730309 10.5326 0.916558 10.5917C1.10281 10.6508 1.2999 10.6677 1.49348 10.641H12.5065C12.7001 10.6677 12.8972 10.6508 13.0834 10.5917C13.2697 10.5326 13.4404 10.4327 13.5832 10.2992C13.7259 10.1658 13.8371 10.0022 13.9087 9.82036C13.9803 9.63853 14.0104 9.44302 13.9968 9.24808V3.19114C13.9968 2.59991 13.7385 1.89498 12.5065 1.89498ZM11.9561 5.97647C11.9561 6.63957 11.7595 7.28777 11.3911 7.83911C11.0227 8.39045 10.4991 8.82017 9.88645 9.07392C9.27383 9.32768 8.59973 9.39407 7.94937 9.26471C7.29902 9.13535 6.70164 8.81604 6.23276 8.34716C5.76388 7.87828 5.44457 7.2809 5.31521 6.63054C5.18585 5.98019 5.25224 5.30609 5.50599 4.69347C5.75975 4.08085 6.18947 3.55724 6.74081 3.18884C7.29215 2.82045 7.94035 2.62382 8.60344 2.62382C9.49234 2.62474 10.3446 2.97827 10.9731 3.60681C11.6017 4.23535 11.9552 5.08758 11.9561 5.97647V5.97647ZM2.91851 4.08149C2.91851 4.22564 2.87576 4.36656 2.79568 4.48641C2.71559 4.60627 2.60176 4.69969 2.46858 4.75485C2.33541 4.81002 2.18886 4.82445 2.04748 4.79633C1.9061 4.76821 1.77623 4.69879 1.6743 4.59686C1.57237 4.49493 1.50296 4.36506 1.47483 4.22368C1.44671 4.0823 1.46115 3.93576 1.51631 3.80258C1.57147 3.6694 1.66489 3.55557 1.78475 3.47549C1.9046 3.3954 2.04552 3.35266 2.18967 3.35266C2.38297 3.35266 2.56835 3.42944 2.70503 3.56613C2.84172 3.70281 2.91851 3.88819 2.91851 4.08149Z"
                    fill="#295DA1"
                  />
                  <path d="M1.46085 1.30258L3.21006 1.31191C3.28738 1.31191 3.36153 1.28119 3.41621 1.22652C3.47088 1.17185 3.50159 1.09769 3.50159 1.02037V0.874606C3.50159 0.642646 3.40945 0.420187 3.24543 0.256166C3.08141 0.0921457 2.85895 0 2.62699 0H2.04392C1.81196 0 1.5895 0.0921457 1.42548 0.256166C1.26146 0.420187 1.16931 0.642646 1.16931 0.874606V1.01104C1.16931 1.08836 1.20003 1.16252 1.2547 1.21719C1.30937 1.27186 1.38353 1.30258 1.46085 1.30258Z" fill="#295DA1" />
                </svg>
              </span>
              <span className="text-blue-4 text-sm font-semibold">View Record</span>
            </button>
          </div>
        </div>
        <div className="w-full para-content">
          <p className="text-xs pt-3 font-semibold break-all">
            <span className="text-gray-5 font-normal">in the</span> 1940 United States Federal Census
          </p>
        </div>
        <div className="flex mt-5 mb-4 clue-table">
          <div className="table-content bg-white text-left w-full">
            <table className="table-auto w-full">
              <thead>
                <tr className="">
                  <th className="hidden md:block"></th>
                  <th className="text-sm text-gray-6 font-semibold md:font-medium pb-2">This Record</th>
                  <th className="text-sm text-gray-6 font-semibold md:font-medium pb-2">Your Person</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-2" key={1}>
                  <td className="name-col  p-1 break-all hidden md:block">
                    <span className="defaultText text-sm typo-font-regular text-gray-6">Name</span>
                  </td>
                  <td className="name-col p-1 break-all">
                    <p className="select-none text-gray-6 defaultText text-xs typo-font-regular pr-2 w-32 md:hidden">Name</p>
                    <span className="defaultText secondary-color text-sm typo-font-regular">
                      Isaac L Hammack <span className="bg-maroon-5 text-white rounded-sm clue-tag">DIFFERENT</span>
                    </span>
                  </td>
                  <td className="name-col p-1 break-all">
                    <p className="select-none text-gray-6 defaultText text-xs typo-font-regular pr-2 w-32 md:hidden">Name</p>
                    <span className="defaultText secondary-color text-sm typo-font-regular">Isaac Leroy Hammack</span>
                  </td>
                </tr>
                <tr key={2}>
                  <td className="name-col  p-1 break-all hidden md:block">
                    <span className="defaultText text-sm typo-font-regular text-gray-6">Birth</span>
                  </td>
                  <td className="name-col p-1 break-all">
                    <p className="select-none text-gray-6 defaultText text-xs typo-font-regular pr-2 w-32 md:hidden">Birth Date</p>
                    <span className="defaultText secondary-color text-sm typo-font-regular text-gray-7">
                      4 May 1890 <span className="bg-green-5 text-white rounded-sm clue-tag">NEW</span>
                    </span>
                  </td>
                </tr>
                <tr className="bg-gray-2" key={3}>
                  <td className="name-col p-1 break-all hidden md:block">
                    <span className="defaultText text-sm typo-font-regular text-gray-6">Residence</span>
                  </td>
                  <td className="name-col p-1 break-all">
                    <p className="select-none text-gray-6 defaultText text-xs typo-font-regular pr-2 w-32 md:hidden">Residence</p>
                    <span className="defaultText secondary-color text-sm typo-font-regular">1910 Burley, Idaho, USA</span>
                  </td>
                  <td className="name-col p-1 break-all">
                    <p className="select-none text-gray-6 defaultText text-xs typo-font-regular pr-2 w-32 md:hidden">Residence</p>
                    <span className="defaultText secondary-color text-sm typo-font-regular">1910 Burley, Idaho, USA</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-center align-center pt-4 md:hidden mb-4">
              <button className="flex bg-blue-4 rounded-lg mr-2" onClick={() => toggleClueView()}>
                <span className="text-white text-sm font-medium px-3">View</span>
              </button>
              <button className="flex bg-gray-2 rounded-lg">
                <span className="text-blue-4 text-sm font-semibold px-3">Ignore</span>
              </button>
            </div>
            <div className="hidden md:block">
              <h5>
                <button className="text-blue-4 text-sm underline">+more</button>
              </h5>
            </div>
          </div>
        </div>
        <div className="clue-footer block md:flex md:justify-between hidden md:block">
          <div className="flex">
            <div>
              <svg height="20" width="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10Z" fill="#204A82" />
                <path
                  d="M8.47582 10.3868C8.36949 10.5638 8.22947 10.718 8.06375 10.8407C7.89802 10.9634 7.70984 11.0522 7.50995 11.1019C7.31006 11.1516 7.10236 11.1613 6.89873 11.1305C6.6951 11.0996 6.49951 11.0288 6.32315 10.9221C6.14678 10.8154 5.99308 10.6749 5.87082 10.5085C5.74857 10.3422 5.66015 10.1533 5.61062 9.95269C5.56109 9.75206 5.55142 9.5436 5.58215 9.33922C5.61289 9.13484 5.68344 8.93854 5.78976 8.76152L5.95183 8.49215C5.99419 8.42119 6.0501 8.35934 6.11636 8.31015C6.18262 8.26096 6.25792 8.22539 6.33792 8.20551C6.41792 8.18562 6.50104 8.1818 6.58252 8.19427C6.66399 8.20673 6.74221 8.23524 6.81267 8.27815L8.42467 9.25338C8.49536 9.2959 8.55699 9.35202 8.606 9.41852C8.65502 9.48503 8.69045 9.5606 8.71026 9.64089C8.73008 9.72118 8.73388 9.80462 8.72146 9.88639C8.70904 9.96817 8.68064 10.0467 8.63788 10.1174L8.47582 10.3868Z"
                  fill="white"
                />
                <path d="M11.0423 3.48869C10.5975 3.2699 10.0864 3.22894 9.61258 3.37411C9.13876 3.51928 8.73761 3.83972 8.49033 4.27057L7.24829 6.3343C7.16238 6.47727 7.13655 6.64863 7.17649 6.81071C7.21642 6.97279 7.31884 7.11232 7.46124 7.19863L9.07292 8.17359C9.14338 8.21656 9.2216 8.24512 9.3031 8.25764C9.3846 8.27015 9.46776 8.26637 9.54779 8.2465C9.62783 8.22664 9.70316 8.19109 9.76946 8.14189C9.83575 8.0927 9.8917 8.03083 9.93408 7.95986L9.96602 7.90864C10.1567 7.59204 10.4363 7.33895 10.7697 7.18107C11.1036 7.02349 11.3834 6.77007 11.5738 6.45286L11.768 6.13019C11.8998 5.91064 11.9858 5.66645 12.0206 5.4125C12.0554 5.15854 12.0383 4.90013 11.9704 4.653C11.9026 4.40587 11.7853 4.1752 11.6257 3.97503C11.4661 3.77486 11.2676 3.60939 11.0423 3.48869Z" fill="white" />
                <path d="M7.16785 14.1391C6.86426 14.4107 6.67768 14.7901 6.64748 15.1972C6.61728 15.6043 6.74583 16.0072 7.00599 16.321C7.26615 16.6348 7.63758 16.8349 8.04192 16.879C8.44626 16.9232 8.85187 16.808 9.17319 16.5577L9.41424 16.356C9.54198 16.2491 9.62225 16.0957 9.63745 15.9295C9.65264 15.7633 9.60151 15.5978 9.49528 15.4694L8.29101 14.0182C8.23845 13.9544 8.17384 13.9017 8.1009 13.863C8.02796 13.8244 7.94813 13.8007 7.866 13.7931C7.78388 13.7856 7.70108 13.7945 7.62238 13.8192C7.54367 13.8439 7.47061 13.884 7.40741 13.9371L7.16785 14.1391Z" fill="white" />
                <path
                  d="M13.5769 10.5547C13.8587 10.9633 13.9755 11.4639 13.9036 11.9555C13.8318 12.4471 13.5767 12.893 13.1898 13.2031L11.3431 14.7461C11.2799 14.7991 11.207 14.8391 11.1284 14.8637C11.0497 14.8884 10.9671 14.8972 10.885 14.8897C10.803 14.8822 10.7233 14.8585 10.6504 14.82C10.5776 14.7815 10.513 14.7289 10.4604 14.6653L9.25615 13.214C9.20318 13.1506 9.16323 13.0773 9.13861 12.9983C9.11398 12.9193 9.10517 12.8362 9.11267 12.7538C9.12017 12.6713 9.14384 12.5912 9.18232 12.518C9.2208 12.4448 9.27332 12.38 9.33687 12.3272L9.3843 12.2874C9.66752 12.0506 9.87457 11.735 9.97936 11.3803C10.0842 11.0255 10.2914 10.7098 10.5747 10.4729L10.8632 10.232C11.0597 10.0676 11.2875 9.94521 11.5326 9.8722C11.7778 9.79919 12.0353 9.77711 12.2893 9.80732C12.5432 9.83753 12.7884 9.91939 13.0098 10.0479C13.2312 10.1764 13.4241 10.3489 13.5769 10.5547Z"
                  fill="white"
                />
              </svg>
            </div>
            <h3 className="text-gray-5 text-sm pt-1 font-semibold break-all">Does this record clue match your Isaac Leroy Hammack?</h3>
          </div>
          <div className="block md:flex text-right">
            <button className="bg-blue-4 text-sm text-white mr-2 rounded-lg" onClick={() => handleShowModel()}>
              Yes
            </button>
            <button className="bg-gray-2 text-sm text-blue-4 rounded-lg">No</button>
          </div>
        </div>
      </div>
    </>
  );
};
export default RightPanel;
