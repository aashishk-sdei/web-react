import React from 'react';
import { shallow } from 'enzyme';

import Drawer from '../../../components/Drawer';

test('should test Drawer component with list of props', () => {
    const wrapper = shallow(
        <Drawer 
            open={true}
            handleClose={undefined}
            title="title"
            subTitle="subtitle"
            options={[{ id: 1, name: "Option 1" }, { id: 2, name: "Option 2" }]}
            handleSelect={undefined}
        />
    );
    expect(wrapper).toMatchSnapshot();
});
