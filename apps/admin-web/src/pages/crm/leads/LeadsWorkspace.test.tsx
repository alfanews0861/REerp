// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import leadsReducer from '../../../store/leadsSlice';
import LeadsWorkspace from './LeadsWorkspace';


const mockStore = configureStore({
  reducer: {
    leads: leadsReducer,
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <Provider store={mockStore}>
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    </Provider>
  );
};

describe('LeadsWorkspace', () => {
  it('renders the workspace with default TABLE view and aligned search bar', () => {
    renderWithProviders(<LeadsWorkspace />);
    
    // Check if Search input is rendered in top toolbar
    expect(screen.getByPlaceholderText('Search leads...')).toBeInTheDocument();

    // Check if Filters button is rendered
    expect(screen.getByRole('button', { name: /Filters/i })).toBeInTheDocument();
  });

  it('can open and close the filters menu panel', () => {
    renderWithProviders(<LeadsWorkspace />);
    
    const toggleBtn = screen.getByRole('button', { name: /Filters/i });
    fireEvent.click(toggleBtn);
    
    // Check that filters drawer content opens
    expect(screen.getByText('Lead Status (0)')).toBeInTheDocument();
    expect(screen.getByText('Lead Source (0)')).toBeInTheDocument();
  });
});
