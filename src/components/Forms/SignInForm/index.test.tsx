import React from 'react';
import SignInForm from './index';
import { shallow } from 'enzyme';

test('renders SignInForm without crashing', () => {
    const baseElement = shallow(
        <SignInForm/>
    );
    expect(baseElement).toBeDefined();
});
