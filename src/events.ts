import type { EventProps, ImageEventProps, ImageMapperProps, TouchEvent } from '@/types';

interface EventFC<T = EventProps> {
  (data: T, props: ImageMapperProps): void;
}

export const imageMouseMove: EventFC<ImageEventProps> = ({ event }, { onImageMouseMove }) => {
  if (onImageMouseMove) onImageMouseMove(event);
};

export const imageClick: EventFC<ImageEventProps> = ({ event }, { onImageClick }) => {
  if (onImageClick) onImageClick(event);
};

export const mouseMove: EventFC = ({ area, index, event }, { onMouseMove }) => {
  if (onMouseMove) onMouseMove(area, index, event);
};

export const mouseDown: EventFC = ({ area, index, event }, { onMouseDown }) => {
  if (onMouseDown) onMouseDown(area, index, event);
};

export const mouseUp: EventFC = ({ area, index, event }, { onMouseUp }) => {
  if (onMouseUp) onMouseUp(area, index, event);
};

export const touchStart: EventFC<EventProps<TouchEvent>> = (
  { area, index, event },
  { onTouchStart }
) => {
  if (onTouchStart) onTouchStart(area, index, event);
};

export const touchEnd: EventFC<EventProps<TouchEvent>> = (
  { area, index, event },
  { onTouchEnd }
) => {
  if (onTouchEnd) onTouchEnd(area, index, event);
};
