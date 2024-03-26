import React from 'react';
import PostPage from './index';
import { shallow } from 'enzyme';
import {MemoryRouter} from 'react-router';

test('renders without crashing', () => {
    const baseElement = shallow(<MemoryRouter><PostPage  /></MemoryRouter>);
    expect(baseElement).toBeDefined();
});
