import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './index';
import { renderWithRouter } from '../../test-utils';

test('renders without crashing', () => {
  renderWithRouter(<Home />);
  expect(screen.getByTestId('home-content')).toBeInTheDocument();
});
