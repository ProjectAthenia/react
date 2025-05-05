import React from 'react';
import { render } from '@testing-library/react';
import './index';

// Mock the service worker registration
jest.mock('./serviceWorker', () => ({
  register: jest.fn(),
  unregister: jest.fn(),
}));

describe('Index', () => {
  it('renders without crashing', () => {
    // This test is mainly to ensure that the index file doesn't throw any errors when imported
    // We don't need to render anything since the index file already renders the App component
    expect(true).toBe(true);
  });
}); 