import React from "react";
import { mount } from "enzyme";
import TailwindModalDialog from "../../../components/TailwindModalDialog";

describe('Test TailwindModalDialog component with props', () => {
    const mockCallBack = jest.fn(()=> true);
    const mockCallBackStopProp = jest.fn(()=> true);
    let modal;
    beforeEach(() => {
      modal = mount(<TailwindModalDialog showModal = {true}
        setShowModal = {mockCallBack}
        clickAwayClose = {false}
        title = {"Test TailwindModalDialog"}
        content = {"Test TailwindModalDialog Content"}/>);
    });
    it('match snapshot', () => {
      expect(modal).toMatchSnapshot();
    });
    it('match showModal props is true', () => {
      expect(modal.props().showModal).toEqual(true);
    });
    it('match subTitle props', () => {
      modal.setProps({ subTitle: "test Here" });
      expect(modal.props().subTitle).toEqual("test Here");
    });
    it('match showModal props is false', () => {
      modal.setProps({ showModal: false });
      expect(modal.props().showModal).toEqual(false);
    });
    it('match showClose props is false', () => {
      modal.setProps({ showClose: false });
      expect(modal.props().showClose).toEqual(false);
    });
    it('match for close button click', () => {
      modal.find('button.outline-none').simulate('click', {
        stopPropagation: jest.fn()
      });
      expect(mockCallBack.mock.calls.length).toEqual(1);
    })
    it('match for stop on modal click', () => {
      modal.find('#twModal').simulate('click', {
        stopPropagation: mockCallBackStopProp
      });
      expect(mockCallBackStopProp.mock.calls.length).toEqual(1);
    })
    afterEach(() => {
      modal.unmount()
    });
});