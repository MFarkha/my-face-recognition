import React from 'react';
import { render, screen } from '@testing-library/react';
import Navigation from './Navigation';

test('renders navigation links if not signed in', () => {
    const { container } = render(<Navigation isSignedIn={false} />);
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
});

test('renders navigation links if signed in', () => {
    const { container } = render(<Navigation isSignedIn={true} />);
    expect(screen.getByText(/view profile/i)).toBeInTheDocument();
    expect(screen.getByText(/sign out/i)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
});