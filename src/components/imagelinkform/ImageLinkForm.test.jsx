import React from 'react';
import {render, screen} from '@testing-library/react';

import ImageLinkForm from './ImageLinkForm';

it('renders and displays image link form correctly', () => {
    const { container } = render (<ImageLinkForm />);
    expect(container).toMatchSnapshot();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { value: /detect/i })).toBeInTheDocument();
})