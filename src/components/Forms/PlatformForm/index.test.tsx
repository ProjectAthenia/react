import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PlatformForm from './index';
import { PlatformGroupsContext } from '../../../contexts/GamingComponents/PlatformGroupsContext';
import Platform from '../../../models/platform/platform';
import PlatformGroup from '../../../models/platform/platform-group';

// Mock the PlatformGroupsContext
jest.mock('../../../contexts/GamingComponents/PlatformGroupsContext', () => {
  const originalModule = jest.requireActual('../../../contexts/GamingComponents/PlatformGroupsContext');
  return {
    ...originalModule,
    PlatformGroupsContextProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    PlatformGroupsContext: {
      Consumer: ({ children }: { children: (value: any) => React.ReactNode }) => 
        children({
          loadedData: [
            { id: 1, name: 'Console' },
            { id: 2, name: 'Mobile' }
          ],
          initialLoadComplete: true,
          refreshing: false
        })
    }
  };
});

describe('PlatformForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();
  
  const mockPlatform: Platform = {
    id: 1,
    name: 'Test Platform',
    total_games: 100,
    platform_group_id: 1,
    platform_group: {
      id: 1,
      name: 'Console'
    } as PlatformGroup,
    created_at: '2023-01-01',
    updated_at: '2023-01-01'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form elements correctly in create mode', () => {
    render(
      <PlatformForm 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel}
        isSubmitting={false}
        submitError={null}
        mode="create"
      />
    );
    
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Platform Group')).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  test('renders form elements correctly in edit mode', () => {
    render(
      <PlatformForm 
        platform={mockPlatform}
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel}
        isSubmitting={false}
        submitError={null}
        mode="edit"
      />
    );
    
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Platform Group')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  test('displays error message when provided', () => {
    const errorMessage = 'This is an error message';
    render(
      <PlatformForm 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel}
        isSubmitting={false}
        submitError={errorMessage}
        mode="create"
      />
    );
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('calls onSubmit with form data when submitted', async () => {
    render(
      <PlatformForm 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel}
        isSubmitting={false}
        submitError={null}
        mode="create"
      />
    );
    
    // Fill in the form
    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'New Platform' } });
    
    const platformGroupSelect = screen.getByLabelText('Platform Group');
    fireEvent.change(platformGroupSelect, { target: { value: '1' } });
    
    // Submit the form
    const submitButton = screen.getByText('Create');
    fireEvent.click(submitButton);
    
    // Check that onSubmit was called with the correct data
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'New Platform',
        platform_group_id: 1
      });
    });
  });

  test('calls onCancel when cancel button is clicked', () => {
    render(
      <PlatformForm 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel}
        isSubmitting={false}
        submitError={null}
        mode="create"
      />
    );
    
    const cancelButton = screen.getByText('Back');
    fireEvent.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  test('disables form elements when isSubmitting is true', () => {
    render(
      <PlatformForm 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel}
        isSubmitting={true}
        submitError={null}
        mode="create"
      />
    );
    
    const nameInput = screen.getByLabelText('Name');
    const platformGroupSelect = screen.getByLabelText('Platform Group');
    const backButton = screen.getByText('Back');
    
    expect(nameInput).toBeDisabled();
    expect(platformGroupSelect).toBeDisabled();
    expect(screen.getByText('Saving...')).toBeInTheDocument();
    expect(backButton).toBeDisabled();
  });

  test('validates required fields', () => {
    render(
      <PlatformForm 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel}
        isSubmitting={false}
        submitError={null}
        mode="create"
      />
    );
    
    // Submit the form without filling in the name
    const submitButton = screen.getByText('Create');
    fireEvent.click(submitButton);
    
    // Check that the name input is marked as required
    const nameInput = screen.getByLabelText('Name');
    expect(nameInput).toHaveAttribute('required');
  });

  test('pre-fills form with platform data in edit mode', () => {
    render(
      <PlatformForm 
        platform={mockPlatform}
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel}
        isSubmitting={false}
        submitError={null}
        mode="edit"
      />
    );
    
    const nameInput = screen.getByLabelText('Name');
    expect(nameInput).toHaveValue('Test Platform');
    
    const platformGroupSelect = screen.getByLabelText('Platform Group');
    expect(platformGroupSelect).toHaveValue('1');
  });
}); 