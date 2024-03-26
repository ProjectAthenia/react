import React from 'react';
import ContactUsForm from './index';
import {MemoryRouter} from 'react-router';
import {shallow} from 'enzyme';

test('renders ContactUsForm without crashing', () => {
    const baseElement = shallow(<MemoryRouter><ContactUsForm/></MemoryRouter>);
    expect(baseElement).toBeDefined();
});
