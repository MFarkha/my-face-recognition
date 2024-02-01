import React from 'react';
import { render, screen } from '@testing-library/react';

import SignIn from './SignIn';

it('renders and displays sign in form correctly', () => {
    const { container } = render (<SignIn/>);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { value: /sign in/i })).toBeInTheDocument();
    expect(container).toMatchSnapshot();
})