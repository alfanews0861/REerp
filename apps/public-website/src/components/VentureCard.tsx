import { FC } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import GridViewIcon from '@mui/icons-material/GridView';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { PublicVenture } from '../data/venturesData';

export interface VentureCardProps {
  venture: PublicVenture;
  onBookVisit: (ventureId: string) => void;
}

export const VentureCard: FC<VentureCardProps> = ({ venture, onBookVisit }) => {
  const navigate = useNavigate();

  const getBadgeColor = (auth: string) => {
    switch (auth) {
      case 'HMDA':
        return 'primary';
      case 'DTCP':
        return 'secondary';
      case 'RERA':
        return 'success';
      default:
        return 'info';
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="220"
          image={venture.heroImage}
          alt={venture.name}
          sx={{ objectFit: 'cover' }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            display: 'flex',
            gap: 1,
          }}
        >
          <Chip
            label={`${venture.approvalAuthority} APPROVED`}
            color={getBadgeColor(venture.approvalAuthority)}
            size="small"
            icon={<VerifiedUserIcon />}
            sx={{ fontWeight: 700, px: 0.5 }}
          />
          {venture.featured && (
            <Chip
              label="FEATURED"
              color="warning"
              size="small"
              sx={{ fontWeight: 700 }}
            />
          )}
        </Box>
        <Box
          sx={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            bgcolor: 'rgba(0, 0, 0, 0.75)',
            color: '#fff',
            px: 1.5,
            py: 0.5,
            borderRadius: 1.5,
            fontSize: '0.85rem',
            fontWeight: 700,
          }}
        >
          ₹{venture.basePricePerSqYd.toLocaleString('en-IN')} / sq.yd
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom component="h3">
          {venture.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', mb: 2 }}>
          <LocationOnIcon fontSize="small" color="action" />
          <Typography variant="body2" noWrap>
            {venture.location}
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} sx={{ mb: 2, bgcolor: 'grey.50', p: 1.5, borderRadius: 2 }}>
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, color: 'text.secondary' }}>
              <SquareFootIcon fontSize="small" />
              <Typography variant="caption">Total Area</Typography>
            </Box>
            <Typography variant="subtitle2" fontWeight={700}>
              {venture.totalAreaAcres} Acres
            </Typography>
          </Box>

          <Divider orientation="vertical" flexItem />

          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, color: 'text.secondary' }}>
              <GridViewIcon fontSize="small" />
              <Typography variant="caption">Available</Typography>
            </Box>
            <Typography variant="subtitle2" fontWeight={700} color="success.main">
              {venture.availablePlots} / {venture.totalPlots} Plots
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 1 }}>
          {venture.amenities.slice(0, 3).map((amenity, idx) => (
            <Chip
              key={idx}
              label={amenity}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.75rem', bgcolor: 'background.paper' }}
            />
          ))}
          {venture.amenities.length > 3 && (
            <Chip
              label={`+${venture.amenities.length - 3} more`}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          )}
        </Box>
      </CardContent>

      <Divider />

      <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button
          size="small"
          variant="outlined"
          color="primary"
          startIcon={<CalendarMonthIcon />}
          onClick={() => onBookVisit(venture.id)}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Free Site Visit
        </Button>
        <Button
          size="small"
          variant="contained"
          color="primary"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate(`/ventures/${venture.id}`)}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};
