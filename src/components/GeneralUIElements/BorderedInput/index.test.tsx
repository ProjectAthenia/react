import React from 'react';
import { render } from '@testing-library/react';
import BorderedInput from './index';

test('renders BorderedInput without crashing', () => {
    const { baseElement } = render(<BorderedInput/>);
    expect(baseElement).toBeDefined();
});
