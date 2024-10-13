import React from 'react';
import { shallow } from 'enzyme';
import {MemoryRouter} from 'react-router';
import SignIn from "./index";

test('renders without crashing', () => {
    const baseElement = shallow(<MemoryRouter><SignIn  /></MemoryRouter>);
    expect(baseElement).toBeDefined();
});
