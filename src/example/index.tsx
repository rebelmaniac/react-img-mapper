import React, { useRef, useState } from 'react';

import JSON from './area.json';
import ImageMapper from '../ImageMapper';

import type { ContainerRef, MapArea } from '../ImageMapper';

const URL = 'https://raw.githubusercontent.com/img-mapper/react-docs/master/src/assets/example.jpg';

// const JSON =
//   'https://raw.githubusercontent.com/img-mapper/react-docs/master/src/assets/example.json';

const Example: React.FC = () => {
  const [areas, setAreas] = useState<MapArea[]>(JSON);
  const ref = useRef<ContainerRef>(null);

  const handleClick = () => {
    const area = areas.map((cur: MapArea, i: number) => {
      if (i % 4 === 0) {
        const temp = { ...cur };
        temp.preFillColor = 'red';
        return temp;
      }
      return cur;
    });
    setAreas(area);
  };

  if (!areas.length) return null;

  return (
    <>
      <ImageMapper
        src={URL}
        containerRef={ref}
        map={{
          name: 'my-map',
          areas,
        }}
        active={false}
        onClick={() => {
          console.log('imagew');
        }}
        onImageClick={() => console.log('lol')}
        stayHighlighted
        toggleHighlighted
      />
      <button type="button" onClick={handleClick}>
        Hello
      </button>
      <button type="button" onClick={() => ref?.current?.clearHighlightedArea()}>
        Clear
      </button>
    </>
  );
};

export default Example;
