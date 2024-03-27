import React from 'react';
import SignInEmail from './index';
import { shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';

test('renders without crashing', () => {
    const baseElement = shallow(<MemoryRouter><SignInEmail /></MemoryRouter>);
    expect(baseElement).toBeDefined();
});
