import React from 'react';
import { render } from '@testing-library/react';
import ServerAlert from './index';
import { shallow } from 'enzyme';
import {MemoryRouter} from 'react-router';

test('renders ServerAlert without crashing', () => {
    const baseElement = shallow(<MemoryRouter><ServerAlert requestError={{data: {}}}  onCloseAlert={() => {}}/></MemoryRouter>);
    expect(baseElement).toBeDefined();
});
