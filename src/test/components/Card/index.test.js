import React from 'react';
import { shallow } from 'enzyme';

import Card from '../../../components/Card';
import { cardType } from "../../../components/utils";

const { FOCUSED_LIVING } = cardType;

const blankId = "00000000-0000-0000-0000-000000000000";

test('should test Card component with list of props', () => {
    const wrapper = shallow(
        <Card 
            id={blankId}
            parentId={blankId}
            cFilialId={blankId}
            type={FOCUSED_LIVING}
            path={"0/0"}
            title="Add Father"
            firstName="John Walker"
            firstNameWithInitials="J W"
            lastName="Alice"
            isLiving={true}
            gender="Male"
            birth="01 Jan 1885"
            birthPlace="Utah, USA"
            death="20 Oct 1935"
            deathPlace="Utah, USA"
            imgsrc="imgsrc"
            relatedParentIds={blankId}
        />
    );
    expect(wrapper).toMatchSnapshot();
});