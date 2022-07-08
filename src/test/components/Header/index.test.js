import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from "react-redux";
import store from "../../../redux/store";
import Header from '../../../components/Header';

test('should test Header component with list of props', () => {
    const wrapper = shallow(
        <Provider store={store}>
            <Header />
        </Provider>
    );
    expect(wrapper).toMatchSnapshot();
});