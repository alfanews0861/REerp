// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { MasterLayoutMap } from './MasterLayoutMap';
import { PUBLIC_PLOTS } from '../data/venturesData';
import { LanguageProvider } from '../providers/LanguageContext';

afterEach(() => {
  cleanup();
});

describe('MasterLayoutMap Component', () => {
  it('renders layout roads, park, entrance arch, and plots', () => {
    render(
      <LanguageProvider>
        <MasterLayoutMap plots={PUBLIC_PLOTS} projectName="Sunrise Enclave" />
      </LanguageProvider>
    );

    expect(screen.getByText(/GRAND ENTRANCE ARCH/i)).toBeInTheDocument();
    expect(screen.getByText(/40-FT MAIN BOULEVARD ROAD/i)).toBeInTheDocument();
    expect(screen.getByText(/CENTRAL GREEN PARK/i)).toBeInTheDocument();
    expect(screen.getByText(/CLUBHOUSE/i)).toBeInTheDocument();
    expect(screen.getByText(/100%/i)).toBeInTheDocument(); // zoom indicator
  });

  it('selects a plot on click and renders detailed action sheet', () => {
    const holdMock = vi.fn();
    const visitMock = vi.fn();

    render(
      <LanguageProvider>
        <MasterLayoutMap
          plots={PUBLIC_PLOTS}
          projectName="Sunrise Enclave"
          onHoldPlot={holdMock}
          onVisitPlot={visitMock}
        />
      </LanguageProvider>
    );

    // Click on Plot P-01
    const plotP01 = screen.getAllByText('P-01')[0];
    expect(plotP01).toBeInTheDocument();
    fireEvent.click(plotP01);

    // Selected plot sheet should appear
    expect(screen.getByText(/Plot #P-01 Selected/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Hold Plot/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Schedule Free AC Cab/i })).toBeInTheDocument();

    // Trigger Hold Plot
    fireEvent.click(screen.getByRole('button', { name: /Hold Plot/i }));
    expect(holdMock).toHaveBeenCalledTimes(1);
    expect(holdMock.mock.calls[0][0].plotNumber).toBe('P-01');
  });

  it('adjusts zoom level on zoom button clicks', () => {
    render(
      <LanguageProvider>
        <MasterLayoutMap plots={PUBLIC_PLOTS} />
      </LanguageProvider>
    );

    expect(screen.getByText('100%')).toBeInTheDocument();
    const zoomInBtn = screen.getByRole('button', { name: /Zoom In/i });
    fireEvent.click(zoomInBtn);
    expect(screen.getByText('125%')).toBeInTheDocument();

    const zoomOutBtn = screen.getByRole('button', { name: /Zoom Out/i });
    fireEvent.click(zoomOutBtn);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});
