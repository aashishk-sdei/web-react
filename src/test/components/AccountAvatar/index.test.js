import React from 'react';
import { shallow } from 'enzyme';
import AccountAvatar from '../../../components/AccountAvatar';

test('should test AccountAvatar component with list of props', () => {
    const wrapper = shallow(
        <AccountAvatar avatarName={'UserName'} imgSrc={undefined} />
    );
    expect(wrapper).toMatchSnapshot();
});


test('should test div type in AccountAvatar component', () => {
    const wrapper = shallow(<AccountAvatar avatarName={'UserName'} imgSrc={undefined}/>);
    const input = wrapper.find('div');
    expect(input).toHaveLength(1);
});