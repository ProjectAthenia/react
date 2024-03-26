import React from 'react';
import { render } from '@testing-library/react';
import PrivacyPolicyText from './index';
import {MemoryRouter} from 'react-router';

test('renders Input without crashing', () => {
    const { baseElement } = render(<MemoryRouter><PrivacyPolicyText contactUsUrl={''} /></MemoryRouter>);
    expect(baseElement).toBeDefined();
});
