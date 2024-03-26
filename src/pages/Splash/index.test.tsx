import React from 'react';
import Albums from './index';
import { shallow } from 'enzyme';
import {MemoryRouter} from 'react-router';

test('renders without crashing', () => {
    const baseElement = shallow(<MemoryRouter><Albums  /></MemoryRouter>);
    expect(baseElement).toBeDefined();
});
