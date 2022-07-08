import React from "react";
import Typography from "../../components/Typography";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import "./index.css";
import Milo from "../Home/Milo";

const Communication = () => {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (_event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const AccordionComponent = ({ name, heading, headingDesc, Content, icon }) => {
    return (
      <Accordion TransitionProps={{ unmountOnExit: true }} expanded={expanded === name} onChange={handleChange(name)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`${name}sbh-content`} id={`${name}bh-header`}>
          {icon}
          <Typography size={14} weight="bold">
            <h2 className="text-gray-7 mb-0 ml-7">{heading}</h2>
          </Typography>
          {
            <Typography size={12}>
              <p className="text-gray-5 ml-7 mb-1">{headingDesc}</p>
            </Typography>
          }
        </AccordionSummary>
        <AccordionDetails>{Content}</AccordionDetails>
      </Accordion>
    );
  };

  const CheckboxNotifications = ({ option }) => {
    return (
      <>
        <div className="flex mb-4">
          <div>
            <svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.27783 14.0672C5.35545 14.3364 5.51663 14.5728 5.73724 14.7409C5.95784 14.9091 6.22601 15 6.50158 15C6.77716 15 7.04532 14.9091 7.26593 14.7409C7.48653 14.5728 7.64771 14.3364 7.72533 14.0672" stroke="#555658" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M6.5 2.40005V1" stroke="#555658" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M6.5 2.40005C7.71558 2.40005 8.88136 2.89174 9.74091 3.76694C10.6004 4.64214 11.0833 5.82917 11.0833 7.0669C11.0833 11.4512 12 12.2004 12 12.2004H1C1 12.2004 1.91667 11.0082 1.91667 7.0669C1.91667 5.82917 2.39955 4.64214 3.25909 3.76694C4.11864 2.89174 5.28442 2.40005 6.5 2.40005V2.40005Z" stroke="#555658" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <div>
            <h3 className="text-gray-7 text-xs ml-3">Mobile App</h3>
          </div>
          <div className="ml-auto">
            <div className="flex items-center justify-end">
              <input type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border border-gray-4 rounded-lg" checked />
            </div>
          </div>
        </div>
        <div className="flex mb-4">
          <div>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1.16667H15V11.1667H1V1.16667Z" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M14.7741 1.53334L9.34474 5.70934C8.95922 6.00591 8.48647 6.16671 8.00007 6.16671C7.51368 6.16671 7.04093 6.00591 6.65541 5.70934L1.22607 1.53334" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <div>
            <h3 className="text-gray-7 text-xs ml-3">Email</h3>
          </div>
          <div className="ml-auto">
            <div className="flex items-center justify-end">
              <input type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border border-gray-4 rounded-lg" checked />
            </div>
          </div>
        </div>
        <div className="relative w-48">
          <select className={`block appearance-none h-10 w-full border border-gray-3  tw-sel-src bg-white px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent text-base`} id="dropdown" placeholder="Select">
            <option className="text-base" value={option}>
              {option}
            </option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pr-3.5 text-gray-7">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.75 0.853749L5.17667 4.42675C5.15348 4.44997 5.12594 4.46839 5.09563 4.48096C5.06531 4.49353 5.03282 4.5 5 4.5C4.96718 4.5 4.93469 4.49353 4.90438 4.48096C4.87406 4.46839 4.84652 4.44997 4.82333 4.42675L1.25 0.853749" stroke="#747578" stroke-width="1.54297" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </div>
      </>
    );
  };

  const Followers = () => {
    return (
      <div className="flex w-full">
        <div className="w-full">
          <Typography size={12}>
            <p className="text-black mb-4">Notifications for when someone new follows you.</p>
          </Typography>
          <CheckboxNotifications option="Send every time" />
        </div>
      </div>
    );
  };

  const Likes = () => {
    return (
      <div className="flex w-full">
        <div className="w-full">
          <Typography size={12}>
            <p className="text-black mb-4">Notifications for when someone likes one of your stories.</p>
          </Typography>
          <CheckboxNotifications option="Send daily" />
        </div>
      </div>
    );
  };
  const Comments = () => {
    return (
      <div className="flex w-full">
        <div className="w-full">
          <Typography size={12}>
            <p className="text-black mb-4">
              Notifications for when someone comments on one of
              <br />
              your stories.
            </p>
          </Typography>
          <CheckboxNotifications option="Send daily" />
        </div>
      </div>
    );
  };

  const Shares = () => {
    return (
      <div className="flex w-full">
        <div className="w-full">
          <Typography size={12}>
            <p className="text-black mb-4">
              Notifications for when someone has shared one of your <br /> stories with someone else.{" "}
            </p>
          </Typography>
          <CheckboxNotifications option="Send every time" />
        </div>
      </div>
    );
  };

  const Clues = () => {
    return (
      <div className="flex w-full">
        <div className="w-full">
          <Typography size={12}>
            <p className="text-black mb-4">Notifications for when someone has clue for you.</p>
          </Typography>
          <CheckboxNotifications option="Send every time" />
        </div>
      </div>
    );
  };

  const HistoricalContent = () => {
    return (
      <div className="flex w-full">
        <div className="w-full">
          <Typography size={12}>
            <p className="text-black mb-4">Notifications for when someone has new historical content for you.</p>
          </Typography>
          <CheckboxNotifications option="Send every time" />
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="lg:flex">
        <div className="xs:w-full lg:3/5 xl:w-4/6 lg:pr-28">
          <Typography size={20} weight="bold">
            <h1 className="text-black mb-8">Communication Preferences</h1>
          </Typography>
          <Typography size={10}>
            <p className="text-gray-5 mb-1">Social &amp; Stories</p>
          </Typography>
          <div className="communication">
            <div>
              <AccordionComponent
                name="followers"
                heading="Followers"
                Content={<Followers />}
                headingDesc="Mobile App, Email"
                icon={
                  <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.7998 4.26667C3.7998 5.13304 4.14397 5.96393 4.75659 6.57655C5.36921 7.18917 6.2001 7.53333 7.06647 7.53333C7.93285 7.53333 8.76373 7.18917 9.37635 6.57655C9.98897 5.96393 10.3331 5.13304 10.3331 4.26667C10.3331 3.40029 9.98897 2.5694 9.37635 1.95678C8.76373 1.34417 7.93285 1 7.06647 1C6.2001 1 5.36921 1.34417 4.75659 1.95678C4.14397 2.5694 3.7998 3.40029 3.7998 4.26667V4.26667Z" stroke="#747578" stroke-width="1.23438" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M0.999512 15C0.999512 13.391 1.63868 11.8479 2.7764 10.7102C3.91412 9.5725 5.4572 8.93333 7.06618 8.93333C8.67516 8.93333 10.2182 9.5725 11.356 10.7102C12.4937 11.8479 13.1328 13.391 13.1328 15" stroke="#747578" stroke-width="1.23438" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                }
              />
              <AccordionComponent
                name="likes"
                heading="Likes"
                Content={<Likes />}
                headingDesc="In-app only"
                icon={
                  <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.00027 13.25L2.03464 7.02742C1.51033 6.50348 1.16428 5.82775 1.04557 5.09606C0.92685 4.36437 1.04149 3.61387 1.37324 2.95101V2.95101C1.6234 2.45079 1.98882 2.01717 2.43941 1.68589C2.88999 1.35461 3.41283 1.13514 3.96486 1.04556C4.51688 0.955993 5.08228 0.998882 5.61449 1.1707C6.14669 1.34252 6.63045 1.63834 7.02591 2.0338L8.00027 3.00764L8.97464 2.0338C9.3701 1.63834 9.85386 1.34252 10.3861 1.1707C10.9183 0.998882 11.4837 0.955993 12.0357 1.04556C12.5877 1.13514 13.1106 1.35461 13.5611 1.68589C14.0117 2.01717 14.3772 2.45079 14.6273 2.95101C14.9586 3.61362 15.0731 4.36367 14.9545 5.09494C14.8359 5.82621 14.4903 6.50163 13.9665 7.02555L8.00027 13.25Z" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                }
              />
              <AccordionComponent
                name="comments"
                heading="Comments"
                Content={<Comments />}
                headingDesc="Mobile App, Email"
                icon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.46067 1.00002C7.2973 0.998339 6.15468 1.30827 5.15138 1.89766C4.14809 2.48705 3.32067 3.33441 2.755 4.35181C2.18933 5.36921 1.90601 6.51958 1.93446 7.68353C1.96291 8.84749 2.30208 9.98262 2.91677 10.9711L1 15L5.02503 13.0817C5.88345 13.6158 6.85407 13.9432 7.86043 14.0379C8.86679 14.1327 9.88139 13.9923 10.8243 13.6277C11.7672 13.2632 12.6126 12.6845 13.294 11.9373C13.9753 11.19 14.474 10.2947 14.7507 9.32168C15.0274 8.3487 15.0745 7.32471 14.8884 6.33039C14.7023 5.33607 14.288 4.39859 13.6782 3.59181C13.0684 2.78503 12.2797 2.13099 11.3743 1.68123C10.4689 1.23147 9.47147 0.998275 8.46067 1.00002V1.00002Z" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                }
              />
              <AccordionComponent
                name="shares"
                heading="Shares"
                Content={<Shares />}
                headingDesc="Mobile App, Email"
                icon={
                  <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.18182 5.66666H10.0909C10.332 5.66666 10.5632 5.765 10.7337 5.94003C10.9042 6.11506 11 6.35246 11 6.6V14.0667C11 14.3142 10.9042 14.5516 10.7337 14.7266C10.5632 14.9017 10.332 15 10.0909 15H1.90909C1.66799 15 1.43675 14.9017 1.26627 14.7266C1.09578 14.5516 1 14.3142 1 14.0667V6.6C1 6.35246 1.09578 6.11506 1.26627 5.94003C1.43675 5.765 1.66799 5.66666 1.90909 5.66666H2.81818" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M6 1V7.53333" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M3.72729 3.33333L6.00002 1L8.27275 3.33333" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                }
              />
            </div>
          </div>

          <div className="mt-10">
            <Typography size={10}>
              <p className="text-gray-5 mb-1">Record Content</p>
            </Typography>
            <div className="communication">
              <div>
                <AccordionComponent
                  name="clues"
                  heading="Clues"
                  Content={<Clues />}
                  headingDesc="Mobile App, Email"
                  icon={
                    <svg width="11" height="16" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.98269 8.40801C3.86216 8.60795 3.70343 8.78219 3.51556 8.92078C3.32769 9.05937 3.11437 9.1596 2.88776 9.21575C2.66116 9.2719 2.42571 9.28286 2.19487 9.24802C1.96403 9.21317 1.74231 9.1332 1.54237 9.01267C1.34244 8.89214 1.1682 8.73341 1.02961 8.54554C0.891014 8.35767 0.790783 8.14435 0.734635 7.91774C0.678487 7.69114 0.667523 7.45569 0.702367 7.22485C0.737211 6.99401 0.817181 6.77229 0.937712 6.57235L1.12143 6.26811C1.16946 6.18797 1.23285 6.1181 1.30796 6.06254C1.38307 6.00698 1.46843 5.96681 1.55912 5.94435C1.64981 5.92189 1.74404 5.91758 1.8364 5.93166C1.92876 5.94574 2.01743 5.97794 2.09731 6.0264L3.92471 7.1279C4.00485 7.17592 4.07471 7.23931 4.13027 7.31442C4.18584 7.38953 4.226 7.47489 4.24847 7.56558C4.27093 7.65627 4.27524 7.7505 4.26116 7.84286C4.24708 7.93523 4.21488 8.02389 4.16642 8.10377L3.98269 8.40801Z"
                        fill="#747578"
                      />
                      <path d="M6.89268 0.616693C6.38837 0.369575 5.80901 0.323316 5.27188 0.48728C4.73475 0.651244 4.28 1.01318 3.99968 1.49981L2.59167 3.83073C2.49428 3.99221 2.465 4.18576 2.51027 4.36883C2.55553 4.55189 2.67164 4.70949 2.83307 4.80697L4.66011 5.90816C4.73998 5.95669 4.82866 5.98896 4.92105 6.00309C5.01344 6.01722 5.10771 6.01295 5.19844 5.99051C5.28917 5.96808 5.37457 5.92792 5.44972 5.87236C5.52487 5.8168 5.5883 5.74692 5.63634 5.66675L5.67255 5.60891C5.88875 5.25131 6.20566 4.96545 6.58358 4.78714C6.96211 4.60916 7.27936 4.32293 7.49522 3.96465L7.71528 3.6002C7.86475 3.35222 7.96219 3.07642 8.00165 2.78958C8.04111 2.50275 8.02177 2.21088 7.94481 1.93175C7.86786 1.65263 7.73489 1.39209 7.554 1.16601C7.37312 0.939924 7.14811 0.753025 6.89268 0.616693Z" fill="#747578" />
                      <path d="M2.49983 12.6461C2.15567 12.9529 1.94416 13.3814 1.90993 13.8412C1.8757 14.301 2.02142 14.7561 2.31634 15.1105C2.61127 15.4649 3.03233 15.6909 3.4907 15.7408C3.94906 15.7907 4.40888 15.6605 4.77312 15.3778L5.04639 15.15C5.19119 15.0293 5.28219 14.856 5.29942 14.6683C5.31664 14.4806 5.25868 14.2937 5.13826 14.1486L3.77307 12.5095C3.71349 12.4375 3.64024 12.3779 3.55756 12.3343C3.47487 12.2907 3.38437 12.2638 3.29127 12.2553C3.19817 12.2468 3.10431 12.2568 3.01509 12.2847C2.92587 12.3127 2.84305 12.3579 2.7714 12.418L2.49983 12.6461Z" fill="#747578" />
                      <path
                        d="M9.76557 8.59768C10.085 9.05908 10.2174 9.62454 10.1359 10.1798C10.0545 10.735 9.7653 11.2387 9.3268 11.5889L7.2333 13.3316C7.16169 13.3916 7.07895 13.4367 6.98984 13.4646C6.90073 13.4924 6.80699 13.5024 6.71401 13.4939C6.62104 13.4854 6.53065 13.4587 6.44805 13.4152C6.36544 13.3717 6.29224 13.3123 6.23265 13.2404L4.86746 11.6013C4.80741 11.5296 4.76213 11.4468 4.73421 11.3576C4.7063 11.2684 4.6963 11.1745 4.70481 11.0814C4.71331 10.9883 4.74015 10.8978 4.78377 10.8151C4.82739 10.7324 4.88693 10.6592 4.95897 10.5996L5.01274 10.5547C5.3338 10.2872 5.56852 9.93075 5.68731 9.53015C5.8062 9.12941 6.04101 8.77282 6.36218 8.50528L6.68927 8.23312C6.91199 8.0475 7.17021 7.90923 7.44816 7.82677C7.72611 7.7443 8.01795 7.71937 8.30586 7.75348C8.59377 7.7876 8.87171 7.88006 9.12268 8.02521C9.37366 8.17036 9.59241 8.36515 9.76557 8.59768Z"
                        fill="#747578"
                      />
                    </svg>
                  }
                />
                <AccordionComponent
                  name="history"
                  heading="New Historical Content"
                  Content={<HistoricalContent />}
                  headingDesc="Mobile App, Email"
                  icon={
                    <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 3.8V12.6667C15 13.038 14.8525 13.3941 14.5899 13.6566C14.3274 13.9192 13.9713 14.0667 13.6 14.0667C13.2287 14.0667 12.8726 13.9192 12.6101 13.6566C12.3475 13.3941 12.2 13.038 12.2 12.6667V1.93333C12.2 1.6858 12.1017 1.4484 11.9266 1.27337C11.7516 1.09833 11.5142 1 11.2667 1H1.93333C1.6858 1 1.4484 1.09833 1.27337 1.27337C1.09833 1.4484 1 1.6858 1 1.93333V12.6667C1 13.038 1.1475 13.3941 1.41005 13.6566C1.6726 13.9192 2.0287 14.0667 2.4 14.0667H13.6" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M3.33325 9.4H9.86659" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M3.33325 11.2667H7.06659" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M3.33325 3.33334H9.86659V7.06667H3.33325V3.33334Z" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  }
                />
              </div>
            </div>
          </div>

          <div className="mt-10">
            <Typography size={10}>
              <p className="text-gray-5 mb-1">News and Updates</p>
            </Typography>
            <div className="communication">
              <div className="updates">
                <div className="flex box mt-2">
                  <div className="mt-1.5">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1.95982V5.96353C0.999939 6.47252 1.20203 6.96069 1.56184 7.32071L8.9598 14.719C9.1398 14.8989 9.3839 15 9.63842 15C9.89295 15 10.137 14.8989 10.317 14.719L14.719 10.3166C14.8989 10.1366 15 9.89254 15 9.63803C15 9.38352 14.8989 9.13943 14.719 8.95944L7.321 1.56181C6.96096 1.20202 6.47277 0.999939 5.96376 1H1.95986C1.70529 1 1.46115 1.10112 1.28114 1.28112C1.10113 1.46112 1 1.70526 1 1.95982V1.95982Z" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                      <path
                        d="M3.39941 4.35935C3.39941 4.4854 3.42424 4.61021 3.47248 4.72666C3.52072 4.84311 3.59142 4.94892 3.68055 5.03805C3.76968 5.12717 3.8755 5.19787 3.99195 5.24611C4.10841 5.29434 4.23322 5.31917 4.35927 5.31917C4.48533 5.31917 4.61014 5.29434 4.7266 5.24611C4.84305 5.19787 4.94887 5.12717 5.038 5.03805C5.12713 4.94892 5.19783 4.84311 5.24607 4.72666C5.29431 4.61021 5.31914 4.4854 5.31914 4.35935C5.31914 4.23331 5.29431 4.1085 5.24607 3.99205C5.19783 3.8756 5.12713 3.76979 5.038 3.68066C4.94887 3.59153 4.84305 3.52083 4.7266 3.4726C4.61014 3.42436 4.48533 3.39954 4.35927 3.39954C4.23322 3.39954 4.10841 3.42436 3.99195 3.4726C3.8755 3.52083 3.76968 3.59153 3.68055 3.68066C3.59142 3.76979 3.52072 3.8756 3.47248 3.99205C3.42424 4.1085 3.39941 4.23331 3.39941 4.35935Z"
                        stroke="#747578"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <Typography size={14} weight="bold">
                      <h2 className="text-gray-7 mb-0">Promotional Offers</h2>
                    </Typography>
                    <Typography size={12}>
                      <p className="text-gray-5">
                        Discounts, promotions and <br />
                        exclusive customer offers.
                      </p>
                    </Typography>
                  </div>
                  <div className="ml-auto">
                    <input type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border border-gray-4 rounded-lg" />
                  </div>
                </div>
                <div className="flex box">
                  <div className="mt-1.5">
                    <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.5334 13.6C7.5334 13.9713 7.3859 14.3274 7.12335 14.5899C6.8608 14.8525 6.5047 15 6.1334 15C5.7621 15 5.406 14.8525 5.14345 14.5899C4.8809 14.3274 4.7334 13.9713 4.7334 13.6V11.2667H7.5334V13.6Z" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M7.53335 11.2667C8.61994 10.9181 9.56741 10.2327 10.2386 9.30987C10.9098 8.38699 11.2698 7.27446 11.2667 6.13333C11.2667 4.77189 10.7259 3.46621 9.76317 2.50352C8.80048 1.54083 7.4948 1 6.13335 1C4.77191 1 3.46623 1.54083 2.50354 2.50352C1.54085 3.46621 1.00002 4.77189 1.00002 6.13333C0.996859 7.27446 1.35693 8.38699 2.02812 9.30987C2.6993 10.2327 3.64676 10.9181 4.73335 11.2667" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M5.20016 6.6H4.26683C4.08223 6.6 3.90178 6.54527 3.7483 6.44271C3.59481 6.34015 3.47518 6.19439 3.40454 6.02384C3.3339 5.8533 3.31542 5.66564 3.35143 5.48459C3.38744 5.30354 3.47633 5.13723 3.60686 5.0067C3.73739 4.87618 3.9037 4.78728 4.08475 4.75127C4.26579 4.71526 4.45346 4.73374 4.624 4.80438C4.79455 4.87503 4.94031 4.99465 5.04287 5.14814C5.14542 5.30162 5.20016 5.48208 5.20016 5.66667V6.6Z" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M7.06689 6.6H8.00023C8.18482 6.6 8.36527 6.54527 8.51876 6.44271C8.67225 6.34015 8.79187 6.19439 8.86251 6.02384C8.93316 5.8533 8.95164 5.66564 8.91563 5.48459C8.87961 5.30354 8.79072 5.13723 8.66019 5.0067C8.52966 4.87618 8.36336 4.78728 8.18231 4.75127C8.00126 4.71526 7.8136 4.73374 7.64306 4.80438C7.47251 4.87503 7.32675 4.99465 7.22419 5.14814C7.12163 5.30162 7.06689 5.48208 7.06689 5.66667V6.6Z" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M5.2002 11.2667V6.60001H7.06686V11.2667" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M4.7334 13.1333H7.5334" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <Typography size={14} weight="bold">
                      <h2 className="text-gray-7 mb-0">Tips and Tricks</h2>
                    </Typography>
                    <Typography size={12}>
                      <p className="text-gray-5">
                        Research tips, trainings, help <br />
                        articles, and tutorials.
                      </p>
                    </Typography>
                  </div>
                  <div className="ml-auto">
                    <input type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border border-gray-4 rounded-lg" />
                  </div>
                </div>
                <div className="flex box">
                  <div className="mt-1.5">
                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.0667 1.00006H1.93333C1.41787 1.00006 1 1.41793 1 1.93339V9.71117C1 10.2266 1.41787 10.6445 1.93333 10.6445H14.0667C14.5821 10.6445 15 10.2266 15 9.71117V1.93339C15 1.41793 14.5821 1.00006 14.0667 1.00006Z" stroke="#747578" stroke-width="1.23438" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M3.33301 5.97784H5.66634" stroke="#747578" stroke-width="1.23438" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M3.33301 8.15564H8.46634" stroke="#747578" stroke-width="1.23438" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M12.3558 3.17789H10.4891C10.2314 3.17789 10.0225 3.38682 10.0225 3.64455V5.51122C10.0225 5.76895 10.2314 5.97789 10.4891 5.97789H12.3558C12.6135 5.97789 12.8225 5.76895 12.8225 5.51122V3.64455C12.8225 3.38682 12.6135 3.17789 12.3558 3.17789Z" stroke="#747578" stroke-width="1.23438" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <Typography size={14} weight="bold">
                      <h2 className="text-gray-7 mb-0">Newsletter</h2>
                    </Typography>
                    <Typography size={12}>
                      <p className="text-gray-5">
                        Monthly communication with <br />
                        stories, tips, updates, and more.
                      </p>
                    </Typography>
                  </div>
                  <div className="ml-auto">
                    <input type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border border-gray-4 rounded-lg" />
                  </div>
                </div>
              </div>
              <h3 className="text-blue-4 text-xs font-semibold px-2 my-4">Unsubscribe from all emails</h3>
            </div>
          </div>
        </div>
        <div className="xs:w-full lg:w-3/6 xl:w-2/6 mb-5">
          <div className="com-milo mt-16 pl-4 pr-4 pb-5 pt-16">
            <Milo isCommunicationPage={true} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Communication;
