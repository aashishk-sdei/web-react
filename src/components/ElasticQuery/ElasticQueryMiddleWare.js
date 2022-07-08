import React from "react";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

const ElasticQueryMiddleWare = () => {
  const location = useLocation();
  const history = useHistory();

  const isEs = location.search.toLowerCase().includes("&es=true");
  const { elasticQuery } = useSelector((state) => state.location);

  React.useEffect(() => {
    if (isEs && elasticQuery) {
      history.push("/elasticquery");
    }
  }, [elasticQuery]);
  return null;
};

export default ElasticQueryMiddleWare;
