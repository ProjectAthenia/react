import React from 'react';
import { render } from '@testing-library/react';
import TermsOfUseText from './index';

test('renders Input without crashing', () => {
    const { baseElement } = render(<TermsOfUseText />);
    expect(baseElement).toBeDefined();
});
