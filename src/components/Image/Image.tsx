import React from 'react';
import ImageNext from 'next/image';
import { ImageProps } from './types';

const Image: React.FC<ImageProps> = ({ ...props }) => {
  return <ImageNext {...props} priority />;
};

export default Image;
