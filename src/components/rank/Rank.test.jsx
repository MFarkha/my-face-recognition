import React from 'react';
import { render, screen } from '@testing-library/react';
import Rank from './Rank';

test('renders rank container correctly', () => {
    const { container } = render(<Rank firstname="John" entries="10" />);
    expect(screen.getByText(/john/i)).toBeInTheDocument();
    expect(screen.getByText(/rank/i)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
});