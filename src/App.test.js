import React from "react";
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);

  expect(screen.getByText("Role")).toBeInTheDocument();
  // const linkElement = screen.getByText(/learn react/i);
  // expect(linkElement).toBeInTheDocument();

});

