import React from 'react';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { MantineProvider } from '@mantine/core';
import { MeContextProvider } from './mocks/contexts';

// Import mocks
import './mocks/requests';
import './mocks/contexts';

export const renderWithRouter = (
    component: React.ReactElement,
    {
        route = '/',
        history = createMemoryHistory({ initialEntries: [route] }),
    } = {}
) => {
    return {
        ...render(
            <MantineProvider>
                <MeContextProvider>
                    {component}
                </MeContextProvider>
            </MantineProvider>
        ),
        history,
    };
};

// Re-export mocks
export { mockHistory, mockHistoryPush, mockUseParams } from './mocks/external';

// Re-export everything
export * from '@testing-library/react';
