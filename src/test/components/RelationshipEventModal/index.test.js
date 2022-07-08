import React from 'react';
import { shallow } from 'enzyme';
import RelationshipEventModal from '../../../components/Table/RelationshipEventModal';

let mockEventPerson = {
    date: "",
    location: "",
    locationId: "",
    description: "",
    birthLocationId: "",
    deathLocationId: "",
    birthLocation: "",
    deathLocation: "",
    sfirstName: "",
    slastName: "",
};
let mockNewEvent = { id: '', name: '' };

const wrapper = shallow(
    <RelationshipEventModal 
    eventDetails={undefined}
    eventModalPerson={mockEventPerson}
    dropDownPayload={undefined}
    handleChange={undefined}
    handleGender={undefined}
    setShowEventModal={undefined}
    showEventModal={undefined}
    setEventModalPerson={undefined}
    handleNewRelationshipEvent={undefined}
    handleIsLiving={undefined}
    newEvent={mockNewEvent}
    handleGetDirectChildren={undefined}
    directChildren={undefined}
    handleClearEventInfo={undefined}
    /> 
);

test('should test Relationship Event component with list of props', () => {
    expect(wrapper).toMatchSnapshot();
});