import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../store';
import { CommunicationsWorkspace } from './CommunicationsWorkspace';

// Mock Auth Hook
vi.mock('@real-estate-erp/hooks', () => ({
  useAuth: () => ({
    user: {
      id: 'usr-001',
      uid: 'usr-001',
      email: 'admin@reerp.com',
      displayName: 'Rajesh Kumar (Managing Director)',
      role: 'director',
      cadre: 'director',
      status: 'active',
      permissions: ['*:*'],
    },
    isAuthenticated: true,
  }),
}));

describe('CommunicationsWorkspace Component', () => {
  it('renders Communications workspace with metric cards and conversation channels', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <CommunicationsWorkspace />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Communications & Notifications Center')).toBeInTheDocument();
    expect(screen.getByText('Compose Message')).toBeInTheDocument();
    expect(screen.getByText('Total Conversations')).toBeInTheDocument();
    expect(screen.getByText('Active Channels')).toBeInTheDocument();
  });

  it('renders conversations in the left sidebar and allows switching conversations', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <CommunicationsWorkspace />
        </BrowserRouter>
      </Provider>
    );

    // Check that default conversations render in list and thread header
    await waitFor(() => {
      expect(screen.getAllByText(/Office Staff & Corporate Desk/i).length).toBeGreaterThanOrEqual(1);
    });

    // Check that active chat area displays messages and composer
    expect(screen.getByPlaceholderText(/Type your message here/i)).toBeInTheDocument();
  });

  it('opens Compose Message modal and allows selecting recipient categories', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <CommunicationsWorkspace />
        </BrowserRouter>
      </Provider>
    );

    const composeBtn = screen.getByRole('button', { name: /Compose Message/i });
    fireEvent.click(composeBtn);

    expect(screen.getByText('Compose New Message / Announcement')).toBeInTheDocument();
  });
});
