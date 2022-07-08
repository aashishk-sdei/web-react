import React from "react";
import TailwindModal from "../../../components/TailwindModal";
import FolderGif from "../../../assets/images/folder.gif";
const SavedModel = ({ showModel, setShowModel }) => {
  return (
    <TailwindModal
      title=""
      showClose={false}
      content={
        <div className="text-center">
          <div className="flex justify-center">
            <img className="w-2/4" src={FolderGif} alt="folder" />
          </div>
          <h3 className="text-gray-7 font-bold text-2xl pb-3">Nice work!</h3>
          <h5 className="test-sm">This record has been saved to</h5>
          <h4 className="test-sm font-semibold pb-12">Isaac Leroy Hamack</h4>
        </div>
      }
      showModal={showModel}
      setShowModal={setShowModel}
      innerClasses="max-w-sm"
      clickAwayClose={true}
    />
  );
};
export default SavedModel;
