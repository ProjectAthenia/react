import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CategoryAutocomplete from './index';
import { renderWithRouter } from '../../../test-utils';
import { CategoriesContext, CategoriesContextState } from '../../../contexts/CategoriesContext';
import CategoryRequests from '../../../services/requests/CategoryRequests';
import { mockPagination } from '../../../test-utils/mocks/pagination';
import { mockCategory } from '../../../test-utils/mocks/models/category';

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
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    renderWithRouter(<CategoryAutocomplete onSelect={mockOnSelect} />);
    
    expect(screen.getByPlaceholderText('Search categories...')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    renderWithRouter(<CategoryAutocomplete onSelect={mockOnSelect} placeholder="Custom placeholder" />);
    
    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });

  it('renders with label', () => {
    renderWithRouter(<CategoryAutocomplete onSelect={mockOnSelect} label="Category" />);
    
    expect(screen.getByText('Category')).toBeInTheDocument();
  });

  it('shows loading indicator when searching', async () => {
    renderWithRouter(<CategoryAutocomplete onSelect={mockOnSelect} />);
    
    const input = screen.getByPlaceholderText('Search categories...');
    fireEvent.change(input, { target: { value: 'Action' } });
    
    // Wait for the debounce to complete
    await waitFor(() => {
      expect(screen.getByText('Action')).toBeInTheDocument();
    });
  });

  it('shows existing categories when searching', async () => {
    renderWithRouter(<CategoryAutocomplete onSelect={mockOnSelect} />);
    
    const input = screen.getByPlaceholderText('Search categories...');
    fireEvent.change(input, { target: { value: 'Action' } });
    
    // Wait for the debounce to complete and results to appear
    await waitFor(() => {
      expect(screen.getByText('Action')).toBeInTheDocument();
    });
  });

  it('calls onSelect with existing category when selected', async () => {
    renderWithRouter(<CategoryAutocomplete onSelect={mockOnSelect} />);
    
    const input = screen.getByPlaceholderText('Search categories...');
    fireEvent.change(input, { target: { value: 'Action' } });
    
    // Wait for the debounce to complete and results to appear
    await waitFor(() => {
      expect(screen.getByText('Action')).toBeInTheDocument();
    });
    
    // Select the category
    fireEvent.click(screen.getByText('Action'));
    
    // Verify onSelect was called with the correct category
    expect(mockOnSelect).toHaveBeenCalledWith({ id: 1, name: 'Action', can_be_primary: true });
  });

  it('creates a new category when selecting a non-existent one', async () => {
    // Mock the createCategory function to return a new category
    (CategoryRequests.createCategory as jest.Mock).mockResolvedValueOnce({ id: 4, name: 'New Category', can_be_primary: true });
    
    renderWithRouter(<CategoryAutocomplete onSelect={mockOnSelect} />);
    
    const input = screen.getByPlaceholderText('Search categories...');
    fireEvent.change(input, { target: { value: 'New Category' } });
    
    // Wait for the debounce to complete and results to appear
    await waitFor(() => {
      expect(screen.getByText('New Category')).toBeInTheDocument();
    });
    
    // Select the new category
    fireEvent.click(screen.getByText('New Category'));
    
    // Verify createCategory was called
    await waitFor(() => {
      expect(CategoryRequests.createCategory).toHaveBeenCalledWith('New Category');
      expect(mockOnSelect).toHaveBeenCalledWith({ id: 4, name: 'New Category', can_be_primary: true });
    });
  });

  it('clears input when ref.clearInput is called', async () => {
    const ref = React.createRef<{ clearInput: () => void }>();
    
    renderWithRouter(<CategoryAutocomplete onSelect={mockOnSelect} ref={ref} />);
    
    const input = screen.getByPlaceholderText('Search categories...') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Test Category' } });
    
    expect(input.value).toBe('Test Category');
    
    // Call clearInput through the ref
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
    
    // Wait for the debounce to complete and results to appear
    await waitFor(() => {
      expect(screen.getByText('Strategy')).toBeInTheDocument();
      expect(screen.getByText('Simulation')).toBeInTheDocument();
    });
    
    // The prioritized categories should appear first in the dropdown
    const dropdownItems = screen.getAllByRole('option');
    expect(dropdownItems[0]).toHaveTextContent('Strategy');
    expect(dropdownItems[1]).toHaveTextContent('Simulation');
  });
}); 