import React from 'react';
import { shallow } from 'enzyme';
import PhoneNumberInput from './index';

test('renders PhoneNumberInput without crashing', () => {
    const baseElement = shallow(<PhoneNumberInput name={''} value={''} onPhoneNumberChange={() => {}} />);
    expect(baseElement).toBeDefined();
});
