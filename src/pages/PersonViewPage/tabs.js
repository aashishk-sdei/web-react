import React from "react";

// Components
import Button from "../../components/Button";

const arrayOfTabs = [
    {
        id: 0,
        tkey: "person.header.details"
    },
    {
        id: 1,
        tkey: "person.header.stories"
    },
    {
        id: 4,
        tkey: "person.header.research"
    },
    {
        id: 2,
        tkey: "person.header.media"
    },
    {
        id: 3,
        tkey: "Relationships"
    }
];

const Tabs = (props) => {

    return (
        arrayOfTabs.map((ele, idx) =>
            <div key={idx}>
                <Button
                    type={props.tab === ele.id ? "secondary" : "default"}
                    size="medium"
                    tkey={ele.tkey}
                    handleClick={() => props.handleTab(ele.id)}
                    fontWeight="medium"
                    disabled={props.isPrivate}
                />
            </div>
        )
    )
}

export default Tabs;