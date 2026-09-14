import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the 2048 title and a New Game button', () => {
  render(<App />);
  expect(screen.getByText('2048')).toBeInTheDocument();
  expect(screen.getByText(/new game/i)).toBeInTheDocument();
});
