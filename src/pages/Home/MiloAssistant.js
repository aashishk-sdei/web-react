import React, {useState } from "react";
import TailwindModal from "../../components/TailwindModal";
import Typography from "./../../components/Typography";
import Milo from "./Milo";
import milosvg from '../../assets/images/milo.svg';

const MiloAssistant = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="bg-white card recent-people-card">
      <div className="card-content-wrap py-4 px-6">
        <div className="head flex justify-center items-center mb-4">
          <div className="mt-1">
          <img src={milosvg} alt="" />
          </div>
        </div>
        <div className="text-center">
          <Typography size={16} weight="bold">
            <h4 className="text-gray-7 mb-3">Meet Milo, our Story Assistant</h4>
          </Typography>
          <Typography size={14}>
            {" "}
            <p className="text-gray-7 mb-3">Milo helps you write stories you may not think of on your own. Add your phone number to try this feature out on your phone through SMS. </p>
          </Typography>

          <button onClick={() => setShowModal(true)} className="bg-blue-4 rounded-lg py-1.5 px-4 text-white text-sm mb-3">
            Try it Out
          </button>
        </div>
      </div>
      <TailwindModal showClose={true} content={<Milo setShowModal={setShowModal} />} showModal={showModal} setShowModal={setShowModal} innerClasses="max-w-sm" />
    </div>
  );
};
export default MiloAssistant;
