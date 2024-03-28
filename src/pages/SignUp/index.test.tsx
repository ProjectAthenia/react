import React from 'react';
import SignUpignUp from './index';
import { shallow } from 'enzyme';
import { MemoryRouter } from 'react-router';

test('renders without crashing', () => {
    const baseElement = shallow(<MemoryRouter><SignUpignUp /></MemoryRouter>);
    expect(baseElement).toBeDefined();
});
