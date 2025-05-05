import React from 'react';
import { render, screen } from '@testing-library/react';
import PostPage from './index';
import { renderWithProviders } from '../../../test-utils';

// Mock the contexts
jest.mock('../../../contexts/MeContext', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  MeContext: {
    Consumer: ({ children }: { children: (value: any) => React.ReactNode }) =>
      children({
        me: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com'
        }
      })
  }
}));

jest.mock('../../../contexts/PostContext', () => ({
  __esModule: true,
  PostContextProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  PostContext: {
    Consumer: ({ children }: { children: (value: any) => React.ReactNode }) =>
      children({
        post: {
          id: 1,
          title: 'Test Post',
          content: 'Test Content'
        },
        setPost: jest.fn()
      })
  }
}));

// Mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ postId: '1' }),
  useHistory: () => ({
    push: jest.fn()
  })
}));

// Mock useLocation
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: () => ({
    pathname: '/post/1'
  })
}));

test('renders without crashing', () => {
  renderWithProviders(<PostPage />);
  expect(screen.getByTestId('post-details-content')).toBeInTheDocument();
});
