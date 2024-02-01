import React from 'react';
import {render, screen} from '@testing-library/react';

import FaceRecognition from './FaceRecognition';

it('renders and displays an image correctly', () => {
    const mockImageUrl = '';
    const mockBoxes = [];
    const { container } = render (<FaceRecognition boxes={mockBoxes} imageUrl={mockImageUrl} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.queryAllByRole('bounding-box')).toHaveLength(0);
    expect(container).toMatchSnapshot();
})

it('renders and displays a bounding box of image correctly', () => {
    const mockImageUrl = 'http://some.image';
    const mockBoxes = [{
        topRow: 0,
        bottomRow: 100,
        rightCol: 200,
        leftCol: 0
    }];
    const { container } = render (<FaceRecognition boxes={mockBoxes} imageUrl={mockImageUrl} />);
    expect(container).toMatchSnapshot();

})
