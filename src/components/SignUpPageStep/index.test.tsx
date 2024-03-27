import React from 'react';
import { render } from '@testing-library/react';
import SignUpPageStep from './index';
import { shallow } from 'enzyme';
import {MemoryRouter} from 'react-router';

test('renders AuthHeader without crashing', () => {
    const baseElement = shallow(<MemoryRouter><SignUpPageStep cancelOnBack={false}/></MemoryRouter>);
    expect(baseElement).toBeDefined();
});
