import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import ReleasesList from './ReleasesList';
import { ReleasesContext, ReleasesContextProvider } from '../../../contexts/GamingComponents/ReleasesContext';
import { renderWithRouter, mockHistory, mockHistoryPush, mockUseParams } from '../../../test-utils';
import ReleaseBrowser from '.';
import { ReleasesContextState } from '../../../contexts/GamingComponents/ReleasesContext';
import { mockPlatform, mockPlatformGroup, mockRelease1, mockRelease2 } from '../../../test-utils/mocks/models';
import { mockContextValue, mockSetFilter, mockOnYearChanged } from '../../../test-utils/mocks/contexts';

// Mock the ReleasesContextProvider
jest.mock('../../../contexts/GamingComponents/ReleasesContext', () => ({
    ...jest.requireActual('../../../contexts/GamingComponents/ReleasesContext'),
    ReleasesContextProvider: ({ children, platformIds }: { children: React.ReactNode, platformIds: number[] }) => {
        const contextValue: ReleasesContextState = {
            loadedData: [mockRelease1, mockRelease2],
            initialLoadComplete: true,
            refreshing: false,
            hasAnotherPage: false,
            initiated: true,
            noResults: false,
            expands: [],
            order: {},
            filter: {},
            search: {},
            limit: 20,
            loadAll: false,
            loadNext: jest.fn(),
            refreshData: jest.fn(),
            setFilter: mockSetFilter,
            setSearch: jest.fn(),
            setOrder: jest.fn(),
            addModel: jest.fn(),
            removeModel: jest.fn(),
            getModel: jest.fn(),
            params: {},
        };

        React.useEffect(() => {
            if (platformIds?.length) {
                contextValue.setFilter('platform_id', platformIds[0]);
            }
        }, [platformIds]);

        return (
            <ReleasesContext.Provider value={contextValue}>
                {children}
            </ReleasesContext.Provider>
        );
    }
}));

const renderWithReleasesContext = (
    platform?: typeof mockPlatform,
    platformGroup?: typeof mockPlatformGroup
) => {
    return renderWithRouter(
        <ReleaseBrowser platform={platform} platformGroup={platformGroup} />
    );
};

const renderWithContext = (contextValue: ReleasesContextState = mockContextValue) => {
    const mockOnYearChanged = jest.fn();
    return renderWithRouter(
        <ReleasesContext.Provider value={contextValue}>
            <ReleasesList contextState={contextValue} onYearChanged={mockOnYearChanged} />
        </ReleasesContext.Provider>
    );
};

describe('ReleasesList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockHistoryPush.mockClear();
        mockHistory.push.mockClear();
    });

    it('renders loading state', () => {
        const contextValue = {
            ...mockContextValue,
            refreshing: true,
            loadedData: []
        };
        
        renderWithRouter(
            <ReleasesContext.Provider value={contextValue}>
                <ReleasesList contextState={contextValue} onYearChanged={jest.fn()} />
            </ReleasesContext.Provider>
        );
        
        expect(screen.getByTestId('releases-list')).toBeInTheDocument();
    });

    it('renders grid with data', () => {
        const mockOnYearChanged = jest.fn();
        renderWithRouter(
            <ReleasesContext.Provider value={mockContextValue}>
                <ReleasesList contextState={mockContextValue} onYearChanged={mockOnYearChanged} />
            </ReleasesContext.Provider>
        );
        expect(screen.getByText('Test Game 1')).toBeInTheDocument();
        expect(screen.getAllByText('8.0')).toHaveLength(2);
        expect(screen.getAllByText('8.8')).toHaveLength(2);
    });

    it('displays correct data in grid cells', () => {
        const mockOnYearChanged = jest.fn();
        renderWithRouter(
            <ReleasesContext.Provider value={mockContextValue}>
                <ReleasesList contextState={mockContextValue} onYearChanged={mockOnYearChanged} />
            </ReleasesContext.Provider>
        );
        
        const row = screen.getByText('Test Game 1').closest('tr');
        expect(row).toHaveTextContent('Test Game 1');
        expect(row).toHaveTextContent('8.0');
        expect(row).toHaveTextContent('8.8');
    });

    it('handles refreshing state', () => {
        const contextValue = {
            ...mockContextValue,
            refreshing: true,
            loadedData: []
        };
        
        renderWithRouter(
            <ReleasesContext.Provider value={contextValue}>
                <ReleasesList contextState={contextValue} onYearChanged={jest.fn()} />
            </ReleasesContext.Provider>
        );
        
        expect(screen.getByTestId('releases-list')).toBeInTheDocument();
    });

    it('renders year selector with no year selected by default', () => {
        const mockOnYearChanged = jest.fn();
        renderWithRouter(
            <ReleasesContext.Provider value={mockContextValue}>
                <ReleasesList contextState={mockContextValue} onYearChanged={mockOnYearChanged} />
            </ReleasesContext.Provider>
        );
        
        const yearFilter = screen.getByPlaceholderText(/Filter Release Date/i);
        expect(yearFilter).toBeInTheDocument();
        expect(yearFilter).toHaveValue('');
    });

    it('calls onYearChanged when year is changed', () => {
        const mockOnYearChanged = jest.fn();
        renderWithRouter(
            <ReleasesContext.Provider value={mockContextValue}>
                <ReleasesList contextState={mockContextValue} onYearChanged={mockOnYearChanged} />
            </ReleasesContext.Provider>
        );

        // Get the year filter input by its placeholder text
        const yearFilter = screen.getByPlaceholderText(/Filter Release Date/i);
        expect(yearFilter).toBeInTheDocument();
        
        // Test with a valid year (after 1960)
        fireEvent.change(yearFilter, { target: { value: '2024' } });
        expect(mockOnYearChanged).toHaveBeenCalledWith(2024);

        // Test with an invalid year (before 1960)
        fireEvent.change(yearFilter, { target: { value: '1950' } });
        expect(mockOnYearChanged).toHaveBeenCalledWith(undefined);

        // Test with empty value
        fireEvent.change(yearFilter, { target: { value: '' } });
        expect(mockOnYearChanged).toHaveBeenCalledWith(undefined);
    });
});

describe('ReleaseBrowser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders releases table when data is loaded', async () => {
        renderWithReleasesContext(mockPlatform);
        await waitFor(() => {
            expect(screen.getByTestId('releases-list')).toBeInTheDocument();
        });
    });

    it('sets platform id from platform prop', () => {
        renderWithReleasesContext(mockPlatform);
        expect(mockSetFilter).toHaveBeenCalledWith('platform_id', mockPlatform.id);
    });

    it('sets platform id from platform group prop', () => {
        renderWithReleasesContext(undefined, mockPlatformGroup);
        expect(mockSetFilter).toHaveBeenCalledWith('platform_id', mockPlatform.id);
    });

    it('does not set platform id when platform id is undefined', () => {
        renderWithReleasesContext();
        expect(mockSetFilter).not.toHaveBeenCalledWith('platform_id', expect.any(Number));
    });

    it('does not set platform id when platform group has no platforms', () => {
        const emptyPlatformGroup = { ...mockPlatformGroup, platforms: [] };
        renderWithReleasesContext(undefined, emptyPlatformGroup);
        expect(mockSetFilter).not.toHaveBeenCalledWith('platform_id', expect.any(Number));
    });
}); 