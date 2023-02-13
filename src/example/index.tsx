import React, { useState, useRef } from 'react';
import ImageMapper, { MapAreas } from '../ImageMapper';
import JSON from './area.json';

const URL = 'https://raw.githubusercontent.com/img-mapper/react-docs/master/src/assets/example.jpg';

// const JSON =
//   'https://raw.githubusercontent.com/img-mapper/react-docs/master/src/assets/example.json';

const Example: React.FC = () => {
  const [areas, setAreas] = useState<Array<MapAreas>>(JSON);
  const ref = useRef(null);

  const handleClick = () => {
    const area = areas.map((cur: MapAreas, i: number) => {
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
    <React.Fragment>
      <ImageMapper
        src={URL}
        containerRef={ref}
        map={{
          name: 'my-map',
          areas,
        }}
        stayHighlighted
        toggleHighlighted
      />
      <button type="button" onClick={handleClick}>
        Hello
      </button>
      <button type="button" onClick={() => ref.current.clearHighlightedArea()}>
        Clear
      </button>
    </React.Fragment>
  );
};

export default Example;
