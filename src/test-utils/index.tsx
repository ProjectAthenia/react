import React from 'react';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { MantineProvider } from '@mantine/core';
import { MeContextProvider } from './mocks/contexts';
import { BrowserRouter } from 'react-router-dom';

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
            <BrowserRouter>
                <MantineProvider>
                    <MeContextProvider>
                        {component}
                    </MeContextProvider>
                </MantineProvider>
            </BrowserRouter>
        ),
        history,
    };
};

export const renderWithProviders = (
    component: React.ReactElement,
    {
        route = '/',
        history = createMemoryHistory({ initialEntries: [route] }),
    } = {}
) => {
    return renderWithRouter(component, { route, history });
};

// Re-export mocks
export { mockHistory, mockHistoryPush, mockUseParams } from './mocks/external';
export { MeContextProvider } from './mocks/contexts';

// Re-export everything
export * from '@testing-library/react';
