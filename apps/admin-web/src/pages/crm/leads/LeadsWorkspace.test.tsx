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
  it('renders the workspace with default TABLE view', () => {
    renderWithProviders(<LeadsWorkspace />);
    
    // Check if Filters panel is rendered
    expect(screen.getByText('Filters')).toBeInTheDocument();
    
    // Check if Search input is rendered
    expect(screen.getByPlaceholderText('Search leads...')).toBeInTheDocument();
  });

  it('can toggle the filters panel', () => {
    renderWithProviders(<LeadsWorkspace />);
    
    expect(screen.getAllByText('Filters')[0]).toBeInTheDocument();
    
    const toggleBtn = screen.getAllByLabelText('Toggle Filters')[0];
    fireEvent.click(toggleBtn);
    
    expect(screen.queryAllByText('Filters').length).toBeLessThan(2);
  });
});
