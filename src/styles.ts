import type { ImageMapperProps } from '@/types';
import type { CSSProperties } from 'react';

interface StylesProps {
  container: CSSProperties;
  canvas: CSSProperties;
  img: CSSProperties;
}

const absPos: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
};

const imgNonResponsive: CSSProperties = {
  ...absPos,
  zIndex: 1,
  userSelect: 'none',
};

const imgResponsive: CSSProperties = {
  ...imgNonResponsive,
  width: '100%',
  height: 'auto',
};

const styles = ({ responsive }: Pick<ImageMapperProps, 'responsive'>): StylesProps => ({
  container: {
    position: 'relative',
  },
  canvas: {
    ...absPos,
    pointerEvents: 'none',
    zIndex: 2,
  },
  img: responsive ? imgResponsive : imgNonResponsive,
});

export default styles;
