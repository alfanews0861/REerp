// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { PlotLayoutMapView } from './PlotLayoutMapView';
import { PlotItem } from '../PlotInventory';

afterEach(() => {
  cleanup();
});

const MOCK_PLOTS: PlotItem[] = [
  {
    id: 'plot-1',
    plotNumber: 'P-01',
    facing: 'EAST',
    area: 200,
    areaUnit: 'SQ_YARDS',
    price: 5200000,
    status: 'AVAILABLE',
  },
  {
    id: 'plot-2',
    plotNumber: 'P-02',
    facing: 'WEST',
    area: 167,
    areaUnit: 'SQ_YARDS',
    price: 4400000,
    status: 'BOOKED',
  },
];

describe('PlotLayoutMapView Component in Admin Portal', () => {
  it('renders admin layout map with road networks and controls', () => {
    render(
      <PlotLayoutMapView
        plots={MOCK_PLOTS}
        projectName="ISKON City - 2"
        onSelectPlot={vi.fn()}
      />
    );

    expect(screen.getByText(/Layout Map View: ISKON City - 2/i)).toBeInTheDocument();
    expect(screen.getByText(/40-FT MAIN ACCESS ROAD/i)).toBeInTheDocument();
    expect(screen.getByText(/CENTRAL LANDSCAPED PARK/i)).toBeInTheDocument();
  });

  it('handles plot click and invokes onSelectPlot callback', () => {
    const selectMock = vi.fn();
    render(
      <PlotLayoutMapView
        plots={MOCK_PLOTS}
        projectName="ISKON City - 2"
        onSelectPlot={selectMock}
      />
    );

    const plotP01 = screen.getAllByText('P-01')[0];
    fireEvent.click(plotP01);

    expect(screen.getByText(/Plot #P-01 Details/i)).toBeInTheDocument();
    const openBtn = screen.getByRole('button', { name: /Open Full Plot Record/i });
    fireEvent.click(openBtn);

    expect(selectMock).toHaveBeenCalledTimes(1);
    expect(selectMock.mock.calls[0][0].plotNumber).toBe('P-01');
  });
});
