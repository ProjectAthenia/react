import React from 'react';
import { render, screen } from '@testing-library/react';
import BorderedInput from './index';

describe('BorderedInput', () => {
    it('renders children content', () => {
        render(
            <BorderedInput>
                <div data-testid="test-content">Test Content</div>
            </BorderedInput>
        );

        expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });

    it('applies correct styling class', () => {
        render(
            <BorderedInput>
                Test Content
            </BorderedInput>
        );

        expect(screen.getByText('Test Content').parentElement).toHaveClass('bordered-input');
    });
});
