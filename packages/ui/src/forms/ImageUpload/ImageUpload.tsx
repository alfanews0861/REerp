import React from 'react';
import { FileUpload, FileUploadProps } from '../FileUpload/FileUpload';

export interface ImageUploadProps extends Omit<FileUploadProps, 'accept'> {}

export const ImageUpload: React.FC<ImageUploadProps> = (props) => {
  return <FileUpload accept="image/*" label="Upload Image" {...props} />;
};
