import React from "react";
import { Link } from 'react-router-dom';
import TailwindModal from "./../../components/TailwindModal";
import Button from "./../../components/Button";
import Typography from "./../../components/Typography";
import GroupBookIcon from "./../../assets/images/groupbook-icon.svg";

const FreeAccountModal = ({ show, handleLogin, handleSignup, setShowAccountModal }) => {
    return (
        <TailwindModal
            showClose={true}
            innerClasses="max-w-89"
            modalWrap={"px-8 py-12"}
            modalHead={"p-0 absolute right-6 top-6"}
            modalPadding={"p-0"}
            content={
                <>
                    <div className="vector flex w-full justify-center mb-8">
                        <img src={GroupBookIcon} alt="welcome to Storied" />
                    </div>
                    <div className="create-info text-center mb-8 w-full flex flex-col mx-auto">
                        <h3 className="mb-2.5 text-gray-7 text-2xl mb-1.5 typo-font-bold">Create a free account </h3>
                        <p className="info-sp-block">
                            <Typography size={16} text="secondary">
                                Sign up to like, comment, share, and create your own stories.
                            </Typography>
                        </p>
                    </div>
                    <div className="button-wrap flex w-full justify-center mb-6">
                        <Button
                            size="large"
                            fontWeight="medium"
                            width="full"
                            title="Sign up"
                            handleClick={() => handleSignup()}
                        />
                    </div>
                    <div className="flex justify-center">
                        <span className="text-xs text-black"> Already have an account? <Link className="ml-1.5 text-blue-4" to="#" onClick={() => handleLogin()}>Sign in</Link></span>
                    </div>
                </>
            }
            showModal={show}
            setShowModal={setShowAccountModal}
            clickAwayClose={true}
        />
    );
};
export default FreeAccountModal;
