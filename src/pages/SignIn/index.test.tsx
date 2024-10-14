import React from 'react';
import SignIn from './index';
import { shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';

test('renders without crashing', () => {
    const baseElement = shallow(<MemoryRouter><SignIn /></MemoryRouter>);
    expect(baseElement).toBeDefined();
});
