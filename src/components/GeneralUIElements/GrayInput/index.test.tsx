import React from 'react';
import { render } from '@testing-library/react';
import GrayInput from './index';

test('renders GrayInput without crashing', () => {
    const { baseElement } = render(<GrayInput/>);
    expect(baseElement).toBeDefined();
});
