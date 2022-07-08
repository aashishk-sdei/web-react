import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
//Components
import Typography from "./../components/Typography";
import Button from "./../components/Button";
//Icon
import pageNotFound from "./../assets/images/page-not-found.svg";
import { addFooterGray, addFooterWhite } from "../redux/actions/layout";
const NotFound = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(addFooterWhite());
    return () => {
      dispatch(addFooterGray());
    };
  }, [dispatch]);
  return (
    <>
      <div className="home-page">
        <div className="flex flex-col justify-center items-center py-14 px-8 h-full">
          <figure className="page-not-found mb-4">
            <img src={pageNotFound} alt="page not found" />
          </figure>
          <div className="pnf-title mb-4">
            <Typography text="black-color" weight="bold" size={20}>
              Page Not Found
            </Typography>
          </div>
          <div className="pnf-title mb-4">
            <Typography weight="regular" size={14}>
              We can’t seem to find the page you are looking for.
            </Typography>
          </div>
          <div className="btn-360">
            <Button handleClick={() => history.push("/")} size="large" title="Go Home" fontWeight="medium" />
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
