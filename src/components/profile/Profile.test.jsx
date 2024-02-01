import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Profile from './Profile';
const mockUser = {
    firstname: 'John',
    age: '42',
    pet: 'dog',
    joined: '1/24/2023',
    entries: 23
}

test('renders Profile container correctly for a given user', () => {
    const { container } = render(<Profile user={ mockUser } />);
    expect(screen.getByRole('heading', { name: mockUser.firstname }))
        .toHaveTextContent(mockUser.firstname);
    expect(screen.getByRole('heading', { name: /images/i }))
        .toHaveTextContent(`Images submitted: ${mockUser.entries}`);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toHaveAttribute('placeholder', mockUser.firstname);
    expect(screen.getByLabelText(/age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/age/i)).toHaveAttribute('placeholder', mockUser.age);
    expect(screen.getByLabelText(/pet/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/pet/i)).toHaveAttribute('placeholder', mockUser.pet);
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(container).toMatchSnapshot();
});

test('cancels updates to a profile for a given user', async () => {
    const mockToggle = jest.fn();
    render(<Profile user={ mockUser } toggleModal={ mockToggle }/>);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(mockToggle).toHaveBeenCalled();
})

// test('updates a profile for a given user', async () => {
//     // const mockFetch = jest.fn()
//     // .mockReturnValue(Promise.resolve({
//     //     json: () => Promise.resolve({
//     //         count: 87,
//     //         results: [1,2,3,4]
//     //     })
//     // }));
//     // expect.assertions(4);
//     const mockToggle = jest.fn();

//     render(<Profile user={ mockUser } toggleModal={ mockToggle }/>);
//     const user = userEvent.setup();
//     await user.click(screen.getByRole('button', { name: /save/i }))
//     expect(mockToggle).toHaveBeenCalled();
// })