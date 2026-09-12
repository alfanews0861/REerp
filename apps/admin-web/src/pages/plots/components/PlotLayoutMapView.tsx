import { FC, useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  ButtonGroup,
  Chip,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { PlotItem } from '../PlotInventory';

export interface PlotLayoutMapViewProps {
  plots: PlotItem[];
  projectName?: string;
  onSelectPlot: (plot: PlotItem) => void;
}

interface PlotGeometry {
  plotNumber: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isCorner?: boolean;
}

const DEFAULT_PLOT_GEOMETRIES: PlotGeometry[] = [
  // North Block (Plots 1 to 9)
  { plotNumber: 'P-01', x: 50, y: 70, width: 85, height: 110, isCorner: true },
  { plotNumber: 'P-02', x: 145, y: 70, width: 80, height: 110 },
  { plotNumber: 'P-03', x: 235, y: 70, width: 80, height: 110 },
  { plotNumber: 'P-04', x: 325, y: 70, width: 80, height: 110 },
  { plotNumber: 'P-05', x: 415, y: 70, width: 90, height: 110, isCorner: true },
  { plotNumber: 'P-06', x: 555, y: 70, width: 90, height: 110, isCorner: true },
  { plotNumber: 'P-07', x: 655, y: 70, width: 80, height: 110 },
  { plotNumber: 'P-08', x: 745, y: 70, width: 80, height: 110 },
  { plotNumber: 'P-09', x: 835, y: 70, width: 105, height: 110, isCorner: true },

  // Central West Block
  { plotNumber: 'P-10', x: 50, y: 230, width: 110, height: 75, isCorner: true },
  { plotNumber: 'P-11', x: 50, y: 315, width: 110, height: 75 },
  { plotNumber: 'P-12', x: 50, y: 400, width: 110, height: 75 },
  { plotNumber: 'P-13', x: 50, y: 485, width: 110, height: 80, isCorner: true },

  // Central East Block
  { plotNumber: 'G-14', x: 830, y: 230, width: 110, height: 75, isCorner: true },
  { plotNumber: 'G-15', x: 830, y: 315, width: 110, height: 75 },
  { plotNumber: 'G-28', x: 830, y: 400, width: 110, height: 75 },
  { plotNumber: 'RP-08', x: 830, y: 485, width: 110, height: 80, isCorner: true },

  // South Block
  { plotNumber: 'RP-09', x: 215, y: 485, width: 90, height: 110, isCorner: true },
  { plotNumber: 'A-10', x: 315, y: 485, width: 85, height: 110 },
  { plotNumber: 'A-22', x: 410, y: 485, width: 90, height: 110, isCorner: true },
  { plotNumber: 'P-20', x: 555, y: 485, width: 90, height: 110, isCorner: true },
  { plotNumber: 'P-21', x: 655, y: 485, width: 85, height: 110 },
  { plotNumber: 'P-22', x: 745, y: 485, width: 75, height: 110, isCorner: true },
];

export const PlotLayoutMapView: FC<PlotLayoutMapViewProps> = ({
  plots,
  projectName = 'Enterprise Gated Community Layout',
  onSelectPlot,
}) => {
  const [zoom, setZoom] = useState(1);
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(null);
  const [hoveredPlot, setHoveredPlot] = useState<PlotItem | null>(null);

  const plotByNumber = useMemo(() => {
    const map = new Map<string, PlotItem>();
    plots.forEach((p) => map.set(p.plotNumber, p));
    return map;
  }, [plots]);

  const mappedGeometries = useMemo(() => {
    return DEFAULT_PLOT_GEOMETRIES.map((geo, index) => {
      let plot = plotByNumber.get(geo.plotNumber);
      if (!plot && plots.length > 0) {
        plot = plots[index % plots.length];
      }
      return {
        geo,
        plot: plot || {
          id: `virtual-${geo.plotNumber}`,
          plotNumber: geo.plotNumber,
          facing: 'EAST',
          area: 200,
          areaUnit: 'SQ_YARDS',
          price: 4800000,
          status: 'AVAILABLE' as const,
        },
      };
    });
  }, [plotByNumber, plots]);

  const selectedPlot = useMemo(() => {
    if (!selectedPlotId) return null;
    const match = mappedGeometries.find((item) => item.plot.id === selectedPlotId);
    return match ? match.plot : null;
  }, [selectedPlotId, mappedGeometries]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return '#10b981';
      case 'BOOKED':
        return '#ef4444';
      case 'REGISTERED':
        return '#8b5cf6';
      default:
        return '#3b82f6';
    }
  };

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      {/* Controls Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography variant="subtitle2" fontWeight={700}>
            Layout Map View: {projectName}
          </Typography>
          <Chip label={`${plots.length} Plots In Scope`} size="small" variant="outlined" />
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <ButtonGroup size="small" variant="outlined">
            <Tooltip title="Zoom In">
              <IconButton onClick={() => setZoom((z) => Math.min(z + 0.25, 2.5))} size="small">
                <ZoomInIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Zoom Out">
              <IconButton onClick={() => setZoom((z) => Math.max(z - 0.25, 0.6))} size="small">
                <ZoomOutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reset View">
              <IconButton onClick={() => setZoom(1)} size="small">
                <RestartAltIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </ButtonGroup>
          <Chip label={`${Math.round(zoom * 100)}%`} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
        </Stack>
      </Box>

      {/* SVG Container */}
      <Paper
        sx={{
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: '#f8fafc',
          border: '1px solid #cbd5e1',
          height: 520,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          viewBox="0 0 1000 640"
          style={{
            width: '100%',
            height: '100%',
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
            transition: 'transform 0.2s ease-out',
          }}
        >
          <rect x="10" y="10" width="980" height="620" rx="16" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="8 4" />

          {/* Entrance Arch */}
          <g transform="translate(430, 595)">
            <rect x="0" y="0" width="140" height="40" rx="6" fill="#1e293b" />
            <text x="70" y="24" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
              ★ GRAND ENTRANCE ARCH ★
            </text>
          </g>

          {/* 40ft Main Road */}
          <rect x="470" y="15" width="60" height="585" fill="#334155" />
          <line x1="500" y1="20" x2="500" y2="590" stroke="#ffffff" strokeWidth="2" strokeDasharray="10 10" />
          <text x="500" y="320" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontWeight="bold" transform="rotate(-90 500 320)">
            40-FT MAIN ACCESS ROAD
          </text>

          {/* 33ft Cross Road */}
          <rect x="15" y="185" width="970" height="40" fill="#334155" />
          <line x1="20" y1="205" x2="980" y2="205" stroke="#ffffff" strokeWidth="2" strokeDasharray="10 10" />
          <text x="250" y="210" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontWeight="bold">
            33-FT INTERNAL CROSS ROAD
          </text>
          <text x="750" y="210" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontWeight="bold">
            33-FT INTERNAL CROSS ROAD
          </text>

          {/* Central Green Park */}
          <g transform="translate(180, 240)">
            <rect x="0" y="0" width="270" height="230" rx="12" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" />
            <text x="135" y="115" textAnchor="middle" fill="#15803d" fontSize="13" fontWeight="800">
              🌳 CENTRAL LANDSCAPED PARK
            </text>
          </g>

          {/* Clubhouse */}
          <g transform="translate(550, 240)">
            <rect x="0" y="0" width="260" height="230" rx="12" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
            <text x="130" y="115" textAnchor="middle" fill="#0369a1" fontSize="13" fontWeight="800">
              🏛️ CLUBHOUSE & AMENITIES
            </text>
          </g>

          {/* Plots */}
          {mappedGeometries.map(({ geo, plot }, index) => {
            const isSelected = selectedPlotId === plot.id;
            const fill = getStatusColor(plot.status);

            return (
              <g
                key={`${plot.id}-${geo.plotNumber}-${index}`}
                onClick={() => setSelectedPlotId(plot.id)}
                onMouseEnter={() => setHoveredPlot(plot)}
                onMouseLeave={() => setHoveredPlot(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={geo.x}
                  y={geo.y}
                  width={geo.width}
                  height={geo.height}
                  rx="6"
                  fill={fill}
                  fillOpacity={isSelected ? 0.95 : 0.85}
                  stroke={isSelected ? '#f59e0b' : '#ffffff'}
                  strokeWidth={isSelected ? 4 : 2}
                  filter={isSelected ? 'drop-shadow(0px 0px 8px rgba(245, 158, 11, 0.8))' : 'none'}
                />

                {geo.isCorner && (
                  <circle cx={geo.x + geo.width - 12} cy={geo.y + 12} r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                )}

                <text
                  x={geo.x + geo.width / 2}
                  y={geo.y + geo.height / 2 - 5}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="900"
                >
                  {plot.plotNumber}
                </text>

                <text
                  x={geo.x + geo.width / 2}
                  y={geo.y + geo.height / 2 + 10}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="9"
                  fontWeight="600"
                >
                  {plot.area} {plot.areaUnit === 'SQ_YARDS' ? 'Yds' : plot.areaUnit} &bull; {plot.facing[0]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredPlot && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              bgcolor: 'rgba(15, 23, 42, 0.9)',
              color: '#ffffff',
              p: 1.5,
              borderRadius: 2,
              pointerEvents: 'none',
              zIndex: 10,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            <Typography variant="subtitle2" fontWeight={800} color="primary.light">
              Plot #{hoveredPlot.plotNumber} ({hoveredPlot.facing} Facing)
            </Typography>
            <Typography variant="caption" sx={{ display: 'block' }}>
              Area: {hoveredPlot.area} {hoveredPlot.areaUnit} &bull; Status: {hoveredPlot.status}
            </Typography>
            <Typography variant="subtitle2" fontWeight={700} color="#fef08a" sx={{ mt: 0.5 }}>
              ₹{(hoveredPlot.price / 100000).toFixed(2)} Lakhs
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Legend */}
      <Stack direction="row" spacing={2} sx={{ mt: 1.5, px: 1 }} alignItems="center" flexWrap="wrap">
        <Typography variant="caption" fontWeight={700}>
          Legend:
        </Typography>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box sx={{ width: 12, height: 12, borderRadius: '3px', bgcolor: '#10b981' }} />
          <Typography variant="caption">AVAILABLE</Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box sx={{ width: 12, height: 12, borderRadius: '3px', bgcolor: '#ef4444' }} />
          <Typography variant="caption">BOOKED</Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box sx={{ width: 12, height: 12, borderRadius: '3px', bgcolor: '#8b5cf6' }} />
          <Typography variant="caption">REGISTERED</Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f59e0b' }} />
          <Typography variant="caption">Corner Plot</Typography>
        </Stack>
      </Stack>

      {/* Selected Plot Drawer / Card */}
      {selectedPlot && (
        <Card sx={{ mt: 2, borderRadius: 2, border: '1px solid #93c5fd', bgcolor: '#f0f9ff' }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" fontWeight={800} color="primary.dark">
                Plot #{selectedPlot.plotNumber} Details
              </Typography>
              <Chip
                label={selectedPlot.status}
                size="small"
                color={selectedPlot.status === 'AVAILABLE' ? 'success' : selectedPlot.status === 'BOOKED' ? 'error' : 'secondary'}
                sx={{ fontWeight: 700 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Facing: {selectedPlot.facing} &bull; Area: {selectedPlot.area} {selectedPlot.areaUnit} &bull; Price: ₹{(selectedPlot.price / 100000).toFixed(2)} Lakhs
            </Typography>
          </CardContent>
          <CardActions sx={{ p: 2, pt: 0, justifyContent: 'flex-end' }}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<VisibilityIcon />}
              onClick={() => onSelectPlot(selectedPlot)}
            >
              Open Full Plot Record
            </Button>
          </CardActions>
        </Card>
      )}
    </Box>
  );
};
