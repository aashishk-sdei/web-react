import React, { useEffect, useRef } from 'react';
import className from "classnames";
import Typography from "./../../components/Typography";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import "./index.css";
import { getOS } from './../../utils/getOS';


const getCloseButton = (showClose, setShowModal) => {
  let html = null;
  if (showClose) {
    html = <button
      className="outline-none focus:outline-none relative z-50"
      onClick={(e) => {
        e.stopPropagation()
        setShowModal(false)
      }}
    >
      <span className="bg-transparent text-black  h-6 w-6 text-2xl block outline-none focus:outline-none">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 8C0 3.58172 3.58172 0 8 0H24C28.4183 0 32 3.58172 32 8V24C32 28.4183 28.4183 32 24 32H8C3.58172 32 0 28.4183 0 24V8Z" fill="white" />
          <path d="M10 22L22 10" stroke="#747578" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M22 22L10 10" stroke="#747578" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  }
  return html
}

let selectedElement;

const Modal = ({
  showModal,
  setShowModal,
  title,
  subTitle,
  content,
  modalWrap,
  clickAwayClose = true,
  showClose = true,
  classes = "inset-0",
  titleFontWeight = "typo-font-bold",
  modalPadding = "px-7 py-5",
  modalHead = "px-7 pt-6",
  innerClasses = "max-w-edit-search-modal-w",
  isPropagation = true,
  ...props
}) => {
  const twModal = useRef();

  useEffect(() => {
    if (showModal) {
      document.body.classList.add('tw-modal-open')
      if (getOS() === 'windows' || getOS() === 'linux') {
        document.body.classList.add('pr-17')
      }
    } else {
      document.body.classList.remove('tw-modal-open')
    }
  }, [showModal]);

  useEffect(() => {
    return () => {
      document.body.classList.remove('tw-modal-open')
      if (getOS() === 'windows' || getOS() === 'linux') {
        document.body.classList.remove('pr-17')
      }
    }
  }, []);

  useEffect(() => {
    if (showModal) window.addEventListener("keydown", handleModalKeyDown, false);
    else window.removeEventListener("keydown", handleModalKeyDown, false);
  }, []);

  const handleFocus = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) element.focus();
  }

  const handleModalKeyDown = (e) => {
    // Family Tables
    if (props.modalType === "Family") {
      selectedElement = e && e.path ? e.path[0].id : e.target.id;
      if (e.shiftKey && e.keyCode === 9) {
        switch (true) {
          case (selectedElement === "cancelAction"):
            e.preventDefault();
            handleFocus("addAction");
            break;

          case (selectedElement === "firstName"):
            e.preventDefault();
            const cancelAction = document.getElementById("cancelAction");
            if (cancelAction) handleFocus("cancelAction");
            else handleFocus("addAction");
            break;

          case (selectedElement === "addAction"):
            e.preventDefault();
            const plastName = document.getElementById("plastName");
            if (plastName) handleFocus("plastName");
            else {
              const parents = document.getElementById("Parents");
              if (parents) handleFocus("Parents");
              else handleFocus("isLiving");
            }
            break;

          case (selectedElement === "pfirstName"):
            e.preventDefault();
            const Parents = document.getElementById("Parents");
              if (Parents && Parents.disabled) handleFocus("isLiving");
              else handleFocus("Parents");
            break;

          case (selectedElement === "Parents"):
            e.preventDefault();
            handleFocus("isLiving");
            break;

          default:
            break;
        }
      } else if (!e.shiftKey && e.keyCode === 9) {
        switch (true) {
          case (selectedElement === "cancelAction"):
            e.preventDefault();
            handleFocus("firstName");
            break;

          case (selectedElement === "addAction"):
            e.preventDefault();
            const cancelAction = document.getElementById("cancelAction");
            if (cancelAction) handleFocus("cancelAction");
            else handleFocus("firstName");
            break;

          case (selectedElement === "birthPlace"):
            e.preventDefault();
            const death = document.getElementById("death");
            if (death) handleFocus("death");
            else handleFocus("isLiving");
            break;

          case (selectedElement === "deathPlace"):
            e.preventDefault();
            handleFocus("isLiving");
            break;

          case (selectedElement === "isLiving"):
            e.preventDefault();
            setTimeout(() => {
              const Parents = document.getElementById("Parents");
              if (Parents && !Parents.disabled) handleFocus("Parents");
              else if (Parents && Parents.disabled) handleFocus("pfirstName");
              else handleFocus("addAction");
            }, 100)
            break;

          case (selectedElement === "plastName"):
            e.preventDefault();
            handleFocus("addAction");
            break;

          case (selectedElement === "Parents"):
            e.preventDefault();
            const pfirstName = document.getElementById("pfirstName");
            if (pfirstName) handleFocus("pfirstName");
            else handleFocus("addAction");
            break;

          default:
            break;
        }
      }
    }

    // Relational Modals
    if (props.modalType === "Relational") {
      selectedElement = e && e.path ? e.path[0].id : e.target.id;
      if (e.shiftKey && e.keyCode === 9) {
        if (selectedElement === "date") {
          e.preventDefault();
          handleFocus("addAction");
        }
      } else if (!e.shiftKey && e.keyCode === 9) {
        switch (true) {
          case (selectedElement === "Spouse"):
            e.preventDefault();
            const sfirstNameElem = document.getElementById("sfirstName");
            if (sfirstNameElem) sfirstNameElem.focus();
            else handleFocus("addAction");
            break;

          case (selectedElement === "isLiving"):
            e.preventDefault();
            handleFocus("addAction");
            break;

          case (selectedElement === "addAction"):
            e.preventDefault();
            handleFocus("date");
            break;

          case (selectedElement === "birthLocation"):
            e.preventDefault();
            const death = document.getElementById("death");
            if(death) death.focus();
            else handleFocus("isLiving");
            break;

          case (selectedElement === "deathLocation"):
            e.preventDefault();
            handleFocus("isLiving");
            break;

          default:
            break;
        }
      }
    }
  }

  const ModalListener = () => {
    const modal = <div className={className(`tw-modal-dialog pointer-events-none w-full relative my-6 mx-auto flex items-center ${innerClasses}`)}>
      <div className="flex flex-col w-full pointer-events-auto relative">
        <div className={`border-0 rounded-lg shadow-lg relative w-full bg-white outline-none focus:outline-none ctw-modal-wrap my-auto ${modalWrap}`}>
          <div className={`flex items-start justify-between rounded-t ctw-modal-head ${modalHead}`}>
            <h3 className={`text-2xl inline mb-0 text-gray-7 ${titleFontWeight}`}>
              {title}
              {subTitle && <p><Typography size={14}><span className='block'>{subTitle}</span></Typography></p>}
            </h3>
            {getCloseButton(showClose, setShowModal)}
          </div>
          <div className={`relative flex-auto ctw-modal-body ${modalPadding}`}>
            {content}
          </div>
        </div>
      </div>
    </div>;

    return clickAwayClose ? <ClickAwayListener onClickAway={(e) => {
      const box = twModal.current
      let scrollbarWidth = box.offsetWidth - box.clientWidth;
      if (scrollbarWidth <= 0) {
        scrollbarWidth = 16
      }
      if (box.scrollWidth - scrollbarWidth > e.clientX) {
        setShowModal(false)
      }
    }} mouseEvent="onMouseDown">
      {modal}
    </ClickAwayListener> : modal
  }

  return (
    <>
      {showModal ? (
        <>
          <div
            onClick={e => isPropagation && e.stopPropagation()}
            id="twModal"
            ref={twModal}
            className={className(`overflow-x-hidden overflow-y-auto fixed z-1000 outline-none focus:outline-none w-full cursor-default ${getOS() === 'windows' && 'modal-body-pr-17'} ${classes}`)}>
            {ModalListener()}
          </div>
          <div className={`opacity-40 fixed inset-0 z-500 bg-black cursor-default`}></div>

        </>
      ) : null}
    </>
  );
}

export default Modal;