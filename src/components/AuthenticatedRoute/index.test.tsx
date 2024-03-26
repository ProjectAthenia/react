import React from 'react';
import AuthenticatedRoute from './index';
import { shallow } from 'enzyme';

test('renders without crashing', () => {
    const baseElement = shallow(<AuthenticatedRoute ><div></div></AuthenticatedRoute>);
    expect(baseElement).toBeDefined();
});
