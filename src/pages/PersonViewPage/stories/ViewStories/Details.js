
import Typography from "./../../../../components/Typography";
import React from "react";
import Person from "./Person";

const Details = ({ view }) => {
  const getSavedToHtml = (_view) => {
    let html = null;
    if (_view?.personDetail?.length) {
      html = (
        <div className={`tagged-persons ${_view?.storyImages[0]?.url ? "in-prs" : ""}`}>
          <div className="person-wrap">
            {_view.personDetail.map((item, index) => (
              <div key={index} className="person-in-story text-blue-5 text-sm mr-2 flex flex-wrap">
                <Person item={item} authorId={_view?.authorId} removeIndex={index} personDetail={_view.personDetail} />
              </div>
            ))}
          </div>
        </div>
      );
    }
    return html;
  };
  return (
    <>
      <div className="details-tab-content px-6">
        <div className="mb-4">
          <h3 className="mb-2">
            <Typography text="secondary" weight="medium">
              People
            </Typography>
          </h3>
          {getSavedToHtml(view)}
        </div>
        <div className="mb-5">
          <h3 className="mb-2">
            <Typography text="secondary" weight="medium">
              Categories
            </Typography>
          </h3>
          {(view?.storyCategories || []).map((item, iIndex) => (
            <span key={iIndex} className="border border-gray-2 px-3 py-2 rounded-lg mr-2 inline-block">
              <Typography size={12}>
                <span className="block">{item}</span>
              </Typography>
            </span>
          ))}
        </div>
        <div>
          <h3>
            <Typography text="secondary" weight="medium">
              Privacy
            </Typography>
          </h3>
          <Typography size={12}>{view?.privacy}</Typography>
        </div>
      </div>
    </>
  );
};
export default Details;
