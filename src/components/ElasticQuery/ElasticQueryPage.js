import React from "react";
import { useSelector } from "react-redux";
import "./index.css";

const ElasticQueryPage = () => {

  const { elasticQuery , name } = useSelector((state) => state.location);

  return (
    <div className="bg-gray-2 privacy">
      <div className="pt-18 md:pt-22.5 all-stories-page-wrap main-wrapper mx-auto w-full">
        <div className="bg-white rounded-lg p-7 mb-9">
          <h1 className="font-bold text-xl text-black">ElasticQuery : {name} </h1>
        </div>
        <div className="bg-white rounded-lg p-7 mb-9">
          <code>{JSON.stringify(elasticQuery)}</code>
        </div>
      </div>
    </div>
  );
};

export default ElasticQueryPage;
