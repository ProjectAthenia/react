import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import Platforms from './index';
import { renderWithProviders } from '../../../test-utils';
import { mockPlatformsContextValue } from '../../../test-utils/mocks/contexts';
import api from '../../../test-utils/mocks/api';
import Page from '../../../models/page';
import PlatformGroup from '../../../models/platform/platform-group';

const mockContextValue = {
  ...mockPlatformsContextValue,
  loadedData: [],
  initialLoadComplete: true,
  refreshing: false,
  hasAnotherPage: false,
  initiated: true,
  noResults: false,
  loadNext: jest.fn().mockResolvedValue({ data: [], current_page: 1, last_page: 1, total: 0 }),
  refreshData: jest.fn().mockResolvedValue({ data: [], current_page: 1, last_page: 1, total: 0 }),
  setFilter: jest.fn().mockResolvedValue({ data: [], current_page: 1, last_page: 1, total: 0 }),
  setSearch: jest.fn().mockResolvedValue({ data: [], current_page: 1, last_page: 1, total: 0 })
};

beforeEach(() => {
  jest.clearAllMocks();
  api.get.mockImplementation(() => Promise.resolve({ data: { data: [], current_page: 1, last_page: 1, total: 0 } }));
});

test('renders without crashing', async () => {
  renderWithProviders(
    <Platforms />,
    { value: mockContextValue }
  );
  await waitFor(() => {
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
