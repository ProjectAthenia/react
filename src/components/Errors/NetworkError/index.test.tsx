import React from 'react';
import { render } from '@testing-library/react';
import NetworkError from './index';

test('renders NetworkError without crashing', () => {
    const { baseElement } = render(<NetworkError/>);
    expect(baseElement).toBeDefined();
});
