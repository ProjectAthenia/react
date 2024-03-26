import React from 'react';
import { render } from '@testing-library/react';
import GreyBackgroundSection from './index';

test('renders Input without crashing', () => {
    const { baseElement } = render(<GreyBackgroundSection/>);
    expect(baseElement).toBeDefined();
});
