import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PlatformGroupForm from './index';
import PlatformGroup from '../../../models/platform/platform-group';

describe('PlatformGroupForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();
  const mockPlatformGroup: PlatformGroup = {
    id: 1,
    name: 'Test Platform Group',
    total_games: 0,
    created_at: '2024-03-28T00:00:00Z',
    updated_at: '2024-03-28T00:00:00Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with empty fields when no initial values are provided', () => {
    render(
      <PlatformGroupForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isSubmitting={false}
        submitError={null}
        mode="create"
      />
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create platform group/i })).toBeInTheDocument();
  });

  it('renders form with initial values when provided', () => {
    render(
      <PlatformGroupForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isSubmitting={false}
        submitError={null}
        mode="edit"
        initialValues={{ name: mockPlatformGroup.name }}
      />
    );

    const nameInput = screen.getByLabelText(/name/i);
    expect(nameInput).toHaveValue(mockPlatformGroup.name);
    expect(screen.getByRole('button', { name: /update platform group/i })).toBeInTheDocument();
  });

  it('shows validation error for empty name', async () => {
    render(
      <PlatformGroupForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isSubmitting={false}
        submitError={null}
        mode="create"
      />
    );

    const submitButton = screen.getByRole('button', { name: /create platform group/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('handles successful form submission for new platform group', async () => {
    render(
      <PlatformGroupForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isSubmitting={false}
        submitError={null}
        mode="create"
      />
    );

    const nameInput = screen.getByLabelText(/name/i);
    const submitButton = screen.getByRole('button', { name: /create platform group/i });

    fireEvent.change(nameInput, { target: { value: 'New Platform Group' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        { name: 'New Platform Group' },
        expect.any(Object)
      );
    });
  });

  it('handles successful form submission for existing platform group', async () => {
    render(
      <PlatformGroupForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isSubmitting={false}
        submitError={null}
        mode="edit"
        initialValues={{ name: mockPlatformGroup.name }}
      />
    );

    const nameInput = screen.getByLabelText(/name/i);
    const submitButton = screen.getByRole('button', { name: /update platform group/i });

    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        { name: 'Updated Name' },
        expect.any(Object)
      );
    });
  });

  it('calls onCancel when back button is clicked', () => {
    render(
      <PlatformGroupForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isSubmitting={false}
        submitError={null}
        mode="create"
      />
    );

    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('disables back button when submitting', () => {
    render(
      <PlatformGroupForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isSubmitting={true}
        submitError={null}
        mode="create"
      />
    );

    expect(screen.getByRole('button', { name: /back/i })).toBeDisabled();
  });

  it('disables form controls when submitting', () => {
    render(
      <PlatformGroupForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isSubmitting={true}
        submitError={null}
        mode="create"
      />
    );

    expect(screen.getByLabelText(/name/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /creating/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /back/i })).toBeDisabled();
  });

  it('displays submit error when provided', () => {
    const errorMessage = 'Failed to create platform group';
    render(
      <PlatformGroupForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isSubmitting={false}
        submitError={errorMessage}
        mode="create"
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
}); 