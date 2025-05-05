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
        const { container } = render(
            <BorderedInput>
                Test Content
            </BorderedInput>
        );

        expect(container.firstChild).toHaveClass('bordered-input');
    });
});
