import React from 'react';
import { shallow } from 'enzyme';

import Checkbox from '../../../components/Checkbox';

const blankId = "00000000-0000-0000-0000-000000000000";

const myObj = {
    user: ""
}

test('should test Checkbox component with list of props', () => {
    const wrapper = shallow(
        <Checkbox
            id={blankId}
            obj={myObj}
            checked={true}
            color="default"
            disabled={true}
            handleChange={undefined}
            label="label"
            labelColor="primary"
        />
    );
    expect(wrapper).toMatchSnapshot();
});

it("accepts color prop", () => {
    const wrapper = shallow(<Checkbox color="default" />);
    expect(wrapper.props().color).toEqual("default");
});