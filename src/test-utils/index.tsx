import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Router, MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { MantineProvider } from '@mantine/core';
import { GamesContext } from '../contexts/GamingComponents/GamesContext';
import { MeContextProvider, mockGamesContextValue } from './mocks/contexts';

// Import mocks
import './mocks/requests';
import { mockHistoryPush } from './mocks/external';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    route?: string;
    value?: any;
}

export function renderWithRouter(ui: React.ReactElement, { route = '/' }: { route?: string } = {}) {
    return render(
        <MantineProvider>
            <MemoryRouter initialEntries={[route]}>
                {ui}
            </MemoryRouter>
        </MantineProvider>
    );
}

export function renderWithProviders(ui: React.ReactElement, { route = '/', value = mockGamesContextValue }: CustomRenderOptions = {}) {
    const history = createMemoryHistory({ initialEntries: [route] });

    const Wrapper = ({ children }: { children: React.ReactNode }) => {
        return (
            <MantineProvider>
                <Router history={history}>
                    <MeContextProvider>
                        <GamesContext.Provider value={value}>
                            {children}
                        </GamesContext.Provider>
                    </MeContextProvider>
                </Router>
            </MantineProvider>
        );
    };

    return {
        ...render(ui, { wrapper: Wrapper }),
        history,
    };
}

// Re-export mocks
export { mockHistory, mockHistoryPush, mockUseParams } from './mocks/external';

// Re-export everything
export * from '@testing-library/react';
