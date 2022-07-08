import React from "react";

// Components
import Table from "../../components/Table";
import { useTranslation } from 'react-i18next';
import { tr } from '../../components/utils';

const getBlur = (isLiving, isOwner) => {
    if (isLiving && !isOwner) return "filter blur-sm inline";
    return "inline";
}

const getEvents = (events, type, isOwner) => {
    return events && events.reduce((res, ele) => {
        res.push({
            tableType: type,
            id: ele.id,
            name: ele.name,
            age: ele.age,
            date: ele.date.Date.RawDate,
            location: ele.location.Location,
            locationId: ele.location.LocationId || "",
            assertionId: ele.id,
            relationships: ele.relationships ? ele.relationships.map((e, i) => e.lastName ? <div className={getBlur(e.isLiving, isOwner)}>{e.firstName}&nbsp;{e.lastName}{ele.relationships.length - 1 !== i ? `, ` : ``}&nbsp;</div> : <div className={getBlur(e.isLiving, isOwner)}>{e.firstName}{ele.relationships.length - 1 !== i ? `, ` : ``}&nbsp;</div>) : "",
            relationshipTooltip: ele.relationships ? ele.relationships.map((e) => e.isLiving && !isOwner ? 1 : 0) : []
        });
        return res;
    }, []);
}

const Events = (props) => {

    const {
        type,
        events,
        handleUpdate,
        person
    } = props;

    const { t } = useTranslation();

    return (
        <Table
            id="events"
            type={type}
            columns={[tr(t, "person.table.events.events"), tr(t, "person.table.events.age"), tr(t, "person.table.events.date"), tr(t, "person.table.events.location"), tr(t, "person.table.events.relationship")]}
            keys={["name", "age", "date", "location", "relationships"]}
            data={getEvents(events, type, props.isOwner) || []}
            handleUpdate={handleUpdate}
            loading={person.eventsLoading}
            person={person}
            {...props}
        />
    )
}

export default Events;