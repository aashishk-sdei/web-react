import React from 'react';
import { shallow } from 'enzyme';
import RowDetailMenuPopover from '../../../components/Table/RowDetailMenuPopover';

const disabledMenuItem = () => {
   return false;
}

const wrapper = shallow(
    <RowDetailMenuPopover
        menu={undefined}
        handleMenu={undefined}
        setRowElement={undefined}
        disabledMenuItem={disabledMenuItem}
    />
);

test('should test RowDetailMenuPopover component with list of props', () => {  
    expect(wrapper).toMatchSnapshot();
});


test('should test span type in RowDetailMenuPopover component', () => {
    const img = wrapper.find('span');
    expect(img).toHaveLength(1);
});

test('should test Button in RowDetailMenuPopover component', () => {
    const btn = wrapper.find('Button');
    expect(btn).toHaveLength(1);
});

test('should test ClickAwayListener in RowDetailMenuPopover component', () => {
    const listener = wrapper.find('ClickAwayListener');
    expect(listener).toHaveLength(1);
});
