// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import * as React from 'react';
import api from './test-utils/mocks/api';

// Make React available globally for tests
global.React = React;

// Mock import.meta before any modules that use it are imported
Object.defineProperty(globalThis, 'import', {
    value: {
        meta: {
            env: {
                VITE_API_URL: 'http://localhost:3000',
                MODE: 'test',
                BASE_URL: '/',
            }
        }
    },
    writable: true
});

// Also add it to window object as backup
Object.defineProperty(window, 'import', {
    value: {
        meta: {
            env: {
                VITE_API_URL: 'http://localhost:3000',
                MODE: 'test',
                BASE_URL: '/',
            }
        }
    },
    writable: true
});

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  })),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() }
  },
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
}));

// Mock API
jest.mock('./services/api', () => ({
  __esModule: true,
  default: api
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom') as Record<string, unknown>;
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      pathname: '/',
      search: '',
      hash: '',
      state: null
    })
  };
});

// Mock IntersectionObserver
class IntersectionObserver {
    observe = jest.fn();
    disconnect = jest.fn();
    unobserve = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IntersectionObserver,
});

// Also mock the IntersectionObserverEntry
Object.defineProperty(window, 'IntersectionObserverEntry', {
    writable: true,
    configurable: true,
    value: class IntersectionObserverEntry {
        isIntersecting = false;
    },
});
