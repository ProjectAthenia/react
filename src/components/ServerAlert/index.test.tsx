import React from 'react';
import { render, screen } from '@testing-library/react';
import ServerAlert from './index';
import { renderWithRouter } from '../../test-utils';

const mockOnCloseAlert = jest.fn();
const mockRequestError = {
  data: {
    errors: {
      field1: ['Error message 1'],
      field2: ['Error message 2']
    }
  }
};

test('renders ServerAlert without crashing', () => {
  renderWithRouter(
    <ServerAlert 
      onCloseAlert={mockOnCloseAlert}
      requestError={mockRequestError}
    />
  );
  expect(screen.getByText('Error message 1')).toBeInTheDocument();
});

test('renders unknown error when no error messages are provided', () => {
  const emptyRequestError = {
    data: {
      errors: {}
    }
  };
  
  renderWithRouter(
    <ServerAlert 
      onCloseAlert={mockOnCloseAlert}
      requestError={emptyRequestError}
    />
  );
  expect(screen.getByText('Unknown Error')).toBeInTheDocument();
});
