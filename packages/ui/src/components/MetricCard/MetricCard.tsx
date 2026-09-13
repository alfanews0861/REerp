import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export interface MetricCardProps {
  title: string;
  value: string | number | React.ReactNode;
  unit?: string;
  suffix?: string;
  prefix?: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  color?: string;
  gradient?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  suffix,
  prefix,
  subtitle,
  trend,
  icon,
  color = '#2563eb',
  gradient,
  onClick,
}) => {
  const renderFormattedValue = () => {
    if (typeof value !== 'string' && typeof value !== 'number') {
      return value;
    }

    const str = String(value).trim();
    const explicitUnit = unit || suffix;

    // Pattern matching numbers/currencies with optional units/suffixes
    // Group 1: Currency symbol / prefix (₹, $, €, £)
    // Group 2: Main numeric value (e.g. 1,50,900, 48.65, 20, 68 / 80, 84.5%)
    // Group 3: Optional short currency / unit denominator (Cr, L, Lakh, Crore, KM, Km, Hrs, hrs, k, M, B)
    // Group 4: Trailing descriptive words (e.g. "Checked In", "on Venture Sites", "Plots", "Claims (₹8,950)", "Staff")
    const match = str.match(/^([₹$€£]?\s*)([\d,.]+(?:\s*[\/\-]\s*[\d,.]+)?%?)\s*(Cr|L|Lakh|Crore|KM|Km|Hrs|hrs|k|M|B)?(?:\s+(.+))?$/i);

    if (match) {
      const matchedPrefix = prefix || match[1] || '';
      const mainNumber = match[2];
      const denominator = match[3] ? ` ${match[3]}` : '';
      const trailingText = explicitUnit || match[4] || '';

      return (
        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 0.75 }}>
          {matchedPrefix && (
            <Box component="span" sx={{ fontSize: '0.85em', fontWeight: 700, mr: 0.15, opacity: 0.9 }}>
              {matchedPrefix}
            </Box>
          )}
          <Box component="span" sx={{ fontWeight: 800 }}>
            {mainNumber}{denominator}
          </Box>
          {trailingText && (
            <Box
              component="span"
              sx={{
                fontSize: '0.42em',
                fontWeight: 600,
                letterSpacing: 'normal',
                color: gradient ? 'rgba(255,255,255,0.92)' : 'text.secondary',
                bgcolor: gradient ? 'rgba(255,255,255,0.18)' : 'rgba(15, 23, 42, 0.05)',
                border: gradient ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(226, 232, 240, 0.8)',
                px: 1,
                py: 0.25,
                borderRadius: 1.5,
                lineHeight: 1.2,
                display: 'inline-flex',
                alignItems: 'center',
                verticalAlign: 'middle',
                whiteSpace: 'nowrap',
              }}
            >
              {trailingText}
            </Box>
          )}
        </Box>
      );
    }

    if (explicitUnit) {
      return (
        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 0.75 }}>
          {prefix && (
            <Box component="span" sx={{ fontSize: '0.85em', fontWeight: 700, mr: 0.15, opacity: 0.9 }}>
              {prefix}
            </Box>
          )}
          <Box component="span" sx={{ fontWeight: 800 }}>
            {str}
          </Box>
          <Box
            component="span"
            sx={{
              fontSize: '0.42em',
              fontWeight: 600,
              letterSpacing: 'normal',
              color: gradient ? 'rgba(255,255,255,0.92)' : 'text.secondary',
              bgcolor: gradient ? 'rgba(255,255,255,0.18)' : 'rgba(15, 23, 42, 0.05)',
              border: gradient ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(226, 232, 240, 0.8)',
              px: 1,
              py: 0.25,
              borderRadius: 1.5,
              lineHeight: 1.2,
              display: 'inline-flex',
              alignItems: 'center',
              verticalAlign: 'middle',
              whiteSpace: 'nowrap',
            }}
          >
            {explicitUnit}
          </Box>
        </Box>
      );
    }

    return (
      <Box component="span" sx={{ display: 'inline-flex', alignItems: 'baseline' }}>
        {prefix && (
          <Box component="span" sx={{ fontSize: '0.85em', fontWeight: 700, mr: 0.15, opacity: 0.9 }}>
            {prefix}
          </Box>
        )}
        <Box component="span" sx={{ fontWeight: 800 }}>
          {str}
        </Box>
      </Box>
    );
  };

  return (
    <Card
      onClick={onClick}
      sx={{
        borderRadius: 2.5,
        boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)',
        transition: 'all 0.2s ease-in-out',
        cursor: onClick ? 'pointer' : 'default',
        background: gradient || '#ffffff',
        border: '1px solid',
        borderColor: gradient ? 'transparent' : 'rgba(226, 232, 240, 0.8)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 20px -4px rgba(0, 0, 0, 0.08)',
        },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: gradient ? 'rgba(255,255,255,0.9)' : 'text.secondary',
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
                fontSize: '0.72rem',
              }}
            >
              {title}
            </Typography>
          </Box>
          {icon && (
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: gradient ? '#ffffff' : color,
                backgroundColor: gradient ? 'rgba(255,255,255,0.2)' : `${color}15`,
                '& svg': { fontSize: 20 },
              }}
            >
              {icon}
            </Box>
          )}
        </Box>

        <Typography
          component="div"
          sx={{
            fontSize: { xs: '1.5rem', sm: '1.85rem' },
            fontWeight: 800,
            lineHeight: 1.15,
            color: gradient ? '#ffffff' : '#0f172a',
            mb: 0.5,
            letterSpacing: '-0.02em',
          }}
        >
          {renderFormattedValue()}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 0.5 }}>
          {subtitle && (
            <Typography
              variant="caption"
              sx={{
                color: gradient ? 'rgba(255,255,255,0.85)' : 'text.secondary',
                fontWeight: 500,
                fontSize: '0.75rem',
                lineHeight: 1.2,
              }}
            >
              {subtitle}
            </Typography>
          )}
          {trend && (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 0.75,
                py: 0.15,
                borderRadius: 1,
                fontSize: '0.7rem',
                fontWeight: 700,
                backgroundColor: gradient
                  ? 'rgba(255,255,255,0.25)'
                  : trend.isPositive
                  ? '#dcfce7'
                  : '#fee2e2',
                color: gradient
                  ? '#ffffff'
                  : trend.isPositive
                  ? '#15803d'
                  : '#b91c1c',
              }}
            >
              {trend.isPositive ? '↑' : '↓'} {trend.value}%
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
