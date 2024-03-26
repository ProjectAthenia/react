import React from 'react';
import Home from './index';
import { shallow } from 'enzyme';
import {MemoryRouter} from 'react-router';

test('renders without crashing', () => {
    const baseElement = shallow(<MemoryRouter><Home  /></MemoryRouter>);
    expect(baseElement).toBeDefined();
});
