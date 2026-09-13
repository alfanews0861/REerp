import { createTheme, Theme, responsiveFontSizes } from '@mui/material/styles';
import { lightPalette } from './lightPalette';
import { darkPalette } from './darkPalette';
import { corporatePalette } from './corporatePalette';
import { typography } from './typography';
import { breakpoints } from './breakpoints';
import { spacingMultiplier } from './spacing';

export function createAppTheme(mode: 'light' | 'dark' | 'corporate'): Theme {
  let palette = lightPalette;
  if (mode === 'dark') palette = darkPalette;
  if (mode === 'corporate') palette = corporatePalette;

  const isDark = mode === 'dark';

  const theme = createTheme({
    palette,
    typography,
    breakpoints,
    spacing: spacingMultiplier,
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          body {
            scrollbar-color: ${isDark ? '#334155 #0B0F17' : '#CBD5E1 #F8FAFC'};
          }
          &::-webkit-scrollbar, & *::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          &::-webkit-scrollbar-track, & *::-webkit-scrollbar-track {
            background: ${isDark ? '#0B0F17' : '#F8FAFC'};
          }
          &::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb {
            border-radius: 8px;
            background-color: ${isDark ? '#334155' : '#CBD5E1'};
          }

          @media print {
            @page {
              size: auto;
              margin: 10mm;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              box-shadow: none !important;
              text-shadow: none !important;
            }
            html, body, #root {
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              color: #0f172a !important;
              width: 100% !important;
              min-height: auto !important;
              height: auto !important;
              overflow: visible !important;
            }
            /* Hide application shell navigation, app bar, drawers, headers, and floating actions */
            .MuiDrawer-root,
            nav,
            aside,
            [role="navigation"],
            .MuiAppBar-root,
            header,
            [role="banner"],
            .MuiBreadcrumbs-root,
            .MuiPagination-root,
            .MuiTablePagination-root,
            .no-print,
            footer {
              display: none !important;
            }
            /* Hide standard interactive action buttons during print unless part of print-only content */
            button:not(.allow-print),
            .MuiButton-root:not(.allow-print),
            .MuiIconButton-root:not(.allow-print),
            .MuiFab-root {
              display: none !important;
            }
            main {
              margin: 0 !important;
              padding: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
            }
            .MuiPaper-root {
              border: 1px solid #cbd5e1 !important;
              box-shadow: none !important;
              page-break-inside: avoid;
            }
          }
        `,
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 10,
            textTransform: 'none',
            fontWeight: 600,
            padding: '9px 20px',
            fontSize: '0.875rem',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: isDark
                ? '0 6px 20px rgba(59, 130, 246, 0.25)'
                : '0 6px 20px rgba(30, 64, 175, 0.15)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },
          containedPrimary: {
            background: isDark
              ? 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
              : 'linear-gradient(135deg, #1E40AF 0%, #0F172A 100%)',
            color: '#FFFFFF',
            boxShadow: isDark
              ? '0 4px 14px rgba(59, 130, 246, 0.3)'
              : '0 4px 14px rgba(30, 64, 175, 0.2)',
          },
          containedSecondary: {
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            color: '#FFFFFF',
            boxShadow: '0 4px 14px rgba(217, 119, 6, 0.25)',
          },
          outlined: {
            borderWidth: 1.5,
            '&:hover': {
              borderWidth: 1.5,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundImage: 'none',
            backgroundColor: isDark ? '#111827' : '#FFFFFF',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.8)'}`,
            boxShadow: isDark
              ? '0 10px 30px -5px rgba(0, 0, 0, 0.6), 0 4px 10px rgba(0, 0, 0, 0.4)'
              : '0 10px 30px -5px rgba(15, 23, 42, 0.04), 0 2px 6px -1px rgba(15, 23, 42, 0.02)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
          rounded: {
            borderRadius: 16,
          },
          elevation1: {
            boxShadow: isDark
              ? '0 4px 20px rgba(0, 0, 0, 0.4)'
              : '0 4px 20px rgba(15, 23, 42, 0.04)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? 'rgba(17, 24, 39, 0.85)' : 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(12px)',
            borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.9)'}`,
            boxShadow: 'none',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? '#0B0F17' : '#FFFFFF',
            borderRight: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.9)'}`,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? '#3B82F6' : '#1E40AF',
              borderWidth: 2,
            },
          },
          notchedOutline: {
            borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#CBD5E1',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600,
            fontSize: '0.75rem',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC',
            '& .MuiTableCell-head': {
              fontWeight: 700,
              fontSize: '0.78rem',
              color: isDark ? '#94A3B8' : '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9',
            padding: '14px 16px',
          },
        },
      },
    },
  });

  return responsiveFontSizes(theme);
}

export * from './lightPalette';
export * from './darkPalette';
export * from './corporatePalette';
export * from './typography';
export * from './breakpoints';
export * from './spacing';
export * from './ThemeProvider';

