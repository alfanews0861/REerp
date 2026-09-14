import { FC, useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  IconButton,
  Chip,
  Tooltip,
  ButtonGroup,
  Card,
  CardContent,
  CardActions,
  Grid,
  Divider,
} from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import LockClockIcon from '@mui/icons-material/LockClock';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { PublicPlot } from '../data/venturesData';
import { useI18n } from '../providers/LanguageContext';

export interface MasterLayoutMapProps {
  plots: PublicPlot[];
  projectName?: string;
  onHoldPlot?: (plot: PublicPlot) => void;
  onVisitPlot?: (plot: PublicPlot) => void;
}

interface PlotGeometry {
  plotNumber: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isCorner?: boolean;
}

// Geometric layout grid mapping for realistic 24-plot gated community section
const DEFAULT_PLOT_GEOMETRIES: PlotGeometry[] = [
  // North Block (Plots 1 to 6 - facing South onto 33ft Road)
  { plotNumber: 'P-01', x: 50, y: 70, width: 85, height: 110, isCorner: true },
  { plotNumber: 'P-02', x: 145, y: 70, width: 80, height: 110 },
  { plotNumber: 'P-03', x: 235, y: 70, width: 80, height: 110 },
  { plotNumber: 'P-04', x: 325, y: 70, width: 80, height: 110 },
  { plotNumber: 'P-05', x: 415, y: 70, width: 90, height: 110, isCorner: true },
  { plotNumber: 'P-06', x: 555, y: 70, width: 90, height: 110, isCorner: true },
  { plotNumber: 'P-07', x: 655, y: 70, width: 80, height: 110 },
  { plotNumber: 'P-08', x: 745, y: 70, width: 80, height: 110 },
  { plotNumber: 'P-09', x: 835, y: 70, width: 105, height: 110, isCorner: true },

  // Central West Block (Plots 10 to 14 - facing East onto 40ft Main Road)
  { plotNumber: 'P-10', x: 50, y: 230, width: 110, height: 75, isCorner: true },
  { plotNumber: 'P-11', x: 50, y: 315, width: 110, height: 75 },
  { plotNumber: 'P-12', x: 50, y: 400, width: 110, height: 75 },
  { plotNumber: 'P-13', x: 50, y: 485, width: 110, height: 80, isCorner: true },

  // Central East Block (Plots 15 to 19 - facing West onto 40ft Main Road)
  { plotNumber: 'G-14', x: 830, y: 230, width: 110, height: 75, isCorner: true },
  { plotNumber: 'G-15', x: 830, y: 315, width: 110, height: 75 },
  { plotNumber: 'G-28', x: 830, y: 400, width: 110, height: 75 },
  { plotNumber: 'RP-08', x: 830, y: 485, width: 110, height: 80, isCorner: true },

  // South Block (Plots 20 to 24 - facing North onto 33ft Road)
  { plotNumber: 'RP-09', x: 215, y: 485, width: 90, height: 110, isCorner: true },
  { plotNumber: 'A-10', x: 315, y: 485, width: 85, height: 110 },
  { plotNumber: 'A-22', x: 410, y: 485, width: 90, height: 110, isCorner: true },
  { plotNumber: 'P-20', x: 555, y: 485, width: 90, height: 110, isCorner: true },
  { plotNumber: 'P-21', x: 655, y: 485, width: 85, height: 110 },
  { plotNumber: 'P-22', x: 745, y: 485, width: 75, height: 110, isCorner: true },
];

export const MasterLayoutMap: FC<MasterLayoutMapProps> = ({
  plots,
  projectName = 'ISKON City - 2',
  onHoldPlot,
  onVisitPlot,
}) => {
  const { t } = useI18n();

  // Map viewport transform state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(null);
  const [hoveredPlot, setHoveredPlot] = useState<PublicPlot | null>(null);

  // Map Filter states
  const [facingFilter, setFacingFilter] = useState<'ALL' | 'EAST' | 'WEST' | 'NORTH' | 'SOUTH'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AVAILABLE' | 'CORNER'>('ALL');

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 2.5));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.6));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Build a lookup map of plotNumber -> PublicPlot
  const plotByNumber = useMemo(() => {
    const map = new Map<string, PublicPlot>();
    plots.forEach((p) => {
      map.set(p.plotNumber, p);
    });
    return map;
  }, [plots]);

  // Merge geometries with plot data (generating fallback plot if geometry doesn't match list directly)
  const mappedGeometries = useMemo(() => {
    return DEFAULT_PLOT_GEOMETRIES.map((geo, index) => {
      let plot = plotByNumber.get(geo.plotNumber);
      if (!plot && plots.length > 0) {
        // Fallback to plot from list
        plot = plots[index % plots.length];
      }
      return {
        geo,
        plot: plot || {
          id: `virtual-${geo.plotNumber}`,
          projectId: 'proj-1',
          projectName,
          plotNumber: geo.plotNumber,
          facing: (index % 2 === 0 ? 'EAST' : index % 3 === 0 ? 'WEST' : 'NORTH') as any,
          areaSqYds: geo.isCorner ? 220 : 180,
          dimensions: '36 x 50',
          isCornerPlot: Boolean(geo.isCorner),
          pricePerSqYd: 26500,
          totalPrice: geo.isCorner ? 5830000 : 4770000,
          status: (index % 5 === 0 ? 'BOOKED' : index % 3 === 0 ? 'FAST_SELLING' : 'AVAILABLE') as any,
        },
      };
    });
  }, [plotByNumber, plots, projectName]);

  const selectedPlot = useMemo(() => {
    if (!selectedPlotId) return null;
    const match = mappedGeometries.find((item) => item.plot.id === selectedPlotId);
    return match ? match.plot : null;
  }, [selectedPlotId, mappedGeometries]);

  // Color mapping based on status
  const getStatusFill = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return '#10b981'; // Green
      case 'FAST_SELLING':
        return '#3b82f6'; // Blue
      case 'BOOKED':
        return '#ef4444'; // Red
      default:
        return '#8b5cf6'; // Purple for 48h reserved
    }
  };

  const isPlotHighlighted = (plot: PublicPlot) => {
    if (facingFilter !== 'ALL' && plot.facing !== facingFilter) return false;
    if (statusFilter === 'AVAILABLE' && plot.status !== 'AVAILABLE') return false;
    if (statusFilter === 'CORNER' && !plot.isCornerPlot) return false;
    return true;
  };

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      {/* Control Header & Filters */}
      <Paper
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 3,
          bgcolor: '#ffffff',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          border: '1px solid #e5e7eb',
        }}
      >
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item xs={12} md={7}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
              <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
                {t('filter_facing')}:
              </Typography>
              {(['ALL', 'EAST', 'WEST', 'NORTH', 'SOUTH'] as const).map((fac) => (
                <Chip
                  key={fac}
                  label={fac === 'ALL' ? t('any_facing') : fac}
                  size="small"
                  clickable
                  color={facingFilter === fac ? 'primary' : 'default'}
                  onClick={() => setFacingFilter(fac)}
                  sx={{ fontWeight: facingFilter === fac ? 700 : 500 }}
                />
              ))}
              <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 20 }} />
              <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
                Status:
              </Typography>
              <Chip
                label={t('all_positions')}
                size="small"
                clickable
                color={statusFilter === 'ALL' ? 'primary' : 'default'}
                onClick={() => setStatusFilter('ALL')}
              />
              <Chip
                label={t('status_available')}
                size="small"
                clickable
                color={statusFilter === 'AVAILABLE' ? 'success' : 'default'}
                onClick={() => setStatusFilter('AVAILABLE')}
              />
              <Chip
                label={t('corner_only')}
                size="small"
                clickable
                color={statusFilter === 'CORNER' ? 'secondary' : 'default'}
                onClick={() => setStatusFilter('CORNER')}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} md={5}>
            <Stack direction="row" spacing={1} justifyContent={{ xs: 'flex-start', md: 'flex-end' }} alignItems="center">
              <ButtonGroup size="small" variant="outlined">
                <Tooltip title={t('map_zoom_in')}>
                  <IconButton onClick={handleZoomIn} size="small">
                    <ZoomInIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('map_zoom_out')}>
                  <IconButton onClick={handleZoomOut} size="small">
                    <ZoomOutIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('map_reset')}>
                  <IconButton onClick={handleReset} size="small">
                    <RestartAltIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </ButtonGroup>
              <Chip
                label={`${Math.round(zoom * 100)}%`}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 700 }}
              />
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* SVG Layout Canvas */}
      <Paper
        sx={{
          position: 'relative',
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: '#f1f5f9',
          border: '1px solid #cbd5e1',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          height: { xs: 450, md: 580 },
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
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: 'center center',
            transition: 'transform 0.2s ease-out',
            cursor: 'grab',
          }}
        >
          {/* Background Gated Community Ground */}
          <rect x="10" y="10" width="980" height="620" rx="16" fill="#f8fafc" stroke="#94a3b8" strokeWidth="3" strokeDasharray="10 5" />

          {/* Grand Entrance Arch (Bottom Center) */}
          <g transform="translate(430, 595)">
            <rect x="0" y="0" width="140" height="40" rx="6" fill="#1e293b" />
            <text x="70" y="24" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">
              ★ GRAND ENTRANCE ARCH ★
            </text>
          </g>

          {/* 40-FT Main Boulevard Road (Runs Vertically through Center) */}
          <rect x="470" y="15" width="60" height="585" fill="#334155" />
          <line x1="500" y1="20" x2="500" y2="590" stroke="#f1f5f9" strokeWidth="2" strokeDasharray="10 10" />
          <text x="500" y="320" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold" transform="rotate(-90 500 320)">
            40-FT MAIN BOULEVARD ROAD
          </text>

          {/* 33-FT Cross Road (Horizontal between North and South Blocks) */}
          <rect x="15" y="185" width="970" height="40" fill="#334155" />
          <line x1="20" y1="205" x2="980" y2="205" stroke="#f1f5f9" strokeWidth="2" strokeDasharray="10 10" />
          <text x="250" y="210" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">
            33-FT INTERNAL CROSS ROAD
          </text>
          <text x="750" y="210" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">
            33-FT INTERNAL CROSS ROAD
          </text>

          {/* Central Landscaped Green Park & Play Area */}
          <g transform="translate(180, 240)">
            <rect x="0" y="0" width="270" height="230" rx="12" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" />
            {/* Park Walking Track */}
            <rect x="15" y="15" width="240" height="200" rx="8" fill="none" stroke="#86efac" strokeWidth="3" strokeDasharray="6 4" />
            <text x="135" y="90" textAnchor="middle" fill="#15803d" fontSize="14" fontWeight="800">
              🌳 CENTRAL GREEN PARK
            </text>
            <text x="135" y="115" textAnchor="middle" fill="#166534" fontSize="11" fontWeight="600">
              Children Play Area & Walking Tracks
            </text>
            <circle cx="50" cy="50" r="14" fill="#22c55e" opacity="0.6" />
            <circle cx="220" cy="50" r="14" fill="#22c55e" opacity="0.6" />
            <circle cx="50" cy="180" r="14" fill="#22c55e" opacity="0.6" />
            <circle cx="220" cy="180" r="14" fill="#22c55e" opacity="0.6" />
          </g>

          {/* Clubhouse & Swimming Pool Enclave */}
          <g transform="translate(550, 240)">
            <rect x="0" y="0" width="260" height="230" rx="12" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
            <rect x="25" y="25" width="100" height="180" rx="6" fill="#bae6fd" stroke="#0369a1" strokeWidth="1.5" />
            <text x="75" y="120" textAnchor="middle" fill="#0369a1" fontSize="11" fontWeight="700">
              🏊 POOL
            </text>
            <rect x="140" y="25" width="100" height="180" rx="6" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
            <text x="190" y="115" textAnchor="middle" fill="#854d0e" fontSize="11" fontWeight="700">
              🏛️ CLUBHOUSE
            </text>
            <text x="190" y="132" textAnchor="middle" fill="#854d0e" fontSize="9">
              Gym & Pavilion
            </text>
          </g>

          {/* Render All Plots */}
          {mappedGeometries.map(({ geo, plot }, index) => {
            const isSelected = selectedPlotId === plot.id;
            const highlighted = isPlotHighlighted(plot);
            const fillColor = getStatusFill(plot.status);

            return (
              <g
                key={`${plot.id}-${geo.plotNumber}-${index}`}
                onClick={() => setSelectedPlotId(plot.id)}
                onMouseEnter={() => setHoveredPlot(plot)}
                onMouseLeave={() => setHoveredPlot(null)}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              >
                {/* Plot Body */}
                <rect
                  x={geo.x}
                  y={geo.y}
                  width={geo.width}
                  height={geo.height}
                  rx="6"
                  fill={fillColor}
                  fillOpacity={highlighted ? (isSelected ? 0.95 : 0.85) : 0.2}
                  stroke={isSelected ? '#f59e0b' : highlighted ? '#ffffff' : '#94a3b8'}
                  strokeWidth={isSelected ? 4 : 2}
                  filter={isSelected ? 'drop-shadow(0px 0px 8px rgba(245, 158, 11, 0.8))' : 'none'}
                />

                {/* Corner Plot Badge */}
                {geo.isCorner && (
                  <circle
                    cx={geo.x + geo.width - 12}
                    cy={geo.y + 12}
                    r="8"
                    fill="#f59e0b"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                )}

                {/* Plot Number Text */}
                <text
                  x={geo.x + geo.width / 2}
                  y={geo.y + geo.height / 2 - 6}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={geo.width < 80 ? '11' : '13'}
                  fontWeight="900"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
                >
                  {plot.plotNumber}
                </text>

                {/* Area in Sq.Yds & Facing */}
                <text
                  x={geo.x + geo.width / 2}
                  y={geo.y + geo.height / 2 + 10}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="9.5"
                  fontWeight="700"
                  opacity={0.95}
                >
                  {plot.areaSqYds} Yds &bull; {plot.facing[0]}
                </text>

                {/* Price in Lakhs (if wide enough) */}
                {geo.width >= 85 && (
                  <text
                    x={geo.x + geo.width / 2}
                    y={geo.y + geo.height / 2 + 23}
                    textAnchor="middle"
                    fill="#fef08a"
                    fontSize="8.5"
                    fontWeight="800"
                  >
                    ₹{(plot.totalPrice / 100000).toFixed(1)}L
                  </text>
                )}
              </g>
            );
          })}

          {/* Compass Rose (Top Right) */}
          <g transform="translate(930, 45)">
            <circle cx="0" cy="0" r="22" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
            <polygon points="0,-18 5,-3 0,0 -5,-3" fill="#ef4444" />
            <polygon points="0,18 5,3 0,0 -5,3" fill="#64748b" />
            <text x="0" y="-8" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#ef4444">
              N
            </text>
            <text x="0" y="14" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#64748b">
              S
            </text>
          </g>
        </svg>

        {/* Floating Live Hover Tooltip */}
        {hoveredPlot && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              bgcolor: 'rgba(15, 23, 42, 0.92)',
              color: '#ffffff',
              p: 1.5,
              borderRadius: 2,
              backdropFilter: 'blur(6px)',
              pointerEvents: 'none',
              zIndex: 10,
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.15)',
              minWidth: 180,
            }}
          >
            <Typography variant="subtitle2" fontWeight={800} color="primary.light">
              Plot #{hoveredPlot.plotNumber}
              {hoveredPlot.isCornerPlot && (
                <Chip label="Corner" size="small" color="secondary" sx={{ ml: 1, height: 18, fontSize: '0.65rem' }} />
              )}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', color: '#cbd5e1' }}>
              {hoveredPlot.areaSqYds} Sq.Yds &bull; {hoveredPlot.dimensions}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', color: '#cbd5e1' }}>
              Facing: <strong>{hoveredPlot.facing}</strong>
            </Typography>
            <Typography variant="subtitle2" fontWeight={800} color="#fef08a" sx={{ mt: 0.5 }}>
              ₹{(hoveredPlot.totalPrice / 100000).toFixed(2)} Lakhs
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Legend & Instructions */}
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ mt: 1.5, px: 1 }} alignItems="center">
        <Typography variant="caption" fontWeight={700} color="text.secondary">
          {t('map_legend')}:
        </Typography>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Box sx={{ width: 14, height: 14, borderRadius: '4px', bgcolor: '#10b981' }} />
          <Typography variant="caption" fontWeight={600}>{t('status_available')}</Typography>
        </Stack>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Box sx={{ width: 14, height: 14, borderRadius: '4px', bgcolor: '#3b82f6' }} />
          <Typography variant="caption" fontWeight={600}>{t('status_fast_selling')}</Typography>
        </Stack>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Box sx={{ width: 14, height: 14, borderRadius: '4px', bgcolor: '#8b5cf6' }} />
          <Typography variant="caption" fontWeight={600}>{t('status_booked')}</Typography>
        </Stack>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Box sx={{ width: 14, height: 14, borderRadius: '4px', bgcolor: '#ef4444' }} />
          <Typography variant="caption" fontWeight={600}>Booked</Typography>
        </Stack>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: '#f59e0b' }} />
          <Typography variant="caption" fontWeight={600}>Corner Plot</Typography>
        </Stack>
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="caption" color="primary.main" fontWeight={600}>
          <InfoOutlinedIcon sx={{ fontSize: 13, mr: 0.5, verticalAlign: 'middle' }} />
          {t('map_click_instruction')}
        </Typography>
      </Stack>

      {/* Selected Plot Detailed Sheet */}
      {selectedPlot && (
        <Card
          sx={{
            mt: 3,
            borderRadius: 3,
            border: '2px solid',
            borderColor: 'primary.main',
            boxShadow: '0 4px 20px rgba(25, 118, 210, 0.12)',
            bgcolor: '#ffffff',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Box>
                <Typography variant="h5" fontWeight={800} color="primary.main">
                  Plot #{selectedPlot.plotNumber} Selected
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedPlot.projectName} &bull; Approved Layout Sector A
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                {selectedPlot.isCornerPlot && (
                  <Chip label="CORNER PLOT" color="secondary" sx={{ fontWeight: 700 }} />
                )}
                <Chip
                  label={selectedPlot.status === 'AVAILABLE' ? 'Available' : selectedPlot.status === 'BOOKED' ? 'Reserved' : 'Fast Selling'}
                  color={selectedPlot.status === 'AVAILABLE' ? 'success' : selectedPlot.status === 'BOOKED' ? 'error' : 'warning'}
                  sx={{ fontWeight: 700 }}
                />
              </Stack>
            </Box>

            <Divider sx={{ mb: 2.5 }} />

            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">
                  {t('facing_label')}
                </Typography>
                <Typography variant="subtitle1" fontWeight={700}>
                  {selectedPlot.facing} Facing
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">
                  {t('area_label')}
                </Typography>
                <Typography variant="subtitle1" fontWeight={700}>
                  {selectedPlot.areaSqYds} Sq.Yds
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">
                  {t('dimensions_label')}
                </Typography>
                <Typography variant="subtitle1" fontWeight={700}>
                  {selectedPlot.dimensions} Feet
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">
                  {t('price_label')}
                </Typography>
                <Typography variant="subtitle1" fontWeight={800} color="primary.dark">
                  ₹{(selectedPlot.totalPrice / 100000).toFixed(2)} Lakhs
                </Typography>
              </Grid>
            </Grid>
          </CardContent>

          <CardActions sx={{ p: 2.5, pt: 0, bgcolor: '#f9fafb', justifyContent: 'flex-end', gap: 1.5 }}>
            {onVisitPlot && (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<DirectionsCarIcon />}
                onClick={() => onVisitPlot(selectedPlot)}
                sx={{ fontWeight: 600, textTransform: 'none' }}
              >
                {t('schedule_cab_visit')}
              </Button>
            )}
            {onHoldPlot && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<LockClockIcon />}
                disabled={selectedPlot.status === 'BOOKED'}
                onClick={() => onHoldPlot(selectedPlot)}
                sx={{
                  fontWeight: 700,
                  textTransform: 'none',
                  px: 3,
                  boxShadow: '0 4px 14px rgba(25, 118, 210, 0.3)',
                }}
              >
                {selectedPlot.status === 'BOOKED' ? t('reserved_btn') : t('hold_plot_48h')}
              </Button>
            )}
          </CardActions>
        </Card>
      )}
    </Box>
  );
};
