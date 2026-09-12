import React, { FC, useState } from 'react';
import {
   Box,
   Button,
   Menu,
   MenuItem,
   ListItemIcon,
   ListItemText,
   Typography,
 } from '@mui/material';
 import LanguageIcon from '@mui/icons-material/Language';
 import CheckIcon from '@mui/icons-material/Check';
 import { useI18n } from '../providers/LanguageContext';
 import { SupportedLanguage } from '@real-estate-erp/utils';

export interface LanguageSwitcherProps {
  variant?: 'button' | 'compact';
}

export const LanguageSwitcher: FC<LanguageSwitcherProps> = ({ variant = 'button' }) => {
  const { language, setLanguage, languages } = useI18n();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectLanguage = (code: SupportedLanguage) => {
    setLanguage(code);
    handleClose();
  };

  const currentOption = languages.find((l) => l.code === language) || languages[0];

  return (
    <Box sx={{ display: 'inline-block' }}>
      <Button
        id="language-switch-button"
        aria-controls={open ? 'language-switch-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        size="small"
        variant="outlined"
        startIcon={<span>{currentOption.flag}</span>}
        sx={{
          textTransform: 'none',
          fontWeight: 700,
          color: 'text.primary',
          borderColor: '#d1d5db',
          borderRadius: 2,
          px: variant === 'compact' ? 1 : 1.5,
          py: 0.5,
          fontSize: '0.85rem',
          bgcolor: '#ffffff',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          minWidth: 'auto',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: '#f9fafb',
          },
        }}
      >
        {variant === 'compact' ? currentOption.code.toUpperCase() : currentOption.nativeLabel}
      </Button>

      <Menu
        id="language-switch-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-switch-button',
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 160,
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            mt: 1,
          },
        }}
      >
        {languages.map((item) => {
          const isSelected = item.code === language;
          return (
            <MenuItem
              key={item.code}
              selected={isSelected}
              onClick={() => handleSelectLanguage(item.code)}
              sx={{
                py: 1,
                px: 2,
                fontWeight: isSelected ? 700 : 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography component="span" sx={{ fontSize: '1.2rem', lineHeight: 1 }}>
                  {item.flag}
                </Typography>
                <Box>
                  <Typography variant="body2" fontWeight={isSelected ? 700 : 500}>
                    {item.nativeLabel}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.label}
                  </Typography>
                </Box>
              </Box>
              {isSelected && (
                <ListItemIcon sx={{ minWidth: 'auto', color: 'primary.main', ml: 1 }}>
                  <CheckIcon fontSize="small" />
                </ListItemIcon>
              )}
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};
