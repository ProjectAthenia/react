import React from 'react';
import { render } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import { MantineProvider } from '@mantine/core';
import { MeContextProvider } from './mocks/contexts';
import { BrowserRouter } from 'react-router-dom';
import { CategoriesContext, CategoriesContextState } from '../contexts/CategoriesContext';

// Import mocks
import './mocks/requests';
import './mocks/contexts';

interface RouterOptions {
    route?: string;
    history?: MemoryHistory;
}

interface ProviderOptions extends RouterOptions {
    value?: CategoriesContextState;
}

export const renderWithRouter = (
    component: React.ReactElement,
    {
        route = '/',
        history = createMemoryHistory({ initialEntries: [route] }),
    }: RouterOptions = {}
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
        value,
    }: ProviderOptions = {}
) => {
    const wrappedComponent = value ? (
        <CategoriesContext.Provider value={value}>
            {component}
        </CategoriesContext.Provider>
    ) : component;

    return renderWithRouter(wrappedComponent, { route, history });
};

// Re-export mocks
export { mockHistory, mockHistoryPush, mockUseParams } from './mocks/external';
export { MeContextProvider } from './mocks/contexts';

// Re-export everything
export * from '@testing-library/react';
