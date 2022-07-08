import React from 'react';
import { shallow } from 'enzyme';
import HeroImageUploader from '../../../components/HeroImageUploader';

test('should test HeroImageUploader component with list of props', () => {
    const wrapper = shallow(
        <HeroImageUploader
        saveImageFile={undefined}
        selectedHeroFile={undefined}
        setSelectedHeroFile={undefined}
        onTargetClick={undefined}
        heroImageRef={undefined}
        imageLoading={undefined}
        selectShowImage={undefined}
        className={undefined}
        setCropState={undefined}
      />
    );
    expect(wrapper).toMatchSnapshot();
});