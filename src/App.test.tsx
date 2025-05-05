import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { renderWithProviders } from './test-utils';

// Mock the service worker registration
jest.mock('./serviceWorker', () => ({
  register: jest.fn(),
  unregister: jest.fn(),
}));

describe('App', () => {
  it('renders without crashing', () => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeDefined();
  });

  it('renders with providers', () => {
    renderWithProviders(<App />);
    // Check if the app renders without crashing
    expect(document.body).toBeInTheDocument();
  });

  // Add more tests for specific routes or components if needed
});
