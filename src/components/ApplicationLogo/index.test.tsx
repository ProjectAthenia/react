import React from 'react';
import { shallow } from 'enzyme';
import ApplicationLogo from './index';

test('renders ApplicationLogo without crashing', () => {
    const baseElement = shallow(<ApplicationLogo />);
    expect(baseElement).toBeDefined();
});
