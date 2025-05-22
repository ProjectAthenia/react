import { BasePaginatedContextState } from '../../contexts/BasePaginatedContext';

export interface PaginationMockOptions<T = any> {
    loadedData?: T[];
    refreshing?: boolean;
    hasAnotherPage?: boolean;
    initialLoadComplete?: boolean;
    initiated?: boolean;
    noResults?: boolean;
    expands?: string[];
    order?: Record<string, any>;
    filter?: Record<string, any>;
    search?: Record<string, any>;
    limit?: number;
    loadAll?: boolean;
    loadNext?: jest.Mock;
    refreshData?: jest.Mock;
    setFilter?: jest.Mock;
    setSearch?: jest.Mock;
    setOrder?: jest.Mock;
    addModel?: jest.Mock;
    removeModel?: jest.Mock;
    getModel?: jest.Mock;
    params?: Record<string, any>;
}

export const mockPagination = <T = any>(options: PaginationMockOptions<T> = {}): BasePaginatedContextState<T> => {
    const defaultMock: BasePaginatedContextState<T> = {
        loadedData: [],
        refreshing: false,
        hasAnotherPage: false,
        initialLoadComplete: true,
        initiated: true,
        noResults: false,
        expands: [],
        order: {},
        filter: {},
        search: {},
        limit: 50,
        loadAll: true,
        loadNext: jest.fn(),
        refreshData: jest.fn(),
        setFilter: jest.fn(),
        setSearch: jest.fn(),
        setOrder: jest.fn(),
        addModel: jest.fn(),
        removeModel: jest.fn(),
        getModel: jest.fn(),
        params: {}
    };

    return {
        ...defaultMock,
        ...options
    };
}; 