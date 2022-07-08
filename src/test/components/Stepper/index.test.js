import React from "react";
import { mount, shallow } from "enzyme";
import MyStepper from "../../../components/Stepper/index";

test("Test MyStepper component", () => {
  const wrapper = mount(<MyStepper />);
  expect(wrapper).toBeTruthy();
});

test("should test MyStepper component with list of props", () => {
  const wrapper = shallow(<MyStepper step={undefined} content={undefined} />);
  expect(wrapper).toMatchSnapshot();
});
