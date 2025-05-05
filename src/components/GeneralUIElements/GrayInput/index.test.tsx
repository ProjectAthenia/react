import React from 'react';
import { render, screen } from '@testing-library/react';
import GrayInput from './index';

describe('GrayInput', () => {
    it('renders children content', () => {
        render(
            <GrayInput>
                <div data-testid="test-content">Test Content</div>
            </GrayInput>
        );

        expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });

    it('applies correct styling class', () => {
        const { container } = render(
            <GrayInput>
                Test Content
            </GrayInput>
        );

        expect(container.firstChild).toHaveClass('gray-input');
    });
});
