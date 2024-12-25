// testFile.test.js

import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App'; // Ensure the path matches your project structure

describe('Generate Queue Button Tests with User Input', () => {
  test('outputs Roles sorted by user input of timestamps when Generate Queue is clicked', () => {
    // Render the App component
    render(<App />);

    // Simulate user input for Number of Admissions and Timestamps
    const roles = ['DA', 'S1', 'S2', 'S3', 'S4'];
    const timestamps = [
      '10:00AM',
      '08:00AM',
      '09:00AM',
      '07:00AM',
      '06:00AM'
    ];
    const numberOfAdmissionsInputs = screen.getAllByPlaceholderText(/number of admissions/i);
    const timestampInputs = screen.getAllByPlaceholderText(/last admission time/i);

    roles.forEach((role, index) => {
      fireEvent.change(numberOfAdmissionsInputs[index], { target: { value: index + 1 } });
      fireEvent.change(timestampInputs[index], { target: { value: timestamps[index] } });
    });

    // Simulate clicking the Generate Queue button
    const generateButton = screen.getByRole('button', { name: /generate queue/i });
    userEvent.click(generateButton);

    // Expected output
    const sortedRoles = ['DA', 'S1', 'S2', 'S3', 'S4'].join('>');

    // Assert that the output string is displayed
    const outputElement = screen.getByText(sortedRoles);
    expect(outputElement).toBeInTheDocument();
  });
});
