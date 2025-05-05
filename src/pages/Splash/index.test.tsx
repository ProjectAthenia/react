import React from 'react';
import { render, screen } from '@testing-library/react';
import Splash from './index';
import { renderWithRouter } from '../../test-utils';

test('renders without crashing', () => {
  renderWithRouter(<Splash />);
  expect(screen.getByText('Hello World!')).toBeInTheDocument();
  expect(screen.getByText('Sign In')).toBeInTheDocument();
});
