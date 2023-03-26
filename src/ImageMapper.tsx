import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import isEqual from 'react-fast-compare';

import { imageMapperDefaultProps, rerenderPropsList } from '@/constants';
import callingFn from '@/draw';
import {
  imageClick,
  imageMouseMove,
  mouseDown,
  mouseMove,
  mouseUp,
  touchEnd,
  touchStart,
} from '@/events';
import styles from '@/styles';

import type { Area, EventFC, ImageMapperProps, Map, MapArea, RefProperties } from '@/types';
import type { ReactNode } from 'react';

export type * from '@/types';

const ImageMapper = forwardRef<RefProperties, ImageMapperProps>((props, ref) => {
  const {
    DAreaKeyName,
    DActive,
    DDisabled,
    DFillColor,
    DStrokeColor,
    DLineWidth,
    DImgWidth,
    DWidth,
    DHeight,
    DNatural,
    DStayHighlighted,
    DStayMultiHighlighted,
    DToggleHighlighted,
    DResponsive,
    DParentWidth,

    DOnClick,
    DOnMouseEnter,
    DOnMouseLeave,
    DOnLoad,
  } = imageMapperDefaultProps;

  const {
    src: srcProp,
    map: mapProp,
    areaKeyName = DAreaKeyName,
    active = DActive,
    disabled = DDisabled,
    fillColor: fillColorProp = DFillColor,
    strokeColor: strokeColorProp = DStrokeColor,
    lineWidth: lineWidthProp = DLineWidth,
    imgWidth: imageWidthProp = DImgWidth,
    width: widthProp = DWidth,
    height: heightProp = DHeight,
    natural = DNatural,
    stayHighlighted = DStayHighlighted,
    stayMultiHighlighted = DStayMultiHighlighted,
    toggleHighlighted = DToggleHighlighted,
    parentWidth = DParentWidth,
    responsive = DResponsive,

    onClick = DOnClick,
    onMouseEnter = DOnMouseEnter,
    onMouseLeave = DOnMouseLeave,
    onLoad = DOnLoad,
  } = props;

  const [map, setMap] = useState<Map>(mapProp);
  const [storedMap, setStoredMap] = useState<Map>(map);
  const [isRendered, setRendered] = useState<boolean>(false);
  const [imgRef, setImgRef] = useState<HTMLImageElement | null>(null);
  const container = useRef<HTMLDivElement | null>(null);
  const img = useRef<HTMLImageElement | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const isInitialMount = useRef<boolean>(true);
  const interval = useRef<number>(0);

  const scaleCoords = useCallback(
    (coords: number[]): number[] => {
      const scale =
        widthProp && imageWidthProp && imageWidthProp > 0
          ? (widthProp as number) / imageWidthProp
          : 1;

      return coords.map(coord =>
        responsive && parentWidth && imgRef
          ? coord / (imgRef.naturalWidth / parentWidth)
          : coord * scale
      );
    },
    [imageWidthProp, imgRef, parentWidth, responsive, widthProp]
  );

  const renderPrefilledAreas = useCallback(
    (mapObj: Map = map): boolean[] =>
      mapObj.areas.map(area => {
        if (!area.preFillColor) return false;

        callingFn(
          area.shape,
          scaleCoords(area.coords),
          area.preFillColor,
          area.lineWidth ?? lineWidthProp,
          area.strokeColor ?? strokeColorProp,
          true,
          ctx.current
        );
        return true;
      }),
    [lineWidthProp, map, scaleCoords, strokeColorProp]
  );

  const getDimensions = useCallback(
    (type: 'width' | 'height'): number => {
      const dimension = type === 'width' ? widthProp : heightProp;

      if (img.current && typeof dimension === 'function') {
        return dimension(img.current);
      }
      return dimension as number;
    },
    [widthProp, heightProp]
  );

  const getValues = useCallback(
    (type: string, measure: number, name = 'area'): number => {
      if (!img.current) return 0;

      const { naturalWidth, naturalHeight, clientWidth, clientHeight } = img.current;

      if (type === 'width') {
        if (responsive) return parentWidth;
        if (natural) return naturalWidth;
        if (widthProp || name === 'image') return measure;
        return clientWidth;
      }
      if (type === 'height') {
        if (responsive) return clientHeight;
        if (natural) return naturalHeight;
        if (heightProp || name === 'image') return measure;
        return clientHeight;
      }
      return 0;
    },
    [heightProp, natural, parentWidth, responsive, widthProp]
  );

  const initCanvas = useCallback(
    (firstLoad = false): void => {
      if (!firstLoad && !imgRef) return;
      if (!img.current || !canvas.current || !container.current) return;

      const imgWidth = getDimensions('width');
      const imgHeight = getDimensions('height');
      const imageWidth = getValues('width', imgWidth);
      const imageHeight = getValues('height', imgHeight);

      if (widthProp || responsive) {
        img.current.width = getValues('width', imgWidth, 'image');
      }

      if (heightProp || responsive) {
        img.current.height = getValues('height', imgHeight, 'image');
      }

      canvas.current.width = imageWidth;
      canvas.current.height = imageHeight;
      container.current.style.width = `${imageWidth}px`;
      container.current.style.height = `${imageHeight}px`;

      ctx.current = canvas.current.getContext('2d') as CanvasRenderingContext2D;
      ctx.current.fillStyle = fillColorProp;

      if (onLoad && imgRef) {
        onLoad(img.current, { width: imageWidth, height: imageHeight });
      }

      setImgRef(img.current);
      if (imgRef) renderPrefilledAreas();
    },
    [
      fillColorProp,
      getDimensions,
      getValues,
      heightProp,
      imgRef,
      onLoad,
      renderPrefilledAreas,
      responsive,
      widthProp,
    ]
  );

  const highlightArea = (area: Area): boolean =>
    callingFn(
      area.shape,
      area.scaledCoords,
      area.fillColor ?? fillColorProp,
      area.lineWidth ?? lineWidthProp,
      area.strokeColor ?? strokeColorProp,
      area.active ?? true,
      ctx.current
    );

  const clearCanvas = (): void => {
    if (!ctx.current || !canvas.current) return;

    ctx.current.clearRect(0, 0, canvas.current.width, canvas.current.height);
  };

  const updateCanvas = useCallback((): void => {
    clearCanvas();
    renderPrefilledAreas(mapProp);
  }, [mapProp, renderPrefilledAreas]);

  const hoverOn: EventFC = ({ area, index, event }) => {
    if (active) highlightArea(area);
    if (onMouseEnter) onMouseEnter(area, index, event);
  };

  const hoverOff: EventFC = ({ area, index, event }) => {
    if (active) {
      clearCanvas();
      renderPrefilledAreas();
    }

    if (onMouseLeave) onMouseLeave(area, index, event);
  };

  const click: EventFC = ({ area, index, event }) => {
    const isAreaActive = area.active ?? true;

    if (isAreaActive && (stayHighlighted || stayMultiHighlighted || toggleHighlighted)) {
      const newArea = { ...area };
      const chosenArea = stayMultiHighlighted ? map : storedMap;

      if (toggleHighlighted && newArea.preFillColor) {
        const isPreFillColorFromJSON = storedMap.areas.find(
          c => c[areaKeyName] === area[areaKeyName]
        );

        if (isPreFillColorFromJSON && !isPreFillColorFromJSON.preFillColor) {
          delete newArea.preFillColor;
        }
      } else if (stayHighlighted || stayMultiHighlighted) {
        newArea.preFillColor = area.fillColor ?? fillColorProp;
      }

      const updatedAreas = chosenArea.areas.map(cur =>
        cur[areaKeyName] === area[areaKeyName] ? newArea : cur
      );
      setMap(prev => ({ ...prev, areas: updatedAreas }));

      if (!stayMultiHighlighted) {
        updateCanvas();
        highlightArea(area);
      }
    }

    if (onClick) {
      event.preventDefault();
      onClick(area, index, event);
    }
  };

  const computeCenter = (area: MapArea): [number, number] => {
    if (!area) return [0, 0];

    const scaledCoords = scaleCoords(area.coords);

    switch (area.shape) {
      case 'circle':
        return [scaledCoords[0], scaledCoords[1]];
      case 'poly':
      case 'rect':
      default: {
        const n = scaledCoords.length / 2;
        const { y: scaleY, x: scaleX } = scaledCoords.reduce(
          ({ y, x }, val, idx) => (!(idx % 2) ? { y, x: x + val / n } : { y: y + val / n, x }),
          { y: 0, x: 0 }
        );
        return [scaleX, scaleY];
      }
    }
  };

  const updateCacheMap = useCallback(() => {
    setMap(mapProp);
    setStoredMap(mapProp);
  }, [mapProp]);

  useEffect(() => {
    if (!isRendered) {
      interval.current = window.setInterval(() => {
        if (img.current?.complete) {
          setRendered(true);
        }
      }, 500);
    } else {
      clearInterval(interval.current);
    }
  }, [isRendered]);

  useEffect(() => {
    if (isRendered && canvas.current) {
      initCanvas(true);
      ctx.current = canvas.current.getContext('2d');
      updateCacheMap();
    }
  }, [isRendered, updateCacheMap]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      updateCacheMap();
      initCanvas();
      if (imgRef) updateCanvas();
    }
  }, [isInitialMount, imgRef, updateCacheMap]);

  useImperativeHandle(
    ref,
    () => ({
      clearHighlightedArea: (): void => {
        setMap(storedMap);
        updateCanvas();
      },
    }),
    [storedMap, updateCanvas]
  );

  const renderAreas = (): ReactNode =>
    map.areas.map((mapArea, index) => {
      const scaledCoords = scaleCoords(mapArea.coords);
      const center = computeCenter(mapArea);
      const area = { ...mapArea, scaledCoords, center };

      if (area.disabled) return null;

      return (
        <area
          {...(area.preFillColor ? { className: 'img-mapper-area-highlighted' } : {})}
          key={area[areaKeyName] ?? index.toString()}
          shape={area.shape}
          coords={scaledCoords.join(',')}
          onMouseEnter={event => void hoverOn({ area, index, event })}
          onMouseLeave={event => void hoverOff({ area, index, event })}
          onMouseMove={event => void mouseMove({ area, index, event }, props)}
          onMouseDown={event => void mouseDown({ area, index, event }, props)}
          onMouseUp={event => void mouseUp({ area, index, event }, props)}
          onTouchStart={event => void touchStart({ area, index, event }, props)}
          onTouchEnd={event => void touchEnd({ area, index, event }, props)}
          onClick={event => void click({ area, index, event })}
          href={area.href}
          alt="map"
        />
      );
    });

  const cssStyles = styles({ responsive });

  return (
    <div ref={container} id="img-mapper" style={cssStyles.container}>
      <img
        ref={img}
        role="presentation"
        className="img-mapper-img"
        style={{ ...cssStyles.img, ...(!imgRef ? { display: 'none' } : {}) }}
        src={srcProp}
        useMap={`#${map.name}`}
        alt="map"
        onClick={event => void imageClick({ event }, props)}
        onMouseMove={event => void imageMouseMove({ event }, props)}
      />
      <canvas ref={canvas} className="img-mapper-canvas" style={cssStyles.canvas} />
      <map className="img-mapper-map" name={map.name}>
        {isRendered && !disabled && imgRef && renderAreas()}
      </map>
    </div>
  );
});

ImageMapper.displayName = 'ImageMapper';

export default memo(ImageMapper, (prevProps, nextProps) => {
  const watchedProps = [...rerenderPropsList, ...(nextProps.rerenderProps ?? [])];
  const propChanged = watchedProps.some(prop => prevProps[prop] !== nextProps[prop]);

  return isEqual(prevProps.map, nextProps.map) && !propChanged;
});
