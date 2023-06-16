import { render, screen } from '@testing-library/react';
import App from './App';

describe('test code', () => {
  it('3 + 5 should be 8', () => {
    expect(3 + 5).toBe(8);
  });

  it('App should be rendered', async () => {
    render(<App />);

    expect(await screen.findByText('App')).toBeInTheDocument();
  });
});
