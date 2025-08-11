import { render, screen } from '@testing-library/react';
import App from './App';

test('renders World Ranks title', () => {
  render(<App />);
  const titleElement = screen.getByText('World Ranks');
  expect(titleElement).toBeInTheDocument();
});

test('renders search input', () => {
  render(<App />);
  const searchInputs = screen.getAllByPlaceholderText('Search by Name, Region, Subregion');
  expect(searchInputs.length).toBeGreaterThan(0);
  // Check that at least one search input exists
  expect(searchInputs[0]).toBeInTheDocument();
});

test('renders loading spinner initially', () => {
  render(<App />);
  const loadingElement = screen.getByText('Loading countries...');
  expect(loadingElement).toBeInTheDocument();
});
