import React from 'react';
import { renderWithRouter } from '../../test-utils';
import BrowsePage from './index';

test('renders without crashing', () => {
  const { container } = renderWithRouter(<BrowsePage />);
  expect(container).toBeTruthy();
});
