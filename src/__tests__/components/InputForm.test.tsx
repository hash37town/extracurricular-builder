import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InputForm from '@/components/InputForm';

describe('InputForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders all form fields', () => {
    render(<InputForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/grade level/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/interests/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate ideas/i })).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    render(<InputForm onSubmit={mockOnSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: /generate ideas/i }));

    expect(await screen.findByText(/grade level is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/location is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/at least one interest is required/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('allows adding and removing interests', async () => {
    render(<InputForm onSubmit={mockOnSubmit} />);

    const interestInput = screen.getByPlaceholderText(/add an interest/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    // Add interests
    await userEvent.type(interestInput, 'Programming');
    fireEvent.click(addButton);
    expect(screen.getByText('Programming')).toBeInTheDocument();

    await userEvent.type(interestInput, 'Art');
    fireEvent.click(addButton);
    expect(screen.getByText('Art')).toBeInTheDocument();

    // Remove interest
    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    fireEvent.click(removeButtons[0]);
    expect(screen.queryByText('Programming')).not.toBeInTheDocument();
    expect(screen.getByText('Art')).toBeInTheDocument();
  });

  it('prevents adding duplicate interests', async () => {
    render(<InputForm onSubmit={mockOnSubmit} />);

    const interestInput = screen.getByPlaceholderText(/add an interest/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    // Add interest
    await userEvent.type(interestInput, 'Programming');
    fireEvent.click(addButton);

    // Try to add the same interest again
    await userEvent.type(interestInput, 'Programming');
    fireEvent.click(addButton);

    expect(screen.getByText(/this interest has already been added/i)).toBeInTheDocument();
    expect(screen.getAllByText('Programming')).toHaveLength(1);
  });

  it('successfully submits form with valid data', async () => {
    render(<InputForm onSubmit={mockOnSubmit} />);

    // Fill in grade level
    fireEvent.change(screen.getByLabelText(/grade level/i), {
      target: { value: '9th Grade' },
    });

    // Fill in location
    await userEvent.type(screen.getByLabelText(/location/i), 'New York, NY');

    // Add interest
    const interestInput = screen.getByPlaceholderText(/add an interest/i);
    const addButton = screen.getByRole('button', { name: /add/i });
    await userEvent.type(interestInput, 'Programming');
    fireEvent.click(addButton);

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /generate ideas/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        gradeLevel: '9th Grade',
        location: 'New York, NY',
        interests: ['Programming'],
      });
    });
  });

  it('shows error message when submission fails', async () => {
    const mockError = new Error('Submission failed');
    mockOnSubmit.mockRejectedValueOnce(mockError);

    render(<InputForm onSubmit={mockOnSubmit} />);

    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/grade level/i), {
      target: { value: '9th Grade' },
    });
    await userEvent.type(screen.getByLabelText(/location/i), 'New York, NY');
    await userEvent.type(screen.getByPlaceholderText(/add an interest/i), 'Programming');
    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /generate ideas/i }));

    expect(await screen.findByText(/failed to submit form/i)).toBeInTheDocument();
  });
});
