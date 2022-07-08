import React from "react";
import Button from "../../components/Button";
const arrayOfTabs = [
  {
    id: 0,
    tkey: "Stories"
  },
  {
    id: 1,
    tkey: "Media",
  },
];
const Tabs = (props) => {
  return arrayOfTabs.map((ele, idx) => (
    <div key={idx}>
      <Button type={props.tab === ele.id ? "secondary" : "default"} size="medium" tkey={ele.tkey} handleClick={() => props.handleTab(ele.id)} fontWeight="medium"/>
    </div>
  ));
};
export default Tabs;
