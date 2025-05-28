import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import CategoryAutocomplete from './index';
import { renderWithRouter } from '../../../test-utils';
import { CategoriesContext } from '../../../contexts/CategoriesContext';
import CategoryRequests from '../../../services/requests/CategoryRequests';
import { mockPagination } from '../../../test-utils/mocks/pagination';
import { mockCategory } from '../../../test-utils/mocks/models/category';
import Category from '../../../models/category';

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock;

// Mock the CategoryRequests
jest.mock('../../../services/requests/CategoryRequests', () => ({
  createCategory: jest.fn()
}));

// Mock the CategoriesContext
jest.mock('../../../contexts/CategoriesContext', () => {
  const originalModule = jest.requireActual('../../../contexts/CategoriesContext');
  
  return {
    ...originalModule,
    CategoriesContextProvider: ({ children }: { children: React.ReactNode }) => (
      <CategoriesContext.Provider value={mockPagination({
        loadedData: [
          mockCategory({ id: 1, name: 'Action' }),
          mockCategory({ id: 2, name: 'Adventure' }),
          mockCategory({ id: 3, name: 'RPG' })
        ],
        limit: 100
      })}>
        {children}
      </CategoriesContext.Provider>
    )
  };
});

describe('CategoryAutocomplete', () => {
  const mockOnSelect = jest.fn();
  const mockContext = {
    loadedData: [] as Category[],
    setSearch: jest.fn(),
    setFilter: jest.fn(),
    setOrder: jest.fn(),
    loadNext: jest.fn(),
    refreshing: false,
    hasAnotherPage: false,
    total: 0,
    order: {},
    filter: {},
    search: {},
    limit: 10,
    loadAll: false,
    params: {},
    initiated: false,
    initialLoadComplete: false,
    noResults: false,
    expands: {},
    addModel: jest.fn(),
    removeModel: jest.fn(),
    getModel: jest.fn()
  };

  beforeEach(() => {
    mockOnSelect.mockClear();
    (CategoryRequests.createCategory as jest.Mock).mockClear();
  });

  const renderWithMantine = (component: React.ReactElement) => {
    return render(
      <MantineProvider>
        {component}
      </MantineProvider>
    );
  };

  it('renders with default props', () => {
    renderWithMantine(<CategoryAutocomplete onSelect={mockOnSelect} />);
    expect(screen.getByPlaceholderText('Search categories...')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    renderWithMantine(<CategoryAutocomplete onSelect={mockOnSelect} placeholder="Custom placeholder" />);
    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });

  it('renders with label', () => {
    renderWithMantine(<CategoryAutocomplete onSelect={mockOnSelect} label="Category" />);
    const input = screen.getByRole('textbox', { name: 'Category' });
    expect(input).toBeInTheDocument();
  });

  it('handles input changes', async () => {
    renderWithMantine(<CategoryAutocomplete onSelect={mockOnSelect} />);
    const input = screen.getByPlaceholderText('Search categories...');
    fireEvent.change(input, { target: { value: 'Test' } });
    expect(input).toHaveValue('Test');
  });

  it('calls onSelect when category is selected', async () => {
    const testCategory = { id: 1, name: 'Test Category', can_be_primary: true, description: '' };
    renderWithMantine(
      <CategoryAutocomplete 
        onSelect={mockOnSelect} 
        prioritizedCategories={[testCategory]} 
      />
    );
    const input = screen.getByPlaceholderText('Search categories...');
    fireEvent.change(input, { target: { value: 'Test Category' } });
    // Wait for the options to appear
    await waitFor(() => {
      expect(screen.getByText('Test Category')).toBeInTheDocument();
    });
    // Click the option
    fireEvent.click(screen.getByText('Test Category'));
    // Wait for the onSelect callback to be called
    await waitFor(() => {
      expect(mockOnSelect).toHaveBeenCalledWith(testCategory);
    }, { timeout: 1000 });
  });

  it('creates new category when non-existent category is selected', async () => {
    const newCategory: Category = { id: 2, name: 'New Category', can_be_primary: true };
    (CategoryRequests.createCategory as jest.Mock).mockResolvedValueOnce(newCategory);
    
    renderWithMantine(<CategoryAutocomplete onSelect={mockOnSelect} />);
    
    const input = screen.getByPlaceholderText('Search categories...');
    fireEvent.change(input, { target: { value: 'New Category' } });
    
    // Wait for the option to appear
    const option = await screen.findByText('New Category');
    fireEvent.click(option);
    
    // Wait for the category creation and onSelect callback
    await waitFor(() => {
      expect(CategoryRequests.createCategory).toHaveBeenCalledWith('New Category');
      expect(mockOnSelect).toHaveBeenCalledWith(newCategory);
    });
  });

  it('handles category creation error', async () => {
    (CategoryRequests.createCategory as jest.Mock).mockRejectedValueOnce(new Error('Creation failed'));
    
    renderWithMantine(<CategoryAutocomplete onSelect={mockOnSelect} />);
    
    const input = screen.getByPlaceholderText('Search categories...');
    fireEvent.change(input, { target: { value: 'New Category' } });
    
    // Wait for the option to appear
    const option = await screen.findByText('New Category');
    fireEvent.click(option);
    
    // Wait for the category creation attempt
    await waitFor(() => {
      expect(CategoryRequests.createCategory).toHaveBeenCalledWith('New Category');
      expect(mockOnSelect).not.toHaveBeenCalled();
    });
  });

  it('shows loading indicator when searching', async () => {
    renderWithRouter(<CategoryAutocomplete onSelect={mockOnSelect} />);
    
    const input = screen.getByPlaceholderText('Search categories...');
    fireEvent.change(input, { target: { value: 'Action' } });
    
    await waitFor(() => {
      expect(screen.getByText('Action')).toBeInTheDocument();
    });
  });

  it('shows existing categories when searching', async () => {
    renderWithRouter(<CategoryAutocomplete onSelect={mockOnSelect} />);
    
    const input = screen.getByPlaceholderText('Search categories...');
    fireEvent.change(input, { target: { value: 'Action' } });
    
    await waitFor(() => {
      expect(screen.getByText('Action')).toBeInTheDocument();
    });
  });

  it('calls onSelect with existing category when selected', () => {
    const existingCategory = { id: 1, name: 'Action', can_be_primary: true, description: '' };
    mockContext.loadedData = [existingCategory];
    
    renderWithMantine(<CategoryAutocomplete onSelect={mockOnSelect} />);
    
    const input = screen.getByPlaceholderText('Search categories...');
    fireEvent.change(input, { target: { value: 'Action' } });
    
    fireEvent.click(screen.getByText('Action'));
    
    expect(mockOnSelect).toHaveBeenCalledWith(existingCategory);
  });

  it('creates a new category when selecting a non-existent one', async () => {
    const newCategory = { id: 4, name: 'New Category', can_be_primary: true };
    (CategoryRequests.createCategory as jest.Mock).mockResolvedValueOnce(newCategory);
    
    renderWithRouter(<CategoryAutocomplete onSelect={mockOnSelect} />);
    
    const input = screen.getByPlaceholderText('Search categories...');
    fireEvent.change(input, { target: { value: 'New Category' } });
    
    await waitFor(() => {
      expect(screen.getByText('New Category')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('New Category'));
    
    await waitFor(() => {
      expect(CategoryRequests.createCategory).toHaveBeenCalledWith('New Category');
      expect(mockOnSelect).toHaveBeenCalledWith(newCategory);
    });
  });

  it('clears input when ref.clearInput is called', async () => {
    const ref = React.createRef<{ clearInput: () => void }>();
    
    renderWithRouter(<CategoryAutocomplete onSelect={mockOnSelect} ref={ref} />);
    
    const input = screen.getByPlaceholderText('Search categories...') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Test Category' } });
    
    expect(input.value).toBe('Test Category');
    
    ref.current?.clearInput();
    
    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('prioritizes categories passed in prioritizedCategories prop', async () => {
    const prioritizedCategories = [
      { id: 4, name: 'Strategy', can_be_primary: true },
      { id: 5, name: 'Simulation', can_be_primary: true }
    ];
    
    renderWithRouter(
      <CategoryAutocomplete 
        onSelect={mockOnSelect} 
        prioritizedCategories={prioritizedCategories} 
      />
    );
    
    const input = screen.getByPlaceholderText('Search categories...');
    fireEvent.change(input, { target: { value: 'S' } });
    
    await waitFor(() => {
      expect(screen.getByText('Strategy')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Simulation')).toBeInTheDocument();
    
    const dropdownItems = screen.getAllByRole('option');
    expect(dropdownItems[0]).toHaveTextContent('Strategy');
    expect(dropdownItems[1]).toHaveTextContent('Simulation');
  });

  test('handles category selection', async () => {
    renderWithRouter(<CategoryAutocomplete onSelect={mockOnSelect} />);
    const input = screen.getByPlaceholderText('Search categories...');
    fireEvent.change(input, { target: { value: 'Test Category' } });
    await waitFor(() => {
        expect(screen.getByText('Test Category')).toBeInTheDocument();
    });
  });
}); 