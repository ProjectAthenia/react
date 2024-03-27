import React from 'react';
import { render } from '@testing-library/react';
import PrivacyPolicy from './index';
import {MemoryRouter} from 'react-router';

test('renders without crashing', () => {
    const { baseElement } = render(<MemoryRouter><PrivacyPolicy /></MemoryRouter>);
    expect(baseElement).toBeDefined();
});
