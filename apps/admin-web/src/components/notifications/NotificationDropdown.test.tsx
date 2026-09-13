import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../store';
import { NotificationDropdown } from './NotificationDropdown';

vi.mock('@real-estate-erp/hooks', () => ({
  useAuth: () => ({
    user: {
      id: 'usr-001',
      uid: 'usr-001',
      email: 'admin@reerp.com',
      displayName: 'Rajesh Kumar (Managing Director)',
      role: 'director',
      cadre: 'director',
    },
    isAuthenticated: true,
  }),
}));

describe('NotificationDropdown Component', () => {
  it('renders dropdown popup when opened with tab controls and header', async () => {
    const dummyAnchor = document.createElement('div');
    document.body.appendChild(dummyAnchor);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <NotificationDropdown
            anchorEl={dummyAnchor}
            open={true}
            onClose={vi.fn()}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Notifications & Messages')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Messages/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Alerts/i })).toBeInTheDocument();
    expect(screen.getByText('Open Communications Center')).toBeInTheDocument();
  });

  it('allows switching between tabs and displaying notifications', async () => {
    const dummyAnchor = document.createElement('div');
    document.body.appendChild(dummyAnchor);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <NotificationDropdown
            anchorEl={dummyAnchor}
            open={true}
            onClose={vi.fn()}
          />
        </BrowserRouter>
      </Provider>
    );

    const alertsTab = screen.getByRole('tab', { name: /Alerts/i });
    fireEvent.click(alertsTab);

    await waitFor(() => {
      expect(screen.getByText(/New Plot Booking Completed/i)).toBeInTheDocument();
    });
  });
});
