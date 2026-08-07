import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  label?: string;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, label = 'Upload File', accept }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onFileSelect) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <Box sx={{ border: '1px dashed grey', p: 3, textAlign: 'center', borderRadius: 1 }}>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
      >
        {label}
        <input
          type="file"
          hidden
          accept={accept}
          onChange={handleFileChange}
        />
      </Button>
      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
        Drag and drop or click to upload
      </Typography>
    </Box>
  );
};
