import type {
  MutableRefObject,
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
} from 'react';

export interface ContainerRef extends HTMLDivElement {
  clearHighlightedArea: () => void;
}

export interface MapArea {
  id?: string;
  shape: string;
  coords: number[];
  active?: boolean;
  disabled?: boolean;
  href?: string;
  fillColor?: string;
  strokeColor?: string;
  lineWidth?: number;
  preFillColor?: string;
}

export interface Map {
  name: string;
  areas: MapArea[];
}

export interface Area extends MapArea {
  scaledCoords: number[];
  center: [number, number];
}

export type TouchEvent = ReactTouchEvent<HTMLAreaElement>;
export type AreaEvent = ReactMouseEvent<HTMLAreaElement>;
export type ImageEvent = ReactMouseEvent<HTMLImageElement>;
export type Dimension = number | ((e: HTMLImageElement) => number);

export interface EventFC<T = EventProps> {
  (data: T): void;
}

export type ImageEventHandler = ((event: ImageEvent) => void) | null;

export interface ImageEventProps {
  event: ImageEvent;
}

export type EventHandler<T = AreaEvent> = ((area: Area, index: number, e: T) => void) | null;

export interface EventProps<T = AreaEvent> {
  area: Area;
  index: number;
  event: T;
}

export type LoadEventHandler =
  | ((e: HTMLImageElement, dimensions: { width: number; height: number }) => void)
  | null;

export interface ImageMapperProps {
  src: string;
  map: Map;
  areaKeyName?: 'id';
  containerRef?: MutableRefObject<ContainerRef | null> | null;
  active?: boolean;
  disabled?: boolean;
  fillColor?: string;
  strokeColor?: string;
  lineWidth?: number;
  imgWidth?: number;
  width?: Dimension;
  height?: Dimension;
  natural?: boolean;
  stayHighlighted?: boolean;
  stayMultiHighlighted?: boolean;
  toggleHighlighted?: boolean;
  rerenderProps?: (keyof ImageMapperProps)[];
  responsive?: boolean;
  parentWidth?: number;
  onImageClick?: ImageEventHandler;
  onImageMouseMove?: ImageEventHandler;
  onClick?: EventHandler;
  onMouseDown?: EventHandler;
  onMouseUp?: EventHandler;
  onTouchStart?: EventHandler<TouchEvent>;
  onTouchEnd?: EventHandler<TouchEvent>;
  onMouseMove?: EventHandler;
  onMouseEnter?: EventHandler;
  onMouseLeave?: EventHandler;
  onLoad?: LoadEventHandler;
}

// eslint-disable-next-line @typescript-eslint/no-type-alias
type PrefixType<T, P extends string> = {
  [K in keyof T as K extends string ? `${P}${Capitalize<K>}` : never]: T[K];
};

export type ImagePropsWithDPrefix = PrefixType<Required<ImageMapperProps>, 'D'>;
