const drawRect = (
  coords: number[],
  fillColor: string,
  lineWidth: number,
  strokeColor: string,
  ctx: CanvasRenderingContext2D
): void => {
  const [left, top, right, bot] = coords;
  ctx.fillStyle = fillColor;
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeColor;
  ctx.strokeRect(left, top, right - left, bot - top);
  ctx.fillRect(left, top, right - left, bot - top);
};

const drawCircle = (
  coords: number[],
  fillColor: string,
  lineWidth: number,
  strokeColor: string,
  ctx: CanvasRenderingContext2D
): void => {
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeColor;
  ctx.arc(coords[0], coords[1], coords[2], 0, 2 * Math.PI);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
};

const drawPoly = (
  coords: number[],
  fillColor: string,
  lineWidth: number,
  strokeColor: string,
  ctx: CanvasRenderingContext2D
): void => {
  const newCoords = Array.from({ length: coords.length / 2 }, (_, i) =>
    coords.slice(i * 2, (i + 1) * 2)
  ) as [number, number][];
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeColor;

  newCoords.forEach(c => ctx.lineTo(c[0], c[1]));
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
};

const callingFn = (
  shape: string,
  coords: number[],
  fillColor: string,
  lineWidth: number,
  strokeColor: string,
  isAreaActive: boolean,
  ctx: CanvasRenderingContext2D | null
): boolean => {
  if (isAreaActive && ctx) {
    if (shape === 'rect') {
      drawRect(coords, fillColor, lineWidth, strokeColor, ctx);
      return true;
    }

    if (shape === 'circle') {
      drawCircle(coords, fillColor, lineWidth, strokeColor, ctx);
      return true;
    }

    if (shape === 'poly') {
      drawPoly(coords, fillColor, lineWidth, strokeColor, ctx);
      return true;
    }

    return false;
  }

  return false;
};

export default callingFn;
