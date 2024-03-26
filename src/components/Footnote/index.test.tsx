import React from 'react';
import { render } from '@testing-library/react';
import Footnote from './index';

test('renders Footnote without crashing', () => {
    const { baseElement } = render(<Footnote>A title</Footnote>);
    expect(baseElement).toBeDefined();
});
