import React from 'react';
import ConfirmationPageContent from './index';
import { shallow } from 'enzyme';
import {MemoryRouter} from 'react-router';

test('renders SimpleInputLocationEditPage without crashing', () => {
    const baseElement = shallow(
        <MemoryRouter>
            <ConfirmationPageContent  confirmText={""} onConfirm={() => {}}/>
        </MemoryRouter>
    );
    expect(baseElement).toBeDefined();
});
