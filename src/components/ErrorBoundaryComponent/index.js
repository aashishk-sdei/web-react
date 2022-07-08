import React from "react";
import failedToLoad from "../../assets/images/failed-to-load.svg";
import Typography from "../Typography";
import Button from "../Button";
const ErrorBoundaryComponent = () => {
  return (
    <>
      {/* <div className="home-page">
        <div className="flex flex-col justify-center items-center mt-32 p-8">Unfortunately something went wrong!</div>
      </div> */}
      <div className="home-page">
        <div className="flex flex-col justify-center items-center py-14 px-8 h-full">
          <figure className="page-not-found mb-4">
            <img src={failedToLoad} alt="Failed to Load" />
          </figure>
          <div className="pnf-title mb-4">
            <Typography text="black-color" weight="bold" size={20}>
            Failed to Load
            </Typography>
          </div>
          <div className="pnf-title mb-4">
            <Typography weight="regular" size={14}>
            There was an error loading this page. Please refresh to try again.
            </Typography>
          </div>
          <div className="btn-360">
            <Button handleClick={() => window.location.reload()} size="large" title="Refresh" fontWeight="medium" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorBoundaryComponent;
