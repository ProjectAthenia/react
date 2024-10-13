import React from 'react';
import { render } from '@testing-library/react';
import Page from './index';

test('renders Input without crashing', () => {
    const { baseElement } = render(<Page />);
    expect(baseElement).toBeDefined();
});
